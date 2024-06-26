import { Snackbar, Alert} from "@mui/material";
import { useState } from "react";

const ErrorAlert = (props) => {
  const [open, setOpen] = useState(true);
  const vertical = "top";
  const horizontal = "center";
  

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    props.clearError()
  };

  

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical, horizontal }}
     
    >
      <Alert onClose={handleClose} severity="error">
        {props.message}
      </Alert>
    </Snackbar>
  );
};

export default ErrorAlert;
