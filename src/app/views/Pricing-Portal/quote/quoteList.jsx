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

import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { useDispatch, useSelector } from "react-redux";
import { themeColors } from "app/components/baseTheme/themeColors";


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
const QuoteList = () => {
  // ********************* HOOKS AND CONSTANTS ********************* //
  const theme = useTheme();
  const navigate = useNavigate();
const dispatch=useDispatch();
const colors = themeColors;
  // ********************* LOCAL STATE ********************* //

  // ********************* REDUX STATE ********************* //

 
  // ********************* COLUMN AND ROWS ********************* //
  const columns = [
    {
      headerName: "Name",
      field: "name",
      width: 150,
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
        // Conditionally render buttons based on the "name" field
        if (params.row.name === "New Prospect") {
          return (
            <div>
              <Button
                sx={{ height: 25, color: theme.palette.secondary.contrastText,
                    bgcolor: theme.palette.secondary.light,
                    "&:hover": {
                        backgroundColor: theme.palette.secondary.light, // Custom hover color
                      }, }}
                variant="contained"
                // color="primary"
                size="small"
                onClick={() => {
                  navigate("/pages/pricing-portal/new-prospect-quote");
                }}
                // startIcon={<ModeEditOutlineIcon size="small" />}
              >
               Go ahead
              </Button>
            </div>
          );
        } else if (params.row.name === "Existing Customer") {
          return (
            <div>
              <Button
                sx={{ height: 25,
                    color: theme.palette.secondary.contrastText,
                    bgcolor: theme.palette.secondary.light,
                    "&:hover": {
                        backgroundColor: theme.palette.secondary.light, // Custom hover color
                      },
                 }}
                variant="contained"
                // color="secondary"
                size="small"
                onClick={() => {
                  navigate("/pages/pricing-portal/existing-customer-quote");
                }}
                // startIcon={<ModeEditOutlineIcon size="small" />}
              >
                Go ahead
              </Button>
            </div>
          );
        }
      },
    },
  ];
  
  const rows = [
    {
      name: "New Prospect",
      CompanyCode: "NP001",
    },
    {
      name: "Existing Customer",
      CompanyCode: "EP001",
    },
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
          {/* <GridToolbarQuickFilter /> */}

          {/* <Button
            variant="contained"
            color="info"
            size="small"
            startIcon={<Add />}
            onClick={() => {
              navigate("/pages/company/company-edit-detail/add", {
                state: { ID:0 },
              });
            }}
          >
            Add
          </Button> */}
        </Box>
      </GridToolbarContainer>
    );
  }

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[{ name: "Quote" }, { name: "Quote List" }]}
        />
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
                      getRowId={(row) => row.name}
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

export default QuoteList;
const rows = [
  {
    company_code: 11243,
    company_name: "Plymouth",
    Email: "ply123@gmail.com",
    Address: "1000 S Miller St",
  },
  {
    company_code: 11244,
    company_name: "Nicky",
    Email: "nicky123@gmail.com",
    Address: "741  Lawernce St",
  },
  {
    company_code: 11245,
    company_name: "S&J",
    Email: "sj123@gmail.com",
    Address: "100  Road 80th Venue ",
  },
];