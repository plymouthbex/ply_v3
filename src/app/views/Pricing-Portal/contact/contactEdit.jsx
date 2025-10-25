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
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
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
const ConfigureContactEdit = () => {
  // ******************** HOOKS AND CONSTANTS ******************** //
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const State = location.state;
  console.log("🚀 ~ ConfigureContactEdit ~ State:", State)
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
    (state) => state.getSlice.configurePriceListContactData
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

          {(data.Rungroup === user.defaultRunGroup && user.role === 'USER') || user.SalesReps.includes(data.Rungroup) ? 
          
            <IconButton
              disabled={params.mode === "delete" || params.mode === "view"}
              color="black"
              size="small"
              onClick={() => {
                navigate("./add", {
                  state: {
                    RecordID: 0,
                    CompanyCode: State.CompanyCode,
                    CustomerNumber: data.CustomerNumber,
                  },
                });
              }}
            >
              <Add
                sx={{
                  fontSize: 30, // Increased icon size
                  color: theme.palette.success.main,
                }}
              />
            </IconButton>:user.role != 'USER' ? 
            <IconButton
              disabled={params.mode === "delete" || params.mode === "view"}
              color="black"
              size="small"
              onClick={() => {
                navigate("./add", {
                  state: {
                    RecordID: 0,
                    CompanyCode: State.CompanyCode,
                    CustomerNumber: data.CustomerNumber,
                  },
                });
              }}
            >
              <Add
                sx={{
                  fontSize: 30, // Increased icon size
                  color: theme.palette.success.main,
                }}
              />
            </IconButton>:false }
        </Box>
      </GridToolbarContainer>
    );
  }

  //====================================================================================//

  const columns = [
    {
      headerName: "Name",
      field: "FirstName",
      width: "170",
      align: "left",
      headerAlign: "left",
      hide: true,
      renderCell: (params) => `${params.row.FirstName} ${params.row.LastName} `,
    },

    {
      headerName: "Phone",
      field: "Phone",
      width: "170",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Email",
      field: "Email",
      width: "200",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      field: "Action",
      headerName: "Action",
      minWidth: 100,
      flex: 1,
      sortable: false,
      headerAlign: "center",
      filterable: false,
      disableColumnMenu: true,
      disableExport: true,
      align: "center",
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", gap: "8px" }}>
            <Tooltip title="Edit">
              <IconButton
                color="black"
                size="small"
                onClick={() => {
                  navigate("./edit", {
                    state: {
                      RecordID: params.row.RecordID,
                      CompanyCode: State.CompanyCode,
                      CustomerNumber: data.CustomerNumber,
                    },
                  });
                }}
              >
                <ModeEditOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                color="black"
                size="small"
                onClick={() => {
                  navigate("./delete", {
                    state: {
                      RecordID: params.row.RecordID,
                      CompanyCode: State.CompanyCode,
                      CustomerNumber: data.CustomerNumber,
                    },
                  });
                }}
              >
                <DeleteIcon fontSize="small" color="error" />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <Container>
      {status === "fulfilled" && !error ? (
        <Formik
          initialValues={{
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
            // handleSave(values);
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
                    { name: "Price Book" },
                    {
                      name: "Contact Directory",
                      path: "/pages/pricing-portal/contact-directory",
                    },
                    { name: "Contacts" },
                  ]}
                />
                <Stack direction={"row"} gap={1}>
                  {/* <Button
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
                  </Button> */}
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    startIcon={<ArrowBackIcon size="small" />}
                    onClick={() => navigate("/pages/pricing-portal/contact-directory",{
                      state: {
                        runGroup:State.runGroup
                      },
                    })}
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
                  {/* <Stack sx={{ gridColumn: "span 4" }} direction="row" gap={1}>
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
                  </Stack> */}
                </Box>

                <Box
                  sx={{
                   // height: 400,
                    height:dataGridHeight,
                    gridColumn: "span 4",
                    "& .MuiDataGrid-root": {
                      border: "none",
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
                    '& .MuiDataGrid-row:hover': {
                      border: '3px solid #999999',
                      // border: `1px solid #${theme.palette.action.selected} !important`, // Change border color on hover
                      borderRadius: '4px', // Optional: Add rounded corners
                    },
                    // "& .MuiDataGrid-row.Mui-selected:hover": {
                    //   backgroundColor: `${theme.palette.action.selected} !important`,
                    // },
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
                    rows={getRows}
                    columns={columns}
                    disableSelectionOnClick
                    disableRowSelectionOnClick
                    getRowId={(row) => row.RecordID}
                    initialState={{
                      pagination: { paginationModel: { pageSize: 20 } },
                    }}
                    pageSizeOptions={[5, 10, 20, 25]}
                    columnVisibilityModel={{
                      item_key: false,
                      Action:data.Rungroup === user.defaultRunGroup && user.role === 'USER' ? true:user.SalesReps.includes(data.Rungroup)? true :user.role != 'USER' ? true :false
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
                onClick={() =>
                  navigate("/pages/control-panel/configure-price-book/company")
                }
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
                onClick={() =>
                  navigate("/pages/control-panel/configure-price-book/company")
                }
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

export default ConfigureContactEdit;

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
