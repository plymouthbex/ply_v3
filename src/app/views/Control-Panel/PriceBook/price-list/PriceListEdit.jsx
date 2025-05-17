import React, { useEffect, useState,useRef } from "react";
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
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider
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
  dataGridHeaderFooterHeight,
} from "app/utils/constant";
import { Formik } from "formik";
import lodash from "lodash";
import { FormikCustomAutocomplete } from "app/components/AutoComplete";
import {
  adHocPriceListDeleted,
  clearPriceListState,
  clreatFilterAndItems,
  getPriceListData,
  getPriceListData2,
  getPriceListFilterData,
  onCheckboxChangePriceListEdit,
  priceListAddedItems,
  priceListDeletedItem,
  PostAddHocItems

} from "app/redux/slice/getSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  FormikOptimizedAutocomplete,
  OptimizedAutocomplete,OptimizedAdHocAutocomplete,
  PrintGroupOptimizedAutocomplete,
  PrintGroupOptimizedAutocompletePriceList,
} from "app/components/SingleAutocompletelist";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  DeleteAdHocItem,
  PostAdHocItem,
  PostPriceListDetail,
  priceListClearFilter,
  priceListConditionsPost,
  priceListDelete,
  priceListHeaderPost,
  priceListItemPost,
  PutAdHocItem,
} from "app/redux/slice/postSlice";
import useAuth from "app/hooks/useAuth";

// ********************** ICONS ********************** //
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Add, Title } from "@mui/icons-material";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import AlertDialog, { MessageAlertDialog } from "app/components/AlertDialog";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import Loading from "app/components/AppLoading";
import { FormikCustomAutocompleteMulti } from "app/components/FormikAutocomplete";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
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
const PriceListEdit = () => {
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
  console.log("🚀 ~ state:", state)
  const submitActionRef = useRef(null)
  // ********************** LOCAL STATE ********************** //

  const [openAlert, setOpenAlert] = useState(false);
  const [postError, setPostError] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [showGridData, setShowGridData] = useState(0);
  const [isPriceListOpen, SetIsPriceListOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isItemExists, setIsItemExists] = useState(false);
  const [isItemExistsError, setIsItemExistsError] = useState(false);
  const [isRemoveItem, setIsRemoveItem] = useState(false);
  const [isShowOtherDisabled, setIsOtherDisabled] = useState(true);
  const [isShowOtherItem, setIsOtherItem] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [adHocRows,setAdhocRows]=useState([]);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  //======================= ADD PRICE LIST ===================================//
  const [addPriceListData, setAddPriceListData] = useState([]);
  const [priceListRecordID, setpriceListRecordID] = useState(state.id.toString());
  console.log("🚀 ~ priceListRecordID:", priceListRecordID)
  const handleSelectionAddPriceListData = (newValue) => {
    setAddPriceListData(newValue);
  };

  // ********************** REDUX STATE ********************** //
  const priceRows = useSelector((state) => state.listview.priceListViewData);
  const selectedRows = useSelector(
    (state) => state.getSlice.priceListSelectedData
  );
  const addedRows = useSelector((state) => state.getSlice.priceListAddedData);
  console.log("🚀 ~ addedRows:", addedRows);
  const priceListHeaderData = useSelector(
    (state) => state.getSlice.priceListHeaderData
  );
  const priceListFilterData = useSelector(
    (state) => state.getSlice.priceListFilterData
  );
  const priceListItemsData = useSelector(
    (state) => state.getSlice.priceListItemsData
  );
  console.log("🚀 ~ priceListItemsData:", priceListItemsData)
  const priceListItemLoading = useSelector(
    (state) => state.getSlice.priceListItemLoading
  );
  const getStatus = useSelector((state) => state.getSlice.priceListStatus);
  const getLoading = useSelector((state) => state.getSlice.priceListLoading);
  const getMessage = useSelector((state) => state.getSlice.priceListMessage);
  const getError = useSelector((state) => state.getSlice.priceListError);
  const AdHocRows= useSelector((state)=>state.getSlice.postAdHocData);
  console.log("🚀 ~ AdHocRows:", AdHocRows)




  // ********************** COLUMN AND ROWS ********************** //
  const columns = [
    {
      headerName: "Price List",
      field: "OtherItemPriceListID",
      width: 150,
      align: "left",
      headerAlign: "left",
      hide: false,
    },
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
      minWidth: 400,
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Print",
      field: "print",
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (param) => {
        return (
          <div>
            <Checkbox
  checked={param.row.PrintItem === true}
  onChange={(e) => {
    const newValue = e.target.checked ? "1" : "0";
console.log(e);
    dispatch(
      PutAdHocItem({
        data: {
          RecordID: param.row.RecordId,
          PriceListID: priceListHeaderData.PriceListID,
          QuotationRecordID: "0",
          FilterType: "PL",
          ItemNo: param.row.Item_Number,
          PrintItem: newValue,
        },
      })
    );

    dispatch(
      onCheckboxChangePriceListEdit({
        id: param.row.RecordId,
        field: "PrintItem",
        adhocItem: param.row.AdHocItem,
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

            {/* <Checkbox
              checked={param.row.PrintItem ==="1"}
              onChange={(e) => {
                dispatch(
                  PutAdHocItem({
                    data: {
                      RecordID: param.row.RecordId,
                      PriceListID: priceListHeaderData.PriceListID,
                      QuotationRecordID: "0",
                      FilterType: "PL",
                      ItemNo: param.row.Item_Number,
                      PrintItem: e.target.checked ? "1" : "0",
                    },
                  })
                );
                dispatch(
                  onCheckboxChangePriceListEdit({
                    id: param.row.RecordId,
                    field: "PrintItem",
                    adhocItem: param.row.AdHocItem,
                  })
                );
              }}
              sx={{
                color: "#174c4f",
                "&.Mui-checked": {
                  color: "#174c4f",
                },
              }}
            /> */}
          </div>
        );
      },
    },
    {
      headerName: "Ad Hoc Item",
      field: "AdHocItem",
      minWidth: "100",
      align: "left",
      headerAlign: "left",
      hide: true,
      renderCell: (param) => {
        return param.row.AdHocItem === "Y" ? "Yes" : "No";
      },
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

      renderCell: (param) => {
        return (
          <>
            <Tooltip title="Remove">
              <IconButton
                sx={{ height: 25, marginLeft: 2 }}
                variant="contained"
                color="error"
                size="small"
                onClick={() => {
                  setIsRemoveItem1ID(param.row.RecordId);
                  setIsRemoveItem1(true);
                }}
                // startIcon={<DeleteIcon size="small" />}
                disabled={
                  params.mode === "delete" || params.mode === "view"
                    ? true
                    : false
                }
              >
                <DeleteIcon size="small" />
              </IconButton>
            </Tooltip>
          </>
        );
      },
    },
  ];
  const [quickFilterText, setQuickFilterText] = useState("");
  // **********************  FUNCTION ********************** //

  // const isPriceListIDExists = (e, setSubmitting) => {
  //   const inputValue = e.target.value.trim();
  //   const isPriceListID = priceRows.some(
  //     (item) => item.PRICELISTID === inputValue
  //   );
  //   if (isPriceListID) {
  //     SetIsPriceListOpen(true);
  //   } else {
  //     setSubmitting(false);
  //   }
  // };

  const priceListSaveFn = async (values, setSubmitting, isDerct = false) => {
    console.log("--",state.companyCode)
 

  

    try {
      dispatch(
        priceListHeaderPost({
          data: {
            recordId: priceListHeaderData.RecordId,
            priceListID: values.priceListID,
            pricelistDesc: values.priceListDescription,
            buyer: values.buyer ? JSON.stringify(values.buyer) : null,
            createdBy: values.createdBy,
            companyCode: state.companyCode.toString(),
            PrintGroupName: values.catName ? values.catName.GroupName : "",
            PrintGroupRecordID: values.catName ? values.catName.RecordID : 0,
            forcePageBreak: "N",
            overridesequence: values.overrideSeq,
            customer: values.propCustomer
              ? JSON.stringify(values.propCustomer)
              : null,
            Comments: values.comments,
            CreatedDate: values.createdDateTime,
            ModifyDate: values.lastModifiedDateTime,
            ModifyUser: user.name,
            CompanyID:state.companyRecordID,
            //IsProprietary:values.IsProprietary
            IsProprietary:false,
            
          },
        })
      ).then(async (response) => {
        if (response.payload.status === "Y") {
          setpriceListRecordID(response.payload.PriceListID.toString())
          const filterData = {
            FilterType: "PL",
            headerRecordID:response.payload.PriceListID.toString(),
            companyID:state.companyRecordID,
            User:user.name,
            Brand: {
              PriceListID: values.priceListID,
              Attribute: "Brand",
              Option: values.brandInEx,
              Value:
                values.brandInEx === "IncludeAll"
                  ? ""
                  : JSON.stringify(values.brandInExData),
            },
            Commodity: {
              PriceListID: values.priceListID,
              Attribute: "Commodity",
              Option: values.commodityInEx,
              Value:
                values.commodityInEx === "IncludeAll"
                  ? ""
                  : JSON.stringify(values.commodityInExData),
            },
            AlternativeClass: {
              PriceListID: values.priceListID,
              Attribute: "AlternativeClass",
              Option: values.altClassInEx,
              Value:
                values.altClassInEx === "IncludeAll"
                  ? ""
                  : JSON.stringify(values.altClassInExData),
            },
            Vendor: {
              PriceListID: values.priceListID,
              Attribute: "Vendor",
              Option: values.vendorInEx,
              Value:
                values.vendorInEx === "IncludeAll"
                  ? ""
                  : JSON.stringify(values.vendorInExData),
            },
            Type: {
              PriceListID: values.priceListID,
              Attribute: "Type",
              Option: values.frshForzInEx,
              Value:
                values.frshForzInEx === "IncludeAll"
                  ? ""
                  : JSON.stringify(values.frshForzInExData),
            },
            SecondaryClass: {
              PriceListID: values.priceListID,
              Attribute: "SecondaryClass",
              Option: values.SecondClassInEx,
              Value:
                values.SecondClassInEx === "IncludeAll"
                  ? ""
                  : JSON.stringify(values.SecondClassInExData),
            },
            Class: {
              PriceListID: values.priceListID,
              Attribute: "Class",
              Option: values.classIDInEx,
              Value:
                values.classIDInEx === "IncludeAll"
                  ? ""
                  : JSON.stringify(values.classIDInExData),
            },
            BrokenItem: {
              PriceListID: values.priceListID,
              Attribute: "BrokenItem",
              Option: "Exclude",
              Value: values.brokenItems ? "1" : "0",
            },
            Combination: {
              PriceListID: values.priceListID,
              Attribute: "Combination",
              Option: "Exclude",
              Value: values.combinationFilter ? "1" : "0",
            },
            DamageItem: {
              PriceListID: values.priceListID,
              Attribute: "DamageItem",
              Option: "Exclude",
              Value: values.damagedItems ? "1" : "0",
            },
            PriceListItemData :isFilterApplied ? FILTERADHoc : combined
          };
          console.log("🚀 ~ ).then ~ filterData:", filterData);
           dispatch(PostPriceListDetail({filterData}));
         
        
          setOpenAlert(true);
          setSuccessMessage(response.payload.message);
          if (params.mode === "add") {
            navigate("/pages/control-panel/price-list/price-list-detail/edit", {
              state: {
                id: priceListRecordID,
                companyCode: state.companyCode,
                companyRecordID:state.companyRecordID,
              },
            });
            // setTimeout(() => {
            //   setOpenAlert(false);
            // }, 5000);
          } else {
          // if (params.mode === "add") {
          setOpenAlert(true);
          // setPostError(res.payload.message);
          // setTimeout(() => {
          //   setOpenAlert(false);
          // }, 2000);
          // }
      } }
      });
    } catch (e) {
      console.log("🚀 ~ priceListSaveFn ~ e:", e);
    }
  };

  const ApplyFilter= async(values)=>{
    setIsOtherItem(true);
    setIsOtherDisabled(false);
    const filterData = {
      FilterType: "AP",
      headerRecordID:priceListRecordID,
      companyID:state.companyRecordID,
      User:user.name,
      Brand: {
        PriceListID: values.priceListID,
        Attribute: "Brand",
        Option: values.brandInEx,
        Value:
          values.brandInEx === "IncludeAll"
            ? ""
            : JSON.stringify(values.brandInExData),
      },
      Commodity: {
        PriceListID: values.priceListID,
        Attribute: "Commodity",
        Option: values.commodityInEx,
        Value:
          values.commodityInEx === "IncludeAll"
            ? ""
            : JSON.stringify(values.commodityInExData),
      },
      AlternativeClass: {
        PriceListID: values.priceListID,
        Attribute: "AlternativeClass",
        Option: values.altClassInEx,
        Value:
          values.altClassInEx === "IncludeAll"
            ? ""
            : JSON.stringify(values.altClassInExData),
      },
      Vendor: {
        PriceListID: values.priceListID,
        Attribute: "Vendor",
        Option: values.vendorInEx,
        Value:
          values.vendorInEx === "IncludeAll"
            ? ""
            : JSON.stringify(values.vendorInExData),
      },
      Type: {
        PriceListID: values.priceListID,
        Attribute: "Type",
        Option: values.frshForzInEx,
        Value:
          values.frshForzInEx === "IncludeAll"
            ? ""
            : JSON.stringify(values.frshForzInExData),
      },
      SecondaryClass: {
        PriceListID: values.priceListID,
        Attribute: "SecondaryClass",
        Option: values.SecondClassInEx,
        Value:
          values.SecondClassInEx === "IncludeAll"
            ? ""
            : JSON.stringify(values.SecondClassInExData),
      },
      Class: {
        PriceListID: values.priceListID,
        Attribute: "Class",
        Option: values.classIDInEx,
        Value:
          values.classIDInEx === "IncludeAll"
            ? ""
            : JSON.stringify(values.classIDInExData),
      },
      BrokenItem: {
        PriceListID: values.priceListID,
        Attribute: "BrokenItem",
        Option: "Exclude",
        Value: values.brokenItems ? "1" : "0",
      },
      Combination: {
        PriceListID: values.priceListID,
        Attribute: "Combination",
        Option: "Exclude",
        Value: values.combinationFilter ? "1" : "0",
      },
      DamageItem: {
        PriceListID: values.priceListID,
        Attribute: "DamageItem",
        Option: "Exclude",
        Value: values.damagedItems ? "1" : "0",
      },
    };
    console.log("🚀 ~ ).then ~ filterData:", filterData)


    const res = await dispatch(getPriceListFilterData(filterData));
    setIsFilterApplied(true)
  }

  const getOtherItems = async (values, type) => {
    const filterData = {
      FilterType: type,
      companyID:state.companyRecordID,
      headerRecordID: priceListRecordID,
      Brand: {
        PriceListID: values.priceListID,
        Attribute: "Brand",
        Option: values.brandInEx,
        Value:
          values.brandInEx === "IncludeAll"
            ? ""
            : JSON.stringify(values.brandInExData),
      },
      Commodity: {
        PriceListID: values.priceListID,
        Attribute: "Commodity",
        Option: values.commodityInEx,
        Value:
          values.commodityInEx === "IncludeAll"
            ? ""
            : JSON.stringify(values.commodityInExData),
      },
      AlternativeClass: {
        PriceListID: values.priceListID,
        Attribute: "AlternativeClass",
        Option: values.altClassInEx,
        Value:
          values.altClassInEx === "IncludeAll"
            ? ""
            : JSON.stringify(values.altClassInExData),
      },
      Vendor: {
        PriceListID: values.priceListID,
        Attribute: "Vendor",
        Option: values.vendorInEx,
        Value:
          values.vendorInEx === "IncludeAll"
            ? ""
            : JSON.stringify(values.vendorInExData),
      },
      Type: {
        PriceListID: values.priceListID,
        Attribute: "Type",
        Option: values.frshForzInEx,
        Value:
          values.frshForzInEx === "IncludeAll"
            ? ""
            : JSON.stringify(values.frshForzInExData),
      },
      SecondaryClass: {
        PriceListID: values.priceListID,
        Attribute: "SecondaryClass",
        Option: values.SecondClassInEx,
        Value:
          values.SecondClassInEx === "IncludeAll"
            ? ""
            : JSON.stringify(values.SecondClassInExData),
      },
      Class: {
        PriceListID: values.priceListID,
        Attribute: "Class",
        Option: values.classIDInEx,
        Value:
          values.classIDInEx === "IncludeAll"
            ? ""
            : JSON.stringify(values.classIDInExData),
      },
      BrokenItem: {
        PriceListID: values.priceListID,
        Attribute: "BrokenItem",
        Option: "Exclude",
        Value: values.brokenItems ? "1" : "0",
      },
      Combination: {
        PriceListID: values.priceListID,
        Attribute: "Combination",
        Option: "Exclude",
        Value: values.combinationFilter ? "1" : "0",
      },
      DamageItem: {
        PriceListID: values.priceListID,
        Attribute: "DamageItem",
        Option: "Exclude",
        Value: values.damagedItems ? "1" : "0",
      },
    };
    try {
      dispatch(getPriceListFilterData(filterData));
    } catch (e) {
      console.log("🚀 ~ priceListSaveFn ~ e:", e);
    }
  };

  const priceListDeleteFn = async (values, setSubmitting) => {
    try {
      dispatch(priceListDelete({ id: priceListHeaderData.RecordId })).then(
        (response) => {
          if (response.payload.status === "Y") {
            setOpenAlert(true);
            setSuccessMessage(response.payload.message);
          } else {
            setOpenAlert(true);
            setPostError(response.payload.message);
          }
        }
      );
    } catch (e) {
      console.log("🚀 ~ priceListSaveFn ~ e:", e);
    }
  };
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  // Step 1: Combine both lists
const combined = [...AdHocRows, ...priceListItemsData];

// Step 2: Count occurrences of each Item_Number
const itemCountMap = combined.reduce((map, item) => {
  const num = item.Item_Number;
  map[num] = (map[num] || 0) + 1;
  return map;
}, {});
 // Step 3: Filter out duplicates from both AdHocRows and priceListItemsData
const FILTERADHoc = [
  ...AdHocRows.filter(item => itemCountMap[item.Item_Number] === 1),
  ...priceListItemsData.filter(item => itemCountMap[item.Item_Number] === 1)
];
  
 
    console.log("🚀 ~ FILTERADHoc:", FILTERADHoc)
    // ********************** USE EFFECT - PRICE LIST GET FUNCTION ********************** //
  useEffect(() => {
    dispatch(getPriceListData({ id: state.id }));
// if(AdHocRows){
//   setAdhocRows(AdHocRows)
// }
    // if (params.mode === "edit" || params.mode === "view" || params.mode === "delete") {
    //   setShowGridData(0);
    // } else setShowGridData(3);
  }, [loaction.key]);

  const [openAlert1, setOpenAlert1] = useState(false);
  const [postError1, setPostError1] = useState(null);

  const [openAlert2, setOpenAlert2] = useState(false);
  const [postError2, setPostError2] = useState(false);
  const clearFilter = async (setFieldValue) => {
    // const data = {
    //   QuotationRecordId: 0,
    //   PriceListID: priceListHeaderData.RecordId,
    //   Type: "PL",
    // };
    // const response = await dispatch(priceListClearFilter({ data }));
    // if (response.payload.status === "Y") {
      setFieldValue("brandInEx", "IncludeAll");
      setFieldValue("commodityInEx", "IncludeAll");
      setFieldValue("altClassInEx", "IncludeAll");
      setFieldValue("vendorInEx", "IncludeAll");
      setFieldValue("frshForzInEx", "IncludeAll");
      setFieldValue("SecondClassInEx", "IncludeAll");
      setFieldValue("classIDInEx", "IncludeAll");

      setFieldValue("brandInExData", []);
      setFieldValue("commodityInExData", []);
      setFieldValue("altClassInExData", []);
      setFieldValue("vendorInExData", []);
      setFieldValue("frshForzInExData", []);
      setFieldValue("SecondClassInExData", []);
      setFieldValue("classIDInExData", []);
      setFieldValue("brokenItems", false);
      setFieldValue("damagedItems", false);
      setFieldValue("combinationFilter", false);
      dispatch(clreatFilterAndItems());
      // setOpenAlert2(true);
    // } else {
    //   setOpenAlert2(true);
    //   setPostError2(true);
    // }
  };

  const [isRemoveItem1, setIsRemoveItem1] = useState(false);
  const [isRemoveItem1ID, setIsRemoveItem1ID] = useState(0);
  const [openAlert11, setOpenAlert11] = useState(false);
  const [postError11, setPostError11] = useState(false);

  const itemDeleteFn = async () => {
    const response = await dispatch(adHocPriceListDeleted({ idToDelete: isRemoveItem1ID }));
  
    console.log("Deleted item with ID:", isRemoveItem1ID);
    console.log("Redux action response:", response);
  
    // Optional: Trigger other actions or UI changes
    if (response) {
      // Optional: if you want to reload full list again
      //dispatch(getPriceListData2({ id: priceListHeaderData.RecordID }));
  
      // setOpenAlert11(true);
      setIsRemoveItem1ID(0);
      setPostError11(false);
    } else {
      setOpenAlert11(true);
      setPostError11(true);
    }
  };
  

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
        
          
          {/* <TextField
            size="small"
            name="viewitems"
            id="viewitems"
            select
            label="View Items"
            value={showGridData}
            onChange={(e) => setShowGridData(e.target.value)}
            fullWidth
            sx={{ maxWidth: 200 }}
          >
            <MenuItem value={0}>All</MenuItem>
            <MenuItem value={1}>Filtered</MenuItem>
            <MenuItem value={3}>Ad Hoc</MenuItem>
          </TextField> */}

        {/* {showGridData === 3 && ( */}
          {/* <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 2,
              width: "100%",
            }}
          > */}
            <OptimizedAdHocAutocomplete
              errors={isItemExistsError}
              helper={isItemExistsError && "please select an item!"}
              disabled={
                params.mode === "delete" || params.mode === "view"
                  ? true
                  : false
              }
              name="adHocItem"
              id="adHocItem"
              value={addPriceListData}
              onChange={handleSelectionAddPriceListData}
              label="Item"
              url={`${process.env.REACT_APP_BASE_URL}ItemMaster/GetItemMasterList?Type=C`}
            />

            {/* {state.id ? ( */}
              <Button
                variant="contained"
                color="info"
                onClick={async () => {
                  if (addPriceListData && addPriceListData.length > 0) {
                
                    // ✅ Check if any of the current new items already exist
                    const isItem = [...priceListItemsData, ...addedRows].some((item) =>
                      addPriceListData.some((newItem) =>
                        lodash.isEqual(item.Item_Number, newItem.Item_Number)
                      )
                    );
                
                    if (isItem) {
                      setIsItemExists(true);
                      setTimeout(() => {
                        setIsItemExists(false);
                        setAddPriceListData([]);
                       
                      }, 5000);
                      return;
                    }
                
                    // ✅ Transform new data to correct structure
                    const newAdHocData = addPriceListData.map((row) => ({
                      PriceListID: '',
                      QuotationRecordID: "0",
                      FilterType: "PL",
                      Item_Number: row.Item_Number,
                      Item_Description: row.Item_Description,
                      User: user.role,
                      PriceListRecordID: 0,
                    }));
                
                    // ✅ Accumulate with previous adhoc rows
                    const updatedAdhocRows = [...AdHocRows, ...newAdHocData];
                    // setAdhocRows(updatedAdhocRows);  // Store it for future adds or posts
                
                    console.log("🚀 ~ updatedAdhocRows:", updatedAdhocRows);
                
                    const response1 = await dispatch(PostAddHocItems({
                      compID: state.companyRecordID,
                      adhocdata: updatedAdhocRows
                    }));
                
                    if (response1.payload.status === "Y") {
                      setPostError1(null);
                      setAddPriceListData([]);
                      // Clear after successful post
                    } else {
                      setOpenAlert1(true);
                      setPostError1(response1.payload.message);
                    }
                
                  } else {
                    setIsItemExistsError(true);
                    setTimeout(() => {
                      setIsItemExistsError(false);
                    }, 2000);
                  }
                }}
                
                size="small"
                // onClick={async () => {
                //   if (addPriceListData) {
                   
                //     const isItem = [...priceListItemsData, ...addedRows].some(
                //       (item) =>
                //         lodash.isEqual(
                //           item.Item_Number,
                //           addPriceListData.Item_Number
                //         )
                //     );
                //     if (isItem) {
                //       setIsItemExists(true);
                //       setTimeout(() => {
                //         setIsItemExists(false);
                //         setAddPriceListData([]);
                //         setAdhocRows([])
                //       }, 5000);
                     
                      
                     
                //       return;
                //     }
                //   //   {
                //   //     "PriceListID": "",
                //   //     "QuotationRecordID": "0",
                //   //     "FilterType": "PL",
                //   //     "Item_Number": "017978",
                //   //     "Item_Description": "Shanks Sliced 1in - 10# Rdm Fz (Vanguard)",
                //   //     "User": "Admin",
                //   //     "PriceListRecordID": 414
                //   // }


                //   const adHocData = addPriceListData.map((row, index) => ({
                //     return{
                //     PriceListID: '',
                //     QuotationRecordID: "0",
                //     FilterType: "PL",
                //     Item_Number: row.Item_Number,
                //     Item_Description: row.Item_Description,
                //     User: user.role,
                //     PriceListRecordID: 0,}
                //   }));
                  
                //   console.log("🚀 ~ adHocData ~ adHocData:", adHocData)
                //     console.log("🚀 ~ onClick={ ~ addPriceListData:", addPriceListData) 
                //     console.log("🚀 ~ adhocdata:addPriceListData", { adhocdata: addPriceListData });
                //     console.log("🚀 ~ onClick={ ~ addPriceListData:", {compID:state.companyRecordID}) 
                  
                //     const response1 = await dispatch(PostAddHocItems({compID:state.companyRecordID,adhocdata:adHocData}));
                //     console.log("🚀 ~ onClick={ ~ response1:", response1)
                //     if (response1.payload.status === "Y") {
                //       setPostError1(null);
                //       // setOpenAlert1(true);
                //       // setAdhocRows(AdHocRows)
                //       // dispatch(
                //       //   getPriceListData2({
                //       //     id: priceListHeaderData.RecordId,
                //       //   })
                //       // );
                //       setAddPriceListData([]);
                //       setAdhocRows([])
                //     } else {
                //       setOpenAlert1(true);
                //       setPostError1(response1.payload.message);
                //     }
                //   } else {
                //     setIsItemExistsError(true);
                //     setTimeout(() => {
                //       setIsItemExistsError(false);
                //     }, 2000);
                //   }
                // }}
                startIcon={<Add size="small" />}
                disabled={
                  params.mode === "delete" || params.mode === "view"
                    ? true
                    : false
                }
              >
                Ad Hoc Item
              </Button>
              </Box>
      </GridToolbarContainer>
    );
  }

  return (
    <Container>
      {getStatus === "fulfilled" && !getError && (
        <Formik
          initialValues={{
            priceListID: priceListHeaderData.PriceListID,
            priceListDescription: priceListHeaderData.PricelistDesc,
            buyer: JSON.parse(priceListHeaderData.Buyer),
            IsProprietary:priceListHeaderData.IsProprietary,
            forcePageBreak:
              priceListHeaderData.ForcePageBreak === "Y" ? true : false,
            overrideSeq: priceListHeaderData.Overridesequence,
            propCustomer: JSON.parse(priceListHeaderData.Customer),
            createdDateTime: priceListHeaderData.CreatedDate,
            lastModifiedDateTime: priceListHeaderData.ModifyDate,
            createdBy:
              params.mode === "add" ? user.name : priceListHeaderData.CreatedBy,
            comments: priceListHeaderData.Comments,
            catId: priceListHeaderData.PrintGroupRecordID,
            catName: priceListHeaderData.PrintGroupRecordID
              ? {
                  RecordID: priceListHeaderData.PrintGroupRecordID,
                  GroupName: priceListHeaderData.PrintGroupName,
                }
              : null,

            brandInEx:
              params.mode === "add"
                ? "IncludeAll"
                : priceListFilterData.Brand.Option,
            brandInExData: JSON.parse(priceListFilterData.Brand.Value || "[]"),
            commodityInEx:
              params.mode === "add"
                ? "IncludeAll"
                : priceListFilterData.Commodity.Option,
            commodityInExData: JSON.parse(
              priceListFilterData.Commodity.Value || "[]"
            ),
            altClassInEx:
              params.mode === "add"
                ? "IncludeAll"
                : priceListFilterData.AlternativeClass.Option,
            altClassInExData: JSON.parse(
              priceListFilterData.AlternativeClass.Value || "[]"
            ),
            vendorInEx:
              params.mode === "add"
                ? "IncludeAll"
                : priceListFilterData.Vendor.Option,
            vendorInExData: JSON.parse(
              priceListFilterData.Vendor.Value || "[]"
            ),

            frshForzInEx:
              params.mode === "add"
                ? "IncludeAll"
                : priceListFilterData.Type.Option,
            frshForzInExData: JSON.parse(
              priceListFilterData.Type.Value || "[]"
            ),
            SecondClassInEx:
              params.mode === "add"
                ? "IncludeAll"
                : priceListFilterData.SecondaryClass.Option,
            SecondClassInExData: JSON.parse(
              priceListFilterData.SecondaryClass.Value || "[]"
            ),
            classIDInEx:
              params.mode === "add"
                ? "IncludeAll"
                : priceListFilterData.Class.Option,
            classIDInExData: JSON.parse(
              priceListFilterData.Class.Value || "[]"
            ),
            brokenItems:
              priceListFilterData.BrokenItem.Value == "1" ? true : false,
            damagedItems:
              priceListFilterData.DamageItem.Value == "1" ? true : false,
            combinationFilter:
              priceListFilterData.Combination.Value == "1" ? true : false,
          }}
          enableReinitialize={true}
          validate={(values) => {
            const filters1 = [
              "brandInEx",
              "commodityInEx",
              "altClassInEx",
              "vendorInEx",
              "frshForzInEx",
              "classIDInEx",
              "SecondClassInEx",
              ,
            ];
            const hasDataCheck = filters1.some(
              (filter) => values[filter] != "IncludeAll"
            );

            const errors = {};
            const filters = [
              "brandInExData",
              "commodityInExData",
              "altClassInExData",
              "vendorInExData",
              "frshForzInExData",
              "SecondClassInExData",
              "classIDInExData",
            ];
            if (hasDataCheck) {
              const hasData = filters.some(
                (filter) => values[filter].length > 0
              );
              if (!hasData) {
                errors.filters =
                  "At least one filter must be selected";
              }
              return errors;
            }
            // else{
            //   errors.filters = "At least one filter must have selected filter";
            //   return errors;
            // }
          }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              // if (params.mode === "delete") {
              //   setIsDelete(true);
              // }
              // if (params.mode === "add" || params.mode === "edit") {
              //   priceListSaveFn(values, setSubmitting);
              //   ApplyFilter(values);
              // }
              const action = submitActionRef.current;
        console.log("Action triggered:", action);

        if (params.mode === "delete") {
          priceListDeleteFn()
        }

        if (params.mode === "add" || params.mode === "edit") {
          if (action === "save") {
            priceListSaveFn(values, setSubmitting);
          } else if (action === "apply") {
            ApplyFilter(values);
            setSubmitting(false); // Manually end Formik submit state
          }
        }
            }, 400);
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
            <form onSubmit={handleSubmit} onChange={() => setSubmitting(false)}>
              <div className="breadcrumb">
                <Breadcrumb
                  routeSegments={[
                    { name: "Control Panel" },
                    {
                      name: "Price List",
                      path: "/pages/control-panel/price-list",
                    },
                    { name: `${params.mode} Price List` },
                  ]}
                />
                <Stack direction={"row"} gap={1}>
                <Button
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
                    onClick={() => (submitActionRef.current = "save")}
                  >
                    {params.mode === "delete" ? "Confirm" : "Save"}
                  </Button>
                  {/* {params.mode == "delete" && (
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      disabled={isSubmitting}
                      startIcon={<DeleteIcon color="error" size="small" />}
                      type="submit"
                    >
                      Confirm
                    </Button>
                  )} */}
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    startIcon={<ArrowBackIcon size="small" />}
                    onClick={() => {
                      navigate("/pages/control-panel/price-list");
                  
                    }}
                  >
                    Back
                  </Button>
                  <Tooltip title="Help">
  <IconButton onClick={handleOpen}>
    <HelpOutlineIcon />
  </IconButton>
</Tooltip>
                </Stack>
              </div>

              <Paper sx={{ width: "100%", mb: 1 }}>
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
                  {/* <TextField
                    sx={{ gridColumn: "span 1" }}
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="priceListID"
                    name="priceListID"
                    label="Price List ID"
                    value={values.priceListID}
                    onFocus={() => setSubmitting(true)}
                    //onChange={handleChange}
                    onChange={(e) => {
                      // Remove commas before updating state
                      const newValue = e.target.value.replace(/,/g, "");
                      handleChange({
                        target: { name: e.target.name, value: newValue },
                      });
                    }}
                    onBlur={(e) => isPriceListIDExists(e, setSubmitting)}
                    required
                    InputLabelProps={{
                      sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                    }}
                    autoComplete="off"
                    size="small"
                    disabled={
                      params.mode === "delete" ||
                      params.mode === "view" ||
                      params.mode === "edit"
                        ? true
                        : false
                    }
                  /> */}
                  {/* <TextField
                    sx={{ gridColumn: "span 1" }}
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="priceListID"
                    name="priceListID"
                    label="Price List ID"
                    value={values.priceListID}
                    onFocus={() => setSubmitting(true)}
                    onChange={(e) => {
                      const newValue = e.target.value;

                      // Allow only letters, numbers, spaces, and the '&' symbol
                      if (/^[a-zA-Z0-9 &]*$/.test(newValue)) {
                        setErrorMsg("");
                        handleChange(e);
                      } else {
                        setErrorMsg(
                          "Only letters, numbers, spaces, and '&' are allowed."
                        );
                      }
                    }}
                    onBlur={(e) => isPriceListIDExists(e, setSubmitting)}
                    required
                    InputLabelProps={{
                      sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                    }}
                    autoComplete="off"
                    size="small"
                    error={Boolean(errorMsg)}
                    helperText={errorMsg}
                    disabled={
                      params.mode === "delete" ||
                      params.mode === "view" ||
                      params.mode === "edit"
                    }
                  /> */}
                  <TextField
                    sx={{ gridColumn: "span 1" }}
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="priceListDescription"
                    name="priceListDescription"
                    label="Price List"
                    value={values.priceListDescription}
                    autoComplete="off"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    size="small"
                    //   error={!!touched.priceListDescription && !!errors.priceListDescription}
                    //   helperText={touched.priceListDescription && errors.priceListDescription}
                    disabled={
                      params.mode === "delete" || params.mode === "view"
                        ? true
                        : false
                    }
                    required
                    InputLabelProps={{
                      sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                    }}
                  />
                  
                  <Stack
                    sx={{ gridColumn: "span 1" }}
                    direction="column"
                    gap={1}
                  >
                    <FormikOptimizedAutocomplete
                      disabled={
                        params.mode === "delete" || params.mode === "view"
                          ? true
                          : false
                      }
                      name="buyer"
                      id="buyer"
                      value={values.buyer}
                      onChange={(event, newValue) =>
                        setFieldValue("buyer", newValue)
                      }
                      label="Buyer"
                      url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=Buyer`}
                    />
                  </Stack>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="overrideSeq"
                    name="overrideSeq"
                    label="Print Sequence"
                    value={values.overrideSeq}
                    onChange={handleChange}
                    // required
                    // InputLabelProps={{
                    //   sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                    // }}
                    autoComplete="off"
                    size="small"
                    disabled={
                      params.mode === "delete" || params.mode === "view"
                        ? true
                        : false
                    }
                  />
                  <PrintGroupOptimizedAutocompletePriceList
                    disabled={
                      params.mode === "delete" || params.mode === "view"
                        ? true
                        : false
                    }
                    sx={{ gridColumn: "span 1" }}
                    fullWidth
                    name="catName"
                    id="catName"
                    value={values.catName}
                    onChange={(newValue) => setFieldValue("catName", newValue)}
                    label="Categories"
                    url={`${process.env.REACT_APP_BASE_URL}PrintGroup/PrintGroupList?CompanyID=${state.companyRecordID}`}
                  />
                    {/* <FormControlLabel
                                          sx={{ height: 37.13 }}
                                          control={
                                            <Checkbox
                                              size="small"
                                              id="IsProprietary"
                                              name="IsProprietary"
                                              checked={values.IsProprietary}
                                              onChange={handleChange}
                                            />
                                          }
                                          label="Proprietary"
                                        /> */}
                </Box>
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
                  <Stack
                    sx={{ gridColumn: "span 1" }}
                    direction={"column"}
                    gap={1}
                  >
                    <Stack direction="row" gap={13} height={44}>
                      <Typography sx={{ marginLeft: 2 }} variant="h6">
                        Options
                      </Typography>
                      <Typography variant="h6">Attributes</Typography>
                    </Stack>
                    <Stack
                      sx={{ p: 0, m: 0 }}
                      direction="row"
                      justifyContent={"flex-end"}
                      gap={2}
                    >
                      {errors.filters && (
                        <div style={{ color: "red" }}>{errors.filters}</div>
                      )}
                    </Stack>
                    {/* BRAND */}
                    <Stack direction="row" gap={1}>
                      <TextField
                        size="small"
                        name="brandInEx"
                        id="brandInEx"
                        select
                        label="Include/Exclude"
                        value={values.brandInEx}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        disabled={
                          params.mode === "delete" || params.mode === "view"
                            ? true
                            : false
                        }
                        sx={{ maxWidth: 120, minWidth: 100 }}
                      >
                        <MenuItem value="IncludeAll">Include All</MenuItem>
                        <MenuItem value="Include">Include</MenuItem>
                        <MenuItem value="Exclude">Exclude</MenuItem>
                      </TextField>
                      <FormikCustomAutocompleteMulti
                        name="brandInExData"
                        id="brandInExData"
                        value={values.brandInExData}
                        onChange={(event, newValue) => {
                          setFieldValue("brandInExData", newValue);
                          setSubmitting(false);
                        }}
                        label="Brand"
                        url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=Brand`}
                        disabled={
                          params.mode === "delete" ||
                          values.brandInEx === "IncludeAll" ||
                          params.mode === "view"
                            ? true
                            : false
                        }
                      />
                    </Stack>

                    {/* COMMODITY */}
                    <Stack direction="row" gap={1}>
                      <TextField
                        size="small"
                        name="commodityInEx"
                        id="commodityInEx"
                        select
                        label="Include/Exclude"
                        value={values.commodityInEx}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        sx={{ maxWidth: 120, minWidth: 100 }}
                        disabled={
                          params.mode === "delete" || params.mode === "view"
                            ? true
                            : false
                        }
                      >
                        <MenuItem value="IncludeAll">Include All</MenuItem>
                        <MenuItem value="Include">Include</MenuItem>
                        <MenuItem value="Exclude">Exclude</MenuItem>
                      </TextField>
                      <FormikCustomAutocompleteMulti
                        name="commodityInExData"
                        id="commodityInExData"
                        value={values.commodityInExData}
                        onChange={(event, newValue) => {
                          setFieldValue("commodityInExData", newValue);
                          setSubmitting(false);
                        }}
                        label="Commodity"
                        url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=Commodity`}
                        disabled={
                          params.mode === "delete" ||
                          values.commodityInEx === "IncludeAll" ||
                          params.mode === "view"
                            ? true
                            : false
                        }
                      />
                    </Stack>

                    {/* ALTERNATIVE CLASS */}
                    <Stack direction="row" gap={1}>
                      <TextField
                        size="small"
                        name="altClassInEx"
                        id="altClassInEx"
                        select
                        label="Include/Exclude"
                        value={values.altClassInEx}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        disabled={
                          params.mode === "delete" || params.mode === "view"
                            ? true
                            : false
                        }
                        sx={{ maxWidth: 120, minWidth: 100 }}
                      >
                        <MenuItem value="IncludeAll">Include All</MenuItem>
                        <MenuItem value="Include">Include</MenuItem>
                        <MenuItem value="Exclude">Exclude</MenuItem>
                      </TextField>
                      <FormikCustomAutocompleteMulti
                        name="altClassInExData"
                        id="altClassInExData"
                        value={values.altClassInExData}
                        onChange={(event, newValue) => {
                          setFieldValue("altClassInExData", newValue);
                          setSubmitting(false);
                        }}
                        label="Alternate Class"
                        url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=AlternativeClass`}
                        disabled={
                          params.mode === "delete" ||
                          values.altClassInEx === "IncludeAll" ||
                          params.mode === "view"
                            ? true
                            : false
                        }
                      />
                    </Stack>

                    {/* VENDOR */}
                    <Stack direction="row" gap={1}>
                      <TextField
                        size="small"
                        name="vendorInEx"
                        id="vendorInEx"
                        select
                        label="Include/Exclude"
                        value={values.vendorInEx}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        disabled={
                          params.mode === "delete" || params.mode === "view"
                            ? true
                            : false
                        }
                        sx={{ maxWidth: 120, minWidth: 100 }}
                      >
                        <MenuItem value="IncludeAll">Include All</MenuItem>
                        <MenuItem value="Include">Include</MenuItem>
                        <MenuItem value="Exclude">Exclude</MenuItem>
                      </TextField>
                      <FormikCustomAutocompleteMulti
                        name="vendorInExData"
                        id="vendorInExData"
                        value={values.vendorInExData}
                        onChange={(event, newValue) => {
                          setFieldValue("vendorInExData", newValue);
                          setSubmitting(false);
                        }}
                        label="Vendor"
                        url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=Vendor`}
                        disabled={
                          params.mode === "delete" ||
                          values.vendorInEx === "IncludeAll" ||
                          params.mode === "view"
                            ? true
                            : false
                        }
                      />
                    </Stack>

                    {/* FRESH/FROZEN */}
                    <Stack direction="row" gap={1}>
                      <TextField
                        size="small"
                        name="frshForzInEx"
                        id="frshForzInEx"
                        select
                        label="Include/Exclude"
                        value={values.frshForzInEx}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        sx={{ maxWidth: 120, minWidth: 100 }}
                        disabled={
                          params.mode === "delete" || params.mode === "view"
                            ? true
                            : false
                        }
                      >
                        <MenuItem value="IncludeAll">Include All</MenuItem>
                        <MenuItem value="Include">Include</MenuItem>
                        <MenuItem value="Exclude">Exclude</MenuItem>
                      </TextField>

                      <FormikCustomAutocompleteMulti
                        name="frshForzInExData"
                        id="frshForzInExData"
                        value={values.frshForzInExData}
                        onChange={(event, newValue) => {
                          setFieldValue("frshForzInExData", newValue);
                          setSubmitting(false);
                        }}
                        label="Fs/Fz"
                        url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=Type`}
                        disabled={
                          params.mode === "delete" ||
                          values.frshForzInEx === "IncludeAll" ||
                          params.mode === "view"
                            ? true
                            : false
                        }
                      />
                    </Stack>

                    {/* SECONDARY CLASS */}
                    <Stack direction="row" gap={1}>
                      <TextField
                        size="small"
                        name="SecondClassInEx"
                        id="SecondClassInEx"
                        select
                        label="Include/Exclude"
                        value={values.SecondClassInEx}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        disabled={
                          params.mode === "delete" || params.mode === "view"
                            ? true
                            : false
                        }
                        sx={{ maxWidth: 120, minWidth: 100 }}
                      >
                        <MenuItem value="IncludeAll">Include All</MenuItem>
                        <MenuItem value="Include">Include</MenuItem>
                        <MenuItem value="Exclude">Exclude</MenuItem>
                      </TextField>
                      <FormikCustomAutocompleteMulti
                        name="SecondClassInExData"
                        id="SecondClassInExData"
                        value={values.SecondClassInExData}
                        onChange={(event, newValue) => {
                          setFieldValue("SecondClassInExData", newValue);
                          setSubmitting(false);
                        }}
                        label="Secondary Class"
                        url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=SecondaryClass`}
                        disabled={
                          params.mode === "delete" ||
                          values.SecondClassInEx === "IncludeAll" ||
                          params.mode === "view"
                            ? true
                            : false
                        }
                      />
                    </Stack>

                    {/* CLASS ID */}
                    <Stack direction="row" gap={1}>
                      <TextField
                        size="small"
                        name="classIDInEx"
                        id="classIDInEx"
                        select
                        label="Include/Exclude"
                        value={values.classIDInEx}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        disabled={
                          params.mode === "delete" || params.mode === "view"
                            ? true
                            : false
                        }
                        sx={{ maxWidth: 120, minWidth: 100 }}
                      >
                        <MenuItem value="IncludeAll">Include All</MenuItem>
                        <MenuItem value="Include">Include</MenuItem>
                        <MenuItem value="Exclude">Exclude</MenuItem>
                      </TextField>
                      <FormikCustomAutocompleteMulti
                        name="classIDInExData"
                        id="classIDInExData"
                        value={values.classIDInExData}
                        onChange={(event, newValue) => {
                          setFieldValue("classIDInExData", newValue);
                          setSubmitting(false);
                        }}
                        label="ClassID"
                        url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=ClassId`}
                        disabled={
                          params.mode === "delete" ||
                          values.classIDInEx === "IncludeAll" ||
                          params.mode === "view"
                            ? true
                            : false
                        }
                      />
                    </Stack>

                    <Stack direction="row" gap={1}>
                      <FormControlLabel
                        sx={{ height: 37.13 }}
                        control={
                          <Checkbox
                            size="small"
                            id="brokenItems"
                            name="brokenItems"
                            checked={values.brokenItems}
                            onChange={handleChange}
                            disabled={
                              params.mode === "delete" || params.mode === "view"
                                ? true
                                : false
                            }
                          />
                        }
                        label="Broken Items"
                      />
                      <FormControlLabel
                        sx={{ height: 37.13 }}
                        control={
                          <Checkbox
                            size="small"
                            id="damagedItems"
                            name="damagedItems"
                            checked={values.damagedItems}
                            onChange={handleChange}
                            disabled={
                              params.mode === "delete" || params.mode === "view"
                                ? true
                                : false
                            }
                          />
                        }
                        label="Damaged Items"
                      />
                    </Stack>
                    <Stack direction="row" gap={1}>
                      <FormControlLabel
                        sx={{
                          height: 37.13,
                          "& .MuiFormControlLabel-label": { fontSize: "13px" },
                        }}
                        control={
                          <Checkbox
                            size="small"
                            id="combinationFilter"
                            name="combinationFilter"
                            checked={values.combinationFilter}
                            onChange={handleChange}
                            disabled={
                              params.mode === "delete" || params.mode === "view"
                            }
                          />
                        }
                        label="Combined Filter"
                      />
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          padding: "5px",
                          border: "1px solid red",
                          borderRadius: 1,
                          backgroundColor: "#ffe6e6",
                          minHeight: 30, // Ensure consistent heigh
                        }}
                      >
                        <Typography
                          color="error"
                          fontSize={"11px"}
                          align="center"
                        >
                          Note: The result shows the combination of filters
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack justifyContent="flex-end" direction={"row"} gap={1}>
                      {state.id ? (
                        // <></>
                        <Button
                          variant="contained"
                          color="info"
                          size="small"
                          // startIcon={<Add size="small" />}
                          onClick={() => {
                            getOtherItems(
                              values,
                              isShowOtherItem ? "OT" : "AP"
                            );
                            setIsOtherItem(!isShowOtherItem);
                          }}
                          disabled={
                            params.mode === "delete" || isShowOtherDisabled
                              ? true
                              : false
                          }
                        >
                          {isShowOtherItem
                            ? "Excluded Items"
                            : "Price List Items"}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="info"
                          size="small"
                          startIcon={<Add size="small" />}
                          disabled={true}
                        >
                          Excluded Items
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        color="info"
                        size="small"
                        startIcon={<CheckIcon size="small" />}
                        disabled={
                          isSubmitting ||
                          params.mode === "delete" ||
                          params.mode === "view" || errorMsg != ""
                        }type="submit"
                        onClick={() => (submitActionRef.current = "apply")}
                      >
                        Apply Filters
                      </Button>

                      {state.id ? (
                        <Button
                          variant="contained"
                          color="info"
                          size="small"
                          startIcon={<ClearIcon size="small" />}
                          disabled={
                            params.mode === "delete" || params.mode === "view"
                              ? true
                              : false
                          }
                          onClick={() => {
                            setIsRemoveItem(true);
                          }}
                        >
                          Clear Filters
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="info"
                          size="small"
                          startIcon={<ClearIcon size="small" />}
                          disabled={
                            params.mode === "delete" || params.mode === "view"
                              ? true
                              : false
                          }
                          type="submit"
                        >
                          Clear Filters
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                  <Box
                    sx={{
                      height: 390,
                      gridColumn: "span 2",
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
                     {/* Controls Section */}
      <Box
        sx={{
          height: 30,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 2,
          width: "100%",
          padding: "5px",
          mb:2
        }}
      >
          <TextField
          label="Search"
          variant="standard"
          size="small"
          // startIcon={<searcIco}
          value={quickFilterText}
          onChange={(e) => setQuickFilterText(e.target.value)}
          sx={{ mb: 1, width: 300 }}
        />
        <OptimizedAdHocAutocomplete
          errors={isItemExistsError}
          helper={isItemExistsError && "please select an item!"}
          disabled={params.mode === "delete" || params.mode === "view"}
          name="adHocItem"
          id="adHocItem"
          value={addPriceListData}
          // onChange={handleSelectionAddPriceListData}
          onChange={(event, newValue) => {
            setFieldValue("adHocItem", newValue);
            setSubmitting(false);
            setAddPriceListData(newValue);
          }}
          label="Item"
          url={`${process.env.REACT_APP_BASE_URL}ItemMaster/GetItemMasterList?Type=C`}
        />
{/* <FormikCustomAutocompleteMulti
                        name="adHocItem"
                        id="adHocItem"
                        value={values.adHocItem}
                        onChange={(event, newValue) => {
                          setFieldValue("adHocItem", newValue);
                          setSubmitting(false);
                        }}
                        label="AdHocItem"
                        url={`${process.env.REACT_APP_BASE_URL}ItemMaster/GetItemMasterList?Type=C`}
                        // disabled={
                        //   params.mode === "delete" ||
                        //   values.classIDInEx === "IncludeAll" ||
                        //   params.mode === "view"
                        //     ? true
                        //     : false
                        // }
                      /> */}
        <Button
          variant="contained"
          color="info"
          sx={{width:300,height:30}}
          onClick={async () => {
            if (addPriceListData && addPriceListData.length > 0) {
              const isItem = [...priceListItemsData, ...AdHocRows].some((item) =>
                addPriceListData.some((newItem) =>
                  lodash.isEqual(item.Item_Number, newItem.Item_Number)
                )
              );

              if (isItem) {
                setIsItemExists(true);
                setTimeout(() => {
                  setIsItemExists(false);
                  setAddPriceListData([]);
                }, 5000);
                return;
              }

              const newAdHocData = addPriceListData.map((row) => ({
                PriceListID: '',
                QuotationRecordID: "0",
                FilterType: "PL",
                Item_Number: row.Item_Number,
                Item_Description: row.Item_Description,
                User: user.role,
                PriceListRecordID: 0,
              }));

              const updatedAdhocRows = [...AdHocRows, ...newAdHocData];
              const response1 = await dispatch(
                PostAddHocItems({
                  compID: state.companyRecordID,
                  adhocdata: newAdHocData,
                })
              );

              if (response1.payload.status === "Y") {
             
                setOpenAlert1(true);
                setPostError1(response1.payload.message);
                setAddPriceListData([]);
              } else {
                setOpenAlert1(true);
                setPostError1(response1.payload.message);
              }
                
            } else {
              setIsItemExistsError(true);
              setTimeout(() => {
                setIsItemExistsError(false);
              }, 2000);
            }
          }}
          size="small"
          startIcon={<Add size="small" />}
          disabled={params.mode === "delete" || params.mode === "view"}
        > Item
        </Button>
      </Box> 
                    <DataGrid
                    columnHeaderHeight={dataGridHeaderFooterHeight}
                      sx={{
                        // This is to override the default height of the footer row
                        "& .MuiDataGrid-footerContainer": {
                          height: dataGridHeaderFooterHeight,
                          minHeight: dataGridHeaderFooterHeight,
                        },
                      }}
                      key={showGridData}
                      // slots={{
                      //   loadingOverlay: LinearProgress,
                      //   toolbar: CustomToolbar,
                      // }}
                      rowHeight={dataGridRowHeight}
                      // rows={[
                      //   ...(isShowOtherItem 
                      //       ?  AdHocRows
                      //       : AdHocRows.filter((f) => f.AdHocItem !== "Y")),
                      //       ...priceListItemsData
                      //   // ...(showGridData === 0
                      //   //   ? priceListItemsData
                      //   //   : showGridData === 1
                      //   //   ? .filter((f) => f.AdHocItem === "N")
                      //   //   : priceListItemsData.filter((f) => f.AdHocItem === "Y"))
                      // ]}
                      rows={[
                        ...(isFilterApplied
                          ? (
                              isShowOtherItem
                                ? FILTERADHoc
                                : FILTERADHoc.filter(f => f.AdHocItem !== "Y")
                            )
                          : [
                              ...(isShowOtherItem
                                ? AdHocRows
                                : AdHocRows.filter(f => f.AdHocItem !== "Y")),
                              ...(showGridData === 0
                                ? priceListItemsData
                                : showGridData === 1
                                  ? priceListItemsData.filter(f => f.AdHocItem === "N")
                                  : priceListItemsData.filter(f => f.AdHocItem === "Y"))
                            ])
                      ]}
                      
                      
                      columns={columns}
                      loading={priceListItemLoading}
                      disableSelectionOnClick
                      disableRowSelectionOnClick
                      getRowId={(row) => row.Item_Number}
                      initialState={{
                        pagination: {
                          paginationModel: { pageSize: dataGridPageSize },
                        },
                      }} filterModel={{
                        items: [],
                        quickFilterValues: [quickFilterText],
                      }}
                      pageSizeOptions={dataGridpageSizeOptions}
                      columnVisibilityModel={{
                        print: isShowOtherItem,
                        AdHocItem: isShowOtherItem,
                        Action: isShowOtherItem,
                        OtherItemPriceListID: !isShowOtherItem,
                        AdHocItem: false,
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
                    <Box
                      sx={{
                        mt: 1,
                        display: "flex",
                        alignItems: "center",
                        padding: 2,
                        border: "1px solid red",
                        borderRadius: 1,
                        backgroundColor: "#ffe6e6",
                        minHeight: 30, // Ensure consistent heigh
                        minWidth: 300, // Ensure consistent width
                      }}
                    >
                      <Typography color="error" align="center">
                        Note: Only Active Items from GP are shown above
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>

              <MessageAlertDialog
                open={isPriceListOpen}
                logo={`data:image/png;base64,${user.logo}`}
                error={true}
                message={`Oops! This Price List ID is already in use.`}
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
                        navigate(
                          "/pages/control-panel/price-list/price-list-detail/edit",
                          {
                            state: { id: values.priceListID },
                          }
                        );
                        dispatch(getPriceListData({ id: values.priceListID }));
                        SetIsPriceListOpen(false);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      sx={{ mr: 1, height: 25 }}
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => {
                        setFieldValue("priceListID", "");
                        SetIsPriceListOpen(false);
                      }}
                    >
                      Try Another
                    </Button>
                  </Box>
                }
              />

              <MessageAlertDialog
                logo={`data:image/png;base64,${user.logo}`}
                open={isDelete}
                tittle={values.priceListID}
                // message={`Are you sure you want to delete Price List ${values.priceListID}?`}
                message={`Are you sure you want to delete Price List ?`}
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
                        setIsDelete(false);
                        priceListDeleteFn();
                        setSuccessMessage(null);
                        setPostError(null);
                      }}
                    >
                      Yes
                    </Button>
                    <Button
                      sx={{ ml: 1 }}
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => {
                        setIsDelete(false);
                        setSubmitting(false);
                        setSuccessMessage(null);
                        setPostError(null);
                      }}
                    >
                      No
                    </Button>
                  </Box>
                }
              />
              <MessageAlertDialog
                logo={`data:image/png;base64,${user.logo}`}
                open={isRemoveItem}
                tittle={""}
                message={`Are you sure you want to Clear Filter and Item ?`}
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
                        clearFilter(setFieldValue);
                        setIsRemoveItem(false);
                      }}
                      sx={{ mr: 1, height: 25 }}
                    >
                      Yes
                    </Button>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => {
                        setIsRemoveItem(false);
                        // setRemoveItemID("");
                        // setRemoveItemDesc("");
                      }}
                      sx={{ mr: 1, height: 25 }}
                    >
                      No
                    </Button>
                  </Box>
                }
              />
              <MessageAlertDialog
                logo={`data:image/png;base64,${user.logo}`}
                open={isItemExists}
                tittle={
                  addPriceListData
                    ? addPriceListData.Item_Description
                    : "Please select an item!"
                }
                error={true}
                message={
                  addPriceListData
                    ? `Oops! This item is already exists in price list.`
                    : ""
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
                        setIsItemExists(false);
                        setAddPriceListData([]);
                        
                      }}
                    >
                      Close
                    </Button>
                  </Box>
                }
              />
            </form>
          )}
        </Formik>
      )}
      <AlertDialog
        key={7846694}
        logo={`data:image/png;base64,${user.logo}`}
        open={openAlert11}
        error={postError11}
        message={
          postError11
            ? "Error while Deleting and please try again"
            : "Item deleted and Price List saved successfully"
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
                setOpenAlert11(false);
              }}
              sx={{ mr: 1, height: 25 }}
            >
              Close
            </Button>
          </Box>
        }
      />
      <AlertDialog
        key={854946}
        logo={`data:image/png;base64,${user.logo}`}
        open={openAlert}
        error={postError}
        message={postError ? postError : successMessage}
        Actions={
          params.mode === "add" ? (
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
                  // navigate(-1);
                  // dispatch(clearPriceListState());
                  setOpenAlert(false);
                  
                }}
              >
                Close
              </Button>
              <Button
                sx={{ mr: 1, height: 25 }}
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  dispatch(getPriceListData({ id: 0 }));
                  setOpenAlert(false);
                }}
              >
                Add New Price List
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              {params.mode != "delete" ? (
                <>
                <Button
                  sx={{ mr: 1, height: 25 }}
                  variant="contained"
                  color="info"
                  size="small"
                  onClick={() => {
                    setSuccessMessage(null);
                    setPostError(null);
                    dispatch(getPriceListData({ id: priceListRecordID }));
                    setOpenAlert(false);

                  }}
                >
                  Close
                </Button>
                 <Button
                 sx={{ mr: 1, height: 25 }}
                 variant="contained"
                 color="info"
                 size="small"
                 onClick={() => {
                   navigate("/pages/control-panel/price-list");
                   setOpenAlert(false);
                   setSuccessMessage(null);
                   setPostError(null);
                 }}
               >
                 Back To Price List
               </Button>
               </>
 
              ) : (
                <Button
                sx={{ mr: 1, height: 25 }}
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  navigate("/pages/control-panel/price-list");
                  setOpenAlert(false);
                  setSuccessMessage(null);
                  setPostError(null);
                }}
              >
                OK
              </Button>
              )}
                         </Box>
          )
        }
      />
      <AlertDialog
        key={85963}
        logo={`data:image/png;base64,${user.logo}`}
        open={openAlert1}
        error={postError1}
        message={postError1 ? postError1 : "AddHoc Item Added Successfully"}
        // message={"Item Deleted Successfully"}
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
                setOpenAlert1(false);
                setTimeout(() => {
                  setPostError1(null);
                }, 1000);
              }}
              sx={{ mr: 1, height: 25 }}
            >
              Close
            </Button>
          </Box>
        }
      />
      <MessageAlertDialog
        open={isRemoveItem1}
        logo={`data:image/png;base64,${user.logo}`}
        message={`Are you sure you want to remove Item ?`}
        // message={`Are you sure you want to remove Item ${values.itemDescription}?`}
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
                itemDeleteFn();
                setIsRemoveItem1(false);
              }}
            >
              Yes
            </Button>
            <Button
              sx={{ mr: 1, height: 25 }}
              variant="contained"
              color="info"
              size="small"
              onClick={() => {
                setIsRemoveItem1(false);
              }}
            >
              No
            </Button>
          </Box>
        }
      />
      <AlertDialog
        key={5826}
        logo={`data:image/png;base64,${user.logo}`}
        open={openAlert2}
        error={postError2}
        message={
          postError2
            ? "Somthing Went Wrong and please try again"
            : "Filters And Items Cleared Successfully"
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
                setOpenAlert2(false);
              }}
              sx={{ mr: 1, height: 25 }}
            >
              Close
            </Button>
          </Box>
        }
      />
   <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Price List Information</DialogTitle>
        <DialogContent dividers>
          <List>
            {infoItems.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={<Typography variant="subtitle1" fontWeight="bold">{item.title}</Typography>}
                    secondary={<Typography variant="body2" color="textSecondary">{item.description}</Typography>}
                  />
                </ListItem>
                {index < infoItems.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PriceListEdit;
const infoItems = [
  {
    title: 'Save',
    description: `This button will save the entire page data, including Header Information (PRICELIST), 
      Filter Conditions (PRICELISTCONDITIONS), Price List Items (PRICELISTITEMS), and Ad Hoc Items 
      (also PRICELISTITEMS), to their respective tables.`
  },
  {
    title: 'Apply Filter',
    description: `This button is used to apply various filter combinations such as Brand, Commodity, 
      Alternate Class, Vendor, Fresh/Frozen, etc., along with the inclusion or exclusion of broken 
      and damaged items. Based on the selected filter conditions, it retrieves item information from 
      the ITEMS_ORG table. Only items that are not already included in any other price list will be 
      displayed. These displayed items will not be inserted into the table until the user clicks the Save button.`
  },
  {
    title: 'Adhoc Item',
    description: `This button is used to add random items that are not part of any existing price list. 
      If a selected item already exists in another price list, it cannot be added as an ad hoc item. 
      Only items not present in any existing price list can be added.`
  },
  {
    title: 'Clear Filter',
    description: `This button is used to clear the filter conditions and items, resetting everything to a fresh, empty state.`
  },
  {
    title: 'Buyer Dropdown',
    description: `It is used to list the buyers from the ITEMS_ORG table.`
  },
  {
    title: 'Category Dropdown',
    description: `It is used to display a list of categories that belong to the selected company 
      (chosen from the Pricelist Listview Company dropdown) from the PRINTGROUP table.`
  },
  {
    title: 'Adhoc Item Dropdown',
    description: `It is used to display a list of items from the ITEMS_ORG table.`
  }
];