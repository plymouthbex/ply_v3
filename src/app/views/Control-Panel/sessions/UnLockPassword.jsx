import {
  Box,
  Button,
  Card,
  Grid,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  flexDirection: "column",
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

const UnlockPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@example.com");

  const handleFormSubmit = () => {
    console.log(email);
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
                UNLOCK PASSWORD 
              </Typography>
            </JustifyBox>

            <ContentBox>
              <form onSubmit={handleFormSubmit}>
                <TextField
                  type="email"
                  name="email"
                  size="small"
                  label="Email"
                  value={email}
                  variant="outlined"
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 3, width: "100%" }}
                />

                <Button
                  fullWidth
                  // type="submit"
                  onClick={() => navigate("/session/unlock-password/unlock-notify")}
                  sx={{
                    backgroundColor: "#164D50",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#164D50", // Custom hover color
                    },
                    // my: 2,
                    width: "100%",
                  }}
                  // loading={loading}
                  variant="contained"
                >
                  Send Request
                </Button>

                <Button
                  fullWidth
                  onClick={() => navigate("/session/signin")}
                  type="submit"
                  color="primary"
                  sx={{
                    // backgroundColor: "#164D50",
                    // color: "white",
                    // "&:hover": {
                    //   backgroundColor: "#164D50", // Custom hover color
                    // },
                    mt: 2,
                    width: "100%",
                  }}
                  // loading={loading}
                  variant="contained"
                >
                  Go Back
                </Button>
              </form>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </StyledRoot>
  );
};

export default UnlockPassword;
