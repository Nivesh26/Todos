import { useEffect } from "react";
import type { DialogState } from "../types/todo";

interface ConfirmModalProps {
  dialog: DialogState;
  onClose: () => void;
}

export const ConfirmModal = ({ dialog, onClose }: ConfirmModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (dialog.onCancel) dialog.onCancel();
        onClose();
      } else if (e.key === "Enter") {
        if (dialog.onConfirm) dialog.onConfirm();
        onClose();
      }
    };

    if (dialog.isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dialog, onClose]);

  if (!dialog.isOpen) return null;

  return (
    <div className="custom-alert-overlay" onClick={onClose}>
      <div
        className="popIn relative w-[90%] max-w-[420px] p-6 bg-[#F9F3E5] border-2 border-[#33322E] rounded-[12px] shadow-[6px_6px_0px_#33322E] text-[#33322E]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-xl font-extrabold mb-3 text-[#33322E] flex items-center gap-2">
          <span>{dialog.title}</span>
        </div>
        <div className="text-[15px] leading-relaxed mb-6 text-[#33322E]/90 font-medium whitespace-pre-line">
          {dialog.message}
        </div>
        <div className="flex justify-end gap-3">
          {dialog.type === "confirm" && (
            <button
              type="button"
              className="px-4 py-2 text-sm font-bold bg-[#F6A89E] border-2 border-[#33322E] rounded-[8px] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#33322E] active:translate-x-0 active:translate-y-0 transition-all cursor-pointer"
              onClick={() => {
                if (dialog.onCancel) dialog.onCancel();
                onClose();
              }}
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            className="px-5 py-2 text-sm font-bold bg-[#8CD4CB] border-2 border-[#33322E] rounded-[8px] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#33322E] active:translate-x-0 active:translate-y-0 transition-all cursor-pointer"
            onClick={() => {
              if (dialog.onConfirm) dialog.onConfirm();
              onClose();
            }}
            autoFocus
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
