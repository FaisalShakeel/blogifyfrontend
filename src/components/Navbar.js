import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  InputBase,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MenuIcon from "@mui/icons-material/Menu";

const theme = createTheme({
  typography: {
    fontFamily: "Velyra, sans-serif",
  },
});

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

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
    <ThemeProvider theme={theme}>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "white",
          boxShadow: "none",
          zIndex: 999,
          borderBottom: "1px solid #ddd",
          width: "100%",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            maxWidth: "1280px",
            margin: "0 auto",
            px: { xs: 1, md: 4 },
            minHeight: { xs: "70px" },
          }}
        >
          {/* Left Section with Drawer Icon and Search on Mobile */}
          <Box sx={{ 
            display: "flex", 
            alignItems: "center",
            gap: { xs: 1, md: 2 },
            flex: 1
          }}>
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ 
                color: "black",
                display: { xs: "flex", md: "none" },
                padding: "8px",
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "black",
                display: { xs: "none", md: "block" },
              }}
            >
              Blogify
            </Typography>
            
            {/* Search Field */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                borderRadius: "30px",
                width: { xs: "85%", sm: "320px", md: "40%" },
                maxWidth: { md: "400px" },
                height: "53px",
              }}
            >
              <InputBase
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ 
                  flex: 1,
                  color: "black",
                  px: 2,
                  height: "100%",
                  fontSize: { xs: "14px", md: "16px" }
                }}
              />
              <IconButton sx={{ color: "black", padding: "8px", mr: 0.5 }}>
                <SearchIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Right Section (Notification and Profile) - Desktop Only */}
          <Box sx={{ 
            display: { xs: "none", md: "flex" }, 
            alignItems: "center", 
            gap: 2,
          }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "black",
                color: "white",
                fontWeight: "bold",
                fontSize: "16px",
                textTransform: "none",
                borderRadius: "20px",
                px: 3,
                "&:hover": { backgroundColor: "#333" },
              }}
            >
              Write Blog
            </Button>
            <IconButton sx={{ color: "black" }}>
              <NotificationsNoneIcon />
            </IconButton>
            <IconButton onClick={handleMenuClick}>
              <Avatar sx={{ backgroundColor: "black", color: "white" }}>A</Avatar>
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
                  color: "black" 
                } 
              }}
            >
              <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
              <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer for Mobile Navigation */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ 
          ".MuiDrawer-paper": { 
            width: 260, 
            padding: 2, 
            backgroundColor: "white" 
          } 
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar sx={{ backgroundColor: "black", color: "white" }}>A</Avatar>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            John Doe
          </Typography>
        </Box>
        <List>
          <ListItem button>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Write Blog" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
    </ThemeProvider>
  );
};

export default Navbar;