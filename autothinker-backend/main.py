import os
import requests
from fastapi import FastAPI

app = FastAPI()

NIM_API_URL = os.getenv("NIM_API_URL", "http://localhost:8000/v1/completions")
NIM_API_KEY = os.getenv("NIM_API_KEY", "your_local_or_cloud_key")

@app.post("/generate")
def generate(prompt: str):
    """
    Calls the NVIDIA NIM service to generate text based on a prompt.
    """
    headers = {
        "Authorization": f"Bearer {NIM_API_KEY}",
        "Content-Type": "application/json",
    }
    json_data = {
        "model": "llama-3.1-nemotron-nano-8b-v1",
        "prompt": prompt,
        "max_tokens": 1024,
        "temperature": 0.7,
    }
    response = requests.post(NIM_API_URL, headers=headers, json=json_data)
    response.raise_for_status()
    return response.json()
