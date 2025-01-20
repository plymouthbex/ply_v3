import React, { useEffect } from "react";
import {
  Paper,
  Button,
  Box,
  styled,
  useMediaQuery,
  FormControlLabel,
  TextField,
  Typography,
  Checkbox,
  FormControl,
  Stack,
  DialogActions,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Breadcrumb } from "app/components";
import {
  dataGridHeight,
  dataGridPageSize,
  dataGridpageSizeOptions,
  dataGridRowHeight,
  dataGridHeaderFooterHeight,
} from "app/utils/constant";
import { Add, MailOutline } from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Formik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { useDispatch, useSelector } from "react-redux";
import { getCompanyListView } from "app/redux/slice/listviewSlice";
import MailIcon from "@mui/icons-material/Mail";
import * as Yup from "yup";
import { useTheme } from "@emotion/react";
import { getmailConfig } from "app/redux/slice/getSlice";
// ********************* STYLED COMPONENTS ********************* //
const Container = styled("div")(({ theme }) => ({
  margin: "15px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "10px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  smtpHost: Yup.string().required("SMTP Host is required"),
  smtpPort: Yup.number().required("SMTP Port is required").positive().integer(),
});

// ********************* ITEMS SCREEN LISTVIEW ********************* //
const MailForm = () => {
  // ********************* HOOKS AND CONSTANTS ********************* //
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const state = location.state;
  // ********************* LOCAL STATE ********************* //

  // ********************* REDUX STATE ********************* //

  const status = useSelector((state) => state.getSlice.getMailConfigStatus);
  const error = useSelector((state) => state.getSlice.getMailConfigError);
  const data = useSelector((state) => state.getSlice.getMailConfigData);
  console.log("🚀 ~ data:", data);
  const loading = useSelector((state) => state.getSlice.getMailConfigLoading);
  // ********************* COLUMN AND ROWS ********************* //

  // ********************* TOOLBAR ********************* //

  useEffect(() => {
    dispatch(getmailConfig({ CompanyID: state.id }));
  }, []);
  return (
    <Container>
      <Formik
        initialValues={{
          email: data.FromEmailID,
          emailPassword: data.AuthorizedPassword,
          confirmPassword: data.AuthorizedPassword,
          smtpHost: data.SMPTServer,
          smtpPort: data.SMPTPortNumber,
          ssl: data.SSLFlag,
          cc: data.CCEmailIDs,
          subject: data.Subject,
          content: data.Content,
        }}
        // validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={(values, { setSubmitting }) => {
          //   setTimeout(() => {
          // if (params.mode === "delete") {
          //   setIsDelete(true);
          // }
          //     if (params.mode === "add" || params.mode === "edit") {
          //       handleSave(values, setSubmitting);
          //       fnpostImage();
          //     }
          //   }, 400);
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
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Breadcrumb
                  routeSegments={[
                    { name: "Security" },
                    { name: "Company", path: "/pages/security/company" },
                    { name: `Mail Configuration` },
                  ]}
                />
                <Stack direction="row" gap={1}>
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
                  >
                    {params.mode === "delete" ? "Confirm" : "Save"}
                  </Button>
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    startIcon={<ArrowBackIcon size="small" />}
                    onClick={() => navigate("/pages/security/company")}
                  >
                    Back
                  </Button>
                </Stack>
              </Stack>
            </div>

            {status === "fulfilled" && !error ? (
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
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    autoComplete="new-email"
                  />

                  <TextField
                    autoComplete="new-password"
                    fullWidth
                    variant="outlined"
                    type="password"
                    id="emailPassword"
                    name="emailPassword"
                    label="Password"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    required
                    InputLabelProps={{
                      sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                    }}
                    value={values.emailPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.emailPassword && !!errors.emailPassword}
                    helperText={touched.emailPassword && errors.emailPassword}
                  />

                  <TextField
                    autoComplete="off"
                    fullWidth
                    variant="outlined"
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirm Password"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    required
                    InputLabelProps={{
                      sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                    }}
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      !!touched.confirmPassword && !!errors.confirmPassword
                    }
                    helperText={
                      touched.confirmPassword && errors.confirmPassword
                    }
                  />

                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="smtpHost"
                    name="smtpHost"
                    label="SMTP Host"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    required
                    InputLabelProps={{
                      sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                    }}
                    value={""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.smtpHost && !!errors.smtpHost}
                    helperText={touched.smtpHost && errors.smtpHost}
                    autoComplete="off"
                  />

                  <TextField
                    fullWidth
                    variant="outlined"
                    type="number"
                    id="smtpPort"
                    name="smtpPort"
                    label="SMTP Port"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    required
                    InputLabelProps={{
                      sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                    }}
                    value={values.smtpPort}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.smtpPort && !!errors.smtpPort}
                    helperText={touched.smtpPort && errors.smtpPort}
                    autoComplete="off"
                  />

                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="ssl"
                    name="ssl"
                    label="SSL"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    value={values.ssl}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.ssl && !!errors.ssl}
                    helperText={touched.ssl && errors.ssl}
                    autoComplete="off"
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="ssl"
                    name="ssl"
                    label="SSL"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    value={values.ssl}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.ssl && !!errors.ssl}
                    helperText={touched.ssl && errors.ssl}
                    autoComplete="off"
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="ssl"
                    name="ssl"
                    label="SSL"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    value={values.ssl}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.ssl && !!errors.ssl}
                    helperText={touched.ssl && errors.ssl}
                    autoComplete="off"
                  />

                  <TextField
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    id="cc"
                    label="CC"
                    variant="outlined"
                    type="email"
                    fullWidth
                    name="cc"
                    value={values.cc}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.cc && Boolean(errors.cc)}
                    helperText={touched.cc && errors.cc}
                    autoComplete="off"
                  />
                  <TextField
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    id="subject"
                    label="Subject"
                    variant="outlined"
                    fullWidth
                    name="subject"
                    value={values.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    InputLabelProps={{
                      sx: {
                        "& .MuiInputLabel-asterisk": { color: "red" },
                      },
                    }}
                    autoComplete="off"
                  />
                  <TextField
                    size="small"
                    sx={{ gridColumn: "span 4" }}
                    id="content"
                    label="Content"
                    variant="outlined"
                    fullWidth
                    multiline
                    minRows={5}
                    name="content"
                    value={values.content}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="off"
                  />
                </Box>
              </Paper>
            ) : (
              false
            )}
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default MailForm;
