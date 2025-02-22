import React, { useEffect, useState } from "react";
import {
  LinearProgress,
  Paper,
  Button,
  Box,
  styled,
  useTheme,
  useMediaQuery,
  TextField,
  Stack,
  FormControlLabel,
  Checkbox,
  Typography,
  MenuItem,
  DialogActions,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Breadcrumb } from "app/components";
import {
  dataGridPageSize,
  dataGridpageSizeOptions,
  dataGridRowHeight,
  dataGridHeaderFooterHeight,
} from "app/utils/constant";
import { Formik } from "formik";
import lodash from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAuth from "app/hooks/useAuth";
// ********************** ICONS ********************** //
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Add, Title } from "@mui/icons-material";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import AlertDialog, { MessageAlertDialog } from "app/components/AlertDialog";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import Loading from "app/components/AppLoading";
import {
  FormikCustomAutocompleteMulti,
  FormikCustomAutocompleteMultiCompany,
  FormikCustomAutocompleteMultiCustomer,
} from "app/components/FormikAutocomplete";
import {
  getMailAnalyticsdata,
  resetMailAnalyticsstate,
} from "app/redux/slice/listviewSlice";
import { MailAnalyticsDocument } from "app/components/Template/pdfs/MailAnalytics";
import { pdf } from "@react-pdf/renderer";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

// ********************** STYLED COMPONENTS ********************** //
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

const getSaturdayAndSunday = (date) => {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  const sunday = new Date(date);
  sunday.setDate(date.getDate() - dayOfWeek);

  // Clone the Sunday date to avoid modifying the original object
  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);

  return { sunday, saturday };
};

// Format a date into MM/DD format (without year)
const formatDateShort = (date) => {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${month}/${day}`;
};

// Format a full date into MM/DD/YYYY format
const formatDateLong = (date) => {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

// ********************** PRICE LIST EDIT SCREEN  ********************** //
const MailAnalitics = () => {
  // ********************** HOOKS AND CONSTANTS ********************** //
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isNonMobileSec = useMediaQuery("(min-width:1000px)");
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loaction = useLocation();
  const { user } = useAuth();
  const state = loaction.state;

  // ********************** LOCAL STATE ********************** //

  const [currentDate, setCurrentDate] = useState(new Date());
  const [isNextWeek, setIsNextWeek] = useState(false); // Recalculate the current date when the component mounts or when `isNextWeek` changes
  useEffect(() => {
    dispatch(resetMailAnalyticsstate());
    const today = new Date();
    setCurrentDate(today);
  }, [isNextWeek]);
  const getWeekDates = () => {
    const date = new Date(currentDate);

    // If we want the next week's dates, add 7 days to the current date
    if (isNextWeek) {
      date.setDate(date.getDate() + 7);
    }

    const { sunday, saturday } = getSaturdayAndSunday(date); // Get the Sunday and Saturday of the week
    return {
      sunday: formatDateLong(sunday), // Full date for Sunday (MM/DD/YYYY)
      saturday: formatDateLong(saturday), // Full date for Saturday (MM/DD/YYYY)
      shortSunday: formatDateShort(sunday), // Short format (MM/DD) for Sunday
      shortSaturday: formatDateShort(saturday), // Short format (MM/DD) for Saturday
      formatedDate: `Pricing Week (SUN)${formatDateLong(
        sunday
      )} TO (SAT)${formatDateLong(saturday)}`, // Full format Pricing Week (SUN)(MM/DD/YYYY) TO (SAT)(MM/DD/YYYY)
    };
  };

  const toggleWeek = () => {
    setIsNextWeek(!isNextWeek); // Toggle between next and current week
  };

  const { shortSunday, shortSaturday, sunday, saturday, formatedDate } =
    getWeekDates();
  // ********************** REDUX STATE ********************** //
  const getData = useSelector((state) => state.listview.mailAnalyticsData);
  const getStatus = useSelector((state) => state.listview.mailAnalyticsStatus);
  const getLoading = useSelector(
    (state) => state.listview.mailAnalyticsLoading
  );
  const getError = useSelector((state) => state.listview.mailAnalyticsError);

  // ********************** COLUMN AND ROWS ********************** //
  const columns = [
    {
      headerName: "Date",
      field: "CreatedDateTime",
      width: "150",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Company",
      field: "CompanyName",
      width: "150",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Sales Person",
      field: "SalesPerson",
      width: "200",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Customer Name",
      field: "CustomerName",
      width: "350",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Contact",
      field: "Contact",
      width: "200",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Email",
      field: "Email",
      width: "200",
      align: "left",
      headerAlign: "left",
      hide: false,
    },


    {
      headerName: "Price Book Type",
      field: "PriceBookType",
      width: "200",
      align: "left",
      headerAlign: "left",
      hide: false,
    },

    {
      headerName: "Format",
      field: "Formate",
      width: "200",
      align: "left",
      headerAlign: "left",
      hide: false,
      renderCell: (param) => {
        return param.row.Excel && param.row.Pdf
          ? "Both"
          : param.row.Excel
          ? "EXCEL"
          : param.row.Pdf
          ? "PDF"
          : "";
      },
    },
    {
      headerName: "Status",
      field: "Status",
      width: "200",
      align: "left",
      headerAlign: "left",
      hide: false,
      renderCell: (param) => {
        return param.row.Status === "S" ? "Success" : "Failure";
      },
    },
  ];



  // **********************  FUNCTION ********************** //
 
  const [openAlert,setOpenAlert] = useState(false)
  const [postError,setPostError] = useState(false)
  const getFilterData = async (values) => {
    const data = {
      CompanyID: values.company
        ? values.company.map((item) => item.CompanyCode).join(", ")
        : "",
      SalesPersonID: values.salesPerson
        ? values.salesPerson.map((item) => item.Code).join(", ")
        : "",
      CustomerNumber: values.customer
        ? values.customer.map((item) => item.CustomerNumber).join(", ")
        : "",
      PriceBookType: values.priceBookType,
      FormatType: values.formate,
      Status: values.status,
      FromDate: values.fromDate,
      ToDate: values.toDate,
    };
    const res = await dispatch(getMailAnalyticsdata(data));
    if (res.payload.status == "Y") {
    } else {
        setOpenAlert(true)
        setPostError(res.payload.message)
    }
  };
  const [isGenerating, setIsGenerating] = useState(false);
   const getPriceBookFull = async (priceListOutType) => {
      setIsGenerating(true);
            try {
              const instance = pdf(
                <MailAnalyticsDocument
                  items={getData}
                  onRenderFinish={() => {
                    setIsGenerating(false);
                  }}
                  onError={(e) => {
                    console.error("Render Error:", e);
                    setIsGenerating(false);
                  }}
                />
              );
  
              const blob = await instance.toBlob();
              const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `mail_analitics.pdf`;
                document.body.appendChild(link);
  
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              
            } catch (e) {

            }
          } 
 

  // ********************** TOOLBAR ********************** //
  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          padding: "5px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 2,
            width: "100%",
          }}
        >
          <GridToolbarQuickFilter />
        </Box>
      </GridToolbarContainer>
    );
  }

  return (
    <Container>
      {/* {getStatus === "fulfilled" && !getError && ( */}
      <Formik
        initialValues={{
          company: [],
          customer: [],
          salesPerson: [],
          fromDate: sunday,
          toDate:saturday,
          priceBookType: "",
          formate: "",
          status: "",
        }}
        enableReinitialize={true}
        // validate={(values) => {
        //   const filters1 = [
        //     "brandInEx",
        //     "commodityInEx",
        //     "altClassInEx",
        //     "vendorInEx",
        //     "frshForzInEx",
        //     "classIDInEx",
        //     "SecondClassInEx",
        //     ,
        //   ];
        //   const hasDataCheck = filters1.some(
        //     (filter) => values[filter] != "IncludeAll"
        //   );

        //   const errors = {};
        //   const filters = [
        //     "brandInExData",
        //     "commodityInExData",
        //     "altClassInExData",
        //     "vendorInExData",
        //     "frshForzInExData",
        //     "SecondClassInExData",
        //     "classIDInExData",
        //   ];
        //   if (hasDataCheck) {
        //     const hasData = filters.some((filter) => values[filter].length > 0);
        //     if (!hasData) {
        //       errors.filters = "At least one filter must have selected filter";
        //     }
        //     return errors;
        //   }
        //   // else{
        //   //   errors.filters = "At least one filter must have selected filter";
        //   //   return errors;
        //   // }
        // }}
        onSubmit={(values, { setSubmitting }) => {
          getFilterData(values);
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
          <form onSubmit={handleSubmit} onReset={() =>{
            resetForm()
            dispatch(resetMailAnalyticsstate());
          }}>
            <div className="breadcrumb">
              <Breadcrumb
                routeSegments={[
                  { name: "Analytics" },
                  {
                    name: "Mail Analytics",
                  },
                ]}
              />
            </div>

            <Paper sx={{ width: "100%", mb: 2 }}>
              <Box
                display="grid"
                gap="20px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": {
                    gridColumn: isNonMobileSec ? undefined : "span 4",
                  },
                  padding: "5px",
                }}
              >
                <Stack
                  sx={{ gridColumn: "span 1" }}
                  direction={"column"}
                  gap={1}
                >
                  <Stack direction="row" gap={13} height={44}>
                    <Typography sx={{ marginLeft: 2 }} variant="h6">
                      Filters
                    </Typography>
                  </Stack>
                  <Stack
                    sx={{ p: 0, m: 0 }}
                    direction="row"
                    justifyContent={"flex-end"}
                    gap={2}
                  >
                    {errors.filters && (
                      <div style={{ color: "red" }}>{errors.filters}</div>
                    )}
                  </Stack>
                  <Stack direction="row" gap={1}>
                    <TextField
                      size="small"
                      name="fromDate"
                      id="fromDate"
                      type="date"
                      label="From Date"
                      value={values.fromDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      InputLabelProps={{
                        shrink: true, // Forces the label to shrink above the field
                      }}
                    />
                    <TextField
                      size="small"
                      name="toDate"
                      id="toDate"
                      type="date"
                      label="To Date"
                      value={values.toDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      InputLabelProps={{
                        shrink: true, // Forces the label to shrink above the field
                      }}
                    />
                  </Stack>
                  <FormikCustomAutocompleteMultiCompany
                    name="company"
                    id="company"
                    value={values.company}
                    onChange={(event, newValue) => {
                      setFieldValue("company", newValue);
                    }}
                    label="Company"
                    url={`${process.env.REACT_APP_BASE_URL}CompanyModule/CompanyListView`}
                  />
                  <FormikCustomAutocompleteMulti
                    disabled={values.company.length === 0}
                    name="salesPerson"
                    id="salesPerson"
                    value={values.salesPerson}
                    onChange={(event, newValue) => {
                      setFieldValue("salesPerson", newValue);
                    }}
                    label="Sales Person"
                    url={`${
                      process.env.REACT_APP_BASE_URL
                    }PriceBookDirectory/GetRungroupByCompany_V1?CompanyCode=${values.company
                      .map((item) => item.CompanyCode)
                      .join(", ")}`}
                  />
                  <FormikCustomAutocompleteMultiCustomer
                    disabled={values.salesPerson.length === 0}
                    name="customer"
                    id="customer"
                    value={values.customer}
                    onChange={(event, newValue) => {
                      setFieldValue("customer", newValue);
                    }}
                    label="Customer"
                    url={`${
                      process.env.REACT_APP_BASE_URL
                    }CustomerPriceList/CustomerPriceList_V1?PriceBookGroup=${values.salesPerson
                      .map((item) => item.Code)
                      .join(", ")}`}
                  />

                  <TextField
                    size="small"
                    name="priceBookType"
                    id="priceBookType"
                    select
                    label="price Book Type"
                    value={values.priceBookType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                  >
                    <MenuItem value="CM">Wholesale Price Book</MenuItem>
                    <MenuItem value="FP">Customer Full Price Book</MenuItem>
                    <MenuItem value="CP">Customer Custom Price Book</MenuItem>
                    <MenuItem value="QT">Quotation</MenuItem>
                  </TextField>
                  <TextField
                    size="small"
                    name="formate"
                    id="formate"
                    select
                    label="Format"
                    value={values.formate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                  >
                    <MenuItem value="P">PDF</MenuItem>
                    <MenuItem value="E">EXCEL</MenuItem>
                    <MenuItem value="A">Both</MenuItem>
                  </TextField>
                  <TextField
                    size="small"
                    name="status"
                    id="status"
                    select
                    label="Status"
                    value={values.status}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                  >
                    <MenuItem value="S">Success</MenuItem>
                    <MenuItem value="F">Failure</MenuItem>
                  </TextField>

                  <Stack justifyContent="flex-end" direction={"row"} gap={1}>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      startIcon={<PictureAsPdfIcon size="small" />}
                      onClick={getPriceBookFull}
                      disabled={getData.length == 0}
                    >
                      PDF
                    </Button>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      startIcon={<CheckIcon size="small" />}
                      type="submit"
                    >
                      Apply Filters
                    </Button>

                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      startIcon={<ClearIcon size="small" />}
                      type="reset"
                    >
                      Clear Filters
                    </Button>
                  </Stack>
                </Stack>
                <Box
                  sx={{
                    height: 440,
                    gridColumn: "span 3",
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
                    // Ensure the checkbox color reflects the selected state
                    "& .MuiCheckbox-root.Mui-checked": {
                      color: "black !important", // Set checkbox color to black when checked
                    },
                    // Alternating row colors
                    "& .MuiDataGrid-row:nth-of-type(even)": {
                      backgroundColor: theme.palette.action.hover, // Color for even rows
                    },
                    "& .MuiDataGrid-row:nth-of-type(odd)": {
                      backgroundColor: theme.palette.background.default, // Color for odd rows
                    },
                    // Prevent selected row background color from changing on hover
                    "& .MuiDataGrid-row.Mui-selected:hover": {
                      backgroundColor: `${theme.palette.action.selected} !important`, // Ensure the background remains the same on hover
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
                    //   key={showGridData}
                    slots={{
                      loadingOverlay: LinearProgress,
                      toolbar: CustomToolbar,
                    }}
                    rowHeight={dataGridRowHeight}
                    rows={getData}
                    columns={columns}
                    loading={getLoading}
                    disableSelectionOnClick
                    disableRowSelectionOnClick
                    getRowId={(row) => row.RecordID}
                    initialState={{
                      pagination: {
                        paginationModel: { pageSize: dataGridPageSize },
                      },
                    }}
                    pageSizeOptions={dataGridpageSizeOptions}
                    columnVisibilityModel={
                      {
                        // Action: showGridData === 0 ? false : true,
                      }
                    }
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
              </Box>
              <AlertDialog
                key={85963}
                logo={`data:image/png;base64,${user.logo}`}
                open={openAlert}
                error={postError}
                message={
                  postError ? postError : ""
                }
                // message={"Item Deleted Successfully"}
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
                        setTimeout(() => {
                          setPostError(null);
                        }, 1000);
                      }}
                      sx={{ mr: 1, height: 25 }}
                    >
                      Close
                    </Button>
                  </Box>
                }
              />
            </Paper>
          </form>
        )}
      </Formik>
      {/* )} */}
    </Container>
  );
};

export default MailAnalitics;
