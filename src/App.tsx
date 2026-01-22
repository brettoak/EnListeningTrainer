import { useState, useRef, useEffect } from 'react';
import { FileSelector, type FileSelectorHandle } from './components/FileSelector';
import { StudyTimer } from './components/StudyTimer';
import { MediaPlayer } from './components/MediaPlayer';
import { Controls } from './components/Controls';
import { NoteEditor } from './components/NoteEditor';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { useShortcuts } from './hooks/useShortcuts';
import { useSettings } from './hooks/useSettings';
import { matchesShortcut } from './utils/keyboardUtils';
import { Settings as SettingsModal } from './components/Settings';
import { Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function AppContent() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playerWidth, setPlayerWidth] = useState(100);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { shortcuts, updateShortcut, resetShortcuts } = useShortcuts();
  const { settings, updateSetting } = useSettings();

  const mediaRef = useRef<HTMLMediaElement>(null);
  const fileSelectorRef = useRef<FileSelectorHandle>(null);

  useEffect(() => {
    // Keyboard shortcuts
    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for global shortcuts (works everywhere including inputs if modifiers are used)
      // Check 1: Is user in an input/textarea/editor?
      const isInput = e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable;

      let matched = false;

      // Logic:
      // If we are in an input, we ONLY allow shortcuts that match our config AND have modifiers.
      // E.g. "Space" shouldn't trigger Play/Pause in editor. "Cmd+Space" should.
      // If we are NOT in an input, anything goes (including simple "Space").

      // Check configured shortcuts first
      if (matchesShortcut(e, shortcuts.rewind)) {
        // If in input, ensure it has modifiers to avoid blocking typing (e.g. valid text key)
        // Actually `matchesShortcut` checks exact modifier match.
        // If "ArrowLeft" is configured (no mod), and we are in input, we typically DO NOT want to trigger rewind.
        // Unless user explicitly set "ArrowLeft" as shortcut? 
        // Standard behavior: text inputs consume arrow keys.
        // So if isInput && shortcut has NO modifiers -> Skip. 
        // "Space" has no modifiers. "Cmd+Space" has modifiers.

        const hasModifier = e.metaKey || e.ctrlKey || e.altKey;
        if (!isInput || hasModifier) {
          handleRewind();
          matched = true;
        }
      }
      else if (matchesShortcut(e, shortcuts.forward)) {
        const hasModifier = e.metaKey || e.ctrlKey || e.altKey;
        if (!isInput || hasModifier) {
          handleForward();
          matched = true;
        }
      }
      else if (matchesShortcut(e, shortcuts.playPause)) {
        const hasModifier = e.metaKey || e.ctrlKey || e.altKey;
        if (!isInput || hasModifier) {
          togglePlay();
          matched = true;
        }
      }

      // Special Case: Space key when NOT in input (Convenience fallback)
      // If user hasn't configured Space as the shortcut but presses Space outside editor, we often want to toggle play.
      // This is the "separate space control" mentioned in requirements.
      // If matched=true already, we don't need this.
      if (!matched && !isInput && e.code === 'Space') {
        // Only if it doesn't conflict with some other shortcut? 
        // Play/Pause is the main one for Space.
        togglePlay();
        matched = true;
      }

      if (matched) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, shortcuts, duration]); // Added duration dependency for forward logic

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
      const newTime = Math.max(0, mediaRef.current.currentTime - settings.seekSeconds);
      mediaRef.current.currentTime = newTime;
    }
  };

  const handleForward = () => {
    if (mediaRef.current) {
      const newTime = Math.min((duration || 0), mediaRef.current.currentTime + settings.seekSeconds);
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
    <div className="max-w-[90%] mx-auto p-6 min-h-screen flex flex-col font-sans transition-colors duration-300">
      <header className="flex justify-between items-center mb-8 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300">
        <h1 className="text-xl font-bold text-slate-700 dark:text-slate-200 hidden md:block">{t('app.title')}</h1>
        <div className="flex gap-4 items-center flex-wrap justify-end flex-1">
          <FileSelector ref={fileSelectorRef} onFileSelect={handleFileSelect} selectedFileName={selectedFileName} />
          <StudyTimer />
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
            title={t('shortcuts.tooltip')}
          >
            <Settings size={20} />
          </button>
          <ThemeToggle />
        </div>
      </header>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        shortcuts={shortcuts}
        onUpdate={updateShortcut}
        onReset={resetShortcuts}
        settings={settings}
        onUpdateSetting={updateSetting}
      />

      <main className="flex-1 flex flex-col gap-6">
        <div
          className={`flex flex-col gap-0 rounded-2xl overflow-hidden shadow-lg bg-black/5 dark:bg-black/20 border border-slate-200 dark:border-slate-700 mx-auto relative group/player ${isDragging ? '' : 'transition-all duration-300 ease-out'}`}
          style={{ width: `${playerWidth}%` }}
        >
          {/* Resize Handle - Right */}
          <div
            className="absolute top-0 right-0 w-4 h-full cursor-col-resize z-50 flex items-center justify-center opacity-0 group-hover/player:opacity-100 hover:opacity-100 transition-opacity"
            onMouseDown={handleDragStart}
          >
            <div className="w-1.5 h-12 bg-slate-300 dark:bg-slate-600 rounded-full shadow-sm hover:bg-[#646cff] transition-colors"></div>
          </div>

          <MediaPlayer
            ref={mediaRef}
            file={file}
            onTimeUpdate={(t) => setCurrentTime(t)}
            onDurationChange={setDuration}
            onEnded={() => setIsPlaying(false)}
            onSelectFileClick={() => fileSelectorRef.current?.open()}
          />

          <div className={`bg-white dark:bg-slate-800 p-4 transition-colors duration-300 ${file && !file.type.startsWith('video/') ? '' : 'border-t border-slate-100 dark:border-slate-700'}`}>
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

      <footer className="text-center mt-12 mb-6 text-slate-400 dark:text-slate-500 text-sm">
        {t('app.copyright')}
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
