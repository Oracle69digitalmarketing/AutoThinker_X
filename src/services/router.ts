import Groq from "groq-sdk";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = "https://api.deepseek.com";

export type Complexity = 'low' | 'medium' | 'high';

export async function getCompletion(systemPrompt: string, userPrompt: string, complexity: Complexity = 'medium') {
  const useDeepSeek = complexity === 'high';
  
  if (useDeepSeek && DEEPSEEK_API_KEY) {
    try {
      console.log("Routing to DeepSeek (Advanced Reasoning)...");
      const response = await axios.post(`${DEEPSEEK_BASE_URL}/chat/completions`, {
        model: "deepseek-chat", // or deepseek-reasoner if supported
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      }, {
        headers: {
          "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 60000 // 60s timeout
      });
      return response.data.choices[0].message.content;
    } catch (error: any) {
      console.error("DeepSeek failed, falling back to Groq:", error.message);
    }
  }

  // Groq (Primary Fast Model)
  console.log("Routing to Groq (Primary Fast Model)...");
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      response_format: { type: "json_object" }
    });
    return completion.choices[0]?.message?.content || "";
  } catch (error: any) {
    console.error("Groq primary failed, trying fallback...", error.message);
    // Ultimate fallback to a smaller, faster model if needed
    const fallback = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.1,
      response_format: { type: "json_object" }
    });
    return fallback.choices[0]?.message?.content || "";
  }
}
