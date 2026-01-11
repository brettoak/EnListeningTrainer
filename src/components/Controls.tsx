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
}

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onSeek,
  onRewind,
  onForward
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

    <div className="flex flex-col gap-2 w-full">
      {/* Progress Bar Row */}
      <div className="flex items-center gap-4 w-full">
        <span className="font-mono text-xs text-slate-400 w-10 text-right">{formatTime(currentTime)}</span>

        <div className="relative flex-1 h-2 bg-slate-100 rounded-full group cursor-pointer">
          <div
            className="absolute top-0 left-0 h-full bg-[#646cff] rounded-full"
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

        <span className="font-mono text-xs text-slate-400 w-10">{formatTime(duration)}</span>
      </div>

      {/* Controls Row */}
      <div className="flex justify-center items-center gap-6 mt-2">
        <button
          className="text-slate-400 hover:text-[#646cff] transition-colors p-2 rounded-full hover:bg-slate-50"
          onClick={onRewind}
          title="Rewind 5 seconds"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 19 2 12 11 5 11 19"></polygon><polygon points="22 19 13 12 22 5 22 19"></polygon></svg>
        </button>

        <button
          className="bg-[#646cff] text-white rounded-full w-12 h-12 flex items-center justify-center shadow-md hover:bg-[#535bf2] hover:scale-105 active:scale-95 transition-all outline-none"
          onClick={onPlayPause}
          title="Play / Pause"
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          )}
        </button>

        <button
          className="text-slate-400 hover:text-[#646cff] transition-colors p-2 rounded-full hover:bg-slate-50"
          onClick={onForward}
          title="Forward 5 seconds"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 19 22 12 13 5 13 19"></polygon><polygon points="2 19 11 12 2 5 2 19"></polygon></svg>
        </button>
      </div>
    </div>
  );
};
