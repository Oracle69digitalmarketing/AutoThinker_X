import { BASE_SYSTEM_PROMPT } from "./base";
export const FINANCE_PROMPT = `${BASE_SYSTEM_PROMPT}
Create a financial plan including unit economics.
Return:
{
  "agent": "financials",
  "output": {
    "revenue_model": {
      "streams": ["string"],
      "pricing_strategy": "string"
    },
    "unit_economics": {
      "cac": "Estimated",
      "ltv": "Estimated",
      "payback_period": "Months"
    },
    "burn_rate_estimate": "string",
    "gross_margin": "Percentage"
  },
  "confidence": 0-100
}`;
