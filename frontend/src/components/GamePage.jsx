import {Box, ButtonBase, Paper, Skeleton, Typography} from "@mui/material";
import {baseUri, queryClient} from "../config.js";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../stores/game-store.jsx";

const Currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact'
});

const Panel = ({ handleClick, id, companyName, marketCap, color, imageSrc }) => {
    return (
        <ButtonBase value={id} id={id} data-testid="panel" className="panel" onClick={handleClick} sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minWidth: "50vw",
            height: "100vh",
            backgroundColor: color,
            '&:hover': {
                opacity: 0.85,
                transition: "0.2s",
            }
        }}>
            <Typography variant="h2" sx={{ textAlign: "center", marginBottom: "32px" }}>
                {companyName}
            </Typography>
            <Box component="img" src={imageSrc} sx={{ width: "400px", height: "400px", borderRadius: "16px" }}></Box>
            <Typography variant="h4" sx={{ padding: "32px 0px 6px 0px" }}>Market Cap</Typography>
            <Typography variant="h2" data-testid="market-cap">{marketCap}</Typography>
        </ButtonBase>
    )
}

const PanelSkeletons = () => (
    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Box sx={{
            display: "flex",
            gap: '32px',
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "50vw",
            height: "100vh",
            backgroundColor: 'MediumTurquoise'}}
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
            backgroundColor: 'MediumSpringGreen'}}
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
                        count: 10
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
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: '90vh'}}>
                <Typography variant="h4">😢 Error occurred in our services</Typography>
            </Box>
        )
    }

    return (
        <div>
            <Box className="scroller" sx={{ display: "flex", flexDirection: "row", overflowX: "hidden" }}>
                {isPending ? <PanelSkeletons/> : (
                    <>
                        <Panel
                            handleClick={handleClick}
                            id={companies[leftIndex].ticker}
                            companyName={companies[leftIndex].name}
                            marketCap={Currency.format(companies[leftIndex].market_cap)}
                            color={"MediumTurquoise"}
                            imageSrc={companies[leftIndex].img_url}
                            index={leftIndex}
                        />
                        <Panel
                            handleClick={handleClick}
                            id={companies[rightIndex].ticker}
                            companyName={companies[rightIndex].name}
                            marketCap={Currency.format(companies[rightIndex].market_cap)}
                            color={"MediumSpringGreen"}
                            imageSrc={companies[rightIndex].img_url}
                            index={rightIndex}
                        />
                    </>
                )}
                <Typography data-testid="text-highscore" sx={{ position: "absolute", top: 16, left: 16 }}>
                    High Score: {highScore}
                </Typography>
            </Box>
            <Box className="score-wrapper" sx={{ display: "flex", width: "100vw", justifyContent: "center" }}>
                <Paper elevation={4} sx={{ position: "absolute", textAlign: "center", top: -4, zIndex: 1 }}>
                    <Typography variant="h5" sx={{ color: "black", padding: "16px 32px 6px 32px" }}>SCORE</Typography>
                    <Typography data-testid="text-score" variant="h3" sx={{ color: "black", padding: "0px 32px 12px 32px" }}>{score}</Typography>
                </Paper>
            </Box>
        </div>
    )
}