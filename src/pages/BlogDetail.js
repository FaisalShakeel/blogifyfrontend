import React, { useState } from "react";
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
} from "@mui/material";
import {
  FavoriteBorder,
  ChatBubbleOutline,
  BookmarkBorder,
  Reply,
  Send,
} from "@mui/icons-material";
import Navbar from "../components/Navbar";

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

// Mock data for save lists
const saveLists = [
  {
    id: 1,
    title: "Tech Blogs",
    description: "All about technology",
    image: "https://via.placeholder.com/50",
    blogsCount: 5,
  },
  {
    id: 2,
    title: "Travel Diaries",
    description: "My travel experiences",
    image: "https://via.placeholder.com/50",
    blogsCount: 3,
  },
];

const BlogDetail = () => {
  const [showComments, setShowComments] = useState(false);
  const [showReplies, setShowReplies] = useState({});
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

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

  return (
    <ThemeProvider theme={theme}>
      <Navbar/>
      <Box sx={{ width: "90%", bgcolor: "background.default", p: 4 }}>
        {/* Blog Title */}
        <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold" }}>
          Impacts of AI
        </Typography>

        {/* Blog Media */}
        <Box
          component="img"
          src="https://via.placeholder.com/800x400"
          alt="Blog Media"
          sx={{ width: "100%", borderRadius: 2, mb: 3 }}
        />

        {/* Blog Description */}
        <Typography variant="body1" sx={{ mb: 3 }}>
          Artificial Intelligence (AI) is transforming industries across the globe. From healthcare to finance, AI is enabling new possibilities and solving complex problems. This blog explores the profound impacts of AI on society and the future of work.
        </Typography>

        {/* Like, Comment, Save Buttons */}
        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <IconButton>
            <FavoriteBorder />
          </IconButton>
          <IconButton onClick={handleCommentClick}>
            <ChatBubbleOutline />
          </IconButton>
          <IconButton onClick={handleSaveClick}>
            <BookmarkBorder />
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
            <Avatar sx={{ mr: 2, width: 60, height: 60 }}>A</Avatar>
            <Box>
              <Typography variant="h6">
              Faisal Shakeel
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
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Save to List
            </Typography>
            <List>
              {saveLists.map((list) => (
                <ListItem key={list.id}>
                  <ListItemAvatar>
                    <Avatar src={list.image} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={list.title}
                    secondary={`${list.description} - ${list.blogsCount} blogs`}
                  />
                  <Button variant="contained" sx={{ bgcolor: "black", color: "white", textTransform: "none" }}>
                    Save
                  </Button>
                </ListItem>
              ))}
            </List>
            <Button
              fullWidth
              variant="contained"
              sx={{ bgcolor: "black", color: "white", mt: 2, textTransform: "none" }}
            >
              Create New List
            </Button>
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
};

export default BlogDetail;