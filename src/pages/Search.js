import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  InputAdornment,
  TextField,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
  Chip,
  Pagination,
  Fade,
  createTheme,
  ThemeProvider,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import debounce from 'lodash/debounce';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useSearchQuery } from '../contexts/SearchQueryContext';

// Create theme with Velyra font and black-and-white palette
const theme = createTheme({
  typography: {
    fontFamily: '"Velyra", sans-serif',
  },
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#ffffff',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
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

// Styled components
const SearchContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: '900px',
  margin: '0 auto',
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    border: '2px solid #000000',
    transition: 'all 0.3s ease',
    '& fieldset': {
      border: 'none',
    },
    '&:hover': {
      boxShadow: '0 0 12px rgba(0, 0, 0, 0.2)',
    },
    '&.Mui-focused': {
      boxShadow: '0 0 12px rgba(0, 0, 0, 0.3)',
    },
  },
  '& .MuiInputBase-input': {
    padding: '14px',
    fontSize: '1.1rem',
    color: '#000000',
  },
});

const ResultItem = styled(ListItem)(({ theme }) => ({
  borderRadius: '12px',
  margin: theme.spacing(1.5, 0),
  padding: theme.spacing(2.5),
  backgroundColor: '#ffffff',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
    borderColor: '#000000',
    cursor: 'pointer',
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}));

const StyledPagination = styled(Pagination)({
  '& .MuiPaginationItem-root': {
    borderRadius: '50%',
    margin: '0 6px',
    border: '1px solid #000000',
    color: '#000000',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#000000',
      color: '#ffffff',
      transform: 'scale(1.15)',
    },
    '&.Mui-selected': {
      backgroundColor: '#000000',
      color: '#ffffff',
      borderColor: '#000000',
      '&:hover': {
        backgroundColor: '#333333',
      },
    },
  },
});

const BackButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  backgroundColor: '#ffffff',
  border: '2px solid #000000',
  borderRadius: '50%',
  padding: '8px',
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('sm')]: {
    top: theme.spacing(1),
    left: theme.spacing(1),
    padding: '6px',
  },
}));

const LoaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  padding: theme.spacing(3, 0),
}));

const Search = () => {
  const { setSearchQuery } = useSearchQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('query') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState({
    authors: [],
    blogs: [],
    lists: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState({
    authors: 1,
    blogs: 1,
    lists: 1,
  });
  const [totalPages, setTotalPages] = useState({
    authors: 1,
    blogs: 1,
    lists: 1,
  });
  const ITEMS_PER_PAGE = 2;
  const cancelTokenSource = useRef(null); // For canceling previous requests

  const fetchSearchResults = useCallback(async (term, pageNumbers) => {
    if (!term || term.length < 2) {
      setSearchResults({ authors: [], blogs: [], lists: [] });
      setHasSearched(false);
      return;
    }

    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel('New search initiated');
    }
    cancelTokenSource.current = axios.CancelToken.source();

    setIsLoading(true);
    setHasSearched(true);
    
    try {
      // Add a slight delay to ensure the loading spinner is visible
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const response = await axios.get('http://localhost:5000/search', {
        withCredentials: true,
        params: {
          query: term,
          authorPage: pageNumbers.authors,
          blogPage: pageNumbers.blogs,
          listPage: pageNumbers.lists,
          limit: ITEMS_PER_PAGE,
        },
        cancelToken: cancelTokenSource.current.token,
      });


      const { authors, blogs, lists } = response.data;
      console.log("Lists",lists)
      setSearchResults({
        authors: authors.items,
        blogs: blogs.items,
        lists: lists.items,
      });
      setTotalPages({
        authors: Math.ceil(authors.total / ITEMS_PER_PAGE),
        blogs: Math.ceil(blogs.total / ITEMS_PER_PAGE),
        lists: Math.ceil(lists.total / ITEMS_PER_PAGE),
      });
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else {
        console.error('Search error:', error);
        // Reset search results on error
        setSearchResults({ authors: [], blogs: [], lists: [] });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce((term) => {
      setSearchParams({ query: term });
      setPage({ authors: 1, blogs: 1, lists: 1 });
      fetchSearchResults(term, { authors: 1, blogs: 1, lists: 1 });
    }, 300),
    [fetchSearchResults, setSearchParams]
  );

  useEffect(() => {
    if (initialQuery) {
      setHasSearched(true);
      fetchSearchResults(initialQuery, page);
    }
  }, [initialQuery, page, fetchSearchResults]);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setSearchQuery(term);
    
    if (term.length < 2) {
      setHasSearched(false);
      setSearchResults({ authors: [], blogs: [], lists: [] });
    } else {
      debouncedSearch(term);
    }
  };

  const handlePageChange = (category) => (event, value) => {
    setPage((prev) => ({
      ...prev,
      [category]: value,
    }));
    
    // Ensure loading state is set when changing pages
    setIsLoading(true);
    fetchSearchResults(searchTerm, {
      ...page,
      [category]: value,
    });
  };

  const handleBackClick = () => {
    // Check if there's a previous page in history
    if (window.history.length > 1) {
      navigate(-1); // Go back to the previous page
    } else {
      // If no previous page, redirect to a default route (e.g., home)
      navigate('/home', { replace: true });
    }
  };

  const renderSection = (title, items, category) => (
    <Fade in={true} timeout={600}>
      <Box sx={{ 
        mb: 6, 
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 4,
            fontWeight: 700,
            color: '#000000',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            textAlign: 'center',
            borderBottom: '2px solid #000000',
            paddingBottom: '8px',
            width: 'fit-content',
          }}
        >
          {title}
        </Typography>
        <List sx={{ 
          width: '100%', 
          maxWidth: '800px',
          px: { xs: 1, sm: 2 },
        }}>
          {items.map((item) => (
            <ResultItem 
              key={item.id} 
              sx={{ 
                display: 'flex', 
                alignItems: 'flex-start',
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              {(category === 'authors' || category === 'lists') && (
                <ListItemAvatar sx={{ 
                  alignSelf: 'center', 
                  mb: { xs: 2, sm: 0 },
                  mr: { xs: 0, sm: 3 },
                }}>
                  <Avatar 
                    src={category === 'authors' ? item.photo : item.photoUrl} 
                    alt={item.name || item.title} 
                    sx={{ 
                      borderRadius:category=='authors'?'50px':'10px',
                      width: { xs: 90, sm: 70 },
                      height: { xs: 90, sm: 70 },
                      border: '1px solid white',
                    }} 
                  />
                </ListItemAvatar>
              )}
              <ListItemText
                primary={
                  <Typography 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '1.3rem',
                      color: '#000000',
                      textAlign: { xs: 'center', sm: 'left' },
                    }}
                  >
                    {item.name || item.title}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ 
                      mt: 1,
                      textAlign: { xs: 'center', sm: 'left' },
                      lineHeight: 1.6,
                    }}
                  >
                    {category === 'authors' && (
                      <>
                        {item.bio} <br />
                        <Typography component="span" sx={{ color: '#000000', fontWeight: 600 }}>
                          {item.followers.length} followers
                        </Typography>
                      </>
                    )}
                    {category === 'blogs' && (
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: { xs: 'center', sm: 'flex-start' } 
                      }}>
                        <Typography sx={{ mb: 1.5, textAlign: { xs: 'center', sm: 'left' } }}>
                          {extractTextFromHTML(item.content)?extractTextFromHTML(item.content).slice(0,200)+"..":""}
                        </Typography>
                        by {item.author.name} •{' '}
                        <Typography component="span" sx={{ color: '#000000', fontWeight: 600 }}>
                          {item.likedBy.length} likes
                        </Typography>
                        <Box sx={{ 
                          mt: 1.5, 
                          display: 'flex', 
                          justifyContent: { xs: 'center', sm: 'flex-start' },
                          flexWrap: 'wrap',
                          gap: 1,
                        }}>
                          {item.tags.map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              sx={{
                                backgroundColor: '#000000',
                                color: '#ffffff',
                                borderRadius: '6px',
                                fontWeight: 500,
                                transition: 'all 0.3s',
                                '&:hover': {
                                  backgroundColor: '#333333',
                                  transform: 'scale(1.05)',
                                },
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                    {category === 'lists' && (
                      <>
                        {item.description} <br />
                        <Typography component="span" sx={{ color: '#000000', fontWeight: 600 }}>
                          {item.blogs.length} blogs
                        </Typography>
                      </>
                    )}
                  </Typography>
                }
              />
            </ResultItem>
          ))}
        </List>
        {totalPages[category] > 1 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 4,
            width: '100%',
          }}>
            <StyledPagination
              count={totalPages[category]}
              page={page[category]}
              onChange={handlePageChange(category)}
              color="primary"
              size="large"
            />
          </Box>
        )}
        <Divider sx={{ 
          mt: 5, 
          backgroundColor: 'rgba(0, 0, 0, 0.15)', 
          width: '80%',
          maxWidth: '700px',
        }} />
      </Box>
    </Fade>
  );

  const renderNoResults = () => (
    <Fade in={true} timeout={600}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: '100%',
        mt: 6,
        mb: 6,
      }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600,
            color: '#000000',
            textAlign: 'center',
            mb: 2,
          }}
        >
          No results found
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'rgba(0, 0, 0, 0.7)',
            textAlign: 'center',
          }}
        >
          Try different keywords or check your spelling
        </Typography>
      </Box>
    </Fade>
  );

  const hasResults = searchResults.authors.length > 0 || 
                     searchResults.blogs.length > 0 || 
                     searchResults.lists.length > 0;

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <Box sx={{ 
        backgroundColor: '#ffffff', 
        minHeight: '100vh', 
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: { xs: 2, sm: 4 },
        boxSizing: 'border-box',
      }}>
        <SearchContainer>
          <BackButton onClick={handleBackClick}>
            <ArrowBackIcon sx={{ fontSize: 26, color: '#000000' }} />
          </BackButton>
          <StyledTextField
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search authors, blogs, or lists..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#000000', fontSize: 28 }} />
                </InputAdornment>
              ),
            }}
            sx={{ mt: 6, mb: 4 }}
          />

          {/* Always render the loading indicator container when search term exists */}
          {searchTerm && (
            <LoaderContainer>
              {isLoading ? (
                <CircularProgress 
                  size={40} 
                  thickness={4} 
                  sx={{ 
                    color: '#000000',
                    mb: 2,
                  }} 
                />
              ) : (
                // This invisible div maintains spacing when not loading
                <Box sx={{ height: 40, mb: 2 }} />
              )}
            </LoaderContainer>
          )}

          {/* Only render results when not loading and there are results */}
          {!isLoading && hasSearched && (
            <Box sx={{ 
              width: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center' 
            }}>
              {hasResults ? (
                <>
                  {searchResults.authors.length > 0 && renderSection('Authors', searchResults.authors, 'authors')}
                  {searchResults.blogs.length > 0 && renderSection('Blogs', searchResults.blogs, 'blogs')}
                  {searchResults.lists.length > 0 && renderSection('Lists', searchResults.lists, 'lists')}
                </>
              ) : (
                renderNoResults()
              )}
            </Box>
          )}
        </SearchContainer>
      </Box>
    </ThemeProvider>
  );
};

export default Search;