# 🚀 AutoThinker X: Enterprise Venture Operating System (v2.0.4)

AutoThinker X is a high-performance, agentic venture-building platform designed to turn raw ideas into investor-ready business blueprints in seconds. Phase 3 has upgraded the platform to a production-grade SaaS application with enterprise security, live monitoring, and professional asset generation.

## 🧠 Live Agent Network
The platform now features a **Live Agent Swarm** where users can monitor the real-time execution of specialized AI entities:
*   **Venture Architect**: Strategy & SWOT Analysis.
*   **Customer Intelligence**: Persona mapping & ICP discovery.
*   **Market Intelligence**: TAM/SAM/SOM & trend synthesis.
*   **Technical Architecture**: Full-stack design & infrastructure planning.
*   **Finance & Funding**: Revenue modeling & VC matching.

## ✨ Enterprise Features

### 📊 Intelligence Dashboard
*   **Portfolio Analytics**: Real-time stats on blueprints, assets, and funding matches.
*   **Performance Metrics**: Generation success rates and average response times.
*   **Portfolio Growth**: Visual trend tracking for venture development.

### 📋 Professional Export Suite
*   **Business Plan**: Professional DOCX with cover page, TOC, and standardized formatting.
*   **Executive Summary**: Investor-ready PDF with branded layouts.
*   **Pitch Deck**: Fully editable PPTX with charts and speaker notes support.
*   **Financial Model**: Multi-sheet Excel workbook with live formulas and projections.

### 🔍 Advanced Portfolio Management
*   **Global Search**: Context-aware search across all venture intelligence.
*   **Smart Filtering**: Filter by industry, funding status, branding, and date.
*   **Asset Management**: Duplicate, rename, archive, and manage venture history.

### 🛡️ Reliability & Security
*   **Offline Persistence**: Work seamlessly even with intermittent connectivity via Firestore caching.
*   **Global Error Handling**: Robust Error Boundary protection for graceful recovery.
*   **Strict Typing**: Zero TypeScript errors for maximum maintainability.
*   **Retry Logic**: Automatic recovery for network-sensitive operations.

## 🛠️ Developer Setup

1.  **Clone & Install**:
    ```bash
    git clone https://github.com/Oracle69digitalmarketing/AutoThinker_X
    cd AutoThinker_X
    npm install
    ```
2.  **Environment Configuration**:
    Create a `.env` file based on `.env.example`:
    *   `GROQ_API_KEY`: Your AI backend key.
    *   `VITE_FIREBASE_*`: Your Firebase project credentials.
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## 🏗️ Architecture
*   **AI**: Google Gemini & Groq Llama 3
*   **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion
*   **Database**: Firebase Firestore (with Offline Persistence)
*   **State**: Reactive Hook Architecture
*   **Exports**: docx, jspdf, pptxgenjs, exceljs

---
*Built with AutoThinker AI — The future of venture building is agentic.*
