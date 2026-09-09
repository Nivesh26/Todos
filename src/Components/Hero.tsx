import { useState, useEffect } from "react";
import { Pendulum } from "./Pendulum";
import { TodoInput } from "./TodoInput";
import { TodoItemCard } from "./TodoItemCard";
import { TodoSidebar } from "./TodoSidebar";
import { ConfirmModal } from "./ConfirmModal";
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
    // Default welcome items if empty
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

  // Drag & drop state
  const [dragIndex, setDragIndex] = useState<number | null>(null);

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

  // Move to Trash
  const handleDelete = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, removed: true } : t))
    );
  };

  // Restore from Trash
  const handleRestore = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, removed: false } : t))
    );
  };

  // Permanent Delete
  const handlePermanentDelete = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  // Edit Todo
  const handleEdit = (id: number, newTitle: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: newTitle } : t))
    );
  };

  // Drag Reorder
  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragEnter = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) return;

    setTodos((prev) => {
      // Find items in current displayed view
      const itemToMove = displayedTodos[dragIndex];
      const targetItem = displayedTodos[targetIndex];
      if (!itemToMove || !targetItem) return prev;

      const fromOriginalIndex = prev.findIndex((t) => t.id === itemToMove.id);
      const toOriginalIndex = prev.findIndex((t) => t.id === targetItem.id);

      if (fromOriginalIndex === -1 || toOriginalIndex === -1) return prev;

      const updated = [...prev];
      updated.splice(fromOriginalIndex, 1);
      updated.splice(toOriginalIndex, 0, itemToMove);
      return updated;
    });

    setDragIndex(targetIndex);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
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

  // Slogan editing
  const handleSaveSlogan = () => {
    const trimmed = tempSlogan.trim() || DEFAULT_SLOGAN;
    setSlogan(trimmed);
    setIsEditingSlogan(false);
  };

  // Export data
  const handleExport = () => {
    const dataStr = JSON.stringify(todos, null, 2);
    const date = new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15);
    const fileName = `todos-${date}.txt`;

    const blob = new Blob([dataStr], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import data
  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          const timestamp = Date.now();
          const validTodos: TodoItem[] = parsed.map((item, idx) => ({
            id: timestamp + idx,
            title: String(item.title || "Untitled"),
            completed: Boolean(item.completed),
            removed: Boolean(item.removed),
          }));

          setTodos((prev) => [...validTodos, ...prev]);
          setDialog({
            isOpen: true,
            title: "Success",
            message: `Successfully imported ${validTodos.length} items!`,
            type: "alert",
          });
        } else {
          throw new Error("Invalid format: Root must be an array of todos");
        }
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        setDialog({
          isOpen: true,
          title: "Import Error",
          message: "Failed to parse file. Please ensure it is valid JSON or exported text.\n" + errMsg,
          type: "alert",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full min-h-screen py-10 px-4 md:px-8 flex flex-col items-center">
      {/* Header Container */}
      <div className="w-full max-w-[680px] mb-8">
        <div className="relative mx-auto w-[220px] mb-6 select-none">
          <h1 className="text-5xl md:text-6xl font-black text-[#F9F3E5] tracking-wider text-center drop-shadow-[4px_4px_0px_#33322E] [-webkit-text-stroke:2px_#33322E]">
            TODO
          </h1>
          <Pendulum />
        </div>

        {/* Input Form */}
        <TodoInput onAdd={handleAddTodo} />
      </div>

      {/* Main Content Layout with Sidebar */}
      <div className="w-full max-w-[680px] relative flex flex-col md:flex-row items-start gap-6">
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
              <div className="my-auto py-8 px-4 text-left select-none">
                <div className="text-lg font-black text-[#33322E] mb-3">
                  {filter === "removed"
                    ? "Trash is empty 🗑️"
                    : filter === "completed"
                    ? "No completed tasks yet ⏳"
                    : "Add Your First To-Do Item! 📝"}
                </div>
                {filter !== "removed" && (
                  <ul className="space-y-2 text-sm text-[#33322E]/80 font-medium">
                    <li className="font-bold text-[#33322E]">Usage Tips 💡:</li>
                    <li>✔️ Press Enter to submit actions.</li>
                    <li>✔️ Drag to reorder your to-dos.</li>
                    <li>✔️ Double-click to edit slogan and tasks.</li>
                    <li>✔️ Access quick actions in the right sidebar.</li>
                    <li>🔒 Your data is stored locally in your browser.</li>
                    <li>📝 Supports data download and import.</li>
                  </ul>
                )}
              </div>
            ) : (
              <ul className="w-full flex-1">
                {displayedTodos.map((todo, idx) => (
                  <TodoItemCard
                    key={todo.id}
                    todo={todo}
                    index={idx}
                    isTrashView={filter === "removed"}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDelete}
                    onRestore={handleRestore}
                    onPermanentDelete={handlePermanentDelete}
                    onEdit={handleEdit}
                    onDragStart={handleDragStart}
                    onDragEnter={handleDragEnter}
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

        {/* Sidebar Quicks Panel */}
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
          onExport={handleExport}
          onImport={handleImport}
        />
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