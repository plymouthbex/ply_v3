import React, { useEffect, useState } from "react";
import {
  Paper,
  Button,
  Box,
  styled,
  useTheme,
  useMediaQuery,
  FormControlLabel,
  TextField,
  Checkbox,
  Typography,
  Stack,
  Autocomplete,
  LinearProgress,
  DialogActions,
  Tooltip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  FormGroup,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Breadcrumb } from "app/components";
import {
  dataGridHeight,
  dataGridRowHeight,
  dataGridHeaderFooterHeight,
} from "app/utils/constant";
// ******************** ICONS ******************** //
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Add, AddAlertOutlined, RefreshOutlined } from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Formik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import * as Yup from "yup";
import { FlexAlignCenter, FlexBox } from "app/components/FlexBox";
import { convertHexToRGB } from "app/utils/constant";
import { useDropzone } from "react-dropzone";
import Publish from "@mui/icons-material/Publish";
import {
  FormikCustomSelectProvider,
  FormikOptimizedAutocomplete,
  PGOptimizedAutocomplete,
} from "app/components/SingleAutocompletelist";
import { useDispatch, useSelector } from "react-redux";
import {
  configureAddedPriceList,
  getConfigContact,
  getConfigPriceBook,
} from "app/redux/slice/getSlice";
import {
  ConfigurepriceListClear,
  deleteConfigContact,
  postConfigContact,
  postConfigureCompany,
  PostConfigurePriceListID,
  putConfigContact,
} from "app/redux/slice/postSlice";
import lodash from "lodash";
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
const ContactEdit = () => {
  // ******************** HOOKS AND CONSTANTS ******************** //
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const State = location.state;
  console.log("🚀 ~ ContactEdit ~ State:", State);


  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .max(60, "Name must be at most 60 characters"),
  
  //  phonenumber: Yup.string()
  //          .matches(/^\(\d{3}\) \d{3}-\d{4}$/, "Phone number must be in the format (XXX) XXX-XXXX")
  //          .required("Phone number is required"),
    email: Yup.string()
      .email("Must be a valid email")
      .required("Email is required"),
  });
  // ******************** LOCAL STATE ******************** //

  const [addPriceListData, setAddPriceListData] = useState(null);
  const [isPriceListExists, setIsPriceListExists] = useState(false);
  const [isPriceListExistsError, setIsPriceListExistsError] = useState(false);
  const [isRemovePriceList, setIsRemovePriceList] = useState(false);
  const [removePriceListdDesc, setremovePriceListDesc] = useState("");
  const [postError, setPostError] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [removePriceListID, setremovePriceListID] = useState(0);
  // ******************** REDUX STATE ******************** //

  const data = useSelector((state) => state.getSlice.getConfigContactData);
  console.log("🚀 ~ ContactEdit ~ data:", data)
  const loading = useSelector(
    (state) => state.getSlice.getConfigContactLoading
  );
  const status = useSelector((state) => state.getSlice.getConfigContactStatus);
  const error = useSelector((state) => state.getSlice.getConfigContactError);

  //==================================GETAPI=====================================//
  useEffect(() => {
    dispatch(getConfigContact({ RecordID: State.RecordID }));
  }, [dispatch]);
  // ********************** COLUMN ********************** //

  //====================================================================================//

  const handleSave = async (values, setSubmitting) => {
    const data1 = {
      RecordID: data.RecordID,
      CustomerNumber: State.CustomerNumber,
      CompanyCode: State.CompanyCode,
      PreferedMail: values.preferedMail ? "1" : "0",
      PreferedMobile: values.preferedMobile ? "1" : "0",
      Email: values.email,
      Phone: values.phonenumber,
      Provider: values.provider,
      FirstName: values.firstName,
      LastName: values.lastName,
      Disable: values.disable ? "1" : "0",
    };
    const response = await dispatch(
      params.mode === "add" ? postConfigContact(data1) : putConfigContact(data1)
    );
    if (response.payload.status === "Y") {
      setOpenAlert(true);
      // if (params.mode === "add") {
      //   dispatch(getConfigContact({ RecordID: response.payload.RecordID }));
      // }
    } else {
      setOpenAlert(true);
      setPostError(true);
    }
    setSubmitting(false);
  };

  const handleDelete = async (values, setSubmitting) => {
    const response = await dispatch(
      deleteConfigContact({ RecordID: data.RecordID })
    );
    if (response.payload.status === "Y") {
      setOpenAlert(true);
    } else {
      setOpenAlert(true);
      setPostError(true);
    }
  };

  return (
    <Container>
      {status === "fulfilled" && !error ? (
        <Formik
          initialValues={{
            email: data.Email,
            firstName: data.FirstName,
            lastName: data.LastName,
            provider: data.Provider,
            sequence: data.Sequence,
            phonenumber: data.Phone,
            preferedMail: data.PreferedMail === "1" ? true : false,
            preferedMobile: data.PreferedMobile === "1" ? true : false,
            disable: data.Disable === "1" ? true : false,
          }}
          validationSchema={params?.mode === "delete" ? null : validationSchema}
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting }) => {
            if (params.mode === "delete") {
              setIsRemovePriceList(true);
            } else handleSave(values, setSubmitting);
            console.log("🚀 ~ ContactEdit ~ values:", values);

            // resetForm();
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
            resetForm,
            setFieldValue,
            setSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="breadcrumb">
                <Breadcrumb
                  routeSegments={[
                    { name: "Price Book" },
                    {
                      name: "Contact Directory",
                      path: "/pages/pricing-portal/contact-directory",
                    },
                    { name: "Contacts",path:-1 },
                    { name: `${params.mode} Contact` },
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
                    onClick={() => navigate(-1)}
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
                  {/* {(params.mode === "edit-Contact" ||
                    params.mode === "add-Contact") && (
                    <Stack
                      sx={{ gridColumn: "span 4" }}
                      direction="row"
                      gap={1}
                    >
                      <Typography fontSize={"16px"}>
                        <Typography
                          component="span"
                          fontSize={"16px"}
                          fontWeight="bold"
                        >
                          Company:
                        </Typography>{" "}
                        {State.Configure.address.company.Code} ||{" "}
                        {State.Configure.address.company.Name}
                        <Typography
                          component="span"
                          fontWeight="bold"
                          fontSize={"16px"}
                        >{` >> `}</Typography>
                      </Typography>

                      <Typography fontSize={"16px"}>
                        <Typography
                          component="span"
                          fontSize={"16px"}
                          fontWeight="bold"
                        >
                          Customer:
                        </Typography>{" "}
                        {State.Configure.address.Code} ||{" "}
                        {State.Configure.address.Name}
                        <Typography
                          component="span"
                          fontWeight="bold"
                          fontSize={"16px"}
                        >{` >> `}</Typography>
                      </Typography>
                      <Typography fontSize={"16px"}>
                        <Typography
                          component="span"
                          fontSize={"16px"}
                          fontWeight="bold"
                        >
                          Address:
                        </Typography>{" "}
                        {State.Configure.Code} || {State.Configure.Name}
                      </Typography>
                    </Stack>
                  )} */}
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="firstName"
                    name="firstName"
                    label="Fisrt Name"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    required
                    autoComplete="off"
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.firstName && !!errors.firstName}
                    helperText={touched.firstName && errors.firstName}
                    InputLabelProps={{
                      sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                    }}
                    disabled={params?.mode === "delete"}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    autoComplete="off"
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.lastName && !!errors.lastName}
                    helperText={touched.lastName && errors.lastName}
                    disabled={params?.mode === "delete"}
                  />

                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="phonenumber"
                    name="phonenumber"
                    label="Mobile"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    value={values.phonenumber}
                    disabled={params?.mode === "delete"}
                    autoComplete="off"
                    //onChange={handleChange}
                    // InputLabelProps={{
                    //   sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                    // }}
                    onChange={(e) => {
                      const formattedPhone = formatPhoneNumber(e.target.value);
                      handleChange({
                        target: {
                          name: e.target.name,
                          value: formattedPhone,
                        },
                      });
                    }}
                    onBlur={handleBlur}
                    error={touched.phonenumber && Boolean(errors.phonenumber)}
                    helperText={touched.phonenumber && errors.phonenumber}
                    // required
                  />
 < FormikCustomSelectProvider
                    name="provider"
                    id="provider"
                    sx={{ gridColumn: "span 2" }}
                    value={values.provider}
                    onChange={handleChange}
                    label="Service Provider"
                    url={`${process.env.REACT_APP_BASE_URL}ProviderDropDown`}
                    disabled={params?.mode === "delete"}
                  />
                  {/* <FormControl
                    sx={{ gridColumn: "span 2" }}
                    fullWidth
                    size="small"
                  >
                    <InputLabel id="demo-simple-select-label">
                      Service Provider
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      value={values.provider}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      id="provider"
                      name="provider"
                      label="Price Book Type"
                    >
                      <MenuItem value={"AT&T"}>AT&T</MenuItem>
                      <MenuItem value={"V"}>Verizon</MenuItem>
                      <MenuItem value={"TM"}>T-Mobile</MenuItem>
                    </Select>
                  </FormControl> */}
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="email"
                    id="email"
                    name="email"
                    label="Email"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    autoComplete="off"
                    required
                    InputLabelProps={{
                      sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                    }}
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    disabled={params?.mode === "delete"}
                  />
                  <FormControl
                    sx={{ gridColumn: "span 2" }}
                    component="fieldset"
                    variant="standard"
                  >
                    <FormLabel focused={false} component="legend">
                      Preferred Communication
                    </FormLabel>
                    <Stack direction="row" gap={2}>
                      <FormControlLabel
                        disabled={params?.mode === "delete"}
                        control={
                          <Checkbox
                            id="preferedMail"
                            name="preferedMail"
                            checked={values.preferedMail}
                            onChange={handleChange}
                          />
                        }
                        label="Email"
                      />
                      <FormControlLabel
                        disabled={params?.mode === "delete"}
                        control={
                          <Checkbox
                            id="preferedMobile"
                            name="preferedMobile"
                            checked={values.preferedMobile}
                            onChange={handleChange}
                          />
                        }
                        label="Mobile"
                      />
                    </Stack>
                  </FormControl>
                  {/* <Stack sx={{ gridColumn: "span 2" }} direction="row" gap={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.pec}
                          onChange={handleChange}
                          sx={{ height: "10px" }}
                          disabled={
                            params.mode === "delete" || params.mode === "view"
                          }
                          size="small"
                          id="pec"
                          name="pec"
                        />
                      }
                      label="Preferred Email Communication"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          id="pmc"
                          name="pmc"
                          checked={values.pmc}
                          onChange={handleChange}
                          sx={{ height: "10px" }}
                          disabled={
                            params.mode === "delete" || params.mode === "view"
                          }
                        />
                      }
                      label="Preferred Mobile Communication"
                    />
                  </Stack> */}

                  <FormControlLabel
                  
                    control={
                      <Checkbox
                        size="small"
                        id="disable"
                        name="disable"
                        checked={values.disable}
                        onChange={handleChange}
                        sx={{ height: "10px" }}
                      />
                    }
                    label="Disable"
                  />
                  {/* {params.mode === 'delete' ? <Typography color="error">IN PROGRESS</Typography>: false} */}
                </Box>
              </Paper>
              <MessageAlertDialog
                open={isRemovePriceList}
                tittle={removePriceListdDesc}
                message={`Are you sure you want to delete contact ?`}
                Actions={
                  <DialogActions>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => {
                        handleDelete(values, setSubmitting);
                        setIsRemovePriceList(false);
                      }}
                    >
                      Yes
                    </Button>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => {
                        setIsRemovePriceList(false);
                      }}
                    >
                      No
                    </Button>
                  </DialogActions>
                }
              />
              <MessageAlertDialog
                open={isPriceListExists}
                tittle={
                  addPriceListData
                    ? addPriceListData.PRICELISTDESCRIPTION
                    : "Please select price list!"
                }
                message={
                  "Oops! This price list is already exists in print group."
                }
                Actions={
                  <DialogActions>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => {
                        setIsPriceListExists(false);
                        setAddPriceListData(null);
                      }}
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
        open={openAlert}
        error={postError}
        message={
          postError
            ? "Something went wrong and please retry"
            : params.mode === "add"
            ? "Contact added successfully"
            : params.mode === "delete"
            ? "Contact deleted successfully"
            : "Contact updated successfully"
        }
        Actions={
          <DialogActions>
            <Button
              variant="contained"
              color="info"
              size="small"
              onClick={() => {
                setOpenAlert(false);
                navigate(-1)
              }}
            >
              Back
            </Button>
          </DialogActions>
        }
      />
    </Container>
  );
};

export default ContactEdit;

const priceBookLevels = [
  { id: 1, level: "Price Book Level 1" },
  { id: 2, level: "Price Book Level 2" },
  { id: 3, level: "Price Book Level 3" },
  { id: 4, level: "Price Book Level 4" },
  { id: 5, level: "Price Book Level 5" },
  { id: 6, level: "Price Book Level 6" },
  { id: 7, level: "Price Book Level 7" },
  { id: 8, level: "Price Book Level 8" },
  { id: 9, level: "Price Book Level 9" },
  { id: 10, level: "Price Book Level 10" },
];
