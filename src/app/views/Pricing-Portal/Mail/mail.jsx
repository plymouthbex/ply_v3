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

// Sample mail data object

const MailSidebar = () => {
  const location = useLocation();
  // const screenName = location.state?.screenName || "Generic";
  const initialMailData = {
    to: "",
    cc: "",
    subject: `RE:Plymouth Full Price Book`,
    content:
      "Hi  \nKindly find attached Generic Full Price Book\n\nwith Regards\nPlymouth-commercial team",
  };
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [to, setTo] = useState(initialMailData.to);
  const [cc, setCc] = useState(initialMailData.cc);
  const [subject, setSubject] = useState(initialMailData.subject);
  const [content, setContent] = useState(initialMailData.content);

  const [dateRange, setDateRange] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const fromDateInit = new Date();
    const toDateInit = new Date();
    toDateInit.setDate(fromDateInit.getDate() + 6);

    const formattedFromDate = formatFromDate(fromDateInit);
    const formattedToDate = formatToDate(toDateInit);

    const initialDateRange = `${formattedFromDate} To ${formattedToDate}`;
    setDateRange(initialDateRange);
    setFromDate(formattedFromDate);
    setToDate(formattedToDate);

    // Update content with date range
    setContent(
      `Hi  \n\nPlymouth Full Price Book for the Week(${initialDateRange})-Attached\n\nwith Regards\n${user.name}\nPlymouth-commercial team`
    );
  }, []);

  const handleDateChange = (newDate) => {
    const selectedDate = new Date(newDate + "T00:00:00");

    const formattedFromDate = formatFromDate(selectedDate);
    setFromDate(formattedFromDate);

    const newToDate = new Date(selectedDate);
    newToDate.setDate(selectedDate.getDate() + 6);
    const formattedToDate = formatToDate(newToDate);
    setToDate(formattedToDate);

    const updatedDateRange = `Pricing Week ${formattedFromDate} - ${formattedToDate}`;
    setDateRange(updatedDateRange);

    // Update content with new date range
    setContent(
      `Hi  \nKindly find attached Generic Full Price Book ${updatedDateRange}\n\nwith Regards\nPlymouth-commercial team`
    );
  };

  const formatFromDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}/${day}/${year}`;
  };

  const formatToDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}/${day}/${year}`;
  };


  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   if (files.length > 0) {
  //     const fileReaders = files.map((file) => {
  //       return new Promise((resolve, reject) => {
  //         const reader = new FileReader();
  //         reader.onload = () => {
  //           resolve({
  //             content: reader.result.split(",")[1], // Strip off the base64 prefix
  //             name: file.name,
  //           });
  //         };
  //         reader.onerror = (error) => reject(error);
  //         reader.readAsDataURL(file);
  //       });
  //     });

  //     Promise.all(fileReaders)
  //       .then((attachments) => {
  //         const emailData = {
  //           ...formData,
  //           attachments, // Pass the array of base64-encoded files with names
  //         };

  //         emailjs
  //           .send(
  //             process.env.REACT_APP_EMAILJS_SERVICE_ID,
  //             process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
  //             emailData,
  //             process.env.REACT_APP_EMAILJS_PUBLIC_KEY
  //           )
  //           .then(
  //             (result) => {
  //               console.log("Email successfully sent!", result.text);
  //               alert("Message sent!");
  //               setFormData({ name: "", email: "", message: "" }); // Reset form
  //               setFiles([]); // Clear files
  //             },
  //             (error) => {
  //               console.error("Failed to send email:", error.text);
  //               alert("Failed to send message. Please try again.");
  //             }
  //           );
  //       })
  //       .catch((error) => {
  //         console.error("Failed to process files:", error);
  //         alert("Failed to attach files. Please try again.");
  //       });
  //   } else {
  //     // Send without attachments if no files are selected
  //     emailjs
  //       .send(
  //         process.env.REACT_APP_EMAILJS_SERVICE_ID,
  //         process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
  //         formData,
  //         process.env.REACT_APP_EMAILJS_PUBLIC_KEY
  //       )
  //       .then(
  //         (result) => {
  //           console.log("Email successfully sent!", result.text);
  //           alert("Message sent!");
  //           setFormData({ name: "", email: "", message: "" });
  //         },
  //         (error) => {
  //           console.error("Failed to send email:", error.text);
  //           alert("Failed to send message. Please try again.");
  //         }
  //       );
  //   }
  // };


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
            <Icon className="icon" color="primary">
              mail
            </Icon>
            <H5 sx={{ ml: 1, fontSize: "1rem" }}>Send Mail</H5>
          </Box>

          <IconButton onClick={() => navigate(-1)}>
            <Icon className="icon">close</Icon>
          </IconButton>
        </Box>

        {/* Form Fields */}
        <Box
          sx={{ mt: 4, display: "flex", gap: "20px", flexDirection: "column" }}
        >
          <TextField
            id="to"
            label="To"
            variant="outlined"
            fullWidth
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <TextField
            id="cc"
            label="CC"
            variant="outlined"
            fullWidth
            value={cc}
            onChange={(e) => setCc(e.target.value)}
          />
          <TextField
            id="subject"
            label="Subject"
            variant="outlined"
            fullWidth
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <TextField
            id="content"
            label="Content"
            variant="outlined"
            fullWidth
            multiline
            minRows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Box>

        {/* Attachment and Action Buttons */}
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
        </Box>
      </SimpleCard>
    </Box>
  );
};

export default MailSidebar;
