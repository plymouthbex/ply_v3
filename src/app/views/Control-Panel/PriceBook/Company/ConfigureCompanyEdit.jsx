import React, { useEffect, useState } from "react";
import {
  Paper,
  Button,
  Box,
  styled,
  useTheme,
  useMediaQuery,
  TextField,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  Typography,
  Stack,
  LinearProgress,
  Input,
  DialogActions,
  // Tooltip,
  IconButton,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { Breadcrumb } from "app/components";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import {
  dataGridHeight,
  dataGridHeightC,
  dataGridRowHeight,
  dataGridHeaderFooterHeight,
  dataGridPageSize,
  dataGridpageSizeOptions,
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
import { useDropzone } from "react-dropzone";
import Publish from "@mui/icons-material/Publish";
import Cover from "../../../../../assets/plylogo.png";
import { FlexAlignCenter, FlexBox } from "app/components/FlexBox";
import { convertHexToRGB } from "app/utils/constant";
import { FormikCustomSelectCompanyPriceLevel, PGOptimizedAutocomplete } from "app/components/SingleAutocompletelist";
import { useDispatch, useSelector } from "react-redux";
import {
  configureAddedPriceList,
  configurePriceListDeleted,
  getConfigPriceBook,
  getConfigPriceBook2,
} from "app/redux/slice/getSlice";
import lodash from "lodash";
import AlertDialog, { MessageAlertDialog } from "app/components/AlertDialog";
import {
  ConfigurepriceListClear,
  postConfigureCompany,
  PostConfigurePriceListID,
} from "app/redux/slice/postSlice";
import toast from "react-hot-toast";
import useAuth from "app/hooks/useAuth";
import {
  CompanyPriceListAutoComplete,
  CompanyPriceListAutoCompleteMemo,
} from "app/components/FormikAutocomplete";
import { useMemo } from "react";
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

// ******************** Validation Schema ******************** //
const validationSchema = Yup.object({
  code: Yup.string()
    .min(3, "Code must be at least 3 characters")
    .max(15, "Code must be at most 15 characters"),

  sortOrder: Yup.string()
    .min(1, "Sort Order must be at least 1 character")
    .max(15, "Sort Order must be at most 15 characters"),

  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters"),

  isActive: Yup.boolean(),

  includePDF: Yup.boolean(),

  includeExcel: Yup.boolean(),
});

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
    theme.palette.text.primary
  )}, 0.3)`,
  "&:hover": {
    background: `rgb(${convertHexToRGB(
      theme.palette.text.primary
    )}, 0.2) !important`,
  },
  background: isDragActive ? "rgb(0, 0, 0, 0.15)" : "rgb(0, 0, 0, 0.01)",
}));

// ******************** Price List Edit SCREEN  ******************** //
const ConfigureCompanyEdit = () => {
  // ******************** HOOKS AND CONSTANTS ******************** //
  const { user } = useAuth();
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const State = location.state;

  const dispatch = useDispatch();
  // ******************** REDUX_STATE ******************** //
  const data = useSelector((state) => state.getSlice.getconfigureData);
  const getRows = useSelector(
    (state) => state.getSlice.configurePriceListGetData
  );

  const loading = useSelector((state) => state.getSlice.getconfigureLoading);
  const status = useSelector((state) => state.getSlice.getconfigureStatus);
  const error = useSelector((state) => state.getSlice.getconfigureError);

  useEffect(() => {
    dispatch(getConfigPriceBook({ ID: State.RecordID }));
  }, [dispatch]);
  // ******************** USE-State ******************** //
  const [addPriceListData, setAddPriceListData] = useState([]);
  const handleSelectionAddPriceListData = (e, newValue) => {
    setAddPriceListData(newValue);
  };

  const [isPriceListExists, setIsPriceListExists] = useState(false);
  const [isPriceListExistsError, setIsPriceListExistsError] = useState(false);
  const [isRemovePriceList, setIsRemovePriceList] = useState(false);
  const [removePriceListdDesc, setremovePriceListDesc] = useState("");
  const [postError, setPostError] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [removePriceListID, setremovePriceListID] = useState(0);
  // ********************** COLUMN ********************** //
  const columns = [
    {
      headerName: "RecordID",
      field: "RecordID",
      width: "170",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Name",
      field: "PRICELISTID",
      width: "170",
      align: "left",
      headerAlign: "left",
      hide: true,
    },
    {
      headerName: "Price List",
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
          <div>
            <Box gap={1}>
              <div style={{ display: "flex", gap: "10px" }}>
                {/* <Tooltip title="Exclude Price List"> */}
                  <IconButton
                    color="black"
                    size="small"
                    onClick={() => {
                      setremovePriceListID(param.row.RecordID);
                      setremovePriceListDesc(param.row.PRICELISTDESCRIPTION);
                      setIsRemovePriceList(true);
                    }}
                  >
                    <DeleteIcon color="error" fontSize="small" />
                  </IconButton>
                {/* </Tooltip> */}
              </div>
            </Box>
          </div>
        );
      },
    },
  ];
  const handleAddPriceList = async () => {
    if (addPriceListData.length > 0) {
      // Prepare price data and dispatch the action
      const pricedata = {
        RecordID: data.RecordID,
        priceListID: addPriceListData.RecordID,
      };

      const response = await dispatch(
        PostConfigurePriceListID({
          pricedata: addPriceListData,
          RecordID: data.RecordID,
        })
      );

      if (response.payload.status === "Y") {
        // dispatch(configureAddedPriceList);
        dispatch(getConfigPriceBook2({ ID: State.RecordID }));
        setAddPriceListData([]);
      }
    } else {
      // Handle case where no price list data is selected
      setIsPriceListExistsError(true);
      setTimeout(() => {
        setIsPriceListExistsError(false);
      }, 2000);
    }
  };
  const CustomToolBar = () => {
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
          <Typography>Total Item Count: {data.PriceListItemCount}</Typography>
          <GridToolbarQuickFilter />

          {/* <CompanyPriceListAutoCompleteMemo
            errors={isPriceListExistsError}
            helper={isPriceListExistsError && "Please select price list!"}
            disabled={params.mode === "delete" || params.mode === "view"}
            name="addPriceList"
            id="addPriceList"
            value={addPriceListData}
            onChange={handleSelectionAddPriceListData}
            label="Include Price List"
            url={`${
              process.env.REACT_APP_BASE_URL
            }PriceListItems/GetPrictListList?CompanyCode=${data.CompanyCode}`}
          />
          // <Tooltip title="Add">
            <IconButton
              disabled={params.mode === "delete" || params.mode === "view"}
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
          // </Tooltip> */}
        </Box>
      </GridToolbarContainer>
    );
  };

  const handleSave = async (values) => {
    const Cdata = {
      recordID: data.RecordID,
      classification: data.Classification,
      companyID: data.CompanyID,
      companyCode: data.CompanyCode,
      fullPriceBookPdf: "0",
      fullPriceBookExcel: "0",
      disable: "0",
      fullPriceBookTitle: values.name,
      priceLevel: values.priceBookLevels?.PriceLevel??data.PriceLevel,
      BrokenItem: values.brokenItems,
      DamageItem: values.damagedItems,
      DisplayEmail: values.displayEmail,
    };
    const response = await dispatch(postConfigureCompany({ Cdata }));
    if (response.payload.status === "Y") {
      setOpenAlert(true);
      setSuccessMessage(response.payload.message);
    } else {
      setOpenAlert(true);
      setPostError(response.payload.message);
    }
  };

  const priceBookLevels =
    user.companyCode == "PM"
      ? [
          { id: 6, level: "Price Book Level 6" },
          { id: 7, level: "Price Book Level 7" },
          { id: 8, level: "Price Book Level 8" },
          { id: 9, level: "Price Book Level 9" },
          { id: 10, level: "Price Book Level 10" },
        ]
      : [
          { id: 8, level: "Price Book Level 8" },
          { id: 9, level: "Price Book Level 9" },
        ];

  return (
    <Container>
      {status === "fulfilled" && !error ? (
        <Formik
          initialValues={{
            recID: data.RecordID,
            name: data.FullPriceBookTitle,
            excel: data.FullPriceBookExcel === "1" ? true : false,
            pdf: data.FullPriceBookPdf === "1" ? true : false,
            priceBookLevels: data.PriceLevel,
            disable: data.Disable === "1" ? true : false,
            brokenItems: data.BrokenItem,
            damagedItems: data.DamageItem,
            displayEmail: data.DisplayEmail,
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            handleSave(values);
          }}
        >
          {({
            errors,
            touched,
            handleBlur,
            handleChange,
            setFieldValue,
            isSubmitting,
            values,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="breadcrumb">
                <Breadcrumb
                  routeSegments={[
                    { name: "Control Panel" },
                    { name: "Configure Price Book" },
                    {
                      name: "Company",
                      path: "/pages/control-panel/configure-price-book/company",
                    },
                    { name: `Configure Company Price List` },
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
                    disabled={isSubmitting}
                  >
                    {params.mode === "delete" ? "Confirm" : "Save"}
                  </Button>
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    startIcon={<ArrowBackIcon size="small" />}
                    onClick={() =>
                      navigate(
                        "/pages/control-panel/configure-price-book/company"
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
  gap="20px"
  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
  sx={{
    "& > div": {
      gridColumn: isNonMobile ? undefined : "span 4",
    },
    padding: "10px",
  }}
>
  {/* Company Info */}
  <Stack sx={{ gridColumn: "span 2" }} direction="column" gap={2}>
    <Typography fontSize="16px">
      <Typography component="span" fontWeight="bold">
        Company:
      </Typography>{" "}
      {State.Code} || {State.Name}
    </Typography>
  </Stack>

  {/* Spacer or future content */}
  <Stack sx={{ gridColumn: "span 2" }} direction="column" gap={2}></Stack>

  {/* Price Book Title & Level Selection */}
  <Stack sx={{ gridColumn: "span 2" }} direction="column" gap={2}>
    <TextField
      fullWidth
      variant="outlined"
      type="text"
      id="name"
      name="name"
      label="Price Book Title"
      size="small"
      value={values.name}
      onChange={handleChange}
      onBlur={handleBlur}
      error={touched.name && Boolean(errors.name)}
      helperText={touched.name && errors.name}
      autoComplete="off"
    />

    {/* <FormikCustomSelectCompanyPriceLevel
      name="priceBookLevels"
      id="priceBookLevels"
      value={values.priceBookLevels}
      onChange={handleChange}
      label="Price Book Level"
      disabled={params?.mode === "delete"}
      url={`${process.env.REACT_APP_BASE_URL}PriceBookConfiguration/GetPriceListLevel_V1?CompanyID=${data.CompanyID}`}
    /> */}
    <FormikCustomSelectCompanyPriceLevel
      name="priceBookLevels"
      id="priceBookLevels"
      value={values.priceBookLevels}
      label="Price Book Level"
      disabled={params?.mode === "delete"}
      onChange={(event,newValue)=>{
        setFieldValue("priceBookLevels",newValue)
      }}
      url={`${process.env.REACT_APP_BASE_URL}PriceBookConfiguration/GetPriceListLevel_V1?CompanyID=${values.company}`}
    />
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
          />
        }
        label="Damaged Items"
      />
      <FormControlLabel
        sx={{ height: 37.13 }}
        control={
          <Checkbox
            size="small"
            id="displayEmail"
            name="displayEmail"
            checked={values.displayEmail}
            onChange={handleChange}
          />
        }
        label="Display Email"
      />
    </Stack>
  </Stack>

  {/* Checkboxes & Autocomplete */}
  <Stack
    sx={{ gridColumn: isNonMobile ? "span 2" : "span 4" }}
    direction="column"
    gap={1}
  >
    

    {/* Autocomplete & Add Button */}
    <Box display="flex" direction="row" alignItems="center" gap={1}>
      <CompanyPriceListAutoComplete
        key={JSON.stringify(getRows)}
        errors={isPriceListExistsError}
        helper={isPriceListExistsError && "Please select price list!"}
        disabled={params.mode === "delete" || params.mode === "view"}
        name="addPriceList"
        id="addPriceList"
        value={addPriceListData}
        onChange={handleSelectionAddPriceListData}
        label="Include Price List"
        url={`${process.env.REACT_APP_BASE_URL}PriceList/GetConfigurePriceList?CompanyID=${data.CompanyID}`}
        filterData={getRows}
        sx={{ flex: 1 }} 
      />

      {/* <Tooltip title="Add"> */}
        <IconButton
          disabled={params.mode === "delete" || params.mode === "view"}
          color="black"
          size="small"
          onClick={handleAddPriceList}
        >
          <Add
            sx={{
              fontSize: 30,
              color: theme.palette.success.main,
            }}
          />
        </IconButton>
      {/* </Tooltip> */}
    </Box>
  </Stack>
</Box>

                {/* <Box
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
                  <Stack
                    sx={{ gridColumn: "span 2" }}
                    direction="column"
                    gap={2}
                  >
                   <Typography fontSize={"16px"}>
                      <Typography component="span" fontWeight="bold">
                        Company:
                      </Typography>{" "}
                      {State.Code} || {State.Name}
                    </Typography>
                    </Stack>
                    <Stack
                    sx={{ gridColumn: "span 2" }}
                    direction="column"
                    gap={2}
                  ></Stack>
                  <Stack
                    sx={{ gridColumn: "span 2" }}
                    direction="column"
                    gap={2}
                  >
                   
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      id="name"
                      name="name"
                      label="Price Book Title"
                      size="small"
                      sx={{ gridColumn: "span 2" }}
                      // required
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                      autoComplete="off"
                    />

                    <FormikCustomSelectCompanyPriceLevel
                      name="priceBookLevels"
                      id="priceBookLevels"
                      sx={{ gridColumn: "span 2" }}
                      value={values.priceBookLevels}
                      onChange={handleChange}
                      label="price Book Level"
                      disabled={params?.mode === "delete"}
                      url={`${process.env.REACT_APP_BASE_URL}PriceBookConfiguration/GetPriceListLevel?CompanyID=${data.CompanyID}`}
                    />
                   
                   
                  </Stack>
                 <Stack
                   sx={{
                     gridColumn: isNonMobile ? "span 2" : "span 4", // responsive behavior
                   }}
                   direction="column"
                   gap={1}
                 >
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
                          />
                        }
                        label="Damaged Items"
                      />
                    </Stack>
                   

                  <CompanyPriceListAutoComplete
                    key={JSON.stringify(getRows)}
                    errors={isPriceListExistsError}
                    helper={
                      isPriceListExistsError && "Please select price list!"
                    }
                    disabled={
                      params.mode === "delete" || params.mode === "view"
                    }
                    name="addPriceList"
                    id="addPriceList"
                    value={addPriceListData}
                    onChange={handleSelectionAddPriceListData}
                    label="Include Price List"
                    url={`${process.env.REACT_APP_BASE_URL}PriceList/GetConfigurePriceList?CompanyID=${data.CompanyID}`}
                    filterData={getRows}
                  />
                  // <Tooltip title="Add">
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
                  // </Tooltip>
                
                  </Stack>
                </Box> */}
                
              
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
                      toolbar: CustomToolBar,
                    }}
                    rowHeight={dataGridRowHeight}
                    rows={getRows}
                    columns={columns}
                    disableSelectionOnClick
                    disableRowSelectionOnClick
                    getRowId={(row) => row.RecordID}
                    initialState={{
                      pagination: {
                        paginationModel: { pageSize: dataGridPageSize },
                      },
                    }}
                    pageSizeOptions={dataGridpageSizeOptions}
                    columnVisibilityModel={{
                      item_key: false,
                      RecordID:false,
                      PRICELISTID:false
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
              <MessageAlertDialog
                open={isRemovePriceList}
                tittle={removePriceListdDesc}
                message={`Are you sure you want to remove this Pricelist ?`}
                Actions={
                  <DialogActions>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={async () => {
                        const Pdata = {
                          RecordID: removePriceListID,
                          
                        };
                        const response = await dispatch(
                          ConfigurepriceListClear({
                            Pdata,
                          })
                        );
                        if (response.payload.status === "Y") {
                          // dispatch(configureAddedPriceList);
                          dispatch(getConfigPriceBook2({ ID: State.RecordID }));
                        }
                        setIsRemovePriceList(false);
                        setremovePriceListID(0);
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
                        setremovePriceListDesc("");
                      }}
                    >
                      No
                    </Button>
                  </DialogActions>
                }
              />
              <MessageAlertDialog
                open={isPriceListExists}
                tittle={
                  addPriceListData
                    ? addPriceListData.PRICELISTDESCRIPTION
                    : "Please select the Pricelist!"
                }
                message={
                  "Oops! This pricelist is already exists in print group."
                }
                Actions={
                  <DialogActions>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => {
                        setIsPriceListExists(false);
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
      ) : (
        false
      )}
      <AlertDialog
        open={openAlert}
        error={postError}
        message={postError ? postError : successMessage}
        Actions={
          params.mode === "add" ? (
            <DialogActions>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  navigate("/pages/control-panel/configure-price-book/company");
                  setSuccessMessage(null);
                  setPostError(null);
                }}
              >
                Back to Configure Company
              </Button>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  dispatch(getConfigPriceBook({ ID: 0 }));
                  setOpenAlert(false);
                  setSuccessMessage(null);
                  setPostError(null);
                }}
                autoFocus
              >
                Add New Configure Company
              </Button>
            </DialogActions>
          ) : (
            <DialogActions>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  navigate("/pages/control-panel/configure-price-book/company");
                  setSuccessMessage(null);
                  setPostError(null);
                }}
              >
                Back to Configure Company
              </Button>
            </DialogActions>
          )
        }
      />
    </Container>
  );
};

export default ConfigureCompanyEdit;
