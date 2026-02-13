# Multichat — LLM Comparison Tool

Side-by-side LLM output comparison app. Users select multiple AI models (via OpenRouter), enter a shared system prompt and query, and view each model's response in independent draggable panels.

## Tech Stack

- **Next.js 16** (App Router) with **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS 4** (zero-config via `@tailwindcss/postcss`)
- **Zustand 5** for state management (with `persist` middleware)
- **@dnd-kit** for drag-and-drop panel reordering
- **ESLint 9** with `eslint-config-next`

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page (main UI)
│   └── globals.css         # Tailwind import only
├── components/
│   ├── SettingsPanel.tsx   # Left sidebar (API key, prompts, send/clear)
│   ├── PanelArea.tsx       # Scrollable panel container with drag-drop
│   └── ModelPanel.tsx      # Individual model comparison card
└── store/
    └── useAppStore.ts      # Zustand store (AppState, Panel, Message)
```

**Path alias:** `@/*` maps to `./src/*`

## Validation

After making changes, run these commands:

```bash
# TypeScript compilation check (strict mode)
npx tsc --noEmit

# Lint
npm run lint

# Build
npm run build
```

## Architecture Notes

- **Layout:** Fixed 300px left sidebar (SettingsPanel) + horizontally scrollable panel area
- **State:** Single Zustand store manages API key, system prompt, query, and panel array. Conversation history is in-memory only (not persisted).
- **Panels:** Each panel has its own model selection, conversation history, active/pinned state. Pinned panels auto-sort to the left.
- **Styling:** Dark theme throughout. All styling via Tailwind utility classes — no custom CSS.
- **OpenRouter integration:** API routes (`/api/chat`, `/api/models`) are not yet implemented — model list is hardcoded placeholder.
