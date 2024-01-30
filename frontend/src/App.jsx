import TestPage from "./components/TestPage.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {QueryClientProvider} from "@tanstack/react-query";
import {ThemeProvider} from "@mui/material";
import "./style.css"
import GameOverPage from "./components/GameOverPage.jsx";
import { theme, queryClient } from './config.js'


export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/test" element={<TestPage/>}/> {/*FEEL FREE TO REMOVE THIS ROUTE*/}
                        <Route path="/gameover" element={<GameOverPage/>}/>
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </ThemeProvider>
    )
};
