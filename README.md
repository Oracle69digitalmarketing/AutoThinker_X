# AutoThinker

**AutoThinker** is an agentic application designed to help entrepreneurs and product teams turn abstract ideas into actionable plans. It leverages a network of autonomous "Think Agents" to facilitate reasoning, ideation, and workflow generation.

## Architecture

AutoThinker is built on a multi-agent architecture, where each agent has a specific role in the product development lifecycle:

*   **Idea Agent:** Responsible for conceptual reasoning, text generation, and initial planning.
*   **Strategy Agent:** Synthesizes insights from multiple contexts, leveraging retrieved data to form strategic plans.
*   **Builder Agent:** Generates structured blueprints for Minimum Viable Products (MVPs) based on the strategies developed.

The backend is powered by a FastAPI application that orchestrates the agents and communicates with the NVIDIA NIM microservices. The frontend is a Next.js application that provides the user interface for interacting with the agents.

## Technology Stack

*   **Reasoning Model:** `llama-3.1-nemotron-nano-8B-v1`
*   **Model Deployment:** NVIDIA NIM (NVIDIA Inference Microservice)
*   **Retrieval:** NVIDIA NeMo Retriever (Retrieval Embedding NIM)
*   **Backend:** FastAPI
*   **Frontend:** Next.js, React, TypeScript
*   **Cloud Infrastructure:** AWS EKS, Amazon SageMaker, Amazon DynamoDB

## Features

*   **Goal-Oriented Reasoning:** Turns abstract ideas into concrete product MVPs, roadmaps, and execution plans.
*   **Multi-Agent Orchestration:** A seamless workflow from the Idea Agent to the Strategy Agent and finally to the Build Agent.
*   **Document Ingestion:** Supports ingestion of various document formats, including PDFs, notes, screenshots, and pitch decks.
*   **Contextual Memory:** Utilizes a vector database to provide context-aware responses and maintain memory of user-uploaded materials.
*   **Cross-Reference Reasoning:** Capable of connecting disparate pieces of information, such as linking a user's AgriTech notes with FinTech patterns.
*   **MVP Blueprint Generation:** Automatically generates structured blueprints for MVPs.

## Challenge Compliance: AWS × NVIDIA "Agentic Application"

AutoThinker fully satisfies the requirements of the AWS × NVIDIA “Agentic Application” challenge.

| Challenge Clause | AutoThinker Feature | Status |
| :--- | :--- | :--- |
| Use `llama-3.1-nemotron-nano-8B-v1` | Core reasoning engine for all agents. | ✅ |
| Deploy via NVIDIA NIM microservice | The model is hosted and served via NVIDIA NIM. | ✅ |
| Integrate Retrieval Embedding NIM | Used for document ingestion and contextual memory. | ✅ |
| Agentic behavior | Implemented as a multi-agent workflow (Idea → Strategy → Build). | ✅ |
| AWS integration | Deployed on AWS using EKS, SageMaker, and DynamoDB. | ✅ |

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Architectural Diagram

```
[User] -> [Frontend (Next.js)] -> [Backend (FastAPI)]
                                     |
                                     v
+-----------------------------------------------------------------+
|                           Backend (FastAPI)                     |
|                                                                 |
|  [API Endpoint (/api/nvidia/generate)] -> [NVIDIA NIM]           |
|                                             |                   |
|                                             v                   |
|                                [llama-3.1-nemotron-nano-8B-v1]    |
|                                                                 |
+-----------------------------------------------------------------+
                                     |
                                     v
+-----------------------------------------------------------------+
|                         Agent Orchestrator                      |
|                                                                 |
|  [Idea Agent] -> [Strategy Agent] -> [Builder Agent]            |
|      |                 |                   |                    |
|      +-----------------+-------------------+--------------------+
|                        |
|                        v
|  [NVIDIA NeMo Retriever (Retrieval Embedding NIM)] -> [Vector DB] |
|                                                                 |
+-----------------------------------------------------------------+
```