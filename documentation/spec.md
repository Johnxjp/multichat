## Goal
Build a web application that lets users compare LLM outputs side-by-side by selecting multiple models from OpenRouter, entering a shared system prompt and query, and viewing each model's response in its own panel.

## Tasks

1. Project scaffolding and layout shell
2. Settings panel (left sidebar)
3. Model panel component + panel management
4. OpenRouter integration — model list + chat API
5. Polish, responsive tweaks, and final QA

## Architecture

### Tech Stack
- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context or Zustand (decide during implementation — lean toward Zustand for panel state complexity)
- **Drag & Drop**: @dnd-kit/sortable
- **Deployment**: Vercel

### Layout
```
┌──────────────┬────────────────────────────────────────────┐
│              │  Panel 1   │  Panel 2   │  Panel 3   │ ... │
│   Settings   │  (pinned)  │            │            │     │
│   Panel      │  Model A   │  Model B   │  Model C   │     │
│   (fixed)    │  [chat]    │  [chat]    │  [chat]    │     │
│   ~300px     │  ~400px    │  ~400px    │  ~400px    │     │
│              │            │            │            │     │
└──────────────┴────────────────────────────────────────────┘
                ← horizontally scrollable →
```

### Data Flow
1. User enters API key → stored in React state (session only, never persisted)
2. API key triggers model list fetch → cached in state + localStorage
3. User writes system prompt → stored in state, shared across all panels
4. User writes query + clicks Send → dispatched to all **active** panels
5. Each active panel: builds messages array (system prompt + conversation history + new user message) → calls `POST /api/chat` → displays response
6. Inactive panels: skipped entirely (no request sent)
7. Conversation history per panel → persisted to localStorage

### API Routes (thin proxy)
- `POST /api/chat` — Proxies to `https://openrouter.ai/api/v1/chat/completions`
  - Client sends: `{ model, messages }` + API key in `Authorization` header
  - Server forwards to OpenRouter, returns response
- `GET /api/models` — Proxies to `https://openrouter.ai/api/v1/models`
  - Client sends: API key in `Authorization` header
  - Server forwards to OpenRouter, returns model list

### Panel State (per panel)
```typescript
interface Panel {
  id: string;
  modelId: string | null;
  isActive: boolean;
  isPinned: boolean;
  conversationHistory: Message[];
  isLoading: boolean;
  error: string | null;
}
```

## Acceptance Criteria
1. User can enter an OpenRouter API key and see a list of available models
2. User can add multiple panels, each selecting a different model
3. User can write a system prompt shared by all models
4. User can send a query and see responses from all active models side-by-side
5. User can drag panels to reorder them
6. User can pin panels to the left
7. User can toggle panels active/inactive (inactive panels skip queries)
8. User can clear conversation per panel or all at once
9. Conversation history persists across page reloads (localStorage)
10. If one model fails, others continue — error shown inline
11. Model list is searchable and can be refreshed
12. App builds and deploys to Vercel without errors

## Non-goals
- Streaming responses (future enhancement)
- Per-model configuration (temperature, max_tokens, etc.) — future enhancement
- Database persistence / user accounts — future enhancement
- Image/file uploads in prompts
- Model cost tracking or usage analytics
- Mobile-optimized layout (responsive is nice-to-have, not required)

## Assumptions
- OpenRouter API supports CORS for browser-based calls (confirmed — but we're proxying anyway)
- Users will provide their own valid OpenRouter API keys
- No authentication needed for the app itself
- localStorage is sufficient for conversation persistence (confirm?)

## Verification Plan
```
# Build check
npm run build

# Lint check
npx next lint

# Manual QA checklist:
# 1. Enter API key → models load
# 2. Add 3 panels, select different models
# 3. Send query → all active panels respond
# 4. Set one panel inactive → resend → inactive panel skipped
# 5. Drag to reorder panels
# 6. Pin a panel → confirm it stays left after reorder
# 7. Clear one panel's conversation
# 8. Clear all conversations
# 9. Refresh page → conversations persist
# 10. Enter invalid API key → appropriate error
# 11. Model search works in selector
# 12. Refresh model list works
```

## Rollback Plan
- Single branch (`llm-comparison-tool`), can revert to initial commit
- No external services to roll back (client-side app)
