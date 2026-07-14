import { Blueprint } from "../types";

export const generateInvestorMemoMarkdown = (blueprint: Blueprint): string => {
  return `# ${blueprint.name} - Investor Memo
${blueprint.tagline}

## Overview
${blueprint.overview.elevator_pitch}

## Strategic Positioning
- **Problem:** ${blueprint.overview.problem}
- **Solution:** ${blueprint.overview.solution}

## Market Dynamics
- **TAM:** ${blueprint.market.tam}
- **SAM:** ${blueprint.market.sam}
- **SOM:** ${blueprint.market.som}

## Competitive Advantage
${blueprint.competitors.map(c => `### ${c.name}\n- **Gap:** ${c.market_gaps}`).join('\n')}
`;
};
