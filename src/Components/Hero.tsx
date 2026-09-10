import { useState } from "react";
import { TodoInput } from "./TodoInput";
import { TodoItemCard } from "./TodoItemCard";
import { TodoSidebar } from "./TodoSidebar";
import { Stopwatch } from "./Stopwatch";
import type { TodoItem, FilterType } from "../types/todo";

export interface HeroProps {
  displayedTodos: TodoItem[];
  activeTodos: TodoItem[];
  trashTodos: TodoItem[];
  inProgressTodos: TodoItem[];
  completedTodos: TodoItem[];
  filter: FilterType;
  slogan: string;
  onFilterChange: (filter: FilterType) => void;
  onAddTodo: (title: string) => void;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onRestore: (id: number) => void;
  onPermanentDelete: (id: number) => void;
  onEdit: (id: number, newTitle: string) => void;
  onMoveUp: (id: number) => void;
  onMoveDown: (id: number) => void;
  onDragStart: (id: number) => void;
  onDragOverItem: (id: number) => void;
  onDragEnd: () => void;
  onMarkAllDone: () => void;
  onClearCompleted: () => void;
  onClearAll: () => void;
  onClearTrash: () => void;
  onSaveSlogan: (newSlogan: string) => void;
}

export const Hero = ({
  displayedTodos,
  activeTodos,
  trashTodos,
  inProgressTodos,
  completedTodos,
  filter,
  slogan,
  onFilterChange,
  onAddTodo,
  onToggleComplete,
  onDelete,
  onRestore,
  onPermanentDelete,
  onEdit,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragOverItem,
  onDragEnd,
  onMarkAllDone,
  onClearCompleted,
  onClearAll,
  onClearTrash,
  onSaveSlogan,
}: HeroProps) => {
  // Local UI state for inline slogan editing
  const [isEditingSlogan, setIsEditingSlogan] = useState(false);
  const [tempSlogan, setTempSlogan] = useState("");

  const handleStartEditSlogan = () => {
    setTempSlogan(slogan);
    setIsEditingSlogan(true);
  };

  const handleCommitSlogan = () => {
    onSaveSlogan(tempSlogan);
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
        <TodoInput onAdd={onAddTodo} />
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
                onClick={onMarkAllDone}
                className="h-full px-4 text-xs md:text-sm font-bold bg-[#8CD4CB] text-[#33322E] border-r-2 border-[#33322E] hover:bg-[#72c2b8] transition-colors cursor-pointer whitespace-nowrap"
              >
                Mark All Done
              </button>
            )}

            {filter === "removed" && trashTodos.length > 0 && (
              <button
                type="button"
                onClick={onClearTrash}
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
                      if (e.key === "Enter") handleCommitSlogan();
                      if (e.key === "Escape") setIsEditingSlogan(false);
                    }}
                    autoFocus
                    className="w-full text-xs md:text-sm font-bold text-[#33322E] bg-[#F9F3E5] px-2 py-0.5 rounded outline-none border border-[#33322E]"
                  />
                  <button
                    type="button"
                    onClick={handleCommitSlogan}
                    className="px-2 py-0.5 text-xs font-bold bg-[#ffd6e9] border border-[#33322E] rounded cursor-pointer"
                  >
                    ✓
                  </button>
                </div>
              ) : (
                <div
                  onDoubleClick={handleStartEditSlogan}
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
                    onToggleComplete={onToggleComplete}
                    onDelete={onDelete}
                    onRestore={onRestore}
                    onPermanentDelete={onPermanentDelete}
                    onEdit={onEdit}
                    onMoveUp={onMoveUp}
                    onMoveDown={onMoveDown}
                    onDragStart={onDragStart}
                    onDragOverItem={onDragOverItem}
                    onDragEnd={onDragEnd}
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
            onFilterChange={onFilterChange}
            hasInProgress={inProgressTodos.length > 0}
            hasCompleted={completedTodos.length > 0}
            hasTodos={activeTodos.length > 0}
            trashCount={trashTodos.length}
            onFinishAll={onMarkAllDone}
            onClearCompleted={onClearCompleted}
            onClearAll={onClearAll}
            onClearTrash={onClearTrash}
          />
          <Stopwatch />
        </div>
      </div>
    </div>
  );
};

export default Hero;