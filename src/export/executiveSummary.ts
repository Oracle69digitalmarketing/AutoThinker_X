import { Blueprint } from "../types";

export const generateExecSummaryText = (blueprint: Blueprint): string => {
  return `EXECUTIVE SUMMARY: ${blueprint.name}
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
};
