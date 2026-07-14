import React, { useState } from 'react';
import { 
  FileText, Download, Eye, 
  CheckCircle, Clock, Shield,
  Archive, Loader2
} from 'lucide-react';
import { Blueprint } from '../types';
import { ExportService, ExportType } from '../services/export/ExportService';

interface ExportCardsProps {
  blueprint: Blueprint;
}

interface ExportCardProps {
  title: string;
  description: string;
  status: 'ready' | 'generating' | 'locked';
  onExport: () => void;
  onPreview?: () => void;
  type?: string;
  isExporting?: boolean;
}

export const ExportCards: React.FC<ExportCardsProps> = ({ blueprint }) => {
  const [exportingType, setExportingType] = useState<ExportType | null>(null);

  const handleExport = async (type: ExportType) => {
    setExportingType(type);
    try {
      console.log(`Generating ${type}...`);
      await ExportService.generate(type, blueprint);
    } catch (error) {
      console.error(`Export failed for ${type}:`, error);
      alert(`Failed to generate ${type}. Please try again.`);
    } finally {
      setExportingType(null);
    }
  };

  const handlePreview = (title: string) => {
    alert(`Generating interactive preview for ${title}...`);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-slate-900/40 border border-slate-800/50 rounded-[2rem] p-8">
        <div>
          <h3 className="text-xl font-black text-white tracking-tight">Full Asset Bundle</h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Export all venture documentation as a single compressed ZIP file.</p>
        </div>
        <button 
          onClick={() => handleExport('all-assets')}
          disabled={!!exportingType}
          className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {exportingType === 'all-assets' ? <Loader2 className="animate-spin" /> : <Archive size={18} />}
          Download All Assets (.zip)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ExportCard 
          title="Business Plan" 
          description="Comprehensive strategic document covering all aspects of the venture (Word)."
          status="ready"
          isExporting={exportingType === 'business-plan'}
          onExport={() => handleExport("business-plan")}
          onPreview={() => handlePreview("Business Plan")}
        />
        <ExportCard 
          title="Executive Summary" 
          description="High-level brief designed for quick investor review (PDF)."
          status="ready"
          isExporting={exportingType === 'executive-summary'}
          onExport={() => handleExport("executive-summary")}
          onPreview={() => handlePreview("Executive Summary")}
        />
        <ExportCard 
          title="Pitch Deck" 
          description="Investor-ready editable slide deck based on blueprint logic (PowerPoint)."
          status="ready"
          isExporting={exportingType === 'pitch-deck'}
          onExport={() => handleExport("pitch-deck")}
          onPreview={() => handlePreview("Pitch Deck")}
          type="presentation"
        />
        <ExportCard 
          title="Technical Architecture" 
          description="Detailed system design, infrastructure specifications, and AI stack (PDF)."
          status="ready"
          isExporting={exportingType === 'technical-architecture'}
          onExport={() => handleExport("technical-architecture")}
          onPreview={() => handlePreview("Technical Architecture")}
        />
        <ExportCard 
          title="Marketing Playbook" 
          description="GTM strategy, funnel design, and multi-channel messaging guide (PDF)."
          status="ready"
          isExporting={exportingType === 'marketing-playbook'}
          onExport={() => handleExport("marketing-playbook")}
          onPreview={() => handlePreview("Marketing Playbook")}
        />
        <ExportCard 
          title="Financial Model" 
          description="Revenue projections, cost structure, and P&L analysis (Excel)."
          status="ready"
          isExporting={exportingType === 'financial-model'}
          onExport={() => handleExport("financial-model")}
          onPreview={() => handlePreview("Financial Model")}
        />
      </div>
    </div>
  );
};

const ExportCard: React.FC<ExportCardProps> = ({ title, description, status, onExport, onPreview, type, isExporting }) => (
  <div className="group relative bg-slate-900/40 border border-slate-800/50 rounded-[2rem] p-8 hover:border-indigo-500/30 transition-all duration-500 overflow-hidden">
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
          disabled={status !== 'ready' || isExporting}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-slate-950 rounded-xl font-bold text-xs hover:bg-slate-200 transition-colors disabled:opacity-20"
        >
          {isExporting ? <Loader2 className="animate-spin" size={14} /> : <Download size={14} />}
          Export
        </button>
        <button 
          onClick={onPreview}
          disabled={status !== 'ready' || isExporting}
          className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:text-white hover:bg-slate-700 transition-colors disabled:opacity-20"
        >
          <Eye size={16} />
        </button>
      </div>
    </div>
  </div>
);
