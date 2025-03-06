import React, { useState, useRef } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  IconButton,
  Avatar,
  InputAdornment,
  Paper,
  CircularProgress,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import CustomSnackbar from './Snackbar';

// Define the theme first
const theme = createTheme({
  typography: {
    fontFamily: '"Velyra", sans-serif',
  },
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#ffffff',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '25px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          border: 'none',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#000000',
          height: '3px',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          fontSize: '1.1rem',
          color: '#000000',
          padding: '12px 24px',
          minWidth: 'auto',
          '&.Mui-selected': {
            color: '#000000',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          },
          '&:hover': {
            color: '#333333',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
          },
          // Use a function to access theme.breakpoints
          [({ breakpoints }) => breakpoints.down('sm')]: {
            fontSize: '0.9rem',
            padding: '8px 16px',
          },
        },
      },
    },
  },
});

// Define styled components after the theme
const ProfileContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '650px',
  padding: theme.spacing(5),
  margin: '0 auto',
  backgroundColor: '#ffffff',
  boxSizing: 'border-box',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    width: 'calc(100% - 5px)',
    minWidth: '300px',
    margin: theme.spacing(0, 1),
  },
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '15px',
    backgroundColor: '#fafafa',
    border: '2px solid #000000',
    transition: 'all 0.3s ease',
    '& fieldset': {
      border: 'none',
    },
    '&:hover': {
      boxShadow: '0 0 15px rgba(0, 0, 0, 0.15)',
    },
    '&.Mui-focused': {
      boxShadow: '0 0 15px rgba(0, 0, 0, 0.25)',
    },
  },
  '& .MuiInputBase-input': {
    padding: '16px',
    fontSize: '1.1rem',
    color: '#000000',
  },
  '& .MuiInputLabel-root': {
    transform: 'translate(14px, 18px) scale(1)',
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -6px) scale(0.75)',
      backgroundColor: '#fafafa',
      padding: '0 4px',
      color: '#000000',
    },
  },
  marginBottom: '25px',
  width: '100%',
});

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '15px',
  backgroundColor: '#000000',
  color: '#ffffff',
  padding: theme.spacing(1.5, 5),
  fontWeight: 700,
  fontSize: '1rem',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#333333',
    transform: 'scale(1.05)',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
  },
  '&:disabled': {
    backgroundColor: '#666666',
    color: '#ffffff',
  },
  width: '100%',
  maxWidth: '300px',
}));

const AvatarContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(4),
}));

const EditAvatarButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: '5px',
  right: '50%',
  transform: 'translateX(70%)',
  backgroundColor: '#ffffff',
  border: '2px solid #000000',
  borderRadius: '50%',
  padding: '8px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#000000',
    '& .MuiSvgIcon-root': {
      color: '#ffffff',
    },
    transform: 'translateX(70%) scale(1.1)',
  },
}));

const EditProfile = ({ name, email, bio, profilePhotoUrl,role }) => {
  const [tabValue, setTabValue] = useState(0);
  const [profileData, setProfileData] = useState({
    name: name || 'John Doe',
    email: email || 'john.doe@example.com',
    bio: bio || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    avatar: profilePhotoUrl || 'https://via.placeholder.com/150',
    role: role ||'User',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [isSnackbarOpen,setIsSnackbarOpen] = useState(false)
  const [message,setMessage] = useState("")
  const [severity,setSeverity] = useState("") 

  const fileInputRef = useRef(null);

  const closeSnackbar = ()=>{
    setIsSnackbarOpen(false)
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', profileData.name);
      formData.append('email', profileData.email);
      formData.append('bio', profileData.bio);
      if (fileInputRef.current.files[0]) {
        formData.append('profilePhoto', fileInputRef.current.files[0]);
      }

      const response = await axios.put('http://localhost:5000/users/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
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

    
    } catch (error) {
        setMessage(error.response?error.response.data.message:error.message)
        setSeverity("error")
        setIsSnackbarOpen(true)
      console.error('Profile update error:', error.response?.data || error.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);

    try {
      const response = await axios.put('http://localhost:5000/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      }, {
        withCredentials: true,
      });

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
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
        setMessage(error.response?error.response.data.message:error.message)
        setSeverity("error")
        setIsSnackbarOpen(true)
      console.error('Password change error:', error.response?.data || error.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAvatarChange = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundColor: '#ffffff',
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: { xs: 1, sm: 4 },
          boxSizing: 'border-box',
        }}
      >
        <ProfileContainer component={Paper} elevation={3}>
          

          <Tabs
          variant='scrollable'
            value={tabValue}
            onChange={handleTabChange}
            centered
            sx={{
              mb: 5,
              '& .MuiTabs-flexContainer': {
                flexWrap: 'nowrap',
                justifyContent: 'center',
              },
              [theme.breakpoints.down('sm')]: {
                '& .MuiTabs-flexContainer': {
                  flexDirection: 'row',
                },
              },
            }}
          >
            <Tab label="Profile Information" />
            <Tab label="Change Password" />
          </Tabs>

          {tabValue === 0 && (
            <Box
              component="form"
              onSubmit={handleProfileSubmit}
              sx={{
                width: '100%',
                maxWidth: '500px',
                margin: '0 auto',
              }}
            >
              <AvatarContainer>
                <Avatar
                  src={profileData.avatar}
                  alt={profileData.name}
                  sx={{
                    width: { xs: 100, sm: 130 },
                    height: { xs: 100, sm: 130 },
                    borderRadius: '50%',
                  }}
                />
                <EditAvatarButton onClick={handleAvatarChange}>
                  <EditIcon sx={{ fontSize: 22, color: '#000000' }} />
                </EditAvatarButton>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </AvatarContainer>

              <StyledTextField
                label="Name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                variant="outlined"
              />
              <StyledTextField
                label="Email"
                name="email"
                disabled
                value={profileData.email}
                onChange={handleProfileChange}
                variant="outlined"
                type="email"
              />
              <StyledTextField
                label="Bio"
                name="bio"
                value={profileData.bio}
                onChange={handleProfileChange}
                variant="outlined"
                multiline
                rows={4}
              />
              <StyledTextField
                label="Role"
                name="role"
                value={profileData.role}
                variant="outlined"
                disabled
                sx={{ '& .MuiInputBase-input': { color: '#666666' } }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <StyledButton type="submit" disabled={profileLoading}>
                  {profileLoading ? <CircularProgress size={24} sx={{ color: '#ffffff' }} /> : 'Save Changes'}
                </StyledButton>
              </Box>
            </Box>
          )}

          {tabValue === 1 && (
            <Box
              component="form"
              onSubmit={handlePasswordSubmit}
              sx={{
                width: '100%',
                maxWidth: '500px',
                margin: '0 auto',
              }}
            >
              <StyledTextField
                label="Current Password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                variant="outlined"
                type={showPasswords.currentPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility('currentPassword')}
                        edge="end"
                      >
                        {showPasswords.currentPassword ? (
                          <VisibilityOff sx={{ color: '#000000' }} />
                        ) : (
                          <Visibility sx={{ color: '#000000' }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <StyledTextField
                label="New Password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                variant="outlined"
                type={showPasswords.newPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility('newPassword')}
                        edge="end"
                      >
                        {showPasswords.newPassword ? (
                          <VisibilityOff sx={{ color: '#000000' }} />
                        ) : (
                          <Visibility sx={{ color: '#000000' }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <StyledTextField
                label="Confirm New Password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                variant="outlined"
                type={showPasswords.confirmPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility('confirmPassword')}
                        edge="end"
                      >
                        {showPasswords.confirmPassword ? (
                          <VisibilityOff sx={{ color: '#000000' }} />
                        ) : (
                          <Visibility sx={{ color: '#000000' }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <StyledButton type="submit" disabled={passwordLoading}>
                  {passwordLoading ? <CircularProgress size={24} sx={{ color: '#ffffff' }} /> : 'Change Password'}
                </StyledButton>
              </Box>
            </Box>
          )}
        </ProfileContainer>
      </Box>
      <CustomSnackbar message={message} severity={severity} open={isSnackbarOpen} closeSnackbar={closeSnackbar} />
    </ThemeProvider>
  );
};

export default EditProfile;