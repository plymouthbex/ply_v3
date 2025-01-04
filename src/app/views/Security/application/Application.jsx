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
import { dataGridHeight, dataGridRowHeight,dataGridpageSizeOptions ,dataGridPageSize} from "app/utils/constant";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getApplicationListView } from "app/redux/slice/listviewSlice";

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
const Application = () => {
  // ********************* HOOKS AND CONSTANTS ********************* //
  const theme = useTheme();
  const navigate = useNavigate();
const dispatch=useDispatch();
  // ********************* LOCAL STATE ********************* //

  // ********************* REDUX STATE ********************* //
  const rows =useSelector((state)=>state.listview.applicationListViewData);
  console.log("🚀 ~ Application ~ rows:", rows)
  // ********************* COLUMN AND ROWS ********************* //
  const columns = [
    {
      headerName: "AccessID",
      field: "ApplicationCode",
      width: "200",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Menu Name",
      field: "ApplicationName",
      width: "200",
      align: "left",
      headerAlign: "left",
      hide: true,
    },

    {
      field: "Action",
      headerName: "Action",
      minWidth: 150,
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
            <Button
              sx={{ height: 25 }}
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => {
                navigate("/pages/security/application-edit-detail/edit", {
                  state: { ID: params.row.RecordID },
                });
              }}
            >
              Edit
            </Button>
          </div>
        );
      },
    },
  ];


//================API-CALL====================//
useEffect(() => {
  dispatch(getApplicationListView());
 
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

          <Button
            variant="contained"
            color="info"
            size="small"
            startIcon={<Add />}
            onClick={() => {
              navigate("/pages/security/application-edit-detail/add",{state:{ID:0}});
            }}
          >
            Add
          </Button>
        </Box>
      </GridToolbarContainer>
    );
  }

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[{ name: "Security" }, { name: "Menu" }]}
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
            },
          }}
        >
          <DataGrid
            slots={{
              loadingOverlay: LinearProgress,
              toolbar: CustomToolbar,
            }}
            rowHeight={dataGridRowHeight}
            rows={rows}
            columns={columns}
            // checkboxSelection
            disableSelectionOnClick
            disableRowSelectionOnClick
            getRowId={(row) => row.RecordID}
            initialState={{
              pagination: {
                paginationModel: { pageSize: dataGridPageSize },
              },
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

export default Application;
