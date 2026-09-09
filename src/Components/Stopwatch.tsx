import { useState, useEffect } from "react";

interface LapItem {
  lapNumber: number;
  time: string;
}

export const Stopwatch = () => {
  // Pure in-memory state: resets to 0 and empty laps on page refresh
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<LapItem[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const handleLap = () => {
    if (seconds === 0) return;
    const newLap: LapItem = {
      lapNumber: laps.length + 1,
      time: formatTime(seconds),
    };
    setLaps((prev) => [...prev, newLap]);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
    setLaps([]);
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
    <div className="w-full bg-white border-2 border-[#33322E] rounded-[12px] shadow-[4px_4px_0px_#33322E] overflow-hidden flex flex-col text-center select-none transition-all">
      {/* Header Bar with Collapse Toggle */}
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full py-2 px-3 bg-[#f5d99e] border-b-2 border-[#33322E] font-bold text-xs md:text-sm text-[#33322E] flex items-center justify-between cursor-pointer hover:bg-[#edd090] transition-colors"
      >
        <div className="flex items-center gap-1.5">
          <span>⏱️</span>
          <span>Stopwatch</span>
        </div>
        <span className="text-xs font-black">{isCollapsed ? "▼" : "▲"}</span>
      </div>

      {/* Minimized Quick Preview */}
      {isCollapsed ? (
        <div className="flex items-center justify-between p-2.5 bg-[#F9F3E5]">
          <span className="font-mono text-base font-black text-[#33322E] tracking-wider">
            {formatTime(seconds)}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleStartPause();
            }}
            className={`px-2.5 py-1 text-xs font-bold border-2 border-[#33322E] rounded-[6px] shadow-[1px_1px_0px_#33322E] hover:shadow-none transition-all cursor-pointer ${
              isRunning ? "bg-[#ffd6e9]" : "bg-[#8CD4CB]"
            }`}
          >
            {isRunning ? "⏸" : "▶"}
          </button>
        </div>
      ) : (
        /* Expanded Full Controls & Display */
        <div className="p-3 flex flex-col items-center bg-white">
          {/* Time Display */}
          <div className="w-full py-2.5 px-2 mb-3 bg-[#F9F3E5] border-2 border-[#33322E] rounded-[8px] text-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
            <span className="font-mono text-3xl font-black text-[#33322E] tracking-wider block">
              {formatTime(seconds)}
            </span>
          </div>

          {/* Primary Action: Play / Pause */}
          <button
            type="button"
            onClick={handleStartPause}
            className={`w-full py-2 px-3 mb-2 text-xs md:text-sm font-bold border-2 border-[#33322E] rounded-[8px] shadow-[2px_2px_0px_#33322E] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#33322E] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              isRunning
                ? "bg-[#ffd6e9] hover:bg-[#ffbcd9]"
                : "bg-[#8CD4CB] hover:bg-[#78cdb8]"
            }`}
          >
            <span>{isRunning ? "⏸ Pause" : "▶ Play"}</span>
          </button>

          {/* Secondary Actions: Lap and Reset */}
          <div className="grid grid-cols-2 gap-2 w-full">
            <button
              type="button"
              onClick={handleLap}
              disabled={seconds === 0}
              className={`py-1.5 px-2 text-xs font-bold border-2 border-[#33322E] rounded-[8px] transition-all flex items-center justify-center gap-1 ${
                seconds === 0
                  ? "bg-stone-100 opacity-40 cursor-not-allowed"
                  : "bg-[#f5d99e] hover:bg-[#edd090] shadow-[2px_2px_0px_#33322E] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#33322E] active:translate-x-0 active:translate-y-0 active:shadow-none cursor-pointer"
              }`}
            >
              <span>🚩 Lap</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={seconds === 0 && !isRunning && laps.length === 0}
              className={`py-1.5 px-2 text-xs font-bold border-2 border-[#33322E] rounded-[8px] transition-all flex items-center justify-center gap-1 ${
                seconds === 0 && !isRunning && laps.length === 0
                  ? "bg-stone-100 opacity-40 cursor-not-allowed"
                  : "bg-[#F6A89E] hover:bg-[#f39589] shadow-[2px_2px_0px_#33322E] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#33322E] active:translate-x-0 active:translate-y-0 active:shadow-none cursor-pointer"
              }`}
            >
              <span>↺ Reset</span>
            </button>
          </div>

          {/* Laps List */}
          {laps.length > 0 && (
            <div className="w-full mt-3 border-2 border-[#33322E] rounded-[8px] overflow-hidden bg-[#F9F3E5]">
              <div className="flex justify-between items-center px-2 py-1 bg-[#8CD4CB]/30 border-b border-[#33322E] text-[10px] font-extrabold text-[#33322E] uppercase tracking-wider">
                <span>Lap</span>
                <span>Time</span>
              </div>
              <div className="max-h-[110px] overflow-y-auto divide-y divide-[#33322E]/20 text-left">
                {laps.map((lap) => (
                  <div
                    key={lap.lapNumber}
                    className="flex justify-between items-center px-2 py-1 text-xs font-semibold text-[#33322E] hover:bg-white/60 transition-colors"
                  >
                    <span className="font-bold text-[#33322E]/80">#{lap.lapNumber}</span>
                    <span className="font-mono font-black">{lap.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
