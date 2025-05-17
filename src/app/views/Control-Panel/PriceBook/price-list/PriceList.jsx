import React, { useEffect, useState } from "react";
import {
  LinearProgress,
  Paper,
  Button,
  Box,
  styled,
  useTheme,
  TableContainer,
  Stack,
  Tooltip,
  IconButton,
  useMediaQuery,
  TextField,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Breadcrumb } from "app/components";
import {
  dataGridHeight,
  dataGridPageSize,
  dataGridpageSizeOptions,
  dataGridRowHeight,
  dataGridHeaderFooterHeight,
} from "app/utils/constant";

// ********************** ICONS ********************** //
import DeleteIcon from "@mui/icons-material/Delete";
import { Add, RefreshOutlined } from "@mui/icons-material";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getPriceListView,
  getPrintGroupListView,
} from "app/redux/slice/listviewSlice";
import { useDispatch, useSelector } from "react-redux";
import SaveIcon from "@mui/icons-material/Save";
import {
  clearPriceListState,
  clearPrintGroupState,
  printGroupSelectedItems,
  clearCustomerListState,
  customerListSelectedItems,
} from "app/redux/slice/getSlice";
import toast from "react-hot-toast";
import {
  CustomerPriceListOptimizedAutocomplete,
  FormikCustomSelectCompany,
  FormikCustomSelectCompanyPriceList,
  PriceListOptimizedAutocomplete,
  PrintGroupOptimizedAutocomplete,
} from "app/components/SingleAutocompletelist";
import useAuth from "app/hooks/useAuth";
import { Formik } from "formik";
import { UpdateSeqPriceList } from "app/redux/slice/postSlice";

// ********************** STYLED COMPONENTS ********************** //
const Container = styled("div")(({ theme }) => ({
  margin: "15px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "10px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

// ********************** ITEMS SCREEN LISTVIEW ********************** //
const PriceList = () => {
  // ********************** HOOKS AND CONSTANTS ********************** //
  const theme = useTheme();
  const naviate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const state = location.state;
  const { user } = useAuth();
  const isNonMobile = useMediaQuery("(min-width:900px)");
  const [isSide, setIsSide] = useState(false);
  const [priceBookCateData, setPriceBookCateData] = useState({});

  // ********************** LOCAL STATE ********************** //

  const [printSelectedData, setPrintSelectedData] = useState(null);

  const handlePrintSelectedData = (newValue) => {
    setPrintSelectedData(newValue);
  };

  const [customerSelectData, setCustomerSelectData] = useState(null);

  const handleCustomerSelectData = (newValue) => {
    setCustomerSelectData(newValue);
  };
  const [rowSelectionID, setRowSelectionID] = React.useState("")
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const [rowSelectionModelRows, setRowSelectionModelRows] = React.useState([]);
  // ********************** REDUX STATE ********************** //

  const loading = useSelector((state) => state.listview.priceListloading);
  const priceRows = useSelector((state) => state.listview.priceListViewData);
  // ********************** COLUMN AND ROWS ********************** //
  const columns = [
    {
      headerName: "Price List",
      field: "PRICELISTDESCRIPTION",
      minWidth: 250,
      flex: 1,
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Category",
      field: "Categories",
      minWidth: 250,
      flex: 1,
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Print Sequence",
      field: "PrintSequence",
      width: 150,
      align: "left",
      headerAlign: "left",
      hide: true,
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
      minWidth: 300,
      flex: 1,
      sortable: false,
      headerAlign: "center",
      filterable: false,
      disableColumnMenu: true,
      disableExport: true,
      align: "center",
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", gap: "10px" }}>
            <Tooltip title="Edit">
              <IconButton
                onClick={() => {
                  naviate(
                    "/pages/control-panel/price-list/price-list-detail/edit",
                    {
                      state: {
                        id: params.row.RecordID,
                        companyCode: companyID,
                        companyRecordID:companyRecordID
                      },
                    }
                  );
                }}
                style={{ color: "secondary" }}
                sx={{ height: 30, width: 30 }}
              >
                <ModeEditOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                onClick={() => {
                  naviate(
                    "/pages/control-panel/price-list/price-list-detail/delete",
                    {
                      state: {
                        id: params.row.RecordID,
                        companyCode: companyID,
                        companyRecordID:companyRecordID
                      },
                    }
                  );
                }}
                style={{ color: "secondary" }}
                sx={{ height: 30, width: 30 }}
              >
                <DeleteIcon fontSize="small" color="error" />
              </IconButton>
            </Tooltip>

            <Tooltip title="View Items">
              <IconButton
                onClick={() => {
                  naviate(
                    "/pages/control-panel/price-list/price-list-detail/view",
                    {
                      state: {
                        id: params.row.RecordID,
                        companyCode: companyID,
                        companyRecordID:companyRecordID
                      },
                    }
                  );
                }}
                style={{ color: "secondary" }}
                sx={{ height: 30, width: 30 }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  // ********************** TOOLBAR ********************** //

  const [companyID, setCompanyID] = useState(user.companyCode);
    const [companyRecordID, setCompanyRecordID] = useState(user.companyID);
  useEffect(() => {
    dispatch(getPriceListView({ ID: companyRecordID }));
    dispatch(clearPriceListState());
    // dispatch(getPrintGroupListView());
    // dispatch(clearPrintGroupState());
    // dispatch(clearCustomerListState());
  }, []);

  const CustomToolbar = React.memo(() => {
    return (
      <GridToolbarContainer
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          padding: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            paddingX: 2,
            width: "100%",
          }}
        >
          <FormikCustomSelectCompanyPriceList
            name="company"
            id="company"
            multiple={false}
            value={companyRecordID}
            onChange={(e) => {
              setCompanyID(e.target.value);
              setCompanyRecordID(e.target.value);
              dispatch(getPriceListView({ ID: e.target.value }));
            }}
            label="Company"
            url={`${process.env.REACT_APP_BASE_URL}CompanyModule/CompanyListView`}
          />
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <GridToolbarQuickFilter />
            <Tooltip title="Create Price List">
              <IconButton
                color="info"
                onClick={() => {
                  naviate(
                    "/pages/control-panel/price-list/price-list-detail/add",
                    {
                      state: { id: 0, companyCode: companyID,companyRecordID:companyRecordID },
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
        </Box>
      </GridToolbarContainer>
    );
  });

  const [openAlert, setOpenAlert] = useState(false);
  const [postError, setPostError] = useState(false);

  const PriceListSaveFn = async (values, setSubmitting) => {
    const postData = {
      RecordID:rowSelectionID,
      PriceListID: values.PriceListID,
      PrintSequence: values.PrintSequence,
      priceListDescription:values.priceListDescription,
    };
    console.log("🚀 ~ PriceListSaveFn ~ postData:", postData)
        try {
      const response = await dispatch(UpdateSeqPriceList({ data: postData }));

      if (response.payload.status === "Y") {
        setOpenAlert(true);
        dispatch(getPriceListView({ ID: companyRecordID }));
        setIsSide(false);
      } else {
        setOpenAlert(true);
        setPostError(true);
        setIsSide(false);
      }
    } catch (error) {
      console.error("Error during HandleSave:", error);
    }
    setSubmitting(false);
  };

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            {
              name: "Control Panel",
            },
            { name: "Price List" },
          ]}
        />
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
          <Box
            sx={{
              gridColumn: isSide ? "span 3" : "span 4",
              height: dataGridHeight,
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
              rows={priceRows}
              columns={columns}
              loading={loading}
              // checkboxSelection
              onRowClick={(params) => {
                setPriceBookCateData(params.row);
                setRowSelectionID(params.row.RecordID)
                setIsSide(true);
              }}
              // disableSelectionOnClick
              // disableRowSelectionOnClick
              getRowId={(row) => row.RecordID}
              initialState={{
                pagination: { paginationModel: { pageSize: dataGridPageSize } },
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
              // onRowSelectionModelChange={(newRowSelectionModel) => {
              //   const filterArray = priceRows.filter((v) =>
              //     newRowSelectionModel.includes(v.PRICELISTID)
              //   );
              //   setRowSelectionModel(newRowSelectionModel);
              //   setRowSelectionModelRows(filterArray);
              // }}
              // rowSelectionModel={rowSelectionModel}
            />
          </Box>
          {isSide && (
            <Box sx={{ gridColumn: "span 1", marginTop: 8 }}>
              <Formik
                initialValues={{
                  PriceListID: priceBookCateData.PRICELISTID,
                  PrintSequence: priceBookCateData.PrintSequence,
                  priceListDescription: priceBookCateData.PRICELISTDESCRIPTION,
                }}
                enableReinitialize={true}
                onSubmit={(values, { setSubmitting }) => {
                  PriceListSaveFn(values, setSubmitting);
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
                    <Stack direction="column" gap={2}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="text"
                        id="priceListDescription"
                        name="priceListDescription"
                        label="Price List"
                        size="small"
                        onChange={handleChange}
                        value={values.priceListDescription}
                        required
                        autoComplete="off"
                        InputLabelProps={{
                          sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                        }}
                        disabled={true}
                        // error={!!touched.groupCode && !!errors.groupCode}
                        // helperText={touched.groupCode && errors.groupCode}
                      />

                      <TextField
                        fullWidth
                        variant="outlined"
                        type="text"
                        id="PrintSequence"
                        name="PrintSequence"
                        label="Sequence"
                        size="small"
                        onChange={handleChange}
                        value={values.PrintSequence}
                      />

                      <Stack direction={"row"} gap={1}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="info"
                          size="small"
                          disabled={isSubmitting}
                          startIcon={<SaveIcon size="small" />}
                        >
                          Save
                        </Button>
                        <Button
                          variant="contained"
                          color="info"
                          size="small"
                          // startIcon={<ArrowBackIcon size="small" />}
                          onClick={() => {
                            setIsSide(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </Stack>
                    </Stack>
                  </form>
                )}
              </Formik>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default PriceList;
