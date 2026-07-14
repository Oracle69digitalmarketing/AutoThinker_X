import React from 'react';
import { 
  FileText, Download, Eye, 
  CheckCircle, Clock, Shield 
} from 'lucide-react';

interface ExportCardProps {
  title: string;
  description: string;
  status: 'ready' | 'generating' | 'locked';
  onExport: () => void;
  onPreview?: () => void;
  type?: string;
}

export const ExportCards: React.FC = () => {
  const handleExport = (title: string) => {
    console.log(`Exporting ${title}...`);
    window.print();
  };

  const handlePreview = (title: string) => {
    console.log(`Previewing ${title}...`);
    alert(`Previewing ${title}. Use 'Share' or 'PDF Export' for the full document.`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ExportCard 
        title="Business Plan" 
        description="Comprehensive 20-page strategic document covering all aspects of the venture."
        status="ready"
        onExport={() => handleExport("Business Plan")}
        onPreview={() => handlePreview("Business Plan")}
      />
      <ExportCard 
        title="Executive Summary" 
        description="High-level 2-page brief designed for quick investor review."
        status="ready"
        onExport={() => handleExport("Executive Summary")}
        onPreview={() => handlePreview("Executive Summary")}
      />
      <ExportCard 
        title="Pitch Deck" 
        description="Investor-ready slide deck (12 slides) based on the blueprint logic."
        status="ready"
        onExport={() => handleExport("Pitch Deck")}
        onPreview={() => handlePreview("Pitch Deck")}
        type="presentation"
      />
      <ExportCard 
        title="Technical Architecture" 
        description="Detailed system design, infrastructure specifications, and AI stack."
        status="ready"
        onExport={() => handleExport("Technical Architecture")}
        onPreview={() => handlePreview("Technical Architecture")}
      />
      <ExportCard 
        title="Marketing Playbook" 
        description="GTM strategy, funnel design, and multi-channel messaging guide."
        status="ready"
        onExport={() => handleExport("Marketing Playbook")}
        onPreview={() => handlePreview("Marketing Playbook")}
      />
      <ExportCard 
        title="Financial Model" 
        description="5-year projections, unit economics, and burn rate analysis."
        status="ready"
        onExport={() => handleExport("Financial Model")}
        onPreview={() => handlePreview("Financial Model")}
      />
    </div>
  );
};

const ExportCard: React.FC<ExportCardProps> = ({ title, description, status, onExport, onPreview, type }) => (
  <div className="group relative bg-slate-900/40 border border-slate-800/50 rounded-[2rem] p-8 hover:border-indigo-500/30 transition-all duration-500 overflow-hidden">
    {/* Background Glow */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl group-hover:bg-indigo-600/10 transition-colors"></div>
    
    <div className="relative space-y-6">
      <div className="flex justify-between items-start">
        <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-colors">
          <FileText size={24} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/50 rounded-full border border-slate-700/50">
          {status === 'ready' ? (
            <>
              <CheckCircle size={10} className="text-green-500" />
              <span className="text-[8px] text-green-500 font-black uppercase tracking-widest">Available</span>
            </>
          ) : status === 'generating' ? (
            <>
              <Clock size={10} className="text-amber-500 animate-spin" />
              <span className="text-[8px] text-amber-500 font-black uppercase tracking-widest">Building</span>
            </>
          ) : (
            <>
              <Shield size={10} className="text-slate-600" />
              <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest">Premium</span>
            </>
          )}
        </div>
      </div>

      <div>
        <h4 className="text-xl font-black text-white tracking-tight mb-2">{title}</h4>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">{description}</p>
      </div>

      <div className="flex items-center gap-2 pt-4">
        <button 
          onClick={onExport}
          disabled={status !== 'ready'}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-slate-950 rounded-xl font-bold text-xs hover:bg-slate-200 transition-colors disabled:opacity-20"
        >
          <Download size={14} />
          Export
        </button>
        <button 
          onClick={onPreview}
          disabled={status !== 'ready'}
          className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:text-white hover:bg-slate-700 transition-colors disabled:opacity-20"
        >
          <Eye size={16} />
        </button>
      </div>
    </div>
  </div>
);
