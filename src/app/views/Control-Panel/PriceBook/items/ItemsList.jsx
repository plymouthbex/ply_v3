import React, { useEffect, useState } from "react";
import {
  Box,
  LinearProgress,
  Paper,
  Button,
  styled,
  useTheme,
  TextField,
  Grid,
  FormControl,
  useMediaQuery,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Stack,
  DialogActions,
  Tooltip,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
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
import { RefreshOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  getItemListView,
  getPriceListView,
} from "app/redux/slice/listviewSlice";
import {
  clearPriceListState,
  fetchgGetAItems,
  priceListSelectedItems,
} from "app/redux/slice/getSlice";
import {
  FormikCompanyOptimizedAutocomplete,
  PriceListOptimizedAutocomplete,
} from "app/components/SingleAutocompletelist";
import { PostAdHocItem } from "app/redux/slice/postSlice";
import AlertDialog from "app/components/AlertDialog";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import useAuth from "app/hooks/useAuth";
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
const ItemList = () => {
  // ********************** HOOKS AND CONSTANTS ********************** //
  const { user } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isNonMobile = useMediaQuery("(min-width:900px)");

  // ********************** LOCAL STATE ********************** //
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const [rowSelectionModelRows, setRowSelectionModelRows] = React.useState([]);
  console.log(
    "🚀 ~ ItemList ~ rowSelectionModelRows:",
    JSON.stringify(rowSelectionModelRows)
  );

  const [itemdata, setItemData] = useState({
    brand: "",
    itemBuyer: "",
    secondaryClass: "",
    alternateClass: "",
  });

  const [type, setType] = useState("C");
  //======================= SELECT PRICE LIST ===================================//
  const [addPriceListData, setAddPriceListData] = useState(null);

  const handleSelectionAddPriceListData = (newValue) => {
    setAddPriceListData(newValue);
  };

  const [openAlert1, setOpenAlert1] = useState(false);
  const [postError1, setPostError1] = useState(false);
  const saveItems = async (itemsArray) => {
    let hasError = false;

    for (const item of itemsArray) {
      const response = await dispatch(
        PostAdHocItem({
          idata: {
            priceListID: addPriceListData.PRICELISTID,
            quotationRecordID: "0",
            filterType: "PL",
            itemNo: item.Item_Number,
            itemDescription: item.Item_Description,
          },
        })
      );

      if (response.payload.status === "Y") {
      } else {
        hasError = true;
      }
    }

    // Open the alert after processing all items
    setOpenAlert1(true);
    if (hasError) {
      setPostError1(true); // Show error if any item fails
    } else {
      setPostError1(false); // Ensure no error flag if all succeed
    }
  };

  const [addcompany, setAddcompany] = useState(null);
  const [companyID, setCompanyID] = useState(null);
  const handleSelectionAddcompanyData = (event, newValue) => {
    if (newValue) {
      setAddcompany(newValue);
      setCompanyID(newValue.RecordID);
    } else {
      setAddcompany(null);
      setCompanyID(null);
    }
  };
  // ********************** REDUX STATE ********************** //
  const loading = useSelector((state) => state.listview.itemTemploading);
  const rows = useSelector((state) => state.listview.itemListViewData);
  // ********************** COLUMN  ********************** //
  const columns = [
    {
      headerName: "Item Number",
      field: "Item_Number",
      width: "200",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Item Description",
      field: "Item_Description",
      width: "400",
      // flex:1,
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      field: "more",
      headerName: "Info",
      width: 100,
      renderCell: (params) => (
        // <div style={{ display: "flex", gap: "10px" }}>
          <Tooltip title="More">
            <IconButton
              onClick={() => handleRowClick(params)}
              sx={{ height: 30, width: 30 }}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        // </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(getItemListView({Type:type}));
    dispatch(getPriceListView());
    dispatch(clearPriceListState());
  }, [dispatch]);

  // ********************** TOOLBAR ********************** //
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

          <Tooltip title="Refresh">
            <IconButton
              onClick={() => toast.error("Under construction...")}
              sx={{ height: 30, width: 30 }}
            >
              <RefreshOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          {/* <Button
            variant="contained"
            color="info"
            size="small"
            onClick={() => {
              if (rowSelectionModelRows.length === 0) {
                return toast.error("Please Select Price List items");
              }
              try {
                dispatch(priceListSelectedItems(rowSelectionModelRows));

                navigate("/pages/price-list/price-list-detail/add", {
                  state: { id: 0 },
                });
              } catch (e) {}
            }}
          >
            Create Price List
          </Button> */}
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">
            Item Type
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              value={type}
              onChange={(e) =>{
                setType(e.target.value)
                dispatch(getItemListView({Type:e.target.value}));
              }}
              // onBlur={handleBlur}
              id="serviceProvider"
              name="serviceProvider"
              label="Item Type"
            >
              {/* <MenuItem value={"Z"}>Zero Price Items</MenuItem> */}
              <MenuItem value={"C"}>Contract Items</MenuItem>
              <MenuItem value={"N"}>Non-Contract Items</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </GridToolbarContainer>
    );
  }
  const handleOpen = () => {
    if (!companyID) {
      toast.error("Please Select the company");
    }
  };
  // ********************** FUNCTIONS AND LOGICS ********************** //
  const handleRowClick = async (params) => {
    const response = await dispatch(
      fetchgGetAItems({ filter: params.row.Item_Number })
    );

    if (response.payload.status == "Y") {
      const rowData = response.payload.data;

      setItemData({
        brand: rowData.Brand || "", // Map 'Brand' to 'brand'
        itemBuyer: rowData.Item_Buyer || "", // Map 'Item_Buyer' to 'itemBuyer'
        secondaryClass: rowData.Secondary_Class || "", // Map 'Secondary_Class' to 'secondaryClass'
        alternateClass: rowData.Alternate_Class_1 || "", // Map 'Alternate_Class_1' to 'alternateClass'
      });
    }
  };

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[{ name: "Control Pannel" }, { name: "Items" }]}
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
          <Stack sx={{ gridColumn: "span 3" }} direction="column" gap={3}>
            <Box
              sx={{
                height: dataGridHeight,
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
                // "& .MuiDataGrid-row:nth-of-type(odd)": {
                //   backgroundColor: theme.palette.background.default,
                // },
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
                slots={{
                  loadingOverlay: LinearProgress,
                  toolbar: CustomToolbar,
                }}
                columnHeaderHeight={dataGridHeaderFooterHeight}
                sx={{
                  // This is to override the default height of the footer row
                  "& .MuiDataGrid-footerContainer": {
                    height: dataGridHeaderFooterHeight,
                    minHeight: dataGridHeaderFooterHeight,
                  },
                }}
                rowHeight={dataGridRowHeight}
                loading={loading}
                rows={rows}
                columns={columns}
                checkboxSelection
                disableSelectionOnClick
                disableRowSelectionOnClick
                getRowId={(row) => row.item_key}
                // rowSelectionModel={[253, 254, 255, 256, 257]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: dataGridPageSize },
                  },
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
                onRowSelectionModelChange={(newRowSelectionModel) => {
                  console.log(
                    "🚀 ~ ItemList ~ newRowSelectionModel:",
                    newRowSelectionModel
                  );
                  const filterArray = rows.filter((v) =>
                    newRowSelectionModel.includes(v.item_key)
                  );
                  setRowSelectionModel(newRowSelectionModel);
                  setRowSelectionModelRows(filterArray);
                }}
                rowSelectionModel={rowSelectionModel}
              />
            </Box>
            <TableContainer
              component={Paper}
              sx={{
                display: "flex",
                flexDirection: "row",
                padding: 2,
                gap: 2,
                // maxWidth:300
              }}
            >
              <FormikCompanyOptimizedAutocomplete
                sx={{ maxWidth: 300 }}
                fullWidth
                name="addCompany"
                id="addCompany"
                value={addcompany}
                onChange={handleSelectionAddcompanyData}
                label="Select Company"
                url={`${process.env.REACT_APP_BASE_URL}Company`}
              />
              <PriceListOptimizedAutocomplete
                sx={{ maxWidth: 400 }}
                fullWidth
                name="priceList"
                id="priceList"
                value={addPriceListData}
                onChange={handleSelectionAddPriceListData}
                label="Select Existing Price List"
                companyID={companyID} // Pass companyID to the component
                url={`${process.env.REACT_APP_BASE_URL}PriceListItems/GetPrictListList?CompanyCode=${addcompany ? addcompany.Code : ""}`}
                onOpen={handleOpen} // Trigger handleOpen when autocomplete opens
              />
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  if (rowSelectionModelRows.length === 0) {
                    if (!addPriceListData) {
                      return toast.error("Please Select Price List");
                    }
                    return toast.error("Please Select Price List items");
                  }
                  try {
                    dispatch(priceListSelectedItems(rowSelectionModelRows));
                    saveItems(rowSelectionModelRows);
                    // navigate("/pages/price-list/price-list-detail/edit", {
                    //   state: { id: addPriceListData.PRICELISTID },
                    // });
                  } catch (e) {}
                }}
              >
                Add Items to Price list
              </Button>
            </TableContainer>
          </Stack>

          <Stack sx={{ gridColumn: "span 1" }} direction="column" gap={3}>
            <TableContainer
              component={Paper}
              sx={{ padding: 2, marginTop: "50px" }}
            >
              <Table size="small">
                <TableHead
                  sx={{
                    backgroundColor: theme.palette.info.main,
                    color: theme.palette.info.contrastText,
                  }}
                >
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      Attributes
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="justify" padding="normal">
                      Brand :
                    </TableCell>
                    <TableCell align="left">{itemdata.brand}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" align="left">
                      Item Buyer :
                    </TableCell>
                    <TableCell align="left">{itemdata.itemBuyer}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" align="left">
                      Secondary Class :
                    </TableCell>
                    <TableCell align="left">
                      {itemdata.secondaryClass}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" align="left">
                      Alternate Class :
                    </TableCell>
                    <TableCell align="left">
                      {itemdata.alternateClass}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </Box>

        <AlertDialog
          key={48}
          logo={`data:image/png;base64,${user.logo}`}
          open={openAlert1}
          error={postError1}
          message={
            postError1
              ? "Error while Deleting and please retry"
              : "Item Deleted Successfully"
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
                  setOpenAlert1(false);
                  setRowSelectionModel([]);
                  setRowSelectionModelRows([]);
                  setAddPriceListData(null);
                }}
                sx={{ mr: 1, height: 25 }}
              >
                Close
              </Button>
            </Box>
          }
        />
      </Paper>
    </Container>
  );
};

export default ItemList;
