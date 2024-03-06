import {BrowserRouter, Route, Routes} from "react-router-dom";
import {QueryClientProvider} from "@tanstack/react-query";
import {ThemeProvider, CssBaseline} from "@mui/material";
import { theme, queryClient } from './config.js'
import GameOverPage from "./components/GameOverPage.jsx";
import GamePage from "./components/GamePage.jsx";
import MenuPage from "./components/MenuPage.jsx"
import "./style.css"

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<MenuPage/>}/>
                        <Route path="/game" element={<GamePage/>}/>
                        <Route path="/gameover" element={<GameOverPage/>}/>
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </ThemeProvider>
    )
};
