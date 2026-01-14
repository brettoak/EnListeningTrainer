import React, { useState, useEffect } from 'react';
import { type Shortcuts } from '../hooks/useShortcuts';
import { X } from 'lucide-react';

interface ShortcutSettingsProps {
    isOpen: boolean;
    onClose: () => void;
    shortcuts: Shortcuts;
    onUpdate: (action: keyof Shortcuts, code: string) => void;
    onReset: () => void;
}

export const ShortcutSettings: React.FC<ShortcutSettingsProps> = ({
    isOpen,
    onClose,
    shortcuts,
    onUpdate,
    onReset
}) => {
    const [listeningFor, setListeningFor] = useState<keyof Shortcuts | null>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (listeningFor) {
                e.preventDefault();
                e.stopPropagation();
                onUpdate(listeningFor, e.code);
                setListeningFor(null);
            } else if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown, { capture: true });
        }
        return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
    }, [isOpen, listeningFor, onUpdate, onClose]);

    if (!isOpen) return null;

    const actions: { key: keyof Shortcuts; label: string }[] = [
        { key: 'playPause', label: '播放 / 暂停' },
        { key: 'rewind', label: '快退 (5秒)' },
        { key: 'forward', label: '快进 (5秒)' },
    ];

    const formatKey = (code: string) => {
        if (code.startsWith('Key')) return code.slice(3);
        if (code.startsWith('Digit')) return code.slice(5);
        if (code.startsWith('Numpad')) return 'Num ' + code.slice(6);
        if (code === 'Space') return 'Space';
        return code;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">快捷键设置</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-4">
                    {actions.map(({ key, label }) => (
                        <div key={key} className="flex justify-between items-center bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                            <span className="text-slate-600 dark:text-slate-300 font-medium">{label}</span>
                            <button
                                className={`px-4 py-2 rounded-lg font-mono text-sm border transition-all min-w-[120px] text-center
                  ${listeningFor === key
                                        ? 'bg-[#646cff] border-[#646cff] text-white animate-pulse'
                                        : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-[#646cff] dark:hover:border-[#535bf2]'
                                    }
                `}
                                onClick={() => setListeningFor(key)}
                            >
                                {listeningFor === key ? '按任意键...' : formatKey(shortcuts[key])}
                            </button>
                        </div>
                    ))}

                    <div className="mt-4 flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
                        <button
                            onClick={onReset}
                            className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        >
                            恢复默认
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-800 dark:bg-slate-600 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-500 transition-colors text-sm font-medium"
                        >
                            完成
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
