import React, { useEffect, useState, useRef } from "react";
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
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  Typography,
  MenuItem,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Switch,
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
  PostAddHocItems,
  getPriceSheetData,
} from "app/redux/slice/getSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  FormikOptimizedAutocomplete,
  OptimizedAutocomplete,
  OptimizedAdHocAutocomplete,
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
  PostPriceSheet,
  PostPriceSheetDetail,
  priceSheetDelete,
} from "app/redux/slice/postSlice";
import useAuth from "app/hooks/useAuth";

import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Add } from "@mui/icons-material";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import AlertDialog, { MessageAlertDialog } from "app/components/AlertDialog";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import Loading from "app/components/AppLoading";
import {
  FormikCustomAutocompleteMulti,
  FormikCustomAutocompleteMultiSecCla,
} from "app/components/FormikAutocomplete";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

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

// ***** PRINT COLUMN DEFAULTS - used to seed "add" mode (all OFF) ***** //
const PRINT_COLUMN_DEFAULTS = [
  { id: "PrintItemNo", label: "Item Number", enabled: true },
    { id: "PrintItemDesc", label: "Item Description", enabled: true },
    { id: "PrintPrice", label: "Price", enabled: true },
  {
    id: "PrintSpanishItemDesc",
    label: "Custom Description",
    enabled: false,
  },
  { id: "PrintUOM", label: "Unit of Measure", enabled: false },
  { id: "PrintPackSize", label: "Pack Size", enabled: false },
];

// **********************  PRICE SHEET EDIT SCREEN  ********************** //
const PriceSheetEdit = () => {
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
  const submitActionRef = useRef(null);

  // ********************** LOCAL STATE ********************** //
  const [openAlert, setOpenAlert] = useState(false);
  const [openErrorAlert, setOpenErrorAlert] = useState(false);
  const [error1Msg, setError1Msg] = useState(false);
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
  const [adHocRows, setAdhocRows] = useState([]);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [addPriceListData, setAddPriceListData] = useState([]);
  const [priceSheetRecordID, setpriceSheetRecordID] = useState(
    String(state?.id ?? ""),
  );

  const handleSelectionAddPriceListData = (newValue) => {
    setAddPriceListData(newValue);
  };

  // ********************** REDUX STATE ********************** //
  const priceSheetData = useSelector((state) => state.getSlice.priceSheetData);

  const priceSheetHeaderData = priceSheetData?.headerData || {};

  const priceSheetItemData = priceSheetData?.itemData || [];

  const [localPriceSheetItems, setLocalPriceSheetItems] = useState([]);

  useEffect(() => {
    if (params.mode === "add") {
      setLocalPriceSheetItems([]);
      return;
    }

    setLocalPriceSheetItems(priceSheetItemData || []);
  }, [params.mode, priceSheetItemData]);

  const [itemToDelete, setItemToDelete] = useState(null);

  const priceSheetPrintColumnData = priceSheetData?.printColumnData || [];

  const priceSheetStatus = useSelector(
    (state) => state.getSlice.priceSheetStatus,
  );

  const priceSheetLoading = useSelector(
    (state) => state.getSlice.priceSheetLoading,
  );

  const priceSheetError = useSelector(
    (state) => state.getSlice.priceSheetError,
  );

  const priceRows = useSelector((state) => state.listview.priceSheetViewData);
  const selectedRows = useSelector(
    (state) => state.getSlice.priceListSelectedData,
  );
  const addedRows = useSelector((state) => state.getSlice.priceListAddedData);
  const priceListHeaderData = useSelector(
    (state) => state.getSlice.priceListHeaderData,
  );
  const [companyID, setCompanyId] = useState(priceListHeaderData.CompanyID);
  const priceListFilterData = useSelector(
    (state) => state.getSlice.priceListFilterData,
  );
  const priceListItemsData = useSelector(
    (state) => state.getSlice.priceListItemsData,
  );
  const priceListItemLoading = useSelector(
    (state) => state.getSlice.priceListItemLoading,
  );

  const AdHocRows = useSelector((state) => state.getSlice.postAdHocData);


//Column_Edit_Section
// =============================================================
// ROW EDITING
// =============================================================

const [rowModesModel, setRowModesModel] = React.useState({});

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
const handleSaveClick = (id) => () => {
  setRowModesModel((oldModel) => ({
    ...oldModel,
    [id]: {
      mode: GridRowModes.View,
    },
  }));
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

  setLocalPriceSheetItems((currentRows) =>
    currentRows.map((row) => {
      const rowId =
        row.RecordId || `${row.Item_Number}-${row.sequence}`;

      const newRowId =
        newRow.RecordId || `${newRow.Item_Number}-${newRow.sequence}`;

      if (rowId === newRowId) {
        return {
          ...row,
          ...newRow,
        };
      }

      return row;
    }),
  );

  return newRow;
};

  // ********************** COLUMN AND ROWS ********************** //
  const columns = [
    {
      headerName: "Item Number",
      field: "Item_Number",
      width: "150",
      align: "left",
      headerAlign: "left",
      hide: false,
       editable: false,
    },
    {
      headerName: "Item Description",
      field: "Item_Description",
      minWidth: 350,
      align: "left",
      headerAlign: "left",
      hide: false,
       editable: false,
    },
   {
  headerName: "Custom Description",
  field: "Other_Description",
  minWidth: 250,
  flex: 1,
  align: "left",
  headerAlign: "left",
  editable: true,
},
 

  {
    field: "Action",
    headerName: "Action",
    type: "actions",
    minWidth: 150,
    width: 150,
    sortable: false,
    headerAlign: "center",
    filterable: false,
    disableColumnMenu: true,
    disableExport: true,
    align: "center",

    getActions: (params) => {
      const { id } = params;

      const isInEditMode =
        rowModesModel[id]?.mode === GridRowModes.Edit;

      // -------------------------------------------------------
      // ROW IS IN EDIT MODE
      // -------------------------------------------------------
      if (isInEditMode) {
        return [
          <GridActionsCellItem
            key={`save-${id}`}
            icon={<SaveIcon />}
            label="Save"
            onClick={handleSaveClick(id)}
            color="primary"
          />,

          <GridActionsCellItem
            key={`cancel-${id}`}
            icon={<CancelIcon />}
            label="Cancel"
            onClick={handleCancelClick(id)}
            color="inherit"
          />,
        ];
      }

      // -------------------------------------------------------
      // NORMAL VIEW MODE
      // -------------------------------------------------------
      return [
        <GridActionsCellItem
          key={`edit-${id}`}
          icon={<EditIcon />}
          label="Edit"
          onClick={handleEditClick(id)}
          disabled={isReadOnly}
          color="primary"
        />,

        <GridActionsCellItem
          key={`delete-${id}`}
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => {
            setItemToDelete(params.row.Item_Number);
            setIsRemoveItem1(true);
          }}
          disabled={isReadOnly}
          color="error"
        />,
        ];
     },
    //   renderCell: (param) => {
    //     return (
            
    //       <IconButton
    //         sx={{ height: 25, marginLeft: 2 }}
    //         variant="contained"
    //         color="error"
    //         size="small"
    //         onClick={() => {
    //           setItemToDelete(param.row.Item_Number);
    //           setIsRemoveItem1(true);
    //         }}
    //         disabled={
    //           params.mode === "delete" || params.mode === "view" ? true : false
    //         }
    //       >
    //         <DeleteIcon size="small" />
    //       </IconButton>
    //     );
    //   },

    },
  ];
  const [quickFilterText, setQuickFilterText] = useState("");

  // ============================================================= //
  // ================  PRINT COLUMN CONFIGURATION  ================ //
  // ============================================================= //
  // - "add" mode        -> starts empty/default (all switches OFF, default order)
  // - "edit"/"view" mode -> loads saved configuration for this price sheet
  // ============================================================= //

  const [printColumns, setPrintColumns] = useState(PRINT_COLUMN_DEFAULTS);

  // id of the column currently being dragged
  const [draggedColumnId, setDraggedColumnId] = useState(null);
  // ref mirrors draggedColumnId so the native drag handlers (which can run in
  // stale closures on some browsers) always read the latest value
  const draggedColumnIdRef = useRef(null);
  // which column is currently being dragged over (drop-target highlight)
  const [dragOverColumnId, setDragOverColumnId] = useState(null);

  const isReadOnly = params.mode === "delete" || params.mode === "view";

  // Builds the ordered/enabled payload to send on Save/Apply
  const getPrintColumnData = () => {
    return printColumns.reduce((result, column, index) => {
      result[column.id] = column.enabled ? 1 : 0;
      result[`${column.id}Sequence`] = index + 1; // sequence starts from 1
      return result;
    }, {});
  };

  // ---- load configuration based on mode ---- //
  useEffect(() => {
    if (params.mode === "add") {
      setPrintColumns(
        PRINT_COLUMN_DEFAULTS.map((column) => ({
          ...column,
        })),
      );
      return;
    }

    if (priceSheetPrintColumnData && priceSheetPrintColumnData.length > 0) {
      const orderedColumns = priceSheetPrintColumnData
        .map((column) => ({
          id: column.id,
          label: column.label,
          enabled: column.enabled === true,
          sequence: column.sequence,
        }))
        .sort((a, b) => a.sequence - b.sequence);

      setPrintColumns(orderedColumns);
    } else {
      setPrintColumns(
        PRINT_COLUMN_DEFAULTS.map((column) => ({
          ...column,
        })),
      );
    }
  }, [params.mode, priceSheetPrintColumnData]);

  // ---- drag handlers ---- //
  const handleDragStart = (event, id) => {
    if (isReadOnly) return;
    draggedColumnIdRef.current = id;
    setDraggedColumnId(id);
    event.dataTransfer.effectAllowed = "move";
    // Firefox requires data to be set for a drag to start at all
    event.dataTransfer.setData("text/plain", id);
  };

  const handleDragEnter = (event, id) => {
    if (isReadOnly) return;
    event.preventDefault();
    if (id !== dragOverColumnId) setDragOverColumnId(id);
  };

  const handleDragOver = (event) => {
    if (isReadOnly) return;
    // required: without preventDefault() here, onDrop never fires
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const reorderColumns = (sourceId, targetId) => {
    setPrintColumns((current) => {
      const sourceIndex = current.findIndex((c) => c.id === sourceId);
      const targetIndex = current.findIndex((c) => c.id === targetId);
      if (
        sourceIndex === -1 ||
        targetIndex === -1 ||
        sourceIndex === targetIndex
      ) {
        return current;
      }
      const updated = [...current];
      const [moved] = updated.splice(sourceIndex, 1);
      updated.splice(targetIndex, 0, moved);
      return updated;
    });
  };

  const handleSavePriceSheet = async (values, setSubmitting) => {
    try {
      setSubmitting(true);
      console.log(user, "-find user inside handleSavePriceSheet");
      if (params.mode === "delete") {
         priceSheetDeleteFn();
         return;
      }
      // ==========================================
      // 1. POST PRICE SHEET HEADER
      // ==========================================
      const headerPayload = {
        priceSheetID:
          params.mode === "add" ? 0 : priceSheetHeaderData.PriceSheetID || 0,

        priceSheetName: values.priceListDescription,

        printPriceList: values.printPriceList??false,
        printCategory: values.printCategory,

        printItemNo: values.printItemNo,
        printItemDesc: values.printItemDesc,
        printSpanishItemDesc: values.printSpanishItemDesc,
        printUOM: values.printUOM,
        printPackSize: values.printPackSize,
        printPrice: values.printPrice,

        companyID:
          params.mode === "add"
            ? state.companyRecordID
            : priceSheetHeaderData.CompanyID,

        createdBy:
          params.mode === "add"
            ? user.id.toString()
            :  user.id.toString()||priceSheetHeaderData.CreatedBy.toString() ,

        noOfItemPerRows: Number(values.pdfFormat) || 1,
      };

      console.log("PostPriceSheet payload:", headerPayload);

      const headerResponse = await dispatch(
        PostPriceSheet({
          priceSheetData: headerPayload,
        }),
      ).unwrap();

      console.log("PostPriceSheet response:", headerResponse);

      // ==========================================
      // GET PRICE SHEET ID
      // ==========================================
      const newPriceSheetID =
        headerResponse?.data?.PriceSheetID ??
        headerResponse?.data?.priceSheetID ??
        headerResponse?.PriceSheetID ??
        headerResponse?.priceSheetID ??
        values.priceListID;

      if (!newPriceSheetID) {
        throw new Error("Price Sheet ID was not returned from PostPriceSheet.");
      }
        setpriceSheetRecordID(newPriceSheetID);
      // ==========================================
      // 2. POST PRICE SHEET DETAIL
      // ==========================================
      const detailPayload = {
        userID: user.id || 0,

        priceSheetID: String(newPriceSheetID),

        printColumns: printColumns.map((column, index) => ({
          id: column.id,
          label: column.label,
          enabled: column.enabled === true,
          sequence: index + 1,
        })),

        pricesheetItems: localPriceSheetItems.map((item, index) => ({
          recordId: item.RecordId || item.recordId || 0,

          item_Number: item.Item_Number || "",

          priceSheetRecordID: Number(newPriceSheetID),

          item_Description: item.Item_Description || "",

          other_Description:
            item.Other_Description || item.Other_Description || "",

          sequence: index + 1,

          itemRecordID:
            item.ItemRecordID || item.RecordID || item.Item_RecordID || 0,
        })),
      };

      console.log("PostPriceSheetDetail payload:", detailPayload);

      const detailResponse = await dispatch(
        PostPriceSheetDetail({
          detailData: detailPayload,
        }),
      ).unwrap();

      console.log("PostPriceSheetDetail response:", detailResponse);

      // ==========================================
      // SUCCESS
      // ==========================================
      setPostError(false);

      setSuccessMessage(
        params.mode === "add"
          ? "Price Sheet added successfully"
          : "Price Sheet updated successfully",
      );

      setOpenAlert(true);
    } catch (error) {
      console.error("Error saving Price Sheet:", error);

      setPostError(
        error?.message || error?.message || "Error saving Price Sheet",
      );

      setOpenAlert(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDrop = (event, targetId) => {
    if (isReadOnly) return;
    event.preventDefault();
    event.stopPropagation();

    const sourceId =
      event.dataTransfer.getData("text/plain") || draggedColumnIdRef.current;

    if (sourceId && sourceId !== targetId) {
      reorderColumns(sourceId, targetId);
    }
    draggedColumnIdRef.current = null;
    setDraggedColumnId(null);
    setDragOverColumnId(null);
  };

  const handleDragEnd = () => {
    draggedColumnIdRef.current = null;
    setDraggedColumnId(null);
    setDragOverColumnId(null);
  };

  const handlePrintColumnToggle = (id, checked) => {
    setPrintColumns((current) =>
      current.map((column) =>
        column.id === id ? { ...column, enabled: checked } : column,
      ),
    );
  };

  // **********************  FUNCTION ********************** //

  const isPriceListIDExists = (e, setSubmitting) => {
    const inputValue = e.target.value.trim();
    const matchedItem = priceRows.find(
      (item) =>
        item.PriceSheetName.toLowerCase() == inputValue.toLowerCase(),
    );
    if (matchedItem) {
      navigate("/pages/control-panel/price-sheet/price-sheet-detail/edit", {
        state: {
          id: matchedItem.PriceSheetID,
          companyCode: state.companyCode,
          companyRecordID: state.companyRecordID,
        },
      });
      dispatch(getPriceSheetData({ id: matchedItem.PriceSheetID }));
    } else {
      setSubmitting(false);
    }
  };

  const priceListSaveFn = async (values, setSubmitting, isDerct = false) => {
    // NOTE: include getPrintColumnData() in the save payload here once the
    // save endpoint accepts print-column config, e.g. ...getPrintColumnData()
  };

  const ApplyFilter = async (values) => {
    const filterData = {
      FilterType: "AP",
      headerRecordID: priceSheetRecordID,
      companyID: state.companyRecordID,
      User: user.name,
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

    await dispatch(getPriceListFilterData(filterData));
    setIsOtherItem(true);
    setIsOtherDisabled(false);
    setIsFilterApplied(true);
  };

  const priceSheetDeleteFn = async (values, setSubmitting) => {
    try {
      dispatch(priceSheetDelete({ id: priceSheetHeaderData.PriceSheetID })).then(
        (response) => {
          if (response.payload.status === "Y") {
            setOpenAlert(true);
            setSuccessMessage(response.payload.message);
          } else {
            setOpenAlert(true);
            setPostError(response.payload.message);
          }
        },
      );
    } catch (e) {
      console.log("priceListSaveFn error:", e);
    }
  };

  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const combined = [...AdHocRows, ...priceSheetItemData];
  const itemCountMap = combined.reduce((map, item) => {
    const num = item.Item_Number;
    map[num] = (map[num] || 0) + 1;
    return map;
  }, {});
  const FILTERADHoc = [
    ...AdHocRows.filter((item) => itemCountMap[item.Item_Number] === 1),
    ...priceSheetItemData.filter(
      (item) => itemCountMap[item.Item_Number] === 1,
    ),
  ];

  useEffect(() => {
    if (params.mode !== "add" && state?.id) {
      dispatch(
        getPriceSheetData({
          id: state.id,
        }),
      );
    }
    else{
      dispatch(
        getPriceSheetData({
          id: 0
        }),
      );
    }
  }, [dispatch, params.mode, state?.id]);

  const [openAlert1, setOpenAlert1] = useState(false);
  const [postError1, setPostError1] = useState(null);
  const [openAlert2, setOpenAlert2] = useState(false);
  const [postError2, setPostError2] = useState(false);

  const clearFilter = async (setFieldValue) => {
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
  };

  const [isRemoveItem1, setIsRemoveItem1] = useState(false);
  const [isRemoveItem1ID, setIsRemoveItem1ID] = useState(0);
  const [openAlert11, setOpenAlert11] = useState(false);
  const [postError11, setPostError11] = useState(false);

  const itemDeleteFn = () => {
    setLocalPriceSheetItems((current) =>
      current.filter((item) => item.Item_Number !== itemToDelete),
    );

    setItemToDelete(null);
    setIsRemoveItem1(false);
  };

  return (
    <Container>
      {(params.mode === "add" ||
        (priceSheetStatus === "fulfilled" && !priceSheetError)) && (
        <Formik
          enableReinitialize={true}
          initialValues={{
            priceListID:
              params.mode === "add"
                ? ""
                : priceSheetHeaderData.PriceSheetID || "",

            priceListDescription:
              params.mode === "add"
                ? priceSheetHeaderData.PriceSheetName|| ""
                : priceSheetHeaderData.PriceSheetName || "",

            pdfFormat:
              params.mode === "add"
                ? "1"
                : priceSheetHeaderData.NoOfItemPerRows?.toString() || "1",

            printCategory:
              params.mode === "add"
                ? false
                : priceSheetHeaderData.PrintCategory === true,

            printPriceList:
              params.mode === "add"
                ? false
                : priceSheetHeaderData.PrintPriceList === true,

            printItemNo:
              params.mode === "add"
                ? false
                : priceSheetHeaderData.PrintItemNo === true,

            printItemDesc:
              params.mode === "add"
                ? false
                : priceSheetHeaderData.PrintItemDesc === true,

            printSpanishItemDesc:
              params.mode === "add"
                ? false
                : priceSheetHeaderData.PrintSpanishItemDesc === true,

            printUOM:
              params.mode === "add"
                ? false
                : priceSheetHeaderData.PrintUOM === true,

            printPackSize:
              params.mode === "add"
                ? false
                : priceSheetHeaderData.PrintPackSize === true,

            printPrice:
              params.mode === "add"
                ? false
                : priceSheetHeaderData.PrintPrice === true,
          }}
          onSubmit={(values, { setSubmitting }) => {
            handleSavePriceSheet(values, setSubmitting);
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
              {/* ********************** BREADCRUMB / HEADER ACTIONS ********************** */}
              <div className="breadcrumb">
                <Breadcrumb
                  routeSegments={[
                    { name: "Control Panel" },
                    {
                      name: "Price Sheet",
                      path: "/pages/control-panel/price-sheet",
                      state: {
                        id: priceListHeaderData.CompanyID,
                        code: priceListHeaderData.CompanyCode,
                      },
                    },
                    { name: `${params.mode} Price Sheet` },
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
                    disabled={isSubmitting || params.mode === "view"}
                    onClick={() => (submitActionRef.current = "save")}
                  >
                    {params.mode === "delete" ? "Confirm" : "Save"}
                  </Button>
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    startIcon={<ArrowBackIcon size="small" />}
                    onClick={() => {
                      navigate("/pages/control-panel/price-sheet", {
                        state:
                          params.mode === "add"
                            ? {
                                id: state.companyRecordID,
                                code: state.companyCode,
                              }
                            : {
                                id: priceListHeaderData.CompanyID,
                                code: priceListHeaderData.CompanyCode,
                              },
                      });
                    }}
                  >
                    Back
                  </Button>
                  {/* <IconButton onClick={handleOpen}>
                    <HelpOutlineIcon />
                  </IconButton> */}
                </Stack>
              </div>

              <Paper sx={{ width: "100%", mb: 1 }}>
                {/* ********************** TOP FIELD ROW (matches PriceListEdit header grid) ********************** */}
                <Box
                  display="grid"
                  gap="20px"
                  gridTemplateColumns="repeat(5, minmax(0, 1fr))"
                  sx={{
                    "& > div": {
                      gridColumn: isNonMobile ? undefined : "span 4",
                    },
                    padding: "10px",
                  }}
                >
                  <TextField
                    sx={{ gridColumn: "span 1" }}
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="priceListDescription"
                    name="priceListDescription"
                    label="Price Sheet"
                    value={values.priceListDescription}
                    autoComplete="off"
                    onChange={handleChange}
                    onBlur={(e) => isPriceListIDExists(e, setSubmitting)}
                    size="small"
                    disabled={
                      params.mode === "delete" || params.mode === "view"
                    }
                    required
                    InputLabelProps={{
                      sx: {
                        "& .MuiInputLabel-asterisk": {
                          color: "red",
                        },
                      },
                    }}
                  />
                  {/* PDF Format */}
                  <FormControl
                    sx={{ gridColumn: "span 1" }}
                    fullWidth
                    size="small"
                  >
                    <InputLabel id="pdf-format-label">PDF Format</InputLabel>

                    <Select
                      labelId="pdf-format-label"
                      id="pdfFormat"
                      name="pdfFormat"
                      value={values.pdfFormat}
                      label="PDF Format"
                      onChange={(e) =>
                        setFieldValue("pdfFormat", e.target.value)
                      }
                      disabled={
                        params.mode === "delete" || params.mode === "view"
                      }
                    >
                      <MenuItem value="1">1 item per row</MenuItem>
                      <MenuItem value="2">2 item per row</MenuItem>
                    </Select>
                  </FormControl>
                  <Stack
                    sx={{ gridColumn: "span 1" }}
                    direction="row"
                    alignItems="center"
                  >
                    <FormControlLabel
                      sx={{ margin: 0 }}
                      control={
                        <Checkbox
                          size="small"
                          checked={values.printCategory === true}
                          onChange={(e) =>
                            setFieldValue("printCategory", e.target.checked)
                          }
                          disabled={
                            params.mode === "delete" || params.mode === "view"
                          }
                        />
                      }
                      label="Print Category Name"
                    />
                  </Stack>

                  {/* <Stack
                    sx={{ gridColumn: "span 1" }}
                    direction="row"
                    alignItems="center"
                  >
                    <FormControlLabel
                      sx={{ margin: 0 }}
                      control={
                        <Checkbox
                          size="small"
                          checked={values.printPriceList === true}
                          onChange={(e) =>
                            setFieldValue("printPriceList", e.target.checked)
                          }
                          disabled={
                            params.mode === "delete" || params.mode === "view"
                          }
                        />
                      }
                      label="Print PriceList Name"
                    />
                  </Stack> */}
                </Box>

                {/* ********************** PRINT COLUMN CONFIG + ITEMS GRID (matches PriceListEdit Options/Grid layout) ********************** */}
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
                  {/* ============== PRINT COLUMN CONFIGURATION PANEL ============== */}
                  <Stack
                    sx={{ gridColumn: "span 1" }}
                    direction="column"
                    gap={1}
                  >
                    <Stack direction="row" gap={13} height={44}>
                      <Typography sx={{ marginLeft: 2 }} variant="h6">
                        Print Columns
                      </Typography>
                    </Stack>

                    <Box
                      sx={{
                        border: "1px solid #d0d0d0",
                        borderRadius: "3px",
                        backgroundColor: "#fff",
                        overflow: "hidden",
                        width: "100%",
                      }}
                    >
                      {/* HEADER */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          px: 1.5,
                          py: 1,
                          borderBottom: "1px solid #d0d0d0",
                          backgroundColor: "#999999",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "13px",
                            fontWeight: 600,
                            lineHeight: 1.3,
                            color: "#ffffff",
                          }}
                        >
                          Print Column Configuration
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "11px",
                            color: "#ffffff",
                            lineHeight: 1.2,
                            whiteSpace: "nowrap",
                          }}
                        >
                          Drag ☰ to reorder
                        </Typography>
                      </Box>

                      {/* PRINT COLUMNS */}
                      <Box>
                        {printColumns.map((column, index) => {
                          const isDragging = draggedColumnId === column.id;
                          const isDragOver =
                            dragOverColumnId === column.id && !isDragging;

                          return (
                            <Box
                              key={column.id}
                              draggable={!isReadOnly}
                              onDragStart={(event) =>
                                handleDragStart(event, column.id)
                              }
                              onDragEnter={(event) =>
                                handleDragEnter(event, column.id)
                              }
                              onDragOver={handleDragOver}
                              onDrop={(event) => handleDrop(event, column.id)}
                              onDragEnd={handleDragEnd}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                height: 42,
                                px: 1.2,
                                borderBottom: "1px solid #e5e5e5",
                                borderTop: isDragOver
                                  ? "2px solid #9e9e9e"
                                  : "2px solid transparent",
                                backgroundColor: isDragging
                                  ? "#f1f1f1"
                                  : "#fff",
                                opacity: isDragging ? 0.5 : 1,
                                cursor: isReadOnly ? "default" : "grab",
                                transition:
                                  "background-color 0.15s, border-top-color 0.1s",
                                "&:hover": {
                                  backgroundColor: isReadOnly
                                    ? "#fff"
                                    : "#f7f7f7",
                                },
                                "&:active": {
                                  cursor: isReadOnly ? "default" : "grabbing",
                                },
                              }}
                            >
                              {/* DRAG ICON */}
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: 22,
                                  color: "#999",
                                  mr: 0.5,
                                  pointerEvents: "none",
                                }}
                              >
                                <DragIndicatorIcon sx={{ fontSize: 18 }} />
                              </Box>

                              {/* COLUMN NAME */}
                              <Typography
                                sx={{
                                  flex: 1,
                                  fontSize: "13px",
                                  color: column.enabled ? "#333" : "#888",
                                  userSelect: "none",
                                  pointerEvents: "none",
                                }}
                              >
                                {column.label}
                              </Typography>

                              {/* ORDER NUMBER */}
                              <Box
                                sx={{
                                  width: 22,
                                  height: 22,
                                  minWidth: 22,
                                  borderRadius: "50%",
                                  backgroundColor: "#eeeeee",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "11px",
                                  color: "#777",
                                  mr: 1,
                                  pointerEvents: "none",
                                }}
                              >
                                {index + 1}
                              </Box>

                              {/* SWITCH */}
                              <Switch
                                size="small"
                                checked={column.enabled === true}
                                onChange={(event) =>
                                  handlePrintColumnToggle(
                                    column.id,
                                    event.target.checked,
                                  )
                                }
                                onDragStart={(e) => e.preventDefault()}
                                onMouseDown={(e) => e.stopPropagation()}
                                disabled={isReadOnly}
                                sx={{
                                  width: 38,
                                  height: 24,
                                  padding: 0,
                                  "& .MuiSwitch-switchBase": { padding: "3px" },
                                  "& .MuiSwitch-thumb": {
                                    width: 18,
                                    height: 18,
                                  },
                                  "& .MuiSwitch-track": {
                                    borderRadius: 12,
                                    opacity: 1,
                                  },
                                  "& .MuiSwitch-switchBase.Mui-checked": {
                                    color: "#fff",
                                  },
                                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                    { backgroundColor: "primary", opacity: 1 },
                                  "& .MuiSwitch-switchBase:not(.Mui-checked) + .MuiSwitch-track":
                                    { backgroundColor: "#b5b5b5", opacity: 1 },
                                }}
                              />
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>

                    {/* NOTE + APPLY BUTTON (matches PriceListEdit note/action row pattern) */}
                    <Box
                      sx={{
                        gap: 10,
                        display: "flex",
                        alignItems: "center",
                        padding: "5px",
                        border: "1px solid red",
                        borderRadius: 1,
                        backgroundColor: "#ffe6e6",
                        minHeight: 40,
                      }}
                    >
                      <Typography
                        color="error"
                        fontSize={"12px"}
                        align="center"
                      >
                        Only enabled fields print, in Price Book
                      </Typography>
                    </Box>

                    <Stack justifyContent="flex-end" direction={"row"} gap={4}>
                      {/* <Button
                        type="button"
                        variant="contained"
                        color="info"
                        size="small"
                        startIcon={<CheckIcon size="small" />}
                        onClick={() => {
                          // getPrintColumnData() returns e.g.
                          // { PrintItemNo: 1, PrintItemNoSequence: 1, ... }
                          // wire this into your save/apply dispatch as needed.
                          console.log(
                            "Print column config:",
                            getPrintColumnData(),
                          );
                        }}
                        disabled={isSubmitting || isReadOnly}
                      >
                        Apply
                      </Button> */}
                    </Stack>
                  </Stack>

                  {/* ============== ITEMS GRID (matches PriceListEdit DataGrid box) ============== */}
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
                      "& .MuiCheckbox-root": { color: "black !important" },
                      "& .MuiCheckbox-root.Mui-checked": {
                        color: "black !important",
                      },
                      "& .MuiDataGrid-row:nth-of-type(even)": {
                        backgroundColor: theme.palette.action.hover,
                      },
                      "& .MuiDataGrid-row:nth-of-type(odd)": {
                        backgroundColor: theme.palette.background.default,
                      },
                      "& .MuiDataGrid-row:hover": {
                        border: "3px solid #999999",
                        borderRadius: "4px",
                      },
                      "& .MuiTablePagination-root": {
                        color: "white !important",
                      },
                      "& .MuiTablePagination-root .MuiTypography-root": {
                        color: "white !important",
                      },
                      "& .MuiTablePagination-actions .MuiSvgIcon-root": {
                        color: "white !important",
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
                        mb: 2,
                      }}
                    >
                      <TextField
                        label="Search"
                        variant="standard"
                        size="small"
                        value={quickFilterText}
                        onChange={(e) => setQuickFilterText(e.target.value)}
                        sx={{ mb: 1, width: 300 }}
                      />
                      <OptimizedAdHocAutocomplete
                        errors={isItemExistsError}
                        helper={isItemExistsError && "please select an item!"}
                        disabled={isReadOnly}
                        name="adHocItem"
                        id="adHocItem"
                        value={addPriceListData}
                        onChange={(event, newValue) => {
                          setFieldValue("adHocItem", newValue);
                          setSubmitting(false);
                          setAddPriceListData(newValue);
                        }}
                        label="Item"
                        url={`${process.env.REACT_APP_BASE_URL}ItemMaster/GetItemMasterList?Type=C`}
                      />
                      <Button
                        variant="contained"
                        color="info"
                        sx={{ width: 300, height: 30 }}
                        onClick={() => {
                          if (
                            !addPriceListData ||
                            addPriceListData.length === 0
                          ) {
                            setIsItemExistsError(true);

                            setTimeout(() => {
                              setIsItemExistsError(false);
                            }, 2000);

                            return;
                          }

                          // Check against items already in the local grid
                          const duplicateExists = localPriceSheetItems.some(
                            (existingItem) =>
                              addPriceListData.some(
                                (newItem) =>
                                  existingItem.Item_Number ===
                                  newItem.Item_Number,
                              ),
                          );

                          if (duplicateExists) {
                            setIsItemExists(true);

                            setTimeout(() => {
                              setIsItemExists(false);
                            }, 3000);

                            return;
                          }

                          // Add selected items to local grid
                          const newItems = addPriceListData.map(
                            (item, index) => ({
                              RecordId: 0,
                              Item_Number: item.Item_Number,
                              Item_Description: item.Item_Description || "",
                            //   Custom_Description: item.Custom_Description || "",
                              Other_Description: item.Other_Description || "",
                              ItemRecordID:
                                item.ItemRecordID ||
                                item.RecordID ||
                                item.Item_RecordID ||
                                0,
                              PriceSheetRecordID: 0,
                              sequence: localPriceSheetItems.length + index + 1,
                              AdHocItem: "N",
                            }),
                          );

                          setLocalPriceSheetItems((current) => [
                            ...current,
                            ...newItems,
                          ]);

                          // Clear dropdown after adding
                          setAddPriceListData([]);
                        }}
                        size="small"
                        startIcon={<Add size="small" />}
                        disabled={isReadOnly}
                      >
                        {" "}
                        Item
                      </Button>
                    </Box>

                    {/* <DataGrid
                      columnHeaderHeight={dataGridHeaderFooterHeight}
                      rowHeight={dataGridRowHeight}
                      rows={localPriceSheetItems}
                      columns={columns}
                      loading={priceSheetLoading}
                      rowModesModel={rowModesModel}
                        componentsProps={{
                        toolbar: { localPriceSheetItems, setRowModesModel },
                      }}
  experimentalFeatures={{ newEditingApi: true }}
                      onRowModesModelChange={handleRowModesModelChange}
                      onRowEditStop={handleRowEditStop}
                      processRowUpdate={processRowUpdate}

                    //   disableSelectionOnClick
                     editMode="row"
                      disableRowSelectionOnClick
                      getRowId={(row) =>
                        row.RecordId || `${row.Item_Number}-${row.sequence}`
                      }
                      initialState={{
                        pagination: {
                          paginationModel: {
                            pageSize: dataGridPageSize,
                          },
                        },
                      }}
                      filterModel={{
                        items: [],
                        quickFilterValues: [quickFilterText],
                      }}
                      pageSizeOptions={dataGridpageSizeOptions}
                      disableColumnFilter
                      disableColumnSelector
                      disableDensitySelector
                    /> */}
                    <DataGrid
 columnHeaderHeight={dataGridHeaderFooterHeight}
  rowHeight={dataGridRowHeight}

  rows={localPriceSheetItems}
  columns={columns}

  loading={priceSheetLoading}

  // Row editing
  editMode="row"
  rowModesModel={rowModesModel}
  onRowModesModelChange={handleRowModesModelChange}
  onRowEditStop={handleRowEditStop}
  processRowUpdate={processRowUpdate}

  // Selection
  disableRowSelectionOnClick

  // Row ID
  getRowId={(row) =>
    row.RecordId || `${row.Item_Number}-${row.sequence}`
  }

  // Pagination
  initialState={{
    pagination: {
      paginationModel: {
        pageSize: dataGridPageSize,
      },
    },
  }}

  pageSizeOptions={dataGridpageSizeOptions}

  // Quick filter
  filterModel={{
    items: [],
    quickFilterValues: [quickFilterText],
  }}

  // Disable unwanted menus
  disableColumnFilter
  disableColumnSelector
  disableDensitySelector
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
                        minHeight: 30,
                        minWidth: 300,
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
                          "/pages/control-panel/price-sheet/price-sheet-detail/edit",
                          { state: { id: values.priceListID } },
                        );
                        dispatch(getPriceSheetData({ id: values.priceListID }));
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
                message={`Are you sure you want to delete Price Sheet ?`}
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
                        priceSheetDeleteFn();
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
                      onClick={() => setIsRemoveItem(false)}
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
                    ? `Oops! This item is already exists in price Sheet.`
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
        open={openErrorAlert}
        error={error1Msg}
        message={error1Msg}
        Actions={
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
          >
            <Button
              variant="contained"
              color="info"
              size="small"
              onClick={() => setOpenErrorAlert(false)}
              sx={{ mr: 1, height: 25 }}
            >
              Close
            </Button>
          </Box>
        }
      />

      <AlertDialog
        key={7846695}
        logo={`data:image/png;base64,${user.logo}`}
        open={openAlert11}
        error={postError11}
        message={
          postError11
            ? "Error while Deleting and please try again"
            : "Item deleted and Price Sheet saved successfully"
        }
        Actions={
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
          >
            <Button
              variant="contained"
              color="info"
              size="small"
              onClick={() => setOpenAlert11(false)}
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
                onClick={() => {setOpenAlert(false)
                  navigate(
                "/pages/control-panel/price-sheet/price-sheet-detail/edit",
                {
                  state: {
                    id: priceSheetRecordID,
                    companyCode: state.companyCode,
                    companyRecordID: state.companyRecordID,
                  },
                }
              );
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
                  // dispatch(getPriceSheetData({ id: 0 }));
                  // setOpenAlert(false);
                   navigate("/pages/control-panel/price-sheet", {
                        state: {
                          id: companyID,
                          code: companyID,
                        },
                      });
                }}
              >
                 Back To Price Sheet
              </Button>
            </Box>
          ) : (
            <Box
              sx={{ display: "flex", justifyContent: "center", width: "100%" }}
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
                      dispatch(getPriceSheetData({ id: priceSheetRecordID }));
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
                      navigate("/pages/control-panel/price-sheet", {
                        state: { id: companyID, code: companyID },
                      });
                      setOpenAlert(false);
                      setSuccessMessage(null);
                      setPostError(null);
                    }}
                  >
                    Back To Price Sheet
                  </Button>
                </>
              ) : (
                <Button
                  sx={{ mr: 1, height: 25 }}
                  variant="contained"
                  color="info"
                  size="small"
                  onClick={() => {
                    navigate("/pages/control-panel/price-sheet", {
                      state: {
                        id: state.companyRecordID,
                        code: state.companyCode,
                      },
                    });
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
        Actions={
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
          >
            <Button
              variant="contained"
              color="info"
              size="small"
              onClick={() => {
                setOpenAlert1(false);
                setTimeout(() => setPostError1(null), 1000);
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
        Actions={
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
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
              onClick={() => setIsRemoveItem1(false)}
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
            sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
          >
            <Button
              variant="contained"
              color="info"
              size="small"
              onClick={() => setOpenAlert2(false)}
              sx={{ mr: 1, height: 25 }}
            >
              Close
            </Button>
          </Box>
        }
      />

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Price Sheet Information</DialogTitle>
        <DialogContent dividers>
          <List>
            {infoItems.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="bold">
                        {item.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="textSecondary">
                        {item.description}
                      </Typography>
                    }
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

export default PriceSheetEdit;

const infoItems = [
  {
    title: "Save",
    description: `This button will save the entire page data, including Header Information,
      Print Column Configuration, Price Sheet Items, and Ad Hoc Items, to their respective tables.`,
  },
  {
    title: "Print Column Configuration",
    description: `Toggle which fields print on the price sheet and drag rows using the ☰ handle to
      reorder them. Only enabled fields print, in the order shown from top to bottom. Click Apply to
      preview the configuration.`,
  },
  {
    title: "Adhoc Item",
    description: `This button is used to add random items that are not part of any existing price sheet.
      If a selected item already exists in another price Sheet, it cannot be added as an ad hoc item.
      Only items not present in any existing price Sheet can be added.`,
  },
  {
    title: "Print Category / Print PriceList",
    description: `These checkboxes control whether the category grouping and price Sheet section are
      included when the price sheet is printed.`,
  },
  {
    title: "Adhoc Item Dropdown",
    description: `It is used to display a list of items from the ITEMS_ORG table.`,
  },
];
