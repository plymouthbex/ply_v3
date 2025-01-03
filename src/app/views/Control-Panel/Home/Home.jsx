import {
  IconButton,
  Stack,
} from "@mui/material";
import { Box, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { useTheme } from "@emotion/react";
import { Navigate, useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";


import { useDispatch, useSelector } from "react-redux";
import useAuth from "app/hooks/useAuth";
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



const HomePage = () => {


  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          
          {/* <Typography align="center" sx={{ ml: 3 }}>
            {dateRange}{" "}
            <IconButton
              color="success"
              onClick={() => setShowFields((prev) => !prev)}
            >
              <ArrowDropDownIcon />
            </IconButton>
          </Typography>

          {showFields && (
            <TextField
              name="date"
              type="date"
              id="date"
              label="Date"
              value={toDate}
              onChange={(e) => handleDateChange(e.target.value)}
              sx={{ width: 300 }}
            />
          )} */}
          <PDFDownloadLink
            
             
            
            fileName={`Full Price Book`}
          >
            {/* {({ blob, url, loading, error }) => (
              <Tooltip title="PDF" placement="top">
                <Button
                  disabled={loading}
                  variant="contained"
                  component="a"
                  aria-label="print"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    backgroundColor: "#164D50",
                    color: "white",
                    borderRadius: "25px",
                    padding: "8px 20px",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#164D50",
                    },
                  }}
             
                >
                  See Full PriceBook
                </Button>
              </Tooltip>
            )} */}
          </PDFDownloadLink>
        </Box>
        <Box sx={{ height: "250px" }}>
          <IMG
            alt={"Plymouth"}
            src={"/assets/images/plylogo.png"}
            width={"100%"}
            height={"100%"}
          />
        </Box>
        <Stack direction="row">
          <PDFDownloadLink
        
    
            fileName={`Full Price Book`}
          >
            {/* {({ blob, url, loading, error }) => (
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
            )} */}
          </PDFDownloadLink>

          {/* <Tooltip title="Excel" placement="top">
            <CustomIconButton
              bgcolor={theme.palette.success.main}
              aria-label="excel"
              onClick={() =>
                exportToExcelFullPriceBook({
                  excelData: genricData,
                  date: effDate,
                })
              }
            >
              <SiMicrosoftexcel style={{ fontSize: "21px" }} />
            </CustomIconButton>
          </Tooltip> */}

          <PDFDownloadLink
         
            fileName={`Full Price Book`}
          >
            {/* {({ blob, url, loading, error }) => (
              <Tooltip title="Print" placement="top">
                <CustomIconButton
                  disabled={loading}
                  component="a"
                  bgcolor={theme.palette.warning.main}
                  aria-label="print"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IoMdPrint style={{ fontSize: "21px" }} />
                </CustomIconButton>
              </Tooltip>
            )} */}
          </PDFDownloadLink>

          {/* <Tooltip title="Mail" placement="top">
            <CustomIconButton
              bgcolor={theme.palette.error.main}
              aria-label="mail"
              onClick={() => navigate("/sent-mail")}
            >
              <IoIosMailOpen style={{ fontSize: "21px" }} />
            </CustomIconButton>
          </Tooltip> */}
        </Stack>
      </Box>
    </Container>
  );
};

export default HomePage;
