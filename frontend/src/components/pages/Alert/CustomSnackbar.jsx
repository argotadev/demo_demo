import React from "react";
import { Snackbar, Alert } from "@mui/material";

const CustomSnackbar = ({ snackbarConfig = {}, handleSnackbarClose }) => {
  return (
    <Snackbar
      open={snackbarConfig.open || false}
      autoHideDuration={6000}
      onClose={handleSnackbarClose}
    >
      <Alert severity={snackbarConfig.severity || "info"}>
        {snackbarConfig.message || "Ocurrió un error"}
      </Alert>
    </Snackbar>
  );
};


export default CustomSnackbar;
