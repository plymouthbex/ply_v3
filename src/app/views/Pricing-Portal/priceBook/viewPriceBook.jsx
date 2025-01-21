import {
  Autocomplete,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Fab,
  Button,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
} from "@mui/material";
import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import { useTheme } from "@emotion/react";
import { SiMicrosoftexcel } from "react-icons/si";
import { FaFilePdf } from "react-icons/fa6";
import { IoIosMailOpen } from "react-icons/io";
import { IoMdPrint } from "react-icons/io";
import { useEffect, useState } from "react";

import { FlexAlignCenter, FlexBox } from "app/components/FlexBox";
// CUSTOM UTILS LIBRARY FUNCTIONS
import { convertHexToRGB } from "app/utils/utils";
import { useDispatch, useSelector } from "react-redux";

import useAuth from "app/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ViewPriceSingleAutocomplete } from "app/components/AutoComplete";
import CoverPageComponent from "app/components/PDFCoverPage";
import {
  getCustomerViewPriceCustomBook,
  getCustomerViewPriceFullBook,
  mailSend,
  viewPricePdfGenrationg,
} from "app/redux/slice/priceListSlice";
import { pdf, PDFDownloadLink } from "@react-pdf/renderer";
import {
  exportToExcelCustomPriceBook,
  exportToExcelFullPriceBookV1,
} from "app/components/Template/Excel";
import LoadingApiDialog, {
  PriceGroupAlertApiDialog,
  ViewPriceLoadingApiDialog,
} from "app/components/LoadindgDialog";
import { CustomerCustomPriceDocument } from "app/components/Template/pdfs/CustomerCustomPriceBook";
import { CustomerFullPriceDocument } from "app/components/Template/pdfs/CustomerFullPriceBook";
import toast from "react-hot-toast";
import { runGroupMailData } from "app/redux/slice/postSlice";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "15px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "10px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const IMG = styled("img")(() => ({
  width: "100%",
  overflow: "hidden",
}));

const DropZone = styled(FlexAlignCenter)(({ isDragActive, theme }) => ({
  height: 70,
  width: "50%",
  cursor: "pointer",
  borderRadius: "4px",
  marginBottom: "16px",
  transition: "all 350ms ease-in-out",
  border: `2px dashed rgba(${convertHexToRGB(
    theme.palette.text.primary
  )}, 0.3)`,
  "&:hover": {
    background: `rgb(${convertHexToRGB(
      theme.palette.text.primary
    )}, 0.2) !important`,
  },
  background: isDragActive ? "rgb(0, 0, 0, 0.15)" : "rgb(0, 0, 0, 0.01)",
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

const ViewPriceBook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();

  const CustomerCustomPriceListData = useSelector(
    (state) => state.priceList.viewPriceData
  );

  const viewPriceIsPdfGenrating = useSelector(
    (state) => state.priceList.viewPriceIsPdfGenrating
  );

  const viewPricePdfGenratingMsg = useSelector(
    (state) => state.priceList.viewPricePdfGenratingMsg
  );
  const viewPriceIsPdfError = useSelector(
    (state) => state.priceList.viewPriceIsPdfError
  );

  const [isCustomer, setIsCustomer] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isNextWeek, setIsNextWeek] = useState(false);
  const { user } = useAuth();
  //=======================CUSTOMER===================================//
  const [selectedCustomerOptions, setSelectedCustomerOptions] = useState(null);

  const handleSelectionCustomerChange = (newValue) => {
    setSelectedCustomerOptions(newValue);
  };

  //=======================PRICE LIST TYPE===================================//
  const [selectPriceListtype, setSelectPriceListType] = useState("FP");

  const handleSelectionPriceTypeChange = (e) => {
    setSelectPriceListType(e.target.value);
    setSelectedCustomerOptions(null);
  };

  const getWeekDates = () => {
    const date = new Date(currentDate);

    if (isNextWeek) {
      date.setDate(date.getDate() + 7);
    }

    const { sunday, saturday } = getSaturdayAndSunday(date);
    return {
      sunday: formatDateLong(sunday), // Full date for Sunday (MM/DD/YYYY)
      saturday: formatDateLong(saturday), // Full date for Saturday (MM/DD/YYYY)
      shortSunday: formatDateShort(sunday), // Short format (MM/DD) for Sunday
      shortSaturday: formatDateShort(saturday), // Short format (MM/DD) for Saturday
      formatedDate: `Pricing Week (SUN) ${formatDateLong(
        sunday
      )} TO (SAT) ${formatDateLong(saturday)}`, // Full format Pricing Week (SUN)(MM/DD/YYYY) TO (SAT)(MM/DD/YYYY)
    };
  };

  const toggleWeek = () => {
    setIsNextWeek(!isNextWeek); // Toggle between next and current week
  };

  const { shortSunday, shortSaturday, sunday, saturday, formatedDate } =
    getWeekDates();

  //=======================SHOW PRICE===================================//
  const [isChecked, setIsChecked] = useState(true);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const [isGenerating, setIsGenerating] = useState(false);

  const handleMailNavigate = () => {
    if (!selectedCustomerOptions) {
      setIsCustomer("Please Choose Customer");

      setTimeout(() => {
        setIsCustomer(null);
      }, 1000);
      return;
    }
    navigate("./send-mail/:vpb", {
      state: {
        customernumber: selectedCustomerOptions.Code,
        fppdf: selectPriceListtype === "FP" ? true : false,
        fpexcel: selectPriceListtype === "FP" ? true : false,
        cppdf: selectPriceListtype === "CP" ? true : false,
        cpexcel: selectPriceListtype === "CP" ? true : false,
        FromDate: sunday,
        ToDate: saturday,
      },
    });
  };
  const [openAlert, setOpenAlert] = useState(false);
  const [postError, setPostError] = useState(false);
  const fnRunGrpEmailProcess = async () => {
    if (!selectedCustomerOptions) {
      setIsCustomer("Please Choose Customer");

      setTimeout(() => {
        setIsCustomer(null);
      }, 1000);
      return;
    }
    const data = [
      {
        CustomerNumber: selectedCustomerOptions.Code,
        FullPriceBookPdf: selectPriceListtype === "FP" ? "1" : "0",
        FullPriceBookExcel: selectPriceListtype === "FP" ? "1" : "0",
        CustomPriceBooPdf: selectPriceListtype === "CP" ? "1" : "0",
        CustomPriceBookExcel: selectPriceListtype === "CP" ? "1" : "0",
        FromDate: sunday,
        ToDate: saturday,
        UserID: user.id,
        CompnayID: user.companyID,
        CompanyCode: user.companyCode,
        TemplateID: "",
      },
    ];
    console.log("🚀 ~ data ~ data:", data);

    try {
      const response = await dispatch(runGroupMailData({ data }));

      if (response.payload.status === "Y") {
        setOpenAlert(true);
      } else {
        setOpenAlert(true);
        setPostError(true);
      }
    } catch (error) {
      setOpenAlert(true);
      setPostError(true);
      console.error("Error during HandleSave:", error);
    }
  };

  const getPriceListCustomerFull = (priceListOutType) => {
    if (!selectedCustomerOptions) {
      setIsCustomer("Please Choose Customer");

      setTimeout(() => {
        setIsCustomer(null);
      }, 1000);
      return;
    }
    setIsGenerating(true);
    dispatch(
      viewPricePdfGenrationg({
        Type: "LOADING",
        loading: true,
        message:
          priceListOutType === "EXCEL"
            ? "Generating Price Book Excel"
            : "Generating Price Book PDF",
      })
    );

    dispatch(
      getCustomerViewPriceFullBook({
        CompanyCode: user.companyCode,
        FromDate: sunday,
        ToDate: saturday,
        CustomerNumber: selectedCustomerOptions
          ? selectedCustomerOptions.Code
          : "",
      })
    )
      .then(async (response) => {
        // return;
        if (response.payload.length > 0) {
          if (priceListOutType === "EXCEL") {
            exportToExcelFullPriceBookV1({
              excelData: response.payload,
              fileName: `${user.company}_${
                selectedCustomerOptions
                  ? selectedCustomerOptions.Name
                  : "Customer"
              }_FPB_${sunday} TO ${saturday}`,
              isPrice: isChecked,
            });
            dispatch(
              viewPricePdfGenrationg({
                Type: "SUCCESS",
                loading: false,
                message:
                  "Price book successfully created! Please wait while it is automatically downloaded",
              })
            );
            setIsGenerating(false);
            return;
          }
          try {
            const instance = pdf(
              <CustomerFullPriceDocument
                data={response.payload}
                coverPageData={{
                  logo: user.homePagelogo, // Replace with the actual path to the logo image
                  subtitle1: "Price Book for",
                  subtitle2:
                    selectPriceListtype === "FP"
                      ? `${
                          selectedCustomerOptions
                            ? selectedCustomerOptions.Name
                            : ""
                        }`
                      : "Customer Full Pricelist",
                  effectiveDate: formatedDate,
                  preparedByName: user.name,
                  preparedByPhone: user.userMobile,
                  preparedByEmail: user.email,
                  phone1: user.phone1,
                  phone2: user.phone2,
                  fax: user.fax,
                  coverImg:
                    selectPriceListtype === "FP"
                      ? user.customerFullPriceBookImg
                      : user.customerCustomPriceBookImg,
                }}
                isPrice={isChecked}
                onRenderFinish={() => {
                  dispatch(
                    viewPricePdfGenrationg({
                      Type: "SUCCESS",
                      loading: false,
                      message:
                        "Price book successfully created! Please wait while it is automatically downloaded.",
                    })
                  );
                  setTimeout(() => {
                    setIsGenerating(false);
                  }, 1000);
                }}
                onError={(e) => {
                  console.error("Render Error:", e);
                  dispatch(
                    viewPricePdfGenrationg({
                      Type: "ERROR",
                      message: "An error occurred while rendering the PDF.",
                      loading: false,
                      error: true,
                    })
                  );
                  setTimeout(() => {
                    setIsGenerating(false);
                  }, 1000);
                }}
              />
            );

            const blob = await instance.toBlob();
            const url = URL.createObjectURL(blob);

            if (priceListOutType === "PDF") {
              const link = document.createElement("a");
              link.href = url;
              link.download = `${user.company}_${
                selectedCustomerOptions
                  ? selectedCustomerOptions.Name
                  : "Customer"
              }_${
                selectPriceListtype === "FP" ? "FPB" : "CPB"
              }_${sunday} TO ${saturday}.pdf`;
              document.body.appendChild(link);

              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }

            if (priceListOutType === "PRINT") {
              window.open(
                url,
                `${
                  selectedCustomerOptions
                    ? selectedCustomerOptions.Name
                    : "Customer"
                }_${
                  selectPriceListtype === "FP" ? "FPB" : "CPB"
                }_${sunday} TO ${saturday}`
              );
              setTimeout(() => {
                URL.revokeObjectURL(url);
              }, 100);
            }
          } catch (e) {
            console.error("Generation Error:", e);
            dispatch(
              viewPricePdfGenrationg({
                Type: "ERROR",
                message: "An error occurred while rendering the PDF.",
                loading: false,
                error: true,
              })
            );
            setTimeout(() => {
              setIsGenerating(false);
            }, 2000);
          }
        } else {
          dispatch(
            viewPricePdfGenrationg({
              Type: "ERROR",
              message: response.payload.message,
              loading: false,
              error: true,
            })
          );
          setTimeout(() => {
            setIsGenerating(false);
          }, 1000);
        }
      })
      .catch((e) => {
        dispatch(
          viewPricePdfGenrationg({
            Type: "ERROR",
            message: "An error occurred while rendering the PDF.",
            loading: false,
            error: true,
          })
        );
        setTimeout(() => {
          setIsGenerating(false);
        }, 2000);
      });
  };

  const getPriceListCustomerCustom = (priceListOutType) => {
    if (!selectedCustomerOptions) {
      setIsCustomer("Please Choose Customer");

      setTimeout(() => {
        setIsCustomer(null);
      }, 1000);
      return;
    }
    setIsGenerating(true);
    dispatch(
      viewPricePdfGenrationg({
        Type: "LOADING",
        loading: true,
        message:
          priceListOutType === "EXCEL"
            ? "Generating Price Book Excel"
            : "Generating Price Book PDF",
      })
    );

    dispatch(
      getCustomerViewPriceCustomBook({
        CompanyCode: user.companyCode,
        FromDate: sunday,
        ToDate: saturday,
        CustomerNumber: selectedCustomerOptions
          ? selectedCustomerOptions.Code
          : "",
        filterparameters: "",
      })
    )
      .then(async (response) => {
        if (response.payload.length > 0) {
          if (priceListOutType === "EXCEL") {
            exportToExcelCustomPriceBook({
              excelData: response.payload,
              fileName: `${user.company}_${
                selectedCustomerOptions
                  ? selectedCustomerOptions.Name
                  : "Customer"
              }_CPB_${sunday} TO ${saturday}`,
              isPrice: isChecked,
            });
            dispatch(
              viewPricePdfGenrationg({
                Type: "SUCCESS",
                loading: false,
                message:
                  "Price book successfully created! Please wait while it is automatically downloaded.",
              })
            );
            setIsGenerating(false);
            return;
          }
          try {
            const instance = pdf(
              <CustomerCustomPriceDocument
                data={response.payload}
                headerData={{
                  logo: user.homePagelogo, // Replace with the actual path to the logo image
                  customerName: selectedCustomerOptions
                    ? selectedCustomerOptions.Name
                    : "Claus Meats",
                  effectiveDate: formatedDate,
                }}
                coverPageData={{
                  logo: user.homePagelogo, // Replace with the actual path to the logo image
                  subtitle1: "Price list for",
                  subtitle2: `${
                    selectedCustomerOptions
                      ? selectedCustomerOptions.Name
                      : "Customer Custom Pricelist"
                  }`,
                  effectiveDate: formatedDate,
                  preparedByName: user.name,
                  preparedByPhone: user.userMobile,
                  preparedByEmail: user.email,
                  phone1: user.phone1,
                  phone2: user.phone2,
                  fax: user.fax,
                  coverImg:
                    selectPriceListtype === "FP"
                      ? user.customerFullPriceBookImg
                      : user.customerCustomPriceBookImg,
                }}
                isPrice={isChecked}
                onRenderFinish={() => {
                  dispatch(
                    viewPricePdfGenrationg({
                      Type: "SUCCESS",
                      loading: false,
                      message:
                        "Price book successfully created! Please wait while it is automatically downloaded.",
                    })
                  );
                  setIsGenerating(false);
                }}
                onError={(e) => {
                  console.error("Render Error:", e);
                  dispatch(
                    viewPricePdfGenrationg({
                      Type: "ERROR",
                      message: "An error occurred while rendering the PDF.",
                      loading: false,
                      error: true,
                    })
                  );
                }}
              />
            );

            const blob = await instance.toBlob();

            const url = URL.createObjectURL(blob);

            if (priceListOutType === "PDF") {
              const link = document.createElement("a");
              link.href = url;
              link.download = `${user.company}_${
                selectedCustomerOptions
                  ? selectedCustomerOptions.Name
                  : "Customer"
              }_${
                selectPriceListtype === "FP" ? "FPB" : "CPB"
              }_${sunday} TO ${saturday}.pdf`;
              document.body.appendChild(link);

              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }

            if (priceListOutType === "PRINT") {
              window.open(
                url,
                `${user.company}_${
                  selectedCustomerOptions
                    ? selectedCustomerOptions.Name
                    : "Customer"
                }_${
                  selectPriceListtype === "FP" ? "FPB" : "CPB"
                }_${sunday} TO ${saturday}`
              );
              setTimeout(() => {
                URL.revokeObjectURL(url);
              }, 100);
            }
          } catch (e) {
            console.error("Generation Error:", e);
            dispatch(
              viewPricePdfGenrationg({
                Type: "ERROR",
                message: "An error occurred while rendering the PDF.",
                loading: false,
                error: true,
              })
            );
            setIsGenerating(false);
          }
        } else {
          // toast.error('Price Boook not found')
          dispatch(
            viewPricePdfGenrationg({
              Type: "ERROR",
              message: response.payload.message,
              loading: false,
              error: true,
            })
          );
          setTimeout(() => {
            setIsGenerating(false);
          }, 1000);
        }
      })
      .catch((e) => {
        dispatch(
          viewPricePdfGenrationg({
            Type: "ERROR",
            message: "An error occurred while rendering the PDF.",
            loading: false,
            error: true,
          })
        );
        setIsGenerating(false);
      });
  };

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[{ name: "Price Book" }, { name: "Print Price Book" }]}
        />
      </Box>

      <Box>
        <SimpleCard>
          <Box
            sx={{
              display: "flex",
              flexDirection: isNonMobile ? "row" : "column",
              justifyContent: "space-between",
              alignItems: isNonMobile ? "center" : "none",
            }}
          >
            <Stack direction="row-reverse" gap={5}>
              <Typography
                variant="caption"
                align="center"
                alignItems="center"
                alignSelf="center"
              >
                {formatedDate}
              </Typography>
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
              <Stack direction="row" alignItems={"center"}>
                <Tooltip title="PDF" placement="top">
                  <CustomIconButton
                    onClick={
                      () =>
                        selectPriceListtype === "FP"
                          ? getPriceListCustomerFull("PDF")
                          : getPriceListCustomerCustom("PDF")
                      // navigate("/PDF8")
                    }
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: "white",
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
                    bgcolor={theme.palette.success.main}
                    aria-label="excel"
                    onClick={() =>
                      selectPriceListtype === "FP"
                        ? getPriceListCustomerFull("EXCEL")
                        : getPriceListCustomerCustom("EXCEL")
                    }
                    // onClick={() => navigate("/PDF8")}
                  >
                    <SiMicrosoftexcel style={{ fontSize: "21px" }} />
                  </CustomIconButton>
                </Tooltip>
                <Tooltip title="Print" placement="top">
                  <CustomIconButton
                    bgcolor={theme.palette.warning.main}
                    onClick={() =>
                      selectPriceListtype === "FP"
                        ? getPriceListCustomerFull("PRINT")
                        : getPriceListCustomerCustom("PRINT")
                    }
                    aria-label="print"
                  >
                    <IoMdPrint style={{ fontSize: "21px" }} />
                  </CustomIconButton>
                </Tooltip>

                <Tooltip title="Mail" placement="top">
                  <CustomIconButton
                    bgcolor={theme.palette.error.main}
                    aria-label="mail"
                    onClick={fnRunGrpEmailProcess}
                  >
                    <IoIosMailOpen style={{ fontSize: "21px" }} />
                  </CustomIconButton>
                </Tooltip>
              </Stack>
            </Stack>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: isNonMobile ? "row" : "column",
              width: "100%",
              padding: "10px 5px",
              gap: "10px",
            }}
          >
            <Box
              display="grid"
              gap="10px"
              height={isNonMobile ? 250 : "100%"}
              gridTemplateColumns="1fr"
              sx={{
                "& > div": {
                  gridColumn: "span 1",
                },
                width: isNonMobile ? "50%" : "100%",
              }}
            >
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">
                  Price Book Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  onChange={handleSelectionPriceTypeChange}
                  value={selectPriceListtype}
                  id="demo-simple-select"
                  label="Price Book Type"
                >
                  <MenuItem value={"FP"}>Full Price Book</MenuItem>
                  <MenuItem value={"CP"}>Custom Price Book</MenuItem>
                  {/* <MenuItem value={"B"}>Both</MenuItem> */}
                </Select>
              </FormControl>
              <ViewPriceSingleAutocomplete
                isError={isCustomer}
                name="customer"
                id="customer"
                value={selectedCustomerOptions}
                onChange={handleSelectionCustomerChange}
                label="Customer"
                url={`${
                  process.env.REACT_APP_BASE_URL
                }Customer/GetCustomer?CompanyCode=${user.companyCode}&Type=${
                  selectPriceListtype == "CP" ? "Custom" : "Full"
                }`}
              />

              <Box></Box>
            </Box>

            <Box
              width={isNonMobile ? "50%" : "100%"}
              // height={isNonMobile ? 400 : "100%"}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <CoverPageComponent
                data={{
                  logo: `data:image/png;base64,${user.homePagelogo}`,
                  subtitle1: "Price Book for",
                  subtitle2:
                    selectPriceListtype === "FP"
                      ? "Customer Full Pricelist"
                      : "Customer Custom Pricelist",
                  date: `Pricing Week ${sunday} TO ${saturday}`,
                  preparedByName: user.name,
                  preparedByPhone: user.userMobile,
                  preparedByEmail: user.email,
                  phone1: user.phone1,
                  phone2: user.phone2,
                  fax: user.fax,
                  coverImg:
                    selectPriceListtype === "FP"
                      ? user.customerFullPriceBookImg
                      : user.customerCustomPriceBookImg,
                }}
              />
            </Box>
          </Box>

          <Stack direction="row" justifyContent="end" gap={2}>
            {/* {user.role === "ADMIN" && (
              <Button
                variant="contained"
                // color="secondary"
                sx={{
                  "&:hover": {
                    backgroundColor: theme.palette.secondary.light, // Custom hover color
                  },
                  color: theme.palette.secondary.contrastText,
                  bgcolor: theme.palette.secondary.light,
                  fontWeight: "bold",
                }}
                onClick={() => navigate("/pages/edit-price-book")}
              >
                Edit Cover Page Image
              </Button>
            )} */}
          </Stack>
        </SimpleCard>
      </Box>
      <PriceGroupAlertApiDialog
        open={openAlert}
        error={postError}
        message={
          postError
            ? "An error occurred while sending the email. Please retry."
            : "Customer will receive their Price Book shortly"
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
              }}
              sx={{ height: 25 }}
            >
              Close
            </Button>
          </Box>
        }
      />
      <ViewPriceLoadingApiDialog
        logo={`data:image/png;base64,${user.logo}`}
        tittle={
          selectedCustomerOptions
            ? selectedCustomerOptions.Name
            : "Selected Customer"
        }
        open={isGenerating}
        message={viewPricePdfGenratingMsg}
        loading={viewPriceIsPdfGenrating}
        error={viewPriceIsPdfError}
      />
    </Container>
  );
};

export default ViewPriceBook;
