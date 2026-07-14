import { BASE_SYSTEM_PROMPT } from "./base";

export const VENTURE_PROMPT = `${BASE_SYSTEM_PROMPT}
Analyze the following idea and branding style.
Return:
{
  "agent": "venture",
  "output": {
    "name": "Creative name",
    "tagline": "One liner",
    "elevator_pitch": "30-60 words",
    "mission": "Core purpose",
    "vision": "Long term goal",
    "problem": "Pain points being solved",
    "solution": "How it solves them",
    "business_model": "Summary of how it makes money"
  },
  "confidence": 0-100
}`;
