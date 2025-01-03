import React, { seState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Typography,
  Box,
  styled,
} from "@mui/material";

const FlexBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
}));

const AnimatedSpinner = styled(CircularProgress)({
  animation: "rotate 1s linear infinite",
  "@keyframes rotate": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
});

const JustifyBox = styled(FlexBox)(() => ({
  justifyContent: "center",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
}));
const AlertDialog = ({ open, onClose, message = "", error = false,Actions }) => {
  return (
    <Dialog open={open}>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <JustifyBox p={2}>
          <img
            src="/assets/images/logo.png"
            // width="150px"
            height={"60px"}
            alt=""
          />
          <Typography
            sx={{
              textAlign: "center",
              color: "#dd2c00",
              fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.75rem" },
            }}
          ></Typography>
        </JustifyBox>
        {error ? (
          <Typography color="error">{`Error: Please Fill The Data`}</Typography>
        ) : (
          <Typography
            alignItems={"center"}
            textAlign={"center"}
            variant="h6"
            sx={{ color: "#164D50" }}
          >
            {message}
          </Typography>
        )}
      </DialogContent>
     {Actions}
    </Dialog>
  );
};

export default AlertDialog;



export const MessageAlertDialog = ({ open, onClose, message = "",tittle ='', error = false,Actions }) => {
  return (
    <Dialog open={open} >
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minWidth:300
        }}
      >
        <JustifyBox p={2}>

          <img
            src="/assets/images/logo.png"
            // width="150px"
            height={"60px"}
            alt=""
          />
        <Typography
            sx={{
              textAlign: "center",
              color: "#dd2c00",
              fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.75rem" },
            }}
          >{tittle}</Typography>
        </JustifyBox>

          <Typography
            alignItems={"center"}
            textAlign={"center"}
            variant="h6"
            // sx={{ color: "#164D50" }}
          >
            {message}
          </Typography>
      </DialogContent>
     {Actions}
    </Dialog>
  );
};
