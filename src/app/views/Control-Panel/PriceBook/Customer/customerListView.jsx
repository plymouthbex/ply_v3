import React, { useEffect } from "react";
import {
  Box,
  LinearProgress,
  Paper,
  Button,
  styled,
  useTheme,
  Typography,
  Stack,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Breadcrumb } from "app/components";
import { dataGridHeight, dataGridRowHeight } from "app/utils/constant";
import { Add } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch, useSelector } from "react-redux";
import { getConfigureCustomerListView, getCustomerListView } from "app/redux/slice/listviewSlice";
// ********************* STYLED COMPONENTS ********************* //
const Container = styled("div")(({ theme }) => ({
  margin: "15px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "10px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

// ********************* ITEMS SCREEN LISTVIEW ********************* //
const Customer = () => {
  // ********************* HOOKS AND CONSTANTS ********************* //
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
const location=useLocation();
const State=location.state;
  // ********************* LOCAL STATE ********************* //

  // ********************* REDUX STATE ********************* //
  const customerRows = useSelector(
    (state) => state.listview.configureCustomerListViewData
  );

 
  useEffect(() => {
    dispatch(getConfigureCustomerListView({ID:State.RecordID}));
    // dispatch(clearCustomerListState())
  }, [dispatch]);
  // ********************* COLUMN AND ROWS ********************* //
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
            <Button
              sx={{ height: 25 }}
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => {
                navigate("/pages/control-panel/configure-price-book/customer/address",{state:{
                  RecordID:params.row.RecordID,
                  Code:params.row.CustomerNumber,
                  Name:params.row.CustomerName,
                  company:State,
                }});
              }}
            >
              Address Locations
            </Button>
            <Button
              sx={{ height: 25 }}
              variant="contained"
              color="secondary"
              size="small"
              startIcon={<ModeEditOutlineIcon size="small" />}
              onClick={() => {
                navigate("/pages/control-panel/configure-price-book/customer/edit-Customer/configureEdit",{state:{
                  RecordID:params.row.RecordID,
                  Code:params.row.CustomerNumber,
                  Name:params.row.CustomerName,
                  company:State,
                }})
              }}
            >
              Edit Communication
            </Button>
          </div>
          
        );
      },
    },
  ];

  const rows = [
    {
      customerCode:123456,
      customerName:"Test Customer"
    },
    {
       customerCode:441204,
      customerName:"EC Wilson"
    },
    {
       customerCode:441102,
      customerName:"Wrays"
    },
  ];

  // ********************* TOOLBAR ********************* //
  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between", // Distribute space between the items
          width: "100%",
          // padding: 2,
        }}
      >
       <Typography fontSize={"16px"}>
  <Typography component="span" fontSize={"16px"} fontWeight="bold">Company:</Typography> {State.Code} || {State.Name}
</Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
          }}
        >
          <GridToolbarQuickFilter />
        </Box>
      </GridToolbarContainer>
    );
  }
  

  return (
    <Container>
      <div className="breadcrumb" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
  <Breadcrumb
    routeSegments={[
      { name: "Configure Price Book Type", path: "/pages/control-panel/configure-price-book/company" },
      { name: "Customer" },
    ]}
  />
  <Stack direction="row" gap={1}>
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
            rows={customerRows}
            columns={columns}
       
            disableSelectionOnClick
            disableRowSelectionOnClick
            getRowId={(row) => row.RecordID}
            initialState={{
              pagination: { paginationModel: { pageSize: 20 } },
            }}
            pageSizeOptions={[5, 10, 20, 25]}
            columnVisibilityModel={{
              RecordID: true,
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
    </Container>
  );
};

export default Customer;
