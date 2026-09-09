import { useState, useEffect } from "react";

export const Stopwatch = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  // Format MM:SS (or HH:MM:SS if >= 1 hour)
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const pad = (num: number) => String(num).padStart(2, "0");

    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  return (
    <div className="w-full max-w-[360px] mt-8 bg-white border-2 border-[#33322E] rounded-[12px] shadow-[4px_4px_0px_#33322E] p-4 flex flex-col items-center select-none">
      {/* Title */}
      <div className="text-xs font-extrabold text-[#33322E] tracking-wider uppercase mb-2 flex items-center gap-1.5">
        <span>⏱️</span>
        <span>Stopwatch</span>
      </div>

      {/* Time Display */}
      <div className="w-full py-3 px-4 mb-4 bg-[#F9F3E5] border-2 border-[#33322E] rounded-[8px] text-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
        <span className="font-mono text-4xl md:text-5xl font-black text-[#33322E] tracking-widest">
          {formatTime(seconds)}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 w-full">
        <button
          type="button"
          onClick={handleStartPause}
          className={`flex-1 py-2.5 px-4 text-sm font-bold border-2 border-[#33322E] rounded-[8px] shadow-[2px_2px_0px_#33322E] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#33322E] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            isRunning ? "bg-[#ffd6e9] hover:bg-[#ffbcd9]" : "bg-[#8CD4CB] hover:bg-[#78cdb8]"
          }`}
        >
          <span>{isRunning ? "⏸ Pause" : "▶ Play"}</span>
        </button>

        <button
          type="button"
          onClick={handleReset}
          disabled={seconds === 0 && !isRunning}
          className={`py-2.5 px-4 text-sm font-bold border-2 border-[#33322E] rounded-[8px] transition-all flex items-center justify-center gap-1.5 ${
            seconds === 0 && !isRunning
              ? "bg-stone-100 opacity-40 cursor-not-allowed"
              : "bg-[#F6A89E] hover:bg-[#f39589] shadow-[2px_2px_0px_#33322E] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#33322E] active:translate-x-0 active:translate-y-0 active:shadow-none cursor-pointer"
          }`}
        >
          <span>↺ Reset</span>
        </button>
      </div>
    </div>
  );
};
