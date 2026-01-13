import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`
        p-2 rounded-lg transition-all duration-300
        ${theme === 'dark'
                    ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }
        hover:scale-105 active:scale-95 shadow-sm
      `}
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
            ) : (
                <Moon className="w-5 h-5" />
            )}
        </button>
    );
}
