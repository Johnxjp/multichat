export default function Home() {
  return (
    <div className="flex h-screen">
      {/* Settings Panel — fixed left sidebar */}
      <aside className="w-[300px] shrink-0 border-r border-gray-800 bg-gray-900 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Settings</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              API Key
            </label>
            <div className="h-9 rounded-md bg-gray-800 border border-gray-700" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              System Prompt
            </label>
            <div className="h-24 rounded-md bg-gray-800 border border-gray-700" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Query
            </label>
            <div className="h-9 rounded-md bg-gray-800 border border-gray-700" />
          </div>

          <div className="h-9 rounded-md bg-blue-600 flex items-center justify-center text-sm font-medium">
            Send to All
          </div>
        </div>
      </aside>

      {/* Panel Area — horizontally scrollable */}
      <main className="flex-1 overflow-x-auto">
        <div className="flex h-full gap-4 p-4 min-w-max">
          {/* Placeholder panels */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-[400px] shrink-0 rounded-lg border border-gray-800 bg-gray-900 p-4 flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-300">
                  Panel {i}
                </h3>
                <span className="text-xs text-gray-500">No model selected</span>
              </div>
              <div className="flex-1 rounded-md bg-gray-800 border border-gray-700 p-3">
                <p className="text-sm text-gray-500">
                  Model responses will appear here...
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
