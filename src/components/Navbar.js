import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Box, InputBase, Avatar, Menu, MenuItem, IconButton, Grid, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const categories = ["Lifestyle", "Technology", "Health", "Business"];
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "white", boxShadow: 2, zIndex: 999 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5" sx={{ fontFamily: "Velyra, sans-serif",fontWeight:"bold", color: "black" }}>
          Blogify
        </Typography>

        {/* Search Field */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: 20,
            padding: "5px 15px",
            width: "40%",
            boxShadow: 1,
          }}
        >
          <SearchIcon sx={{ color: "black" }} />
          <InputBase
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ marginLeft: 1, flex: 1, color: "black",fontFamily:"Velyra" }}
          />
        </Box>

        
        {/* Profile Menu */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={handleMenuClick}>
            <Avatar sx={{ backgroundColor: "black",fontFamily:"Velyra",fontWeight:"bold" }}>A</Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                width: 200,
                borderRadius: 2,
                backgroundColor: "white",
                color: "black",
              },
            }}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
