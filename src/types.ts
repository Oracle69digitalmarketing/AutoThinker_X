export interface AgentLog {
  agent: string;
  status: 'completed' | 'pending' | 'failed' | 'running';
  duration: string;
  task?: string;
  model?: string;
  timestamp?: number;
}

export interface AgentStatus {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  currentTask: string;
  duration: string;
  lastTask: string;
  avgResponseTime: string;
  health: 'healthy' | 'degraded' | 'down';
  queueLength: number;
  model: string;
  successRate: string;
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
    demographics?: string;
  }[];
  jobs_to_be_done: string[];
  pain_points: string[];
  customer_gains: string[];
  adoption_curve?: string;
}

export interface MarketIntelligence {
  tam: string;
  sam: string;
  som: string;
  industry_trends: string[];
  opportunities: string[];
  porter_five?: any;
}

export interface CompetitorIntelligence {
  name: string;
  strengths: string;
  weaknesses: string;
  market_gaps: string;
  strength?: string;
  weakness?: string;
  pricing?: string;
  differentiator?: string;
}

export interface ProductStrategy {
  mvp: string;
  core_features: string[];
  product_roadmap: string[];
  mvp_features?: string[];
  unique_selling_point?: string;
  user_journey?: string[];
}

export interface TechnologyArchitecture {
  frontend: string;
  backend: string;
  database: string;
  ai_stack: string;
  deployment: string;
  stack?: any;
  architecture_pattern?: string;
  security_measures?: string[];
  scalability_plan?: string;
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
  channels?: string[];
  ad_copy?: any;
}

export interface FinanceStrategy {
  revenue_streams: string[];
  pricing: string;
  cost_structure: string;
  financial_assumptions: string;
  revenue_model?: any;
  unit_economics?: any;
  burn_rate_estimate?: string;
  gross_margin?: string;
}

export interface FundingOpportunity {
  name: string;
  type: string;
  description: string;
  relevance: string;
  sources?: any[];
  funding_ask?: string;
  use_of_funds?: string[];
  link?: string;
}

export interface RoadmapPhase {
  phase: string;
  tasks: string[];
  milestones?: string[];
}

export interface PitchSlide {
  title: string;
  content: string;
  visual_cue: string;
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
  
  // New backend fields (VOS v3)
  business_model?: any;
  financials?: any;
  competition?: any;
  risk?: any;
  execution?: any;
  metrics?: any;

  updatedAt?: any;
  status?: string;

  pitch_deck?: PitchSlide[];
  funding_opportunities?: FundingOpportunity[];
}

declare global {
  interface ImportMeta {
    env: {
      [key: string]: string | boolean | undefined;
      VITE_FIREBASE_API_KEY: string;
      VITE_FIREBASE_AUTH_DOMAIN: string;
      VITE_FIREBASE_PROJECT_ID: string;
      VITE_FIREBASE_STORAGE_BUCKET: string;
      VITE_FIREBASE_MESSAGING_SENDER_ID: string;
      VITE_FIREBASE_APP_ID: string;
      VITE_FIREBASE_MEASUREMENT_ID: string;
    };
  }
}
