import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import zh from './locales/zh.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: en,
            },
            zh: {
                translation: zh,
            },
        },
        fallbackLng: 'zh', // Default to Chinese as original app was in Chinese
        interpolation: {
            escapeValue: false, // React already safes from xss
        },
        detection: {
            order: ['localStorage'],
            caches: ['localStorage'],
        },
    });

export default i18n;
