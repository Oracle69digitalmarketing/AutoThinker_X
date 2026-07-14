import { BASE_SYSTEM_PROMPT } from "./base";
export const CUSTOMER_PROMPT = `${BASE_SYSTEM_PROMPT}
Identify the Ideal Customer Profile (ICP) and detailed personas.
Return:
{
  "agent": "customers",
  "output": {
    "icp": "Detailed ICP description",
    "personas": [
      {
        "name": "Persona Name",
        "role": "Job title/Role",
        "demographics": "Age, Location, Income",
        "psychographics": "Interests, Behaviors",
        "pain_points": ["string"],
        "motivations": ["string"]
      }
    ],
    "jtbd": ["Jobs to be done"],
    "adoption_curve": "Where they sit on the curve"
  },
  "confidence": 0-100
}`;
