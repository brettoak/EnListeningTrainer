import React from 'react';
import './Controls.css';

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
    <div className="controls-container">
      <div className="buttons-row">
        <button className="player-btn" onClick={onRewind} title="Rewind 5 seconds">⏪</button>
        <button className="player-btn play-pause" onClick={onPlayPause} title="Play / Pause">
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <button className="player-btn" onClick={onForward} title="Forward 5 seconds">⏩</button>
      </div>

      <span className="time-display">{formatTime(currentTime)}</span>
      
      <input
        type="range"
        className="progress-bar"
        min="0"
        max={duration || 100}
        step="0.1"
        value={currentTime}
        onChange={handleRangeChange}
        style={{ '--played': `${playedPercent}%` } as React.CSSProperties}
      />
      
      <span className="time-display">{formatTime(duration)}</span>
    </div>
  );
};
