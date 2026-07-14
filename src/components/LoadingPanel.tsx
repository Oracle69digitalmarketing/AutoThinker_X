import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Loader2, CheckCircle2, Circle, 
  BrainCircuit, Sparkles, Cpu, 
  Search, Users, Target, ShieldCheck
} from 'lucide-react';

interface LoadingPanelProps {
  step: string;
}

const agents = [
  { id: 'architect', name: 'Venture Architect', icon: <BrainCircuit size={18} />, color: 'text-indigo-400' },
  { id: 'market', name: 'Market Intelligence', icon: <Search size={18} />, color: 'text-blue-400' },
  { id: 'customer', name: 'Customer Intelligence', icon: <Users size={18} />, color: 'text-purple-400' },
  { id: 'strategy', name: 'Product Strategy', icon: <Target size={18} />, color: 'text-pink-400' },
  { id: 'compliance', name: 'Synthesis Engine', icon: <ShieldCheck size={18} />, color: 'text-green-400' },
];

export const LoadingPanel: React.FC<LoadingPanelProps> = ({ step }) => {
  const [activeAgentIdx, setActiveAgentIdx] = useState(0);
  const [completedAgents, setCompletedAgents] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + Math.random() * 2 : prev));
    }, 100);

    const agentInterval = setInterval(() => {
      setActiveAgentIdx(prev => {
        const next = (prev + 1) % agents.length;
        if (prev < agents.length - 1) {
          setCompletedAgents(old => [...new Set([...old, agents[prev].id])]);
        }
        return next;
      });
    }, 2500);

    return () => {
      clearInterval(interval);
      clearInterval(agentInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-6">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-2xl space-y-12 relative">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            <Cpu size={14} className="text-indigo-500 animate-spin-slow" /> Advanced Swarm Intelligence
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight">
            Architecting Your Vision...
          </h2>
          <p className="text-slate-500 font-medium">
            Our multi-agent consensus network is collaborating to build <br />
            the foundations of your new venture.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {agents.map((agent, idx) => {
            const isCompleted = completedAgents.includes(agent.id);
            const isActive = activeAgentIdx === idx;
            
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-500 ${
                  isActive 
                    ? 'bg-indigo-500/10 border-indigo-500/30 shadow-lg shadow-indigo-500/5' 
                    : isCompleted 
                      ? 'bg-slate-900/50 border-slate-800/50 opacity-60' 
                      : 'bg-slate-900/20 border-slate-800/20 opacity-30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${isActive ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40' : 'bg-slate-800 text-slate-500'}`}>
                    {agent.icon}
                  </div>
                  <div>
                    <h4 className={`text-sm font-black uppercase tracking-wider ${isActive ? 'text-white' : 'text-slate-400'}`}>
                      {agent.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                      {isActive ? 'Synthesizing global market patterns...' : isCompleted ? 'Verification Complete' : 'Waiting in Queue'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isActive && <Loader2 size={18} className="text-indigo-500 animate-spin" />}
                  {isCompleted && <CheckCircle2 size={18} className="text-green-500" />}
                  {!isActive && !isCompleted && <Circle size={18} className="text-slate-800" />}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Processing Status</p>
              <p className="text-sm font-bold text-white uppercase tracking-wider">{step || 'Simulating Neural Consensus'}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Network Load</p>
              <p className="text-sm font-bold text-indigo-400">84.2% Optimization</p>
            </div>
          </div>
          <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
            <motion.div 
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[8px] font-black text-slate-500">
                  A{i}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Consensus Protocol: <span className="text-indigo-400 underline decoration-indigo-500/30">Active</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
