import React, { useEffect, useState, useRef } from 'react';
import './StudyTimer.css';

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
    <div className="study-timer">
      <span className="timer-label">Today's Study</span>
      <span className="timer-display">{formatTime(seconds)}</span>
      <button className="timer-btn" onClick={toggleTimer} title={paused ? "Start" : "Pause"}>
        {paused ? '▶️' : '⏸️'}
      </button>
      <button className="timer-btn" onClick={resetTimer} title="Reset">
        🔄
      </button>
    </div>
  );
};
