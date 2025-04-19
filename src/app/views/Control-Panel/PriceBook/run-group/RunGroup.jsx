import React, { useEffect, useState } from "react";
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
import {
  dataGridHeight,
  dataGridPageSize,
  dataGridpageSizeOptions,
  dataGridRowHeight,
  dataGridHeaderFooterHeight,
} from "app/utils/constant";

// ********************** ICONS ********************** //
import DeleteIcon from "@mui/icons-material/Delete";
import { Add } from "@mui/icons-material";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getRunGroupListView } from "app/redux/slice/listviewSlice";
import { clearRunGroupState } from "app/redux/slice/getSlice";
import useAuth from "app/hooks/useAuth";
import { FormikCustomSelectCompanyPriceList } from "app/components/SingleAutocompletelist";

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
  const location = useLocation();
  const state = location.state;
  console.log("🚀 ~ RunGroup ~ state:", state);
  const { user } = useAuth();
  // ********************** LOCAL STATE ********************** //

  // ********************** REDUX STATE ********************** //
  const dispatch = useDispatch();
  const [companyID, setCompanyID] = useState(user.companyCode);
    const [companyRecordID, setCompanyRecordID] = useState(user.companyID);
  useEffect(() => {
    dispatch(getRunGroupListView({ ID: companyRecordID }));
    dispatch(clearRunGroupState());
  }, [dispatch]);
  const loading = useSelector((state) => state.listview.rungroupTemploading);
  const runGroupRows = useSelector(
    (state) => state.listview.rungroupListViewData
  );

  // ********************** COLUMN AND ROWS ********************** //
  const columns = [
    {
      headerName: "Name",
      field: "RunGroupCode",
      width: "170",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Description",
      field: "RunGroupName",
      width: "200",
      align: "left",
      headerAlign: "left",
      hide: false,
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
          <div style={{ display: "flex", gap: "10px" }}>
            <Tooltip title="Edit">
              <IconButton
                color="black"
                size="small"
                onClick={() => {
                  navigate(
                    "/pages/control-panel/run-group/run-group-getail/edit",
                    {
                      state: {
                        ID: params.row.RecordID,
                        CompanyCode: companyID,
                        Name:params.row.RunGroupCode,
                        companyRecordID:companyRecordID
                      },
                    }
                  );
                }}
                disabled={params.mode === "delete" || params.mode === "view"}
              >
                <ModeEditOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                color="error"
                size="small"
                onClick={() => {
                  navigate(
                    "/pages/control-panel/run-group/run-group-getail/delete",
                    {
                      state: { ID: params.row.RecordID, CompanyCode: companyID, companyRecordID:companyRecordID},
                    }
                  );
                }}
                disabled={params.mode === "delete" || params.mode === "view"}
              >
                <DeleteIcon color="error" fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  // ********************** TOOLBAR ********************** //

  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          padding: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
                        width: "100%",
          }}
        >
          <FormikCustomSelectCompanyPriceList
            name="company"
            id="company"
            multiple={false}
            value={companyRecordID}
            onChange={(e) => {
            
              setCompanyID(e.target.value);
              setCompanyRecordID(e.target.value);
              dispatch(getRunGroupListView({ ID: e.target.value }));
            }}
            label="Company"
            url={`${process.env.REACT_APP_BASE_URL}CompanyModule/CompanyListView`}
          />

          
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <GridToolbarQuickFilter />

            {/* <Tooltip title="Create Price Book Group">
              <IconButton
                color="black"
                size="small"
                onClick={() => {
                  navigate(
                    "/pages/control-panel/run-group/run-group-getail/add",
                    {
                      state: { ID: 0, CompanyCode: companyID, },
                    }
                  );
                }}
              >
                <Add
                  sx={{
                    fontSize: 30, // Increased icon size
                    color: theme.palette.success.main,
                  }}
                />
              </IconButton>
            </Tooltip> */}
          </Box>
        </Box>
      </GridToolbarContainer>
    );
  }

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: "Control Panel" },
            { name: "Price Book Group" },
          ]}
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
