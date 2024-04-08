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

const GameHistoryModal = ({open, setOpen}) => {
    const gameHistory = JSON.parse(localStorage.getItem("gameHistory")) || [];
    const {t} = useTranslation('common');

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
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'clamp(300px, 90%, 600px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: "primary.semiLight",
                padding: '32px 24px 48px',
                gap: '48px',
                borderRadius: '16px'
            }}>
                <Typography variant="h4">
                    {t('yourHistory')}
                </Typography>
                <IconButton
                    sx={{position: 'absolute', top: '16px', right: '8px'}}
                    onClick={handleCloseHistory}
                >
                    <CloseIcon fontSize={'large'}/>
                </IconButton>
                <TableContainer
                    component={Paper}
                    sx={{
                        overflowY: 'auto',
                        maxHeight: '320px'
                    }}
                >
                    <Table stickyHeader aria-label="game history table">
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('date')}</TableCell>
                                <TableCell>{t('category')}</TableCell>
                                <TableCell>{t('score')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {gameHistory.map((game, index) => (
                                <TableRow key={index}>
                                    <TableCell data-testid="date-cell">{formatDate(game.date)}</TableCell>
                                    <TableCell data-testid="category-cell">{game.category}</TableCell>
                                    <TableCell data-testid="score-cell">{game.score}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Modal>
    );
};

export default GameHistoryModal;
