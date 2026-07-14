export interface AgentLog {
  agent: string;
  status: 'completed' | 'pending' | 'failed';
  duration: string;
}

export interface VentureDetails {
  startup_name: string;
  tagline: string;
  elevator_pitch: string;
  mission: string;
  vision: string;
  problem: string;
  solution: string;
  business_model: string;
}

export interface CustomerIntelligence {
  icp: string;
  personas: {
    name: string;
    role: string;
    pain_points: string[];
    motivations: string[];
  }[];
  jobs_to_be_done: string[];
  pain_points: string[];
  customer_gains: string[];
}

export interface MarketIntelligence {
  tam: string;
  sam: string;
  som: string;
  industry_trends: string[];
  opportunities: string[];
}

export interface CompetitorIntelligence {
  name: string;
  strengths: string;
  weaknesses: string;
  market_gaps: string;
}

export interface ProductStrategy {
  mvp: string;
  core_features: string[];
  product_roadmap: string[];
}

export interface TechnologyArchitecture {
  frontend: string;
  backend: string;
  database: string;
  ai_stack: string;
  deployment: string;
}

export interface MarketingStrategy {
  positioning: string;
  gtm_strategy: string;
  funnel: string;
  landing_page_messaging: string;
  email_sequence: {
    subject: string;
    body: string;
  }[];
  social_content: string[];
}

export interface FinanceStrategy {
  revenue_streams: string[];
  pricing: string;
  cost_structure: string;
  financial_assumptions: string;
}

export interface FundingOpportunity {
  name: string;
  type: string;
  description: string;
  relevance: string;
}

export interface RoadmapPhase {
  phase: string;
  tasks: string[];
}

export interface Blueprint {
  id?: string;
  name: string;
  tagline: string;
  pitch: string;
  branding?: 'tech-bold' | 'corporate-clean' | 'playful-modern';
  
  overview: VentureDetails;
  venture: VentureDetails;
  customers: CustomerIntelligence;
  market: MarketIntelligence;
  competitors: CompetitorIntelligence[];
  product: ProductStrategy;
  technology: TechnologyArchitecture;
  marketing: MarketingStrategy;
  finance: FinanceStrategy;
  funding: FundingOpportunity[];
  roadmap: RoadmapPhase[];
  agent_logs: AgentLog[];
  
  updatedAt?: any;
  status?: string;
}

