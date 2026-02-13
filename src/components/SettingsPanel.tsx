"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";

export function SettingsPanel() {
  const [showApiKey, setShowApiKey] = useState(false);

  const apiKey = useAppStore((s) => s.apiKey);
  const systemPrompt = useAppStore((s) => s.systemPrompt);
  const query = useAppStore((s) => s.query);
  const setApiKey = useAppStore((s) => s.setApiKey);
  const setSystemPrompt = useAppStore((s) => s.setSystemPrompt);
  const setQuery = useAppStore((s) => s.setQuery);
  const clearAllConversations = useAppStore((s) => s.clearAllConversations);

  const canSend = apiKey.trim().length > 0 && query.trim().length > 0;

  return (
    <aside className="w-[300px] shrink-0 border-r border-gray-800 bg-gray-900 p-4 overflow-y-auto flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Settings</h2>

      <div className="space-y-4 flex-1">
        {/* API Key */}
        <div>
          <label
            htmlFor="api-key"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            API Key
          </label>
          <div className="relative">
            <input
              id="api-key"
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-or-..."
              className="w-full h-9 rounded-md bg-gray-800 border border-gray-700 px-3 pr-9 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              aria-label={showApiKey ? "Hide API key" : "Show API key"}
            >
              {showApiKey ? (
                <EyeOffIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* System Prompt */}
        <div>
          <label
            htmlFor="system-prompt"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            System Prompt
          </label>
          <textarea
            id="system-prompt"
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="You are a helpful assistant..."
            rows={4}
            className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 resize-y focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Query */}
        <div>
          <label
            htmlFor="query"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Query
          </label>
          <textarea
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your prompt..."
            rows={3}
            className="w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 resize-y focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Send to All */}
        <button
          type="button"
          disabled={!canSend}
          className="w-full h-9 rounded-md bg-blue-600 flex items-center justify-center text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Send to All
        </button>

        {/* Clear All */}
        <button
          type="button"
          onClick={() => clearAllConversations()}
          className="w-full h-9 rounded-md bg-gray-800 border border-gray-700 flex items-center justify-center text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors"
        >
          Clear All
        </button>
      </div>
    </aside>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
