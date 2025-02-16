import React, { useState } from "react";
import { Snackbar, Alert, Button } from "@mui/material";

const CustomSnackbar = ({open,message,severity,closeSnackbar}) => {

  return (

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Positioned at the top center
      >
        <Alert sx={{fontFamily:"Velyra"}} onClose={closeSnackbar} severity={severity} variant="filled">
          {message}
        </Alert>
      </Snackbar>

  );
};

export default CustomSnackbar;
