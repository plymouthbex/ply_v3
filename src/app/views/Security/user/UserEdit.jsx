import React, { useEffect, useState } from "react";
import {
  Paper,
  Button,
  Box,
  styled,
  useTheme,
  useMediaQuery,
  Checkbox,
  TextField,
  FormControlLabel,
  Stack,
  Autocomplete,
  DialogActions,
  DialogTitle,
  DialogContent,
  Dialog,
  FormControl,
  Typography,
} from "@mui/material";
import { Breadcrumb } from "app/components";
import logo from "../../../../assets/plylogo.png";

// ******************** ICONS ******************** //
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Formik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import * as Yup from "yup";
import { getUserData } from "app/redux/slice/getSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  CompanyFormikCompanyOptimizedAutocomplete,
  FormikCompanyOptimizedAutocomplete,
  FormikOptimizedAutocomplete,
  FormikRungroupOptimizedAutocomplete,
  FormikUserGroupOptimizedAutocomplete,
  PGOptimizedAutocomplete,
  UserGroupOptimizedAutocomplete,
  UserOptimizedAutocomplete,
} from "app/components/SingleAutocompletelist";
import useAuth from "app/hooks/useAuth";
import { deleteUserData, userPost } from "app/redux/slice/postSlice";
import AlertDialog, { MessageAlertDialog } from "app/components/AlertDialog";

// ******************** STYLED COMPONENTS ******************** //
const Container = styled("div")(({ theme }) => ({
  margin: "15px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "10px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
}));

// ******************** Validation Schema ******************** //
const validationSchema = Yup.object({
  code: Yup.string()
    .min(1, "Code must be at least 1 characters")
    .max(15, "Code must be at most 15 characters"),

  email: Yup.string()
    .email("Invalid email format")
    .max(30, "Email must be at most 30 characters"),

  sequence: Yup.string()
    .min(1, "Sequence must be at least 1 character")
    .max(15, "Sequence must be at most 15 characters"),

  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must be at most 20 characters"),

  userCompany: Yup.string()
    .min(3, "User Company must be at least 3 characters")
    .max(50, "User Company must be at most 50 characters"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

// ******************** Price List Edit SCREEN  ******************** //
const UserEdit = () => {
  // ******************** HOOKS AND CONSTANTS ******************** //
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const state = location.state;
  const { user } = useAuth();
  // ******************** LOCAL STATE ******************** //

  const [postError, setPostError] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [UserID, setSelectUserID] = useState(null);
  console.log("🚀 ~ UserEdit ~ UserID:", UserID);
  // ******************** REDUX STATE ******************** //
  const data = useSelector((state) => state.getSlice.userFormData);
  console.log("🚀 ~ UserEdit ~ data:", data);

  const status = useSelector((state) => state.getSlice.userStatus);

  const error = useSelector((state) => state.getSlice.userError);

  ///===========API CALL GET============================//
  useEffect(() => {
    dispatch(getUserData({ ID: state.ID }));
  }, []);

  //=======================================SAVE================================//

  const HandleSave = async (values) => {
    if (params.mode === "delete") {
      setOpenDialog(true);
    }
    const userData = {
      recordID: data.RecordID,
      firstname: values.firstname,
      lastname: values.lastname,
      password: values.password,
      userCode: values.code,
      sortOrder: values.sequence,
      disable: values.disable ? "Y" : "N",
      email: values.email,
      phone: values.mobilenumber,
      userGroup: JSON.stringify(values.userGroup),
      rungroup: JSON.stringify(values.runGroup),
      company: JSON.stringify(values.defaultCompany),
    };
    console.log("🚀 ~ HandleSave ~ userData:", userData);
    //  return;
    const response = await dispatch(userPost({ userData }));
    console.log("🚀 ~ HandleSave ~ response:", response);
    if (response.payload.status === "Y") {
      setOpenAlert(true);
    } else {
      setOpenAlert(true);
      setPostError(true);
      // toast.error("Error occurred while saving data");
    }
  };

  // ******************** DELETE ******************** //

  const userDeleteFn = async (values, setSubmitting) => {
    try {
      dispatch(deleteUserData({ ID: data.RecordID })).then((response) => {
        if (response.payload.status === "Y") {
          setOpenAlert(true);
        } else {
          setOpenAlert(true);
          setPostError(true);
        }
      });
      // setSubmitting(false);
    } catch (e) {
      console.log("🚀 ~ priceListSaveFn ~ e:", e);
    }
  };

  return (
    <Container>
      {status === "fulfilled" && !error ? (
        <Formik
          initialValues={{
            code: data.UserCode,
            password: data.Password,
            confirmpassword: data.Password,
            firstname: data.Firstname,
            lastname: data.Lastname,
            email: data.Email,
            mobilenumber: data.Phone,
            sequence: data.SortOrder,
            disable: data.Disable === "Y" ? true : false,
            defaultCompany: JSON.parse(data.Company),
            runGroup: JSON.parse(data.Rungroup),
            userGroup: JSON.parse(data.UserGroup),
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              if (params.mode === "delete") {
                setIsDelete(true);
              }
              if (params.mode === "add" || params.mode === "edit") {
                HandleSave(values, setSubmitting);
              }
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
              <div className="breadcrumb">
                <Breadcrumb
                  routeSegments={[
                    { name: "Security" },
                    { name: "User", path: "/pages/user" },
                    { name: `${params.mode} User Detail` },
                  ]}
                />
                <Stack direction={"row"} gap={1}>
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    startIcon={
                      params.mode === "delete" ? (
                        <DeleteIcon color="error" size="small" />
                      ) : (
                        <SaveIcon size="small" />
                      )
                    }
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {params.mode === "delete" ? "Confirm" : "Save"}
                  </Button>
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    startIcon={<ArrowBackIcon size="small" />}
                    onClick={() => navigate("/pages/security/user")}
                  >
                    Back
                  </Button>
                </Stack>
              </div>

              <Paper sx={{ width: "100%", mb: 2 }}>
                <Box
                  display="grid"
                  gap="20px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{
                    "& > div": {
                      gridColumn: isNonMobile ? undefined : "span 4",
                    },
                    padding: "10px",
                  }}
                >
                  {/* <Stack sx={{ gridColumn: "span 2" }} direction="column" gap={2}> */}
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="code"
                    name="code"
                    label="Code"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    disabled={params?.mode === "delete"}
                    required
                    value={values.code}
                    InputLabelProps={{
                      sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                    }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.code && Boolean(errors.code)}
                    helperText={touched.code && errors.code}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="firstname"
                    name="firstname"
                    label="First Name"
                    required
                    InputLabelProps={{
                      sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                    }}
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    disabled={params?.mode === "delete"}
                    value={values.firstname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.firstname && Boolean(errors.firstname)}
                    helperText={touched.firstname && errors.firstname}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="lastname"
                    name="lastname"
                    label="Last Name"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    disabled={params?.mode === "delete"}
                    value={values.lastname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.lastname && Boolean(errors.lastname)}
                    helperText={touched.lastname && errors.lastname}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="mobilenumber"
                    name="mobilenumber"
                    label="Mobile"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    disabled={params?.mode === "delete"}
                    value={values.mobilenumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.mobilenumber && Boolean(errors.mobilenumber)}
                    helperText={touched.mobilenumber && errors.mobilenumber}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="email"
                    id="email"
                    name="email"
                    label="Email"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    required
                    InputLabelProps={{
                      sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                    }}
                    value={values.email}
                    disabled={params?.mode === "delete"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />

                  <TextField
                    fullWidth
                    variant="outlined"
                    type="password"
                    id="password"
                    name="password"
                    label="Password"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    disabled={params?.mode === "delete"}
                    required
                    InputLabelProps={{
                      sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                    }}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="password"
                    id="confirmpassword"
                    name="confirmpassword"
                    label="Confirm Password"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    disabled={params?.mode === "delete"}
                    required
                    value={values.confirmpassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.confirmpassword && Boolean(errors.confirmpassword)
                    }
                    helperText={
                      touched.confirmpassword && errors.confirmpassword
                    }
                    InputLabelProps={{
                      sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                    }}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="sequence"
                    name="sequence"
                    label="Sequence"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    disabled={params?.mode === "delete"}
                    value={values.sequence}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.sequence && Boolean(errors.sequence)}
                    helperText={touched.sequence && errors.sequence}
                  />
                  <FormikUserGroupOptimizedAutocomplete
                    sx={{ gridColumn: "span 2" }}
                    disabled={
                      params.mode === "delete" || params.mode === "view"
                    }
                    name="userGroup"
                    id="userGroup"
                    value={values.userGroup}
                    onChange={(event, newValue) => {
                      setFieldValue("userGroup", newValue);
                      setSelectUserID(newValue ? newValue.RecordID : null); // Handle null cases gracefully
                    }}
                    label="User Group"
                    url={`${process.env.REACT_APP_BASE_URL}UserGroup/UserGroupListView?CompanyCode=${user.companyCode}`}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        id="disable"
                        name="disable"
                        checked={values.disable}
                        onChange={handleChange}
                        sx={{ height: "10px" }}
                        disabled={
                          params.mode === "delete" || params.mode === "view"
                        }
                      />
                    }
                    label="Disable"
                  />
                </Box>
                <Box
                  display="grid"
                  gap="20px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{
                    "& > div": {
                      gridColumn: isNonMobile ? undefined : "span 4",
                    },
                    padding: "10px",
                  }}
                >
                  <FormControl
                    sx={{
                      gridColumn: isNonMobile ? "span 4" : "span 4",
                      gap: "10px",
                    }}
                  >
                    <Typography fontSize={"14px"} fontWeight={"bold"}>
                      Settings
                    </Typography>
                  </FormControl>

                  <FormikCompanyOptimizedAutocomplete
                    sx={{ gridColumn: "span 2" }}
                    disabled={
                      params.mode === "delete" || params.mode === "view"
                        ? true
                        : false
                    }
                    name="defaultCompany"
                    id="defaultCompany"
                    value={values.defaultCompany}
                    onChange={(event, newValue) =>
                      setFieldValue("defaultCompany", newValue)
                    }
                    label="Default Company"
                    url={`${process.env.REACT_APP_BASE_URL}Company`}
                  />

                  <FormikRungroupOptimizedAutocomplete
                    sx={{ gridColumn: "span 2" }}
                    disabled={
                      params.mode === "delete" || params.mode === "view"
                        ? true
                        : false
                    }
                    name="runGroup"
                    id="runGroup"
                    value={values.runGroup}
                    onChange={(event, newValue) =>
                      setFieldValue("runGroup", newValue)
                    }
                    label="Run Group"
                    url={`${process.env.REACT_APP_BASE_URL}PriceBookDirectory/GetRungroupByCompany?CompanyCode=${user.companyCode}`}
                  />
                </Box>
              </Paper>
              <MessageAlertDialog
                open={isDelete}
                tittle={"Delete"}
                message={`Are you sure you want to delete?`}
                Actions={
                  <DialogActions>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => {
                        setIsDelete(false);
                        userDeleteFn();
                      }}
                    >
                      Yes
                    </Button>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => {
                        setIsDelete(false);
                        // setSubmitting(false);
                      }}
                      autoFocus
                    >
                      No
                    </Button>
                  </DialogActions>
                }
              />
            </form>
          )}
        </Formik>
      ) : (
        false
      )}
      <AlertDialog
        open={openAlert}
        error={postError}
        message={
          params.mode === "add"
            ? "User added successfully"
            : params.mode === "delete"
              ? "User Deleted Successfully"
              : "User updated successfully"
        }
        Actions={
          params.mode === "add" ? (
            <DialogActions>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => navigate("/pages/security/user")}
              >
                Back to User
              </Button>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  dispatch(getUserData({ ID: 0 }));
                  setOpenAlert(false);
                }}
                autoFocus
              >
                Add New User
              </Button>
            </DialogActions>
          ) : (
            <DialogActions>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => navigate("/pages/security/user")}
              >
                Back to User
              </Button>
            </DialogActions>
          )
        }
      />
    </Container>
  );
};

export default UserEdit;
