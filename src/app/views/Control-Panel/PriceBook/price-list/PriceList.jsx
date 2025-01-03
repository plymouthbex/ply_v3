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
} from "app/utils/constant";

// ********************** ICONS ********************** //
import DeleteIcon from "@mui/icons-material/Delete";
import { Add, RefreshOutlined } from "@mui/icons-material";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useLocation, useNavigate } from "react-router-dom";
import { getPriceListView, getPrintGroupListView } from "app/redux/slice/listviewSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  clearPriceListState,
  clearPrintGroupState,
  printGroupSelectedItems,
  clearCustomerListState,
  customerListSelectedItems,
} from "app/redux/slice/getSlice";
import toast from "react-hot-toast";
import { CustomerPriceListOptimizedAutocomplete, PriceListOptimizedAutocomplete, PrintGroupOptimizedAutocomplete } from "app/components/SingleAutocompletelist";
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
const PriceList = () => {

  // ********************** HOOKS AND CONSTANTS ********************** //
  const theme = useTheme();
  const naviate = useNavigate();
  const dispatch = useDispatch();
  const location=useLocation();
  const state=location.state;
  console.log("🚀 ~ PriceList ~ state:", state)
  const {user}=useAuth();


  // ********************** LOCAL STATE ********************** //

  const [printSelectedData, setPrintSelectedData] = useState(null);

  const handlePrintSelectedData = (newValue) => {
    setPrintSelectedData(newValue);
  };


  const [customerSelectData, setCustomerSelectData] = useState(null);

  const handleCustomerSelectData = (newValue) => {
    setCustomerSelectData(newValue);
  };

  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const [rowSelectionModelRows, setRowSelectionModelRows] = React.useState([]);
  // ********************** REDUX STATE ********************** //

  const loading = useSelector((state) => state.listview.priceListloading);
  const priceRows = useSelector((state) => state.listview.priceListViewData);
  // ********************** COLUMN AND ROWS ********************** //
  const columns = [
    {
      headerName: "Price List ID",
      field: "PRICELISTID",
      width: "200",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: " Price List Description",
      field: "PRICELISTDESCRIPTION",
      minWidth: 250,
      flex: 1,
      align: "left",
      headerAlign: "left",
      hide: false,
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
          <div>
            <Button
              sx={{ height: 25 }}
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => {
                naviate("/pages/control-panel/price-list/price-list-detail/edit", {
                  state: { id: params.row.PRICELISTID,
                    company:state,
                  },
                });
              }}
              startIcon={<ModeEditOutlineIcon size="small" />}
            >
              Edit
            </Button>

            <Button
              sx={{ height: 25, marginLeft: 1 }}
              variant="contained"
              color="secondary"
              size="small"
              startIcon={<DeleteIcon color="error" size="small" />}
              onClick={() => {
                naviate("/pages/control-panel/price-list/price-list-detail/delete", {
                  state: { id: params.row.PRICELISTID,
                    company:state,
                   },
                });
              }}
            >
              Delete
            </Button>

            <Button
              sx={{ height: 25, marginLeft: 1 }}
              variant="contained"
              color="secondary"
              size="small"
              startIcon={<VisibilityIcon size="small" />}
              onClick={() => {
                naviate("/pages/control-panel/price-list/price-list-detail/view", {
                  state: { id: params.row.PRICELISTID,
                    company:state,
                   },
                });
              }}
            >
              View Items
            </Button>
          </div>
        );
      },
    },
  ];

  // ********************** TOOLBAR ********************** //

  useEffect(() => {
    dispatch(getPriceListView({ID:state.ID}));
    dispatch(getPrintGroupListView());
    dispatch(clearPriceListState());
    dispatch(clearPrintGroupState());
    dispatch(clearCustomerListState());
  }, [dispatch]);

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
          <Button
            variant="contained"
            color="info"
            size="small"
            startIcon={<Add fontSize="small" />}
            onClick={() => {
              naviate("/pages/control-panel/price-list/price-list-detail/add", {
                state: { id: 0,
                  company:state,
                 },
              });
            }}
          >
            Create Price List
          </Button>
          <Button
            variant="contained"
            color="info"
            size="small"
            onClick={() => {
              if (rowSelectionModelRows.length === 0) {
                return toast.error("Please Select Price List items");
              }
              try {
                dispatch(printGroupSelectedItems(rowSelectionModelRows));

                naviate(
                  "/pages/control-panel/print-group/print-group-detail/add",
                  {
                    state: { id: 0 ,
                      company:state,
                    },
                  }
                );
              } catch (e) {}
            }}
          >
            Create New Category
          </Button>
          {/* <Button
            variant="contained"
            color="info"
            size="small"
            onClick={() => {
              if (rowSelectionModelRows.length === 0) {
                return toast.error("Please Select Price List items");
              }
              try {
                dispatch(priceListSelectedCustomer(rowSelectionModelRows));

                naviate(
                  "/pages/customer-price-lists/customer-price-lists-detail/add",
                  {
                    state: { ID: 0 },
                  }
                );
              } catch (e) {}
            }}
          >
            Create Customer Price Lists
          </Button> */}
        </Box>
      </GridToolbarContainer>
    );
  }

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[{ name: "Company",path:"/pages/control-panel/company-price-list" }, { name: "Price List" }]}
        />
      </div>

      <Paper sx={{ width: "100%", mb: 2 }}>
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
              "& .MuiDataGrid-row:nth-of-type(odd)": {
                backgroundColor: theme.palette.background.default,
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
              rows={priceRows}
              columns={columns}
              loading={loading}
              checkboxSelection
              disableSelectionOnClick
              disableRowSelectionOnClick
              getRowId={(row) => row.PRICELISTID}
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
              onRowSelectionModelChange={(newRowSelectionModel) => {
                const filterArray = priceRows.filter((v) =>
                  newRowSelectionModel.includes(v.PRICELISTID)
                );
                setRowSelectionModel(newRowSelectionModel);
                setRowSelectionModelRows(filterArray);
              }}
              rowSelectionModel={rowSelectionModel}
            />
          </Box>
          <Stack  direction="row" gap={3}>

          
          <TableContainer
            component={Paper}
            sx={{
              display: "flex",
              flexDirection: "row",
              padding: 2,
              gap: 2,
             
            }}
          >
            <PrintGroupOptimizedAutocomplete
             sx={{maxWidth:300}}
              fullWidth
              name="printGroup"
              id="printGroup"
              value={printSelectedData}
              onChange={handlePrintSelectedData}
              label="Price Book Category"
              url={`${process.env.REACT_APP_BASE_URL}PrintGroup/PrintGroupList`}
            />
            <Button
              variant="contained"
              color="info"
              size="small"
              
              onClick={() => {
                if (!printSelectedData) {
                  return toast.error("Please Select Print Group");
                }
                if (rowSelectionModelRows.length === 0) {
              
                  return toast.error("Please Select Price List");
                }
                try {
                  dispatch(printGroupSelectedItems(rowSelectionModelRows));

                  naviate("/pages/control-panel/print-group/print-group-detail/edit", {
                    state: { id: printSelectedData.RecordID },
                  });
                } catch (e) {}
              }}
            >
              Add Price List To Price Book Category
            </Button>
          </TableContainer>
          <TableContainer
            component={Paper}
            sx={{
              display: "flex",
              flexDirection: "row",
              padding: 2,
              gap: 2,
              // maxWidth: 300,
            }}
          >
            <CustomerPriceListOptimizedAutocomplete
            sx={{maxWidth:300}}
              fullWidth
              name="customerPriceList"
              id="customerPriceList"
              value={customerSelectData}
              onChange={handleCustomerSelectData}
              label="Customer Price Lists"
              url={`${process.env.REACT_APP_BASE_URL}CustomerPriceList/CustomerPriceList`}
            />
            <Button
              variant="contained"
              color="info"
              size="small"
              onClick={() => {
                if (!customerSelectData) {
                  return toast.error("Please Select Customer");
                }
                if (rowSelectionModelRows.length === 0) {

                  return toast.error("Please Select Price List");
                }
                try {
                  dispatch(customerListSelectedItems(rowSelectionModelRows));

                  naviate("/pages/control-panel/customer-price-lists/customer-price-lists-detail/edit", {
                    state: { id: customerSelectData.CustomerNumber},
                  });
                } catch (e) {}
              }}
            >
              Add Price List To Customer
            </Button>
          </TableContainer>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

export default PriceList;
