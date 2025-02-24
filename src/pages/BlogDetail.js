import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Avatar,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
  Divider,
  ThemeProvider,
  createTheme,
  Grid,
  Card,
  CardContent,
  CardMedia,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Input,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import "./BlogContent.css";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { BookmarkOutlined, CameraAlt as CameraAltIcon, Edit as EditIcon, FavoriteBorderOutlined, FavoriteOutlined } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';

import {
  FavoriteBorder,
  ChatBubbleOutline,
  BookmarkBorder,
  Reply,
  Send,
} from "@mui/icons-material";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useParams } from "react-router-dom";
import CustomSnackbar from "../components/Snackbar";
import { AuthContext } from "../contexts/AuthContext";

// Define Velyra font family theme
const theme = createTheme({
  typography: {
    fontFamily: "Velyra, Arial, sans-serif",
  },
  palette: {
    background: {
      default: "#ffffff", // White background
    },
    text: {
      primary: "#000000", // Black text
    },
  },
});

// Mock data for comments and replies
const comments = [
  {
    id: 1,
    author: "Faisal Shakeel",
    text: "This is a great blog post!I really like this",
    createdAt: "2 days ago",
    replies: [
      { id: 11, author: "John Doe", text: "I agree!", createdAt: "1 day ago" },
      { id: 12, author: "Alexa David", text: "Nice point!", createdAt: "1 day ago" },
    ],
  },
  {
    id: 2,
    author: "Smith Rogers",
    text: "Very informative.Keep it up",
    createdAt: "3 days ago",
    replies: [
      { id: 21, author: "David Smith", text: "Thanks for sharing!", createdAt: "2 days ago" },
    ],
  },
];
// Mock data for related blogs
const relatedBlogs = [
  {
    id: 1,
    title: "The Future of AI",
    image: "https://via.placeholder.com/200",
    author: "John Doe",
    createdAt: "3 days ago",
  },
  {
    id: 2,
    title: "Machine Learning Basics",
    image: "https://via.placeholder.com/200",
    author: "Jane Smith",
    createdAt: "5 days ago",
  },
  {
    id: 3,
    title: "Deep Learning Explained",
    image: "https://via.placeholder.com/200",
    author: "Alice Johnson",
    createdAt: "1 week ago",
  },
];
const BlogDetail = () => {
  const{user} = useContext(AuthContext)
  const navigate = useNavigate()
  const {id} =useParams()
  const [blog,setBlog] = useState({})
  const [showComments, setShowComments] = useState(false);
  const [showReplies, setShowReplies] = useState({});
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  
  const [newListDialogOpen, setNewListDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [listPhoto, setListPhoto] = useState(null)
  const [userLists, setUserLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState("");
  const [selectedListName, setSelectedListName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isUnsaving, setIsUnsaving] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(true);
  const [playlistsLoading, setPlaylistsLoading] = useState(true);

  const [loading, setLoading] = useState(true)

  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [severity, setSeverity] = useState("")

  const closeSnackbar=()=>{
    setIsSnackbarOpen(false)
  }

  const handleBack = () => {
    navigate(-1);
  };
  const handleCommentClick = () => {
    setShowComments(!showComments);
  };

  const handleReplyClick = (commentId) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleSaveClick = () => {
    setSaveModalOpen(true);
  };

  const handleCloseSaveModal = () => {
    setSaveModalOpen(false);
  };

  const handlePostComment = () => {
    if (commentText.trim()) {
      // Add logic to post the comment
      console.log("Posted:", commentText);
      setCommentText("");
    }
  };
  const isAlreadySaved = () => {
    if (userLists.length === 0) return false;
  
    const _isSaved = userLists.some((list) => {
      // Check if the blog object with matching _id exists in the list's blogs array
      const blogExists = list.blogs.some((blog) => blog._id === id);
  
      if (blogExists) {
        setSelectedListId(list._id);
        setSelectedListName(list.title);
        return true;
      }
      return false;
    });
  
    setIsSaved(_isSaved);
    return _isSaved;
  };
  
  const isAlreadyLiked = (likedBy) => {
    try {
      const UID = user?.id
      const _isLiked = likedBy ? likedBy.includes(UID) : false;
      return {_isLiked };
    } catch (error) {
      console.error("Error checking like status:", error);
      return { _isLiked: false };
    }
  };
  const getBlogDetails=async()=>{
    try{

      const response= await axios.get(`http://localhost:5000/blogs/blog-detail/${id}`,{withCredentials:true})
      console.log("Blog Details",response.data)
      setBlog(response.data.blog)
    }
    catch(e){

    }
    finally{
      setLoading(false)

    }
  }
  const likeBlog = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      const response = await axios.put(
        "http://localhost:5000/blogs/like-blog",
        { blogId: id },
        {withCredentials:true}
      );
  
      if (response.data.success) {
        setMessage(response.data.message)
        setSeverity("success")
      
        setIsSnackbarOpen(true)
      
  
        // Toggle isLiked state based on current state
        setIsLiked(prev => !prev);
        // Update blog state
        setBlog(response.data.blog);
      }
      else{
        setMessage(response.data.message)
        setSeverity("error")
      
        setIsSnackbarOpen(true)
      }
    } catch (e) {
        setMessage(e.response?e.response.data.message:e.message)
        setSeverity("error")
        setIsSnackbarOpen(true)
    } finally {
      setIsLiking(false);
    }
  }
  
    
  const fetchUserLists = async () => {
    setPlaylistsLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/lists/all-lists", {
        withCredentials:true
      });
      console.log(response.data)
      if (response.data.success) {
        setUserLists(response.data.lists);
      } else {
        setMessage(response.data.message)
        setSeverity("error")
      
        setIsSnackbarOpen(true)
      }
    } catch (error) {
      console.error("Error fetching lists:", error);
      if(error.response)
      {
        if(error.response.data.message=="No lists found.")
        {

        }
        else{
          setMessage(error.response?error.response.data.message:error.message)
          setSeverity("error")
  
          setIsSnackbarOpen(true)

        }
      }
    } finally {
      setPlaylistsLoading(false);
    }
  };
  
  const handleCreateNewList = async () => {
    setIsCreatingList(true);
    try {
      const formData=new FormData()
      formData.append("title",newListName)
      formData.append("description",newListDescription)
      formData.append("photo",listPhoto)
      const response = await axios.post(
        "http://localhost:5000/lists/create",
       formData,
        {
        withCredentials:true,
        headers:{"Content-Type":"multipart/form-data"}
        }
      );
      if (response.data.success) {
        setMessage(response.data.message)
        setSeverity("success")
        setIsSnackbarOpen(true)
        setNewListDialogOpen(false);
        
        setNewListName("");
        setUserLists([...userLists, response.data.list]);
      } else {
        setMessage(response.data.message)
        setSeverity("error")
      
        setIsSnackbarOpen(true)
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
        setMessage(error.response?error.response.data.message:error.message)
        setSeverity("error")
      
        setIsSnackbarOpen(true)
    } finally {
      setIsCreatingList(false);
    }
  };
  
  const handleAddToList = async (listId) => {
    setIsSaving(true);
    setIsUnsaving(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/lists/add-blog`,
        {
          item:blog,
          listId,
        },
        {
        withCredentials:true
        }
      );
      if (response.data.success) {

        setMessage(response.data.message)
        setSeverity("success")
        setIsSnackbarOpen(true)   
        setIsSaved(!isSaved);
        handleCloseSaveModal()
      } else {
        setMessage(response.data.message)
        setSeverity("error")
        setIsSnackbarOpen(true)
      }
    } catch (e) {
      console.error(e)
      setMessage(e.response?e.response.data.message:e.message)
      setSeverity("error")
      setIsSnackbarOpen(true)
    } finally {
      setIsSaving(false);
      setIsUnsaving(false);
    }
  };
  useEffect(() => {
    if (blog && blog.likedBy) {
      setIsLikeLoading(true); // Set loading before checking
      try {
        const {_isLiked } = isAlreadyLiked(blog.likedBy);
      
        setIsLiked(_isLiked);
      } catch (error) {
        console.error("Error setting initial like state:", error);
      } finally {
        setIsLikeLoading(false); // Clear loading after checking
      }
    }
  }, [blog]);

  useEffect(() => {
    if (!playlistsLoading) {
      isAlreadySaved();
    }
  }, [playlistsLoading, userLists]);
  useEffect(()=>{
    fetchUserLists()
  },[])

  useEffect(()=>{
    getBlogDetails()
  },[])
  if(loading){
    return(
      <Box>
        <Navbar/>
    <Box sx={{height:"100vh",width:"100%",display:"flex",justifyContent:"center",alignItems:"center"}}>
      <CircularProgress sx={{color:'black'}} thickness={8} size={40}></CircularProgress>

    </Box></Box>)
  }
  else{

  return (
    <ThemeProvider theme={theme}>
      <Navbar/>
      <Box sx={{ width: "90%", bgcolor: "background.default", p: 4 }}>
         {/* Back Button */}
         <Box sx={{ mt: -2 }}>
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
        {/* Blog Title */}
        <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold",mt:1 }}>
       {blog.title}
        </Typography>

        {/* Blog Media */}
        <Box
          component="div"

          sx={{ width: "100%", borderRadius: 2, mb: 3 }}
        />
        {/* Blog Content */}
        <Box sx={{ mb: 3 }}>
          <div
            className="blog-content" // Add a class
            dangerouslySetInnerHTML={{ __html: blog.content }}
            style={{
              maxWidth: "80%", // Ensure content doesn't overflow
              overflow: "hidden", // Hide overflow
            }}
          />
        </Box>
      {/* Like, Comment, Save Buttons */}
<Box sx={{ display: "flex", gap: 2, mb: 4 }}>
  {/* Like Button */}
  <IconButton
    onClick={likeBlog}
    sx={{
      transition: "transform 0.2s ease",
      "&:active": { transform: "scale(0.9)" }, // Click effect
    }}
  >
    {isLiking ? (
      <FavoriteOutlined sx={{ color: "red", opacity: 0.5 }} />
    ) : isLiked ? (
      <FavoriteOutlined sx={{ color: "red" }} />
    ) : (
      <FavoriteBorder />
    )}
  </IconButton>

  {/* Comment Button */}
  <IconButton
    onClick={handleCommentClick}
    sx={{
      transition: "transform 0.2s ease",
      "&:active": { transform: "scale(0.9)" }, // Click effect
    }}
  >
    <ChatBubbleOutline />
  </IconButton>

  {/* Save Button */}
  <IconButton
    onClick={()=>{
      if(isSaved){
        handleAddToList(selectedListId)
      }
      else{
        handleSaveClick()
      }
    }}
    sx={{
      transition: "transform 0.2s ease",
      "&:active": { transform: "scale(0.9)" }, // Click effect
    }}
  >
    {isSaving || isUnsaving ? (
      <BookmarkOutlined sx={{ color: "#000", opacity: 0.5 }} />
    ) : isSaved ? (
      <BookmarkOutlined sx={{ color: "#000" }} />
    ) : (
      <BookmarkBorder />
    )}
  </IconButton>
</Box>



        {/* Comment Section */}
        {showComments && (
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              placeholder="Add a comment..."
              variant="standard"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handlePostComment}>
                      <Send />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderBottom: "2px solid black" }, // Only bottom border
              }}
              sx={{ mb: 3 }}
            />
            <List>
              {comments.map((comment) => (
                <React.Fragment key={comment.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>{comment.author[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                            {comment.author}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {comment.createdAt}
                          </Typography>
                        </Box>
                      }
                      secondary={comment.text}
                    />
                    <Button
                      variant="contained"
                      sx={{ bgcolor: "black", color: "white", textTransform: "none" }}
                      onClick={() => handleReplyClick(comment.id)}
                    >
                      Reply
                    </Button>
                  </ListItem>
                  {showReplies[comment.id] && (
                    <List sx={{ pl: 4 }}>
                      {comment.replies.map((reply) => (
                        <ListItem key={reply.id} alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar>{reply.author[0]}</Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                  {reply.author}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {reply.createdAt}
                                </Typography>
                              </Box>
                            }
                            secondary={reply.text}
                          />
                          <Button
                            variant="contained"
                            sx={{ bgcolor: "black", color: "white", textTransform: "none" }}
                            onClick={() => handleReplyClick(reply.id)}
                          >
                            Reply
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                  )}
                  {comment.replies.length > 0 && (
                    <Button
                      variant="contained"
                      sx={{ bgcolor: "black", color: "white", ml: 4, textTransform: "none" }}
                      onClick={() => handleReplyClick(comment.id)}
                    >
                      {showReplies[comment.id] ? "Hide Replies" : "Show Replies"}
                    </Button>
                  )}
                  <Divider sx={{ my: 2 }} />
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}

        {/* Author Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
            Author
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar sx={{ mr: 2, width: 60, height: 60 }} src={blog.publishedByPhotoUrl}></Avatar>
            <Box>
              <Typography variant="h6">
              {blog.publishedByName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                A passionate writer and AI enthusiast with over 10 years of experience in the tech industry.
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            sx={{ bgcolor: "black", color: "white", textTransform: "none" }}
          >
            View Other Blogs By This Author
          </Button>
        </Box>

        {/* Related Blogs */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
            Related Blogs
          </Typography>
          <Grid container spacing={3}>
            {relatedBlogs.map((blog) => (
              <Grid item xs={12} sm={6} md={4} key={blog.id}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={blog.image}
                    alt={blog.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {blog.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      By {blog.author} | {blog.createdAt}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

{/* Save Modal */}
<Modal open={saveModalOpen} onClose={handleCloseSaveModal}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      bgcolor: "background.paper",
      boxShadow: 24,
      p: 4,
      borderRadius: 3, // Rounded corners for the modal
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
      Save to List
    </Typography>
    <List>
      {userLists.map((list) => (
        <ListItem
          key={list._id}
          sx={{
            bgcolor: selectedListId === list._id ? "#333" : "transparent", // Dark gray for selected list
            borderRadius: 3, // More rounded corners for list items
            cursor: "pointer",
            transition: "background-color 0.3s ease", // Smooth transition
            "&:hover": {
              bgcolor: selectedListId === list._id ? "#333" : "#444", // Slightly lighter gray on hover
            },
            mb: 1, // Margin between list items
            p: 2, // Padding inside list items
            boxShadow: selectedListId === list._id ? 3 : 0, // Subtle shadow for selected list
          }}
          onClick={() => setSelectedListId(list._id)} // Set selected list on click
        >
          <ListItemAvatar>
            <Avatar
              src={list.photoUrl}
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%", // Fully rounded avatar
                border: selectedListId === list._id ? "2px solid white" : "none", // White border for selected list
              }}
            />
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: selectedListId === list._id ? "white" : "black" }}>
                {list.title}
              </Typography>
            }
            secondary={
              <Typography variant="body2" sx={{ color: selectedListId === list._id ? "#ccc" : "text.secondary" }}>
                {list.description} - {list.blogsCount} blogs
              </Typography>
            }
          />
        </ListItem>
      ))}
    </List>

    {/* Save Now Button */}
    {selectedListId && !isSaved && (
      <Button
        fullWidth
        onClick={() => handleAddToList(selectedListId)} // Handle save logic
        variant="contained"
        disabled={isSaving}
        sx={{
          bgcolor: "black",
          color: "white",
          mt: 2,
          textTransform: "none",
          borderRadius: 3, // More rounded corners for button
          "&:hover": {
            bgcolor: "#222", // Darker on hover
          },
          py: 1.5, // Padding for better button height
          fontSize: "1rem", // Larger font size
        }}
      >
       {isSaving?"Saving":"Save Now"}
      </Button>
    )}

    {/* Create New List Button */}
    <Button
      fullWidth
      onClick={() => {
        setSaveModalOpen(false);
        setNewListDialogOpen(true);
      }}
      variant="contained"
      sx={{
        bgcolor: "black",
        color: "white",
        mt: 2,
        textTransform: "none",
        borderRadius: 3, // More rounded corners for button
        "&:hover": {
          bgcolor: "#222", // Darker on hover
        },
        py: 1.5, // Padding for better button height
        fontSize: "1rem", // Larger font size
      }}
    >
      Create New List
    </Button>
  </Box>
</Modal>
<Dialog
  open={newListDialogOpen}
  onClose={() => setNewListDialogOpen(false)}
  maxWidth="xs"
  fullWidth
>
  <DialogTitle
    sx={{
      fontFamily: "Velyra",
      textAlign: "center",
      fontWeight: "bold",
      color: "#000",
      fontSize: "1.5rem",
    }}
  >
    Create New List
  </DialogTitle>

  <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
    {/* List Photo Upload */}
    <Box
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mb: 1,
      }}
    >
      <Avatar
        src={listPhoto ? URL.createObjectURL(listPhoto) : undefined}
        sx={{
          width: 80,
          height: 80,
          border: "2px solid #000",
          backgroundColor: "#f0f0f0",
        }}
      >
        {!listPhoto && <CameraAltIcon fontSize="large" />}
      </Avatar>

      {/* Edit Icon Overlay */}
      <IconButton
        component="label"
        sx={{
          position: "absolute",
          bottom: 5,
          right: 5,
          backgroundColor: "#000",
          color: "#fff",
          borderRadius: "50%",
          width: 30,
          height: 30,
          "&:hover": {
            backgroundColor: "#333",
          },
        }}
      >
        <EditIcon fontSize="small" />
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setListPhoto(file);
            }
          }}
        />
      </IconButton>
    </Box>

    {/* List Title */}
    <TextField
      label="Title"
      variant="standard"
      value={newListName}
      onChange={(e) => setNewListName(e.target.value)}
      fullWidth
      InputLabelProps={{
        sx: {
          fontFamily: "Velyra",
          fontSize: "1rem",
          fontWeight: "bold",
          color: "#000",
          "&.Mui-focused": { color: "#000",fontSize:"20px",fontWeight:"bold" }, // Ensures label stays black on focus
        },
      }}
      sx={{
        "& .MuiInput-underline:before": { borderBottom: "2px solid #000" },
        "& .MuiInput-underline:hover:before": { borderBottom: "2px solid #000" },
        "& .MuiInput-underline:after": { borderBottom: "2px solid #000" },
        fontFamily: "Velyra",
      }}
    />

    {/* List Description */}
    <TextField
      label="Description"
      variant="standard"
      value={newListDescription}
      onChange={(e) => setNewListDescription(e.target.value)}
      multiline
      rows={3}
      fullWidth
      InputLabelProps={{
        sx: {
          fontFamily: "Velyra",
          fontSize: "1rem",
          fontWeight: "bold",
          color: "#000",
          "&.Mui-focused": { color: "#000",fontSize:"20px",fontWeight:"bold" }, // Ensures label stays black on focus
        },
      }}
      sx={{
        "& .MuiInput-underline:before": { borderBottom: "2px solid #000" },
        "& .MuiInput-underline:hover:before": { borderBottom: "2px solid #000" },
        "& .MuiInput-underline:after": { borderBottom: "2px solid #000" },
        fontFamily: "Velyra",
      }}
    />
  </DialogContent>

  <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
    <Button
      onClick={() => setNewListDialogOpen(false)}
      sx={{
        fontFamily: "Velyra",
        color: "#000",
        border: "1px solid #000",
        borderRadius: "20px",
        px: 3,
        py: 1,
        "&:hover": {
          backgroundColor: "#f5f5f5",
        },
      }}
    >
      Cancel
    </Button>
    <Button
      onClick={handleCreateNewList}
      variant="contained"
      disabled={isCreatingList}
      sx={{
        fontFamily: "Velyra",
        backgroundColor: "#000",
        color: "#fff",
        borderRadius: "20px",
        px: 3,
        py: 1,
        "&:hover": {
          backgroundColor: "#333",
        },
      }}
    >
      {isCreatingList ? "Creating..." : "Create"}
    </Button>
  </DialogActions>
</Dialog>
<CustomSnackbar open={isSnackbarOpen} message={message} severity={severity} closeSnackbar={closeSnackbar}/>
      </Box>
    </ThemeProvider>
  );
}
};

export default BlogDetail;