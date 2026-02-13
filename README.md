# Multichat — LLM Comparison Tool

A web application that lets users compare LLM outputs side-by-side by selecting multiple models from OpenRouter, entering a shared system prompt and query, and viewing each model's response in its own panel.

## Features

- Compare multiple LLM models side-by-side
- Searchable model selector powered by OpenRouter's model list
- Shared system prompt across all panels
- Drag-and-drop panel reordering with pin-to-left support
- Per-panel active/inactive toggle (inactive panels skip queries)
- Conversation history persisted to localStorage
- Parallel request dispatch — if one model fails, others continue

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and enter your [OpenRouter API key](https://openrouter.ai/keys) to get started.

## Tech Stack

- Next.js 16 (App Router) with React 19
- TypeScript (strict mode)
- Tailwind CSS 4
- Zustand 5 for state management
- @dnd-kit for drag-and-drop
