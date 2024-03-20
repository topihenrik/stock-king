import { Box, ButtonBase, Paper, Skeleton, Typography, Stack } from "@mui/material";
import { Home, EmojiEvents } from "@mui/icons-material";
import { baseUri } from "../config.js";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import numeral from 'numeral';
import getSymbolFromCurrency from 'currency-symbol-map'
import { useGameStore } from "../stores/game-store.jsx";
import {queryKeys} from "../constants.js";
import PlaceholderLogo from '../../public/placeholder_company_logo.png';
import {useTranslation} from "react-i18next";

const customNumberFormat = (value, currencyCode) => {
    const symbol = getSymbolFromCurrency(currencyCode) || currencyCode;
    let formattedValue;
    if ((value > 10000000000) || ((value < 1000000000) && (value > 10000000))) {
        formattedValue = numeral(value).format('(0a)').toUpperCase();
    } else {
        formattedValue = numeral(value).format('(0.0a)').toUpperCase();
    }
    return `${formattedValue} ${symbol}`;
};

const Panel = ({ handleClick, id, companyName, marketCap, imageSrc }) => {
    return (
        <ButtonBase value={id} id={id} data-testid="panel" className="panel" onClick={handleClick} sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "left",
            alignItems: "left",
            width: { xs: "100%", sm: "560px", md: "880px", lg: "1040px" },
            height: { xs: "45%", sm: "400px", md: "480px", lg: "560px" },
            marginBottom: "24px",
            backgroundColor: "primary.light",
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: "text.secondary",
            borderRadius: "8px",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 1)",
            '&:hover': {
                opacity: 0.85,
                transition: "0.2s",
            },
            overflow: "hidden"
        }}>
            <Box component="img" src={imageSrc} alt={companyName}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = PlaceholderLogo;
                    e.target.alt = "Placeholder logo"
                }}
                sx={{
                    width: { xs: "100px", sm: "150px", md: "200px" },
                    height: { xs: "100px", sm: "150px", md: "200px" },
                    margin: {xs: "32px", sm: "64px", md: "80px"},
                    borderRadius: "8px"
            }}></Box>
            <Box sx={{ 
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                margin: "0px 32px 0px 0px",
                width: "100%"
            }}>
                <Typography variant="h3" sx={{
                    fontSize: { xs: "1.75rem", sm: "2rem", md: "3rem" },
                    textAlign: "center",
                    marginBottom: "1rem",
                    color: "text.secondary"
                }}>
                    {companyName}
                </Typography>
                <Typography data-testid="market-cap" variant="h1" sx={{
                    fontSize: { xs: "3rem", sm: "4rem", md: "6rem" },
                    textAlign: "center",
                    textWrap: "wrap"
                }}>
                    {marketCap}
                </Typography>
            </Box>
        </ButtonBase>
    )
}

const PanelSkeletons = () => (
    <Box sx={{width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end"}}>
        <Box sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "left",
            alignItems: "center",
            width: { xs: "100%", sm: "560px", md: "880px", lg: "1040px" },
            height: { xs: "45%", sm: "400px", md: "480px", lg: "560px" },
            marginBottom: "24px",
            backgroundColor: "primary.light",
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: "text.secondary",
            borderRadius: "8px",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 1)",
            overflow: "hidden"
        }}
        >
            <Skeleton variant="rectangular" sx={{
                minWidth: { xs: "100px", sm: "150px", md: "200px" },
                height: { xs: "100px", sm: "150px", md: "200px" },
                margin: {xs: "32px", sm: "64px", md: "80px"}
            }} />
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                margin: "0px 32px 0px 0px",
                width: "100%"
            }}>
                <Skeleton variant="rectangular" sx={{ width: "100%", height: "3rem", margin: "1rem 0rem 1rem 0rem" }} />
                <Skeleton variant="rectangular" sx={{ width: "100%", height: "3rem", margin: "0rem 0rem 1rem 0rem" }} />
            </Box>
        </Box>
        <Box sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "left",
            alignItems: "center",
            width: { xs: "100%", sm: "560px", md: "880px", lg: "1040px" },
            height: { xs: "45%", sm: "400px", md: "480px", lg: "560px" },
            marginBottom: "24px",
            backgroundColor: "primary.light",
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: "text.secondary",
            borderRadius: "8px",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 1)",
            overflow: "hidden"
        }}
        >
            <Skeleton variant="rectangular" sx={{
                minWidth: { xs: "100px", sm: "150px", md: "200px" },
                height: { xs: "100px", sm: "150px", md: "200px" },
                margin: {xs: "32px", sm: "64px", md: "80px"}
            }} />
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                margin: "0px 32px 0px 0px",
                width: "100%"
            }}>
                <Skeleton variant="rectangular" sx={{ width: "100%", height: "48px", marginY: "16px" }} />
                <Skeleton variant="rectangular" sx={{ width: "100%", height: "48px", marginBottom: "16px" }} />
            </Box>
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
    const gameCurrency = useGameStore((state) => state.gameCurrency);
    const { t } = useTranslation('common');
    const [companyIndex, setCompanyIndex] = useState(0);
    const leftIndex = companyIndex;
    const rightIndex = companyIndex + 1;

    const Currency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: gameCurrency,
        notation: 'compact'
    });

    const { isPending, error, data: companies } = useQuery({
        refetchOnWindowFocus: false,
        queryKey: [queryKeys.COMPANIES],
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
                        currency: gameCurrency,
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
            navigate("/gameover");
        }
    }
    
    if (error) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: '90vh' }}>
                <Typography variant="h4" sx={{ marginX: "16px" }}>😢 An error occurred in our services</Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh", alignItems: "center" }}>
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
                <Home fontSize="large" />
            </ButtonBase>
            <Stack direction="row" alignItems="center" gap={1} sx={{ position: "fixed", top: 32, right: 32 }}>
                <EmojiEvents fontSize="large" sx={{ color: "text.secondary" }} />
                <Typography data-testid="text-highscore" variant="h4" sx={{ color: "text.secondary", textShadow: "0px 2px 5px rgba(0, 0, 0, 1)" }}>
                    {highScore}
                </Typography>
            </Stack>

            <Box className="score-wrapper" sx={{ display: "flex", width: "100vw", justifyContent: "center" }}>
                <Paper elevation={4} sx={{
                    position: "fixed",
                    textAlign: "center",
                    top: -6,
                    zIndex: 1,
                    backgroundColor: "text.primary",
                    borderRadius: "8px"
                }}>
                    <Typography variant="h5" sx={{ color: "black", paddingX: {xs: "32px", sm: "62px"}, paddingTop: "16px", paddingBottom: "8px", textTransform: 'uppercase' }}>
                        {t('score')}
                    </Typography>
                    <Typography data-testid="text-score" variant="h3" sx={{ color: "black", padding: "0px 32px 8px 32px" }}>{score}</Typography>
                </Paper>
            </Box>
            <Typography variant="h4" sx={{ fontSize: {xs: "1.5rem", sm: "2rem"}, color: "text.secondary", textAlign: "center", margin: "160px 32px 32px 32px" }}>
                {t("whichHas")}
                {" "}
                <Box sx={{ display: "inline", color: "green.main" }}>
                    {t("higher")}
                </Box>
                {" "}
                {t("marketCap")}?
            </Typography>
            <Box className="scroller" sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                margin: "0px 16px 48px 16px",
                width: { xs: "95%", sm: "560px", md: "880px", lg: "1040px" },
                height: "100vh",
                overflowX: "hidden",
                overflowY: "hidden",
                alignItems: "center"
            }}>
                {isPending ? <PanelSkeletons /> : (
                    <Box sx={{width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end"}}>
                        <Panel
                            handleClick={handleClick}
                            id={companies[leftIndex].ticker}
                            companyName={companies[leftIndex].name}
                            marketCap={customNumberFormat(companies[leftIndex].market_cap, gameCurrency)}
                            imageSrc={companies[leftIndex].img_url}
                            index={leftIndex}
                        />
                        <Panel
                            handleClick={handleClick}
                            id={companies[rightIndex].ticker}
                            companyName={companies[rightIndex].name}
                            marketCap={customNumberFormat(companies[rightIndex].market_cap, gameCurrency)}
                            imageSrc={companies[rightIndex].img_url}
                            index={rightIndex}
                        />
                    </Box>
                )}
            </Box>
            <Typography component={Link} to="https://clearbit.com" sx={{
                position: "static",            
                marginBottom: "16px",
                color: "text.secondary",
                fontSize: "12px"
            }}>
                {t('logosProvidedBy')}
                {' '}
                Clearbit
            </Typography>
        </Box>
    )
}