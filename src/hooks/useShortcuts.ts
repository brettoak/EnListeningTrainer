import { useState, useEffect } from 'react';

export interface Shortcuts {
    playPause: string;
    forward: string;
    rewind: string;
}

const DEFAULT_SHORTCUTS: Shortcuts = {
    playPause: 'Space',
    forward: 'ArrowRight',
    rewind: 'ArrowLeft',
};

const STORAGE_KEY = 'listening_trainer_shortcuts';

export function useShortcuts() {
    const [shortcuts, setShortcuts] = useState<Shortcuts>(DEFAULT_SHORTCUTS);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setShortcuts(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse shortcuts', e);
            }
        }
    }, []);

    const updateShortcut = (action: keyof Shortcuts, code: string) => {
        setShortcuts(prev => {
            const next = { ...prev, [action]: code };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    };

    const resetShortcuts = () => {
        setShortcuts(DEFAULT_SHORTCUTS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SHORTCUTS));
    };

    return {
        shortcuts,
        updateShortcut,
        resetShortcuts
    };
}
