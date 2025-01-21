import {
  Autocomplete,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  Checkbox,
  FormGroup,
  FormControlLabel,
  LinearProgress,
  Fab,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  RadioGroup,
  Radio,
  Divider,
} from "@mui/material";
import lodash from "lodash";
import { Add } from "@mui/icons-material";
import { Box, styled } from "@mui/material";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { Breadcrumb, SimpleCard } from "app/components";
import { useTheme } from "@emotion/react";
import React, { useEffect, useState } from "react";
import { SiMicrosoftexcel } from "react-icons/si";
import { FaFilePdf } from "react-icons/fa6";
import { IoIosMailOpen } from "react-icons/io";
import { IoMdPrint } from "react-icons/io";
// CUSTOM UTILS LIBRARY FUNCTIONS

import useAuth from "app/hooks/useAuth";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomAutocomplete, {
  FormikCustomAutocomplete,
  QuoteTempSingleAutocomplete,
  SingleAutocomplete,
} from "app/components/AutoComplete";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteAdHocItem,
  postBuildData,
  postQutoeData,
  priceListClearFilter,
  quoteAddHocItem,
  quoteFilterAndItemPostData,
  quoteInfoData,
  QuoteUpdateDate,
  updateQuoteData,
} from "app/redux/slice/postSlice";
import {
  addQuoteItemData,
  getBuildPriceBookData,
  getQuoteBookData,
  getQuoteFilterData,
  getQuoteItemsAndFilters,
  getQuoteItemsAndFiltersget2,
  getQuoteItemsAndFiltersget3,
  quoteClearState2,
} from "app/redux/slice/getSlice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import toast from "react-hot-toast";
import CoverPageComponent from "app/components/PDFCoverPage";
import { QuotePriceListDocument } from "app/components/Template/pdfs/QuotePriceList";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { exportToExcelQuotePriceBook } from "app/components/Template/Excel";
import {
  getQuotePriceList,
  quoteClearState,
  updateDelayedQuotePriceBook,
} from "app/redux/slice/priceListSlice";
import LoadingApiDialog, {
  PriceGroupAlertApiDialog,
  QuoteTempAlertApiDialog,
} from "app/components/LoadindgDialog";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { themeColors } from "app/components/baseTheme/themeColors";
import {
  FormikCustomAutocompleteCustomer,
  FormikCustomSelectCompany,
} from "app/components/SingleAutocompletelist";
import DeleteIcon from "@mui/icons-material/Delete";
import { Formik } from "formik";
import {
  FormikCustomAutocompleteMulti,
  FormikCustomAutocompleteMultiAdHocItems,
  FormikCustomAutocompleteMultiPriceList,
} from "app/components/FormikAutocomplete";
import { dataGridHeaderFooterHeight } from "app/utils/constant";
// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "15px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "10px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const CustomIconButton = styled(IconButton)(({ theme, bgcolor }) => ({
  backgroundColor: bgcolor,
  color: "white",
  margin: theme.spacing(1),
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
  "&:hover": {
    backgroundColor: bgcolor,
  },
}));

// Helper function to get the Saturday and Sunday of a given week (week starts on Sunday)
const getSaturdayAndSunday = (date) => {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  const sunday = new Date(date);
  sunday.setDate(date.getDate() - dayOfWeek);

  // Clone the Sunday date to avoid modifying the original object
  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);

  return { sunday, saturday };
};

// Format a date into MM/DD format (without year)
const formatDateShort = (date) => {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${month}/${day}`;
};

// Format a full date into MM/DD/YYYY format
const formatDateLong = (date) => {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export default function BuildCustomPriceBook() {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const location = useLocation();
  const state = location.state ? location.state : {};
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const colors = themeColors;

  const getQuoteFilterItemStatus = useSelector(
    (state) => state.getSlice.getQuoteFilterItemStatus
  );
  const getQuoteFilterItemLoading = useSelector(
    (state) => state.getSlice.getQuoteFilterItemLoading
  );
  const getQuoteFilterItemData = useSelector(
    (state) => state.getSlice.getQuoteFilterItemData
  );

  const getQuoteFilterItemError = useSelector(
    (state) => state.getSlice.getQuoteFilterItemError
  );

  const getQuteFiltStatus = useSelector(
    (state) => state.getSlice.getQuteFiltStatus
  );
  const getQuteFiltData = useSelector(
    (state) => state.getSlice.getQuteFiltData
  );
  const getQuoteHeaderData = useSelector(
    (state) => state.getSlice.getQuoteHeaderData
  );
  const getQuteFiltLoading = useSelector(
    (state) => state.getSlice.getQuteFiltLoading
  );
  const getQuteFiltError = useSelector(
    (state) => state.getSlice.getQuteFiltError
  );

  const handleMailNavigate = () => {
    toast.error("Under Construction");
    // navigate("/sent-mail", { state: { screenName: "Quote" } });
  };

  //======================= SELECT PRICE LIST ===================================//
  const [addPriceListQuoteData, setAddPriceListQuoteData] = useState(null);

  const handleSelectionAddPriceListQuoteData = (newValue) => {
    setAddPriceListQuoteData(newValue);
  };

  //======================= SELECT PRICE LIST ===================================//
  const [addPriceListQuoteItemData, setAddPriceListQuoteItemData] =
    useState(null);

  const handleSelectionAddPriceListQuoteItemData = (newValue) => {
    setAddPriceListQuoteItemData(newValue);
  };

  //======================= ADD PRICE LIST ===================================//
  const [addPriceListData, setAddPriceListData] = useState();
  const handleSelectionAddPriceListData = (newValue) => {
    setAddPriceListData(newValue);
  };

  const [isItemExistsError, setIsItemExistsError] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isNextWeek, setIsNextWeek] = useState(false);
  useEffect(() => {
    dispatch(quoteClearState());
    dispatch(
      getQuoteItemsAndFilters({
        data: {
          RecordID: location.state.headerID ? location.state.headerID : 0,
        },
      })
    );

    const today = new Date();
    setCurrentDate(today);
  }, [location.key]);

  const getWeekDates = () => {
    const date = new Date(currentDate);

    // If we want the next week's dates, add 7 days to the current date
    if (isNextWeek) {
      date.setDate(date.getDate() + 7);
    }

    const { sunday, saturday } = getSaturdayAndSunday(date); // Get the Sunday and Saturday of the week
    return {
      sunday: formatDateLong(sunday), // Full date for Sunday (MM/DD/YYYY)
      saturday: formatDateLong(saturday), // Full date for Saturday (MM/DD/YYYY)
      shortSunday: formatDateShort(sunday), // Short format (MM/DD) for Sunday
      shortSaturday: formatDateShort(saturday), // Short format (MM/DD) for Saturday
      formatedDate: `Pricing Week (SUN)${formatDateLong(
        sunday
      )} TO (SAT)${formatDateLong(saturday)}`, // Full format Pricing Week (SUN)(MM/DD/YYYY) TO (SAT)(MM/DD/YYYY)
    };
  };

  const toggleWeek = () => {
    setIsNextWeek(!isNextWeek); // Toggle between next and current week
  };

  const { shortSunday, shortSaturday, sunday, saturday, formatedDate } =
    getWeekDates(); // Get formatted Saturday and Sunday dates

  const [isItemExists, setIsItemExists] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);

  //=======================================================================//
  // ********************** COLUMN AND ROWS ********************** //
  const columns = [
    {
      headerName: "Item Number",
      field: "Item_Number",
      width: 150,
      align: "left",
      headerAlign: "left",
    },
    {
      headerName: "Item Description",
      field: "Item_Description",
      minWidth: 350,
      flex: 1,
      align: "left",
      headerAlign: "left",
    },
    {
      headerName: "Ad Hoc Item",
      field: "AdHocItem",
      Width: 100,
      align: "left",
      headerAlign: "left",
      renderCell: (param) => {
        return param.row.AdHocItem === "Y" ? "Yes" : "No";
      },
    },
    {
      field: "Action",
      headerName: "Action",
      minWidth: 200,
      sortable: false,
      headerAlign: "center",
      filterable: false,
      disableColumnMenu: true,
      disableExport: true,
      align: "center",

      renderCell: (param) => {
        return (
          <>
            {/* <Button
              sx={{
                height: 25,
                "&:hover": {
                  backgroundColor: theme.palette.secondary.light, // Custom hover color
                },
                color: theme.palette.secondary.contrastText,
                bgcolor: theme.palette.secondary.light,
                fontWeight: "bold",
              }}
              variant="contained"
              size="small"
              onClick={() =>
                navigate("./item-attributes/edit", {
                  state: {
                    headerID: getQuoteHeaderData.RecordID,
                    RecordID: param.row.RecordId,
                    itemNumber: param.row.Item_Number,
                    itemDesc: param.row.Item_Description,
                  },
                })
              }
              startIcon={<ModeEditOutlineIcon size="small" />}
            >
              Edit
            </Button> */}

            {/* <Button
              sx={{
                height: 25,
                ml: 1,
              }}
              color="info"
              variant="contained"
              size="small"
              // onClick={() =>
              //   navigate("./item-attributes/delete", {
              //     state: {
              //       headerID: getQuoteHeaderData.RecordID,
              //       RecordID: param.row.RecordId,
              //       itemNumber: param.row.Item_Number,
              //       itemDesc: param.row.Item_Description,
              //     },
              //   })
              // }

              onClick={() => {
                setDeleteID(param.row.RecordId);
                setIsRemoveItem(true);
              }}
              startIcon={<DeleteIcon size="small" />}
            >
              Remove
            </Button> */}
            <Tooltip title="Remove">
              <IconButton
                sx={{
                  height: 25,
                  ml: 1,
                }}
                color="error"
                variant="contained"
                size="small"
                onClick={() => {
                  setDeleteID(param.row.RecordId);
                  setIsRemoveItem(true);
                }}
              >
                <DeleteIcon size="small" />
              </IconButton>
            </Tooltip>
          </>
        );
      },
    },
  ];

  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          padding: "10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 2,
            width: "100%",
          }}
        >
          <GridToolbarQuickFilter />
          {/* <FormikCustomAutocompleteMultiAdHocItems
            errors={isItemExistsError}
            helper={isItemExistsError && "please select item!"}
            name="adHocItem"
            id="adHocItem"
            value={addPriceListData}
            onChange={handleSelectionAddPriceListData}
            label="Ad Hoc Item"
            url={`${process.env.REACT_APP_BASE_URL}ItemMaster/GetItemMasterList`}
          />
          <Button
            variant="contained"
            color="info"
            size="small"
            type="reset"
            startIcon={<Add size="small" />}
            disabled={params.mode == "copy" ? true : false}
          >
            Ad Hoc Item
          </Button> */}
        </Box>
      </GridToolbarContainer>
    );
  }

  async function adHocItem(values) {
    if (addPriceListData) {
      const isItem = getQuoteFilterItemData.some((item) =>
        lodash.isEqual(item.Item_Number, addPriceListData.Item_Number)
      );
      if (isItem) {
        setIsItemExists(true);
        setTimeout(() => {
          setIsItemExists(false);
          setAddPriceListData(null);
        }, 5000);
        return;
      }
      setRowSelectionModel([
        ...rowSelectionModel,
        addPriceListData.Item_Number,
      ]);
      const res = await dispatch(
        quoteAddHocItem({
          data: {
            priceListID: "0",
            quotationRecordID: getQuoteHeaderData.RecordID.toString(),
            filterType: "Q",
            itemNo: addPriceListData.Item_Number,
            itemDescription: addPriceListData.Item_Description,
            CONTARCTITEMS: "N",
            AdHocItem: "Y",
          },
        })
      );
      if (res.payload.status === "Y") {
        dispatch(
          getQuoteItemsAndFiltersget3({
            data: { RecordID: getQuoteHeaderData.RecordID.toString() },
          })
        );

        setOpenAlert3(true);
      } else {
        setOpenAlert3(true);
        setPostError3(true);
      }

      setAddPriceListData(null);
    } else {
      setIsItemExistsError(true);
      setTimeout(() => {
        setIsItemExistsError(false);
      }, 2000);
    }
  }
  const [openAlert, setOpenAlert] = useState(false);
  const [postError, setPostError] = useState(false);

  const getFilteredDataAndSave = async (values, setSubmitting) => {
    try {
      const data = {
        RecordID: getQuoteHeaderData.RecordID,
        CompanyCode: getQuoteHeaderData.CompanyCode,
        UserID: user.id,
        FromDate: sunday,
        ToDate: saturday,
        Description: "",
        Name: getQuoteHeaderData.Name,
        Address1: getQuoteHeaderData.Address1,
        Address2: getQuoteHeaderData.Address2,
        City: getQuoteHeaderData.City,
        State: getQuoteHeaderData.State,
        Zip: getQuoteHeaderData.Zip,
        EmailID: getQuoteHeaderData.EmailID,
        Mobile: getQuoteHeaderData.Mobile,
        Provider: getQuoteHeaderData.Provider,
        Salesrepresentative: getQuoteHeaderData.Salesrepresentative,
        PriceLevel: getQuoteHeaderData.PriceLevel,
        CustomerName: "",
        CustomerNumber: "",
      };

      const response = await dispatch(quoteInfoData({ data }));
      if (response.payload.status === "Y") {
        setSubmitting(false);
        const filterData = {
          filterType: "Q",
          headerRecordID: response.payload.RecordId.toString(),
          Company: {
            Attribute: "Company",
            Option: "",
            Value: "",
          },
          Brand: {
            Attribute: "Brand",
            Option: "",
            Value: JSON.stringify(values.brand),
          },
          Commodity: {
            Attribute: "Commodity",
            Option: "",
            Value: JSON.stringify(values.com),
          },
          AlternativeClass: {
            Attribute: "AlternativeClass",
            Option: "",
            Value: JSON.stringify(values.alt),
          },
          Vendor: {
            Attribute: "Vendor",
            Option: "",
            Value: JSON.stringify(values.vendor),
          },
          Type: {
            Attribute: "Type",
            Option: "",
            Value: JSON.stringify(values.fsfz),
          },
          SecondaryClass: {
            Attribute: "SecondaryClass",
            Option: "",
            Value: JSON.stringify(values.secondary),
          },
          Class: {
            Attribute: "Class",
            Option: "",
            Value: JSON.stringify(values.classID),
          },
          PriceListID: values.PriceLists,
          AdHocItem: values.adHocItems,
        };
        dispatch(getQuoteFilterData(filterData));
        setOpenAlert(true);

        // clearQuotePriceList();
      } else {
        setSubmitting(false);
        setOpenAlert(true);
        setPostError(true);
      }
    } catch (e) {
      console.log("🚀 ~ priceListSaveFn ~ e:", e);
    }
  };

  const [openAlert2, setOpenAlert2] = useState(false);
  const [postError2, setPostError2] = useState(false);

  const priceBookLevel1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const clearQuotePriceList = () => {
    dispatch(quoteClearState());
    dispatch(quoteClearState2());
  };

  const [openAlert3, setOpenAlert3] = useState(false);
  const [postError3, setPostError3] = useState(false);

  const [openAlert4, setOpenAlert4] = useState(false);
  const [postError4, setPostError4] = useState(false);
  const [isClear, setIsClear] = useState(false);

  const clearFilter = async (setFieldValue) => {
    const data = {
      QuotationRecordId: getQuoteHeaderData.RecordID,
      PriceListID: 0,
      Type: "Q",
    };
    const response = await dispatch(priceListClearFilter({ data }));
    if (response.payload.status === "Y") {
      setOpenAlert4(true);
      setFieldValue("brand", []);
      setFieldValue("com", []);
      setFieldValue("alt", []);
      setFieldValue("vendor", []);

      setFieldValue("fsfz", []);
      setFieldValue("classID", []);
      setFieldValue("secondary", []);
      clearQuotePriceList();
    } else {
      setOpenAlert4(true);
      setPostError4(true);
    }
  };

  const [isRemoveItem, setIsRemoveItem] = useState(false);
  const [openAlert6, setOpenAlert6] = useState(false);
  const [postError6, setPostError6] = useState(false);
  const [deleteID, setDeleteID] = useState(0);
  const itemDeleteFn = async (id) => {
    const data = {
      RecordID: deleteID,
      priceListID: "0",
      quotationRecordID: getQuoteHeaderData.RecordID.toString(),
      filterType: "Q",
      itemNo: "",
      printSequence: "",
      printItem: "",
      comment: "",
    };

    const response = await dispatch(DeleteAdHocItem({ data }));
    if (response.payload.status === "Y") {
      dispatch(
        getQuoteItemsAndFiltersget3({
          data: { RecordID: getQuoteHeaderData.RecordID.toString() },
        })
      );
      setPostError6(false);
      setOpenAlert6(true);
      setDeleteID(0);
    } else {
      setOpenAlert6(true);
      setPostError6(true);
      setDeleteID(0);
    }
  };
  return (
    <Container>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box className="breadcrumb">
          <Breadcrumb
            routeSegments={[{ name: "New Prospect" }, { name: "Quote" }]}
          />
        </Box>
        <Box display="flex" justifyContent="flex-end" gap={1}>
          {params.mode ==="view" ?(
             <Button
             variant="contained"
             color="info"
             size="small"
             startIcon={<ArrowBackIcon size="small" />}
             onClick={() =>
               navigate("/pages/pricing-portal/saved-quote-list")
             }
           >
             Back
           </Button>
          ):(
            <Button
            variant="contained"
            color="info"
            size="small"
            startIcon={<ArrowBackIcon size="small" />}
            onClick={() =>
              navigate("/pages/pricing-portal/new-quote/new", {state: { headerID: state.headerID } })
            }
          >
            Back
          </Button>
          )}
         
        </Box>
      </Box>

      {getQuteFiltStatus === "fulfilled" && !getQuteFiltLoading ? (
        <Formik
          initialValues={{
            brand: JSON.parse(getQuteFiltData.Brand.Value),
            com: JSON.parse(getQuteFiltData.Commodity.Value),
            alt: JSON.parse(getQuteFiltData.AlternativeClass.Value),
            vendor: JSON.parse(getQuteFiltData.Vendor.Value),
            fsfz: JSON.parse(getQuteFiltData.Type.Value),
            classID: JSON.parse(getQuteFiltData.Class.Value),
            secondary: JSON.parse(getQuteFiltData.SecondaryClass.Value),
            PriceLists: getQuteFiltData.PriceListID,
            adHocItems: [],
          }}
          validate={(values) => {
            const errors = {};
            // Check if at least one filter array has data (ignore other fields like `name`, `description`)
            const filters = [
              "brand",
              "com",
              "alt",
              "vendor",
              "fsfz",
              "classID",
              "secondary",
              "PriceLists",
              "adHocItems",
            ];
            const hasData = filters.some((filter) => values[filter].length > 0);
            if (!hasData) {
              errors.filters =
                "At least one filter or Ad Hoc must have selected filter/item";
            }
            return errors;
          }}
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              getFilteredDataAndSave(values, setSubmitting);
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
              <Box>
                <SimpleCard>
                  <Box
                    display="grid"
                    gridTemplateColumns="repeat(3, minmax(0, 1fr))"
                    alignItems={"center"}
                  >
                    <Stack direction={"row"} sx={{ gridColumn: "span 2" }}>
                      <RadioGroup
                        row
                        name="week"
                        value={isNextWeek}
                        onChange={toggleWeek}
                      >
                        <FormControlLabel
                          sx={{ height: 40 }}
                          value={false}
                          control={<Radio />}
                          label="Current Week"
                        />
                        <FormControlLabel
                          sx={{ height: 40 }}
                          value={true}
                          control={<Radio />}
                          label="Next Week"
                        />
                      </RadioGroup>
                      <Typography
                        variant="caption"
                        align="left"
                        alignItems="center"
                        alignSelf="center"
                        ml={5}
                      >
                        {formatedDate}
                      </Typography>
                    </Stack>

                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      justifyContent={"flex-end"}
                      gap={1}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            // checked={isChecked} // Controlled checkbox state
                            // onChange={handleCheckboxChange} // Update state on change
                            sx={{
                              color: "#174c4f",
                              "&.Mui-checked": {
                                color: "#174c4f",
                              },
                            }}
                          />
                        }
                        label="Show Price"
                      />
                      <Stack direction="row" alignItems={"flex-end"}>
                        <Tooltip title="PDF" placement="top">
                          <CustomIconButton
                            // disabled={true}
                            sx={{
                              bgcolor: theme.palette.primary.main, // Use sx for styling
                              color: "white", // Ensure icon button text color is visible
                              "&:hover": {
                                bgcolor: theme.palette.primary.dark, // Darken color on hover
                              },
                            }}
                            aria-label="pdf"
                            onClick={() => toast.error("Under Construction")}
                          >
                            <FaFilePdf style={{ fontSize: "21px" }} />
                          </CustomIconButton>
                        </Tooltip>

                        <Tooltip title="Excel" placement="top">
                          <CustomIconButton
                            bgcolor={theme.palette.success.main}
                            aria-label="excel"
                            onClick={() => toast.error("Under Construction")}
                          >
                            <SiMicrosoftexcel style={{ fontSize: "21px" }} />
                          </CustomIconButton>
                        </Tooltip>

                        <Tooltip title="Print" placement="top">
                          <CustomIconButton
                            bgcolor={theme.palette.warning.main}
                            onClick={() => toast.error("Under Construction")}
                            component="a"
                            aria-label="print"
                            // href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <IoMdPrint style={{ fontSize: "21px" }} />
                          </CustomIconButton>
                        </Tooltip>

                        <Tooltip title="Mail" placement="top">
                          <CustomIconButton
                            bgcolor={theme.palette.error.main}
                            aria-label="mail"
                            // disabled={true}
                            onClick={handleMailNavigate}
                          >
                            <IoIosMailOpen style={{ fontSize: "21px" }} />
                          </CustomIconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </Box>
                  <Box
                    display="grid"
                    gap="20px"
                    padding={1}
                    gridTemplateColumns="repeat(2, minmax(0, 1fr))"
                    sx={{
                      "& > div": {
                        gridColumn: isNonMobile ? undefined : "span 2",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        gridColumn: "span 1",
                        fontFamily: "inherit",
                        fontWeight: "600",
                        marginLeft: 1,
                      }}
                    >
                      Filters
                    </Typography>
                    <Stack
                      sx={{ p: 0, m: 0 }}
                      direction="row"
                      justifyContent={"flex-end"}
                      gap={2}
                    >
                      {" "}
                      {errors.filters && (
                        <div style={{ color: "red" }}>{errors.filters}</div>
                      )}
                    </Stack>
                    <FormikCustomAutocompleteMulti
                      name="brand"
                      id="brand"
                      value={values.brand}
                      onChange={(event, newValue) =>
                        setFieldValue("brand", newValue)
                      }
                      label="Brand"
                      url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=Brand`}
                    />

                    <FormikCustomAutocompleteMulti
                      name="com"
                      id="com"
                      value={values.com}
                      onChange={(event, newValue) =>
                        setFieldValue("com", newValue)
                      }
                      label="Com || Cat"
                      url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=Commodity`}
                    />

                    <FormikCustomAutocompleteMulti
                      name="alt"
                      id="alt"
                      value={values.alt}
                      onChange={(event, newValue) =>
                        setFieldValue("alt", newValue)
                      }
                      label="Alternative Class"
                      url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=AlternativeClass`}
                    />

                    <FormikCustomAutocompleteMulti
                      name="vendor"
                      id="vendor"
                      value={values.vendor}
                      onChange={(event, newValue) =>
                        setFieldValue("vendor", newValue)
                      }
                      label="Vendor"
                      url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=Vendor`}
                    />

                    <FormikCustomAutocompleteMulti
                      name="fsfz"
                      id="fsfz"
                      value={values.fsfz}
                      onChange={(event, newValue) =>
                        setFieldValue("fsfz", newValue)
                      }
                      label="Fs || Fz"
                      url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=Type`}
                    />

                    <FormikCustomAutocompleteMulti
                      name="classID"
                      id="classID"
                      value={values.classID}
                      onChange={(event, newValue) =>
                        setFieldValue("classID", newValue)
                      }
                      label="ClassID"
                      url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=ClassId`}
                    />

                    <FormikCustomAutocompleteMulti
                      name="secondary"
                      id="secondary"
                      value={values.secondary}
                      onChange={(event, newValue) =>
                        setFieldValue("secondary", newValue)
                      }
                      label="Secondary Class"
                      url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=SecondaryClass`}
                    />

                    {/* <Divider sx={{gridColumn:"span 2", borderBottomWidth: 2, borderColor: 'info.main'}} /> */}
                    <Typography
                      sx={{
                        gridColumn: "span 2",
                        fontFamily: "inherit",
                        fontWeight: "600",
                        marginLeft: 1,
                      }}
                    >
                      Price List
                    </Typography>
                    <FormikCustomAutocompleteMultiPriceList
                      name="PriceLists"
                      id="PriceLists"
                      value={values.PriceLists}
                      onChange={(event, newValue) =>
                        setFieldValue("PriceLists", newValue)
                      }
                      label="Price Lists"
                      url={`${process.env.REACT_APP_BASE_URL}PriceListItems/GetPrictListList?CompanyRecordID=${user.companyID}`}
                    />

                    <FormikCustomAutocompleteMultiAdHocItems
                      name="adHocItems"
                      id="adHocItems"
                      value={values.adHocItems}
                      onChange={(event, newValue) =>
                        setFieldValue("adHocItems", newValue)
                      }
                      label="Ad Hoc Items"
                      url={`${process.env.REACT_APP_BASE_URL}ItemMaster/GetItemMasterList`}
                    />
                  </Box>

                  {/* <Stack direction="row" justifyContent="end" gap={2} mb={1}>
                    <Button
                      disabled={isSubmitting}
                      variant="contained"
                      color="info"
                      type="submit"
                    >
                      Apply Filters & Save
                    </Button>

                    <Button
                      variant="contained"
                      color="info"
                      disabled={
                        params.mode == "copy"
                          ? true
                          : getQuoteHeaderData.RecordID &&
                            getQuoteFilterItemData.length > 0
                          ? false
                          : true
                      }
                      onClick={() => setIsClear(true)}
                    >
                      Clear Filters
                    </Button>
                  </Stack> */}

                  <Box
                    sx={{
                      height: 400,

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
                        toolbar: () => {
                          return (
                            <GridToolbarContainer
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                width: "100%",
                                padding: "10px",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "flex-end",
                                  alignItems: "center",
                                  gap: 2,
                                  width: "100%",
                                }}
                              >
                                <GridToolbarQuickFilter />
                                {/* <Stack direction="row" justifyContent="end" gap={2} mb={1}> */}
                                <Button
                                  disabled={isSubmitting}
                                  variant="contained"
                                  color="info"
                                  type="submit"
                                >
                                  Apply Filters & Save
                                </Button>

                                <Button
                                  variant="contained"
                                  color="info"
                                  disabled={
                                    params.mode == "copy"
                                      ? true
                                      : getQuoteHeaderData.RecordID &&
                                        getQuoteFilterItemData.length > 0
                                      ? false
                                      : true
                                  }
                                  onClick={() => setIsClear(true)}
                                >
                                  Clear Filters
                                </Button>
                                {/* </Stack> */}
                              </Box>
                            </GridToolbarContainer>
                          );
                        },
                      }}
                      rowHeight={30}
                      rows={getQuoteFilterItemData}
                      loading={getQuoteFilterItemLoading}
                      columns={columns}
                      disableSelectionOnClick
                      disableRowSelectionOnClick
                      getRowId={(row) => row.RecordId}
                      initialState={{
                        pagination: { paginationModel: { pageSize: 100 } },
                      }}
                      pageSizeOptions={[20, 50, 100]}
                      columnVisibilityModel={{
                        item_key: true,
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
                  <PriceGroupAlertApiDialog
                    logo={`data:image/png;base64,${user.logo}`}
                    open={isItemExists}
                    error={true}
                    message={
                      addPriceListData
                        ? `${addPriceListData.Item_Number} Oops! This item is already exists in quote.`
                        : "Please select item!"
                    }
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
                          color="info"
                          size="small"
                          onClick={() => {
                            setIsItemExists(false);
                            setAddPriceListData(null);
                          }}
                          sx={{ height: 25 }}
                        >
                          Close
                        </Button>
                      </Box>
                    }
                  />

                  <PriceGroupAlertApiDialog
                    logo={`data:image/png;base64,${user.logo}`}
                    open={isClear}
                    error={false}
                    message={`Are you sure you want to Clear filter and Item ?`}
                    Actions={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          width: "100%",
                          gap: 1,
                        }}
                      >
                        <Button
                          variant="contained"
                          color="info"
                          size="small"
                          onClick={() => {
                            clearFilter(setFieldValue);
                            setIsClear(false);
                          }}
                          sx={{ height: 25 }}
                        >
                          Yes
                        </Button>
                        <Button
                          variant="contained"
                          color="info"
                          size="small"
                          onClick={() => {
                            setIsClear(false);
                          }}
                          sx={{ height: 25 }}
                        >
                          No
                        </Button>
                      </Box>
                    }
                  />

                  <PriceGroupAlertApiDialog
                    logo={`data:image/png;base64,${user.logo}`}
                    open={openAlert}
                    error={postError}
                    message={
                      postError ? "Something Went Wrong" : "Saved Successfully"
                    }
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
                          color="info"
                          size="small"
                          onClick={() => {
                            setOpenAlert(false);
                            setTimeout(() => {
                              setPostError(false);
                            }, 1000);
                            // setPostError(false)
                          }}
                          sx={{ height: 25 }}
                        >
                          Close
                        </Button>
                      </Box>
                    }
                  />

                  <PriceGroupAlertApiDialog
                    logo={`data:image/png;base64,${user.logo}`}
                    open={openAlert2}
                    error={postError2}
                    message={
                      postError2 ? "Something Went Wrong" : "Saved Successfully"
                    }
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
                          color="info"
                          size="small"
                          onClick={() => {
                            setOpenAlert2(false);
                            setTimeout(() => {
                              setPostError2(false);
                            }, 1000);
                            // setPostError(false)
                          }}
                          sx={{ height: 25 }}
                        >
                          Close
                        </Button>
                      </Box>
                    }
                  />

                  <PriceGroupAlertApiDialog
                    logo={`data:image/png;base64,${user.logo}`}
                    open={openAlert4}
                    error={postError4}
                    message={
                      postError4
                        ? "Something Went Wrong"
                        : "Filters And Items Cleared Successfully"
                    }
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
                          color="info"
                          size="small"
                          onClick={() => {
                            setOpenAlert4(false);
                            setTimeout(() => {
                              setPostError4(false);
                            }, 1000);
                            // setPostError(false)
                          }}
                          sx={{ height: 25 }}
                        >
                          Close
                        </Button>
                      </Box>
                    }
                  />

                  <PriceGroupAlertApiDialog
                    logo={`data:image/png;base64,${user.logo}`}
                    open={openAlert3}
                    error={postError3}
                    message={
                      postError3
                        ? "Something Went Wrong"
                        : "Item Added Successfully"
                    }
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
                          color="info"
                          size="small"
                          onClick={() => {
                            setOpenAlert3(false);
                            setTimeout(() => {
                              setPostError3(false);
                            }, 1000);
                            // setPostError(false)
                          }}
                          sx={{ height: 25 }}
                        >
                          Close
                        </Button>
                      </Box>
                    }
                  />
                </SimpleCard>
                <PriceGroupAlertApiDialog
                  logo={`data:image/png;base64,${user.logo}`}
                  key={23131}
                  open={openAlert6}
                  error={postError6}
                  message={"Item removed and Quote saved successfully"}
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
                        color="info"
                        size="small"
                        onClick={() => {
                          setOpenAlert6(false);
                        }}
                        sx={{ height: 25 }}
                      >
                        Close
                      </Button>
                    </Box>
                  }
                />

                <QuoteTempAlertApiDialog
                  logo={`data:image/png;base64,${user.logo}`}
                  open={isRemoveItem}
                  //  tittle={values.itemDescription}
                  error={true}
                  message={`Are you sure you want to remove Item ?`}
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
                          setIsRemoveItem(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        sx={{ height: 25 }}
                        variant="contained"
                        color="info"
                        size="small"
                        onClick={() => {
                          itemDeleteFn(values);
                          setIsRemoveItem(false);
                        }}
                      >
                        Confirm
                      </Button>
                    </Box>
                  }
                />
              </Box>{" "}
            </form>
          )}
        </Formik>
      ) : (
        false
      )}
    </Container>
  );
}
