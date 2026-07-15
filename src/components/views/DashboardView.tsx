import React from 'react';
import { motion } from 'motion/react';
import { 
  Rocket, FileText, Target, 
  Presentation, Activity, Clock,
  TrendingUp, Award, Zap
} from 'lucide-react';
import { Blueprint } from '../../types';
import { calculateStats } from '../../utils/analytics';
import { Charts } from '../Charts';

interface DashboardViewProps {
  history: Blueprint[];
  setView: (view: any) => void;
  setBlueprint: (bp: Blueprint) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ history, setView, setBlueprint }) => {
  const stats = calculateStats(history);

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">Enterprise Intelligence</h2>
          <p className="text-slate-500 mt-1 font-medium">Real-time analytics for your venture portfolio.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setView('generate')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <Zap size={16} />
            New Venture
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard 
          label="Total Blueprints" 
          value={stats.blueprintsGenerated.toString()} 
          icon={<Rocket className="text-indigo-400" size={20} />} 
          trend="+12% this month"
        />
        <AnalyticsCard 
          label="Assets Generated" 
          value={Math.floor(stats.documentsExported).toString()} 
          icon={<FileText className="text-amber-400" size={20} />} 
          trend="8.2GB total"
        />
        <AnalyticsCard 
          label="Pitch Decks" 
          value={stats.pitchDecksCreated.toString()} 
          icon={<Presentation className="text-purple-400" size={20} />} 
          trend="Investor Ready"
        />
        <AnalyticsCard 
          label="Funding Matches" 
          value={stats.fundingMatches.toString()} 
          icon={<Target className="text-green-400" size={20} />} 
          trend="Active Pursuits"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/50 rounded-[2.5rem] p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-white tracking-tight">Portfolio Growth</h3>
            <select className="bg-slate-800 border-none text-xs font-bold rounded-lg px-3 py-2 text-slate-300">
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <Charts type="line" data={[]} title="Portfolio Trends" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2.5rem] p-8 backdrop-blur-sm">
            <h3 className="text-xl font-black text-white tracking-tight mb-6">Efficiency</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity size={18} className="text-indigo-400" />
                  <span className="text-sm font-bold text-slate-300">Success Rate</span>
                </div>
                <span className="text-sm font-black text-white">{stats.successRate}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-amber-400" />
                  <span className="text-sm font-bold text-slate-300">Avg. Gen Time</span>
                </div>
                <span className="text-sm font-black text-white">{stats.avgGenTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Award size={18} className="text-purple-400" />
                  <span className="text-sm font-bold text-slate-300">Top Branding</span>
                </div>
                <span className="text-sm font-black text-white capitalize">{stats.mostUsedBranding}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 shadow-xl shadow-indigo-600/20 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xl font-black tracking-tight mb-2">Upgrade to Pro</h3>
              <p className="text-indigo-100 text-sm font-medium mb-6 leading-relaxed">Unlock advanced market intelligence and unlimited asset exports.</p>
              <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-black text-sm hover:bg-indigo-50 transition-all">
                View Plans
              </button>
            </div>
            <TrendingUp size={120} className="absolute -bottom-4 -right-4 text-white/10 group-hover:scale-110 transition-transform duration-700" />
          </div>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2.5rem] overflow-hidden">
        <div className="p-8 border-b border-slate-800/50 flex items-center justify-between">
          <h3 className="text-xl font-black text-white tracking-tight">Recent Activity</h3>
          <button onClick={() => setView('dashboard')} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest">View All Blueprints</button>
        </div>
        <div className="divide-y divide-slate-800/50">
          {history.slice(0, 5).map((bp) => (
            <div 
              key={bp.id} 
              onClick={() => { setBlueprint(bp); setView('view'); }}
              className="p-6 flex items-center justify-between hover:bg-slate-800/20 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400">
                  <Rocket size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{bp.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{bp.tagline}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Status</p>
                  <p className="text-[11px] text-green-500 font-black uppercase mt-0.5">Ready</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Modified</p>
                  <p className="text-[11px] text-slate-300 font-bold mt-0.5">{new Date(bp.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AnalyticsCard = ({ label, value, icon, trend }: { label: string, value: string, icon: React.ReactNode, trend: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-slate-900/40 border border-slate-800/50 rounded-[2rem] p-8 backdrop-blur-sm"
  >
    <div className="flex justify-between items-start mb-6">
      <div className="p-4 bg-slate-800/50 rounded-2xl shadow-inner">
        {icon}
      </div>
      <span className="text-[10px] font-black text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded-lg uppercase tracking-widest">{trend}</span>
    </div>
    <div className="space-y-1">
      <h4 className="text-[11px] text-slate-500 font-black uppercase tracking-widest">{label}</h4>
      <p className="text-4xl font-black text-white tracking-tighter">{value}</p>
    </div>
  </motion.div>
);
