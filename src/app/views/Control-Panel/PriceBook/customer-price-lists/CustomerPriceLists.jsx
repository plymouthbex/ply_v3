import React, { useEffect } from "react";
import {
  Box,
  LinearProgress,
  Paper,
  Button,
  styled,
  useTheme,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Breadcrumb } from "app/components";
import { dataGridHeight, dataGridPageSize, dataGridpageSizeOptions, dataGridRowHeight } from "app/utils/constant";
import { Add, AddAlertOutlined, RefreshOutlined } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerListView } from "app/redux/slice/listviewSlice";
import toast from "react-hot-toast";
import {  clearCustomerListState } from "app/redux/slice/getSlice";

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
const CustomerPriceLists = () => {
  // ********************** HOOKS AND CONSTANTS ********************** //
  const theme = useTheme();
  const naviate = useNavigate();
  const navigate=useNavigate();
  // ********************** LOCAL STATE ********************** //

  // ********************** REDUX STATE ********************** //
  const loading = useSelector((state) => state.listview.customerTemploading);
  const customerRows = useSelector(
    (state) => state.listview.customerListViewData
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCustomerListView());
    dispatch(clearCustomerListState())
  }, [dispatch]);

  // ********************** COLUMN AND ROWS ********************** //
  const columns = [
    {
      headerName: "Customer Number ",
      field: "CustomerNumber",
      width: 150,
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Customer Name",
      field: "CustomerName",
      minWidth:200,
      flex:1,
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Price Lists Count",
      field: "PriceListsCount",
      minWidth:200,
      align: "right",
      headerAlign: "center",
      hide: false,
    },

    {
      field: "Actions",
      headerName: "Action",
      minWidth: 450,
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
                navigate("/pages/control-panel/customer-price-lists/customer-price-lists-detail/edit", {
                  state: { id:params.row.CustomerNumber},
                });
              }}
              // onClick={() => handleRowClick(params, "edit")}
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
                navigate("/pages/control-panel/customer-price-lists/customer-price-lists-detail/delete", {
                  state: { id:params.row.CustomerNumber },
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
              onClick={() => {
                naviate(
                "/pages/control-panel/customer-price-lists/customer-price-lists-detail/view"
                , {
                  state: {  id:params.row.CustomerNumber  },
                });
                
              }}
              startIcon={<VisibilityIcon size="small" />}
            >
              Preview Items
            </Button>
          </div>
        );
      },
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

          {/* <Button
            variant="contained"
            color="info"
            size="small"
            startIcon={<Add />}
            
            onClick={() => {
              navigate("/pages/customer-price-lists/customer-price-lists-detail/add", {
                state: { ID:0 },
              });
              dispatch(clearPrintListState());
            }}
          >
            Create Customer Price Lists
          </Button> */}
          {/* <Button
            variant="contained"
            color="info"
            size="small"
            onClick={() => {
              naviate("/pages/run-group/run-group-getail/add",{ state: { ID:0}});
            }}
          >
            Create Run Group
          </Button> */}
        </Box>
      </GridToolbarContainer>
    );
  }

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: "Price Book" },
            { name: "Customer Price Lists" },
          ]}
        />
      </div>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <Box
          sx={{
            height: dataGridHeight,
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none", // Change border-bottom color to black
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
          }}
        >
          <DataGrid
            slots={{
              loadingOverlay: LinearProgress,
              toolbar: CustomToolbar,
            }}
            rowHeight={dataGridRowHeight}
            rows={customerRows}
            loading={loading}
            columns={columns}
            // checkboxSelection
            disableSelectionOnClick
            disableRowSelectionOnClick
            getRowId={(row) => row.RecordID}
            initialState={{
              pagination: { paginationModel: { pageSize:dataGridPageSize } },
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
            sortModel={[{ field: 'PriceListsCount', sort: 'desc' }]}
            // rowSelectionModel={[30200, 30300]}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default CustomerPriceLists;
