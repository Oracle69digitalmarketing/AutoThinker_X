import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, RefreshCw, Loader2, 
  BrainCircuit, LayoutDashboard, History,
  Sparkles, Trash2, ArrowRight, Zap, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Blueprint } from './types';
import { BlueprintView } from './components/BlueprintView';
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db, auth } from './firebase';
import axios from 'axios';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

type ViewMode = 'dashboard' | 'generate' | 'history' | 'view';

const api = axios.create({
  baseURL: window.location.origin
});

export default function App() {
  const [view, setView] = useState<ViewMode>('generate');
  const [idea, setIdea] = useState('');
  const [branding, setBranding] = useState<'tech-bold' | 'corporate-clean' | 'playful-modern'>('tech-bold');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [agentLogs, setAgentLogs] = useState<{agent: string, thought: string, timestamp: string}[]>([]);
  const [isGeneratingDeck, setIsGeneratingDeck] = useState(false);
  const [isFindingFunding, setIsFindingFunding] = useState(false);
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [history, setHistory] = useState<Blueprint[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const addLog = (agent: string, thought: string) => {
    setAgentLogs(prev => [...prev, { agent, thought, timestamp: new Date().toLocaleTimeString() }]);
  };

  const handlePrint = () => {
    window.print();
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice input is not supported in your browser.");
      return;
    }
    // @ts-ignore
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIdea(prev => prev ? `${prev} ${transcript}` : transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  useEffect(() => {
    if (view === 'dashboard' || view === 'history') {
      fetchHistory();
    }
  }, [view]);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    const path = "blueprints";
    try {
      const q = query(collection(db, path), orderBy("updatedAt", "desc"));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        updatedAt: doc.data().updatedAt instanceof Timestamp ? doc.data().updatedAt.toDate().toISOString() : doc.data().updatedAt
      } as Blueprint));
      setHistory(docs);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    } finally {
      setHistoryLoading(false);
    }
  };

  const filteredHistory = history.filter(bp =>
    bp.name.toLowerCase().includes(search.toLowerCase()) ||
    bp.pitch.toLowerCase().includes(search.toLowerCase())
  );

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    setAgentLogs([]);
    try {
      setLoadingStep('Orchestrating Multi-Agent Chain...');
      addLog('Venture Architect', `Initializing engine for: "${idea}"`);
      
      const response = await api.post('/api/chat', { idea, branding });
      const newBlueprint: Blueprint = response.data;
      
      const finalLogs = [
        { agent: 'Venture Architect', thought: 'Analyzing core strategy...', timestamp: new Date().toLocaleTimeString() },
        { agent: 'Market Intelligence', thought: 'Scanning competitors...', timestamp: new Date().toLocaleTimeString() },
        { agent: 'Growth Marketing', thought: 'Synthesizing funnel...', timestamp: new Date().toLocaleTimeString() },
        { agent: 'Synthesis Engine', thought: 'Blueprint finalized and verified.', timestamp: new Date().toLocaleTimeString() }
      ];

      const blueprintWithLogs: Blueprint = { ...newBlueprint, agent_logs: finalLogs };
      setBlueprint(blueprintWithLogs);
      
      const path = "blueprints";
      try {
        const docRef = await addDoc(collection(db, path), {
          ...blueprintWithLogs,
          updatedAt: Timestamp.now(),
          status: 'complete'
        });
        setBlueprint({ ...blueprintWithLogs, id: docRef.id });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }
      
      setView('view');
    } catch (error: any) {
      console.error("Generation failed:", error);
      alert(error.response?.data?.error || "AI Service Unavailable. Check logs.");
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blueprint?")) return;
    const path = `blueprints/${id}`;
    try {
      await deleteDoc(doc(db, "blueprints", id));
      setHistory(prev => prev.filter(b => b.id !== id));
      if (blueprint?.id === id) setBlueprint(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const handleGeneratePitchDeck = async () => {
    if (!blueprint || !blueprint.id) return;
    setIsGeneratingDeck(true);
    try {
      const response = await api.post('/api/deck', { blueprint });
      const slides = response.data;
      const updatedBlueprint = { ...blueprint, pitch_deck: slides };
      await updateDoc(doc(db, "blueprints", blueprint.id), { pitch_deck: slides });
      setBlueprint(updatedBlueprint);
      setHistory(prev => prev.map(b => b.id === blueprint.id ? updatedBlueprint : b));
    } catch (error) {
      console.error("Deck generation failed:", error);
      alert("Failed to create pitch deck.");
    } finally {
      setIsGeneratingDeck(false);
    }
  };

  const handleFindFunding = async () => {
    if (!blueprint || !blueprint.id) return;
    setIsFindingFunding(true);
    try {
      const response = await api.post('/api/funding', { blueprint });
      const opps = response.data;
      const updatedBlueprint = { ...blueprint, funding_opportunities: opps };
      await updateDoc(doc(db, "blueprints", blueprint.id), { funding_opportunities: opps });
      setBlueprint(updatedBlueprint);
      setHistory(prev => prev.map(b => b.id === blueprint.id ? updatedBlueprint : b));
    } catch (error) {
      console.error("Funding search failed:", error);
      alert("Failed to find funding opportunities.");
    } finally {
      setIsFindingFunding(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-gray-200 overflow-hidden font-sans">
      <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col p-6 space-y-8 print:hidden">
        <div className="flex items-center gap-3 px-2">
          <div className="bg-white/5 p-1 rounded-xl shadow-lg border border-white/10">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain rounded-lg" />
          </div>
          <h1 className="font-bold text-2xl tracking-tighter text-white">AutoThinker X</h1>
        </div>
        <nav className="flex-1 space-y-2">
          <NavItem icon={<Sparkles size={20} />} label="Gen Engine" active={view === 'generate' || view === 'view'} onClick={() => { setView('generate'); setBlueprint(null); }} />
          <NavItem icon={<LayoutDashboard size={20} />} label="Blueprints" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
          <NavItem icon={<History size={20} />} label="Agent Logs" active={view === 'history'} onClick={() => setView('history')} />
        </nav>
        <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 space-y-4">
          <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Agent Network (Groq Powered)</p>
          <div className="space-y-3">
            <StatusItem label="Venture Architect" online={true} />
            <StatusItem label="Market Intelligence" online={true} />
            <StatusItem label="Growth Marketing" online={true} />
            <StatusItem label="Asset Specialist" online={true} />
            <StatusItem label="Synthesis Engine" online={true} />
          </div>
          <div className="pt-2 border-t border-slate-700/50"><p className="text-[10px] text-indigo-400 font-bold">ALL SYSTEMS SYNCED</p></div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {view === 'generate' && (
              <motion.div key="generate" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center justify-center min-h-[80vh] space-y-12">
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2"><Zap size={14} /> Groq Llama 3 Intelligence Live</div>
                  <h2 className="text-6xl font-black text-white tracking-tight leading-none">From Idea to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500">Execution.</span></h2>
                  <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">Enter your vision below. Our multi-agent Groq network will collaborate to architect your business strategy and launch roadmap.</p>
                </div>
                <div className="w-full max-w-3xl relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-20 transition duration-1000"></div>
                  <div className="relative flex flex-col bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-2 shadow-2xl">
                    <textarea placeholder="e.g. A decentralised coffee supply chain tracking tool..." value={idea} onChange={(e) => setIdea(e.target.value)} className="w-full bg-transparent border-none focus:ring-0 p-8 min-h-[200px] text-xl resize-none placeholder:text-gray-700 font-light" />
                    <button onClick={startVoiceInput} className={`absolute top-8 right-8 p-3 rounded-2xl border transition-all ${isListening ? 'bg-red-500/20 border-red-500 text-red-500 shadow-lg shadow-red-500/20' : 'bg-slate-800/50 border-slate-700 text-gray-400 hover:text-white hover:bg-slate-800'}`}><Zap className={isListening ? 'animate-pulse' : ''} size={20} /></button>
                    <div className="flex justify-between items-center px-6 pb-6 pt-2">
                       <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500" /> Groq Accelerated</span>
                            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-500" /> Market Alignment</span>
                          </div>
                          <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700/50 w-fit">
                            <button onClick={() => setBranding('tech-bold')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${branding === 'tech-bold' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}>Tech Bold</button>
                            <button onClick={() => setBranding('corporate-clean')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${branding === 'corporate-clean' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}>Corporate</button>
                            <button onClick={() => setBranding('playful-modern')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${branding === 'playful-modern' ? 'bg-pink-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}>Playful</button>
                          </div>
                       </div>
                      <button onClick={handleGenerate} disabled={loading || !idea.trim()} className="btn btn-primary px-10 py-4 rounded-2xl flex items-center gap-3 text-lg group">{loading ? <><Loader2 className="animate-spin" size={24} /><span className="animate-pulse">{loadingStep || 'Thinking...'}</span></> : <>Generate Sprint<ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" /></>}</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {view === 'view' && blueprint && (
              <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pb-20">
                <div className="flex justify-between items-center mb-12">
                  <button onClick={() => setView('generate')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors py-2"><ArrowRight size={20} className="rotate-180" />Back to Laboratory</button>
                  <div className="flex items-center gap-4"><span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Model: Llama 3 70B (Groq)</span><button onClick={() => handleGenerate()} disabled={loading} className="btn btn-secondary py-2 px-4 text-xs font-bold"><RefreshCw size={14} className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> Re-Think</button></div>
                </div>
                <BlueprintView blueprint={blueprint} onGenerateDeck={handleGeneratePitchDeck} onFindFunding={handleFindFunding} onPrint={handlePrint} isGeneratingDeck={isGeneratingDeck} isFindingFunding={isFindingFunding} />
              </motion.div>
            )}

            {(view === 'dashboard' || view === 'history') && (
              <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div><h2 className="text-4xl font-black text-white tracking-tight">Project Blueprints</h2><p className="text-gray-500 mt-1">Manage and evolve your generated architectures.</p></div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} /><input type="text" placeholder="Search workspace..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm w-full md:w-64 focus:ring-2 focus:ring-indigo-600 outline-none transition-all" /></div>
                    <button onClick={fetchHistory} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-gray-400 hover:text-white transition-colors"><RefreshCw size={20} className={historyLoading ? "animate-spin" : ""} /></button>
                    <button onClick={() => setView('generate')} className="btn btn-primary py-2.5 px-5 rounded-xl text-sm flex items-center gap-2"><Plus size={18} /> New</button>
                  </div>
                </div>
                {historyLoading ? (
                  <div className="flex flex-col justify-center items-center h-96 space-y-4"><Loader2 className="animate-spin text-indigo-500" size={56} /><p className="text-gray-500 animate-pulse font-medium">Retrieving workspace data...</p></div>
                ) : filteredHistory.length === 0 ? (
                  <div className="card-base text-center py-32 bg-slate-900/30 border-dashed border-slate-800"><div className="bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"><BrainCircuit className="text-gray-600" size={32} /></div><h3 className="text-xl font-bold text-gray-300 mb-2">No Blueprints Found</h3><p className="text-gray-500 max-w-sm mx-auto">Start generating to see your plans here.</p></div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredHistory.map((bp) => (
                      <motion.div key={bp.id} layoutId={bp.id} className="card-base bg-slate-900/50 hover:bg-slate-900 hover:border-indigo-500/50 cursor-pointer group relative overflow-hidden" onClick={() => { setBlueprint(bp); setView('view'); }}>
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={(e) => { e.stopPropagation(); handleDelete(bp.id!); }} className="p-1.5 text-gray-600 hover:text-red-500 bg-slate-800/50 rounded-lg backdrop-blur-md"><Trash2 size={16} /></button></div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2"><Sparkles size={16} className="text-indigo-500" /><h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors line-clamp-1">{bp.name}</h3></div>
                          <p className="text-sm text-gray-500 line-clamp-3 min-h-[4.5rem] leading-relaxed">{bp.pitch}</p>
                          <div className="flex justify-between items-center text-[10px] text-gray-600 border-t border-slate-800 mt-6 pt-4"><span><History size={12} /> {new Date(bp.updatedAt!).toLocaleDateString()}</span><span className="font-black uppercase tracking-widest text-indigo-500/80 group-hover:text-indigo-400">Expand Blueprint</span></div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${active ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-600/20' : 'text-gray-500 hover:text-gray-200 hover:bg-slate-800'}`}>{icon}{label}</button>
  );
}

function StatusItem({ label, online }: { label: string, online: boolean }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-400">{label}</span>
      <div className="flex items-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-gray-600'}`}></div>
        <span className={online ? 'text-green-500/80' : 'text-gray-600'}>{online ? 'Online' : 'Offline'}</span>
      </div>
    </div>
  );
}
