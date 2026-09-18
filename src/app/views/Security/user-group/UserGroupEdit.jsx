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
  Collapse,
  InputAdornment,
  IconButton,
  TablePagination,
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
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";

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
    const [successMessage, setSuccessMessage] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [opencompanyAlert, setOpenCompanyyAlert] = useState(false);
  const [openAppAlert, setOpenAppAlert] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  // ******************** REDUX STATE ******************** //
  const data = useSelector((state) => state.getSlice.userGroupFormData);

  const Companydata = useSelector((state) => state.getSlice.userGroupComRow);
  console.log("🚀 ~ UserGroupEdit ~ Companydata:", Companydata)

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

  // const HandleSave = async (values) => {
    
  
  //   const hasSelectedCompany = selectedRows.some(
  //     (row) => row.IsSelected === "Y"
  //   );
    
  //   const hasPreSelectedCompany = companyRows.some(
  //     (company) => company.IsSelected === "Y"
  //   );
  //   console.log("🚀 ~ HandleSave ~ hasPreSelectedCompany:", hasPreSelectedCompany)
    
  //   // Show the alert only if neither hasSelectedCompany nor hasPreSelectedCompany is true
  //   if (!hasSelectedCompany && !hasPreSelectedCompany) {
  //     setOpenCompanyyAlert(true);
  //     return;
  //   }
    
    
  //   // if (!hasSelectedMenu) {
  //   //   setOpenAppAlert(true);
  //   //   return; 
  //   // }
    
  //   const userGroupData = {
  //     recordID: data.RecordID,
  //     name: values.userGroupName,
  //     code: values.code,
  //     // companyCode: ,
  //     type: values.type,
  //     sortorder: values.sequence,
  //     disable: values.disable ? "Y" : "N",
  //     applicationAccess: selectedAppRows,
  //     companyAccess: selectedRows,
  //   };
  //   console.log("🚀 ~ HandleSave ~ userGroupData:", userGroupData);
  //   const response = await dispatch(userGroupPost({ userGroupData }));
  //   if (response.payload.status === "Y") {
  //     setOpenAlert(true);
  //     setSuccessMessage(response.payload.message);
  //   } else {
  //     setOpenAlert(true);
  //     setPostError(response.payload.message);
  //     // toast.error("Error occurred while saving data");
  //   }
  // };
  const HandleSave = async (values) => {
    const hasSelectedCompany = selectedRows.some(
      (row) => row.IsSelected === "Y"
    );
  
    // Check if CompanyData is empty
    const isCompanyDataEmpty = Companydata.length === 0;
  

    const hasSelectedApp = selectedAppRows.some(
      (row) => row.IsSelected === "Y"
    );
  
    // Check if CompanyData is empty
    const isAppDataEmpty = Applicationdata.length === 0;
    // Debugging logs
    console.log("🚀 ~ HandleSave ~ CompanyData:", Companydata);
    console.log("🚀 ~ HandleSave ~ isCompanyDataEmpty:", isCompanyDataEmpty);
  
    // Show the alert if no company is selected and CompanyData is empty
    if (!hasSelectedCompany && isCompanyDataEmpty) {
      setOpenCompanyyAlert(true);
      return;
    }
    if (!hasSelectedApp && isAppDataEmpty) {
      setOpenAppAlert(true);
      return;
    }
    // Prepare data for submission
    const userGroupData = {
      recordID: data.RecordID,
      name: values.userGroupName,
      code: values.code,
      type: values.type,
      sortorder: values.sequence,
      disable: values.disable ? "Y" : "N",
      applicationAccess: selectedAppRows,
      companyAccess: selectedRows,
    };
  
    console.log("🚀 ~ HandleSave ~ userGroupData:", userGroupData);
  
    // Dispatch and handle response
    const response = await dispatch(userGroupPost({ userGroupData }));
    if (response.payload.status === "Y") {
      setOpenAlert(true);
      setSuccessMessage(response.payload.message);
    } else {
      setOpenAlert(true);
      setPostError(response.payload.message);
    }
  };
  
  // ******************** DELETE ******************** //
  const userGroupDeleteFn = async (values, setSubmitting) => {
    try {
      dispatch(deleteUserGroupData({ ID: data.RecordID })).then((response) => {
        if (response.payload.status === "Y") {
          setOpenAlert(true);
          setSuccessMessage(response.payload.message)
        } else {
          setOpenAlert(true);
          setPostError(response.payload.message);
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

  // ********************** GROUPED MENU ACCESS STATE & HELPERS ********************** //
  const [expandedGroups, setExpandedGroups] = useState({
    "Price Book": true,
    "Control Panel": true,
    "Security": false,
  });

  const [appSearchText, setAppSearchText] = useState("");
  const [appPage, setAppPage] = useState(0);
  const [appRowsPerPage, setAppRowsPerPage] = useState(100);

  const toggleGroupExpand = (groupName) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const getFeatureGroupName = (item) => {
    const rawGroup = item.GroupName || item.Feature || item.Module || item.ParentName;
    const groupNameMap = {
      PB: "Price Book",
      CP: "Control Panel",
      SEC: "Security",
      ANL: "Analytics",
    };

    if (rawGroup) {
      return groupNameMap[rawGroup] || rawGroup;
    }

    const code = (item.Code || item.accessID || "").toUpperCase();
    const name = (item.Name || "").toLowerCase();

    if (
      code.startsWith("PPB") ||
      name.includes("quote") ||
      name.includes("price book") ||
      name.includes("price list") ||
      name.includes("template") ||
      name.includes("contact directory") ||
      name.includes("inquiry") ||
      name.includes("enquiry")
    ) {
      return "Price Book";
    }
    if (
      code.startsWith("CP") ||
      name.includes("categories") ||
      name.includes("sheet") ||
      name.includes("proprietary") ||
      name.includes("configure") ||
      name.includes("company") ||
      name.includes("items")
    ) {
      return "Control Panel";
    }
    if (
      code.startsWith("S") ||
      name.includes("menu") ||
      name.includes("user group") ||
      name.includes("user")
    ) {
      return "Security";
    }
    if (
      code.startsWith("A") ||
      name.includes("mail") ||
      name.includes("analytic")
    ) {
      return "Analytics";
    }
    return "Other";
  };

  const handleAppSelectionModelChange = (newSelectedIDs) => {
    if (params?.mode === "delete") return;

    const updatedRows = (AppRows || []).map((row) => ({
      ...row,
      IsSelected: newSelectedIDs.includes(row.RecordID) ? "Y" : "N",
    }));

    dispatch(applicationAdded(newSelectedIDs));
    setSelectedAppRows(updatedRows);
  };

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

                        // "& .MuiDataGrid-row.Mui-selected:hover": {
                        //   backgroundColor: `${theme.palette.action.selected} !important`,
                        // },
                        '& .MuiDataGrid-row:hover': {
                          border: '3px solid #999999',
                          // border: `1px solid #${theme.palette.action.selected} !important`, // Change border color on hover
                          borderRadius: '4px', // Optional: Add rounded corners
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
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "4px",
                        overflow: "hidden",
                        backgroundColor: theme.palette.background.paper,
                      }}
                    >
                      {/* --- Toolbar Header (Matching Company Access Toolbar) --- */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          px: 2,
                          py: 0.5,
                          backgroundColor: "#ffffff",
                        }}
                      >
                        <Typography fontSize={"14px"} fontWeight={"bold"}>
                          Menu Access
                        </Typography>
                        <TextField
                          placeholder="Search..."
                          variant="standard"
                          size="small"
                          value={appSearchText}
                          onChange={(e) => setAppSearchText(e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon
                                  fontSize="small"
                                  sx={{ color: "action.active" }}
                                />
                              </InputAdornment>
                            ),
                            style: { fontSize: "14px" },
                          }}
                          sx={{ width: 170 }}
                        />
                      </Box>

                      {(() => {
                        // Filter rows based on Role type
                        const roleFilteredRows =
                          values.type === "USER"
                            ? (data.ApplicationAccess || []).filter((v) => v.User === 1)
                            : values.type === "ADMIN"
                            ? (data.ApplicationAccess || []).filter((v) => v.Admin === 1)
                            : values.type === "SYSTEMADMIN"
                            ? (data.ApplicationAccess || []).filter((v) => v.SystemAdmin === 1)
                            : [];

                        const currentSelectedIDs = Applicationdata || [];
                        const roleItemIDs = roleFilteredRows.map((r) => r.RecordID);
                        const selectedRoleCount = roleItemIDs.filter((id) =>
                          currentSelectedIDs.includes(id)
                        ).length;

                        const isAllGlobalSelected =
                          roleItemIDs.length > 0 && selectedRoleCount === roleItemIDs.length;
                        const isSomeGlobalSelected =
                          selectedRoleCount > 0 && selectedRoleCount < roleItemIDs.length;

                        const handleGlobalSelectAllToggle = () => {
                          if (params?.mode === "delete") return;
                          let newSelectedIDs;
                          if (isAllGlobalSelected || isSomeGlobalSelected) {
                            newSelectedIDs = currentSelectedIDs.filter(
                              (id) => !roleItemIDs.includes(id)
                            );
                          } else {
                            newSelectedIDs = Array.from(
                              new Set([...currentSelectedIDs, ...roleItemIDs])
                            );
                          }
                          handleAppSelectionModelChange(newSelectedIDs);
                        };

                        // Group rows by Feature
                        const groups = {};
                        roleFilteredRows.forEach((row) => {
                          const groupName = getFeatureGroupName(row);
                          if (!groups[groupName]) {
                            groups[groupName] = [];
                          }
                          groups[groupName].push(row);
                        });

                        // Sort items inside each group numerically by SortOrder
                        Object.keys(groups).forEach((g) => {
                          groups[g].sort((a, b) => {
                            const orderA = parseInt(a.SortOrder ?? a.sortorder ?? a.Sequence ?? "0", 10);
                            const orderB = parseInt(b.SortOrder ?? b.sortorder ?? b.Sequence ?? "0", 10);
                            return orderA - orderB;
                          });
                        });

                        // Order groups explicitly: 1st Price Book (PB), 2nd Control Panel (CP), 3rd Security (SEC), 4th Analytics (ANL)
                        const explicitGroupOrder = {
                          "Price Book": 1,
                          "Control Panel": 2,
                          "Security": 3,
                          "Analytics": 4,
                        };

                        const groupNames = Object.keys(groups).sort((a, b) => {
                          const orderA = explicitGroupOrder[a] || 99;
                          const orderB = explicitGroupOrder[b] || 99;
                          if (orderA !== orderB) return orderA - orderB;
                          return a.localeCompare(b);
                        });

                        const searchKeyword = appSearchText.trim().toLowerCase();

                        const hasMatchingItems = groupNames.some((groupName) => {
                          const groupItems = groups[groupName];
                          const isGroupMatch = groupName.toLowerCase().includes(searchKeyword);
                          const matchingItems = searchKeyword
                            ? groupItems.filter(
                                (item) =>
                                  item.Name?.toLowerCase().includes(searchKeyword) ||
                                  item.Code?.toLowerCase().includes(searchKeyword)
                              )
                            : groupItems;
                          return isGroupMatch || matchingItems.length > 0;
                        });

                        return (
                          <>
                            {/* --- Column Header Row (Grey Header Bar matching DataGrid) --- */}
                            <Box
                              sx={{
                                backgroundColor: theme.palette.info.main,
                                color: theme.palette.info.contrastText,
                                px: 1,
                                display: "flex",
                                alignItems: "center",
                                height: dataGridHeaderFooterHeight,
                                minHeight: dataGridHeaderFooterHeight,
                              }}
                            >
                              <Checkbox
                                size="small"
                                checked={isAllGlobalSelected}
                                indeterminate={isSomeGlobalSelected}
                                disabled={params?.mode === "delete" || roleItemIDs.length === 0}
                                onChange={handleGlobalSelectAllToggle}
                                sx={{
                                  color: "white !important",
                                  "&.Mui-checked": { color: "white !important" },
                                  "&.MuiCheckbox-indeterminate": { color: "white !important" },
                                }}
                              />
                              <Typography
                                variant="subtitle2"
                                fontWeight="bold"
                                sx={{ color: "white", ml: 1 }}
                              >
                                Menu Name
                              </Typography>
                            </Box>

                            {/* --- Table Body / Grouped Content --- */}
                            {(() => {
                              let itemCounter = 0;

                              return (
                                <Box
                                  sx={{
                                    flex: 1,
                                    overflowY: "auto",
                                    backgroundColor: theme.palette.info.light,
                                    p: 0,
                                    "& .MuiCheckbox-root": { color: "black !important" },
                                    "& .MuiCheckbox-root.Mui-checked": { color: "black !important" },
                                  }}
                                >
                                  {groupNames.length === 0 || (searchKeyword && !hasMatchingItems) ? (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        height: "100%",
                                        minHeight: "180px",
                                      }}
                                    >
                                      <Typography variant="body2" color="textSecondary">
                                        No rows
                                      </Typography>
                                    </Box>
                                  ) : (
                                    groupNames.map((groupName) => {
                                      const groupItems = groups[groupName];

                                      const isGroupMatch = groupName.toLowerCase().includes(searchKeyword);
                                      const matchingItems = searchKeyword
                                        ? groupItems.filter(
                                            (item) =>
                                              item.Name?.toLowerCase().includes(searchKeyword) ||
                                              item.Code?.toLowerCase().includes(searchKeyword)
                                          )
                                        : groupItems;

                                      if (searchKeyword && !isGroupMatch && matchingItems.length === 0) {
                                        return null;
                                      }

                                      const itemsToDisplay = searchKeyword && !isGroupMatch ? matchingItems : groupItems;

                                      const groupItemIDs = itemsToDisplay.map((i) => i.RecordID);
                                      const selectedCount = groupItemIDs.filter((id) =>
                                        currentSelectedIDs.includes(id)
                                      ).length;
                                      const isAllSelected =
                                        selectedCount === groupItemIDs.length && groupItemIDs.length > 0;
                                      const isSomeSelected =
                                        selectedCount > 0 && selectedCount < groupItemIDs.length;

                                      const isExpanded = searchKeyword ? true : !!expandedGroups[groupName];

                                      return (
                                        <Box key={groupName}>
                                          {/* --- Feature Parent Header Row --- */}
                                          <Box
                                            onClick={() => toggleGroupExpand(groupName)}
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "space-between",
                                              backgroundColor: theme.palette.grey[200],
                                              px: 1,
                                              py: 0,
                                              height: dataGridRowHeight,
                                              minHeight: dataGridRowHeight,
                                              cursor: "pointer",
                                              border: "3px solid transparent",
                                              boxSizing: "border-box",
                                              "&:hover": {
                                                border: "3px solid #999999",
                                                borderRadius: "4px",
                                                backgroundColor: theme.palette.grey[300],
                                              },
                                            }}
                                          >
                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                              <Checkbox
                                                size="small"
                                                checked={isAllSelected}
                                                indeterminate={isSomeSelected}
                                                disabled={params?.mode === "delete"}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={(e) => {
                                                  e.stopPropagation();
                                                  if (params?.mode === "delete") return;

                                                  let newSelectedIDs;
                                                  if (isAllSelected || isSomeSelected) {
                                                    newSelectedIDs = currentSelectedIDs.filter(
                                                      (id) => !groupItemIDs.includes(id)
                                                    );
                                                  } else {
                                                    newSelectedIDs = Array.from(
                                                      new Set([...currentSelectedIDs, ...groupItemIDs])
                                                    );
                                                  }
                                                  handleAppSelectionModelChange(newSelectedIDs);
                                                }}
                                              />
                                              <FolderIcon
                                                fontSize="small"
                                                sx={{ mr: 1, color: "action.active" }}
                                              />
                                              <Typography variant="subtitle2" fontWeight="bold">
                                                {groupName}
                                              </Typography>
                                            </Box>
                                            <IconButton size="small">
                                              {isExpanded ? (
                                                <KeyboardArrowUpIcon fontSize="small" />
                                              ) : (
                                                <KeyboardArrowDownIcon fontSize="small" />
                                              )}
                                            </IconButton>
                                          </Box>

                                          {/* --- Child Menu Items --- */}
                                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                            <Box sx={{ py: 0 }}>
                                              {itemsToDisplay.map((item) => {
                                                const isChildChecked = currentSelectedIDs.includes(
                                                  item.RecordID
                                                );

                                                const isEvenRow = itemCounter % 2 === 0;
                                                itemCounter++;

                                                return (
                                                  <Box
                                                    key={item.RecordID}
                                                    sx={{
                                                      display: "flex",
                                                      alignItems: "center",
                                                      pl: 4,
                                                      pr: 2,
                                                      py: 0,
                                                      height: dataGridRowHeight,
                                                      minHeight: dataGridRowHeight,
                                                      boxSizing: "border-box",
                                                      border: "3px solid transparent",
                                                      backgroundColor: isEvenRow
                                                        ? theme.palette.action.hover
                                                        : theme.palette.background.default,
                                                      "&:hover": {
                                                        border: "3px solid #999999",
                                                        borderRadius: "4px",
                                                        cursor: "pointer",
                                                      },
                                                    }}
                                                  >
                                                    <Checkbox
                                                      size="small"
                                                      checked={isChildChecked}
                                                      disabled={params?.mode === "delete"}
                                                      onChange={(e) => {
                                                        e.stopPropagation();
                                                        if (params?.mode === "delete") return;

                                                        let newSelectedIDs;
                                                        if (isChildChecked) {
                                                          newSelectedIDs = currentSelectedIDs.filter(
                                                            (id) => id !== item.RecordID
                                                          );
                                                        } else {
                                                          newSelectedIDs = [
                                                            ...currentSelectedIDs,
                                                            item.RecordID,
                                                          ];
                                                        }
                                                        handleAppSelectionModelChange(newSelectedIDs);
                                                      }}
                                                    />
                                                    <DescriptionIcon
                                                      fontSize="small"
                                                      sx={{
                                                        color: theme.palette.text.secondary,
                                                        mr: 1,
                                                      }}
                                                    />
                                                    <Typography variant="body2">{item.Name}</Typography>
                                                  </Box>
                                                );
                                              })}
                                            </Box>
                                          </Collapse>
                                        </Box>
                                      );
                                    })
                                  )}
                                </Box>
                              );
                            })()}

                            {/* --- Footer Status / Pagination Bar (Matching Company Access DataGrid Footer) --- */}
                            <Box
                              sx={{
                                backgroundColor: theme.palette.info.main,
                                color: theme.palette.info.contrastText,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                                height: dataGridHeaderFooterHeight,
                                minHeight: dataGridHeaderFooterHeight,
                                overflow: "hidden",
                              }}
                            >
                              <TablePagination
                                component="div"
                                count={roleItemIDs.length}
                                page={appPage}
                                onPageChange={(event, newPage) => setAppPage(newPage)}
                                rowsPerPage={appRowsPerPage}
                                onRowsPerPageChange={(event) => {
                                  setAppRowsPerPage(parseInt(event.target.value, 10));
                                  setAppPage(0);
                                }}
                                rowsPerPageOptions={[20, 50, 100]}
                                sx={{
                                  color: "white !important",
                                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                                    color: "white !important",
                                    fontSize: "0.75rem",
                                    margin: 0,
                                  },
                                  "& .MuiTablePagination-select": {
                                    color: "white !important",
                                    fontSize: "0.75rem",
                                  },
                                  "& .MuiTablePagination-selectIcon": {
                                    color: "white !important",
                                  },
                                  "& .MuiTablePagination-actions": {
                                    color: "white !important",
                                  },
                                  "& .MuiTablePagination-actions .MuiIconButton-root": {
                                    color: "white !important",
                                    padding: "4px",
                                  },
                                  "& .MuiTablePagination-toolbar": {
                                    minHeight: dataGridHeaderFooterHeight,
                                    height: dataGridHeaderFooterHeight,
                                    paddingLeft: 2,
                                    paddingRight: 1,
                                  },
                                }}
                              />
                            </Box>
                          </>
                        );
                      })()}
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
                setSuccessMessage(null);
                        setPostError(null)
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
                setSuccessMessage(null);
                        setPostError(null)
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
            ? postError
            : successMessage
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
                onClick={() =>{ navigate("/pages/security/user-group");
                  setSuccessMessage(null);
                        setPostError(null)
                }}
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
                  setSuccessMessage(null);
                        setPostError(null)
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
                onClick={() => {navigate("/pages/security/user-group");
                  setSuccessMessage(null);
                        setPostError(null)
                }}
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
