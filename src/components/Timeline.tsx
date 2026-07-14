import React from 'react';
import { RoadmapPhase } from '../types';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface TimelineProps {
  phases: RoadmapPhase[];
}

export const Timeline: React.FC<TimelineProps> = ({ phases }) => {
  return (
    <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
      {phases.map((phase, idx) => (
        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
          {/* Dot */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-800 bg-slate-950 text-indigo-500 shadow-xl shadow-indigo-500/10 z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
            <Clock size={18} />
          </div>

          {/* Content */}
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-3xl bg-slate-900/40 border border-slate-800/50 backdrop-blur-sm hover:border-indigo-500/30 transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-black text-white tracking-tight">{phase.phase}</h4>
              <span className="text-[10px] px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full font-bold uppercase tracking-widest">
                Phase {idx + 1}
              </span>
            </div>
            
            <ul className="space-y-3">
              {phase.tasks.map((task, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-400 leading-relaxed">
                  <CheckCircle2 size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                  <span>{task}</span>
                </li>
              ))}
            </ul>

            {phase.milestones && phase.milestones.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-800/50">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-3">Key Milestones</p>
                <div className="flex flex-wrap gap-2">
                  {phase.milestones.map((m, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-800/50 rounded-lg text-[10px] text-slate-300 border border-slate-700/50">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
