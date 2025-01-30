import {
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
} from "@mui/material";
import { Box, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { SiMicrosoftexcel } from "react-icons/si";
import { FaFilePdf } from "react-icons/fa6";
import { IoIosMailOpen } from "react-icons/io";
import { IoMdPrint } from "react-icons/io";
import { useTheme } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { exportToExcelFullPriceBookV1 } from "app/components/Template/Excel";
import { useDispatch, useSelector } from "react-redux";
import {
  genricPriceBookPdfGenrationg,
  getGenricPriceList,
} from "app/redux/slice/priceListSlice";
import useAuth from "app/hooks/useAuth";
import { GenricFullPriceDocument } from "app/components/Template/pdfs/GenricFullPriceBook";
import { pdf } from "@react-pdf/renderer";
import { GenricPriceBookLoadingApiDialog } from "app/components/LoadindgDialog";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
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

const IMG = styled("img")(() => ({
  width: "100%",
  overflow: "hidden",
}));

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

const HomePage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  //=======================SHOW PRICE===================================//
  const [isChecked, setIsChecked] = useState(true);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };
  const genricPriceBookIsPdfGenrating = useSelector(
    (state) => state.priceList.genricPriceBookIsPdfGenrating
  );
  const genricPriceBookPdfGenratingMsg = useSelector(
    (state) => state.priceList.genricPriceBookPdfGenratingMsg
  );
  const genricPriceBookIsPdfError = useSelector(
    (state) => state.priceList.genricPriceBookIsPdfError
  );

  const [currentDate, setCurrentDate] = useState(new Date());
  const [isNextWeek, setIsNextWeek] = useState(false); // Recalculate the current date when the component mounts or when `isNextWeek` changes
  useEffect(() => {
    const today = new Date();
    setCurrentDate(today);
  }, [isNextWeek]); // Dependency array ensures effect runs when `isNextWeek` changes

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
  const blob = `data:image;base64,${user.homePagelogo}` ;

  const [isGenerating, setIsGenerating] = useState(false);
  const getPriceBookFull = (priceListOutType) => {
    setIsGenerating(true);
    dispatch(
      genricPriceBookPdfGenrationg({
        Type: "LOADING",
        loading: true,
        message: "Preparing Full Price Book...",
      })
    );

    dispatch(
      getGenricPriceList({
        CompanyCode: user.companyCode,
        FromDate: sunday,
        ToDate: saturday,
      })
    )
      .then(async (response) => {
        if (response.payload.length > 0) {
          if (priceListOutType === "EXCEL") {
            exportToExcelFullPriceBookV1({
              excelData: response.payload,
              fileName: `${user.company}_Full Price Book_${sunday} TO ${saturday}.pdf`,
              isPrice: isChecked,
            });
            dispatch(
              genricPriceBookPdfGenrationg({
                Type: "SUCCESS",
                loading: false,
                message: "Full Price Book Succesfully Prepared-PDF",
              })
            );
            setIsGenerating(false);
            return;
          }

          try {
            const instance = pdf(
              <GenricFullPriceDocument
                key={isNextWeek}
                data={response.payload}
                coverPageData={{
                  logo: user.homePagelogo, // Replace with the actual path to the logo image
                  subtitle1: "Price List for",
                  subtitle2: "Wholesale Pricelist",
                  effectiveDate: formatedDate,
                  preparedByName: user.name,
                  preparedByPhone: user.userMobile,
                  preparedByEmail: user.email,
                  phone1: user.phone1,
                  phone2: user.phone2,
                  fax: user.fax,
                  coverImg: user.genFullPrcieBookImg,
                }}
                isPrice={isChecked}
                onRenderFinish={() => {
                  dispatch(
                    genricPriceBookPdfGenrationg({
                      Type: "SUCCESS",
                      loading: false,
                      message: "Full Price Book Succesfully Prepared",
                    })
                  );
                  setTimeout(() => {
                    setIsGenerating(false);
                  }, 500);
                }}
                onError={(e) => {
                  console.error("Render Error:", e);
                  dispatch(
                    genricPriceBookPdfGenrationg({
                      Type: "ERROR",
                      message: "An error occurred while rendering the PDF.",
                      loading: false,
                      error: true,
                    })
                  );
                  setIsGenerating(false);
                }}
              />
            );

            const blob = await instance.toBlob();
            const url = URL.createObjectURL(blob);

            if (priceListOutType === "PDF") {
              const link = document.createElement("a");
              link.href = url;
              link.download = `${user.company}_Full Price Book_${sunday} TO ${saturday}.pdf`;
              document.body.appendChild(link);

              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }

            if (priceListOutType === "PRINT") {
              window.open(url, `${user.company}_Full Price Book_${sunday} TO ${saturday}.pdf`);
              setTimeout(() => {
                URL.revokeObjectURL(url);
              }, 100);
            }
          } catch (e) {
            dispatch(
              genricPriceBookPdfGenrationg({
                Type: "ERROR",
                message: "An error occurred while rendering the PDF.",
                loading: false,
                error: true,
              })
            );
            setTimeout(() => {
              setIsGenerating(false);
            }, 1500);
          }
        } else {
          dispatch(
            genricPriceBookPdfGenrationg({
              Type: "ERROR",
              message: response.payload.message,
              loading: false,
              error: true,
            })
          );
          setTimeout(() => {
            setIsGenerating(false);
          }, 2000);
        }
      })
      .catch((e) => {
        dispatch(
          genricPriceBookPdfGenrationg({
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

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            // justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            gap: "35px",
            width: "100%",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent={"space-between"}
            sx={{ width: "100%" }}
          >
            <Stack direction="row-reverse" alignItems={"center"} gap={5}>
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

            <Stack direction={"row"} justifyContent={"flex-end"} gap={1}>
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

              <Stack direction="row">
                <Tooltip title="PDF" placement="top">
                  <CustomIconButton
                    sx={{
                      bgcolor: theme.palette.primary.main, // Use sx for styling
                      color: "white", // Ensure icon button text color is visible
                      "&:hover": {
                        bgcolor: theme.palette.primary.dark, // Darken color on hover
                      },
                    }}
                    aria-label="pdf"
                    onClick={() => getPriceBookFull("PDF")}
                  >
                    <FaFilePdf style={{ fontSize: "21px" }} />
                  </CustomIconButton>
                </Tooltip>

                <Tooltip title="Excel" placement="top">
                  <CustomIconButton
                    bgcolor={theme.palette.success.main}
                    aria-label="excel"
                    onClick={() => getPriceBookFull("EXCEL")}
                  >
                    <SiMicrosoftexcel style={{ fontSize: "21px" }} />
                  </CustomIconButton>
                </Tooltip>

                <Tooltip title="Print" placement="top">
                  <CustomIconButton
                    bgcolor={theme.palette.warning.main}
                    onClick={() => getPriceBookFull("PRINT")}
                  >
                    <IoMdPrint style={{ fontSize: "21px" }} />
                  </CustomIconButton>
                </Tooltip>

                <Tooltip title="Mail" placement="top">
                  <CustomIconButton
                  // disabled={true}
                    bgcolor={theme.palette.error.main}
                    aria-label="mail"
                    onClick={() =>
                      navigate("/sent-mail", {
                        state: {
                          customernumber: user.company,
                          fppdf:  true ,
                          fpexcel:  true ,
                          cppdf:  false,
                          cpexcel:  false,
                          FromDate: sunday,
                          ToDate: saturday,
                        },
                      })
                    }
                  >
                    <IoIosMailOpen
                    
                style={{ fontSize: "21px" }} />
                  </CustomIconButton>
                </Tooltip>
              </Stack>
            </Stack>
          </Stack>

          <Tooltip title="PDF" placement="top">
            <Button
              onClick={() => getPriceBookFull("PRINT")}
              variant="contained"
              sx={{
                borderRadius: "25px",
                padding: "8px 20px",
                "&:hover": {
                  backgroundColor: theme.palette.secondary.light, // Custom hover color
                },
                color: theme.palette.secondary.contrastText,
                bgcolor: theme.palette.secondary.light,
                fontWeight: "bold",
              }}
            >
              View Full Price Book
            </Button>
          </Tooltip>
        </Box>
        <Box sx={{ height: "250px" }}>
          <IMG alt={user.companyName} sx={{opacity: 0.5,filter: "grayscale(100%)"}} src={`data:image/png;base64,${user.logo}`} width={"100%"} height={"100%"} />
        </Box>

        <GenricPriceBookLoadingApiDialog
         logo={`data:image/png;base64,${user.logo}`}
          tittle={""}
          open={isGenerating}
          message={genricPriceBookPdfGenratingMsg}
          loading={genricPriceBookIsPdfGenrating} 
          error={genricPriceBookIsPdfError}
        />
      </Box>
    </Container>
  );
};

export default HomePage;
