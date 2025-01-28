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
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Formik } from "formik";
import * as Yup from "yup";
import { values } from "lodash";
import { useDispatch } from "react-redux";
import { ChangePassword, LoginConfig } from "app/redux/slice/postSlice";
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

const validationSchema = Yup.object({
  password: Yup.string()
    .min(15, "Password must be at least 15 characters")
    .required("Password is required"),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

// const ForgotPasswordRoot = styled(JustifyBox)(() => ({
//   background: '#1A2038',
//   minHeight: '100vh !important',
//   '& .card': {
//     maxWidth: 800,
//     margin: '1rem',
//     borderRadius: 12,
//   },
// }));

const ResetPassword = (values) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const state = location.state || {};
  const chagepassword = async (values) => {
    const res = await dispatch(
      ChangePassword({
        UserID: state.id,
        OldPassword: values.password,
        NewPassword: values.password,
      })
    );

    if (res.payload.status == "Y") {
      navigate("/session/unlock-password/notify'", {
        state: { message: res.payload.message, error: false },
      });
    } else {
      navigate("/session/unlock-password/notify'", {
        state: { message: res.payload.message, error: true },
      });
    }
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
              <Formik
                initialValues={{
                  password: "",
                  confirmpassword: "",
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                  setTimeout(() => {
                    chagepassword(values);
                  }, 400);
                }}
              >
                {({
                  errors,
                  touched,
                  handleBlur,
                  handleChange,
                  isSubmitting,
                  values,
                  handleSubmit,
                  setFieldValue,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      type="password" // Correct type for password
                      name="password"
                      size="small"
                      label="New Password"
                      variant="outlined"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      sx={{ mb: 3, width: "100%" }}
                    />
                    <TextField
                      type="password" // Correct type for password
                      name="confirmpassword"
                      size="small"
                      label="Confirm Password"
                      variant="outlined"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.confirmpassword}
                      error={
                        touched.confirmpassword &&
                        Boolean(errors.confirmpassword)
                      }
                      helperText={
                        touched.confirmpassword && errors.confirmpassword
                      }
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
                      type="submit"
                      variant="contained"
                      // onClick={() =>
                      //   navigate("/session/unlock-password/password-notify")
                      // }
                    >
                      Save Password
                    </Button>
                  </form>
                )}
              </Formik>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </StyledRoot>
  );
};

export default ResetPassword;
