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
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AccessTime, Delete, Edit, CameraAlt } from '@mui/icons-material';
import axios from 'axios';
import moment from 'moment';
import CustomSnackbar from '../components/Snackbar';
import DeleteModal from '../components/DeleteModel';
import EditProfile from '../components/EditProfile';

// Theme configuration
const theme = createTheme({
  typography: {
    fontFamily: '"Velyra", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  palette: {
    mode: "light",
    background: { default: "#f5f5f5 " },
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
          display: 'none',
        },
      },
    },
  },
});

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

const BlogList = ({ blogs, showAuthor = false, saved = false, liked = false, onDelete }) => {
  const navigate = useNavigate();
  return (
    <Stack spacing={2}>
      {blogs.map((blog) => (
        <BlogCard key={blog._id} elevation={0}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                {blog.title}
              </Typography>
              <Chip label={blog.category} size="small" sx={{ backgroundColor: '#666666', color: 'white' }} />
            </Box>
            {blog.tags && blog.tags.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {blog.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    sx={{ backgroundColor: 'black', color: 'white', borderRadius: 1, fontSize: '0.75rem' }}
                  />
                ))}
              </Box>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {extractTextFromHTML(blog.content ? blog.content.slice(0, 200) + '...' : '')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, color: 'text.secondary', alignItems: 'center' }}>
              <Typography variant="caption">{moment(blog.createdAt).fromNow()}</Typography>
              {showAuthor && <Typography variant="caption">by {blog.publishedByName}</Typography>}
              {!saved && !liked && (
                <Box sx={{ marginLeft: 'auto', display: 'flex', gap: 1 }}>
                  <IconButton
                    onClick={() => navigate(`/blog/edit/${blog._id}`)}
                    aria-label="edit"
                    size="small"
                    sx={{ color: 'text.secondary' }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => onDelete(blog._id)}
                    aria-label="delete"
                    size="small"
                    sx={{ color: 'text.secondary' }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>
        </BlogCard>
      ))}
    </Stack>
  );
};

const extractTextFromHTML = (htmlString) => {
  if (!htmlString) return "";
  const temp = document.createElement("div");
  temp.innerHTML = htmlString;
  const text = temp.textContent || temp.innerText;
  return text.replace(/\s+/g, " ").trim();
};

const Profile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [isAuthor, setIsAuthor] = useState(false);
  const [user, setUser] = useState({});
  const [yourBlogs, setYourBlogs] = useState([]);
  const [likedBlogs, setLikedBlogs] = useState([]);
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [lists, setLists] = useState([]);
  const [selectedBlogId, setSelectedBlogId] = useState("");
  const [selectedListId, setSelectedListId] = useState("");
  const [selectedListTitle, setSelectedListTitle] = useState("");
  const [selectedListDescription, setSelectedListDescription] = useState("");
  const [selectedListPhotoUrl, setSelectedListPhotoUrl] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditListModalOpen, setIsEditListModalOpen] = useState(false);
  const [isUpdatingList, setIsUpdatingList] =useState(false)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditListModalClose = () => {
    setIsEditListModalOpen(false);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setDeleting(false);
    setSelectedBlogId("");
    setSelectedListId("");
  };

  const closeSnackbar = () => {
    setIsSnackbarOpen(false);
  };

  const getProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/users/profile/${id}`, { withCredentials: true });
      console.log("Profile Response", response.data);
      if (response.data.success) {
        setUser(response.data.user);
        setYourBlogs(response.data.blogs);
        setLikedBlogs(response.data.likedBlogs);
        setSavedBlogs(response.data.savedBlogs);
        setLists(response.data.lists);
      } else {
        setMessage(response.data.message);
        setSeverity("error");
        setIsSnackbarOpen(true);
      }
    } catch (e) {
      setMessage(e.response ? e.response.data.message : e.message);
      setSeverity("error");
      setIsSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBlogDeleteClick = (blogId) => {
    console.log("Selected Blog ID:", blogId);
    setSelectedBlogId(blogId);
    setSelectedListId("");
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteBlog = async () => {
    if (!selectedBlogId) {
      setMessage("Blog ID is missing");
      setSeverity("error");
      setIsSnackbarOpen(true);
      setIsDeleteModalOpen(false);
      return;
    }
    setDeleting(true);
    try {
      const response = await axios.delete(`http://localhost:5000/blogs/delete-blog/${selectedBlogId}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setMessage(response.data.message);
        setSeverity("success");
        setIsSnackbarOpen(true);
        setYourBlogs(yourBlogs.filter((blog) => blog._id !== selectedBlogId));
      } else {
        setMessage(response.data.message);
        setSeverity("error");
        setIsSnackbarOpen(true);
      }
    } catch (e) {
      setMessage(e.response ? e.response.data.message : e.message);
      setSeverity("error");
      setIsSnackbarOpen(true);
    } finally {
      setIsDeleteModalOpen(false);
      setDeleting(false);
      setSelectedBlogId("");
    }
  };

  const handleListDeleteClick = (listId) => {
    console.log("Selected List ID:", listId);
    setSelectedListId(listId);
    setSelectedBlogId("");
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteList = async () => {
    if (!selectedListId) {
      setMessage("List ID is missing");
      setSeverity("error");
      setIsSnackbarOpen(true);
      setIsDeleteModalOpen(false);
      return;
    }
    setDeleting(true);
    try {
      const response = await axios.delete(`http://localhost:5000/lists/delete-list/${selectedListId}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setMessage(response.data.message);
        setSeverity("success");
        setIsSnackbarOpen(true);
        setLists(lists.filter((list) => list._id !== selectedListId));
      } else {
        setMessage(response.data.message);
        setSeverity("error");
        setIsSnackbarOpen(true);
      }
    } catch (e) {
      setMessage(e.response ? e.response.data.message : e.message);
      setSeverity("error");
      setIsSnackbarOpen(true);
    } finally {
      setIsDeleteModalOpen(false);
      setDeleting(false);
      setSelectedListId("");
    }
  };

  const handleConfirmDelete = () => {
    if (selectedBlogId) {
      confirmDeleteBlog();
    } else if (selectedListId) {
      confirmDeleteList();
    }
  };

  const handleUpdateList = async () => {
    setIsUpdatingList(true);
    try {
      const formData = new FormData();
      formData.append('title', selectedListTitle);
      formData.append('description', selectedListDescription);
      if (listPhoto) {
        formData.append('photo', listPhoto);
      }

      const response = await axios.put(`http://localhost:5000/lists/update-list/${selectedListId}`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log("Update List",response.data)

      if (response.data.success) {
        setMessage(response.data.message);
        setSeverity("success");
        setIsSnackbarOpen(true);
        // Update the lists state with the new data
        setLists(lists.map(list => list._id === selectedListId ? { ...list, title: selectedListTitle, description: selectedListDescription, photoUrl: response.data.list?.photoUrl || list.photoUrl } : list));
        handleEditListModalClose();
      } else {
        setMessage(response.data.message);
        setSeverity("error");
        setIsSnackbarOpen(true);
      }
    } catch (e) {
      setMessage(e.response ? e.response.data.message : e.message);
      setSeverity("error");
      setIsSnackbarOpen(true);
    } finally {
      setIsUpdatingList(false);
    }
  };

  const [listPhoto, setListPhoto] = useState(null);

  useEffect(() => {
    if (user) {
      setIsAuthor(user.role === "Author");
    }
  }, [user]);

  useEffect(() => {
    getProfile();
  }, [id]);

  if (loading) {
    return (
      <Box>
        <Navbar />
        <Box sx={{ height: "100vh", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress sx={{ color: 'black' }} thickness={8} size={40} />
        </Box>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Box sx={{ minWidth: "100%", margin: '0 auto', p: 3, backgroundColor: '#fff' }}>
        <Box sx={{ mb: 2 }}>
          <IconButton
            onClick={handleBack}
            sx={{ backgroundColor: '#f5f5f5', '&:hover': { backgroundColor: '#eeeeee' } }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <StyledCard>
              <CardContent sx={{ pt: 2 }}>
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                  <StyledAvatar src={user.profilePhotoUrl} alt={user.name} />
                  <Typography variant="h4" sx={{ mt: 2, fontWeight: 600 }}>{user.name}</Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>{user.bio}</Typography>
                </Box>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs variant='scrollable' value={tabValue} onChange={handleTabChange}>
                    <Tab label="Your Lists" sx={{ borderRadius: "35px" }} />
                    {isAuthor && <Tab label="Your Blogs" sx={{ borderRadius: "35px" }} />}
                    <Tab label="Saved Blogs" sx={{ borderRadius: "35px" }} />
                    <Tab label="Liked Blogs" sx={{ borderRadius: "35px" }} />
                    <Tab label="Edit Profile" sx={{ borderRadius: "35px" }} />
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
                              '& .hover-reveal': { opacity: 1 },
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
                            '&:hover::after': { opacity: 1 },
                          }}
                        >
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
                              '&:hover': { transform: 'scale(1.05)' },
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                mb: 1,
                                color: '#000',
                                fontSize: '1.1rem',
                                letterSpacing: '-0.3px',
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
                                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
                                }}
                              />
                            </Box>
                          </Box>
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
                              onClick={() => {
                                setSelectedListId(list._id);
                                setSelectedListTitle(list.title);
                                setSelectedListDescription(list.description);
                                setSelectedListPhotoUrl(list.photoUrl);
                                setIsEditListModalOpen(true);
                              }}
                              aria-label="edit"
                              size="small"
                              sx={{
                                color: '#000',
                                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
                                width: 36,
                                height: 36,
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => handleListDeleteClick(list._id)}
                              aria-label="delete"
                              size="small"
                              sx={{
                                color: '#000',
                                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
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
                    <BlogList blogs={yourBlogs} saved={false} liked={false} onDelete={handleBlogDeleteClick} />
                  </TabPanel>
                )}
                <TabPanel value={tabValue} index={isAuthor ? 2 : 1}>
                  <BlogList blogs={savedBlogs} saved={true} liked={false} showAuthor={true} />
                </TabPanel>
                <TabPanel value={tabValue} index={isAuthor ? 3 : 2}>
                  <BlogList blogs={likedBlogs} showAuthor={true} saved={false} liked={true} />
                </TabPanel>
                <TabPanel value={tabValue} index={isAuthor ? 4 : 3}>
                  <EditProfile name={user.name} profilePhotoUrl={user.profilePhotoUrl} email={user.email} bio={user.bio} role={user.role} />
                </TabPanel>

              </CardContent>
            </StyledCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, textAlign: "center", backgroundColor: "black", color: "white", borderRadius: "35px" }}>
                    Following ({user.followings.length})
                  </Typography>
                  <List>
                    {user.followings.map((user) => (
                      <React.Fragment key={user._id}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar src={user.profilePhotoUrl} />
                          </ListItemAvatar>
                          <ListItemText primary={user.name} secondary={user.bio} />
                        </ListItem>
                        <Divider component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </StyledCard>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, textAlign: "center", backgroundColor: "black", color: "white", borderRadius: "35px" }}>
                    Followers ({user.followers.length})
                  </Typography>
                  <List>
                    {user.followers.map((user) => (
                      <React.Fragment key={user._id}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar src={user.profilePhotoUrl} />
                          </ListItemAvatar>
                          <ListItemText primary={user.name} secondary={user.bio} />
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

        <DeleteModal
          open={isDeleteModalOpen}
          deleting={deleting}
          handleClose={handleDeleteModalClose}
          onDelete={handleConfirmDelete}
        />
        <CustomSnackbar
          open={isSnackbarOpen}
          message={message}
          severity={severity}
          closeSnackbar={closeSnackbar}
        />

        {/* EditList Dialog */}
        <Dialog
          open={isEditListModalOpen}
          onClose={isUpdatingList ? null : handleEditListModalClose}
          maxWidth="xs"
          fullWidth
          TransitionComponent={Fade}
          transitionDuration={300}
          PaperProps={{
            sx: {
              backgroundColor: '#ffffff',
              borderRadius: 16,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              overflow: 'hidden',
            },
          }}
        >
          <DialogTitle
            sx={{
              fontFamily: 'Velyra',
              textAlign: 'center',
              fontWeight: 'bold',
              color: '#000000',
              fontSize: '1.75rem',
              p: 2,
              background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            }}
          >
            Update List
          </DialogTitle>
          <DialogContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              p: 4,
              backgroundColor: '#ffffff',
            }}
          >
            <Box sx={{ position: 'relative', mb: 2 }}>
              <Fade in={true} timeout={500}>
                <Avatar
                  src={listPhoto ? URL.createObjectURL(listPhoto) : (selectedListPhotoUrl || undefined)}
                  sx={{
                    width: 100,
                    height: 100,
                    border: '3px solid #000000',
                    backgroundColor: '#f0f0f0',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': { transform: 'scale(1.05)', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)' },
                  }}
                >
                  {!listPhoto && !selectedListPhotoUrl && <CameraAlt fontSize="large" />}
                </Avatar>
              </Fade>
              <IconButton
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  transition: 'background-color 0.3s ease, transform 0.3s ease',
                  '&:hover': { backgroundColor: '#333333', transform: 'rotate(15deg)' },
                }}
              >
                <Edit fontSize="small" />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setListPhoto(file);
                  }}
                />
              </IconButton>
            </Box>

            <Fade in={true} timeout={700}>
              <TextField
                label="Title"
                variant="standard"
                value={selectedListTitle}
                onChange={(e) => setSelectedListTitle(e.target.value)}
                fullWidth
                disabled={isUpdatingList}
                InputLabelProps={{
                  sx: {
                    fontFamily: 'Velyra',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: '#000000',
                    transition: 'all 0.3s ease',
                    '&.Mui-focused': { color: '#000000', fontSize: '1.25rem', fontWeight: 'bold' },
                  },
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    fontFamily: 'Velyra',
                    '&:before': { borderBottom: '2px solid #000000' },
                    '&:hover:not(.Mui-disabled):before': { borderBottom: '2px solid #333333' },
                    '&:after': { borderBottom: '3px solid #000000' },
                  },
                }}
              />
            </Fade>

            <Fade in={true} timeout={900}>
              <TextField
                label="Description"
                variant="standard"
                value={selectedListDescription}
                onChange={(e) => setSelectedListDescription(e.target.value)}
                multiline
                rows={3}
                fullWidth
                disabled={isUpdatingList}
                InputLabelProps={{
                  sx: {
                    fontFamily: 'Velyra',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: '#000000',
                    transition: 'all 0.3s ease',
                    '&.Mui-focused': { color: '#000000', fontSize: '1.25rem', fontWeight: 'bold' },
                  },
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    fontFamily: 'Velyra',
                    '&:before': { borderBottom: '2px solid #000000' },
                    '&:hover:not(.Mui-disabled):before': { borderBottom: '2px solid #333333' },
                    '&:after': { borderBottom: '3px solid #000000' },
                  },
                }}
              />
            </Fade>
          </DialogContent>

          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button
              onClick={handleEditListModalClose}
              variant="outlined"
              disabled={isUpdatingList}
              sx={{
                fontFamily: 'Velyra',
                borderRadius: 20,
                p: '8px 32px',
                fontWeight: 'bold',
                textTransform: 'none',
                color: '#000000',
                borderColor: '#000000',
                transition: 'all 0.3s ease',
                '&:hover': { backgroundColor: '#f5f5f5', borderColor: '#333333' },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateList}
              variant="contained"
              disabled={isUpdatingList}
              sx={{
                fontFamily: 'Velyra',
                borderRadius: 20,
                p: '8px 32px',
                fontWeight: 'bold',
                textTransform: 'none',
                background: isUpdatingList
                  ? '#000000'
                  : 'linear-gradient(45deg, #000000 30%, #333333 90%)',
                color: '#ffffff',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': { background: 'linear-gradient(45deg, #333333 30%, #000000 90%)' },
              }}
            >
              {isUpdatingList ? <CircularProgress size={24} sx={{ color: '#ffffff' }} /> : 'Update'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default Profile;