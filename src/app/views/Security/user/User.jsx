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
  DialogActions,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Breadcrumb } from "app/components";
import {
  dataGridHeight,
  dataGridPageSize,
  dataGridpageSizeOptions,
  dataGridRowHeight,
  dataGridHeaderFooterHeight,
} from "app/utils/constant";
import LockOpenIcon from "@mui/icons-material/LockOpen";
// ********************** ICONS ********************** //
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useAuth from "app/hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { getUserListView } from "app/redux/slice/listviewSlice";
import { useState } from "react";
import { LoginConfig } from "app/redux/slice/postSlice";
import AlertDialog from "app/components/AlertDialog";

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
const User = () => {
  // ********************* HOOKS AND CONSTANTS ********************* //
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log("🚀 ~ User ~ user:", user);
  const dispatch = useDispatch();
  // ********************* LOCAL STATE ********************* //

  // ********************* REDUX STATE ********************* //
  const rows = useSelector((state) => state.listview.userListViewData);

  //=======================API_CALL===================================//
  const companyCode = user.companyCode;
  useEffect(() => {
    dispatch(getUserListView());
  }, [dispatch]);
  // ********************* COLUMN AND ROWS ********************* //

  const [openAlert, setOpenAlert] = useState(false);
  const [postError, setPostError] = useState(null);
  const unlock = async (values, type) => {
    const res = await dispatch(
      LoginConfig({
        EmailID: values.Email,
        Type: type,
      })
    );
    if (res.payload.status === "Y") {
      setOpenAlert(true);
      dispatch(getUserListView());
    } else {
      setOpenAlert(true);
      setPostError(res.payload.message);
    }
  };
  const columns = [
    {
      headerName: "First Name",
      field: "Name",
      width: "170",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Last Name",
      field: "LastName",
      width: "170",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Login ID",
      field: "Email",
      width: "300",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Company",
      field: "CompanyName",
      width: "250",
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
            <Tooltip title="Edit">
              <IconButton
                sx={{ height: 25, width: 25 }}
                color="black"
                onClick={() => {
                  navigate("/pages/security/user/user-edit-detail/edit", {
                    state: { ID: params.row.RecordID },
                  });
                }}
              >
                <ModeEditOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                sx={{ height: 25, width: 25 }}
                color="error"
                onClick={() => {
                  navigate("/pages/security/user/user-edit-detail/delete", {
                    state: { ID: params.row.RecordID },
                  });
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {params.row.IsLocked ? (
              <Tooltip title="Unlock">
                <IconButton
                  sx={{ height: 25, width: 25 }}
                  color="info"
                  onClick={() => unlock(params.row,"UnlockPassword")}
                >
                  <LockOpenIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : (
              false
            )}
          </div>
        );
      },
    },
  ];

  // const rows = [
  //   {
  //     User_code: 153,
  //     User_name: "RAM",
  //     Email: "ram123@gmail.com",
  //     User_Company: "plymouth",
  //   },
  //   {
  //     User_code: 160,
  //     User_name: "Shyam",
  //     Email: "shyam123@gmail.com",
  //     User_Company: "Nickey",
  //   },
  //   {
  //     User_code: 161,
  //     User_name: "Mani",
  //     Email: "mani123@gmail.com",
  //     User_Company: "S&J",
  //   },
  // ];

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

          <Tooltip title="Create User">
            <IconButton
              sx={{ height: 35, width: 35 }}
              color="info"
              onClick={() => {
                navigate("/pages/security/user/user-edit-detail/add", {
                  state: { ID: 0 },
                });
              }}
            >
              <Add
                sx={{
                  fontSize: 30, // Increased icon size
                  color: theme.palette.success.main,
                }}
              />
            </IconButton>
          </Tooltip>
        </Box>
      </GridToolbarContainer>
    );
  }

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Security" }, { name: "User" }]} />
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
            columnHeaderHeight={dataGridHeaderFooterHeight}
            sx={{
              // This is to override the default height of the footer row
              "& .MuiDataGrid-footerContainer": {
                height: dataGridHeaderFooterHeight,
                minHeight: dataGridHeaderFooterHeight,
                // color: theme.palette.info.contrastText,
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
        <AlertDialog
          logo={`data:image/png;base64,${user.logo}`}
          open={openAlert}
          error={postError}
          message={postError ? postError : "New one time Pasword successfully sent to user"}
          Actions={
            <DialogActions>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  setOpenAlert(false)
                  setPostError(null);
                }}
              >
                close
              </Button>
            </DialogActions>
          }
        />
      </Paper>
    </Container>
  );
};

export default User;
