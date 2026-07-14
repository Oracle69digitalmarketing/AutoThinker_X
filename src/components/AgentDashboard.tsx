import React from 'react';
import { AgentLog } from '../types';
import { 
  Zap, Clock, ShieldCheck, 
  Cpu, BarChart3, Database 
} from 'lucide-react';

interface AgentDashboardProps {
  logs: AgentLog[];
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({ logs }) => {
  const totalDuration = logs.reduce((acc, log) => {
    const duration = parseFloat(log.duration.replace('s', ''));
    return acc + (isNaN(duration) ? 0 : duration);
  }, 0).toFixed(2);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Neural Latency" 
          value={`${totalDuration}s`} 
          icon={<Clock className="text-amber-500" size={20} />} 
          trend="Optimized"
        />
        <StatCard 
          label="Consensus Depth" 
          value="98.4%" 
          icon={<ShieldCheck className="text-indigo-500" size={20} />} 
          trend="+1.2%"
        />
        <StatCard 
          label="Token Throughput" 
          value="42k" 
          icon={<Database className="text-purple-500" size={20} />} 
          trend="Buffered"
        />
        <StatCard 
          label="Model Confidence" 
          value="0.92" 
          icon={<BarChart3 className="text-green-500" size={20} />} 
          trend="Stable"
        />
      </div>

      <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2rem] overflow-hidden backdrop-blur-sm">
        <div className="p-8 border-b border-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400">
              <Cpu size={20} />
            </div>
            <h3 className="text-xl font-black text-white tracking-tight">Agent Swarm Execution</h3>
          </div>
          <div className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
            All Systems Nominal
          </div>
        </div>

        <div className="p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/30">
                <th className="px-8 py-4 text-[10px] text-slate-500 font-black uppercase tracking-widest">Agent Node</th>
                <th className="px-8 py-4 text-[10px] text-slate-500 font-black uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] text-slate-500 font-black uppercase tracking-widest">Latency</th>
                <th className="px-8 py-4 text-[10px] text-slate-500 font-black uppercase tracking-widest">Task Integrity</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, idx) => (
                <tr key={idx} className="border-t border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]"></div>
                      <span className="text-sm font-bold text-white">{log.agent}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] px-2.5 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg font-black uppercase">
                      {log.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm font-mono text-slate-400">
                    {log.duration}
                  </td>
                  <td className="px-8 py-5">
                    <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500" 
                        style={{ width: `${85 + Math.random() * 15}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, trend }: { label: string, value: string, icon: React.ReactNode, trend: string }) => (
  <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-6 backdrop-blur-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-800/50 rounded-2xl">
        {icon}
      </div>
      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{trend}</span>
    </div>
    <div className="space-y-1">
      <h4 className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{label}</h4>
      <p className="text-2xl font-black text-white">{value}</p>
    </div>
  </div>
);
