import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface OpenRouterModel {
  id: string;
  name: string;
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
  models: OpenRouterModel[];
  modelsLoading: boolean;
  modelsError: string | null;

  setApiKey: (key: string) => void;
  setSystemPrompt: (prompt: string) => void;
  setQuery: (query: string) => void;
  addPanel: () => void;
  removePanel: (id: string) => void;
  updatePanel: (id: string, updates: Partial<Panel>) => void;
  reorderPanels: (ids: string[]) => void;
  clearAllConversations: () => void;
  fetchModels: () => Promise<void>;
  sendToAll: () => Promise<void>;
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
    (set, get) => ({
      apiKey: "",
      systemPrompt: "",
      query: "",
      panels: [createPanel()],
      models: [],
      modelsLoading: false,
      modelsError: null,

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

      fetchModels: async () => {
        const { apiKey } = get();
        if (!apiKey.trim()) return;

        set({ modelsLoading: true, modelsError: null });

        try {
          const response = await fetch("/api/models", {
            headers: { Authorization: `Bearer ${apiKey}` },
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || `Failed to fetch models (${response.status})`);
          }

          const data = await response.json();
          const models: OpenRouterModel[] = (data.data ?? []).map(
            (m: { id: string; name?: string }) => ({
              id: m.id,
              name: m.name || m.id,
            })
          );

          models.sort((a, b) => a.name.localeCompare(b.name));
          set({ models, modelsLoading: false });
        } catch (err) {
          set({
            modelsLoading: false,
            modelsError:
              err instanceof Error ? err.message : "Failed to fetch models",
          });
        }
      },

      sendToAll: async () => {
        const { apiKey, systemPrompt, query, panels, updatePanel } = get();
        if (!apiKey.trim() || !query.trim()) return;

        const activePanels = panels.filter(
          (p) => p.isActive && p.modelId
        );
        if (activePanels.length === 0) return;

        const userMessage: Message = { role: "user", content: query };

        // Mark all active panels as loading and append the user message
        for (const panel of activePanels) {
          updatePanel(panel.id, {
            isLoading: true,
            error: null,
            conversationHistory: [...panel.conversationHistory, userMessage],
          });
        }

        // Clear the query input
        set({ query: "" });

        // Fire requests in parallel — each panel handles its own success/failure
        await Promise.allSettled(
          activePanels.map(async (panel) => {
            const messages: Message[] = [];
            if (systemPrompt.trim()) {
              messages.push({ role: "user", content: systemPrompt });
            }
            messages.push(...panel.conversationHistory, userMessage);

            try {
              const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  model: panel.modelId,
                  messages,
                }),
              });

              if (!response.ok) {
                const data = await response.json();
                throw new Error(
                  data.error || `Request failed (${response.status})`
                );
              }

              const data = await response.json();
              const assistantContent =
                data.choices?.[0]?.message?.content ?? "";

              // Get the latest panel state to avoid stale reads
              const current = get().panels.find((p) => p.id === panel.id);
              if (!current) return;

              updatePanel(panel.id, {
                isLoading: false,
                conversationHistory: [
                  ...current.conversationHistory,
                  { role: "assistant", content: assistantContent },
                ],
              });
            } catch (err) {
              updatePanel(panel.id, {
                isLoading: false,
                error:
                  err instanceof Error ? err.message : "Request failed",
              });
            }
          })
        );
      },
    }),
    {
      name: "llm-comparison-storage",
      partialize: (state) => ({
        systemPrompt: state.systemPrompt,
        panels: state.panels.map((p) => ({
          id: p.id,
          modelId: p.modelId,
          isActive: p.isActive,
          isPinned: p.isPinned,
          conversationHistory: p.conversationHistory,
          isLoading: false,
          error: null,
        })),
      }),
    }
  )
);
