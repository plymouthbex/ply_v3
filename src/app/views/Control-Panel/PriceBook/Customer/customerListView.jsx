import React, { useEffect, useState } from "react";
import {
  Box,
  LinearProgress,
  Paper,
  Button,
  styled,
  useTheme,
  Typography,
  Stack,
  Tooltip,
  IconButton,
  Checkbox,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Breadcrumb } from "app/components";
import {
  dataGridHeight,
  dataGridRowHeight,
  dataGridHeaderFooterHeight,
  dataGridPageSize,
  dataGridpageSizeOptions,
} from "app/utils/constant";
import { Add } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch, useSelector } from "react-redux";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import {
  getConfigureCustomerListView,
  getCustomerListView,
  onCheckboxChange,
  onCheckboxChangeCustomer,
} from "app/redux/slice/listviewSlice";
import CheckIcon from "@mui/icons-material/Check";
import { CustomerConfig, postConfigureCompany } from "app/redux/slice/postSlice";
import AlertDialog from "app/components/AlertDialog";
import useAuth from "app/hooks/useAuth";
// ********************* STYLED COMPONENTS ********************* //
const Container = styled("div")(({ theme }) => ({
  margin: "15px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "10px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

// ********************* ITEMS SCREEN LISTVIEW ********************* //
const Customer = () => {
  // ********************* HOOKS AND CONSTANTS ********************* //
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const State = location.state;
  const { user } = useAuth();
  // ********************* LOCAL STATE ********************* //

  // ********************* REDUX STATE ********************* //
  const customerRows = useSelector(
    (state) => state.listview.configureCustomerListViewData
  );

  useEffect(() => {
    dispatch(getConfigureCustomerListView({ ID: State.RecordID }));
    // dispatch(clearCustomerListState())
  }, [dispatch]);
  // ********************* COLUMN AND ROWS ********************* //
  const columns = [
    {
      headerName: "Customer Number ",
      field: "CustomerNumber",
      width: 150,
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Customer Name",
      field: "CustomerName",
      minWidth: 200,
      flex: 1,
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Price Level",
      field: "PriceLevel",
      width: 100,
      align: "right",
      headerAlign: "center",
      hide: false,
    },
    {
      headerName: "Price Book group",
      field: "Rungroup",
      width: 150,
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      field: "FullPriceBook",
      headerName: "Full Price Book",
      width: 200,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      disableExport: true,
      renderCell: (params) => (
        <div>
          <Checkbox
            checked={params.row.FullPriceBookExcel}
            onChange={(e) => {
              dispatch(
                CustomerConfig({
                  CustomerNumber: params.row.CustomerNumber,
                  Type: "FullPriceBookExcel",
                  Value: e.target.checked ? "1" : "0",
                })
              );
              dispatch(
                onCheckboxChangeCustomer({
                  id: params.row.RecordID,
                  field: "FullPriceBookExcel",
                })
              );
              

              // handleSave({...params.row,FullPriceBookExcel:e.target.checked })
            }}
            sx={{
              color: "#174c4f",
              "&.Mui-checked": {
                color: "#174c4f",
              },
            }}
          />
          Excel
          <Checkbox
            checked={params.row.FullPriceBookPdf}
            onChange={(e) => {
              dispatch(
                CustomerConfig({
                  CustomerNumber: params.row.CustomerNumber,
                  Type: "FullPriceBookPdf",
                  Value: e.target.checked ? "1" : "0",
                })
              );
              // handleSave({ ...params.row, FullPriceBookPdf: e.target.checked });
              dispatch(
                onCheckboxChangeCustomer({
                  id: params.row.RecordID,
                  field: "FullPriceBookPdf",
                })
              );
            }}
            sx={{
              color: "#174c4f",
              "&.Mui-checked": {
                color: "#174c4f",
              },
            }}
          />
          PDF
        </div>
      ),
    },
    {
      field: "customerCustomPriceBook",
      headerName: "Custom Price Book",
      minWidth: 200,
      flex: 1,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      disableExport: true,
      renderCell: (params) => (
        <div>
          <Checkbox
            checked={params.row.CustomPriceBookExcel}
            onChange={(e) => {
              // handleSave({
              //   ...params.row,
              //   CustomPriceBookExcel: e.target.checked,
              // });

              dispatch(
                CustomerConfig({
                  CustomerNumber: params.row.CustomerNumber,
                  Type: "CustomrPriceBookExcel",
                  Value: e.target.checked ? "1" : "0",
                })
              );
              dispatch(
                onCheckboxChangeCustomer({
                  id: params.row.RecordID,
                  field: "CustomPriceBookExcel",
                })
              );
            }}
            sx={{
              color: "#174c4f",
              "&.Mui-checked": {
                color: "#174c4f",
              },
            }}
          />
          Excel
          <Checkbox
            checked={params.row.CustomPriceBookPdf}
            onChange={(e) => {
              // handleSave({
              //   ...params.row,
              //   CustomPriceBookPdf: e.target.checked,
              // });
              dispatch(
                CustomerConfig({
                  CustomerNumber: params.row.CustomerNumber,
                  Type: "CustomPriceBookPdf",
                  Value: e.target.checked ? "1" : "0",
                })
              );
              dispatch(
                onCheckboxChangeCustomer({
                  id: params.row.RecordID,
                  field: "CustomPriceBookPdf",
                })
              );
            }}
            sx={{
              color: "#174c4f",
              "&.Mui-checked": {
                color: "#174c4f",
              },
            }}
          />
          PDF
        </div>
      ),
    },
    {
      field: "Action",
      headerName: "Action",
      minWidth: 100,
      flex: 1,
      sortable: false,
      headerAlign: "center",
      filterable: false,
      disableColumnMenu: true,
      disableExport: true,
      align: "center",
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {/* <Tooltip title="Confirm">
              <IconButton color="black" size="small" onClick={() => { handleSave(params.row)}}>
                <CheckIcon />
              </IconButton>
            </Tooltip> */}

            <Tooltip title="Contacts">
              <IconButton
                color="black"
                size="small"
                onClick={() => {
                  navigate(
                    "/pages/control-panel/configure-price-book/customer/configure-contact",
                    {
                      state: {
                        RecordID: params.row.RecordID,
                        Code: params.row.CustomerNumber,
                        Name: params.row.CustomerName,
                        CompanyCode: State.Code,
                        company: State,
                      },
                    }
                  );
                }}
              >
                <ContactMailIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Price Lists">
              <IconButton
                color="black"
                size="small"
                onClick={() => {
                  navigate(
                    "/pages/control-panel/configure-price-book/customer/edit-Customer/configureEdit",
                    {
                      state: {
                        RecordID: params.row.RecordID,
                        Code: params.row.CustomerNumber,
                        Name: params.row.CustomerName,
                        company: State,
                      },
                    }
                  );
                }}
              >
                <RequestQuoteIcon />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];
  const [postError, setPostError] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const handleSave = async (values) => {
    const data1 = {
      RecordID: values.RecordID,
      Classification: "CS",
      CompanyID: values.CompanyID,
      CompanyCode: values.CompanyCode,
      CustomerNumber: values.CustomerNumber,
      CustomerName: values.CustomerName,
      FullPriceBookPdf: values.FullPriceBookPdf ? "1" : "0",
      FullPriceBookExcel: values.FullPriceBookExcel ? "1" : "0",
      CustomPriceBookPdf: values.CustomPriceBookPdf ? "1" : "0",
      CustomPriceBookExcel: values.CustomPriceBookExcel ? "1" : "0",
      Rungroup: values.Rungroup,
      FullPriceBookTitle: "",
      CustomPriceBookTitle: "",
      Disable: "0",
      PriceLevel: values.PriceLevel,
      CreatedDateTime: values.CreatedDateTime,
      LastModified: values.LastModified,
      CreatedBy: values.CreatedBy,
      ModifiedBy: values.ModifiedBy,
    };

    const response = await dispatch(postConfigureCompany({ Cdata: data1 }));
    if (response.payload.status === "Y") {
      // setOpenAlert(true);
    } else {
      // setOpenAlert(true);
      // setPostError(true);
      // toast.error("Error occurred while saving data");
    }
  };

  // ********************* TOOLBAR ********************* //
  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between", // Distribute space between the items
          width: "100%",
          // padding: 2,
        }}
      >
        <Typography fontSize={"16px"}>
          <Typography component="span" fontSize={"16px"} fontWeight="bold">
            Company:
          </Typography>
          {State.Code} || {State.Name}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
          }}
        >
          <GridToolbarQuickFilter />
        </Box>
      </GridToolbarContainer>
    );
  }

  return (
    <Container>
      <div
        className="breadcrumb"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Breadcrumb
          routeSegments={[
            {
              name: "Control Panel",
              // path: "/pages/control-panel/configure-price-book/company",
            },
            {
              name: "Configure Price Book",
              // path: "/pages/control-panel/configure-price-book/company",
            },
            {
              name: "Company",
              path: "/pages/control-panel/configure-price-book/company",
            },
            { name: "Customer" },
          ]}
        />
        <Stack direction="row" gap={1}>
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
          sx={{
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
            rows={customerRows}
            columns={columns}
            disableSelectionOnClick
            disableRowSelectionOnClick
            getRowId={(row) => row.RecordID}
            initialState={{
              pagination: { paginationModel: dataGridPageSize },
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
        <AlertDialog
          logo={`data:image/png;base64,${user.logo}`}
          open={openAlert}
          error={postError}
          message={
            postError
              ? "Somthing went wrong and Please retry"
              : "Changes saved successfully"
          }
          Actions={
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  setOpenAlert(false);
                }}
                sx={{ height: 25 }}
              >
                close
              </Button>
            </Box>
          }
        />
      </Paper>
    </Container>
  );
};

export default Customer;
