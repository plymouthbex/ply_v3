import React, { useEffect } from "react";
import {
  Box,
  LinearProgress,
  Paper,
  Button,
  styled,
  useTheme,
  Stack,Tooltip,
  IconButton
} from "@mui/material";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Breadcrumb } from "app/components";
import {
  dataGridHeaderFooterHeight,
  dataGridHeight,
  dataGridPageSize,
  dataGridpageSizeOptions,
  dataGridRowHeight,
} from "app/utils/constant";

// ********************** ICONS ********************** //
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Add } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "app/hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { themeColors } from "app/components/baseTheme/themeColors";
import { getProspectListData } from "app/redux/slice/getSlice";
import { deleteQuote } from "app/redux/slice/postSlice";
import { PriceGroupAlertApiDialog, QuoteTempAlertApiDialog } from "app/components/LoadindgDialog";
import { useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
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
const SavedQuoteList = () => {
  // ********************* HOOKS AND CONSTANTS ********************* //
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const colors = themeColors;
  const location = useLocation();
  const state = location.state ? location.state : {};

  const rowProspect = useSelector(
    (state) => state.getSlice.getQuoteProspectData
  );
  const statusProspect = useSelector(
    (state) => state.getSlice.getQuoteProspectStatus
  );
  const loadingProspect = useSelector(
    (state) => state.getSlice.getQuoteProspectLoading
  );
  const errorProspect = useSelector(
    (state) => state.getSlice.getQuoteProspectError
  );

  useEffect(() => {
    dispatch(
      getProspectListData({ data: { Type: "Prospect", UserID: user.id } })
    );
  }, []);
  // ********************* LOCAL STATE ********************* //

  // ********************* REDUX STATE ********************* //

  //=======================API_CALL===================================//

  // ********************* COLUMN AND ROWS ********************* //
  const columns = [
    {
      headerName: "Date",
      field: "FromDate",
      width: "100",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Name",
      field: "Name",
      width: "170",
      align: "left",
      headerAlign: "left",
      hide: true,
    },

    {
      field: "Action",
      headerName: "Action",
      minWidth: 200,
      flex: 1,
      sortable: false,
      headerAlign: "center",
      filterable: false,
      disableColumnMenu: true,
      disableExport: true,
      align: "center",
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", gap: "8px" }}>
           <Tooltip title="Copy">
  <IconButton
    color="black"
    size="small"
    onClick={() => {
      navigate("/pages/pricing-portal/new-quote/copy", {
        state: {
          headerID: params.row.RecordID,
        },
      });
    }}
  >
    <ContentCopyIcon fontSize="small" />
  </IconButton>
</Tooltip>

<Tooltip title="View">
  <IconButton
    color="black"
    size="small"
    onClick={() => {
      navigate("/pages/pricing-portal/new-quote/view/build-quote", {
        state: {
          headerID: params.row.RecordID,
        },
      });
    }}
  >
    <VisibilityIcon fontSize="small" />
  </IconButton>
</Tooltip>

<Tooltip title="Delete">
  <IconButton
    color="error"
    size="small"
    onClick={() => {
      setDeleteID(params.row.RecordID);
      setIsRemoveItem(true);
    }}
  >
    <DeleteIcon fontSize="small" />
  </IconButton>
</Tooltip>

          </div>
        );
      },
    },
  ];

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
        </Box>
      </GridToolbarContainer>
    );
  }

  const [isRemoveItem, setIsRemoveItem] = useState(false);
  const [openAlert6, setOpenAlert6] = useState(false);
  const [postError6, setPostError6] = useState(false);
  const [deleteID, setDeleteID] = useState(0);
  const itemDeleteFn = async (id) => {
    const response = await dispatch(deleteQuote({ id: deleteID }));
    if (response.payload.status === "Y") {
      setPostError6(false);
      setOpenAlert6(true);
      setDeleteID(0);
      dispatch(
        getProspectListData({ data: { Type: "Prospect", UserID: user.id } })
      );
    } else {
      setOpenAlert6(true);
      setPostError6(true);
      setDeleteID(0);
    }
  };

  return (
    <Container>
      <div
        className="breadcrumb"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Breadcrumb
          routeSegments={[
            { name: "Price Book" },
            { name: "Templates", path: "/pages/pricing-portal/templates" },
            { name: "Saved Quote" },
          ]}
        />
        <Stack direction={"row"} gap={1}>
          <Button
            variant="contained"
            color="info"
            size="small"
            startIcon={<ArrowBackIcon size="small" />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </Stack>
      </div>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <Box
          sx={{
            height: "400px",
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
              toolbar: CustomToolbar,
            }}
            rows={rowProspect}
            loading={loadingProspect}
            columns={columns}
            disableSelectionOnClick
            disableRowSelectionOnClick
            getRowId={(row) => row.RecordID}
            initialState={{
              pagination: { paginationModel: { pageSize: dataGridPageSize } },
            }}
            rowHeight={dataGridRowHeight}
            pageSizeOptions={dataGridpageSizeOptions}
            columnVisibilityModel={{
              RecordID: true,
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
          key={23131}
          open={openAlert6}
          error={postError6}
          message={postError6 ? "Quote not deleted! and Please retry":"Quote deleted successfully"}
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
          message={`Are you sure you want to delete this quote?`}
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
                  itemDeleteFn();
                  setIsRemoveItem(false);
                }}
              >
                Confirm
              </Button>
            </Box>
          }
        />
      </Paper>
    </Container>
  );
};

export default SavedQuoteList;
