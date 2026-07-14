import React from 'react';
import { 
  Bell, Search, Globe, Moon, 
  Cpu, Zap, ChevronRight 
} from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  provider?: string;
  latency?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  subtitle = "AI Venture Operating System",
  provider = "GROQ-LLAMA3-70B",
  latency = "1.2s"
}) => {
  return (
    <header className="h-20 bg-slate-950/40 backdrop-blur-md border-b border-slate-800/50 flex items-center justify-between px-10 sticky top-0 z-40 print:hidden">
      <div className="flex items-center gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white tracking-tight">{title}</h2>
            <ChevronRight size={14} className="text-slate-600" />
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
              Live Production
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-1.5 border-r border-slate-800 pr-3">
            <Cpu size={14} className="text-indigo-400" />
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{provider}</span>
          </div>
          <div className="flex items-center gap-1.5 pl-1">
            <Zap size={14} className="text-amber-500" />
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{latency}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
            <Search size={18} />
          </button>
          <button className="p-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-900"></span>
          </button>
          <div className="w-px h-6 bg-slate-800 mx-1"></div>
          <button className="p-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
            <Globe size={18} />
          </button>
          <button className="p-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
            <Moon size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
