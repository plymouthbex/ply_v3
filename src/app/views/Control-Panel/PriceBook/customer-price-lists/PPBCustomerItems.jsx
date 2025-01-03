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
import { dataGridRowHeight } from "app/utils/constant";
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
      headerName: "Group Code",
      field: "GroupCode",
      width: "150",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Group Name",
      field: "GroupName",
      width: "150",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Price List ID",
      field: "ppc_PriceListID",
      width: "150",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Price list Name",
      field: "ppc_OverrideSeq",
      width: "200",
      flex:1,
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Item Number ",
      field: "ITEMNMBR",
      width: "150",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Item Description",
      field: "ppc_ItemDescription",
      width: "200",
      flex:1,
      align: "left",
      headerAlign: "left",
      hide: true,
    },
  ];

  const rows = [
    {
      Action: "Edit Delete",
      ppc_PriceListID: "WHTEFZ",
      ITEMNMBR: "102993",
      ppc_ItemDescription: "Breast Boneless/Skinless Medium",
      ppc_PrintSequence: 0,
      ppc_SpanishDescription: "",
      ppc_OverrideSeq: "",
      ppc_PriceComments_1: "",
      ppc_PriceComments_2: "",
      ppc_PriceComments_3: "",
      ppc_PriceComments_4: "",
      ppc_PriceComments_5: "",
      ppc_Comment: "",
      ENDDATE: "00:00.0",
      ppc_PrintItem: 0,
      ppc_SubListBreak: "",
      ppc_ManualChangeOnly: 0,
      UOFM: "CASE",
      QTYONHND: 0,
      QTYONORD: 0,
      CRUSRID: "dhopkins",
      CREATDDT: "00:00.0",
      TIME1: "51:13.0",
      MDFUSRID: "dhopkins",
      MODIFDT: "00:00.0",
      LSTCNTTM: "31:03.0",
      UNITPRCE: 0,
      ASOFDATE: "00:00.0",
      DEX_ROW_ID: 1107,
    },
    {
      Action: "Edit Delete",
      ppc_PriceListID: "WHTEFZ",
      ITEMNMBR: "155106",
      ppc_ItemDescription: "Breast Tender Clip",
      ppc_PrintSequence: 0,
      ppc_SpanishDescription: "",
      ppc_OverrideSeq: "",
      ppc_PriceComments_1: "",
      ppc_PriceComments_2: "",
      ppc_PriceComments_3: "",
      ppc_PriceComments_4: "",
      ppc_PriceComments_5: "",
      ppc_Comment: "",
      ENDDATE: "00:00.0",
      ppc_PrintItem: 0,
      ppc_SubListBreak: "",
      ppc_ManualChangeOnly: 0,
      UOFM: "CASE",
      QTYONHND: 0,
      QTYONORD: 0,
      CRUSRID: "dhopkins",
      CREATDDT: "00:00.0",
      TIME1: "51:13.0",
      MDFUSRID: "dhopkins",
      MODIFDT: "00:00.0",
      LSTCNTTM: "31:03.0",
      UNITPRCE: 0,
      ASOFDATE: "00:00.0",
      DEX_ROW_ID: 1108,
    },
    {
      Action: "Edit Delete",
      ppc_PriceListID: "PORTFS",
      ITEMNMBR: "421055",
      ppc_ItemDescription: "Breast B&S Portion 5oz Filet Nat",
      ppc_PrintSequence: 10,
      ppc_SpanishDescription: "",
      ppc_OverrideSeq: "",
      ppc_PriceComments_1: "",
      ppc_PriceComments_2: "",
      ppc_PriceComments_3: "",
      ppc_PriceComments_4: "",
      ppc_PriceComments_5: "",
      ppc_Comment: "",
      ENDDATE: "00:00.0",
      ppc_PrintItem: 1,
      ppc_SubListBreak: "",
      ppc_ManualChangeOnly: 0,
      UOFM: "CASE",
      QTYONHND: 10,
      QTYONORD: 0,
      CRUSRID: "dhopkins",
      CREATDDT: "00:00.0",
      TIME1: "55:56.0",
      MDFUSRID: "dhopkins",
      MODIFDT: "00:00.0",
      LSTCNTTM: "35:47.0",
      UNITPRCE: 3.67,
      ASOFDATE: "00:00.0",
      DEX_ROW_ID: 1158,
    },
    {
      Action: "Edit Delete",
      ppc_PriceListID: "PORTFS",
      ITEMNMBR: "421061",
      ppc_ItemDescription: "Breast B&S Portion 6oz Filet Nat",
      ppc_PrintSequence: 15,
      ppc_SpanishDescription: "",
      ppc_OverrideSeq: "",
      ppc_PriceComments_1: "",
      ppc_PriceComments_2: "",
      ppc_PriceComments_3: "",
      ppc_PriceComments_4: "",
      ppc_PriceComments_5: "",
      ppc_Comment: "",
      ENDDATE: "00:00.0",
      ppc_PrintItem: 1,
      ppc_SubListBreak: "",
      ppc_ManualChangeOnly: 1,
      UOFM: "CASE",
      QTYONHND: 330,
      QTYONORD: 10,
      CRUSRID: "dhopkins",
      CREATDDT: "00:00.0",
      TIME1: "55:56.0",
      MDFUSRID: "dhopkins",
      MODIFDT: "00:00.0",
      LSTCNTTM: "35:50.0",
      UNITPRCE: 3.67,
      ASOFDATE: "00:00.0",
      DEX_ROW_ID: 1159,
    },
    {
      Action: "Edit Delete",
      ppc_PriceListID: "WHTEFZ",
      ITEMNMBR: "200208",
      ppc_ItemDescription: "Mag Breast Boneless & Skinless Bulk",
      ppc_PrintSequence: 0,
      ppc_SpanishDescription: "",
      ppc_OverrideSeq: "",
      ppc_PriceComments_1: "",
      ppc_PriceComments_2: "",
      ppc_PriceComments_3: "",
      ppc_PriceComments_4: "",
      ppc_PriceComments_5: "",
      ppc_Comment: "",
      ENDDATE: "00:00.0",
      ppc_PrintItem: 0,
      ppc_SubListBreak: "",
      ppc_ManualChangeOnly: 0,
      UOFM: "CASE",
      QTYONHND: 0,
      QTYONORD: 0,
      CRUSRID: "dhopkins",
      CREATDDT: "00:00.0",
      TIME1: "51:13.0",
      MDFUSRID: "dhopkins",
      MODIFDT: "00:00.0",
      LSTCNTTM: "31:03.0",
      UNITPRCE: 0,
      ASOFDATE: "00:00.0",
      DEX_ROW_ID: 1111,
    },
    {
      Action: "Edit Delete",
      ppc_PriceListID: "WHTEFZ",
      ITEMNMBR: "412611",
      ppc_ItemDescription: "Breast Boneless/Skinless Plat Hrvst",
      ppc_PrintSequence: 0,
      ppc_SpanishDescription: "",
      ppc_OverrideSeq: "",
      ppc_PriceComments_1: "",
      ppc_PriceComments_2: "",
      ppc_PriceComments_3: "",
      ppc_PriceComments_4: "",
      ppc_PriceComments_5: "",
      ppc_Comment: "",
      ENDDATE: "00:00.0",
      ppc_PrintItem: 0,
      ppc_SubListBreak: "",
      ppc_ManualChangeOnly: 0,
      UOFM: "CASE",
      QTYONHND: 0,
      QTYONORD: 0,
      CRUSRID: "dhopkins",
      CREATDDT: "00:00.0",
      TIME1: "51:13.0",
      MDFUSRID: "dhopkins",
      MODIFDT: "00:00.0",
      LSTCNTTM: "31:03.0",
      UNITPRCE: 1.34,
      ASOFDATE: "00:00.0",
      DEX_ROW_ID: 1112,
    },
    {
      Action: "Edit Delete",
      ppc_PriceListID: "WHTEFZ",
      ITEMNMBR: "452173",
      ppc_ItemDescription: "Breast Tender Jumbo Clipped",
      ppc_PrintSequence: 0,
      ppc_SpanishDescription: "",
      ppc_OverrideSeq: "",
      ppc_PriceComments_1: "",
      ppc_PriceComments_2: "",
      ppc_PriceComments_3: "",
      ppc_PriceComments_4: "",
      ppc_PriceComments_5: "",
      ppc_Comment: "",
      ENDDATE: "00:00.0",
      ppc_PrintItem: 0,
      ppc_SubListBreak: "",
      ppc_ManualChangeOnly: 0,
      UOFM: "CASE",
      QTYONHND: 0,
      QTYONORD: 0,
      CRUSRID: "dhopkins",
      CREATDDT: "00:00.0",
      TIME1: "51:13.0",
      MDFUSRID: "dhopkins",
      MODIFDT: "00:00.0",
      LSTCNTTM: "31:03.0",
      UNITPRCE: 0,
      ASOFDATE: "00:00.0",
      DEX_ROW_ID: 1113,
    },
    {
      Action: "Edit Delete",
      ppc_PriceListID: "PORTFS",
      ITEMNMBR: "421075",
      ppc_ItemDescription: "BRST 7Z B&S NAT FRSH",
      ppc_PrintSequence: 0,
      ppc_SpanishDescription: "",
      ppc_OverrideSeq: "",
      ppc_PriceComments_1: "",
      ppc_PriceComments_2: "",
      ppc_PriceComments_3: "",
      ppc_PriceComments_4: "",
      ppc_PriceComments_5: "",
      ppc_Comment: "",
      ENDDATE: "00:00.0",
      ppc_PrintItem: 0,
      ppc_SubListBreak: "",
      ppc_ManualChangeOnly: 1,
      UOFM: "CASE",
      QTYONHND: 0,
      QTYONORD: 0,
      CRUSRID: "dhopkins",
      CREATDDT: "00:00.0",
      TIME1: "55:56.0",
      MDFUSRID: "dhopkins",
      MODIFDT: "00:00.0",
      LSTCNTTM: "34:58.0",
      UNITPRCE: 0,
      ASOFDATE: "00:00.0",
      DEX_ROW_ID: 1160,
    },
    {
      Action: "Edit Delete",
      ppc_PriceListID: "WHTEFZ",
      ITEMNMBR: "500664",
      ppc_ItemDescription: "Breast Tenders S/A Traypack",
      ppc_PrintSequence: 0,
      ppc_SpanishDescription: "",
      ppc_OverrideSeq: "",
      ppc_PriceComments_1: "",
      ppc_PriceComments_2: "",
      ppc_PriceComments_3: "",
      ppc_PriceComments_4: "",
      ppc_PriceComments_5: "",
      ppc_Comment: "",
      ENDDATE: "00:00.0",
      ppc_PrintItem: 0,
      ppc_SubListBreak: "",
      ppc_ManualChangeOnly: 0,
      UOFM: "CASE",
      QTYONHND: 0,
      QTYONORD: 0,
      CRUSRID: "dhopkins",
      CREATDDT: "00:00.0",
      TIME1: "51:13.0",
      MDFUSRID: "dhopkins",
      MODIFDT: "00:00.0",
      LSTCNTTM: "31:03.0",
      UNITPRCE: 0,
      ASOFDATE: "00:00.0",
      DEX_ROW_ID: 1115,
    },
    {
      Action: "Edit Delete",
      ppc_PriceListID: "WHTEFZ",
      ITEMNMBR: "504507",
      ppc_ItemDescription: "Whole Breast Bone-In Medium",
      ppc_PrintSequence: 0,
      ppc_SpanishDescription: "Pechuga Con Hueso",
      ppc_OverrideSeq: "",
      ppc_PriceComments_1: "",
      ppc_PriceComments_2: "",
      ppc_PriceComments_3: "",
      ppc_PriceComments_4: "",
      ppc_PriceComments_5: "",
      ppc_Comment: "",
      ENDDATE: "00:00.0",
      ppc_PrintItem: 0,
      ppc_SubListBreak: "",
      ppc_ManualChangeOnly: 0,
      UOFM: "CASE",
      QTYONHND: 0,
      QTYONORD: 0,
      CRUSRID: "dhopkins",
      CREATDDT: "00:00.0",
      TIME1: "51:13.0",
      MDFUSRID: "dhopkins",
      MODIFDT: "00:00.0",
      LSTCNTTM: "31:03.0",
      UNITPRCE: 1.25,
      ASOFDATE: "00:00.0",
      DEX_ROW_ID: 1116,
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
                  { name: "Price Book" },
                  { name: "Customer Price Lists", path: "/pages/control-panel/customer-price-lists" },
                  { name: "Customer Price Lists " },
                ]}
              />
              <Stack direction={"row"} gap={1}>
                
                <Button
                  variant="contained"
                  color="info"
                  size="small"
                  startIcon={<ArrowBackIcon size="small" />}
                  onClick={() => navigate("/pages/control-panel/customer-price-lists")}
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
                    // checkboxSelection
                    disableSelectionOnClick
                    disableRowSelectionOnClick
                    getRowId={(row) => row.ITEMNMBR}
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
