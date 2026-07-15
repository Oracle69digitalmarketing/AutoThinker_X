import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import { Blueprint } from './types';

// New UI Components
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LoadingPanel } from './components/LoadingPanel';
import { BlueprintView } from './components/BlueprintView';
import { ExportCards } from './components/ExportCards';

// Hooks
import { useBlueprint } from './hooks/useBlueprint';
import { useHistory } from './hooks/useHistory';
import { useVoice } from './hooks/useVoice';

type ViewMode = 'dashboard' | 'generate' | 'history' | 'view' | 'exports' | 'settings' | 'help';

export default function App() {
  const [view, setView] = useState<ViewMode>('generate');
  const [idea, setIdea] = useState('');
  const [branding, setBranding] = useState<'tech-bold' | 'corporate-clean' | 'playful-modern'>('tech-bold');
  const [complexity, setComplexity] = useState<'low' | 'medium' | 'high'>('medium');

  const {
    history,
    setHistory,
    historyLoading,
    search,
    setSearch,
    filteredHistory,
    fetchHistory,
    deleteHistory,
    refreshHistory
  } = useHistory();

  const {
    blueprint,
    setBlueprint,
    loading,
    loadingStep,
    isGeneratingDeck,
    isFindingFunding,
    generateBlueprint,
    handleGeneratePitchDeck,
    handleFindFunding
  } = useBlueprint(setHistory);

  const { isListening, startVoiceInput } = useVoice((transcript) => {
    setIdea(prev => prev ? `${prev} ${transcript}` : transcript);
  });

  useEffect(() => {
    if (view === 'dashboard' || view === 'history') {
      fetchHistory();
    }
  }, [view, fetchHistory]);

  const handleGenerate = async () => {
    try {
      const newBlueprint = await generateBlueprint(idea, branding, complexity);
      if (newBlueprint) {
        console.log("Transitioning to 'view' mode");
        setView('view');
      }
    } catch (error) {
      // Error handled in hook
    }
  };

  const getHeaderTitle = () => {
    switch (view) {
      case 'generate': return 'Generation Engine';
      case 'dashboard': return 'Venture Blueprints';
      case 'history': return 'Agent Execution Logs';
      case 'view': return blueprint?.name || 'Blueprint Viewer';
      case 'exports': return 'Project Exports';
      case 'settings': return 'System Settings';
      case 'help': return 'Help & Documentation';
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
          onRefresh={refreshHistory}
          search={search}
          setSearch={setSearch}
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

              {view === 'settings' && (
                <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2rem] p-12 text-center space-y-6">
                  <h2 className="text-4xl font-black text-white">System Settings</h2>
                  <p className="text-slate-400 max-w-xl mx-auto">Configure your Venture OS environment, AI model priorities, and API integrations.</p>
                  <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {['Model Selection', 'API Keys', 'Branding Presets', 'Export Formats'].map(s => (
                      <div key={s} className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 text-left cursor-pointer hover:border-indigo-500/30 transition-all">
                        <p className="font-bold text-white">{s}</p>
                        <p className="text-xs text-slate-500 mt-1">Configure your {s.toLowerCase()} preferences.</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {view === 'help' && (
                <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2rem] p-12 text-center space-y-6">
                  <h2 className="text-4xl font-black text-white">Help & Documentation</h2>
                  <p className="text-slate-400 max-w-xl mx-auto">Everything you need to know about the AutoThinker X platform and Multi-Agent Orchestration.</p>
                  <div className="pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {['Getting Started', 'Agent Workflow', 'Exporting Assets', 'Troubleshooting', 'API Docs', 'Community'].map(h => (
                      <div key={h} className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 text-left hover:border-indigo-500/30 transition-all cursor-pointer">
                        <p className="font-bold text-white">{h}</p>
                        <p className="text-xs text-slate-500 mt-1">Learn more about {h.toLowerCase()}.</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(view === 'dashboard' || view === 'history' || view === 'exports') && (
                 <motion.div 
                   key="history-view"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="space-y-10"
                 >
                    <div className="flex justify-between items-center">
                       <div>
                          <h2 className="text-4xl font-black text-white tracking-tight">
                             {view === 'dashboard' ? 'Active Blueprints' : view === 'history' ? 'Agent Execution History' : 'Project Exports'}
                          </h2>
                          <p className="text-slate-500 mt-1 font-medium">
                             {view === 'dashboard' ? 'Manage your generated venture architectures.' : view === 'history' ? 'Review autonomous agent execution traces.' : 'Download and manage your venture assets.'}
                          </p>
                       </div>
                       <button 
                         onClick={() => setView('generate')}
                         className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
                       >
                         New Architecture
                       </button>
                    </div>

                    {view === 'exports' ? (
                      <ExportCards blueprint={blueprint || history[0]} />
                    ) : historyLoading ? (
                       <div className="flex flex-col items-center justify-center h-96 space-y-4">
                          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Syncing with Database...</p>
                       </div>
                    ) : (
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredHistory.map((bp) => (
                             <div 
                                key={bp.id} 
                                onClick={() => { setBlueprint(bp); setView('view'); }}
                                className="group bg-slate-900/40 border border-slate-800/50 rounded-[2rem] p-8 hover:border-indigo-500/30 transition-all duration-500 cursor-pointer relative overflow-hidden"
                             >
                                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <button 
                                     onClick={async (e) => { 
                                       e.stopPropagation(); 
                                       const deleted = await deleteHistory(bp.id!);
                                       if (deleted && blueprint?.id === bp.id) setBlueprint(null);
                                     }}
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
                 </motion.div>
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
