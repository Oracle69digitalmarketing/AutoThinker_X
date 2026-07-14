import React from 'react';
import { 
  Zap, ArrowRight, Mic, Sparkles, 
  ShieldCheck, Globe, Rocket, Lightbulb
} from 'lucide-react';

interface HeroProps {
  idea: string;
  setIdea: (val: string) => void;
  branding: string;
  setBranding: (val: any) => void;
  complexity: string;
  setComplexity: (val: any) => void;
  onGenerate: () => void;
  loading: boolean;
  loadingStep: string;
  startVoiceInput: () => void;
  isListening: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  idea, setIdea, branding, setBranding,
  complexity, setComplexity, onGenerate,
  loading, loadingStep, startVoiceInput, isListening
}) => {
  const examplePrompts = [
    "A decentralized coffee supply chain tracker",
    "AI-powered medical diagnostic for rural clinics",
    "SaaS for automated carbon credit accounting"
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] py-10">
      <div className="text-center space-y-8 mb-16 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] animate-fade-in">
          <Sparkles size={14} /> Intelligence Engine v2.5 Online
        </div>
        
        <h1 className="text-7xl font-black text-white tracking-tighter leading-[0.9] animate-fade-in">
          Transform Ideas into <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500">
            Investor-Ready Blueprints.
          </span>
        </h1>
        
        <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed animate-fade-in opacity-80">
          The AI Venture Operating System that architectures your entire business strategy, 
          marketing funnel, and launch roadmap in seconds.
        </p>
      </div>

      <div className="w-full max-w-4xl relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
        
        <div className="relative flex flex-col bg-slate-900/80 backdrop-blur-2xl rounded-[2rem] border border-slate-800/50 shadow-2xl overflow-hidden">
          <div className="p-1">
            <textarea
              placeholder="Describe your venture vision in detail..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 p-10 min-h-[220px] text-2xl text-white placeholder:text-slate-700 resize-none font-medium leading-tight"
            />
            
            <button 
              onClick={startVoiceInput}
              className={`absolute top-10 right-10 p-4 rounded-2xl border transition-all ${
                isListening 
                  ? 'bg-red-500/20 border-red-500 text-red-500 shadow-lg shadow-red-500/20 animate-pulse' 
                  : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Mic size={24} />
            </button>
          </div>

          <div className="bg-slate-950/50 border-t border-slate-800/50 p-8 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-wrap gap-6 justify-center md:justify-start">
              <div className="space-y-3">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Venture Aesthetic</p>
                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                  {['tech-bold', 'corporate-clean', 'playful-modern'].map((b) => (
                    <button
                      key={b}
                      onClick={() => setBranding(b)}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        branding === b ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {b.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">Logic Depth</p>
                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                  {['low', 'medium', 'high'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setComplexity(c)}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        complexity === c 
                          ? (c === 'high' ? 'bg-purple-600' : c === 'medium' ? 'bg-indigo-600' : 'bg-slate-700') + ' text-white shadow-lg' 
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={onGenerate}
              disabled={loading || !idea.trim()}
              className="w-full md:w-auto px-12 py-5 bg-white text-slate-950 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-xl shadow-white/10"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-slate-950/20 border-t-slate-950 rounded-full animate-spin"></div>
                  <span>Architeting...</span>
                </>
              ) : (
                <>
                  Generate Venture Blueprint
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-8 animate-fade-in opacity-40 hover:opacity-100 transition-opacity duration-500">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <ShieldCheck size={16} className="text-indigo-500" />
          Multi-Agent Consensus
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <Globe size={16} className="text-indigo-500" />
          Real-time Market Data
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <Rocket size={16} className="text-indigo-500" />
          Ready for Launch
        </div>
      </div>

      <div className="mt-20 w-full max-w-4xl">
        <p className="text-center text-[10px] text-slate-500 font-black uppercase tracking-widest mb-6">Popular Blueprints</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {examplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => setIdea(prompt)}
              className="p-5 bg-slate-900/40 border border-slate-800/50 rounded-2xl text-left hover:border-indigo-500/50 hover:bg-slate-900 transition-all group"
            >
              <Lightbulb size={16} className="text-slate-600 group-hover:text-indigo-400 mb-3 transition-colors" />
              <p className="text-xs text-slate-400 group-hover:text-slate-200 leading-relaxed font-medium">{prompt}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
