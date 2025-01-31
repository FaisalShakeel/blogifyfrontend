import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CssBaseline,
  Paper,
  Link,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom"; // Add the useNavigate hook for routing

const theme = createTheme({
  typography: { fontFamily: "Velyra, sans-serif" },
  palette: {
    mode: "light",
    background: { default: "#f5f5f5" },
    text: { primary: "#000000" },
  },
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Use navigate for redirection

  const validateForm = () => {
    let tempErrors = {};
    if (!email) tempErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      tempErrors.email = "Invalid email format";
    if (!password) tempErrors.password = "Password is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    switch (field) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const userData = { email, password };
    console.log("User Data:", userData);
    // TODO: Send data to backend (API call)
  };

  const handleRedirectToSignUp = () => {
    navigate("/create-account"); // Redirect to the create account page
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="sm">
        <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", pt: 4 }}>
          <Paper
            elevation={6}
            sx={{
              p: 4,
              width: "100%",
              maxWidth: 480,
              borderRadius: 4,
              backgroundColor: "white",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              height: "600px", // Explicitly setting the height
              display: "flex",
              flexDirection: "column",
              justifyContent: "center", // Align content properly in the center
            }}
          >
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography component="h1" variant="h4" sx={{ fontWeight: "bold" }}>
                Blogify
              </Typography>
              <Typography component="h2" variant="h6" sx={{ mt: 1, color: "gray" }}>
                Log in to Your Account
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  bgcolor: "black",
                  color: "white",
                  borderRadius: "8px",
                  py: 1.5,
                  fontSize: "1rem",
                  "&:hover": { bgcolor: "#333333" },
                }}
              >
                Log In
              </Button>
            </Box>

            <Box onClick={()=>{
                navigate("/create-account")
            }} sx={{cursor:"default", textAlign: "center", mt: 3 }}>
              <Typography variant="body1" color="textSecondary">
                Don't have an account?
               
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
