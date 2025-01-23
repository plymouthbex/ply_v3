import React, { useEffect } from "react";
import {
  Paper,
  Button,
  Box,
  styled,
  useTheme,
  useMediaQuery,
  FormControlLabel,
  Checkbox,
  TextField,
  Stack,
  Autocomplete,
  DialogActions,
  DialogTitle,
  DialogContent,
  Dialog,
  LinearProgress,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { Breadcrumb } from "app/components";
import logo from "../../../../assets/plylogo.png";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import {
  dataGridHeightC,
  dataGridPageSize,
  dataGridpageSizeOptions,
  dataGridRowHeight,
  dataGridHeaderFooterHeight,
} from "app/utils/constant";

// ******************** ICONS ******************** //
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Formik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import * as Yup from "yup";
import { useState } from "react";
import {
  applicationAdded,
  companyAdded,
  getUserGroupData,
} from "app/redux/slice/getSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  getApplicationListView,
  getCompanyListView,
  getUserGroupCompanyListView,
} from "app/redux/slice/listviewSlice";
import { deleteUserGroupData, userGroupPost } from "app/redux/slice/postSlice";
import AlertDialog, { MessageAlertDialog } from "app/components/AlertDialog";
import useAuth from "app/hooks/useAuth";
import toast from "react-hot-toast";

// ******************** STYLED COMPONENTS ******************** //
const Container = styled("div")(({ theme }) => ({
  margin: "15px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "10px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
}));

// ******************** Validation Schema ******************** //
const validationSchema = Yup.object({
  // code: Yup.string()
  //   .min(1, "Code must be at least 1 characters")
  //   .max(15, "Code must be at most 15 characters"),

  // userName: Yup.string()
  //   .min(3, "User Name must be at least 3 characters")
  //   .max(20, "User Name must be at most 20 characters"),

  userGroupName: Yup.string()
    .min(3, "User Group Name must be at least 3 characters")
    .max(50, "User Group Name must be at most 50 characters"),
    type: Yup.string().required("Role is required"),
  // sequence: Yup.string()
  //   .min(1, "Sequence must be at least 1 character")
  //   .max(15, "Sequence must be at most 15 characters"),
});

// ******************** Price List Edit SCREEN  ******************** //
const UserGroupEdit = () => {
  const { user } = useAuth()
  // ******************** HOOKS AND CONSTANTS ******************** //
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const params = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const state = location.state;
  const navigate = useNavigate();
  // ******************** LOCAL STATE ******************** //
  const [postError, setPostError] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [opencompanyAlert, setOpenCompanyyAlert] = useState(false);
  const [openAppAlert, setOpenAppAlert] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  // ******************** REDUX STATE ******************** //
  const data = useSelector((state) => state.getSlice.userGroupFormData);

  const Companydata = useSelector((state) => state.getSlice.userGroupComRow);

  const Applicationdata = useSelector(
    (state) => state.getSlice.userGroupAppRow
  );

  const companyRows = useSelector(
    (state) => state.listview.userGroupCompanyListViewData
  );

  const applicationRows = useSelector(
    (state) => state.listview.applicationListViewData
  );

  const status = useSelector((state) => state.getSlice.userGroupStatus);

  const error = useSelector((state) => state.getSlice.userGroupError);

  ///===========API CALL GET============================//
  useEffect(() => {
    dispatch(getUserGroupData({ ID: state.ID }));
    // dispatch(getUserGroupCompanyListView());
    // dispatch(getApplicationListView());
  }, []);
  const type = ["USER", "ADMIN", "SYSTEMADMIN"];
  // ********************* COLUMN AND ROWS ********************* //
  const columns = [
    {
      headerName: "Company Code",
      field: "Code",
      width: "150",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Company Name",
      field: "Name",
      width: "170",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    // { field: 'IsSelected', headerName: 'Selected', width: 100,hide: false, },
  ];

  const Appcolumns = [
    // {
    //   headerName: "AccessID",
    //   field: "Code",
    //   width: "200",
    //   align: "left",
    //   headerAlign: "left",
    //   hide: true,
    // },
    {
      headerName: "Menu Name",
      field: "Name",
      width: "200",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
  ];

  // ********************* Company TOOLBAR ********************* //
  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Typography fontSize={"14px"} fontWeight={"bold"}>
            Company Access
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <GridToolbarQuickFilter />
        </Box>
      </GridToolbarContainer>
    );
  }
  // *********************Application TOOLBAR ********************* //
  function ApplicationCustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Typography fontSize={"14px"} fontWeight={"bold"}>
            Menu Access
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <GridToolbarQuickFilter />
        </Box>
      </GridToolbarContainer>
    );
  }
  //=======================================SAVE================================//

  const HandleSave = async (values) => {
    
    // if (selectedRows.length === 0) {
     
    //   setOpenCompanyyAlert(true);
    //   return; // Exit the function if no rows are selected
    // }
    const hasSelectedCompany = selectedRows.some(
      (row) => row.IsSelected === "Y"
    );
  
    const hasPreSelectedCompany = CompanyRows.some(
      (company) => company.IsSelected === "Y"
    );
  
    // If no company is selected in selectedRows and no pre-selected company exists, show a toast alert
    if (!hasSelectedCompany || !hasPreSelectedCompany) {
      setOpenCompanyyAlert(true);
      return; // Stop execution if no company is selected
    }
    
    const userGroupData = {
      recordID: data.RecordID,
      name: values.userGroupName,
      code: values.code,
      // companyCode: ,
      type: values.type,
      sortorder: values.sequence,
      disable: values.disable ? "Y" : "N",
      applicationAccess: selectedAppRows,
      companyAccess: selectedRows,
    };
    console.log("🚀 ~ HandleSave ~ userGroupData:", userGroupData);
    const response = await dispatch(userGroupPost({ userGroupData }));
    if (response.payload.status === "Y") {
      setOpenAlert(true);
    } else {
      setOpenAlert(true);
      setPostError(true);
      // toast.error("Error occurred while saving data");
    }
  };

  // ******************** DELETE ******************** //
  const userGroupDeleteFn = async (values, setSubmitting) => {
    try {
      dispatch(deleteUserGroupData({ ID: data.RecordID })).then((response) => {
        if (response.payload.status === "Y") {
          setOpenAlert(true);
        } else {
          setOpenAlert(true);
          setPostError(true);
        }
      });
      // setSubmitting(false);
    } catch (e) {
      console.log("🚀 ~ priceListSaveFn ~ e:", e);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
  };
  const handleDelete = async () => {
    setOpenDialog(false);
    setOpenAlert(true);
  };
  //================================================================================//

  const [selectedRows, setSelectedRows] = useState([]);
  console.log("🚀 ~ UserGroupEdit ~ selectedRows:", selectedRows);

  //==========================handleRowAppSelectionChange======================//
  const [selectedAppRows, setSelectedAppRows] = useState([]);
  console.log("🚀 ~ UserGroupEdit ~ selectedAppRows:", selectedAppRows);
  const CompanyRows = data.CompanyAccess;
  const AppRows = data.ApplicationAccess;

  return (
    <Container>
      {status === "fulfilled" && !error ? (
        <Formik
          initialValues={{
            // code: data.Code,
            disable: data.Disable === "Y" ? true : false,
            userGroupName: data.Name,
            // sequence: data.Sortorder,
            type: data.Type,
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              if (params.mode === "delete") {
                setIsDelete(true);
              }
              if (params.mode === "add" || params.mode === "edit") {
                HandleSave(values, setSubmitting);
              }
            }, 400);
          }}
        >
          {({
            errors,
            touched,
            handleBlur,
            handleChange,
            isSubmitting,
            values,
            handleSubmit,
            resetForm,
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="breadcrumb">
                <Breadcrumb
                  routeSegments={[
                    { name: "Security" },
                    { name: "User Group", path: "/pages/user-group" },
                    { name: `${params.mode} User Group Detail` },
                  ]}
                />
                <Stack direction={"row"} gap={1}>
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    startIcon={
                      params.mode === "delete" ? (
                        <DeleteIcon color="error" size="small" />
                      ) : (
                        <SaveIcon size="small" />
                      )
                    }
                    type="submit"
                    // disabled={isSubmitting}
                  >
                    {params.mode === "delete" ? "Confirm" : "Save"}
                  </Button>
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    startIcon={<ArrowBackIcon size="small" />}
                    onClick={() => navigate("/pages/security/user-group")}
                  >
                    Back
                  </Button>
                </Stack>
              </div>

              <Paper sx={{ width: "100%", mb: 2 }}>
                <Box
                  display="grid"
                  gap="20px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{
                    "& > div": {
                      gridColumn: isNonMobile ? undefined : "span 4",
                    },
                    padding: "10px",
                  }}
                >
                  {/* <Stack sx={{ gridColumn: "span 2" }} direction="column" gap={2}> */}
                  {/* <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="code"
                    name="code"
                    label="Code"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    required
                    InputLabelProps={{
                      sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                    }}
                    disabled={params?.mode === "delete"}
                    value={values.code}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={!!touched.code && !!errors.code}
                    helperText={touched.code && errors.code}
                    autoFocus 
                  />*/}
                  <TextField
                    fullWidth
                    variant="outlined"
                    autoComplete="off"
                    type="text"
                    id="userGroupName"
                    name="userGroupName"
                    label="User Security Group"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    disabled={params?.mode === "delete"}
                    value={values.userGroupName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.userGroupName && Boolean(errors.userGroupName)
                    }
                    helperText={touched.userGroupName && errors.userGroupName}
                  />
                  {/* <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="sequence"
                    name="sequence"
                    label="Sequence"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    disabled={params?.mode === "delete"}
                    value={values.sequence}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.sequence && Boolean(errors.sequence)}
                    helperText={touched.sequence && errors.sequence}
                  /> */}

                  {/* <FormControl sx={{ gridColumn: "span 2" }} fullWidth size="small">
                    <InputLabel >
                      Role
                    </InputLabel>
                    <Select
                      
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.type}
                      name="type"
                      id="type"
                      label="Price Book Type"
                    >
                      <MenuItem value={"USER"}>User</MenuItem>
                      <MenuItem value={"ADMIN"}>Admin</MenuItem>
                      <MenuItem value={"SYSTEMADMIN"}>System Admin</MenuItem>
                    </Select>
                  </FormControl> */}

                  <Stack
                    sx={{ gridColumn: "span 2" }}
                    direction="column"
                    gap={2}
                  >
                    <Autocomplete
                      fullWidth
                      id="type"
                      name="type"
                      options={type}
                      disabled={params?.mode === "delete"}
                      value={values.type}
                      onChange={(event, newValue) =>
                        handleChange({
                          target: { name: "type", value: newValue },
                        })
                      }
                      onBlur={handleBlur}
                      disableClearable
                      
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Role"
                          size="small"
                          required
                    InputLabelProps={{
                      sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                    }}
                          error={touched.type && Boolean(errors.type)}
                          helperText={touched.type && errors.type}
                          sx={{ gridColumn: "span 2" }}
                        />
                      )}
                    />
                  </Stack>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        id="disable"
                        name="disable"
                        checked={values.disable}
                        onChange={handleChange}
                        sx={{ height: "10px" }}
                        disabled={params?.mode === "delete"}
                      />
                    }
                    label="Disable"
                  />
                </Box>
                <Box
                  display="grid"
                  gap="10px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{
                    "& > div": {
                      gridColumn: isNonMobile ? undefined : "span 4",
                    },
                    padding: "10px",
                  }}
                >
                  <Stack
                    sx={{ gridColumn: "span 2" }}
                    direction="column"
                    gap={1}
                  >
                    <Box
                      sx={{
                        height: dataGridHeightC,

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
                        columnHeaderHeight={dataGridHeaderFooterHeight}
                        sx={{
                          // This is to override the default height of the footer row
                          "& .MuiDataGrid-footerContainer": {
                            height: dataGridHeaderFooterHeight,
                            minHeight: dataGridHeaderFooterHeight,
                          },
                        }}
                        rowHeight={dataGridRowHeight}
                        rows={data.CompanyAccess}
                        columns={columns}
                        checkboxSelection
                        onRowSelectionModelChange={(newRowSelectionModel) => {
                          if (params?.mode === "delete") {
                            // If in delete mode, don't allow row selection changes
                            return;
                          }
                          const updatedRows = CompanyRows.map((row) => {
                            if (newRowSelectionModel.includes(row.RecordID)) {
                              return { ...row, IsSelected: "Y" };
                            } else {
                              return { ...row, IsSelected: "N" };
                            }
                          });
                          dispatch(companyAdded(newRowSelectionModel));
                          console.log("Updated Rows:", updatedRows);
                          setSelectedRows(updatedRows);
                        }}
                        rowSelectionModel={Companydata}
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
                  </Stack>

                  <Stack
                    sx={{ gridColumn: "span 2" }}
                    direction="column"
                    gap={1}
                  >
                    <Box
                      sx={{
                        height: dataGridHeightC,

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
                          toolbar: ApplicationCustomToolbar,
                        }}
                        columnHeaderHeight={dataGridHeaderFooterHeight}
                        sx={{
                          // This is to override the default height of the footer row
                          "& .MuiDataGrid-footerContainer": {
                            height: dataGridHeaderFooterHeight,
                            minHeight: dataGridHeaderFooterHeight,
                          },
                        }}
                        rowHeight={dataGridRowHeight}
                        // rows={data.ApplicationAccess}
                        rows={
                          values.type === "USER"
                            ? data.ApplicationAccess.filter(
                                (value) => value.User === 1
                              )
                            : values.type === "ADMIN"
                            ? data.ApplicationAccess.filter(
                                (value) => value.Admin === 1
                              )
                            : values.type === "SYSTEMADMIN"
                            ? data.ApplicationAccess.filter(
                                (value) => value.SystemAdmin === 1
                              )
                            : []
                        }
                        columns={Appcolumns}
                        checkboxSelection
                        // checkboxSelection={mode !== "delete"}
                        onRowSelectionModelChange={(newRowSelectionModel) => {
                          if (params?.mode === "delete") {
                            // If in delete mode, don't allow row selection changes
                            return;
                          }
                          const updatedRows = AppRows.map((row) => {
                            if (newRowSelectionModel.includes(row.RecordID)) {
                              return { ...row, IsSelected: "Y" };
                            } else {
                              return { ...row, IsSelected: "N" };
                            }
                          });
                          dispatch(applicationAdded(newRowSelectionModel));
                          console.log("Updated Rows:", updatedRows);
                          setSelectedAppRows(updatedRows);
                        }}
                        rowSelectionModel={Applicationdata}
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
                  </Stack>
                </Box>
              </Paper>
            </form>
          )}
        </Formik>
      ) : (
        false
      )}
      <MessageAlertDialog
       logo={`data:image/png;base64,${user.logo}`}
        open={opencompanyAlert}
        message={`Please choose a company before saving. `}
        Actions={
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <Button
              variant="contained"
              sx={{ mr: 1, height: 25 }}
              color="info"
              size="small"
              onClick={() => {
               setOpenCompanyyAlert(false);
              }}
            >
              Close
            </Button>
           
          </Box>
        }
      />
       <MessageAlertDialog
       logo={`data:image/png;base64,${user.logo}`}
        open={openAppAlert}
        message={`Please choose any one of the Menu. `}
        Actions={
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <Button
              variant="contained"
              sx={{ mr: 1, height: 25 }}
              color="info"
              size="small"
              onClick={() => {
               setOpenAppAlert(false);
              }}
            >
              Close
            </Button>
           
          </Box>
        }
      />
      <MessageAlertDialog
       logo={`data:image/png;base64,${user.logo}`}
        open={isDelete}
        message={`Are you sure you want to delete?`}
        Actions={
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <Button
              variant="contained"
              sx={{ mr: 1, height: 25 }}
              color="info"
              size="small"
              onClick={() => {
                setIsDelete(false);
                userGroupDeleteFn();
              }}
            >
              Yes
            </Button>
            <Button
              sx={{ mr: 1, height: 25 }}
              variant="contained"
              color="info"
              size="small"
              onClick={() => {
                setIsDelete(false);
                // setSubmitting(false);
              }}
            >
              No
            </Button>
          </Box>
        }
      />
      <AlertDialog
       logo={`data:image/png;base64,${user.logo}`}
        open={openAlert}
        error={postError}
        message={
          postError
            ? "Something went wrong and please retry"
            : params.mode === "add"
            ? "User Group added successfully"
            : params.mode === "delete"
            ? "User Group Deleted Successfully"
            : "User Group updated successfully"
        }
        Actions={
          params.mode === "add" ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <Button
                sx={{ mr: 1, height: 25 }}
                variant="contained"
                color="info"
                size="small"
                onClick={() => navigate("/pages/security/user-group")}
              >
                Back to UserGroup
              </Button>
              <Button
                sx={{ mr: 1, height: 25 }}
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  dispatch(getUserGroupData({ ID: 0 }));
                  setOpenAlert(false);
                }}
                autoFocus
              >
                Add New UserGroup
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <Button
                sx={{ mr: 1, height: 25 }}
                variant="contained"
                color="info"
                size="small"
                onClick={() => navigate("/pages/security/user-group")}
              >
                Back to UserGroup
              </Button>
            </Box>
          )
        }
      />
    </Container>
  );
};

export default UserGroupEdit;
