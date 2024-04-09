import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem, Button, Box, keyframes } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import Logo from '../../public/logo.svg';
import { baseUri, queryClient } from "../config.js";
import { useQuery } from "@tanstack/react-query";
import {queryKeys} from "../constants.js";
import { useTranslation } from 'react-i18next';
import LeaderboardModal from "./LeaderboardModal.jsx";
import GameHistoryModal from "./GameHistoryModal.jsx";
import {useLanguageStore} from "../stores/language-store.jsx";
import {useCurrencyStore} from "../stores/currency-store.jsx";
import {useCategoryStore} from "../stores/category-store.jsx";

function stringToCamelCase(string) {
    return string.split(" ").map((word, i) => {
        if (i == 0) return word.toLowerCase();
        return word[0].toUpperCase() + word.slice(1).toLowerCase();
    }).join("");
}

export default function MenuPage() {
    const gameCurrency = useCurrencyStore((state) => state.gameCurrency);
    const changeGameCurrency = useCurrencyStore((state) => state.changeGameCurrency);
    const selectedLanguage = useLanguageStore((state) => state.language);
    const setSelectedLanguage = useLanguageStore((state) => state.changeLanguage);
    const selectedCategory = useCategoryStore((state) => state.category);
    const setSelectedCategory = useCategoryStore((state) => state.changeCategory);
    const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
    const [currencyAnchorEl, setCurrencyAnchorEl] = useState(null);
    const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
    const [leaderboardOpen, setLeaderboardOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const languageOpen = Boolean(languageAnchorEl);
    const [selectedCurrency, setSelectedCurrency] = useState(gameCurrency);
    const navigate = useNavigate();
    const { t } = useTranslation('common');
    const logoAnimation = keyframes`
        0% { transform: translate(0px, -12px); }
        100% { transform: translate(0px, 12px); }
    `;

    useEffect(() => {
        queryClient.removeQueries({ queryKey: [queryKeys.COMPANIES] });
    }, []);

    const { isPending: currenciesPending, currencyError, data: currencies } = useQuery({
        refetchOnWindowFocus: false,
        queryKey: [queryKeys.CURRENCIES],
        queryFn: () =>
            fetch(
                `${baseUri}/get_all_currencies`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            ).then((res) => res.json())
    });

    const { isPending: categoriesPending, error: categoryError, data: categories } = useQuery({
        refetchOnWindowFocus: false,
        queryKey: [queryKeys.CATEGORIES],
        queryFn: () =>
            fetch(
                `${baseUri}/get_categories`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            ).then((res) => res.json())
    });

    const startGame = () => {
        navigate("/game");
    }

    const handleCategoryClick = (event) => {
        setCategoryAnchorEl(event.currentTarget);
    };

    const handleCurrencyClick = (event) => {
        setCurrencyAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setCategoryAnchorEl(null);
        setCurrencyAnchorEl(null);
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        handleClose();
    };

    const handleCurrencySelect = (currency) => {
        setSelectedCurrency(currency);
        changeGameCurrency(currency);
        handleClose();
    }

    const handleLanguageClick = (event) => {
        setLanguageAnchorEl(event.currentTarget);
    }

    const handleLanguageClose = () => {
        setLanguageAnchorEl(null);
    }

    const handleLanguageSelect = (language) => {
        setSelectedLanguage(language);
        handleLanguageClose();
    }

    const handleLeaderboardOpen = () => {
        setLeaderboardOpen(true);
    }

    const handleOpenHistory = () => {
        setIsHistoryOpen(true);
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
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Box component="img" src={Logo} sx={{ 
                    width: { xs: "256px", md: "384px"},
                    maxHeight: "512px", 
                    marginBottom: "32px",
                    marginTop: {md: "256px"},
                    animation: `${logoAnimation} 2s ease-in-out infinite alternate` 
                }} />
                <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", width: "270px"}}>
                    <Button variant="contained" data-testid="start-btn" onClick={startGame} sx={{
                        width: "100%", minHeight: "64px", fontSize: "2rem"
                    }}>
                        {t('startGame')}
                    </Button>
                    <Box sx={{ display: 'flex', gap: '16px', width: '100%'}}>
                        <Box sx={{width: '100%'}}>
                            <Menu
                                anchorEl={categoryAnchorEl}
                                open={Boolean(categoryAnchorEl)}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                {categoriesPending ? (
                                    <MenuItem disabled data-testid="categories-loading">{t('loading')}</MenuItem>
                                ) : categoryError ? (
                                    <MenuItem disabled data-testid="categories-error">{t('error')}</MenuItem>
                                ) : (
                                    [
                                        <MenuItem key="all-categories" onClick={() => handleCategorySelect("All categories")}>
                                            {t('allCategories')}
                                        </MenuItem>,
                                        ...categories.map((category) => (
                                            <MenuItem key={category} onClick={() => handleCategorySelect(category)}>
                                                {t(stringToCamelCase(category))}
                                            </MenuItem>
                                        ))
                                    ]
                                )}
                            </Menu>
                            <Button
                                variant="contained"
                                data-testid="currency-btn"
                                onClick={handleCurrencyClick}
                                endIcon={<ArrowDropDown />}
                                sx={{ width: "100%" }}
                            >
                                {selectedCurrency}
                            </Button>
                            <Menu
                                anchorEl={currencyAnchorEl}
                                open={Boolean(currencyAnchorEl)}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                {currenciesPending ? (
                                    <MenuItem disabled>{t('loading')}</MenuItem>
                                ) : currencyError ? (
                                    <MenuItem disabled>{t('error')}</MenuItem>
                                ) : (
                                    currencies.map((currency) => (
                                        <MenuItem key={currency} onClick={() => handleCurrencySelect(currency)}>{currency}</MenuItem>
                                    ))
                                )}
                            </Menu>
                        </Box>
                        <Box sx={{width: '100%'}}>
                            <Button
                                data-testid="language-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                variant="contained"
                                onClick={handleLanguageClick}
                                endIcon={<ArrowDropDown />}
                                sx={{ width: "100%" }}
                            >
                                {selectedLanguage}
                            </Button>
                            <Menu
                                data-testid="language-menu"
                                anchorEl={languageAnchorEl}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                                open={languageOpen}
                                onClose={handleLanguageClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem
                                    data-testid="language-menu-item-1"
                                    sx={{ textTransform: 'uppercase' }}
                                    onClick={() => { handleLanguageSelect('en')}}
                                >
                                    en
                                </MenuItem>
                                <MenuItem
                                    data-testid="language-menu-item-2"
                                    sx={{ textTransform: 'uppercase' }}
                                    onClick={() => { handleLanguageSelect('fi')}}
                                >
                                    fi
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Box>
                    <Button
                        variant="contained"
                        data-testid="category-btn"
                        onClick={handleCategoryClick}
                        endIcon={<ArrowDropDown />}
                        sx={{ width: '100%' }}
                    >
                        {t(stringToCamelCase(selectedCategory)) || t('chooseCategory')}
                    </Button>
                    <Button
                        onClick={handleLeaderboardOpen}
                        sx={{width: '100%'}}
                        variant="contained"
                    >
                        {t('leaderboard')}
                    </Button>
                    <Button
                        sx={{width: '100%'}}
                        onClick={handleOpenHistory}
                        variant="contained"
                    >
                        {t('yourHistory')}
                    </Button>
                </Box>
                <GameHistoryModal open={isHistoryOpen} setOpen={setIsHistoryOpen}/>
                <LeaderboardModal open={leaderboardOpen} setOpen={setLeaderboardOpen}/>
            </Box>
        </Box>
    );
}
