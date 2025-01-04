import React, { useEffect } from "react";
import {
  Box,
  LinearProgress,
  Paper,
  Button,
  styled,
  useTheme,
  Stack,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Breadcrumb } from "app/components";
import { dataGridHeight,  dataGridPageSize,
  dataGridpageSizeOptions,dataGridRowHeight } from "app/utils/constant";

// ********************** ICONS ********************** //

import { Add } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "app/hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { themeColors } from "app/components/baseTheme/themeColors";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
const ExistingCustomer = () => {
  // ********************* HOOKS AND CONSTANTS ********************* //
  const theme = useTheme();
  const navigate = useNavigate();
const {user}=useAuth();
  console.log("🚀 ~ User ~ user:", user);
  const dispatch=useDispatch();
  const colors=themeColors;
    const location = useLocation();
    const state = location.state ? location.state : {};
  // ********************* LOCAL STATE ********************* //

  // ********************* REDUX STATE ********************* //

  



  //=======================API_CALL===================================//
  
  // ********************* COLUMN AND ROWS ********************* //
  const columns = [
    {
      headerName: "Date",
      field: "Date",
      width: "100",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    // {
    //     headerName: "Customer Number",
    //     field: "customerNumber",
    //     width: "170",
    //     align: "left",
    //     headerAlign: "left",
    //     hide: true,
    //   },
    {
      headerName: "Customer Name",
      field: "CustomerName",
      width: "170",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Description",
      field: "Name",
      width: "300",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      field: "Action",
      headerName: "Action",
      minWidth: 200,
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
              sx={{ height: 25,
                color: theme.palette.secondary.contrastText,
                bgcolor: theme.palette.secondary.light,
                "&:hover": {
                    backgroundColor: theme.palette.secondary.light, // Custom hover color
                  },
               }}
              variant="contained"
              color="secondary"
              size="small"
            //   startIcon={<DeleteIcon color="error" size="small" />}
            onClick={() => {
              navigate("/pages/pricing-portal/quote-form/editexisting",{
                  state:{
                    Name:params.row.CustomerName,
                    Description:params.row.Name,
                    templateID: state.templateID ? state.templateID : 0,
                    templateName: state.templateName ? state.templateName : "",
                  }
                });
              }}
            >
              Copy Quote
            </Button>
            <Button
              sx={{ height: 25,
                color: theme.palette.secondary.contrastText,
                bgcolor: theme.palette.secondary.light,
                "&:hover": {
                    backgroundColor: theme.palette.secondary.light, // Custom hover color
                  },
               }}
              variant="contained"
              color="secondary"
              size="small"
            //   startIcon={<DeleteIcon color="error" size="small" />}
            onClick={() => {
              navigate("/pages/pricing-portal/quote-form/print",{
                  state:{
                    Name:params.row.CustomerName,
                    Description:params.row.Name,
                    templateID: state.templateID ? state.templateID : 0,
                    templateName: state.templateName ? state.templateName : "",
                  }
                });
              }}
            >
             Print Quote
            </Button>
          </div>
        );
      },
    },
  ];

  const rows = [
    {
        "RecordID": 1284,
        "CompanyID": 5,
        "CompanyCode": "PM",
        "Code": "90715",
        "Name": "90715 || Cascade Select Market",
        "CustomerName": "Cascade Select Market",
        "Date": "2025-01-01"
    },
    {
        "RecordID": 242,
        "CompanyID": 5,
        "CompanyCode": "PM",
        "Code": "198108",
        "Name": "198108 || Cascadia Farm Collective",
        "CustomerName": "Cascadia Farm Collective",
        "Date": "2025-01-02"
    },
    {
        "RecordID": 3459,
        "CompanyID": 5,
        "CompanyCode": "PM",
        "Code": "198109",
        "Name": "198109 || Cascadia Produce",
        "CustomerName": "Cascadia Produce",
        "Date": "2025-01-03"
    },
    {
        "RecordID": 137,
        "CompanyID": 5,
        "CompanyCode": "PM",
        "Code": "90804",
        "Name": "90804 || Cascioppo Brothers Meats",
        "CustomerName": "Cascioppo Brothers Meats",
        "Date": "2025-01-04"
    },
    {
        "RecordID": 998,
        "CompanyID": 5,
        "CompanyCode": "PM",
        "Code": "90805",
        "Name": "90805 || Casey, Robert",
        "CustomerName": "Casey, Robert",
        "Date": "2025-01-05"
    },
    {
        "RecordID": 928,
        "CompanyID": 5,
        "CompanyCode": "PM",
        "Code": "90759",
        "Name": "90759 || CASH OR CREDIT CARD ONLY",
        "CustomerName": "CASH OR CREDIT CARD ONLY",
        "Date": "2025-01-06"
    },
    {
        "RecordID": 831,
        "CompanyID": 5,
        "CompanyCode": "PM",
        "Code": "690670",
        "Name": "690670 || Caso's Country Foods",
        "CustomerName": "Caso's Country Foods",
        "Date": "2025-01-07"
    },
    {
        "RecordID": 1279,
        "CompanyID": 5,
        "CompanyCode": "PM",
        "Code": "90770",
        "Name": "90770 || Caso's Country Foods, Inc -OLD",
        "CustomerName": "Caso's Country Foods, Inc -OLD",
        "Date": "2025-01-08"
    },
    {
        "RecordID": 1156,
        "CompanyID": 5,
        "CompanyCode": "PM",
        "Code": "90785",
        "Name": "90785 || Castillos Supermarket",
        "CustomerName": "Castillos Supermarket",
        "Date": "2025-01-09"
    },
    {
        "RecordID": 1093,
        "CompanyID": 5,
        "CompanyCode": "PM",
        "Code": "907900",
        "Name": "907900 || Catapult NW",
        "CustomerName": "Catapult NW",
        "Date": "2025-01-10"
    },
    {
        "RecordID": 1085,
        "CompanyID": 5,
        "CompanyCode": "PM",
        "Code": "90780",
        "Name": "90780 || Catfish Corner",
        "CustomerName": "Catfish Corner",
        "Date": "2025-01-11"
    },
    {
        "RecordID": 1344,
        "CompanyID": 5,
        "CompanyCode": "PM",
        "Code": "90781",
        "Name": "90781 || Catfish Corner Express",
        "CustomerName": "Catfish Corner Express",
        "Date": "2025-01-12"
    },
    {
        "RecordID": 1616,
        "CompanyID": 5,
        "CompanyCode": "PM",
        "Code": "907905",
        "Name": "907905 || Cathlamet Market",
        "CustomerName": "Cathlamet Market",
        "Date": "2025-01-13"
    },
    {
        "RecordID": 1513,
        "CompanyID": 5,
        "CompanyCode": "PM",
        "Code": "940036",
        "Name": "940036 || Catracho's - Kent",
        "CustomerName": "Catracho's - Kent",
        "Date": "2025-01-14"
    },
    {
        "RecordID": 1035,
        "CompanyID": 5,
        "CompanyCode": "PM",
        "Code": "90787",
        "Name": "90787 || Cattledog Cookie Company",
        "CustomerName": "Cattledog Cookie Company",
        "Date": "2025-01-15"
    },
    {
        "RecordID": 1029,
        "CompanyID": 5,
        "CompanyCode": "PM",
        "Code": "200014",
        "Name": "200014 || Cauldron Broths",
        "CustomerName": "Cauldron Broths",
        "Date": "2025-01-16"
    }
];

  
  // ********************* TOOLBAR ********************* //
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
            startIcon={<Add />}
            onClick={() => {
              navigate("/pages/pricing-portal/quote-form/newexisting",{state:{
                templateID: state.templateID ? state.templateID : 0,
                            templateName: state.templateName ? state.templateName : "",
              }});
            }}
          >
            NEW
          </Button>
        </Box>
      </GridToolbarContainer>
    );
  }

  return (
    <Container>
     <div className="breadcrumb" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <Breadcrumb routeSegments={[{ name: "Quote", path:"/pages/pricing-portal/quote-list" }, { name: "Existing Customer" }]} />
  <Stack direction={"row"} gap={1}>
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
            height:"400px",
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: "black",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blue.palette.info.main,
              color: colors.blue.palette.info.contrastText,
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.blueDark.palette.info.main,
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blue.palette.info.main,
              color: colors.blue.palette.info.contrastText,
            },
            "& .MuiCheckbox-root": {
              color: "#174c4f !important", 
            },
           
            "& .MuiCheckbox-root.Mui-checked": {
              color: "#174c4f !important", 
            },
          }}
        >
          <DataGrid
            slots={{
              loadingOverlay: LinearProgress,
              toolbar: CustomToolbar,
            }}
          
            rows={rows}
            columns={columns}
            // checkboxSelection
            disableSelectionOnClick
            disableRowSelectionOnClick
            getRowId={(row) => row.Name}
            initialState={{
                pagination: { paginationModel: { pageSize: 20 } },
              }}
              rowHeight={30}
              pageSizeOptions={[20, 50, 100]}
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

export default ExistingCustomer;
