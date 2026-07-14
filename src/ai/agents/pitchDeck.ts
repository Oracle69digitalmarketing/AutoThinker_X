import { runAgent } from "./Agent";

const PITCH_DECK_PROMPT = `You are a Pitch Deck Expert. Based on the Venture Blueprint, generate a structured 12-slide pitch deck.
Slides:
1. Cover (Name, Tagline, Branding)
2. Problem (Pain points)
3. Solution (Product/Service)
4. Market (TAM/SAM/SOM)
5. Product (Core features)
6. Technology (Stack/Architecture)
7. Business Model (Revenue/Pricing)
8. Competition (Matrix/Differentiation)
9. Go To Market (Channels/Strategy)
10. Financials (Unit economics/Burn)
11. Funding (Ask/Use of funds)
12. Closing (Contact/Vision)

Return ONLY JSON:
{
  "slides": [
    { "number": 1, "title": "string", "content": ["string"], "visual_suggestion": "string" }
  ]
}`;

export async function generatePitchDeck(blueprint: any) {
  const result = await runAgent(
    "pitch_deck",
    PITCH_DECK_PROMPT,
    JSON.stringify(blueprint)
  );
  return result.output.slides;
}
