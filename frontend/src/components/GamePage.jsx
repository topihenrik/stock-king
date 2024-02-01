import { Box, Paper, Typography } from "@mui/material";

// Class for company data
class Company {
    constructor(name, marketCap) {
        this.name = name;
        this.marketCap = marketCap;
    }
}

let company1 = new Company("Company A", "$100,000")
let company2 = new Company("Company B", "$200,000")
let company3 = new Company("Company C", "$50,000")

function handleClick() {
    return
}

function ScrollPanel({ companyName, marketCap, color }) {
    return (
        <Box className="scroll-panel" sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minWidth: "50vw", height: "100vh", backgroundColor: color }}>
            <Typography variant="h2" sx={{ textAlign: "center", marginBottom: "32px" }}>
                {companyName}
            </Typography>
            <Box component="img" src="https://picsum.photos/400" sx={{ width: "400px", height: "400px", borderRadius: "16px" }}></Box>
            <Typography variant="h4" sx={{ padding: "32px 0px 6px 0px" }}>Market Cap</Typography>
            <Typography variant="h2">{marketCap}</Typography>
        </Box>
    )
}

export default function GamePage({ highScore = 0 }) {
    return (
        <div>
            <Box className="scroller" sx={{ display: "flex", flexDirection: "row", overflowX: "hidden" }}>
                <ScrollPanel companyName={company1.name} marketCap={company1.marketCap} color={"palegreen"}></ScrollPanel>
                <ScrollPanel companyName={company2.name} marketCap={company2.marketCap} color={"mediumaquamarine"}></ScrollPanel>
                <ScrollPanel companyName={company3.name} marketCap={company3.marketCap} color={"palegreen"}></ScrollPanel>
                <Typography data-testid="text-highscore" sx={{ position: "absolute", top: 16, left: 16 }}>
                    High Score: {highScore}
                </Typography>
            </Box>
            <Box className="score-wrapper" sx={{ display: "flex", width: "100vw", justifyContent: "center" }}>
                <Paper elevation={4} sx={{ position: "absolute", textAlign: "center", top: -4, zIndex: 1 }}>
                    <Typography variant="h5" sx={{ color: "black", padding: "16px 32px 6px 32px" }}>SCORE</Typography>
                    <Typography data-testid="text-score" variant="h3" sx={{ color: "black", padding: "0px 32px 12px 32px" }}>0</Typography>
                </Paper>
            </Box>
        </div>
    )
}