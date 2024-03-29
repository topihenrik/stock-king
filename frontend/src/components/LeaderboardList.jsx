import {Box, Paper, Skeleton, Typography} from "@mui/material";
import FlagIcon from "./FlagIcon.jsx";

function ListItemSkeleton() {
    return <Skeleton variant="rectangular" sx={{width: "100%", height: "64px"}} />;
}

function LeaderboardListSkeleton() {
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
        >
            <ListItemSkeleton/>
            <ListItemSkeleton/>
            <ListItemSkeleton/>
            <ListItemSkeleton/>
            <ListItemSkeleton/>
        </Box>
    )
}

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

    if (loading) return <LeaderboardListSkeleton/>;

    if (error) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Typography sx={{ marginX: "16px" }}>😢 An error occurred in our services</Typography>
            </Box>
        )
    }

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