import { BASE_SYSTEM_PROMPT } from "./base";
export const MARKETING_PROMPT = `${BASE_SYSTEM_PROMPT}
Design the Go-To-Market (GTM) strategy and growth funnel.
Return:
{
  "agent": "marketing",
  "output": {
    "gtm_strategy": "string",
    "channels": ["string"],
    "funnel": {
      "awareness": "string",
      "interest": "string",
      "decision": "string",
      "action": "string"
    },
    "ad_copy": {
      "headline": "string",
      "body": "string"
    }
  },
  "confidence": 0-100
}`;
