import React from 'react';
import { FundingOpportunity } from '../types';
import { motion } from 'motion/react';
import { Award, Code, GraduationCap, Building2, ExternalLink, Info } from 'lucide-react';

interface FundingViewProps {
  opportunities: FundingOpportunity[];
}

export const FundingView: React.FC<FundingViewProps> = ({ opportunities }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'hackathon': return <Code className="text-pink-500" size={20} />;
      case 'cohort': return <GraduationCap className="text-blue-500" size={20} />;
      case 'grant': return <Award className="text-yellow-500" size={20} />;
      case 'vc': return <Building2 className="text-purple-500" size={20} />;
      default: return <Info className="text-gray-400" size={20} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <Award className="text-yellow-500" /> Funding & Cohort Opportunities
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {opportunities.map((opp, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all group"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                {getIcon(opp.type)}
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-gray-400 font-bold uppercase tracking-widest border border-slate-700">
                {opp.type}
              </span>
            </div>
            
            <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors mb-2">
              {opp.name}
            </h4>
            
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {opp.description}
            </p>

            <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 mb-4">
              <div className="text-[10px] text-gray-500 uppercase font-black tracking-tighter mb-1">Why this fits:</div>
              <div className="text-xs text-indigo-300 font-medium italic">
                "{opp.relevance}"
              </div>
            </div>

            {opp.link && (
              <a 
                href={opp.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Learn More <ExternalLink size={14} />
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
