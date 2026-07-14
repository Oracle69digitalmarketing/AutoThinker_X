import { BASE_SYSTEM_PROMPT } from "./base";
export const RISK_PROMPT = `${BASE_SYSTEM_PROMPT}
Perform a comprehensive risk analysis.
Return:
{
  "agent": "risk",
  "output": {
    "swot": {
      "strengths": ["string"],
      "weaknesses": ["string"],
      "opportunities": ["string"],
      "threats": ["string"]
    },
    "risks": {
      "regulatory": "string",
      "operational": "string",
      "technology": "string",
      "market": "string"
    },
    "mitigation_strategies": ["string"]
  },
  "confidence": 0-100
}`;
