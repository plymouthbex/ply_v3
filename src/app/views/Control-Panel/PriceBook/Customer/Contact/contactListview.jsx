import React, { useEffect } from "react";
import {
  Box,
  LinearProgress,
  Paper,
  Button,
  styled,
  useTheme,
  TextField,
  Stack,
  useMediaQuery,
  Typography
} from "@mui/material";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Breadcrumb } from "app/components";
import { dataGridHeight, dataGridRowHeight,dataGridHeaderFooterHeight } from "app/utils/constant";
import { Add } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch, useSelector } from "react-redux";
import { getConfigureContactListView } from "app/redux/slice/listviewSlice";
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
const Contact = () => {
  // ********************* HOOKS AND CONSTANTS ********************* //
  const theme = useTheme();
  const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const location =useLocation();
    const State=location.state;
    console.log("🚀 ~ Contact ~ State:", State)
const dispatch=useDispatch();
  // ********************* LOCAL STATE ********************* //

  // ********************* REDUX STATE ********************* //
  const contactrRows = useSelector(
    (state) => state.listview.configureContactListViewData
  );
  console.log("🚀 ~ Company ~ contactrRows:", contactrRows)

 
  useEffect(() => {
    dispatch(getConfigureContactListView({ID:State.address.company.RecordID,CustomerID:State.address.Code,AddressID:State.Code}));
    
  }, [dispatch]);
  // ********************* COLUMN AND ROWS ********************* //
   const columns = [
      {
        headerName: "Email",
        field: "EmailId",
        width: "150",
        align: "left",
        headerAlign: "left",
        hide: true,
      },
      {
        headerName: "Phone",
        field: "Phone",
        width: "170",
        align: "left",
        headerAlign: "left",
        hide: true,
      },
      {
          headerName: "Contact Person Name",
          field: "ContactName",
          width: "170",
          align: "left",
          headerAlign: "left",
          hide: true,
        },
      {
        field: "Action",
        headerName: "Action",
        minWidth: 100,
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
              
              <Button
                sx={{ height: 25 }}
                variant="contained"
                color="secondary"
                size="small"
                startIcon={<ModeEditOutlineIcon size="small" />}
                onClick={() => {
                    navigate("/pages/control-panel/configure-price-book/customer/edit-Contact/configureEdit",{state:{
                      RecordID:params.row.RecordID,
                      Configure:State
                    }});
                  }}
              >
                Edit Communication
              </Button>
            </div>
            
          );
        },
      },
    ];
  
    const rows = [
      {
        RecordID:1,
         email:"Taylor@gmail.com",
         phone:"20667663210055",
         contactName:"Taylor"
      },
      {
        RecordID:2,
          email:"smith@gmail.com",
          phone:"2244356789",
          contactName:"Smith"
      },
      {
        RecordID:3,
          email:"kabilan@gmail.com",
          phone:"6382262524214",
          contactName:"Kabilan"
      },
    ];

  // ********************* TOOLBAR ********************* //
  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between", // Ensures space between left and right elements
          width: "100%",
          // padding: 2,
        }}
      >
       <Box
  sx={{
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start", // Align to the left
    alignItems: "center",
    gap: 1 // Space between items
  }}
>
  <Typography fontSize={"16px"}>
    <Typography component="span" fontSize={"16px"} fontWeight="bold">
      Company:
    </Typography>
    {`${State.address.company.Code} || ${State.address.company.Name}`}
    <Typography component="span" fontWeight="bold" fontSize={"18px"}>{`  >>    `}</Typography>
  </Typography>

  <Typography fontSize={"16px"}>
    <Typography component="span" fontSize={"16px"} fontWeight="bold">
      Customer:
    </Typography>
    {`${State.address.Code} || ${State.address.Name}`}
    <Typography component="span" fontWeight="bold" fontSize={"16px"}>{` >> `}</Typography>
  </Typography>

  <Typography fontSize={"16px"}>
    <Typography component="span" fontSize={"16px"} fontWeight="bold">
    Address:
    </Typography>
    {`${State.Code} || ${State.Name}`}
    <Typography component="span" fontWeight="bold" fontSize={"16px"}></Typography>
  </Typography>
</Box>

  
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end", // Align the quick filter to the right
            gap: 2,
          }}
        >
            <GridToolbarQuickFilter />
           <Button
            variant="contained"
            color="info"
            size="small"
            startIcon={<Add fontSize="small" />}
            onClick={() => {
              navigate("/pages/control-panel/configure-price-book/customer/add-Contact/configureEdit",{state:{
                RecordID:0,
                Configure:State
              }});
            }}
          >
            Add
          </Button>
        
        </Box>
      </GridToolbarContainer>
    );
  }
  

  return (
    <Container>
       <div className="breadcrumb" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
       <Breadcrumb
                 routeSegments={[{ name: "Configure Price Book Type", path: "/pages/control-panel/configure-price-book/company"  },
                    { name: "Customer",path:"/pages/control-panel/configure-price-book/customer" } ,
                    { name: "Address" ,path:"/pages/control-panel/configure-price-book/customer/address"},
                {name:"Contacts"}]}
                    
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
                        {/* <Stack sx={{ gridColumn: "span 2" }} direction="column" gap={2}> */}
                        {/* <Typography fontSize={"16px"} fontWeight={"bold"}>Customer:123456||TestCustomer</Typography> */}
                        {/* <Typography fontSize={"16px"} fontWeight={"bold"}>Address:BILLING||123 Jedi Lane SW || Suite 66</Typography> */}
                          {/* </Stack> */}
                          </Box>
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

          "& .MuiDataGrid-row.Mui-selected:hover": { 

            backgroundColor: `${theme.palette.action.selected} !important`, 

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
                 height:dataGridHeaderFooterHeight,
                 minHeight: dataGridHeaderFooterHeight,
             },
           }}
            slots={{
              loadingOverlay: LinearProgress,
              toolbar: CustomToolbar,
            }}
            rowHeight={dataGridRowHeight}
            rows={contactrRows}
            columns={columns}
            
            disableSelectionOnClick
            disableRowSelectionOnClick
            getRowId={(row) => row.RecordID}
            initialState={{
              pagination: { paginationModel: { pageSize: 20 } },
            }}
            pageSizeOptions={[5, 10, 20, 25]}
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
      </Paper>
    </Container>
  );
};

export default Contact;
