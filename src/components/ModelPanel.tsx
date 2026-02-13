"use client";

import { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAppStore, type Panel } from "@/store/useAppStore";

export function ModelPanel({ panel }: { panel: Panel }) {
  const { updatePanel, removePanel } = useAppStore();
  const models = useAppStore((s) => s.models);

  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  // Prevent hydration errors by only using sortable hooks on client
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const sortable = useSortable({ id: panel.id, disabled: !isMounted });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = sortable;

  const style = isMounted
    ? {
        transform: CSS.Transform.toString(transform),
        transition,
      }
    : {};

  const selectedModel = models.find((m) => m.id === panel.modelId);

  const filteredModels = search.trim()
    ? models.filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.id.toLowerCase().includes(search.toLowerCase())
      )
    : models;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [dropdownOpen]);

  // Auto-scroll to bottom of conversation when new messages arrive
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [panel.conversationHistory.length, panel.isLoading]);

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
          {...(isMounted ? attributes : {})}
          {...(isMounted ? listeners : {})}
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

        {/* Searchable model selector */}
        <div className="relative flex-1 min-w-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-2 py-1 text-sm text-gray-200 text-left truncate focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {selectedModel ? selectedModel.name : "Select model..."}
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 max-h-64 flex flex-col">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search models..."
                autoFocus
                className="w-full px-2 py-1.5 text-sm bg-gray-800 border-b border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none"
              />
              <div className="overflow-y-auto">
                {filteredModels.length === 0 ? (
                  <div className="px-2 py-2 text-xs text-gray-500">
                    {models.length === 0
                      ? "Enter API key to load models"
                      : "No models match search"}
                  </div>
                ) : (
                  filteredModels.map((model) => (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => {
                        updatePanel(panel.id, { modelId: model.id });
                        setDropdownOpen(false);
                        setSearch("");
                      }}
                      className={`w-full text-left px-2 py-1.5 text-sm hover:bg-gray-700 truncate ${
                        model.id === panel.modelId
                          ? "text-blue-400"
                          : "text-gray-200"
                      }`}
                    >
                      {model.name}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

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

        {/* Clear conversation */}
        <button
          onClick={() =>
            updatePanel(panel.id, {
              conversationHistory: [],
              error: null,
            })
          }
          className="p-1 rounded text-gray-500 hover:text-gray-300 hover:bg-gray-800"
          title="Clear conversation"
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
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

      {/* Model ID display */}
      <div className="text-xs text-gray-500 mb-2 truncate">
        {selectedModel ? panel.modelId : "No model selected"}
      </div>

      {/* Conversation area */}
      <div className="flex-1 rounded-md bg-gray-800 border border-gray-700 p-3 overflow-y-auto min-h-[200px]">
        {panel.conversationHistory.length === 0 && !panel.isLoading ? (
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

        <div ref={conversationEndRef} />
      </div>
    </div>
  );
}
