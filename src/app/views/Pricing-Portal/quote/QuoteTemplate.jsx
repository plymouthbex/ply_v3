import React, { useEffect, useState } from "react";
import {
  Box,
  LinearProgress,
  styled,
  Stack,
  Tooltip,
  Button,
} from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import { useDispatch, useSelector } from "react-redux";
import { themeColors } from "app/components/baseTheme/themeColors";
import { useNavigate } from "react-router-dom";
import { fetchListviewPriveTemplate } from "app/redux/slice/listviewSlice";
import useAuth from "app/hooks/useAuth";
import { deleteQuotePriceData } from "app/redux/slice/postSlice";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { useTheme } from "@emotion/react";
import {
  PriceGroupAlertApiDialog,
  QuoteTempAlertApiDialog,
} from "app/components/LoadindgDialog";
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

//=================================COLUMNS AND ROWS==========================================//
export default function QuoteTemplate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const colors = themeColors;
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false); // Dialog open/close state
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [selectedTemplateName, setSelectedTemplateName] = useState(null); // Store selected template ID

  useEffect(() => {
    dispatch(
      fetchListviewPriveTemplate({
        userID: `Quote/GetQuoteTemplatesList?UserId=${user.id}`,
      })
    );
  }, [dispatch, user.id]);

  const isLoading = useSelector((state) => state.listview.priceTemploading);
  // const status = useSelector((state) => state.listview.priceTempstatus);
  const rows = useSelector((state) => state.listview.priceTemplistRowData);
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
            onClick={() =>
              navigate("/pages/quote", {
                state: {
                  templateID: 0,
                  templateName: "",
                  accessID: "PPB005",
                  name: "Quote",
                },
              })
            }
          >
            New Template
          </Button>
        </Box>
      </GridToolbarContainer>
    );
  }
  const columns = [
    {
      headerName: "Template Name",
      field: "TemplateName",
      align: "left",
      width: "500",
      headerAlign: "left",
    },
    {
      headerName: "Info",
      field: "Info",
      width: "200",
      align: "left",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      disableExport: true,
      renderCell: (params) => {
        return (
          <Button
            onClick={() =>
              navigate("/pages/quote-form", {
                state: {
                  templateID: params.row.Recid,
                  templateName: params.row.TemplateName,
                  fromQuotePage: true,
                  accessID: "PPB005",
                  name: "Quote",
                },
              })
            }
            // color="error"
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
            New Quote
          </Button>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      minWidth: 100,
      sortable: false,
      headerAlign: "center",
      filterable: false,
      disableColumnMenu: true,
      disableExport: true,
      align: "center",
      renderCell: (params) => {
        return (
          <Tooltip title="Delete">
            <Button
              onClick={() => {
                setSelectedTemplateId(params.row.Recid);
                setSelectedTemplateName(params.row.TemplateName); // Store the template ID
                setOpenDialog(true);
              }}
              // color="error"
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
              Delete
            </Button>
          </Tooltip>
        );
      },
    },
  ];

  const [openAlert, setOpenAlert] = useState(false);
  const [postError, setPostError] = useState(false);
  const handleDelete = async () => {
    if (selectedTemplateId) {
      const res = await dispatch(
        deleteQuotePriceData({ id: selectedTemplateId })
      );
      if (res.payload.Status === "Y") {
        setOpenDialog(false); // Close the dialog
        setSelectedTemplateId(null);
        dispatch(
          fetchListviewPriveTemplate({
            userID: `Quote/GetQuoteTemplatesList?UserId=${user.id}`,
          })
        );
        setOpenAlert(true);
      } else {
        setOpenDialog(false); // Close the dialog
        setSelectedTemplateId(null);
        setOpenAlert(true);
        setPostError(true);
        // toast.error("Something went wrong");
      }
      // Clear the selected template ID
    }
  };

  const handleCancel = () => {
    setOpenDialog(false); // Close the dialog without deleting
    setSelectedTemplateId(null); // Clear the selected template ID
  };

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[{ name: "Quote" }, { name: "Templates" }]}
        />
      </Box>

      <Stack spacing={3}>
        <SimpleCard>
          <Box
            sx={{
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
              },"& .MuiTablePagination-root": {
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
               '& .MuiDataGrid-footerContainer': {
                   height: dataGridHeaderFooterHeight,
                   minHeight: dataGridHeaderFooterHeight,
               },
              height: "550px" }}
              slots={{
                loadingOverlay: LinearProgress,
                toolbar: CustomToolbar,
              }}
              columns={columns}
              rows={rows}
              loading={isLoading}
              disableSelectionOnClick
              getRowId={(row) => row.Recid}
              // onRowClick={(params) => navigate('/pages/quote', { state: { templateID: params.row.Recid} })}
              columnVisibilityModel={{
                Recid: false,
                UserId: false,
              }}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              rowHeight={30}
              pageSizeOptions={[5, 10, 25]}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
            />
          </Box>
        </SimpleCard>
      </Stack>

      <QuoteTempAlertApiDialog
       logo={`data:image/png;base64,${user.logo}`}
        open={openDialog}
        error={true}
        message={`Are you sure you want to delete this Quote template-${selectedTemplateName}?`}
        Actions={
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <Button
              onClick={handleCancel}
              variant="contained"
              sx={{
                "&:hover": {
                  backgroundColor: theme.palette.secondary.light, // Custom hover color
                },
                color: theme.palette.secondary.contrastText,
                bgcolor: theme.palette.secondary.light,
                height: 25,
                marginRight: 2,
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
                height: 25,
              }}
              type="submit"
              onClick={handleDelete}
            >
              Confirm
            </Button>
          </Box>
        }
      />

      <PriceGroupAlertApiDialog
       logo={`data:image/png;base64,${user.logo}`}
        open={openAlert}
        error={postError}
        message={postError ? "Something Went Wrong" : "Deleted Successfully"}
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
    </Container>
  );
}
