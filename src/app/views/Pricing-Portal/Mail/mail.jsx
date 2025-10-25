import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Icon,
  IconButton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import { H5 } from "app/components/Typography";
import { SimpleCard } from "app/components";
import { themeShadows } from "app/components/baseTheme/themeColors";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "app/hooks/useAuth";
import { CompanyMailSend, runGroupMailData } from "app/redux/slice/postSlice";
import { PriceGroupAlertApiDialog } from "app/components/LoadindgDialog";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { getCompanyMailConfig } from "app/redux/slice/getSlice";
// Sample mail data object

const MailSidebar = () => {
  const location = useLocation();
  const state = location.state || {};

  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const status = useSelector((state) => state.getSlice.mailStatus);
  const error = useSelector((state) => state.getSlice.mailError);
  const data = useSelector((state) => state.getSlice.mailData);
  console.log("🚀 ~ MailSidebar ~ data:", data)
  const loading = useSelector((state) => state.getSlice.mailLoading);
  // ********************* COLUMN AND ROWS ********************* //
  // ********************* TOOLBAR ********************* //

  useEffect(() => {
    dispatch(getCompanyMailConfig({
      ID: user.companyID,
      type: "CM", // Ensure updated value
    }));
  }, []);


  const [openAlert, setOpenAlert] = useState(false);
  const [postError, setPostError] = useState(null);
  const fnRunGrpEmailProcess = async (values) => {


    const data = {
      RecordID: 0,
      CompanyID: user.companyID,
      CompanyCode: user.companyCode,
      UserID: user.id,
      TemplateID: 0,
      ToMailID: values.to,
      CcMailID: values.cc,
      Subject: values.subject,
      Content: values.content,
      Signature: user.name,
      FromDate: state.FromDate,
      ToDate: state.ToDate,
      Pdf: values.PreferedPdf ? "1" : "0",
      Excel: values.PreferedExcel ? "1" : "0",
    };
    // console.log("🚀 ~ data ~ data:", data);

    try {
      const response = await dispatch(CompanyMailSend(data));

      if (response.payload.status === "Y") {
        setOpenAlert(true);
      } else {
        setOpenAlert(response.payload.message);
        setPostError(true);
      }
    } catch (error) {
      setOpenAlert(true);
      setPostError("Somthing went wrong and please try again");
      console.error("Error during HandleSave:", error);
    }
  };

  const validationSchema = Yup.object({
    to: Yup.string().test("valid-emails", "Invalid email format", (value) => {
      if (!value) return true; // Allow empty CC field
      const emails = value.split(",").map(email => email.trim());
      return emails.every(email => Yup.string().email().isValidSync(email));
    }),
      cc: Yup.string()
      .test("valid-emails", "Invalid email format", (value) => {
        if (!value) return true; // Allow empty CC field
        const emails = value.split(",").map(email => email.trim());
        return emails.every(email => Yup.string().email().isValidSync(email));
      })
      .max(500, "CC field must be at most 500 characters"),
    PreferedPdf: Yup.boolean(),
    PreferedExcel: Yup.boolean(),
  })

  function replacePlaceholders(template, values) {
    //console.log(values);
    return template
    .replace("{FROMDATE}", state.FromDate)
    .replace("{TODATE}", state.ToDate)
    .replace("{USER}", values.name)
    .replace("{USEREMAILID}", values.email)
    .replace("{COMPANYNAME}", values.company)
    .replace("{USERPHONE}", values.userMobile);
  }
  return (
    <Box sx={{ margin: "15px" }}>
      <SimpleCard>
        {/* Header Section */}
        <Box
          sx={{
            minHeight: 58,
            display: "flex",
            alignItems: "center",
            marginBottom: "16px",
            padding: "14px 20px",
            boxShadow: themeShadows[6],
            justifyContent: "space-between",
          }}
        >
          <Box display="flex">
            <Icon className="icon" color="error">
              mail
            </Icon>
            <H5 sx={{ ml: 1, fontSize: "1rem" }}>Email Price Book</H5>
          </Box>

          <IconButton onClick={() => navigate(-1)}>
            <Icon className="icon">close</Icon>
          </IconButton>
        </Box>

        {/* Form Fields */}

       { status === "fulfilled" && !error ? 
        (  <Formik
          initialValues={{
            to: "",
            cc: data.CCEmailIDs,
            subject:  replacePlaceholders(data.Subject, user),
            content: replacePlaceholders(data.Content , user),
            PreferedPdf: true,
            PreferedExcel: true,
          }}
          validationSchema={validationSchema}
          validate={(values) => {
            const errors = {};
            
            // Checkbox validation: At least one must be checked
            if (!values.PreferedPdf && !values.PreferedExcel) {
              errors.PreferedPdf = "At least one format (PDF or Excel) must be selected";
            }
        
            return errors;
          }}
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              fnRunGrpEmailProcess(values, setSubmitting);
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
              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  gap: "20px",
                  flexDirection: "column",
                }}
              >
                <TextField
                  id="to"
                  label="To"
                  type="email"
                  variant="outlined"
                  fullWidth
                  name="to"
                  value={values.to}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  InputLabelProps={{
                    sx: {
                      "& .MuiInputLabel-asterisk": { color: "red" },
                    },
                  }}
                  error={touched.to && Boolean(errors.to)}
                  helperText={touched.to && errors.to}
                  autoComplete="off"
                />
                <TextField
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
                <FormControl
                  component="fieldset"
                  variant="standard"
                  error={
                    touched.PreferedPdf &&
                    touched.PreferedExcel &&
                    !!errors.PreferedPdf
                  } // Show error styling if both are touched and there's an error
                >
                  <FormLabel focused={false} component="legend">
                    Preferred Format
                  </FormLabel>
                  <Stack direction="row" gap={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          id="PreferedPdf"
                          name="PreferedPdf"
                          checked={values.PreferedPdf}
                          onChange={handleChange}
                          onBlur={handleBlur} // Ensures validation triggers on blur
                        />
                      }
                      label="Pdf"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          id="PreferedExcel"
                          name="PreferedExcel"
                          checked={values.PreferedExcel}
                          onChange={handleChange}
                          onBlur={handleBlur} // Ensures validation triggers on blur
                        />
                      }
                      label="Excel"
                    />
                  </Stack>

                  {/* Error Message */}
                  {touched.PreferedPdf &&
                    touched.PreferedExcel &&
                    errors.PreferedPdf && (
                      <FormHelperText>{errors.PreferedPdf}</FormHelperText>
                    )}
                </FormControl>
              </Box>

              <Box sx={{ mt: 4, padding: 1 }}>
                <Box sx={{ margin: "0px 0px", display: "flex", gap: "10px" }}>
                  <Button
                    sx={{
                      backgroundColor: "#164D50",
                      "&:hover": {
                        backgroundColor: "#164D50",
                      },
                    }}
                    variant="contained"
                    startIcon={<SendIcon />}
                    type="submit"
                  >
                    Send
                  </Button>
                  <Button
                    onClick={() => navigate(-1)}
                    variant="outlined"
                    color="info"
                  >
                    Cancel
                  </Button>
                </Box>
                <PriceGroupAlertApiDialog
                  open={openAlert}
                  error={postError}
                  message={
                    postError
                      ? "An error occurred while sending the email. Please try again."
                      : "Customer will receive their Price Book shortly"
                  }
                  Actions={
                    <Box
                      sx={{
                        display: "flex",

                        justifyContent: "flex-end",

                        width: "100%",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="info"
                        size="small"
                        onClick={() => {
                          setOpenAlert(false);

                          setTimeout(() => {
                            setPostError(null);
                          }, 1000);
                          navigate("/home")
                        }}
                        sx={{ height: 25 }}
                      >
                        Close
                      </Button>
                    </Box>
                  }
                />
              </Box>
            </form>  
          )}
        </Formik>) : (
              false
            )}

        {/* Attachment and Action Buttons */}
      </SimpleCard>
    </Box>
  );
};

export default MailSidebar;
