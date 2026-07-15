import React from 'react';
import { 
  BookOpen, Sparkles, Cpu, FileText, 
  Landmark, Keyboard, HelpCircle,
  MessageSquare, ChevronRight
} from 'lucide-react';

export const HelpView: React.FC = () => {
  const sections = [
    {
      title: 'Getting Started',
      icon: <BookOpen className="text-indigo-400" />,
      content: 'AutoThinker X is an autonomous Multi-Agent Venture Operating System. Simply enter your startup idea, choose a branding style and complexity level, and our agents will orchestrate a full venture blueprint for you.'
    },
    {
      title: 'Blueprint Generation',
      icon: <Sparkles className="text-amber-500" />,
      content: 'The generation process uses a chain of specialized agents: Venture Architect, Customer Intelligence, Market Intelligence, and more. Each agent performs deep research and synthesis to build investor-ready models.'
    },
    {
      title: 'AI Agent Swarm',
      icon: <Cpu className="text-pink-500" />,
      content: 'Our swarm architecture allows agents to work in parallel and peer-review each other. You can monitor their execution traces in the "Agent Logs" tab of any blueprint.'
    },
    {
      title: 'Exporting Assets',
      icon: <FileText className="text-blue-400" />,
      content: 'Once a blueprint is generated, you can export specialized documents like Business Plans (Word), Executive Summaries (PDF), and Financial Models (Excel). Use the "Exports" view for a full asset bundle.'
    },
    {
      title: 'Funding Discovery',
      icon: <Landmark className="text-green-500" />,
      content: 'The "Funding" tab uses AI to match your venture with real-world VCs, Grants, and Accelerators based on your market niche and stage.'
    },
    {
      title: 'Keyboard Shortcuts',
      icon: <Keyboard className="text-slate-400" />,
      shortcuts: [
        { key: '⌘ + K', action: 'Global Search' },
        { key: '⌘ + G', action: 'Generate New' },
        { key: '⌘ + R', action: 'Refresh Data' },
        { key: 'Esc', action: 'Close Modal' },
      ]
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h2 className="text-5xl font-black text-white tracking-tight">How can we help?</h2>
        <p className="text-lg text-slate-500 font-medium">Explore documentation, learn about agent workflows, and master the Venture OS.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sections.map((s, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800/50 rounded-[2rem] p-10 space-y-6 hover:border-indigo-500/30 transition-all group">
            <div className="w-14 h-14 bg-slate-800/50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              {s.icon}
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">{s.title}</h3>
            {s.content && <p className="text-sm text-slate-500 leading-relaxed font-medium">{s.content}</p>}
            {s.shortcuts && (
              <div className="space-y-3">
                {s.shortcuts.map((sk, j) => (
                  <div key={j} className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold">{sk.action}</span>
                    <kbd className="px-2 py-1 bg-slate-950 border border-slate-800 rounded font-mono text-indigo-400">{sk.key}</kbd>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-[3rem] p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-3xl font-black text-white tracking-tight">Need Enterprise Support?</h3>
          <p className="text-slate-400 font-medium">Our engineers and venture architects are available for custom deployments and strategy.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all flex items-center gap-2">
            <MessageSquare size={18} /> Live Chat
          </button>
          <button className="px-8 py-4 bg-slate-800 text-white rounded-2xl font-black text-sm hover:bg-slate-700 transition-all border border-slate-700">
            Contact Us
          </button>
        </div>
      </div>

      <div className="pt-12 border-t border-slate-800/50">
        <div className="flex flex-wrap justify-center gap-12">
          {['FAQ', 'API Reference', 'Status Page', 'Terms of Service', 'Privacy Policy'].map(link => (
            <a key={link} href="#" className="text-xs text-slate-600 font-bold uppercase tracking-widest hover:text-indigo-400 transition-colors flex items-center gap-1">
              {link} <ChevronRight size={12} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
