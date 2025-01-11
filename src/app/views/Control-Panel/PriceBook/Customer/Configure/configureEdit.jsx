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
} from "@mui/material";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Breadcrumb } from "app/components";
import Cover from "../../../../../../assets/plylogo.png";
import { dataGridHeight, dataGridRowHeight,dataGridHeaderFooterHeight } from "app/utils/constant";
// ******************** ICONS ******************** //
import VisibilityIcon from '@mui/icons-material/Visibility';
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
import { FormikOptimizedAutocomplete, PGOptimizedAutocomplete } from "app/components/SingleAutocompletelist";
import { useDispatch, useSelector } from "react-redux";
import { configureAddedPriceList, getConfigPriceBook } from "app/redux/slice/getSlice";
import { ConfigurepriceListClear, postConfigureCompany, PostConfigurePriceListID } from "app/redux/slice/postSlice";
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
// ******************** Image ******************** //
const ImageWrapper = styled("div")(({ previewImage }) => ({
  width: '100%',
  height: 100, // Reduced height
  minHeight: '50px', // Adjust minimum height as needed
  maxHeight: '200px', // Adjust maximum height as needed
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
  border: `2px dashed rgba(${convertHexToRGB(theme.palette.text.primary)}, 0.3)`,
  "&:hover": {
    background: `rgb(${convertHexToRGB(theme.palette.text.primary)}, 0.2) !important`,
  },
  background: isDragActive ? "rgb(0, 0, 0, 0.15)" : "rgb(0, 0, 0, 0.01)",
}));


// ******************** Validation Schema ******************** //
const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(60, "Name must be at most 60 characters"),

  phonenumber: Yup.string()
    .matches(/^\(\d{3}\) \d{3}-\d{4}$/, "Phone number must be in the format (XXX) XXX-XXXX")
    .required("Phone number is required"),

  email: Yup.string()
    .email("Must be a valid email")
    .required("Email is required"),
});


// ******************** Price List Edit SCREEN  ******************** //
const ConfigureEdit = () => {
  // ******************** HOOKS AND CONSTANTS ******************** //
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const State = location.state;
  console.log("🚀 ~ ConfigureEdit ~ State:", State.RecordID)

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


  const data = useSelector((state) => state.getSlice.getconfigureData);
  console.log("🚀 ~ ConfigureCompanyEdit ~ data:", data)
  const getRows = useSelector((state) => state.getSlice.configurePriceListGetData);
  console.log("🚀 ~ ConfigureEdit ~ getRows:", getRows)

  const addedRows = useSelector((state) => state.getSlice.configurePriceListAddedData);

  const getRowsSet = new Set(getRows.map((item) => item.PRICELISTID));
  const filteredSelectedItems = getRows.filter(
    (selectedItem) => !getRowsSet.has(selectedItem.PRICELISTID)
  );

  const loading = useSelector((state) => state.getSlice.getconfigureLoading);
  const status = useSelector((state) => state.getSlice.getconfigureStatus);
  const error = useSelector((state) => state.getSlice.getconfigureError);








  const handleSelectionAddPriceListData = (newValue) => {
    setAddPriceListData(newValue);
  };
  //==================================GETAPI=====================================//
  useEffect(() => {
    dispatch(getConfigPriceBook({ ID: State.RecordID }));
  }, [dispatch]);
  // ********************** COLUMN ********************** //




  const columns = [
    {
      headerName: "Price List Name",
      field: "PRICELISTID",
      width: "170",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Price List Description",
      field: "PRICELISTDESCRIPTION",
      width: "300",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    // {
    //   headerName: "Print Group",
    //   field: "GroupCode",
    //   width: "100",
    //   align: "right",
    //   headerAlign: "center",
    //   hide: false,
    // },
    {
      field: "Action",
      headerName: "Action",
      minWidth: 200,
      flex: 1,
      sortable: false,
      headerAlign: "center",
      filterable: false,
      disableColumnMenu: true,
      disableExport: true,
      align: "center",

      renderCell: (param) => {
        return (
          <Box gap={1}>
             <Tooltip title="View Items">
    <IconButton
      color="black"
      size="small"
      onClick={() => {
        navigate("/pages/control-panel/configure-price-book/price-list-items/customer", {
          state: {
            id: param.row.PRICELISTID,
          },
        });
      }}
    >
      <VisibilityIcon fontSize="small" />
    </IconButton>
  </Tooltip>

  <Tooltip title="Remove Items">
    <IconButton
      color="error"
      size="small"
      onClick={() => {
        setremovePriceListID(param.row.PRICELISTID);
        setremovePriceListDesc(param.row.PRICELISTDESCRIPTION);
        setIsRemovePriceList(true);
      }}
    >
      <DeleteIcon fontSize="small" />
    </IconButton>
  </Tooltip>
          </Box>
        );
      },
    },
  ];
  const rows = [
    {
      PRICELISTID: "GOATS",
      PRICELISTDESCRIPTION: "Goats"
    },
    {
      PRICELISTID: "Hemple",
      PRICELISTDESCRIPTION: "Hemple"
    },
    {
      PRICELISTID: "MDA",
      PRICELISTDESCRIPTION: "Smart Chicken"
    }
  ]
  function CustomToolbar() {
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
          <PGOptimizedAutocomplete
            errors={isPriceListExistsError}
            helper={isPriceListExistsError && "Please select price list!"}
            disabled={params.mode === "delete" || params.mode === "view"}
            name="addPriceList"
            id="addPriceList"
            value={addPriceListData}
            onChange={handleSelectionAddPriceListData}
            label="Add Price List"
            url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=PriceList`}
          />

<Tooltip title="Add">
  <IconButton
    disabled={params.mode === "delete" || params.mode === "view"}
    color="black"
    size="small"
    onClick={() => {
      if (addPriceListData) {
        const isItem = [...getRows, ...filteredSelectedItems].some(
          (item) =>
            lodash.isEqual(item.PRICELISTID, addPriceListData.PRICELISTID)
        );
        if (isItem) {
          setIsPriceListExists(true);
          setTimeout(() => {
            setIsPriceListExists(false);
            setAddPriceListData(null);
          }, 5000);
          return;
        }
        dispatch(configureAddedPriceList(addPriceListData));
        setAddPriceListData(null);
      } else {
        setIsPriceListExistsError(true);
        setTimeout(() => {
          setIsPriceListExistsError(false);
        }, 2000);
      }

      const pricedata = {
        recordID: data.RecordID,
        priceListID: addPriceListData.PRICELISTID,
      };
      const response = dispatch(PostConfigurePriceListID({ pricedata }));
    }}
  >
    <Add />
  </IconButton>
</Tooltip>

        </Box>
      </GridToolbarContainer>
    );
  }
  console.log("🚀 ~ handleSave ~ params.mode:", params.mode)

  //====================================================================================//

  const handleSave = async (values) => {


    let Classification;
    let companyID;
    let companyCode;
    let customerNumber;
    let customerName;
    let addressCode;
    let address1;

    if (params.mode === "add-Contact") {
      
      Classification = "CT";
      companyID = 5;
      companyCode = State.Configure.address.company.Code;
      customerNumber = State.Configure.address.Code;
      customerName = State.Configure.address.Name;
      addressCode = State.Configure.Code;
      address1 = State.Configure.Name;
    } else {
      Classification = data.Classification;
      companyID = data.CompanyID;
      companyCode = data.CompanyCode;
      customerNumber = data.CustomerNumber;
      customerName = data.CustomerName;
      addressCode = data.AddressCode;
      address1 = data.Address1;
    }

    const Cdata = {

      "recordID": data.RecordID,
      "classification": Classification,
      "companyID": companyID,
      "companyCode": companyCode,
      "customerNumber": customerNumber,
      "customerName": customerName,
      "addressCode": addressCode,
      "address1": address1,
      "contactName": values.name,
      "city": "",
      "state": "",
      "zip": "",
      "emailId": values.email,
      "preferedDeliveryEmail": values.pec ? "1" : "0",
      "Phone": values.phonenumber,
      "preferedDeliveryMobile": values.pmc ? "1" : "0",
      "provider": values.provider,
      "fullPriceBookPdf": values.cfpbpdf ? "1" : "0",
      "fullPriceBookExcel": values.cfpbexcel ? "1" : "0",
      "customPriceBookPdf": values.ccpbpdf ? "1" : "0",
      "customPriceBookExcel": values.ccpbexcel ? "1" : "0",
      "rungroup": data.Rungroup,
      "fullPriceBookTitle": values.cfpbtitle,
      "customPriceBookTitle": values.ccpbtitle,
      "tableID": "",
      "imageID": "",
      "sequence": values.sequence,
      "disable": values.disable ? "1" : "0",
      "createdDateTime": "",
      "lastModified": "",
      "createdBy": "",
      "modifiedBy": "",
      "pC_LASTRUNUSER": "",
      "pC_LASTRUNDATETIME": "",
      "priceLevel": 0,
      "fullPriceBook": "",
      "customPriceBook": ""
    };
    console.log("🚀 ~ handleSave ~ CData:", Cdata)
    const response = await dispatch(postConfigureCompany({ Cdata }));
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
            RecordID: data.RecordID,
            email: data.EmailId,
            name: data.ContactName,
            provider: data.Provider,
            sequence: data.Sequence,
            phonenumber: data.Phone,
            // pdf:data.,
            // excel:data.,
            disable: data.Disable === "1" ? true : false,
            ccpbtitle: data.CustomPriceBookTitle,
            ccpbpdf: data.CustomPriceBookPdf === "1" ? true : false,
            ccpbexcel: data.CustomPriceBookExcel === "1" ? true : false,
            cfpbtitle: data.FullPriceBookTitle,
            cfpbpdf: data.FullPriceBookPdf === "1" ? true : false,
            cfpbexcel: data.FullPriceBookExcel === "1" ? true : false,
            pmc: data.PreferedDeliveryEmail === "1" ? true : false,
            pec: data.PreferedDeliveryMobile === "1" ? true : false,
          }}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={(values, { resetForm }) => {
            console.log("Form submitted with values:", values);
            handleSave(values);
            resetForm();
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
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="breadcrumb">
                <Breadcrumb
                  routeSegments={[
                    { name: "Configure Price Book Type", path: "/pages/control-panel/configure-price-book/company" },
                    { name: "Customer", path: "/pages/control-panel/configure-price-book/customer" },
                    { name: `${params.mode} Configure Price Book` },
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
                  {params.mode === "edit-Customer" && (
                    <Stack sx={{ gridColumn: "span 4" }} direction="row" gap={1}>


                      <Typography fontSize={"16px"}>
                        <Typography component="span" fontSize={"16px"} fontWeight="bold">Company:</Typography> {State.company.Code} || {State.company.Name}
                        <Typography component="span" fontWeight="bold" fontSize={"16px"}>{` >> `}</Typography>
                      </Typography>
                      <Typography fontSize={"16px"}>
                        <Typography component="span" fontSize={"16px"} fontWeight="bold">Customer:</Typography> {State.Code} || {State.Name}
                      </Typography>

                    </Stack>
                  )}
                  {params.mode === "edit-Address" && (
                    <Stack sx={{ gridColumn: "span 4" }} direction="row" gap={1}>



                      <Typography fontSize={"16px"}>
                        <Typography component="span" fontSize={"16px"} fontWeight="bold">Company:</Typography> {State.address.company.Code} || {State.address.company.Name}<Typography component="span" fontWeight="bold" fontSize={"16px"}>{` >> `}</Typography>
                      </Typography>

                      <Typography fontSize={"16px"}>
                        <Typography component="span" fontSize={"16px"} fontWeight="bold">Customer:</Typography> {State.address.Code} || {State.address.Name}
                        <Typography component="span" fontWeight="bold" fontSize={"16px"}>{` >> `}</Typography>
                      </Typography>
                      <Typography fontSize={"16px"}>
                        <Typography component="span" fontSize={"16px"} fontWeight="bold">Address:</Typography> {State.Code} || {State.Name}
                      </Typography>

                    </Stack>
                  )}

                  {(params.mode === "edit-Contact" || params.mode === "add-Contact") && (
                    <Stack sx={{ gridColumn: "span 4" }} direction="row" gap={1}>



                      <Typography fontSize={"16px"}>
                        <Typography component="span" fontSize={"16px"} fontWeight="bold">Company:</Typography> {State.Configure.address.company.Code} || {State.Configure.address.company.Name}
                        <Typography component="span" fontWeight="bold" fontSize={"16px"}>{` >> `}</Typography>
                      </Typography>

                      <Typography fontSize={"16px"}>
                        <Typography component="span" fontSize={"16px"} fontWeight="bold">Customer:</Typography> {State.Configure.address.Code} || {State.Configure.address.Name}
                        <Typography component="span" fontWeight="bold" fontSize={"16px"}>{` >> `}</Typography>
                      </Typography>
                      <Typography fontSize={"16px"}>
                        <Typography component="span" fontSize={"16px"} fontWeight="bold">Address:</Typography> {State.Configure.Code} || {State.Configure.Name}
                      </Typography>

                    </Stack>
                  )}
                  {/* <Typography fontSize={"16px"} fontWeight={"bold"}>
            Company:PM || Plymouth
          </Typography>
          <Typography fontSize={"16px"} fontWeight={"bold"}>
            Customer:123456 || TestCustomer
          </Typography>
          {["editAddress", "editContact", "addContact"].includes(params.mode) && (
   <Typography fontSize={"16px"} fontWeight={"bold"}>Address:BILLINGb||123 Jedi Lane SW || Suite 66</Typography>
)} */}






                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="name"
                    name="name"
                    label="Contact Name"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    required
                     autoComplete="off"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.code && !!errors.code}
                    helperText={touched.name && errors.name}
                    InputLabelProps={{
                      sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                    }}
                  />
                  <FormikOptimizedAutocomplete
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
                    label="Run Group"
                    url={`${process.env.REACT_APP_BASE_URL}PriceBookDirectory/GetRungroupByCompany?CompanyCode=PM`} />

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
                     autoComplete="off"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.phonenumber && Boolean(errors.phonenumber)}
                    helperText={touched.phonenumber && errors.phonenumber}
                  />

<FormControl
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
                  </FormControl>
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
                  />
                    <Autocomplete
                   sx={{ gridColumn: "span 2" }}
                                      fullWidth
                                      id="priceBookLevels"
                                      name="priceBookLevels"
                                      // Map through priceBookLevels to get the 'level' values for the options list
                                      options={priceBookLevels.map((levelObj) => levelObj.level)}
                                      disabled={params?.mode === "delete"}
                  
                                      // Set the value by finding the corresponding 'level' based on the id stored in Formik's values
                                      value={priceBookLevels.find((levelObj) => levelObj.id === values.priceBookLevels)?.level || ""}
                  
                                      onChange={(event, newValue) => {
                                        // Find the corresponding 'id' based on the selected 'level' value
                                        const selectedLevel = priceBookLevels.find((levelObj) => levelObj.level === newValue);
                  
                  
                                        handleChange({
                                          target: { name: "priceBookLevels", value: selectedLevel?.id || null }, // If no match, set to null
                                        });
                                      }}
                  
                                      onBlur={handleBlur}
                                      disableClearable
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          label="Price Book Level"
                                          size="small"
                                          sx={{ gridColumn: "span 2" }}
                                        />
                                      )}
                                    />
                  <Stack
                    sx={{ gridColumn: "span 2" }}
                    direction="row"
                    gap={2}
                  >
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
                  </Stack>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        id="disable"
                        name="disable"
                        checked={values.disable}
                        // disabled={true}
                        onChange={handleChange}
                        sx={{ height: "10px" }}
                      // disabled={
                      //   true
                      // }
                      />
                    }
                    label="Disable"
                  />
                </Box>
                {params.mode === 'edit-Customer' && (
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
                    <Stack sx={{ gridColumn: "span 2" }} direction="column" gap={2}>
                      <Typography fontSize={"14px"} fontWeight={"bold"}>Customer Full Price Book</Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="text"
                        id="cfpbtitle"
                        name="cfpbtitle"
                        label="PriceBook Title"
                        size="small"
                        sx={{ gridColumn: "span 2" }}
                        value={values.cfpbtitle}
                        onChange={handleChange}
                        onBlur={handleBlur}
 autoComplete="off"
                      />

                      <Stack
                        sx={{ gridColumn: "span 1" }}
                        direction="row"
                        gap={2}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={values.cfpbpdf}
                              onChange={handleChange}
                              sx={{ height: "10px" }}
                              disabled={
                                params.mode === "delete" || params.mode === "view"
                              }
                              size="small"
                              id="cfpbpdf"
                              name="cfpbpdf"
                            />
                          }
                          label="PDF"
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              id="cfpbexcel"
                              name="cfpbexcel"
                              checked={values.cfpbexcel}
                              onChange={handleChange}
                              sx={{ height: "10px" }}
                              disabled={
                                params.mode === "delete" || params.mode === "view"
                              }
                            />
                          }
                          label="EXCEL"
                        />
                      </Stack>

                    </Stack>
                    <Stack sx={{ gridColumn: "span 2" }} direction="column" gap={2}>
                      <Typography fontSize={"14px"} fontWeight={"bold"}>Customer Custom Price Book</Typography>

                      <TextField
                        fullWidth
                        variant="outlined"
                        type="text"
                        id="ccpbtitle"
                        name="ccpbtitle"
                        label="PriceBook Title"
                        size="small"
                        sx={{ gridColumn: "span 2" }}
                        value={values.ccpbtitle}
                        onChange={handleChange}
                        onBlur={handleBlur}
 autoComplete="off"
                      />

                      <Stack
                        sx={{ gridColumn: "span 1" }}
                        direction="row"
                        gap={2}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={values.ccpbpdf}
                              onChange={handleChange}
                              sx={{ height: "10px" }}
                              disabled={
                                params.mode === "delete" || params.mode === "view"
                              }
                              size="small"
                              id="ccpbpdf"
                              name="ccpbpdf"
                            />
                          }
                          label="PDF"
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              id="ccpbexcel"
                              name="ccpbexcel"
                              checked={values.ccpbexcel}
                              onChange={handleChange}
                              sx={{ height: "10px" }}
                              disabled={
                                params.mode === "delete" || params.mode === "view"
                              }
                            />
                          }
                          label="EXCEL"
                        />
                      </Stack>


                    </Stack>
                  </Box>
                )}
                {params.mode === 'edit-Customer' && (
                  <Box
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
                        color: "black !important", // Set checkbox color to black
                      },

                      "& .MuiCheckbox-root.Mui-checked": {
                        color: "black !important", // Set checkbox color to black when checked
                      },
                      "& .MuiDataGrid-row:nth-of-type(even)": {
                        backgroundColor: theme.palette.action.hover,
                      },
                      "& .MuiDataGrid-row:nth-of-type(odd)": {
                        backgroundColor: theme.palette.background.default, // Color for odd rows
                      },

                      "& .MuiDataGrid-row.Mui-selected:hover": {
                        backgroundColor: `${theme.palette.action.selected} !important`,
                      },"& .MuiTablePagination-root": {
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
                       '& .MuiDataGrid-footerContainer': {
                           height: dataGridHeaderFooterHeight,
                           minHeight: dataGridHeaderFooterHeight,
                       },
                     }}
                      slots={{
                        loadingOverlay: LinearProgress,
                        toolbar: CustomToolbar,
                      }}
                      rowHeight={dataGridRowHeight}
                      rows={[...getRows, ...filteredSelectedItems]}
                      columns={columns}
                      disableSelectionOnClick
                      disableRowSelectionOnClick
                      getRowId={(row) => row.PRICELISTID}
                      initialState={{
                        pagination: { paginationModel: { pageSize: 20 } },
                      }}
                      pageSizeOptions={[5, 10, 20, 25]}
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
                  </Box>
                )}
              </Paper>
              <MessageAlertDialog
                open={isRemovePriceList}
                tittle={removePriceListdDesc}
                message={`Are you sure you want to remove Price List ?`}
                Actions={
                  <DialogActions>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={async () => {
                        const Pdata = {
                          PriceListID: removePriceListID,
                          PriceBookRecordID: data.RecordID,
                        }
                        const response = await dispatch(
                          ConfigurepriceListClear({
                            Pdata
                          })
                        );
                        if (response.payload.status === "Y") {
                          // dispatch(configureAddedPriceList);
                          dispatch(getConfigPriceBook({ ID: State.RecordID }))
                        }
                        setIsRemovePriceList(false);
                        setremovePriceListID(0);
                        setremovePriceListDesc("");
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
                        setremovePriceListID(0);
                        setremovePriceListDesc("");
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
                message={"Oops! This price list is already exists in print group."}
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
          params.mode === "add-Contact"
            ? "Configure Customer added successfully"
            : params.mode === "delete"
              ? "Configure Customer Deleted Successfully"
              : "Configure Customer updated successfully"
        }
        Actions={
          params.mode === "add-Contact" ? (
            <DialogActions>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => navigate("/pages/control-panel/configure-price-book/company")}
              >
                Back to Configure Company
              </Button>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  dispatch(getConfigPriceBook({ ID: 0 }));
                  setOpenAlert(false);
                }}
                autoFocus
              >
                Add New Configure Company
              </Button>
            </DialogActions>
          ) : (
            <DialogActions>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => navigate("/pages/control-panel/configure-price-book/company")}
              >
                Back to Configure Company
              </Button>
            </DialogActions>
          )
        }
      />
    </Container>
  );
};

export default ConfigureEdit;


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
{/* {params.mode === 'edit-Customer' && (
 <Box display="flex" flexDirection="column" gap="20px"  justifyContent="center"
            alignItems="center">
      <Typography variant="h5">Price Book Cover Image</Typography>
      <SettingsLogo previewImages={previewImages3} />
     
        <DropZone {...dropzoneProps3.getRootProps()}>
          <input
            {...dropzoneProps3.getInputProps({
              onChange: (e) => handleImageUpload3(e.target.files),
            })}
            multiple={false}
          />
          <FlexBox alignItems="center" flexDirection="column">
            <Publish sx={{ color: "text.secondary", fontSize: "48px" }} />
            {imageList3.length ? (
              <span>{imageList3.length} images selected</span>
            ) : (
              <span>Drop images</span>
            )}
          </FlexBox>
        </DropZone>

    </Box> 
 )} */}