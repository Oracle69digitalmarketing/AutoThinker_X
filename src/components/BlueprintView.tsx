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

type TabType = 'overview' | 'customers' | 'market' | 'competitors' | 'product' | 'technology' | 'marketing' | 'finance' | 'funding' | 'roadmap' | 'logs';

export const BlueprintView: React.FC<BlueprintViewProps> = ({ 
  blueprint, 
  onGenerateDeck, 
  onFindFunding,
  onPrint,
  isGeneratingDeck,
  isFindingFunding
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

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
    { id: 'overview', label: 'Overview', icon: <Sparkles size={18} /> },
    { id: 'customers', label: 'Customers', icon: <UserCircle2 size={18} /> },
    { id: 'market', label: 'Market', icon: <Search size={18} /> },
    { id: 'competitors', label: 'Competitors', icon: <Target size={18} /> },
    { id: 'product', label: 'Product', icon: <Rocket size={18} /> },
    { id: 'technology', label: 'Technology', icon: <Terminal size={18} /> },
    { id: 'marketing', label: 'Marketing', icon: <TrendingUp size={18} /> },
    { id: 'finance', label: 'Finance', icon: <BarChart3 size={18} /> },
    { id: 'funding', label: 'Funding', icon: <Award size={18} /> },
    { id: 'roadmap', label: 'Roadmap', icon: <Map size={18} /> },
    { id: 'logs', label: 'Logs', icon: <Layout size={18} /> },
  ];

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(blueprint, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${blueprint.name}_blueprint.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleExportMarkdown = () => {
    const content = `# ${blueprint.name} - Venture Blueprint
${blueprint.tagline}

## Overview
${blueprint.overview.elevator_pitch}
**Mission:** ${blueprint.overview.mission}
**Vision:** ${blueprint.overview.vision}

## Problem & Solution
**Problem:** ${blueprint.overview.problem}
**Solution:** ${blueprint.overview.solution}
**Business Model:** ${blueprint.overview.business_model}

## Market Analysis
**TAM:** ${blueprint.market.tam}
**SAM:** ${blueprint.market.sam}
**SOM:** ${blueprint.market.som}

### Trends
${blueprint.market.industry_trends.map(t => `- ${t}`).join('\n')}

### Opportunities
${blueprint.market.opportunities.map(o => `- ${o}`).join('\n')}

## Competitors
${blueprint.competitors.map(c => `### ${c.name}\n**Strengths:** ${c.strengths}\n**Weaknesses:** ${c.weaknesses}\n**Market Gap:** ${c.market_gaps}`).join('\n\n')}

## Technology Architecture
**Frontend:** ${blueprint.technology.frontend}
**Backend:** ${blueprint.technology.backend}
**Database:** ${blueprint.technology.database}
**AI Stack:** ${blueprint.technology.ai_stack}
**Deployment:** ${blueprint.technology.deployment}

## Execution Roadmap
${blueprint.roadmap.map(r => `### ${r.phase}\n${r.tasks.map(t => `- ${t}`).join('\n')}`).join('\n\n')}
`;
    const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(content);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${blueprint.name}_blueprint.md`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleExportBusinessPlan = () => {
    const content = `BUSINESS PLAN: ${blueprint.name}
==================================================

1. EXECUTIVE SUMMARY
${blueprint.overview.elevator_pitch}

2. MISSION & VISION
Mission: ${blueprint.overview.mission}
Vision: ${blueprint.overview.vision}

3. THE PROBLEM
${blueprint.overview.problem}

4. OUR SOLUTION
${blueprint.overview.solution}

5. TARGET MARKET & CUSTOMERS
ICP: ${blueprint.customers.icp}

6. COMPETITIVE LANDSCAPE
${blueprint.competitors.map(c => `- ${c.name}: ${c.market_gaps}`).join('\n')}

7. MARKETING & GTM
Strategy: ${blueprint.marketing.gtm_strategy}

8. FINANCIAL PROJECTIONS
Revenue: ${blueprint.finance.revenue_streams.join(', ')}
Pricing: ${blueprint.finance.pricing}

9. TECHNOLOGY STACK
Stack: ${blueprint.technology.frontend}, ${blueprint.technology.backend}, ${blueprint.technology.database}

10. ROADMAP
${blueprint.roadmap.map(r => `${r.phase}: ${r.tasks.join(', ')}`).join('\n')}
`;
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(content);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${blueprint.name}_business_plan.txt`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleExportExecSummary = () => {
    const content = `EXECUTIVE SUMMARY: ${blueprint.name}
==================================================

STARTUP: ${blueprint.name}
TAGLINE: ${blueprint.tagline}

CORE PROBLEM:
${blueprint.overview.problem}

PROPOSED SOLUTION:
${blueprint.overview.solution}

MARKET OPPORTUNITY:
TAM: ${blueprint.market.tam} | SAM: ${blueprint.market.sam} | SOM: ${blueprint.market.som}

COMPETITIVE EDGE:
${blueprint.competitors.map(c => `- ${c.name} GAP: ${c.market_gaps}`).join('\n')}

REVENUE MODEL:
${blueprint.finance.revenue_streams.join(', ')}

ASK / FUNDING TARGETS:
${blueprint.funding.map(f => `- ${f.name} (${f.type})`).join('\n')}
`;
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(content);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${blueprint.name}_executive_summary.txt`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      {/* Header Section */}
      <div className="text-center space-y-4 mb-10">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-500/10 border border-slate-500/20 ${getBrandText()} text-xs font-bold uppercase tracking-widest mb-2`}>
          Venture OS • {blueprint.branding || 'Tech Bold'} Edition
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
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card-base h-full">
                <div className="flex items-center gap-2 mb-6 text-indigo-400">
                  <Target size={22} />
                  <h3 className="font-bold text-lg uppercase tracking-wider">Strategic Mission</h3>
                </div>
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                    <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">Problem</h4>
                    <p className="text-sm text-gray-300 leading-relaxed">{blueprint.overview.problem}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                    <h4 className="text-xs font-black text-green-400 uppercase tracking-widest mb-2">Solution</h4>
                    <p className="text-sm text-gray-300 leading-relaxed">{blueprint.overview.solution}</p>
                  </div>
                </div>
              </div>

              <div className="card-base h-full">
                <div className="flex items-center gap-2 mb-6 text-purple-400">
                  <Layout size={22} />
                  <h3 className="font-bold text-lg uppercase tracking-wider">Business Architecture</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                    <h4 className="text-xs font-black text-blue-400 uppercase mb-2">Business Model</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{blueprint.overview.business_model}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                      <h4 className="text-xs font-black text-indigo-400 uppercase mb-2">Mission</h4>
                      <p className="text-xs text-gray-400 leading-normal">{blueprint.overview.mission}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                      <h4 className="text-xs font-black text-purple-400 uppercase mb-2">Vision</h4>
                      <p className="text-xs text-gray-400 leading-normal">{blueprint.overview.vision}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="space-y-8">
              <div className="card-base border-l-4 border-l-indigo-600">
                <h3 className="text-xl font-bold text-white mb-4">Ideal Customer Profile (ICP)</h3>
                <p className="text-gray-400 leading-relaxed">{blueprint.customers.icp}</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {blueprint.customers.personas.map((persona, idx) => (
                  <div key={idx} className="card-base relative overflow-hidden group">
                    <h4 className="text-xl font-bold text-white mb-2">{persona.name}</h4>
                    <div className="text-xs text-indigo-400 font-bold uppercase tracking-widest mb-4">{persona.role}</div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase font-black mb-1">Pain Points</div>
                        <ul className="space-y-1">
                          {persona.pain_points.map((p, i) => (
                            <li key={i} className="text-xs text-gray-400 flex items-start gap-2">• {p}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase font-black mb-1">Motivations</div>
                        <ul className="space-y-1">
                          {persona.motivations.map((m, i) => (
                            <li key={i} className="text-xs text-gray-400 flex items-start gap-2">• {m}</li>
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
              <div className="grid md:grid-cols-3 gap-6">
                <div className="card-base text-center">
                  <h4 className="text-xs font-black text-indigo-400 uppercase mb-2">TAM</h4>
                  <div className="text-3xl font-black text-white">{blueprint.market.tam}</div>
                </div>
                <div className="card-base text-center">
                  <h4 className="text-xs font-black text-blue-400 uppercase mb-2">SAM</h4>
                  <div className="text-3xl font-black text-white">{blueprint.market.sam}</div>
                </div>
                <div className="card-base text-center">
                  <h4 className="text-xs font-black text-green-400 uppercase mb-2">SOM</h4>
                  <div className="text-3xl font-black text-white">{blueprint.market.som}</div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="card-base">
                  <h3 className="font-bold text-lg text-white mb-4">Industry Trends</h3>
                  <ul className="space-y-3">
                    {blueprint.market.industry_trends.map((trend, idx) => (
                      <li key={idx} className="text-sm text-gray-400 flex items-center gap-3">
                        <TrendingUp size={16} className="text-indigo-400" /> {trend}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card-base">
                  <h3 className="font-bold text-lg text-white mb-4">Opportunities</h3>
                  <ul className="space-y-3">
                    {blueprint.market.opportunities.map((opt, idx) => (
                      <li key={idx} className="text-sm text-gray-400 flex items-center gap-3">
                        <Sparkles size={16} className="text-green-400" /> {opt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB: COMPETITORS */}
          {activeTab === 'competitors' && (
            <div className="grid md:grid-cols-2 gap-8">
              {blueprint.competitors.map((competitor, idx) => (
                <div key={idx} className="card-base group">
                  <h3 className="font-bold text-xl text-white mb-4">{competitor.name}</h3>
                  <div className="space-y-4">
                    <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                      <div className="text-[10px] text-green-400 font-black uppercase mb-1">Strengths</div>
                      <p className="text-sm text-gray-300">{competitor.strengths}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                      <div className="text-[10px] text-red-400 font-black uppercase mb-1">Weaknesses</div>
                      <p className="text-sm text-gray-300">{competitor.weaknesses}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                      <div className="text-[10px] text-indigo-400 font-black uppercase mb-1">Market Gap</div>
                      <p className="text-sm text-gray-300 font-medium">{competitor.market_gaps}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: PRODUCT */}
          {activeTab === 'product' && (
            <div className="space-y-8">
              <div className="card-base border-l-4 border-l-orange-500">
                <h3 className="text-xl font-bold text-white mb-4">MVP Definition</h3>
                <p className="text-gray-400 leading-relaxed">{blueprint.product.mvp}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="card-base">
                  <h3 className="font-bold text-lg text-white mb-4">Core Features</h3>
                  <ul className="space-y-3">
                    {blueprint.product.core_features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-gray-400">
                        <CheckCircle2 size={16} className="text-green-500" /> {feat}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card-base">
                  <h3 className="font-bold text-lg text-white mb-4">Product Roadmap</h3>
                  <ul className="space-y-3">
                    {blueprint.product.product_roadmap.map((step, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-gray-400">
                        <ArrowRight size={16} className="text-indigo-500" /> {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB: TECHNOLOGY */}
          {activeTab === 'technology' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TechCard label="Frontend" value={blueprint.technology.frontend} icon={<Layout size={20} />} />
              <TechCard label="Backend" value={blueprint.technology.backend} icon={<Terminal size={20} />} />
              <TechCard label="Database" value={blueprint.technology.database} icon={<Presentation size={20} />} />
              <TechCard label="AI Stack" value={blueprint.technology.ai_stack} icon={<BrainCircuit size={20} />} />
              <TechCard label="Deployment" value={blueprint.technology.deployment} icon={<Rocket size={20} />} />
            </div>
          )}

          {/* TAB: MARKETING */}
          {activeTab === 'marketing' && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="card-base">
                  <h3 className="font-bold text-lg text-white mb-2">Positioning</h3>
                  <p className="text-sm text-gray-400">{blueprint.marketing.positioning}</p>
                </div>
                <div className="card-base">
                  <h3 className="font-bold text-lg text-white mb-2">GTM Strategy</h3>
                  <p className="text-sm text-gray-400">{blueprint.marketing.gtm_strategy}</p>
                </div>
              </div>
              <div className="card-base">
                <h3 className="font-bold text-lg text-white mb-4">Funnel & Messaging</h3>
                <div className="p-4 bg-slate-800/30 rounded-xl mb-6">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase mb-2">Landing Page Hero</h4>
                  <p className="text-lg font-bold text-white">{blueprint.marketing.landing_page_messaging}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-bold text-white">Email Sequence</h4>
                    {blueprint.marketing.email_sequence.map((email, i) => (
                      <div key={i} className="p-3 rounded-lg bg-slate-800/20 border border-slate-700/50">
                        <div className="text-[10px] text-indigo-400 font-bold uppercase mb-1">{email.subject}</div>
                        <p className="text-xs text-gray-400 line-clamp-2">{email.body}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-bold text-white">Social Content</h4>
                    {blueprint.marketing.social_content.map((post, i) => (
                      <div key={i} className="p-3 rounded-lg bg-slate-800/20 border border-slate-700/50 text-xs text-gray-400 italic">
                        "{post}"
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FINANCE */}
          {activeTab === 'finance' && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="card-base">
                  <h3 className="font-bold text-lg text-white mb-4">Revenue Streams</h3>
                  <ul className="space-y-3">
                    {blueprint.finance.revenue_streams.map((stream, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-gray-400">
                        <TrendingUp size={16} className="text-green-500" /> {stream}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card-base">
                  <h3 className="font-bold text-lg text-white mb-2">Pricing Strategy</h3>
                  <p className="text-sm text-gray-400">{blueprint.finance.pricing}</p>
                </div>
              </div>
              <div className="card-base">
                <h3 className="font-bold text-lg text-white mb-2">Cost Structure</h3>
                <p className="text-sm text-gray-400">{blueprint.finance.cost_structure}</p>
              </div>
            </div>
          )}

          {/* TAB: FUNDING */}
          {activeTab === 'funding' && (
            <div className="grid md:grid-cols-2 gap-6">
              {blueprint.funding.map((fund, idx) => (
                <div key={idx} className="card-base">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-white">{fund.name}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-black uppercase">{fund.type}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">{fund.description}</p>
                  <div className="p-2 bg-slate-800/50 rounded border border-slate-700/50 text-[10px] text-indigo-300 italic">
                    {fund.relevance}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: ROADMAP */}
          {activeTab === 'roadmap' && (
            <div className="space-y-6">
              {blueprint.roadmap.map((phase, idx) => (
                <div key={idx} className="card-base border-l-4 border-l-indigo-600">
                  <h3 className="font-bold text-xl text-white mb-4">{phase.phase}</h3>
                  <ul className="grid md:grid-cols-2 gap-4">
                    {phase.tasks.map((task, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                        <CheckCircle2 size={16} className="text-indigo-500 mt-1 flex-shrink-0" /> {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* TAB: LOGS */}
          {activeTab === 'logs' && (
            <div className="card-base bg-black/20 p-8 font-mono">
              <div className="flex items-center gap-2 mb-8 text-indigo-400 border-b border-indigo-900/30 pb-4">
                <Terminal size={20} />
                <h3 className="font-bold uppercase tracking-widest text-sm">Venture OS Generation Logs</h3>
              </div>
              <div className="space-y-4">
                {blueprint.agent_logs.map((log, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500 w-4">{idx + 1}.</span>
                      <span className="text-indigo-400 font-bold">{log.agent}</span>
                      <span className={`px-2 py-0.5 rounded ${log.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                        {log.status.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-gray-500">Processing Time: {log.duration}</span>
                  </div>
                ))}
                <div className="pt-4 text-indigo-500 text-[10px] font-bold">
                  [SUCCESS] UNIT GENERATION COMPLETE. ALL MODULES SYNCED.
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Global Actions */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 bg-slate-900/90 backdrop-blur-2xl rounded-full border border-slate-700/50 shadow-2xl z-50 print:hidden">
        <button onClick={handleExportJSON} className="p-3 text-gray-400 hover:text-white transition-colors" title="Export JSON"><Download size={20} /></button>
        <button onClick={handleExportMarkdown} className="p-3 text-gray-400 hover:text-white transition-colors" title="Export Markdown"><FileText size={20} /></button>
        <div className="w-px h-6 bg-slate-700"></div>
        <button onClick={handleExportBusinessPlan} className={`flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r ${getBrandClasses()} text-white rounded-full text-sm font-bold shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all`}>
          <Briefcase size={18} /> Business Plan
        </button>
        <button onClick={handleExportExecSummary} className="flex items-center gap-2 px-6 py-2.5 bg-white text-slate-950 rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition-all">
          <FileText size={18} /> Exec Summary
        </button>
        <button onClick={onPrint} className="p-3 text-gray-400 hover:text-white transition-colors" title="Print"><Share2 size={20} /></button>
      </div>
    </div>
  );
};

const TechCard = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
  <div className="card-base flex flex-col items-center text-center p-6 space-y-4">
    <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
      {icon}
    </div>
    <div>
      <h4 className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">{label}</h4>
      <p className="text-sm text-gray-200 font-bold">{value}</p>
    </div>
  </div>
);

