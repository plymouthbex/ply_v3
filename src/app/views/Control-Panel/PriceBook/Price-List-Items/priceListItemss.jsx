import React, { useEffect, useState } from "react";
import {
  LinearProgress,
  Paper,
  Button,
  Box,
  styled,
  useTheme,
  useMediaQuery,
  TextField,
  Stack,
  FormControlLabel,
  Checkbox,
  Typography,
  MenuItem,
  DialogActions,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Breadcrumb } from "app/components";
import {
  dataGridPageSize,
  dataGridpageSizeOptions,
  dataGridRowHeight,
} from "app/utils/constant";
import { Formik } from "formik";
import lodash from "lodash";
import { FormikCustomAutocomplete } from "app/components/AutoComplete";
import {
  clearPriceListState,
  getPriceListData,
  getPriceListFilterData,
  priceListAddedItems,
  priceListDeletedItem,
} from "app/redux/slice/getSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  FormikOptimizedAutocomplete,
  OptimizedAutocomplete,
} from "app/components/SingleAutocompletelist";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  priceListConditionsPost,
  priceListDelete,
  priceListHeaderPost,
  priceListItemPost,
} from "app/redux/slice/postSlice";
import useAuth from "app/hooks/useAuth";

// ********************** ICONS ********************** //
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Add } from "@mui/icons-material";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import AlertDialog, { MessageAlertDialog } from "app/components/AlertDialog";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import Loading from "app/components/AppLoading";

// ********************** STYLED COMPONENTS ********************** //
const Container = styled("div")(({ theme }) => ({
  margin: "15px",

  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "10px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
}));

// ********************** PRICE LIST EDIT SCREEN  ********************** //
const PriceListItem = () => {
  // ********************** HOOKS AND CONSTANTS ********************** //
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isNonMobileSec = useMediaQuery("(min-width:1000px)");
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loaction = useLocation();
  const { user } = useAuth();
  const state = loaction.state;

  // ********************** LOCAL STATE ********************** //

  const [openAlert, setOpenAlert] = useState(false);
  const [postError, setPostError] = useState(false);
  const [showGridData, setShowGridData] = useState(0);
  const [isPriceListOpen, SetIsPriceListOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isItemExists, setIsItemExists] = useState(false);
  const [isItemExistsError, setIsItemExistsError] = useState(false);
  const [isRemoveItem, setIsRemoveItem] = useState(false);
  const [removeItemID, setRemoveItemID] = useState("");
  const [removeItemDesc, setRemoveItemDesc] = useState("");

  //======================= ADD PRICE LIST ===================================//
  const [addPriceListData, setAddPriceListData] = useState(null);
  const handleSelectionAddPriceListData = (newValue) => {
    setAddPriceListData(newValue);
  };

  // ********************** REDUX STATE ********************** //
  

  // ********************** COLUMN AND ROWS ********************** //

  const columns = [
    {
      headerName: "Item Number",
      field: "Item_Number",
      width: "150",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Item Description",
      field: "Item_Description",
      width: "350",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      field: "Action",
      headerName: "Attributes",
      minWidth: 200,
      flex: 1,
      sortable: false,
      headerAlign: "center",
      filterable: false,
      disableColumnMenu: true,
      disableExport: true,
      align: "center",

    //   renderCell: (param) => {
    //     return (
    //       <>
    //         <Button
    //           sx={{ height: 25 }}
    //           variant="contained"
    //           color="secondary"
    //           size="small"
    //           // onClick={() => handleRowClick(params)}
    //           onClick={() =>
    //             navigate("./item-attributes", {
    //               state: {
    //                 id: state.id,
    //                 itemNumber: param.row.Item_Number,
    //                 itemDesc: param.row.Item_Description,
    //                 priceListID: priceListHeaderData.PriceListID,
    //                 priceListDesc: priceListHeaderData.PricelistDesc,
    //               },
    //             })
    //           }
    //           startIcon={<ModeEditOutlineIcon size="small" />}
    //           disabled={
    //             params.mode === "delete" || params.mode === "view"
    //               ? true
    //               : false
    //           }
    //         >
    //           Edit
    //         </Button>
    //         {showGridData === 3 ? (
    //           <Button
    //             sx={{ height: 25, marginLeft: 2 }}
    //             variant="contained"
    //             color="secondary"
    //             size="small"
    //             onClick={() => {
    //               setRemoveItemID(param.row.Item_Number)
    //               setRemoveItemDesc(param.row.Item_Description)
    //               setIsRemoveItem(true)
    //             }}
    //             startIcon={<DeleteIcon size="small" />}
    //             disabled={
    //               params.mode === "delete" || params.mode === "view"
    //                 ? true
    //                 : false
    //             }
    //           >
    //             Remove
    //           </Button>
    //         ) : showGridData === 0 && param.row.showAction ? (
    //           <Button
    //             sx={{ height: 25, marginLeft: 2 }}
    //             variant="contained"
    //             color="secondary"
    //             size="small"
    //             onClick={() => {
    //               setRemoveItemID(param.row.Item_Number)
    //               setRemoveItemDesc(param.row.Item_Description)
    //               setIsRemoveItem(true)
    //             }}
    //             startIcon={<DeleteIcon size="small" />}
    //             disabled={
    //               params.mode === "delete" || params.mode === "view"
    //                 ? true
    //                 : false
    //             }
    //           >
    //             Remove
    //           </Button>
    //         ) : (
    //           false
    //         )}
    //       </>
    //     );
    //   },
    },
  ];
  const Itemscolumns = [
    {
      headerName: "UOFM",
      field: "Item_Number",
      width: "150",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Quantity on Hand",
      field: "QOH",
      width: "350",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Quantity on Order",
      field: "QUO",
      width: "150",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Sequence",
      field: "sequence",
      width: "350",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    // {
    //   field: "Action",
    //   headerName: "Attributes",
    //   minWidth: 200,
    //   flex: 1,
    //   sortable: false,
    //   headerAlign: "center",
    //   filterable: false,
    //   disableColumnMenu: true,
    //   disableExport: true,
    //   align: "center",

    
    // },
  ];
  const rows=[
    {
        Item_Number:"GOATS",
        Item_Description:"Goats"
    },
    {
        Item_Number:"Hemple",
        Item_Description:"Hemple"
    },
    {
        Item_Number:"MDA",
        Item_Description:"Smart Chicken"
    }
]
  // **********************  FUNCTION ********************** //

 
  // ********************** TOOLBAR ********************** //
  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          padding: "5px",
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
          <TextField
            size="small"
            name="viewitems"
            id="viewitems"
            select
            label="View Items"
            value={showGridData}
            // onChange={(e) => setShowGridData(e.target.value)}
            fullWidth
            sx={{ maxWidth: 200 }}
          >
            <MenuItem value={0}>All</MenuItem>
            <MenuItem value={1}>Filtered</MenuItem>
            <MenuItem value={3}>Ad Hoc</MenuItem>
          </TextField>
       
          </Box>
      </GridToolbarContainer>
    );
  }

  return (
    <Container>
      
        <Formik
          initialValues={{
            
          }}
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting }) => {
            // setTimeout(() => {
            //   if (params.mode === "delete") {
            //     setIsDelete(true);
            //   }
            //   if (params.mode === "add" || params.mode === "edit") {
            //     priceListSaveFn(values, setSubmitting);
            //   }
            // }, 400);
          }}
        >
          {({
            errors,
            touched,
            handleBlur,
            handleChange,
            isSubmitting,
            values,
            handleSubmit,
            resetForm,
            setFieldValue,
            setSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="breadcrumb">
                <Breadcrumb
                  routeSegments={[
                    { name: "Configure Price Book type" },
                    { name: "Company", path: "/pages/control-panel/configure-price-book/company" },
                    { name: `${params.mode} Item List` },
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
                  display="grid"
                  gap="20px"
                  gridTemplateColumns="repeat(3, minmax(0, 1fr))"
                  sx={{
                    "& > div": {
                      gridColumn: isNonMobileSec ? undefined : "span 3",
                    },
                    padding: "5px",
                  }}
                >
                
                  <Box
                    sx={{
                      height: 450,
                      gridColumn: "span 4",
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
                        color: "black !important", // Set checkbox color to black
                      },
                      // Ensure the checkbox color reflects the selected state
                      "& .MuiCheckbox-root.Mui-checked": {
                        color: "black !important", // Set checkbox color to black when checked
                      },
                      // Alternating row colors
                      "& .MuiDataGrid-row:nth-of-type(even)": {
                        backgroundColor: theme.palette.action.hover, // Color for even rows
                      },
                      "& .MuiDataGrid-row:nth-of-type(odd)": {
                        backgroundColor: theme.palette.background.default, // Color for odd rows
                      },
                      // Prevent selected row background color from changing on hover
                      "& .MuiDataGrid-row.Mui-selected:hover": {
                        backgroundColor: `${theme.palette.action.selected} !important`, // Ensure the background remains the same on hover
                      },
                    }}
                  >
                    <DataGrid
                      key={showGridData}
                      slots={{
                        loadingOverlay: LinearProgress,
                        toolbar: CustomToolbar,
                      }}
                      rowHeight={dataGridRowHeight}
                      rows={
                        rows
                      }
                      columns={columns}
                    //   loading={priceListItemLoading}
                      disableSelectionOnClick
                      disableRowSelectionOnClick
                      getRowId={(row) => row.Item_Number}
                      initialState={{
                        pagination: {
                          paginationModel: { pageSize: dataGridPageSize },
                        },
                      }}
                      pageSizeOptions={dataGridpageSizeOptions}
                      columnVisibilityModel={
                        {
                          // Action: showGridData === 0 ? false : true,
                        }
                      }
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
              </Paper>

             
            </form>
          )}
        </Formik>
     
     

      {/* {getLoading &&<Box sx={{display:'flex',flexGrow:1}}> <Loading/></Box>} */}
    </Container>
  );
};

export default PriceListItem;
