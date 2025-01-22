import * as React from "react";
// import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import { Box, styled, TextField } from "@mui/material";
import { getUserData } from "app/redux/slice/getSlice";
import { userPost } from "app/redux/slice/postSlice";
import useAuth from "app/hooks/useAuth";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { convertHexToRGB } from "app/utils/constant";
import { FlexAlignCenter, FlexBox } from "app/components/FlexBox";
import { Publish } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import { PriceGroupAlertApiDialog } from "app/components/LoadindgDialog";
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
const DropZone = styled(FlexAlignCenter)(({ isDragActive, theme }) => ({
  height: 70,
  width: "30%",
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
// import { AccountDetailsForm } from '@/components/dashboard/account/account-details-form';
// import { AccountInfo } from '@/components/dashboard/account/account-info';

export default function Page() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.getSlice.userFormData);
  console.log("🚀 ~ UserEdit ~ data:", data);

  const { user } = useAuth();
  const status = useSelector((state) => state.getSlice.userStatus);

  const error = useSelector((state) => state.getSlice.userError);

  ///===========API CALL GET============================//
  useEffect(() => {
    dispatch(getUserData({ ID: user.id }));
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

  const [postError, setPostError] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const HandleSave = async (values) => {
    const image = previewImages1[0]["preview"];
    const images = image.split(",");
    const userData = {
      recordID: user.id,
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
      UserProfileImage: previewImages1.length > 0 ? images[1] : user.avatar,
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
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4"></Typography>
      </div>
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
          //   validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              HandleSave(values, setSubmitting);
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
<Card sx={{ borderRadius: "8px", border: "2px solid black" }}>
<Box sx={{ gridColumn: "span 4" }}>
    <Typography sx={{fontSize:"20px",fontWeight:"bold" ,ml:5}}>Profile</Typography>
  </Box>
  <CardContent>
    <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
      {/* First Stack: Profile Picture */}
      <Stack spacing={2} alignItems="center" sx={{ flex: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
  {/* Avatar */}
  <Avatar
    src={
      previewImages1.length > 0
        ? previewImages1[0]["preview"]
        : `data:image/png;base64,${user.avatar}`
    }
    sx={{ height: "100px", width: "100px" }}
  />
  
  {/* Name and Role */}
  <Stack spacing={0.5} sx={{ alignItems: "flex-start" }}>
    <Typography variant="h5">
      {values.firstname} {values.lastname}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {user.role}
    </Typography>
  </Stack>
</Box>

        <DropZone {...dropzoneProps1.getRootProps()} sx={{ textAlign: "center" }}>
          <input {...dropzoneProps1.getInputProps()} />
          <Publish sx={{ color: "text.secondary", fontSize: "48px" }} />
          <Typography variant="body2">
            {imageList1.length ? `${imageList1.length} images selected` : "Upload image"}
          </Typography>
        </DropZone>
      </Stack>

      <Stack spacing={1} sx={{ flex: 1, alignItems: "center",marginLeft: 6  }}>
      <Stack spacing={2} sx={{ flex: 1, alignItems: "flex-start" }}>
  <Typography variant="body1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <MailOutlineIcon sx={{ color: "black" }} />
    <strong>Email:</strong>
  </Typography>
  <Typography variant="body2" sx={{ marginLeft: "32px" }}>
    {user.email || "Add an email"}
  </Typography>

  <Typography variant="body1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <PhoneAndroidIcon sx={{ color: "black" }} />
    <strong>Phone:</strong>
  </Typography>
  <Typography variant="body2" sx={{ marginLeft: "32px" }}>
    {user.phone1}
  </Typography>

  {/* <Typography variant="body1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <PhoneAndroidIcon sx={{ color: "black" }} />
    <strong>Mobile:</strong>
  </Typography>
  <Typography variant="body2" sx={{ marginLeft: "32px" }}>
    {"Add a mobile"}
  </Typography> */}
</Stack>

      </Stack>
    </Box>
  </CardContent>
</Card>



              <PriceGroupAlertApiDialog
                logo={`data:image/png;base64,${user.logo}`}
                key={23131}
                open={openAlert}
                error={postError}
                message={"Image Uploaded Successfully"}
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
                      }}
                      sx={{ height: 25 }}
                    >
                      Close
                    </Button>
                  </Box>
                }
              />
            </form>
          )}
        </Formik>
      ) : (
        false
      )}
    </Stack>
  );
}
{/* Uncomment these if needed */}
          {/* <TextField
              fullWidth
              variant="outlined"
              type="text"
              id="mobilenumber"
              name="mobilenumber"
              label="Mobile"
              size="small"
              disabled
              value={values.mobilenumber}
              sx={{ flex: "1 1 calc(50% - 12px)" }}
            />
            <TextField
              fullWidth
              variant="outlined"
              type="email"
              id="email"
              name="email"
              label="Email"
              size="small"
              value={values.email}
              disabled
              sx={{ flex: "1 1 calc(50% - 12px)" }}
            /> */}