import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface Panel {
  id: string;
  modelId: string | null;
  isActive: boolean;
  isPinned: boolean;
  conversationHistory: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface AppState {
  apiKey: string;
  systemPrompt: string;
  query: string;
  panels: Panel[];

  setApiKey: (key: string) => void;
  setSystemPrompt: (prompt: string) => void;
  setQuery: (query: string) => void;
  addPanel: () => void;
  removePanel: (id: string) => void;
  updatePanel: (id: string, updates: Partial<Panel>) => void;
  reorderPanels: (ids: string[]) => void;
  clearAllConversations: () => void;
}

let panelCounter = 0;

function createPanel(): Panel {
  panelCounter++;
  return {
    id: `panel-${panelCounter}-${Date.now()}`,
    modelId: null,
    isActive: true,
    isPinned: false,
    conversationHistory: [],
    isLoading: false,
    error: null,
  };
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      apiKey: "",
      systemPrompt: "",
      query: "",
      panels: [createPanel()],

      setApiKey: (key) => set({ apiKey: key }),
      setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),
      setQuery: (query) => set({ query }),

      addPanel: () =>
        set((state) => ({ panels: [...state.panels, createPanel()] })),

      removePanel: (id) =>
        set((state) => ({
          panels: state.panels.filter((p) => p.id !== id),
        })),

      updatePanel: (id, updates) =>
        set((state) => ({
          panels: state.panels.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      reorderPanels: (ids) =>
        set((state) => {
          const panelMap = new Map(state.panels.map((p) => [p.id, p]));
          const reordered = ids
            .map((id) => panelMap.get(id))
            .filter((p): p is Panel => p !== undefined);
          return { panels: reordered };
        }),

      clearAllConversations: () =>
        set((state) => ({
          panels: state.panels.map((p) => ({
            ...p,
            conversationHistory: [],
            isLoading: false,
            error: null,
          })),
        })),
    }),
    {
      name: "llm-comparison-storage",
      partialize: (state) => ({
        apiKey: state.apiKey,
        systemPrompt: state.systemPrompt,
        panels: state.panels.map((p) => ({
          id: p.id,
          modelId: p.modelId,
          isActive: p.isActive,
          isPinned: p.isPinned,
          conversationHistory: [] as Message[],
          isLoading: false,
          error: null,
        })),
      }),
    }
  )
);
