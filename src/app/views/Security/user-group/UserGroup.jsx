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
import { dataGridHeight, dataGridRowHeight,dataGridpageSizeOptions ,dataGridPageSize, dataGridHeaderFooterHeight } from "app/utils/constant";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { getUserGroupListView } from "app/redux/slice/listviewSlice";
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
const UserGroup = () => {
  // ********************* HOOKS AND CONSTANTS ********************* //
  const theme = useTheme();
  const navigate = useNavigate();
const {user}=useAuth();
const dispatch=useDispatch();
  // ********************* LOCAL STATE ********************* //

  // ********************* REDUX STATE ********************* //
const UGrows=useSelector((state)=>state.listview.userGroupListViewData);
console.log("🚀 ~ UserGroup ~ UGrows:", UGrows)









useEffect(()=>{
  dispatch(getUserGroupListView())
},[dispatch]);
  // ********************* COLUMN AND ROWS ********************* //
  const columns = [
    // {
    //   headerName: "User Group Code",
    //   field: "Code",
    //   width: "150",
    //   align: "left",
    //   headerAlign: "left",
    //   hide: true,
    // },
    {
      headerName: "User Security Group",
      field: "Name",
      width: "250",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    // {
    //   headerName: "Type",
    //   field: "User_name",
    //   width: "250",
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
              sx={{ height: 25 }}
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => {
                navigate("/pages/security/user-group/user-edit-Group-detail/edit",{state:{ID:params.row.RecordID}});
              }}
              startIcon={<ModeEditOutlineIcon size="small" />}
            >
              Edit
            </Button>
            <Button
              sx={{ height: 25 }}
              variant="contained"
              color="secondary"
              size="small"
              startIcon={<DeleteIcon color="error" size="small" />}
              onClick={() => {
                navigate("/pages/security/user-group/user-edit-Group-detail/delete",{state:{ID:params.row.RecordID}});
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
      User_group_code: 321,
      User_group_name: "Plymouth",
      User_name: "System Admin",
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
              navigate("/pages/security/user-group/user-edit-Group-detail/add",{state:{ID:0}});
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
          routeSegments={[{ name: "Security" }, { name: "User Group" }]}
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
            slots={{
              loadingOverlay: LinearProgress,
              toolbar: CustomToolbar,
            }}
            rowHeight={dataGridRowHeight}
            rows={UGrows}
            columns={columns}
            columnHeaderHeight={dataGridHeaderFooterHeight}
sx={{
  // This is to override the default height of the footer row
  '& .MuiDataGrid-footerContainer': {
      height: dataGridHeaderFooterHeight,
      minHeight: dataGridHeaderFooterHeight,
  },
}}
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

export default UserGroup;
