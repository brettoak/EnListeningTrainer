import React, { forwardRef, useEffect } from 'react';
// import './MediaPlayer.css'; // Removed for Tailwind migration

interface MediaPlayerProps {
  file: File | null;
  onTimeUpdate: (currentTime: number) => void;
  onDurationChange: (duration: number) => void;
  onEnded: () => void;
  onSelectFileClick?: () => void;
}

export const MediaPlayer = forwardRef<HTMLMediaElement, MediaPlayerProps>(({
  file,
  onTimeUpdate,
  onDurationChange,
  onEnded,
  onSelectFileClick
}, ref) => {
  const isVideo = file?.type.startsWith('video/');
  const src = React.useMemo(() => {
    return file ? URL.createObjectURL(file) : undefined;
  }, [file]);

  useEffect(() => {
    return () => {
      if (src) URL.revokeObjectURL(src);
    };
  }, [src]);

  if (!file) {
    return (
      <div
        className="text-gray-500 dark:text-gray-400 italic m-8 cursor-pointer hover:text-[#646cff] dark:hover:text-[#535bf2] transition-colors select-none"
        onClick={onSelectFileClick}
        title="点击选择文件"
      >
        请选择文件开始
      </div>
    );
  }

  const commonProps = {
    ref: ref as React.Ref<any>,
    src,
    onTimeUpdate: (e: React.SyntheticEvent<HTMLMediaElement>) => onTimeUpdate(e.currentTarget.currentTime),
    onLoadedMetadata: (e: React.SyntheticEvent<HTMLMediaElement>) => onDurationChange(e.currentTarget.duration),
    onEnded,
    controls: false,
    className: isVideo
      ? 'w-full rounded-lg shadow-sm bg-black aspect-video object-contain'
      : 'w-full max-w-[600px] mx-auto'
  };

  return (
    <div className={`w-full bg-black/5 dark:bg-black/20 flex justify-center items-center ${isVideo ? 'p-0' : 'h-0 overflow-hidden'}`}>
      {isVideo ? (
        <video {...commonProps} />
      ) : (
        <audio {...commonProps} className="hidden" />
      )}
    </div>
  );
});

MediaPlayer.displayName = 'MediaPlayer';
