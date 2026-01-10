import React, { forwardRef, useEffect } from 'react';
import './MediaPlayer.css';

interface MediaPlayerProps {
  file: File | null;
  onTimeUpdate: (currentTime: number) => void;
  onDurationChange: (duration: number) => void;
  onEnded: () => void;
}

export const MediaPlayer = forwardRef<HTMLMediaElement, MediaPlayerProps>(({ 
  file, 
  onTimeUpdate, 
  onDurationChange,
  onEnded 
}, ref) => {
  const isVideo = file?.type.startsWith('video/');
  const src = file ? URL.createObjectURL(file) : undefined;

  useEffect(() => {
    return () => {
      if (src) URL.revokeObjectURL(src);
    };
  }, [src]);

  if (!file) return <div className="media-placeholder">Select a file to start</div>;

  const commonProps = {
    ref: ref as React.Ref<any>,
    src,
    onTimeUpdate: (e: React.SyntheticEvent<HTMLMediaElement>) => onTimeUpdate(e.currentTarget.currentTime),
    onLoadedMetadata: (e: React.SyntheticEvent<HTMLMediaElement>) => onDurationChange(e.currentTarget.duration),
    onEnded,
    controls: false,
    className: isVideo ? 'media-video' : 'media-audio'
  };

  return (
    <div className="media-container">
      {isVideo ? (
        <video {...commonProps} />
      ) : (
        <audio {...commonProps} />
      )}
    </div>
  );
});

MediaPlayer.displayName = 'MediaPlayer';
