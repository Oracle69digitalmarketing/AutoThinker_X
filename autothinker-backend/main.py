import os
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# --- Pydantic Models ---

class IdeaRequest(BaseModel):
    idea: str

class SWOTAnalysis(BaseModel):
    strengths: str
    weaknesses: str
    opportunities: str
    threats: str

class MarketingStrategy(BaseModel):
    funnel: str
    ads: str
    lead_magnet: str

class RoadmapPhase(BaseModel):
    phase: int
    title: str
    description: str

class ExecutionStep(BaseModel):
    step: int
    title: str
    description: str

class BlueprintResponse(BaseModel):
    name: str
    pitch: str
    value_proposition: str
    swot: SWOTAnalysis
    marketing: MarketingStrategy
    roadmap: list[RoadmapPhase]
    execution_plan: list[ExecutionStep]

# --- FastAPI App Initialization & CORS (No changes here) ---

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Gemini API Configuration ---
import google.generativeai as genai

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set")

genai.configure(api_key=GEMINI_API_KEY)

# --- Helper Function to Call Generation Model ---

def call_nim_model(messages: list, max_tokens: int = 2048) -> str:
    """
    Calls the generative model using the Gemini API.
    The function signature is kept the same to maintain architectural consistency.
    """
    # Convert messages to Gemini format
    system_prompt = ""
    user_messages = []
    for message in messages:
        if message["role"] == "system":
            system_prompt = message["content"]
        else:
            # Gemini uses 'user' and 'model' roles.
            role = "user" if message["role"] == "user" else "model"
            user_messages.append({"role": role, "parts": [message["content"]]})

    try:
        generation_config = genai.types.GenerationConfig(
            max_output_tokens=max_tokens,
            temperature=0.7,
        )
        
        if system_prompt:
            model = genai.GenerativeModel('gemini-pro', system_instruction=system_prompt)
        else:
            model = genai.GenerativeModel('gemini-pro')

        response = model.generate_content(user_messages, generation_config=generation_config)

        # Handle cases where the model returns no content
        if not response.parts:
            print("Warning: Received empty response from model.")
            return ""

        return response.text.strip()
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        raise HTTPException(status_code=500, detail="Failed to communicate with the generation model.")

# --- API Endpoint with Agentic Workflow (UPDATED) ---

@app.post("/api/v1/generate_blueprint", response_model=BlueprintResponse)
def generate_blueprint(req: IdeaRequest):
    """
    Orchestrates the multi-agent workflow using the Chat Completions format.
    """
    # 1. Idea Agent: Expands the initial concept
    # UPDATED: Prompts are now structured with roles for better guidance.
    idea_messages = [
        {"role": "system", "content": "You are an expert product manager."},
        {"role": "user", "content": f"Take the following user idea and expand it into a more concrete concept by defining the core problem, the target audience, and key features. User Idea: \"{req.idea}\""}
    ]
    expanded_concept = call_nim_model(idea_messages)

    # 2. Strategy Agent: Develops a strategic plan
    strategy_messages = [
        {"role": "system", "content": "You are a business strategist."},
        {"role": "user", "content": f"Based on the following product concept, develop a strategic analysis. This includes a clear value proposition and a full SWOT analysis (Strengths, Weaknesses, Opportunities, Threats). Product Concept: \"{expanded_concept}\""}
    ]
    strategic_analysis = call_nim_model(strategy_messages)

    # 3. Builder Agent: Structures the final output into a JSON format
    builder_messages = [
        {"role": "system", "content": "You are a data formatting specialist. Your task is to synthesize all the provided information into a single, valid JSON object. Do not add any extra text, explanations, or markdown formatting. The output must be only the JSON object itself."},
        {"role": "user", "content": f"""
        Based on the information below, generate a startup name, a concise pitch, a value proposition, a SWOT analysis, a marketing strategy, a 3-phase product roadmap, and a 5-step initial execution plan.

        Original Idea: "{req.idea}"
        Expanded Concept: "{expanded_concept}"
        Strategic Analysis: "{strategic_analysis}"

        The JSON output must strictly follow this structure:
        {{
          "name": "Startup Name",
          "pitch": "A concise one-sentence pitch for the startup.",
          "value_proposition": "The unique value proposition.",
          "swot": {{
            "strengths": "Key strengths.",
            "weaknesses": "Key weaknesses.",
            "opportunities": "Market opportunities.",
            "threats": "Potential threats."
          }},
          "marketing": {{
            "funnel": "A high-level marketing funnel strategy.",
            "ads": "A specific advertising channel or strategy.",
            "lead_magnet": "An idea for a lead magnet."
          }},
          "roadmap": [
            {{ "phase": 1, "title": "Phase 1 Title", "description": "Description of what will be achieved in phase 1." }},
            {{ "phase": 2, "title": "Phase 2 Title", "description": "Description of what will be achieved in phase 2." }},
            {{ "phase": 3, "title": "Phase 3 Title", "description": "Description of what will be achieved in phase 3." }}
          ],
          "execution_plan": [
            {{ "step": 1, "title": "Step 1 Title", "description": "Description of the first step to execute." }},
            {{ "step": 2, "title": "Step 2 Title", "description": "Description of the second step to execute." }},
            {{ "step": 3, "title": "Step 3 Title", "description": "Description of the third step to execute." }},
            {{ "step": 4, "title": "Step 4 Title", "description": "Description of the fourth step to execute." }},
            {{ "step": 5, "title": "Step 5 Title", "description": "Description of the fifth step to execute." }}
          ]
        }}
        """}
    ]
    json_output_str = call_nim_model(builder_messages)
    
    # 4. Parse the final JSON and return (No changes here, but this should be more reliable now)
    try:
        if json_output_str.startswith("```json"):
            json_output_str = json_output_str.strip("```json").strip()
            
        blueprint_data = json.loads(json_output_str)
        return BlueprintResponse(**blueprint_data)
    except (json.JSONDecodeError, TypeError) as e:
        print(f"Error parsing JSON from model: {e}")
        print(f"Received output: {json_output_str}")
        raise HTTPException(status_code=500, detail="Failed to generate a valid business blueprint.")
