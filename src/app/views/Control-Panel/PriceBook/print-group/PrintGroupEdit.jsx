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
} from "@mui/material";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Breadcrumb } from "app/components";
import { Formik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  dataGridPageSize,
  dataGridpageSizeOptions,
  dataGridRowHeight,
  dataGridHeaderFooterHeight,
} from "app/utils/constant";
import { useDispatch, useSelector } from "react-redux";

import {
  clearPrintGroupState,
  getprintGroupData,
  printGroupAddedItem,
  printGroupDeletedItem,
} from "app/redux/slice/getSlice";
import useAuth from "app/hooks/useAuth";
import lodash from "lodash";
import AlertDialog, { MessageAlertDialog } from "app/components/AlertDialog";
import { PGOptimizedAutocomplete } from "app/components/SingleAutocompletelist";

// ********************** ICONS ********************** //
import { Add } from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  deletePrintGroupData,
  postPrintGroupData,
} from "app/redux/slice/postSlice";

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

// ********************** PRINT GROUP SCREEN  ********************** //
const PrintGroupEdit = () => {
  // ********************** HOOKS AND CONSTANTS ********************** //
  const { user } = useAuth();
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const state = location.state;

  // ********************** LOCAL STATE ********************** //
  const [openAlert, setOpenAlert] = useState(false);
  const [postError, setPostError] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [isPrintGroupOpen, SetIsPrintGroupOpen] = useState(false);
  const [printGroupID, setPrintGroupID] = useState(0);
  const [isDelete, setIsDelete] = useState(false);
  const [isPriceListExists, setIsPriceListExists] = useState(false);
  const [isPriceListExistsError, setIsPriceListExistsError] = useState(false);
  const [isRemovePriceList, setIsRemovePriceList] = useState(false);
  const [removePriceListID, setremovePriceListID] = useState(0);
  const [removePriceListdDesc, setremovePriceListDesc] = useState("");

  const [addPriceListData, setAddPriceListData] = useState(null);
  const handleSelectionAddPriceListData = (newValue) => {
    setAddPriceListData(newValue);
  };

  // ********************** REDUX STATE ********************** //
  const printGroupRows = useSelector(
    (state) => state.listview.printGroupListViewData
  );
  const data = useSelector((state) => state.getSlice.printGroupFormData);
  const addedRows = useSelector((state) => state.getSlice.printGroupAddedData);
  const getRows = useSelector((state) => state.getSlice.printGroupGetData);
  const loading = useSelector((state) => state.getSlice.printGroupLoading);
  const status = useSelector((state) => state.getSlice.printGroupStatus);
  const error = useSelector((state) => state.getSlice.printGroupError);

  const getRowsSet = new Set(getRows.map((item) => item.RecordID));
  const filteredSelectedItems = addedRows.filter(
    (selectedItem) => !getRowsSet.has(selectedItem.RecordID)
  );

  // ********************** COLUMN ********************** //
  const columns = [
    {
      headerName: "Price List Name",
      field: "PRICELISTID",
      width: "170",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Price List Description",
      field: "PRICELISTDESCRIPTION",
      width: "300",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Print Group",
      field: "GroupCode",
      width: "100",
      align: "right",
      headerAlign: "center",
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

      renderCell: (param) => {
        return (
          <Box>
            <Tooltip title="Remove">
              <IconButton
                color="error"
                size="small"
                disabled={params.mode === "delete" || params.mode === "view"}
                onClick={() => {
                  setremovePriceListID(param.row.RecordID);
                  setremovePriceListDesc(param.row.PRICELISTDESCRIPTION);
                  setIsRemovePriceList(true);
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

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
          <PGOptimizedAutocomplete
            errors={isPriceListExistsError}
            helper={isPriceListExistsError && "Please select price list!"}
            disabled={params.mode === "delete" || params.mode === "view"}
            name="addPriceList"
            id="addPriceList"
            value={addPriceListData}
            onChange={handleSelectionAddPriceListData}
            label="Add Price List"
            url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=PriceList`}
          />
          <Tooltip title="Add">
            <IconButton
              color="black"
              sx={{ height: 25 }}
              size="small"
              disabled={params.mode === "delete" || params.mode === "view"}
              onClick={() => {
                if (addPriceListData) {
                  const isItem = [...getRows, ...filteredSelectedItems].some(
                    (item) =>
                      lodash.isEqual(item.RecordID, addPriceListData.RecordID)
                  );
                  if (isItem) {
                    setIsPriceListExists(true);
                    setTimeout(() => {
                      setIsPriceListExists(false);
                      setAddPriceListData(null);
                    }, 5000);
                    return;
                  }
                  dispatch(printGroupAddedItem(addPriceListData));
                  setAddPriceListData(null);
                } else {
                  setIsPriceListExistsError(true);
                  setTimeout(() => {
                    setIsPriceListExistsError(false);
                  }, 2000);
                }
              }}
            >
              <Add sx={{
                  fontSize: 30, // Increased icon size
                  color: theme.palette.success.main,
                }} />
            </IconButton>
          </Tooltip>

          {/* <Button
            disabled={params.mode === "delete" || params.mode === "view"}
            variant="contained"
            color="info"
            size="small"
            startIcon={<Add />}
            onClick={() => {
              if (addPriceListData) {
                const isItem = [...getRows, ...filteredSelectedItems].some(
                  (item) =>
                    lodash.isEqual(item.RecordID, addPriceListData.RecordID)
                );
                if (isItem) {
                  setIsPriceListExists(true);
                  setTimeout(() => {
                    setIsPriceListExists(false);
                    setAddPriceListData(null);
                  }, 5000);
                  return;
                }
                dispatch(printGroupAddedItem(addPriceListData));
                setAddPriceListData(null);
              } else {
                setIsPriceListExistsError(true);
                setTimeout(() => {
                  setIsPriceListExistsError(false);
                }, 2000);
              }
            }}
          >
            Add
          </Button> */}
        </Box>
      </GridToolbarContainer>
    );
  }

  useEffect(() => {
    if (status === "idle") {
      dispatch(getprintGroupData({ id: state.id }));
    }
  }, [location.key]);

  const isPrintGroupExists = (e, setSubmitting) => {
    const inputValue = e.target.value.trim();
    const isPrintGroup = printGroupRows.some(
      (item) => item.GroupCode === inputValue
    );
    if (isPrintGroup) {
      const printGrpID = printGroupRows.find(
        (item) => item.GroupCode === inputValue
      );
      setPrintGroupID(printGrpID.RecordID);
      SetIsPrintGroupOpen(true);
    } else {
      setSubmitting(false);
    }
  };

  const printGroupSaveFn = async (values, setSubmitting) => {
    const postData = {
      recordId: state.id,
      groupcode: values.groupCode,
      groupName: values.groupName,
      sortorder: values.SortOrder,
      disable: "N",
      Headeronly:false,
      printList: [...getRows, ...filteredSelectedItems],
    };
    try {
      const response = await dispatch(postPrintGroupData({ PGdata: postData }));

      if (response.payload.status === "Y") {
        setOpenAlert(true);
        setSuccessMessage(response.payload.message)
        setTimeout(() => {
          setOpenAlert(false);
          setSuccessMessage(null);
          
        }, 2000);
      } else {
        setOpenAlert(true);
        setPostError(response.payload.message);
  
        setTimeout(() => {
          // setOpenAlert(false);
          setPostError(null);
        
        }, 2000);
      }
    } catch (error) {
      console.error("Error during HandleSave:", error);
    }
    setSubmitting(false);
  };

  const printGroupDeleteFn = async (values, setSubmitting) => {
    try {
      dispatch(deletePrintGroupData({ ID: data.RecordId })).then((response) => {
        if (response.payload.status === "Y") {
          setOpenAlert(true);
          setSuccessMessage(response.payload.message);
        } else {
          setOpenAlert(true);
          setPostError(response.payload.message);
    
          setTimeout(() => {
            // setOpenAlert(false);
            setPostError(null);
            
          }, 2000);
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
            groupCode: data.GroupCode,
            groupName: data.GroupName,
            SortOrder: data.Sortorder,
            Disable: data.Disable,
          }}
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              if (params.mode === "delete") {
                setIsDelete(true);
              }
              if (params.mode === "add" || params.mode === "edit") {
                printGroupSaveFn(values, setSubmitting);
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
            setFieldValue,
            setSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="breadcrumb">
                <Breadcrumb
                  routeSegments={[
                    { name: "Control Panel" },
                    {
                      name: "Categories",
                      path: "/pages/control-panel/print-group",
                    },
                    {
                      name: `${params.mode} Categories`,
                    },
                  ]}
                />
                <Stack direction={"row"} gap={1}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="info"
                    size="small"
                    disabled={isSubmitting}
                    startIcon={
                      params.mode === "delete" ? (
                        <DeleteIcon color="error" size="small" />
                      ) : (
                        <SaveIcon size="small" />
                      )
                    }
                  >
                    {params.mode === "delete" ? "Confirm" : "Save"}
                  </Button>
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    startIcon={<ArrowBackIcon size="small" />}
                    onClick={() => {
                      navigate(-1);
                    }}
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
                  <Stack
                    sx={{ gridColumn: "span 2" }}
                    direction="column"
                    gap={1}
                  >
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      id="groupCode"
                      name="groupCode"
                      label="Category Name"
                      size="small"
                      disabled={
                        params?.mode === "delete" || params?.mode === "edit"
                      }
                      onFocus={() => setSubmitting(true)}
                      onChange={handleChange}
                      onBlur={(e) => isPrintGroupExists(e, setSubmitting)}
                      value={values.groupCode}
                      required
                      autoComplete="off"
                      InputLabelProps={{
                        sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                      }}
                      // error={!!touched.groupCode && !!errors.groupCode}
                      // helperText={touched.groupCode && errors.groupCode}
                    />
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      id="groupName"
                      name="groupName"
                      label="Category Description"
                      size="small"
                      onChange={handleChange}
                      value={values.groupName}
                      disabled={params?.mode === "delete"}
                      required
                      InputLabelProps={{
                        sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                      }}
                      autoComplete="off"
                      // error={!!touched.groupName && !!errors.groupName}
                      // helperText={touched.groupName && errors.groupName}
                    />
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      id="SortOrder"
                      name="SortOrder"
                      label="Sequence"
                      size="small"
                      onChange={handleChange}
                      value={values.SortOrder}
                      disabled={params?.mode === "delete"}
                    />
                  </Stack>
                </Box>
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
                      color: "black !important", // Set checkbox color to black
                    },

                    "& .MuiCheckbox-root.Mui-checked": {
                      color: "black !important", // Set checkbox color to black when checked
                    },
                    "& .MuiDataGrid-row:nth-of-type(even)": {
                      backgroundColor: theme.palette.action.hover,
                    },
                    "& .MuiDataGrid-row:nth-of-type(odd)": {
                      backgroundColor: theme.palette.background.default, // Color for odd rows
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
                    rows={[...getRows, ...filteredSelectedItems]}
                    columns={columns}
                    disableSelectionOnClick
                    disableRowSelectionOnClick
                    getRowId={(row) => row.PRICELISTID}
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
              </Paper>
              <MessageAlertDialog
               logo={`data:image/png;base64,${user.logo}`}
                open={isPrintGroupOpen}
                tittle={values.groupCode}
                message={`Oops!This print group is already in use.`}
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
                        navigate(
                          "/pages/control-panel/print-group/print-group-detail/edit",
                          {
                            state: { id: printGroupID },
                          }
                        );
                        dispatch(getprintGroupData({ id: printGroupID }));
                        SetIsPrintGroupOpen(false);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => {
                        setFieldValue("groupCode", "");
                        SetIsPrintGroupOpen(false);
                      }}
                      autoFocus
                    >
                      Try Another
                    </Button>
                  </Box>
                }
              />

              <MessageAlertDialog
               logo={`data:image/png;base64,${user.logo}`}
                open={isDelete}
                // tittle={values.groupCode}
                message={`Are you sure you want to delete the  Category?`}
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
                        printGroupDeleteFn();
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
                open={isRemovePriceList}
                tittle={removePriceListdDesc}
                message={`Are you sure you want to remove Price List ?`}
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
                        dispatch(
                          printGroupDeletedItem({
                            id: removePriceListID,
                            printGroupAddedData: filteredSelectedItems,
                          })
                        );
                        setIsRemovePriceList(false);
                        setremovePriceListID(0);
                        setremovePriceListDesc("");
                      }}
                    >
                      Yes
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ mr: 1, height: 25 }}
                      color="info"
                      size="small"
                      onClick={() => {
                        setIsRemovePriceList(false);
                        setremovePriceListID(0);
                        setremovePriceListDesc("");
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
                onClick={() => {
                  navigate("/pages/control-panel/print-group");
              }}
              >
                Back to Categories
              </Button>
              <Button
                sx={{ mr: 1, height: 25 }}
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  dispatch(getprintGroupData({ id: 0 }));
                  dispatch(clearPrintGroupState());
                  setOpenAlert(false);
                  setSuccessMessage(null)
                }}
                autoFocus
              >
                Add New Categories
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
                onClick={() => navigate("/pages/control-panel/print-group")}
              >
                Back to Categories
              </Button>
            </Box>
          )
        }
      />

      <MessageAlertDialog
       logo={`data:image/png;base64,${user.logo}`}
        open={isPriceListExists}
        tittle={
          addPriceListData
            ? addPriceListData.PRICELISTDESCRIPTION
            : "Please select price list!"
        }
        message={"Oops! This price list is already exists in Category."}
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
                setIsPriceListExists(false);
                setAddPriceListData(null);
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

export default PrintGroupEdit;
