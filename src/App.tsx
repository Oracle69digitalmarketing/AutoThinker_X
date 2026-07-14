import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';

import { Blueprint } from './types';
import { db, auth } from './firebase';

// New UI Components
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LoadingPanel } from './components/LoadingPanel';
import { BlueprintView } from './components/BlueprintView';

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
  console.error('Firestore Error Details: ', JSON.stringify(errInfo));
}

type ViewMode = 'dashboard' | 'generate' | 'history' | 'view' | 'exports';

const api = axios.create({
  baseURL: window.location.origin,
  timeout: 300000 
});

export default function App() {
  const [view, setView] = useState<ViewMode>('generate');
  const [idea, setIdea] = useState('');
  const [branding, setBranding] = useState<'tech-bold' | 'corporate-clean' | 'playful-modern'>('tech-bold');
  const [complexity, setComplexity] = useState<'low' | 'medium' | 'high'>('medium');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [isGeneratingDeck, setIsGeneratingDeck] = useState(false);
  const [isFindingFunding, setIsFindingFunding] = useState(false);
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [history, setHistory] = useState<Blueprint[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

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

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    
    try {
      setLoadingStep(`Orchestrating ${complexity.toUpperCase()} Complexity Chain...`);
      const response = await api.post('/api/chat', { idea, branding, complexity });
      const newBlueprint: Blueprint = response.data;
      setBlueprint(newBlueprint);
      
      const path = "blueprints";
      try {
        const optimizedStorage = {
          name: newBlueprint.name,
          timestamp: Timestamp.now(),
          summary: newBlueprint.pitch,
          branding: newBlueprint.branding,
          blueprint: newBlueprint,
          updatedAt: Timestamp.now(),
          status: 'complete'
        };
        const docRef = await addDoc(collection(db, path), optimizedStorage);
        setBlueprint({ ...newBlueprint, id: docRef.id });
      } catch (firestoreError) {
        handleFirestoreError(firestoreError, OperationType.CREATE, path);
      }
      setView('view');
    } catch (error: any) {
      alert(error.response?.data?.error || error.message || "AI Service Unavailable.");
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
      alert("Failed to find funding opportunities.");
    } finally {
      setIsFindingFunding(false);
    }
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice input is not supported.");
      return;
    }
    // @ts-ignore
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
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

  const getHeaderTitle = () => {
    switch (view) {
      case 'generate': return 'Generation Engine';
      case 'dashboard': return 'Venture Blueprints';
      case 'history': return 'Agent Execution Logs';
      case 'view': return blueprint?.name || 'Blueprint Viewer';
      case 'exports': return 'Project Exports';
      default: return 'AutoThinker X';
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-indigo-500/30">
      <Sidebar view={view} setView={setView} onlineAgents={[]} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Header 
          title={getHeaderTitle()} 
          subtitle={view === 'view' ? blueprint?.tagline : undefined}
        />

        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <AnimatePresence mode="wait">
            {loading && <LoadingPanel step={loadingStep} />}
            
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-10 max-w-[1600px] mx-auto w-full"
            >
              {view === 'generate' && (
                <Hero 
                  idea={idea} 
                  setIdea={setIdea}
                  branding={branding}
                  setBranding={setBranding}
                  complexity={complexity}
                  setComplexity={setComplexity}
                  onGenerate={handleGenerate}
                  loading={loading}
                  loadingStep={loadingStep}
                  startVoiceInput={startVoiceInput}
                  isListening={isListening}
                />
              )}

              {view === 'view' && blueprint && (
                <BlueprintView 
                  blueprint={blueprint} 
                  onGenerateDeck={handleGeneratePitchDeck} 
                  onFindFunding={handleFindFunding} 
                  onPrint={() => window.print()} 
                  isGeneratingDeck={isGeneratingDeck} 
                  isFindingFunding={isFindingFunding} 
                />
              )}

              {(view === 'dashboard' || view === 'history') && (
                 <div className="space-y-10">
                    <div className="flex justify-between items-center">
                       <div>
                          <h2 className="text-4xl font-black text-white tracking-tight">
                             {view === 'dashboard' ? 'Active Blueprints' : 'Agent Network History'}
                          </h2>
                          <p className="text-slate-500 mt-1 font-medium">
                             {view === 'dashboard' ? 'Manage your generated venture architectures.' : 'Review autonomous agent execution traces.'}
                          </p>
                       </div>
                       <button 
                         onClick={() => setView('generate')}
                         className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
                       >
                         New Architecture
                       </button>
                    </div>

                    {historyLoading ? (
                       <div className="flex flex-col items-center justify-center h-96 space-y-4">
                          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Syncing with Database...</p>
                       </div>
                    ) : (
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {history.map((bp) => (
                             <div 
                                key={bp.id} 
                                onClick={() => { setBlueprint(bp); setView('view'); }}
                                className="group bg-slate-900/40 border border-slate-800/50 rounded-[2rem] p-8 hover:border-indigo-500/30 transition-all duration-500 cursor-pointer relative overflow-hidden"
                             >
                                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <button 
                                     onClick={(e) => { e.stopPropagation(); handleDelete(bp.id!); }}
                                     className="p-2 bg-slate-800 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                   >
                                      Delete
                                   </button>
                                </div>
                                <div className="space-y-6">
                                   <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                         <Brain size={20} />
                                      </div>
                                      <h3 className="text-xl font-black text-white tracking-tight group-hover:text-indigo-400 transition-colors line-clamp-1">{bp.name}</h3>
                                   </div>
                                   <p className="text-sm text-slate-500 font-medium line-clamp-3 leading-relaxed min-h-[4.5rem]">{bp.pitch}</p>
                                   <div className="pt-6 border-t border-slate-800/50 flex items-center justify-between">
                                      <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                                         {new Date(bp.updatedAt!).toLocaleDateString()}
                                      </span>
                                      <span className="text-[10px] text-indigo-500 font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                         Open Systems →
                                      </span>
                                   </div>
                                </div>
                             </div>
                          ))}
                       </div>
                    )}
                 </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function Brain({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54Z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54Z"/>
    </svg>
  );
}
