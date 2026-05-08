export interface SWOTAnalysis {
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
}

export interface MarketingStrategy {
  funnel_strategy: string;
  ads_copy: {
    facebook: string;
    google: string;
  };
  lead_magnet: {
    title: string;
    description: string;
    tripwire_offer: string;
  };
  email_sequence: {
    subject: string;
    body: string;
  }[];
  social_posts: string[];
}

export interface CustomerProfile {
  name: string;
  pain_points: string[];
  motivations: string[];
  demographics: string;
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  description: string;
}

export interface ExecutionStep {
  step: number;
  title: string;
  description: string;
}

export interface Competitor {
  name: string;
  advantage: string;
  gap: string;
}

export interface PitchSlide {
  title: string;
  content: string;
  visual_cue: string;
}

export interface FundingOpportunity {
  name: string;
  type: 'hackathon' | 'cohort' | 'grant' | 'vc';
  description: string;
  link?: string;
  relevance: string;
}

export interface Blueprint {
  id?: string;
  name: string;
  tagline: string;
  pitch: string;
  branding?: 'tech-bold' | 'corporate-clean' | 'playful-modern';
  value_proposition: {
    pains: string;
    gains: string;
    jobs: string;
  };
  customer_profiles: CustomerProfile[];
  swot: SWOTAnalysis;
  competitors: Competitor[];
  marketing: MarketingStrategy;
  roadmap: RoadmapPhase[];
  execution_plan: ExecutionStep[];
  one_pager: string;
  landing_copy: {
    hero_headline: string;
    hero_subheadline: string;
    cta_text: string;
  };
  pitch_deck?: PitchSlide[];
  funding_opportunities?: FundingOpportunity[];
  agent_logs?: {
    agent: string;
    thought: string;
    timestamp: string;
  }[];
  updatedAt?: string;
  status?: string;
}
