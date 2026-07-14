import React, { useState } from 'react';
import { Blueprint } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, TrendingUp, Users, Zap, 
  Map, Rocket, FileText, Download,
  Sparkles, BarChart3, Layout, Terminal, BrainCircuit,
  Presentation, Award, Loader2, Mail, 
  Share2, MousePointer2, Briefcase, UserCircle2,
  CheckCircle2, Plus, ArrowRight, ExternalLink, Search,
  ShieldAlert, Landmark, Cpu, LineChart, Globe
} from 'lucide-react';
import { PitchDeckView } from './PitchDeckView';
import { FundingView } from './FundingView';

// New Components
import { Timeline } from './Timeline';
import { ExportCards } from './ExportCards';
import { AgentDashboard } from './AgentDashboard';
import { Charts } from './Charts';

interface BlueprintViewProps {
  blueprint: Blueprint;
  onGenerateDeck?: () => void;
  onFindFunding?: () => void;
  onPrint?: () => void;
  isGeneratingDeck?: boolean;
  isFindingFunding?: boolean;
}

type TabType = 'overview' | 'customers' | 'market' | 'competition' | 'product' | 'technology' | 'marketing' | 'financials' | 'funding' | 'execution' | 'documents' | 'logs';

export const BlueprintView: React.FC<BlueprintViewProps> = ({ 
  blueprint, 
  onGenerateDeck, 
  onFindFunding,
  onPrint,
  isGeneratingDeck,
  isFindingFunding
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Sparkles size={18} /> },
    { id: 'customers', label: 'Customers', icon: <UserCircle2 size={18} /> },
    { id: 'market', label: 'Market', icon: <Globe size={18} /> },
    { id: 'competition', label: 'Competition', icon: <Target size={18} /> },
    { id: 'product', label: 'Product', icon: <Rocket size={18} /> },
    { id: 'technology', label: 'Technology', icon: <Cpu size={18} /> },
    { id: 'marketing', label: 'Marketing', icon: <TrendingUp size={18} /> },
    { id: 'financials', label: 'Financials', icon: <Landmark size={18} /> },
    { id: 'funding', label: 'Funding', icon: <Award size={18} /> },
    { id: 'execution', label: 'Execution', icon: <Map size={18} /> },
    { id: 'documents', label: 'Documents', icon: <FileText size={18} /> },
    { id: 'logs', label: 'Agent Logs', icon: <Terminal size={18} /> },
  ];

  // Helper for generating chart data from blueprint strings (Mocking for visual)
  const marketData = [
    { name: 'TAM', value: 100 },
    { name: 'SAM', value: 40 },
    { name: 'SOM', value: 15 },
  ];

  const revenueData = [
    { name: 'Year 1', value: 120000 },
    { name: 'Year 2', value: 450000 },
    { name: 'Year 3', value: 1200000 },
    { name: 'Year 4', value: 2800000 },
    { name: 'Year 5', value: 6500000 },
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-24">
      {/* Hero Header */}
      <div className="relative p-12 bg-slate-900/40 border border-slate-800/50 rounded-[3rem] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
              Venture OS Blueprint
            </span>
            <span className="px-4 py-1.5 bg-slate-800/50 text-slate-400 border border-slate-700/50 rounded-full text-[10px] font-black uppercase tracking-widest">
              {blueprint.branding || 'Tech Bold'} Edition
            </span>
          </div>
          <div>
            <h1 className="text-6xl font-black text-white tracking-tighter mb-4">{blueprint.name}</h1>
            <p className="text-2xl text-indigo-400 font-medium tracking-tight italic">"{blueprint.tagline}"</p>
          </div>
          <p className="text-lg text-slate-400 max-w-4xl leading-relaxed font-medium opacity-80">
            {blueprint.pitch}
          </p>
          <div className="flex items-center gap-4 pt-4">
            <button 
              onClick={() => {
                const url = window.location.href;
                navigator.clipboard.writeText(url).then(() => alert("Blueprint link copied to clipboard!"));
              }} 
              className="flex items-center gap-2 px-6 py-3 bg-white text-slate-950 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
            >
              <Share2 size={18} /> Share Blueprint
            </button>
            <button 
              onClick={onPrint}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-700 transition-all border border-slate-700"
            >
              <Download size={18} /> PDF Export
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-2 p-2 bg-slate-900/60 backdrop-blur-xl rounded-[2rem] border border-slate-800/50 sticky top-24 z-30 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shrink-0 ${
              activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="min-h-[600px]"
        >
          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SectionCard title="Problem Discovery" icon={<ShieldAlert className="text-pink-500" />}>
                  <p className="text-lg text-slate-300 leading-relaxed font-medium">
                    {blueprint.overview.problem}
                  </p>
                </SectionCard>
                <SectionCard title="Value Proposition" icon={<Sparkles className="text-indigo-400" />}>
                  <p className="text-lg text-slate-300 leading-relaxed font-medium">
                    {blueprint.overview.solution}
                  </p>
                </SectionCard>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <SectionCard title="Mission" icon={<Target className="text-indigo-400" />}>
                  <p className="text-sm text-slate-400 leading-relaxed">{blueprint.overview.mission}</p>
                </SectionCard>
                <SectionCard title="Vision" icon={<Rocket className="text-purple-400" />}>
                  <p className="text-sm text-slate-400 leading-relaxed">{blueprint.overview.vision}</p>
                </SectionCard>
                <SectionCard title="Business Model" icon={<Landmark className="text-blue-400" />}>
                  <p className="text-sm text-slate-400 leading-relaxed">{blueprint.overview.business_model}</p>
                </SectionCard>
              </div>
            </div>
          )}

          {/* CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="space-y-8">
              <SectionCard title="Ideal Customer Profile" icon={<UserCircle2 className="text-indigo-400" />}>
                <p className="text-xl text-white font-bold leading-relaxed">{blueprint.customers.icp}</p>
              </SectionCard>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {blueprint.customers.personas.map((persona, i) => (
                  <div key={i} className="bg-slate-900/40 border border-slate-800/50 rounded-[2rem] p-8 space-y-6">
                    <div>
                      <h4 className="text-2xl font-black text-white tracking-tight">{persona.name}</h4>
                      <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mt-1">{persona.role}</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Pain Points</p>
                        <ul className="space-y-2">
                          {persona.pain_points.map((p, j) => (
                            <li key={j} className="text-xs text-slate-400 flex items-start gap-2">
                              <CheckCircle2 size={14} className="text-pink-500 shrink-0 mt-0.5" /> {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Motivations</p>
                        <ul className="space-y-2">
                          {persona.motivations.map((m, j) => (
                            <li key={j} className="text-xs text-slate-400 flex items-start gap-2">
                              <CheckCircle2 size={14} className="text-indigo-500 shrink-0 mt-0.5" /> {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MARKET */}
          {activeTab === 'market' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                   <Charts type="bar" data={marketData} title="Market Sizing (Projected USD Billions)" />
                </div>
                <div className="space-y-6">
                   <MarketMetric label="TAM" value={blueprint.market.tam} sub="Total Addressable" />
                   <MarketMetric label="SAM" value={blueprint.market.sam} sub="Serviceable Addressable" />
                   <MarketMetric label="SOM" value={blueprint.market.som} sub="Serviceable Obtainable" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SectionCard title="Industry Trends" icon={<TrendingUp className="text-indigo-400" />}>
                  <ul className="space-y-4">
                    {blueprint.market.industry_trends.map((t, i) => (
                      <li key={i} className="text-sm text-slate-300 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> {t}
                      </li>
                    ))}
                  </ul>
                </SectionCard>
                <SectionCard title="Market Opportunities" icon={<Sparkles className="text-amber-500" />}>
                  <ul className="space-y-4">
                    {blueprint.market.opportunities.map((o, i) => (
                      <li key={i} className="text-sm text-slate-300 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> {o}
                      </li>
                    ))}
                  </ul>
                </SectionCard>
              </div>
            </div>
          )}

          {/* COMPETITION */}
          {activeTab === 'competition' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blueprint.competitors.map((c, i) => (
                <SectionCard key={i} title={c.name} icon={<Target className="text-slate-500" />}>
                   <div className="space-y-6">
                      <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-2xl">
                         <p className="text-[10px] text-green-500 font-black uppercase mb-2">Strengths</p>
                         <p className="text-sm text-slate-300">{c.strengths}</p>
                      </div>
                      <div className="p-4 bg-pink-500/5 border border-pink-500/10 rounded-2xl">
                         <p className="text-[10px] text-pink-500 font-black uppercase mb-2">Weaknesses</p>
                         <p className="text-sm text-slate-300">{c.weaknesses}</p>
                      </div>
                      <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                         <p className="text-[10px] text-indigo-400 font-black uppercase mb-2">Market Gap / Your Advantage</p>
                         <p className="text-sm text-white font-bold">{c.market_gaps}</p>
                      </div>
                   </div>
                </SectionCard>
              ))}
            </div>
          )}

          {/* PRODUCT */}
          {activeTab === 'product' && (
            <div className="space-y-8">
              <SectionCard title="Minimum Viable Product (MVP)" icon={<Rocket className="text-indigo-400" />}>
                <p className="text-xl text-white font-bold leading-relaxed">{blueprint.product.mvp}</p>
              </SectionCard>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SectionCard title="Core Features" icon={<CheckCircle2 className="text-green-500" />}>
                   <ul className="space-y-4">
                    {blueprint.product.core_features.map((f, i) => (
                      <li key={i} className="text-sm text-slate-300 flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl border border-slate-700/30">
                        <CheckCircle2 size={18} className="text-green-500" /> {f}
                      </li>
                    ))}
                  </ul>
                </SectionCard>
                <SectionCard title="Product Evolution" icon={<TrendingUp className="text-blue-400" />}>
                   <ul className="space-y-4">
                    {blueprint.product.product_roadmap.map((r, i) => (
                      <li key={i} className="text-sm text-slate-300 flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl border border-slate-700/30">
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] text-blue-400 font-bold">{i+1}</div> {r}
                      </li>
                    ))}
                  </ul>
                </SectionCard>
              </div>
            </div>
          )}

          {/* TECHNOLOGY */}
          {activeTab === 'technology' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               <TechBlock label="Frontend" value={blueprint.technology.frontend} icon={<Layout className="text-indigo-400" />} />
               <TechBlock label="Backend" value={blueprint.technology.backend} icon={<Terminal className="text-blue-400" />} />
               <TechBlock label="Database" value={blueprint.technology.database} icon={<Database size={20} className="text-purple-400" />} />
               <TechBlock label="AI Stack" value={blueprint.technology.ai_stack} icon={<BrainCircuit className="text-pink-400" />} />
               <TechBlock label="Deployment" value={blueprint.technology.deployment} icon={<Rocket className="text-amber-500" />} />
               <TechBlock label="Architecture" value="Event-Driven Microservices" icon={<Cpu className="text-green-500" />} />
            </div>
          )}

          {/* MARKETING */}
          {activeTab === 'marketing' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SectionCard title="Positioning Strategy" icon={<Target className="text-indigo-400" />}>
                  <p className="text-lg text-slate-300 leading-relaxed font-medium">{blueprint.marketing.positioning}</p>
                </SectionCard>
                <SectionCard title="GTM Strategy" icon={<TrendingUp className="text-blue-400" />}>
                  <p className="text-lg text-slate-300 leading-relaxed font-medium">{blueprint.marketing.gtm_strategy}</p>
                </SectionCard>
              </div>
              <SectionCard title="Funnel & Messaging" icon={<Mail className="text-purple-400" />}>
                 <div className="space-y-8">
                    <div className="p-8 bg-slate-950/50 rounded-3xl border border-slate-800 flex flex-col items-center text-center">
                       <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-4">Hero Messaging</p>
                       <h4 className="text-3xl font-black text-white max-w-2xl">"{blueprint.marketing.landing_page_messaging}"</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Email Nurture Sequence</p>
                          {blueprint.marketing.email_sequence.map((email, i) => (
                             <div key={i} className="p-5 bg-slate-800/20 border border-slate-700/30 rounded-2xl">
                                <p className="text-xs font-bold text-white mb-1">{email.subject}</p>
                                <p className="text-[10px] text-slate-500 line-clamp-2">{email.body}</p>
                             </div>
                          ))}
                       </div>
                       <div className="space-y-4">
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Social Content Hooks</p>
                          {blueprint.marketing.social_content.map((post, i) => (
                             <div key={i} className="p-5 bg-slate-800/20 border border-slate-700/30 rounded-2xl italic text-[10px] text-slate-400">
                                "{post}"
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </SectionCard>
            </div>
          )}

          {/* FINANCIALS */}
          {activeTab === 'financials' && (
            <div className="space-y-8">
               <Charts type="line" data={revenueData} title="5-Year Revenue Projection (USD)" />
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <SectionCard title="Revenue Streams" icon={<TrendingUp className="text-green-500" />}>
                     <ul className="space-y-3">
                        {blueprint.finance.revenue_streams.map((s, i) => (
                           <li key={i} className="text-sm text-slate-300 flex items-center gap-2">
                              <CheckCircle2 size={16} className="text-indigo-400" /> {s}
                           </li>
                        ))}
                     </ul>
                  </SectionCard>
                  <SectionCard title="Pricing Strategy" icon={<Landmark className="text-blue-400" />}>
                     <p className="text-sm text-slate-400 leading-relaxed">{blueprint.finance.pricing}</p>
                  </SectionCard>
                  <SectionCard title="Cost Structure" icon={<BarChart3 className="text-pink-400" />}>
                     <p className="text-sm text-slate-400 leading-relaxed">{blueprint.finance.cost_structure}</p>
                  </SectionCard>
               </div>
            </div>
          )}

          {/* FUNDING */}
          {activeTab === 'funding' && (
            <div className="space-y-8">
               <div className="flex justify-between items-center bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-[2rem]">
                  <div>
                     <h3 className="text-2xl font-black text-white tracking-tight">Venture Capital Matching</h3>
                     <p className="text-slate-400 mt-1 font-medium">Top funding opportunities aligned with your venture blueprint.</p>
                  </div>
                  <button 
                    onClick={onFindFunding} 
                    disabled={isFindingFunding}
                    className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center gap-3"
                  >
                    {isFindingFunding ? <Loader2 className="animate-spin" /> : <Landmark />}
                    Deep Search Capital
                  </button>
               </div>
               
               {blueprint.funding_opportunities && blueprint.funding_opportunities.length > 0 ? (
                 <FundingView opportunities={blueprint.funding_opportunities} />
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {blueprint.funding.map((f, i) => (
                      <div key={i} className="bg-slate-900/40 border border-slate-800/50 rounded-[2rem] p-8 space-y-4">
                         <div className="flex justify-between items-start">
                            <h4 className="text-xl font-black text-white">{f.name}</h4>
                            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">{f.type}</span>
                         </div>
                         <p className="text-sm text-slate-400 leading-relaxed">{f.description}</p>
                         <div className="pt-4 border-t border-slate-800/50">
                            <p className="text-[10px] text-slate-500 font-black uppercase mb-2">Alignment Relevance</p>
                            <p className="text-xs text-indigo-400 italic font-medium">{f.relevance}</p>
                         </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
          )}

          {/* EXECUTION */}
          {activeTab === 'execution' && (
            <div className="space-y-12">
               <SectionCard title="Launch Roadmap" icon={<Map className="text-indigo-400" />}>
                  <p className="text-slate-400 mb-10 max-w-2xl">A multi-phase execution strategy to move from initial architecture to global scale.</p>
                  <Timeline phases={blueprint.roadmap} />
               </SectionCard>
            </div>
          )}

          {/* DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-8">
               <SectionCard title="Asset Repository" icon={<FileText className="text-indigo-400" />}>
                  <p className="text-slate-400 mb-10 max-w-2xl">Generated professional documentation ready for investor review and internal execution.</p>
                  <ExportCards />
               </SectionCard>
               {blueprint.pitch_deck && blueprint.pitch_deck.length > 0 && (
                  <SectionCard title="Investor Presentation" icon={<Presentation className="text-blue-400" />}>
                     <PitchDeckView slides={blueprint.pitch_deck} />
                  </SectionCard>
               )}
               <div className="flex justify-center pt-8">
                  <button 
                    onClick={onGenerateDeck} 
                    disabled={isGeneratingDeck}
                    className="px-12 py-5 bg-white text-slate-950 rounded-2xl font-black text-lg shadow-2xl shadow-white/10 hover:scale-[1.02] transition-all flex items-center gap-4 disabled:opacity-50"
                  >
                    {isGeneratingDeck ? <Loader2 className="animate-spin" size={24} /> : <Presentation size={24} />}
                    Generate Full Slide Deck
                  </button>
               </div>
            </div>
          )}

          {/* LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-8">
               <SectionCard title="Agent Swarm Diagnostics" icon={<Terminal className="text-indigo-400" />}>
                  <p className="text-slate-400 mb-10 max-w-2xl">Real-time performance metrics and execution traces from the autonomous multi-agent network.</p>
                  <AgentDashboard logs={blueprint.agent_logs} />
               </SectionCard>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const SectionCard = ({ title, icon, children, ...props }: { title: string, icon: React.ReactNode, children: React.ReactNode, [key: string]: any }) => (
  <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2rem] p-10 backdrop-blur-sm relative overflow-hidden group" {...props}>
    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
       {icon}
    </div>
    <div className="relative z-10 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
          {icon}
        </div>
        <h3 className="text-2xl font-black text-white tracking-tight">{title}</h3>
      </div>
      {children}
    </div>
  </div>
);

const MarketMetric = ({ label, value, sub }: { label: string, value: string, sub: string }) => (
  <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-6 backdrop-blur-sm">
    <div className="space-y-1">
      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
      <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{sub}</p>
    </div>
  </div>
);

const TechBlock = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
  <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2rem] p-8 backdrop-blur-sm group hover:border-indigo-500/30 transition-all text-center">
    <div className="w-16 h-16 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">{label}</p>
    <p className="text-lg font-black text-white tracking-tight leading-tight">{value}</p>
  </div>
);

function Database({ size, className }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <ellipse cx="12" cy="5" rx="9" ry="3"/>
      <path d="M3 5V19A9 3 0 0 0 21 19V5"/>
      <path d="M3 12A9 3 0 0 0 21 12"/>
    </svg>
  );
}
