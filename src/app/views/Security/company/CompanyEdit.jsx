import React, { useEffect, useState } from "react";
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
  DialogTitle,
  Dialog,
  DialogContent,
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
import { fetchGetImage, getCompanyData } from "app/redux/slice/getSlice";
import { CompanyPost, postImage } from "app/redux/slice/postSlice";
import AlertDialog from "app/components/AlertDialog";
import toast from "react-hot-toast";
import { FlexAlignCenter, FlexBox } from "app/components/FlexBox";
import { convertHexToRGB } from "app/utils/constant";
import useAuth from "app/hooks/useAuth";
import { useDropzone } from "react-dropzone";
import { Publish } from "@mui/icons-material";
import Cover from "../../../../assets/plylogo.png";
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
// ******************** Image ******************** //
const ImageWrapper = styled("div")(({ previewImage }) => ({
  width: "100%",
  height: 150, // Reduced height
  minHeight: "50px", // Adjust minimum height as needed
  maxHeight: "300px", // Adjust maximum height as needed
  backgroundImage: `url(${previewImage || Cover})`,
  backgroundSize: "contain", // Ensures the full image is visible
  backgroundRepeat: "no-repeat", // Prevents tiling
  backgroundPosition: "center",
}));

const DropZone = styled(FlexAlignCenter)(({ isDragActive, theme }) => ({
  height: 70,
  width: "50%",
  cursor: "pointer",
  borderRadius: "4px",
  marginBottom: "16px",
  transition: "all 350ms ease-in-out",
  border: `2px dashed rgba(${convertHexToRGB(
    theme.palette.text.primary
  )}, 0.3)`,
  "&:hover": {
    background: `rgb(${convertHexToRGB( 
      theme.palette.text.primary
    )}, 0.2) !important`,
  },
  background: isDragActive ? "rgb(0, 0, 0, 0.15)" : "rgb(0, 0, 0, 0.01)",
}));
// ******************** Validation Schema ******************** //
const validationSchema = Yup.object({
  code: Yup.string().min(1, "Code must be at least 1 characters"),
  // .max(15, "Code must be at most 15 characters"),
  email: Yup.string()
    .email("Invalid email format")
    .max(30, "Email must be at most 30 characters"),

  name: Yup.string().min(3, "Name must be at least 3 characters"),
  // .max(20, "Name must be at most 20 characters"),
  address: Yup.string()
    .min(3, "Address must be at least 3 characters")
    .max(50, "Address must be at most 50 characters"),
    //  phonenumber: Yup.string()
    //     .matches(/^\(\d{3}\) \d{3}-\d{4}$/, "Phone number must be in the format (XXX) XXX-XXXX")
    //     .required("Phone number is required"),
    //     phone2: Yup.string()
    //     //.required("Phone-2 number is required")
    //     .matches(/^\(\d{3}\) \d{3}-\d{4}$/, "Phone number must be in the format (XXX) XXX-XXXX")
    //     //.matches(/^\d-\d{3}-\d{3}-\d{4}$/, "Phone-2 number must be in format X-XXX-XXX-XXXX"),
      
});

// ******************** Price List Edit SCREEN  ******************** //
const CompanyEdit = () => {
  // ******************** HOOKS AND CONSTANTS ******************** //
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  const dispatch = useDispatch();
  const { user, updateUser } = useAuth();
  // console.log(user);
  // ******************** LOCAL STATE ******************** //
  const [openAlert, setOpenAlert] = useState(false);
  const [postError, setPostError] = useState(false);
    const [postMessage, setPostMessage] = useState(false);
  // ******************** REDUX STATE ******************** //
  const data = useSelector((state) => state.getSlice.companyFormData);

  const status = useSelector((state) => state.getSlice.companyStatus);

  const error = useSelector((state) => state.getSlice.companyError);
  const CompanyID = state.RecordID ? state.RecordID : 0;
  ///===========API CALL GET============================//
  useEffect(() => {
    dispatch(getCompanyData({ ID: CompanyID}));
  }, []);
  //=============================SAVE==================================//

  const handleSave = async (values, setSubmitting) => {
    const companyData = {
      recordID: data.RecordID,
      companyCode: values.code,
      companyName: values.name,
      emailId: "",
      address1: values.address1,
      address2: values.address2,
      address3: "",
      phone: "",
      City:values.city,
      State:values.state,
      Phone2:values.phone2,
      genericFullPriceBook: values.generic,
      customerFullPriceBook: values.custom,
      customerCustomPriceBook: values.customer,
      sortOrder: "",
      faxNumber: "",
      Zip:values.zip && !isNaN(values.zip) ? parseInt(values.zip, 10) : null,
      disable: values.disable ? "Y" : "N",
      GenericprintCategory:values.GenericprintCategory,
      GenericprintPricelist:values.GenericprintPricelist,
      GenericpageBreakDown:values.GenericpageBreakDown,
      CustomerFullprintCategory:values.CustomerFullprintCategory,
      CustomerFullprintPricelist:values.CustomerFullprintPricelist,
      CustomerFullpageBreakDown:values.CustomerFullpageBreakDown,
      CustomerCustomprintCategory:values.CustomerCustomprintCategory,
      CustomerCustomprintPricelist:values.CustomerCustomprintPricelist,
      CustomerCustompageBreakDown:values.CustomerCustompageBreakDown
    };

    console.log("🚀 ~ handleSave ~ companyData:", companyData);
// return;
    const response = await dispatch(CompanyPost({ companyData }));

    if (response.payload.status === "Y") {
      console.log(response.payload.RecordId)
      // return;
      setOpenAlert(true);
      setPostMessage(response.payload.message);
      fnpostImage(response.payload.RecordId);
     
    } else {
      setOpenAlert(true);
      setPostError(response.payload.message)
      
      ;
      // toast.error("Error occurred while saving data");
    }
  };

  
  //==============================================IMAGE==================================================/
  const [imageList1, setImageList1] = useState([]);
  const [previewImages1, setPreviewImages1] = useState([]);
  const [imageList2, setImageList2] = useState([]);
  const [previewImages2, setPreviewImages2] = useState([]);
  const [imageList3, setImageList3] = useState([]);
  const [previewImages3, setPreviewImages3] = useState([]);
  const [tempImageList, setTempImageList] = useState([]);
  const [tempPreviewImages, setTempPreviewImages] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogImageKey, setDialogImageKey] = useState(null);
  const handleDrop = (key) => (acceptedFiles) => {
    const previews = [];
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push({
          name: file.name,
          preview: reader.result,
        });
        if (previews.length === acceptedFiles.length) {
          setTempPreviewImages(previews);
          setTempImageList(acceptedFiles);
          setDialogImageKey(key);   // track which input triggered it
          setOpenDialog(true);
        }
      };
      reader.readAsDataURL(file);
    });
  };
  
  // const handleDrop = (setImageList, setPreviewImages) => (acceptedFiles) => {
  //   const previews = [];
  //   acceptedFiles.forEach((file) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       previews.push({
  //         name: file.name,
  //         preview: reader.result,
  //       });
  //       if (previews.length === acceptedFiles.length) {
  //         setPreviewImages(previews);
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   });
  //   setImageList(acceptedFiles);
  // };
  // const handleDrop = (setImageList, setPreviewImages) => (acceptedFiles) => {
  //   const previews = [];
  //   acceptedFiles.forEach((file) => {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       previews.push({
  //         name: file.name,
  //         preview: reader.result,
  //       });
  //       if (previews.length === acceptedFiles.length) {
  //         setTempPreviewImages(previews);
  //         setTempImageList(acceptedFiles);
  //         setOpenDialog(true); // Open confirmation dialog
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   });
  // };
  
  // const dropzoneProps1 = useDropzone({
  //   accept: "image/*",
  //   onDrop: handleDrop(setImageList1, setPreviewImages1),
  // });
  // const dropzoneProps2 = useDropzone({
  //   accept: "image/*",
  //   onDrop: handleDrop(setImageList2, setPreviewImages2),
  // });
  // const dropzoneProps3 = useDropzone({
  //   accept: "image/*",
  //   onDrop: handleDrop(setImageList3, setPreviewImages3),
  // });
  const dropzoneProps1 = useDropzone({
    accept: "image/*",
    onDrop: handleDrop("1"),
  });
  
  const dropzoneProps2 = useDropzone({
    accept: "image/*",
    onDrop: handleDrop("2"),
  });
  
  const dropzoneProps3 = useDropzone({
    accept: "image/*",
    onDrop: handleDrop("3"),
  });
  const SettingsLogo = ({ previewImages, imageSrc }) => {
    const displayImage =
      previewImages.length > 0 ? previewImages[0]["preview"] : "";
    return (
      <Box sx={{ width: "100%", padding: "8px" }}>
        <ImageWrapper previewImage={displayImage} />
      </Box>
    );
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response1 = await dispatch(
          fetchGetImage({
            filter: `CompanyID=${CompanyID}&TableID=CO&ImageID=GFPB`,
          })
        );
        setPreviewImages1([
          { preview: `data:image/png;base64,${response1.payload.Data.Image}` },
        ]);

        const response2 = await dispatch(
          fetchGetImage({
            filter: `CompanyID=${CompanyID}&TableID=CO&ImageID=CFPB`,
          })
        );
        setPreviewImages2([
          { preview: `data:image/png;base64,${response2.payload.Data.Image}` },
        ]);

        const response3 = await dispatch(
          fetchGetImage({
            filter: `CompanyID=${CompanyID}&TableID=CO&ImageID=CCPB`,
          })
        );
        setPreviewImages3([
          { preview: `data:image/png;base64,${response3.payload.Data.Image}` },
        ]);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [CompanyID]);

  const fnpostImage = async (CmpID) => {
    let isImageUpdated = false;

    if (imgstatus1 === "Y") {
      const image = previewImages1[0]["preview"];
      const images = image.split(",");
      const idata = {
        RecordID: -1,
        CompanyID: CmpID,
        TabelID: "CO",
        ImageID: "GFPB",
        Description: "General Full Price Book",
        Image: images[1],
      };

      const imageresponse1 = await dispatch(postImage({ idata }));
      if (imageresponse1.payload?.Status === "Y") {
        setImageList1([]);
        toast.success("General Full Price Book updated successfully!");
      } else {
        toast.error("Please select Logo");
      }
      // if (imageresponse1.payload?.Status === "Y") {
      //   updateUser({ ...user, genFullPrcieBookImg: images[1] });
      //   isImageUpdated = true;
      // }
    }

    if (imgstatus2 === "Y") {
      const image = previewImages2[0]["preview"];
      const images = image.split(",");
      const idata = {
        RecordID: -1,
        CompanyID: CmpID,
        TabelID: "CO",
        ImageID: "CFPB",
        Description: "Customer Full Price Book",
        Image: images[1],
      };

      const imageresponse2 = await dispatch(postImage({ idata }));
      if (imageresponse2.payload?.Status === "Y") {
        setImageList2([]);
        toast.success("Customer Custom Price Book updated successfully!");
      } else {
        toast.error("Please select Logo");
      }
      // if (imageresponse2.payload?.Status === "Y") {
      //   updateUser({ ...user, customerFullPriceBookImg: images[1] });

      //   isImageUpdated = true;
      // }
    }

    if (imgstatus3 === "Y") {
      const image = previewImages3[0]["preview"];
      const images = image.split(",");
      const idata = {
        RecordID: -1,
        CompanyID: CmpID,
        TabelID: "CO",
        ImageID: "CCPB",
        Description: "Customer Custom Price Book",
        Image: images[1],
      };

      const imageresponse3 = await dispatch(postImage({ idata }));
      setImageList3([]);
      if (imageresponse3.payload?.Status === "Y") {
        toast.success("Customer Full Price Book updated successfully!");
      } else {
        toast.error("Please select Logo");
      }
      // if (imageresponse3.payload?.Status === "Y") {
      //   updateUser({ ...user, customerCustomPriceBookImg: images[1] });
      //   isImageUpdated = true;
      // }
    }

    // Navigate or show an error message
    // if (isImageUpdated) {
    //   navigate("/pages/security/edit-price-book/Uploaded");
    // } else {
    //   toast.error("Please Select Images");
    //   // setErrorMessage("Image not updated.");
    // }
  };

  const [imgstatus1, setImgStatus1] = useState("N");
  const [imgstatus2, setImgStatus2] = useState("N");
  const [imgstatus3, setImgStatus3] = useState("N");

  const [successMessage, setSuccessMessage] = useState("");
  const [successMessage2, setSuccessMessage2] = useState("");
  const [successMessage3, setSuccessMessage3] = useState("");

  const handleImageUpload = (files) => {
    if (files.length > 0) {
      setImgStatus1("Y");
      setSuccessMessage("General Full Price Book updated successfully!");
    } else {
      setImgStatus1("N");
    }
  };
  const handleImageUpload2 = (files) => {
    if (files.length > 0) {
      setImgStatus2("Y");
      setSuccessMessage2("Customer Custom Price Book updated successfully!");
    } else {
      setImgStatus2("N");
    }
  };
  const handleImageUpload3 = (files) => {
    if (files.length > 0) {
      setImgStatus3("Y");
      setSuccessMessage3("Customer Full Price Book updated successfully!");
    } else {
      setImgStatus3("N");
    }
  };
  const getDialogTitle = (key) => {
    switch (key) {
      case "1":
        return "Full Price Book";
      case "2":
        return "Customer Full Price Book";
      case "3":
        return "Customer Custom Price Book";
      default:
        return "Image Upload";
    }
  };
  return (
    <Container>
      {status === "fulfilled" && !error ? (
        <Formik
          initialValues={{
            recID: data.RecordID,
            code: data.CompanyCode,
            name: data.CompanyName,
            email: data.EmailId,
            sequence: data.SortOrder,
            address1: data.Address1,
            address2: data.Address3,
            address3: data.Address3,
            // phonenumber: data.Phone,
            city: data.City,
            state: data.State,
            phone2:data.Phone2,
            fax: data.FaxNumber,
            zip:data.Zip,
            generic: data.GenericFullPriceBook,
            custom: data.CustomerFullPriceBook,
            customer: data.CustomerCustomPriceBook,
            disable: data.Disable === "Y" ? true : false,
            GenericprintCategory: data.GenericprintCategory  ? true : false,
            GenericprintPricelist: data.GenericprintPricelist  ? true : false,
            GenericpageBreakDown: data.GenericpageBreakDown  ? true : false,
            CustomerFullprintCategory: data.CustomerFullprintCategory  ? true : false,
            CustomerFullprintPricelist: data.CustomerFullprintPricelist  ? true : false,
            CustomerFullpageBreakDown: data.CustomerFullpageBreakDown  ? true : false,
            CustomerCustomprintCategory: data.CustomerCustomprintCategory  ? true : false,
            CustomerCustomprintPricelist: data.CustomerCustomprintPricelist  ? true : false,
            CustomerCustompageBreakDown: data.CustomerCustompageBreakDown  ? true : false,
          }}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              // if (params.mode === "delete") {
              //   setIsDelete(true);
              // }
              if (params.mode === "add" || params.mode === "edit") {
                handleSave(values, setSubmitting);
                // fnpostImage();
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
                    { name: "Control Panel" },
                    { name: "Company", path: "/pages/security/company" },
                    { name: `${params.mode} Company Detail` },
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
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="code"
                    name="code"
                    label="Code"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    required
                      autoComplete="off"
                    InputLabelProps={{
                      sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                    }}
                    value={values.code}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.code && !!errors.code}
                    helperText={touched.code && errors.code}
                    disabled={params.mode === "edit"}
                    autoFocus
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="name"
                    name="name"
                    label="Name"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    required
                      autoComplete="off"
                    InputLabelProps={{
                      sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                    }}
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.code && !!errors.code}
                    helperText={touched.name && errors.name}
                    // autoFocus
                  />
                  {/* <TextField
                    fullWidth
                    variant="outlined"
                    type="email"
                    id="email"
                    name="email"
                    label="Email"
                    size="small"
                      autoComplete="off"
                    sx={{ gridColumn: "span 2" }}
                    //required
                    InputLabelProps={{
                      sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                    }}
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  /> */}
                  {/* <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="phonenumber"
                    name="phonenumber"
                    required
                    InputLabelProps={{
                      sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                    }}
                    label="Mobile"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    value={values.phonenumber}
                    //onChange={handleChange}
                    onChange={(e) => {
    const formatPhoneNumber = (value) => {
  // Remove all non-digit characters
  const phoneNumber = value.replace(/\D/g, '');

  // Format only if 10 digits
  if (phoneNumber.length <= 3) {
    return phoneNumber;
  } else if (phoneNumber.length <= 6) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  } else if (phoneNumber.length <= 10) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  } else {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`; // Truncate after 10 digits
  }
};
    // const formatPhoneNumber = (value) => {
    //   const digits = value.replace(/\D/g, "");
    //   if (digits.length === 0) return "";
    
    //   let formatted = "";
    //   if (digits.length > 0) formatted += digits[0];
    //   if (digits.length > 1) formatted += "-" + digits.slice(1, 4);
    //   if (digits.length > 4) formatted += "-" + digits.slice(4, 7);
    //   if (digits.length > 7) formatted += "-" + digits.slice(7, 11);
    
    //   return formatted;
    // };
    

    const formatted = formatPhoneNumber(e.target.value);
    setFieldValue("phonenumber", formatted);
  }}
                      autoComplete="off"
                    onBlur={handleBlur}
                    error={touched.phonenumber && Boolean(errors.phonenumber)}
                    helperText={touched.phonenumber && errors.phonenumber}
                  /> */}
                  {/* <TextField
  fullWidth
  variant="outlined"
  type="text"
  id="phone2"
  name="phone2"
  //required
  InputLabelProps={{
    sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
  }}
  label="Phone"
  size="small"
  sx={{ gridColumn: "span 2" }}
  value={values.phone2}
  autoComplete="off"
  onChange={(e) => {
    const formatPhoneNumber = (value) => {
  // Remove all non-digit characters
  const phoneNumber = value.replace(/\D/g, '');

  // Format only if 10 digits
  if (phoneNumber.length <= 3) {
    return phoneNumber;
  } else if (phoneNumber.length <= 6) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  } else if (phoneNumber.length <= 10) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  } else {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`; // Truncate after 10 digits
  }
};
    // const formatPhoneNumber = (value) => {
    //   const digits = value.replace(/\D/g, "");
    //   if (digits.length === 0) return "";
    
    //   let formatted = "";
    //   if (digits.length > 0) formatted += digits[0];
    //   if (digits.length > 1) formatted += "-" + digits.slice(1, 4);
    //   if (digits.length > 4) formatted += "-" + digits.slice(4, 7);
    //   if (digits.length > 7) formatted += "-" + digits.slice(7, 11);
    
    //   return formatted;
    // };
    

    const formatted = formatPhoneNumber(e.target.value);
    setFieldValue("phone2", formatted);
  }}
  onBlur={handleBlur}
  error={touched.phone2 && Boolean(errors.phone2)}
  helperText={touched.phone2 && errors.phone2}
/> */}

                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="address1"
                    name="address1"
                    label="Address 1"
                    size="small"
                      autoComplete="off"
                    sx={{ gridColumn: "span 2" }}
                    value={values.address1}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.address1 && Boolean(errors.address1)}
                    helperText={touched.address1 && errors.address1}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="address2"
                    name="address2"
                    label="Address 2"
                    size="small"
                      autoComplete="off"
                    sx={{ gridColumn: "span 2" }}
                    value={values.address2}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.address2 && Boolean(errors.address2)}
                    helperText={touched.address2 && errors.address2}
                  />
                  
                   <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="city"
                    name="city"
                    label="City"
                    size="small"
                      autoComplete="off"
                    sx={{ gridColumn: "span 2" }}
                    value={values.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.city && Boolean(errors.city)}
                    helperText={touched.city && errors.city}
                  /> 
                   <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="state"
                    name="state"
                    label="State"
                    size="small"
                      autoComplete="off"
                    sx={{ gridColumn: "span 2" }}
                    value={values.state}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.state && Boolean(errors.state)}
                    helperText={touched.state && errors.state}
                  /> 
                  {/* <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="address3"
                    name="address3"
                    label="Address 3"
                    size="small"
                      autoComplete="off"
                    sx={{ gridColumn: "span 2" }}
                    value={values.address3}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.address3 && Boolean(errors.address3)}
                    helperText={touched.address3 && errors.address3}
                  /> */}
                  {/* <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="sequence"
                    name="sequence"
                    label="Sequence"
                    size="small"
                      autoComplete="off"
                    sx={{ gridColumn: "span 2" }}
                    InputProps={{
                      inputProps: {
                        style: {
                          textAlign: "left",
                        },
                      },
                    }}
                    value={values.sequence}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.sequence && Boolean(errors.sequence)}
                    helperText={touched.sequence && errors.sequence}
                  /> */}
                  {/* <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="fax"
                    name="fax"
                    label="Fax"
                      autoComplete="off"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    InputProps={{
                      inputProps: {
                        style: {
                          textAlign: "left",
                        },
                      },
                    }}
                    value={values.fax}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.fax && Boolean(errors.fax)}
                    helperText={touched.fax && errors.fax}
                  /> */}
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="number"
                    id="zip"
                    name="zip"
                    label="Zip"
                      autoComplete="off"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    InputProps={{
                      inputProps: {
                        style: {
                          textAlign: "left",
                        },
                      },
                    }}
                    value={values.zip}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.zip && Boolean(errors.zip)}
                    helperText={touched.zip && errors.zip}
                  />
                                    <TextField
  fullWidth
  variant="outlined"
  type="text"
  id="phone2"
  name="phone2"
  //required
  InputLabelProps={{
    sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
  }}
  label="Phone"
  size="small"
  sx={{ gridColumn: "span 2" }}
  value={values.phone2}
  autoComplete="off"
  onChange={(e) => {
    const formatPhoneNumber = (value) => {
  // Remove all non-digit characters
  const phoneNumber = value.replace(/\D/g, '');

  // Format only if 10 digits
  if (phoneNumber.length <= 3) {
    return phoneNumber;
  } else if (phoneNumber.length <= 6) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  } else if (phoneNumber.length <= 10) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  } else {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`; // Truncate after 10 digits
  }
};
    // const formatPhoneNumber = (value) => {
    //   const digits = value.replace(/\D/g, "");
    //   if (digits.length === 0) return "";
    
    //   let formatted = "";
    //   if (digits.length > 0) formatted += digits[0];
    //   if (digits.length > 1) formatted += "-" + digits.slice(1, 4);
    //   if (digits.length > 4) formatted += "-" + digits.slice(4, 7);
    //   if (digits.length > 7) formatted += "-" + digits.slice(7, 11);
    
    //   return formatted;
    // };
    

    const formatted = formatPhoneNumber(e.target.value);
    setFieldValue("phone2", formatted);
  }}
  onBlur={handleBlur}
  error={touched.phone2 && Boolean(errors.phone2)}
  helperText={touched.phone2 && errors.phone2}
/>
                  <FormControlLabel
                  sx={{ width:"20px"}}
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

                  <FormControl
                    sx={{
                      gridColumn: isNonMobile ? "span 4" : "span 2",
                      gap: "10px",
                    }}
                  >
                    <Typography fontSize={"14px"} fontWeight={"bold"}>
                      Price Book Title
                    </Typography>
                  </FormControl>

                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="generic"
                    name="generic"
                    label="Company Full Price Book"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    value={values.generic}
                     autoComplete="off"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.generic && Boolean(errors.generic)}
                    helperText={touched.generic && errors.generic}
                  />
                    <Stack sx={{ gridColumn: "span 2" }} gap={2} >
             <Stack direction="row" gap={2}  >
             <FormControlLabel
                  sx={{ width:"250px",marginTop:"7px"}}
                    control={
                      <Checkbox
                        size="small"
                        id="GenericprintCategory"
                        name="GenericprintCategory"
                        checked={values.GenericprintCategory}
                        onChange={handleChange}
                        sx={{ height: "10px" }}
                        disabled={
                          params.mode === "delete" || params.mode === "view"
                        }
                      />
                    }
                    label="Print Category"
                  />
                   <FormControlLabel
                  sx={{ width:"250px",marginTop:"7px"}}
                    control={
                      <Checkbox
                        size="small"
                        id="GenericprintPricelist"
                        name="GenericprintPricelist"
                        checked={values.GenericprintPricelist}
                        onChange={handleChange}
                        sx={{ height: "10px" }}
                        disabled={
                          params.mode === "delete" || params.mode === "view"
                        }
                      />
                    }
                    label="Print PriceList"
                  />
                   <FormControlLabel
                  sx={{ width:"250px",marginTop:"7px" }}
                    control={
                      <Checkbox
                        size="small"
                        id="GenericpageBreakDown"
                        name="GenericpageBreakDown"
                        checked={values.GenericpageBreakDown}
                        onChange={handleChange}
                        sx={{ height: "10px" }}
                        disabled={
                          params.mode === "delete" || params.mode === "view"
                        }
                      />
                    }
                    label="PageBreak"
                  />

             </Stack>

             </Stack>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="custom"
                    name="custom"
                    label="Customer Full Price Book"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    value={values.custom}
                    onChange={handleChange}
                     autoComplete="off"
                    onBlur={handleBlur}
                    error={touched.custom && Boolean(errors.custom)}
                    helperText={touched.custom && errors.custom}
                  />
  <Stack sx={{ gridColumn: "span 2" }} gap={2}>
             <Stack direction="row" gap={2} >
             <FormControlLabel
                  sx={{ width:"250px",marginTop:"7px"}}
                    control={
                      <Checkbox
                        size="small"
                        id="CustomerFullprintCategory"
                        name="CustomerFullprintCategory"
                        checked={values.CustomerFullprintCategory}
                        onChange={handleChange}
                        sx={{ height: "10px" }}
                        disabled={
                          params.mode === "delete" || params.mode === "view"
                        }
                      />
                    }
                    label="Print Category"
                  />
                   <FormControlLabel
                  sx={{ width:"250px",marginTop:"7px"}}
                    control={
                      <Checkbox
                        size="small"
                        id="CustomerFullprintPricelist"
                        name="CustomerFullprintPricelist"
                        checked={values.CustomerFullprintPricelist}
                        onChange={handleChange}
                        sx={{ height: "10px" }}
                        disabled={
                          params.mode === "delete" || params.mode === "view"
                        }
                      />
                    }
                    label="Print PriceList"
                  />
                   <FormControlLabel
                  sx={{ width:"250px" }}
                    control={
                      <Checkbox
                        size="small"
                        id="CustomerFullpageBreakDown"
                        name="CustomerFullpageBreakDown"
                        checked={values.CustomerFullpageBreakDown}
                        onChange={handleChange}
                        sx={{ height: "10px" ,marginTop:"7px"}}
                        disabled={
                          params.mode === "delete" || params.mode === "view"
                        }
                      />
                    }
                    label="PageBreak"
                  />

             </Stack>

             </Stack>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="customer"
                    name="customer"
                    label="Customer Custom Price Book"
                    size="small"
                     autoComplete="off"
                    sx={{ gridColumn: "span 2" }}
                    value={values.customer}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.customer && Boolean(errors.customer)}
                    helperText={touched.customer && errors.customer}
                  />
             <Stack sx={{ gridColumn: "span 2" }} gap={2}>
             <Stack direction="row" gap={2} >
             <FormControlLabel
                  sx={{ width:"250px",marginTop:"7px"}}
                    control={
                      <Checkbox
                        size="small"
                        id="CustomerCustomprintCategory"
                        name="CustomerCustomprintCategory"
                        checked={values.CustomerCustomprintCategory}
                        onChange={handleChange}
                        sx={{ height: "10px" }}
                        disabled={
                          params.mode === "delete" || params.mode === "view"
                        }
                      />
                    }
                    label="Print Category"
                  />
                   <FormControlLabel
                  sx={{ width:"250px",marginTop:"7px"}}
                    control={
                      <Checkbox
                        size="small"
                        id="CustomerCustomprintPricelist"
                        name="CustomerCustomprintPricelist"
                        checked={values.CustomerCustomprintPricelist}
                        onChange={handleChange}
                        sx={{ height: "10px" }}
                        disabled={
                          params.mode === "delete" || params.mode === "view"
                        }
                      />
                    }
                    label="Print PriceList"
                  />
                   <FormControlLabel
                  sx={{ width:"250px" ,marginTop:"7px"}}
                    control={
                      <Checkbox
                        size="small"
                        id="CustomerCustompageBreakDown"
                        name="CustomerCustompageBreakDown"
                        checked={values.CustomerCustompageBreakDown}
                        onChange={handleChange}
                        sx={{ height: "10px" }}
                        disabled={
                          params.mode === "delete" || params.mode === "view"
                        }
                      />
                    }
                    label="PageBreak"
                  />

             </Stack>

             </Stack>

                  <FormControl
                    sx={{
                      gridColumn: isNonMobile ? "span 4" : "span 2",
                      gap: "10px",
                    }}
                  >
                    <Typography fontSize={"14px"} fontWeight={"bold"}>
                      Price Book Cover Image
                    </Typography>
                  </FormControl>
                </Box>

                <Box
                  display="grid"
                  gap="20px"
                  margin={5}
                  gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" // Three columns with responsive sizing
                  sx={{
                    "& > div": {
                      gridColumn: isNonMobile ? undefined : "span 3",
                    },
                  }}
                >
                  {/* First Grid - Logo section */}

                  <Box
                    display="flex"
                    flexDirection="column"
                    gap="20px"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Typography fontSize={"14px"}>Full Price Book</Typography>
                    <SettingsLogo previewImages={previewImages1} />
                    {user.role != "USER" && (
                      <DropZone {...dropzoneProps1.getRootProps()}>
                        <input
                          {...dropzoneProps1.getInputProps({
                            onChange: (e) => handleImageUpload(e.target.files),
                          })}
                          multiple={false}
                        />
                        <FlexBox alignItems="center" flexDirection="column">
                          <Publish
                            sx={{ color: "text.secondary", fontSize: "48px" }}
                          />
                          {imageList1.length ? (
                            <span>{imageList1.length} images selected</span>
                          ) : (
                            <span>Drop images</span>
                          )}
                        </FlexBox>
                      </DropZone>
                    )}
                  </Box>

                  {/* Second Grid - Logo section */}
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap="20px"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Typography fontSize={"14px"}>
                      Customer Full Price Book
                    </Typography>
                    <SettingsLogo previewImages={previewImages2} />
                    {user.role != "USER" && (
                      <DropZone {...dropzoneProps2.getRootProps()}>
                        <input
                          {...dropzoneProps2.getInputProps({
                            onChange: (e) => handleImageUpload2(e.target.files),
                          })}
                          multiple={false}
                        />
                        <FlexBox alignItems="center" flexDirection="column">
                          <Publish
                            sx={{ color: "text.secondary", fontSize: "48px" }}
                          />
                          {imageList2.length ? (
                            <span>{imageList2.length} images selected</span>
                          ) : (
                            <span>Drop images</span>
                          )}
                        </FlexBox>
                      </DropZone>
                    )}
                  </Box>

                  {/* Third Grid - Logo section */}
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap="20px"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Typography fontSize={"14px"}>
                      Customer Custom Price Book
                    </Typography>
                    <SettingsLogo previewImages={previewImages3} />
                    {user.role != "USER" && (
                      <DropZone {...dropzoneProps3.getRootProps()}>
                        <input
                          {...dropzoneProps3.getInputProps({
                            onChange: (e) => handleImageUpload3(e.target.files),
                          })}
                          multiple={false}
                        />
                        <FlexBox alignItems="center" flexDirection="column">
                          <Publish
                            sx={{ color: "text.secondary", fontSize: "48px" }}
                          />
                          {imageList3.length ? (
                            <span>{imageList3.length} images selected</span>
                          ) : (
                            <span>Drop images</span>
                          )}
                        </FlexBox>
                      </DropZone>
                    )}
                  </Box>
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
          postError ? postError:
          postMessage
        }
        Actions={
          params.mode === "add" ? (
            <DialogActions>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => {navigate("/pages/security/company");
                  setPostError(null);
                  setPostMessage(null);
                }}
              >
                Back to Company
              </Button>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  dispatch(getCompanyData({ ID: 0 }));
                  setOpenAlert(false);
                  setPostError(null);
                  setPostMessage(null);
                }}
                autoFocus
              >
                Add New Company
              </Button>
            </DialogActions>
          ) : (
            <DialogActions>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => {navigate("/pages/security/company");
                  setPostError(null);
                  setPostMessage(null);
                }}
              >
                Back to Company
              </Button>
            </DialogActions>
          )
        }
      />
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
      <DialogTitle sx={{ textAlign: "center" }}>
  {{
    "1": "Full Price Book",
    "2": "Customer Full Price Book",
    "3": "Customer Custom Price Book",
  }[dialogImageKey] || "Image Upload"}
</DialogTitle>

  <DialogContent>
    {tempPreviewImages.map((img, index) => (
      <img key={index} src={img.preview} alt={img.name} style={{ width: "100%", marginBottom: 10 }} />
    ))}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenDialog(false)} variant="contained"
                    color="info"
                    size="small">Cancel</Button>
    <Button 
    variant="contained"
    color="info"
    size="small"
      onClick={() => {
        switch (dialogImageKey) {
          case "1":
            setPreviewImages1(tempPreviewImages);
            setImageList1(tempImageList);
            break;
          case "2":
            setPreviewImages2(tempPreviewImages);
            setImageList2(tempImageList);
            break;
          case "3":
            setPreviewImages3(tempPreviewImages);
            setImageList3(tempImageList);
            break;
          default:
            break;
        }
        setOpenDialog(false);
      }}
    >
      OK
    </Button>
  </DialogActions>
</Dialog>


    </Container>
  );
};

export default CompanyEdit;
