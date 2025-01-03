import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Card,
  Checkbox,
  Grid,
  TextField,
  Box,
  styled,
  useTheme,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Formik } from "formik";
import * as Yup from "yup";
import useAuth from "app/hooks/useAuth";
import { Paragraph } from "app/components/Typography";
import useSettings from "app/hooks/useSettings";
import { themeColors } from "app/components/baseTheme/themeColors";
import { FaBold } from "react-icons/fa6";
import { Visibility, VisibilityOff } from "@mui/icons-material";
// STYLED COMPONENTS
const FlexBox = styled(Box)(() => ({
  display: "flex",
}));

const ContentBox = styled("div")(() => ({
  height: "100%",
  padding: "32px",
  position: "relative",
  background: "rgba(0, 0, 0, 0.01)",
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

// initial login credentials
const initialValues = {
  email: "safin",
  password: "dummyPass",
  remember: true,
};

// form field validation schema
const validationSchema = Yup.object().shape({
  email: Yup.string().required("username is required!"),
  password: Yup.string()
    .min(6, "Password must be 6 character length")
    .required("Password is required!"),
  // email: Yup.string()
  //   .email("Invalid Email address")
  //   .required("Email is required!"),
});

export default function JwtLogin() {
  const theme = useTheme();
  // const colors=themeColors;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { settings } = useSettings();

  const { login } = useAuth();

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      // console.log("🚀 ~ handleFormSubmit ~ login(values.email, values.password):", login(values.email, values.password))
      await login(values.email, values.password);
      navigate("/control-panel/home", {
        state: {
          name: "home",
          path: "/control-panel/home",
          accessID: "PPB001",
          fav: false,
          RecordID: 0,
        },
      });
    } catch (e) {
      alert("Invalid");

      setLoading(false);
    }
  };
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <StyledRoot>
      <Card className="card">
        <Grid container>
          <Grid item xs={12}>
            <div className="img-wrapper">
              <img
                src="/assets/images/logo.png"
                width="150px"
                height={"150px"}
                alt=""
              />
              <Typography
                sx={{
                  fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.75rem" }, // Responsive font size
                  textAlign: "center",
                  color: "#dd2c00",
                  marginTop: 3,
                }}
              >
                {settings.appCaptionConfig.loginTitle}
              </Typography>
            </div>
          </Grid>

          <Grid item xs={12}>
            <ContentBox>
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="email"
                      label="User"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={handleChange}
                      helperText={touched.email && errors.email}
                      error={Boolean(errors.email && touched.email)}
                      sx={{ mb: 3 }}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.password}
                      onChange={handleChange}
                      helperText={touched.password && errors.password}
                      error={Boolean(errors.password && touched.password)}
                      sx={{ mb: 1.5 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <FlexBox justifyContent="space-between">
                      <FlexBox gap={1}>
                        {/* <Checkbox
                          size="small"
                          name="remember"
                          onChange={handleChange}
                          checked={values.remember}
                          sx={{ padding: 0 }}
                        /> */}

                        {/* <Paragraph>Remember Me</Paragraph> */}
                      </FlexBox>

                      {/* <NavLink
                        to="/session/forgot-password"
                        style={{ color: theme.palette.primary.main }}
                      >
                        Forgot password?
                      </NavLink>
                      <NavLink
                        to="/session/unlock-password"
                        style={{ color: theme.palette.primary.main }}
                      >
                        Unlock password?
                      </NavLink> */}
                    </FlexBox>

                    <LoadingButton
                      type="submit"
                      sx={{
                        // backgroundColor: "#164D50",
                        // color: "white",
                        "&:hover": {
                          backgroundColor: theme.palette.secondary.light, // Custom hover color
                        },
                        color: theme.palette.secondary.contrastText,
                        bgcolor: theme.palette.secondary.light,

                        fontWeight: "bold",
                        my: 2,
                        width: "100%",
                      }}
                      loading={loading}
                      variant="contained"
                    >
                      Login
                    </LoadingButton>
                    {/* <FlexBox gap={5}> */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: "10px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "flex-end",
                        }}
                      >
                        <NavLink
                          to="/session/forgot-password"
                          style={{ color: theme.palette.primary.main }}
                        >
                          Forgot password?
                        </NavLink>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "flex-end",
                        }}
                      >
                        <NavLink
                          to="/session/unlock-password"
                          style={{ color: theme.palette.primary.main }}
                        >
                          Unlock password?
                        </NavLink>
                      </Box>
                    </Box>

                    {/* </FlexBox> */}

                    {/* <Paragraph>
                      Don't have an account?
                      <NavLink
                        to="/session/signup"
                        style={{ color: theme.palette.primary.main, marginLeft: 5 }}>
                        Register
                      </NavLink>
                    </Paragraph> */}
                  </form>
                )}
              </Formik>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </StyledRoot>
  );
}
