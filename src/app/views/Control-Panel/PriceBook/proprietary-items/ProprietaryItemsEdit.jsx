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
  // Tooltip,
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
  getProprietaryItemsData,
  getRunGroupData,
  getRunGroupData2,
  proprietaryItemAddedItem,
  proprietaryItemDeletedItem,
  runGroupAddedItem,
  runGroupDeletedItem,
} from "app/redux/slice/getSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  CustomerAddPrintGroup,
  deletePriceBookGroup,
  proprietaryItemsDelete,
  proprietaryItemsPost,
  runGroupDelete,
  runGroupPost,
} from "app/redux/slice/postSlice";
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
import {
  FormikProprietaryBrandOptimizedAutocomplete,
  FormikProprietaryItemsOptimizedAutocomplete,
  FormikSalesPersonOptimizedAutocomplete,
} from "app/components/SingleAutocompletelist";

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
const ProprietaryItemsEdit = () => {
  // ********************** HOOKS AND CONSTANTS ********************** //
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  const dispatch = useDispatch();
  const { user } = useAuth();

  // ********************** LOCAL STATE ********************** //
  const [openAlert, setOpenAlert] = useState(false);
  const [postError, setPostError] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const [isRunGroupOpen, SetIsRunGroupOpen] = useState(false);
  const [RunGroupID, setRunGroupID] = useState(0);
  const [isDelete, setIsDelete] = useState(false);
  const [isCustomerListExists, setIsCustomerListExists] = useState(false);
  const [isCustomerListExistsError, setIsCustomerListExistsError] =
    useState(false);
  const [isRemoveCustomer, setIsRemoveCustomer] = useState(false);
  const [removeCustomerID, setremoveCustomerID] = useState(0);
  const [removeCustomerdDesc, setremoveCustomerDesc] = useState("");
  const [slectedSalesName, setselectedSalesName] = useState(null);

  const [addCustomerListData, setAddCustomerListData] = useState([]);
  const handleSelectionAddCustomerListData = (e, newValue) => {
    setAddCustomerListData(newValue);
  };

  const handleAddCustomers = async (values) => {
    if (addCustomerListData.length > 0) {
      dispatch(proprietaryItemAddedItem(addCustomerListData));
      // const response = await dispatch(
      //   CustomerAddPrintGroup({
      //     data: addCustomerListData,
      //     PriceBookGroup: data.Code,
      //   })
      // );
      // if (response.payload.status === "Y") {
      //   dispatch(getRunGroupData2({ id: state.ID }));
      // }
      setAddCustomerListData([]);
    } else {
      setIsCustomerListExistsError(true);
      setTimeout(() => {
        setIsCustomerListExistsError(false);
      }, 2000);
    }
  };

  // ********************** REDUX STATE ********************** //
  const getRows = useSelector((state) => state.getSlice.proprietaryItemGetData);
  const data = useSelector((state) => state.getSlice.proprietaryItemFormData);
  const loading = useSelector((state) => state.getSlice.proprietaryItemLoading);
  const status = useSelector((state) => state.getSlice.proprietaryItemStatus);
  const error = useSelector((state) => state.getSlice.proprietaryItemError);

  useEffect(() => {
    dispatch(getProprietaryItemsData({ ItemNumber: state.ID }));
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
          <>
          {/* // <Tooltip title="Remove Customer"> */}
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
          {/* </Tooltip> */}
          </>
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

  const proprietaryItemSaveFn = async (values, setSubmitting) => {
    let itemNumber = data.ItemNumber;
    if (params.mode == "add") {
      itemNumber = values.item ? values.item.ItemNumber : "";
    }
    const postData = {
      ItemNumber: itemNumber,
      Type: data.Type,
      CustomerLists: getRows,
    };
    try {
      const response = await dispatch(proprietaryItemsPost({ data: postData }));

      if (response.payload.status === "Y") {
        setOpenAlert(true);
        setSuccessMessage(response.payload.message);
        if (params.mode === "add") {
          navigate(
            "/pages/control-panel/proprietary-items/proprietary-item-detail/edit",
            {
              state: { ID: itemNumber },
            }
          );
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

  const proprietaryItemDeleteFn = async (values, setSubmitting) => {
    try {
      dispatch(proprietaryItemsDelete({ id: data.ItemNumber })).then(
        (response) => {
          if (response.payload.status === "Y") {
            setOpenAlert(true);
            setSuccessMessage(response.payload.message);
          } else {
            setOpenAlert(true);
            setPostError(response.payload.message);
          }
        }
      );
      setSubmitting(false);
    } catch (e) {
      console.log("🚀 ~ priceListSaveFn ~ e:", e);
    }
  };

  const runGroupCusDeleteFn = async () => {
    try {
      dispatch(
        proprietaryItemDeletedItem({
          Recordid: removeCustomerID,
          id: removeCustomerdDesc,
        })
      );
      setIsRemoveCustomer(false);
      setremoveCustomerID(0);
      setremoveCustomerDesc("");
      // .then((response) => {
      //   if (response.payload.status === "Y") {
      //     dispatch(getRunGroupData2({ id: state.ID }));
      //     setIsRemoveCustomer(false);
      //     setremoveCustomerID(0);
      //     setremoveCustomerDesc("");
      //   } else {
      //     setIsRemoveCustomer(false);
      //     setremoveCustomerID(0);
      //     setremoveCustomerDesc("");
      //     setOpenAlert(true);
      //     setPostError(response.payload.message);
      //   }
      // });
    } catch (e) {
      console.log("🚀 ~ priceListSaveFn ~ e:", e);
    }
  };

  return (
    <Container>
      {status === "fulfilled" && !error ? (
        <Formik
          initialValues={{
            item: params.mode === "add" ? null : data.ItemNumber,
          }}
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              if (params.mode === "delete") {
                setIsDelete(true);
              }
              if (params.mode === "add" || params.mode === "edit") {
                proprietaryItemSaveFn(values, setSubmitting);
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
                      name: "Proprietary Items",
                      path: "/pages/control-panel/proprietary-items",
                    },
                    { name: `${params.mode} Proprietary Item` },
                  ]}
                />
                <Stack direction={"row"} gap={1}>
                  <Button
                    disabled={isSubmitting}
                    // disabled={true}
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
                    onClick={() =>
                      navigate("/pages/control-panel/proprietary-items")
                    }
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
                  {params.mode === "add" ? (
                    <FormikProprietaryBrandOptimizedAutocomplete
                      required={true}
                      sx={{ gridColumn: "span 2" }}
                      disabled={
                        params.mode === "delete" || params.mode === "view"
                          ? true
                          : false
                      }
                      name="item"
                      id="item"
                      value={values.item}
                      onChange={(event, newValue) => {
                        setFieldValue("item", newValue);
                      }}
                      label="Items"
                      url={`${process.env.REACT_APP_BASE_URL}ProprietaryItems/GetProprietaryItemsCombo`}
                    />
                  ) : (
                    <TextField
                      sx={{ gridColumn: "span 2" }}
                      variant="outlined"
                      label="Item Number"
                      type="text"
                      name="item"
                      id="item"
                      size="small"
                      value={values.item}
                      disabled={true}
                    />
                  )}
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
                      url={`${process.env.REACT_APP_BASE_URL}ProprietaryItems/ProprietaryCustomers?CompanyID=${user.companyID}`}
                      addedCustomers={getRows} // Pass added customers to exclude them
                    />
                    {/* <Tooltip title="Add Customers"> */}
                      <IconButton
                        disabled={
                          params.mode === "delete" ||
                          params.mode === "view" 
                            ? true
                            : false
                        }
                        // disabled={ true

                        // }
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
                    {/* </Tooltip> */}
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
                      '& .MuiDataGrid-row:hover': {
                        border: '3px solid #999999',
                        // border: `1px solid #${theme.palette.action.selected} !important`, // Change border color on hover
                        borderRadius: '4px', // Optional: Add rounded corners
                      },
                      // "& .MuiDataGrid-row.Mui-selected:hover": {
                      //   backgroundColor: `${theme.palette.action.selected} !important`,
                      // },
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
                message={`Are you sure you want to delete Proprietary Item?`}
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
                        proprietaryItemDeleteFn();
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
                        setTimeout(() => {
                          setSuccessMessage(null);
                          setPostError(null);
                        }, 2000);
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
                setTimeout(() => {
                  setSuccessMessage(null);
                  setPostError(null);
                }, 2000);
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

export default ProprietaryItemsEdit;
