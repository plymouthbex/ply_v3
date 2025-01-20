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
  FormikOptimizedAutocomplete,
  PGOptimizedAutocomplete,
} from "app/components/SingleAutocompletelist";
import { useDispatch, useSelector } from "react-redux";
import {
  configureAddedPriceList,
  getConfigPriceBook,
} from "app/redux/slice/getSlice";
import {
  ConfigurepriceListClear,
  postConfigureCompany,
  PostConfigurePriceListID,
} from "app/redux/slice/postSlice";
import lodash from "lodash";
import AlertDialog, { MessageAlertDialog } from "app/components/AlertDialog";
import useAuth from "app/hooks/useAuth";

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
  height: 100, // Reduced height
  minHeight: "50px", // Adjust minimum height as needed
  maxHeight: "200px", // Adjust maximum height as needed
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
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(60, "Name must be at most 60 characters"),

  phonenumber: Yup.string()
    .matches(
      /^\(\d{3}\) \d{3}-\d{4}$/,
      "Phone number must be in the format (XXX) XXX-XXXX"
    )
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
  const { user } = useAuth()
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
  const getRows = useSelector(
    (state) => state.getSlice.configurePriceListGetData
  );

  const addedRows = useSelector(
    (state) => state.getSlice.configurePriceListAddedData
  );

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
      headerName: "Name",
      field: "PRICELISTID",
      width: "170",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Description",
      field: "PRICELISTDESCRIPTION",
      width: "300",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
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
            <Tooltip title="Exclude Price List">
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
            label="Include Price List"
            url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=PriceList`}
          />

          <Tooltip title="Add">
            <IconButton
              disabled={params.mode === "delete" || params.mode === "view"}
              color="black"
              size="small"
              onClick={ async() => {
                if (addPriceListData) {
                  const isItem = [...getRows, ...filteredSelectedItems].some(
                    (item) =>
                      lodash.isEqual(
                        item.PRICELISTID,
                        addPriceListData.PRICELISTID
                      )
                  );
                  if (isItem) {
                    setIsPriceListExists(true);
                    setTimeout(() => {
                      setIsPriceListExists(false);
                      setAddPriceListData(null);
                    }, 5000);
                    return;
                  }
                  // dispatch(configureAddedPriceList(addPriceListData));

                  const pricedata = {
                    recordID: data.RecordID,
                    priceListID: addPriceListData.PRICELISTID,
                  };
                  const response = await dispatch(
                    PostConfigurePriceListID({ pricedata })
                  );
                  
                  if (response.payload.status === "Y") {
                    setOpenAlert(true);
                    setAddPriceListData(null);
                    dispatch(getConfigPriceBook({ ID: State.RecordID }));

                  } else {
                    setOpenAlert(true);
                    setPostError(true);
                    setAddPriceListData(null);

                    // toast.error("Error occurred while saving data");
                  }
                } else {
                  setIsPriceListExistsError(true);
                  setTimeout(() => {
                    setIsPriceListExistsError(false);
                  }, 2000);
                }

              
              }}
            >
              <Add />
            </IconButton>
          </Tooltip>
        </Box>
      </GridToolbarContainer>
    );
  }
  console.log("🚀 ~ handleSave ~ params.mode:", params.mode);

  //====================================================================================//

  const handleSave = async (values) => {
    const data1 = {
      RecordID: data.RecordID,
      Classification: "CS",
      CompanyID: data.CompanyID,
      CompanyCode: data.CompanyCode,
      CustomerNumber: data.CustomerNumber,
      CustomerName: data.CustomerName,
      fullPriceBookPdf: values.cfpbpdf ? "1" : "0",
      fullPriceBookExcel: values.cfpbexcel ? "1" : "0",
      customPriceBookPdf: values.ccpbpdf ? "1" : "0",
      customPriceBookExcel: values.ccpbexcel ? "1" : "0",
      rungroup: data.Rungroup,
      fullPriceBookTitle: values.cfpbtitle,
      customPriceBookTitle: values.ccpbtitle,
      Disable: "0",
      PriceLevel: data.PriceLevel,
      CreatedDateTime: data.CreatedDateTime,
      LastModified: data.LastModified,
      CreatedBy: data.CreatedBy,
      ModifiedBy: data.ModifiedBy,
    };

    const response = await dispatch(postConfigureCompany({ Cdata: data1 }));
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
        <Formik
          initialValues={{
            RecordID: data.RecordID,
            email: data.EmailId,
            name: data.ContactName,
            provider: data.Provider,
            sequence: data.Sequence,
            phonenumber: data.Phone,
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
          // validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={(values, { resetForm }) => {
            handleSave(values);
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
                    {
                      name: "Configure Price Book Type",
                      path: "/pages/control-panel/configure-price-book/company",
                    },
                    {
                      name: "Customer",
                      path: "/pages/control-panel/configure-price-book/customer",
                    },
                    { name: `Configure Customer Price List` },
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
                  {/* {params.mode === "edit-Customer" && (
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
                        {State.company.Code} || {State.company.Name}
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
                        {State.Code} || {State.Name}
                      </Typography>
                    </Stack>
                  )} */}
                </Box>

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
              </Paper>
              <MessageAlertDialog
               logo={`data:image/png;base64,${user.logo}`}
                open={isRemovePriceList}
                tittle={removePriceListdDesc}
                message={`Are you sure you want to exclude price list ?`}
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
                        };
                        const response = await dispatch(
                          ConfigurepriceListClear({
                            Pdata,
                          })
                        );
                        if (response.payload.status === "Y") {
                          // dispatch(configureAddedPriceList);
                          dispatch(getConfigPriceBook({ ID: State.RecordID }));
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
               logo={`data:image/png;base64,${user.logo}`}
                open={isPriceListExists}
                error={true}
                tittle={
                  addPriceListData
                    ? addPriceListData.PRICELISTDESCRIPTION
                    : "Please select price list!"
                }
                message={
                  "Oops! This price list is already exists"
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
      <AlertDialog
       logo={`data:image/png;base64,${user.logo}`}
        open={openAlert}
        error={postError}
        message={"Price List added successfully"}
        Actions={
          <Box sx={{display:'flex',justifyContent:"flex-end"}}>
            <Button
              variant="contained"
              color="info"
              size="small"
              onClick={() => {
                setOpenAlert(false);
              }}
              sx={{height:25}}
            >
             close
            </Button>
          </Box>
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
{
  /* {params.mode === 'edit-Customer' && (
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
 )} */
}
