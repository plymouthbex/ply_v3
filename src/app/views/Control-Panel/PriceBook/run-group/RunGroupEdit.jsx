import React, { useEffect, useState } from "react";
import {
  LinearProgress,
  Paper,
  Button,
  Box,
  styled,
  useTheme,
  useMediaQuery,
  TextField,
  Stack,
  DialogActions,
  Tooltip,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Breadcrumb } from "app/components";
import {
  dataGridPageSize,
  dataGridpageSizeOptions,
  dataGridRowHeight,
  dataGridHeaderFooterHeight,
} from "app/utils/constant";
import { Formik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getRunGroupData,
  getRunGroupData2,
  runGroupAddedItem,
  runGroupDeletedItem,
} from "app/redux/slice/getSlice";
import { useDispatch, useSelector } from "react-redux";
import { CustomerAddPrintGroup, deletePriceBookGroup, runGroupDelete, runGroupPost } from "app/redux/slice/postSlice";
import AlertDialog, { MessageAlertDialog } from "app/components/AlertDialog";
import { getRunGroupListView } from "app/redux/slice/listviewSlice";
import lodash from "lodash";

// ********************** ICONS ********************** //
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Add } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import useAuth from "app/hooks/useAuth";
import { CusListRunGrpOptimizedAutocomplete } from "app/components/FormikAutocomplete";
import { FormikSalesPersonOptimizedAutocomplete } from "app/components/SingleAutocompletelist";

// ********************** STYLED COMPONENTS ********************** //
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

// ********************** PRICE LIST EDIT SCREEN  ********************** //
const RunGroupEdit = () => {
  // ********************** HOOKS AND CONSTANTS ********************** //
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  const dispatch = useDispatch();
  const { user } = useAuth();
  const getRows = useSelector((state) => state.getSlice.runGroupGetData);
  // ********************** LOCAL STATE ********************** //
  const [openAlert, setOpenAlert] = useState(false);
  const [postError, setPostError] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const [isRunGroupOpen, SetIsRunGroupOpen] = useState(false);
  const [RunGroupID, setRunGroupID] = useState(0);
  const [isDelete, setIsDelete] = useState(false);
  const [isCustomerListExists, setIsCustomerListExists] = useState(false);
  const [isCustomerListExistsError, setIsCustomerListExistsError] = useState(false);
  const [isRemoveCustomer, setIsRemoveCustomer] = useState(false);
  const [removeCustomerID, setremoveCustomerID] = useState(0);
  const [removeCustomerdDesc, setremoveCustomerDesc] = useState("");
  const [slectedSalesName, setselectedSalesName] = useState(null);



  const [addCustomerListData, setAddCustomerListData] = useState([]);
  const handleSelectionAddCustomerListData = (e, newValue) => {
    setAddCustomerListData(newValue);
  };

  const handleAddCustomers = async(values) => {
    if (addCustomerListData.length > 0) {
      dispatch(runGroupAddedItem(addCustomerListData));
        const response = await dispatch(
              CustomerAddPrintGroup({
                data: addCustomerListData,
                PriceBookGroup: data.Code,
              })
            );
        if(response.payload.status === "Y"){
          dispatch(getRunGroupData2({ id: state.ID }));
        }
      setAddCustomerListData([]);
    } else {
      setIsCustomerListExistsError(true);
      setTimeout(() => {
        setIsCustomerListExistsError(false);
      }, 2000);
    }
  };

  // ********************** REDUX STATE ********************** //
  const data = useSelector((state) => state.getSlice.runGroupFormData);
  const loading = useSelector((state) => state.getSlice.runGroupLoading);
  const status = useSelector((state) => state.getSlice.runGroupStatus);
  const error = useSelector((state) => state.getSlice.printGroupError);

  useEffect(() => {
    dispatch(getRunGroupData({ id: state.ID }));
  }, [location.key]);

  // ********************** COLUMN AND ROWS ********************** //
  const columns = [
    {
      headerName: "Customer Number",
      field: "CustomerNumber",
      width: "150",
      align: "left",
      headerAlign: "left",
    },
    {
      headerName: "Customer Name",
      field: "CustomerName",
      minWidth: 200,
      flex: 1,
      align: "left",
      headerAlign: "left",
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
      renderCell: (param) => {
        return (
          <Tooltip title="Remove Customer">
            <IconButton
              color="error"
              size="small"
              onClick={() => {
                setremoveCustomerID(param.row.RecordID);
                setremoveCustomerDesc(param.row.CustomerNumber);
                setIsRemoveCustomer(true);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];


  const CustomToolbar = React.memo(() => {
    return (
      <GridToolbarContainer
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          width: "100%",
          padding: "5px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isNonMobile ? "row" : "column",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 2,
            paddingX: 2,
            width: "100%",
          }}
        >
          <GridToolbarQuickFilter sx={{ width: 200 }} />
        </Box>
      </GridToolbarContainer>
    );
  });

  const runGroupSaveFn = async (values, setSubmitting) => {
    const postData = {
      RecordId: data.RecordId,
      Code: slectedSalesName || data.SalesPersonName,
      Name: slectedSalesName || data.SalesPersonName,
      Sortorder: values.sortOrder,
      // AllSalesMan: values.AllSalesMan,
      AllSalesMan: false,
      CompanyCode: state.CompanyCode,
      SalesPerson: slectedSalesName || data.SalesPersonName,
      Disable: "N",
      LastModifiedDate: "",
      RunGroupList: [],
    };
    try {
      const response = await dispatch(runGroupPost({ rData: postData }));

      if (response.payload.status === "Y") {
        setOpenAlert(true);
        setSuccessMessage(response.payload.message);
        if (params.mode === "add") {
          navigate('/pages/control-panel/run-group/run-group-getail/edit',{ID :response.payload.RecordID})
          dispatch(
            CustomerAddPrintGroup({
              data: addCustomerListData,
              PriceBookGroup: slectedSalesName,
            })
          );
          // dispatch(getRunGroupData({ id: response.payload.RecordID }));
        }
      } else {
        setOpenAlert(true);
        setPostError(response.payload.message);
      }
    } catch (error) {
      console.error("Error during HandleSave:", error);
    }
    setSubmitting(false);
  };

  const runGroupDeleteFn = async (values, setSubmitting) => {
    try {
      dispatch(runGroupDelete({ id: data.RecordId })).then((response) => {
        if (response.payload.status === "Y") {
          setOpenAlert(true);
          setSuccessMessage(response.payload.message);
        } else {
          setOpenAlert(true);
          setPostError(response.payload.message);
        }
      });
      setSubmitting(false);
    } catch (e) {
      console.log("🚀 ~ priceListSaveFn ~ e:", e);
    }
  };

  const runGroupCusDeleteFn = async () => {
    try {
      dispatch(deletePriceBookGroup({
         Recordid:removeCustomerID,
         CustomerNumber:removeCustomerdDesc})).then((response) => {
        if (response.payload.status === "Y") {
          dispatch(getRunGroupData2({ id: state.ID }));
          setIsRemoveCustomer(false);
          setremoveCustomerID(0);
          setremoveCustomerDesc("");
        } else {
          setIsRemoveCustomer(false);
          setremoveCustomerID(0);
          setremoveCustomerDesc("");
          setOpenAlert(true);
          setPostError(response.payload.message);
        }
      });;
    } catch (e) {
      console.log("🚀 ~ priceListSaveFn ~ e:", e);
    }
  };


  return (
    <Container>
      {status === "fulfilled" && !error ? (
        <Formik
          initialValues={{
            RecordId: data.RecordId,
            runGroupCode: data.Code,
            runGroupName: data.Name,
            sortOrder: data.Sortorder,
            Disable: data.Disable,
            AllSalesMan: data.AllSalesMan,
            LastModifiedDate: data.LastModifiedDate,
            sales: JSON.parse(data.SalesPerson),
          }}
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              if (params.mode === "delete") {
                setIsDelete(true);
              }
              if (params.mode === "add" || params.mode === "edit") {
                runGroupSaveFn(values, setSubmitting);
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
            setSubmitting,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="breadcrumb">
                <Breadcrumb
                  routeSegments={[
                    { name: "Control Panel" },
                    {
                      name: "Price Book Group",
                      path: "/pages/control-panel/run-group",
                    },
                    { name: `${params.mode} Price Book Group` },
                  ]}
                />
                <Stack direction={"row"} gap={1}>
                  <Button
                    disabled={isSubmitting}
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
                  >
                    {params.mode === "delete" ? "Confirm" : "Save"}
                  </Button>

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
                  {/* <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="runGroupCode"
                    name="runGroupCode"
                    label="Price Book Group Name"
                    value={values.runGroupCode}
                    onChange={handleChange}
                    required
                    InputLabelProps={{
                      sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                    }}
                    autoComplete="off"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    disabled={params.mode === "delete" ? true : false}
                    //   error={!!touched.runGroupCode && !!errors.runGroupCode}
                    //   helperText={touched.runGroupCode && errors.runGroupCode}
                  /> */}
                  {/* <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="runGroupName"
                    name="runGroupName"
                    label="Description"
                    value={values.runGroupName}
                    onChange={handleChange}
                    required
                    InputLabelProps={{
                      sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                    }}
                    autoComplete="off"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    disabled={params.mode === "delete" ? true : false}
                    //   error={!!touched.runGroupName && !!errors.runGroupName}
                    //   helperText={touched.runGroupName && errors.runGroupName}
                  /> */}
                  <FormikSalesPersonOptimizedAutocomplete
                      required={true}
                    sx={{ gridColumn: "span 2" }}
                    disabled={
                      params.mode === "delete" || params.mode === "view" 
                        ? true
                        : false
                    }
                    name="sales"
                    id="sales"
                    value={values.sales}
                    onChange={(event, newValue) => {
                      setFieldValue("sales", newValue);
                      if(newValue){

                        setselectedSalesName(newValue.Name);
                      }
                    }}
                    label="Price Book Group"
                    url={`${process.env.REACT_APP_BASE_URL}GPRungroup/SalesPerson`}
                  />
                  <Stack
                    direction={"row"}
                    gap={1}
                    sx={{ gridColumn: "span 2" }}
                  >
                    <CusListRunGrpOptimizedAutocomplete
                
                      disabled={
                        params.mode === "delete" || params.mode === "view" 
                          ? true
                          : false
                      }
                      sx={{ width: "100%" }}
                      errors={isCustomerListExistsError}
                      helper={
                        isCustomerListExistsError && "Please select customer!"
                      }
                      name="customerPriceList"
                      id="customerPriceList"
                      value={addCustomerListData}
                      onChange={handleSelectionAddCustomerListData}
                      label="Unassigned Customers"
                      url={`${
                        process.env.REACT_APP_BASE_URL
                      }CustomerPriceList/CustomerPriceList?CompanyCode=${
                        state.CompanyCode
                      }&PriceBookGroup=${
                        slectedSalesName || data.SalesPersonName
                      }`}
                      addedCustomers={getRows} // Pass added customers to exclude them
                    />
                    <Tooltip title="Add Customers">
                      <IconButton
                        disabled={
                          params.mode === "delete" || params.mode === "view" || params.mode === "add" 
                            ? true
                            : false
                        }
                        sx={{ height: 37.6 }}
                        color="info"
                        onClick={handleAddCustomers}
                      >
                        <Add
                          sx={{
                            fontSize: 30, // Increased icon size
                            color: theme.palette.success.main,
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </Stack>

                  <Box
                    sx={{
                      height: 400,
                      gridColumn: "span 4",
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
                      rows={getRows}
                      columns={columns}
                      disableSelectionOnClick
                      disableRowSelectionOnClick
                      getRowId={(row) => row.CustomerNumber}
                      initialState={{
                        pagination: {
                          paginationModel: { pageSize: dataGridPageSize },
                        },
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
                </Box>
              </Paper>

              <MessageAlertDialog
                logo={`data:image/png;base64,${user.logo}`}
                open={isDelete}
                tittle={values.runGroupCode}
                message={`Are you sure you want to delete Price Book Group?`}
                Actions={
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
                      onClick={() => {
                        setIsDelete(false);
                        runGroupDeleteFn();
                        setSuccessMessage(null);
                        setPostError(null);
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
                        setSubmitting(false);
                        setSuccessMessage(null);
                        setPostError(null);
                      }}
                      autoFocus
                    >
                      No
                    </Button>
                  </Box>
                }
              />

              <MessageAlertDialog
                logo={`data:image/png;base64,${user.logo}`}
                open={isRemoveCustomer}
                tittle={removeCustomerdDesc}
                message={`Are you sure you want to remove the customer?`}
                Actions={
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
                      onClick={runGroupCusDeleteFn}
                    >
                      Yes
                    </Button>
                    <Button
                      sx={{ mr: 1, height: 25 }}
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => {
                        setIsRemoveCustomer(false);
                        setremoveCustomerID(0);
                        setremoveCustomerDesc("");
                      }}
                    >
                      No
                    </Button>
                  </Box>
                }
              />
            </form>
          )}
        </Formik>
      ) : (
        false
      )}
      <AlertDialog
        logo={`data:image/png;base64,${user.logo}`}
        open={openAlert}
        error={postError}
        message={postError ? postError : successMessage}
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
                setOpenAlert(false);
                setSuccessMessage(null);
                setPostError(null);
              }}
            >
              close
            </Button>
          </Box>
        }
      />

      <MessageAlertDialog
        logo={`data:image/png;base64,${user.logo}`}
        open={isCustomerListExists}
        tittle={
          addCustomerListData
            ? addCustomerListData.CustomerName
            : "Please select customer!"
        }
        message={"Oops! This customer is already exists in Price Book group."}
        Actions={
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
              onClick={() => {
                setIsCustomerListExists(false);
                setAddCustomerListData(null);
              }}
            >
              Close
            </Button>
          </Box>
        }
      />
    </Container>
  );
};

export default RunGroupEdit;
