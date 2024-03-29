import {Box, Paper, Typography} from "@mui/material";
import FlagIcon from "./FlagIcon.jsx";

function ListItem({position, username, score, country}) {
    return (
        <Paper sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            backgroundColor: "primary.light",
            padding: '20px 16px',
        }}>
            <Box sx={{display: 'flex', gap: '8px'}}>
                <Typography>
                    {position}.
                </Typography>
                <Typography>
                    {username}
                </Typography>
                <FlagIcon code={country}/>
            </Box>
            <Typography>
                {score}
            </Typography>
        </Paper>
    )
}

export default function LeaderboardList({players, loading, error}) {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: '8px',
            overflowY: 'auto',
            maxHeight: '320px'
        }}>
            {players && players.map((player, index) => <ListItem key={index} position={index + 1} username={player.name} score={player.score} country={player.country}/>)}
        </Box>
    )
}