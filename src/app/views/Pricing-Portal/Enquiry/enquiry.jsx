import React, { useState } from "react";
import {
  LinearProgress,
  Paper,
  Button,
  Box,
  styled,
  useTheme,
  useMediaQuery,
  Stack,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Breadcrumb } from "app/components";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    dataGridHeight,
    dataGridPageSize,
    dataGridpageSizeOptions,
    dataGridRowHeight,
    dataGridHeaderFooterHeight,
  } from "app/utils/constant";
import {
  getEnquiryItems,
} from "app/redux/slice/getSlice";
import useAuth from "app/hooks/useAuth";
import { OptimizedAutocomplete } from "app/components/SingleAutocompletelist";

const Container = styled("div")(({ theme }) => ({
  margin: "15px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "10px",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
}));

const Enquiry = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [addPriceListData, setAddPriceListData] = useState(null);

  const getRows = useSelector((state) => state.getSlice.getEnquiryData);
  console.log("🚀 ~ Enquiry ~ getRows:", getRows)

  const columns = [
    {
        headerName: "Item",
        field: "Item", // just a placeholder, must be unique
        width:600,
        align: "left",
        headerAlign: "left",
        valueGetter: (params) =>
          `${params.row.ItemNumber || ""} || ${params.row.ItemDescription || ""}`,
      },
    // {
    //   headerName: "Item",
    //   field: "ItemNumber",
    //   width: 100,
    //   align: "left",
    //   headerAlign: "left",
    // },
    // {
    //   headerName: "Item Description",
    //   field: "ItemDescription",
    //   width: 600,
    //   align: "left",
    //   headerAlign: "center",
    //   hide: true,
    // },
    {
      headerName: "In Active",
      field: "InActive",
      width: 150,
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Price List",
      field: "PricelistID",
      width: 150,
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Print Item",
      field: "PrintItem",
      width: 150,
      align: "left",
      headerAlign: "left",
      hide: true,
    },
  ];

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
            width: "70%",
          }}
        >
          <GridToolbarQuickFilter />
          
        </Box>
      </GridToolbarContainer>
    );
  }
const [showDataGrid,setShowGridData]=useState(false);
const [showError,setShowError]=useState(false);
  const handleFind = async() => {
    if (addPriceListData?.Item_Number) {
     const response= await dispatch(
        getEnquiryItems({
          ID: addPriceListData.Item_Number,
          CompanyID: user.companyID,
        }));
        if(response.payload.status === "Y"){
            setShowGridData(true);
            if(response.payload.HasPriceList === 0){
                setShowError(true);
            }
        }
        else{
            console.log("🚀 ~ handleFind ~  response.payload.message:",  response.payload.message)
        } 
    }else{
        alert("PLEASE CHOOSE ITEMS")
    }
  };

  return (
    <Container>
      <Formik
        initialValues={{ dummy: "" }} // Prevent Formik error
        onSubmit={() => {}}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="breadcrumb">
              <Breadcrumb routeSegments={[{ name: "Enquiry" }]} />
            </div>

            <Paper sx={{ width: "100%", mb: 2 }}>
              <Box
                display="grid"
                gap="20px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{ padding: "10px" }}
              >
              <Stack
  sx={{ gridColumn: isNonMobile ? "span 2" : "span 4" }}
  direction="column"
  gap={1}
>
  <Box display="flex" alignItems="center" gap={1}>
    <OptimizedAutocomplete
      name="items"
      id="items"
      value={addPriceListData}
      onChange={(e, newValue) => {
        setAddPriceListData(newValue);
        setShowError(false); // Clear error when new item selected
      }}
      label="Items"
      url={`${process.env.REACT_APP_BASE_URL}ItemMaster/GetItemMasterList?Type=E`}
    />
    <Button
      variant="contained"
      color="info"
      size="small"
      type="button"
      onClick={handleFind}
    >
      Find
    </Button>
  </Box>

  {/* Error Message Display */}
  {/* {showError && (
    <Box mt={0.5} ml={1} sx={{
        border: "1px solid red",

        borderRadius: 1,

        backgroundColor: "#ffe6e6",
    }}>
      <Typography color="error" align="center">
        This item is not included in any price list.
      </Typography>
    </Box>
  )} */}
</Stack>
<Stack
  sx={{ gridColumn: isNonMobile ? "span 2" : "span 4" }}
  direction="column"
  gap={1}
>
  {showError && (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end", // Ensures left alignment inside the Stack
      }}
    >
      <Box
        sx={{
          display: "inline-flex", // Shrinks to content
          alignItems: "center",
          px: 2,
          py: 1,
          border: "1px solid red",
          borderRadius: 1,
          backgroundColor: "#ffe6e6",
        }}
      >
        <Typography color="error" variant="body2">
          This item is not included in any price list.
        </Typography>
      </Box>
    </Box>
  )}
</Stack>


              </Box>

            { showDataGrid && <Box
                sx={{
                  height: 400,
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: theme.palette.info.main,
                    color: theme.palette.info.contrastText,
                    fontWeight: "bold",
                  },
                  "& .MuiDataGrid-footerContainer": {
                    backgroundColor: theme.palette.info.main,
                    color: theme.palette.info.contrastText,
                  },
                }}
              >
                <DataGrid
                rowHeight={dataGridRowHeight}
                  columnHeaderHeight={dataGridHeaderFooterHeight}
                             sx={{
                               // This is to override the default height of the footer row
                               "& .MuiDataGrid-footerContainer": {
                                 height: dataGridHeaderFooterHeight,
                                 minHeight: dataGridHeaderFooterHeight,
                                 // color: theme.palette.info.contrastText,
                               },
                             }}
                  rows={getRows}
                  columns={columns}
                  disableRowSelectionOnClick
                  getRowId={(row) => row.ItemNumber}
                  slots={{
                    loadingOverlay: LinearProgress,
                    toolbar: CustomToolbar,
                  }}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: dataGridPageSize },
                    },
                  }}
                  pageSizeOptions={dataGridpageSizeOptions}
                />
              </Box>}
            </Paper>
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default Enquiry;
