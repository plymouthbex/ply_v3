import React, { useEffect, useState } from "react";
import {
  Paper,
  Button,
  Box,
  styled,
  useMediaQuery,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Stack,
  Autocomplete,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography,
  IconButton,
  Tooltip,
  Checkbox,
} from "@mui/material";
import { Breadcrumb } from "app/components";
import toast from "react-hot-toast";
// ******************** ICONS ******************** //
import { Formik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { quoteInfoData } from "app/redux/slice/postSlice";
import useAuth from "app/hooks/useAuth";
import { PriceGroupAlertApiDialog } from "app/components/LoadindgDialog";
import { SingleAutocomplete, ViewPriceSingleAutocomplete } from "app/components/AutoComplete";
import { getConfigPriceBookCompany, getQuoteBookData, quoteClearState2 } from "app/redux/slice/getSlice";

import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Span } from "app/components/Typography";
import { themeColors } from "app/components/baseTheme/themeColors";
import { quoteClearState } from "app/redux/slice/priceListSlice";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useTheme } from "@emotion/react";
import { SiMicrosoftexcel } from "react-icons/si";
import { FaFilePdf } from "react-icons/fa6";
import { IoIosMailOpen } from "react-icons/io";
import { IoMdPrint } from "react-icons/io";
import { FormikCustomerPriceOptimizedAutocomplete } from "app/components/SingleAutocompletelist";
// ******************** STYLED COMPONENTS ******************** //
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

// ******************** Validation Schema ******************** //
const validationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 1 characters"),
  email: Yup.string().email("Invalid email format"),
});


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
// ******************** Price List Edit SCREEN  ******************** //
const QuoteEdit = () => {
  // ******************** HOOKS AND CONSTANTS ******************** //
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();
  const state = location.state ? location.state : {};
  console.log("🚀 ~ QuoteEdit ~ state:", state)
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [priceBookLevel, setPriceBokkLevel] = useState(0)
  console.log("🚀 ~ QuoteEdit ~ priceBookLevel:", priceBookLevel)
  const params = useParams();
  const colors = themeColors;
  const getfn = async () => {
    const res = await dispatch(getConfigPriceBookCompany({ CompanyCode: user.companyCode }))
    console.log("🚀 ~ QuoteEdit ~ user:", res)
    if (res.payload.data.status === "Y") {

      setPriceBokkLevel(res.payload.data.PriceLevel)
    }

  }

  useEffect(() => {
    dispatch(quoteClearState2());
    getfn()

  }, [])
  const clearQuotePriceList = () => {
    dispatch(quoteClearState());
    dispatch(quoteClearState2());
    getBuildPriceTemData("-1");
    setSelectedTemplateOptions(null);
  };
  //=====================================DATE=================================//
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isNextWeek, setIsNextWeek] = useState(false);
  const [selectedTemplateOptions, setSelectedTemplateOptions] = useState(null);
  const [isChecked, setIsChecked] = useState(true);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
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
  };
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
    getWeekDates();
  const [selectedCustomerOptions, setSelectedCustomerOptions] = useState(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState(null);

  console.log("🚀 ~ handleSelectionCustomerChange ~ Name:", selectedCustomerName)
  const handleSelectionCustomerChange = (newValue) => {
    if (newValue) {
      const Name = newValue.CustomerName;

      setSelectedCustomerOptions(newValue);
      setSelectedCustomerName(Name)
    }
    else {
      setSelectedCustomerOptions(null);
      setSelectedCustomerName(null);

    }
  };

  // ******************** LOCAL STATE ******************** //

  const [openAlert, setOpenAlert] = useState(false);
  const [postError, setPostError] = useState(false);
  const [HeaderID, setHeaderID] = useState();
  //=============+++++++SHOW FIELDS=====================================//
  const [showText, setShowTexts] = useState(true);
  const [showDataGrid, setShowDataGrid] = useState(false);

  // //=============================SAVE==================================//

  const handleSave = async (values, setSubmitting) => {
    console.log("🚀 ~ handleSave ~ values:", values)
    const data = {
      RecordID: 0,
      CompanyId: user.companyID,
      FromDate: "",
      ToDate: "",
      Name: values.name || selectedCustomerName,
      Description: values.description,
      Address1: values.address1,
      Address2: values.address2,
      City: values.city,
      State: values.state,
      Zip: values.zip,
      EmailID: values.email,
      Mobile: values.mobile,
      Provider: values.serviceProvider,
      Salesrepresentative: values.salesRepName,
    };
    console.log("🚀 ~ handleSave ~ data:", data)



    const response = await dispatch(quoteInfoData({ data }));

    if (response.payload.status === "Y") {
      setOpenAlert(true);
      if (params.mode === "newprospect" || params.mode === "editprospect") {
        setShowDataGrid(true);
        setShowTexts(false);
        setHeaderID(response.payload.RecordId)
      } else {
        setHeaderID(response.payload.RecordId);
        navigate("/pages/pricing-portal/quote", {
          state: {
            headerID: HeaderID,
            templateID: state.templateID ? state.templateID : 0,
            templateName: state.templateName ? state.templateName : "",
            accessID: "PPB005",
            name: "Quote",
          },
        });
      }
      setTimeout(() => {
        setOpenAlert(false);
        setSubmitting(false);
        //   navigate("/pages/quote", {
        //     state: {
        //       headerID: response.payload.RecordId,
        //       templateID: state.templateID ? state.templateID : 0,
        //       templateName: state.templateName ? state.templateName : "",
        //       accessID: "PPB005",
        //       name: "Quote",
        //     },
        //   });
      }, 2000);
    } else {
      setOpenAlert(true);
      setPostError(true);

      setTimeout(() => {
        setOpenAlert(false);
        setPostError(false);
        setSubmitting(false);
      }, 2000);
    }
  };

  //=======================COMPANY===================================//
  const [selectedCompanyOptions, setSelectedCompanyOptions] = useState(
    user.companyID === 5
      ? { RecordID: 5, Name: "Plymouth" }
      : user.companyID === 6
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
    if (newValue) {
      setSelectedCompanyOptions(newValue);
    }
  };





  //==============================PRICELIST COLUMNS AND ROWS=============================//
  const columns = [
    {
      headerName: "Price List ID",
      field: "PRICELISTID",
      width: "200",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: " Price List Description",
      field: "PRICELISTDESCRIPTION",
      minWidth: 250,
      flex: 1,
      align: "left",
      headerAlign: "left",
      hide: false,
    },

  ];


  const pRows = [
    {
      PRICELISTID: "GOATS",
      PRICELISTDESCRIPTION: "GOATSS"
    },
    {
      PRICELISTID: "HEMPLE",
      PRICELISTDESCRIPTION: "Hempler"
    },
    {
      PRICELISTID: "MBA",
      PRICELISTDESCRIPTION: "Smart Chicken"
    },

  ]

  const [itemRows, setItemRows] = useState([]); // State to hold ITEMROWS

  const handleRowClick = (params) => {
    const ID = params.row.PRICELISTID;  // Extract the ID from the clicked row
    console.log("🚀 ~ handleRowClick ~ ID:", ID)

    let ITEMROWS = [];

    // Define the ITEMROWS based on ID
    if (ID === "GOATS") {
      ITEMROWS = [
        {
          item_key: "1",
          Item_Number: "000068",
          Item_Description: "Labels Cnb(Fullcase) NonGmo - 15 Rolls (C.N.B)",
        },
        {
          item_key: "2",
          Item_Number: "001007",
          Item_Description: "Sample Payless Foods 1031 - Fresh (Mba)",
        },
      ];
    } else if (ID === "HEMPLE") {
      ITEMROWS = [
        {
          item_key: "3",
          Item_Number: "001010",
          Item_Description: "Sample Los Juanes - Frozen (Packer)",
        },
        {
          item_key: "4",
          Item_Number: "001011",
          Item_Description: "Sample Ralph's Thriftway #1 - Fresh (Meyer)",
        },
      ];
    } else if (ID === "MBA") {
      ITEMROWS = [
        {
          item_key: "5",
          Item_Number: "001013",
          Item_Description: "Sample Vashon Thriftway #0 - Fresh (Meyer)",
        },
        {
          item_key: "6",
          Item_Number: "001025",
          Item_Description: "Sample Food Depot - Fresh (Seaboard)",
        },
      ];
    }

    // Update the state with the correct ITEMROWS based on ID
    setItemRows(ITEMROWS);
  };

  //==============================PRICELIST COLUMNS AND ROWS=============================//
  const ItemColumns = [
    {
      headerName: "Item Number",
      field: "Item_Number",
      width: "100",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Item Description",
      field: "Item_Description",
      width: "400",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      field: "Action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        // Initialize navigate hook

        return (
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              onClick={() =>
                navigate("/pages/pricing-portal/quote/item-attributes/edit", {
                  state: {
                    id: "153",
                    itemNumber: "001007",
                    itemDesc: params.row.Item_Description,
                  },
                })
              }

              sx={{
                borderRadius: "8px", // Rounded corners
                border: "none",
                padding: "2px 6px", // Adjust padding for smaller size
                fontSize: "0.75rem", // Adjust font size
                lineHeight: "1rem", // Adjust line height for better vertical alignment
                height: "24px", // Ensure the button fits within the row height
                minWidth: "auto", // Prevent unnecessary width
                "&:hover": {
                  backgroundColor: theme.palette.secondary.light, // Custom hover color
                },
                color: theme.palette.secondary.contrastText,
                bgcolor: theme.palette.secondary.light,
                fontWeight: "bold",
              }}
              size="small"
            >
              Edit
            </Button>
          </div>
        );
      },
    },
  ];
  const ITEMrows = [
    {
      item_key: "1",
      Item_Number: "000068",
      Item_Description: "Labels Cnb(Fullcase) NonGmo - 15 Rolls (C.N.B)",

    },
    {
      item_key: "2",
      Item_Number: "001007",
      Item_Description: "Sample Payless Foods 1031 - Fresh (Mba)",

    },
    {
      item_key: "3",
      Item_Number: "001010",
      Item_Description: "Sample Los Juanes - Frozen (Packer)",

    },
    {
      item_key: "4",
      Item_Number: "001011",
      Item_Description: "Sample Ralph's Thriftway #1 - Fresh (Meyer)",

    },
    {
      item_key: "5",
      Item_Number: "001013",
      Item_Description: "Sample Vashon Thriftway #0 - Fresh (Meyer)",

    },
    {
      item_key: "6",
      Item_Number: "001025",
      Item_Description: "Sample Food Depot - Fresh (Seaboard)",

    }
  ];

  const priceBookLevel1 = [
    "PriceBook Level 1",
    "PriceBook Level 2",
    "PriceBook Level 3",
    "PriceBook Level 4",
    "PriceBook Level 5",
    "PriceBook Level 6",
    "PriceBook Level 7",
    "PriceBook Level 8",
    "PriceBook Level 9",
    "PriceBook Level 10"
  ];



  return (
    <Container>
      <Formik
        initialValues={{
          name: state.Name,
          description: state.Description,
          address1: "",
          address2: "",
          city: "",
          state: "",
          zip: "",
          email: "",
          mobile: "",
          serviceProvider: "",
          salesRepName: "",
          customer: "",
          // priceBookLevel:""
        }}
        // validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            handleSave(values, setSubmitting);
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
          setFieldValue
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="breadcrumb">

              <Breadcrumb
                routeSegments={[{ name: "Quote", path: "/pages/pricing-portal/quote-list" }, { name: `${params.mode} Quote` }]}
              />

            </div>

            <Paper sx={{ width: "100%", mb: 2 }}>
              {params.mode === "print" && (
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
                          onClick={() => toast.error('Under Construction')}
                        >
                          <FaFilePdf style={{ fontSize: "21px" }} />
                        </CustomIconButton>
                      </Tooltip>

                      <Tooltip title="Excel" placement="top">

                        <CustomIconButton
                          bgcolor={theme.palette.success.main}
                          aria-label="excel"
                          onClick={() => toast.error('Under Construction')}
                        >
                          <SiMicrosoftexcel style={{ fontSize: "21px" }} />
                        </CustomIconButton>
                      </Tooltip>

                      <Tooltip title="Print" placement="top">
                        <CustomIconButton
                          bgcolor={theme.palette.warning.main}
                          onClick={() => toast.error('Under Construction')}
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
                </Box>)}
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
                {showText && (
                  <>
                    {params.mode === "newexisting" && (
                      <>
                        <SingleAutocomplete
                          name="company"
                          id="company"
                          sx={{ gridColumn: "span 2" }}
                          multiple={false}
                          disabled={user.role !== "ADMIN"}
                          value={selectedCompanyOptions}
                          onChange={handleSelectionCompanyChange}
                          label="Company"
                          url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=Company`}
                        />
                        <TextField
                          variant="outlined"
                          name="salesRepName"
                          id="salesRepName"
                          label="Sales Representative Name"
                          size="small"
                          sx={{ gridColumn: "span 2" }}
                          value={values.salesRepName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <Stack sx={{ gridColumn: "span 2" }} direction="column" gap={2}>
                          <Autocomplete
                            fullWidth
                            id="priceBookLevel"
                            name="priceBookLevel"
                            options={priceBookLevel1}
                            value={values.priceBookLevel}
                            onChange={(event, newValue) =>
                              handleChange({
                                target: { name: "priceBookLevel", value: newValue },
                              })
                            }
                            onBlur={handleBlur}
                            disableClearable
                            renderInput={(params) => (
                              <TextField {...params} label="PriceBook Level" size="small" sx={{ gridColumn: "span 2" }} />
                            )}
                          />
                        </Stack>
                        {/* <FormikCustomerPriceOptimizedAutocomplete
                          sx={{ maxWidth: 450 }}
                          name="customer"
                          id="customer"
                          value={values.customer}
                          onChange={(event, newValue) =>
                            setFieldValue("customer", newValue)
                          }
                          // onChange={(event, newValue) => {
                          //   setFieldValue("customer", newValue); // Now this will work
                          //   // setSelectedCustomerName(newValue.CustomerName); // This is optional
                          // }}
                          label="Customer"
                          url={`${process.env.REACT_APP_BASE_URL}CustomerPriceList/CustomerPriceList`}
                        /> */}

                        <SingleAutocomplete
          sx={{ gridColumn: "span 2" }}
          name="name"
          id="name"
          value={selectedCustomerOptions}
          onChange={handleSelectionCustomerChange}
          label="Customer"
          url={`${process.env.REACT_APP_BASE_URL}Customer/GetCustomer?CompanyCode=${user.companyCode}`}
        />
                      
                       <Box sx={{ display: "flex", justifyContent: "flex-end", gridColumn: "span 4" }}>
                       <Button
                         variant="contained"
                         color="info"
                         size="small"
                         endIcon={<ArrowForwardIcon />}
                         sx={{ padding: "8px 16px" }}
                         type="submit"
                       >
                         {params.mode === "newexisting" || params.mode === "editexisting"
                           ? "Save & Go Non-contract Items"
                           : "Save & Go Contract Items"}
                       </Button>
                     </Box>
                     </>
                    )}

                    {params.mode !== "newexisting" && (
                    <>
                        {/* The fields for other modes go here */}
                        <SingleAutocomplete
                          name="company"
                          id="company"
                          sx={{ gridColumn: "span 2" }}
                          multiple={false}
                          disabled={user.role !== "ADMIN"}
                          value={selectedCompanyOptions}
                          onChange={handleSelectionCompanyChange}
                          label="Company"
                          url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=Company`}
                        />
                        <TextField
                          variant="outlined"
                          name="salesRepName"
                          id="salesRepName"
                          label="Sales Representative Name"
                          size="small"
                          sx={{ gridColumn: "span 2" }}
                          value={values.salesRepName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="text"
                          id="name"
                          name="name"
                          label="Prospect Name"
                          size="small"
                          sx={{ gridColumn: "span 2" }}
                          required
                          InputLabelProps={{
                            sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                          }}
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!touched.name && !!errors.name}
                          helperText={touched.name && errors.name}
                        />
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="text"
                          id="description"
                          name="description"
                          label="Description"
                          size="small"
                          sx={{ gridColumn: "span 2" }}
                          value={values.description}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="text"
                          id="address1"
                          name="address1"
                          label="Address"
                          size="small"
                          sx={{ gridColumn: "span 2" }}
                          value={values.address1}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="text"
                          id="city"
                          name="city"
                          label="City"
                          size="small"
                          sx={{ gridColumn: "span 2" }}
                          value={values.city}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="text"
                          id="state"
                          name="state"
                          label="State"
                          size="small"
                          sx={{ gridColumn: "span 2" }}
                          value={values.state}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="text"
                          id="zip"
                          name="zip"
                          label="Zip"
                          size="small"
                          sx={{ gridColumn: "span 2" }}
                          value={values.zip}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="email"
                          id="email"
                          name="email"
                          label="Email"
                          size="small"
                          sx={{ gridColumn: "span 2" }}
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                        />
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="text"
                          id="mobile"
                          name="mobile"
                          label="Mobile"
                          size="small"
                          sx={{ gridColumn: "span 2" }}
                          value={values.mobile}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <FormControl sx={{ gridColumn: "span 2" }} fullWidth size="small">
                          <InputLabel id="demo-simple-select-label">Service Provider</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            value={values.serviceProvider}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            id="serviceProvider"
                            name="serviceProvider"
                            label="Price Book Type"
                          >
                            <MenuItem value={"AT&T"}>AT&T</MenuItem>
                            <MenuItem value={"V"}>Verizon</MenuItem>
                            <MenuItem value={"TM"}>T-Mobile</MenuItem>
                          </Select>
                        </FormControl>
                        <Stack sx={{ gridColumn: "span 2" }} direction="column" gap={2}>
                          <Autocomplete
                            fullWidth
                            id="priceBookLevel"
                            name="priceBookLevel"
                            options={priceBookLevel1}
                            value={values.priceBookLevel}
                            onChange={(event, newValue) =>
                              handleChange({
                                target: { name: "priceBookLevel", value: newValue },
                              })
                            }
                            onBlur={handleBlur}
                            disableClearable
                            renderInput={(params) => (
                              <TextField {...params} label="PriceBook Level" size="small" sx={{ gridColumn: "span 2" }} />
                            )}
                          />
                        </Stack>
                     
                   

                    <Box sx={{ display: "flex", justifyContent: "flex-end", gridColumn: "span 4" }}>
                      <Button
                        variant="contained"
                        color="info"
                        size="small"
                        endIcon={<ArrowForwardIcon />}
                        sx={{ padding: "8px 16px" }}
                        type="submit"
                      >
                        {params.mode === "newexisting" || params.mode === "editexisting"
                          ? "Save & Go Non-contract Items"
                          : "Save & Go Contract Items"}
                      </Button>
                    </Box>
                    </>
                   )}
                  </>
                )}


                {/* //================================================DATAGRID  PRICELIST and Items==============================================================// */}
                {showDataGrid && (<>
                  <Stack sx={{ gridColumn: "span 2" }} direction="column" gap={3}>
                    <Box
                      sx={{

                        "& .MuiDataGrid-root": {
                          border: "none",
                        },
                        "& .MuiDataGrid-cell": {
                          borderBottom: "none",
                        },
                        "& .name-column--cell": {
                          color: "black",
                        },
                        "& .MuiDataGrid-columnHeaders": {
                          backgroundColor: colors.blue.palette.info.main,
                          color: colors.blue.palette.info.contrastText,
                        },
                        "& .MuiDataGrid-virtualScroller": {
                          backgroundColor: colors.blueDark.palette.info.main,
                        },
                        "& .MuiDataGrid-footerContainer": {
                          borderTop: "none",
                          backgroundColor: colors.blue.palette.info.main,
                          color: colors.blue.palette.info.contrastText,
                        },
                        "& .MuiCheckbox-root": {
                          color: "#174c4f !important",
                        },

                        "& .MuiCheckbox-root.Mui-checked": {
                          color: "#174c4f !important",
                        },
                      }}
                    >
                      <DataGrid
                        sx={{ height: "500px" }}
                        slots={{
                          loadingOverlay: LinearProgress,
                        }}
                        rows={pRows}
                        columns={columns}
                        // checkboxSelection
                        onRowClick={handleRowClick}
                        disableRowSelectionOnClick
                        getRowId={(row) => row.PRICELISTID}
                        initialState={{
                          pagination: { paginationModel: { pageSize: 20 } },
                        }}
                        rowHeight={30}
                        pageSizeOptions={[20, 50, 100]}
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
                  </Stack>

                  {/* Second DataGrid Block (Span 2 columns) */}
                  <Stack sx={{ gridColumn: "span 2" }} direction="column" gap={2}>
                    <Box
                      sx={{

                        "& .MuiDataGrid-root": {
                          border: "none",
                        },
                        "& .MuiDataGrid-cell": {
                          borderBottom: "none",
                        },
                        "& .name-column--cell": {
                          color: "black",
                        },
                        "& .MuiDataGrid-columnHeaders": {
                          backgroundColor: colors.blue.palette.info.main,
                          color: colors.blue.palette.info.contrastText,
                        },
                        "& .MuiDataGrid-virtualScroller": {
                          backgroundColor: colors.blueDark.palette.info.main,
                        },
                        "& .MuiDataGrid-footerContainer": {
                          borderTop: "none",
                          backgroundColor: colors.blue.palette.info.main,
                          color: colors.blue.palette.info.contrastText,
                        },
                        "& .MuiCheckbox-root": {
                          color: "#174c4f !important",
                        },

                        "& .MuiCheckbox-root.Mui-checked": {
                          color: "#174c4f !important",
                        },
                      }}
                    >
                      <DataGrid
                        sx={{ height: "500px" }}
                        slots={{
                          loadingOverlay: LinearProgress,
                        }}
                        rows={itemRows}
                        columns={ItemColumns}
                        checkboxSelection
                        disableRowSelectionOnClick
                        getRowId={(row) => row.Item_Number}
                        initialState={{
                          pagination: { paginationModel: { pageSize: 20 } },
                        }}
                        rowHeight={30}
                        pageSizeOptions={[20, 50, 100]}
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
                  </Stack>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gridColumn: "span 4",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      endIcon={<ArrowForwardIcon />} // Icon added here
                      sx={{ padding: "8px 16px" }}
                      onClick={() =>
                        navigate("/pages/pricing-portal/quote", {
                          state: {
                            headerID: HeaderID,
                            templateID: state.templateID ? state.templateID : 0,
                            templateName: state.templateName ? state.templateName : "",
                            accessID: "PPB005",
                            name: "Quote",
                          },
                        })
                      }
                    >
                      Add item's to Quote & Go Non-contract item's
                    </Button>

                  </Box>

                </>)}









              </Box>



            </Paper>
          </form>
        )}
      </Formik>

      <PriceGroupAlertApiDialog
        open={openAlert}
        error={postError}
        message={
          postError
            ? "Something Went Wrong"
            : "Prospect info saved successfully"
        }

        Actions={
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
              height: 25,
            }}
          ></Box>

        }
      />
    </Container>
  );
};

export default QuoteEdit;
