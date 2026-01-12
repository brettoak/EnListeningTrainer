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
        <div className="flex flex-col gap-0 rounded-2xl overflow-hidden shadow-lg bg-black/5 border border-slate-200">
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
