import {
  Box,
  Button,
  Icon,
  IconButton,
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
import { runGroupMailData } from "app/redux/slice/postSlice";
import { PriceGroupAlertApiDialog } from "app/components/LoadindgDialog";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
// Sample mail data object

const MailSidebar = () => {
  const location = useLocation();
  const state = location.state || {};
  const initialMailData = {
    to: "",
    cc: "",
    subject: `RE:Plymouth ${state.fppdf ? "Full" : "Custom"} Price Book`,
    content:
      "Hi  \nKindly find attached Generic Full Price Book\n\nwith Regards\nPlymouth-commercial team",
  };
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [to, setTo] = useState(initialMailData.to);
  const [cc, setCc] = useState(initialMailData.cc);
  const [subject, setSubject] = useState(initialMailData.subject);
  const [content, setContent] = useState(initialMailData.content);

  useEffect(() => {
    // Update content with date range
    setContent(
      `Hi  \n\n${user.company} Full Price Book for the Week(Pricing Week (SUN) ${state.FromDate}TO (SAT) ${state.ToDate})-Attached\n\nwith Regards\n${user.name}\n${user.company}-commercial team`
    );
  }, []);

  const [openAlert, setOpenAlert] = useState(false);
  const [postError, setPostError] = useState(false);
  const fnRunGrpEmailProcess = async () => {
    const data = [
      {
        CustomerNumber: state.customernumber,
        FullPriceBookPdf: state.fppdf ? "1" : "0",
        FullPriceBookExcel: state.fpexcel ? "1" : "0",
        CustomPriceBooPdf: state.cppdf ? "1" : "0",
        CustomPriceBookExcel: state.cpexcel ? "1" : "0",
        FromDate: state.FromDate,
        ToDate: state.ToDate,
      },
    ];
    console.log("🚀 ~ data ~ data:", data);

    try {
      const response = await dispatch(runGroupMailData({ data }));

      if (response.payload.status === "Y") {
        setOpenAlert(true);
      } else {
        setOpenAlert(true);
        setPostError(true);
      }
    } catch (error) {
      setOpenAlert(true);
      setPostError(true);
      console.error("Error during HandleSave:", error);
    }
  };

  const validationSchema = Yup.object({

  
    to: Yup.string()
      .email("Invalid email format")
      .max(200, "Email must be at most 200 characters"),
      cc: Yup.string()
      .email("Invalid email format")
      .max(200, "Email must be at most 200 characters"),

  });

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

        <Formik
          initialValues={{
            to: "",
            cc: "",
            subject: `RE:Plymouth ${
              state.fppdf ? "Full" : "Custom"
            } Price Book`,
            content: `Hi  \n\n${user.company} ${
              state.fppdf ? "Full" : "Custom"
            } Price Book for the Week(Pricing Week (SUN) ${state.FromDate}TO (SAT) ${state.ToDate})-Attached\n\nwith Regards\n${user.name}\n${user.company}-commercial team`,
          }}
          validationSchema={validationSchema}
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
              </Box>
              <Box sx={{ mt: 4, padding: 1 }}>
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              backgroundColor: "#EBF8F4",
              height: 30,
              borderRadius: "7px",
              alignItems: "center",
              paddingLeft: "10px",
              width: "fit-content",
            }}
          >
            <AttachFileIcon fontSize="small" sx={{ color: "#164D50" }} />
            <Typography sx={{ color: "#164D50", fontWeight: "500" }}>
              Price Book Attached
            </Typography>
          </Box>
          <Box sx={{ margin: "20px 0px", display: "flex", gap: "10px" }}>
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
                      setPostError(false);
                    }, 1000);
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
        </Formik>

        {/* Attachment and Action Buttons */}
   
      </SimpleCard>
    </Box>
  );
};

export default MailSidebar;
