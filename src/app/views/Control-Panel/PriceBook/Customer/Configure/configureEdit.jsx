import React, { useState } from "react";
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
} from "@mui/material";
import {
    DataGrid,
    GridToolbarQuickFilter,
    GridToolbarContainer,
  } from "@mui/x-data-grid";
import { Breadcrumb } from "app/components";
import Cover from "../../../../../../assets/plylogo.png";
import { dataGridHeight, dataGridRowHeight } from "app/utils/constant";
// ******************** ICONS ******************** //
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
  code: Yup.string()
    .min(3, "Code must be at least 3 characters")
    .max(15, "Code must be at most 15 characters"),
  email: Yup.string()
    .email("Invalid email format")
    .max(30, "Email must be at most 30 characters"),
  sequence: Yup.string()
    .min(1, "Sequence must be at least 1 character")
    .max(15, "Sequence must be at most 15 characters"),
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must be at most 20 characters"),
  address: Yup.string()
    .min(3, "Address must be at least 3 characters")
    .max(50, "Address must be at most 50 characters"),
});

// ******************** Price List Edit SCREEN  ******************** //
const ConfigureEdit = () => {
  // ******************** HOOKS AND CONSTANTS ******************** //
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const params = useParams();
  const navigate = useNavigate();
const location=useLocation();
const State=location.state;
console.log("🚀 ~ ConfigureEdit ~ State:", State)

  // ******************** LOCAL STATE ******************** //
  const [imgstatus3, setImgStatus3] = useState("N");
  const [successMessage3, setSuccessMessage3] = useState("");
  const [addPriceListData, setAddPriceListData] = useState(null);
  const handleSelectionAddPriceListData = (newValue) => {
    setAddPriceListData(newValue);
  };
  // ******************** REDUX STATE ******************** //
console.log(params.mode,"MODE");
//==================================IMAGES=====================================//
const [imageList3, setImageList3] = useState([]);
  const [previewImages3, setPreviewImages3] = useState([]);
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
  const dropzoneProps3 = useDropzone({
    accept: "image/*",
    onDrop: handleDrop(setImageList3, setPreviewImages3),
  });
  const handleImageUpload3 = (files) => {
    if (files.length > 0) {
      setImgStatus3("Y");
      setSuccessMessage3("Nicky Logo updated successfully!");
    } else {
      setImgStatus3("N");
    }
  };

 

const SettingsLogo = ({ previewImages, imageSrc }) => {
    const displayImage =
      previewImages.length > 0 ? previewImages[0]["preview"] : "";
    return (
      <Box sx={{width:"100%", padding: "8px" }}>
<ImageWrapper previewImage={displayImage} />
            </Box>
    );
  };
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
          <Box>
                <Button
  sx={{ height: 25 }}
  variant="contained"
  color="secondary"
  size="small"
  // disabled={true} // Permanently disable the button
  onClick={() => {
    navigate("/pages/control-panel/configure-price-book/price-list-items/customer");
  }}
>
  View Items
</Button>

          </Box>
        );
      },
    },
  ];
const rows=[
    {
        PRICELISTID:"GOATS",
        PRICELISTDESCRIPTION:"Goats"
    },
    {
        PRICELISTID:"Hemple",
        PRICELISTDESCRIPTION:"Hemple"
    },
    {
        PRICELISTID:"MDA",
        PRICELISTDESCRIPTION:"Smart Chicken"
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
            // errors={isPriceListExistsError}
            // helper={isPriceListExistsError && "Please select price list!"}
            disabled={params.mode === "delete" || params.mode === "view"}
            name="addPriceList"
            id="addPriceList"
            value={addPriceListData}
            onChange={handleSelectionAddPriceListData}
            label="Add Price List"
            url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=PriceList`}
          />

          <Button
            disabled={params.mode === "delete" || params.mode === "view"}
            variant="contained"
            color="info"
            size="small"
            startIcon={<Add />}
            
          >
            Add
          </Button>
        </Box>
      </GridToolbarContainer>
    );
  }
  return (
    <Container>
      <Formik
        initialValues={{
          recID: "",
          code: "",
          email: "",
          sortOrder: "",
          name: "",
          address1: "",
          address2: "",
          address3: "",
          website: "",
          phonenumber: "",
          gfpbtitle: "",
          cfpbtitle: "",
          ccpbtitle: "",
        }}
        validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={(values, { resetForm }) => {
          console.log("Form submitted with values:", values);
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
                  { name: "Configure Price Book Type",path: "/pages/control-panel/configure-price-book/company" },
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
                 {params.mode ==="editCustomer"&& (
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
                {params.mode ==="editAddress"&& (
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

{(params.mode === "editContact" || params.mode === "addContact")  && (
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
                    // required
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.code && !!errors.code}
                    helperText={touched.name && errors.name}
                 
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
  url={`${process.env.REACT_APP_BASE_URL}PriceBookDirectory/GetRungroupByCompany?CompanyCode=PM`}/>
                  
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
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.phonenumber && Boolean(errors.phonenumber)}
                    helperText={touched.phonenumber && errors.phonenumber}
                  />
                   
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="address"
                    name="address"
                    label="Service Provider"
                    size="small"
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
                    type="email"
                    id="email"
                    name="email"
                    label="Email"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                <TextField
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
                  />
                  <Stack
                    sx={{ gridColumn: "span 2" }}
                    direction="row"
                    gap={2}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.pdf}
                          onChange={handleChange}
                          sx={{ height: "10px" }}
                          disabled={
                            params.mode === "delete" || params.mode === "view"
                          }
                          size="small"
                          id="pdf"
                          name="pdf"
                        />
                      }
                      label="Preferred Email Communication"
                    />
                    
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          id="excel"
                          name="excel"
                          checked={values.excel}
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
               {params.mode === 'editCustomer' && (
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
                                    id="geniric"
                                    name="geniric"
                                    label="PriceBook Title"
                                    size="small"
                                    sx={{ gridColumn: "span 2" }}
                                    value={values.geniric}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.geniric && Boolean(errors.geniric)}
                                    helperText={touched.geniric && errors.geniric}
                                  />
                                  
                                  <Stack
                    sx={{ gridColumn: "span 1" }}
                    direction="row"
                    gap={2}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.pdf}
                          onChange={handleChange}
                          sx={{ height: "10px" }}
                          disabled={
                            params.mode === "delete" || params.mode === "view"
                          }
                          size="small"
                          id="pdf"
                          name="pdf"
                        />
                      }
                      label="PDF"
                    />
                    
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          id="excel"
                          name="excel"
                          checked={values.excel}
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
                                    id="geniric"
                                    name="geniric"
                                    label="PriceBook Title"
                                    size="small"
                                    sx={{ gridColumn: "span 2" }}
                                    value={values.geniric}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.geniric && Boolean(errors.geniric)}
                                    helperText={touched.geniric && errors.geniric}
                                  />
                                  
                                  <Stack
                    sx={{ gridColumn: "span 1" }}
                    direction="row"
                    gap={2}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.pdf}
                          onChange={handleChange}
                          sx={{ height: "10px" }}
                          disabled={
                            params.mode === "delete" || params.mode === "view"
                          }
                          size="small"
                          id="pdf"
                          name="pdf"
                        />
                      }
                      label="PDF"
                    />
                    
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          id="excel"
                          name="excel"
                          checked={values.excel}
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
              {params.mode === 'editCustomer' && (
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
                    },
                  }}
                >
                  <DataGrid
                    slots={{
                      loadingOverlay: LinearProgress,
                      toolbar: CustomToolbar,
                    }}
                    rowHeight={dataGridRowHeight}
                    rows={rows}
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
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default ConfigureEdit;


          {/* {params.mode === 'editCustomer' && (
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