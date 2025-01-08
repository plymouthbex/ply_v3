import React, { useEffect } from "react";
import {
  IconButton,
  LinearProgress,
  Paper,
  Button,
  Box,
  Tooltip,
  styled,
  useTheme,
} from "@mui/material";
import {
  DataGrid,
  GridToolbar,
  GridToolbarQuickFilter,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { Breadcrumb } from "app/components";
import { dataGridHeight, dataGridPageSize, dataGridpageSizeOptions, dataGridRowHeight ,dataGridHeaderFooterHeight} from "app/utils/constant";

// ********************** ICONS ********************** //
import DeleteIcon from "@mui/icons-material/Delete";
import { Add } from "@mui/icons-material";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getRunGroupListView } from "app/redux/slice/listviewSlice";
import { clearRunGroupState } from "app/redux/slice/getSlice";
import useAuth from "app/hooks/useAuth";

// ********************** STYLED COMPONENTS ********************** //
const Container = styled("div")(({ theme }) => ({
  margin: "15px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "10px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

// ********************** ITEMS SCREEN LISTVIEW ********************** //
const RunGroup = () => {
  // ********************** HOOKS AND CONSTANTS ********************** //
  const theme = useTheme();
  const navigate = useNavigate();
  const location=useLocation();
  const state=location.state;
  console.log("🚀 ~ RunGroup ~ state:", state)
  const {user}=useAuth();
  // ********************** LOCAL STATE ********************** //

  // ********************** REDUX STATE ********************** //
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getRunGroupListView({ID:state.companyID}));
    dispatch(clearRunGroupState());
  }, [dispatch]);
  const loading = useSelector((state) => state.listview.rungroupTemploading);
  const runGroupRows = useSelector(
    (state) => state.listview.rungroupListViewData
  );

  // ********************** COLUMN AND ROWS ********************** //
  const columns = [
    {
      headerName: "Run Group",
      field: "RunGroupCode",
      width: "170",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Run Group Description",
      field: "RunGroupName",
      width: "200",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    // {
    //   headerName: "Print Sequence",
    //   field: "SortOrder",
    //   width: "200",
    //   align: "left",
    //   headerAlign: "left",
    //   hide: false,
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
          <div>
            <Button
              sx={{ height: 25 }}
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => {
                navigate("/pages/control-panel/run-group/run-group-getail/edit", {
                  state: { ID: params.row.RecordID,
                    companyID:state.companyID,
                   },
                });
              }}
              startIcon={<ModeEditOutlineIcon size="small" />}
            >
              Edit
            </Button>

            <Button
              sx={{ height: 25, marginLeft: 1 }}
              variant="contained"
              color="secondary"
              size="small"
              startIcon={<DeleteIcon color="error" size="small" />}
              onClick={() => {
                navigate("/pages/control-panel/run-group/run-group-getail/delete", {
                  state: { ID: params.row.RecordID },
                });
              }}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  const rows = [
    {
      RunGroupCode: "RG1001",
      RunGroupName: "SHEPARD",
      SortOrder: 1,
      Disable: "N",
    },
    {
      RunGroupCode: "RG1002",
      RunGroupName: "DAVE",
      SortOrder: 2,
      Disable: "N",
    },
    {
      RunGroupCode: "RG1003",
      RunGroupName: "BOB",
      SortOrder: 3,
      Disable: "N",
    },
    {
      RunGroupCode: "RG1004",
      RunGroupName: "CAYTIE",
      SortOrder: 4,
      Disable: "N",
    },
    {
      RunGroupCode: "RG1005",
      RunGroupName: "KRISTJAN",
      SortOrder: 5,
      Disable: "N",
    },
    {
      RunGroupCode: "RG1006",
      RunGroupName: "LEAH",
      SortOrder: 6,
      Disable: "N",
    },
    {
      RunGroupCode: "RG1007",
      RunGroupName: "TONY",
      SortOrder: 7,
      Disable: "N",
    },
    {
      RunGroupCode: "RG1008",
      RunGroupName: "PAC",
      SortOrder: 8,
      Disable: "N",
    },
    {
      RunGroupCode: "RG1009",
      RunGroupName: "SALES",
      SortOrder: 9,
      Disable: "N",
    },
    {
      RunGroupCode: "RG1010",
      RunGroupName: "HOSS",
      SortOrder: 10,
      Disable: "N",
    },
  ];

  // ********************** TOOLBAR ********************** //

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
              navigate("/pages/control-panel/run-group/run-group-getail/add", {
                state: { ID: 0 },
              });
            }}
          >
            Add Run Group
          </Button>
        </Box>
      </GridToolbarContainer>
    );
  }

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[{ name: "Company",path:"/pages/company-run-group" }, { name: "Run Group" }]}
          // ,path:"/pages/company-run-group" 
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
            // "& .MuiDataGrid-row:nth-of-type(odd)": {
            //   backgroundColor: theme.palette.background.default,
            // },
            "& .MuiDataGrid-row.Mui-selected:hover": {
              backgroundColor: `${theme.palette.action.selected} !important`,
            },
          }}
        >
          <DataGrid
           columnHeaderHeight={dataGridHeaderFooterHeight}
           sx={{
             // This is to override the default height of the footer row
             '& .MuiDataGrid-footerContainer': {
                 height: dataGridHeaderFooterHeight,
                 minHeight:dataGridHeaderFooterHeight,
             },
           }}
            slots={{
              loadingOverlay: LinearProgress,
              toolbar: CustomToolbar,
            }}
            rowHeight={dataGridRowHeight}
            rows={runGroupRows}
            columns={columns}
            getRowId={(row) => row.RecordID}
            initialState={{
              pagination: { paginationModel: { pageSize: dataGridPageSize } },
            }}
            pageSizeOptions={dataGridpageSizeOptions}
            columnVisibilityModel={{
              item_key: false,
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

export default RunGroup;
