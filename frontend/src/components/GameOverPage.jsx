import {
    Box,
    Button,
    ButtonBase,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {baseUri, queryClient} from "../config.js";
import {useEffect, useState} from "react";
import {GAMEMODE_NORMAL, queryKeys} from "../constants.js";
import {useTranslation} from "react-i18next";
import {EmojiEvents, Home} from "@mui/icons-material";
import LeaderboardList from "./LeaderboardList.jsx";
import {useQuery} from "@tanstack/react-query";
import flagCodes from "../data/flagcodes.json";
import FlagIcon from "./FlagIcon.jsx";
import {useScoreStore} from "../stores/score-store.jsx";

const renderFlagMenuItem = (code) => {
    return(
        <MenuItem
            value={code}
            key={code}
        >
            <Box sx={{display: 'flex', width: '50px', justifyContent: 'space-between'}}>
                {code.toUpperCase()}
                <FlagIcon code={code}/>
            </Box>
        </MenuItem>
    )
}

export default function GameOverPage() {
    const navigate = useNavigate();
    const score = useScoreStore((state) => state.score);
    const highScore = useScoreStore((state) => state.highScore);
    const { t } = useTranslation('common');
    const [country, setCountry] = useState('');
    const [nickname, setNickname] = useState('');
    let showSubmit = false;

    useEffect(() => {
        queryClient.removeQueries({ queryKey: [queryKeys.COMPANIES] });
    }, []);

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
            ).then((res) => res.json())
    });

    if (players && score !== 0) {
        if (players.length < 10) {
            showSubmit = true;
        } else {
            const lowestScore = players.reduce((lowestScore, player) => player.score < lowestScore ? player.score : lowestScore, 999);
            if (score > lowestScore) {
                showSubmit = true;
            }
        }
    }

    const handleRestartGame = () => {
        navigate("/game")
    }

    const handleCountryChange = (event) => {
        setCountry(event.target.value);
    };

    const handleScoreSubmit = () => {
        if (nickname.length >= 2) {
            const countryCode= country === "Empty" ? "" : country;

            fetch(
                `${baseUri}/new_high_score`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: nickname,
                        score: score,
                        gamemode: GAMEMODE_NORMAL,
                        country: countryCode,
                    })
                }
            ).then(() => navigate("/"));
        }
    }

    return (
        <Box sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: 'center',
            gap: "64px",
            height: '100vh',
            paddingBottom: '25%',
            paddingTop: '10%',
            boxSizing: 'border-box',
        }}>
            <ButtonBase data-testid="button-home" component={Link} to="/" sx={{
                position: "fixed",
                top: "0",
                left: "0",
                padding: "32px",
                backgroundColor: "primary.light",
                borderRadius: "0px 0px 8px 0px",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 1)",
                '&:hover': {
                    opacity: 0.85,
                    transition: "0.2s",
                }
            }}>
                <Home fontSize="large"/>
            </ButtonBase>
            <Stack direction="row" alignItems="center" gap={1} sx={{ position: "fixed", top: 32, right: 32 }}>
                <EmojiEvents fontSize="large" sx={{ color: "text.secondary" }} />
                <Typography data-testid="text-highscore" variant="h4" sx={{ color: "text.secondary", textShadow: "0px 2px 5px rgba(0, 0, 0, 1)" }}>
                    {highScore}
                </Typography>
            </Stack>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: 'clamp(300px, 90%, 600px)'
            }}>
                <Typography
                    variant={"h3"}
                    sx={{margin: '150px 0px 96px'}}
                    data-testid="text-score"
                >
                    {t('yourScore')}
                    {": "}
                    {score}
                </Typography>
                {
                    showSubmit && (
                        <>
                            <LeaderboardList players={players} loading={isPending} error={error}/>
                            <Box sx={{display: 'flex', width: '100%', gap: '8px', marginTop: '24px'}}>
                                <TextField
                                    placeholder={t('nickname')}
                                    onChange={({target}) => setNickname(target.value)}
                                    value={nickname}
                                    sx={{
                                        background: 'white',
                                        borderRadius: '8px',
                                        width: '100%'
                                    }}
                                    InputProps={{
                                        sx: {color: 'black'}
                                    }}
                                />
                                <Box>
                                    <FormControl >
                                        <InputLabel
                                            id="country-select-label"
                                            sx={{
                                                color: '#ffffff',
                                                "&.Mui-focused": {
                                                    color: "#e6e6e6"
                                                }
                                            }}
                                        >
                                            {t('flag')}
                                        </InputLabel>
                                        <Select
                                            labelId="country-select-label"
                                            value={country}
                                            label="Country"
                                            onChange={handleCountryChange}
                                            sx={{width: '95px'}}
                                            MenuProps={{
                                                sx: {maxHeight: '400px'}
                                            }}
                                        >
                                            <MenuItem value="Empty">
                                                {t('empty')}
                                            </MenuItem>
                                            {flagCodes.map(renderFlagMenuItem)}
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Button
                                    variant={"contained"}
                                    sx={{
                                        background: '#48A52E',
                                        padding: '0 32px',
                                        width: '150px',
                                        "&:hover": {
                                            background: "#347a20"
                                        }
                                    }}
                                    onClick={handleScoreSubmit}
                                    data-testid="submit-btn"
                                >
                                    {t('submit')}
                                </Button>
                            </Box>
                        </>
                    )
                }
                <Button
                    variant={"contained"}
                    sx={{
                        backgroundColor: 'primary.main',
                        height: '56px',
                        marginTop: '64px',
                        padding: '0 48px'
                    }}
                    onClick={handleRestartGame}
                >
                    {t('playAgain')}
                </Button>
            </Box>
        </Box>
    )
}