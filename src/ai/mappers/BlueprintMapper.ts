/**
 * BlueprintMapper.ts
 * Phase 3 — Blueprint Compatibility Layer
 * Converts New AI Schema (v3) to Legacy Blueprint Schema (v1)
 */

export class BlueprintMapper {
  static mapV3ToV1(v3: any): any {
    return {
      name: v3.venture?.name || "Unnamed Venture",
      tagline: v3.venture?.tagline || "",
      pitch: v3.venture?.elevator_pitch || "",
      overview: {
        elevator_pitch: v3.venture?.elevator_pitch || "",
        mission: v3.venture?.mission || "",
        vision: v3.venture?.vision || "",
        problem: v3.venture?.problem || "",
        solution: v3.venture?.solution || "",
        business_model: v3.business_model?.summary || ""
      },
      venture: {
        startup_name: v3.venture?.name || "",
        tagline: v3.venture?.tagline || "",
        elevator_pitch: v3.venture?.elevator_pitch || "",
        mission: v3.venture?.mission || "",
        vision: v3.venture?.vision || "",
        problem: v3.venture?.problem || "",
        solution: v3.venture?.solution || "",
        business_model: v3.business_model?.summary || ""
      },
      customers: {
        icp: v3.customers?.icp || "",
        personas: (v3.customers?.personas || []).map((p: any) => ({
          name: p.name || "",
          role: p.role || "",
          pain_points: p.pain_points || [],
          motivations: p.motivations || []
        })),
        jobs_to_be_done: v3.customers?.jtbd || [],
        pain_points: (v3.customers?.personas || []).flatMap((p: any) => p.pain_points || []),
        customer_gains: []
      },
      market: {
        tam: v3.market?.tam?.size || "",
        sam: v3.market?.sam?.size || "",
        som: v3.market?.som?.size || "",
        industry_trends: v3.market?.trends || [],
        opportunities: v3.market?.opportunities || []
      },
      competitors: (v3.competition?.matrix || []).map((c: any) => ({
        name: c.name || "",
        strengths: c.strength || "",
        weaknesses: c.weakness || "",
        market_gaps: c.differentiator || ""
      })),
      product: {
        mvp: v3.product?.unique_selling_point || "",
        core_features: v3.product?.mvp_features || [],
        product_roadmap: v3.product?.roadmap || []
      },
      technology: {
        frontend: v3.technology?.stack?.frontend || "",
        backend: v3.technology?.stack?.backend || "",
        database: v3.technology?.stack?.database || "",
        ai_stack: v3.technology?.stack?.ai || "",
        deployment: v3.technology?.stack?.infrastructure || ""
      },
      marketing: {
        positioning: v3.marketing?.gtm_strategy || "",
        gtm_strategy: v3.marketing?.gtm_strategy || "",
        funnel: v3.marketing?.funnel?.awareness || "",
        landing_page_messaging: v3.marketing?.ad_copy?.headline || "",
        email_sequence: [],
        social_content: []
      },
      finance: {
        revenue_streams: v3.business_model?.revenue_streams || [],
        pricing: v3.business_model?.pricing_strategy || "",
        cost_structure: v3.financials?.burn_rate_estimate || "",
        financial_assumptions: ""
      },
      funding: (v3.funding?.sources || []).map((s: any) => ({
        name: s.name || "",
        type: s.type || "",
        description: s.match_reason || "",
        relevance: s.investment_range || ""
      })),
      roadmap: [
        {
          phase: "Growth",
          tasks: v3.execution?.roadmap || []
        }
      ],
      agent_logs: v3.agent_logs || [],
      // Phase 7: Internally support new keys while keeping v1 schema
      vos_v3_data: v3, 
      metrics: {
        total_tokens: v3.metadata?.total_tokens || 0,
        avg_confidence: v3.metadata?.avg_confidence || 0,
        generation_time: v3.metadata?.generation_time || 0
      }
    };
  }
}
