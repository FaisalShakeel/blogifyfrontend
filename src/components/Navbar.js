import React, { useContext, useEffect, useState } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const theme = createTheme({
  typography: {
    fontFamily: "Velyra, sans-serif",
  },
});

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const [showSearchBar, setShowSearchBar] = useState(true);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    setShowSearchBar(!location.pathname.includes("search"));
  }, [location.pathname]);

  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "white",
          boxShadow: "none",
          zIndex: 999,
          overflow: "hidden",
          borderBottom: "1px solid #ddd",
          width: "100%",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            maxWidth: "95vw",
            margin: "0 auto",
            px: { xs: 1, md: 4 },
            minHeight: { xs: "70px" },
          }}
        >
          {/* Left Section with Drawer Icon and Search on Mobile */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, md: 2 },
              flex: 1,
            }}
          >
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

            {showSearchBar && (
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
                    fontSize: { xs: "14px", md: "16px" },
                  }}
                />
                <IconButton
                  onClick={() => {
                    navigate(`search?query=${searchQuery}`);
                  }}
                  sx={{ color: "black", padding: "8px", mr: 0.5 }}
                >
                  <SearchIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>

          {/* Right Section (Notification and Profile/Login) - Desktop Only */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 2,
            }}
          >
            <Button
              onClick={() => {
                navigate("/write-blog");
              }}
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
            
            {user ? (
              <>
                <IconButton onClick={()=>{
                  navigate("/notifications")
                }} sx={{ color: "black" }}>
                  <NotificationsNoneIcon />
                </IconButton>
                <IconButton onClick={handleMenuClick}>
                  <Avatar
                    sx={{ backgroundColor: "black", color: "white" }}
                    src={user.profilePhotoUrl}
                    alt={user.name?.charAt(0)}
                  />
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
                    },
                  }}
                >
                  <Box sx={{ p: 2 }}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
                    >
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          backgroundColor: "black",
                          color: "white",
                        }}
                        src={user.profilePhotoUrl}
                        alt={user.name?.charAt(0)}
                      />
                      <Box>
                        <Typography sx={{ fontWeight: "bold" }}>
                          {user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider />

                  <MenuItem
                    onClick={() => {
                      navigate(`/profile/${user.id}`);
                    }}
                    sx={{ py: 1.5 }}
                  >
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
              </>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                variant="outlined"
                sx={{
                  borderColor: "black",
                  color: "black",
                  fontSize: "16px",
                  textTransform: "none",
                  borderRadius: "20px",
                  px: 3,
                  borderWidth: 2,
                  "&:hover": {
                    borderColor: "#333",
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                    borderWidth: 2,
                  },
                }}
              >
                Login
              </Button>
            )}
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
            backgroundColor: "white",
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          {user ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  backgroundColor: "black",
                  color: "white",
                }}
                src={user.profilePhotoUrl}
                alt={user.name?.charAt(0)}
              />
              <Box>
                <Typography sx={{ fontWeight: "bold" }}>{user.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography sx={{ fontWeight: "bold", mb: 2 }}>
                Blogify
              </Typography>
              <Button
                onClick={() => navigate("/login")}
                variant="contained"
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  borderRadius: "20px",
                  textTransform: "none",
                  px: 3,
                  "&:hover": { backgroundColor: "#333" },
                }}
              >
                Login
              </Button>
            </Box>
          )}
        </Box>

        <Divider />

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

          {user && (
            <>
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
            </>
          )}
        </List>
      </Drawer>
    </ThemeProvider>
  );
};

export default Navbar;