import React from "react";
import {useTranslation} from "react-i18next";
import {Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const GameHistory = ({ onClose }) => {
    const gameHistory = JSON.parse(localStorage.getItem("gameHistory")) || [];
    const { t } = useTranslation('common');

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    return (
        <Box sx={{ position: "relative" }}>
            <Box sx={{
                position: "sticky",
                top: 0,
                right: 0,
                display: "flex",
                justifyContent: "flex-end"
            }}>
                <IconButton sx={{ backgroundColor: "primary.main"}} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Box sx={{ padding: 2 }}>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                    {t('yourHistory')}
                </Typography>
                <TableContainer component={Paper}>
                    <Table aria-label="game history table">
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('date')}</TableCell>
                                <TableCell>{t('score')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {gameHistory.map((game, index) => (
                                <TableRow key={index}>
                                    <TableCell data-testid="date-cell">{formatDate(game.date)}</TableCell>
                                    <TableCell data-testid="score-cell">{game.score}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default GameHistory;
