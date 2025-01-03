import React from "react";
import {
  Box,
  Button,
  Card,
  Grid,
  styled,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const FlexBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
}));

const JustifyBox = styled(FlexBox)(() => ({
  justifyContent: "center",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
}));
const StyledRoot = styled("div")(() => ({
  backgroundImage: `url(/assets/images/meat1.jpg)`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  // backgroundColor: "#1A2038",
  backgroundSize: "cover", // Cover the whole container
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
  minHeight: "100% !important",
  "& .card": {
    maxWidth: 400,
    minHeight: 400,
    margin: "1rem",
    display: "flex",
    borderRadius: 12,
    alignItems: "center",
  },

  ".img-wrapper": {
    height: "100%",
    minWidth: 320,
    display: "flex",
    padding: "2rem 2rem 1rem 2rem",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
}));
const ContentBox = styled(Box)(({ theme }) => ({
  padding: 32,
  background: theme.palette.background.default,
}));

// const ForgotPasswordRoot = styled(JustifyBox)(() => ({
//   background: '#1A2038',
//   minHeight: '100vh !important',
//   '& .card': {
//     maxWidth: 800,
//     margin: '1rem',
//     borderRadius: 12,
//   },
// }));

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@example.com");

  const handleFormSubmit = () => {
    console.log(email);
  };

  const handleClick = () => {
    Swal.fire({
      title: "Password has been changed Successfully",
      icon: "success",
      confirmButtonColor: "#164D50",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/session/signin");
      }
    });
  };

  return (
    <StyledRoot>
      <Card className="card">
        <Grid container>
          <Grid item xs={12}>
            <JustifyBox p={2}>
              {/* <img width="300" src="/assets/illustrations/dreamer.svg" alt="" /> */}
              <img
                src="/assets/images/logo.png"
                width="150px"
                height={"150px"}
                alt=""
              />
              <Typography
                sx={{
                  textAlign: "center",
                  color: "#dd2c00",
                  fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.75rem" },
                }}
              >
                Change password
              </Typography>
            </JustifyBox>

            <ContentBox>
              <form onSubmit={handleFormSubmit}>
                <TextField
                  type="number"
                  name="otp"
                  size="small"
                  label="Enter OTP"
                  variant="outlined"
                  // onChange={(e) => setOtp(e.target.value)} // Assuming you have a setOtp state handler
                  sx={{ mb: 3, width: "100%" }}
                />
                <TextField
                  type="password" // Correct type for password
                  name="newPassword"
                  size="small"
                  label="New Password"
                  variant="outlined"
                  // onChange={(e) => setNewPassword(e.target.value)} // Assuming you have a setNewPassword state handler
                  sx={{ mb: 3, width: "100%" }}
                />
                <TextField
                  type="password" // Correct type for password
                  name="confirmPassword"
                  size="small"
                  label="Confirm Password"
                  variant="outlined"
                  // Assuming you have a setConfirmPassword state handler
                  sx={{ mb: 3, width: "100%" }}
                />

                <Button
                  sx={{
                    backgroundColor: "#164D50",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#164D50", // Custom hover color
                    },
                    // my: 2,
                    width: "100%",
                  }}
                  variant="contained"
                  onClick={() => navigate("/session/unlock-password/password-notify")}
                >
                  Save Password
                </Button>
                {/* <Button
       sx={{
        backgroundColor: "#164D50",
        color: "white",
        "&:hover": {
          backgroundColor: "#164D50", // Custom hover color
        },
        // my: 2,
        width:'100%'
      }}
      variant="contained"
        onClick={()=>}
      >
        Save Password
      </Button> */}
              </form>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </StyledRoot>
  );
};

export default ResetPassword;
