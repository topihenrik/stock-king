import { Box, ButtonBase, Paper, Skeleton, Typography, Stack } from "@mui/material";
import { Home, EmojiEvents } from "@mui/icons-material";
import { baseUri } from "../config.js";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import numeral from 'numeral';
import getSymbolFromCurrency from 'currency-symbol-map'
import {difficulty, NUMBER_OF_COMPANIES_FETCHED, queryKeys} from "../constants.js";
import PlaceholderLogo from '../../public/placeholder_company_logo.png';
import {useTranslation} from "react-i18next";
import {useScoreStore} from "../stores/score-store.jsx";
import {useCurrencyStore} from "../stores/currency-store.jsx";

const delay = ms => new Promise(res => setTimeout(res, ms));

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

const Panel = ({ handleClick, id, companyName, marketCap, imageSrc, hideAll, hideMarketCap, selectedCorrectly, selectedIncorrectly }) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <ButtonBase value={id} id={id} data-testid="panel" className="panel" onClick={handleClick} sx={{
            width: { xs: "100%", sm: "560px", md: "880px", lg: "1040px" },
            height: { xs: "45%", sm: "400px", md: "480px", lg: "560px" },
            marginBottom: "24px",
            backgroundColor: "primary.light",
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: selectedCorrectly ? "green.main" : selectedIncorrectly ? "red.main" : "text.secondary",
            borderRadius: "8px",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 1)",
            '&:hover': {
                opacity: 0.85,
                transition: "0.2s",
            },
            transition: "0.2s",
            overflow: "hidden"
        }}>
            <Box sx={{ 
                display: "flex",
                flexDirection: "row",
                justifyContent: "left",
                alignItems: "center",
                width: "100%", 
                height: "100%", 
                opacity: hideAll ? 0.0 : 1.0,
                transition: "0.4s" 
            }}>
                <Box component="img" style={loaded ? {} : { display: "none" }} src={imageSrc} alt={companyName}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = PlaceholderLogo;
                        e.target.alt = "Placeholder logo"
                    }}
                    onLoad={() => setLoaded(true)}
                    sx={{
                        minWidth: { xs: "100px", sm: "150px", md: "200px" },
                        maxHeight: { xs: "100px", sm: "150px", md: "200px" },
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
                        textWrap: "wrap",
                        color: selectedCorrectly ? "green.main" : selectedIncorrectly ? "red.main" : "text.primary",
                        transition: "0.2s"
                    }}>
                        {hideMarketCap ? "?" : marketCap}
                    </Typography>
                </Box>
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
    const score = useScoreStore((state) => state.score);
    const incrementScore = useScoreStore((state) => state.incrementScore);
    const resetScore = useScoreStore((state) => state.resetScore);
    const highScore = useScoreStore((state) => state.highScore);
    const updateHighScore = useScoreStore((state) => state.updateHighScore);
    const gameCurrency = useCurrencyStore((state) => state.gameCurrency);
    const { t } = useTranslation('common');
    const [companyIndex, setCompanyIndex] = useState(0);
    const [usedTickersList, setUsedTickersList] = useState([]);
    const [currentDifficulty, setCurrentDifficulty] = useState(difficulty.EASY);
    const topIndex = companyIndex;
    const bottomIndex = companyIndex + 1;
    const numFetchedCompanies = NUMBER_OF_COMPANIES_FETCHED;

    // Animation-related variables
    const [hidePanelContent, setHidePanelContent] = useState(false);
    const [correctSelected, setCorrectSelected] = useState(false);
    const [incorrectSelected, setIncorrectSelected] = useState(false);
    const [topSelection, setTopSelection] = useState("none");
    const [bottomSelection, setBottomSelection] = useState("none");
    const [hideBottomMarketCap, setHideBottomMarketCap] = useState(true);
    const [disablePointer, setDisablePointer] = useState(false);

    const { isPending, error, refetch, data: companies } = useQuery({
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
                        excluded_tickers: usedTickersList,
                        wanted_categories: [],
                        currency: gameCurrency,
                        count: numFetchedCompanies,
                        difficulties: [currentDifficulty]
                    })
                }
            ).then((res) => {
                return res.json()
                    .then((data) => {
                        const tickers = data.map(company => company.ticker);
                        setUsedTickersList(prevList => [...prevList, ...tickers]);

                        if (companies) {
                            data.unshift(companies[companies.length - 1]);
                        }

                        if (currentDifficulty === difficulty.EASY) {
                            setCurrentDifficulty(difficulty.MEDIUM);
                        } else if (currentDifficulty === difficulty.MEDIUM) {
                            setCurrentDifficulty(difficulty.HARD)
                        }

                        return data;
                    });
            }),
    });

    useEffect(() => {
        // Reset score to 0 when the component mounts
        resetScore();
    }, []);

    const handleClick = async (event) => {
        const ticker = event.currentTarget.value;
        const topCompany = companies[topIndex];
        const bottomCompany = companies[bottomIndex];
        const selectedCompany = companies.filter(company => company.ticker === ticker)[0];  
        const otherCompany = bottomCompany.ticker === selectedCompany.ticker ? topCompany : bottomCompany;

        setHideBottomMarketCap(false);
        setDisablePointer(true);

        if (selectedCompany.market_cap >= otherCompany.market_cap) {
            // Begin animation
            setCorrectSelected(true);
            if (selectedCompany == topCompany) {
                setTopSelection("correct");
            } else {
                setBottomSelection("correct");
            }
            incrementScore();
            updateHighScore();
            
            await delay(2000);

            // Reset variables
            setCorrectSelected(false)    
            setTopSelection("none");
            setBottomSelection("none");

            // Hide panel contents during company switch
            setHidePanelContent(true);
            await delay(400);
            
            // Change companies
            if (score % numFetchedCompanies !== (numFetchedCompanies - 2)) {
                setCompanyIndex(companyIndex + 1);

                setHideBottomMarketCap(true);
                setHidePanelContent(false);
            } else {
                refetch().then(async () => {
                    setCompanyIndex(0);
                    setHideBottomMarketCap(true);
                    setHidePanelContent(false);             
                });
            }
            await delay(400);

            // Enable pointer events again
            setDisablePointer(false);
            
        } else {
            // Begin animation
            setIncorrectSelected(true);        
            if (selectedCompany == topCompany) {
                setTopSelection("incorrect");
            } else {
                setBottomSelection("incorrect");
            }
            await delay(1800);

            setIncorrectSelected(false);
            await delay(700);
            saveGameHistory();
            navigate("/gameover");
        }
    }
    
    if (error) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: '90vh' }}>
                <Typography variant="h4" sx={{ marginX: "16px" }}>😢 {t('errorOccurredInServices')}</Typography>
            </Box>
        )
    }

    const saveGameHistory = () => {
        const existingGameHistoryJSON = localStorage.getItem("gameHistory");
        let existingGameHistory = [];
        if (existingGameHistoryJSON) {
            existingGameHistory = JSON.parse(existingGameHistoryJSON);
        }
    
        const newGameEntry = { date: new Date().toISOString(), score: score };
        const updatedGameHistory = [newGameEntry, ...existingGameHistory];
    
        localStorage.setItem("gameHistory", JSON.stringify(updatedGameHistory));
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh", alignItems: "center", pointerEvents: disablePointer ? "none" : "unset" }}>
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
                overflowY: "hidden",
                alignItems: "center"
            }}>
                {isPending ? <PanelSkeletons /> : (
                    <Box sx={{width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end"}}>
                        <Panel
                            handleClick={handleClick}
                            id={companies[topIndex].ticker}
                            companyName={companies[topIndex].name}
                            marketCap={customNumberFormat(companies[topIndex].market_cap, gameCurrency)}
                            imageSrc={companies[topIndex].img_url}
                            index={topIndex}
                            hideAll={hidePanelContent}
                            selectedCorrectly={topSelection == "correct" ? true : false}
                            selectedIncorrectly={topSelection == "incorrect" ? true : false}
                        />
                        <Panel
                            handleClick={handleClick}
                            id={companies[bottomIndex].ticker}
                            companyName={companies[bottomIndex].name}
                            marketCap={customNumberFormat(companies[bottomIndex].market_cap, gameCurrency)}
                            imageSrc={companies[bottomIndex].img_url}
                            index={bottomIndex}
                            hideAll={hidePanelContent}
                            hideMarketCap={hideBottomMarketCap}
                            selectedCorrectly={bottomSelection == "correct" ? true : false}
                            selectedIncorrectly={bottomSelection == "incorrect" ? true : false}
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
            <Box sx={{
                zIndex: -100,
                opacity: correctSelected ? "100%" : "0%",
                transition: "opacity 0.5s",
                position: "fixed",
                minWidth: "100vw",
                minHeight: "100vh",
                backgroundImage: 'linear-gradient(to bottom, transparent, 80%, #164529)'
            }}/>
            <Box sx={{
                zIndex: -100,
                opacity: incorrectSelected ? "100%" : "0%",
                transition: "opacity 0.5s",
                position: "fixed",
                minWidth: "100vw",
                minHeight: "100vh",
                backgroundImage: 'linear-gradient(to bottom, transparent, 80%, #4D1025)'
            }}/>
        </Box>
    )
}