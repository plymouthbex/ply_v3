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
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Breadcrumb } from "app/components";
import { dataGridHeight, dataGridRowHeight, dataGridHeaderFooterHeight, dataGridpageSizeOptions, dataGridPageSize } from "app/utils/constant";
import { Add } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch, useSelector } from "react-redux";
import { getConfigureCustomerListView, getCustomerListView } from "app/redux/slice/listviewSlice";
import useAuth from "app/hooks/useAuth";
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
  const location = useLocation();
  const State = location.state;
  const { user } = useAuth();
  // ********************* LOCAL STATE ********************* //

  // ********************* REDUX STATE ********************* //
  const customerRows = useSelector(
    (state) => state.listview.configureCustomerListViewData
  );


  useEffect(() => {
    dispatch(getConfigureCustomerListView({ ID: user.companyID }));
    // dispatch(clearCustomerListState())
  }, [dispatch]);
  // ********************* COLUMN AND ROWS ********************* //
  const columns = [
    // {
    //   headerName: "Customer Number ",
    //   field: "CustomerNumber",
    //   width: 150,
    //   align: "left",
    //   headerAlign: "left",
    //   hide: false,
    // },
    {
      headerName: "Customer Name",
      field: "CustomerName",
      minWidth: 200,
      flex: 1,
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    // {
    //   field: "Action",
    //   headerName: "Action",
    //   minWidth: 100,
    //   flex: 1,
    //   sortable: false,
    //   headerAlign: "center",
    //   filterable: false,
    //   disableColumnMenu: true,
    //   disableExport: true,
    //   align: "center",
    //   renderCell: (params) => {
    //     return (
    //         <div style={{ display: "flex", gap: "8px" }}>

    //         <Button
    //           sx={{ height: 25 }}
    //           variant="contained"
    //           color="secondary"
    //           size="small"
    //           startIcon={<ModeEditOutlineIcon size="small" />}
    //           onClick={() => {
    //             navigate("/pages/pricing-portal/contact/edit",{state:{
    //               RecordID:params.row.RecordID,
    //               Code:params.row.CustomerNumber,
    //               Name:params.row.CustomerName,

    //             }})
    //           }}
    //         >
    //           Edit Contact List
    //         </Button>
    //       </div>

    //     );
    //   },
    // },
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
            <Tooltip title="Edit Contact List">
              <IconButton
                sx={{ height: 25, width: 25 }}
                color="black"
                onClick={() => {
                  navigate("/pages/pricing-portal/contact/edit", {
                    state: {
                      RecordID: params.row.RecordID,
                      Code: params.row.CustomerNumber,
                      Name: params.row.CustomerName,
                    },
                  });
                }}
              >
                <ModeEditOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },

  ];

  const rows = [
    {
      customerCode: 123456,
      customerName: "Test Customer"
    },
    {
      customerCode: 441204,
      customerName: "EC Wilson"
    },
    {
      customerCode: 441102,
      customerName: "Wrays"
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
          <Tooltip title="Add">
            <IconButton
               color="black"
              sx={{ height: 35, width: 35 }}
              onClick={() => {
                navigate("/pages/pricing-portal/contact/add", {
                  state: { RecordID: 0 },
                });
              }}
            >
              <Add sx={{
                  fontSize: 30, // Increased icon size
                  color: theme.palette.success.main,
                }} />
            </IconButton>
          </Tooltip>

          {/* <Button
            variant="contained"
            color="info"
            size="small"
            startIcon={<Add />}
            onClick={() => {
              navigate("/pages/pricing-portal/contact/add", {
                state: { RecordID:0 },
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
      <div className="breadcrumb" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Breadcrumb
          routeSegments={[
            { name: "Price Book" },
            { name: "Contact Directory" },
            
          ]}
        />
        <Stack direction="row" gap={1}>
          {/* <Button
      variant="contained"
      color="info"
      size="small"
      startIcon={<ArrowBackIcon size="small" />}
      onClick={() => navigate(-1)}
    >
      Back
    </Button> */}

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
            columnHeaderHeight={dataGridHeaderFooterHeight}
            sx={{
              // This is to override the default height of the footer row
              '& .MuiDataGrid-footerContainer': {
                height: dataGridHeaderFooterHeight,
                minHeight: dataGridHeaderFooterHeight,
              },
            }}
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
                          pagination: { paginationModel: { pageSize: dataGridPageSize } },
                        }}
                        
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

export default Customer;
