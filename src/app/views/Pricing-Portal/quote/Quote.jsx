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
} from "@mui/material";
import lodash from "lodash";
import { Add } from "@mui/icons-material";
import { Box, styled } from "@mui/material";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { Breadcrumb, SimpleCard } from "app/components";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useTheme } from "@emotion/react";
import { SiMicrosoftexcel } from "react-icons/si";
import { FaFilePdf } from "react-icons/fa6";
import { IoIosMailOpen } from "react-icons/io";
import { IoMdPrint } from "react-icons/io";
import React, { useEffect, useState } from "react";

// CUSTOM UTILS LIBRARY FUNCTIONS

import useAuth from "app/hooks/useAuth";

import { useLocation, useNavigate } from "react-router-dom";
import CustomAutocomplete, {
  QuoteTempSingleAutocomplete,
  SingleAutocomplete,
} from "app/components/AutoComplete";
import { useDispatch, useSelector } from "react-redux";
import {
  postBuildData,
  postQutoeData,
  quoteFilterAndItemPostData,
  updateQuoteData,
} from "app/redux/slice/postSlice";
import {
  addQuoteItemData,
  getBuildPriceBookData,
  getQuoteBookData,
  getQuoteFilterData,

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
} from "app/components/LoadindgDialog";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { themeColors } from "app/components/baseTheme/themeColors";
import { OptimizedAutocomplete } from "app/components/SingleAutocompletelist";



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
const getSaturdayAndSunday  = (date) => {
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const colors = themeColors;
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const quotePriceListData = useSelector(
    (state) => state.priceList.quotePriceData
  );
  console.log(
    "🚀 ~ BuildCustomPriceBook ~ quotePriceListData:",
    quotePriceListData
  );
  const quotePriceListStatus = useSelector(
    (state) => state.priceList.quotePriceStatus
  );
  const quotePriceListMessage = useSelector(
    (state) => state.priceList.quotePriceMessage
  );
  const quotePriceListLoading = useSelector(
    (state) => state.priceList.quotePriceLoading
  );
  const quotePriceListOpenLoading = useSelector(
    (state) => state.priceList.quotePriceOpenLoading
  );
  const quotePriceListError = useSelector(
    (state) => state.priceList.quoteError
  );

  const getQuoteFilterItemStatus = useSelector(
    (state) => state.getSlice.getQuoteFilterItemStatus
  );
  const getQuoteFilterItemLoading = useSelector(
    (state) => state.getSlice.getQuoteFilterItemLoading
  );
  const getQuoteFilterItemData = useSelector(
    (state) => state.getSlice.getQuoteFilterItemData
  );
  console.log(
    "🚀 ~ BuildCustomPriceBook ~ getQuoteFilterItemData:",
    getQuoteFilterItemData
  );
  const getQuoteFilterItemError = useSelector(
    (state) => state.getSlice.getQuoteFilterItemError
  );

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setCustomName(
      location.state.templateName ? location.state.templateName : "Custom Name"
    );
    setOpen(true);
  };

  const handleMailNavigate = () => {
    navigate("/sent-mail", { state: { screenName: "Quote" } });
  };

  async function getBuildPriceTemData(templateId) {
    const response = await dispatch(
      getQuoteBookData({
        userID: user.id,
        templateID: templateId,
      })
    );
    if (response.payload.Status === "Y") {
      if (response.payload.Data.CompanyName) {
        setSelectedCompanyOptions(
          JSON.parse(response.payload.Data.CompanyName)
        );
      }

      setSelectedCustomerOptions(JSON.parse(response.payload.Data.Customer));

      setSelectedBrandOptions(JSON.parse(response.payload.Data.Brand));
      setSelectedAltOptions(JSON.parse(response.payload.Data.AltClass));
      setSelectedComOptions(JSON.parse(response.payload.Data.Commodity));
      setSelectedSecondaryOptions(
        JSON.parse(response.payload.Data.SecondaryClass)
      );
      setSelectedItemNoOptions(JSON.parse(response.payload.Data.Item));
      setSelectedVendorOptions(JSON.parse(response.payload.Data.Vendor));
      setSelectedFsFzOptions(JSON.parse(response.payload.Data.Type));
      setSelectedClassIDOptions(JSON.parse(response.payload.Data.Class));
      setIsChecked(response.payload.Data.ShowPrice === "Y" ? true : false);
      setHeaderName(response.payload.Data.Header);
      setSalesRepName(response.payload.Data.SalesRepresentativeName);
    }
  }

  //======================= ADD PRICE LIST ===================================//
  const [addPriceListData, setAddPriceListData] = useState();
  const handleSelectionAddPriceListData = (newValue) => {
    setAddPriceListData(newValue);
  };

  //=======================TEMPLATE===================================//
  const [selectedTemplateOptions, setSelectedTemplateOptions] = useState(null);

  const handleSelectionTemplateChange = (newValue) => {
    setSelectedTemplateOptions(newValue);
    if (newValue) {
      getBuildPriceTemData(newValue.Recid);
    }
  };

  const [isItemExistsError, setIsItemExistsError] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isNextWeek, setIsNextWeek] = useState(false);
  useEffect(() => {
    dispatch(quoteClearState());
    if (location.state.templateID) {
      setSelectedTemplateOptions({
        Recid: location.state.templateID,
        TemplateName: location.state.templateName,
      });
    }
    getBuildPriceTemData(
      location.state.templateID ? location.state.templateID : "-1"
    );
    const today = new Date();
    setCurrentDate(today);
    // dispatch(getQuotePriceList({}));
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
      formatedDate: `Pricing Week (SUN)${formatDateLong(sunday)} TO (SAT)${formatDateLong(saturday)}`, // Full format Pricing Week (SUN)(MM/DD/YYYY) TO (SAT)(MM/DD/YYYY)
    };
  };

  const toggleWeek = () => {
    setIsNextWeek(!isNextWeek); // Toggle between next and current week
  };

  const { shortSunday, shortSaturday, sunday, saturday, formatedDate } =
    getWeekDates(); // Get formatted Saturday and Sunday dates

  //=======================COMPANY===================================//
  const [selectedCompanyOptions, setSelectedCompanyOptions] = useState(
    user.companyID == 5
      ? { RecordID: 5, Name: "Plymouth" }
      : user.companyID == 6
        ? {
            RecordID: 6,
            Name: "S & J Food Distributors",
          }
        : {
            RecordID: 7,
            Name: "Nicky USA",
          }
  );

  const handleSelectionCompanyChange = (newValue) => {
    setSelectedCompanyOptions(newValue);
  };
  //=======================CUSTOMER===================================//
  const [selectedCustomerOptions, setSelectedCustomerOptions] = useState(null);

  const handleSelectionCustomerChange = (newValue) => {
    setSelectedCustomerOptions(newValue);
  };

  //=======================BRAND===================================//
  const [selectedBrandOptions, setSelectedBrandOptions] = useState([]);

  const handleSelectionBrandChange = (newValue) => {
    setSelectedBrandOptions(newValue);
  };

  //=======================Alternative Class===================================//
  const [selectedAltOptions, setSelectedAltOptions] = useState([]);

  const handleSelectionAltChange = (newValue) => {
    setSelectedAltOptions(newValue);
  };
  //=======================Com /Cat===================================//
  const [selectedComOptions, setSelectedComOptions] = useState([]);

  const handleSelectionComChange = (newValue) => {
    setSelectedComOptions(newValue);
  };

  //=======================Secondary Class===================================//
  const [selectedSecondaryOptions, setSelectedSecondaryOptions] = useState([]);

  const handleSelectionSecondaryChange = (newValue) => {
    setSelectedSecondaryOptions(newValue);
  };

  //=======================Item ===================================//
  const [selectedItemNoOptions, setSelectedItemNoOptions] = useState([]);

  const handleSelectionItemNoChange = (newValue) => {
    setSelectedItemNoOptions(newValue);
  };

  //=======================Vendor ===================================//
  const [selectedVendorOptions, setSelectedVendorOptions] = useState([]);

  const handleSelectionVendorChange = (newValue) => {
    setSelectedVendorOptions(newValue);
  };

  //=======================FSFZ ===================================//
  const [selectedFsFzOptions, setSelectedFsFzOptions] = useState([]);

  const handleSelectionFsFzChange = (newValue) => {
    setSelectedFsFzOptions(newValue);
  };

  //=======================CLASSID ===================================//
  const [selectedClassIDOptions, setSelectedClassIDOptions] = useState([]);

  const handleSelectionClassIDChange = (newValue) => {
    setSelectedClassIDOptions(newValue);
  };

  const [isChecked, setIsChecked] = useState(true);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleChange = (event) => {
    setCustomName(event.target.value); // Update state on input change
  };
  const [isItemExists, setIsItemExists] = useState(false);

  const [CustomName, setCustomName] = useState("CustomName");
  const [headerName, setHeaderName] = useState("");
  const [salesRepName, setSalesRepName] = useState("");
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  console.log(
    "🚀 ~ BuildCustomPriceBook ~ rowSelectionModel:",
    rowSelectionModel
  );
  const [rowSelectionModelRows, setRowSelectionModelRows] = React.useState([]);

  //=======================================================================//
  // ********************** COLUMN AND ROWS ********************** //
  const columns = [
    {
      headerName: "Item Number",
      field: "Item_Number",
      width: "150",
      align: "left",
      headerAlign: "left",
    },
    {
      headerName: "Item Description",
      field: "Item_Description",
      minWidth: "350",
      flex: 1,
      align: "left",
      headerAlign: "left",
    },
    {
      headerName: "Add Hoc Item",
      field: "AdHocItem",
      minWidth: "100",
      align: "left",
      headerAlign: "left",
      renderCell: (param) => {
        return param.row.AdHocItem === "Y" ? "Yes" : "No";
      },
    },
    {
      field: "Action",
      headerName: "Attributes",
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
            <Button
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
                navigate("./item-attributes", {
                  state: {
                    // id: state.id,
                    itemNumber: param.row.Item_Number,
                    itemDesc: param.row.Item_Description,
                  },
                })
              }
              startIcon={<ModeEditOutlineIcon size="small" />}
            >
              Edit
            </Button>
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
          <OptimizedAutocomplete
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
            onClick={() => {
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
                dispatch(
                  addQuoteItemData({ ...addPriceListData, AdHocItem: "Y" })
                );
                setAddPriceListData(null);
              } else {
                setIsItemExistsError(true);
                setTimeout(() => {
                  setIsItemExistsError(false);
                }, 2000);
              }
            }}
            startIcon={<Add size="small" />}
          >
            Ad Hoc Item
          </Button>
        </Box>
      </GridToolbarContainer>
    );
  }
  // const fnQuotesave = async () => {
  //   const data = {
  //     recid: location.state.templateID,
  //     UserId: user.id,
  //     CompanyName: JSON.stringify(selectedCompanyOptions),
  //     Customer: JSON.stringify(selectedCustomerOptions),
  //     Brand: JSON.stringify(selectedBrandOptions),
  //     Commodity: JSON.stringify(selectedComOptions),
  //     Vendor: JSON.stringify(selectedVendorOptions),
  //     Type: JSON.stringify(selectedFsFzOptions),
  //     Class: JSON.stringify(selectedClassIDOptions),
  //     AltClass: JSON.stringify(selectedAltOptions),
  //     SecondaryClass: JSON.stringify(selectedSecondaryOptions),
  //     Item: JSON.stringify(selectedItemNoOptions),
  //     ShowPrice: isChecked ? "Y" : "N",
  //     CustomName: CustomName,
  //     SalesRepresentativeName: salesRepName,
  //     Header: headerName,
  //   };

  //   if (location.state.templateID) {
  //     const response = await dispatch(updateQuoteData({ data }));
  //     if (response.payload.Status === "Y") {
  //       toast.success("Template Updated successfully");
  //       setOpen(false);
  //       setCustomName("");
  //     } else {
  //       setOpen(false);
  //       setCustomName("");
  //       toast.error("Something went wrong");
  //     }
  //   } else {
  //     const response = await dispatch(postQutoeData({ data }));
  //     if (response.payload.Status === "Y") {
  //       toast.success("Template added successfully");
  //       setOpen(false);
  //       setCustomName("");
  //     } else {
  //       setOpen(false);
  //       setCustomName("");
  //       toast.error("Something went wrong");
  //     }
  //   }
  // };

  const [openAlert, setOpenAlert] = useState(false);
  const [postError, setPostError] = useState(false);
  const fnQuotesave = async () => {
    const data = {
      recid: location.state.templateID,
      UserId: user.id,
      CompanyName: JSON.stringify(selectedCompanyOptions),
      Customer: JSON.stringify(selectedCustomerOptions),
      Brand: JSON.stringify(selectedBrandOptions),
      Commodity: JSON.stringify(selectedComOptions),
      Vendor: JSON.stringify(selectedVendorOptions),
      Type: JSON.stringify(selectedFsFzOptions),
      Class: JSON.stringify(selectedClassIDOptions),
      AltClass: JSON.stringify(selectedAltOptions),
      SecondaryClass: JSON.stringify(selectedSecondaryOptions),
      Item: JSON.stringify(selectedItemNoOptions),
      ShowPrice: isChecked ? "Y" : "N",
      CustomName: CustomName,
      SalesRepresentativeName: salesRepName,
      Header: headerName,
    };

    if (location.state.templateID) {
      // Check if the CustomName is the same as the templateName in location.state
      if (CustomName === location.state.templateName) {
        const response = await dispatch(updateQuoteData({ data }));
        if (response.payload.Status === "Y") {
          // toast.success("Template Updated successfully");
          setOpen(false);
          setCustomName("");
          setOpenAlert(true);
        } else {
          setOpenAlert(true);
          setPostError(true);
          setOpen(false);
          setCustomName("");
          // toast.error("Something went wrong");
        }
      } else {
        // Handle the case where CustomName differs from templateName (post a new template)
        const response = await dispatch(postQutoeData({ data }));
        if (response.payload.Status === "Y") {
          // toast.success("Template added successfully");
          setOpen(false);
          setCustomName("");
          setOpenAlert(true);
        } else {
          setOpenAlert(true);
          setPostError(true);
          setOpen(false);
          setCustomName("");
          // toast.error("Something went wrong");
        }
      }
    } else {
      // If there's no templateID, always post a new template
      const response = await dispatch(postQutoeData({ data }));
      if (response.payload.Status === "Y") {
        // toast.success("Template added successfully");
        setOpen(false);
        setCustomName("");
        setOpenAlert(true);
      } else {
        setOpenAlert(true);
        setPostError(true);
        setOpen(false);
        setCustomName("");
        // toast.error("Something went wrong");
      }
    }
  };

  const handleProcess = async () => {
    try {
      const filterparameters = JSON.stringify({
        CompanyName: "Company",
        customer: "Customer",
        brand: selectedBrandOptions.map((item) => item.Name).join(","),
        commodity: selectedComOptions.map((item) => item.Name).join(","),
        vendor: selectedVendorOptions.map((item) => item.Name).join(","),
        type: selectedFsFzOptions.map((item) => item.Name).join(","),
        class: selectedClassIDOptions.map((item) => item.Name).join(","),
        altClass: selectedAltOptions.map((item) => item.Name).join(","),
        secondaryClass: selectedSecondaryOptions
          .map((item) => item.Name)
          .join(","),
        item: selectedItemNoOptions.map((item) => item.Name).join(","),
        showPrice: isChecked ? "Y" : "N",
      });
      console.log("🚀 ~ handleProcess ~ filterparameters:", filterparameters);
      dispatch(
        getQuotePriceList({
          CompanyCode: user.CompanyCode,
          FromDate: sunday,
          ToDate: saturday,
          CustomerNumber: selectedCustomerOptions
            ? selectedCustomerOptions.Code
            : "",
          PriceBooktype: "Quote Price Book",
          filterparameters,
        })
      ).then(() => {
        dispatch(updateDelayedQuotePriceBook());
      });
    } catch (error) {
      toast.error(error.toString());
      // toast.error(
      //   "Please fill in at least one of the required fields (e.g., Company, Customer, Brand, etc.)"
      // );
    }
  };

  const getFilteredData = async (values) => {
    const filterData = {
      Company: {
        Attribute: "Company",
        Option: "",
        Value: JSON.stringify(selectedCompanyOptions),
      },
      Brand: {
        Attribute: "Brand",
        Option: "",
        Value: JSON.stringify(selectedBrandOptions),
      },
      Commodity: {
        Attribute: "Commodity",
        Option: "",
        Value: JSON.stringify(selectedComOptions),
      },
      AlternativeClass: {
        Attribute: "AlternativeClass",
        Option: "",
        Value: JSON.stringify(selectedAltOptions),
      },
      Vendor: {
        Attribute: "Vendor",
        Option: "",
        Value: JSON.stringify(selectedVendorOptions),
      },
      Type: {
        Attribute: "Type",
        Option: "",
        Value: JSON.stringify(selectedFsFzOptions),
      },
      SecondaryClass: {
        Attribute: "SecondaryClass",
        Option: "",
        Value: JSON.stringify(selectedSecondaryOptions),
      },
      Class: {
        Attribute: "Class",
        Option: "",
        Class: JSON.stringify(selectedClassIDOptions),
      },
    };

    try {
      const res = await dispatch(getQuoteFilterData(filterData));
      if (res.payload.status === "Y") {
        const allRowIds = res.payload.data.map((row) => row.Item_Number);
        setRowSelectionModel(allRowIds);
      }
    } catch (e) {
      console.log("🚀 ~ priceListSaveFn ~ e:", e);
    }
  };

  const [openAlert2, setOpenAlert2] = useState(false);
  const [postError2, setPostError2] = useState(false);
  const fnQuotesave2 = async () => {
    const filterArray = getQuoteFilterItemData.filter((v) =>
      rowSelectionModel.includes(v.Item_Number)
    );
    const data = {
      filterConditions: {
        Company: {
          Attribute: "Company",
          Option: "",
          Value: JSON.stringify(selectedCompanyOptions),
        },
        Brand: {
          Attribute: "Brand",
          Option: "",
          Value: JSON.stringify(selectedBrandOptions),
        },
        Commodity: {
          Attribute: "Commodity",
          Option: "",
          Value: JSON.stringify(selectedComOptions),
        },
        AlternativeClass: {
          Attribute: "AlternativeClass",
          Option: "",
          Value: JSON.stringify(selectedAltOptions),
        },
        Vendor: {
          Attribute: "Vendor",
          Option: "",
          Value: JSON.stringify(selectedVendorOptions),
        },
        Type: {
          Attribute: "Type",
          Option: "",
          Value: JSON.stringify(selectedFsFzOptions),
        },
        SecondaryClass: {
          Attribute: "SecondaryClass",
          Option: "",
          Value: JSON.stringify(selectedSecondaryOptions),
        },
        Class: {
          Attribute: "Class",
          Option: "",
          Class: JSON.stringify(selectedClassIDOptions),
        },
      },
      filterItems: filterArray,
    };

    // If there's no templateID, always post a new template
    const response = await dispatch(
      quoteFilterAndItemPostData({ data, RecordId: location.state.headerID })
    );
    console.log("🚀 ~ fnQuotesave2 ~ response:", response);
    if (response.payload.status === "Y") {
      handleProcess();
      setOpenAlert2(true);
    } else {
      setOpenAlert2(true);
      setPostError2(true);
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
            routeSegments={[
              { name: "Quote" },
              { name: "Prospect Info" },
              { name: "New Quote" },
            ]}
          />
        </Box>
        <Box display="flex" justifyContent="flex-end"></Box>
      </Box>

      {/* Back Button on the right */}

      <Box>
        <SimpleCard>
          <Box
            display="grid"
            gridTemplateColumns="repeat(3, minmax(0, 1fr))"
            alignItems={"center"}
          >
            <Stack direction={"row"} sx={{ gridColumn: "span 2",}} >
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

            
            {quotePriceListStatus === "fulfilled" ? (
              <Stack
                direction="row"
                alignItems={"flex-end"}
                justifyContent={"center"}
              >
                <PDFDownloadLink
                  document={
                    <QuotePriceListDocument
                      key={`Pricing Week (SUN)${sunday} TO ${saturday}(SAT) - ${isChecked}`}
                      data={quotePriceListData}
                      headerData={{
                        logo: user.homePagelogo, // Replace with the actual path to the logo image
                        customerName: selectedCustomerOptions
                          ? selectedCustomerOptions.Name
                          : "Claus Meats",
                        effectiveDate: formatedDate,
                      }}
                      coverPageData={{
                        logo: user.homePagelogo, // Replace with the actual path to the logo image
                        subtitle1: "Price List for",
                        subtitle2: "Quote Pricelist",
                        effectiveDate: formatedDate,
                        preparedByName: user.name,
                        preparedByPhone: user.userMobile,
                        preparedByEmail: user.email,
                        phone1: user.phone1,
                        phone2: user.phone2,
                        fax: user.fax,
                        coverImg: user.customerCustomPriceBookImg,
                      }}
                      isPrice={isChecked}
                    />
                  }
                  fileName={`${
                    selectedCustomerOptions
                      ? selectedCustomerOptions.Name
                      : "Customer"
                  }_QUOTE_${sunday} TO ${saturday}.pdf`}
                >
                  {({ blob, url, loading, error }) => (
                    <Tooltip title="PDF" placement="top">
                      <CustomIconButton
                        disabled={loading}
                        sx={{
                          bgcolor: theme.palette.primary.main, // Use sx for styling
                          color: "white", // Ensure icon button text color is visible
                          "&:hover": {
                            bgcolor: theme.palette.primary.dark, // Darken color on hover
                          },
                        }}
                        aria-label="pdf"
                      >
                        <FaFilePdf style={{ fontSize: "21px" }} />
                      </CustomIconButton>
                    </Tooltip>
                  )}
                </PDFDownloadLink>

                <Tooltip title="Excel" placement="top">
                  <CustomIconButton
                    bgcolor={theme.palette.success.main}
                    aria-label="excel"
                    onClick={() =>
                      exportToExcelQuotePriceBook({
                        excelData: quotePriceListData,
                        date: formatedDate,
                        customerName: selectedCustomerOptions
                          ? selectedCustomerOptions.Name
                          : "Claus Meats",
                        isPrice: isChecked,
                      })
                    }
                  >
                    <SiMicrosoftexcel style={{ fontSize: "21px" }} />
                  </CustomIconButton>
                </Tooltip>

                <PDFDownloadLink
                  key={`Pricing Week (SUN)${sunday} TO ${saturday}(SAT) - ${isChecked}`}
                  document={
                    <QuotePriceListDocument
                      isPrice={isChecked}
                      data={quotePriceListData}
                      headerData={{
                        logo: user.homePagelogo, // Replace with the actual path to the logo image
                        customerName: selectedCustomerOptions
                          ? selectedCustomerOptions.Name
                          : "Claus Meats",
                        effectiveDate: formatedDate,
                      }}
                      coverPageData={{
                        logo: user.homePagelogo, // Replace with the actual path to the logo image
                        subtitle1: "Price List for",
                        subtitle2: "Quote Pricelist",
                        effectiveDate: formatedDate,
                        preparedByName: user.name,
                        preparedByPhone: user.userMobile,
                        preparedByEmail: user.email,
                        phone1: user.phone1,
                        phone2: user.phone2,
                        fax: user.fax,
                        coverImg: user.customerCustomPriceBookImg,
                      }}
                    />
                  }
                  fileName={`Quote Price Book`}
                >
                  {({ blob, url, loading, error }) => (
                    <Tooltip title="Print" placement="top">
                      <CustomIconButton
                        bgcolor={theme.palette.warning.main}
                        disabled={loading}
                        component="a"
                        aria-label="print"
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IoMdPrint style={{ fontSize: "21px" }} />
                      </CustomIconButton>
                    </Tooltip>
                  )}
                </PDFDownloadLink>

                <Tooltip title="Mail" placement="top">
                  <CustomIconButton
                    bgcolor={theme.palette.error.main}
                    aria-label="mail"
                    onClick={handleMailNavigate}
                  >
                    <IoIosMailOpen style={{ fontSize: "21px" }} />
                  </CustomIconButton>
                </Tooltip>
              </Stack>
            ) : (
              <Stack
                direction="row"
                alignItems={"flex-end"}
                justifyContent={"center"}
              >
                <Tooltip title="PDF" placement="top">
                  <CustomIconButton
                    disabled={true}
                    sx={{
                      bgcolor: theme.palette.primary.main, // Use sx for styling
                      color: "white", // Ensure icon button text color is visible
                      "&:hover": {
                        bgcolor: theme.palette.primary.dark, // Darken color on hover
                      },
                    }}
                    aria-label="pdf"
                  >
                    <FaFilePdf style={{ fontSize: "21px" }} />
                  </CustomIconButton>
                </Tooltip>

                <Tooltip title="Excel" placement="top">
                  <CustomIconButton
                    disabled={true}
                    bgcolor={theme.palette.success.main}
                    aria-label="excel"
                  >
                    <SiMicrosoftexcel style={{ fontSize: "21px" }} />
                  </CustomIconButton>
                </Tooltip>

                <Tooltip title="Print" placement="top">
                  <CustomIconButton
                    bgcolor={theme.palette.warning.main}
                    disabled={true}
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
                    disabled={true}
                    // onClick={handleMailNavigate}
                  >
                    <IoIosMailOpen style={{ fontSize: "21px" }} />
                  </CustomIconButton>
                </Tooltip>
              </Stack>
            )}
          </Box>

          <Box
            display="grid"
            gap="20px"
            padding={1}
            gridTemplateColumns="repeat(2, minmax(0, 1fr))"
            sx={{
              "& > div": {
                gridColumn: isNonMobile ? undefined : "span 4",
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
              justifyContent={"space-between"}
            >
              <QuoteTempSingleAutocomplete
                name="Template"
                id="Template"
                multiple={false}
                // disabled={user.role != "ADMIN"}
                value={selectedTemplateOptions}
                onChange={handleSelectionTemplateChange}
                label="Select Template"
                url={`${process.env.REACT_APP_BASE_URL}Quote/GetQuoteTemplatesList?UserId=${user.id}`}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isChecked} // Controlled checkbox state
                    onChange={handleCheckboxChange} // Update state on change
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
            </Stack>

            {/* <SingleAutocomplete
              name="company"
              id="company"
              multiple={false}
              disabled={user.role != "ADMIN"}
              value={selectedCompanyOptions}
              onChange={handleSelectionCompanyChange}
              label="Company"
              url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=Company`}
            /> */}

            <CustomAutocomplete
              name="brand"
              id="brand"
              value={selectedBrandOptions}
              onChange={handleSelectionBrandChange}
              label="Brand"
              url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=Brand`}
            />

            <CustomAutocomplete
              name="com"
              id="com"
              value={selectedComOptions}
              onChange={handleSelectionComChange}
              label="Com || Cat"
              url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=Commodity`}
            />

            <CustomAutocomplete
              name="alt"
              id="alt"
              value={selectedAltOptions}
              onChange={handleSelectionAltChange}
              label="Alternative Class"
              url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=AlternativeClass`}
            />

            <CustomAutocomplete
              name="vendor"
              id="vendor"
              value={selectedVendorOptions}
              onChange={handleSelectionVendorChange}
              label="Vendor"
              url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=Vendor`}
            />
            <CustomAutocomplete
              name="fsfz"
              id="fsfz"
              value={selectedFsFzOptions}
              onChange={handleSelectionFsFzChange}
              label="Fs || Fz"
              url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=Type`}
            />

            <CustomAutocomplete
              name="classID"
              id="classID"
              // multiple
              value={selectedClassIDOptions}
              onChange={handleSelectionClassIDChange}
              label="ClassID"
              url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=ClassId`}
            />
            <CustomAutocomplete
              name="secondary"
              id="secondary"
              value={selectedSecondaryOptions}
              onChange={handleSelectionSecondaryChange}
              label="Secondary Class"
              url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=SecondaryClass`}
            />
          </Box>

          <Stack direction="row" justifyContent="end" gap={2} mb={1}>
            <Button
              variant="contained"
              onClick={() => {
                setIsFilterApplied(true);
                getFilteredData();
              }}
              sx={{
                "&:hover": {
                  backgroundColor: theme.palette.secondary.light, // Custom hover color
                },
                color: theme.palette.secondary.contrastText,
                bgcolor: theme.palette.secondary.light,
              }}
            >
              Apply Filters
            </Button>

            <Button
              variant="contained"

              sx={{
                "&:hover": {
                  backgroundColor: theme.palette.secondary.light, // Custom hover color
                },
                color: theme.palette.secondary.contrastText,
                bgcolor: theme.palette.secondary.light,
              }}
            >
              Clear Filters
            </Button>
            {isFilterApplied && (
              <Button
                variant="contained"
                onClick={fnQuotesave2}
                sx={{
                  "&:hover": {
                    backgroundColor: theme.palette.secondary.light, // Custom hover color
                  },
                  color: theme.palette.secondary.contrastText,
                  bgcolor: theme.palette.secondary.light,
                }}
              >
                Save
              </Button>
            )}

         
            <Button
              variant="contained"
              onClick={handleClick}
              sx={{
                "&:hover": {
                  backgroundColor: theme.palette.secondary.light, // Custom hover color
                },
                color: theme.palette.secondary.contrastText,
                bgcolor: theme.palette.secondary.light,
              }}
            >
              Save as Template
            </Button>
          </Stack>

          {/* =========================================SHOWFIELDS================================================= */}
          {isFilterApplied && (
            <Box
              sx={{
                height: 400,
                "& .name-column--cell": {
                  color: "black",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: colors.blue.palette.info.main,
                  color: colors.blue.palette.info.contrastText,
                  height: 20, // Set header height
                },
                "& .MuiDataGrid-footerContainer": {
                  backgroundColor: colors.blue.palette.info.main,
                  color: colors.blue.palette.info.contrastText,
                  height: 20, // Set footer height
                },
                "& .MuiDataGrid-virtualScroller": {
                  backgroundColor: colors.blueDark.palette.info.main,
                },
                "& .MuiCheckbox-root": {
                  color: "primary",
                },
              }}
            >
              <DataGrid
                slots={{
                  loadingOverlay: LinearProgress,
                  toolbar: CustomToolbar,
                }}
                rowHeight={30}
                rows={getQuoteFilterItemData}
                loading={getQuoteFilterItemLoading}
                columns={columns}
                checkboxSelection
                disableSelectionOnClick
                disableRowSelectionOnClick
                getRowId={(row) => row.Item_Number}
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
                onRowSelectionModelChange={(newRowSelectionModel) => {
                  setRowSelectionModel(newRowSelectionModel);
                  // setRowSelectionModelRows(filterArray);
                }}
                rowSelectionModel={rowSelectionModel}
              />
            </Box>
          )}
          {/* <LoadingApiDialog
            open={quotePriceListOpenLoading}
            message={quotePriceListMessage}
            loading={quotePriceListLoading}
            error={quotePriceListError}
          /> */}

          <PriceGroupAlertApiDialog
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
          <Dialog
            open={open} // Bind the state to the Dialog's open prop
            onClose={() => setOpen(false)}
            PaperProps={{
              component: "form",
              onSubmit: (e) => {
                e.preventDefault(); // Prevent form submission
                fnQuotesave(); // Close dialog on submit
              },
            }}
          >
            <DialogTitle>Template Name</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To create a new Quote Template, please fill out the Template
                Name below.
              </DialogContentText>
              <TextField
                autoFocus
                required
                margin="dense"
                id="runGroup"
                name="runGroup"
                label="Template Name"
                type="text"
                value={CustomName}
                onChange={handleChange}
                fullWidth
                variant="standard"
                color="primary"
              />
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                // color="warning"
                onClick={() => setOpen(false)}
                sx={{
                  "&:hover": {
                    backgroundColor: theme.palette.secondary.light, // Custom hover color
                  },
                  color: theme.palette.secondary.contrastText,
                  bgcolor: theme.palette.secondary.light,
                  fontWeight: "bold",
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{
                  "&:hover": {
                    backgroundColor: theme.palette.secondary.light, // Custom hover color
                  },
                  color: theme.palette.secondary.contrastText,
                  bgcolor: theme.palette.secondary.light,
                  fontWeight: "bold",
                }}
                type="submit"
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>
          <PriceGroupAlertApiDialog
            open={openAlert}
            error={postError}
            message={postError ? "Something Went Wrong" : "Saved Successfully"}
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
            open={openAlert2}
            error={postError2}
            message={postError2 ? "Something Went Wrong" : "Saved Successfully"}
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
        </SimpleCard>
      </Box>
    </Container>
  );
}
const type = [
  "Price Book Level 1",
  "Price Book Level 2",
  "Price Book Level 3",
  "Price Book Level 4",
  "Price Book Level 5",
  "Price Book Level 6",
  "Price Book Level 7",
  "Price Book Level 8",
  "Price Book Level 9",
  "Price Book Level 10",
];
