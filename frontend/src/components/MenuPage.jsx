import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem, Button, Box } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import Logo from '../../public/logo.png';
import { baseUri, queryClient } from "../config.js";
import { useQuery } from "@tanstack/react-query";
import {queryKeys} from "../constants.js";
import { useGameStore } from "../stores/game-store.jsx";
import { useTranslation } from 'react-i18next';
import {useLanguageStore} from "../stores/language-store.jsx";

export default function MenuPage() {
    const gameCurrency = useGameStore((state) => state.gameCurrency);
    const changeGameCurrency = useGameStore((state) => state.changeGameCurrency);
    const selectedLanguage = useLanguageStore((state) => state.language);
    const setSelectedLanguage = useLanguageStore((state) => state.changeLanguage);
    const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
    const [currencyAnchorEl, setCurrencyAnchorEl] = useState(null);
    const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
    const languageOpen = Boolean(languageAnchorEl);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState(gameCurrency);
    const navigate = useNavigate();
    const { t } = useTranslation('common');

    useEffect(() => {
        queryClient.removeQueries({ queryKey: [queryKeys.COMPANIES] });
    }, []);

    const { isPending, error, data: currencies } = useQuery({
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
            ).then((res) =>
                res.json(),
            ),
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
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", gap: "16px"}}>
                <Box component="img" src={Logo} sx={{ width: "100%", maxWidth: "200px", height: "auto" }} />
                <Button variant="contained" data-testid="start-btn" onClick={startGame}>
                    {t('startGame')}
                </Button>
                <Button 
                    variant="contained"
                    data-testid="category-btn"
                    onClick={handleCategoryClick}
                    endIcon={<ArrowDropDown />}>{selectedCategory || t('chooseCategory')}
                </Button>
                <Box>
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
                        <MenuItem data-testid="category1" onClick={() => handleCategorySelect('Category 1')} >Category 1</MenuItem>
                        <MenuItem onClick={() => handleCategorySelect('Category 2')} >Category 2</MenuItem>
                        <MenuItem onClick={() => handleCategorySelect('Category 3')} >Category 3</MenuItem>
                    </Menu>
                    <Button
                        variant="contained"
                        data-testid="currency-btn"
                        onClick={handleCurrencyClick}
                        endIcon={<ArrowDropDown />}>{selectedCurrency}
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
                        {isPending ? (
                            <MenuItem disabled>Loading...</MenuItem>
                        ) : error ? (
                            <MenuItem disabled>Error fetching currencies</MenuItem>
                        ) : (
                            currencies.map((currency) => (
                                <MenuItem key={currency} onClick={() => handleCurrencySelect(currency)}>{currency}</MenuItem>
                            ))
                        )}
                    </Menu>
                </Box>
                <Box>
                    <Button
                        data-testid="language-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        variant="contained"
                        onClick={handleLanguageClick}
                        endIcon={<ArrowDropDown />}
                    >
                        {selectedLanguage}
                    </Button>
                    <Menu
                        data-testid="language-menu"
                        anchorEl={languageAnchorEl}
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
        </Box>
    );
}
