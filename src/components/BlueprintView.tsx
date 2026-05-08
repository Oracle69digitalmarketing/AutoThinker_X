import React, { useState } from 'react';
import { Blueprint } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, TrendingUp, Users, Zap, 
  Map, Rocket, FileText, Download,
  Sparkles, BarChart3, Layout, Terminal,
  Presentation, Award, Loader2, Mail, 
  Share2, MousePointer2, Briefcase, UserCircle2,
  CheckCircle2, Plus, ArrowRight, ExternalLink, Search
} from 'lucide-react';
import { PitchDeckView } from './PitchDeckView';
import { FundingView } from './FundingView';

interface BlueprintViewProps {
  blueprint: Blueprint;
  onGenerateDeck?: () => void;
  onFindFunding?: () => void;
  onPrint?: () => void;
  isGeneratingDeck?: boolean;
  isFindingFunding?: boolean;
}

type TabType = 'concept' | 'audience' | 'market' | 'growth' | 'execution' | 'assets' | 'funding' | 'logs';

export const BlueprintView: React.FC<BlueprintViewProps> = ({ 
  blueprint, 
  onGenerateDeck, 
  onFindFunding,
  onPrint,
  isGeneratingDeck,
  isFindingFunding
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('concept');

  const getBrandClasses = () => {
    switch(blueprint.branding) {
      case 'corporate-clean': return 'from-blue-600 to-cyan-500';
      case 'playful-modern': return 'from-pink-600 to-orange-400';
      case 'tech-bold': 
      default: return 'from-indigo-600 to-purple-500';
    }
  };

  const getBrandText = () => {
    switch(blueprint.branding) {
      case 'corporate-clean': return 'text-blue-400';
      case 'playful-modern': return 'text-pink-400';
      case 'tech-bold': 
      default: return 'text-indigo-400';
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'concept', label: 'Venture', icon: <Sparkles size={18} /> },
    { id: 'audience', label: 'Audience', icon: <UserCircle2 size={18} /> },
    { id: 'market', label: 'Market', icon: <Search size={18} /> },
    { id: 'growth', label: 'Growth', icon: <TrendingUp size={18} /> },
    { id: 'execution', label: 'Launch', icon: <Rocket size={18} /> },
    { id: 'assets', label: 'Assets', icon: <FileText size={18} /> },
    { id: 'funding', label: 'Funding', icon: <Award size={18} /> },
    { id: 'logs', label: 'Logs', icon: <Terminal size={18} /> },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      {/* Header Section */}
      <div className="text-center space-y-4 mb-10">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-500/10 border border-slate-500/20 ${getBrandText()} text-xs font-bold uppercase tracking-widest mb-2`}>
          Blueprint v2.0 • {blueprint.branding || 'Tech Bold'} Edition
        </div>
        <h2 className="text-5xl font-black text-white tracking-tighter">
          {blueprint.name}
        </h2>
        <p className={`text-xl ${getBrandText()} font-medium tracking-tight`}>
          {blueprint.tagline}
        </p>
        <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed">
          {blueprint.pitch}
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap justify-center gap-2 p-1 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800/50 sticky top-4 z-40">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? `bg-gradient-to-r ${getBrandClasses()} text-white shadow-lg shadow-indigo-600/20` 
                : 'text-gray-500 hover:text-gray-200 hover:bg-slate-800'
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
          className="min-h-[500px]"
        >
          {/* TAB: CONCEPT */}
          {activeTab === 'concept' && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card-base h-full">
                <div className="flex items-center gap-2 mb-6 text-indigo-400">
                  <Target size={22} />
                  <h3 className="font-bold text-lg uppercase tracking-wider">Value Prop Canvas</h3>
                </div>
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                    <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">Customer Jobs</h4>
                    <p className="text-sm text-gray-300 leading-relaxed">{blueprint.value_proposition.jobs}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                    <h4 className="text-xs font-black text-red-400 uppercase tracking-widest mb-2">Pains</h4>
                    <p className="text-sm text-gray-300 leading-relaxed">{blueprint.value_proposition.pains}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                    <h4 className="text-xs font-black text-green-400 uppercase tracking-widest mb-2">Gains</h4>
                    <p className="text-sm text-gray-300 leading-relaxed">{blueprint.value_proposition.gains}</p>
                  </div>
                </div>
              </div>

              <div className="card-base h-full">
                <div className="flex items-center gap-2 mb-6 text-purple-400">
                  <BarChart3 size={22} />
                  <h3 className="font-bold text-lg uppercase tracking-wider">SWOT Intelligence</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                    <h4 className="text-xs font-black text-green-400 uppercase mb-2">Strengths</h4>
                    <p className="text-xs text-gray-400 leading-normal">{blueprint.swot.strengths}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                    <h4 className="text-xs font-black text-red-400 uppercase mb-2">Weaknesses</h4>
                    <p className="text-xs text-gray-400 leading-normal">{blueprint.swot.weaknesses}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                    <h4 className="text-xs font-black text-blue-400 uppercase mb-2">Opportunities</h4>
                    <p className="text-xs text-gray-400 leading-normal">{blueprint.swot.opportunities}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                    <h4 className="text-xs font-black text-yellow-400 uppercase mb-2">Threats</h4>
                    <p className="text-xs text-gray-400 leading-normal">{blueprint.swot.threats}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: AUDIENCE */}
          {activeTab === 'audience' && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                {blueprint.customer_profiles.map((profile, idx) => (
                  <div key={idx} className="card-base relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <UserCircle2 size={64} />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">{profile.name}</h4>
                    <div className="text-xs text-indigo-400 font-bold uppercase tracking-widest mb-4">
                      {profile.demographics}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase font-black mb-1">Pain Points</div>
                        <ul className="space-y-1">
                          {profile.pain_points.map((p, i) => (
                            <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                              <span className="text-red-500/50 mt-1">•</span> {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase font-black mb-1">Motivations</div>
                        <ul className="space-y-1">
                          {profile.motivations.map((m, i) => (
                            <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                              <span className="text-green-500/50 mt-1">•</span> {m}
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

          {/* TAB: MARKET */}
          {activeTab === 'market' && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {blueprint.competitors.map((competitor, idx) => (
                  <div key={idx} className="card-base bg-slate-900/40 border border-slate-800/50 hover:border-indigo-500/30 transition-all group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-slate-800 p-2 rounded-lg text-indigo-400 group-hover:scale-110 transition-transform">
                        <Briefcase size={20} />
                      </div>
                      <h3 className="font-bold text-lg text-white">{competitor.name}</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/50">
                        <div className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-1">Unfair Advantage</div>
                        <p className="text-sm text-gray-300 italic">"{competitor.advantage}"</p>
                      </div>
                      
                      <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                        <div className="text-[10px] text-green-400 font-black uppercase tracking-widest mb-1">Critical Gap Found</div>
                        <p className="text-sm text-gray-300 font-medium">{competitor.gap}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="card-base bg-indigo-600/5 border border-indigo-500/20 text-center py-10">
                <Sparkles className="text-indigo-400 mx-auto mb-4" size={32} />
                <h3 className="text-xl font-bold text-white mb-2">The Displacement Strategy</h3>
                <p className="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">
                  By focusing on the identified gaps in the competitive landscape, {blueprint.name} doesn't just enter the market—it expands it. Our architecture is designed to capture high-intent segments currently underserved by existing solutions.
                </p>
              </div>
            </div>
          )}

          {/* TAB: GROWTH */}
          {activeTab === 'growth' && (
            <div className="space-y-8">
              <div className="card-base border-l-4 border-l-indigo-600">
                <div className="flex items-center gap-2 mb-4 text-indigo-400">
                  <MousePointer2 size={22} />
                  <h3 className="font-bold text-lg uppercase tracking-wider">Marketing Funnel Strategy</h3>
                </div>
                <p className="text-gray-300 leading-relaxed mb-6">{blueprint.marketing.funnel_strategy}</p>
                
                {/* Visual Funnel Wireframe */}
                <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto py-8">
                   <div className="flex flex-col items-center gap-3">
                      <div className="w-full h-12 bg-indigo-600/20 border border-indigo-500/30 rounded-lg flex items-center justify-center text-[10px] font-black uppercase text-indigo-400">Awareness</div>
                      <div className="flex flex-col items-center">
                         <div className="w-0.5 h-4 bg-indigo-500/20"></div>
                         <ArrowRight className="rotate-90 text-indigo-500/40" size={12} />
                      </div>
                   </div>
                   <div className="flex flex-col items-center gap-3">
                      <div className="w-4/5 h-12 bg-indigo-600/30 border border-indigo-500/40 rounded-lg flex items-center justify-center text-[10px] font-black uppercase text-indigo-400">Interest</div>
                      <div className="flex flex-col items-center">
                         <div className="w-0.5 h-4 bg-indigo-500/20"></div>
                         <ArrowRight className="rotate-90 text-indigo-500/40" size={12} />
                      </div>
                   </div>
                   <div className="flex flex-col items-center gap-3">
                      <div className="w-3/5 h-12 bg-indigo-600/40 border border-indigo-500/50 rounded-lg flex items-center justify-center text-[10px] font-black uppercase text-indigo-400">Decision</div>
                      <div className="flex flex-col items-center">
                         <div className="w-0.5 h-4 bg-indigo-500/20"></div>
                         <ArrowRight className="rotate-90 text-indigo-500/40" size={12} />
                      </div>
                   </div>
                   <div className="flex flex-col items-center gap-3">
                      <div className="w-2/5 h-12 bg-indigo-600/50 border border-indigo-500/60 rounded-lg flex items-center justify-center text-[10px] font-black uppercase text-indigo-400">Action</div>
                   </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="card-base h-full">
                    <div className="flex items-center gap-2 mb-4 text-blue-400">
                      <Mail size={22} />
                      <h3 className="font-bold text-lg uppercase tracking-wider">Email Sequence</h3>
                    </div>
                    <div className="space-y-4">
                      {blueprint.marketing.email_sequence.map((email, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 group hover:border-indigo-500/50 transition-colors">
                          <div className="flex justify-between items-center mb-1">
                             <div className="text-[10px] text-indigo-400 font-bold uppercase">Email {idx + 1}: Subject</div>
                             <button className="text-[10px] text-gray-600 hover:text-indigo-400 font-black uppercase tracking-widest">Copy</button>
                          </div>
                          <div className="text-sm text-gray-200 font-bold mb-3">{email.subject}</div>
                          <div className="text-xs text-gray-400 leading-relaxed font-light whitespace-pre-wrap">
                            {email.body}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                   {/* Ad Copy Section */}
                  <div className="card-base">
                    <div className="flex items-center gap-2 mb-4 text-purple-400">
                      <Target size={22} />
                      <h3 className="font-bold text-lg uppercase tracking-wider">Campaign Ad Copy</h3>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                           <div className="text-[10px] text-blue-400 font-black uppercase tracking-widest flex items-center gap-1">
                              <ExternalLink size={10} /> Facebook / Instagram
                           </div>
                           <button className="text-[10px] text-gray-600 hover:text-blue-400 font-black">Copy Ad</button>
                        </div>
                        <div className="text-xs text-gray-400 leading-relaxed p-4 bg-slate-800/40 rounded-xl border border-slate-700/50 italic">
                          {blueprint.marketing.ads_copy.facebook}
                        </div>
                      </div>
                      <div className="space-y-2">
                         <div className="flex items-center justify-between">
                           <div className="text-[10px] text-red-400 font-black uppercase tracking-widest flex items-center gap-1">
                              <Search size={10} /> Google Search (PPC)
                           </div>
                           <button className="text-[10px] text-gray-600 hover:text-red-400 font-black">Copy Ad</button>
                        </div>
                        <div className="text-xs text-gray-400 leading-relaxed p-4 bg-slate-800/40 rounded-xl border border-slate-700/50 italic">
                          {blueprint.marketing.ads_copy.google}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-base">
                    <div className="flex items-center gap-2 mb-4 text-pink-400">
                      <Share2 size={22} />
                      <h3 className="font-bold text-lg uppercase tracking-wider">Social Media Series</h3>
                    </div>
                    <div className="space-y-3">
                      {blueprint.marketing.social_posts.map((post, idx) => (
                        <div key={idx} className="flex gap-3 p-4 rounded-xl bg-slate-800/20 border border-slate-700/30 text-xs text-gray-400 leading-relaxed hover:bg-slate-800/40 transition-colors">
                           <div className="w-5 h-5 rounded bg-pink-500/10 text-pink-400 flex items-center justify-center font-bold flex-shrink-0">
                              {idx + 1}
                           </div>
                          {post}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: EXECUTION */}
          {activeTab === 'execution' && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-indigo-400 px-2">
                  <Map size={22} />
                  <h3 className="font-bold text-lg uppercase tracking-wider">Product Roadmap</h3>
                </div>
                <div className="space-y-4">
                  {blueprint.roadmap.map((phase) => (
                    <div key={phase.phase} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-400 font-black uppercase tracking-widest">Phase {phase.phase}</span>
                      </div>
                      <h4 className="font-bold text-white text-lg mb-2">{phase.title}</h4>
                      <p className="text-sm text-gray-400 leading-relaxed">{phase.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 text-orange-400 px-2">
                  <Rocket size={22} />
                  <h3 className="font-bold text-lg uppercase tracking-wider">Direct Steps</h3>
                </div>
                <div className="space-y-3">
                  {blueprint.execution_plan.map((step) => (
                    <div key={step.step} className="flex gap-4 p-5 rounded-2xl bg-slate-900/40 border border-slate-800/50 hover:bg-slate-900 transition-all">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center font-black text-lg border border-orange-600/30">
                        {step.step}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-200">{step.title}</h4>
                        <p className="text-sm text-gray-400 mt-1 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: ASSETS */}
          {activeTab === 'assets' && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="card-base h-full">
                  <div className="flex items-center gap-2 mb-6 text-emerald-400">
                    <FileText size={22} />
                    <h3 className="font-bold text-lg uppercase tracking-wider">Investor One-Pager</h3>
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none text-gray-400 leading-relaxed h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                    {blueprint.one_pager}
                  </div>
                </div>

                <div className="card-base h-full">
                  <div className="flex items-center gap-2 mb-6 text-indigo-400">
                    <Layout size={22} />
                    <h3 className="font-bold text-lg uppercase tracking-wider">Landing Page Copy</h3>
                  </div>
                  <div className="space-y-8 flex flex-col justify-center h-full pb-12">
                    <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 text-center space-y-4">
                      <h4 className="text-2xl font-black text-white leading-tight">{blueprint.landing_copy.hero_headline}</h4>
                      <p className="text-gray-400 font-light">{blueprint.landing_copy.hero_subheadline}</p>
                      <button className="btn btn-primary px-8 py-3 rounded-full mt-4">
                        {blueprint.landing_copy.cta_text}
                      </button>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 uppercase font-black tracking-widest">Optimized for Harmony Builder</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pitch Deck Sub-section */}
              <div className="p-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-[32px]">
                <div className="bg-slate-950/80 backdrop-blur-xl p-8 rounded-[30px] border border-slate-800/50">
                   {blueprint.pitch_deck ? (
                    <PitchDeckView slides={blueprint.pitch_deck} />
                  ) : (
                    <div className="text-center py-12 space-y-6">
                      <Presentation className="text-indigo-400 mx-auto" size={48} />
                      <h4 className="text-2xl font-bold text-white">Need a Visual Presentation?</h4>
                      <button 
                        onClick={onGenerateDeck}
                        disabled={isGeneratingDeck}
                        className="btn btn-primary px-10 py-4 rounded-2xl inline-flex items-center gap-3 text-lg"
                      >
                        {isGeneratingDeck ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
                        Create Interactive Pitch Deck
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: FUNDING */}
          {activeTab === 'funding' && (
            <div className="card-base bg-slate-900/40 p-8 border-dashed border-slate-800">
               {blueprint.funding_opportunities ? (
                <FundingView opportunities={blueprint.funding_opportunities} />
              ) : (
                <div className="text-center py-16 space-y-6">
                  <Award className="text-yellow-400 mx-auto" size={48} />
                  <h4 className="text-2xl font-bold text-white">Find Capital & Opportunities</h4>
                  <p className="text-gray-400 max-w-lg mx-auto">
                    We'll scan for specific hackathons, grant programs, and VC cohorts matching your industry.
                  </p>
                  <button 
                    onClick={onFindFunding}
                    disabled={isFindingFunding}
                    className="btn btn-primary bg-yellow-600 hover:bg-yellow-500 px-10 py-4 rounded-2xl inline-flex items-center gap-3 text-lg border-none"
                  >
                    {isFindingFunding ? <Loader2 className="animate-spin" size={24} /> : <Target size={24} />}
                    Deep Scan Market
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB: LOGS */}
          {activeTab === 'logs' && (
            <div className="card-base bg-slate-900/40 p-8 border border-slate-800">
               <div className="flex items-center gap-2 mb-8 text-indigo-400">
                  <Terminal size={22} />
                  <h3 className="font-bold text-lg uppercase tracking-wider">Agent Chain of Thought</h3>
                </div>
                <div className="space-y-6">
                  {blueprint.agent_logs ? blueprint.agent_logs.map((log, idx) => (
                    <div key={idx} className="flex gap-4 group">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-black text-indigo-400 z-10 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          {idx + 1}
                        </div>
                        {idx !== (blueprint.agent_logs?.length || 0) - 1 && (
                          <div className="w-px h-full bg-slate-800 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-white">{log.agent}</span>
                          <span className="text-[10px] text-gray-600 font-mono">{log.timestamp}</span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed bg-slate-800/20 p-3 rounded-lg border border-slate-700/30 font-mono">
                          {log.thought}
                        </p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-12 text-gray-500 italic">No agent logs available for this blueprint version.</div>
                  )}
                </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Global Actions */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 p-2 bg-slate-900/90 backdrop-blur-2xl rounded-full border border-slate-700/50 shadow-2xl z-50 print:hidden">
        <button 
          onClick={onPrint}
          className="p-3 text-gray-400 hover:text-white transition-colors" 
          title="Print to PDF"
        >
          <Download size={20} />
        </button>
        <div className="w-px h-6 bg-slate-700"></div>
        <button 
          onClick={onPrint}
          className={`flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r ${getBrandClasses()} text-white rounded-full text-sm font-bold shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all`}
        >
          <FileText size={18} /> Export Business Plan
        </button>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-white text-slate-950 rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition-all">
          <Share2 size={18} /> Share Blueprint
        </button>
      </div>
    </div>
  );
};


