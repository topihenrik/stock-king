import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const resources = {
    en: {
        common: {
            startGame: "Start game",
            chooseCategory: "Choose category",
            category: 'Category',
            whichHas: "Which has the",
            higher: 'higher',
            marketCap: 'market cap',
            score: "Score",
            yourScore: "Your score",
            highScore: "High score",
            playAgain: "Play again",
            mainMenu: 'Main menu',
            logosProvidedBy: "Logos provided by",
            yourHistory: "Your history",
            date: "Date"
        },
    },
    fi: {
        common: {
            startGame: "Aloita peli",
            chooseCategory: "Valitse kategoria",
            whichHas: "Kummalla on ",
            higher: 'korkeampi',
            marketCap: 'markkina-arvo',
            score: "Pisteet",
            yourScore: "Pisteesi",
            highScore: "Ennätys",
            playAgain: "Pelaa uudestaan",
            mainMenu: 'Päävalikko',
            logosProvidedBy: "Logot tarjoaa",
            yourHistory: "Oma historia",
            date: "Päivämäärä"
        }
    }
};

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: "en",
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
