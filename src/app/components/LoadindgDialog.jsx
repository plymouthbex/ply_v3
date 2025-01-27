import React from "react";
import {
  Dialog,
  DialogContent,
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
const LoadingApiDialog = ({
  logo = "/assets/images/logo.png",
  open,
  loading = false,
  message = "",
  error = false,
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
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <JustifyBox p={1}>
          <img src={logo} height={"50px"} alt="" />
        </JustifyBox>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            height: 60,
            width: "100%",
            overflowY: "scroll",
            scrollbarWidth: "none",
          }}
        >
          {loading ? (
            <React.Fragment>
              <AnimatedSpinner size={20} />
              {/* <Tooltip title={message} placement="top">  */}
              <Typography
                variant="h6"
                alignItems={"center"}
                textAlign={"center"}
                sx={{ fontSize: isNonMobile ? 17 : 12 }}
              >
                {message}
              </Typography>
              {/* </Tooltip> */}
            </React.Fragment>
          ) : error ? (
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
      </DialogContent>
    </Dialog>
  );
};

export default LoadingApiDialog;

export const ViewPriceLoadingApiDialog = ({
  logo = "/assets/images/logo.png",
  open,
  loading = false,
  message = "",
  error = false,
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
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <JustifyBox p={1}>
          <img src={logo} height={"50px"} alt="" />
        </JustifyBox>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            height: 60,
            width: "100%",
            overflowY: "scroll",
            scrollbarWidth: "none",
          }}
        >
          {loading ? (
            <React.Fragment>
              <AnimatedSpinner size={20} />
              {/* <Tooltip title={message} placement="top">  */}
              <Typography
                variant="h6"
                alignItems={"center"}
                textAlign={"center"}
                sx={{ fontSize: isNonMobile ? 17 : 12 }}
              >
                {message}
              </Typography>
              {/* </Tooltip> */}
            </React.Fragment>
          ) : error ? (
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
      </DialogContent>
    </Dialog>
  );
};

export const QuoteLoadingApiDialog = ({
  logo = "/assets/images/logo.png",
  open,
  loading = false,
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
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <JustifyBox p={1}>
          <img src={logo} height={"50px"} alt="" />
        </JustifyBox>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            height: 60,
            width: "100%",
            overflowY: "scroll",
            scrollbarWidth: "none",
          }}
        >
          {loading ? (
            <React.Fragment>
              <AnimatedSpinner size={20} />
              {/* <Tooltip title={message} placement="top">  */}
              <Typography
                variant="h6"
                alignItems={"center"}
                textAlign={"center"}
                sx={{ fontSize: isNonMobile ? 17 : 12 }}
              >
                {message}
              </Typography>
              {/* </Tooltip> */}
            </React.Fragment>
          ) : error ? (
            <React.Fragment>
              <Typography
                variant="h6"
                color="error"
                alignItems={"center"}
                textAlign={"center"}
                sx={{ fontSize: isNonMobile ? 17 : 12 }}
              >{`${message}`}</Typography>
              {Actions}{" "}
            </React.Fragment>
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
      </DialogContent>
    </Dialog>
  );
};

export const GenricPriceBookLoadingApiDialog = ({
  logo = "/assets/images/logo.png",
  open,
  loading = false,
  message = "",
  error = false,
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
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <JustifyBox p={1}>
          <img src={logo} height={"50px"} alt="" />
        </JustifyBox>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            height: 60,
            width: "100%",
            overflowY: "scroll",
            scrollbarWidth: "none",
          }}
        >
          {loading ? (
            <React.Fragment>
              <AnimatedSpinner size={20} />
              <Typography
                variant="h6"
                alignItems={"center"}
                textAlign={"center"}
                sx={{ fontSize: isNonMobile ? 17 : 12 }}
              >
                {message}
              </Typography>
              {/* </Tooltip> */}
            </React.Fragment>
          ) : error ? (
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
      </DialogContent>
    </Dialog>
  );
};

export const PriceGroupAlertApiDialog = ({
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
            height: 30,
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

export const QuoteTempAlertApiDialog = ({
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
            height: 30,
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
