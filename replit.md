# NewsAI - AI-Powered News Analysis & Summaries

## Overview

NewsAI is a web application that provides AI-powered news analysis and summaries. The application fetches news articles from external sources, generates concise AI summaries using Google's Gemini AI, and offers an interactive chatbot for users to ask questions about articles. Built with a modern React frontend and Express backend, it emphasizes content-first design with excellent readability and professional presentation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and caching

**UI Component System:**
- Shadcn/ui component library with Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Material Design inspiration with focus on typography hierarchy
- Custom theme system supporting light/dark modes via CSS variables
- Font stack: Inter (UI/body) and Merriweather (headlines)

**State Management:**
- React Query for API data fetching, caching, and synchronization
- Local component state via React hooks
- No global state management library (Redux/Zustand) - relies on React Query's cache

**Key Design Decisions:**
- Component-based architecture with clear separation of concerns
- Custom hooks for reusable logic (useToast, useIsMobile)
- Responsive design with mobile-first approach
- Design guidelines emphasize content hierarchy and readability

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- ESM modules (type: "module")
- RESTful API design pattern

**API Endpoints:**
- `/api/news` - Fetches news articles from NewsAPI
- `/api/summarize` - Generates AI summaries via Gemini
- `/api/chat` - Handles conversational queries about articles

**AI Integration:**
- Google Gemini AI (gemini-2.5-flash model) for:
  - Article summarization with structured JSON responses
  - Conversational chat with context awareness
  - Response schema validation for consistent outputs

**Data Flow:**
- Stateless API design - no session management currently implemented
- In-memory processing - no database persistence yet
- External API aggregation pattern (NewsAPI → Backend → Frontend)

**Error Handling:**
- Centralized error logging
- Structured error responses
- Request/response logging middleware for debugging

### Data Storage

**Current State:**
- No persistent database configured
- Placeholder storage interface exists (`server/storage.ts`)
- Session store infrastructure present (connect-pg-simple) but not actively used

**Database Configuration:**
- Drizzle ORM configured for PostgreSQL
- Schema defined in `shared/schema.ts`
- Migration system ready via drizzle-kit
- Database expected at `DATABASE_URL` environment variable

**Rationale:**
The application currently operates statelessly, fetching data on-demand from external APIs. Database infrastructure is prepared for future features like user accounts, saved articles, or chat history persistence.

### External Dependencies

**Third-Party APIs:**
- **NewsAPI** (`newsapi.org/v2`) - Primary news article source
  - Requires `NEWS_API_KEY` environment variable
  - Fetches articles with search queries, pagination, and filtering
  - Returns article metadata (title, description, content, images, source)

- **Google Gemini AI** (`@google/genai`)
  - Requires `GEMINI_API_KEY` environment variable
  - Used for article summarization and conversational chat
  - Structured JSON response format for reliable parsing
  - Context-aware conversations with history support

**Database Services:**
- Neon Serverless PostgreSQL (`@neondatabase/serverless`)
- Configured but not currently in use
- Ready for future feature implementation

**UI Libraries:**
- Radix UI primitives (20+ component packages) for accessible UI components
- Lucide React for icons
- React Icons for brand icons (Google Gemini)
- date-fns for date formatting
- cmdk for command palette components

**Development Tools:**
- Vite plugins for Replit integration (cartographer, dev-banner, runtime error overlay)
- ESBuild for server-side bundling
- TypeScript compiler for type checking

**Authentication/Authorization:**
- No authentication system currently implemented
- Infrastructure present for future session-based auth (connect-pg-simple)

**Design Rationale:**
The application prioritizes rapid article consumption and AI-assisted comprehension. External APIs handle heavy lifting (news aggregation, AI processing), while the application focuses on user experience and data presentation. The architecture is prepared for future enhancements like user accounts, favorites, and persistent chat history without requiring major refactoring.