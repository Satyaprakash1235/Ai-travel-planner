# AI Travel Planner (TripGenie)

A full-stack AI-powered 3D Travel Planner web application with a modern UI and an agentic AI backend.

## Architecture

- **Frontend**: Next.js (App Router), React Three Fiber (3D Globe), Tailwind CSS, Framer Motion
- **Backend**: Python FastAPI, LangChain, Motor (MongoDB Async)

## Getting Started

### 1. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
Copy `backend/.env.example` to `backend/.env` and update with your API keys:
- `OPENAI_API_KEY` (Used for LangChain Agent)
- `MONGO_URI` (Defaults to local MongoDB instance, but works with mocked data if unreachable)

Run the backend server:
```bash
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```
Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Interactive 3D Globe**: Built with React Three Fiber, visualizing the destination dynamically.
- **Agentic AI Itinerary Generation**: FastAPI utilizes Langchain and OpenAI GPT to structure day-by-day JSON itineraries.
- **Immersive Custom UIs**: Glassmorphism forms and animated Framer Motion cards.
- **Graceful Failbacks**: If API keys or DBs fail, the backend degrades gracefully to mocked JSON responses so the beautiful UI can still be experienced.
