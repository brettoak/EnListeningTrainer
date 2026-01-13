import React from 'react';
// import './Controls.css'; // Removed for Tailwind migration

interface ControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onRewind: () => void;
  onForward: () => void;
  onToggleSize: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onSeek,
  onRewind,
  onForward,
  onToggleSize
}) => {
  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSeek(parseFloat(e.target.value));
  };

  const playedPercent = duration ? (currentTime / duration) * 100 : 0;

  return (

    <div className="flex items-center gap-4 w-full bg-white dark:bg-slate-800 p-2 rounded-lg transition-colors">

      {/* Controls Group */}
      <div className="flex items-center gap-3">
        <button
          className="text-slate-400 dark:text-slate-400 hover:text-[#646cff] dark:hover:text-[#a5b4fc] transition-colors p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700"
          onClick={onRewind}
          title="快退 5 秒"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 19 2 12 11 5 11 19"></polygon><polygon points="22 19 13 12 22 5 22 19"></polygon></svg>
        </button>

        <button
          className="bg-[#646cff] text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-[#535bf2] hover:scale-105 active:scale-95 transition-all outline-none dark:bg-[#535bf2] dark:hover:bg-[#4044c9]"
          onClick={onPlayPause}
          title="播放 / 暂停"
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          )}
        </button>

        <button
          className="text-slate-400 dark:text-slate-400 hover:text-[#646cff] dark:hover:text-[#a5b4fc] transition-colors p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700"
          onClick={onForward}
          title="快进 5 秒"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 19 22 12 13 5 13 19"></polygon><polygon points="2 19 11 12 2 5 2 19"></polygon></svg>
        </button>
      </div>

      {/* Time & Progress */}
      <div className="flex items-center gap-3 flex-1">
        <span className="font-mono text-xs text-slate-500 dark:text-slate-400 w-10 text-right font-medium">{formatTime(currentTime)}</span>

        <div className="relative flex-1 h-3 bg-slate-100 dark:bg-slate-600 rounded-full group cursor-pointer border border-slate-200 dark:border-slate-600">
          <div
            className="absolute top-0 left-0 h-full bg-[#646cff] dark:bg-[#535bf2] rounded-full transition-all duration-100"
            style={{ width: `${playedPercent}%` }}
          />
          <input
            type="range"
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={handleRangeChange}
          />
        </div>

        <span className="font-mono text-xs text-slate-500 dark:text-slate-400 w-10 font-medium">{formatTime(duration)}</span>

        <div className="w-px h-4 bg-slate-200 dark:bg-slate-600 mx-2"></div>

        <button
          className="text-slate-400 dark:text-slate-400 hover:text-[#646cff] dark:hover:text-[#a5b4fc] transition-colors p-1 rounded hover:bg-slate-50 dark:hover:bg-slate-700"
          onClick={onToggleSize}
          title="调整大小"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
        </button>
      </div>

    </div>
  );
};
