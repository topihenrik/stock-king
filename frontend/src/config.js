import {QueryClient} from "@tanstack/react-query";
import {createTheme} from "@mui/material";
import {createContext} from "react";

export const baseUri = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

export const queryClient = new QueryClient();

export const theme = createTheme({
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    // Colors used here: primary.main, primary.semiLight
                    backgroundImage: 'linear-gradient(to bottom, #17171B, #262833)'
                }
            }
        }
    },
    palette: {
        mode: "dark",
        primary: {
            main: "#17171B",
            semiLight: "#262833",
            light: "#313741"
        },
        green: {
            main: "#48A52E"
        },
        text: {
            primary: "#F1F1F1",
            secondary: "#9BA8AF"
        }
    },
    typography: {
        fontFamily: [
            "Inter"
        ]
    }
})