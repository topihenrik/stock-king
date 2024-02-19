import {Box, Button, Typography} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../game-store";

export default function GameOverPage() {
    const navigate = useNavigate();
    const score = useGameStore((state) => state.score);
    const highScore = useGameStore((state) => state.highScore)

    const handleMainMenu = (event) => {
        navigate("/");
    }

    const handleRestartGame = (event) => {
        navigate("/game")
    }


    return (
        <Box sx={{position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: 'center', gap: "64px", height: '100vh', paddingBottom: '25%', boxSizing: 'border-box'}}>
            <Typography data-testid="text-score" variant="h4">Your Score: {score}</Typography>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", gap: "16px"}}>
                <Button onClick={handleRestartGame} variant="contained">Play Again</Button>
                <Button onClick={handleMainMenu} variant="contained">Main Menu</Button>
            </Box>
            <Typography data-testid="text-highscore" sx={{position: "absolute", top: 16, left: 16}}>
                High Score: {highScore}
            </Typography>
        </Box>
    )
}