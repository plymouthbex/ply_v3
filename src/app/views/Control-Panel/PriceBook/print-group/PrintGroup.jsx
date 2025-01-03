import React, { useEffect } from "react";
import {
  LinearProgress,
  Paper,
  Button,
  Box,
  styled,
  useTheme,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Breadcrumb } from "app/components";
import { dataGridHeight, dataGridPageSize, dataGridpageSizeOptions, dataGridRowHeight } from "app/utils/constant";

// ********************** ICONS ********************** //
import DeleteIcon from "@mui/icons-material/Delete";
import { Add } from "@mui/icons-material";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPrintGroupListView } from "app/redux/slice/listviewSlice";
import {
    clearPrintGroupState,
  clearPrintListState,
} from "app/redux/slice/getSlice";

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
const PrintGroup = () => {
  // ********************** HOOKS AND CONSTANTS ********************** //
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // ********************** LOCAL STATE ********************** //

  // ********************** REDUX STATE ********************** //
  const loading = useSelector((state) => state.listview.printGroupTemploading);
  const printGroupRows = useSelector((state) => state.listview.printGroupListViewData);

  // ********************** COLUMN AND ROWS ********************** //
  const columns = [
    {
      headerName: "Print Group",
      field: "GroupCode",
      width: "170",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Print Group Description",
      field: "GroupName",
      width: "300",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Print Sequence",
      field: "Sortorder",
      width: "170",
      align: "left",
      headerAlign: "left",
      hide: false,
    },

    {
      field: "Action",
      headerName: "Action",
      minWidth: 400,
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
                navigate(
                  "/pages/control-panel/print-group/print-group-detail/edit",
                  {
                    state: { id: params.row.RecordID },
                  }
                );
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
                navigate(
                  "/pages/control-panel/print-group/print-group-detail/delete",
                  {
                    state: { id: params.row.RecordID },
                  }
                );
              }}
            >
             Delete
            </Button>
          </div>
        );
      },
    },
  ];


  useEffect(() => {
    dispatch(getPrintGroupListView());
    dispatch(clearPrintGroupState());
  }, [dispatch]);

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
              navigate(
                "/pages/control-panel/print-group/print-group-detail/add",
                {
                  state: { id: 0 },
                }
              );
            }}
          >
            Create New Category
          </Button>
        </Box>
      </GridToolbarContainer>
    );
  }

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[{ name: "Price Book" }, { name: "Price Book Categories" }]}
        />
      </div>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <Box
          sx={{
            height: dataGridHeight,
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none", 
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
            // Prevent selected row background color from changing on hover
            "& .MuiDataGrid-row.Mui-selected:hover": {
              backgroundColor: `${theme.palette.action.selected} !important`, // Ensure the background remains the same on hover
            },
          }}
        >
          <DataGrid
            slots={{
              loadingOverlay: LinearProgress,
              toolbar: CustomToolbar,
            }}
            rowHeight={dataGridRowHeight}
            rows={printGroupRows}
            columns={columns}
            loading={loading}
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
            disableSelectionOnClick
            disableRowSelectionOnClick
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default PrintGroup;
