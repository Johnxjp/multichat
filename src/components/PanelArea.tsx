"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useAppStore } from "@/store/useAppStore";
import { ModelPanel } from "./ModelPanel";

export function PanelArea() {
  const { panels, addPanel, reorderPanels } = useAppStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sort pinned panels to the left
  const sortedPanels = [...panels].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sortedPanels.findIndex((p) => p.id === active.id);
    const newIndex = sortedPanels.findIndex((p) => p.id === over.id);

    const newOrder = [...sortedPanels];
    const [moved] = newOrder.splice(oldIndex, 1);
    newOrder.splice(newIndex, 0, moved);

    reorderPanels(newOrder.map((p) => p.id));
  }

  return (
    <main className="flex-1 overflow-x-auto">
      <div className="flex h-full gap-4 p-4 min-w-max">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedPanels.map((p) => p.id)}
            strategy={horizontalListSortingStrategy}
          >
            {sortedPanels.map((panel) => (
              <ModelPanel key={panel.id} panel={panel} />
            ))}
          </SortableContext>
        </DndContext>

        <button
          onClick={addPanel}
          className="w-[400px] shrink-0 rounded-lg border border-dashed border-gray-700 bg-gray-900/50 p-4 flex items-center justify-center text-gray-500 hover:text-gray-300 hover:border-gray-500 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Panel
        </button>
      </div>
    </main>
  );
}
