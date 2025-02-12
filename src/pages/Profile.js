import React, { useState } from 'react';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

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

// Mock Data
const userData = {
  name: "Sarah Anderson",
  username: "@sarahanderson",
  avatar: "/api/placeholder/150/150",
  bio: "Digital storyteller | Tech enthusiast | Coffee lover",
  role: "author", // or "reader"
  email: "sarah.anderson@example.com",
  followers: [
    { id: 1, name: "John Doe", avatar: "/api/placeholder/40/40", bio: "Writer & Developer" },
    { id: 2, name: "Jane Smith", avatar: "/api/placeholder/40/40", bio: "Travel Blogger" },
  ],
  following: [
    { id: 1, name: "Mike Johnson", avatar: "/api/placeholder/40/40", bio: "Tech Reviewer" },
    { id: 2, name: "Emily Brown", avatar: "/api/placeholder/40/40", bio: "Food Blogger" },
  ],
  lists: [
    { id: 1, title: "Tech Trends 2025", image: "/api/placeholder/80/80", blogCount: 15 },
    { id: 2, title: "Coffee Reviews", image: "/api/placeholder/80/80", blogCount: 8 },
  ],
  blogs: [
    {
      id: 1,
      title: "The Future of AI",
      image: "/api/placeholder/200/150",
      description: "Exploring the latest developments in artificial intelligence and their impact on society.",
      category: "Technology",
      readTime: "5 min",
      date: "Feb 10, 2025"
    },
    {
      id: 2,
      title: "Best Coffee Shops in NYC",
      image: "/api/placeholder/200/150",
      description: "A curated guide to the most unique and inspiring coffee spots in New York City.",
      category: "Lifestyle",
      readTime: "8 min",
      date: "Feb 8, 2025"
    },
  ],
  savedBlogs: [
    {
      id: 3,
      title: "The Art of Street Photography",
      image: "/api/placeholder/200/150",
      description: "Master the fundamentals of capturing compelling street photography.",
      category: "Photography",
      readTime: "10 min",
      date: "Feb 9, 2025",
      author: "Mike Johnson"
    },
    {
      id: 4,
      title: "Sustainable Living Guide",
      image: "/api/placeholder/200/150",
      description: "Practical tips for reducing your carbon footprint and living sustainably.",
      category: "Lifestyle",
      readTime: "7 min",
      date: "Feb 7, 2025",
      author: "Emily Brown"
    },
  ]
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

const BlogList = ({ blogs, showAuthor = false }) => (
  <Stack spacing={2}>
    {blogs.map(blog => (
      <BlogCard key={blog.id} elevation={0}>
        <Avatar
          variant="rounded"
          src={blog.image}
          sx={{ width: 200, height: 150, flexShrink: 0 }}
        />
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {blog.title}
            </Typography>
            <StyledChip label={blog.category} size="small" />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {blog.description}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, color: 'text.secondary' }}>
            <Typography variant="caption">
              {blog.date}
            </Typography>
            <Typography variant="caption">
              {blog.readTime} read
            </Typography>
            {showAuthor && (
              <Typography variant="caption">
                by {blog.author}
              </Typography>
            )}
          </Box>
        </Box>
      </BlogCard>
    ))}
  </Stack>
);

const Profile = () => {
  const [tabValue, setTabValue] = useState(0);
  const [editTabValue, setEditTabValue] = useState(0);
  const isAuthor = userData.role === 'author';
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditTabChange = (event, newValue) => {
    setEditTabValue(newValue);
  };

  const handleBack = () => {
    navigate(-1);
  };

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
                  <StyledAvatar src={userData.avatar} alt={userData.name} />
                  <Typography variant="h4" sx={{ mt: 2, fontWeight: 600 }}>
                    {userData.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {userData.username}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {userData.bio}
                  </Typography>
                </Box>

                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={tabValue} onChange={handleTabChange} centered>
                    <Tab label="Your Lists" sx={{borderRadius:"35px"}} />
                    {isAuthor && <Tab label="Your Blogs" sx={{borderRadius:"35px"}} />}
                    <Tab label="Saved Blogs" sx={{borderRadius:"35px"}} />
                    <Tab label="Edit Profile" sx={{borderRadius:"35px"}} />
                  </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                  <Grid container spacing={2}>
                    {userData.lists.map(list => (
                      <Grid item xs={12} sm={6} key={list.id}>
                        <Paper elevation={0} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, backgroundColor: '#fff' }}>
                          <Avatar
                            variant="rounded"
                            src={list.image}
                            sx={{ width: 80, height: 80 }}
                          />
                          <Box>
                            <Typography variant="h6">{list.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {list.blogCount} blogs
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </TabPanel>

                {isAuthor && (
                  <TabPanel value={tabValue} index={1}>
                    <BlogList blogs={userData.blogs} />
                  </TabPanel>
                )}

                <TabPanel value={tabValue} index={isAuthor ? 2 : 1}>
                  <BlogList blogs={userData.savedBlogs} showAuthor={true} />
                </TabPanel>

                {/* Edit Profile Tab */}
                <TabPanel value={tabValue} index={isAuthor ? 3 : 2}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={editTabValue} onChange={handleEditTabChange} centered>
                      <Tab label="Profile Information" sx={{borderRadius:"35px"}} />
                      <Tab label="Change Password" sx={{borderRadius:"35px"}} />
                    </Tabs>
                  </Box>

                  <TabPanel value={editTabValue} index={0}>
                    <Box sx={{ mt: 2 }}>
                      <TextField
                        fullWidth
                        label="Name"
                        defaultValue={userData.name}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Email"
                        defaultValue={userData.email}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Bio"
                        defaultValue={userData.bio}
                        multiline
                        rows={4}
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Role"
                        defaultValue={userData.role}
                        disabled
                        sx={{ mb: 2 }}
                      />
                      <Button variant="contained" sx={{ backgroundColor: '#000', color: '#fff' }}>
                        Save Changes
                      </Button>
                    </Box>
                  </TabPanel>

                  <TabPanel value={editTabValue} index={1}>
                    <Box sx={{ mt: 2 }}>
                      <TextField
                        fullWidth
                        label="Current Password"
                        type="password"
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="New Password"
                        type="password"
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Confirm New Password"
                        type="password"
                        sx={{ mb: 2 }}
                      />
                      <Button variant="contained" sx={{ backgroundColor: '#000', color: '#fff' }}>
                        Change Password
                      </Button>
                    </Box>
                  </TabPanel>
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
                    Following ({userData.following.length})
                  </Typography>
                  <List>
                    {userData.following.map(user => (
                      <React.Fragment key={user.id}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar src={user.avatar} />
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
                    Followers ({userData.followers.length})
                  </Typography>
                  <List>
                    {userData.followers.map(user => (
                      <React.Fragment key={user.id}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar src={user.avatar} />
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
      </Box>
    </ThemeProvider>
  );
};

export default Profile;