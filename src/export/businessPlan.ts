/**
 * businessPlan.ts
 * Phase 6 — Export Engine
 */
import { Blueprint } from "../types";

export const generateBusinessPlanText = (blueprint: Blueprint): string => {
  return `BUSINESS PLAN: ${blueprint.name}
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
};
