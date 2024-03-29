import {Box, Paper, Typography} from "@mui/material";
import FlagIcon from "./FlagIcon.jsx";

function ListItem({position, username, score, country}) {
    return (
        <Paper
            sx={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                backgroundColor: "primary.light",
                padding: '20px 16px',
            }}
            data-testid={`listitem-${position}`}
        >
            <Box sx={{display: 'flex', gap: '8px'}}>
                <Typography data-testid={`position-${position}`}>
                    {position}.
                </Typography>
                <Typography data-testid={`username-${position}`}>
                    {username}
                </Typography>
                <FlagIcon code={country}/>
            </Box>
            <Typography data-testid={`score-${position}`}>
                {score}
            </Typography>
        </Paper>
    )
}

export default function LeaderboardList({players, loading, error}) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: '8px',
                overflowY: 'auto',
                maxHeight: '320px'
            }}
            data-testid="leaderboardlist"
        >
            {players && players.map((player, index) => <ListItem key={index} position={index + 1} username={player.name}
                                                                 score={player.score} country={player.country}/>)}
        </Box>
    )
}