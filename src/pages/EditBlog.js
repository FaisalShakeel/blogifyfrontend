import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Box,
  Grid,
  ThemeProvider,
  createTheme,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatQuote,
  FormatListBulleted,
  FormatListNumbered,
  Image as ImageIcon,
  Link as LinkIcon,
  YouTube as YouTubeIcon,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  Undo,
  Redo,
  Close as CloseIcon,
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import axios from 'axios';
import CustomSnackbar from '../components/Snackbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';

const editorStyles = `
  .ProseMirror {
    font-family: 'Velyra', sans-serif;
    > * + * {
      margin-top: 0.75em;
    }

    img {
      max-width: 100%;
      height: auto;
      &.ProseMirror-selectednode {
        outline: 2px solid #000;
      }
    }

    blockquote {
      border-left: 3px solid #000;
      padding-left: 1rem;
      margin-left: 0;
      font-style: italic;
    }

    ul, ol {
      padding-left: 2rem;
    }

    h1, h2, h3, h4, h5, h6 {
      line-height: 1.2;
      margin-top: 2rem;
      margin-bottom: 1rem;
    }

    iframe {
      width: 100%;
      margin: 1rem 0;
      border-radius: 8px;
      overflow: hidden;
    }

    pre {
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
    }

    code {
      font-family: 'Courier New', Courier, monospace;
    }
  }
`;

// Add the styles to the document
const style = document.createElement('style');
style.textContent = editorStyles;
document.head.appendChild(style);

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
    },
  },
  typography: {
    fontFamily: 'Velyra, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 20px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
  },
});

// URL Input Dialog Component
const URLInputDialog = ({ open, onClose, onSubmit, title, placeholder }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = () => {
    onSubmit(url);
    setUrl('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ borderBottom: '1px solid #eee', pb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {title}
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ my: 2 }}>
        <TextField
          fullWidth
          placeholder={placeholder}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          variant="outlined"
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const MenuBar = ({ editor }) => {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const fileInputRef = useRef(null);

  if (!editor) return null;

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        editor.chain().focus().setImage({ src: e.target.result }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  const toolbarGroups = [
    [
      {
        icon: <FormatBold />,
        action: () => editor.chain().focus().toggleBold().run(),
        isActive: editor.isActive('bold'),
        tooltip: 'Bold',
      },
      {
        icon: <FormatItalic />,
        action: () => editor.chain().focus().toggleItalic().run(),
        isActive: editor.isActive('italic'),
        tooltip: 'Italic',
      },
      {
        icon: <FormatUnderlined />,
        action: () => editor.chain().focus().toggleUnderline().run(),
        isActive: editor.isActive('underline'),
        tooltip: 'Underline',
      },
    ],
    [
      {
        icon: <FormatQuote />,
        action: () => editor.chain().focus().toggleBlockquote().run(),
        isActive: editor.isActive('blockquote'),
        tooltip: 'Quote',
      },
      {
        icon: <FormatListBulleted />,
        action: () => editor.chain().focus().toggleBulletList().run(),
        isActive: editor.isActive('bulletList'),
        tooltip: 'Bullet List',
      },
      {
        icon: <FormatListNumbered />,
        action: () => editor.chain().focus().toggleOrderedList().run(),
        isActive: editor.isActive('orderedList'),
        tooltip: 'Numbered List',
      },
    ],
    [
      {
        icon: <FormatAlignLeft />,
        action: () => editor.chain().focus().setTextAlign('left').run(),
        isActive: editor.isActive({ textAlign: 'left' }),
        tooltip: 'Align Left',
      },
      {
        icon: <FormatAlignCenter />,
        action: () => editor.chain().focus().setTextAlign('center').run(),
        isActive: editor.isActive({ textAlign: 'center' }),
        tooltip: 'Align Center',
      },
      {
        icon: <FormatAlignRight />,
        action: () => editor.chain().focus().setTextAlign('right').run(),
        isActive: editor.isActive({ textAlign: 'right' }),
        tooltip: 'Align Right',
      },
    ],
    [
      {
        icon: <ImageIcon />,
        action: () => fileInputRef.current?.click(),
        tooltip: 'Add Image',
      },
      {
        icon: <LinkIcon />,
        action: () => setLinkDialogOpen(true),
        tooltip: 'Add Link',
      },
      {
        icon: <YouTubeIcon />,
        action: () => setVideoDialogOpen(true),
        tooltip: 'Add YouTube Video',
      },
    ],
    [
      {
        icon: <Undo />,
        action: () => editor.chain().focus().undo().run(),
        tooltip: 'Undo',
      },
      {
        icon: <Redo />,
        action: () => editor.chain().focus().redo().run(),
        tooltip: 'Redo',
      },
    ],
  ];

  return (
    <Box sx={{ mb: 2 }}>
      <Paper
        variant="outlined"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          p: 1,
          borderRadius: 2,
        }}
      >
        {toolbarGroups.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {group.map((item, itemIndex) => (
                <Tooltip key={itemIndex} title={item.tooltip}>
                  <IconButton
                    onClick={item.action}
                    color={item.isActive ? 'primary' : 'default'}
                    size="small"
                  >
                    {item.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
            {groupIndex < toolbarGroups.length - 1 && (
              <Box
                sx={{
                  width: '1px',
                  bgcolor: 'divider',
                  mx: 1,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </Paper>

      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept="image/*"
        onChange={handleImageUpload}
      />

      <URLInputDialog
        open={linkDialogOpen}
        onClose={() => setLinkDialogOpen(false)}
        onSubmit={(url) => {
          editor.chain().focus().setLink({ href: url }).run();
        }}
        title="Add Link"
        placeholder="Enter URL"
      />

      <URLInputDialog
        open={videoDialogOpen}
        onClose={() => setVideoDialogOpen(false)}
        onSubmit={(url) => {
          editor.chain().focus().setYoutubeVideo({ src: url }).run();
        }}
        title="Add YouTube Video"
        placeholder="Enter YouTube URL"
      />
    </Box>
  );
};

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const [tags] = useState([
    'JavaScript',
    'React',
    'Node.js',
    'Python',
    'AI',
    'Machine Learning',
    'Web Development',
  ]);
  const [loading, setLoading] = useState(true);
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        inline: true,
      }),
      Youtube.configure({
        width: '100%',
        height: 400,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: '<p>Write Here Your Amazing Blog Post...</p>',
  });

  const handleBack = () => {
    navigate(-1);
  };

  // Fetch blog details and update editor content
  const getBlogDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/blogs/blog-detail/${id}`, { withCredentials: true });

      if (response.data.success) {
        const blog = response.data.blog;
        setTitle(blog.title);
        setCategory(blog.category);
        setSelectedTags(blog.tags);
        setContent(blog.content);
        // Update editor content after fetching
        if (editor && blog.content) {
          editor.commands.setContent(blog.content);
        }
      } else {
        setMessage(response.data.message || 'Failed to fetch blog details');
        setSeverity('error');
        setIsSnackbarOpen(true);
      }
    } catch (e) {
      console.error('Error fetching blog details:', e);
      setMessage(e.response?.data?.message || 'An unexpected error occurred');
      setSeverity('error');
      setIsSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Update blog API call
  const handleUpdateBlog = async () => {
    try {
      setIsSubmitting(true);
      const blogContent = editor?.getHTML();
      const response = await axios.put(
        `http://localhost:5000/blogs/update-blog/${id}`,
        { content: blogContent, title, tags: selectedTags, category, isInDraft: saveAsDraft },
        { withCredentials: true }
      );
      if (response.data.success) {
        setMessage(response.data.message);
        setSeverity('success');
        setIsSnackbarOpen(true);
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setMessage(response.data.message);
        setSeverity('error');
        setIsSnackbarOpen(true);
      }
    } catch (error) {
      setMessage(error.response ? error.response.data.message : error.message);
      setSeverity('error');
      setIsSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    getBlogDetails();
  }, [id]); // Add id as dependency to refetch if it changes

  // Update editor content when content state changes
  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  if (loading) {
    return (
      <Box>
        <Navbar />
        <Box sx={{ height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress sx={{ color: 'black' }} thickness={8} size={40} />
        </Box>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      {/* Back Button */}
      <Box sx={{ mt: 2, ml: 2 }}>
        <IconButton
          onClick={handleBack}
          sx={{
            backgroundColor: '#f5f5f5',
            '&:hover': { backgroundColor: '#eeeeee' },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
            Edit Blog
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Blog Title"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="Technology">Technology</MenuItem>
                  <MenuItem value="Lifestyle">Lifestyle</MenuItem>
                  <MenuItem value="Education">Education</MenuItem>
                  <MenuItem value="Business">Business</MenuItem>
                  <MenuItem value="Health">Health</MenuItem>
                  <MenuItem value="Travel">Travel</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Tags</InputLabel>
                <Select
                  multiple
                  value={selectedTags}
                  onChange={(e) => setSelectedTags(e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          onDelete={() => {
                            setSelectedTags(selectedTags.filter((tag) => tag !== value));
                          }}
                          sx={{
                            borderRadius: 2,
                            backgroundColor: 'primary.main',
                            color: 'white',
                          }}
                        />
                      ))}
                    </Box>
                  )}
                  sx={{ borderRadius: 2 }}
                >
                  {tags.map((tag) => (
                    <MenuItem key={tag} value={tag}>
                      {tag}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Paper
                variant="outlined"
                sx={{
                  minHeight: '600px',
                  '& .ProseMirror': {
                    minHeight: '550px',
                    outline: 'none',
                    padding: 3,
                  },
                }}
              >
                <MenuBar editor={editor} />
                <EditorContent editor={editor} />
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={handleUpdateBlog}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Blog'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        <CustomSnackbar
          open={isSnackbarOpen}
          closeSnackbar={setIsSnackbarOpen}
          message={message}
          severity={severity}
        />
      </Container>
    </ThemeProvider>
  );
};

export default EditBlog;