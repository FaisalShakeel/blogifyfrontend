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
  ListItemIcon,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";

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
                  width: 250,
                  borderRadius: 2,
                  backgroundColor: "white",
                  color: "black",
                  mt: 1,
                } 
              }}
            >
              {/* User Profile Section */}
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                  <Avatar 
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      backgroundColor: "black", 
                      color: "white" 
                    }}
                  >
                    A
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: "bold" }}>John Doe</Typography>
                    <Typography variant="body2" color="text.secondary">
                      john.doe@example.com
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Divider />

              {/* Menu Items */}
              <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
                <ListItemIcon>
                  <PersonOutlineIcon sx={{ color: "black" }} />
                </ListItemIcon>
                <ListItemText primary="My Profile" />
              </MenuItem>
              
              <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
                <ListItemIcon>
                  <DriveFileRenameOutlineIcon sx={{ color: "black" }} />
                </ListItemIcon>
                <ListItemText primary="Drafts" />
              </MenuItem>
              
              <Divider />
              
              <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
                <ListItemIcon>
                  <LogoutIcon sx={{ color: "black" }} />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Enhanced Drawer for Mobile Navigation */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ 
          ".MuiDrawer-paper": { 
            width: 280, 
            backgroundColor: "white" 
          } 
        }}
      >
        {/* User Profile Section in Drawer */}
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Avatar 
              sx={{ 
                width: 48, 
                height: 48, 
                backgroundColor: "black", 
                color: "white" 
              }}
            >
              A
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: "bold" }}>John Doe</Typography>
              <Typography variant="body2" color="text.secondary">
                john.doe@example.com
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Divider />

        {/* Enhanced List Items with Icons */}
        <List sx={{ px: 2 }}>
          <ListItem button sx={{ py: 1.5 }}>
            <ListItemIcon>
              <HomeOutlinedIcon sx={{ color: "black" }} />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>

          <ListItem button sx={{ py: 1.5 }}>
            <ListItemIcon>
              <CreateOutlinedIcon sx={{ color: "black" }} />
            </ListItemIcon>
            <ListItemText primary="Write Blog" />
          </ListItem>

          <ListItem button sx={{ py: 1.5 }}>
            <ListItemIcon>
              <PersonOutlineIcon sx={{ color: "black" }} />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>

          <ListItem button sx={{ py: 1.5 }}>
            <ListItemIcon>
              <DriveFileRenameOutlineIcon sx={{ color: "black" }} />
            </ListItemIcon>
            <ListItemText primary="Drafts" />
          </ListItem>

          <Divider sx={{ my: 1 }} />

          <ListItem button sx={{ py: 1.5 }}>
            <ListItemIcon>
              <LogoutIcon sx={{ color: "black" }} />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
    </ThemeProvider>
  );
};

export default Navbar;