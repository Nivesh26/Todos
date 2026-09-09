import { useState, type KeyboardEvent } from "react";

interface TodoInputProps {
  onAdd: (title: string) => void;
}

export const TodoInput = ({ onAdd }: TodoInputProps) => {
  const [text, setText] = useState("");
  const [showError, setShowError] = useState(false);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setShowError(true);
      return;
    }
    setShowError(false);
    onAdd(trimmed);
    setText("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (showError && e.target.value.trim()) {
      setShowError(false);
    }
  };

  return (
    <div className="relative w-full mb-6">
      <div className="relative flex items-center">
        <input
          type="text"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Add a to-do item..."
          className={`w-full h-[64px] pl-5 pr-28 text-lg font-medium text-[#33322E] bg-white border-2 border-[#33322E] rounded-[12px] shadow-[4px_4px_0px_#33322E] focus:outline-none transition-all placeholder:text-[#33322E]/40 ${
            showError ? "empty-shake border-red-500" : ""
          }`}
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="absolute right-0 top-0 bottom-0 w-24 h-full bg-[#ffd6e9] border-l-2 border-[#33322E] rounded-r-[10px] text-lg font-bold text-[#33322E] hover:bg-[#ffbcd9] active:bg-[#ffaecf] transition-colors flex items-center justify-center cursor-pointer"
        >
          Add
        </button>
      </div>

      {showError && (
        <div className="mt-2 text-sm font-semibold text-red-500 pl-3 flex items-center gap-1.5 transition-all animate-bounce">
          <span>💡</span>
          <span>Please enter content!</span>
        </div>
      )}
    </div>
  );
};
