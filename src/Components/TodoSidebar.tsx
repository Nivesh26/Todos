import type { FilterType } from "../types/todo";

interface TodoSidebarProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  hasInProgress: boolean;
  hasCompleted: boolean;
  hasTodos: boolean;
  trashCount: number;
  onFinishAll: () => void;
  onClearCompleted: () => void;
  onClearAll: () => void;
  onClearTrash: () => void;
}

export const TodoSidebar = ({
  filter,
  onFilterChange,
  hasInProgress,
  hasCompleted,
  hasTodos,
  trashCount,
  onFinishAll,
  onClearCompleted,
  onClearAll,
  onClearTrash,
}: TodoSidebarProps) => {
  const hasBatchActions = hasInProgress || hasCompleted || hasTodos || trashCount > 0;

  return (
    <aside className="sidebar-container select-none z-30 w-full">
      <div className="w-full bg-white border-2 border-[#33322E] rounded-[12px] shadow-[4px_4px_0px_#33322E] overflow-hidden flex flex-col text-center">
        {/* Action Lists Container */}
        <div className="flex flex-col w-full text-sm">
          {/* Section 1: Filters */}
          <div className={`flex flex-col w-full ${hasBatchActions ? "border-b-2 border-[#33322E]" : ""}`}>
            <button
              type="button"
              onClick={() => onFilterChange("all")}
              className={`w-full py-2.5 px-3 text-xs md:text-sm font-semibold border-b border-[#33322E] transition-all cursor-pointer ${
                filter === "all"
                  ? "bg-[#ffd6e9] font-bold shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]"
                  : "bg-white hover:bg-[#ffd6e9]"
              }`}
            >
              All
            </button>

            <button
              type="button"
              onClick={() => onFilterChange("ongoing")}
              className={`w-full py-2.5 px-3 text-xs md:text-sm font-semibold border-b border-[#33322E] transition-all cursor-pointer ${
                filter === "ongoing"
                  ? "bg-[#f5d99e] font-bold shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]"
                  : "bg-white hover:bg-[#f5d99e]"
              }`}
            >
              In Progress
            </button>

            <button
              type="button"
              onClick={() => onFilterChange("completed")}
              className={`w-full py-2.5 px-3 text-xs md:text-sm font-semibold border-b border-[#33322E] transition-all cursor-pointer ${
                filter === "completed"
                  ? "bg-[#8CD4CB] font-bold shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]"
                  : "bg-white hover:bg-[#8CD4CB]"
              }`}
            >
              Completed
            </button>

            <button
              type="button"
              onClick={() => onFilterChange("removed")}
              className={`w-full py-2.5 px-3 text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                filter === "removed"
                  ? "bg-[#F6A89E] font-bold shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]"
                  : "bg-white hover:bg-[#F6A89E]"
              }`}
            >
              Trash {trashCount > 0 ? `(${trashCount})` : ""}
            </button>
          </div>

          {/* Section 2: Batch Actions */}
          {hasBatchActions && (
            <div className="flex flex-col w-full">
              {hasInProgress && (
                <button
                  type="button"
                  onClick={onFinishAll}
                  className="w-full py-2 px-3 text-xs md:text-sm font-medium border-b border-[#33322E] bg-white hover:bg-[#8CD4CB] transition-colors cursor-pointer"
                >
                  Finish all
                </button>
              )}

              {hasCompleted && (
                <button
                  type="button"
                  onClick={onClearCompleted}
                  className="w-full py-2 px-3 text-xs md:text-sm font-medium border-b border-[#33322E] bg-white hover:bg-[#F6A89E] transition-colors cursor-pointer"
                >
                  Clear Completed
                </button>
              )}

              {hasTodos && (
                <button
                  type="button"
                  onClick={onClearAll}
                  className={`w-full py-2 px-3 text-xs md:text-sm font-medium bg-white hover:bg-[#F6A89E] transition-colors cursor-pointer ${
                    trashCount > 0 ? "border-b border-[#33322E]" : ""
                  }`}
                >
                  Clear All
                </button>
              )}

              {trashCount > 0 && (
                <button
                  type="button"
                  onClick={onClearTrash}
                  className="w-full py-2 px-3 text-xs md:text-sm font-medium bg-white hover:bg-[#F6A89E] transition-colors cursor-pointer"
                >
                  Clear Trash
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
