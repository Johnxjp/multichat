# LLM Comparison Tool — Settings & Panel Components

## Goal
Build the settings panel (left sidebar) and model panel components for the LLM comparison tool, turning the static scaffolding into interactive, state-managed UI.

## Tasks

### 1. Settings panel (left sidebar)
Build the interactive settings sidebar with API key input, system prompt textarea, query input, and "Send to All" button. Wire up local state for all fields. API key should be stored in session state only (never persisted). System prompt and query are shared across all panels.

**Scope:**
- `src/components/SettingsPanel.tsx` (new)
- `src/app/page.tsx` (replace static sidebar with component)
- State management setup (Zustand store or React Context)

**Definition of Done:**
- API key input with show/hide toggle
- System prompt textarea (resizable)
- Query input field
- "Send to All" button (disabled when no API key or no query)
- "Clear All" button to reset all conversations
- All fields wired to shared state store
- Settings panel renders correctly in the left sidebar at ~300px width

### 2. Model panel component and panel management
Build the ModelPanel component and panel management logic — adding/removing panels, model selection dropdown (placeholder data for now), active/inactive toggle, pin toggle, conversation display area, and drag-to-reorder with @dnd-kit.

**Scope:**
- `src/components/ModelPanel.tsx` (new)
- `src/components/PanelArea.tsx` (new — the scrollable container)
- `src/store/` or `src/context/` — panel state (array of Panel objects)
- `src/app/page.tsx` (replace static panels with PanelArea)
- Install `zustand` and `@dnd-kit/core` + `@dnd-kit/sortable`

**Definition of Done:**
- "Add Panel" button creates a new panel
- Each panel has: model selector (dropdown with placeholder data), active/inactive toggle, pin toggle, close button
- Conversation area shows messages (empty state for now)
- Panels are drag-to-reorder via @dnd-kit
- Pinned panels stay on the left side
- Panel state persisted to localStorage (panel config only, not conversations yet)
- Horizontal scroll works when panels overflow

## Acceptance Criteria
1. Settings sidebar is fully interactive with API key, system prompt, and query fields
2. State is managed via Zustand store shared between settings and panels
3. Panels can be added, removed, reordered (drag), pinned, and toggled active/inactive
4. Panel configuration persists across page reloads via localStorage
5. App builds without errors (`npm run build` passes)
6. Lint passes (`npx next lint`)

## Non-goals
- OpenRouter API integration (next workspace/task)
- Actual chat/message sending functionality
- Streaming responses
- Per-model configuration (temperature, etc.)
- Mobile layout optimization

## Assumptions
- Zustand for state management (simpler than Context for this use case)
- @dnd-kit for drag-and-drop (confirmed in parent spec)
- Placeholder model list data until OpenRouter integration task
- localStorage is sufficient for panel config persistence

## Verification Plan
```bash
npm run build
npx next lint
```

### Manual QA:
1. Settings sidebar renders with all fields
2. API key input has show/hide toggle
3. "Send to All" button disabled when no key or query
4. Can add multiple panels
5. Can drag to reorder panels
6. Can pin/unpin panels (pinned stay left)
7. Can toggle panels active/inactive
8. Can close panels
9. Refresh page — panel config persists

## Rollback Plan
- Single branch (`settings-and-panel-components`), can revert to `7b92ed2` (scaffolding commit)
