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

const categories = ["All","Lifestyle", "Technology", "Health", "Business"];

const blogs = [
  {
    title: "AI in Everyday Life",
    description:
      "Artificial Intelligence is transforming our daily routines, from smart assistants to recommendation systems...",
    category: "Technology",
    author: "John Doe",
    authorImage: "https://randomuser.me/api/portraits/men/32.jpg",
    createdAt: "2 days ago",
  },
  {
    title: "Healthy Habits",
    description:
      "Discover simple yet powerful habits that can improve your overall well-being and mental health...",
    category: "Health",
    author: "Jane Smith",
    authorImage: "https://randomuser.me/api/portraits/women/45.jpg",
    createdAt: "5 days ago",
  },
];

const authors = [
  { name: "John Doe", bio: "Tech enthusiast", avatar: "https://randomuser.me/api/portraits/men/34.jpg" },
  { name: "Jane Smith", bio: "Health Coach", avatar: "https://randomuser.me/api/portraits/women/40.jpg" },
];

const popularLists = [
  {
    name: "Tech Trends",
    description: "Latest tech insights and innovations shaping the future.",
    blogs: 12,
    image: "https://source.unsplash.com/300x200/?technology",
  },
  {
    name: "Wellness Guide",
    description: "Your go-to resource for a healthier lifestyle.",
    blogs: 8,
    image: "https://source.unsplash.com/300x200/?wellness",
  },
];

const Home = () => {
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
    },
  });
  const [selectedCategory, setSelectedCategory] = useState("All");
  


  return (
    <ThemeProvider theme={theme}>
        <Navbar/>

    <Box sx={{display:"flex",flexDirection:"column",bgcolor:"#f5f5f5",overflow:"hidden"}}>

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
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2,fontFamily:"Velyra" }}>
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
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2,fontFamily:"Velyra" }}>
              Blogs
            </Typography>
            <Grid container spacing={2}>
              {blogs.map((blog, index) => (
                <Grid item xs={12} key={index}>
                  <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold",fontFamily:"Velyra" }}>
                      {blog.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mb: 1,fontFamily:"Velyra" }}
                    >
                      {blog.description.substring(0, 100)}...
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar
                        src={blog.authorImage}
                        sx={{ width: 30, height: 30 }}
                      />
                      <Typography sx={{fontFamily:"Velyra"}} variant="body2">{blog.author}</Typography>
                      <Typography sx={{fontFamily:"Velyra"}} variant="caption" color="textSecondary">
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
                        fontFamily:"Velyra",
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

          {/* Popular Lists */}
          <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2,fontFamily:"Velyra" }}>
              Popular Lists
            </Typography>
            <Grid container spacing={2}>
              {popularLists.map((list, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 2 }}>
                    <img
                      src={list.image}
                      alt={list.name}
                      style={{
                        fontFamily:"Velyra",
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                    <Typography variant="h6" sx={{ mt: 1, fontWeight: "bold",fontFamily:"Velyra" }}>
                      {list.name}
                    </Typography>
                    <Typography sx={{fontFamily:"Velyra"}} variant="body2" color="textSecondary">
                      {list.description}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 1,fontFamily:"Velyra" }}>
                      {list.blogs} blogs
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        {/* Authors Section (Right) */}
        <Grid item xs={12} md={4}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2,fontFamily:"Velyra" }}>
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
                    <Avatar src={author.avatar} sx={{ width: 40, height: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: "bold",fontFamily:"Velyra" }}>
                        {author.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{fontFamily:"Velyra"}}>
                        {author.bio}
                      </Typography>
                      <Button
                        size="small"
                        variant="contained"
                        sx={{
                            fontFamily:"Velyra",
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
