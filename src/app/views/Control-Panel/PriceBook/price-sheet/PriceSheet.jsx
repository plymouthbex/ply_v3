import React, { useEffect, useState } from "react";
import {
  LinearProgress,
  Paper,
  Button,
  Box,
  styled,
  useTheme,
  TableContainer,
  Stack,
  // Tooltip,
  IconButton,
  useMediaQuery,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  FormControl,
  DialogActions,
  DialogTitle,
  Dialog,
  DialogContent,
} from "@mui/material";
import AlertDialog from "app/components/AlertDialog";
import CircularProgress from "@mui/material/CircularProgress";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Breadcrumb } from "app/components";
import {
  dataGridHeight,
  dataGridPageSize,
  dataGridpageSizeOptions,
  dataGridRowHeight,
  dataGridHeaderFooterHeight,
} from "app/utils/constant";

// ********************** ICONS ********************** //
import DeleteIcon from "@mui/icons-material/Delete";
import { Add, RefreshOutlined } from "@mui/icons-material";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useLocation, useNavigate } from "react-router-dom";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import {
  getCompanyListView,
  getPriceListView,
  getPrintGroupListView,
  gtRefeshPriceList,
  getPriceSheetView,
} from "app/redux/slice/listviewSlice";
import { useDispatch, useSelector } from "react-redux";
import SaveIcon from "@mui/icons-material/Save";
import {
  clearPriceListState,
  clearPrintGroupState,
  printGroupSelectedItems,
  clearCustomerListState,
  customerListSelectedItems,
} from "app/redux/slice/getSlice";
import toast from "react-hot-toast";
import {
  CustomerPriceListOptimizedAutocomplete,
  FormikCustomSelectCompany,
  FormikCustomSelectCompanyPriceList,
  PriceListOptimizedAutocomplete,
  PrintGroupOptimizedAutocomplete,
} from "app/components/SingleAutocompletelist";
import useAuth from "app/hooks/useAuth";
import { Formik } from "formik";
import {
  CopyCompanyPriceList,
  UpdateSeqPriceList,
} from "app/redux/slice/postSlice";
import { LoadingButton } from "@mui/lab";

// ********************** STYLED COMPONENTS ********************** //
const Container = styled("div")(({ theme }) => ({
  margin: "15px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "10px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

// ********************** ITEMS SCREEN LISTVIEW ********************** //
const PriceSheet = () => {
  // ********************** HOOKS AND CONSTANTS ********************** //
  const theme = useTheme();
  const naviate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const State = location.state;
  console.log("🚀 ~ PriceSheet ~ state:", State);
  const { user } = useAuth();
  const isNonMobile = useMediaQuery("(min-width:900px)");
  const [priceBookCateData, setPriceBookCateData] = useState({});
  const [companyError, setCompanyError] = useState("");

  // ********************** LOCAL STATE ********************** //

  const [printSelectedData, setPrintSelectedData] = useState(null);

  const handlePrintSelectedData = (newValue) => {
    setPrintSelectedData(newValue);
  };

  const [customerSelectData, setCustomerSelectData] = useState(null);

  const handleCustomerSelectData = (newValue) => {
    setCustomerSelectData(newValue);
  };
  const [rowSelectionID, setRowSelectionID] = React.useState("");
  const[isLoading,setIsLoading]= React.useState(false);
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const [rowSelectionModelRows, setRowSelectionModelRows] = React.useState([]);
  // ********************** REDUX STATE ********************** //

  const loading = useSelector((state) => state.listview.priceListloading);
   const priceSheetRows = useSelector((state) => state.listview.priceSheetViewData);
  const ItemCount = useSelector((state) => state.listview.ItemCount);
  console.log("🚀 ~ PriceList ~ ItemCount:", ItemCount);
  // ********************** COLUMN AND ROWS ********************** //
const columns = [
  {
    headerName: "Price Sheet",
    field: "PriceSheetName",
    minWidth: 200,
    flex: 1,
    align: "left",
    headerAlign: "left",
  },
  {
    headerName: "Print Category",
    field: "PrintCategory",
    width: 160,
    align: "center",
    headerAlign: "center",
    sortable: false,
    renderCell: (params) => (
      <Checkbox
        checked={params.row.PrintCategory === true}
        onChange={(event) => {
          const checked = event.target.checked;

          console.log(
            "Print Category:",
            params.row.PriceSheetName,
            checked
          );

          // Later you can dispatch/API call here
        }}
      />
    ),
  },
  {
    headerName: "Print Price List",
    field: "PrintPriceList",
    width: 180,
    align: "center",
    headerAlign: "center",
    sortable: false,
    renderCell: (params) => (
      <Checkbox
        checked={params.row.PrintPriceList === true}
        onChange={(event) => {
          const checked = event.target.checked;

          console.log(
            "Print Price List:",
            params.row.PriceSheetName,
            checked
          );

          // Later you can dispatch/API call here
        }}
      />
    ),
  },
  {
    headerName: "Item Count",
    field: "ItemCount",
    width: 150,
    align: "right",
    headerAlign: "center",
    hide: true,
  },
  {
    field: "Action",
    headerName: "Action",
    minWidth: 300,
    flex: 1,
    sortable: false,
    headerAlign: "center",
    filterable: false,
    disableColumnMenu: true,
    disableExport: true,
    align: "center",
    renderCell: (params) => {
      return (
        <div style={{ display: "flex", gap: "10px" }}>
          <IconButton
            onClick={() => {
              naviate(
                "/pages/control-panel/price-sheet/price-sheet-detail/edit",
                {
                  state: {
                    id: params.row.PriceSheetID,
                    companyCode: companyID,
                    companyRecordID: companyRecordID,
                  },
                }
              );
            }}
            sx={{ height: 30, width: 30 }}
          >
            <ModeEditOutlineIcon fontSize="small" />
          </IconButton>

          <IconButton
            onClick={() => {
              naviate(
                "/pages/control-panel/price-sheet/price-sheet-detail/delete",
                {
                  state: {
                    id: params.row.PriceSheetID,
                    companyCode: companyID,
                    companyRecordID: companyRecordID,
                  },
                }
              );
            }}
            sx={{ height: 30, width: 30 }}
          >
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>

          <IconButton
            onClick={() => {
              naviate(
                "/pages/control-panel/price-sheet/price-sheet-detail/view",
                {
                  state: {
                    id: params.row.PriceSheetID,
                    companyCode: companyID,
                    companyRecordID: companyRecordID,
                  },
                }
              );
            }}
            sx={{ height: 30, width: 30 }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </div>
      );
    },
  },
];


  //==============COMPANYLISTVIEW=======================/
  const comapnyListViewData = useSelector(
    (state) => state.listview.comapnyListViewData
  );
  const status = useSelector((state) => state.listview.status);
  const error = useSelector((state) => state.listview.error);

  console.log("🚀 ~ PriceList ~ comapnyListViewData:", comapnyListViewData);

  // ********************** TOOLBAR ********************** //
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [companyID, setCompanyID] = useState(State.code ?? user.companyCode);
  console.log("🚀 ~ PriceList ~ companyID:", companyID);
  const [companyRecordID, setCompanyRecordID] = useState(
    State.id ?? user.companyID
  );
  console.log("🚀 ~ PriceList ~ companyRecordID:", companyRecordID);
  useEffect(() => {
    dispatch(getPriceSheetView({ ID: companyRecordID }));
    dispatch(clearPriceListState());
    // dispatch(getPrintGroupListView());
    // dispatch(clearPrintGroupState());
    // dispatch(clearCustomerListState());
  }, []);

  const CustomToolbar = React.memo(() => {
    return (
      <GridToolbarContainer
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
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
            width: "100%",
          }}
        >
          {/* <FormikCustomSelectCompanyPriceList
            name="company"
            id="company"
            multiple={false}
            value={companyRecordID}
            onChange={(e) => {
              setCompanyID(e.target.value);
              setCompanyRecordID(e.target.value);
              dispatch(getPriceListView({ ID: e.target.value }));
              // setSelectedCompany(e.target.value)
            }}
            label="Company"
            url={`${process.env.REACT_APP_BASE_URL}CompanyModule/CompanyListView`}
          /> */}
          <></>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 , justifyContent: "flex-end"}}>
            {/* <Typography sx={{ mt: 1 }}>
              Total Items Count: {ItemCount}
            </Typography> */}
            <GridToolbarQuickFilter />
            {/* <Tooltip title="Create Price List"> */}
            <IconButton
              color="info"
              onClick={() => {
                naviate(
                  "/pages/control-panel/price-sheet/price-sheet-detail/add",
                  {
                    state: {
                      id: 0,
                      companyCode: companyID,
                      companyRecordID: companyRecordID,
                    },
                  }
                );
              }}
            >
              <Add
                sx={{
                  fontSize: 30, // Increased icon size
                  color: theme.palette.success.main,
                }}
              />
            </IconButton>
            {/* </Tooltip> */}
            {/* <Button
              variant="contained"
              color="info"
              sx={{ width: 110, height: 30 }}
              onClick={async () => {
                const res = await dispatch(
                  gtRefeshPriceList({
                    CompanyID: companyRecordID ?? user.companyID,
                    user: user.name,
                  })
                );
                console.log(res, "res");
                if (res.payload.status === "Y") {
                  dispatch(getPriceListView({ ID: companyRecordID }));
                }
              }}
            >
              Refresh All
            </Button> */}
          </Box>
        </Box>
      </GridToolbarContainer>
    );
  });

  const [openAlert, setOpenAlert] = useState(false);
  const [postError, setPostError] = useState(false);
  const [postMessage, setPostMessage] = useState(false);
  const PriceListSaveFn = async (values, setSubmitting) => {
    const postData = {
      RecordID: rowSelectionID,
      PriceListID: values.PriceListID,
      PrintSequence: values.PrintSequence,
      priceListDescription: values.priceListDescription,
    };
    console.log("🚀 ~ PriceListSaveFn ~ postData:", postData);
    try {
      const response = await dispatch(UpdateSeqPriceList({ data: postData }));

      if (response.payload.status === "Y") {
        setOpenAlert(true);
        setPostMessage(response.payload.message);
        dispatch(getPriceListView({ ID: companyRecordID }));
      } else {
        setPostMessage(response.payload.message);
        setOpenAlert(true);
        setPostError(true);
      }
    } catch (error) {
      console.error("Error during HandleSave:", error);
    }
    setSubmitting(false);
  };
  //===============COMPANY COPY SAVE====================//
  const CopySaveFn = async (values, setSubmitting) => {
    setIsLoading(true)
    //   {
    //   "PriceListID": 3,
    //   "CompanyID": 5,
    //   "SelectedCompanyID": "63",
    //   "UserName": "Admin"
    // }
    const postData = {
      PriceListID: rowSelectionID,
      UserName: user.username,
      CompanyID: companyRecordID,
      SelectedCompanyID: values.companyIDs.join(","),
    };
    console.log("🚀 ~ PriceListSaveFn ~ postData:", postData);
    //return;
    try {
      const response = await dispatch(CopyCompanyPriceList({ data: postData }));

      if (response.payload.status === "Y") {
         setIsLoading(false)
        setOpenAlert(true);
        setPostMessage(response.payload.message);
        dispatch(getPriceListView({ ID: companyRecordID }));
      } else {
        setIsLoading(false)
        setPostMessage(response.payload.message);
        setOpenAlert(true);
        setPostError(true);
      }
    } catch (error) {
      console.error("Error during HandleSave:", error);
    }
    setSubmitting(false);
  };
  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            {
              name: "Control Panel",
            },
            { name: "Price Sheet" },
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
              gridColumn: isNonMobile ? undefined : "span 4",
            },
            padding: "10px",
          }}
        >
          <Box
            sx={{
              gridColumn:  "span 4",
              // gridColumn: isSide ? "span 3" : "span 4",
              height: dataGridHeight,
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
              "& .MuiDataGrid-row:hover": {
                border: "3px solid #999999",
                // border: `1px solid #${theme.palette.action.selected} !important`, // Change border color on hover
                borderRadius: "4px", // Optional: Add rounded corners
              },
              // Prevent selected row background color from changing on hover
              // "& .MuiDataGrid-row.Mui-selected:hover": {
              //   backgroundColor: `${theme.palette.action.selected} !important`, // Ensure the background remains the same on hover
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
              rows={priceSheetRows}
              columns={columns}
              loading={loading}
              // checkboxSelection
              onRowClick={(params) => {
                setPriceBookCateData(params.row);
                setRowSelectionID(params.row.PriceSheetID);
              }}
              // disableSelectionOnClick
              // disableRowSelectionOnClick
              getRowId={(row) => row.PriceSheetID}
              initialState={{
                pagination: { paginationModel: { pageSize: dataGridPageSize } },
              }}
              pageSizeOptions={dataGridpageSizeOptions}
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
              // onRowSelectionModelChange={(newRowSelectionModel) => {
              //   const filterArray = priceRows.filter((v) =>
              //     newRowSelectionModel.includes(v.PRICELISTID)
              //   );
              //   setRowSelectionModel(newRowSelectionModel);
              //   setRowSelectionModelRows(filterArray);
              // }}
              // rowSelectionModel={rowSelectionModel}
            />
          </Box>
        </Box>
      </Paper>
      <AlertDialog
        logo={`data:image/png;base64,${user.logo}`}
        open={openAlert}
        error={postError}
        message={postError ? postError : postMessage}
        Actions={
          <DialogActions>
            <Button
              variant="contained"
              color="info"
              size="small"
              onClick={() => {
                setPostError(null);
                setPostMessage(null);
                setOpenAlert(false);
              }}
            >
              close
            </Button>
          </DialogActions>
        }
      />
    </Container>
  );
};

export default PriceSheet;
