import React from 'react';
import { 
  LayoutDashboard, Sparkles, History, 
  Settings, HelpCircle, FileText, 
  Activity, Zap, Shield
} from 'lucide-react';

interface SidebarProps {
  view: string;
  setView: (view: any) => void;
  onlineAgents: string[];
}

export const Sidebar: React.FC<SidebarProps> = ({ view, setView, onlineAgents }) => {
  const menuItems = [
    { id: 'generate', label: 'Gen Engine', icon: <Sparkles size={20} /> },
    { id: 'dashboard', label: 'Blueprints', icon: <LayoutDashboard size={20} /> },
    { id: 'history', label: 'Agent Logs', icon: <History size={20} /> },
    { id: 'exports', label: 'Exports', icon: <FileText size={20} /> },
  ];

  const bottomItems = [
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
    { id: 'help', label: 'Help', icon: <HelpCircle size={20} /> },
  ];

  return (
    <aside className="w-72 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 flex flex-col p-6 space-y-8 z-50 print:hidden">
      <div className="flex items-center gap-3 px-2">
        <div className="bg-indigo-600 p-1.5 rounded-xl shadow-lg shadow-indigo-600/20">
          <img src="/logo.png" alt="AutoThinker X" className="w-8 h-8 object-contain brightness-0 invert" />
        </div>
        <div>
          <h1 className="font-black text-xl tracking-tighter text-white leading-none">AutoThinker X</h1>
          <span className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase">Venture OS</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-4 mb-2">Main Menu</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              view === item.id || (view === 'view' && item.id === 'generate')
                ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-600/20 shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Agent Network</p>
          <div className="flex items-center gap-1">
            <Activity size={10} className="text-green-500 animate-pulse" />
            <span className="text-[8px] text-green-500 font-bold">LIVE</span>
          </div>
        </div>
        <div className="space-y-2.5">
          {['Venture Architect', 'Market Intelligence', 'Customer Intelligence', 'Asset Specialist'].map((agent) => (
            <div key={agent} className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">{agent}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
            </div>
          ))}
        </div>
        <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between">
          <span className="text-[9px] text-indigo-400 font-bold uppercase">All Systems Sync</span>
          <Shield size={12} className="text-indigo-500" />
        </div>
      </div>

      <div className="space-y-1">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all text-sm font-medium"
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 px-4 pt-4 border-t border-slate-800">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-indigo-600/20">
          AX
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-white leading-none">v2.0.4</p>
          <p className="text-[9px] text-slate-500 font-medium mt-1">Enterprise Edition</p>
        </div>
        <Zap size={14} className="text-amber-500 fill-amber-500" />
      </div>
    </aside>
  );
};
