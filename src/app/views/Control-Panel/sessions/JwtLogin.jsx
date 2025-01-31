import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Card,
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
import useSettings from "app/hooks/useSettings";
import toast from "react-hot-toast";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoginConfig } from "app/redux/slice/postSlice";
import { useDispatch } from "react-redux";

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
  email: "",
  password: "",
  remember: true,
};

// form field validation schema
const validationSchema = Yup.object().shape({
  email: Yup.string().email().required("Username is required!"),
  password: Yup.string()
    .min(15, "Password must be 15 character length")
    .required("Password is required!"),
});

export default function JwtLogin() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);
  const { settings } = useSettings();
  const dispatch = useDispatch();
  const { login } = useAuth();

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await login(values.email, values.password);
      if(response.LoginType === "Y"){
        navigate("/session/reset-password",{state:{id:response.id}});
        return
      }else{
        if(response.Islock === "Y"){
          setShowUnlock(true)
        }
      }
      // return
      navigate("/home", {
        state: {
          name: "home",
          path: "/home",
          accessID: "PPB001",
          fav: false,
          RecordID: 0,
        },
      });
    } catch (e) {
      if(e.response.data.Islock === "Y"){
      setShowUnlock(true)
    }
      toast.error(e.response.data.message);
      setLoading(false);
    }
  };
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };


  const forgot = async (values,type) => {
  const res = await dispatch(
      LoginConfig({
        EmailID: values.email,
        Type:type ,
      })
    )

    if(res.payload.status == "Y"){
      navigate("/session/unlock-password/forgot-notify'",{state:{message:res.payload.message,error:false}})
    }else{
      navigate("/session/unlock-password/forgot-notify'",{state:{message:res.payload.message,error:true}})
    }
  }
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
                Price Book Printing Portal
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
                  <form onSubmit={handleSubmit} autoComplete="off">
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      name="email"
                      label="Login(Valid EmailID)"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={handleChange}
                      helperText={touched.email && errors.email}
                      error={Boolean(errors.email && touched.email)}
                      sx={{ mb: 3 }}
                      autoComplete="off"
                    />

                    <TextField
                      autoComplete="off"
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

                    <LoadingButton
                      type="submit"
                      sx={{
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
                        <Typography
                          // to="/session/reset-password"
                          style={{
                            color: theme.palette.primary.main,
                            cursor: "pointer",
                          }}
                          onClick={() =>forgot(values,"Forget")}
                        >
                          Forgot password ?
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "flex-end",
                        }}
                      >
                        {showUnlock && (
                          <Typography
                          onClick={() =>forgot(values,"Unlock")}
                            style={{
                              color: theme.palette.primary.main,
                              cursor: "pointer",
                            }}
                          >
                            Unlock ?
                          </Typography>
                        )}
                      </Box>
                    </Box>
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
