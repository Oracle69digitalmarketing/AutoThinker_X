export interface AgentLog {
  agent: string;
  status: 'completed' | 'pending' | 'failed';
  duration: string;
  provider?: string;
  tokens?: number;
  confidence?: number;
}

export interface PitchSlide {
  number: number;
  title: string;
  content: string[];
  visual_suggestion?: string;
}

export interface VentureBlueprint {
  id?: string;
  venture: {
    name: string;
    tagline: string;
    elevator_pitch: string;
    mission: string;
    vision: string;
    problem: string;
    solution: string;
  };
  customers: {
    icp: string;
    personas: any[];
    jtbd: string[];
    adoption_curve: string;
  };
  market: {
    tam: any;
    sam: any;
    som: any;
    trends: string[];
    opportunities: string[];
    porter_five: any;
  };
  competition: {
    matrix: any[];
    market_gap: string;
  };
  product: {
    mvp_features: string[];
    unique_selling_point: string;
    user_journey: string[];
  };
  technology: {
    stack: any;
    architecture_pattern: string;
    security_measures: string[];
    scalability_plan: string;
  };
  business_model: {
    summary: string;
    revenue_streams: string[];
    pricing_strategy: string;
  };
  marketing: {
    gtm_strategy: string;
    channels: string[];
    funnel: any;
    ad_copy: any;
  };
  financials: {
    unit_economics: any;
    burn_rate_estimate: string;
    gross_margin: string;
  };
  funding: {
    sources: any[];
    funding_ask: string;
    use_of_funds: string[];
  };
  execution: {
    roadmap: string[];
    milestones: string[];
  };
  risk: {
    swot: any;
    risks: any;
    mitigation_strategies: string[];
  };
  metrics?: {
    total_tokens: number;
    avg_confidence: number;
    generation_time: number;
  };
  appendix?: any;
  agent_logs: AgentLog[];
  createdAt?: any;
  updatedAt?: any;
  branding?: string;
  idea?: string;
}
