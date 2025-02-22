import React, { seState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Typography,
  Box,
  styled,
  useMediaQuery,
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
const AlertDialog = ({
  logo = "/assets/images/logo.png",
  open,
  message = "",
  error = false,
  Actions,
}) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  return (
    <Dialog open={open}>
      <DialogContent
        sx={{
          width: isNonMobile ? 450 : "80vw",
          minHeight: 160,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          padding: "10px 10px",
          justifyContent: "space-between",
          overflowX: "hidden",
        }}
      >
        <JustifyBox p={1}>
          <img src={logo} height={"50px"} alt="" />
        </JustifyBox>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            height: 45,
            width: "100%",
            overflowY: "scroll",
            scrollbarWidth: "none",
          }}
        >
          {error ? (
            <Typography
              variant="h6"
              color="error"
              alignItems={"center"}
              textAlign={"center"}
              sx={{ fontSize: isNonMobile ? 17 : 12 }}
            >{`${message}`}</Typography>
          ) : (
            <Typography
              variant="h6"
              alignItems={"center"}
              textAlign={"center"}
              sx={{ color: "#164D50", fontSize: isNonMobile ? 17 : 12 }}
            >
              {message}
            </Typography>
          )}
        </Box>
        {Actions}
      </DialogContent>
    </Dialog>
  );
};

export default AlertDialog;

export const MessageAlertDialog = ({
  logo = "/assets/images/logo.png",
  open,
  message = "",
  error = false,
  Actions,
  tittle,
}) => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  return (
    <Dialog open={open}>
      <DialogContent
        sx={{
          width: isNonMobile ? 450 : "80vw",
          minHeight: 160,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          padding: "10px 10px",
          justifyContent: "space-between",
          overflowX: "hidden",
        }}
      >
        <JustifyBox p={1}>
          <img src={logo} height={"50px"} alt="" />
        </JustifyBox>

        <Typography
          variant="h6"
          color={error ? "error":"black"}
          alignItems={"center"}
          textAlign={"center"}
          sx={{ fontSize: isNonMobile ? 17 : 12 }}
        >
          {message}
        </Typography>
        {Actions}
      </DialogContent>
    </Dialog>
  );
};
