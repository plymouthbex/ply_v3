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
  LinearProgress,
  sliderClasses,
} from "@mui/material";
import { Breadcrumb } from "app/components";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import CardHeader from "@mui/material/CardHeader";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
// ******************** ICONS ******************** //
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Form, Formik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import * as Yup from "yup";
import { getUserData } from "app/redux/slice/getSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  FormikCompanyOptimizedAutocomplete,
  FormikRungroupOptimizedAutocomplete,
  FormikSalesPersonOptimizedAutocomplete,
  FormikUserGroupOptimizedAutocomplete,
} from "app/components/SingleAutocompletelist";
import useAuth from "app/hooks/useAuth";
import { deleteUserData, userPost } from "app/redux/slice/postSlice";
import AlertDialog, { MessageAlertDialog } from "app/components/AlertDialog";
import {
  convertHexToRGB,
  dataGridHeaderFooterHeight,
  dataGridRowHeight,
  dataGridpageSizeOptions,
  dataGridPageSize,
} from "app/utils/constant";
import { FlexAlignCenter, FlexBox } from "app/components/FlexBox";
import { Publish } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
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

const DropZone = styled(FlexAlignCenter)(({ isDragActive, theme }) => ({
  height: 70,
  width: "200px",
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
  // alignItems:"center",
  // justifyItems:"center"
}));

// ******************** Validation Schema ******************** //
const validationSchema = Yup.object({
  code: Yup.string()
    .min(1, "Code must be at least 1 characters")
    .max(15, "Code must be at most 15 characters"),

  email: Yup.string()
    .email("Invalid email format")
    .max(200, "Email must be at most 200 characters"),

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
    .min(15, "Password must be at least 15 characters")
    .required("Password is required"),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  defaultCompany: Yup.object({
    RecordID: Yup.string().required("RecordID is required"),
    Code: Yup.string().required("Code is required"),
    Name: Yup.string().required("Name is required"),
  }).required("Default Company is required"),
  phonenumber: Yup.string()
  .matches(
    /^\(\d{3}\) \d{3}-\d{4}$/,
    "Phone number must be in the format (XXX) XXX-XXXX"
  )
  .required("Phone number is required")
});
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

  const [openDialog, setOpenDialog] = useState(false);
  const [postError, setPostError] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [slectedSalesName, setselectedSalesName] = useState(null);
  const [OpenUser, setOpenUser] = useState(false);

  // ******************** REDUX STATE ******************** //
  const data = useSelector((state) => state.getSlice.userFormData);
  console.log("🚀 ~ UserEdit ~ data:", data);

  const status = useSelector((state) => state.getSlice.userStatus);

  const error = useSelector((state) => state.getSlice.userError);

  //==================================================================//
  const columns = [
    {
      headerName: "Run Group",
      field: "RunGroupCode",
      width: "170",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Run Group Description",
      field: "RunGroupName",
      width: "200",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    // {
    //   headerName: "Print Sequence",
    //   field: "SortOrder",
    //   width: "200",
    //   align: "left",
    //   headerAlign: "left",
    //   hide: false,
    // },
  ];

  const rows = [
    {
      RunGroupCode: "RG1001",
      RunGroupName: "SHEPARD",
      SortOrder: 1,
      Disable: "N",
    },
    {
      RunGroupCode: "RG1002",
      RunGroupName: "DAVE",
      SortOrder: 2,
      Disable: "N",
    },
    {
      RunGroupCode: "RG1003",
      RunGroupName: "BOB",
      SortOrder: 3,
      Disable: "N",
    },
    {
      RunGroupCode: "RG1004",
      RunGroupName: "CAYTIE",
      SortOrder: 4,
      Disable: "N",
    },
    {
      RunGroupCode: "RG1005",
      RunGroupName: "KRISTJAN",
      SortOrder: 5,
      Disable: "N",
    },
    {
      RunGroupCode: "RG1006",
      RunGroupName: "LEAH",
      SortOrder: 6,
      Disable: "N",
    },
    {
      RunGroupCode: "RG1007",
      RunGroupName: "TONY",
      SortOrder: 7,
      Disable: "N",
    },
    {
      RunGroupCode: "RG1008",
      RunGroupName: "PAC",
      SortOrder: 8,
      Disable: "N",
    },
    {
      RunGroupCode: "RG1009",
      RunGroupName: "SALES",
      SortOrder: 9,
      Disable: "N",
    },
    {
      RunGroupCode: "RG1010",
      RunGroupName: "HOSS",
      SortOrder: 10,
      Disable: "N",
    },
  ];
  let UG = null;
  let name = null;

  if (data.UserGroup && typeof data.UserGroup === "string") {
    try {
      UG = JSON.parse(data.UserGroup);
      name = UG.Name;
    } catch (error) {
      console.error("Error parsing UserGroup:", error);
    }
  } else {
    console.error("data.UserGroup is not a valid string:", data.UserGroup);
  }

  console.log("🚀 ~ UserEdit ~ UG:", name);
  const [UserName, setSelectUserName] = useState(name);
  const [UserID, setSelectUserID] = useState(null);
  const [companyCode, setCompanyCode] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  console.log("🚀 ~ UserEdit ~ companyCode:", companyCode)
  

  useEffect(() => {
    if (data.CompanyCode) {
      setCompanyCode(data.CompanyCode);
    }
    if(data.UserGroupID){
      setSelectUserID(data.UserGroupID)
    }
  }, [data]);
  console.log("🚀 ~ UserEdit ~ UserID:", UserID)
  console.log("🚀 ~ UserEdit ~ UserName:", UserName);
  ///===========API CALL GET============================//
  useEffect(() => {
    dispatch(getUserData({ ID: state.ID }));
  }, []);

  const [imageList1, setImageList1] = useState([]);
  const [previewImages1, setPreviewImages1] = useState([]);

  const handleDrop = (setImageList, setPreviewImages) => (acceptedFiles) => {
    const previews = [];
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push({
          name: file.name,
          preview: reader.result,
        });
        if (previews.length === acceptedFiles.length) {
          setPreviewImages(previews);
        }
      };
      reader.readAsDataURL(file);
    });
    setImageList(acceptedFiles);
  };

  const dropzoneProps1 = useDropzone({
    accept: "image/*",
    onDrop: handleDrop(setImageList1, setPreviewImages1),
  });
  //=======================================SAVE================================//

  const HandleSave = async (values) => {
    if (params.mode === "delete") {
      setOpenDialog(true);
    }

    let images;
    if (previewImages1.length > 0) {
      const image = previewImages1[0]["preview"];
      images = image.split(",");
    }
    let userData;
    let passwordChanged;
    if (data.Password === values.password) {
      passwordChanged = 0;
    } else {
      passwordChanged = 1;
    }

    //  else {
      userData = {
        recordID: data.RecordID,
        firstname: values.firstname,
        lastname: values.lastname,
        password: values.password,
        userCode: values.code,
        sortOrder: values.sequence,
        disable: values.disable ? "Y" : "N",
        email: values.email,
        phone: values.phonenumber,
        userGroup: JSON.stringify(values.userGroup),
        rungroup: JSON.stringify(values.runGroup),
        company: JSON.stringify(values.defaultCompany),
        UserProfileImage:
          previewImages1.length > 0 ? images[1] : data.UserProfileImage,
        IsPasswordChanged: data.Password === values.password ? 0 : 1,
        SalesPerson:slectedSalesName,
      };
      console.log("🚀 ~ HandleSave ~ userData:", userData);
      // return;
      const response = await dispatch(userPost({ userData }));
      if (response.payload.status === "Y") {
        setImageList1([]);
        setOpenAlert(true);
        setSuccessMessage(response.payload.message);
      } else {
        setOpenAlert(true);
        setPostError(response.payload.message);
      }
    // }
  };

  // ******************** DELETE ******************** //

  const userDeleteFn = async (values, setSubmitting) => {
    try {
      dispatch(deleteUserData({ ID: data.RecordID })).then((response) => {
        if (response.payload.status === "Y") {
          setOpenAlert(true);
          setSuccessMessage(response.payload.message);
        } else {
          setOpenAlert(true);
          setPostError(response.payload.messagerue);
        }
      });
      // setSubmitting(false);
    } catch (e) {
      console.log("🚀 ~ priceListSaveFn ~ e:", e);
    }
  };
  function CustomToolbar() {
    // console.log("🚀 ~ UserEdit ~ COMPID:", COMPID)
    return (
      <GridToolbarContainer
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          width: "100%",
          padding: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 2,
            paddingX: 2,
          }}
        >
          <GridToolbarQuickFilter />
        </Box>
      </GridToolbarContainer>
    );
  }
  // const GETCOMPID=JSON.parse(data.Company)
  // const COMPID=GETCOMPID.RecordID;
  
  // console.log("🚀 ~ UserEdit ~ COMPID:", COMPID)
  return (
    <Container>
      {status === "fulfilled" && !error ? (
        <Formik
          initialValues={{
            code: "",
            password: data.Password,
            confirmpassword: data.Password,
            firstname: data.Firstname,
            lastname: data.Lastname,
            email: data.Email,
            phonenumber: data.Phone,
            sequence: "",
            disable: data.Disable === "Y" ? true : false,
            defaultCompany: JSON.parse(data.Company),
            runGroup: JSON.parse(data.Rungroup),
            userGroup: JSON.parse(data.UserGroup),
            sales: JSON.parse(data.SalesPerson),
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
                    // disabled={isSubmitting}
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
                  <Stack
                    sx={{ gridColumn: "span 2" }}
                    gap={"20px"}
                    direction={"column"}
                  >
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="email"
                      id="email"
                      name="email"
                      label="Login (Valid EmailID)"
                      size="small"
                      sx={{ gridColumn: "span 2" }}
                      required
                      InputLabelProps={{
                        sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                      }}
                      autoComplete="off"
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
                      type="text"
                      id="firstname"
                      name="firstname"
                      label="First Name"
                      autoComplete="off"
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
                      autoComplete="off"
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
                      autoComplete="off"
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
                      autoComplete="off"
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
                        touched.confirmpassword &&
                        Boolean(errors.confirmpassword)
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
  id="phonenumber"
  name="phonenumber"
  required
  InputLabelProps={{
    sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
  }}
  label="Phone"
  size="small"
  sx={{ gridColumn: "span 2" }}
  value={values.phonenumber}
  onChange={(e) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    handleChange({
      target: {
        name: e.target.name,
        value: formattedPhone,
      },
    });
  }}
  autoComplete="off"
  onBlur={handleBlur}
  disabled={params?.mode === "delete"}
  error={touched.phonenumber && Boolean(errors.phonenumber)}
  helperText={touched.phonenumber && errors.phonenumber}
/>

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
                      label="Phone"
                      size="small"
                      sx={{ gridColumn: "span 2" }}
                      value={values.phonenumber}
                      onChange={handleChange}
                      autoComplete="off"
                      onBlur={handleBlur}
                      disabled={params?.mode === "delete"}
                      error={touched.phonenumber && Boolean(errors.phonenumber)}
                      helperText={touched.phonenumber && errors.phonenumber}
                    /> */}
                    {/* <TextField
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
                  /> */}

                    {/* <TextField
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
                  /> */}
                    {/* <TextField
                    fullWidth
                    variant="outlined"
                    type="email"
                    id="email"
                    name="email"
                    label="Login (Valid EmailID)"
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
                  /> */}

                    {/* <TextField
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
                  /> */}

                    <FormControlLabel
                      sx={{ width: "20px" }}
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
                    <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
                      Default Settings
                    </Typography>

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
                        // Ensure that newValue is defined before accessing properties
                        if (newValue) {
                          setSelectUserName(newValue.Name);
                          setSelectUserID(newValue.RecordID) // Accessing the Name of the selected user group
                          // Assuming newValue has an ID property for the user ID
                        } else {
                          setSelectUserName(null); // Handle case where no value is selected
                          setSelectUserID(null)// Handle case where no value is selected
                        } // Handle null cases gracefully
                      }}
                      label="User Group"
                      url={`${process.env.REACT_APP_BASE_URL}UserGroup/UserGroupListView?CompanyCode=${user.companyCode}`}
                  
                    />
                    <FormikCompanyOptimizedAutocomplete
                      sx={{ gridColumn: "span 2" }}
                      disabled={
                        params.mode === "delete" || params.mode === "view"
                      }
                      name="defaultCompany"
                      id="defaultCompany"
                      value={values.defaultCompany}
                      onChange={(event, newValue) =>{
                        setFieldValue("defaultCompany", newValue);
                        if(newValue){
                        setCompanyCode(newValue.Code);
                        setCompanyId(newValue.RecordID)
                        }else{
                          setCompanyCode(null)
                        }
                      }}
                      required
                      label="Default Company"
                     
                          url={`${process.env.REACT_APP_BASE_URL}PriceBookConfiguration/GetUserGroupAccess?Type=CO&UserGroupID=${UserID}`}
                    />
                   
                    {/* 
                     // url={`${process.env.REACT_APP_BASE_URL}Company`}
                    <FormikSalesPersonOptimizedAutocomplete
                      sx={{ gridColumn: "span 2" }}
                      disabled={
                        params.mode === "delete" || params.mode === "view"
                          ? true
                          : false
                      }
                      name="sales"
                      id="sales"
                      value={values.sales}
                      onChange={(event, newValue) => {
                        setFieldValue("sales", newValue);
                        setselectedSalesName(newValue.Name);
                      }}
                      label="Sales Person Name"
                      url={`${process.env.REACT_APP_BASE_URL}GPRungroup/SalesPerson`}
                    /> */}
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
                      label="Default Price Book Group"
                      url={`${process.env.REACT_APP_BASE_URL}PriceBookDirectory/GetRungroupByCompany?ComapnyID=${companyId || data.CompanyID}`}
                    />
                  </Stack>
                  <Card sx={{ gridColumn: "span 2" }}>
                    <CardContent>
                      <Stack spacing={2} sx={{ alignItems: "center" }}>
                        <div>
                          <Avatar
                            src={
                              previewImages1.length > 0
                                ? previewImages1[0]["preview"]
                                : `data:image/png;base64,${data.UserProfileImage}`
                            }
                            sx={{ height: "80px", width: "80px" }}
                          />
                        </div>
                        <Stack spacing={1} sx={{ textAlign: "center" }}>
                          <Typography variant="h5">
                            {values.firstname} {values.lastname}
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                    <Divider />

                    <CardActions
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <DropZone {...dropzoneProps1.getRootProps()}>
                        <input {...dropzoneProps1.getInputProps()} />
                        <FlexBox alignItems="center" flexDirection="column">
                          <Publish
                            sx={{ color: "text.secondary", fontSize: "48px" }}
                          />
                          {imageList1.length ? (
                            <span>
                              {imageList1.length} images were selected
                            </span>
                          ) : (
                            <span>Upload image</span>
                          )}
                        </FlexBox>
                      </DropZone>
                    </CardActions>
                  </Card>
                </Box>
                {/* <Box
                  sx={{
                    height: 400,
                    gridColumn: "span 4",
                    "& .MuiDataGrid-root": {
                      border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                      borderBottom: "none",
                    },
                    "& .name-column--cell": {
                      color: theme.palette.info.contrastText,
                    },
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: theme.palette.info.main,
                      color: theme.palette.info.contrastText,
                      fontWeight: "bold",
                      fontSize: theme.typography.subtitle2.fontSize,
                    },
                    "& .MuiDataGrid-virtualScroller": {
                      backgroundColor: theme.palette.info.light,
                    },
                    "& .MuiDataGrid-footerContainer": {
                      borderTop: "none",
                      backgroundColor: theme.palette.info.main,
                      color: theme.palette.info.contrastText,
                    },
                    "& .MuiCheckbox-root": {
                      color: "black !important",
                    },

                    "& .MuiCheckbox-root.Mui-checked": {
                      color: "black !important",
                    },
                    "& .MuiDataGrid-row:nth-of-type(even)": {
                      backgroundColor: theme.palette.action.hover,
                    },
                    "& .MuiDataGrid-row:nth-of-type(odd)": {
                      backgroundColor: theme.palette.background.default,
                    },

                    "& .MuiDataGrid-row.Mui-selected:hover": {
                      backgroundColor: `${theme.palette.action.selected} !important`,
                    },
                    "& .MuiTablePagination-root": {
                      color: "white !important", // Ensuring white text color for the pagination
                    },

                    "& .MuiTablePagination-root .MuiTypography-root": {
                      color: "white !important", // Ensuring white text for "Rows per page" and numbers
                    },

                    "& .MuiTablePagination-actions .MuiSvgIcon-root": {
                      color: "white !important", // Ensuring white icons for pagination
                    },
                  }}
                >
                  <DataGrid
                    columnHeaderHeight={dataGridHeaderFooterHeight}
                    sx={{
                      // This is to override the default height of the footer row
                      "& .MuiDataGrid-footerContainer": {
                        height: dataGridHeaderFooterHeight,
                        minHeight: dataGridHeaderFooterHeight,
                      },
                    }}
                    slots={{
                      loadingOverlay: LinearProgress,
                      toolbar: CustomToolbar,
                    }}
                    rowHeight={dataGridRowHeight}
                    rows={rows}
                    columns={columns}
                    disableSelectionOnClick
                    disableRowSelectionOnClick
                    getRowId={(row) => row.RunGroupCode}
                    initialState={{
                      pagination: {
                        paginationModel: { pageSize: dataGridPageSize },
                      },
                    }}
                    pageSizeOptions={dataGridpageSizeOptions}
                    columnVisibilityModel={{
                      item_key: false,
                    }}
                    disableColumnFilter
                    disableColumnSelector
                    disableDensitySelector
                    slotProps={{
                      toolbar: {
                        showQuickFilter: true,
                      },
                    }}
                  />
                </Box> */}
              </Paper>
              <MessageAlertDialog
                logo={`data:image/png;base64,${user.logo}`}
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
                        setSuccessMessage(null);
                        setPostError(null);
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
                        setSuccessMessage(null);
                        setPostError(null);
                      }}
                      autoFocus
                    >
                      No
                    </Button>
                  </DialogActions>
                }
              />
              <MessageAlertDialog
                logo={`data:image/png;base64,${user.logo}`}
                open={OpenUser}
                // tittle={"ALERT"}
                message={`Please select the price book group.`}
                Actions={
                  <DialogActions>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => {
                        setOpenUser(false);
                        // setSubmitting(false);
                      }}
                      autoFocus
                    >
                      Close
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
        logo={`data:image/png;base64,${user.logo}`}
        open={openAlert}
        error={postError}
        message={postError ? postError : successMessage}
        Actions={
          params.mode === "add" ? (
            <DialogActions>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  navigate("/pages/security/user");
                  setSuccessMessage(null);
                  setPostError(null);
                }}
              >
                Back to User
              </Button>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  dispatch(getUserData({ ID: 0 }));
                  setPreviewImages1([]);
                  setOpenAlert(false);
                  setSuccessMessage(null);
                  setPostError(null);
                }}
                autoFocus
              >
                Add New User
              </Button>
            </DialogActions>
          ) : (
            <DialogActions>
              {user.email !== data.Email ? (
                <Button
                  variant="contained"
                  color="info"
                  size="small"
                  onClick={() => {
                    navigate("/pages/security/user");
                    setSuccessMessage(null);
                    setPostError(null);
                  }}
                >
                  Back to User
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="info"
                  size="small"
                  onClick={() => {
                    // Add your logout logic here
                    navigate("/session/signin");
                    setSuccessMessage(null);
                    setPostError(null);
                  }}
                >
                  Logout
                </Button>
              )}
            </DialogActions>
          )
        }

        // Actions={
        //   params.mode === "add" ? (
        //     <DialogActions>
        //       <Button
        //         variant="contained"
        //         color="info"
        //         size="small"
        //         onClick={() => navigate("/pages/security/user")}
        //       >
        //         Back to User
        //       </Button>
        //       <Button
        //         variant="contained"
        //         color="info"
        //         size="small"
        //         onClick={() => {
        //           dispatch(getUserData({ ID: 0 }));
        //           setPreviewImages1([]);
        //           setOpenAlert(false);
        //         }}
        //         autoFocus
        //       >
        //         Add New User
        //       </Button>
        //     </DialogActions>
        //   ) : (
        //     <DialogActions>
        //       <Button
        //         variant="contained"
        //         color="info"
        //         size="small"
        //         onClick={() => navigate("/pages/security/user")}

        //       >
        //         Back to user
        //       </Button>
        //     </DialogActions>
        //   )
        // }
      />
    </Container>
  );
};

export default UserEdit;
