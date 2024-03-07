import { Box, ButtonBase, Paper, Skeleton, Typography } from "@mui/material";
import { Home } from "@mui/icons-material";
import { baseUri, queryClient } from "../config.js";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGameStore } from "../stores/game-store.jsx";

const Currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact'
});

const Panel = ({ handleClick, id, companyName, marketCap, imageSrc }) => {
    return (
        <ButtonBase value={id} id={id} data-testid="panel" className="panel" onClick={handleClick} sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "left",
            alignItems: "left",
            width: "100%",
            height: "30rem",
            marginBottom: "32px",
            backgroundColor: "primary.light",
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: "text.secondary",
            borderRadius: "8px",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 1)",
            '&:hover': {
                opacity: 0.85,
                transition: "0.2s",
            }
        }}>
            <Box component="img" src={imageSrc} sx={{ width: "200px", height: "200px", margin: "5rem", borderRadius: "8px" }}></Box>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", margin: "0rem 5rem 1rem 0rem", width: "100%" }}>
                <Typography variant="h3" sx={{ textAlign: "center", marginBottom: "1rem", color: "text.secondary" }}>
                    {companyName}
                </Typography>
                <Typography variant="h2" data-testid="market-cap" sx={{ textAlign: "center", textWrap: "wrap" }}>{marketCap}</Typography>
            </Box>
        </ButtonBase>
    )
}

const PanelSkeletons = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{
            display: "flex",
            gap: '32px',
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "50vw",
            height: "100vh",
            backgroundColor: 'MediumTurquoise'
        }}
        >
            <Skeleton variant="rectangular" width="clamp(250px, 55%, 500px)" height={118} />
            <Skeleton variant="rectangular" width="clamp(200px, 35%, 400px)" height={320} />
            <Skeleton variant="rectangular" width="clamp(150px, 16%, 300px)" height={120} />
        </Box>
        <Box sx={{
            display: "flex",
            gap: '32px',
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minWidth: "50vw",
            height: "100vh",
            backgroundColor: 'MediumSpringGreen'
        }}
        >
            <Skeleton variant="rectangular" width="clamp(250px, 55%, 500px)" height={118} />
            <Skeleton variant="rectangular" width="clamp(200px, 35%, 400px)" height={320} />
            <Skeleton variant="rectangular" width="clamp(150px, 16%, 300px)" height={120} />
        </Box>
    </Box>
)

export default function GamePage() {
    const navigate = useNavigate();
    const score = useGameStore((state) => state.score);
    const incrementScore = useGameStore((state) => state.incrementScore);
    const resetScore = useGameStore((state) => state.resetScore);
    const highScore = useGameStore((state) => state.highScore);
    const updateHighScore = useGameStore((state) => state.updateHighScore);
    const [companyIndex, setCompanyIndex] = useState(0);
    const leftIndex = companyIndex;
    const rightIndex = companyIndex + 1;

    const { isPending, error, data: companies } = useQuery({
        queryKey: ['companies'],
        queryFn: () =>
            fetch(
                `${baseUri}/get_companies`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        excluded_tickers: [],
                        wanted_categories: [],
                        currency: "USD",
                        count: 20
                    })
                }
            ).then((res) =>
                res.json(),
            ),
    });

    useEffect(() => {
        // Reset score to 0 when the component mounts
        resetScore();
    }, []);

    const handleClick = (event) => {
        const ticker = event.currentTarget.value;
        const leftCompany = companies[leftIndex];
        const rightCompany = companies[rightIndex];
        const selectedCompany = companies.filter(company => company.ticker === ticker)[0];
        const otherCompany = rightCompany.ticker === selectedCompany.ticker ? leftCompany : rightCompany;

        if (selectedCompany.market_cap >= otherCompany.market_cap) {
            incrementScore();
            updateHighScore();
            setCompanyIndex(companyIndex + 1);
        } else {
            queryClient.clear()
            navigate("/gameover");
        }
    }

    if (error) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: '90vh' }}>
                <Typography variant="h4">😢 Error occurred in our services</Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh", justifyContent: "flex-end", alignItems: "center" }}>
            <ButtonBase data-testid="button-home" component={Link} to="/" sx={{
                position: "absolute",
                top: "0",
                left: "0",
                padding: "32px",
                backgroundColor: "primary.light",
                borderRadius: "0px 0px 8px 0px",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 1)"
            }}>
                <Home fontSize="large" />
            </ButtonBase>
            <Typography data-testid="text-highscore" variant="h5" sx={{ color: "text.secondary", position: "absolute", top: 32, right: 32, textShadow: "0px 2px 5px rgba(0, 0, 0, 1)" }}>
                High Score: {highScore}
            </Typography>
            <Box className="score-wrapper" sx={{ display: "flex", width: "100vw", justifyContent: "center" }}>
                <Paper elevation={4} sx={{ position: "absolute", textAlign: "center", top: -4, zIndex: 1, backgroundColor: "text.primary" }}>
                    <Typography variant="h5" sx={{ color: "black", padding: "16px 48px 6px 48px" }}>SCORE</Typography>
                    <Typography data-testid="text-score" variant="h3" sx={{ color: "black", padding: "0px 32px 12px 32px" }}>{score}</Typography>
                </Paper>
            </Box>
            <Typography variant="h4" sx={{ color: "text.secondary", margin: "10rem 0rem 2rem 0rem" }}>Which has the <Typography variant="h4" sx={{ display: "inline", color: "green.main" }}>higher</Typography> market cap?</Typography>
            <Box className="scroller" sx={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "1rem",
                width: "60rem",
                overflowY: "hidden",
                alignItems: "center"
            }}>
                {isPending ? <PanelSkeletons /> : (
                    <>
                        <Panel
                            handleClick={handleClick}
                            id={companies[leftIndex].ticker}
                            companyName={companies[leftIndex].name}
                            marketCap={Currency.format(companies[leftIndex].market_cap)}
                            imageSrc={companies[leftIndex].img_url}
                            index={leftIndex}
                        />
                        <Panel
                            handleClick={handleClick}
                            id={companies[rightIndex].ticker}
                            companyName={companies[rightIndex].name}
                            marketCap={Currency.format(companies[rightIndex].market_cap)}
                            imageSrc={companies[rightIndex].img_url}
                            index={rightIndex}
                        />
                    </>
                )}
            </Box>
            <Typography component={Link} to="https://clearbit.com" sx={{ position: "absolute", bottom: "1rem", color: "text.secondary", fontSize: "12px" }}>Logos provided by Clearbit</Typography>
        </Box>
    )
}