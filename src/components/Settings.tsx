import React, { useState, useEffect } from 'react';
import { type Shortcuts } from '../hooks/useShortcuts';
import { getShortcutFromEvent, getDisplayString } from '../utils/keyboardUtils';
import { X, Globe, Keyboard, Check, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SettingsProps {
    isOpen: boolean;
    onClose: () => void;
    shortcuts: Shortcuts;
    onUpdate: (action: keyof Shortcuts, code: string) => void;
    onReset: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
    isOpen,
    onClose,
    shortcuts,
    onUpdate,
    onReset
}) => {
    const { t, i18n } = useTranslation();
    const [activeTab, setActiveTab] = useState<'general' | 'shortcuts'>('general');
    const [listeningFor, setListeningFor] = useState<keyof Shortcuts | null>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (listeningFor) {
                e.preventDefault();
                e.stopPropagation();

                // Allow cancelling with Escape
                if (e.key === 'Escape') {
                    setListeningFor(null);
                    return;
                }

                // Ignore modifier-only key presses
                if (['Meta', 'Control', 'Alt', 'Shift'].includes(e.key)) {
                    return;
                }

                const shortcutString = getShortcutFromEvent(e);
                onUpdate(listeningFor, shortcutString);
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
        { key: 'playPause', label: t('shortcuts.playPause') },
        { key: 'rewind', label: t('shortcuts.rewind') },
        { key: 'forward', label: t('shortcuts.forward') },
    ];

    // Check for potential system conflicts
    const isSystemConflict = (code: string) => {
        const lower = code.toLowerCase();
        // Spotlight
        if (lower === 'meta+space' || lower === 'cmd+space') return true;
        // App Switcher (Browser usually handles, but strict warning is good)
        if (lower === 'meta+tab' || lower === 'cmd+tab') return true;
        // System Quit/Hide
        if (lower === 'meta+q' || lower === 'cmd+q') return true;
        if (lower === 'meta+h' || lower === 'cmd+h') return true;
        if (lower === 'meta+w' || lower === 'cmd+w') return true;
        return false;
    };



    const languages = [
        { code: 'en', label: 'English' },
        { code: 'zh', label: '中文' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row h-[500px]">

                {/* Sidebar */}
                <div className="w-full md:w-48 bg-slate-50 dark:bg-slate-900/50 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-700 flex flex-row md:flex-col p-2 gap-1">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'general'
                            ? 'bg-white dark:bg-slate-800 text-[#646cff] shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                    >
                        <Globe size={18} />
                        {t('settings.general')}
                    </button>
                    <button
                        onClick={() => setActiveTab('shortcuts')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'shortcuts'
                            ? 'bg-white dark:bg-slate-800 text-[#646cff] shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                    >
                        <Keyboard size={18} />
                        {t('settings.shortcuts')}
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-700">
                        <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">{t('settings.title')}</h2>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-400"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto flex-1">
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">{t('settings.language')}</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => i18n.changeLanguage(lang.code)}
                                                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${i18n.language === lang.code
                                                    ? 'border-[#646cff] bg-[#646cff]/5 text-[#646cff]'
                                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                                                    }`}
                                            >
                                                <span className="font-medium">{lang.label}</span>
                                                {i18n.language === lang.code && <Check size={18} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'shortcuts' && (
                            <div className="flex flex-col gap-4">
                                {actions.map(({ key, label }) => (
                                    <div key={key} className="flex flex-col gap-2 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                                        <div className="flex justify-between items-center">
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
                                                {listeningFor === key ? t('shortcuts.pressKey') : getDisplayString(shortcuts[key])}
                                            </button>
                                        </div>
                                        {isSystemConflict(shortcuts[key]) && (
                                            <div className="flex items-start gap-2 text-amber-600 dark:text-amber-400 text-xs bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                                                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                                                <span>{t('shortcuts.systemConflictTip')}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <div className="mt-4 flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
                                    <button
                                        onClick={onReset}
                                        className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                    >
                                        {t('settings.reset')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-800 dark:bg-slate-600 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-500 transition-colors text-sm font-medium"
                        >
                            {t('settings.done')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
