import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Typography,
  Box,
  Fade,
  Zoom,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';

// Styled components for custom animations
const AnimatedBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  backgroundColor: '#ffffff', // White background
}));

const PulsingCircle = styled(CircularProgress)(({ theme }) => ({
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
      opacity: 1,
    },
    '50%': {
      transform: 'scale(1.2)',
      opacity: 0.7,
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 1,
    },
  },
  animation: 'pulse 1.5s infinite',
  color: '#000000', // Black accent for the spinner
}));

const DeleteModal = ({ open, handleClose, deleting: externalDeleting, onDelete }) => {
  const [localError, setLocalError] = useState(null);

  const handleDelete = async () => {
    setLocalError(null); // Reset any previous error
    try {
      if (onDelete) {
        await onDelete(); // Wait for the external delete function (API call) to complete
      }
    } catch (error) {
      console.error('Error during deletion:', error);
      setLocalError('Failed to delete item. Please try again.');
      
    }
    
  };

  // Use externalDeleting directly without local isDeleting state
  const isCurrentlyDeleting = externalDeleting;

  return (
    <Dialog
      open={open}
      onClose={isCurrentlyDeleting ? null : handleClose} // Disable closing during deletion
      TransitionComponent={Zoom}
      transitionDuration={500}
      PaperProps={{
        sx: {
          backgroundColor: '#ffffff', // White background for the dialog
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', // Subtle black shadow
        },
      }}
    >
      <DialogTitle>
        <Fade in={true} timeout={800}>
          <Typography
            variant="h6"
            sx={{
              color: '#000000', // Black text
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            {isCurrentlyDeleting ? 'Deleting...' : 'Confirm Deletion'}
          </Typography>
        </Fade>
      </DialogTitle>
      <DialogContent>
        <AnimatedBox>
          {isCurrentlyDeleting ? (
            <>
              <PulsingCircle size={60} thickness={5} />
              <Fade in={true} timeout={1000}>
                <Typography
                  variant="body1"
                  sx={{ color: '#000000' }} // Black text
                >
                  Item being deleted magically!
                </Typography>
              </Fade>
            </>
          ) : (
            <>
              <Typography
                variant="body1"
                sx={{ mb: 2, color: '#000000' }} // Black text
              >
                Are you sure you want to delete this item?
              </Typography>
              {localError && (
                <Typography
                  variant="body2"
                  sx={{ mb: 2, color: '#FF0000' }} // Red text for error
                >
                  {localError}
                </Typography>
              )}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  disabled={isCurrentlyDeleting}
                  sx={{
                    borderColor: '#000000', // Black border
                    color: '#000000', // Black text
                    borderRadius: 20,
                    '&:hover': {
                      borderColor: '#333333',
                      backgroundColor: '#f5f5f5', // Light gray hover
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleDelete}
                  disabled={isCurrentlyDeleting}
                  startIcon={<DeleteIcon />}
                  sx={{
                    backgroundColor: '#000000', // Black background
                    color: '#ffffff', // White text
                    borderRadius: 20,
                    '&:hover': {
                      backgroundColor: '#333333', // Darker black hover
                    },
                  }}
                >
                  Confirm Delete
                </Button>
              </Box>
            </>
          )}
        </AnimatedBox>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;