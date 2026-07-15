import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search } from 'lucide-react';

import { Blueprint } from './types';

// New UI Components
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LoadingPanel } from './components/LoadingPanel';
import { BlueprintView } from './components/BlueprintView';
import { ExportCards } from './components/ExportCards';
import { SettingsView } from './components/views/SettingsView';
import { HelpView } from './components/views/HelpView';

// Hooks
import { useBlueprint } from './hooks/useBlueprint';
import { useHistory } from './hooks/useHistory';
import { useVoice } from './hooks/useVoice';
import { useTheme } from './hooks/useTheme';
import { useSettings } from './hooks/useSettings';

// UI Components
import { ToastContainer, Toast, ToastType } from './components/ui/Toast';
import { Modal } from './components/ui/Modal';

type ViewMode = 'dashboard' | 'generate' | 'history' | 'view' | 'exports' | 'settings' | 'help';

export default function App() {
  const [view, setView] = useState<ViewMode>('generate');
  const [idea, setIdea] = useState('');
  const [branding, setBranding] = useState<'tech-bold' | 'corporate-clean' | 'playful-modern'>('tech-bold');
  const [complexity, setComplexity] = useState<'low' | 'medium' | 'high'>('medium');

  const { theme, toggleTheme } = useTheme();
  const { settings, updateSettings } = useSettings();

  // Toast State
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = (type: ToastType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    return id;
  };
  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  // Modal State
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    description?: string;
    confirmLabel?: string;
    onConfirm?: () => void;
    variant?: 'danger' | 'info';
  }>({ isOpen: false, title: '' });

  const confirmAction = (config: {
    title: string;
    description?: string;
    confirmLabel?: string;
    onConfirm: () => void;
    variant?: 'danger' | 'info';
  }) => {
    setModal({ ...config, isOpen: true });
  };

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
  }, addToast);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Trigger search focus via Header if possible, or just toggle showSearch in Header
        // For simplicity, we can dispatch a custom event or use a ref
        window.dispatchEvent(new CustomEvent('toggle-search'));
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'g') {
        e.preventDefault();
        setView('generate');
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
        e.preventDefault();
        refreshHistory();
        addToast('success', 'Sync complete');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [refreshHistory]);

  useEffect(() => {
    if (view === 'dashboard' || view === 'history') {
      fetchHistory();
    }
  }, [view, fetchHistory]);

  const handleGenerate = async () => {
    try {
      const newBlueprint = await generateBlueprint(idea, branding, complexity);
      if (newBlueprint) {
        addToast('success', 'Blueprint generated successfully');
        console.log("Transitioning to 'view' mode");
        setView('view');
      }
    } catch (error) {
      addToast('error', 'Generation failed');
    }
  };

  const handleExportPDF = async (type: any) => {
    if (!blueprint) return;
    const toastId = addToast('loading', `Preparing ${type}...`);
    try {
      // @ts-ignore
      await import('./services/export/ExportService').then(m => m.ExportService.generate(type, blueprint));
      addToast('success', 'PDF exported successfully');
    } catch (err) {
      addToast('error', 'Export failed');
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
          onRefresh={() => {
            refreshHistory();
            addToast('success', 'Sync complete');
          }}
          search={search}
          setSearch={setSearch}
          theme={theme}
          toggleTheme={toggleTheme}
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
                  onExportPDF={handleExportPDF}
                  isGeneratingDeck={isGeneratingDeck} 
                  isFindingFunding={isFindingFunding} 
                  addToast={addToast}
                />
              )}

              {view === 'settings' && (
                <SettingsView 
                  settings={settings}
                  updateSettings={updateSettings}
                  addToast={addToast}
                />
              )}

              {view === 'help' && (
                <HelpView />
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
                      <ExportCards blueprint={blueprint || history[0]} addToast={addToast} />
                    ) : historyLoading ? (
                       <div className="flex flex-col items-center justify-center h-96 space-y-4">
                          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Syncing with Database...</p>
                       </div>
                    ) : filteredHistory.length === 0 ? (
                       <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
                          <div className="w-24 h-24 bg-slate-900 border border-slate-800 rounded-[2rem] flex items-center justify-center text-slate-700">
                             {search ? <Search size={40} /> : <Brain size={40} />}
                          </div>
                          <div className="space-y-2">
                             <h3 className="text-2xl font-black text-white tracking-tight">
                                {search ? 'No matches found' : 'No blueprints yet'}
                             </h3>
                             <p className="text-slate-500 max-w-xs mx-auto font-medium">
                                {search ? `We couldn't find any venture data matching "${search}"` : 'Start your first autonomous generation to see blueprints here.'}
                             </p>
                          </div>
                          {!search && (
                             <button 
                               onClick={() => setView('generate')}
                               className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
                             >
                               Generate First Blueprint
                             </button>
                          )}
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
                                       confirmAction({
                                         title: 'Delete Blueprint',
                                         description: 'Are you sure you want to permanently delete this venture architecture? This action cannot be undone.',
                                         confirmLabel: 'Delete',
                                         variant: 'danger',
                                         onConfirm: async () => {
                                           const deleted = await deleteHistory(bp.id!);
                                           if (deleted) {
                                             if (blueprint?.id === bp.id) setBlueprint(null);
                                             addToast('success', 'Blueprint deleted successfully');
                                           } else {
                                             addToast('error', 'Failed to delete blueprint');
                                           }
                                           setModal(prev => ({ ...prev, isOpen: false }));
                                         }
                                       });
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

      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
        title={modal.title}
        description={modal.description}
        confirmLabel={modal.confirmLabel}
        onConfirm={modal.onConfirm}
        variant={modal.variant}
      />
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
