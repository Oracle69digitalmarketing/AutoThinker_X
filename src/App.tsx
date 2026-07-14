import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, RefreshCw, Loader2, 
  BrainCircuit, LayoutDashboard, History,
  Sparkles, Trash2, ArrowRight, Zap, CheckCircle2,
  Mic, MicOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VentureBlueprint } from './types';
import { BlueprintView } from './components/BlueprintView';
import { collection, query, orderBy, getDocs, addDoc, deleteDoc, doc, Timestamp, limit } from 'firebase/firestore';
import { db } from './firebase';
import axios from 'axios';

type ViewMode = 'dashboard' | 'generate' | 'history' | 'view';

const api = axios.create({
  baseURL: window.location.origin,
  timeout: 300000 
});

export default function App() {
  const [view, setView] = useState<ViewMode>('generate');
  const [idea, setIdea] = useState('');
  const [branding, setBranding] = useState<'tech-bold' | 'corporate-clean' | 'playful-modern'>('tech-bold');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [blueprint, setBlueprint] = useState<VentureBlueprint | null>(null);
  const [deck, setDeck] = useState<any[] | null>(null);
  const [isGeneratingDeck, setIsGeneratingDeck] = useState(false);
  const [history, setHistory] = useState<VentureBlueprint[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (view === 'history') {
      fetchHistory();
    }
  }, [view]);

  const handleGenerateDeck = async () => {
    if (!blueprint) return;
    setIsGeneratingDeck(true);
    try {
      const response = await api.post('/api/deck', { blueprint });
      setDeck(response.data);
    } catch (error) {
      console.error("Deck Generation Error:", error);
      alert("Failed to generate pitch deck. Please retry.");
    } finally {
      setIsGeneratingDeck(false);
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const q = query(collection(db, 'blueprints'), orderBy('createdAt', 'desc'), limit(20));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VentureBlueprint));
      setHistory(docs);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!idea) return;
    setLoading(true);
    setLoadingStep('Initializing Venture OS Multi-Agent Chain...');
    
    try {
      const response = await api.post('/api/chat', { idea, branding });
      const newBlueprint = response.data;
      
      setLoadingStep('Synchronizing with Venture Database...');
      const docRef = await addDoc(collection(db, 'blueprints'), {
        ...newBlueprint,
        idea,
        branding,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        status: 'completed',
        version: '3.0.0'
      });
      
      newBlueprint.id = docRef.id;
      setBlueprint(newBlueprint);
      setView('view');
    } catch (error) {
      console.error("Generation Error:", error);
      alert("System Overload: The AI Agent chain failed to synchronize. Please retry.");
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice input not supported.");
      return;
    }
    // @ts-ignore
    const recognition = new window.webkitSpeechRecognition();
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

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 selection:bg-indigo-500/30">
      {/* Sidebar / Nav */}
      <nav className="fixed left-0 top-0 bottom-0 w-20 bg-black/40 border-r border-white/5 flex flex-col items-center py-8 gap-8 z-50">
        <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20 mb-4">
          <BrainCircuit size={28} className="text-white" />
        </div>
        
        <NavButton active={view === 'generate'} onClick={() => setView('generate')} icon={<Plus />} label="New" />
        <NavButton active={view === 'history'} onClick={() => setView('history')} icon={<History />} label="Vault" />
        
        <div className="mt-auto p-4 opacity-20 hover:opacity-100 transition-opacity">
          <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
        </div>
      </nav>

      <main className="pl-20 min-h-screen relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-8 pt-12 pb-24">
          <AnimatePresence mode="wait">
            {view === 'generate' && (
              <motion.div 
                key="generate"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-3xl mx-auto space-y-12 py-12"
              >
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                    <Sparkles size={12} /> AutoThinker X OS • V3.0
                  </div>
                  <h1 className="text-7xl font-black text-white tracking-tighter">
                    Venture <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Architect.</span>
                  </h1>
                  <p className="text-gray-400 text-lg max-w-xl mx-auto font-medium">
                    Transform raw ideas into investor-ready business blueprints using a parallel multi-agent neural chain.
                  </p>
                </div>

                <div className="card-base p-2 bg-white/5 backdrop-blur-3xl border-white/10 shadow-2xl">
                  <div className="relative">
                    <textarea
                      value={idea}
                      onChange={(e) => setIdea(e.target.value)}
                      placeholder="Describe your startup vision in detail..."
                      className="w-full h-48 bg-transparent p-6 text-xl text-white placeholder:text-gray-600 resize-none outline-none font-medium"
                    />
                    <div className="absolute bottom-4 right-4 flex items-center gap-2">
                      <button 
                        onClick={startVoiceInput}
                        className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                      >
                        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                      </button>
                      <button 
                        onClick={handleGenerate}
                        disabled={loading || !idea}
                        className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/20"
                      >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                        {loading ? 'Orchestrating...' : 'Build Venture'}
                      </button>
                    </div>
                  </div>
                </div>

                {loading && (
                  <div className="space-y-4 text-center">
                    <div className="flex justify-center gap-2">
                      {[1,2,3].map(i => <div key={i} className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce" style={{animationDelay: `${i*0.2}s`}}></div>)}
                    </div>
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest animate-pulse">{loadingStep}</p>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                  <BrandingOption active={branding === 'tech-bold'} onClick={() => setBranding('tech-bold')} label="Tech Bold" desc="Futuristic & High Energy" />
                  <BrandingOption active={branding === 'corporate-clean'} onClick={() => setBranding('corporate-clean')} label="Corporate" desc="Clean & Trust-Focused" />
                  <BrandingOption active={branding === 'playful-modern'} onClick={() => setBranding('playful-modern')} label="Playful" desc="Modern & Accessible" />
                </div>
              </motion.div>
            )}

            {view === 'history' && (
              <motion.div 
                key="history"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-4xl font-black text-white tracking-tight">Venture Vault</h2>
                    <p className="text-gray-500 font-medium">Your historical business blueprints and assets.</p>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search blueprints..."
                      className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {historyLoading ? (
                    [1,2,3,4,5,6].map(i => <div key={i} className="h-48 card-base animate-pulse"></div>)
                  ) : (
                    history.filter(b => b.venture.name.toLowerCase().includes(searchQuery.toLowerCase())).map((b) => (
                      <div 
                        key={b.id} 
                        onClick={() => { setBlueprint(b); setView('view'); }}
                        className="card-base group cursor-pointer hover:border-indigo-500/50 transition-all p-6 relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                          <BrainCircuit size={80} />
                        </div>
                        <div className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-2">Venture OS Blueprint</div>
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{b.venture.name}</h3>
                        <p className="text-gray-500 text-xs line-clamp-2 mb-4 italic">"{b.venture.tagline}"</p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                          <span className="text-[10px] text-gray-600 font-bold">{new Date(b.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                          <ArrowRight size={16} className="text-gray-600 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {view === 'view' && blueprint && (
              <motion.div 
                key="view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="mb-8">
                  <button onClick={() => setView('history')} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                    <ArrowRight size={16} className="rotate-180" /> Back to Vault
                  </button>
                </div>
                <BlueprintView 
                  blueprint={blueprint} 
                  deck={deck}
                  isGeneratingDeck={isGeneratingDeck}
                  onPrint={() => window.print()}
                  onGenerateDeck={handleGenerateDeck}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`group relative flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${active ? 'bg-indigo-500/10 text-indigo-400' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
    >
      {React.cloneElement(icon, { size: 24 })}
      <span className="text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-4">{label}</span>
    </button>
  );
}

function BrandingOption({ active, onClick, label, desc }: any) {
  return (
    <button 
      onClick={onClick}
      className={`text-left p-4 rounded-2xl border transition-all ${active ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
    >
      <div className={`text-xs font-black uppercase tracking-widest mb-1 ${active ? 'text-indigo-400' : 'text-gray-500'}`}>{label}</div>
      <div className="text-[10px] text-gray-600 font-medium">{desc}</div>
    </button>
  );
}
