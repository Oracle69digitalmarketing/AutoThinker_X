import React from 'react';
import { 
  Bell, Search, Globe, Moon, 
  Cpu, Zap, ChevronRight, X 
} from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  provider?: string;
  latency?: string;
  onRefresh?: () => void;
  search: string;
  setSearch: (val: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  subtitle = "AI Venture Operating System",
  provider = "GROQ-LLAMA3-70B",
  latency = "1.2s",
  onRefresh,
  search,
  setSearch,
  theme,
  toggleTheme
}) => {
  const [showSearch, setShowSearch] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handleToggleSearch = () => {
      setShowSearch(true);
      setTimeout(() => inputRef.current?.focus(), 50);
    };
    window.addEventListener('toggle-search', handleToggleSearch);
    return () => window.removeEventListener('toggle-search', handleToggleSearch);
  }, []);

  return (
    <header 
      className="h-20 bg-slate-950/40 backdrop-blur-md border-b border-slate-800/50 flex items-center justify-between px-10 sticky top-0 z-40 print:hidden"
      role="banner"
    >
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
              ref={inputRef}
              autoFocus
              type="text" 
              placeholder="Search blueprints..." 
              value={search}
              aria-label="Search through venture blueprints"
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && setShowSearch(false)}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2 pl-10 pr-10 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-xl" aria-label="System Performance">
          <div className="flex items-center gap-1.5 border-r border-slate-800 pr-3">
            <Cpu size={14} className="text-indigo-400" />
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{provider}</span>
          </div>
          <div className="flex items-center gap-1.5 pl-1">
            <Zap size={14} className="text-amber-500" />
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{latency}</span>
          </div>
        </div>

        <div className="flex items-center gap-2" role="toolbar" aria-label="Header Actions">
          <button 
            onClick={() => setShowSearch(!showSearch)}
            aria-label="Toggle search bar"
            className={`p-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all ${showSearch ? 'text-indigo-400 border-indigo-500/30' : ''}`}
          >
            <Search size={18} />
          </button>
          <button 
            onClick={() => {
              if (onRefresh) onRefresh();
            }}
            title="Refresh Data"
            aria-label="Refresh application data"
            className="p-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"
          >
            <Zap size={18} />
          </button>
          <div className="w-px h-6 bg-slate-800 mx-1"></div>
          <button 
            title="Language: English"
            aria-label="Change language"
            className="p-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"
          >
            <Globe size={18} />
          </button>
          <button 
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="p-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"
          >
            {theme === 'dark' ? <Moon size={18} /> : <Zap size={18} className="rotate-180" />}
          </button>
        </div>
      </div>
    </header>
  );
};
