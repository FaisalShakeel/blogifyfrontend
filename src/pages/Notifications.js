import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  IconButton,
  Divider,
} from "@mui/material";
import moment from "moment";
import axios from "axios";
import { toast } from "react-toastify";
import { ArrowBack, NotificationsOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const getNotifications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/notifications/all-notifications",
        {
          withCredentials: true
        }
      );
      console.log("Notifications", response.data);
      if (response.data.success) {
        setNotifications(response.data.notifications);
      } else {
        toast.error("Notifications could not be fetched!", {
          style: { fontFamily: "Velyra" },
        });
      }
    } catch (e) {
      toast.error(
        e.response
          ? e.response.data.message
          : "Notifications could not be fetched!",
        { style: { fontFamily: "Velyra" } }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#fff",
        }}
      >
        <CircularProgress
          size={40}
          thickness={4}
          sx={{ color: "#000" }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: "#fff",
        minHeight: "100vh",
        width: "100%",
        padding: { xs: "16px", md: "24px" },
        boxSizing: "border-box",
      }}
    >
      {/* Header with back button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "16px 20px",
          position: "sticky",
          top: 0,
          background: "#fff",
          zIndex: 10,
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto 16px auto",
          borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
        }}
      >
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            color: "#000",
            background: "rgba(0, 0, 0, 0.04)",
            "&:hover": {
              background: "rgba(0, 0, 0, 0.08)",
            },
            marginRight: "16px",
          }}
          size="small"
        >
          <ArrowBack fontSize="small" />
        </IconButton>
        
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            fontSize: { xs: "20px", md: "22px" },
            fontFamily: "Velyra",
            color: "#000",
            flexGrow: 1,
          }}
        >
          Notifications
        </Typography>
        
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "#000",
          }}
        >
          <NotificationsOutlined sx={{ color: "#fff", fontSize: "20px" }} />
        </Box>
      </Box>

      {/* Notifications List */}
      <Box 
        sx={{ 
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          padding: { xs: 0, md: "0 16px" }
        }}
      >
        {notifications.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "60px 20px",
              gap: "16px",
            }}
          >
            <Box
              sx={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <NotificationsOutlined sx={{ fontSize: "40px", color: "#bdbdbd" }} />
            </Box>
            <Typography
              sx={{
                fontFamily: "Velyra",
                textAlign: "center",
                color: "#333",
                fontSize: "20px",
                fontWeight: 600,
              }}
            >
              No Notifications Yet
            </Typography>
            <Typography
              sx={{
                fontFamily: "Velyra",
                textAlign: "center",
                color: "#757575",
                fontSize: "15px",
                maxWidth: "400px",
              }}
            >
              When you receive notifications, they will appear here
            </Typography>
          </Box>
        ) : (
          <List sx={{ padding: 0 }}>
            {notifications.map((notification, index) => (
              <Box 
                key={index}
                sx={{
                  marginBottom: "12px",
                }}
              >
                <ListItem
                  onClick={() => {
                    if (
                      notification.type === "Liked Video" ||
                      notification.type === "Added Comment"
                    ) {
                      navigate(`/blog/${notification.blogId}`);
                    } else {
                      navigate(`/profile/${notification.sentBy}`);
                    }
                  }}
                  sx={{
                    padding: "16px",
                    cursor: "pointer",
                    borderRadius: "12px",
                    background: "#fff",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.06)",
                      "& .notification-highlight": {
                        width: "100%",
                        opacity: 0.03,
                      }
                    },
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: 0,
                      height: "100%",
                      width: "4px",
                      background: "#000",
                    }
                  }}
                >
                  {/* Highlight effect on hover */}
                  <Box 
                    className="notification-highlight"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "100%",
                      width: "0%",
                      background: "#000",
                      opacity: 0,
                      transition: "all 0.5s ease",
                      zIndex: 0
                    }}
                  />
                  
                  <ListItemAvatar sx={{ zIndex: 1 }}>
                    <Avatar
                      src={notification.sentByPhotoUrl}
                      alt={notification.sentByName}
                      sx={{
                        width: "50px",
                        height: "50px",
                        border: "2px solid #fff",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    sx={{ zIndex: 1 }}
                    primary={
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: "#000",
                          fontFamily: "Velyra",
                          fontSize: "16px",
                          marginBottom: "4px",
                        }}
                      >
                        {notification.sentByName}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#444",
                            fontFamily: "Velyra",
                            fontSize: "14px",
                            lineHeight: 1.4,
                          }}
                        >
                          {notification.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#888",
                            fontFamily: "Velyra",
                            fontSize: "12px",
                            fontWeight: 500,
                            display: "inline-block",
                          }}
                        >
                          {moment(notification.createdAt).fromNow()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              </Box>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default Notifications;