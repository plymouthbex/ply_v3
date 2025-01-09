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
import {
  dataGridHeaderFooterHeight,
  dataGridHeight,
  dataGridPageSize,
  dataGridpageSizeOptions,
  dataGridRowHeight,
} from "app/utils/constant";

// ********************** ICONS ********************** //

import { Add } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "app/hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { themeColors } from "app/components/baseTheme/themeColors";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getProspectListData } from "app/redux/slice/getSlice";
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
const SavedPriceList = () => {
  // ********************* HOOKS AND CONSTANTS ********************* //
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const colors = themeColors;
  const location = useLocation();
  const state = location.state ? location.state : {};
  // ********************* LOCAL STATE ********************* //

  // ********************* REDUX STATE ********************* //
  const rowProspect = useSelector((state) => state.getSlice.getQuoteProspectData)
  const statusProspect = useSelector((state) => state.getSlice.getQuoteProspectStatus)
  const loadingProspect = useSelector((state) => state.getSlice.getQuoteProspectLoading)
  const errorProspect = useSelector((state) => state.getSlice.getQuoteProspectError)

  useEffect(()=>{
    dispatch(getProspectListData({data:{Type:"Customer",UserID:user.id,}}))
  },[])
  //=======================API_CALL===================================//

  // ********************* COLUMN AND ROWS ********************* //
  const columns = [
    {
      headerName: "Date",
      field: "FromDate",
      width: "100",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Customer Name",
      field: "CustomerName",
      flex:1,
      minWidth: 170,
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    // {
    //   headerName: "Description",
    //   field: "Name",
    //   minWidth: 300,
    //   align: "left",
    //   headerAlign: "left",
    //   hide: true,
    // },
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
              sx={{
                height: 25,
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
                navigate("/pages/pricing-portal/build-price-list/copy", {
                  state: {
                    headerID: params.row.RecordID,

                  },
                });
              }}
            >
              Copy Price List
            </Button>
            <Button
              sx={{
                height: 25,
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
                navigate("/pages/pricing-portal/build-price-list/view", {
                  state: {
                    headerID: params.row.RecordID,
                  },
                });
              }}
            >
              View Price List
            </Button>
          </div>
        );
      },
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

          {/* <Button
            variant="contained"
            color="info"
            size="small"
            startIcon={<Add />}
            onClick={() => {
              navigate("/pages/pricing-portal/quote-form/newexisting", {
                state: {
                  prospectID: 0,
                  templateID: state.templateID ? state.templateID : 0,
                  templateName: state.templateName ? state.templateName : "",
                },
              });
            }}
          >
            NEW
          </Button> */}
        </Box>
      </GridToolbarContainer>
    );
  }

  return (
    <Container>
      <div
        className="breadcrumb"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Breadcrumb
          routeSegments={[
            { name: "Quote", },
            { name: "Templates", path:"/pages/pricing-portal/templates" },
            { name: "Price List" },
          ]}
        />
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
            height: "400px",
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
            rows={rowProspect}
            loading={loadingProspect}
            columns={columns}
            // checkboxSelection
            disableSelectionOnClick
            disableRowSelectionOnClick
            getRowId={(row) => row.RecordID}
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

export default SavedPriceList;
