import {create} from "zustand";
import i18n from "../i18n.js";

const DEFAULT_LANGUAGE = 'en';

const getLanguageFromLocalStorage = () => {
    const languageFromLocalStorage = localStorage.getItem('language');

    if (languageFromLocalStorage) {
        i18n.changeLanguage(languageFromLocalStorage);
        return languageFromLocalStorage;
    } else {
        localStorage.setItem('language', DEFAULT_LANGUAGE);
        i18n.changeLanguage(DEFAULT_LANGUAGE);
        return DEFAULT_LANGUAGE;
    }
}

export const useLanguageStore = create((set) => ({
    language: getLanguageFromLocalStorage(),
    changeLanguage: (language) => set(() => {
        localStorage.setItem('language', language);
        i18n.changeLanguage(language);
        return { language };
    })
}));


