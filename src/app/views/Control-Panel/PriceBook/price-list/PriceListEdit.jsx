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
  IconButton,
  Tooltip,
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
  clearPriceListState,
  clreatFilterAndItems,
  getPriceListData,
  getPriceListData2,
  getPriceListFilterData,
  onCheckboxChangePriceListEdit,
  priceListAddedItems,
  priceListDeletedItem,
} from "app/redux/slice/getSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  FormikOptimizedAutocomplete,
  OptimizedAutocomplete,
  PrintGroupOptimizedAutocomplete,
  PrintGroupOptimizedAutocompletePriceList,
} from "app/components/SingleAutocompletelist";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  DeleteAdHocItem,
  PostAdHocItem,
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
  //======================= ADD PRICE LIST ===================================//
  const [addPriceListData, setAddPriceListData] = useState(null);
  const handleSelectionAddPriceListData = (newValue) => {
    setAddPriceListData(newValue);
  };

  // ********************** REDUX STATE ********************** //
  const priceRows = useSelector((state) => state.listview.priceListViewData);
  const selectedRows = useSelector(
    (state) => state.getSlice.priceListSelectedData
  );
  const addedRows = useSelector((state) => state.getSlice.priceListAddedData);
  const priceListHeaderData = useSelector(
    (state) => state.getSlice.priceListHeaderData
  );
  const priceListFilterData = useSelector(
    (state) => state.getSlice.priceListFilterData
  );
  const priceListItemsData = useSelector(
    (state) => state.getSlice.priceListItemsData
  );
  const priceListItemLoading = useSelector(
    (state) => state.getSlice.priceListItemLoading
  );
  const getStatus = useSelector((state) => state.getSlice.priceListStatus);
  const getLoading = useSelector((state) => state.getSlice.priceListLoading);
  const getMessage = useSelector((state) => state.getSlice.priceListMessage);
  const getError = useSelector((state) => state.getSlice.priceListError);

  // ********************** COLUMN AND ROWS ********************** //
  const columns = [
    {
      headerName: "Price List ID",
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
              checked={param.row.PrintItem}
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
            />
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

  // **********************  FUNCTION ********************** //

  const isPriceListIDExists = (e, setSubmitting) => {
    const inputValue = e.target.value.trim();
    const isPriceListID = priceRows.some(
      (item) => item.PRICELISTID === inputValue
    );
    if (isPriceListID) {
      SetIsPriceListOpen(true);
    } else {
      setSubmitting(false);
    }
  };

  const priceListSaveFn = async (values, setSubmitting, isDerct = false) => {
    setIsOtherItem(true);
    setIsOtherDisabled(false);
    const filterData = {
      filterType: "PL",
      headerRecordID: "",
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
      dispatch(
        priceListHeaderPost({
          data: {
            recordId: priceListHeaderData.RecordId,
            priceListID: values.priceListID,
            pricelistDesc: values.priceListDescription,
            buyer: values.buyer ? JSON.stringify(values.buyer) : null,
            createdBy: values.createdBy,
            companyCode: state.companyCode,
            PrintGroupName: values.catName ? values.catName.GroupName : "",
            PrintGroupRecordID: values.catName ? values.catName.RecordID : 0,
            forcePageBreak: "N",
            overridesequence: values.overrideSeq,
            customer: values.propCustomer
              ? JSON.stringify(values.propCustomer)
              : null,
            comments: values.comments,
            createdDate: values.createdDateTime,
            modifyDate: values.lastModifiedDateTime,
            modifyUser: user.name,
          },
        })
      ).then(async (response) => {
        if (response.payload.status === "Y") {
          const res = await dispatch(getPriceListFilterData(filterData));
          setOpenAlert(true);
          setSuccessMessage(res.payload.message);
          if (params.mode === "add") {
            navigate("/pages/control-panel/price-list/price-list-detail/edit", {
              state: {
                id: response.payload.PriceListID,
                companyCode: state.companyCode,
              },
            });
            // setTimeout(() => {
            //   setOpenAlert(false);
            // }, 5000);
          }
        } else {
          // if (params.mode === "add") {
          setOpenAlert(true);
          setPostError(response.payload.message);
          // setTimeout(() => {
          //   setOpenAlert(false);
          // }, 2000);
          // }
        }
      });
    } catch (e) {
      console.log("🚀 ~ priceListSaveFn ~ e:", e);
    }
  };

  const getOtherItems = async (values, type) => {
    const filterData = {
      filterType: type,
      headerRecordID: "",
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

  // ********************** USE EFFECT - PRICE LIST GET FUNCTION ********************** //
  useEffect(() => {
    dispatch(getPriceListData({ id: state.id }));

    // if (params.mode === "edit" || params.mode === "view" || params.mode === "delete") {
    //   setShowGridData(0);
    // } else setShowGridData(3);
  }, [loaction.key]);

  const [openAlert1, setOpenAlert1] = useState(false);
  const [postError1, setPostError1] = useState(null);

  const [openAlert2, setOpenAlert2] = useState(false);
  const [postError2, setPostError2] = useState(false);
  const clearFilter = async (setFieldValue) => {
    const data = {
      QuotationRecordId: 0,
      PriceListID: priceListHeaderData.PriceListID,
      Type: "PL",
    };
    const response = await dispatch(priceListClearFilter({ data }));
    if (response.payload.status === "Y") {
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
      setOpenAlert2(true);
    } else {
      setOpenAlert2(true);
      setPostError2(true);
    }
  };

  const [isRemoveItem1, setIsRemoveItem1] = useState(false);
  const [isRemoveItem1ID, setIsRemoveItem1ID] = useState(0);
  const [openAlert11, setOpenAlert11] = useState(false);
  const [postError11, setPostError11] = useState(false);

  const itemDeleteFn = async (values) => {
    const data = {
      RecordID: isRemoveItem1ID,
      priceListID: `${priceListHeaderData.PriceListID}`,
      quotationRecordID: "0",
      filterType: "PL",
      itemNo: "",
      printSequence: "",
      printItem: "0",
      comment: "",
    };
    const response = await dispatch(DeleteAdHocItem({ data }));
    if (response.payload.status === "Y") {
      dispatch(getPriceListData2({ id: priceListHeaderData.PriceListID }));
      setOpenAlert11(true);
      setIsRemoveItem1ID(0);
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
          <TextField
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
          </TextField>
        </Box>
        {showGridData === 3 && (
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
            <OptimizedAutocomplete
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
              label="Ad Hoc Item"
              url={`${process.env.REACT_APP_BASE_URL}ItemMaster/GetItemMasterList?Type=C`}
            />

            {state.id ? (
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={async () => {
                  if (addPriceListData) {
                    const isItem = [...priceListItemsData, ...addedRows].some(
                      (item) =>
                        lodash.isEqual(
                          item.Item_Number,
                          addPriceListData.Item_Number
                        )
                    );
                    if (isItem) {
                      setIsItemExists(true);
                      setTimeout(() => {
                        setIsItemExists(false);
                        setAddPriceListData(null);
                      }, 5000);
                      return;
                    }

                    const response = await dispatch(
                      PostAdHocItem({
                        idata: {
                          PriceListID: priceListHeaderData.PriceListID,
                          QuotationRecordID: "0",
                          FilterType: "PL",
                          ItemNo: addPriceListData.Item_Number,
                          ItemDescription: addPriceListData.Item_Description,
                        },
                      })
                    );
                    if (response.payload.status === "Y") {
                      setPostError1(null);
                      setOpenAlert1(true);
                      dispatch(
                        getPriceListData2({
                          id: priceListHeaderData.PriceListID,
                        })
                      );
                      setAddPriceListData(null);
                    } else {
                      setOpenAlert1(true);
                      setPostError1(response.payload.message);
                    }
                  } else {
                    setIsItemExistsError(true);
                    setTimeout(() => {
                      setIsItemExistsError(false);
                    }, 2000);
                  }
                }}
                startIcon={<Add size="small" />}
                disabled={
                  params.mode === "delete" || params.mode === "view"
                    ? true
                    : false
                }
              >
                Ad Hoc Item
              </Button>
            ) : (
              <Button
                variant="contained"
                color="info"
                size="small"
                type="submit"
                startIcon={<Add size="small" />}
                disabled={
                  params.mode === "delete" || params.mode === "view"
                    ? true
                    : false
                }
              >
                Ad Hoc Item
              </Button>
            )}
          </Box>
        )}
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
                  "At least one filter must have selected filter";
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
              if (params.mode === "delete") {
                setIsDelete(true);
              }
              if (params.mode === "add" || params.mode === "edit") {
                priceListSaveFn(values, setSubmitting);
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
                  {params.mode == "delete" && (
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
                  )}
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
                  <TextField
                    sx={{ gridColumn: "span 1" }}
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="priceListID"
                    name="priceListID"
                    label="Price List Name"
                    value={values.priceListID}
                    onFocus={() => setSubmitting(true)}
                    onChange={handleChange}
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
                  />
                  <TextField
                    sx={{ gridColumn: "span 1" }}
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="priceListDescription"
                    name="priceListDescription"
                    label="Price List Description"
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
                    url={`${process.env.REACT_APP_BASE_URL}PrintGroup/PrintGroupList?CompanyCode=${state.companyCode}`}
                  />
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
                        <Button
                          variant="contained"
                          color="info"
                          size="small"
                          // startIcon={<Add size="small" />}
                          onClick={() => {
                            getOtherItems(
                              values,
                              isShowOtherItem ? "OT" : "PL"
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
                          params.mode === "view"
                        }
                        type="submit"
                      >
                        Apply Filters & Save
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
                      height: 440,
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
                      slots={{
                        loadingOverlay: LinearProgress,
                        toolbar: CustomToolbar,
                      }}
                      rowHeight={dataGridRowHeight}
                      rows={
                        showGridData === 0
                          ? priceListItemsData
                          : showGridData === 1
                          ? priceListItemsData.filter(
                              (f) => f.AdHocItem === "N"
                            )
                          : priceListItemsData.filter(
                              (f) => f.AdHocItem === "Y"
                            )
                      }
                      columns={columns}
                      loading={priceListItemLoading}
                      disableSelectionOnClick
                      disableRowSelectionOnClick
                      getRowId={(row) => row.Item_Number}
                      initialState={{
                        pagination: {
                          paginationModel: { pageSize: dataGridPageSize },
                        },
                      }}
                      pageSizeOptions={dataGridpageSizeOptions}
                      columnVisibilityModel={{
                        print: isShowOtherItem,
                        AdHocItem: isShowOtherItem,
                        Action: isShowOtherItem,
                        OtherItemPriceListID: !isShowOtherItem,
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
                        minHeight: 40, // Ensure consistent heigh
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
                        setAddPriceListData(null);
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
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              {params.mode != "delete" && (
                <Button
                  sx={{ mr: 1, height: 25 }}
                  variant="contained"
                  color="info"
                  size="small"
                  onClick={() => {
                    setSuccessMessage(null);
                    setPostError(null);
                    setOpenAlert(false);
                  }}
                >
                  Close
                </Button>
              )}
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
    </Container>
  );
};

export default PriceListEdit;
