import React, { useEffect, useState } from "react";
import {
  Box,
  LinearProgress,
  Paper,
  Button,
  styled,
  useTheme,
  Tooltip,
  IconButton,
  Stack,
  DialogActions,
  FormControl,
  Checkbox,
  Typography,
  FormGroup,
  FormLabel,
  FormControlLabel,
  useMediaQuery,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Breadcrumb } from "app/components";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Formik } from "formik";
import CircularProgress from "@mui/material/CircularProgress";
import {
  dataGridHeight,
  dataGridPageSize,
  dataGridpageSizeOptions,
  dataGridRowHeight,
  dataGridHeaderFooterHeight,
} from "app/utils/constant";
import { Add, MailOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { useDispatch, useSelector } from "react-redux";
import { getCompanyListView } from "app/redux/slice/listviewSlice";
import MailIcon from "@mui/icons-material/Mail";
import {
  UpdateCompanyPriceLevel,
  UploadContracts,
} from "app/redux/slice/postSlice";
import AlertDialog from "app/components/AlertDialog";
import useAuth from "app/hooks/useAuth";
import { GetPriceListLevelBYCompany } from "app/redux/slice/getSlice";
import Loading from "app/components/AppLoading";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CurrencyPoundIcon from "@mui/icons-material/CurrencyPound";
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
const Company = () => {
  // ********************* HOOKS AND CONSTANTS ********************* //
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const isNonMobile = useMediaQuery("(min-width:900px)");
  // ********************* LOCAL STATE ********************* //
  const [openAlert, setOpenAlert] = useState(false);
  const [postError, setPostError] = useState(false);
  const [postMessage, setPostMessage] = useState(false);
  const [selectedCompanyData, setSelectedCompanyData] = useState(null);

  // ********************* REDUX STATE ********************* //
  const companyRows = useSelector(
    (state) => state.listview.comapnyListViewData
  );

  // ********************* COLUMN AND ROWS ********************* //
  const columns = [
    {
      headerName: "Company Code",
      field: "CompanyCode",
      width: "130",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Company Name",
      field: "CompanyName",
      width: "170",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    // {
    //   headerName: "Email",
    //   field: "EmailId",
    //   width: "250",
    //   align: "left",
    //   headerAlign: "left",
    //   hide: true,
    // },
    {
      headerName: "Address",
      field: "Address",
      width: "350",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Address 2",
      field: "Address2",
      width: "200",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "City",
      field: "City",
      width: "100",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    ,
    {
      headerName: "State",
      field: "State",
      width: "100",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Zip",
      field: "Zip",
      width: "100",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Phone",
      field: "Phone2",
      width: "200",
      align: "left",
      headerAlign: "left",
      hide: true,
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
          <div gap={1}>
            {/* <Tooltip title="Edit"> */}
            <IconButton
              sx={{ height: 25, width: 25 }}
              color="black"
              onClick={() => {
                navigate("/pages/security/company/company-edit-detail/edit", {
                  state: {
                    ID: params.row.CompanyCode,
                    RecordID: params.row.RecordID,
                  },
                });
              }}
            >
              <ModeEditOutlineIcon fontSize="small" />
            </IconButton>
            {/* </Tooltip> */}
            {/* <Tooltip title="Mail Config"> */}
            <IconButton
              sx={{ height: 25, width: 25 }}
              color="black"
              onClick={() => {
                navigate("/pages/security/company/mail", {
                  state: { ID: params.row.RecordID },
                });
              }}
            >
              <MailIcon fontSize="small" />
            </IconButton>
            {/* </Tooltip> */}
            <IconButton
              onClick={() => {
                setSelectedCompanyData(params.row);
                dispatch(
                  GetPriceListLevelBYCompany({ CompanyID: params.row.RecordID })
                );
                // ← prevents DataGrid onRowClick
                setIsCopy(true);
                setCompanyID(params.row.RecordID);
              }}
              style={{ color: "secondary" }}
              sx={{ height: 30, width: 30 }}
            >
              <MonetizationOnIcon fontSize="small" />
            </IconButton>
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    dispatch(getCompanyListView());
  }, [dispatch]);

  // ********************* TOOLBAR ********************* //
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

          {/* <Tooltip title="Create Company"> */}
          <IconButton
            color="black"
            sx={{ height: 30, width: 30 }}
            onClick={() => {
              navigate("/pages/security/company/company-edit-detail/add", {
                state: { ID: 0 },
              });
            }}
          >
            <Add
              sx={{
                fontSize: 30, // Increased icon size
                color: theme.palette.success.main,
              }}
            />
          </IconButton>
          {/* </Tooltip> */}
        </Box>
      </GridToolbarContainer>
    );
  }
  //============================PRICELIST-LEVEL==============================//

  const [isCopy, setIsCopy] = useState(false);
  const [companyID, setCompanyID] = useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const priceListViewData = useSelector(
    (state) => state.getSlice.getPriceListLevelBYCompanyData
  );
  console.log("🚀 ~ Company ~ priceListViewData:", priceListViewData);
  const status = useSelector(
    (state) => state.getSlice.getPriceListLevelBYCompanyStatus
  );
  const error = useSelector(
    (state) => state.getSlice.getPriceListLevelBYCompanyError
  );

  //console.log("🚀 ~ PriceList ~ comapnyListViewData:", comapnyListViewData);
  const initialSelected =
    priceListViewData
      ?.filter((item) => item.IsSelected)
      .map((item) => item.PriceLevel) || [];
  console.log("🚀 ~ Company ~ initialSelected:", initialSelected);
  const validate = (values) => {
    const errors = {};

    if (!values.priceLevel || values.priceLevel.length === 0) {
      errors.priceLevel = "Please select at least one Price Level";
    }

    return errors;
  };
  //===============COMPANY COPY SAVE====================//
  const CopySaveFn = async (values, setSubmitting) => {
    setIsLoading(true);
    //   {
    //   "PriceListID": 3,
    //   "CompanyID": 5,
    //   "SelectedCompanyID": "63",
    //   "UserName": "Admin"
    // }
    const postData = {
      ComapnyID: companyID,
      PriceLevelIDs: values.priceLevel.join(","),
    };
    console.log("🚀 ~ PriceListSaveFn ~ postData:", postData);

    try {
      const response = await dispatch(
        UpdateCompanyPriceLevel({ data: postData })
      );

      if (response.payload.status === "Y") {
        setIsLoading(false);
        setOpenAlert(true);
        setPostMessage(response.payload.message);
        //dispatch(getPriceListView({ ID: companyRecordID }));
        setIsCopy(false);
      } else {
        setIsLoading(false);
        setPostMessage(response.payload.message);
        setOpenAlert(true);
        setPostError(true);
        setIsCopy(false);
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
          routeSegments={[{ name: "Control Panel" }, { name: "Company" }]}
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
              gridColumn: isCopy ? "span 3" : "span 4",
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
              "& .MuiDataGrid-row:hover": {
                border: "3px solid #999999",
                // border: `1px solid #${theme.palette.action.selected} !important`, // Change border color on hover
                borderRadius: "4px", // Optional: Add rounded corners
              },
              "& .MuiDataGrid-row.Mui-selected": {
                border: "3px solid #999999",
                borderRadius: "4px",
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
              "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                outline: "none !important",
              },
            }}
          >
            <DataGrid
              slots={{
                loadingOverlay: LinearProgress,
                toolbar: CustomToolbar,
              }}
              columnHeaderHeight={dataGridHeaderFooterHeight}
              sx={{
                // This is to override the default height of the footer row
                "& .MuiDataGrid-footerContainer": {
                  height: dataGridHeaderFooterHeight,
                  minHeight: dataGridHeaderFooterHeight,
                },
              }}
              rowHeight={dataGridRowHeight}
              rows={companyRows}
              columns={columns}
              // checkboxSelection
              disableSelectionOnClick
              // disableRowSelectionOnClick
              getRowId={(row) => row.CompanyCode}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: dataGridPageSize },
                },
              }}
              pageSizeOptions={dataGridpageSizeOptions}
              columnVisibilityModel={{
                CompanyCode: true,
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
          {isCopy && (
            <Box sx={{ gridColumn: "span 1", marginTop: 8 }}>
              {status === "fulfilled" && !error ? (
                <Formik
                  initialValues={{
                    priceLevel: initialSelected,
                    companyname: selectedCompanyData.CompanyName,
                  }}
                  validate={validate}
                  enableReinitialize
                  onSubmit={(values, { setSubmitting }) => {
                    console.log("Selected PriceLevels:", values.priceLevel);
                    CopySaveFn(values, setSubmitting);
                    setSubmitting(false);
                  }}
                >
                  {({
                    values,
                    setFieldValue,
                    handleSubmit,
                    isSubmitting,
                    errors,
                  }) => (
                    <form onSubmit={handleSubmit}>
                      <Stack direction="column" gap={2}>
                        <Typography
                          sx={{
                            //fontWeight: "bold",     // Bold text
                            color: "gray", // Disabled-looking color
                            opacity: 0.7, // Slight fade
                            pointerEvents: "none", // Acts like disabled
                          }}
                        >
                          Selected Company:{" "}
                          <strong>{values.companyname}</strong>
                        </Typography>
                        <FormControl component="fieldset" variant="standard">
                          <FormLabel component="legend">
                            Select Price Levels
                          </FormLabel>

                          {status === "fulfilled" && !error ? (
                            <FormGroup>
                              {priceListViewData.map((item) => (
                                <FormControlLabel
                                  key={item.PriceLevel}
                                  sx={{
                                    "& .MuiFormControlLabel-label": {
                                      color: "#000", // <-- Fix label color
                                    },
                                  }}
                                  control={
                                    <Checkbox
                                      checked={values.priceLevel.includes(
                                        item.PriceLevel
                                      )}
                                      onChange={() => {
                                        const id = item.PriceLevel;

                                        if (values.priceLevel.includes(id)) {
                                          setFieldValue(
                                            "priceLevel",
                                            values.priceLevel.filter(
                                              (x) => x !== id
                                            )
                                          );
                                        } else {
                                          setFieldValue("priceLevel", [
                                            ...values.priceLevel,
                                            id,
                                          ]);
                                        }
                                      }}
                                    />
                                  }
                                  label={item.Description}
                                />
                              ))}
                            </FormGroup>
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "80vh",
                              }}
                            >
                              <Loading />
                            </Box>
                          )}
                        </FormControl>
                        {errors.priceLevel && (
                          <Typography sx={{ color: "red", fontSize: 13 }}>
                            {errors.priceLevel}
                          </Typography>
                        )}
                        <Stack direction="row" gap={1}>
                          <Button
                            type="submit"
                            variant="contained"
                            color="info"
                            size="small"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <CircularProgress
                                  size={18}
                                  thickness={5}
                                  sx={{ color: "#fff !important" }}
                                />
                                {/* &nbsp;Saving */}
                                Saving
                              </>
                            ) : (
                              <>
                                {/* <MonetizationOnIcon />
                                &nbsp;Save */}
                                Save
                              </>
                            )}
                          </Button>

                          <Button
                            variant="contained"
                            color="info"
                            size="small"
                            onClick={() => setIsCopy(false)}
                          >
                            Cancel
                          </Button>
                        </Stack>
                      </Stack>
                    </form>
                  )}
                </Formik>
              ) : (
                false
              )}
            </Box>
          )}
        </Box>
        <Stack direction="row" spacing={2} justifyContent="flex-start" p={3}>
          <Button
            variant="contained"
            color="info"
            size="small"
            onClick={async () => {
              const data = {
                Type: "Buyer",
              };
              const response = await dispatch(UploadContracts({ data }));
              console.log("🚀 ~ onClick={async ~ response:", response);
              if (response.payload.status === "Y") {
                setOpenAlert(true);
                setPostMessage(response.payload.message);
              } else {
                setOpenAlert(true);
                setPostError(response.payload.message);
                // toast.error("Error occurred while saving data");
              }
            }}
          >
            Upload Buyer Contracts
          </Button>
          <Button
            variant="contained"
            color="info"
            size="small"
            onClick={async () => {
              const data = {
                Type: "Sales",
              };
              const response = await dispatch(UploadContracts({ data }));
              console.log("🚀 ~ onClick={async ~ response:", response);
              if (response.payload.status === "Y") {
                setOpenAlert(true);
                setPostMessage(response.payload.message);
              } else {
                setOpenAlert(true);
                setPostError(response.payload.message);
                // toast.error("Error occurred while saving data");
              }
            }}
          >
            Upload Sales Contracts
          </Button>
          <Button
            variant="contained"
            color="info"
            size="small"
            onClick={async () => {
              const data = {
                Type: "SJ7A",
              };
              const response = await dispatch(UploadContracts({ data }));
              console.log("🚀 ~ onClick={async ~ response:", response);
              if (response.payload.status === "Y") {
                setOpenAlert(true);
                setPostMessage(response.payload.message);
              } else {
                setOpenAlert(true);
                setPostError(response.payload.message);
                // toast.error("Error occurred while saving data");
              }
            }}
          >
            Upload SJ7A Pricing
          </Button>
        </Stack>
        <AlertDialog
          logo={`data:image/png;base64,${user.logo}`}
          open={openAlert}
          error={postError}
          message={postError ? postError : postMessage}
          Actions={
            <DialogActions>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  // dispatch(getCompanyData({ ID: 0 }));
                  setOpenAlert(false);
                  setPostError(null);
                  setPostMessage(null);
                }}
                autoFocus
              >
                Close
              </Button>
            </DialogActions>
          }
        />
      </Paper>
    </Container>
  );
};

export default Company;
const rows = [
  {
    company_code: 11243,
    company_name: "Plymouth",
    Email: "ply123@gmail.com",
    Address: "1000 S Miller St",
  },
  {
    company_code: 11244,
    company_name: "Nicky",
    Email: "nicky123@gmail.com",
    Address: "741  Lawernce St",
  },
  {
    company_code: 11245,
    company_name: "S&J",
    Email: "sj123@gmail.com",
    Address: "100  Road 80th Venue ",
  },
];
