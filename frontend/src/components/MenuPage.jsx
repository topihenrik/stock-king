import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem, Button, Box } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import Logo from '../../public/logo.png';
import {queryClient} from "../config.js";
import {queryKeys} from "../constants.js";

export default function MenuPage() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        queryClient.removeQueries({ queryKey: [queryKeys.COMPANIES] });
    }, []);

    const startGame = () => {
        navigate("/game");
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        handleClose();
      };

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
                <Button variant="contained" data-testid="category-btn" onClick={handleClick} endIcon={<ArrowDropDown />}>{selectedCategory || "Choose category"}</Button>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
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
            </Box>
        </Box>
    );
}
