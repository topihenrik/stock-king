import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem, Button, Box } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import Logo from '../../public/logo.png';
import { baseUri, queryClient } from "../config.js";
import { useQuery } from "@tanstack/react-query";
import {queryKeys} from "../constants.js";

export default function MenuPage() {
    const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
    const [currencyAnchorEl, setCurrencyAnchorEl] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const navigate = useNavigate();

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
        handleClose();
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
                <Button variant="contained" data-testid="start-btn" onClick={startGame}>Start game</Button>
                <Button 
                    variant="contained"
                    data-testid="category-btn"
                    onClick={handleClick}
                    endIcon={<ArrowDropDown />}>{selectedCategory || "Choose category"}
                </Button>
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
                    <MenuItem onClick={() => handleCategorySelect('Category 1')} >Category 1</MenuItem>
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
        </Box>
    );
}
