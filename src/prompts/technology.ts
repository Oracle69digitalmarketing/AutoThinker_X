import { BASE_SYSTEM_PROMPT } from "./base";
export const TECHNOLOGY_PROMPT = `${BASE_SYSTEM_PROMPT}
Design the technology architecture.
Return:
{
  "agent": "technology",
  "output": {
    "stack": {
      "frontend": "string",
      "backend": "string",
      "database": "string",
      "ai": "string",
      "infrastructure": "string"
    },
    "architecture_pattern": "string",
    "security_measures": ["string"],
    "scalability_plan": "string"
  },
  "confidence": 0-100
}`;
