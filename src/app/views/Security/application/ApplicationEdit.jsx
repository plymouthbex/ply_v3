import React, { useEffect, useState } from "react";
import {
  Paper,
  Button,
  Box,
  styled,
  useMediaQuery,
  TextField,
  Checkbox,
  FormControlLabel,
  Stack,
  DialogActions,
} from "@mui/material";
import { Breadcrumb } from "app/components";

// ******************** ICONS ******************** //
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Formik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { getApplicationData } from "app/redux/slice/getSlice";
import { values } from "lodash";
import AlertDialog from "app/components/AlertDialog";
import { applicationPost } from "app/redux/slice/postSlice";
import toast from "react-hot-toast";
import useAuth from "app/hooks/useAuth";

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
  // code: Yup.string()
  //   .min(1, "Code must be at least 1 characters")
  //   .max(15, "Code must be at most 15 characters"),

  // sortOrder: Yup.string()
  //   .min(1, "Sort Order must be at least 1 character")
  //   .max(15, "Sort Order must be at most 15 characters"),

  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters"),
});

// ******************** Price List Edit SCREEN  ******************** //
const ApplicationEdit = () => {
  // ******************** HOOKS AND CONSTANTS ******************** //
  const { user } = useAuth()
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  const dispatch = useDispatch();
  // ******************** LOCAL STATE ******************** //
  const [openAlert, setOpenAlert] = useState(false);
  const [postError, setPostError] = useState(false);
  // ******************** REDUX STATE ******************** //
  const data = useSelector((state) => state.getSlice.applicationFormData);
  const status = useSelector((state) => state.getSlice.applicationStatus);
  const error = useSelector((state) => state.getSlice.applicationError);

  useEffect(() => {
    dispatch(getApplicationData({ ID: state.ID }));
  }, []);

  //==============================SAVE===================================//
  const handleSave = async (values) => {
    const appData = {
      RecordID: data.RecordID,
      ApplicationCode: values.code,
      ApplicationName: values.name,
      SortOrder: values.sequence,
      User: values.user ? 1 : 0,
      Admin: values.admin ? 1 : 0,
      SystemAdmin: values.systemAdmin ? 1 : 0,
      Disable: values.disable ? "Y" : "N",
    };
    const response = await dispatch(applicationPost({ appData }));
    if (response.payload.status === "Y") {
      setOpenAlert(true);
    } else {
      setOpenAlert(true);
      setPostError(true);
      // toast.error("Error occurred while saving data");
    }
  };
  return (
    <Container>
      {status === "fulfilled" && !error ? (
        <Formik
          initialValues={{
            recID: data.RecordID,
            code: data.ApplicationCode,
            name: data.ApplicationName,
            sequence: data.SortOrder,
            user: data.User === 1 ? true : false,
            admin: data.Admin === 1 ? true : false,
            systemAdmin: data.SystemAdmin === 1 ? true : false,
            disable: data.Disable === "Y" ? true : false,
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              if (params.mode === "add" || params.mode === "edit") {
                handleSave(values, setSubmitting);
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
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="breadcrumb">
                <Breadcrumb
                  routeSegments={[
                    { name: "Security" },
                    { name: "Menu", path: "/pages/application" },
                    { name: `${params.mode} Menu Detail` },
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
                    onClick={() => navigate("/pages/security/application")}
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
                  {/* <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="code"
                    name="code"
                    label="AccessID"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    required
                    InputLabelProps={{
                      sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                    }}
                    value={values.code}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.code && Boolean(errors.code)}
                    helperText={touched.code && errors.code}
                    autoFocus
                  /> */}
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="name"
                    name="name"
                    label="Menu Name"
                     autoComplete="off"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    required
                    InputLabelProps={{
                      sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                    }}
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
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
                    InputProps={{
                      inputProps: {
                        style: {
                          textAlign: "left",
                        },
                      },
                    }}
                     autoComplete="off"
                    value={values.sequence}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.sequence && Boolean(errors.sequence)}
                    helperText={touched.sequence && errors.sequence}
                  />
                  <Stack
                    sx={{ gridColumn: "span 2"}}
                    direction="row"
                    gap={2}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          id="user"
                          name="user"
                          checked={values.user}
                          onChange={handleChange}
                          sx={{ height: "10px" }}
                          disabled={
                            params.mode === "delete" || params.mode === "view"
                          }
                        />
                      }
                      label="User"
                    />
                     <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          id="admin"
                          name="admin"
                          checked={values.admin}
                          onChange={handleChange}
                          sx={{ height: "10px" }}
                          disabled={
                            params.mode === "delete" || params.mode === "view"
                          }
                        />
                      }
                      label="Admin"
                    />
                     <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          id="systemAdmin"
                          name="systemAdmin"
                          checked={values.systemAdmin}
                          onChange={handleChange}
                          sx={{ height: "10px" }}
                          disabled={
                            params.mode === "delete" || params.mode === "view"
                          }
                        />
                      }
                      label="System Admin"
                    />
                  </Stack>
                  <Stack
                    sx={{ gridColumn: "span 4", justifyContent: "flex-end" }}
                    direction="column"
                    gap={2}
                  >
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
                  </Stack>
                </Box>
              </Paper>
            </form>
          )}
        </Formik>
      ) : (
        false
      )}
      <AlertDialog
       logo={`data:image/png;base64,${user.logo}`}
        open={openAlert}
        error={postError}
        message={
          postError ? "Something went wrong and please retry":
          params.mode === "add"
            ? "Application added successfully"
            : params.mode === "delete"
              ? "Application Deleted Successfully"
              : "Application updated successfully"
        }
        Actions={
          params.mode === "add" ? (
            <DialogActions>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => navigate("/pages/security/application")}
              >
                Back to Menu
              </Button>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  dispatch(getApplicationData({ ID: 0 }));
                  setOpenAlert(false);
                }}
                autoFocus
              >
                Add New Menu
              </Button>
            </DialogActions>
          ) : (
            <DialogActions>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => navigate("/pages/security/application")}
              >
                Back to Menu
              </Button>
            </DialogActions>
          )
        }
      />
    </Container>
  );
};

export default ApplicationEdit;
