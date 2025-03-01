import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip, Card, CardContent, Avatar, Stack, Divider, IconButton, Container, Grid, Paper, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import CustomSnackbar from '../components/Snackbar' ;
const extractTextFromHTML = (htmlString) => {
    if (!htmlString) return "";
    const temp = document.createElement("div");
    temp.innerHTML = htmlString;
    const text = temp.textContent || temp.innerText;
    return text.replace(/\s+/g, " ").trim();
  };


// Custom theme with Velyra font family and enhanced styling
const theme = createTheme({
    typography: {
        fontFamily: 'Velyra, Arial, sans-serif',
        h5: {
            fontWeight: 700,
            letterSpacing: 0.5,
        },
        h6: {
            fontWeight: 600,
        }
    },
    palette: {
        background: {
            default: '#ffffff',
            paper: '#ffffff',
        },
        text: {
            primary: '#000000',
            secondary: '#555555',
        },
        primary: {
            main: '#000000',
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    fontWeight: 500,
                },
            },
        },
    },
});

const BlogsByTag = () => {
    const navigate = useNavigate()
    const {tag} = useParams()
    const [loading, setLoading] = useState(true)
    const [blogs, setBlogs] = useState([]);
    const [popularTags, setPopularTags] = useState([]);

    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [severity ,setSeverity] = useState("")
    
    const closeSnackbar = ()=>{
        setIsSnackbarOpen(false)
    }
    const handleBack = () => {
        // Add your navigation logic here
        console.log('Back button clicked');
    };
    const getBlogsAndPopularTags=async()=>{
        setLoading(true)
        try{
            const response = await axios.get(`http://localhost:5000/blogs/find-by-tag/${tag}`,{withCredentials:true})
            if(response.data.success){
                setBlogs(response.data.blogs)
                setPopularTags(response.data.popularTags)
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

    useEffect(() => {
        getBlogsAndPopularTags()
        
    }, [tag]);
    if(loading){
        return(<Box style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"}}>
            <CircularProgress style={{color:"black"}} size={35} thickness={10}/>
        </Box>)
    }

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Back Button */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <IconButton 
                        onClick={handleBack} 
                        sx={{ 
                            color: 'black', 
                            p: 1, 
                            mr: 2,
                            '&:hover': { 
                                bgcolor: 'rgba(0,0,0,0.05)' 
                            } 
                        }}
                        aria-label="back"
                    >
                        <ArrowBackIcon fontSize="large" />
                    </IconButton>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Explore Blogs
                    </Typography>
                </Box>

                {/* Popular Tags Section with enhanced styling */}
                <Paper 
                    elevation={0} 
                    sx={{ 
                        mb: 5, 
                        p: 3, 
                        borderRadius: 3, 
                        border: '1px solid #f0f0f0',
                        background: 'linear-gradient(145deg, #f9f9f9 0%, #ffffff 100%)'
                    }}
                >
                    <Typography variant="h5" gutterBottom sx={{ position: 'relative' }}>
                        Popular Tags
                        <Box sx={{ 
                            position: 'absolute', 
                            width: 40, 
                            height: 3, 
                            bgcolor: 'black', 
                            bottom: -8, 
                            left: 0 
                        }} />
                    </Typography>
                    <Stack 
                        direction="row" 
                        spacing={1.5} 
                        sx={{ 
                            flexWrap: 'wrap', 
                            gap: 1, 
                            mt: 3 
                        }}
                    >
                        {popularTags.map((tag, index) => (
                            <Chip
                            onClick={()=>{
                                navigate(`/blogs/${tag}`)
                            }}
                                key={index}
                                label={tag}
                                clickable
                                sx={{
                                    backgroundColor: 'black',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    px: 1,
                                    '&:hover': {
                                        backgroundColor: '#333',
                                        transform: 'scale(1.05)',
                                    },
                                    transition: 'all 0.2s ease-in-out',
                                }}
                            />
                        ))}
                    </Stack>
                </Paper>

                {/* Blogs Section with grid layout for better responsiveness */}
                <Box>
                    <Typography variant="h5" gutterBottom sx={{ position: 'relative', mb: 4 }}>
                        Featured Blogs
                        <Box sx={{ 
                            position: 'absolute', 
                            width: 40, 
                            height: 3, 
                            bgcolor: 'black', 
                            bottom: -8, 
                            left: 0 
                        }} />
                    </Typography>
                    <Grid container spacing={3}>
                        {blogs.map((blog) => (
                            <Grid item xs={12} md={6} key={blog.id}>
                                <Card sx={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                                    position: 'relative',
                                    overflow: 'visible'
                                }}>
                                    <Box 
                                        sx={{ 
                                            position: 'absolute', 
                                            top: -10, 
                                            right: 20, 
                                            backgroundColor: 'black', 
                                            color: 'white',
                                            px: 2,
                                            py: 0.5,
                                            borderRadius: 1,
                                            zIndex: 1
                                        }}
                                    >
                                        <Typography variant="caption" fontWeight="bold">
                                            {blog.category}
                                        </Typography>
                                    </Box>
                                    <CardContent sx={{ p: 3, flexGrow: 1 }}>
                                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                            <Avatar 
                                                src={blog.publishedByPhotoUrl} 
                                                alt={blog.publishedByName} 
                                                sx={{ 
                                                    width: 50, 
                                                    height: 50,
                                                    border: '2px solid white'
                                                }} 
                                            />
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{blog.title}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {blog.publishedByName} • {blog.publishedDate}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                        <Typography variant="body1" sx={{ mt: 2, mb: 3, lineHeight: 1.6 }}>
                                            {extractTextFromHTML(blog.content)?extractTextFromHTML(blog.content).slice(0,200)+"...":""}
                                        </Typography>
                                        <Box sx={{ mb: 2 }}>
                                            {blog.tags.map((tag, index) => (
                                                <Chip
                                                    key={index}
                                                    label={tag}
                                                    size="small"
                                                    sx={{
                                                        mr: 1,
                                                        mb: 1,
                                                        backgroundColor: 'rgba(0,0,0,0.06)',
                                                        color: 'text.primary',
                                                        fontWeight: 500,
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                        <Divider sx={{ my: 2 }} />
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                                    <FavoriteIcon fontSize="small" color="disabled" />
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {blog.likedBy.length}
                                                    </Typography>
                                                </Stack>
                                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                                    <ChatBubbleOutlineIcon fontSize="small" color="primary" />
                                                    <Typography variant="body2" fontWeight="medium">
                                                        {blog.comments.length}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                            <Chip
                                            onClick={()=>{
                                                navigate(`/blog/${blog._id}`)
                                            }} 
                                                label="Read More" 
                                                clickable
                                                sx={{ 
                                                    backgroundColor: 'black',
                                                    color: 'white',
                                                    '&:hover': {
                                                        backgroundColor: '#333',
                                                    }
                                                }}
                                            />
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                <CustomSnackbar message={message} severity={severity} open={isSnackbarOpen} closeSnackbar={closeSnackbar}/>
            </Container>
        </ThemeProvider>
    );
};

export default BlogsByTag;