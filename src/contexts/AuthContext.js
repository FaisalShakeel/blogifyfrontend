import React, { createContext, useState, useEffect } from "react";
import axios from "axios"; // To make API requests
import { CircularProgress,Box } from "@mui/material";

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user info
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch user info from the API
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/auth/user-info`, { withCredentials: true });

      if (response.data.success) {
        console.log("User Info", response.data);
        setUser(response.data.user); // Store user info in state
      } else {
        setUser(null); // Clear user info if not authenticated
      }
    } catch (error) {
      console.error("Error fetching user info:", error.message);
      setUser(null); // Clear user info on error
    }
    setLoading(false); // Set loading false only after request completes
  };

  // Run fetchUserInfo when the component mounts
  useEffect(() => {
    fetchUserInfo();
  }, []);

  // Context value to provide
  const value = { user, setUser, loading };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <Box sx={{height:"100vh",width:"100%",display:"flex",justifyContent:"center",alignItems:"center"}}><CircularProgress sx={{height:"14px",width:"14px",color:'black'}} thickness={8}/></Box> : children} {/* Show loading indicator */}
    </AuthContext.Provider>
  );
};
