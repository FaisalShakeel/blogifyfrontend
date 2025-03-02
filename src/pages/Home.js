import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Avatar,
  Button,
  createTheme,
  ThemeProvider,
  CircularProgress,
} from "@mui/material";
import Navbar from "../components/Navbar";
import axios from "axios";
import moment from "moment/moment";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import CustomSnackbar from "../components/Snackbar";

const categories = ["All", "Lifestyle", "Technology", "Health", "Business"];

const theme = createTheme({
  typography: {
    fontFamily: '"Velyra", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontSize: "1.3rem",
      letterSpacing: "0.5px",
    },
  },
  palette: {
    mode: "light",
    background: { default: "#f5f5f5" },
    text: { primary: "#000000" },
  },
});

const headingStyle = {
  display: "inline-block",
  fontSize: "1.4rem",
  fontWeight: "bold",
  py: 0.7,
  px: 2,
  borderRadius: 20,
  bgcolor: "white",
  color: "black",
  mb: 2,
};

const NoContentMessage = ({ message }) => (
  <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
    <Typography variant="h6" color="textSecondary">
      {message}
    </Typography>
  </Paper>
);

const extractTextFromHTML = (htmlString) => {
  if (!htmlString) return "";
  const temp = document.createElement("div");
  temp.innerHTML = htmlString;
  const text = temp.textContent || temp.innerText;
  return text.replace(/\s+/g, " ").trim();
};
const Home = () => {
  const { user } = useContext(AuthContext); // Get the current user from context

  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [popularBlogs, setPopularBlogs] = useState([]);
  const [featuredAuthors, setFeaturedAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFollowButtonDisabled,setIsFollowButtonDisabled] = useState(false)
  const [selectedAuthorId, setSelectedAuthorId] = useState("")
  
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  
  const closeSnackbar = () => {
    setIsSnackbarOpen(false);
  };
  const handleFollow = async (authorId) => {
    setIsFollowButtonDisabled(true)
    try {
      const response = await axios.post(
        `http://localhost:5000/users/follow`,
        {
          followingId: authorId,
        },
        { withCredentials: true }
      );
  
      if (response.data.success) {
        const updatedAuthor = response.data.author;
        console.log("Updated Author", updatedAuthor);
  
        // Calculate isFollowing
        const isFollowing = updatedAuthor.followers.some(
          (follower) => follower._id === user.id
        );
        console.log("Is Following", isFollowing);
  
        // Create a new updatedAuthor object with isFollowing
        const newUpdatedAuthor = {
          ...updatedAuthor,
          isFollowing: isFollowing,
        };
  
        // Update the featuredAuthors state without triggering the useEffect
        setFeaturedAuthors((prevAuthors) => {
          return prevAuthors.map(author => 
            author._id === updatedAuthor._id ? newUpdatedAuthor : author
          );
        });
  
        setMessage(response.data.message);
        setSeverity("success");
        setIsSnackbarOpen(true);
      } else {
        setMessage(response.data.message);
        setSeverity("error");
        setIsSnackbarOpen(true);
        
      }
    } catch (error) {
      setMessage(error.response?error.response.data.message:error.message);
        setSeverity("error");
        setIsSnackbarOpen(true);
    }
    finally{
      setIsFollowButtonDisabled(false)
    }
  };
  
  const getHomePage = async () => {
    try {
      const response = await axios.get("http://localhost:5000");
      console.log(response.data);
      if (response.data.success) {
        setBlogs(response.data.blogs);
        setPopularBlogs(response.data.popularBlogs);
        setFeaturedAuthors(response.data.featuredAuthors);
      }
    } catch (e) {
      console.error("Error fetching homepage data:", e);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    getHomePage();
  }, []);
  
  // Run only once after initial data load
useEffect(() => {
  if (featuredAuthors.length > 0 && user && !featuredAuthors[0].hasOwnProperty('isFollowing')) {
    const updatedAuthors = featuredAuthors.map((author) => {
      const isFollowing = author.followers.some(
        (follower) => follower._id === user.id
      );
      return { ...author, isFollowing };
    });
    setFeaturedAuthors(updatedAuthors);
  }
}, [featuredAuthors, user]);
  
  const filteredBlogs = blogs.filter(
    (blog) => selectedCategory === "All" || blog.category === selectedCategory
  );
  
  const filteredPopularBlogs = popularBlogs.filter(
    (blog) => selectedCategory === "All" || blog.category === selectedCategory
  );


  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
        <Container maxWidth="xl" sx={{ py: 4, bgcolor: "white" }}>
          {/* Categories */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={headingStyle}>
              Categories
            </Typography>
            <Grid container spacing={2}>
              {categories.map((cat) => (
                <Grid item key={cat}>
                  <Paper
                    elevation={selectedCategory === cat ? 3 : 1}
                    sx={{
                      px: 3,
                      py: 1,
                      borderRadius: 20,
                      cursor: "pointer",
                      fontFamily: "Velyra",
                      bgcolor: selectedCategory === cat ? "black" : "white",
                      color: selectedCategory === cat ? "white" : "black",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: "black",
                        color: "white",
                        transform: "translateY(-2px)",
                      },
                    }}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", height: "100vh", py: 8 }}>
              <CircularProgress sx={{ color: "black" }} thickness={8} />
            </Box>
          ) : (
            <Grid container spacing={4}>
              {/* Main Content Section */}
              <Grid item xs={12} md={8}>
                {/* Regular Blogs */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" sx={headingStyle}>
                    Blogs
                  </Typography>
                  <Grid container spacing={2}>
                    {filteredBlogs.length > 0 ? (
                      filteredBlogs.map((blog, index) => (
                        <Grid item xs={12} onClick={()=>{
                          navigate(`/blog/${blog._id}`)
                        }} key={index}>
                          <Paper 
                            sx={{ 
                              p: 3, 
                              cursor:"pointer",
                              borderRadius: 2, 
                              boxShadow: 2,
                              transition: "transform 0.2s ease",
                              "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: 3,
                              },
                            }}
                          >
                            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                              {blog.title}
                            </Typography>
                            
                            <Typography 
                              variant="body2" 
                              color="textSecondary" 
                              sx={{ 
                                mb: 2,
                                display: '-webkit-box',
                                overflow: 'hidden',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 3,
                              }}
                            >
                              {extractTextFromHTML(blog.content).substring(0, 200)}...
                            </Typography>

                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Avatar src={blog.publishedByPhotoUrl} sx={{ width: 30, height: 30 }} />
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {blog.publishedByName}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  | {moment(new Date(blog.createdAt)).fromNow()}
                                </Typography>
                              </Box>
                              
                              <Typography
                                variant="caption"
                                sx={{
                                  bgcolor: "black",
                                  color: "white",
                                  px: 1.5,
                                  py: 0.5,
                                  borderRadius: 10,
                                  fontSize: "12px",
                                  width: "fit-content"
                                }}
                              >
                                {blog.category}
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      ))
                    ) : (
                      <Grid item xs={12}>
                        <NoContentMessage message="No blogs available" />
                      </Grid>
                    )}
                  </Grid>
                </Box>

                {/* Popular Blogs */}
                <Box sx={{ mt: 6 }}>
                  <Typography variant="h5" sx={headingStyle}>
                    Popular Blogs
                  </Typography>
                  <Grid container spacing={2}>
                    {filteredPopularBlogs.length > 0 ? (
                      filteredPopularBlogs.map((blog, index) => (
                        <Grid onClick={()=>{navigate(`/blog/${blog._id}`)}} item xs={12} key={index}>
                          <Paper 
                            sx={{ 
                              cursor:"pointer",
                              p: 3, 
                              borderRadius: 2, 
                              boxShadow: 2,
                              transition: "transform 0.2s ease",
                              "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: 3,
                              },
                            }}
                          >
                            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                              {blog.title}
                            </Typography>
                            
                            <Typography 
                              variant="body2" 
                              color="textSecondary" 
                              sx={{ 
                                mb: 2,
                                display: '-webkit-box',
                                overflow: 'hidden',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 3,
                              }}
                            >
                              {extractTextFromHTML(blog.content).substring(0, 200)}...
                            </Typography>

                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Avatar src={blog.publishedByPhotoUrl} sx={{ width: 30, height: 30 }} />
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {blog.publishedByName}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  | {moment(new Date(blog.createdAt)).fromNow()}
                                </Typography>
                              </Box>
                              
                              <Typography
                                variant="caption"
                                sx={{
                                  bgcolor: "black",
                                  color: "white",
                                  px: 1.5,
                                  py: 0.5,
                                  borderRadius: 10,
                                  fontSize: "12px",
                                  width: "fit-content"
                                }}
                              >
                                {blog.category}
                              </Typography>
                            </Box>

                            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                              <Typography variant="caption" color="textSecondary">
                                {blog.likeCount || 0} Likes
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {blog.commentCount+blog.replyCount} Comments
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      ))
                    ) : (
                      <Grid item xs={12}>
                        <NoContentMessage message="No popular blogs available in this category" />
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Grid>

              {/* Authors Section */}
              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" sx={headingStyle}>
                    Featured Authors
                  </Typography>
                  <Grid container spacing={2}>
                    {featuredAuthors.length > 0 ? (
                      featuredAuthors.map((author, index) => (
                        <Grid item xs={12} key={index}>
                          <Paper
                            sx={{
                              p: 2,
                              display: "flex",
                              alignItems: "center",
                              borderRadius: 2,
                              boxShadow: 2,
                              transition: "transform 0.2s ease",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: 3,
                              },
                            }}
                          >
                            <Avatar
                              src={author.profilePhotoUrl}
                              sx={{ width: 40, height: 40, mr: 2 }}
                            />
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                {author.name}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {author.bio}
                              </Typography>
                              <Button
                              onClick={()=>{
                                setSelectedAuthorId(author._id)
                                handleFollow(author._id)
                              }}
                              disabled={isFollowButtonDisabled && author._id===selectedAuthorId}
                                size="small"
                                variant="contained"
                                sx={{
                                  mt: 1,
                                  bgcolor: "black",
                                  color: "white",
                                  "&:hover": { 
                                    bgcolor: "rgba(0,0,0,0.8)",
                                    transform: "translateY(-1px)", 
                                  },
                                  transition: "all 0.2s ease",
                                }}
                              >
                                {author.isFollowing?"Following":"Follow"}
                              </Button>
                            </Box>
                          </Paper>
                        </Grid>
                      ))
                    ) : (
                      <Grid item xs={12}>
                        <NoContentMessage message="No featured authors available" />
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          )}
        </Container>
        <CustomSnackbar message={message} severity={severity} open={isSnackbarOpen} closeSnackbar={closeSnackbar}/>
      </Box>
    </ThemeProvider>
  );
};

export default Home;