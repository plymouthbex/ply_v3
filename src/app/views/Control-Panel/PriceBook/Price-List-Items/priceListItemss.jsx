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
  dataGridHeaderFooterHeight,
} from "app/utils/constant";
import { Formik } from "formik";
import lodash from "lodash";
import { FormikCustomAutocomplete } from "app/components/AutoComplete";
import {
  clearPriceListState,
  clreatFilterAndItems,
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
  PostAdHocItem,
  priceListClearFilter,
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
  console.log("🚀 ~ PriceListEdit ~ state:", state);

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
  console.log("🚀 ~ PriceListEdit ~ priceListFilterData:", priceListFilterData);
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

  const addItemsSet = new Set(addedRows.map((item) => item.Item_Number));

  const filteredSelectedItems = selectedRows.filter(
    (selectedItem) => !addItemsSet.has(selectedItem.Item_Number)
  );
  console.log(
    "🚀 ~ PriceListEdit ~ filteredSelectedItems:",
    filteredSelectedItems
  );

  const allSelAddItems = [...filteredSelectedItems, ...addedRows].map(
    (item) => {
      return { ...item, Item_Number: `@${item.Item_Number}`, showAction: true };
    }
  );
  console.log("🚀 ~ PriceListEdit ~ allSelAddItems:", allSelAddItems);
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
      headerName: "Attributes",
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
            <Button
              sx={{ height: 25 }}
              variant="contained"
              color="secondary"
              size="small"
              // onClick={() => handleRowClick(params)}
              onClick={() =>
                navigate("/pages/control-panel/configure-price-book/price-list-items/configure-items/edit", {
                  state: {
                    id: state.id,
                    itemNumber: param.row.Item_Number,
                    itemDesc: param.row.Item_Description,
                    priceListID: priceListHeaderData.PriceListID,
                    priceListDesc: priceListHeaderData.PricelistDesc,
                  },
                })
              }
              startIcon={<ModeEditOutlineIcon size="small" />}
              disabled={
                params.mode === "delete" || params.mode === "view"
                  ? true
                  : false
              }
            >
              Edit
            </Button>
            {showGridData === 3 ? (
              <Button
                sx={{ height: 25, marginLeft: 2 }}
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => {
                  // setRemoveItemID(param.row.Item_Number);
                  // setRemoveItemDesc(param.row.Item_Description);
                  // setIsRemoveItem(true);
                  navigate("/pages/control-panel/configure-price-book/price-list-items/configure-items/delete", {
                    state: {
                      id: state.id,
                      itemNumber: param.row.Item_Number,
                      itemDesc: param.row.Item_Description,
                      priceListID: priceListHeaderData.PriceListID,
                      priceListDesc: priceListHeaderData.PricelistDesc,
                    },
                  });
                }}
                startIcon={<DeleteIcon size="small" />}
                disabled={
                  params.mode === "delete" || params.mode === "view"
                    ? true
                    : false
                }
              >
                Delete
              </Button>
            ) : showGridData === 0 && param.row.showAction ? (
              <Button
                sx={{ height: 25, marginLeft: 2 }}
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => {
                  // setRemoveItemID(param.row.Item_Number);
                  // setRemoveItemDesc(param.row.Item_Description);
                  // setIsRemoveItem(true);

                  navigate("./pages/control-panel/configure-price-book/price-list-items/configure-items/delete", {
                    state: {
                      id: state.id,
                      itemNumber: param.row.Item_Number,
                      itemDesc: param.row.Item_Description,
                      priceListID: priceListHeaderData.PriceListID,
                      priceListDesc: priceListHeaderData.PricelistDesc,
                    },
                  });
                }}
                startIcon={<DeleteIcon size="small" />}
                disabled={
                  params.mode === "delete" || params.mode === "view"
                    ? true
                    : false
                }
              >
                Delete
              </Button>
            ) : (
              false
            )}
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
  const priceListSaveFn = async (values, setSubmitting,isDerct = false) => {
    const filterData = {
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
    };
    try {
      dispatch(
        priceListHeaderPost({
          data: {
            recordId: priceListHeaderData.RecordId,
            priceListID: values.priceListID,
            pricelistDesc: values.priceListDescription,
            buyer: JSON.stringify(values.buyer),
            createdBy: values.createdBy,
            companyCode: state.company.Code,
            forcePageBreak: values.forcePageBreak ? "Y" : "N",
            overridesequence: values.overrideSeq ? "Y" : "N",
            customer: JSON.stringify(values.propCustomer),
            comments: values.comments,
            createdDate: values.createdDateTime,
            modifyDate: values.lastModifiedDateTime,
            modifyUser: user.name,
          },
        })
      ).then((response) => {
        if (response.payload.status === "Y") {
          // dispatch(
          //   priceListItemPost({
          //     data: [...filteredSelectedItems, ...addedRows],
          //     priceListID: response.payload.PriceListID,
          //   })
          // );

          if(params.mode === "add"){
            dispatch(priceListConditionsPost({ data: filterData }));
            setOpenAlert(true);
          }

        } else {
          if(params.mode === "add"){
            setOpenAlert(true);
            setPostError(true);
          }
        
        }
      });
      setSubmitting(false);
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
          } else {
            setOpenAlert(true);
            setPostError(true);
          }
        }
      );
      // setSubmitting(false);
    } catch (e) {
      console.log("🚀 ~ priceListSaveFn ~ e:", e);
    }
  };

  const getFilteredData = async (values) => {
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
    };

    try {
      dispatch(getPriceListFilterData(filterData));
      priceListSaveFn(values)
    } catch (e) {
      console.log("🚀 ~ priceListSaveFn ~ e:", e);
    }
  };

  // ********************** USE EFFECT - PRICE LIST GET FUNCTION ********************** //
  useEffect(() => {
    // if (getStatus === "idle") {
    dispatch(getPriceListData({ id: state.id }));
    // }
    if (params.mode === "edit" || params.mode === "view") {
      setShowGridData(0);
    } else setShowGridData(0);
  }, [state.id]);

  const [openAlert1, setOpenAlert1] = useState(false);
  const [postError1, setPostError1] = useState(false);
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
        {/* {showGridData === 3  && (
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
              helper={isItemExistsError && "please select item!"}
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
              url={`${process.env.REACT_APP_BASE_URL}ItemMaster/GetItemMasterList`}
            />

            {state.id ?<Button
              variant="contained"
              color="info"
              size="small"
              onClick={async () => {
                if (addPriceListData) {
                  const isItem = [...selectedRows, ...addedRows].some((item) =>
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
                        priceListID: priceListHeaderData.PriceListID,
                        quotationRecordID: "0",
                        filterType: "PL",
                        itemNo: addPriceListData.Item_Number,
                        itemDescription: addPriceListData.Item_Description,
                      },
                    })
                  );
                  if (response.payload.status === "Y") {
                    setOpenAlert1(true);
                    dispatch(
                      priceListAddedItems({
                        ...addPriceListData,
                        AdHocItem: "Y",
                      })
                    );
                    setAddPriceListData(null);
                  } else {
                    setOpenAlert1(true);
                    setPostError1(true);
                  }
                } else {
                  console.log(
                    "🚀 ~ file: PriceListEdit.jsx ~ line 442 ~ CustomToolbar ~ addPriceListData",
                    addPriceListData
                  );

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
            </Button>:<Button
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
            </Button>}
          </Box>
        )} */}
      </GridToolbarContainer>
    );
  }

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
      dispatch(clreatFilterAndItems())
      setOpenAlert2(true);
    } else {
      setOpenAlert2(true);
      setPostError2(true);
    }
  };
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
            overrideSeq:
              priceListHeaderData.Overridesequence === "Y" ? true : false,
            propCustomer: JSON.parse(priceListHeaderData.Customer),
            createdDateTime: priceListHeaderData.CreatedDate,
            lastModifiedDateTime: priceListHeaderData.ModifyDate,
            createdBy:
              params.mode === "add" ? user.name : priceListHeaderData.CreatedBy,
            comments: priceListHeaderData.Comments,
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
          }}
          enableReinitialize={true}
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
            <form onSubmit={handleSubmit}>
              <div className="breadcrumb">
                <Breadcrumb
                  routeSegments={[
                    { name: "Configure Price Book" },
                    {
                      name: "Company",
                      path: "/pages/control-panel/configure-price-book/company",
                    },
                    { name: `${params.mode} Configure Price Book` },
                  ]}
                />
                <Stack direction={"row"} gap={1}>
                
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    startIcon={<ArrowBackIcon size="small" />}
                    onClick={() => {
                      navigate(-1);
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
                  gridTemplateColumns="repeat(3, minmax(0, 1fr))"
                  sx={{
                    "& > div": {
                      gridColumn: isNonMobileSec ? undefined : "span 4",
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
                     columnHeaderHeight={dataGridHeaderFooterHeight}
                     sx={{
                       // This is to override the default height of the footer row
                       '& .MuiDataGrid-footerContainer': {
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
                          ? [...priceListItemsData, ...allSelAddItems]
                          : showGridData === 1
                            ? priceListItemsData
                            : [...filteredSelectedItems, ...addedRows]
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

              <MessageAlertDialog
                open={isPriceListOpen}
                tittle={values.priceListID}
                message={"Oops! This Price List ID is already in use."}
                Actions={
                  <DialogActions>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => {
                        navigate("/pages/price-list/price-list-detail/edit", {
                          state: { id: values.priceListID },
                        });
                        dispatch(getPriceListData({ id: values.priceListID }));
                        SetIsPriceListOpen(false);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => {
                        setFieldValue("priceListID", "");
                        SetIsPriceListOpen(false);
                      }}
                      autoFocus
                    >
                      Try Another
                    </Button>
                  </DialogActions>
                }
              />

              <MessageAlertDialog
                open={isDelete}
                tittle={values.priceListID}
                message={`Are you sure you want to delete Price List ?`}
                Actions={
                  <DialogActions>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => {
                        setIsDelete(false);
                        priceListDeleteFn();
                      }}
                    >
                      Yes
                    </Button>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => {
                        setIsDelete(false);
                        setSubmitting(false);
                      }}
                      autoFocus
                    >
                      No
                    </Button>
                  </DialogActions>
                }
              />
              <MessageAlertDialog
                open={isRemoveItem}
                tittle={""}
                message={`Are you sure you want to Clear filter and Item ?`}
                Actions={
                  <DialogActions>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => {
                        // dispatch(
                        //   priceListDeletedItem({
                        //     Item_Number: removeItemID,
                        //     priceListAddedData: addedRows,
                        //     priceListSelectedData: selectedRows,
                        //   })
                        // );
                        clearFilter(setFieldValue);
                        setIsRemoveItem(false);
                        // setRemoveItemID("");
                        // setRemoveItemDesc("");
                      }}
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
                    >
                      No
                    </Button>
                  </DialogActions>
                }
              />
              <MessageAlertDialog
                open={isItemExists}
                tittle={
                  addPriceListData
                    ? addPriceListData.Item_Description
                    : "Please select item!"
                }
                message={
                  addPriceListData
                    ? "Oops! This item is already exists in price list."
                    : ""
                }
                Actions={
                  <DialogActions>
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
                  </DialogActions>
                }
              />
            </form>
          )}
        </Formik>
      )}
      <AlertDialog
        open={openAlert}
        error={postError}
        message={
          params.mode === "add"
            ? "Price List added successfully"
            : params.mode === "delete"
              ? "Pricel List deleted successfully"
              : "Price List updated successfully"
        }
        Actions={
          params.mode === "add" ? (
            <DialogActions>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  navigate("/pages/price-list", {
                    state: { ID: state.company.ID },
                  });
                  dispatch(clearPriceListState());
                  setOpenAlert(false);
                }}
              >
                Back To Price List
              </Button>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  dispatch(getPriceListData({ id: 0 }));
                  setOpenAlert(false);
                  dispatch(clearPriceListState());
                }}
                autoFocus
              >
                Add New Price List
              </Button>
            </DialogActions>
          ) : (
            <DialogActions>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  navigate("/pages/price-list", {
                    state: { ID: state.company.ID },
                  });
                  dispatch(clearPriceListState());
                  setOpenAlert(false);
                }}
              >
                Back To Price List
              </Button>
            </DialogActions>
          )
        }
      />
      <AlertDialog
        key={23131}
        open={openAlert1}
        error={postError1}
        message={
          postError1 ? "Somthing Went Wrong" : "AddHoc Item Added Successfully!"
        }
        Actions={
          <DialogActions>
            <Button
              variant="contained"
              color="info"
              size="small"
              onClick={() => {
                setOpenAlert1(false);
              }}
            >
              Close
            </Button>
          </DialogActions>
        }
      />

      <AlertDialog
        key={27841}
        open={openAlert2}
        error={postError2}
        message={
          postError1
            ? "Somthing Went Wrong"
            : "Filters And Items Cleared Successfully!"
        }
        Actions={
          <DialogActions>
            <Button
              variant="contained"
              color="info"
              size="small"
              onClick={() => {
                setOpenAlert2(false);
              }}
            >
              Close
            </Button>
          </DialogActions>
        }
      />
      
      {/* {getLoading &&<Box sx={{display:'flex',flexGrow:1}}> <Loading/></Box>} */}
    </Container>
  );
};

export default PriceListEdit;
