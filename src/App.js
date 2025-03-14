import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Home from './pages/Home';
import BlogDetail from './pages/BlogDetail';
import WriteBlog from './pages/WriteBlog';
import Profile from './pages/Profile';
import BlogsByTag from './pages/BlogsByTag';
import EditBlog from './pages/EditBlog';
import Search from './pages/Search';
import { io } from 'socket.io-client';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './contexts/AuthContext';
import { Snackbar, Alert, Typography } from '@mui/material';
import Notifications from './pages/Notifications';

function App() {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  
  useEffect(() => {
    const socketInstance = io("http://localhost:5000", {
      query: { userId: user?.id || '' },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });
    console.log("Socket Instance", socketInstance);
    setSocket(socketInstance);
    
    return () => {
      socketInstance.disconnect();
    };
  }, [user]);
  
  useEffect(() => {
    if (socket) {
      socket.on("new-notification", (notification) => {
        console.log("New notification received:", notification);
        setNotifications((prev) => [...prev, notification]);
        setCurrentNotification(notification);
        setSnackbarOpen(true);
      });
      
      return () => {
        socket.off("new-notification");
      };
    }
  }, [socket]);
  
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-account" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/write-blog" element={<WriteBlog />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/blogs/:tag" element={<BlogsByTag />} />
        <Route path="/blog/edit/:id" element={<EditBlog />} />
        <Route path="/search" element={<Search />} />
        <Route path="/notifications" element={<Notifications/>}></Route>
      </Routes>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          '& .MuiPaper-root': {
            background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            maxWidth: '340px',
            width: '100%',
            padding: '0px',
            margin: '16px',
          }
        }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="info"
          icon={false}
          sx={{
            width: '100%',
            backgroundColor: 'transparent',
            color: '#000',
            padding: '16px 20px',
            borderRadius: '14px',
            fontFamily: '"Velyra", sans-serif',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            position: 'relative',
            overflow: 'hidden',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle at top left, rgba(0, 0, 0, 0.05) 0%, transparent 70%)',
              zIndex: 0,
            },
            '& .MuiAlert-action': {
              padding: 0,
              marginLeft: 'auto',
              '& .MuiButtonBase-root': {
                color: 'rgba(0, 0, 0, 0.6)',
                '&:hover': {
                  color: '#000',
                  backgroundColor: 'rgba(0, 0, 0, 0.05)'
                }
              }
            }
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontFamily: '"Velyra", sans-serif',
              fontWeight: 700,
              letterSpacing: '0.5px',
              fontSize: '16px',
              marginBottom: '6px',
              position: 'relative',
              zIndex: 1,
              color: '#1a1a1a',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            }}
          >
            {currentNotification?.title || 'New Notification'}
          </Typography>
          
          {currentNotification?.message && (
            <Typography
              variant="body2"
              sx={{
                fontFamily: '"Velyra", sans-serif',
                fontSize: '13px',
                color: '#333',
                position: 'relative',
                zIndex: 1,
                lineHeight: '1.4',
                textShadow: '0 1px 1px rgba(0, 0, 0, 0.05)',
              }}
            >
              {currentNotification.message}
            </Typography>
          )}
          
          <Typography
            variant="caption"
            sx={{
              fontFamily: '"Velyra", sans-serif',
              fontSize: '11px',
              color: '#666',
              marginTop: '8px',
              position: 'relative',
              zIndex: 1,
              alignSelf: 'flex-end',
              background: 'rgba(0, 0, 0, 0.05)',
              padding: '2px 8px',
              borderRadius: '8px',
            }}
          >
            {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </Typography>
        </Alert>
      </Snackbar>
    </BrowserRouter>
  );
}

export default App;