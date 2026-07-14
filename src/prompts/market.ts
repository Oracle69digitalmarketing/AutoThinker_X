import { BASE_SYSTEM_PROMPT } from "./base";
export const MARKET_PROMPT = `${BASE_SYSTEM_PROMPT}
Perform deep market sizing (TAM/SAM/SOM) with calculations and industry trends.
Return:
{
  "agent": "market",
  "output": {
    "tam": { "size": "string", "calculation": "string" },
    "sam": { "size": "string", "calculation": "string" },
    "som": { "size": "string", "calculation": "string" },
    "trends": ["Key industry trends"],
    "opportunities": ["Market gaps"],
    "porter_five": {
      "rivalry": "Low/Med/High - Why",
      "suppliers": "Low/Med/High - Why",
      "buyers": "Low/Med/High - Why",
      "substitutes": "Low/Med/High - Why",
      "entrants": "Low/Med/High - Why"
    }
  },
  "confidence": 0-100
}`;
