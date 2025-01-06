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
import { Formik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  dataGridPageSize,
  dataGridpageSizeOptions,
  dataGridRowHeight,
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
import { deletePrintGroupData, postPrintGroupData } from "app/redux/slice/postSlice";

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
            <Button
              sx={{ height: 25 }}
              variant="contained"
              color="secondary"
              size="small"
              disabled={params.mode === "delete" || params.mode === "view"}
              onClick={() => {
                setremovePriceListID(param.row.RecordID);
                setremovePriceListDesc(param.row.PRICELISTDESCRIPTION);
                setIsRemovePriceList(true);
              }}
              startIcon={<DeleteIcon size="small" />}
            >
              Remove
            </Button>
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

          <Button
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
          </Button>
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
      printList: [...getRows, ...filteredSelectedItems],
    };
    try {
      const response = await dispatch(postPrintGroupData({ PGdata: postData }));

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

  const printGroupDeleteFn = async (values, setSubmitting) => {
    try {
      dispatch(deletePrintGroupData({ ID: data.RecordId })).then((response) => {
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
                    { name: "CP-Price Book" },
                    { name: "Price Book Category", path: "/pages/control-panel/price-lists-group" },
                    {
                      name: `${params.mode} Price Book Category`,
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
                open={isPrintGroupOpen}
                tittle={values.groupCode}
                message={"Oops! This print group is already in use."}
                Actions={
                  <DialogActions>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => {
                        navigate("/pages/control-panel/print-group/print-group-detail/edit", {
                          state: { id: printGroupID },
                        });
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
                  </DialogActions>
                }
              />

              <MessageAlertDialog
                open={isDelete}
                tittle={values.groupCode}
                message={`Are you sure you want to delete Print Group?`}
                Actions={
                  <DialogActions>
                    <Button
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
                open={isRemovePriceList}
                tittle={removePriceListdDesc}
                message={`Are you sure you want to remove Price List ?`}
                Actions={
                  <DialogActions>
                    <Button
                      variant="contained"
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
            ? "Price Book Categories added successfully"
            : params.mode === "delete"
              ? "Price Book Categories Releived Successfully"
              : "Price Book Categories updated successfully"
        }
        Actions={
          params.mode === "add" ? (
            <DialogActions>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  navigate("/pages/control-panel/print-group");
                }}
              >
                Back to Price Book Categories
              </Button>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  dispatch(getprintGroupData({ id: 0 }));
                  dispatch(clearPrintGroupState());
                  setOpenAlert(false);
                }}
                autoFocus
              >
                Add New Price Book Categories
              </Button>
            </DialogActions>
          ) : (
            <DialogActions>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => navigate("/pages/control-panel/print-group")}
              >
                Back to Price Book Categories
              </Button>
            </DialogActions>
          )
        }
      />

      <MessageAlertDialog
        open={isPriceListExists}
        tittle={
          addPriceListData
            ? addPriceListData.PRICELISTDESCRIPTION
            : "Please select price list!"
        }
        message={"Oops! This price list is already exists in print group."}
        Actions={
          <DialogActions>
            <Button
              variant="contained"
              color="info"
              size="small"
              onClick={() => {
                setIsPriceListExists(false);
                setAddPriceListData(null);
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

export default PrintGroupEdit;
