import React, { useEffect } from "react";
import {
  LinearProgress,
  Paper,
  Button,
  Box,
  styled,
  useTheme,
  Tooltip,
  IconButton,
  useMediaQuery,
  TextField,
  Stack,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
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
import { Add } from "@mui/icons-material";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPrintGroupListView } from "app/redux/slice/listviewSlice";
import {
  clearPrintGroupState,
  clearPrintListState,
} from "app/redux/slice/getSlice";
import { Formik } from "formik";
import { useState } from "react";
import { postPrintGroupData, runGroupPost } from "app/redux/slice/postSlice";

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
const PrintGroup = () => {
  // ********************** HOOKS AND CONSTANTS ********************** //
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // ********************** LOCAL STATE ********************** //
  const isNonMobile = useMediaQuery("(min-width:900px)");
  const [isSide, setIsSide] = useState(false);
  // ********************** REDUX STATE ********************** //
  const loading = useSelector((state) => state.listview.printGroupTemploading);
  const printGroupRows = useSelector(
    (state) => state.listview.printGroupListViewData
  );

  const [priceBookCateData, setPriceBookCateData] = useState({});
  console.log("🚀 ~ PrintGroup ~ priceBookCateData:", priceBookCateData);
  // ********************** COLUMN AND ROWS ********************** //
  const columns = [
    {
      headerName: "Print Group",
      field: "GroupCode",
      width: "170",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Print Group Description",
      field: "GroupName",
      width: "300",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Print Sequence",
      field: "Sortorder",
      width: "170",
      align: "left",
      headerAlign: "left",
      hide: false,
    },

    {
      field: "Action",
      headerName: "Action",
      minWidth: 400,
      flex: 1,
      sortable: false,
      headerAlign: "center",
      filterable: false,
      disableColumnMenu: true,
      disableExport: true,
      align: "center",
      renderCell: (params) => {
        return (
          <div>
            <Tooltip title="Edit">
              <IconButton
                color="black"
                size="small"
                onClick={() => {
                  navigate(
                    "/pages/control-panel/print-group/print-group-detail/edit",
                    {
                      state: { id: params.row.RecordID },
                    }
                  );
                }}
              >
                <ModeEditOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                color="error"
                size="small"
                onClick={() => {
                  navigate(
                    "/pages/control-panel/print-group/print-group-detail/delete",
                    {
                      state: { id: params.row.RecordID },
                    }
                  );
                }}
              >
                <DeleteIcon color="error" fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    dispatch(getPrintGroupListView());
    dispatch(clearPrintGroupState());
  }, [dispatch]);

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
          <Tooltip title="Create New Category">
            <IconButton
              color="black"
              size="small"
              onClick={() => {
                navigate(
                  "/pages/control-panel/print-group/print-group-detail/add",
                  {
                    state: { id: 0 },
                  }
                );
              }}
            >
              <Add fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* <Button
            variant="contained"
            color="info"
            size="small"
            startIcon={<Add />}
            onClick={() => {
              navigate(
                "/pages/control-panel/print-group/print-group-detail/add",
                {
                  state: { id: 0 },
                }
              );
            }}
          >
            Create New Category
          </Button> */}
        </Box>
      </GridToolbarContainer>
    );
  }

  const [openAlert, setOpenAlert] = useState(false);
  const [postError, setPostError] = useState(false);

  const printGroupSaveFn = async (values, setSubmitting) => {
    const postData = {
      recordId: priceBookCateData.RecordID,
      groupcode: values.groupCode,
      groupName: values.groupName,
      sortorder: values.SortOrder,
      disable: "N",
      printList: [],
      Headeronly:true
    };
    try {
      const response = await dispatch(postPrintGroupData({ PGdata: postData }));

      if (response.payload.status === "Y") {
        setOpenAlert(true);
        dispatch(getPrintGroupListView());
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
            { name: "Control Panel" },
            { name: "Price Book Categories" },
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
              height: dataGridHeight,
              gridColumn: isSide ? "span 3" : "span 4",
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
              // Ensure the checkbox color reflects the selected state
              "& .MuiCheckbox-root.Mui-checked": {
                color: "black !important", // Set checkbox color to black when checked
              },
              // Alternating row colors
              "& .MuiDataGrid-row:nth-of-type(even)": {
                backgroundColor: theme.palette.action.hover, // Color for even rows
              },
              "& .MuiDataGrid-row:nth-of-type(odd)": {
                backgroundColor: theme.palette.background.default, // Color for odd rows
              },
              // Prevent selected row background color from changing on hover
              "& .MuiDataGrid-row.Mui-selected:hover": {
                backgroundColor: `${theme.palette.action.selected} !important`, // Ensure the background remains the same on hover
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
              rows={printGroupRows}
              columns={columns}
              loading={loading}
              onRowClick={(params) => {
                setPriceBookCateData(params.row);
                setIsSide(true);
              }}
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
              disableSelectionOnClick
              disableRowSelectionOnClick
            />
          </Box>

          {isSide && (
            <Box sx={{ gridColumn: "span 1", marginTop: 8 }}>
              <Formik
                initialValues={{
                  groupCode: priceBookCateData.GroupCode,
                  groupName: priceBookCateData.GroupName,
                  SortOrder: priceBookCateData.Sortorder,
                  Disable: priceBookCateData.Disable,
                }}
                enableReinitialize={true}
                onSubmit={(values, { setSubmitting }) => {
                  printGroupSaveFn(values, setSubmitting);
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
                        id="groupCode"
                        name="groupCode"
                        label="Category Name"
                        size="small"
                        onChange={handleChange}
                        value={values.groupCode}
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
                        id="groupName"
                        name="groupName"
                        label="Category Description"
                        size="small"
                        onChange={handleChange}
                        value={values.groupName}
                        disabled={true}
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

export default PrintGroup;
