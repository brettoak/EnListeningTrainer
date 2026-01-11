import React, { forwardRef, useEffect } from 'react';
// import './MediaPlayer.css'; // Removed for Tailwind migration

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

  if (!file) return <div className="text-gray-500 italic m-8">Select a file to start</div>;

  const commonProps = {
    ref: ref as React.Ref<any>,
    src,
    onTimeUpdate: (e: React.SyntheticEvent<HTMLMediaElement>) => onTimeUpdate(e.currentTarget.currentTime),
    onLoadedMetadata: (e: React.SyntheticEvent<HTMLMediaElement>) => onDurationChange(e.currentTarget.duration),
    onEnded,
    controls: false,
    className: isVideo
      ? 'border-[3px] border-[#646cff] rounded-lg shadow-lg bg-black max-w-full max-h-[50vh] w-[600px]'
      : 'w-full max-w-[500px]'
  };

  return (
    <div className="flex justify-center items-center w-full p-4">
      {isVideo ? (
        <video {...commonProps} />
      ) : (
        <audio {...commonProps} />
      )}
    </div>
  );
});

MediaPlayer.displayName = 'MediaPlayer';
