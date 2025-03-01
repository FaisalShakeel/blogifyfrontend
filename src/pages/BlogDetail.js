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

  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,

  CircularProgress,
  Chip,
} from "@mui/material";
import "./BlogContent.css";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { BookmarkOutlined, CameraAlt as CameraAltIcon, Close, Edit as EditIcon, FavoriteBorderOutlined, FavoriteOutlined } from "@mui/icons-material";
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
import moment from "moment/moment";

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
const extractTextFromHTML = (htmlString) => {
  if (!htmlString) return "";
  const temp = document.createElement("div");
  temp.innerHTML = htmlString;
  const text = temp.textContent || temp.innerText;
  return text.replace(/\s+/g, " ").trim();
};



const BlogDetail = () => {
  const{user} = useContext(AuthContext)
  const navigate = useNavigate()
  const {id} =useParams()
  const [blog, setBlog] = useState({})
  const [relatedBlogs, setRelatedBlogs] = useState([])
  const [showComments, setShowComments] = useState(false);
  const [showReplies, setShowReplies] = useState({});
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [IsCommenting, setIsCommenting]  = useState(false)
  const [comments ,setComments] = useState([])
  const [commentId, setCommentId] = useState("")
  const [replyingToName, setReplyingToName] = useState("")  
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
  
  const commentTextFieldRef = useRef()

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
  const getBlogDetails = async () => {
    try {
        setLoading(true); // Set loading to true before making the API call

        const response = await axios.get(`http://localhost:5000/blogs/blog-detail/${id}`, { withCredentials: true });
        console.log("Blog Details", response.data);

        if (response.data.success) {
            setBlog(response.data.blog); // Set the blog data
            setRelatedBlogs(response.data.relatedBlogs); // Set related blogs
            setComments(response.data.blog.comments) 
          } else {
            setMessage(response.data.message || "Failed to fetch blog details"); // Fallback message
            setSeverity("error");
            setIsSnackbarOpen(true);
        }
    } catch (e) {
        console.error("Error fetching blog details:", e);
        setMessage(e.response?.data?.message || "An unexpected error occurred"); // Handle undefined `e.response`
        setSeverity("error");
        setIsSnackbarOpen(true);
    } finally {
        setLoading(false); // Set loading to false after the operation
    }
};

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
  const replyToComment=async()=>{
    setIsCommenting(true)
    try{
      const response=await axios.put("http://localhost:5000/blogs/reply-to-comment",{blogId:id,commentId,replyText:commentText},{withCredentials:true})
      if(response.data.success){
      
      setComments(response.data.blog.comments)
      setReplyingToName("")
      setCommentText("")
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
      setMessage(e.response?e.response.data.message:e.message)
      setSeverity("error")
      setIsSnackbarOpen(true)
    

    }
    finally{
      setIsCommenting(false)
    }
  }
  const addComment=async()=>{
    setIsCommenting(true)
    try{
      const response=await axios.post("http://localhost:5000/blogs/add-comment",{blogId:id,comment:commentText},{withCredentials:true})
      if(response.data.success){
        
        setComments(response.data.blog.comments)
        setCommentText("")
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
      setMessage(e.response?e.response.data.message:e.message)
      setSeverity("error")
      setIsSnackbarOpen(true)
      

    }
    finally{
      setIsCommenting(false)
    }
  }
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
  },[id])
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

        {/* Blog Content */}
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
    {/* Comment Input Field */}
    <TextField
    ref={commentTextFieldRef}
  fullWidth
  placeholder={replyingToName ? `Replying to ${replyingToName}...` : "Add a comment..."}
  variant="standard"
  value={replyingToName ? `@${replyingToName} ${commentText}` : commentText}
  onChange={(e) => {
    // Remove the replyingToName prefix if it exists
    const newValue = e.target.value.replace(`@${replyingToName} `, "");
    setCommentText(newValue);
  }}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        {/* Button to clear replyingToName */}
        {replyingToName && (
          <IconButton onClick={() => setReplyingToName("")}>
            <Close /> {/* Assuming you have a Close icon */}
          </IconButton>
        )}
        <IconButton
        disabled={IsCommenting}
          onClick={() => {
            if (replyingToName) {
              replyToComment();
            } else {
              addComment();
            }
          }}
          sx={{ color: "black" }}
        >
        {IsCommenting?<CircularProgress style={{height:"18px",width:"18px",color:"black"}} thickness={10}/>:<Send/>}
        </IconButton>
      </InputAdornment>
    ),
    sx: {
      "&::before, &::after": {
        borderBottom: "2px solid black", // Default and hover state
      },
      "&:focus-within::after": {
        borderBottom: "2px solid black", // Focus state
        transform: "scaleX(1)", // Ensure the border remains visible
      },
    },
  }}
  sx={{ mb: 3 }}
/>

    {/* Comments List */}
    <List>
      {comments.map((comment) => (
        <React.Fragment key={comment._id}>
          {/* Main Comment */}
          <ListItem alignItems="flex-start" sx={{ borderBottom: "1px solid #e0e0e0", py: 2 }}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: "black", color: "white" }} src={comment.profilePhotoUrl}></Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {comment.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {moment(new Date(comment.date)).fromNow()}
                  </Typography>
                </Box>
              }
              secondary={comment.text}
            />
            <Button
              variant="outlined"
              sx={{
                borderColor: "black",
                color: "black",
                textTransform: "none",
                "&:hover": { bgcolor: "black", color: "white" },
              }}
              onClick={() => {
              
                setReplyingToName(comment.name);
                setCommentId(comment._id);
                // Scroll to the TextField
   commentTextFieldRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
            >
              Reply
            </Button>
          </ListItem>

          {/* Replies Section */}
          {showReplies[comment._id] && (
            <List sx={{ pl: 4 }}>
              {comment.replies.map((reply) => (
                <ListItem key={reply._id} alignItems="flex-start" sx={{ py: 2 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "black", color: "white" }} src={comment.profilePhotoUrl}></Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                          {reply.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {moment(new Date(reply.date)).fromNow()}
                        </Typography>
                      </Box>
                    }
                    secondary={reply.text}
                  />
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: "black",
                      color: "black",
                      textTransform: "none",
                      "&:hover": { bgcolor: "black", color: "white" },
                    }}
                    onClick={() => {
                      setReplyingToName(reply.name)
                      handleReplyClick(reply._id);
                      setCommentId(comment._id);
                      // Scroll to the TextField
    commentTextFieldRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                  >
                    Reply
                  </Button>
                </ListItem>
              ))}
            </List>
          )}

          {/* Show/Hide Replies Button */}
          {comment.replies.length > 0 && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Button
                variant="text"
                sx={{
                  color: "black",
                  textTransform: "none",
                  "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
                }}
                onClick={() => handleReplyClick(comment._id)}
              >
                {showReplies[comment._id] ? "Hide Replies" : `Show ${comment.replies.length} Replies`}
              </Button>
            </Box>
          )}

          {/* Divider */}
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
           {blog.publishedByBio}
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
        
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 8 }}>
      {blog.tags.map((tag, index) => (
        <Chip
        onClick={()=>{
          navigate(`/blogs/${tag}`)
        }}
          key={index}
          label={tag}
          sx={{
            cursor:"pointer",
            backgroundColor: "black",
            color: "white",
            borderRadius: "4px",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "grey.800", // Slightly lighter black on hover
            },
          }}
        />
      ))}
    </Box>


        {/* Related Blogs */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
            Related Blogs
          </Typography>
          <Grid container spacing={3}>
  {relatedBlogs.map((blog) => (
    <Grid item xs={12} sm={6} md={4} key={blog._id}>
      <Card
      onClick={()=>{
        navigate(`/blog/${blog._id}`)
      }}
        sx={{
          height: "100%",
          cursor:"pointer",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white", // White background
          boxShadow: 3, // Subtle shadow
          transition: "transform 0.2s, box-shadow 0.2s",
          border: "1px solid #e0e0e0", // Light border for definition
          "&:hover": {
            transform: "scale(1.02)", // Slight scale on hover
            boxShadow: 6, // Increase shadow on hover
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          {/* Blog Title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              mb: 2, // Margin bottom
              color: "black", // Black title
            }}
          >
            {blog.title}
          </Typography>

          {/* Blog Description */}
          <Typography
            variant="body1"
            sx={{
              mb: 2, // Margin bottom
              color: "text.secondary", // Gray for description
              display: "-webkit-box",
              WebkitLineClamp: 3, // Limit to 3 lines
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {extractTextFromHTML(blog.content).substring(0, 200)}...
          </Typography>

          {/* Author and Date */}
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary", // Gray for author and date
              fontStyle: "italic",
              mt: "auto", // Push to the bottom
            }}
          >
            By {blog.publishedByName} | {moment(new Date(blog.createdAt)).fromNow()}
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