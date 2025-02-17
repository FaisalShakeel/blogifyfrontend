import React, { useState } from "react";
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
} from "@mui/material";
import Navbar from "../components/Navbar";

const categories = ["All", "Lifestyle", "Technology", "Health", "Business"];

const blogs = [
  {
    title: "AI in Everyday Life",
    description:
      "Artificial Intelligence is transforming our daily routines, from smart assistants to recommendation systems...",
    category: "Technology",
    author: "John Doe",
    authorImage: "https://randomuser.me/api/portraits/men/32.jpg",
    createdAt: "2 days ago",
    likes: 120,
    comments: 45,
  },
  {
    title: "Healthy Habits",
    description:
      "Discover simple yet powerful habits that can improve your overall well-being and mental health...",
    category: "Health",
    author: "Jane Smith",
    authorImage: "https://randomuser.me/api/portraits/women/45.jpg",
    createdAt: "5 days ago",
    likes: 95,
    comments: 30,
  },
];

const authors = [
  {
    name: "John Doe",
    bio: "Tech enthusiast",
    avatar: "https://randomuser.me/api/portraits/men/34.jpg",
  },
  {
    name: "Jane Smith",
    bio: "Health Coach",
    avatar: "https://randomuser.me/api/portraits/women/40.jpg",
  },
];

const Home = () => {
  // Theme configuration
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
    },
  });

  const [selectedCategory, setSelectedCategory] = useState("All");

  // Heading style with rounded background
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

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          bgcolor: "#f5f5f5",
          overflow: "hidden",
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            py: 4,
            bgcolor: "white",
            color: "black",
            fontFamily: "Velyra, sans-serif",
          }}
        >
          {/* Categories */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={headingStyle}>
              Categories
            </Typography>
            <Grid container spacing={2}>
              {categories.map((cat) => (
                <Grid item key={cat}>
                  <Paper
                    sx={{
                      px: 3,
                      py: 1,
                      borderRadius: 20,
                      cursor: "pointer",
                      bgcolor: selectedCategory === cat ? "black" : "white",
                      color: selectedCategory === cat ? "white" : "black",
                      transition: "0.3s",
                      "&:hover": {
                        bgcolor: "black",
                        color: "white",
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

          <Grid container spacing={4}>
            {/* Blogs Section (Left) */}
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={headingStyle}>
                  Blogs
                </Typography>
                <Grid container spacing={2}>
                  {blogs.map((blog, index) => (
                    <Grid item xs={12} key={index}>
                      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", mb: 1 }}
                        >
                          {blog.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ mb: 1 }}
                        >
                          {blog.description.substring(0, 100)}...
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Avatar
                            src={blog.authorImage}
                            sx={{ width: 30, height: 30 }}
                          />
                          <Typography variant="body2">{blog.author}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            | {blog.createdAt}
                          </Typography>
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            mt: 1,
                            display: "inline-block",
                            bgcolor: "black",
                            color: "white",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 10,
                            fontSize: "12px",
                          }}
                        >
                          {blog.category}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Popular Blogs */}
              <Box>
                <Typography variant="h5" sx={headingStyle}>
                  Popular Blogs
                </Typography>
                <Grid container spacing={2}>
                  {blogs
                    .sort((a, b) => b.likes + b.comments - (a.likes + a.comments))
                    .slice(0, 2)
                    .map((blog, index) => (
                      <Grid item xs={12} key={index}>
                        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold", mb: 1 }}
                          >
                            {blog.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ mb: 1 }}
                          >
                            {blog.description.substring(0, 100)}...
                          </Typography>
                          <Box
                            sx={{ display: "flex", alignItems: "center", gap: 1 }}
                          >
                            <Avatar
                              src={blog.authorImage}
                              sx={{ width: 30, height: 30 }}
                            />
                            <Typography variant="body2">{blog.author}</Typography>
                            <Typography variant="caption" color="textSecondary">
                              | {blog.createdAt}
                            </Typography>
                          </Box>
                          <Box sx={{ mt: 1, display: "flex", gap: 2 }}>
                            <Typography variant="caption">
                              {blog.likes} Likes
                            </Typography>
                            <Typography variant="caption">
                              {blog.comments} Comments
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                </Grid>
              </Box>
            </Grid>

            {/* Authors Section (Right) */}
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={headingStyle}>
                  Featured Authors
                </Typography>
                <Grid container spacing={2}>
                  {authors.map((author, index) => (
                    <Grid item xs={12} key={index}>
                      <Paper
                        sx={{
                          p: 2,
                          display: "flex",
                          alignItems: "center",
                          borderRadius: 2,
                          boxShadow: 2,
                        }}
                      >
                        <Avatar
                          src={author.avatar}
                          sx={{ width: 40, height: 40, mr: 2 }}
                        />
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold" }}
                          >
                            {author.name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {author.bio}
                          </Typography>
                          <Button
                            size="small"
                            variant="contained"
                            sx={{
                              mt: 1,
                              bgcolor: "black",
                              color: "white",
                              "&:hover": { bgcolor: "gray" },
                            }}
                          >
                            Follow
                          </Button>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Home;