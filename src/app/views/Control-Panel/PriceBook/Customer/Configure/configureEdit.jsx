// import React, { useEffect, useState } from "react";
// import {
//   Paper,
//   Button,
//   Box,
//   styled,
//   useTheme,
//   useMediaQuery,
//   FormControlLabel,
//   TextField,
//   Checkbox,
//   Typography,
//   Stack,
//   Autocomplete,
//   LinearProgress,
//   DialogActions,
//   // Tooltip,
//   IconButton,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import CancelIcon from "@mui/icons-material/Cancel";
// import {
//   GridActionsCellItem,
//   DataGrid,
//   GridRowModes,
//   GridToolbarQuickFilter,
//   GridToolbarContainer,
//   GridRowEditStopReasons,
// } from "@mui/x-data-grid";
// import { Breadcrumb } from "app/components";
// import Cover from "../../../../../../assets/plylogo.png";
// import {
//   dataGridHeight,
//   dataGridRowHeight,
//   dataGridHeaderFooterHeight,
// } from "app/utils/constant";
// // ******************** ICONS ******************** //
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import { Add, AddAlertOutlined, RefreshOutlined } from "@mui/icons-material";
// import SaveIcon from "@mui/icons-material/Save";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { Formik } from "formik";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import DeleteIcon from "@mui/icons-material/Delete";
// import * as Yup from "yup";
// import { FlexAlignCenter, FlexBox } from "app/components/FlexBox";
// import { convertHexToRGB } from "app/utils/constant";
// import { useDropzone } from "react-dropzone";
// import Publish from "@mui/icons-material/Publish";
// import {
//   FormikOptimizedAutocomplete,
//   PGOptimizedAutocomplete,
// } from "app/components/SingleAutocompletelist";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   configureAddedPriceList,
//   getConfigPriceBook,
//   getConfigPriceBook2,
// } from "app/redux/slice/getSlice";
// import {
//   ConfigurepriceListClear,
//   postConfigureCompany,
//   PostConfigurePriceListID,
//   PostCustomerPriceSheet,
//   DeleteCustomerPriceSheet,
// } from "app/redux/slice/postSlice";
// import lodash from "lodash";
// import AlertDialog, { MessageAlertDialog } from "app/components/AlertDialog";
// import useAuth from "app/hooks/useAuth";
// import {
//   CompanyPriceListAutoComplete,
//   CompanyPriceListAutoCompleteMemo,
//   CompanyPriceListCusAutoComplete,
//   CompanyPriceSheetCusAutoComplete,
// } from "app/components/FormikAutocomplete";

// // ******************** STYLED COMPONENTS ******************** //
// const Container = styled("div")(({ theme }) => ({
//   margin: "15px",
//   [theme.breakpoints.down("sm")]: { margin: "16px" },
//   "& .breadcrumb": {
//     marginBottom: "10px",
//     [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
//     display: "flex",
//     justifyContent: "space-between",
//     flexDirection: "row",
//   },
// }));
// // ******************** Image ******************** //
// const ImageWrapper = styled("div")(({ previewImage }) => ({
//   width: "100%",
//   height: 100, // Reduced height
//   minHeight: "50px", // Adjust minimum height as needed
//   maxHeight: "200px", // Adjust maximum height as needed
//   backgroundImage: `url(${previewImage || Cover})`,
//   backgroundSize: "contain", // Ensures the full image is visible
//   backgroundRepeat: "no-repeat", // Prevents tiling
//   backgroundPosition: "center",
// }));

// const DropZone = styled(FlexAlignCenter)(({ isDragActive, theme }) => ({
//   height: 70,
//   width: "50%",
//   cursor: "pointer",
//   borderRadius: "4px",
//   marginBottom: "16px",
//   transition: "all 350ms ease-in-out",
//   border: `2px dashed rgba(${convertHexToRGB(
//     theme.palette.text.primary,
//   )}, 0.3)`,
//   "&:hover": {
//     background: `rgb(${convertHexToRGB(
//       theme.palette.text.primary,
//     )}, 0.2) !important`,
//   },
//   background: isDragActive ? "rgb(0, 0, 0, 0.15)" : "rgb(0, 0, 0, 0.01)",
// }));

// // ******************** Validation Schema ******************** //
// const validationSchema = Yup.object({
//   name: Yup.string()
//     .min(3, "Name must be at least 3 characters")
//     .max(60, "Name must be at most 60 characters"),

//   phonenumber: Yup.string()
//     .matches(
//       /^\(\d{3}\) \d{3}-\d{4}$/,
//       "Phone number must be in the format (XXX) XXX-XXXX",
//     )
//     .required("Phone number is required"),

//   email: Yup.string()
//     .email("Must be a valid email")
//     .required("Email is required"),
// });

// // ******************** Price List Edit SCREEN  ******************** //
// const ConfigureEdit = () => {
//   // ******************** HOOKS AND CONSTANTS ******************** //
//   const theme = useTheme();
//   const isNonMobile = useMediaQuery("(min-width:600px)");
//   const params = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const State = location.state;
//   console.log("🚀 ~ ConfigureEdit ~ State:", State);
//   const { user } = useAuth();
//   console.log("🚀 ~ ConfigureEdit ~ user:", user);

//   const screenName = State.company.Code == "SJ" ? "Price Sheet" : "Price List";

//   console.log(screenName, "--find screenName");

//   // ******************** LOCAL STATE ******************** //

//   const [addPriceListData, setAddPriceListData] = useState([]);
//   const [isPriceListExists, setIsPriceListExists] = useState(false);
//   const [isPriceListExistsError, setIsPriceListExistsError] = useState(false);
//   const [isRemovePriceList, setIsRemovePriceList] = useState(false);
//   const [removePriceListdDesc, setremovePriceListDesc] = useState("");
//   const [postError, setPostError] = useState(false);
//   const [openAlert, setOpenAlert] = useState(false);
//   const [removePriceListID, setremovePriceListID] = useState(0);
//   const [removeRecordID, setremoveRecordID] = useState(0);
//   // ******************** REDUX STATE ******************** //

//   const data = useSelector((state) => state.getSlice.getconfigureData);
//   const pricelistdata = useSelector(
//     (state) => state.getSlice.configurePriceListGetData,
//   );
//   const pricesheetRows = useSelector(
//     (state) => state.getSlice.configurePriceSheetGetData,
//   );

//   const getRows = State.company.Code === "SJ" ? pricesheetRows : pricelistdata;

//   console.log(getRows, "--find getRows");

//   const addedRows = useSelector(
//     (state) => state.getSlice.configurePriceListAddedData,
//   );
//   console.log("🚀 ~ ConfigureEdit ~ addedRows:", addedRows);

//   const getRowsSet = new Set(getRows.map((item) => item.RecordID));
//   const filteredSelectedItems = addedRows.filter(
//     (selectedItem) => !getRowsSet.has(selectedItem.RecordID),
//   );
//   console.log(
//     "🚀 ~ ConfigureEdit ~ filteredSelectedItems:",
//     filteredSelectedItems,
//   );

//   const loading = useSelector((state) => state.getSlice.getconfigureLoading);
//   const status = useSelector((state) => state.getSlice.getconfigureStatus);
//   const error = useSelector((state) => state.getSlice.getconfigureError);

//   const handleSelectionAddPriceListData = (e, newValue) => {
//     setAddPriceListData(newValue);
//   };
//   //==================================GETAPI=====================================//
//   useEffect(() => {
//     dispatch(getConfigPriceBook({ ID: State.RecordID }));
//   }, [dispatch]);
//   // ********************** COLUMN ********************** //

//   //Column_Edit_Section
//   // =============================================================
//   // ROW EDITING
//   // =============================================================

//   const [rowModesModel, setRowModesModel] = React.useState({});

//   const handleRowEditStop = (params, event) => {
//     // Prevent the row from automatically leaving edit mode
//     // when focus moves outside the row.
//     if (params.reason === GridRowEditStopReasons.rowFocusOut) {
//       event.defaultMuiPrevented = true;
//     }
//   };

//   const handleRowModesModelChange = (newRowModesModel) => {
//     setRowModesModel(newRowModesModel);
//   };

//   // -------------------------------------------------------------
//   // EDIT
//   // -------------------------------------------------------------
//   const handleEditClick = (id) => () => {
//     setRowModesModel((oldModel) => ({
//       ...oldModel,
//       [id]: {
//         mode: GridRowModes.Edit,
//       },
//     }));
//   };

//   // -------------------------------------------------------------
//   // SAVE
//   // -------------------------------------------------------------
//   const handleSaveClick = (id) => () => {
//     setRowModesModel((oldModel) => ({
//       ...oldModel,
//       [id]: {
//         mode: GridRowModes.View,
//       },
//     }));
//   };

//   // -------------------------------------------------------------
//   // CANCEL
//   // -------------------------------------------------------------
//   const handleCancelClick = (id) => () => {
//     setRowModesModel((oldModel) => ({
//       ...oldModel,
//       [id]: {
//         mode: GridRowModes.View,
//         ignoreModifications: true,
//       },
//     }));
//   };

//   // -------------------------------------------------------------
//   // PROCESS ROW UPDATE
//   // -------------------------------------------------------------
//   // const processRowUpdate = (newRow, oldRow) => {
//   //   console.log("OLD ROW:", oldRow);
//   //   console.log("NEW ROW:", newRow);

//   //   setLocalPriceSheetItems((currentRows) =>
//   //     currentRows.map((row) => {
//   //       const rowId = row.RecordId || `${row.Item_Number}-${row.sequence}`;

//   //       const newRowId =
//   //         newRow.RecordId || `${newRow.Item_Number}-${newRow.sequence}`;

//   //       if (rowId === newRowId) {
//   //         return {
//   //           ...row,
//   //           ...newRow,
//   //         };
//   //       }

//   //       return row;
//   //     }),
//   //   );

//   //   return newRow;
//   // };

//   const columns = [
//     // {
//     //   headerName: "Name",
//     //   field: "PRICELISTID",
//     //   width: "170",
//     //   align: "left",
//     //   headerAlign: "left",
//     //   hide: false,
//     // },
//     {
//       headerName: screenName,
//       field: "PRICELISTDESCRIPTION",
//       width: "300",
//       align: "left",
//       headerAlign: "left",
//       hide: false,
//     },
//     {
//       headerName: "Item Count",
//       field: "PriceListItemCount",
//       width: 150,
//       align: "right",
//       headerAlign: "center",
//       hide: true,
//     },
//     // Show Sequence ONLY for SJ
//     ...(State.company.Code === "SJ"
//       ? [
//           {
//             headerName: "Sequence",
//             field: "Sequence",
//             width: 150,
//             align: "right",
//             headerAlign: "center",
//             editable: true,
//           },
//         ]
//       : []),
//     {
//       field: "Action",
//       headerName: "Action",
//       type: "actions",
//       minWidth: 200,
//       flex: 1,
//       sortable: false,
//       headerAlign: "center",
//       filterable: false,
//       disableColumnMenu: true,
//       disableExport: true,
//       align: "center",
//       getActions: (params) => {
//         const { id } = params;

//         const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

//         // -------------------------------------------------------
//         // ROW IS IN EDIT MODE
//         // -------------------------------------------------------
//         if (isInEditMode) {
//           return [
//             <GridActionsCellItem
//               key={`save-${id}`}
//               icon={<SaveIcon />}
//               label="Save"
//               // onClick={handleSaveClick(id)}
//               color="primary"
//             />,

//             <GridActionsCellItem
//               key={`cancel-${id}`}
//               icon={<CancelIcon />}
//               label="Cancel"
//               // onClick={handleCancelClick(id)}
//               color="inherit"
//             />,
//           ];
//         }

//         // -------------------------------------------------------
//         // NORMAL VIEW MODE
//         // -------------------------------------------------------
//         return [
//           <GridActionsCellItem
//             key={`edit-${id}`}
//             icon={<EditIcon />}
//             label="Edit"
//             // onClick={handleEditClick(id)}
//             color="primary"
//           />,

//           <GridActionsCellItem
//             key={`delete-${id}`}
//             icon={<DeleteIcon />}
//             label="Delete"
//             onClick={() => {
//               setremovePriceListID(params.row.PRICELISTID);
//               setremoveRecordID(params.row.RecordID);
//               setremovePriceListDesc(params.row.PRICELISTDESCRIPTION);
//               setIsRemovePriceList(true);
//             }}
//             color="error"
//           />,
//         ];
//       },
//       // renderCell: (param) => {
//       //   return (
//       //     <Box gap={1}>
//       //       {/* <Tooltip title="Exclude Price List"> */}
//       //       <IconButton
//       //         color="error"
//       //         size="small"
//       //         onClick={() => {
//       //           setremovePriceListID(param.row.PRICELISTID);
//       //           setremoveRecordID(param.row.RecordID);
//       //           setremovePriceListDesc(param.row.PRICELISTDESCRIPTION);
//       //           setIsRemovePriceList(true);
//       //         }}
//       //       >
//       //         <DeleteIcon fontSize="small" />
//       //       </IconButton>
//       //       {/* </Tooltip> */}
//       //     </Box>
//       //   );
//       // },
//     },
//   ];

//   function CustomToolbar() {
//     return (
//       <GridToolbarContainer
//         sx={{
//           display: "flex",
//           flexDirection: "row",
//           justifyContent: "flex-end",
//           width: "100%",
//           padding: 2,
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "row",
//             justifyContent: "flex-end",
//             alignItems: "center",
//             gap: 2,
//             paddingX: 2,
//           }}
//         >
//           <GridToolbarQuickFilter />
//           {/* <PGOptimizedAutocomplete
//             errors={isPriceListExistsError}
//             helper={isPriceListExistsError && "Please select price list!"}
//             disabled={params.mode === "delete" || params.mode === "view"}
//             name="addPriceList"
//             id="addPriceList"
//             value={addPriceListData}
//             onChange={handleSelectionAddPriceListData}
//             label="Include Price List"
//             url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=PriceList`}
//           /> */}

//           {/* <Tooltip title="Add"> */}
//           <IconButton
//             disabled={params.mode === "delete" || params.mode === "view"}
//             color="black"
//             size="small"
//             onClick={async () => {
//               if (addPriceListData && addPriceListData.length > 0) {
//                 const isItem = [...getRows, ...filteredSelectedItems].some(
//                   (item) =>
//                     lodash.isEqual(
//                       item.PRICELISTID,
//                       addPriceListData.PRICELISTID,
//                     ),
//                 );
//                 if (isItem) {
//                   setIsPriceListExists(true);
//                   setTimeout(() => {
//                     setIsPriceListExists(false);
//                     setAddPriceListData([]);
//                   }, 5000);
//                   return;
//                 }
//                 // dispatch(configureAddedPriceList(addPriceListData));

//                 const pricedata = {
//                   recordID: data.RecordID,
//                   priceListID: addPriceListData.PRICELISTID,
//                 };
//                 const response = await dispatch(
//                   PostConfigurePriceListID({ pricedata }),
//                 );

//                 if (response.payload.status === "Y") {
//                   setOpenAlert(true);
//                   setAddPriceListData([]);
//                   dispatch(getConfigPriceBook({ ID: State.RecordID }));
//                 } else {
//                   setOpenAlert(true);
//                   setPostError(true);
//                   setAddPriceListData([]);

//                   // toast.error("Error occurred while saving data");
//                 }
//               } else {
//                 setIsPriceListExistsError(true);
//                 setTimeout(() => {
//                   setIsPriceListExistsError(false);
//                 }, 2000);
//               }
//             }}
//           >
//             <Add
//               sx={{
//                 fontSize: 30, // Increased icon size
//                 color: theme.palette.success.main,
//               }}
//             />
//           </IconButton>
//           {/* </Tooltip> */}
//         </Box>
//       </GridToolbarContainer>
//     );
//   }

//   // const handleAddPriceList = async () => {
//   //   if (addPriceListData.length > 0) {
//   //     // Prepare price data and dispatch the action

//   //     if (State.company.Code != "SJ") {
//   //       const response = await dispatch(
//   //         PostConfigurePriceListID({
//   //           pricedata: addPriceListData,
//   //           RecordID: data.RecordID,
//   //         }),
//   //       );
//   //       dispatch(getConfigPriceBook({ ID: State.RecordID }));
//   //       const action = dispatch(getConfigPriceBook({ ID: State.RecordID }));
//   //       if (response.payload.status === "Y") {
//   //         // dispatch(configureAddedPriceList(addPriceListData));

//   //         console.log("🚀 ~ handleAddPriceList ~ dispatched action:", action);
//   //         setAddPriceListData([]);
//   //       }
//   //     }
//   //   } else {
//   //     // Handle case where no price list data is selected
//   //     setIsPriceListExistsError(true);
//   //     setTimeout(() => {
//   //       setIsPriceListExistsError(false);
//   //     }, 2000);
//   //   }
//   // };

//   const handleAddPriceList = async () => {
//     // Since addPriceListData is an array, check length
//     if (!addPriceListData || addPriceListData.length === 0) {
//       setIsPriceListExistsError(true);

//       setTimeout(() => {
//         setIsPriceListExistsError(false);
//       }, 2000);

//       return;
//     }

//     try {
//       // ==========================================
//       // SJ COMPANY -> CUSTOMER PRICE SHEET API
//       // ==========================================
//       if (State.company.Code === "SJ") {
//         const priceSheetData = addPriceListData.map((priceSheet, index) => ({
//           companyID: data.CompanyID,
//           customerID: data.RecordID,
//           priceSheetID: priceSheet.RecordID,
//           createdBy: user.name,
//         }));

//         console.log("PostCustomerPriceSheet payload:", priceSheetData);

//         const response = await dispatch(
//           PostCustomerPriceSheet({ priceSheetData }),
//         );

//         console.log("PostCustomerPriceSheet response:", response);

//         if (response?.payload?.status === "Y") {
//           setAddPriceListData([]);

//           dispatch(
//             getConfigPriceBook({
//               ID: State.RecordID,
//             }),
//           );
//         } else {
//           setAddPriceListData([]);
//         }

//         return;
//       }

//       // ==========================================
//       // OTHER COMPANIES -> EXISTING PRICE LIST API
//       // ==========================================
//       const response = await dispatch(
//         PostConfigurePriceListID({
//           pricedata: addPriceListData,
//           RecordID: data.RecordID,
//         }),
//       );

//       console.log("PostConfigurePriceListID response:", response);

//       if (response?.payload?.status === "Y") {
//         // IMPORTANT: keep this as []
//         setAddPriceListData([]);

//         dispatch(
//           getConfigPriceBook({
//             ID: State.RecordID,
//           }),
//         );
//       } else {
//         // IMPORTANT: keep this as []
//         setAddPriceListData([]);
//       }
//     } catch (error) {
//       console.error("Error adding price sheet/price list:", error);

//       setOpenAlert(true);
//       setPostError(true);

//       // IMPORTANT: keep this as []
//       setAddPriceListData([]);
//     }
//   };

//   const CustomToolBar = () => {
//     return (
//       <GridToolbarContainer
//         sx={{
//           display: "flex",
//           flexDirection: "row",
//           justifyContent: "flex-end",
//           width: "100%",
//           padding: 0.5,
//           gap: 1,
//         }}
//       >
//         <Typography>Total Item Count: {data.PriceListItemCount}</Typography>
//         <GridToolbarQuickFilter />
//       </GridToolbarContainer>
//     );
//   };

//   //====================================================================================//

//   const handleSave = async (values) => {
//     const data1 = {
//       RecordID: data.RecordID,
//       Classification: "CS",
//       CompanyID: data.CompanyID,
//       CompanyCode: data.CompanyCode,
//       CustomerNumber: data.CustomerNumber,
//       CustomerName: data.CustomerName,
//       fullPriceBookPdf: values.cfpbpdf ? "1" : "0",
//       fullPriceBookExcel: values.cfpbexcel ? "1" : "0",
//       customPriceBookPdf: values.ccpbpdf ? "1" : "0",
//       customPriceBookExcel: values.ccpbexcel ? "1" : "0",
//       rungroup: data.Rungroup,
//       fullPriceBookTitle: values.cfpbtitle,
//       customPriceBookTitle: values.ccpbtitle,
//       Disable: "0",
//       PriceLevel: data.PriceLevel,
//       CreatedDateTime: data.CreatedDateTime,
//       LastModified: data.LastModified,
//       CreatedBy: data.CreatedBy,
//       ModifiedBy: data.ModifiedBy,
//     };

//     const response = await dispatch(postConfigureCompany({ Cdata: data1 }));
//     if (response.payload.status === "Y") {
//       setOpenAlert(true);
//     } else {
//       setOpenAlert(true);
//       setPostError(true);
//       // toast.error("Error occurred while saving data");
//     }
//   };

//   return (
//     <Container>
//       {status === "fulfilled" && !error ? (
//         <Formik
//           initialValues={{
//             RecordID: data.RecordID,
//             email: data.EmailId,
//             name: data.ContactName,
//             provider: data.Provider,
//             sequence: data.Sequence,
//             phonenumber: data.Phone,
//             disable: data.Disable === "1" ? true : false,
//             ccpbtitle: data.CustomPriceBookTitle,
//             ccpbpdf: data.CustomPriceBookPdf === "1" ? true : false,
//             ccpbexcel: data.CustomPriceBookExcel === "1" ? true : false,
//             cfpbtitle: data.FullPriceBookTitle,
//             cfpbpdf: data.FullPriceBookPdf === "1" ? true : false,
//             cfpbexcel: data.FullPriceBookExcel === "1" ? true : false,
//             pmc: data.PreferedDeliveryEmail === "1" ? true : false,
//             pec: data.PreferedDeliveryMobile === "1" ? true : false,
//           }}
//           // validationSchema={validationSchema}
//           enableReinitialize={true}
//           onSubmit={(values, { resetForm }) => {
//             handleSave(values);
//           }}
//         >
//           {({
//             errors,
//             touched,
//             handleBlur,
//             handleChange,
//             isSubmitting,
//             values,
//             handleSubmit,
//             resetForm,
//             setFieldValue,
//           }) => (
//             <form onSubmit={handleSubmit}>
//               <div className="breadcrumb">
//                 <Breadcrumb
//                   routeSegments={[
//                     {
//                       name: "Control Panel",
//                       // path: "/pages/control-panel/configure-price-book/company",
//                     },
//                     { name: "Configure Price Book" },
//                     {
//                       name: "Company",
//                       path: "/pages/control-panel/configure-price-book/company",
//                     },
//                     {
//                       name: "Customer",
//                       path: "/pages/control-panel/configure-price-book/customer",
//                     },
//                     { name: `Configure Customer ${screenName}` },
//                   ]}
//                 />
//                 <Stack direction={"row"} gap={1}>
//                   {/* <Button
//                     variant="contained"
//                     color="info"
//                     size="small"
//                     startIcon={
//                       params.mode === "delete" ? (
//                         <DeleteIcon color="error" size="small" />
//                       ) : (
//                         <SaveIcon size="small" />
//                       )
//                     }
//                     type="submit"
//                     disabled={isSubmitting}
//                   >
//                     {params.mode === "delete" ? "Confirm" : "Save"}
//                   </Button> */}
//                   <Button
//                     variant="contained"
//                     color="info"
//                     size="small"
//                     startIcon={<ArrowBackIcon size="small" />}
//                     onClick={() =>
//                       navigate(
//                         "/pages/control-panel/configure-price-book/customer",
//                         {
//                           state: {
//                             RunGroup: State.RunGroup,
//                             Code: State.company.Code,
//                             Name: State.company.Name,
//                             RecordID: State.company.RecordID,
//                           },
//                         },
//                       )
//                     }
//                   >
//                     Back
//                   </Button>
//                 </Stack>
//               </div>

//               <Paper sx={{ width: "100%", mb: 2 }}>
//                 <Box
//                   display="grid"
//                   gap="10px"
//                   gridTemplateColumns="repeat(4, minmax(0, 1fr))"
//                   sx={{
//                     "& > div": {
//                       gridColumn: isNonMobile ? undefined : "span 4",
//                     },
//                     padding: "10px",
//                   }}
//                 >
//                   <Stack sx={{ gridColumn: "span 2" }} direction="row" gap={1}>
//                     <Typography fontSize={"16px"}>
//                       <Typography
//                         component="span"
//                         fontSize={"16px"}
//                         fontWeight="bold"
//                       >
//                         Company:
//                       </Typography>{" "}
//                       {State.company.Code} || {State.company.Name}
//                       <Typography
//                         component="span"
//                         fontWeight="bold"
//                         fontSize={"16px"}
//                       >{` >> `}</Typography>
//                     </Typography>
//                     <Typography fontSize={"16px"}>
//                       <Typography
//                         component="span"
//                         fontSize={"16px"}
//                         fontWeight="bold"
//                       >
//                         Customer:
//                       </Typography>{" "}
//                       {State.Code} || {State.Name}
//                     </Typography>
//                   </Stack>

//                   <Stack
//                     direction={"row"}
//                     gap={1}
//                     sx={{ gridColumn: "span 2" }}
//                     justifyContent={"flex-end"}
//                   >
//                     {State.company.Code == "SJ" ? (
//                       <CompanyPriceSheetCusAutoComplete
//                         key={JSON.stringify(getRows)}
//                         errors={isPriceListExistsError}
//                         helper={
//                           isPriceListExistsError &&
//                           `Please select ${screenName}!`
//                         }
//                         disabled={
//                           params.mode === "delete" || params.mode === "view"
//                         }
//                         name="addPriceList"
//                         id="addPriceList"
//                         value={addPriceListData}
//                         onChange={handleSelectionAddPriceListData}
//                         label={`Include ${screenName}`}
//                         url={`${process.env.REACT_APP_BASE_URL}PriceSheet/GetCustomerCategoryPriceList?CompanyID=${data.CompanyID}`}
//                         filterData={[...getRows, ...filteredSelectedItems]}
//                       />
//                     ) : (
//                       <CompanyPriceListCusAutoComplete
//                         key={JSON.stringify(getRows)}
//                         errors={isPriceListExistsError}
//                         helper={
//                           isPriceListExistsError &&
//                           `Please select ${screenName}!`
//                         }
//                         disabled={
//                           params.mode === "delete" || params.mode === "view"
//                         }
//                         name="addPriceList"
//                         id="addPriceList"
//                         value={addPriceListData}
//                         onChange={handleSelectionAddPriceListData}
//                         label={`Include ${screenName}`}
//                         url={`${process.env.REACT_APP_BASE_URL}PriceList/GetCustomerCategoryPriceList?CompanyID=${data.CompanyID}`}
//                         filterData={[...getRows, ...filteredSelectedItems]}
//                       />
//                     )}
//                     {/* <Tooltip title="Add"> */}
//                     <IconButton
//                       disabled={
//                         params.mode === "delete" || params.mode === "view"
//                       }
//                       color="black"
//                       size="small"
//                       onClick={handleAddPriceList}
//                     >
//                       <Add
//                         sx={{
//                           fontSize: 30, // Increased icon size
//                           color: theme.palette.success.main,
//                         }}
//                       />
//                     </IconButton>
//                     {/* </Tooltip> */}
//                   </Stack>

//                   <Box
//                     sx={{
//                       height: 400,
//                       gridColumn: "span 4",
//                       "& .MuiDataGrid-root": {
//                         border: "none",
//                       },
//                       "& .MuiDataGrid-cell": {
//                         borderBottom: "none",
//                       },
//                       "& .name-column--cell": {
//                         color: theme.palette.info.contrastText,
//                       },
//                       "& .MuiDataGrid-columnHeaders": {
//                         backgroundColor: theme.palette.info.main,
//                         color: theme.palette.info.contrastText,
//                         fontWeight: "bold",
//                         fontSize: theme.typography.subtitle2.fontSize,
//                       },
//                       "& .MuiDataGrid-virtualScroller": {
//                         backgroundColor: theme.palette.info.light,
//                       },
//                       "& .MuiDataGrid-footerContainer": {
//                         borderTop: "none",
//                         backgroundColor: theme.palette.info.main,
//                         color: theme.palette.info.contrastText,
//                       },
//                       "& .MuiCheckbox-root": {
//                         color: "black !important", // Set checkbox color to black
//                       },

//                       "& .MuiCheckbox-root.Mui-checked": {
//                         color: "black !important", // Set checkbox color to black when checked
//                       },
//                       "& .MuiDataGrid-row:nth-of-type(even)": {
//                         backgroundColor: theme.palette.action.hover,
//                       },
//                       "& .MuiDataGrid-row:nth-of-type(odd)": {
//                         backgroundColor: theme.palette.background.default, // Color for odd rows
//                       },

//                       // "& .MuiDataGrid-row.Mui-selected:hover": {
//                       //   backgroundColor: `${theme.palette.action.selected} !important`,
//                       // },
//                       "& .MuiDataGrid-row:hover": {
//                         border: "3px solid #999999",
//                         // border: `1px solid #${theme.palette.action.selected} !important`, // Change border color on hover
//                         borderRadius: "4px", // Optional: Add rounded corners
//                       },
//                       "& .MuiTablePagination-root": {
//                         color: "white !important", // Ensuring white text color for the pagination
//                       },

//                       "& .MuiTablePagination-root .MuiTypography-root": {
//                         color: "white !important", // Ensuring white text for "Rows per page" and numbers
//                       },

//                       "& .MuiTablePagination-actions .MuiSvgIcon-root": {
//                         color: "white !important", // Ensuring white icons for pagination
//                       },
//                     }}
//                   >
//                     <DataGrid
//                       columnHeaderHeight={dataGridHeaderFooterHeight}
//                       sx={{
//                         // This is to override the default height of the footer row
//                         "& .MuiDataGrid-footerContainer": {
//                           height: dataGridHeaderFooterHeight,
//                           minHeight: dataGridHeaderFooterHeight,
//                         },
//                       }}
//                       slots={{
//                         loadingOverlay: LinearProgress,
//                         toolbar: CustomToolBar,
//                       }}
//                       rowHeight={dataGridRowHeight}
//                       rows={[...getRows, ...filteredSelectedItems]}
//                       columns={columns}
//                       // disableSelectionOnClick
//                       // Row editing
//                       editMode="row"
//                       rowModesModel={rowModesModel}
//                       onRowModesModelChange={handleRowModesModelChange}
//                       onRowEditStop={handleRowEditStop}
//                       // processRowUpdate={processRowUpdate}
//                       // Selection
//                       disableRowSelectionOnClick
//                       // Row ID
//                       getRowId={(row) => row.RecordID}
//                       initialState={{
//                         pagination: { paginationModel: { pageSize: 20 } },
//                       }}
//                       pageSizeOptions={[5, 10, 20, 25]}
//                       columnVisibilityModel={{
//                         item_key: false,
//                       }}
//                       disableColumnFilter
//                       disableColumnSelector
//                       disableDensitySelector
//                       slotProps={{
//                         toolbar: {
//                           showQuickFilter: true,
//                         },
//                       }}
//                     />
//                   </Box>
//                 </Box>
//               </Paper>
//               <MessageAlertDialog
//                 logo={`data:image/png;base64,${user.logo}`}
//                 open={isRemovePriceList}
//                 tittle={removePriceListdDesc}
//                 message={`Are you sure you want to exclude ${screenName} ?`}
//                 Actions={
//                   <DialogActions>
//                     <Button
//                       variant="contained"
//                       color="info"
//                       size="small"
//                       onClick={async () => {
//                         if (State.company.Code != "SJ") {
//                           const Pdata = {
//                             RecordID: removeRecordID,
//                             PriceBookRecordID: data.RecordID,
//                           };
//                           const response = await dispatch(
//                             ConfigurepriceListClear({
//                               Pdata,
//                             }),
//                           );
//                           if (response.payload.status === "Y") {
//                             // dispatch(configureAddedPriceList);
//                             dispatch(
//                               getConfigPriceBook({ ID: State.RecordID }),
//                             );
//                           }
//                         } else {
//                           const response = await dispatch(
//                             DeleteCustomerPriceSheet({
//                               RecordID: removeRecordID,
//                             }),
//                           );

//                           if (response?.payload?.status === "Y") {
//                             dispatch(
//                               getConfigPriceBook({
//                                 ID: State.RecordID,
//                               }),
//                             );
//                           }
//                         }
//                         setIsRemovePriceList(false);
//                         setremovePriceListID(0);
//                         setremoveRecordID(0);
//                         setremovePriceListDesc("");
//                       }}
//                     >
//                       Yes
//                     </Button>
//                     <Button
//                       variant="contained"
//                       color="info"
//                       size="small"
//                       onClick={() => {
//                         setIsRemovePriceList(false);
//                         setremovePriceListID(0);
//                         setremoveRecordID(0);
//                         setremovePriceListDesc("");
//                       }}
//                     >
//                       No
//                     </Button>
//                   </DialogActions>
//                 }
//               />
//               <MessageAlertDialog
//                 logo={`data:image/png;base64,${user.logo}`}
//                 open={isPriceListExists}
//                 error={true}
//                 tittle={
//                   addPriceListData
//                     ? addPriceListData.PRICELISTDESCRIPTION
//                     : `Please select ${screenName}!`
//                 }
//                 message={`Oops! This ${screenName} is already exists`}
//                 Actions={
//                   <DialogActions>
//                     <Button
//                       variant="contained"
//                       color="info"
//                       size="small"
//                       onClick={() => {
//                         setIsPriceListExists(false);
//                         setAddPriceListData([]);
//                       }}
//                     >
//                       Close
//                     </Button>
//                   </DialogActions>
//                 }
//               />
//             </form>
//           )}
//         </Formik>
//       ) : (
//         false
//       )}
//       <AlertDialog
//         logo={`data:image/png;base64,${user.logo}`}
//         open={openAlert}
//         error={postError}
//         message={`${screenName} added successfully`}
//         Actions={
//           <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//             <Button
//               variant="contained"
//               color="info"
//               size="small"
//               onClick={() => {
//                 setOpenAlert(false);
//               }}
//               sx={{ height: 25 }}
//             >
//               close
//             </Button>
//           </Box>
//         }
//       />
//     </Container>
//   );
// };

// export default ConfigureEdit;

// const priceBookLevels = [
//   { id: 1, level: "Price Book Level 1" },
//   { id: 2, level: "Price Book Level 2" },
//   { id: 3, level: "Price Book Level 3" },
//   { id: 4, level: "Price Book Level 4" },
//   { id: 5, level: "Price Book Level 5" },
//   { id: 6, level: "Price Book Level 6" },
//   { id: 7, level: "Price Book Level 7" },
//   { id: 8, level: "Price Book Level 8" },
//   { id: 9, level: "Price Book Level 9" },
//   { id: 10, level: "Price Book Level 10" },
// ];
// {
//   /* {params.mode === 'edit-Customer' && (
//  <Box display="flex" flexDirection="column" gap="20px"  justifyContent="center"
//             alignItems="center">
//       <Typography variant="h5">Price Book Cover Image</Typography>
//       <SettingsLogo previewImages={previewImages3} />

//         <DropZone {...dropzoneProps3.getRootProps()}>
//           <input
//             {...dropzoneProps3.getInputProps({
//               onChange: (e) => handleImageUpload3(e.target.files),
//             })}
//             multiple={false}
//           />
//           <FlexBox alignItems="center" flexDirection="column">
//             <Publish sx={{ color: "text.secondary", fontSize: "48px" }} />
//             {imageList3.length ? (
//               <span>{imageList3.length} images selected</span>
//             ) : (
//               <span>Drop images</span>
//             )}
//           </FlexBox>
//         </DropZone>

//     </Box>
//  )} */
// }

import React, { useEffect, useState, useMemo } from "react";
import {
  Paper,
  Button,
  Box,
  styled,
  useTheme,
  useMediaQuery,
  FormControlLabel,
  TextField,
  Checkbox,
  Typography,
  Stack,
  Autocomplete,
  LinearProgress,
  DialogActions,
  // Tooltip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  GridActionsCellItem,
  DataGrid,
  GridRowModes,
  GridToolbarQuickFilter,
  GridToolbarContainer,
  GridRowEditStopReasons,
  useGridApiRef,
} from "@mui/x-data-grid";
import { Breadcrumb } from "app/components";
import Cover from "../../../../../../assets/plylogo.png";
import {
  dataGridHeight,
  dataGridRowHeight,
  dataGridHeaderFooterHeight,
} from "app/utils/constant";
// ******************** ICONS ******************** //
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Add, AddAlertOutlined, RefreshOutlined } from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Formik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import * as Yup from "yup";
import { FlexAlignCenter, FlexBox } from "app/components/FlexBox";
import { convertHexToRGB } from "app/utils/constant";
import { useDropzone } from "react-dropzone";
import Publish from "@mui/icons-material/Publish";
import {
  FormikOptimizedAutocomplete,
  PGOptimizedAutocomplete,
} from "app/components/SingleAutocompletelist";
import { useDispatch, useSelector } from "react-redux";
import {
  configureAddedPriceList,
  getConfigPriceBook,
  getConfigPriceBook2,
} from "app/redux/slice/getSlice";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {
  ConfigurepriceListClear,
  postConfigureCompany,
  PostConfigurePriceListID,
  PostCustomerPriceSheet,
  DeleteCustomerPriceSheet,
  postCustsequenceData,
} from "app/redux/slice/postSlice";
import lodash from "lodash";
import AlertDialog, { MessageAlertDialog } from "app/components/AlertDialog";
import useAuth from "app/hooks/useAuth";
import {
  CompanyPriceListAutoComplete,
  CompanyPriceListAutoCompleteMemo,
  CompanyPriceListCusAutoComplete,
  CompanyPriceSheetCusAutoComplete,
} from "app/components/FormikAutocomplete";

// ******************** STYLED COMPONENTS ******************** //
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
// ******************** Image ******************** //
const ImageWrapper = styled("div")(({ previewImage }) => ({
  width: "100%",
  height: 100, // Reduced height
  minHeight: "50px", // Adjust minimum height as needed
  maxHeight: "200px", // Adjust maximum height as needed
  backgroundImage: `url(${previewImage || Cover})`,
  backgroundSize: "contain", // Ensures the full image is visible
  backgroundRepeat: "no-repeat", // Prevents tiling
  backgroundPosition: "center",
}));

const DropZone = styled(FlexAlignCenter)(({ isDragActive, theme }) => ({
  height: 70,
  width: "50%",
  cursor: "pointer",
  borderRadius: "4px",
  marginBottom: "16px",
  transition: "all 350ms ease-in-out",
  border: `2px dashed rgba(${convertHexToRGB(
    theme.palette.text.primary,
  )}, 0.3)`,
  "&:hover": {
    background: `rgb(${convertHexToRGB(
      theme.palette.text.primary,
    )}, 0.2) !important`,
  },
  background: isDragActive ? "rgb(0, 0, 0, 0.15)" : "rgb(0, 0, 0, 0.01)",
}));

// ******************** Validation Schema ******************** //
const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(60, "Name must be at most 60 characters"),

  phonenumber: Yup.string()
    .matches(
      /^\(\d{3}\) \d{3}-\d{4}$/,
      "Phone number must be in the format (XXX) XXX-XXXX",
    )
    .required("Phone number is required"),

  email: Yup.string()
    .email("Must be a valid email")
    .required("Email is required"),
});

// ******************** Price List Edit SCREEN  ******************** //
const ConfigureEdit = () => {
  // ******************** HOOKS AND CONSTANTS ******************** //
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const State = location.state;
  console.log("🚀 ~ ConfigureEdit ~ State:", State);
  const { user } = useAuth();
  console.log("🚀 ~ ConfigureEdit ~ user:", user);

  const screenName = State.company.Code == "SJ" ? "Price Sheet" : "Price List";

  console.log(screenName, "--find screenName");

  // ******************** LOCAL STATE ******************** //
  const apiRef = useGridApiRef();
  const [addPriceListData, setAddPriceListData] = useState([]);
  const [isPriceListExists, setIsPriceListExists] = useState(false);
  const [isPriceListExistsError, setIsPriceListExistsError] = useState(false);
  const [isRemovePriceList, setIsRemovePriceList] = useState(false);
  const [removePriceListdDesc, setremovePriceListDesc] = useState("");
  const [postError, setPostError] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [removePriceListID, setremovePriceListID] = useState(0);
  const [removeRecordID, setremoveRecordID] = useState(0);
  // ******************** REDUX STATE ******************** //

  const data = useSelector((state) => state.getSlice.getconfigureData);
  const pricelistdata = useSelector(
    (state) => state.getSlice.configurePriceListGetData,
  );
  const pricesheetRows = useSelector(
    (state) => state.getSlice.configurePriceSheetGetData,
  );
  const getRows = State.company.Code === "SJ" ? pricesheetRows : pricelistdata;
  const [editedRows, setEditedRows] = useState({});
  console.log(getRows, "--find getRows");

  const addedRows = useSelector(
    (state) => state.getSlice.configurePriceListAddedData,
  );
  console.log("🚀 ~ ConfigureEdit ~ addedRows:", addedRows);

  console.log("🚀 ~ ConfigureEdit ~ addedRows:", addedRows);

  const getRowsSet = new Set(getRows.map((item) => item.RecordID));

  const loading = useSelector((state) => state.getSlice.getconfigureLoading);
  const status = useSelector((state) => state.getSlice.getconfigureStatus);
  const error = useSelector((state) => state.getSlice.getconfigureError);

  const handleSelectionAddPriceListData = (e, newValue) => {
    setAddPriceListData(newValue);
  };
  //==================================GETAPI=====================================//
  useEffect(() => {
    dispatch(getConfigPriceBook({ ID: State.RecordID }));
  }, [dispatch]);
  // ********************** COLUMN ********************** //

  //Column_Edit_Section_ROW EDITING
  // =============================================================
  const [rowModesModel, setRowModesModel] = React.useState({});

  // const [gridRows, setGridRows] = useState([]);
  // const [localRows, setLocalRows] = useState([]);

  // useEffect(() => {
  //   const rows = [...getRows, ...filteredSelectedItems];

  //   setGridRows(rows);
  // }, [getRows]);

  // useEffect(() => {
  //   setLocalRows(gridRows);
  // }, [gridRows]);
  const [localRows, setLocalRows] = useState([]);
  // const [rowModesModel, setRowModesModel] = useState({});

  const filteredSelectedItems = useMemo(() => {
    const getRowsSet = new Set(getRows.map((item) => item.RecordID));

    return addedRows.filter(
      (selectedItem) => !getRowsSet.has(selectedItem.RecordID),
    );
  }, [getRows, addedRows]);

  const sourceRows = useMemo(() => {
    return [...getRows, ...filteredSelectedItems];
  }, [getRows, filteredSelectedItems]);

  useEffect(() => {
    setLocalRows(sourceRows);
  }, [sourceRows]);

  const handleRowEditStop = (params, event) => {
    // Prevent the row from automatically leaving edit mode
    // when focus moves outside the row.
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  // -------------------------------------------------------------
  // EDIT
  // -------------------------------------------------------------
  const handleEditClick = (id) => () => {
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: {
        mode: GridRowModes.Edit,
      },
    }));
  };

  // -------------------------------------------------------------
  // SAVE
  // -------------------------------------------------------------
  const handleSaveClick = (id) => async () => {
    try {
      // Get the latest row values directly from DataGrid
      const row = apiRef.current.getRowWithUpdatedValues(id);

      console.log("SAVE CLICKED");
      console.log("Latest row from DataGrid:", row);
      console.log("Latest Sequence:", row?.Sequence);

      if (!row) {
        console.error("Row not found:", id);
        return;
      }

      const payload = {
        customerPriceSheetID: row.RecordID,
        sequence: Number(row.Sequence) || 0,
        modifiedBy: user.name,
      };

      console.log("FINAL API PAYLOAD:", payload);
      const response = await dispatch(
        postCustsequenceData({
          sequenceData: payload,
        }),
      );

      console.log("Save Sequence Response:", response);

      if (response?.payload?.status === "Y") {
        // Change row back to view mode
        setRowModesModel((oldModel) => ({
          ...oldModel,
          [id]: {
            mode: GridRowModes.View,
          },
        }));

        // Optional: refresh data from API
        dispatch(
          getConfigPriceBook({
            ID: State.RecordID,
          }),
        );
      } else {
        console.error("Failed to save sequence:", response?.payload);
      }
    } catch (error) {
      console.error("Error saving sequence:", error);
    }
  };
  // -------------------------------------------------------------
  // CANCEL
  // -------------------------------------------------------------
  const handleCancelClick = (id) => () => {
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: {
        mode: GridRowModes.View,
        ignoreModifications: true,
      },
    }));
  };

  // -------------------------------------------------------------
  // PROCESS ROW UPDATE
  // -------------------------------------------------------------
  const processRowUpdate = (newRow, oldRow) => {
    console.log("OLD ROW:", oldRow);
    console.log("NEW ROW:", newRow);

    setLocalRows((currentRows) =>
      currentRows.map((row) =>
        row.RecordID === newRow.RecordID ? { ...row, ...newRow } : row,
      ),
    );

    setEditedRows((prev) => ({
      ...prev,
      [newRow.RecordID]: {
        oldRow,
        newRow,
      },
    }));

    return newRow;
  };

  const columns = [
    ...(State.company.Code === "SJ"
      ? [
          {
            field: "__reorder__",
            headerName: "",
            width: 50,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            disableExport: true,
            renderCell: () => (
              <DragIndicatorIcon
                sx={{ cursor: "grab", color: "text.secondary" }}
              />
            ),
          },
        ]
      : []),
    // {
    //   headerName: "Name",
    //   field: "PRICELISTID",
    //   width: "170",
    //   align: "left",
    //   headerAlign: "left",
    //   hide: false,
    // },
    {
      headerName: screenName,
      field: "PRICELISTDESCRIPTION",
      width: "300",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Item Count",
      field: "PriceListItemCount",
      width: 150,
      align: "right",
      headerAlign: "center",
      hide: true,
    },
    // Show Sequence ONLY for SJ
    ...(State.company.Code === "SJ"
      ? [
          {
            headerName: "Page#",
            field: "Sequence",
            width: 150,
            align: "right",
            headerAlign: "center",
            editable: true,
          },
        ]
      : []),
    {
      field: "Action",
      headerName: "Action",
      type: "actions",
      minWidth: 200,
      flex: 1,
      sortable: false,
      headerAlign: "center",
      filterable: false,
      disableColumnMenu: true,
      disableExport: true,
      align: "center",
      // getActions: (params) => {
      //   const { id } = params;

      //   const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

      //   // -------------------------------------------------------
      //   // ROW IS IN EDIT MODE
      //   // -------------------------------------------------------
      //   if (isInEditMode) {
      //     return [
      //       // Save only for SJ
      //       ...(State.company.Code === "SJ"
      //         ? [
      //             <GridActionsCellItem
      //               key={`save-${id}`}
      //               icon={<SaveIcon />}
      //               label="Save"
      //               onClick={handleSaveClick(id)}
      //               color="primary"
      //             />,
      //             <GridActionsCellItem
      //               key={`cancel-${id}`}
      //               icon={<CancelIcon />}
      //               label="Cancel"
      //               onClick={handleCancelClick(id)}
      //               color="inherit"
      //             />,
      //           ]
      //         : []),

      //       // Delete always visible
      //       <GridActionsCellItem
      //         key={`delete-${id}`}
      //         icon={<DeleteIcon />}
      //         label="Delete"
      //         onClick={() => {
      //           setremovePriceListID(params.row.PRICELISTID);
      //           setremoveRecordID(params.row.RecordID);
      //           setremovePriceListDesc(params.row.PRICELISTDESCRIPTION);
      //           setIsRemovePriceList(true);
      //         }}
      //         color="error"
      //       />,
      //     ];
      //   }

      //   // -------------------------------------------------------
      //   // NORMAL VIEW MODE
      //   // -------------------------------------------------------
      //   return [
      //     // Edit ONLY for SJ
      //     ...(State.company.Code === "SJ"
      //       ? [
      //           <GridActionsCellItem
      //             key={`edit-${id}`}
      //             icon={<EditIcon />}
      //             label="Edit"
      //             onClick={handleEditClick(id)}
      //             color="primary"
      //           />,
      //         ]
      //       : []),

      //     <GridActionsCellItem
      //       key={`delete-${id}`}
      //       icon={<DeleteIcon />}
      //       label="Delete"
      //       onClick={() => {
      //         setremovePriceListID(params.row.PRICELISTID);
      //         setremoveRecordID(params.row.RecordID);
      //         setremovePriceListDesc(params.row.PRICELISTDESCRIPTION);
      //         setIsRemovePriceList(true);
      //       }}
      //       color="error"
      //     />,
      //   ];
      // },
      renderCell: (param) => {
        return (
          <Box gap={1}>
            {/* <Tooltip title="Exclude Price List"> */}
            <IconButton
              color="error"
              size="small"
              onClick={() => {
                setremovePriceListID(param.row.PRICELISTID);
                setremoveRecordID(param.row.RecordID);
                setremovePriceListDesc(param.row.PRICELISTDESCRIPTION);
                setIsRemovePriceList(true);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
            {/* </Tooltip> */}
          </Box>
        );
      },
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
          }}
        >
          <GridToolbarQuickFilter />
          {/* <PGOptimizedAutocomplete
            errors={isPriceListExistsError}
            helper={isPriceListExistsError && "Please select price list!"}
            disabled={params.mode === "delete" || params.mode === "view"}
            name="addPriceList"
            id="addPriceList"
            value={addPriceListData}
            onChange={handleSelectionAddPriceListData}
            label="Include Price List"
            url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=PriceList`}
          /> */}

          {/* <Tooltip title="Add"> */}
          <IconButton
            disabled={params.mode === "delete" || params.mode === "view"}
            color="black"
            size="small"
            onClick={async () => {
              if (addPriceListData && addPriceListData.length > 0) {
                const isItem = [...getRows, ...filteredSelectedItems].some(
                  (item) =>
                    lodash.isEqual(
                      item.PRICELISTID,
                      addPriceListData.PRICELISTID,
                    ),
                );
                if (isItem) {
                  setIsPriceListExists(true);
                  setTimeout(() => {
                    setIsPriceListExists(false);
                    setAddPriceListData([]);
                  }, 5000);
                  return;
                }
                // dispatch(configureAddedPriceList(addPriceListData));

                const pricedata = {
                  recordID: data.RecordID,
                  priceListID: addPriceListData.PRICELISTID,
                };
                const response = await dispatch(
                  PostConfigurePriceListID({ pricedata }),
                );

                if (response.payload.status === "Y") {
                  setOpenAlert(true);
                  setAddPriceListData([]);
                  dispatch(getConfigPriceBook({ ID: State.RecordID }));
                } else {
                  setOpenAlert(true);
                  setPostError(true);
                  setAddPriceListData([]);

                  // toast.error("Error occurred while saving data");
                }
              } else {
                setIsPriceListExistsError(true);
                setTimeout(() => {
                  setIsPriceListExistsError(false);
                }, 2000);
              }
            }}
          >
            <Add
              sx={{
                fontSize: 30, // Increased icon size
                color: theme.palette.success.main,
              }}
            />
          </IconButton>
          {/* </Tooltip> */}
        </Box>
      </GridToolbarContainer>
    );
  }

  // const handleAddPriceList = async () => {
  //   if (addPriceListData.length > 0) {
  //     // Prepare price data and dispatch the action

  //     if (State.company.Code != "SJ") {
  //       const response = await dispatch(
  //         PostConfigurePriceListID({
  //           pricedata: addPriceListData,
  //           RecordID: data.RecordID,
  //         }),
  //       );
  //       dispatch(getConfigPriceBook({ ID: State.RecordID }));
  //       const action = dispatch(getConfigPriceBook({ ID: State.RecordID }));
  //       if (response.payload.status === "Y") {
  //         // dispatch(configureAddedPriceList(addPriceListData));

  //         console.log("🚀 ~ handleAddPriceList ~ dispatched action:", action);
  //         setAddPriceListData([]);
  //       }
  //     }
  //   } else {
  //     // Handle case where no price list data is selected
  //     setIsPriceListExistsError(true);
  //     setTimeout(() => {
  //       setIsPriceListExistsError(false);
  //     }, 2000);
  //   }
  // };

  const handleAddPriceList = async () => {
    // Since addPriceListData is an array, check length
    if (!addPriceListData || addPriceListData.length === 0) {
      setIsPriceListExistsError(true);

      setTimeout(() => {
        setIsPriceListExistsError(false);
      }, 2000);

      return;
    }

    try {
      // ==========================================
      // SJ COMPANY -> CUSTOMER PRICE SHEET API
      // ==========================================
      if (State.company.Code === "SJ") {
        const priceSheetData = addPriceListData.map((priceSheet, index) => ({
          companyID: data.CompanyID,
          customerID: data.RecordID,
          priceSheetID: priceSheet.RecordID,
          createdBy: user.name,
        }));

        console.log("PostCustomerPriceSheet payload:", priceSheetData);

        const response = await dispatch(
          PostCustomerPriceSheet({ priceSheetData }),
        );

        console.log("PostCustomerPriceSheet response:", response);

        if (response?.payload?.status === "Y") {
          setAddPriceListData([]);

          dispatch(
            getConfigPriceBook({
              ID: State.RecordID,
            }),
          );
        } else {
          setAddPriceListData([]);
        }

        return;
      }

      // ==========================================
      // OTHER COMPANIES -> EXISTING PRICE LIST API
      // ==========================================
      const response = await dispatch(
        PostConfigurePriceListID({
          pricedata: addPriceListData,
          RecordID: data.RecordID,
        }),
      );

      console.log("PostConfigurePriceListID response:", response);

      if (response?.payload?.status === "Y") {
        // IMPORTANT: keep this as []
        setAddPriceListData([]);

        dispatch(
          getConfigPriceBook({
            ID: State.RecordID,
          }),
        );
      } else {
        // IMPORTANT: keep this as []
        setAddPriceListData([]);
      }
    } catch (error) {
      console.error("Error adding price sheet/price list:", error);

      setOpenAlert(true);
      setPostError(true);

      // IMPORTANT: keep this as []
      setAddPriceListData([]);
    }
  };
  const dragRowId = React.useRef(null);

  const reorderRows = (sourceId, targetId) => {
    if (State.company.Code !== "SJ") return; // safety guard
    setLocalRows((prevRows) => {
      const rows = [...prevRows];
      const sourceIndex = rows.findIndex(
        (r) => String(r.RecordID) === String(sourceId),
      );
      const targetIndex = rows.findIndex(
        (r) => String(r.RecordID) === String(targetId),
      );
      if (sourceIndex === -1 || targetIndex === -1) return prevRows;

      const [moved] = rows.splice(sourceIndex, 1);
      rows.splice(targetIndex, 0, moved);

      // Recalculate Sequence for SJ rows and persist
      const resequenced = rows.map((row, idx) => ({
        ...row,
        Sequence: idx + 1,
      }));

      if (State.company.Code === "SJ") {
        resequenced.forEach((row) => {
          dispatch(
            postCustsequenceData({
              sequenceData: {
                customerPriceSheetID: row.RecordID,
                sequence: row.Sequence,
                modifiedBy: user.name,
              },
            }),
          );
        });
      }

      return resequenced;
    });
  };
  const CustomToolBar = () => {
    return (
      <GridToolbarContainer
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          width: "100%",
          padding: 0.5,
          gap: 1,
        }}
      >
        <Typography>
          Total Item Count:{" "}
          {data.CompanyCode == "SJ"
            ? data.PriceSheetItemCount
            : data.PriceListItemCount}
        </Typography>
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  };

  //====================================================================================//

  const handleSave = async (values) => {
    const data1 = {
      RecordID: data.RecordID,
      Classification: "CS",
      CompanyID: data.CompanyID,
      CompanyCode: data.CompanyCode,
      CustomerNumber: data.CustomerNumber,
      CustomerName: data.CustomerName,
      fullPriceBookPdf: values.cfpbpdf ? "1" : "0",
      fullPriceBookExcel: values.cfpbexcel ? "1" : "0",
      customPriceBookPdf: values.ccpbpdf ? "1" : "0",
      customPriceBookExcel: values.ccpbexcel ? "1" : "0",
      rungroup: data.Rungroup,
      fullPriceBookTitle: values.cfpbtitle,
      customPriceBookTitle: values.ccpbtitle,
      Disable: "0",
      PriceLevel: data.PriceLevel,
      CreatedDateTime: data.CreatedDateTime,
      LastModified: data.LastModified,
      CreatedBy: data.CreatedBy,
      ModifiedBy: data.ModifiedBy,
    };

    const response = await dispatch(postConfigureCompany({ Cdata: data1 }));
    if (response.payload.status === "Y") {
      setOpenAlert(true);
    } else {
      setOpenAlert(true);
      setPostError(true);
      // toast.error("Error occurred while saving data");
    }
  };

  return (
    <Container>
      {status === "fulfilled" && !error ? (
        <Formik
          initialValues={{
            RecordID: data.RecordID,
            email: data.EmailId,
            name: data.ContactName,
            provider: data.Provider,
            sequence: data.Sequence,
            phonenumber: data.Phone,
            disable: data.Disable === "1" ? true : false,
            ccpbtitle: data.CustomPriceBookTitle,
            ccpbpdf: data.CustomPriceBookPdf === "1" ? true : false,
            ccpbexcel: data.CustomPriceBookExcel === "1" ? true : false,
            cfpbtitle: data.FullPriceBookTitle,
            cfpbpdf: data.FullPriceBookPdf === "1" ? true : false,
            cfpbexcel: data.FullPriceBookExcel === "1" ? true : false,
            pmc: data.PreferedDeliveryEmail === "1" ? true : false,
            pec: data.PreferedDeliveryMobile === "1" ? true : false,
          }}
          // validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={(values, { resetForm }) => {
            handleSave(values);
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
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="breadcrumb">
                <Breadcrumb
                  routeSegments={[
                    {
                      name: "Control Panel",
                      // path: "/pages/control-panel/configure-price-book/company",
                    },
                    { name: "Configure Price Book" },
                    {
                      name: "Company",
                      path: "/pages/control-panel/configure-price-book/company",
                    },
                    {
                      name: "Customer",
                      path: "/pages/control-panel/configure-price-book/customer",
                      state:State.company
                    },
                    { name: `Configure Customer ${screenName}` },
                  ]}
                />
                <Stack direction={"row"} gap={1}>
                  {/* <Button
                    variant="contained"
                    color="info"
                    size="small"
                    startIcon={
                      params.mode === "delete" ? (
                        <DeleteIcon color="error" size="small" />
                      ) : (
                        <SaveIcon size="small" />
                      )
                    }
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {params.mode === "delete" ? "Confirm" : "Save"}
                  </Button> */}
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    startIcon={<ArrowBackIcon size="small" />}
                    onClick={() =>
                      navigate(
                        "/pages/control-panel/configure-price-book/customer",
                        {
                          state: {
                            RunGroup: State.RunGroup,
                            Code: State.company.Code,
                            Name: State.company.Name,
                            RecordID: State.company.RecordID,
                          },
                        },
                      )
                    }
                  >
                    Back
                  </Button>
                </Stack>
              </div>

              <Paper sx={{ width: "100%", mb: 2 }}>
                <Box
                  display="grid"
                  gap="10px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{
                    "& > div": {
                      gridColumn: isNonMobile ? undefined : "span 4",
                    },
                    padding: "10px",
                  }}
                >
                  <Stack sx={{ gridColumn: "span 2" }} direction="row" gap={1}>
                    <Typography fontSize={"16px"}>
                      <Typography
                        component="span"
                        fontSize={"16px"}
                        fontWeight="bold"
                      >
                        Company:
                      </Typography>{" "}
                      {State.company.Code} || {State.company.Name}
                      <Typography
                        component="span"
                        fontWeight="bold"
                        fontSize={"16px"}
                      >{` >> `}</Typography>
                    </Typography>
                    <Typography fontSize={"16px"}>
                      <Typography
                        component="span"
                        fontSize={"16px"}
                        fontWeight="bold"
                      >
                        Customer:
                      </Typography>{" "}
                      {State.Code} || {State.Name}
                    </Typography>
                  </Stack>

                  <Stack
                    direction={"row"}
                    gap={1}
                    sx={{ gridColumn: "span 2" }}
                    justifyContent={"flex-end"}
                  >
                    {State.company.Code == "SJ" ? (
                      <CompanyPriceSheetCusAutoComplete
                        key={JSON.stringify(getRows)}
                        errors={isPriceListExistsError}
                        helper={
                          isPriceListExistsError &&
                          `Please select ${screenName}!`
                        }
                        disabled={
                          params.mode === "delete" || params.mode === "view"
                        }
                        name="addPriceList"
                        id="addPriceList"
                        value={addPriceListData}
                        onChange={handleSelectionAddPriceListData}
                        label={`Include ${screenName}`}
                        url={`${process.env.REACT_APP_BASE_URL}PriceSheet/GetCustomerCategoryPriceList?CompanyID=${data.CompanyID}`}
                        filterData={[...getRows, ...filteredSelectedItems]}
                      />
                    ) : (
                      <CompanyPriceListCusAutoComplete
                        key={JSON.stringify(getRows)}
                        errors={isPriceListExistsError}
                        helper={
                          isPriceListExistsError &&
                          `Please select ${screenName}!`
                        }
                        disabled={
                          params.mode === "delete" || params.mode === "view"
                        }
                        name="addPriceList"
                        id="addPriceList"
                        value={addPriceListData}
                        onChange={handleSelectionAddPriceListData}
                        label={`Include ${screenName}`}
                        url={`${process.env.REACT_APP_BASE_URL}PriceList/GetCustomerCategoryPriceList?CompanyID=${data.CompanyID}`}
                        filterData={[...getRows, ...filteredSelectedItems]}
                      />
                    )}
                    {/* <Tooltip title="Add"> */}
                    <IconButton
                      disabled={
                        params.mode === "delete" || params.mode === "view"
                      }
                      color="black"
                      size="small"
                      onClick={handleAddPriceList}
                    >
                      <Add
                        sx={{
                          fontSize: 30, // Increased icon size
                          color: theme.palette.success.main,
                        }}
                      />
                    </IconButton>
                    {/* </Tooltip> */}
                  </Stack>

                  <Box
                    sx={{
                      height: 400,
                      gridColumn: "span 4",
                      "& .MuiDataGrid-root": {
                        border: "none",
                      },
                      "& .MuiDataGrid-cell": {
                        borderBottom: "none",
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
                        color: "black !important", // Set checkbox color to black
                      },

                      "& .MuiCheckbox-root.Mui-checked": {
                        color: "black !important", // Set checkbox color to black when checked
                      },
                      "& .MuiDataGrid-row:nth-of-type(even)": {
                        backgroundColor: theme.palette.action.hover,
                      },
                      "& .MuiDataGrid-row:nth-of-type(odd)": {
                        backgroundColor: theme.palette.background.default, // Color for odd rows
                      },

                      // "& .MuiDataGrid-row.Mui-selected:hover": {
                      //   backgroundColor: `${theme.palette.action.selected} !important`,
                      // },
                      "& .MuiDataGrid-row:hover": {
                        border: "3px solid #999999",
                        // border: `1px solid #${theme.palette.action.selected} !important`, // Change border color on hover
                        borderRadius: "4px", // Optional: Add rounded corners
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
                    {/* <DataGrid
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
                        toolbar: CustomToolBar,
                      }}
                      rowHeight={dataGridRowHeight}
                      rows={[...getRows, ...filteredSelectedItems]}
                      columns={columns}
                      // disableSelectionOnClick
                      // Row editing
                      editMode="row"
                      rowModesModel={rowModesModel}
                      onRowModesModelChange={handleRowModesModelChange}
                      onRowEditStop={handleRowEditStop}
                      // processRowUpdate={processRowUpdate}
                      // Selection
                      disableRowSelectionOnClick
                      // Row ID
                      getRowId={(row) => row.RecordID}
                      initialState={{
                        pagination: { paginationModel: { pageSize: 20 } },
                      }}
                      pageSizeOptions={[5, 10, 20, 25]}
                      columnVisibilityModel={{
                        item_key: false,
                      }}
                      disableColumnFilter
                      disableColumnSelector
                      disableDensitySelector
                      slotProps={{
                        toolbar: {
                          showQuickFilter: true,
                        },
                      }}
                    /> */}
                    <DataGrid
                      apiRef={apiRef}
                      columnHeaderHeight={dataGridHeaderFooterHeight}
                      sx={{
                        "& .MuiDataGrid-footerContainer": {
                          height: dataGridHeaderFooterHeight,
                          minHeight: dataGridHeaderFooterHeight,
                        },
                      }}
                      slots={{
                        loadingOverlay: LinearProgress,
                        toolbar: CustomToolBar,
                      }}
                      rowHeight={dataGridRowHeight}
                      rows={localRows}
                      columns={columns}
                      editMode="row"
                      rowModesModel={rowModesModel}
                      onRowModesModelChange={handleRowModesModelChange}
                      onRowEditStop={handleRowEditStop}
                      processRowUpdate={processRowUpdate}
                      disableRowSelectionOnClick
                      getRowId={(row) => row.RecordID}
                      initialState={{
                        pagination: {
                          paginationModel: {
                            pageSize: 20,
                          },
                        },
                      }}
                      pageSizeOptions={[5, 10, 20, 25]}
                      disableColumnFilter
                      disableColumnSelector
                      disableDensitySelector
                      slotProps={{
                        toolbar: { showQuickFilter: true },
                        ...(State.company.Code === "SJ"
                          ? {
                              row: {
                                draggable: true,
                                onDragStart: (event) => {
                                  dragRowId.current =
                                    event.currentTarget.getAttribute("data-id");
                                  event.dataTransfer.effectAllowed = "move";
                                },
                                onDragOver: (event) => {
                                  event.preventDefault();
                                  event.dataTransfer.dropEffect = "move";
                                },
                                onDrop: (event) => {
                                  event.preventDefault();
                                  const targetId =
                                    event.currentTarget.getAttribute("data-id");
                                  const sourceId = dragRowId.current;
                                  if (
                                    sourceId &&
                                    targetId &&
                                    sourceId !== targetId
                                  ) {
                                    reorderRows(sourceId, targetId);
                                  }
                                  dragRowId.current = null;
                                },
                              },
                            }
                          : {}),
                      }}
                    />
                  </Box>
                </Box>
              </Paper>
              <MessageAlertDialog
                logo={`data:image/png;base64,${user.logo}`}
                open={isRemovePriceList}
                tittle={removePriceListdDesc}
                message={`Are you sure you want to exclude ${screenName} ?`}
                Actions={
                  <DialogActions>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={async () => {
                        if (State.company.Code != "SJ") {
                          const Pdata = {
                            RecordID: removeRecordID,
                            PriceBookRecordID: data.RecordID,
                          };
                          const response = await dispatch(
                            ConfigurepriceListClear({
                              Pdata,
                            }),
                          );
                          if (response.payload.status === "Y") {
                            // dispatch(configureAddedPriceList);
                            dispatch(
                              getConfigPriceBook({ ID: State.RecordID }),
                            );
                          }
                        } else {
                          const response = await dispatch(
                            DeleteCustomerPriceSheet({
                              RecordID: removeRecordID,
                            }),
                          );

                          if (response?.payload?.status === "Y") {
                            dispatch(
                              getConfigPriceBook({
                                ID: State.RecordID,
                              }),
                            );
                          }
                        }
                        setIsRemovePriceList(false);
                        setremovePriceListID(0);
                        setremoveRecordID(0);
                        setremovePriceListDesc("");
                      }}
                    >
                      Yes
                    </Button>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => {
                        setIsRemovePriceList(false);
                        setremovePriceListID(0);
                        setremoveRecordID(0);
                        setremovePriceListDesc("");
                      }}
                    >
                      No
                    </Button>
                  </DialogActions>
                }
              />
              <MessageAlertDialog
                logo={`data:image/png;base64,${user.logo}`}
                open={isPriceListExists}
                error={true}
                tittle={
                  addPriceListData
                    ? addPriceListData.PRICELISTDESCRIPTION
                    : `Please select ${screenName}!`
                }
                message={`Oops! This ${screenName} is already exists`}
                Actions={
                  <DialogActions>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => {
                        setIsPriceListExists(false);
                        setAddPriceListData([]);
                      }}
                    >
                      Close
                    </Button>
                  </DialogActions>
                }
              />
            </form>
          )}
        </Formik>
      ) : (
        false
      )}
      <AlertDialog
        logo={`data:image/png;base64,${user.logo}`}
        open={openAlert}
        error={postError}
        message={`${screenName} added successfully`}
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
    </Container>
  );
};

export default ConfigureEdit;

const priceBookLevels = [
  { id: 1, level: "Price Book Level 1" },
  { id: 2, level: "Price Book Level 2" },
  { id: 3, level: "Price Book Level 3" },
  { id: 4, level: "Price Book Level 4" },
  { id: 5, level: "Price Book Level 5" },
  { id: 6, level: "Price Book Level 6" },
  { id: 7, level: "Price Book Level 7" },
  { id: 8, level: "Price Book Level 8" },
  { id: 9, level: "Price Book Level 9" },
  { id: 10, level: "Price Book Level 10" },
];
{
  /* {params.mode === 'edit-Customer' && (
 <Box display="flex" flexDirection="column" gap="20px"  justifyContent="center"
            alignItems="center">
      <Typography variant="h5">Price Book Cover Image</Typography>
      <SettingsLogo previewImages={previewImages3} />
     
        <DropZone {...dropzoneProps3.getRootProps()}>
          <input
            {...dropzoneProps3.getInputProps({
              onChange: (e) => handleImageUpload3(e.target.files),
            })}
            multiple={false}
          />
          <FlexBox alignItems="center" flexDirection="column">
            <Publish sx={{ color: "text.secondary", fontSize: "48px" }} />
            {imageList3.length ? (
              <span>{imageList3.length} images selected</span>
            ) : (
              <span>Drop images</span>
            )}
          </FlexBox>
        </DropZone>

    </Box> 
 )} */
}
