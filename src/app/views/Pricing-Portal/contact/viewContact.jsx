import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Breadcrumb } from "app/components";
import { dataGridHeight, dataGridRowHeight,dataGridHeaderFooterHeight } from "app/utils/constant";
// ******************** ICONS ******************** //
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
import { FormikOptimizedAutocomplete, PGOptimizedAutocomplete } from "app/components/SingleAutocompletelist";
import { useDispatch, useSelector } from "react-redux";
import { configureAddedPriceList, getConfigPriceBook } from "app/redux/slice/getSlice";
import { ConfigurepriceListClear, postConfigureCompany, PostConfigurePriceListID } from "app/redux/slice/postSlice";
import lodash from "lodash";
import AlertDialog, { MessageAlertDialog } from "app/components/AlertDialog";

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


// ******************** Validation Schema ******************** //
const validationSchema = Yup.object({
  
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(60, "Name must be at most 60 characters"),
 
});

// ******************** Price List Edit SCREEN  ******************** //
const ViewContact = () => {
  // ******************** HOOKS AND CONSTANTS ******************** //
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const State = location.state;
  console.log("🚀 ~ ConfigureEdit ~ State:", State.RecordID)

  // ******************** LOCAL STATE ******************** //

  const [postError, setPostError] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  // ******************** REDUX STATE ******************** //









 
  //==================================GETAPI=====================================//

  // ********************** COLUMN ********************** //
 





  return (
    <Container>
 
        <Formik
        initialValues={{
            RecordID: "",
            email:"",
            name: "",
            provider: "",
            sequence: "",
            phonenumber:"",
            // pdf:data.,
            // excel:data.,
            disable: "",
            ccpbtitle: "",
            ccpbpdf:"" ,
            ccpbexcel:"",
            cfpbtitle: "",
            cfpbpdf: "",
            cfpbexcel: "",
            pmc: "",
            pec:"" ,
          }}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={(values, { resetForm }) => {
            console.log("Form submitted with values:", values);
            // handleSave(values);
            resetForm();
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
                                    { name: "Contact", path: "/pages/control-panel/contact-directory" },
                                    { name: `${params.mode} Contact` },
                                  ]}
                                />
                <Stack direction={"row"} gap={1}>
                  {params.mode === "delete" &&(<Button
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
                  </Button>)}
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
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="name"
                    name="name"
                    label="Customer Name"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    required
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.code && !!errors.code}
                    disabled={
                        params.mode === "delete" || params.mode === "view"
                          ? true
                          : false
                      }
                    helperText={touched.name && errors.name}
                    InputLabelProps={{
                      sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                    }}
                  />
                  <FormikOptimizedAutocomplete
                    sx={{ gridColumn: "span 2" }}
                    disabled={
                      params.mode === "delete" || params.mode === "view"
                        ? true
                        : false
                    }
                    name="runGroup"
                    id="runGroup"
                    value={values.runGroup}
                    onChange={(event, newValue) =>
                      setFieldValue("runGroup", newValue)
                    }
                    label="Run Group"
                    url={`${process.env.REACT_APP_BASE_URL}PriceBookDirectory/GetRungroupByCompany?CompanyCode=PM`} />

                  <TextField
                  disabled={
                    params.mode === "delete" || params.mode === "view"
                      ? true
                      : false
                  }
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="phonenumber"
                    name="phonenumber"
                    label="Mobile"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    value={values.phonenumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.phonenumber && Boolean(errors.phonenumber)}
                    helperText={touched.phonenumber && errors.phonenumber}
                  />

                  <TextField
                  disabled={
                    params.mode === "delete" || params.mode === "view"
                      ? true
                      : false
                  }
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="provider"
                    name="provider"
                    label="Service Provider"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    value={values.provider}
                    onChange={handleChange}
                    onBlur={handleBlur}

                  />
                  <TextField
                  disabled={
                    params.mode === "delete" || params.mode === "view"
                      ? true
                      : false
                  }
                    fullWidth
                    variant="outlined"
                    type="email"
                    id="email"
                    name="email"
                    label="Email"
                    size="small"
                    sx={{ gridColumn: "span 2" }}

                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                  <TextField
                  disabled={
                    params.mode === "delete" || params.mode === "view"
                      ? true
                      : false
                  }
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="sequence"
                    name="sequence"
                    label="Sequence"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                 

                    value={values.sequence}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.sequence && Boolean(errors.sequence)}
                    helperText={touched.sequence && errors.sequence}
                  />
                  <Stack
                    sx={{ gridColumn: "span 2" }}
                    direction="row"
                    gap={2}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.pec}
                          onChange={handleChange}
                          sx={{ height: "10px" }}
                          disabled={
                            params.mode === "delete" || params.mode === "view"
                              ? true
                              : false
                          }
                          size="small"
                          id="pec"
                          name="pec"
                        />
                      }
                      label="Preferred Email Communication"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          id="pmc"
                          name="pmc"
                          checked={values.pmc}
                          onChange={handleChange}
                          sx={{ height: "10px" }}
                          disabled={
                            params.mode === "delete" || params.mode === "view"
                              ? true
                              : false
                          }
                        />
                      }
                      label="Preferred Mobile Communication"
                    />
                  </Stack>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        id="disable"
                        name="disable"
                        checked={values.disable}
                        // disabled={true}
                        onChange={handleChange}
                        sx={{ height: "10px" }}
                      disabled={
                        params.mode === "delete" || params.mode === "view"
                          ? true
                          : false
                      }
                      />
                    }
                    label="Disable"
                  />
                </Box>
           
              
              </Paper>
             
            </form>
          )}
        </Formik>
     
      {/* <AlertDialog
        open={openAlert}
        error={postError}
        message={
          params.mode === "add"
            ? "Contact added successfully"
            : params.mode === "delete"
              ? "Contact Deleted Successfully"
              : "Contact updated successfully"
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
                Back to Contact 
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
                Add New Contact 
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
                Back to Contact 
              </Button>
            </DialogActions>
          )
        }
      /> */}
    </Container>
  );
};

export default ViewContact;


