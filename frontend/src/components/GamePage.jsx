import { Box, ButtonBase, Paper, Typography } from "@mui/material";
import { baseUri } from "../config.js";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGameStore } from "../game-store.jsx";

export default function GamePage({ highScore = 0 }) {
    const navigate = useNavigate();
    const score = useGameStore((state) => state.score);
    const incrementScore = useGameStore((state) => state.incrementScore);
    const resetScore = useGameStore((state) => state.resetScore);
    let [companies, setCompanies] = useState([]);

    useEffect(() => {
        // Reset score to 0 when the component mounts
        resetScore();
    }, []);

    const Panel = ({ id, companyName, marketCap, color, imageSrc }) => {
        // Function that handles game logic when a panel is clicked
        const handleClick = () => {
            let clickedPanel = document.getElementById(id);

            if (companies[0].id === clickedPanel.id) {
                // Left panel was clicked (corresponds to company with index 0 in 'companies')
                if (companies[0].marketCap >= companies[1].marketCap) {
                    incrementScore();
                    companies.splice(0, 1)
                } else {
                    navigate("/gameover");
                }

            } else if (companies[1].id === clickedPanel.id) {
                // Right panel was clicked (corresponds to company with index 1 in 'companies')
                if (companies[1].marketCap >= companies[0].marketCap) {
                    incrementScore();
                    companies.splice(0, 1)
                } else {
                    navigate("/gameover");
                }
            }
        };

        return (
            <ButtonBase id={id} data-testid="panel" className="panel" onClick={handleClick} sx={{
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
                <Typography variant="h2">{marketCap}</Typography>
            </ButtonBase>
        )
    }

    // Generating companies
    if (companies.length <= 3) {
        for (let i = 0; i < 4; i++) {
            if (companies.length >= 4) {
                break;
            }
            // TODO: API calls for actual data

            let color = "palegreen"
            
            if (companies.length == 0 || companies[companies.length - 1].color == "palegreen") {
                color = "mediumaquamarine"
            }

            companies.push({ id: score.toString() + i.toString(), name: "Company Name", marketCap: Math.floor(Math.random() * 100000000), color, imageSrc: "https://picsum.photos/seed/" + Math.random() + "/400" });
        }
    }

    return (
        <div>
            <Box className="scroller" sx={{ display: "flex", flexDirection: "row", overflowX: "hidden" }}>
                {companies.map(company => {
                    return <Panel key={company.id} id={company.id} companyName={company.name} marketCap={company.marketCap} color={company.color} imageSrc={company.imageSrc}></Panel>
                })}
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