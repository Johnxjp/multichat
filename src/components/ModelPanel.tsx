"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAppStore, type Panel } from "@/store/useAppStore";

const PLACEHOLDER_MODELS = [
  { id: "gpt-4o", name: "GPT-4o" },
  { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet" },
  { id: "gemini-pro", name: "Gemini Pro" },
  { id: "llama-3.1-70b", name: "Llama 3.1 70B" },
  { id: "mistral-large", name: "Mistral Large" },
];

export function ModelPanel({ panel }: { panel: Panel }) {
  const { updatePanel, removePanel } = useAppStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: panel.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const selectedModel = PLACEHOLDER_MODELS.find(
    (m) => m.id === panel.modelId
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`w-[400px] shrink-0 rounded-lg border bg-gray-900 p-4 flex flex-col ${
        isDragging ? "opacity-50 z-50" : ""
      } ${panel.isActive ? "border-gray-700" : "border-gray-800 opacity-60"} ${
        panel.isPinned ? "border-l-2 border-l-blue-500" : ""
      }`}
    >
      {/* Header with drag handle */}
      <div className="flex items-center gap-2 mb-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-gray-500 hover:text-gray-300"
          title="Drag to reorder"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </button>

        {/* Model selector */}
        <select
          value={panel.modelId ?? ""}
          onChange={(e) =>
            updatePanel(panel.id, {
              modelId: e.target.value || null,
            })
          }
          className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-2 py-1 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select model...</option>
          {PLACEHOLDER_MODELS.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>

        {/* Pin toggle */}
        <button
          onClick={() => updatePanel(panel.id, { isPinned: !panel.isPinned })}
          className={`p-1 rounded hover:bg-gray-800 ${
            panel.isPinned ? "text-blue-400" : "text-gray-500"
          }`}
          title={panel.isPinned ? "Unpin" : "Pin to left"}
        >
          <svg
            className="w-4 h-4"
            fill={panel.isPinned ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </button>

        {/* Active toggle */}
        <button
          onClick={() => updatePanel(panel.id, { isActive: !panel.isActive })}
          className={`p-1 rounded hover:bg-gray-800 ${
            panel.isActive ? "text-green-400" : "text-gray-500"
          }`}
          title={panel.isActive ? "Deactivate" : "Activate"}
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="8" />
          </svg>
        </button>

        {/* Close button */}
        <button
          onClick={() => removePanel(panel.id)}
          className="p-1 rounded text-gray-500 hover:text-red-400 hover:bg-gray-800"
          title="Close panel"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Model name display */}
      <div className="text-xs text-gray-500 mb-2">
        {selectedModel ? selectedModel.name : "No model selected"}
      </div>

      {/* Conversation area */}
      <div className="flex-1 rounded-md bg-gray-800 border border-gray-700 p-3 overflow-y-auto min-h-[200px]">
        {panel.conversationHistory.length === 0 ? (
          <p className="text-sm text-gray-500">
            Model responses will appear here...
          </p>
        ) : (
          <div className="space-y-3">
            {panel.conversationHistory.map((msg, i) => (
              <div
                key={i}
                className={`text-sm ${
                  msg.role === "user" ? "text-blue-300" : "text-gray-200"
                }`}
              >
                <span className="text-xs text-gray-500 uppercase">
                  {msg.role}:
                </span>
                <p className="mt-0.5 whitespace-pre-wrap">{msg.content}</p>
              </div>
            ))}
          </div>
        )}

        {panel.isLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            Loading...
          </div>
        )}

        {panel.error && (
          <p className="text-sm text-red-400 mt-2">{panel.error}</p>
        )}
      </div>
    </div>
  );
}
