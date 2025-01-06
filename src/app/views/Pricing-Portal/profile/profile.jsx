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

const DropZone = styled(FlexAlignCenter)(({ isDragActive, theme }) => ({
  height: 70,
  width: "100%",
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
              <Grid container spacing={3}>
                <Grid lg={4} md={6} xs={12}>
                  <Card>
                    <CardContent>
                      <Stack spacing={2} sx={{ alignItems: "center" }}>
                        <div>
                          <Avatar
                            src={
                              previewImages1.length > 0
                                ? previewImages1[0]["preview"]
                                : `data:image/png;base64,${user.avatar}`
                            }
                            sx={{ height: "80px", width: "80px" }}
                          />
                        </div>
                        <Stack spacing={1} sx={{ textAlign: "center" }}>
                          <Typography variant="h5">
                            {values.firstname}
                            {values.lastname}
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                    <Divider />
                    <CardActions>
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
                </Grid>
                <Grid lg={8} md={6} xs={12}>
                  <Card>
                    <CardHeader
                      // subheader="The information can be edited"
                      title="Profile"
                    />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid md={6} xs={12}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            type="text"
                            id="firstname"
                            name="firstname"
                            label="First Name"
                            size="small"
                            disabled={true}
                            value={values.firstname}
                          />
                        </Grid>
                        <Grid md={6} xs={12}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            type="text"
                            id="lastname"
                            name="lastname"
                            label="Last Name"
                            size="small"
                            disabled={true}
                            value={values.lastname}
                          />
                        </Grid>
                        <Grid md={6} xs={12}>
                          {/* <TextField
                              fullWidth
                              variant="outlined"
                              type="text"
                              id="mobilenumber"
                              name="mobilenumber"
                              label="Mobile"
                              size="small"
                              disabled={true}
                              value={values.mobilenumber}
                            /> */}
                        </Grid>
                        <Grid md={6} xs={12}>
                          {/* <TextField
                              fullWidth
                              variant="outlined"
                              type="email"
                              id="email"
                              name="email"
                              label="Email"
                              size="small"
                              value={values.email}
                              disabled={true}
                            /> */}
                        </Grid>
                      </Grid>
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ justifyContent: "flex-end" }}>
                      <Button color="info" type="submit" variant="contained">
                        Save
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>

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
