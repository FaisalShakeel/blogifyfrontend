import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Tabs,
  Tab,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Paper,
  Stack,
  Chip,
  ThemeProvider,
  createTheme,
  CssBaseline,
  IconButton,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AccessTime, Delete, Edit } from '@mui/icons-material';
import axios from 'axios';
import moment from 'moment';
import CustomSnackbar from '../components/Snackbar';

// Theme configuration
const theme = createTheme({
  typography: {
    fontFamily: '"Velyra", "Roboto", "Helvetica", "Arial", sans-serif', // Fallback fonts
  },
  palette: {
    mode: "light",
    background: { default: "#f5f5f5" },
    text: { primary: "#000000" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Velyra';
          font-style: normal;
          font-weight: 400;
          src: url('/path-to-velyra-font.woff2') format('woff2');
        }
      `,
    },
    MuiTab: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          margin: '0 4px',
          '&.Mui-selected': {
            backgroundColor: '#000',
            color: '#fff',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          display: 'none', // Remove the blue bottom border
        },
      },
    },
  },
});
const extractTextFromHTML = (htmlString) => {
  if (!htmlString) return "";
  const temp = document.createElement("div");
  temp.innerHTML = htmlString;
  const text = temp.textContent || temp.innerText;
  return text.replace(/\s+/g, " ").trim();
};


// Styled Components
const StyledCard = styled(Card)({
  backgroundColor: '#fff',
  borderRadius: 16,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
});

const StyledAvatar = styled(Avatar)({
  width: 150,
  height: 150,
  border: '4px solid #fff',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
});

const StyledChip = styled(Chip)({
  borderRadius: 8,
  backgroundColor: '#f5f5f5',
  '&:hover': {
    backgroundColor: '#eeeeee',
  },
});

const BlogCard = styled(Paper)({
  padding: '16px',
  display: 'flex',
  gap: '16px',
  borderRadius: 12,
  backgroundColor: '#fff',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
});

const TabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
  </div>
);
const BlogList = ({ blogs, showAuthor = false, saved, liked }) => (
  <Stack spacing={2}>
    {blogs.map((blog) => (
      <BlogCard key={blog.id} elevation={0}>
        <Box sx={{ flex: 1 }}>
          {/* Blog Title and Category */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              {blog.title}
            </Typography>
            <Chip label={blog.category} size="small" sx={{ backgroundColor: '#666666', color: 'white' }} />
          </Box>

          {/* Blog Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {blog.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  sx={{
                    backgroundColor: 'black',
                    color: 'white',
                    borderRadius: 1,
                    fontSize: '0.75rem',
                  }}
                />
              ))}
            </Box>
          )}

          {/* Blog Content Excerpt */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {extractTextFromHTML(blog.content ? blog.content.slice(0, 200) + '...' : '')}
          </Typography>

          {/* Blog Metadata (Date, Author, Actions) */}
          <Box sx={{ display: 'flex', gap: 2, color: 'text.secondary', alignItems: 'center' }}>
            <Typography variant="caption">
              {moment(blog.createdAt).fromNow()}
            </Typography>
            {/* Conditionally render author */}
            {showAuthor && (
              <Typography variant="caption">
                by {blog.publishedByName}
              </Typography>
            )}
            {/* Conditionally render edit and delete buttons */}
            {!saved && !liked && (
              <Box sx={{ marginLeft: 'auto', display: 'flex', gap: 1 }}>
                <IconButton aria-label="edit" size="small" sx={{ color: 'text.secondary' }}>
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton aria-label="delete" size="small" sx={{ color: 'text.secondary' }}>
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        </Box>
      </BlogCard>
    ))}
  </Stack>
)
const Profile = () => {
  const {id} = useParams()
  const [tabValue, setTabValue] = useState(0);
  const [editTabValue, setEditTabValue] = useState(0);
  const [isAuthor,setIsAuthor] = useState(false)
  const [user ,setUser] = useState({})
  const [yourBlogs, setYourBlogs] = useState([])
  const [likedBlogs, setLikedBlogs] = useState([])
  const [savedBlogs ,setSavedBlogs] = useState([])
  const [lists, setLists] = useState([])
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true)

  const[isSnackbarOpen, setIsSnackbarOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [severity ,setSeverity] = useState("")

  const closeSnackbar=()=>{
    setIsSnackbarOpen(false)
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditTabChange = (event, newValue) => {
    setEditTabValue(newValue);
  };

  const handleBack = () => {
    navigate(-1);
  };
  const getProfile = async()=>{
    setLoading(true)
    try{
      const response = await axios.get(`http://localhost:5000/users/profile/${id}`,{withCredentials:true})
      console.log("Profile",response.data)
      if(response.data.success){
        setUser(response.data.user)
        setYourBlogs(response.data.blogs)
        setLikedBlogs(response.data.likedBlogs)
        setSavedBlogs(response.data.savedBlogs)
        setLists(response.data.lists)
      }
      else{
        setMessage(response.data.message)
        setSeverity("error")
        setIsSnackbarOpen(true)

      }
    }
    catch(e){
      setMessage(e.response?e.response.data.message:e.message)
        setSeverity("error")
        setIsSnackbarOpen(true)
    }
    finally{
      setLoading(false)

    }
  }
  useEffect(()=>{
  if(user){
  setIsAuthor(user.role=="Author")
  }
  },[user])
  useEffect(()=>{
    getProfile()
  },[id])
  if(loading){
    return(
      <Box>
        
        <Navbar/>
    <Box sx={{height:"100vh",width:"100%",display:"flex",justifyContent:"center",alignItems:"center"}}>
      <CircularProgress sx={{color:'black'}} thickness={8} size={40}></CircularProgress>

    </Box></Box>)
  }
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
    
      <Box sx={{
        minWidth: "100%", 
        margin: '0 auto', 
        p: 3,
        backgroundColor: '#fff'
      }}>
        {/* Back Button */}
        <Box sx={{ mb: 2 }}>
          <IconButton 
            onClick={handleBack}
            sx={{ 
              backgroundColor: '#f5f5f5',
              '&:hover': { backgroundColor: '#eeeeee' }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>

        <Grid container spacing={3}>
          {/* Left Section */}
          <Grid item xs={12} md={8}>
            <StyledCard>
              <CardContent sx={{ pt: 2 }}>
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                  <StyledAvatar src={user.profilePhotoUrl} alt={user.name} />
                  <Typography variant="h4" sx={{ mt: 2, fontWeight: 600 }}>
                    {user.name}
                  </Typography>
                  
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {user.bio}
                  </Typography>
                </Box>

                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs variant='scrollable' value={tabValue} onChange={handleTabChange}>
                    <Tab label="Your Lists" sx={{borderRadius:"35px"}} />
                    {isAuthor && <Tab label="Your Blogs" sx={{borderRadius:"35px"}} />}
                    <Tab label="Saved Blogs" sx={{borderRadius:"35px"}} />
                    <Tab label="Liked Blogs" sx={{borderRadius:"35px"}} />
                   
                    <Tab label="Edit Profile" sx={{borderRadius:"35px"}} />
                  </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                <Grid container spacing={3}>
  {lists.map((list) => (
    <Grid item xs={12} sm={6} key={list._id}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          backgroundColor: '#fff',
          borderRadius: 3,
          border: '1px solid rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s ease-in-out',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-4px)',
            '& .hover-reveal': {
              opacity: 1,
            },
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '3px',
            background: 'linear-gradient(90deg, #000 0%, #555 100%)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          },
          '&:hover::after': {
            opacity: 1,
          }
        }}
      >
        {/* List Image with enhanced styling */}
        <Avatar
          variant="rounded"
          src={list.photoUrl}
          sx={{
            width: 96,
            height: 96,
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            border: '2px solid #fff',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            }
          }}
        />

        {/* List Details with improved typography */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: '#000',
              fontSize: '1.1rem',
              letterSpacing: '-0.3px'
            }}
          >
            {list.title}
          </Typography>
          
          <Typography
            variant="body2"
            sx={{
              color: '#333',
              mb: 1.5,
              lineHeight: 1.4,
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
            }}
          >
            {list.description}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              size="small"
              label={`${list.blogs.length} blogs`}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                color: '#444',
                fontWeight: 500,
                px: 0.5,
                height: 24,
                fontSize: '0.75rem',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                }
              }}
            />
            
          </Box>
        </Box>

        {/* Actions with hover effect */}
        <Box
          className="hover-reveal"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            opacity: 0.7,
            transition: 'opacity 0.3s ease',
          }}
        >
          <IconButton
            aria-label="edit"
            size="small"
            sx={{
              color: '#000',
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              },
              width: 36,
              height: 36,
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
          
          <IconButton
            aria-label="delete"
            size="small"
            sx={{
              color: '#000',
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              },
              width: 36,
              height: 36,
            }}
          >
            
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      </Paper>
    </Grid>
  ))}
</Grid>
                </TabPanel>

                {isAuthor && (
                  <TabPanel value={tabValue} index={1}>
                    <BlogList blogs={yourBlogs} saved={false} liked={false} />
                  </TabPanel>
                )}

                <TabPanel value={tabValue} index={isAuthor ? 2 : 1}>
                  <BlogList blogs={savedBlogs} saved={true} liked={false} showAuthor={true} />
                </TabPanel>
                <TabPanel value={tabValue} index={isAuthor ? 3 : 1}>
                  <BlogList blogs={likedBlogs} showAuthor={true} saved={false} liked={true} />
                </TabPanel>
                


              </CardContent>
            </StyledCard>
          </Grid>

          {/* Right Section */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* Following Section */}
              <StyledCard>
                <CardContent>
                  <Typography variant="h6"  sx={{ mb: 2,textAlign:"center", backgroundColor:"black",color:"white",borderRadius:"35px",mb:2 }}>
                    Following ({user.followings.length})
                  </Typography>
                  <List>
                    {user.followings.map(user => (
                      <React.Fragment key={user._id}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar src={user.profilePhotoUrl} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={user.name}
                            secondary={user.bio}
                          />
                        </ListItem>
                        <Divider component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </StyledCard>

              {/* Followers Section */}
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2,textAlign:"center", backgroundColor:"black",color:"white",borderRadius:"35px" }}>
                    Followers ({user.followers.length})
                  </Typography>
                  <List>
                    {user.followers.map(user => (
                      <React.Fragment key={user._id}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar src={user.profilePhotoUrl} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={user.name}
                            secondary={user.bio}
                          />
                        </ListItem>
                        <Divider component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </StyledCard>
            </Stack>
          </Grid>
        </Grid>
        <CustomSnackbar open={isSnackbarOpen} message={message} severity={severity} closeSnackbar={closeSnackbar}/>
      </Box>
    </ThemeProvider>
  );
};

export default Profile;