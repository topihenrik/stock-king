export const useTranslation = () => {
    return {
        t: (str) => str,
        i18n: {
            changeLanguage: () => new Promise(() => {}),
        },
    };
};

export const initReactI18next = {
    type: '3rdParty',
    init: () => {},
}