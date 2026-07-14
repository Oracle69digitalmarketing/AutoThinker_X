import { BASE_SYSTEM_PROMPT } from "./base";
export const FUNDING_PROMPT = `${BASE_SYSTEM_PROMPT}
Identify realistic funding opportunities. Use DeepSeek reasoning if possible.
Return:
{
  "agent": "funding",
  "output": {
    "sources": [
      {
        "name": "string",
        "type": "VC/Grant/Accelerator/Hackathon",
        "country": "string",
        "website": "string",
        "investment_range": "string",
        "stage": "string",
        "match_reason": "string"
      }
    ],
    "funding_ask": "string",
    "use_of_funds": ["string"]
  },
  "confidence": 0-100
}`;
