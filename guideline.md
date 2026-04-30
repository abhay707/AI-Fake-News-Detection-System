# AI Fake News Detection System (Digital Verity) - Project Guideline

Welcome! This `guideline.md` serves as the primary onboarding document for any AI or developer working on the **AI Fake News Detection System** (also known as **"Digital Verity"** or **"The Verity"**). Please read this carefully to understand the project architecture, dependencies, and rules before making modifications.

---

## 📖 Description
The **AI Fake News Detection System** is a professional-grade, high-fidelity web application designed to identify and flag fake news. The platform is themed around a "Digital Verity" forensic interface—featuring a sleek, modern, terminal-inspired user experience. The application provides users with real-time text analysis, confidence scoring, authentication, and analysis history. Under the hood, it uses state-of-the-art NLP models (specifically BERT) wrapped in a Python backend, with a highly interactive React/Vite frontend.

---

## 🛠️ Tech Stack
### **Frontend**
- **Framework:** React 19 with Vite (`type: module`)
- **Styling:** Tailwind CSS (`tailwindcss`), Vanilla CSS for complex custom styling
- **Component Library/UI:** Shadcn UI (`radix-ui`), Framer Motion (for dynamic micro-animations), `tw-animate-css`
- **Data Visualization:** Recharts
- **State/Data Management:** `@tanstack/react-query`, Axios
- **Typography:** Geist and Inter (`@fontsource`)

### **Backend**
- **Framework:** FastAPI (`uvicorn[standard]`)
- **Machine Learning Wrapper:** PyTorch (`torch`), HuggingFace Transformers (`transformers`)
- **Database & Authentication:** Supabase (`supabase` Python SDK)
- **Data Validation & Env:** Pydantic (`pydantic`, `pydantic-settings`), `python-dotenv`
- **Testing:** Pytest

### **Machine Learning Models**
- **Core Inference Model:** Locked down to **`roberta-base-fake-news`**. (Previous versions supported `distilbert` or `bert-base`, but the system architecture currently locks inference specifically to `roberta-base` to guarantee production reliability without mock data fallback).
- **Execution:** Inference happens via `AutoModelForSequenceClassification` loaded directly from the local `./models` directory for rapid analysis. Let `torch.no_grad()` manage memory efficiently.

---

## 📁 File Structure

```text
/Users/mymac/Documents/Github/AI-Fake-News-Detection-System/
├── backend/                  # FastAPI Application
│   ├── main.py               # Application entrypoint & CORS middleware
│   ├── config.py             # Parses `.env` using pydantic-settings
│   ├── schemas.py            # Pydantic models for API request/response structures
│   ├── routes/               # FastAPI Routers
│   │   ├── auth.py           # Supabase Auth endpoints (signup, login, update profile)
│   │   ├── history.py        # History retrieval and DB debug endpoints
│   │   └── predict.py        # Core ML Inference endpoints
│   ├── services/             # Core Business Logic Context
│   │   ├── db_service.py     # Supabase client instantiation and DB queries
│   │   └── model_service.py  # Loads the HF model, Tokenizer, runs predictions
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Backend credentials (Supabase URL/Key, etc. - DO NOT COMMIT)
├── frontend/                 # React Web Application
│   ├── index.html            # Main HTML template
│   ├── package.json          # Frontend dependencies and npm scripts
│   ├── vite.config.js        # Vite bundler configuration
│   ├── tailwind.config.js    # Tailwind setup (colors, fonts, animations)
│   ├── src/                  # React source code (Pages, Components, Context, Utils)
│   └── .env.local            # Frontend credentials (often Vite specific environment vars)
├── models/                   # Local ML Models (e.g., roberta-base-fake-news weights/config)
├── notebooks/                # Jupyter Notebooks (Data Science experimentation, model training)
└── paper/                    # Theoretical and academic documentation on the system
```

---

## 🔌 API Endpoints
All backend APIs run via the FastAPI application.

**Health & Root Paths**
* `GET /` -> Returns backend status (`Fake News API is running`).
* `GET /health` -> Simple heartbeat.

**Prediction (`/api/predict`)**
* `POST /api/predict` -> Evaluates an article's legitimacy.
  * **Payload:** `{ "text": "News content...", "model": "roberta-base" }`
  * **Response:** `{ "prediction": "REAL" | "FAKE", "confidence": 0.99, "model_used": "roberta-base", "analysed_at": "timestamp" }`

**History & DB (`/api/history`, `/api/debug`)**
* `GET /api/history` -> Retrieves the latest 50 analyzed articles saved in the Supabase `predictions` table.
* `GET /api/debug/supabase` -> Used to verify the connection to the remote Supabase database.

**Authentication (`/auth/*`)**
* `POST /auth/signup` -> Registers users in Supabase and automatically generates an `investigator_id` (`VERITY-XXXX-X`).
* `POST /auth/login` -> Interacts with `client.auth.sign_in_with_password()`.
* `PUT /auth/update` -> Updates authenticated user's profile information (requires Bearer token).

---

## 🧩 Key Functionalities & Features

1. **Forensic / Command Line Aesthetic:** The app differentiates itself via a unique "Investigator" interface. Key user attributes (like `investigator_id`) emphasize a "cyber-forensic" theme. Ensure all new UI additions maintain this high-fidelity, premium, and slightly dark-mode/glassmorphic quality.
2. **Text Inference Pipeline:** 
   - Receives text -> Tokenizes (Truncates to 512, pads dynamically) -> Runs `roberta-base` inference.
   - Transforms Logits to probabilities using `Softmax` -> Returns the max probability as `confidence`.
   - Results are automatically injected into the Supabase database for long-term history tracking.
3. **Strict Model Locking:** Do NOT add fallback code for fake models or mocks. The system insists on rigorous execution using the local PyTorch `roberta-base` deployment. Keep inference performance and error handling high-priority.
4. **Supabase Database Tracking:** We track user's requests alongside session management. Auth handles the `email/password` protocol with session strings sent back for JWT parsing. 
5. **Aesthetic Principles (Frontend):** Avoid raw generic colors. Revisit `tailwind.config.js` to ensure you are relying on designated design system tokens to avoid breaking the "Verity" visual style. Employ subtle animations for interactions.

---

## 💡 Reminders For Any AI Agent

1. **Context First:** Always read the `schemas.py` and `services/` logic first when debugging API errors. The Pydantic schemas dictate the request validation meticulously.
2. **Path Constraints:** Assume your current working directory when building backend tools is typically the root directory or `backend/`. However, paths inside `model_service.py` construct model paths like `os.path.join(settings.model_path, ...)`. Ensure you understand where models live relative to `main.py` execution.
3. **Database Rules:** No raw SQL. Use Supabase SDK standard operations (i.e. `client.table('...').select('...').execute()`). If you're building an endpoint that interacts with a user, require a Bearer token verification.
4. **CSS and Design Requirements:** Any UI design modifications requested by the User must maintain the "premium, dynamic, and Wow" aesthetic factor. Leverage shadcn and local Tailwind conventions. Do not use random HEX patterns without validating them against the current theme.
5. **No Mocking/Fallbacks:** Remove any code that "mocks" AI or authentication responses if writing new features. The application is strictly meant for true inference and authentic connections.
