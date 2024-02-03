import React from 'react'
import {Typography, Menu, MenuItem, Button, Box} from '@mui/material';

export default function MenuPage() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedCategory, setSelectedCategory] = React.useState('');

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
        <Box sx={{position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: 'center', gap: "64px", height: '100vh', paddingBottom: '25%', boxSizing: 'border-box'}}>
            <Typography data-testid="text-score" variant="h5" paddingBottom="32px">Place logo here</Typography>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", gap: "16px"}}>
                <Button variant="contained">Start game</Button>
                <Button variant="contained" onClick={handleClick}>{selectedCategory || "Select category"}</Button>
                <Menu data-testid="choices-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                    <MenuItem onClick={() => handleCategorySelect('Category 1')} value="category1">Category 1</MenuItem>
                    <MenuItem onClick={() => handleCategorySelect('Category 2')} value="category2">Category 2</MenuItem>
                    <MenuItem onClick={() => handleCategorySelect('Category 3')} value="category3">Category 3</MenuItem>
                </Menu>
            </Box>

        </Box>
    );
}
