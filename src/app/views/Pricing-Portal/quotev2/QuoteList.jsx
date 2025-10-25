import React, { useEffect } from "react";
import {
  Box,
  LinearProgress,
  Paper,
  Button,
  styled,
  useTheme,Tooltip,IconButton
} from "@mui/material";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import { Breadcrumb } from "app/components";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { themeColors } from "app/components/baseTheme/themeColors";
import { dataGridHeaderFooterHeight, dataGridHeight, dataGridPageSize, dataGridpageSizeOptions, dataGridRowHeight } from "app/utils/constant";
import VisibilityIcon from '@mui/icons-material/Visibility';
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
  const dispatch = useDispatch();
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
        return (
          <div>
            {/* <Tooltip title={params.row.name}> */}
  <IconButton
    color="black"
    size="small"
    onClick={() => {
      navigate(params.row.path);
    }}
  >
    <VisibilityIcon fontSize="small" />
  </IconButton>
{/* </Tooltip> */}

            {/* <Button
              sx={{
                height: 25,
                width: 150,
              }}
              variant="contained"
              color="info"
              size="small"
              onClick={() => {
                navigate(params.row.path);
              }}
            >
              {params.row.name}
            </Button> */}
          </div>
        );
      },
    },
  ];

  const rows = [
    {
      name: "Saved Quote",
      CompanyCode: "NP001",
      path: "/pages/pricing-portal/saved-quote-list",
    },
    {
      name: "Saved Price List",
      CompanyCode: "EP001",
      path: "/pages/pricing-portal/saved-price-list",
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
          routeSegments={[{ name: "Price Book" }, { name: "Templates" }]}
        />
      </div>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <Box
          sx={{
            // height: "400px",
            height:dataGridHeight,
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
            rows={rows}
            columns={columns}
            // checkboxSelection
            disableSelectionOnClick
            disableRowSelectionOnClick
            getRowId={(row) => row.name}
            initialState={{
              pagination: { paginationModel: { pageSize: dataGridPageSize } },
            }}
            rowHeight={dataGridRowHeight}
            pageSizeOptions={dataGridpageSizeOptions}
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
