import React, { useEffect, useState, useRef } from 'react';
// import './StudyTimer.css'; // Removed for Tailwind migration

export const StudyTimer: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getTodayKey = () => `study_timer_${new Date().toISOString().slice(0, 10)}`;

  useEffect(() => {
    const saved = localStorage.getItem(getTodayKey());
    if (saved) {
      setSeconds(parseInt(saved, 10));
    }
  }, []);

  useEffect(() => {
    if (!paused) {
      timerRef.current = setInterval(() => {
        setSeconds(s => {
          const next = s + 1;
          localStorage.setItem(getTodayKey(), next.toString());
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  const toggleTimer = () => setPaused(!paused);
  const resetTimer = () => {
    setSeconds(0);
    localStorage.setItem(getTodayKey(), '0');
    setPaused(true);
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-4 bg-white dark:bg-slate-800 px-4 py-2 rounded-md shadow-sm text-gray-800 dark:text-gray-200 transition-colors">
      <span className="text-[#646cff] dark:text-[#a5b4fc] font-bold text-lg">今日学习时长</span>
      <span className="font-mono text-2xl bg-[#e3edfa] dark:bg-slate-700 text-[#646cff] dark:text-[#a5b4fc] px-4 py-1 rounded-md tracking-wider transition-colors">{formatTime(seconds)}</span>
      <button
        className="bg-[#646cff] text-white border-none rounded-full w-8 h-8 text-base flex items-center justify-center shadow-sm hover:bg-[#535bf2] hover:scale-110 transition-transform dark:bg-[#535bf2] dark:hover:bg-[#4044c9]"
        onClick={toggleTimer}
        title={paused ? "开始" : "暂停"}
      >
        {paused ? '▶️' : '⏸️'}
      </button>
      <button
        className="bg-[#646cff] text-white border-none rounded-full w-8 h-8 text-base flex items-center justify-center shadow-sm hover:bg-[#535bf2] hover:scale-110 transition-transform dark:bg-[#535bf2] dark:hover:bg-[#4044c9]"
        onClick={resetTimer}
        title="重置"
      >
        🔄
      </button>
    </div>
  );
};
