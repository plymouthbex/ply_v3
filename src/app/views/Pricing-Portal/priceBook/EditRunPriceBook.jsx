import {
  Box,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  TextField,
  Tooltip,
  Typography,
  styled,
  useTheme,
  FormControlLabel,
  Checkbox,
  Stack,
  Fab,
  Button,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import React from "react";
import { Breadcrumb, SimpleCard } from "app/components";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useEffect, useState } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import {
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { SiMicrosoftexcel } from "react-icons/si";
import { FaFilePdf } from "react-icons/fa6";
import { IoIosMailOpen } from "react-icons/io";
import { IoMdPrint } from "react-icons/io";
import { themeColors } from "app/components/baseTheme/themeColors";
import useSettings from "app/hooks/useSettings";
import { useNavigate } from "react-router-dom";
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

const IMG = styled("img")(() => ({
  width: "100%",
  overflow: "hidden",
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

function downloadPdfUsingFetch(url) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.blob(); // Convert response to Blob
    })
    .then((blob) => {
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", "file.pdf"); // Suggest a file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl); // Clean up
    })
    .catch((error) =>
      console.error("There was an error downloading the PDF:", error)
    );
}

const handleOpenType = (type) => {
  if (type === "PDF") {
    // URL of the PDF file
    const pdfUrl =
      "https://plymouth.beyondexs.com/uploads/Custom%20Price%20List%20Claus%20Meats.pdf";
    // Open the PDF in a new tab
    window.open(pdfUrl, "_blank");
  }

  if (type === "EXCEL") {
    // URL of the PDF file
    const pdfUrl =
      "https://plymouth.beyondexs.com/uploads/Custom Price List Claus Meats.xlsx";
    // Open the PDF in a new tab
    window.open(pdfUrl, "_blank");
  }
  if (type === "PRINT") {
    // URL of the PDF file
    const pdfUrl = "https://example.com/your-pdf-file.pdf";
    // Open the PDF in a new tab
    window.open(pdfUrl, "_blank");
  }
  if (type === "MAIL") {
    // URL of the PDF file
    const pdfUrl = "https://example.com/your-pdf-file.pdf";
    // Open the PDF in a new tab
    window.open(pdfUrl, "_blank");
  }
};

export default function EditRunPriceBook() {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const isLoading = useSelector((state) => state.listview.loading);
  const colors = themeColors;
  const navigate = useNavigate();

  const runGrpProcessedData = useSelector(
    (state) => state.listview.runGrpProcessedData
  );
  console.log(
    "🚀 ~ EditRunPriceBook ~ runGrpProcessedData:",
    runGrpProcessedData
  );

  const handleMailNavigate = () => {
    navigate("/sent-mail");
  };
  //=================================TOOLBAR=====================================//
  function secondaryCustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            mb: { xs: 2, sm: 0 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" }, // Switch to column on smaller screens
              alignItems: "start",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
              }}
            >
              <GridToolbarQuickFilter
                sx={{
                  input: {
                    color: "black",
                  },
                  "& .MuiInputBase-input": {
                    color: "black",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "black",
                  },
                  mb: { md: 0 }, // Add margin for small screens
                }}
              />
            </Box>
          </Box>
        </Box>
      </GridToolbarContainer>
    );
  }
  //================================COLUMNS AND ROWS==========================================//
  const initialRows = [
    {
      id: 1,
      customer: "Acme Poultry",
      fp: true,
      cp: true,
      excel: true,
      pdf: true,
      checked: true,
    },
    {
      id: 4,
      customer: "Azteca",
      fp: false,
      cp: true,
      excel: true,
      pdf: false,
      checked: true,
    },
    {
      id: 7,
      customer: "Coro Foods",
      fp: true,
      cp: false,
      excel: false,
      pdf: true,
      checked: true,
    },
  ];

  const [rows, setRows] = useState(initialRows);

  const handleCheckboxChange = (id, field) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, [field]: !row[field] } : row
      )
    );
  };

  const columns = [
    {
      field: "customer",
      headerName: "Customer Name",
      width: 300,
    },
    {
      field: "fullPriceBooks",
      headerName: "Full Price Book",
      width: 300,
      renderCell: (params) => (
        <Stack
          direction="row"
          alignItems={"flex-end"}
          justifyContent={"center"}
        >
          {params.row.fppdf ? (
            <Tooltip title="PDF" placement="top">
              <CustomIconButton
                bgcolor={theme.palette.primary.main}
                download={params.row.fileName1}
                component="a"
                aria-label="pdf"
                href={URL.createObjectURL(params.row.blobfp)}
              >
                <FaFilePdf style={{ fontSize: "15px" }} />
              </CustomIconButton>
            </Tooltip>
          ) : (
            false
          )}

          {params.row.fpexcel ? (
            <Tooltip title="Excel" placement="top">
              <CustomIconButton
                bgcolor={theme.palette.success.main}
                download={`${params.row.fileName1}.xlsx`}
                component="a"
                aria-label="excel"
                href={URL.createObjectURL(params.row.excelBlobfp)}
              >
                <SiMicrosoftexcel style={{ fontSize: "15px" }} />
              </CustomIconButton>
            </Tooltip>
          ) : (
            false
          )}

          {params.row.fppdf ? (
            <Tooltip title="Print" placement="top">
              <CustomIconButton
                bgcolor={theme.palette.warning.main}
                component="a"
                aria-label="print"
                href={URL.createObjectURL(params.row.blobfp)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoMdPrint style={{ fontSize: "15px" }} />
              </CustomIconButton>
            </Tooltip>
          ) : (
            false
          )}

          {params.row.fpexcel || params.row.fppdf ? (
            <Tooltip title="Mail" placement="top">
              <CustomIconButton
                bgcolor={theme.palette.error.main}
                aria-label="mail"
                onClick={handleMailNavigate}
              >
                <IoIosMailOpen style={{ fontSize: "15px" }} />
              </CustomIconButton>
            </Tooltip>
          ) : (
            false
          )}
        </Stack>
      ),
    },
    {
      field: "customPriceBook",
      headerName: "Custom Price Book",
      width: 300,
      renderCell: (params) => (
        <Stack
          direction="row"
          alignItems={"flex-end"}
          justifyContent={"center"}
        >
          {params.row.cppdf  ? (
            <Tooltip title="PDF" placement="top">
              <CustomIconButton
                bgcolor={theme.palette.primary.main}
                download={params.row.fileName2}
                component="a"
                aria-label="pdf"
                href={URL.createObjectURL(params.row.blobcp)}
              >
                <FaFilePdf style={{ fontSize: "15px" }} />
              </CustomIconButton>
            </Tooltip>
          ) : (
            false
          )}

          {params.row.cpexcel ? (
            <Tooltip title="Excel" placement="top">
              <CustomIconButton
                bgcolor={theme.palette.success.main}
                download={`${params.row.fileName2}.xlsx`}
                component="a"
                aria-label="excel"
                href={URL.createObjectURL(params.row.excelBlobcp)}
              >
                <SiMicrosoftexcel style={{ fontSize: "15px" }} />
              </CustomIconButton>
            </Tooltip>
          ) : (
            false
          )}

          {params.row.cppdf  ? (
            <Tooltip title="Print" placement="top">
              <CustomIconButton
                bgcolor={theme.palette.warning.main}
                component="a"
                aria-label="print"
                href={URL.createObjectURL(params.row.blobcp)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoMdPrint style={{ fontSize: "15px" }} />
              </CustomIconButton>
            </Tooltip>
          ) : (
            false
          )}

          {params.row.cppdf || params.row.cpexcel  ? (
            <Tooltip title="Mail" placement="top">
              <CustomIconButton
                bgcolor={theme.palette.error.main}
                aria-label="mail"
                onClick={handleMailNavigate}
              >
                <IoIosMailOpen style={{ fontSize: "15px" }} />
              </CustomIconButton>
            </Tooltip>
          ) : (
            false
          )}
        </Stack>
      ),
    },
  ];

  const { settings, updateSettings } = useSettings();
  const toggle = () => {
    updateSettings({
      secondarySidebar: { open: !settings.secondarySidebar.open },
    });
  };
  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
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
              { name: "Price Book" },
              { name: "Price Book Group", path: -1 },
              { name: "Send Price Book Group" },
            ]}
          />
        </Box>

        {/* Back Button on the right */}
        <Box display="flex" justifyContent="flex-end">
          <Button
            onClick={handleBackClick}
            startIcon={<ArrowBackIcon />}
            variant="contained"
            aria-label="back"
            sx={{
              "&:hover": {
                backgroundColor: theme.palette.secondary.light, // Custom hover color
              },
              color: theme.palette.secondary.contrastText,
              bgcolor: theme.palette.secondary.light,
              fontWeight: "bold",
            }}
            size="small"
          >
            Back
          </Button>
          {/* <IconButton onClick={handleBackClick}>
        <ArrowBackIcon style={{ cursor: "pointer" }} />
        </IconButton> */}
        </Box>
      </Box>
      {/* </Box> */}
      <SimpleCard>
        <Box
          sx={{
            display: "flex",
            flexDirection: isNonMobile ? "column" : "column",
          }}
        >
          <Box
            sx={{
              p: 0,
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
                color: "primary",
              },
            }}
          >
            <DataGrid
              columnHeaderHeight={dataGridHeaderFooterHeight}
                        sx={{
                          // This is to override the default height of the footer row
                          '& .MuiDataGrid-footerContainer': {
                              height: dataGridHeaderFooterHeight,
                              minHeight: dataGridHeaderFooterHeight,
                          },
                      height: "500px" }}
              slots={{
                loadingOverlay: LinearProgress,
                toolbar: secondaryCustomToolbar,
              }}
              rows={runGrpProcessedData}
              columns={columns}
              loading={isLoading}
              disableSelectionOnClick
              getRowId={(row) => row.id}
              initialState={{
                pagination: { paginationModel: { pageSize: 15 } },
              }}
              rowHeight={40}
              pageSizeOptions={[5, 15, 25]}
              columnVisibilityModel={{
                RecordID: false,
                SortOrder: false,
                CreatedDateTime: false,
                ImgApp: false,
                Sap: false,
                Contact: false,
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
        </Box>
        <Stack direction="row" justifyContent="end" marginTop={2}></Stack>
      </SimpleCard>
    </Container>
  );
}
