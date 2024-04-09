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
            date: "Date",
            leaderboard: "Leaderboard",
            top10Leaderboard: "Top 10 Leaderboard",
            nickname: 'Nickname',
            flag: 'Flag',
            empty: 'Empty',
            submit: 'Submit',
            zeroPlayersNotice: "No player has cemented their legacy in to the leaderboard as the stock king. Will you be the first one?",
            errorOccurredInServices: "An error occurred in our services",
            loading: "Loading...",
            error: "Error",
            "All categories": "All categories",
            "Real Estate": "Real Estate",
            Healthcare: "Healthcare",
            "Basic Materials": "Basic Materials",
            Energy: "Energy",
            Industrials: "Industrials",
            "Consumer Cyclical": "Consumer cyclical",
            Utilities: "Utilities",
            "Consumer Defensive": "Consumer Defensive",
            "Financial Services": "Financial Services",
            Technology: "Technology",
            "Communication Services": "Communication services"
        },
    },
    fi: {
        common: {
            startGame: "Aloita peli",
            chooseCategory: "Valitse kategoria",
            category: "Kategoria",
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
            date: "Päivämäärä",
            leaderboard: "Tulostaulu",
            top10Leaderboard: "Top 10 tulostaulukko",
            nickname: 'Nimimerkki',
            flag: 'Lippu',
            empty: 'Tyhjä',
            submit: 'Lähetä',
            zeroPlayersNotice: "Yksikään pelaaja ei ole lujittanut perintöään tulostaulukkoon osakekuninkaana. Oletko sinä ensimmäinen?",
            errorOccurredInServices: "Palveluissamme tapahtui virhe",
            loading: "Ladataan...",
            error: "Virhe",
            "All categories": "Kaikki kategoriat",
            "Real Estate": "Kiinteistöala",
            Healthcare: "Terveydenhuolto",
            "Basic Materials": "Materiaalit",
            Energy: "Energia",
            Industrials: "Teollisuus",
            "Consumer Cyclical": "Sykliset kuluttajatuotteet",
            Utilities: "Hyödykkeet",
            "Consumer Defensive": "Defensiiviset kuluttajatuotteet",
            "Financial Services": "Rahoituspalvelut",
            Technology: "Technologia",
            "Communication Services": "Viestintä"
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
