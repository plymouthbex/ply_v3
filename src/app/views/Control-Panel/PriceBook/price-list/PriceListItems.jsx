import React from "react";
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
  Autocomplete,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Breadcrumb } from "app/components";
import { dataGridRowHeight,dataGridHeaderFooterHeight } from "app/utils/constant";
import { Formik } from "formik";

// ********************** ICONS ********************** //
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { useNavigate, useParams } from "react-router-dom";

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

// ********************** PRICE LIST EDIT SCREEN  ********************** //
const PriceListItems = () => {
  // ********************** HOOKS AND CONSTANTS ********************** //
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const params = useParams();
  const navigate = useNavigate();

  // ********************** LOCAL STATE ********************** //

  // ********************** REDUX STATE ********************** //

  // ********************** COLUMN AND ROWS ********************** //
  const columns = [
    {
      headerName: "Item Number",
      field: "Item_Number",
      width: "150",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Item Description",
      field: "Item_Description",
      width: "350",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Brand",
      field: "Brand",
      width: "100",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Item Buyer",
      field: "Item_Buyer",
      width: "150",
      align: "left",
      headerAlign: "left",
      hide: false,
    },

    {
      headerName: "Secondary Class",
      field: "Secondary_Class",
      width: "150",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Alternate Class 1",
      field: "Alternate_Class_1",
      width: "150",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Alternate Class 2",
      field: "Alternate_Class_2",
      width: "150",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Fresh Frozen Dry",
      field: "Fresh_Frozen_Dry",
      width: "150",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Commodity",
      field: "Commodity",
      width: "150",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "FW or CW",
      field: "FW_or_CW",
      width: "150",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Item Class Description",
      field: "Item_Class_Description",
      width: "200",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Commodity PL",
      field: "Commodity_PL",
      width: "150",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Primary Vendor ID",
      field: "Primary_Vendor_ID",
      width: "200",
      align: "right",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Primary Vendor Name",
      field: "Primary_Vendor_Name",
      width: "250",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Pre Order",
      field: "PreOrder",
      width: "200",
      align: "Right",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Special Order",
      field: "SpecialOrder",
      width: "200",
      align: "Right",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Item Ship Weight",
      field: "ItemShipWeight",
      width: "200",
      align: "Right",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "UOfM",
      field: "UOfM",
      width: "170",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Qty InBase UOfM",
      field: "QtyInBaseUOfM",
      width: "200",
      align: "Right",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Vendor ItemNo",
      field: "VendorItemNo",
      width: "200",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "ABCCode",
      field: "ABCCode",
      width: "170",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
  ];

  const rows = [
    {
      item_key: 253,
      Item_Number: "017832D",
      Item_Description: "Beef Sukiyaki Meat v3 - 1/Bx Cvp (Vanguard)",
      Brand: "Vanguard",
      Item_Buyer: "scott",
      Secondary_Class: "Shortribs",
      Alternate_Class_1: "Damaged",
      Alternate_Class_2: "Vanguard",
      Fresh_Frozen_Dry: "Frozen",
      Commodity: "Vanguard",
      FW_or_CW: "Catch Weight",
      Item_Class_Description: "Beef, Frozen Vanguard",
      Commodity_PL: "Beef",
      Primary_Vendor_ID: 650155,
      Primary_Vendor_Name: "Vanguard Foods",
      PreOrder: 0,
      SpecialOrder: 0,
      dss_create_time: "06:16.0",
      dss_update_time: "00:02.8",
      Item_Type: 1,
      Item_Class_Code: 241,
      ItemShipWeight: 100,
      UOfM: "LB",
      QtyInBaseUOfM: 10.76,
      VendorItemNo: "017832D",
      SalesGLIndx: 545,
      ABCCode: "",
    },
    {
      item_key: 254,
      Item_Number: "17833",
      Item_Description: "Diced Special Trim Frs - 4/10# Cvp (Vanguard)",
      Brand: "Vanguard",
      Item_Buyer: "scott",
      Secondary_Class: "Special Trim",
      Alternate_Class_1: "PPC",
      Alternate_Class_2: "Vanguard",
      Fresh_Frozen_Dry: "Fresh",
      Commodity: "Vanguard",
      FW_or_CW: "Catch Weight",
      Item_Class_Description: "Beef, Fresh Vanguard",
      Commodity_PL: "Beef",
      Primary_Vendor_ID: 650155,
      Primary_Vendor_Name: "Vanguard Foods",
      PreOrder: 0,
      SpecialOrder: 0,
      dss_create_time: "06:16.0",
      dss_update_time: "00:02.8",
      Item_Type: 1,
      Item_Class_Code: 231,
      ItemShipWeight: 100,
      UOfM: "LB",
      QtyInBaseUOfM: 39.505,
      VendorItemNo: "17833",
      SalesGLIndx: 545,
      ABCCode: "",
    },
    {
      item_key: 255,
      Item_Number: "17834",
      Item_Description: 'Lipon Ch 3/4" Fs - 3/Cvp 40# (Vanguard)',
      Brand: "Vanguard",
      Item_Buyer: "scott",
      Secondary_Class: "Lipon Ribeye",
      Alternate_Class_1: "PPC",
      Alternate_Class_2: "Vanguard",
      Fresh_Frozen_Dry: "Fresh",
      Commodity: "Vanguard",
      FW_or_CW: "Catch Weight",
      Item_Class_Description: "Beef, Fresh Vanguard",
      Commodity_PL: "Beef",
      Primary_Vendor_ID: 650155,
      Primary_Vendor_Name: "Vanguard Foods",
      PreOrder: 0,
      SpecialOrder: 0,
      dss_create_time: "06:16.0",
      dss_update_time: "00:02.8",
      Item_Type: 1,
      Item_Class_Code: 231,
      ItemShipWeight: 100,
      UOfM: "LB",
      QtyInBaseUOfM: 8.7444,
      VendorItemNo: "17834",
      SalesGLIndx: 545,
      ABCCode: "",
    },
    {
      item_key: 256,
      Item_Number: "17835",
      Item_Description: "Diced Knuckle 3/8 Fs - 4/10# Cvp (Vanguard)",
      Brand: "Vanguard",
      Item_Buyer: "scott",
      Secondary_Class: "Knuckles",
      Alternate_Class_1: "PPC",
      Alternate_Class_2: "Vanguard",
      Fresh_Frozen_Dry: "Fresh",
      Commodity: "Vanguard",
      FW_or_CW: "Catch Weight",
      Item_Class_Description: "Beef, Fresh Vanguard",
      Commodity_PL: "Beef",
      Primary_Vendor_ID: 650155,
      Primary_Vendor_Name: "Vanguard Foods",
      PreOrder: 0,
      SpecialOrder: 0,
      dss_create_time: "06:16.0",
      dss_update_time: "00:02.8",
      Item_Type: 1,
      Item_Class_Code: 231,
      ItemShipWeight: 100,
      UOfM: "LB",
      QtyInBaseUOfM: 42.8077,
      VendorItemNo: "17835",
      SalesGLIndx: 545,
      ABCCode: "",
    },
    {
      item_key: 257,
      Item_Number: "230",
      Item_Description: "Admin-Beef - Admin ()",
      Brand: "",
      Item_Buyer: "Other",
      Secondary_Class: "Other",
      Alternate_Class_1: "",
      Alternate_Class_2: "Slaughter",
      Fresh_Frozen_Dry: "Fresh",
      Commodity: "Beef",
      FW_or_CW: "Fixed Weight",
      Item_Class_Description: "Beef, Fresh",
      Commodity_PL: "Beef",
      Primary_Vendor_ID: 500199,
      Primary_Vendor_Name: "Admin",
      PreOrder: 0,
      SpecialOrder: 0,
      dss_create_time: "06:16.0",
      dss_update_time: "00:02.8",
      Item_Type: 1,
      Item_Class_Code: 230,
      ItemShipWeight: 100,
      UOfM: "CS",
      QtyInBaseUOfM: 1,
      VendorItemNo: "230",
      SalesGLIndx: 143,
      ABCCode: "",
    },
    {
      item_key: 258,
      Item_Number: "1000",
      Item_Description: "Sample Fresh - Sample (Plymouth)",
      Brand: "Plymouth",
      Item_Buyer: "smatson",
      Secondary_Class: "Other",
      Alternate_Class_1: "SAMPLE",
      Alternate_Class_2: "Slaughter",
      Fresh_Frozen_Dry: "Fresh",
      Commodity: "Processed",
      FW_or_CW: "Catch Weight",
      Item_Class_Description: "Specialty Meats,Fresh",
      Commodity_PL: "Specialty",
      Primary_Vendor_ID: 290053,
      Primary_Vendor_Name: "Tyson Fresh Meats, Inc. - Beef",
      PreOrder: 0,
      SpecialOrder: 0,
      dss_create_time: "06:16.0",
      dss_update_time: "00:02.8",
      Item_Type: 1,
      Item_Class_Code: 800,
      ItemShipWeight: 100,
      UOfM: "LB",
      QtyInBaseUOfM: 12.18,
      VendorItemNo: "1000",
      SalesGLIndx: 1642,
      ABCCode: "C",
    },
    {
      item_key: 259,
      Item_Number: "1003",
      Item_Description: "Sample Carn. La Cabana #3 - Fresh (Plymouth)",
      Brand: "Plymouth",
      Item_Buyer: "house",
      Secondary_Class: "Other",
      Alternate_Class_1: "SAMPLE",
      Alternate_Class_2: "Slaughter",
      Fresh_Frozen_Dry: "Fresh",
      Commodity: "Poultry",
      FW_or_CW: "Fixed Weight",
      Item_Class_Description: "Chicken, Fresh",
      Commodity_PL: "Poultry",
      Primary_Vendor_ID: 500100,
      Primary_Vendor_Name: "Plymouth 7th",
      PreOrder: 0,
      SpecialOrder: 0,
      dss_create_time: "06:16.0",
      dss_update_time: "00:02.8",
      Item_Type: 1,
      Item_Class_Code: 110,
      ItemShipWeight: 100,
      UOfM: "LB",
      QtyInBaseUOfM: 10,
      VendorItemNo: "1003",
      SalesGLIndx: 139,
      ABCCode: "",
    },
    {
      item_key: 260,
      Item_Number: "1009",
      Item_Description: "Sample The Core Group - Fresh (Smithfield)",
      Brand: "Smithfield",
      Item_Buyer: "bhart",
      Secondary_Class: "Other",
      Alternate_Class_1: "SAMPLE",
      Alternate_Class_2: "Slaughter",
      Fresh_Frozen_Dry: "Fresh",
      Commodity: "Pork",
      FW_or_CW: "Fixed Weight",
      Item_Class_Description: "Pork, Fresh",
      Commodity_PL: "Pork",
      Primary_Vendor_ID: 180103,
      Primary_Vendor_Name: "Smithfield Fresh Meats",
      PreOrder: 0,
      SpecialOrder: 0,
      dss_create_time: "06:16.0",
      dss_update_time: "00:02.8",
      Item_Type: 1,
      Item_Class_Code: 210,
      ItemShipWeight: 100,
      UOfM: "LB",
      QtyInBaseUOfM: 1000,
      VendorItemNo: "1009",
      SalesGLIndx: 142,
      ABCCode: "",
    },
    {
      item_key: 261,
      Item_Number: "1015",
      Item_Description: "Sample Payless Foods - Fresh (Meyer)",
      Brand: "Meyer",
      Item_Buyer: "lbaskett",
      Secondary_Class: "Other",
      Alternate_Class_1: "SAMPLE",
      Alternate_Class_2: "Slaughter",
      Fresh_Frozen_Dry: "Fresh",
      Commodity: "Beef",
      FW_or_CW: "Fixed Weight",
      Item_Class_Description: "Beef, Fresh",
      Commodity_PL: "Beef",
      Primary_Vendor_ID: 410032,
      Primary_Vendor_Name: "Meyer Foods Group LLC",
      PreOrder: 0,
      SpecialOrder: 0,
      dss_create_time: "06:16.0",
      dss_update_time: "00:02.8",
      Item_Type: 1,
      Item_Class_Code: 230,
      ItemShipWeight: 100,
      UOfM: "LB",
      QtyInBaseUOfM: 10,
      VendorItemNo: "1015",
      SalesGLIndx: 143,
      ABCCode: "",
    },
    {
      item_key: 262,
      Item_Number: "1017",
      Item_Description: "Sample Bert's Red Apple - Labels (Anderson)",
      Brand: "Anderson",
      Item_Buyer: "Jared.Mitchell",
      Secondary_Class: "Other",
      Alternate_Class_1: "SAMPLE",
      Alternate_Class_2: "Slaughter",
      Fresh_Frozen_Dry: "Fresh",
      Commodity: "Processed",
      FW_or_CW: "Fixed Weight",
      Item_Class_Description: "Specialty Meats,Fresh",
      Commodity_PL: "Specialty",
      Primary_Vendor_ID: 304102,
      Primary_Vendor_Name: "Anderson Ranches Oregon Lamb",
      PreOrder: 0,
      SpecialOrder: 0,
      dss_create_time: "06:16.0",
      dss_update_time: "00:02.8",
      Item_Type: 1,
      Item_Class_Code: 800,
      ItemShipWeight: 100,
      UOfM: "LB",
      QtyInBaseUOfM: 5,
      VendorItemNo: "1017",
      SalesGLIndx: 1642,
      ABCCode: "C",
    },
  ];

  // ********************** TOOLBAR ********************** //
  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
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
            paddingX: 2,
          }}
        >
          <GridToolbarQuickFilter />
        </Box>
      </GridToolbarContainer>
    );
  }

  return (
    <Container>
      <Formik
        initialValues={{
          priceListID: "",
          priceListDescription: "",
        }}
        enableReinitialize={true}
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
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="breadcrumb">
              <Breadcrumb
                routeSegments={[
                  { name: "Control Pannel" },
                  { name: "Price List", path: "/pages/control-panel/price-list" },
                  { name: "Price List Items" },
                ]}
              />
              <Stack direction={"row"} gap={1}>

              
                <Button
                  variant="contained"
                  color="info"
                  size="small"
                  startIcon={<ArrowBackIcon size="small" />}
                  onClick={() => navigate("/pages/control-panel/price-list")}
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
                  id="priceListID"
                  name="priceListID"
                  label="Price List ID"
                  size="small"
                  sx={{ gridColumn: "span 2" }}
                  inputProps={{ readOnly: true }}
                  value={values.priceListID}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  id="priceListDescription"
                  name="priceListDescription"
                  label="Price List Description"
                  size="small"
                  sx={{ gridColumn: "span 2" }}
                  inputProps={{ readOnly: true }}
                  value={values.priceListDescription}
                />
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
                      color: `${theme.palette.primary.main} !important`,
                    },
                    "& .MuiDataGrid-row:hover": {
                      backgroundColor: theme.palette.action.hover,
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
                    rows={rows}
                    columns={columns}
                    // checkboxSelection
                    disableSelectionOnClick
                    disableRowSelectionOnClick
                    getRowId={(row) => row.item_key}
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
              </Box>
            </Paper>
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default PriceListItems;
