import { BASE_SYSTEM_PROMPT } from "./base";
export const COMPETITOR_PROMPT = `${BASE_SYSTEM_PROMPT}
Analyze direct and indirect competitors.
Return:
{
  "agent": "competition",
  "output": {
    "matrix": [
      {
        "name": "Competitor",
        "strength": "string",
        "weakness": "string",
        "pricing": "string",
        "differentiator": "Why we are better"
      }
    ],
    "market_gap": "The specific gap we fill"
  },
  "confidence": 0-100
}`;
