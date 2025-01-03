import React, { useEffect, useState } from "react";
import {
  LinearProgress,
  Paper,
  Button,
  Box,
  styled,
  useTheme,
  useMediaQuery,
  Stack,
  FormControlLabel,
  Checkbox,
  DialogActions,
} from "@mui/material";
import { Breadcrumb } from "app/components";
import { dataGridRowHeight } from "app/utils/constant";
import {
  DataGrid,
  GridToolbar,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Formik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// ********************** ICONS ********************** //
import { Add } from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import useAuth from "app/hooks/useAuth";

import {
  customerListAddedItem,
  customerListDeletedItem,
  getCustomerPriceData,
} from "app/redux/slice/getSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  FormikCustomerPriceOptimizedAutocomplete,
  FormikOptimizedAutocomplete,
  PGOptimizedAutocomplete,
} from "app/components/SingleAutocompletelist";
import { customerPriceListPost, deleteCustomerData } from "app/redux/slice/postSlice";
import AlertDialog, { MessageAlertDialog } from "app/components/AlertDialog";
import lodash from "lodash";

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

// ********************** CUSTOMER PRICE LISTS SCREEN  ********************** //
const CustomerPriceListsEdit = () => {
  // ********************** HOOKS AND CONSTANTS ********************** //
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const dispatch = useDispatch();
  const state = location.state;

  const data = useSelector((state) => state.getSlice.customerListFormData);
  const addedRows = useSelector(
    (state) => state.getSlice.customerListAddedData
  );
  const getRows = useSelector((state) => state.getSlice.customerListGetData);
  const loading = useSelector((state) => state.getSlice.customerListLoading);
  const status = useSelector((state) => state.getSlice.customerListStatus);
  const error = useSelector((state) => state.getSlice.customerListError);

  const getRowsSet = new Set(getRows.map((item) => item.RecordID));
  const filteredSelectedItems = addedRows.filter(
    (selectedItem) => !getRowsSet.has(selectedItem.RecordID)
  );

  // ********************** LOCAL STATE ********************** //
  const [openAlert, setOpenAlert] = useState(false);
  const [postError, setPostError] = useState(false);
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

  useEffect(() => {
    dispatch(getCustomerPriceData({ id: state.id }));
  }, []);
  // ********************** COLUMN ********************** //
  const columns = [
    {
      headerName: "PriceList Name",
      field: "PRICELISTID",
      width: "170",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "PriceList Description",
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
                    lodash.isEqual(
                      item.PRICELISTID,
                      addPriceListData.PRICELISTID
                    )
                );
                if (isItem) {
                  setIsPriceListExists(true);
                  setTimeout(() => {
                    setIsPriceListExists(false);
                    setAddPriceListData(null);
                  }, 5000);
                  return;
                }
                dispatch(customerListAddedItem(addPriceListData));
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

  const customerPriceSaveFn = async (values, setSubmitting) => {
    const postData = {
      recordId: data.RecordId,
      customer: values.customer.CustomerNumber,
      customerName: values.customer.CustomerName,
      location: "0",
      contact: "0",
      createdDateTime: data.CreatedDateTime,
      lastModifiedDateTime: data.LastModifiedDateTime,
      createdby: values.CreatedBy,
      lastModifiedby: user.name,
      fullPriceBook: values.FullPriceBook ? "Y" : "N",
      customPriceBook: values.CustomPriceBook ? "Y" : "N",
      pdf: values.pdf ? "Y" : "N",
      excel: values.excel ? "Y" : "N",
      priceList: [...getRows, ...filteredSelectedItems],
    };

    try {
      const response = await dispatch(
        customerPriceListPost({ Cdata: postData })
      );
      if (response.payload.status === "Y") {
        setOpenAlert(true);
      } else {
        setOpenAlert(true);
        setPostError(true);
        toast.error("Error occurred while saving data");
      }
    } catch (error) {
      console.error("Error during saving data:", error);
    }
    setSubmitting(false);
  };

  const customerPriceDeleteFn = async (values, setSubmitting) => {
    try {
      dispatch(deleteCustomerData({ ID: data.RecordId })).then((response) => {
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

  return (
    <Container>
      {status === "fulfilled" && !error ? (
        <Formik
          initialValues={{
            recordID: data.RecordId,
            customer:
              {
                CustomerNumber: data.Customer,
                CustomerName: data.CustomerName,
              } || null,
            customerName: data.CustomerName || "",
            addressCode: data.Location || "",
            contact: data.Contact || "",
            FullPriceBook: data.FullPriceBook === "Y" ? true : false,
            pdf: data.Pdf === "Y" ? true : false,
            excel: data.Excel === "Y" ? true : false,
            CreatedDateTime: data.CreatedDateTime || "",
            LastmodifiedDatetime: data.LastModifiedDateTime || "",
            CreatedBy: params.mode === "add" ? user.name : data.Createdby,
            CustomPriceBook: data.CustomPriceBook === "Y" ? true : false,
          }}
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              if (params.mode === "delete") {
                setIsDelete(true);
              }
              if (params.mode === "add" || params.mode === "edit") {
                customerPriceSaveFn(values, setSubmitting);
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
            setFieldValue,
            setSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="breadcrumb">
                <Breadcrumb
                  routeSegments={[
                    { name: "Price Book" },
                    {
                      name: "Customer Price Lists",
                      path: "/pages/control-panel/customer-price-lists",
                    },
                    {
                      name: `${params.mode} Customer Price Lists`,
                    },
                  ]}
                />
                <Stack direction={"row"} gap={1}>
                  {params.mode === "view" ? (
                    false
                  ) : (
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
                    >
                      {params.mode === "delete" ? "Confirm" : "Save"}
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    disabled={true}
                  >
                    PDF Preview
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
                    sx={{ gridColumn: "span 4" }}
                    direction="column"
                    gap={1}
                  >
                    <FormikCustomerPriceOptimizedAutocomplete
                      sx={{ maxWidth: 450 }}
                      name="customer"
                      id="customer"
                      value={values.customer}
                      onChange={(event, newValue) => {
                        if (newValue === null) {
                          return;
                        }
                        dispatch(
                          getCustomerPriceData({ id: newValue.CustomerNumber })
                        );
                        setFieldValue("customer", newValue);
                      }}
                      label="Customer"
                      url={`${process.env.REACT_APP_BASE_URL}CustomerPriceList/CustomerPriceList`}
                      disabled={
                        params.mode === "delete" || params.mode === "view"
                      }
                    />
                  </Stack>
                  <Stack
                    sx={{ gridColumn: "span 1" }}
                    direction="column"
                    gap={1}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          id="FullPriceBook"
                          name="FullPriceBook"
                          sx={{ height: "10px" }}
                          checked={values.FullPriceBook}
                          onChange={handleChange}
                          disabled={
                            params.mode === "delete" || params.mode === "view"
                          }
                        />
                      }
                      label="Full Price Book"
                    />
                    <Stack
                    // sx={{ gridColumn: "span 1" }}
                    direction="row"
                    gap={1}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.pdf}
                          onChange={handleChange}
                          sx={{ height: "10px" }}
                          disabled={
                            params.mode === "delete" || params.mode === "view"
                          }
                          size="small"
                          id="pdf"
                          name="pdf"
                        />
                      }
                      label="PDF"
                    />
                    
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          id="excel"
                          name="excel"
                          checked={values.excel}
                          onChange={handleChange}
                          sx={{ height: "10px" }}
                          disabled={
                            params.mode === "delete" || params.mode === "view"
                          }
                        />
                      }
                      label="EXCEL"
                    />
                    </Stack>
                  </Stack>

                  <Stack
                    sx={{ gridColumn: "span 1" }}
                    direction="column"
                    gap={1}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          id="CustomPriceBook"
                          name="CustomPriceBook"
                          checked={values.CustomPriceBook}
                          onChange={handleChange}
                          sx={{ height: "10px" }}
                          disabled={
                            params.mode === "delete" || params.mode === "view"
                          }
                        />
                      }
                      label="Custom Price Book"
                    />

<Stack
                    // sx={{ gridColumn: "span 1" }}
                    direction="row"
                    gap={1}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          // checked={values.pdf}
                          // onChange={handleChange}
                          sx={{ height: "10px" }}
                          disabled={
                            params.mode === "delete" || params.mode === "view"
                          }
                          size="small"
                          // id="pdf"
                          // name="pdf"
                        />
                      }
                      label="PDF"
                    />
                    
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          // id="excel"
                          // name="excel"
                          // checked={values.excel}
                          // onChange={handleChange}
                          sx={{ height: "10px" }}
                          disabled={
                            params.mode === "delete" || params.mode === "view"
                          }
                        />
                      }
                      label="EXCEL"
                    />
                    </Stack>
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
                      borderBottom: "none", // Change border-bottom color to black
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
                    // Alternating row colors
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
                    // loading={CSLoading}
                    columns={columns}
                    disableSelectionOnClick
                    disableRowSelectionOnClick
                    getRowId={(row) => row.RecordID}
                    initialState={{
                      pagination: { paginationModel: { pageSize: 20 } },
                    }}
                    pageSizeOptions={[5, 10, 20, 25]}
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
                open={isDelete}
                tittle={values.customerName}
                message={`Are you sure you want to delete customer price list?`}
                Actions={
                  <DialogActions>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => {
                        setIsDelete(false);
                        customerPriceDeleteFn();
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
                          customerListDeletedItem({
                            id: removePriceListID,
                            customerListAddedData: filteredSelectedItems,
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

              <MessageAlertDialog
                open={isPriceListExists}
                tittle={
                  addPriceListData
                    ? addPriceListData.PRICELISTDESCRIPTION
                    : "Please select price list!"
                }
                message={
                  "Oops! This price list is already exists in customer price list."
                }
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
            ? "Customer Price List added successfully"
            : params.mode === "delete"
              ? "Customer Price List Deleted Successfully"
              : "Customer Price List updated successfully"
        }
        Actions={
          params.mode === "add" ? (
            <DialogActions>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => navigate("/pages/control-panel/customer-price-lists")}
              >
                Continue
              </Button>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  dispatch(getCustomerPriceData({ id: 0 }));
                  setOpenAlert(false);
                }}
                autoFocus
              >
                Add New Print Group
              </Button>
            </DialogActions>
          ) : (
            <DialogActions>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => navigate("/pages/control-panel/customer-price-lists")}
              >
                Back to Customer price list
              </Button>
            </DialogActions>
          )
        }
      />
    </Container>
  );
};

export default CustomerPriceListsEdit;
