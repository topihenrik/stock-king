import React from "react";
import {useTranslation} from "react-i18next";
import {
    Box,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Modal
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const GameHistoryModal = ({ open, setOpen }) => {
    const gameHistory = JSON.parse(localStorage.getItem("gameHistory")) || [];
    const { t } = useTranslation('common');

    const handleCloseHistory = () => {
        setOpen(false);
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    return (
        <Modal
            open={open}
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
                <Box sx={{ position: "relative" }}>
                    <Box sx={{
                        position: "sticky",
                        top: 0,
                        right: 0,
                        display: "flex",
                        justifyContent: "flex-end"
                    }}>
                        <IconButton sx={{ backgroundColor: "primary.main"}} onClick={handleCloseHistory}>
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
            </Box>
        </Modal>
    );
};

export default GameHistoryModal;
