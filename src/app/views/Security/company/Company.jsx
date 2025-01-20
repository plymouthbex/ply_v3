import React, { useEffect } from "react";
import {
  Box,
  LinearProgress,
  Paper,
  Button,
  styled,
  useTheme,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Breadcrumb } from "app/components";
import {
  dataGridHeight, dataGridPageSize,
  dataGridpageSizeOptions, dataGridRowHeight, dataGridHeaderFooterHeight
} from "app/utils/constant";
import { Add, MailOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { useDispatch, useSelector } from "react-redux";
import { getCompanyListView } from "app/redux/slice/listviewSlice";
import MailIcon from '@mui/icons-material/Mail';
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
  const dispatch = useDispatch();

  // ********************* LOCAL STATE ********************* //

  // ********************* REDUX STATE ********************* //
  const companyRows = useSelector((state) => state.listview.comapnyListViewData);

  // ********************* COLUMN AND ROWS ********************* //
  const columns = [
    {
      headerName: "Company Code",
      field: "CompanyCode",
      width: "150",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Company Name",
      field: "CompanyName",
      width: "170",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Email",
      field: "EmailId",
      width: "250",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Address",
      field: "Address",
      width: "300",
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
          <div gap={1}>
            <Tooltip title="Edit">
              <IconButton
                sx={{ height: 25, width: 25 }}
                color="black"
                onClick={() => {
                  navigate("/pages/security/company/company-edit-detail/edit", {
                    state: { ID: params.row.CompanyCode },
                  });
                }}
              >
                <ModeEditOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Mail Config">
              <IconButton
                sx={{ height: 25, width: 25 }}
                color="black"
                onClick={() => {
                  navigate("/pages/security/company/mail", {
                    state: { id: params.row.RecordID },
                  });
                }}
              >
                <MailIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    dispatch(getCompanyListView());

  }, [dispatch]);


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

          <Tooltip title="Add">
            <IconButton
              color="black"
              sx={{ height: 30, width: 30 }}
              onClick={() => {
                navigate("/pages/security/company/company-edit-detail/add", {
                  state: { ID: 0 },
                });
              }}
            >
              <Add fontSize="small" />
            </IconButton>
          </Tooltip>

        </Box>
      </GridToolbarContainer>
    );
  }

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[{ name: "Security" }, { name: "Company" }]}
        />
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
            }, "& .MuiTablePagination-root": {
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
              '& .MuiDataGrid-footerContainer': {
                height: dataGridHeaderFooterHeight,
                minHeight: dataGridHeaderFooterHeight,
              },
            }}
            rowHeight={dataGridRowHeight}
            rows={companyRows}
            columns={columns}
            // checkboxSelection
            disableSelectionOnClick
            disableRowSelectionOnClick
            getRowId={(row) => row.CompanyCode}
            initialState={{
              pagination: {
                paginationModel: { pageSize: dataGridPageSize },
              },
            }}
            pageSizeOptions={dataGridpageSizeOptions}
            columnVisibilityModel={{
              CompanyCode: true,
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