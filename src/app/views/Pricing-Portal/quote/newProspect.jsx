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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { Add } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "app/hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { getUserListView } from "app/redux/slice/listviewSlice";
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
const NewProspect = () => {
  // ********************* HOOKS AND CONSTANTS ********************* //
  const theme = useTheme();
  const navigate = useNavigate();
const {user}=useAuth();
  console.log("🚀 ~ User ~ user:", user);
  const dispatch=useDispatch();
  const colors = themeColors;
    const location = useLocation();
    const state = location.state ? location.state : {};
  // ********************* LOCAL STATE ********************* //

  // ********************* REDUX STATE ********************* //

  



  //=======================API_CALL===================================//
  
  // ********************* COLUMN AND ROWS ********************* //
  const columns = [
    {
      headerName: "Date",
      field: "date",
      width: "100",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Name",
      field: "Name",
      width: "170",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Description",
      field: "description",
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
              navigate("/pages/pricing-portal/quote-form/editprospect",{
                  state:{
                    Name:params.row.Name,
                    Description:params.row.description,
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
                    Name:params.row.Name,
                    Description:params.row.description,
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
      date: "2025-01-01",
      Name: "John Doe",
      description: "Lorem ipsum dolor sit amet.",
    },
    {
      date: "2025-01-02",
      Name: "Jane Smith",
      description: "Consectetur adipiscing elit.",
    },
    {
      date: "2025-01-03",
      Name: "Alice Johnson",
      description: "Sed do eiusmod tempor incididunt ut labore.",
    },
    {
      date: "2025-01-04",
      Name: "Bob Brown",
      description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    },
    {
      date: "2025-01-05",
      Name: "Charlie Lee",
      description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
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
          <GridToolbarQuickFilter />

          <Button
            variant="contained"
            color="info"
            size="small"
            startIcon={<Add />}
            onClick={() => {
              navigate("/pages/pricing-portal/quote-form/newprospect",{state:{
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
  <Breadcrumb routeSegments={[{ name: "Quote", path: "/pages/pricing-portal/quote-list" }, { name: "New Prospect" }]} />
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

export default NewProspect;
