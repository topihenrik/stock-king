import {Box, Button, Typography} from "@mui/material";

export default function GameOverPage({ highScore = 0, score = 0 }) {
    return (
        <Box sx={{position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: 'center', gap: "64px", height: '100vh', paddingBottom: '25%', boxSizing: 'border-box'}}>
            <Typography variant="h4">Your Score: {score}</Typography>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", gap: "16px"}}>
                <Button variant="contained">Play Again</Button>
                <Button variant="contained">Main Menu</Button>
            </Box>
            <Typography sx={{position: "absolute", top: 16, left: 16}}>
                High Score: {highScore}
            </Typography>
        </Box>
    )
}