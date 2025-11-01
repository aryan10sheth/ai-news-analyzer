# AI News Analyzer

Project for: NLP subject project

AI News Analyzer is a small full‑stack application that fetches news articles, provides AI‑powered summaries and a chat interface for article discussion, and supports both literal (text) and prototype semantic search over fetched articles.

## Key features
- Fetch news from NewsAPI
- Text summarization and Q&A using Gemini (AI model)
- Search mode toggle: Text search (substring match) and Semantic search (TF‑IDF + cosine similarity prototype)
- Reading time estimation and key point extraction
- Responsive React + TypeScript frontend with TailwindCSS

## Tech stack
- Frontend: React + TypeScript, Vite, TailwindCSS, shadcn/ui components
- Backend: Node.js + TypeScript, Express (API endpoints)
- NLP / AI: Google Gemini for summarization / chat (backend), client-side TF‑IDF semantic ranking (prototype)
- Validation: Zod
- Package manager: npm

## Project structure (important files/folders)
- client/ — React frontend (UI components, pages)
  - client/src/components/SearchBar.tsx — search input + mode selector
  - client/src/pages/Home.tsx — main page, applies text or semantic ranking
- server/ — backend API and Gemini integration
  - server/routes.ts — endpoints (news, summarize, chat)
  - server/gemini.ts — prompts / calls to Gemini model
- shared/ — shared types and schemas
- .env (local) — environment variables (NOT committed)

## NLP concepts used
- Text search: case-insensitive substring matches against title/description (fast, exact)
- Semantic search (prototype): TF‑IDF vectorization + cosine similarity to rank fetched articles by relevance to the query
- Text summarization & NLG: Gemini produces concise summaries, bullet points, and chat responses
- Question answering: context-aware chatbot using Gemini and conversation history
- Preprocessing: tokenization, TF/IDF weighting, basic normalization for client semantic ranking

## How to run (local)
1. Create a local `.env` in the project root (do NOT commit it):
   NEWS_API_KEY=<your_news_api_key>
   GEMINI_API_KEY=<your_gemini_api_key>
   PORT=5000

2. Install and run:
   - Open a terminal in the project root:
     cd newsnlp
     npm install
     npm run dev

3. Open the app:
   - Frontend URL printed by Vite (commonly http://localhost:5173) or:
   - If the server binds to PORT=5000 and frontend proxies, open http://localhost:5000

## Usage notes
- Search mode: use the selector in the search bar to toggle between Text and Semantic search.
- Semantic search here is a lightweight, client-side TF‑IDF solution intended for the small result set fetched from NewsAPI. For production‑grade semantic search use embeddings + a vector DB.
- Do not commit credentials. If secrets are accidentally committed, rotate them and remove them from git history.

## Extending the project
- Replace client TF‑IDF with embeddings (Gemini/OpenAI) + vector DB (Pinecone, Weaviate, etc.) for true semantic search.
- Persist conversation history and article vectors server‑side to improve performance and scalability.
- Add tests and CI (GitHub Actions) to validate builds and linting.

## Acknowledgements
This repository is created as a project for an NLP subject and demonstrates practical applications of search, summarization, and conversational AI in a small news analysis app.
