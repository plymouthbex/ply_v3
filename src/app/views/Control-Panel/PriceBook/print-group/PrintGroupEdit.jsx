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
import {
  FormikCustomSelectCompanyPriceList,
  PGOptimizedAutocomplete,
  PriceListOptimizedAutocomplete,
} from "app/components/SingleAutocompletelist";

// ********************** ICONS ********************** //
import { Add } from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  deleteCategoriesData,
  deletePrintGroupData,
  postPrintGroupData,
} from "app/redux/slice/postSlice";
import toast from "react-hot-toast";
import { CompanyPriceListAutoComplete } from "app/components/FormikAutocomplete";

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
  const state = location.state || {};

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
  const [ID, setId] = useState({});
  const [addPriceListData, setAddPriceListData] = useState([]);
  const handleSelectionAddPriceListData = (e, newValue) => {
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
//   const getRowsSet = new Set(getRows.map((item) => item.RecordID));


//   // console.log(getRowsSet,'================getrowsset')
// let filteredSelectedItems = addedRows.filter(
//   (selectedItem) => !getRowsSet.has(selectedItem.RecordID)
// );
// let filter=getRows.filter((selectedItem)=>selectedItem.RecordID);
// console.log("🚀 ~ PrintGroupEdit ~ filter:", filter)
// If removePriceListID is not in getRowsSet, insert it

  console.log("🚀 ~ filteredSelectedItems:", filteredSelectedItems)


  // ********************** COLUMN ********************** //
  const columns = [
    {
      headerName: "Price List",
      field: "PRICELISTDESCRIPTION",
      width: "300",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Item Count",
      field: "PriceListItemCount",
      width: 150, 
      align: "right",
      headerAlign: "center",
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
            width: "70%",
          }}
        >
          <GridToolbarQuickFilter />
          
        </Box>
      </GridToolbarContainer>
    );
  }

  useEffect(() => {
    // if (status === "idle") {
    dispatch(getprintGroupData({ id: state.id }));
    // }
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
      RecordId: data.RecordId,
      Groupcode: values.groupCode,
      GroupName: values.groupName,
      Sortorder: values.SortOrder,
      Disable: "N",
      Headeronly: false,
      CompanyCode: state.companyID.toString(),
      CreatedUser:user.name,
      ModifyUser:user.name,
      CompanyID:state.companyRecordID,
      PrintList: [...getRows, ...filteredSelectedItems],
    };
    try {
      const response = await dispatch(postPrintGroupData({ PGdata: postData }));

      if (response.payload.status === "Y") {
        if (params.mode === "add") {
          navigate("/pages/control-panel/print-group/print-group-detail/edit", {
            state: { id: response.payload.RecordId ,companyID:state.companyID,companyRecordID:state.companyRecordID },
          });
          // dispatch(getprintGroupData({id:response.payload.RecordId}))
        }
        setOpenAlert(true);
        setSuccessMessage(response.payload.message);
      } else {
        setOpenAlert(true);
        setPostError(response.payload.message);
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
                  {state.YearFlag ? (
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      startIcon={<ArrowBackIcon size="small" />}
                      onClick={() => {
                        navigate("/pages/control-panel/price-list");
                      }}
                    >
                      Back
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      startIcon={<ArrowBackIcon size="small" />}
                      onClick={() => {
                        navigate("/pages/control-panel/print-group");
                      }}
                    >
                      Back
                    </Button>
                  )}
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
  {/* Left Column */}
  <Stack
    sx={{
      gridColumn: isNonMobile ? "span 2" : "span 4", // Responsive
    }}
    direction="column"
    gap={1}
  >
    <TextField
      fullWidth
      variant="outlined"
      type="text"
      id="groupName"
      name="groupName"
      label="Category"
      size="small"
      onChange={handleChange}
      value={values.groupName}
      disabled={params?.mode === "delete"}
      required
      InputLabelProps={{
        sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
      }}
      autoComplete="off"
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

  {/* Right Column */}
  <Stack
  sx={{
    gridColumn: isNonMobile ? "span 2" : "span 4", // responsive behavior
  }}
  direction="column"
  gap={1}
>
  {/* Row with autocomplete and add button */}
  <Box display="flex" alignItems="center" gap={1}>
    <CompanyPriceListAutoComplete
      key={JSON.stringify([...getRows, ...filteredSelectedItems])}
      errors={isPriceListExistsError}
      helper={isPriceListExistsError && "Please select price list!"}
      disabled={params.mode === "delete" || params.mode === "view"}
      name="addPriceList"
      id="addPriceList"
      value={addPriceListData}
      onChange={handleSelectionAddPriceListData}
      label="Include Price List"
      url={`${process.env.REACT_APP_BASE_URL}PriceList/GetCategoryPriceList?CompanyID=${state.companyRecordID}`}
      filterData={[...getRows, ...filteredSelectedItems]}
      sx={{ flex: 1 }} // allows autocomplete to take up remaining space
    />
    <Tooltip title="Add">
      <IconButton
        color="black"
        sx={{ height: 40 }}
        size="medium"
        disabled={params.mode === "delete" || params.mode === "view"}
        onClick={() => {
          if (addPriceListData.length > 0) {
            console.log(
              "🚀 ~ CustomToolbar ~ addPriceListData:",
              addPriceListData
            );
            // return
            const isItem = [
              ...getRows,
              ...filteredSelectedItems,
            ].some((item) =>
              lodash.isEqual(
                item.RecordID,
                addPriceListData.RecordID
              )
            );
            if (isItem) {
              setIsPriceListExists(true);
              setTimeout(() => {
                setIsPriceListExists(false);
                setAddPriceListData([]);
              }, 5000);
              return;
            }
            dispatch(printGroupAddedItem(addPriceListData));
            setAddPriceListData([]);
          } else {
            setIsPriceListExistsError(true);
            setTimeout(() => {
              setIsPriceListExistsError(false);
            }, 2000);
          }
        }}
      >
        <Add
          sx={{
            fontSize: 30,
            color: theme.palette.success.main,
          }}
        />
      </IconButton>
    </Tooltip>
  </Box>
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
                  {/* <Stack direction={"row"} gap={1} justifyContent={"flex-end"}>
                    <CompanyPriceListAutoComplete
                      key={JSON.stringify([...getRows, ...filteredSelectedItems])}
                      errors={isPriceListExistsError}
                      helper={
                        isPriceListExistsError && "Please select price list!"
                      }
                      disabled={
                        params.mode === "delete" || params.mode === "view"
                      }
                      name="addPriceList"
                      id="addPriceList"
                      value={addPriceListData}
                      onChange={handleSelectionAddPriceListData}
                      label="Include Price List"
                      url={`${process.env.REACT_APP_BASE_URL}PriceList/GetCategoryPriceList?CompanyID=${state.companyRecordID}`}
                      filterData={[...getRows, ...filteredSelectedItems]}
                    />
                    <Tooltip title="Add">
                      <IconButton
                        color="black"
                        sx={{ height: 25 }}
                        size="small"
                        disabled={
                          params.mode === "delete" || params.mode === "view"
                        }
                        onClick={() => {
                          if (addPriceListData.length > 0) {
                            console.log(
                              "🚀 ~ CustomToolbar ~ addPriceListData:",
                              addPriceListData
                            );
                            // return
                            const isItem = [
                              ...getRows,
                              ...filteredSelectedItems,
                            ].some((item) =>
                              lodash.isEqual(
                                item.RecordID,
                                addPriceListData.RecordID
                              )
                            );
                            if (isItem) {
                              setIsPriceListExists(true);
                              setTimeout(() => {
                                setIsPriceListExists(false);
                                setAddPriceListData([]);
                              }, 5000);
                              return;
                            }
                            dispatch(printGroupAddedItem(addPriceListData));
                            setAddPriceListData([]);
                          } else {
                            setIsPriceListExistsError(true);
                            setTimeout(() => {
                              setIsPriceListExistsError(false);
                            }, 2000);
                          }
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
                  </Stack> */}
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
                    getRowId={(row) => row.RecordID}
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
                      onClick={async () => {
                        try {
                          dispatch(
                            printGroupDeletedItem({
                              id: removePriceListID,
                              printGroupAddedData: filteredSelectedItems,
                            })
                          );
                          const response = await dispatch(
                            deleteCategoriesData({ id: removePriceListID })
                          );
                      
                          if (response.payload?.status === "Y") {
                            dispatch(getprintGroupData({ id: state.id }));
                          }
                      
                          const removedItem = getRows.find(item => item.RecordID === removePriceListID);
                          console.log(removedItem, "====removedItem");
                          setId(removedItem);
                          setIsRemovePriceList(false);
                          setremovePriceListID(0);
                          setremovePriceListDesc("");
                        } catch (error) {
                          console.error("Error deleting category data:", error);
                        }
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
        message={postError ? postError : successMessage}
        Actions={
          params.mode != "delete" ? (
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
                setOpenAlert(false);
              }}
            >
              Close
            </Button>
            {state.YearFlag ? (
              <Button
                sx={{ mr: 1, height: 25 }}
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  navigate("/pages/control-panel/price-list");
                  setSuccessMessage(null);
                  setPostError(null);
                }}
              >
                Back to Categories
              </Button>
            ) : (
              <Button
                sx={{ mr: 1, height: 25 }}
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  navigate("/pages/control-panel/print-group");
                  setSuccessMessage(null);
                  setPostError(null);
                }}
              >
                Back to Categories
              </Button>
            )}
          </Box>
          ) : (
            <Box
            sx={{
              display: "flex",
              justifyContent: "center",
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
                  setSuccessMessage(null);
                  setPostError(null);
                }}
              >
                OK
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
