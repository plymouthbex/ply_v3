import React, { useEffect } from "react";
import {
  Box,
  LinearProgress,
  Paper,
  Button,
  styled,
  useTheme,
  useMediaQuery,
  TextField,
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
import { getConfigureAddressListView } from "app/redux/slice/listviewSlice";
import { useDispatch, useSelector } from "react-redux";
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
const Company = () => {
  // ********************* HOOKS AND CONSTANTS ********************* //
  const theme = useTheme();
  const navigate = useNavigate();
const isNonMobile = useMediaQuery("(min-width:600px)");
const location=useLocation();
const State=location.state;
console.log("🚀 ~ Company ~ State:", State)
const dispatch=useDispatch();
  // ********************* LOCAL STATE ********************* //

  // ********************* REDUX STATE ********************* //
  const addressrRows = useSelector(
    (state) => state.listview.configureAddressListViewData
  );
  console.log("🚀 ~ Company ~ addressrRows:", addressrRows)

 
  useEffect(() => {
    dispatch(getConfigureAddressListView({ID:State.company.RecordID,CustomerID:State.Code}));
    
  }, [dispatch]);
  // ********************* COLUMN AND ROWS ********************* //
  const columns = [
    {
      headerName: "Address Code",
      field: "AddressCode",
      width: "150",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Address",
      field: "Address",
      width: "170",
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
            <Button
              sx={{ height: 25 }}
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => {
                navigate("/pages/control-panel/configure-price-book/customer/contact",{state:{
                  RecordID:params.row.RecordID,
                  Code:params.row.AddressCode,
                  Name:params.row.Address,
                  address:State
                }});
              }}
            >
              Contacts
            </Button>
            <Button
              sx={{ height: 25 }}
              variant="contained"
              color="secondary"
              size="small"
              startIcon={<ModeEditOutlineIcon size="small" />}
              onClick={() => {
                navigate("/pages/control-panel/configure-price-book/customer/edit-Address/configureEdit",{state:{
                  RecordID:params.row.RecordID,
                  Code:params.row.AddressCode,
                  Name:params.row.Address,
                  address:State
                }});
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
        addressCode:"Billing",
        address:"123 Jedi Lane SW || Suite 66"
    },
    {
      addressCode:"Store #1",
        address:"456 Tower Road Suite || 1011 || Westside Store"
    },
    {
   addressCode:0,
        address:"10204 44th ave SW"
    },
  ];

  // ********************* TOOLBAR ********************* //
  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between", // Ensures space between left and right elements
          width: "100%",
          // padding: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start", // Align the typography to the left
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography fontSize={"16px"}>
  <Typography component="span" fontSize={"16px"} fontWeight="bold">Company:</Typography> {State.company.Code} || {State.company.Name}
  <Typography component="span" fontWeight="bold" fontSize={"18px"}>{`  >>    `}</Typography>
</Typography>
<Typography fontSize={"16px"}>
  <Typography component="span" fontSize={"16px"} fontWeight="bold">Customer:</Typography> {State.Code} || {State.Name}
</Typography>
        </Box>
  
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end", // Align the quick filter to the right
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
          routeSegments={[{ name: "Configure Price Book Type", path: "/pages/control-panel/configure-price-book/company"  },
            { name: "Customer",path:"/pages/control-panel/configure-price-book/customer" }
             ,{ name: "Address" }]}
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
                
                {/* <Typography fontSize={"16px"} fontWeight={"bold"}>Customer:123456||TestCustomer</Typography> */}
                  </Box>
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
            rows={addressrRows}
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

export default Company;
