import { useState, useEffect, useRef } from "react";
import { TodoInput } from "./TodoInput";
import { TodoItemCard } from "./TodoItemCard";
import { TodoSidebar } from "./TodoSidebar";
import { ConfirmModal } from "./ConfirmModal";
import { Stopwatch } from "./Stopwatch";
import type { TodoItem, FilterType, DialogState } from "../types/todo";

const STORAGE_KEY = "uiineed-todos";
const SLOGAN_KEY = "uiineed-slogan";
const DEFAULT_SLOGAN = "Act Now, Simplify Life.☕";

export const Hero = () => {
  // Load initial todos from localStorage
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [
      { id: 1, title: "Welcome to your minimalist Todo app! 👋", completed: false, removed: false },
      { id: 2, title: "Double-click me to edit this task ✏️", completed: false, removed: false },
      { id: 3, title: "Click the circle to mark as done ✅", completed: true, removed: false },
    ];
  });

  // Slogan state
  const [slogan, setSlogan] = useState<string>(() => {
    return localStorage.getItem(SLOGAN_KEY) || DEFAULT_SLOGAN;
  });
  const [isEditingSlogan, setIsEditingSlogan] = useState(false);
  const [tempSlogan, setTempSlogan] = useState(slogan);

  // Filter state
  const [filter, setFilter] = useState<FilterType>("all");

  // Drag & drop ref for reliable asynchronous reordering
  const draggedIdRef = useRef<number | null>(null);

  // Dialog / Confirm state
  const [dialog, setDialog] = useState<DialogState>({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
  });

  // Persist todos
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (e) {
      console.error("Failed to save todos to localStorage", e);
    }
  }, [todos]);

  // Persist slogan
  useEffect(() => {
    localStorage.setItem(SLOGAN_KEY, slogan);
  }, [slogan]);

  // Helper filter sets
  const activeTodos = todos.filter((t) => !t.removed);
  const trashTodos = todos.filter((t) => t.removed);
  const inProgressTodos = activeTodos.filter((t) => !t.completed);
  const completedTodos = activeTodos.filter((t) => t.completed);

  const displayedTodos =
    filter === "ongoing"
      ? inProgressTodos
      : filter === "completed"
      ? completedTodos
      : filter === "removed"
      ? trashTodos
      : activeTodos;

  // Add Todo
  const handleAddTodo = (title: string) => {
    const newTodo: TodoItem = {
      id: Date.now(),
      title,
      completed: false,
      removed: false,
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  // Toggle Completion
  const handleToggleComplete = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Move to Trash with confirmation
  const handleDelete = (id: number) => {
    const todo = todos.find((t) => t.id === id);
    const taskName = todo?.title ? `"${todo.title}"` : "this task";
    setDialog({
      isOpen: true,
      title: "Please Confirm",
      message: `Are you sure you want to delete ${taskName}?`,
      type: "confirm",
      onConfirm: () => {
        setTodos((prev) =>
          prev.map((t) => (t.id === id ? { ...t, removed: true } : t))
        );
      },
    });
  };

  // Restore from Trash
  const handleRestore = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, removed: false } : t))
    );
  };

  // Permanent Delete with confirmation
  const handlePermanentDelete = (id: number) => {
    const todo = todos.find((t) => t.id === id);
    const taskName = todo?.title ? `"${todo.title}"` : "this task";
    setDialog({
      isOpen: true,
      title: "Permanent Delete",
      message: `Are you sure you want to permanently delete ${taskName}? This action cannot be undone.`,
      type: "confirm",
      onConfirm: () => {
        setTodos((prev) => prev.filter((t) => t.id !== id));
      },
    });
  };

  // Edit Todo
  const handleEdit = (id: number, newTitle: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: newTitle } : t))
    );
  };

  // Explicit Move Up button
  const handleMoveUp = (id: number) => {
    const currentIndex = displayedTodos.findIndex((t) => t.id === id);
    if (currentIndex <= 0) return;
    const targetItem = displayedTodos[currentIndex - 1];

    setTodos((prev) => {
      const fromIndex = prev.findIndex((t) => t.id === id);
      const toIndex = prev.findIndex((t) => t.id === targetItem.id);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  };

  // Explicit Move Down button
  const handleMoveDown = (id: number) => {
    const currentIndex = displayedTodos.findIndex((t) => t.id === id);
    if (currentIndex === -1 || currentIndex >= displayedTodos.length - 1) return;
    const targetItem = displayedTodos[currentIndex + 1];

    setTodos((prev) => {
      const fromIndex = prev.findIndex((t) => t.id === id);
      const toIndex = prev.findIndex((t) => t.id === targetItem.id);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  };

  // Drag Reorder with ref-based tracking (fixes moving bottom task up!)
  const handleDragStart = (id: number) => {
    draggedIdRef.current = id;
  };

  const handleDragOverItem = (targetId: number) => {
    const draggedId = draggedIdRef.current;
    if (draggedId === null || draggedId === targetId) return;

    setTodos((prev) => {
      const fromIndex = prev.findIndex((t) => t.id === draggedId);
      const toIndex = prev.findIndex((t) => t.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return prev;

      const updated = [...prev];
      const [movedItem] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, movedItem);
      return updated;
    });
  };

  const handleDragEnd = () => {
    draggedIdRef.current = null;
  };

  // Batch actions
  const handleMarkAllDone = () => {
    setDialog({
      isOpen: true,
      title: "Please Confirm",
      message: "Confirm to mark all tasks as completed?",
      type: "confirm",
      onConfirm: () => {
        setTodos((prev) =>
          prev.map((t) => (!t.removed ? { ...t, completed: true } : t))
        );
      },
    });
  };

  const handleClearCompleted = () => {
    setDialog({
      isOpen: true,
      title: "Please Confirm",
      message: "Confirm to move all completed items to Trash?",
      type: "confirm",
      onConfirm: () => {
        setTodos((prev) =>
          prev.map((t) => (t.completed && !t.removed ? { ...t, removed: true } : t))
        );
      },
    });
  };

  const handleClearAll = () => {
    setDialog({
      isOpen: true,
      title: "Please Confirm",
      message: "Confirm to move all active tasks to Trash?",
      type: "confirm",
      onConfirm: () => {
        setTodos((prev) =>
          prev.map((t) => (!t.removed ? { ...t, removed: true } : t))
        );
      },
    });
  };

  const handleClearTrash = () => {
    setDialog({
      isOpen: true,
      title: "Please Confirm",
      message: "Are you sure you want to permanently delete all items in Trash? This action cannot be undone.",
      type: "confirm",
      onConfirm: () => {
        setTodos((prev) => prev.filter((t) => !t.removed));
      },
    });
  };

  // Slogan editing
  const handleSaveSlogan = () => {
    const trimmed = tempSlogan.trim() || DEFAULT_SLOGAN;
    setSlogan(trimmed);
    setIsEditingSlogan(false);
  };

  return (
    <div className="w-full min-h-screen py-10 px-4 md:px-8 flex flex-col items-center">
      {/* Header Container */}
      <div className="w-full max-w-[760px] mb-8">
        <div className="relative mx-auto w-[240px] mb-6 select-none flex items-center justify-center">
          {/* Left floating diamonds */}
          <div className="ani-vector ani-vector-left">
            <span></span>
            <span></span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-[#F9F3E5] tracking-wider text-center drop-shadow-[4px_4px_0px_#33322E] [-webkit-text-stroke:2px_#33322E]">
            TODO
          </h1>

          {/* Right floating diamonds */}
          <div className="ani-vector ani-vector-right">
            <span></span>
            <span></span>
          </div>
        </div>

        {/* Input Form */}
        <TodoInput onAdd={handleAddTodo} />
      </div>

      {/* Main Content Layout with Sidebar */}
      <div className="w-full max-w-[760px] relative flex flex-col md:flex-row items-start gap-6">
        {/* Central Todo Card Box */}
        <div className="flex-1 w-full bg-white border-2 border-[#33322E] rounded-[12px] shadow-[4px_4px_0px_#33322E] overflow-hidden flex flex-col">
          {/* Top Bar Message & Slogan */}
          <div className="flex items-center h-[46px] border-b-2 border-[#33322E] bg-white hover:bg-[#F9F3E5]/50 transition-colors select-none">
            {activeTodos.length > 0 && filter !== "removed" && (
              <button
                type="button"
                onClick={handleMarkAllDone}
                className="h-full px-4 text-xs md:text-sm font-bold bg-[#8CD4CB] text-[#33322E] border-r-2 border-[#33322E] hover:bg-[#72c2b8] transition-colors cursor-pointer whitespace-nowrap"
              >
                Mark All Done
              </button>
            )}

            {filter === "removed" && trashTodos.length > 0 && (
              <button
                type="button"
                onClick={handleClearTrash}
                className="h-full px-4 text-xs md:text-sm font-bold bg-[#F6A89E] text-[#33322E] border-r-2 border-[#33322E] hover:bg-[#f39589] transition-colors cursor-pointer whitespace-nowrap"
              >
                Clear All Trash
              </button>
            )}

            <div className="flex-1 px-3.5 flex items-center overflow-hidden">
              {isEditingSlogan ? (
                <div className="flex items-center w-full gap-2">
                  <input
                    type="text"
                    value={tempSlogan}
                    onChange={(e) => setTempSlogan(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveSlogan();
                      if (e.key === "Escape") setIsEditingSlogan(false);
                    }}
                    autoFocus
                    className="w-full text-xs md:text-sm font-bold text-[#33322E] bg-[#F9F3E5] px-2 py-0.5 rounded outline-none border border-[#33322E]"
                  />
                  <button
                    type="button"
                    onClick={handleSaveSlogan}
                    className="px-2 py-0.5 text-xs font-bold bg-[#ffd6e9] border border-[#33322E] rounded cursor-pointer"
                  >
                    ✓
                  </button>
                </div>
              ) : (
                <div
                  onDoubleClick={() => {
                    setTempSlogan(slogan);
                    setIsEditingSlogan(true);
                  }}
                  title="Double-click to edit slogan"
                  className="w-full text-xs md:text-sm font-bold text-[#33322E] truncate cursor-pointer"
                >
                  {slogan}
                </div>
              )}
            </div>
          </div>

          {/* List Area */}
          <div className="p-5 md:p-8 min-h-[360px] flex flex-col justify-between">
            {displayedTodos.length === 0 ? (
              <div className="my-auto py-8 px-4 select-none text-center flex flex-col items-center justify-center">
                {filter === "removed" ? (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-4xl">🗑️</span>
                    <span className="text-xl font-black text-[#33322E]">Trash is empty</span>
                  </div>
                ) : filter === "completed" ? (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-4xl">⏳</span>
                    <span className="text-xl font-black text-[#33322E]">No completed tasks yet</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-xl font-black text-[#33322E] mb-4 text-center">
                      Add Your First To-Do Item! 📝
                    </div>
                    <div className="text-left inline-block">
                      <div className="font-bold text-[#33322E] mb-2 text-sm">Usage Tips 💡:</div>
                      <ul className="space-y-2 text-sm text-[#33322E]/80 font-medium">
                        <li>✔️ Press Enter to submit actions.</li>
                        <li>✔️ Click ▲ / ▼ or drag to reorder tasks.</li>
                        <li>✔️ Double-click to edit slogan and tasks.</li>
                        <li>✔️ Access quick actions in the right sidebar.</li>
                        <li>🔒 Your data is stored locally in your browser.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <ul className="w-full flex-1">
                {displayedTodos.map((todo, idx) => (
                  <TodoItemCard
                    key={todo.id}
                    todo={todo}
                    isFirst={idx === 0}
                    isLast={idx === displayedTodos.length - 1}
                    isTrashView={filter === "removed"}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDelete}
                    onRestore={handleRestore}
                    onPermanentDelete={handlePermanentDelete}
                    onEdit={handleEdit}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    onDragStart={handleDragStart}
                    onDragOverItem={handleDragOverItem}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </ul>
            )}

            {/* Bottom Status Bar */}
            <div className="pt-4 border-t-2 border-[#33322E] text-center text-xs md:text-sm font-bold text-[#33322E]/80 select-none">
              {filter === "removed" ? (
                <span>{trashTodos.length} items in trash</span>
              ) : inProgressTodos.length > 0 ? (
                <span>{inProgressTodos.length} items remaining</span>
              ) : activeTodos.length > 0 ? (
                <span className="text-emerald-700">All completed, good job! 🎉</span>
              ) : (
                <span>No tasks remaining</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Tools Column (Filters + Stopwatch) */}
        <div className="w-full md:w-[200px] shrink-0 flex flex-col gap-4">
          <TodoSidebar
            filter={filter}
            onFilterChange={setFilter}
            hasInProgress={inProgressTodos.length > 0}
            hasCompleted={completedTodos.length > 0}
            hasTodos={activeTodos.length > 0}
            trashCount={trashTodos.length}
            onFinishAll={handleMarkAllDone}
            onClearCompleted={handleClearCompleted}
            onClearAll={handleClearAll}
            onClearTrash={handleClearTrash}
          />
          <Stopwatch />
        </div>
      </div>

      {/* Confirmation & Alert Modal */}
      <ConfirmModal
        dialog={dialog}
        onClose={() => setDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default Hero;