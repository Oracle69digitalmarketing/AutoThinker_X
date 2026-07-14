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
  onRefresh?: () => void;
  search: string;
  setSearch: (val: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  subtitle = "AI Venture Operating System",
  provider = "GROQ-LLAMA3-70B",
  latency = "1.2s",
  onRefresh,
  search,
  setSearch
}) => {
  const [showSearch, setShowSearch] = React.useState(false);

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

      <div className="flex-1 max-w-md mx-10">
        {showSearch && (
          <div className="relative animate-in slide-in-from-top-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              autoFocus
              type="text" 
              placeholder="Search blueprints..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onBlur={() => !search && setShowSearch(false)}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
        )}
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
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all ${showSearch ? 'text-indigo-400 border-indigo-500/30' : ''}`}
          >
            <Search size={18} />
          </button>
          <button 
            onClick={onRefresh}
            className="p-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"
          >
            <Zap size={18} />
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
