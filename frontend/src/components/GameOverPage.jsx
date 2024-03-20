import {Box, Button, Typography} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../stores/game-store.jsx";
import {queryClient} from "../config.js";
import {useEffect} from "react";
import {queryKeys} from "../constants.js";
import {useTranslation} from "react-i18next";

export default function GameOverPage() {
    const navigate = useNavigate();
    const score = useGameStore((state) => state.score);
    const highScore = useGameStore((state) => state.highScore);
    const { t } = useTranslation('common');

    useEffect(() => {
        queryClient.removeQueries({ queryKey: [queryKeys.COMPANIES] });
    }, []);

    const handleMainMenu = (event) => {
        navigate("/");
    }

    const handleRestartGame = (event) => {
        navigate("/game")
    }

    return (
        <Box sx={{position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: 'center', gap: "64px", height: '100vh', paddingBottom: '25%', boxSizing: 'border-box'}}>
            <Typography data-testid="text-score" variant="h4">
                {t('yourScore')}
                {": "}
                {score}
            </Typography>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", gap: "16px"}}>
                <Button onClick={handleRestartGame} variant="contained">
                    {t('playAgain')}
                </Button>
                <Button onClick={handleMainMenu} variant="contained">
                    {t('mainMenu')}
                </Button>
            </Box>
            <Typography data-testid="text-highscore" sx={{position: "absolute", top: 16, left: 16, textTransform: 'capitalize'}}>
                {t('highScore')}
                {": "}
                {highScore}
            </Typography>
        </Box>
    )
}