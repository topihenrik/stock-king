import HomePage from "./components/HomePage.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import "./style.css"

const queryClient = new QueryClient()

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    )
};
