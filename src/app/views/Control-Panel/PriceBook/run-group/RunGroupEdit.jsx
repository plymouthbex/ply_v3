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
} from "app/utils/constant";
import { Formik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getRunGroupData,
  runGroupAddedItem,
  runGroupDeletedItem,
} from "app/redux/slice/getSlice";
import { useDispatch, useSelector } from "react-redux";
import { runGroupDelete, runGroupPost } from "app/redux/slice/postSlice";
import AlertDialog, { MessageAlertDialog } from "app/components/AlertDialog";
import { getRunGroupListView } from "app/redux/slice/listviewSlice";
import lodash from "lodash";
import { CusListRunGrpOptimizedAutocomplete } from "app/components/SingleAutocompletelist";

// ********************** ICONS ********************** //
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Add } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import useAuth from "app/hooks/useAuth";

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
  console.log("🚀 ~ RunGroupEdit ~ state:", state)
  const dispatch = useDispatch();
  const {user}=useAuth();
 
  // ********************** LOCAL STATE ********************** //
  const [openAlert, setOpenAlert] = useState(false);
  const [postError, setPostError] = useState(false);
  const [isRunGroupOpen, SetIsRunGroupOpen] = useState(false);
  const [RunGroupID, setRunGroupID] = useState(0);
  const [isDelete, setIsDelete] = useState(false);
  const [isCustomerListExists, setIsCustomerListExists] = useState(false);
  const [isCustomerListExistsError, setIsCustomerListExistsError] =useState(false);
  const [isRemoveCustomer, setIsRemoveCustomer] = useState(false);
  const [removeCustomerID, setremoveCustomerID] = useState(0);
  const [removeCustomerdDesc, setremoveCustomerDesc] = useState("");

  const [addCustomerListData, setAddCustomerListData] = useState(null);

  const handleSelectionAddCustomerListData = (newValue) => {
    setAddCustomerListData(newValue);
  };
  // ********************** REDUX STATE ********************** //
  const data = useSelector((state) => state.getSlice.runGroupFormData);
  const addedRows = useSelector((state) => state.getSlice.runGroupAddedData);
  const getRows = useSelector((state) => state.getSlice.runGroupGetData);
  const loading = useSelector((state) => state.getSlice.runGroupLoading);
  const status = useSelector((state) => state.getSlice.runGroupStatus);
  const error = useSelector((state) => state.getSlice.printGroupError);
  const getRowsSet = new Set(getRows.map((item) => item.RecordID));
  const filteredSelectedItems = addedRows.filter(
    (selectedItem) => !getRowsSet.has(selectedItem.RecordID)
  );
  useEffect(() => {
    dispatch(getRunGroupData({ id: state.ID }));
  }, []);

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
          <Button
            sx={{ height: 25 }}
            variant="contained"
            color="secondary"
            size="small"
            disabled={params.mode === "delete" || params.mode === "view"}
            onClick={() => {
              setremoveCustomerID(param.row.RecordID);
              setremoveCustomerDesc(param.row.CustomerName);
              setIsRemoveCustomer(true);
            }}
            startIcon={<DeleteIcon size="small" />}
          >
            Remove
          </Button>
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
          <GridToolbarQuickFilter sx={{ width: 400 }} />
          <CusListRunGrpOptimizedAutocomplete
            errors={isCustomerListExistsError}
            helper={
              isCustomerListExistsError && "Please select customer!"
            }
            disabled={params.mode === "delete" || params.mode === "view"}
            name="customerPriceList"
            id="customerPriceList"
            value={addCustomerListData}
            onChange={handleSelectionAddCustomerListData}
            label="Customer"
            url={`${process.env.REACT_APP_BASE_URL}CustomerPriceList/CustomerPriceList`}
          />
          <Button
            variant="contained"
            color="info"
            size="small"
            startIcon={<Add fontSize="small" />}
            disabled={params.mode === "delete" ? true : false}
            onClick={() => {
              if (addCustomerListData) {
                const isItem = [...getRows, ...filteredSelectedItems].some(
                  (item) =>
                    lodash.isEqual(item.RecordID, addCustomerListData.RecordID)
                );
                if (isItem) {
                  setIsCustomerListExists(true);
                  setTimeout(() => {
                    setIsCustomerListExists(false);
                    setAddCustomerListData(null);
                  }, 5000);
                  return;
                }
                dispatch(runGroupAddedItem(addCustomerListData));
                setAddCustomerListData(null);
              } else {
                setIsCustomerListExistsError(true);
                setTimeout(() => {
                  setIsCustomerListExistsError(false);
                }, 2000);
              }
            }}
          >
            Add
          </Button>
        </Box>
      </GridToolbarContainer>
    );
  }

  const runGroupSaveFn = async (values, setSubmitting) => {
    const postData = {
      recordId: data.RecordId,
      code: values.runGroupCode,
      name: values.runGroupName,
      sortorder: values.sortOrder,
      companyRecordID:user.companyID,
      disable: "N",
      lastModifiedDate: "",
      RunGroupList: [...getRows, ...filteredSelectedItems],
    };
    try {
      const response = await dispatch(runGroupPost({ rData: postData }));

      if (response.payload.status === "Y") {
        setOpenAlert(true);
      } else {
        setOpenAlert(true);
        setPostError(true);
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
        } else {
          setOpenAlert(true);
          setPostError(true);
        }
      });
      setSubmitting(false);
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
            LastModifiedDate: data.LastModifiedDate,
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
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="breadcrumb">
                <Breadcrumb
                  routeSegments={[
                    { name: "CP-Price Book" },
                    { name: "Run Group", path: "/pages/control-panel/run-group" },
                    { name: `${params.mode} Run Group` },
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
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="runGroupCode"
                    name="runGroupCode"
                    label="Run Group"
                    value={values.runGroupCode}
                    onChange={handleChange}
                    required
                    InputLabelProps={{
                      sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                    }}
                    size="small"
                    sx={{ gridColumn: "span 1" }}
                    disabled={params.mode === "delete" ? true : false}
                    //   error={!!touched.runGroupCode && !!errors.runGroupCode}
                    //   helperText={touched.runGroupCode && errors.runGroupCode}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="runGroupName"
                    name="runGroupName"
                    label="Run Group Description"
                    value={values.runGroupName}
                    onChange={handleChange}
                    required
                    InputLabelProps={{
                      sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                    }}
                    size="small"
                    sx={{ gridColumn: "span 1" }}
                    disabled={params.mode === "delete" ? true : false}
                    //   error={!!touched.runGroupName && !!errors.runGroupName}
                    //   helperText={touched.runGroupName && errors.runGroupName}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="sortOrder"
                    name="sortOrder"
                    label="Sequence"
                    value={values.sortOrder}
                    onChange={handleChange}
                    
                    size="small"
                    sx={{ gridColumn: "span 1" }}
                    disabled={params.mode === "delete" ? true : false}
                    //   error={!!touched.sortOrder && !!errors.sortOrder}
                    //   helperText={touched.sortOrder && errors.sortOrder}
                  />
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
                    }}
                  >
                    <DataGrid
                      slots={{
                        loadingOverlay: LinearProgress,
                        toolbar: CustomToolbar,
                      }}
                      rowHeight={dataGridRowHeight}
                      rows={[...getRows, ...filteredSelectedItems]}
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
                open={isDelete}
                tittle={values.runGroupCode}
                message={`Are you sure you want to delete Run Group?`}
                Actions={
                  <DialogActions>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => {
                        setIsDelete(false);
                        runGroupDeleteFn();
                      }}
                    >
                      Yes
                    </Button>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => {
                        setIsDelete(false);
                        setSubmitting(false);
                      }}
                      autoFocus
                    >
                      No
                    </Button>
                  </DialogActions>
                }
              />

              <MessageAlertDialog
                open={isRemoveCustomer}
                tittle={removeCustomerdDesc}
                message={`Are you sure you want to remove customer ?`}
                Actions={
                  <DialogActions>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => {
                        dispatch(
                          runGroupDeletedItem({
                            id: removeCustomerID,
                            runGroupAddedData: filteredSelectedItems,
                          })
                        );
                        setIsRemoveCustomer(false);
                        setremoveCustomerID(0);
                        setremoveCustomerDesc("");
                      }}
                    >
                      Yes
                    </Button>
                    <Button
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
                  </DialogActions>
                }
              />
            </form>
          )}
        </Formik>
      ) : (
        false
      )}
      <AlertDialog
        open={openAlert}
        error={postError}
        message={
          params.mode === "add"
            ? "RunGroup added successfully"
            : params.mode === "delete"
              ? "RunGroup deleted Successfully"
              : "RunGroup updated successfully"
        }
        Actions={
          params.mode === "add" ? (
            <DialogActions>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  navigate("/pages/control-panel/run-group"
                    ,
                    {
                      state:{
                    ID:state.companyID
                  }
                }
              );
                  // dispatch(clearPrintListState())
                }}
              >
                Back to Run Group
              </Button>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  dispatch(getRunGroupData({ id: 0 }));
                  setOpenAlert(false);
                }}
                autoFocus
              >
                Add New Run Group
              </Button>
            </DialogActions>
          ) : (
            <DialogActions>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => navigate("/pages/control-panel/run-group",
                  {
                    state:{
                      companyID:state.companyID
                }
              })}
              >
                Back to Run Group
              </Button>
            </DialogActions>
          )
        }
      />

      <MessageAlertDialog
        open={isCustomerListExists}
        tittle={
          addCustomerListData
            ? addCustomerListData.CustomerName
            : "Please select customer!"
        }
        message={"Oops! This customer is already exists in run group."}
        Actions={
          <DialogActions>
            <Button
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
          </DialogActions>
        }
      />
    </Container>
  );
};

export default RunGroupEdit;
