import {Box, Button, Typography, Modal} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../stores/game-store.jsx";
import {queryClient} from "../config.js";
import {useEffect, useState} from "react";
import {queryKeys} from "../constants.js";
import {useTranslation} from "react-i18next";
import GameHistory from "./GameHistory.jsx";

export default function GameOverPage() {
    const navigate = useNavigate();
    const score = useGameStore((state) => state.score);
    const highScore = useGameStore((state) => state.highScore);
    const { t } = useTranslation('common');
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    useEffect(() => {
        queryClient.removeQueries({ queryKey: [queryKeys.COMPANIES] });
    }, []);

    const handleMainMenu = (event) => {
        navigate("/");
    }

    const handleRestartGame = (event) => {
        navigate("/game")
    }

    const handleOpenHistory = () => {
        setIsHistoryOpen(true);
    }

    const handleCloseHistory = () => {
        setIsHistoryOpen(false);
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
                <Button onClick={handleOpenHistory} variant="contained">
                    {t('yourHistory')}
                </Button>
            </Box>
            <Typography data-testid="text-highscore" sx={{position: "absolute", top: 16, left: 16, textTransform: 'capitalize'}}>
                {t('highScore')}
                {": "}
                {highScore}
            </Typography>
            <Modal
                open={isHistoryOpen}
                onClose={handleCloseHistory}
                aria-labelledby="game-history-modal"
                aria-describedby="game-history-description"
            >
                <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "primary.semiLight",
                    p: 4,
                    width: "100%",
                    maxWidth: 400,
                    maxHeight: "75%",
                    overflowY: "auto"
                }}>
                    <GameHistory onClose={handleCloseHistory} />
                </Box>
            </Modal>
        </Box>
    )
}