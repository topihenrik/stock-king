import {QueryClient} from "@tanstack/react-query";
import {createTheme} from "@mui/material";
import {createContext} from "react";

export const baseUri = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

export const queryClient = new QueryClient();

export const theme = createTheme({
    typography: {
        fontFamily: [
            "Inter"
        ]
    }
})