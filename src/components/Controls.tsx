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

    <div className="flex flex-col items-center gap-2 p-4 bg-[#fafbfc] rounded-md text-gray-800">
      <div className="flex gap-2 mb-2">
        <button
          className="bg-[#646cff] text-white border-none rounded-full w-10 h-10 text-lg flex items-center justify-center shadow-sm hover:bg-[#535bf2] hover:scale-110 hover:shadow-md active:scale-95 transition-all outline-none"
          onClick={onRewind}
          title="Rewind 5 seconds"
        >
          ⏪
        </button>
        <button
          className="bg-[#646cff] text-white border-none rounded-full w-10 h-10 text-lg flex items-center justify-center shadow-sm hover:bg-[#535bf2] hover:scale-110 hover:shadow-md active:scale-95 transition-all outline-none"
          onClick={onPlayPause}
          title="Play / Pause"
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <button
          className="bg-[#646cff] text-white border-none rounded-full w-10 h-10 text-lg flex items-center justify-center shadow-sm hover:bg-[#535bf2] hover:scale-110 hover:shadow-md active:scale-95 transition-all outline-none"
          onClick={onForward}
          title="Forward 5 seconds"
        >
          ⏩
        </button>
      </div>

      <span className="font-mono text-sm text-gray-500">{formatTime(currentTime)}</span>

      <input
        type="range"
        className="writing-vertical-lr appearance-none w-8 h-[400px] my-4 bg-transparent cursor-pointer accent-[#646cff]"
        min="0"
        max={duration || 100}
        step="0.1"
        value={currentTime}
        onChange={handleRangeChange}
        style={{ '--played': `${playedPercent}%` } as React.CSSProperties}
      />

      <span className="font-mono text-sm text-gray-500">{formatTime(duration)}</span>
    </div>
  );
};
