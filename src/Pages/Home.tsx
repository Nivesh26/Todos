import { useState, useEffect, useRef } from "react";
import Hero from "../Components/Hero";
import { ConfirmModal } from "../Components/ConfirmModal";
import type { TodoItem, FilterType, DialogState } from "../types/todo";

const STORAGE_KEY = "uiineed-todos";
const SLOGAN_KEY = "uiineed-slogan";
const DEFAULT_SLOGAN = "Act Now, Simplify Life.☕";

const Home = () => {
  // Load initial todos from localStorage (lazy initializer)
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

  // Filter state
  const [filter, setFilter] = useState<FilterType>("all");

  // Drag & drop ref for reliable asynchronous reordering without stale closures
  const draggedIdRef = useRef<number | null>(null);

  // Dialog / Confirm modal state
  const [dialog, setDialog] = useState<DialogState>({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
  });

  // Persist todos to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (e) {
      console.error("Failed to save todos to localStorage", e);
    }
  }, [todos]);

  // Persist slogan to localStorage
  useEffect(() => {
    localStorage.setItem(SLOGAN_KEY, slogan);
  }, [slogan]);

  // Derived filter subsets
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

  // Drag Reorder with ref-based tracking
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

  const handleSaveSlogan = (newSlogan: string) => {
    setSlogan(newSlogan.trim() || DEFAULT_SLOGAN);
  };

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      <Hero
        displayedTodos={displayedTodos}
        activeTodos={activeTodos}
        trashTodos={trashTodos}
        inProgressTodos={inProgressTodos}
        completedTodos={completedTodos}
        filter={filter}
        slogan={slogan}
        onFilterChange={setFilter}
        onAddTodo={handleAddTodo}
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
        onMarkAllDone={handleMarkAllDone}
        onClearCompleted={handleClearCompleted}
        onClearAll={handleClearAll}
        onClearTrash={handleClearTrash}
        onSaveSlogan={handleSaveSlogan}
      />

      {/* Confirmation & Alert Modal */}
      <ConfirmModal
        dialog={dialog}
        onClose={() => setDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </main>
  );
};

export default Home;