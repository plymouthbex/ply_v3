import React, { useEffect, useState } from "react";
import {
  Box,
  LinearProgress,
  Paper,
  Button,
  styled,
  useTheme,
  Typography,
  Stack,
  // Tooltip,
  Checkbox,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
  useGridApiContext,
} from "@mui/x-data-grid";
import { Breadcrumb } from "app/components";

import ClearIcon from "@mui/icons-material/Clear";
import {
  dataGridHeight,
  dataGridRowHeight,
  dataGridHeaderFooterHeight,
  dataGridPageSize,
  dataGridpageSizeOptions,
} from "app/utils/constant";
import { Add } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch, useSelector } from "react-redux";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import {
  getConfigureCustomerListView,
  getCustomerListView,
  onCheckboxChange,
  onCheckboxChangeCustomer,
} from "app/redux/slice/listviewSlice";
import CheckIcon from "@mui/icons-material/Check";
import {
  CustomerConfig,
  postConfigureCompany,
} from "app/redux/slice/postSlice";
import AlertDialog from "app/components/AlertDialog";
import useAuth from "app/hooks/useAuth";
import { SingleAutocomplete } from "app/components/AutoComplete";
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
const Customer = () => {
  // ********************* HOOKS AND CONSTANTS ********************* //
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const State = location.state;
  console.log("🚀 ~ Customer ~ State:", State)
  const { user } = useAuth();
  // ********************* LOCAL STATE ********************* //

  // ********************* REDUX STATE ********************* //
  const customerRows = useSelector(
    (state) => state.listview.configureCustomerListViewData
  );

  useEffect(() => {
    dispatch(getConfigureCustomerListView({ ID: State.RecordID }));
    // dispatch(clearCustomerListState())
  }, [dispatch]);
  // ********************* COLUMN AND ROWS ********************* //
  const columns = [
    {
      headerName: "Customer Number ",
      field: "CustomerNumber",
      width: 150,
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Customer Name",
      field: "CustomerName",
      minWidth: 250,
      // flex: 1,
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Price Level",
      field: "PriceLevel",
      width: 150,
      align: "right",
      headerAlign: "center",
      hide: false,
    },
    {
      headerName: "Price Book group",
      field: "Rungroup",
      width: 150,
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      field: "FullPriceBook",
      headerName: "Full Price Book",
      width: 180,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      disableExport: true,
      renderCell: (params) => (
        <div>
          <Checkbox
            checked={params.row.FullPriceBookExcel}
            onChange={(e) => {
              dispatch(
                CustomerConfig({
                  CustomerNumber: params.row.CustomerNumber,
                  Type: "FullPriceBookExcel",
                  Value: e.target.checked ? "1" : "0",
                })
              );
              dispatch(
                onCheckboxChangeCustomer({
                  id: params.row.RecordID,
                  field: "FullPriceBookExcel",
                })
              );

              // handleSave({...params.row,FullPriceBookExcel:e.target.checked })
            }}
            sx={{
              color: "#174c4f",
              "&.Mui-checked": {
                color: "#174c4f",
              },
            }}
          />
          Excel
          <Checkbox
            checked={params.row.FullPriceBookPdf}
            onChange={(e) => {
              dispatch(
                CustomerConfig({
                  CustomerNumber: params.row.CustomerNumber,
                  Type: "FullPriceBookPdf",
                  Value: e.target.checked ? "1" : "0",
                })
              );
              // handleSave({ ...params.row, FullPriceBookPdf: e.target.checked });
              dispatch(
                onCheckboxChangeCustomer({
                  id: params.row.RecordID,
                  field: "FullPriceBookPdf",
                })
              );
            }}
            sx={{
              color: "#174c4f",
              "&.Mui-checked": {
                color: "#174c4f",
              },
            }}
          />
          PDF
        </div>
      ),
    },
    {
      field: "customerCustomPriceBook",
      headerName: "Custom Price Book",
      minWidth: 180,
      // flex: 1,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      disableExport: true,
      renderCell: (params) => (
        <div>
          <Checkbox
            checked={params.row.CustomPriceBookExcel}
            onChange={(e) => {
              dispatch(
                CustomerConfig({
                  CustomerNumber: params.row.CustomerNumber,
                  Type: "CustomrPriceBookExcel",
                  Value: e.target.checked ? "1" : "0",
                })
              );
              dispatch(
                onCheckboxChangeCustomer({
                  id: params.row.RecordID,
                  field: "CustomPriceBookExcel",
                })
              );
            }}
            sx={{
              color: "#174c4f",
              "&.Mui-checked": {
                color: "#174c4f",
              },
            }}
          />
          Excel
          <Checkbox
            checked={params.row.CustomPriceBookPdf}
            onChange={(e) => {
              dispatch(
                CustomerConfig({
                  CustomerNumber: params.row.CustomerNumber,
                  Type: "CustomPriceBookPdf",
                  Value: e.target.checked ? "1" : "0",
                })
              );
              dispatch(
                onCheckboxChangeCustomer({
                  id: params.row.RecordID,
                  field: "CustomPriceBookPdf",
                })
              );
            }}
            sx={{
              color: "#174c4f",
              "&.Mui-checked": {
                color: "#174c4f",
              },
            }}
          />
          PDF
        </div>
      ),
    },
    {
      field: "ItemType",
      headerName: "Broken/Damaged",
      minWidth: 230,
      // flex: 1,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      disableExport: true,
      renderCell: (params) => (
        <div>
          <Checkbox
            checked={params.row.BrokenItem}
            onChange={(e) => {
              dispatch(
                CustomerConfig({
                  CustomerNumber: params.row.CustomerNumber,
                  Type: "BrokenItem",
                  Value: e.target.checked ? "1" : "0",
                })
              );
              dispatch(
                onCheckboxChangeCustomer({
                  id: params.row.RecordID,
                  field: "BrokenItem",
                })
              );
            }}
            sx={{
              color: "#174c4f",
              "&.Mui-checked": {
                color: "#174c4f",
              },
            }}
          />
          Broken
          <Checkbox
            checked={params.row.DamageItem}
            onChange={(e) => {
              dispatch(
                CustomerConfig({
                  CustomerNumber: params.row.CustomerNumber,
                  Type: "DamageItem",
                  Value: e.target.checked ? "1" : "0",
                })
              );
              dispatch(
                onCheckboxChangeCustomer({
                  id: params.row.RecordID,
                  field: "DamageItem",
                })
              );
            }}
            sx={{
              color: "#174c4f",
              "&.Mui-checked": {
                color: "#174c4f",
              },
            }}
          />
          Damaged
        </div>
      ),
    },
    {
      field: "CustomerItemNumber",
      headerName: "Customer Item Number",
      minWidth: 230,
      // flex: 1,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      disableExport: true,
      renderCell: (params) => (
        <div>
          <Checkbox
            checked={params.row.CustomerItemNumber}
            onChange={(e) => {
              dispatch(
                CustomerConfig({
                  CustomerNumber: params.row.CustomerNumber,
                  Type: "CustomerItemNumber",
                  Value: e.target.checked ? "1" : "0",
                })
              );
              dispatch(
                onCheckboxChangeCustomer({
                  id: params.row.RecordID,
                  field: "CustomerItemNumber",
                })
              );
            }}
            sx={{
              color: "#174c4f",
              "&.Mui-checked": {
                color: "#174c4f",
              },
            }}
          />
          Print
          
        </div>
      ),
    },
    {
      field: "Action",
      headerName: "Action",
      // minWidth: 100,
      flex: 1,
      sortable: false,
      headerAlign: "center",
      filterable: false,
      disableColumnMenu: true,
      disableExport: true,
      align: "center",
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {/* <Tooltip title="Confirm"> 
              <IconButton color="black" size="small" onClick={() => { handleSave(params.row)}}>
                <CheckIcon />
              </IconButton>
            // </Tooltip> */}

            {/* <Tooltip title="Contacts"> */}
              <IconButton
                color="black"
                size="small"
                onClick={() => {
                  navigate(
                    "/pages/control-panel/configure-price-book/customer/configure-contact",
                    {
                      state: {
                        RecordID: params.row.RecordID,
                        Code: params.row.CustomerNumber,
                        Name: params.row.CustomerName,
                        CompanyCode: State.Code,
                        company: State,
                        RunGroup:selectedRunGrpOptions,
                      },
                    }
                  );
                }}
              >
                <ContactMailIcon />
              </IconButton>
            {/* </Tooltip> */}

            {/* <Tooltip title="Price Lists"> */}
              <IconButton
                color="black"
                size="small"
                onClick={() => {
                  navigate(
                    "/pages/control-panel/configure-price-book/customer/edit-Customer/configureEdit",
                    {
                      state: {
                        RecordID: params.row.RecordID,
                        Code: params.row.CustomerNumber,
                        Name: params.row.CustomerName,
                        company: State,
                        RunGroup:selectedRunGrpOptions,
                      },
                    }
                  );
                }}
              >
                <RequestQuoteIcon />
              </IconButton>
            {/* </Tooltip> */}
          </div>
        );
      },
    },
  ];
  
  const [postError, setPostError] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
 const [selectedRunGrpOptions, setSelectedRunGrpOptions] = useState(State?.RunGroup?.Name ? {Name:State?.RunGroup?.Name}:null);
 console.log("🚀 ~ Customer ~ State.RunGroup:",State?.RunGroup?.Name)
 const [selectedRunGrpName, setSelectedRunGrpName] = useState(State?.RunGroup?.Name ? {Name:State?.RunGroup?.Name}:null);

  const handleSelectionRunGrpChange = (newValue) => {
    if (newValue) {
    setSelectedRunGrpOptions(newValue);
    setSelectedRunGrpName(newValue.Name)
    }else{
      setSelectedRunGrpOptions(null);
      setSelectedRunGrpName(null)
    }

 
   

    // if (newValue) {
    //   dispatch(fetchListviewRunGroup({ runGroupID: newValue.Name })).then(
    //     (res) => {
    //       const allRowIds = res.payload.rows.map((row) => row.id);
    //       setRowSelectionModel(allRowIds);
    //     }
    //   );
    // }
  };
  console.log("🚀 ~ Customer ~ selectedRunGrpOptions:", selectedRunGrpOptions);
  console.log("🚀 ~ Customer ~ selectedRunGrpName:", selectedRunGrpName)

  const filteredRows=selectedRunGrpOptions?.Name
  ? customerRows.filter(
      (row) =>
        row?.Rungroup === selectedRunGrpOptions?.Name 
    )
  : customerRows;
  console.log("🚀 ~ handleSelectionRunGrpChange ~ filteredRows:", filteredRows)
  // ********************* TOOLBAR ********************* //
  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{
          display: "flex",
          justifyContent: "space-between", // key change here
          alignItems: "center",
          width: "100%",
          flexWrap: "wrap", // optional, helps on smaller screens
          gap: 2,
        }}
      >
        {/* Left section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 ,mb:2}}>
          <Typography fontSize={"16px"}>
            <Typography component="span" fontSize={"16px"} fontWeight="bold">
              Company:
            </Typography>{" "}
            {State.Code} || {State.Name}
          </Typography>
  
          <SingleAutocomplete
            sx={{ width: 200 }}
            focused
            size="small"
            name="rungroup"
            id="rungroup"
            value={selectedRunGrpOptions}
            onChange={handleSelectionRunGrpChange}
            label="Price Book Group"
            url={`${process.env.REACT_APP_BASE_URL}PriceBookDirectory/GetRungroupByCompany?ComapnyID=${user.companyID}`}
          />
        </Box>
  
        {/* Right-aligned search */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <GridToolbarQuickFilter />
        </Box>
      </GridToolbarContainer>
    );
  }
  

  return (
    <Container>
      <div
        className="breadcrumb"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Breadcrumb
          routeSegments={[
            {
              name: "Control Panel",
              // path: "/pages/control-panel/configure-price-book/company",
            },
            {
              name: "Configure Price Book",
              // path: "/pages/control-panel/configure-price-book/company",
            },
            {
              name: "Company",
              path: "/pages/control-panel/configure-price-book/company",
            },
            { name: "Customer" },
          ]}
        />
        <Stack direction="row" gap={1}>
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
            height: dataGridHeight,

            "& .MuiDataGrid-root": {
              border: "none",
            },

            "& .name-column--cell": {
              color: theme.palette.info.contrastText,
            },

            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.info.main,

              color: theme.palette.info.contrastText,

              fontWeight: "bold",

              fontSize: theme.typography.subtitle2.fontSize,
            },

            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: theme.palette.info.light,
            },

            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",

              backgroundColor: theme.palette.info.main,

              color: theme.palette.info.contrastText,
            },

            "& .MuiCheckbox-root": {
              color: "black !important",
            },

            "& .MuiCheckbox-root.Mui-checked": {
              color: "black !important",
            },

            "& .MuiDataGrid-row:nth-of-type(even)": {
              backgroundColor: theme.palette.action.hover,
            },

            "& .MuiDataGrid-row:nth-of-type(odd)": {
              backgroundColor: theme.palette.background.default,
            },
            '& .MuiDataGrid-row:hover': {
              border: '3px solid #999999',
              // border: `1px solid #${theme.palette.action.selected} !important`, // Change border color on hover
              borderRadius: '4px', // Optional: Add rounded corners
            },
            // "& .MuiDataGrid-row.Mui-selected:hover": {
            //   backgroundColor: `${theme.palette.action.selected} !important`,
            // },
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
            // initialState={{

            // }}
            rowHeight={dataGridRowHeight}
            rows={filteredRows}
            columns={columns}
            disableSelectionOnClick
            disableRowSelectionOnClick
            getRowId={(row) => row.RecordID}
            initialState={{
              // filter: {
              //   filterModel: {
              //     items: [
              //       { field: "Rungroup", operator: "contains", value: "" },
              //     ],
              //   },
              // },
              pagination: { paginationModel: dataGridPageSize },
            }}
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
        <AlertDialog
          logo={`data:image/png;base64,${user.logo}`}
          open={openAlert}
          error={postError}
          message={
            postError
              ? "Somthing went wrong and Please retry"
              : "Changes saved successfully"
          }
          Actions={
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  setOpenAlert(false);
                }}
                sx={{ height: 25 }}
              >
                close
              </Button>
            </Box>
          }
        />
      </Paper>
    </Container>
  );
};

export default Customer;
// function CustomToolbar() {
//   const apiRef = useGridApiContext();
//   const [runGroupFilter, setRunGroupFilter] = React.useState("");

//   const handleRunGroupFilterChange = (event) => {
//     const value = event.target.value;
//     setRunGroupFilter(value);

//     apiRef.current.setFilterModel({
//       items: [
//         {
//           field: "Rungroup",
//           operator: "contains",
//           value: value,
//         },
//       ],
//     });
//   };

//   return (
//     <GridToolbarContainer
//       sx={{
//         display: "flex",
//         flexDirection: "row",
//         justifyContent: "space-between",
//         width: "100%",
//       }}
//     >
//       <Typography fontSize={"16px"}>
//         <Typography component="span" fontSize={"16px"} fontWeight="bold">
//           Company:
//         </Typography>
//         {State.Code} || {State.Name}
//       </Typography>

//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "row",
//           alignItems: "center",
//           gap: 2,
//         }}
//       >
//         {/* <TextField
//           label="Search Price Book Group "
//           variant="standard"
//           size="small"
//           value={runGroupFilter}
//           onChange={handleRunGroupFilterChange}
//           sx={{mb:2,width:200}}
//         /> */}


//          <SingleAutocomplete
//                      sx={{ mb: 2, width: 200 }}
//                       focused
//                       size='small'
//                       name="rungroup"
//                       id="rungroup"
//                       value={selectedRunGrpOptions}
//                       onChange={handleSelectionRunGrpChange}
//                       label="Price Book Group"
//                       url={`${process.env.REACT_APP_BASE_URL}PriceBookDirectory/GetRungroupByCompany?ComapnyID=5`}
//                     />
//         {/* <TextField
//           label="Search Price Book Group"
//           variant="standard"
//           size="small"
//           value={runGroupFilter}
//           onChange={handleRunGroupFilterChange}
//           sx={{ mb: 2, width: 200 }}
//           InputProps={{
//             endAdornment: runGroupFilter && (
//               <InputAdornment position="end">
//                 <IconButton
//                   size="small"
//                   onClick={() => {
//                     setRunGroupFilter("");
//                     apiRef.current.setFilterModel({ items: [] });
//                   }}
//                 >
//                   <ClearIcon fontSize="small" />
//                 </IconButton>
//               </InputAdornment>
//             ),
//           }}
//         /> */}

//         <GridToolbarQuickFilter />
//       </Box>
//     </GridToolbarContainer>
//   );
// }