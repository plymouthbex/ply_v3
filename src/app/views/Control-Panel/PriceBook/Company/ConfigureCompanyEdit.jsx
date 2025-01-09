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
} from "@mui/material";
import { Breadcrumb } from "app/components";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { dataGridHeight, dataGridHeightC, dataGridRowHeight ,dataGridHeaderFooterHeight} from "app/utils/constant";


// ******************** ICONS ******************** //
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
import { PGOptimizedAutocomplete } from "app/components/SingleAutocompletelist";
import { useDispatch, useSelector } from "react-redux";
import { configureAddedPriceList, configurePriceListDeleted, getConfigPriceBook } from "app/redux/slice/getSlice";
import lodash from "lodash";
import AlertDialog, { MessageAlertDialog } from "app/components/AlertDialog";
import { ConfigurepriceListClear, postConfigureCompany, PostConfigurePriceListID } from "app/redux/slice/postSlice";
import toast from "react-hot-toast";
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
  minHeight: '50px', // Adjust minimum height as needed
  maxHeight: '200px', // Adjust maximum height as needed
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
  border: `2px dashed rgba(${convertHexToRGB(theme.palette.text.primary)}, 0.3)`,
  "&:hover": {
    background: `rgb(${convertHexToRGB(theme.palette.text.primary)}, 0.2) !important`,
  },
  background: isDragActive ? "rgb(0, 0, 0, 0.15)" : "rgb(0, 0, 0, 0.01)",
}));

// ******************** Price List Edit SCREEN  ******************** //
const ConfigureCompanyEdit = () => {
  // ******************** HOOKS AND CONSTANTS ******************** //
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const State = location.state;

  const dispatch = useDispatch();
  // ******************** REDUX_STATE ******************** //
  const data = useSelector((state) => state.getSlice.getconfigureData);
  console.log("🚀 ~ ConfigureCompanyEdit ~ data:", data)
  const getRows = useSelector((state) => state.getSlice.configurePriceListGetData);
  console.log("🚀 ~ ConfigureCompanyEdit ~ getRows:", getRows)

 
  const getRowsSet = new Set(getRows.map((item) => item.PRICELISTID));
  const filteredSelectedItems = getRows.filter(
    (selectedItem) => !getRowsSet.has(selectedItem.PRICELISTID)
  );
  console.log("🚀 ~ ConfigureCompanyEdit ~ filteredSelectedItems:", filteredSelectedItems)

const loading=useSelector((state) => state.getSlice.getconfigureLoading);
const status=useSelector((state) => state.getSlice.getconfigureStatus);
const error=useSelector((state) => state.getSlice.getconfigureError);

  useEffect(() => {
    dispatch(getConfigPriceBook({ ID: State.RecordID }));
  }, [dispatch]);
  // ******************** USE-State ******************** //
  const [addPriceListData, setAddPriceListData] = useState(null);
  const handleSelectionAddPriceListData = (newValue) => {
    setAddPriceListData(newValue);
  };

  const [isPriceListExists, setIsPriceListExists] = useState(false);
  const [isPriceListExistsError, setIsPriceListExistsError] = useState(false);
  const [isRemovePriceList, setIsRemovePriceList] = useState(false);
  const [removePriceListdDesc, setremovePriceListDesc] = useState("");
    const [postError, setPostError] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [removePriceListID, setremovePriceListID] = useState(0);
  // ********************** COLUMN ********************** //
  const columns = [
    {
      headerName: "Price List Name",
      field: "PRICELISTID",
      width: "170",
      align: "left",
      headerAlign: "left",
      hide: false,
    },
    {
      headerName: "Price List Description",
      field: "PRICELISTDESCRIPTION",
      width: "300",
      align: "left",
      headerAlign: "left",
      hide: false,
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
              <Button
                sx={{ height: 25 }}
                variant="contained"
                color="secondary"
                size="small"
                // disabled={true} // Permanently disable the button
                onClick={() => {
                  navigate("/pages/control-panel/configure-price-book/price-list-items/company", {
                    state: {
                      id: param.row.PRICELISTID,
                    }
                  });
                }}
                
              >
                View Items
              </Button>
              <Button
                sx={{ height: 25 }}
                variant="contained"
                color="secondary"
                size="small"
                // disabled={true} // Permanently disable the button
                onClick={() => {
                  setremovePriceListID(param.row.PRICELISTID);
                  setremovePriceListDesc(param.row.PRICELISTDESCRIPTION);
                  setIsRemovePriceList(true);
                }}
                startIcon={<DeleteIcon size="small" />}
              >
                Remove Items
              </Button>
            </Box>
          </div>
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
          <PGOptimizedAutocomplete
            errors={isPriceListExistsError}
            helper={isPriceListExistsError && "Please select price list!"}
            disabled={params.mode === "delete" || params.mode === "view"}
            name="addPriceList"
            id="addPriceList"
            value={addPriceListData}
            onChange={handleSelectionAddPriceListData}
            label="Add Price List"
            url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=PriceList`}
          />

          <Button
            disabled={params.mode === "delete" || params.mode === "view"}
            variant="contained"
            color="info"
            size="small"
            startIcon={<Add />}
            onClick={() => {
              if (addPriceListData) {
                const isItem = [...getRows, ...filteredSelectedItems].some(
                  (item) =>
                    lodash.isEqual(item.PRICELISTID, addPriceListData.PRICELISTID)
                ); if (isItem) {
                  setIsPriceListExists(true);
                  setTimeout(() => {
                    setIsPriceListExists(false);
                    setAddPriceListData(null);
                  }, 5000);
                  return;
                }
                dispatch(configureAddedPriceList(addPriceListData));
                setAddPriceListData(null);
              } else {
                setIsPriceListExistsError(true);
                setTimeout(() => {
                  setIsPriceListExistsError(false);
                }, 2000);
              }
const pricedata={
  "recordID": data.RecordID,
  "priceListID": addPriceListData.PRICELISTID,
}
              const response= dispatch(PostConfigurePriceListID({
                pricedata
              }));

            }}
          >
            Add
          </Button>
        </Box>
      </GridToolbarContainer>
    );
           
  }


  const handleSave=async(values)=>{
    const Cdata={
  recordID: data.RecordID,
  classification: data.Classification,
  companyID: data.CompanyID,
  companyCode: data.CompanyCode,
  fullPriceBookPdf: values.pdf ? "1" :"0",
  fullPriceBookExcel: values.excel ? "1" :"0",
  disable: values.disable ? "1" :"0",
  fullPriceBookTitle: values.name,
  priceLevel:values.priceBookLevels,
}
    console.log("🚀 ~ handleSave ~ Cdata:", Cdata);
    const response=await dispatch(postConfigureCompany({Cdata}));
    if(response.payload.status ==="Y"){  
       setOpenAlert(true);
    } else {
      setOpenAlert(true);
      setPostError(true);
      // toast.error("Error occurred while saving data");
    }
  }
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
          disable: data.Disable === "1" ? true : false
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log(values);
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
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="breadcrumb">
              <Breadcrumb
                routeSegments={[
                  { name: "Configure Price Book Type" },
                  {
                    name: "Company",
                    path: "/pages/control-panel/configure-price-book/company",
                  },
                  { name: `${params.mode} Configure Company Detail` },
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
                    navigate("/pages/control-panel/configure-price-book/company")
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
                <Stack sx={{ gridColumn: "span 2" }} direction="column" gap={2}>



                  <Typography fontSize={"16px"}>
                    <Typography component="span" fontWeight="bold">Company:</Typography> {State.Code} || {State.Name}
                  </Typography>


                  {/* <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="code"
                    name="code"
                    label="Code"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    // required
                    value={values.code}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.code && Boolean(errors.code)}
                    helperText={touched.code && errors.code}
                    autoFocus
                  /> */}
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
                  />
                  <Autocomplete
                    fullWidth
                    id="priceBookLevels"
                    name="priceBookLevels"
                    // Map through priceBookLevels to get the 'level' values for the options list
                    options={priceBookLevels.map((levelObj) => levelObj.level)}
                    disabled={params?.mode === "delete"}

                    // Set the value by finding the corresponding 'level' based on the id stored in Formik's values
                    value={priceBookLevels.find((levelObj) => levelObj.id === values.priceBookLevels)?.level || ""}

                    onChange={(event, newValue) => {
                      // Find the corresponding 'id' based on the selected 'level' value
                      const selectedLevel = priceBookLevels.find((levelObj) => levelObj.level === newValue);


                      handleChange({
                        target: { name: "priceBookLevels", value: selectedLevel?.id || null }, // If no match, set to null
                      });
                    }}

                    onBlur={handleBlur}
                    disableClearable
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Price Book Level"
                        size="small"
                        sx={{ gridColumn: "span 2" }}
                      />
                    )}
                  />
                  <Stack
                    sx={{ gridColumn: "span 1" }}
                    direction="row"
                    gap={2}
                  >

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.pdf}
                          onChange={handleChange}
                          sx={{ height: "10px" }}
                          disabled={
                            params.mode === "delete" || params.mode === "view"
                          }
                          size="small"
                          id="pdf"
                          name="pdf"
                        />
                      }
                      label="PDF"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          id="excel"
                          name="excel"
                          checked={values.excel}
                          onChange={handleChange}
                          sx={{ height: "10px" }}
                          disabled={
                            params.mode === "delete" || params.mode === "view"
                          }
                        />
                      }
                      label="EXCEL"
                    />
                  </Stack>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        id="disable"
                        name="disable"
                        checked={values.disable}

                        onChange={handleChange}
                        sx={{ height: "10px" }}

                      />
                    }
                    label="Disable"
                  />
                </Stack>
                {/* <Stack sx={{ gridColumn: "span 2" }} direction="column" gap={2}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap="20px"
                    justifyContent="center"
                    alignItems="center"
                  >
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
                        <Publish
                          sx={{ color: "text.secondary", fontSize: "48px" }}
                        />
                        {imageList3.length ? (
                          <span>{imageList3.length} images selected</span>
                        ) : (
                          <span>Drop images</span>
                        )}
                      </FlexBox>
                    </DropZone>
                  </Box>
                </Stack> */}
              </Box>
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
                       height: dataGridHeaderFooterHeight,
                       minHeight: dataGridHeaderFooterHeight,
                   },
                 }}
                  slots={{
                    loadingOverlay: LinearProgress,
                    toolbar: CustomToolbar,
                  }}
                  rowHeight={dataGridRowHeight}
                  rows={[...getRows, ...filteredSelectedItems]}
                  columns={columns}
                  disableSelectionOnClick
                  disableRowSelectionOnClick
                  getRowId={(row) => row.PRICELISTID}
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
                      const Pdata={
                        PriceListID:removePriceListID,
                        PriceBookRecordID:data.RecordID,
                      }
                      const response= await dispatch(
                        ConfigurepriceListClear({
                        Pdata
                        })
                      );
                      if(response.payload.status ==="Y"){
                        // dispatch(configureAddedPriceList);
                        dispatch(getConfigPriceBook({ID:State.RecordID}))
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
                  message={"Oops! This pricelist is already exists in print group."}
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
        message={
          params.mode === "add"
            ? "Company configuration added successfully."
            : params.mode === "delete"
              ? "Company configuration deleted Successfully."
              : "Company configuration updated successfully."
        }
        Actions={
          params.mode === "add" ? (
            <DialogActions>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => navigate("/pages/control-panel/configure-price-book/company")}
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
                onClick={() => navigate("/pages/control-panel/configure-price-book/company")}
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
