import React, { useState } from 'react';
import { 
  FileText, Download, Eye, 
  CheckCircle, Clock, Shield,
  Archive, Loader2
} from 'lucide-react';
import { Blueprint } from '../types';
import { ExportService, ExportType } from '../services/export/ExportService';
import { Modal } from './ui/Modal';

interface ExportCardsProps {
  blueprint: Blueprint;
  addToast: (type: any, message: string) => void;
}

interface ExportCardProps {
  title: string;
  description: string;
  status: 'ready' | 'generating' | 'locked';
  onExport: () => void;
  onPreview?: () => void;
  type: ExportType;
  isExporting?: boolean;
}

export const ExportCards: React.FC<ExportCardsProps> = ({ blueprint, addToast }) => {
  const [exportingType, setExportingType] = useState<ExportType | null>(null);
  const [previewData, setPreviewData] = useState<{ title: string; type: ExportType } | null>(null);

  const handleExport = async (type: ExportType) => {
    setExportingType(type);
    const toastId = addToast('loading', `Generating ${type}...`);
    try {
      await ExportService.generate(type, blueprint);
      addToast('success', `${type} downloaded successfully`);
    } catch (error) {
      addToast('error', `Failed to generate ${type}`);
    } finally {
      setExportingType(null);
    }
  };

  const handlePreview = (title: string, type: ExportType) => {
    setPreviewData({ title, type });
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
          type="business-plan"
          isExporting={exportingType === 'business-plan'}
          onExport={() => handleExport("business-plan")}
          onPreview={() => handlePreview("Business Plan", "business-plan")}
        />
        <ExportCard 
          title="Executive Summary" 
          description="High-level brief designed for quick investor review (PDF)."
          status="ready"
          type="executive-summary"
          isExporting={exportingType === 'executive-summary'}
          onExport={() => handleExport("executive-summary")}
          onPreview={() => handlePreview("Executive Summary", "executive-summary")}
        />
        <ExportCard 
          title="Pitch Deck" 
          description="Investor-ready editable slide deck based on blueprint logic (PowerPoint)."
          status="ready"
          type="pitch-deck"
          isExporting={exportingType === 'pitch-deck'}
          onExport={() => handleExport("pitch-deck")}
          onPreview={() => handlePreview("Pitch Deck", "pitch-deck")}
        />
        <ExportCard 
          title="Technical Architecture" 
          description="Detailed system design, infrastructure specifications, and AI stack (PDF)."
          status="ready"
          type="technical-architecture"
          isExporting={exportingType === 'technical-architecture'}
          onExport={() => handleExport("technical-architecture")}
          onPreview={() => handlePreview("Technical Architecture", "technical-architecture")}
        />
        <ExportCard 
          title="Marketing Playbook" 
          description="GTM strategy, funnel design, and multi-channel messaging guide (PDF)."
          status="ready"
          type="marketing-playbook"
          isExporting={exportingType === 'marketing-playbook'}
          onExport={() => handleExport("marketing-playbook")}
          onPreview={() => handlePreview("Marketing Playbook", "marketing-playbook")}
        />
        <ExportCard 
          title="Financial Model" 
          description="Revenue projections, cost structure, and P&L analysis (Excel)."
          status="ready"
          type="financial-model"
          isExporting={exportingType === 'financial-model'}
          onExport={() => handleExport("financial-model")}
          onPreview={() => handlePreview("Financial Model", "financial-model")}
        />
      </div>

      <Modal
        isOpen={!!previewData}
        onClose={() => setPreviewData(null)}
        title={`${previewData?.title} Preview`}
        description="Review document structure and metadata before final export."
        confirmLabel="Download File"
        onConfirm={() => {
          if (previewData) handleExport(previewData.type);
          setPreviewData(null);
        }}
      >
        <div className="space-y-6">
          <div className="p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Target Model</span>
              <span className="text-xs text-indigo-400 font-black">Claude 3.5 Sonnet</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Estimated Size</span>
              <span className="text-xs text-white font-bold">2.4 MB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Page Count</span>
              <span className="text-xs text-white font-bold">~14 Pages</span>
            </div>
          </div>
          <div className="aspect-video bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <FileText size={48} className="text-slate-800 group-hover:text-indigo-500/20 transition-all group-hover:scale-110 duration-500" />
             <p className="absolute bottom-4 text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">Neural Layout Preview</p>
          </div>
        </div>
      </Modal>
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
