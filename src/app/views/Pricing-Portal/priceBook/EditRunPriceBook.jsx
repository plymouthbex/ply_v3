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
import { useEffect, useState } from "react";

import {
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { SiMicrosoftexcel } from "react-icons/si";
import { FaFilePdf } from "react-icons/fa6";
import { IoIosMailOpen } from "react-icons/io";
import { IoMdPrint } from "react-icons/io";
import { themeColors } from "app/components/baseTheme/themeColors";
import useSettings from "app/hooks/useSettings";
import { useNavigate } from "react-router-dom";
import { dataGridHeaderFooterHeight } from "app/utils/constant";
import { runGroupMailData } from "app/redux/slice/postSlice";
import useAuth from "app/hooks/useAuth";
import { PriceGroupAlertApiDialog } from "app/components/LoadindgDialog";
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

export default function EditRunPriceBook() {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const isLoading = useSelector((state) => state.listview.loading);
  const colors = themeColors;
  const navigate = useNavigate();
  const { user } = useAuth();
  const dispatch = useDispatch();

  const runGrpProcessedData = useSelector(
    (state) => state.listview.runGrpProcessedData
  );


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

  const [openAlert, setOpenAlert] = useState(false);
  const [postError, setPostError] = useState(false);


  const columns = [

    {
      field: "customernumber",
      headerName: "Customer Number",
      minWidth: 200,
      // flex: 1,
    },
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
          {params.row.fppdf && params.row.blobfp ? (
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

          {params.row.fpexcel  && params.row.excelBlobfp ? (
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

          {params.row.fppdf  && params.row.blobfp ? (
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

          {/* {params.row.fpexcel || params.row.fppdf ? (
            <Tooltip title="Mail" placement="top">
              <CustomIconButton
                bgcolor={theme.palette.error.main}
                aria-label="mail"
                onClick={() => fnRunGrpEmailProcess(params.row)}
              >
                <IoIosMailOpen style={{ fontSize: "15px" }} />
              </CustomIconButton>
            </Tooltip>
          ) : (
            false
          )} */}
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
          {params.row.cppdf  && params.row.blobcp ? (
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

          {params.row.cpexcel && params.row.excelBlobcp ? (
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

          {params.row.cppdf && params.row.blobcp ? (
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

          {/* {params.row.cppdf || params.row.cpexcel ? (
            <Tooltip title="Mail" placement="top">
              <CustomIconButton
                bgcolor={theme.palette.error.main}
                aria-label="mail"
                onClick={() => fnRunGrpEmailProcess(params.row)}
              >
                <IoIosMailOpen style={{ fontSize: "15px" }} />
              </CustomIconButton>
            </Tooltip>
          ) : (
            false
          )} */}
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
              { name: "Print Price Book Group", path: -1 },
              { name: "Send Print Price Book Group" },
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
                height: "500px",
              }}
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
    </Container>
  );
}
