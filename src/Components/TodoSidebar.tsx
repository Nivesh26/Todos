import { useState } from "react";
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
  onExport: () => void;
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
  onExport,
}: TodoSidebarProps) => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  return (
    <aside
      className={`sidebar-container transition-all select-none z-30 ${
        isOpenMobile ? "fixed bottom-4 right-4 md:static" : "fixed bottom-4 right-4 md:static"
      }`}
    >
      <div className="w-[140px] md:w-[150px] bg-white border-2 border-[#33322E] rounded-[12px] shadow-[4px_4px_0px_#33322E] overflow-hidden flex flex-col text-center">
        {/* Shortcut Header / Mobile toggle */}
        <button
          type="button"
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="w-full py-2.5 px-3 bg-[#8CD4CB] border-b-2 border-[#33322E] font-bold text-sm text-[#33322E] flex items-center justify-center gap-1.5 cursor-pointer md:cursor-default"
        >
          <span>{isOpenMobile ? "CLOSE ✕" : "Quicks ✨"}</span>
        </button>

        {/* Action Lists Container */}
        <div className={`${isOpenMobile ? "flex" : "hidden md:flex"} flex-col w-full text-sm`}>
          {/* Section 1: Filters */}
          <div className="flex flex-col w-full border-b-2 border-[#33322E]">
            <button
              type="button"
              onClick={() => onFilterChange("all")}
              className={`w-full py-2 px-3 text-xs md:text-sm font-semibold border-b border-[#33322E] transition-all cursor-pointer ${
                filter === "all"
                  ? "bg-[#ffd6e9] font-bold -translate-x-0.5 -translate-y-0.5 shadow-[2px_2px_0px_#33322E]"
                  : "bg-white hover:bg-[#ffd6e9]"
              }`}
            >
              All
            </button>

            <button
              type="button"
              onClick={() => onFilterChange("ongoing")}
              className={`w-full py-2 px-3 text-xs md:text-sm font-semibold border-b border-[#33322E] transition-all cursor-pointer ${
                filter === "ongoing"
                  ? "bg-[#f5d99e] font-bold -translate-x-0.5 -translate-y-0.5 shadow-[2px_2px_0px_#33322E]"
                  : "bg-white hover:bg-[#f5d99e]"
              }`}
            >
              In Progress
            </button>

            <button
              type="button"
              onClick={() => onFilterChange("completed")}
              className={`w-full py-2 px-3 text-xs md:text-sm font-semibold border-b border-[#33322E] transition-all cursor-pointer ${
                filter === "completed"
                  ? "bg-[#8CD4CB] font-bold -translate-x-0.5 -translate-y-0.5 shadow-[2px_2px_0px_#33322E]"
                  : "bg-white hover:bg-[#8CD4CB]"
              }`}
            >
              Completed
            </button>

            <button
              type="button"
              onClick={() => onFilterChange("removed")}
              className={`w-full py-2 px-3 text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                filter === "removed"
                  ? "bg-[#F6A89E] font-bold -translate-x-0.5 -translate-y-0.5 shadow-[2px_2px_0px_#33322E]"
                  : "bg-white hover:bg-[#F6A89E]"
              }`}
            >
              Trash {trashCount > 0 ? `(${trashCount})` : ""}
            </button>
          </div>

          {/* Section 2: Batch Actions */}
          <div className="flex flex-col w-full border-b-2 border-[#33322E]">
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

          {/* Section 3: Data Save */}
          <div className="flex flex-col w-full">
            <button
              type="button"
              onClick={onExport}
              className="w-full py-2 px-3 text-xs md:text-sm font-medium bg-white hover:bg-[#f8d966] transition-colors cursor-pointer"
            >
              Export data
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
