import LeaderboardList from "./LeaderboardList.jsx";
import {IconButton, Modal, Paper, Typography} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {useQuery} from "@tanstack/react-query";
import {GAMEMODE_NORMAL, queryKeys} from "../constants.js";
import {baseUri} from "../config.js";

export default function LeaderboardModal({open, setOpen}) {

    const { isPending, error, data: players } = useQuery({
        refetchOnWindowFocus: false,
        queryKey: [queryKeys.PLAYERS],
        queryFn: () =>
            fetch(
                `${baseUri}/get_scores`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        count: 10,
                        gamemode: GAMEMODE_NORMAL,
                    })
                }
            ).then((res) =>
                res.json(),
            ),
    });
    const handleClose = () => {
        setOpen(false);
    };

    if (isPending) return null;

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Paper
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '600px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: "primary.semiLight",
                    padding: '32px 24px 48px',
                    gap: '48px',
                    borderRadius: '16px'
            }}
            >
                <Typography variant="h4">
                    Top 10 Leaderboard
                </Typography>
                <IconButton
                    sx={{ position: 'absolute', top: '16px', right: '8px'}}
                    onClick={handleClose}
                >
                    <CloseIcon fontSize={'large'}/>
                </IconButton>
                <LeaderboardList players={players} loading={isPending} error={error}/>
            </Paper>
        </Modal>
    )
}