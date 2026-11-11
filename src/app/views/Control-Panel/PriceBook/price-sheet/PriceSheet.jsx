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
import CloseIcon from "@mui/icons-material/Close";
import { Add, RefreshOutlined } from "@mui/icons-material";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useLocation, useNavigate } from "react-router-dom";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import GroupIcon from "@mui/icons-material/Group"; // NEW

import {
  getCompanyListView,
  getPriceListView,
  getPrintGroupListView,
  gtRefeshPriceList,
  getPriceSheetView,
  getAssignedCustomersByPriceSheet,
  clearAssignedCustomers
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
  CopyPriceSheet,
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
  const [isLoading, setIsLoading] = React.useState(false);
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const [rowSelectionModelRows, setRowSelectionModelRows] = React.useState([]);

  // Copy Price Sheet State
  const [openCopyDialog, setOpenCopyDialog] = useState(false);
  const [selectedCopyRow, setSelectedCopyRow] = useState(null);
  const [newPriceSheetName, setNewPriceSheetName] = useState("");
  const [copyError, setCopyError] = useState("");
  const [isCopying, setIsCopying] = useState(false);

  const handleOpenCopyDialog = (row, e) => {
    e?.stopPropagation();
    setSelectedCopyRow(row);
    setNewPriceSheetName("");
    setCopyError("");
    setOpenCopyDialog(true);
  };

  const handleSaveCopyPriceSheet = async () => {
    if (!newPriceSheetName || !newPriceSheetName.trim()) {
      setCopyError("Please enter price sheet name");
      return;
    }

    setIsCopying(true);
    try {
      const payload = {
        companyID: companyRecordID || user?.companyID || 0,
        userID: user?.id || 0,
        priceSheetID: selectedCopyRow?.PriceSheetID || 0,
        newPriceSheetName: newPriceSheetName.trim(),
      };

      const res = await dispatch(CopyPriceSheet({ data: payload })).unwrap();
      if (res?.status === "Y" || res?.status === 200 || res?.Status === "Y") {
        toast.success(
          res?.message || res?.Message || "Price sheet copied successfully"
        );
        setOpenCopyDialog(false);
        setNewPriceSheetName("");
        dispatch(getPriceSheetView({ ID: companyRecordID || user?.companyID }));
      } else {
        setCopyError(
          res?.message || res?.Message || "Failed to copy price sheet"
        );
      }
    } catch (err) {
      setCopyError(err?.message || err || "Error copying price sheet");
    } finally {
      setIsCopying(false);
    }
  };

  // ********************** ASSIGNED CUSTOMERS POPUP (NEW) ********************** //
  const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [customerSearch, setCustomerSearch] = useState("");

  // const { customers, loading: customerLoading } = useSelector(
  //   (state) => state.customerPriceSheet
  // );

  const customers = useSelector((state) => state.listview.customers);
  const customerLoading = useSelector(
    (state) => state.listview.customersLoading
  );
  const handleOpenCustomerDialog = (row, e) => {
    e?.stopPropagation();
    setSelectedSheet(row);
    setCustomerSearch("");
    setOpenCustomerDialog(true);
    dispatch(
      getAssignedCustomersByPriceSheet({
        companyRecID: companyRecordID || user?.companyID,
        priceSheetID: row.PriceSheetID,
      })
    );
  };

  const handleCloseCustomerDialog = () => {
    setOpenCustomerDialog(false);
    dispatch(clearAssignedCustomers());
  };

  const customerRows = React.useMemo(() => {
    const q = customerSearch.trim().toLowerCase();
    return (customers || [])
      .map((c, i) => ({ ...c, sno: i + 1 }))
      .filter(
        (c) =>
          !q ||
          String(c.PC_CUSTOMER || "").toLowerCase().includes(q) ||
          String(c.PC_CUSTOMERNAME || "").toLowerCase().includes(q)
      );
  }, [customers, customerSearch]);

  const customerColumns = [
    {
      field: "PC_CUSTOMER",
      headerName: "Customer Number",
      width: 180,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "PC_CUSTOMERNAME",
      headerName: "Customer Name",
      flex: 1,
      minWidth: 250,
      align: "left",
      headerAlign: "left",
    },
  ];

  // ********************** REDUX STATE ********************** //

  const loading = useSelector((state) => state.listview.priceListloading);
  const priceSheetRows = useSelector(
    (state) => state.listview.priceSheetViewData
  );
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
      headerName: "Description",
      field: "PriceSheetDesc",
      minWidth: 200,
      flex: 1,
      align: "left",
      headerAlign: "left",
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
              onClick={(e) => handleOpenCopyDialog(params.row, e)}
              sx={{ height: 30, width: 30 }}
              title="Copy Price Sheet"
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>

            <IconButton
              onClick={() => {
                naviate(
                  "/pages/control-panel/price-sheet/price-sheet-detail/move",
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
              title="Move Items"
            >
              <DriveFileMoveIcon fontSize="small" sx={{ color: "#174c4f" }} />
            </IconButton>

            {/* NEW: Assigned Customers */}
            <IconButton
              onClick={(e) => handleOpenCustomerDialog(params.row, e)}
              sx={{ height: 30, width: 30 }}
              title="Assigned Customers"
            >
              <GroupIcon
                fontSize="small"
                sx={{ color: theme.palette.info.main }}
              />
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
          <></>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              justifyContent: "flex-end",
            }}
          >
            <GridToolbarQuickFilter />
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
                  fontSize: 30,
                  color: theme.palette.success.main,
                }}
              />
            </IconButton>
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
    setIsLoading(true);
    const postData = {
      PriceListID: rowSelectionID,
      UserName: user.username,
      CompanyID: companyRecordID,
      SelectedCompanyID: values.companyIDs.join(","),
    };
    console.log("🚀 ~ PriceListSaveFn ~ postData:", postData);
    try {
      const response = await dispatch(CopyCompanyPriceList({ data: postData }));

      if (response.payload.status === "Y") {
        setIsLoading(false);
        setOpenAlert(true);
        setPostMessage(response.payload.message);
        dispatch(getPriceListView({ ID: companyRecordID }));
      } else {
        setIsLoading(false);
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
              gridColumn: "span 4",
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
              "& .MuiDataGrid-row:hover": {
                border: "3px solid #999999",
                borderRadius: "4px",
              },
              "& .MuiTablePagination-root": {
                color: "white !important",
              },
              "& .MuiTablePagination-root .MuiTypography-root": {
                color: "white !important",
              },
              "& .MuiTablePagination-actions .MuiSvgIcon-root": {
                color: "white !important",
              },
            }}
          >
            <DataGrid
              columnHeaderHeight={dataGridHeaderFooterHeight}
              sx={{
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
              onRowClick={(params) => {
                setPriceBookCateData(params.row);
                setRowSelectionID(params.row.PriceSheetID);
              }}
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

      {/* Copy Price Sheet Dialog */}
      <Dialog
        open={openCopyDialog}
        onClose={() => {
          if (!isCopying) {
            setOpenCopyDialog(false);
            setCopyError("");
          }
        }}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            padding: "16px 20px",
          },
        }}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          pt={1}
          pb={1}
        >
          <img
            src={
              user?.logo
                ? `data:image/png;base64,${user.logo}`
                : "/assets/images/logo.png"
            }
            height="50px"
            alt="Logo"
          />
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mt={1}
        >
          <Box width="100%">
            <Typography
              variant="body2"
              fontWeight="bold"
              color="#111827"
              textAlign="center"
            >
              Copy Price Sheet ({selectedCopyRow?.PriceSheetName})
            </Typography>
          </Box>
        </Box>

        <DialogContent sx={{ px: 0, py: 1.5 }}>
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="caption" fontWeight="bold" color="#374151">
              New Price Sheet Name <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter price sheet name"
              size="small"
              value={newPriceSheetName}
              onChange={(e) => {
                setNewPriceSheetName(e.target.value);
                if (copyError) setCopyError("");
              }}
              error={!!copyError}
              helperText={copyError}
              autoFocus
              autoComplete="off"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "6px",
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions
          sx={{ px: 0, pb: 0, justifyContent: "flex-end", gap: 1.5, mt: 1 }}
        >
          <LoadingButton
            loading={isCopying}
            variant="contained"
            onClick={handleSaveCopyPriceSheet}
            startIcon={
              !isCopying && (
                <ContentCopyIcon sx={{ color: "#fff", fontSize: 18 }} />
              )
            }
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              backgroundColor: "#8E8E8E",
              color: "#fff",
              px: 2.5,
              py: 0.75,
              fontWeight: 600,
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)",
              "&:hover": {
                backgroundColor: "#7B7B7B",
              },
            }}
          >
            Copy
          </LoadingButton>
          <Button
            variant="contained"
            onClick={() => {
              setOpenCopyDialog(false);
              setCopyError("");
            }}
            disabled={isCopying}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              backgroundColor: "#8E8E8E",
              color: "#fff",
              px: 2.5,
              py: 0.75,
              fontWeight: 600,
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)",
              "&:hover": {
                backgroundColor: "#7B7B7B",
              },
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* NEW: Assigned Customers Dialog */}
      <Dialog
        open={openCustomerDialog}
        onClose={handleCloseCustomerDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: "12px", overflow: "hidden" } }}
      >
        <DialogTitle
          sx={{
            //backgroundColor: "#174c4f",
            backgroundColor: `${theme.palette.info.main}`,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            py: 1.5,
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <GroupIcon />
            <Typography variant="h6" component="span" fontWeight={600}>
              Customers – {selectedSheet?.PriceSheetName} (Price Sheet)
            </Typography>
          </Box>
          <IconButton
            onClick={handleCloseCustomerDialog}
            sx={{ color: "#fff" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: "16px !important" }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            gap={2}
          >
           {/*  <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: "6px",
                backgroundColor: "#E6F4F1",
                border: "1px solid #BCE3DD",
              }}
            >
              <Typography variant="body2" fontWeight={600} color="#174c4f">
                Total Customers: {customers?.length || 0}
              </Typography> 
            </Box>*/}
            <Box> <Typography ></Typography></Box>
            <TextField
              size="small"
              placeholder="Search customer..."
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              sx={{ width: 280 }}
            />
          </Box>

          <Box
            sx={{
              height: 420,
              "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeader, & .MuiDataGrid-filler, & .MuiDataGrid-scrollbarFiller": {
                backgroundColor: `${theme.palette.info.main} !important`,
                color: `${theme.palette.info.contrastText} !important`,
                fontWeight: "bold",
                fontSize: theme.typography.subtitle2.fontSize,
              },
              "& .MuiDataGrid-columnHeaderTitle": { fontWeight: "bold" },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: theme.palette.info.light,
              },
              "& .MuiDataGrid-row:nth-of-type(even)": {
                backgroundColor: theme.palette.action.hover,
              },
              "& .MuiDataGrid-row:nth-of-type(odd)": {
                backgroundColor: theme.palette.background.default,
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: theme.palette.info.main,
                color: theme.palette.info.contrastText,
                borderTop: "none",
              },
              "& .MuiTablePagination-root, & .MuiTablePagination-root .MuiTypography-root, & .MuiTablePagination-actions .MuiSvgIcon-root, & .MuiTablePagination-select, & .MuiSelect-icon":
                { color: "white !important" },
            }}
          >
            <DataGrid
              rows={customerRows}
              columns={customerColumns}
              getRowId={(row) => row.CustomerPriceSheetID}
              loading={customerLoading}
              columnHeaderHeight={dataGridHeaderFooterHeight}
              rowHeight={dataGridRowHeight}
              slots={{ loadingOverlay: LinearProgress }}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              pageSizeOptions={[10, 25, 50, 100]}
              disableColumnFilter
              disableColumnSelector
              disableColumnMenu
              disableDensitySelector
              disableRowSelectionOnClick
              sx={{
                "& .MuiDataGrid-footerContainer": {
                  height: dataGridHeaderFooterHeight,
                  minHeight: dataGridHeaderFooterHeight,
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="contained"
            onClick={handleCloseCustomerDialog}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              backgroundColor: "#8E8E8E",
              color: "#fff",
              px: 2.5,
              fontWeight: 600,
              "&:hover": { backgroundColor: "#7B7B7B" },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PriceSheet;
