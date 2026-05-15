# Digital Verity - AI Fake News Detection System

## 📖 Overview
Digital Verity is a professional-grade, high-fidelity web application designed to identify and flag fake news. The platform features a sleek, modern, terminal-inspired "cyber-forensic" user interface. It provides users with real-time text analysis, confidence scoring, authentication, and analysis history.

Under the hood, it uses state-of-the-art NLP models (specifically RoBERTa) wrapped in a robust Python FastAPI backend, with a highly interactive React/Vite frontend.

## ✨ Features
- **Real-Time Forensic Analysis:** AI-powered classification using local PyTorch `roberta-base-fake-news` model.
- **Investigation History:** Automatically saves and organizes analysis results into a remote Supabase database.
- **Authentication System:** Secure email/password login and user session management via Supabase Auth (with unique investigator IDs).
- **Cyber-Forensic Aesthetic:** High-fidelity UI using Tailwind CSS, Shadcn UI, and Framer Motion for dynamic micro-animations.

## 🛠️ Tech Stack
**Frontend:**
- React 19 + Vite
- Tailwind CSS & Vanilla CSS
- Shadcn UI, Framer Motion
- Recharts, Axios, React Query

**Backend & Machine Learning:**
- FastAPI & Uvicorn
- PyTorch & HuggingFace Transformers (`roberta-base`)
- Supabase Python SDK
- Pydantic & Pytest

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+) & npm
- Python 3.9+
- A Supabase Project (Database & Authentication)

### 1. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables:
   Create a `.env` file in the `backend` directory with your Supabase credentials:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_anon_key
   ENVIRONMENT=development
   ```
5. Run the FastAPI development server:
   ```bash
   uvicorn main:app --reload --port 8002
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (if needed):
   Create a `.env` or `.env.local` file pointing to your backend URL:
   ```env
   VITE_API_URL=http://localhost:8002
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173` to access the application.

## 📁 Repository Structure
- `/backend`: FastAPI application, endpoints (`auth`, `predict`, `history`), and Supabase integration logic.
- `/frontend`: React application containing components, custom contexts, and the forensic design system.
- `/models`: Local directory intended for storing the NLP model checkpoints (e.g., `roberta-base-fake-news`).
- `/notebooks`: Jupyter notebooks for data science, data preprocessing, and model training.
- `/paper`: Theoretical and academic documentation detailing the system's design and research.

## 🤝 Contributing
When contributing, please ensure that any frontend modifications maintain the dark-mode "Verity" visual style and adhere to the project's strict architecture conventions detailed in `guideline.md`.
