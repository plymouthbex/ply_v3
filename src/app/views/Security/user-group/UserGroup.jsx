import React, { useEffect } from "react";
import {
  Box,
  LinearProgress,
  Paper,
  Button,
  styled,
  useTheme,
  IconButton,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Breadcrumb } from "app/components";
import {
  dataGridHeight,
  dataGridRowHeight,
  dataGridpageSizeOptions,
  dataGridPageSize,
  dataGridHeaderFooterHeight,
} from "app/utils/constant";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { getUserGroupListView, getUserGroupUserListView } from "app/redux/slice/listviewSlice";
import useAuth from "app/hooks/useAuth";
import { useState } from "react";
import ClearIcon from '@mui/icons-material/Clear';
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
  const { user } = useAuth();
  const dispatch = useDispatch();
  const isNonMobile = useMediaQuery("(min-width:900px)");
  const [isSide, setIsSide] = useState(false);
  // ********************* LOCAL STATE ********************* //

  // ********************* REDUX STATE ********************* //
  const UGrows = useSelector((state) => state.listview.userGroupListViewData);
  const userGrpUserTemploading = useSelector((state) => state.listview.userGrpUserTemploading);
  const userGrpUserListViewData = useSelector((state) => state.listview.userGrpUserListViewData);

  useEffect(() => {
    dispatch(getUserGroupListView());
  }, [dispatch]);
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
            <Tooltip title="Edit">
              <IconButton
                sx={{ height: 25, width: 25 }}
                color="black"
                onClick={() => {
                  navigate(
                    "/pages/security/user-group/user-edit-Group-detail/edit",
                    {
                      state: { ID: params.row.RecordID },
                    }
                  );
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
                  navigate(
                    "/pages/security/user-group/user-edit-Group-detail/delete",
                    {
                      state: { ID: params.row.RecordID },
                    }
                  );
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];


  const userColumns = [

    {
      headerName: "User Name",
      field: "Name",
      width: 150,
      align: "left",
      flex:1,
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Company",
      field: "CompanyName",
      width: 150,
      align: "left",
      headerAlign: "left",
      hide: true,
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

          <Tooltip title="Create Usergroup">
            <IconButton
              sx={{ height: 35, width: 35 }}
              color="black"
              onClick={() => {
                navigate(
                  "/pages/security/user-group/user-edit-Group-detail/add",
                  {
                    state: { ID: 0 },
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
          </Tooltip>
        </Box>
      </GridToolbarContainer>
    );
  }
  function CustomToolbar2() {
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

          <Tooltip title="Close">
            <IconButton
              sx={{ height: 35, width: 35 }}
              color="error"
              onClick={() => {
                setIsSide(false)
              }}
            >
              <ClearIcon
                sx={{
                  fontSize: 30, // Increased icon size
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
        <Breadcrumb
          routeSegments={[{ name: "Security" }, { name: "User Group" }]}
        />
      </div>

      <Paper
        sx={{
          width: "100%",
          mb: 2,
        }}
      >
        <Box
          display="grid"
          gap="20px"
          gridTemplateColumns="repeat(3, minmax(0, 1fr))"
          sx={{
            "& > div": {
              gridColumn: isNonMobile ? undefined : "span 3",
            },
            padding: "10px",
          }}
        >
          <Box
            sx={{
              height: dataGridHeight,
              gridColumn: isSide ? "span 2" : "span 3",
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
                backgroundColor: `none !important`,
              },
              "& .MuiDataGrid-row.Mui-selected": {
                border: `1px solid ${theme.palette.success.main}`,
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
              "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                outline: "none !important",
                backgroundColor: `transparent !important`,
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "transparent !important",
              },
              "& .MuiDataGrid-cell:hover": {
                backgroundColor: "transparent !important",
              },
              "& .MuiDataGrid-row": {
                transition: "none !important", // Disable any transition effects
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
                "& .MuiDataGrid-footerContainer": {
                  height: dataGridHeaderFooterHeight,
                  minHeight: dataGridHeaderFooterHeight,
                },
              }}
              // checkboxSelection
              // disableSelectionOnClick
              // disableRowSelectionOnClick
              onRowClick={(params) => {
                dispatch(getUserGroupUserListView(params.row.RecordID))
                setIsSide(true);
              }}
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
          {isSide && (
            <Box
              sx={{
                height: dataGridHeight,
                gridColumn: "span 1",
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
                  toolbar: CustomToolbar2,
                }}
                rowHeight={dataGridRowHeight}
                rows={userGrpUserListViewData}
                columns={userColumns}
                loading={userGrpUserTemploading}
                columnHeaderHeight={dataGridHeaderFooterHeight}
                sx={{
                  // This is to override the default height of the footer row
                  "& .MuiDataGrid-footerContainer": {
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
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default UserGroup;
