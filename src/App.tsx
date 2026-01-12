import { useState, useRef, useEffect } from 'react';
import { FileSelector } from './components/FileSelector';
import { StudyTimer } from './components/StudyTimer';
import { MediaPlayer } from './components/MediaPlayer';
import { Controls } from './components/Controls';
import { NoteEditor } from './components/NoteEditor';
// import './App.css'; // Removed for Tailwind migration

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playerWidth, setPlayerWidth] = useState(100);

  const mediaRef = useRef<HTMLMediaElement>(null);

  // Load last file (stub for now, as File object persistence is tricky in web/electron strict)
  // In Electron, we can persist path and re-read.
  // We'd need IPC to read file from path.
  // For now, we rely on user selecting file again, or use 'electron' API if we enhanced.
  // But original requirement: "Select Audio/Video File".
  // Original app stored "lastFileName" but couldn't really reload the generic inputs file object automatically unless blob was stored (which expires).
  // Or maybe it used some other quirk.
  // In Electron we can use node fs. 
  // But let's stick to the File object from input for now to match Web API, 
  // unless we upgrade to using 'electron' remote/ipc for file opening.

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Numpad 2: Rewind
      if (e.code === 'Numpad2') {
        handleRewind();
        e.preventDefault();
      }
      // Numpad 3: Forward
      else if (e.code === 'Numpad3') {
        handleForward();
        e.preventDefault();
      }
      // Numpad Enter: Play/Pause
      else if (e.code === 'NumpadEnter') {
        togglePlay();
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setSelectedFileName(selectedFile.name);
    // Reset state
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const togglePlay = () => {
    if (!mediaRef.current) return;
    if (mediaRef.current.paused) {
      mediaRef.current.play();
      setIsPlaying(true);
    } else {
      mediaRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (time: number) => {
    if (mediaRef.current) {
      mediaRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleRewind = () => {
    if (mediaRef.current) {
      const newTime = Math.max(0, mediaRef.current.currentTime - 5);
      mediaRef.current.currentTime = newTime;
    }
  };

  const handleForward = () => {
    if (mediaRef.current) {
      const newTime = Math.min(duration || 0, mediaRef.current.currentTime + 5);
      mediaRef.current.currentTime = newTime;
    }
  };

  const [isDragging, setIsDragging] = useState(false);

  const togglePlayerWidth = () => {
    setPlayerWidth(prev => {
      if (prev === 100) return 80;
      if (prev === 80) return 60;
      return 100;
    });
  };

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const windowWidth = window.innerWidth;
      const mouseX = e.clientX;
      const center = windowWidth / 2;

      // Calculate new half-width (distance from center to mouse)
      // Assuming right handle: distance = mouseX - center
      const distanceFromCenter = Math.abs(mouseX - center);
      const newWidthPx = distanceFromCenter * 2;
      let newWidthPercent = (newWidthPx / windowWidth) * 100;

      // Clamp
      newWidthPercent = Math.max(30, Math.min(100, newWidthPercent));
      setPlayerWidth(newWidthPercent);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="max-w-[90%] mx-auto p-6 min-h-screen flex flex-col font-sans">
      <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <h1 className="text-xl font-bold text-slate-700 hidden md:block">英语听力训练</h1>
        <div className="flex gap-4 items-center flex-wrap justify-end flex-1">
          <FileSelector onFileSelect={handleFileSelect} selectedFileName={selectedFileName} />
          <StudyTimer />
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-6">
        <div
          className={`flex flex-col gap-0 rounded-2xl overflow-hidden shadow-lg bg-black/5 border border-slate-200 mx-auto relative group/player ${isDragging ? '' : 'transition-all duration-300 ease-out'}`}
          style={{ width: `${playerWidth}%` }}
        >
          {/* Resize Handle - Right */}
          <div
            className="absolute top-0 right-0 w-4 h-full cursor-col-resize z-50 flex items-center justify-center opacity-0 group-hover/player:opacity-100 hover:opacity-100 transition-opacity"
            onMouseDown={handleDragStart}
          >
            <div className="w-1.5 h-12 bg-slate-300 rounded-full shadow-sm hover:bg-[#646cff] transition-colors"></div>
          </div>

          <MediaPlayer
            ref={mediaRef}
            file={file}
            onTimeUpdate={(t) => setCurrentTime(t)}
            onDurationChange={setDuration}
            onEnded={() => setIsPlaying(false)}
          />

          <div className={`bg-white p-4 ${file && !file.type.startsWith('video/') ? '' : 'border-t border-slate-100'}`}>
            <Controls
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              onPlayPause={togglePlay}
              onSeek={handleSeek}
              onRewind={handleRewind}
              onForward={handleForward}
              onToggleSize={togglePlayerWidth}
            />
          </div>
        </div>

        <div className="w-full">
          <NoteEditor lastFileName={selectedFileName || undefined} />
        </div>
      </main>

      <footer className="text-center mt-12 mb-6 text-slate-400 text-sm">
        版权所有 © 2026 英语精听工具 保留所有权利
      </footer>
    </div>
  );
}

export default App;
