import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CssBaseline,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Paper,
  Avatar,
  IconButton,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomSnackbar from "../components/Snackbar";

const theme = createTheme({
  typography: { fontFamily: "Velyra, sans-serif" },
  palette: {
    mode: "light",
    background: { default: "#f5f5f5" },
    text: { primary: "#000000" },
  },
});

const SignUp = () => {
  const navigate=useNavigate()
  
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Reader");
  const [photo, setPhoto] = useState(null);
  const [profilePhoto,setProfilePhoto] = useState(null)
  const [errors, setErrors] = useState({});
  const [loading,setLoading] = useState(false)
  const [isSnackbarOpen,setIsSnackbarOpen] = useState(false)
  const [messae,setMessage] = useState("")
  const [severity,setSeverity] = useState("") 

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file))
      setProfilePhoto(file)
    };
  };
  

  const validateForm = () => {
    let tempErrors = {};
    if (!fullName) tempErrors.fullName = "Full Name is required";
    if (!bio) tempErrors.bio = "Bio is required";
    if (!email) tempErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      tempErrors.email = "Invalid email format";
    if (!password) tempErrors.password = "Password is required";
    if (!confirmPassword) tempErrors.confirmPassword = "Confirm Password is required";
    if (password !== confirmPassword) tempErrors.confirmPassword = "Passwords do not match";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const closeSnackbar=()=>{
    setIsSnackbarOpen(false)
  }

  const handleInputChange = (field, value) => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    switch (field) {
      case "fullName":
        setFullName(value);
        break;
      case "bio":
        setBio(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true)
    try{
      const formData= new FormData()
      formData.append("name",fullName)
      formData.append("email",email)
      formData.append("password",password)
      formData.append("bio",bio)
      formData.append("role",role)
      formData.append("profilePhoto",profilePhoto)
      const response = await axios.post(
        `http://localhost:5000/users/create-account`,
        formData,
        { withCredentials: true }
      );
      console.log("Sign Up Response",response.data)
      if(response.data.success){
        setMessage(response.data.message)
        setSeverity("success")
        setIsSnackbarOpen(true)
      }
      else{
        setMessage(response.data.message)
        setSeverity("error")
        setIsSnackbarOpen(true)
      }
    }
    catch(e){
      setMessage(e.response?e.response.data.message:e.messae)
      setSeverity("error")
      setIsSnackbarOpen(true)

    }
    finally{
      setLoading(false)

    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="sm">
        <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", mt: 4 }}>
          <Paper
            elevation={6}
            sx={{
              p: 4,
              width: "100%",
              maxWidth: 480,
              borderRadius: 4,
              backgroundColor: "white",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography component="h1" variant="h4" sx={{ fontWeight: "bold" }}>
                Blogify
              </Typography>
              <Typography component="h2" variant="h6" sx={{ mt: 1, color: "gray" }}>
                Create Your Account
              </Typography>
            </Box>

            <Box sx={{ textAlign: "center", mb: 2, position: "relative" }}>
              <Avatar
                src={photo || "https://via.placeholder.com/100"}
                sx={{ width: 100, height: 100, margin: "auto" }}
              />
              <IconButton component="label" sx={{ position: "absolute", bottom: 0, right: "40%", background: "white" }}>
                <PhotoCameraIcon />
                <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
              </IconButton>
            </Box>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Full Name"
                value={fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                error={!!errors.fullName}
                helperText={errors.fullName}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Bio"
                multiline
                rows={3}
                value={bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                error={!!errors.bio}
                helperText={errors.bio}
              />
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
              <TextField
                margin="normal"
                required
                fullWidth
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
              <FormLabel sx={{ mt: 2, display: "block", fontWeight: "bold" }}>I am signing up as:</FormLabel>
              <RadioGroup row value={role} onChange={(e) => setRole(e.target.value)} sx={{ mb: 2 }}>
                <FormControlLabel value="Reader" control={<Radio />} label="Reader" />
                <FormControlLabel value="Author" control={<Radio />} label="Author" />
              </RadioGroup>
              <Button type="submit" disabled={loading} fullWidth variant="contained" sx={{ mt: 2, bgcolor: "black", color: "white", borderRadius: "8px", py: 1.5, fontSize: "1rem", "&:hover": { bgcolor: "#333333" } }}>
              {loading?"Creating Account":"Sign Up"}
              </Button>
            </Box>
             <Box onClick={()=>{
                            navigate("/login")
                        }} sx={{cursor:"pointer", textAlign: "center", mt: 3 }}>
                          <Typography variant="body1"   color="textSecondary">
                            Already Have Account?
                           
                          </Typography>
                        </Box>
          </Paper>
        </Box>
        <CustomSnackbar open={isSnackbarOpen} message={messae} severity={severity} closeSnackbar={closeSnackbar} />
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;