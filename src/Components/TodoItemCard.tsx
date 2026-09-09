import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import type { TodoItem } from "../types/todo";

interface TodoItemCardProps {
  todo: TodoItem;
  index: number;
  isTrashView: boolean;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onRestore?: (id: number) => void;
  onPermanentDelete?: (id: number) => void;
  onEdit: (id: number, newTitle: string) => void;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDragEnd: () => void;
}

export const TodoItemCard = ({
  todo,
  index,
  isTrashView,
  onToggleComplete,
  onDelete,
  onRestore,
  onPermanentDelete,
  onEdit,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: TodoItemCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmed = editTitle.trim();
    if (trimmed) {
      onEdit(todo.id, trimmed);
    } else {
      onDelete(todo.id);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <li
      draggable={!isEditing && !isTrashView}
      onDragStart={() => onDragStart(index)}
      onDragEnter={() => onDragEnter(index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      className={`relative w-full mb-3.5 border-2 border-[#33322E] rounded-[12px] shadow-[4px_4px_0px_#33322E] hover:shadow-none transition-all duration-200 select-none overflow-hidden ${
        todo.completed ? "bg-[#D0F4F0]" : isTrashView ? "bg-[#FFF0EE]" : "bg-[#F9F3E5]"
      }`}
    >
      {isEditing ? (
        <div className="relative w-full flex items-center min-h-[58px] px-14 py-2">
          <input
            ref={inputRef}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full text-base font-semibold text-[#33322E] bg-transparent border-none outline-none"
            placeholder="Edit task..."
          />
          <button
            type="button"
            onClick={handleSave}
            title="Save changes"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-[8px] bg-[#ffd6e9] border-2 border-[#33322E] flex items-center justify-center cursor-pointer hover:shadow-[2px_2px_0px_#33322E] hover:-translate-y-[calc(50%+2px)] transition-all"
          >
            <svg width="15" height="15" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.5084 10.3109C17.2324 10.5823 18.0394 10.2155 18.3109 9.49157C18.5823 8.7676 18.2155 7.96063 17.4916 7.68914L16.5084 10.3109ZM8.9999 2L10.1321 1.17655C9.8558 0.796618 9.40735 0.580605 8.93802 0.601368C8.4687 0.62213 8.04107 0.876899 7.79938 1.27974L8.9999 2ZM7.67175 17.5572C7.42722 18.2907 7.82362 19.0836 8.55713 19.3281C9.29064 19.5727 10.0835 19.1763 10.328 18.4428L7.67175 17.5572ZM1.09963 7.92793C0.507541 8.42519 0.430669 9.30828 0.927931 9.90037C1.42519 10.4925 2.30828 10.5693 2.90037 10.0721L1.09963 7.92793ZM17.4916 7.68914C15.8023 7.05565 13.9841 5.5036 12.5099 3.96795C11.793 3.22122 11.1939 2.5174 10.7744 2.00056C10.5651 1.74269 10.4017 1.53276 10.2919 1.38908C10.237 1.31727 10.1956 1.26211 10.1686 1.2259C10.1551 1.2078 10.1453 1.19444 10.1391 1.18612C10.1361 1.18195 10.134 1.17905 10.1328 1.17744C10.1322 1.17664 10.1318 1.17616 10.1317 1.17601C10.1317 1.17593 10.1317 1.17594 10.1317 1.17603C10.1318 1.17607 10.1319 1.1762 10.1319 1.17623C10.132 1.17637 10.1321 1.17655 8.9999 2C7.86767 2.82345 7.86783 2.82367 7.868 2.8239C7.86808 2.82401 7.86826 2.82426 7.86842 2.82447C7.86872 2.8249 7.86909 2.8254 7.86953 2.82599C7.87039 2.82718 7.8715 2.82869 7.87285 2.83054C7.87554 2.83423 7.87922 2.83924 7.88385 2.84553C7.8931 2.85811 7.90619 2.87582 7.92298 2.89837C7.95656 2.94345 8.00499 3.00792 8.0673 3.08944C8.19185 3.25239 8.37217 3.48387 8.60038 3.76506C9.05593 4.32635 9.70685 5.09128 10.49 5.90705C12.0158 7.4964 14.1977 9.44435 16.5084 10.3109L17.4916 7.68914ZM7.61397 2.19801C8.10669 5.64669 8.34997 8.82926 8.34997 11.5C8.34997 14.2015 8.10014 16.2722 7.67175 17.5572L10.328 18.4428C10.8998 16.7278 11.15 14.2986 11.15 11.5C11.15 8.67076 10.8932 5.35331 10.3858 1.80199L7.61397 2.19801ZM2.90037 10.0721C3.88228 9.24742 5.29636 8.09033 6.64379 6.8301C7.97664 5.58352 9.34587 4.14458 10.2004 2.72026L7.79938 1.27974C7.15402 2.35542 6.02331 3.57663 4.73118 4.78513C3.45364 5.97998 2.11772 7.07289 1.09963 7.92793L2.90037 10.0721Z"
                fill="#33322E"
              />
            </svg>
          </button>
        </div>
      ) : (
        <div
          className="relative min-h-[58px] px-14 py-4 cursor-pointer flex items-center"
          onDoubleClick={() => !isTrashView && setIsEditing(true)}
        >
          {/* Toggle Complete Button */}
          {!isTrashView && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete(todo.id);
              }}
              title={todo.completed ? "Mark as in progress" : "Mark as completed"}
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-[30px] h-[30px] rounded-full border-2 border-[#33322E] flex items-center justify-center transition-all cursor-pointer ${
                todo.completed
                  ? "bg-[#8CD4CB] shadow-[-2px_2px_0px_#33322E]"
                  : "bg-white hover:bg-[#8CD4CB] hover:shadow-[-2px_2px_0px_#33322E]"
              }`}
            >
              {todo.completed && (
                <svg width="20" height="15" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2.36317 9.67506C1.55939 9.47449 0.745204 9.96348 0.544629 10.7673C0.344054 11.571 0.833047 12.3852 1.63683 12.5858L2.36317 9.67506ZM8.15873 16L6.78041 16.5918C7.03098 17.1754 7.62195 17.5379 8.25575 17.4969C8.88954 17.4558 9.42877 17.02 9.60191 16.4089L8.15873 16ZM22.3261 3.46413C23.1347 3.28406 23.6442 2.48257 23.4641 1.67395C23.2841 0.865328 22.4826 0.355791 21.6739 0.535866L22.3261 3.46413ZM1.63683 12.5858C2.02764 12.6833 3.12299 13.151 4.2778 13.9426C5.43988 14.7393 6.38906 15.6803 6.78041 16.5918L9.53705 15.4082C8.81094 13.7171 7.30157 12.3783 5.97406 11.4682C4.63927 10.5532 3.21399 9.88738 2.36317 9.67506L1.63683 12.5858ZM9.60191 16.4089C10.1359 14.5244 11.4948 11.6585 13.6727 9.06395C15.8445 6.47675 18.7417 4.26235 22.3261 3.46413L21.6739 0.535866C17.2583 1.5192 13.8275 4.21342 11.3749 7.13514C8.92852 10.0495 7.36674 13.2929 6.71555 15.5911L9.60191 16.4089Z"
                    fill="#33322E"
                  />
                </svg>
              )}
            </button>
          )}

          {/* Title Text */}
          <div
            className={`text-base font-semibold leading-relaxed break-words pr-2 ${
              todo.completed ? "line-through text-[#33322E]/60" : "text-[#33322E]"
            }`}
          >
            {todo.title}
          </div>

          {/* Right Action: Delete or Restore */}
          {isTrashView ? (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onRestore) onRestore(todo.id);
                }}
                title="Restore todo"
                className="w-[30px] h-[30px] rounded-[8px] bg-white border-2 border-[#33322E] flex items-center justify-center cursor-pointer hover:bg-[#8CD4CB] hover:shadow-[2px_2px_0px_#33322E] hover:-translate-y-0.5 transition-all"
              >
                <svg width="15" height="15" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7.34798 2.65792C7.71134 1.91344 7.40238 1.01535 6.6579 0.651988C5.91341 0.288627 5.01532 0.59759 4.65196 1.34208L7.34798 2.65792ZM1.526 9.08333L0.375571 8.12078C0.0779516 8.47649 -0.038382 8.94987 0.0604612 9.40301C0.159304 9.85615 0.462206 10.2381 0.880924 10.4375L1.526 9.08333ZM14.5724 16.5893C14.3456 17.386 14.8076 18.2158 15.6044 18.4426C16.4012 18.6694 17.231 18.2073 17.4578 17.4106L14.5724 16.5893ZM6.25192 14.3321C6.71145 15.0213 7.64276 15.2076 8.33205 14.7481C9.02134 14.2885 9.2076 13.3572 8.74808 12.6679L6.25192 14.3321ZM4.65196 1.34208C3.6766 3.34047 2.60033 5.04525 1.76658 6.25108C1.35059 6.85272 0.997263 7.32685 0.750384 7.64762C0.627005 7.80793 0.530392 7.9297 0.466047 8.00969C0.43388 8.04967 0.409796 8.0792 0.394482 8.09786C0.386826 8.10718 0.381364 8.11379 0.378183 8.11763C0.376592 8.11955 0.375572 8.12077 0.375133 8.1213C0.374914 8.12157 0.37484 8.12165 0.374912 8.12157C0.374948 8.12152 0.375021 8.12144 0.375131 8.1213C0.375186 8.12124 0.375296 8.12111 0.375323 8.12107C0.375442 8.12093 0.375571 8.12078 1.526 9.08333C2.67643 10.0459 2.67658 10.0457 2.67673 10.0455C2.6768 10.0454 2.67696 10.0452 2.67709 10.0451C2.67735 10.0448 2.67765 10.0444 2.67798 10.044C2.67865 10.0432 2.67946 10.0423 2.68042 10.0411C2.68234 10.0388 2.68486 10.0358 2.68794 10.032C2.69412 10.0246 2.70261 10.0143 2.71333 10.0013C2.73475 9.97516 2.76508 9.93795 2.80362 9.89005C2.88067 9.79426 2.9906 9.65561 3.12778 9.47738C3.40201 9.12106 3.78587 8.60562 4.23417 7.95725C5.129 6.66308 6.28972 4.8262 7.34798 2.65792L4.65196 1.34208ZM2.04704 10.4899C3.77617 9.84942 5.73319 9.17231 7.638 8.72137C9.57008 8.26399 11.3025 8.07631 12.6288 8.3017C13.8752 8.51352 14.6284 9.05008 15.0163 10.0405C15.4628 11.1807 15.5383 13.1956 14.5724 16.5893L17.4578 17.4106C18.4843 13.8042 18.6166 11.0067 17.8097 8.94646C16.9442 6.73634 15.1337 5.68437 13.1314 5.34411C11.2092 5.01743 9.00799 5.31413 6.9469 5.80206C4.85856 6.29644 2.76283 7.02558 1.00496 7.67673L2.04704 10.4899ZM8.74808 12.6679C7.52312 10.8305 5.22934 9.18593 2.17108 7.72913L0.880924 10.4375C3.77066 11.8141 5.47688 13.1695 6.25192 14.3321L8.74808 12.6679Z"
                    fill="#33322E"
                  />
                </svg>
              </button>
              {onPermanentDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPermanentDelete(todo.id);
                  }}
                  title="Delete permanently"
                  className="w-[30px] h-[30px] rounded-[8px] bg-white border-2 border-[#33322E] flex items-center justify-center cursor-pointer hover:bg-[#F6A89E] hover:shadow-[2px_2px_0px_#33322E] hover:-translate-y-0.5 transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M15.0993 17.7597C15.7949 18.2098 16.7235 18.0108 17.1736 17.3152C17.6236 16.6197 17.4246 15.6911 16.7291 15.241C13.3079 13.0273 10.8209 10.9959 8.92251 9.03739C9.09742 8.84982 9.27291 8.66571 9.44888 8.48534C11.8864 5.98692 14.2472 4.38066 16.2944 3.97122C17.1067 3.80875 17.6335 3.01852 17.4711 2.20618C17.3086 1.39384 16.5184 0.867013 15.706 1.02948C12.7532 1.62005 9.86406 3.76379 7.30154 6.39037C7.18151 6.5134 7.06181 6.63789 6.94249 6.76375C5.42001 4.80433 4.37058 2.87632 3.42591 0.863164C3.07399 0.113202 2.18073 -0.209475 1.43077 0.142445C0.680809 0.494365 0.358132 1.38762 0.710051 2.13758C1.82088 4.50481 3.07899 6.76511 4.92932 9.05306C3.22206 11.1341 1.62669 13.4328 0.222723 15.7142C-0.211453 16.4197 0.00852752 17.3437 0.714064 17.7778C1.4196 18.212 2.34352 17.992 2.7777 17.2865C4.04819 15.222 5.46405 13.1726 6.95559 11.3168C8.985 13.3765 11.5959 15.4928 15.0993 17.7597Z"
                      fill="#33322E"
                    />
                  </svg>
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(todo.id);
              }}
              title="Delete item"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-[30px] h-[30px] rounded-[8px] bg-white border-2 border-[#33322E] flex items-center justify-center cursor-pointer hover:bg-[#F6A89E] hover:shadow-[2px_2px_0px_#33322E] hover:-translate-y-[calc(50%+2px)] transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.0993 17.7597C15.7949 18.2098 16.7235 18.0108 17.1736 17.3152C17.6236 16.6197 17.4246 15.6911 16.7291 15.241C13.3079 13.0273 10.8209 10.9959 8.92251 9.03739C9.09742 8.84982 9.27291 8.66571 9.44888 8.48534C11.8864 5.98692 14.2472 4.38066 16.2944 3.97122C17.1067 3.80875 17.6335 3.01852 17.4711 2.20618C17.3086 1.39384 16.5184 0.867013 15.706 1.02948C12.7532 1.62005 9.86406 3.76379 7.30154 6.39037C7.18151 6.5134 7.06181 6.63789 6.94249 6.76375C5.42001 4.80433 4.37058 2.87632 3.42591 0.863164C3.07399 0.113202 2.18073 -0.209475 1.43077 0.142445C0.680809 0.494365 0.358132 1.38762 0.710051 2.13758C1.82088 4.50481 3.07899 6.76511 4.92932 9.05306C3.22206 11.1341 1.62669 13.4328 0.222723 15.7142C-0.211453 16.4197 0.00852752 17.3437 0.714064 17.7778C1.4196 18.212 2.34352 17.992 2.7777 17.2865C4.04819 15.222 5.46405 13.1726 6.95559 11.3168C8.985 13.3765 11.5959 15.4928 15.0993 17.7597Z"
                  fill="#33322E"
                />
              </svg>
            </button>
          )}
        </div>
      )}
    </li>
  );
};
