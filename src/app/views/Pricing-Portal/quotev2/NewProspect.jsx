import React, { useEffect, useState } from "react";
import {
  Paper,
  Button,
  Box,
  styled,
  useMediaQuery,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  FormLabel,
} from "@mui/material";
import { Breadcrumb } from "app/components";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// ******************** ICONS ******************** //
import { Formik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { postContractItems, quoteInfoData } from "app/redux/slice/postSlice";
import useAuth from "app/hooks/useAuth";
import {
  GenricPriceBookLoadingApiDialog,
  PriceGroupAlertApiDialog,
} from "app/components/LoadindgDialog";
import {
  clearStateProspectInfoQuote,
  getConfigPriceBookCompany,
  getProspectContractItems,
  getProspectInfoData,
  getProspectListData,
  getQuoteBookData,
  quoteClearState2,
} from "app/redux/slice/getSlice";

import { useTheme } from "@emotion/react";

import { FormikCustomSelectCompany } from "app/components/SingleAutocompletelist";
import { getPriceListView } from "app/redux/slice/listviewSlice";
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

// ******************** Price List Edit SCREEN  ******************** //
const NewProspect = () => {
  // ******************** HOOKS AND CONSTANTS ******************** //
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();
  const state = location.state ? location.state : {};
  const dispatch = useDispatch();
  const { user } = useAuth();
  const params = useParams();

  const getQuoteProspectInfoData = useSelector(
    (state) => state.getSlice.getQuoteProspectInfoData
  );
  const getQuoteProspectInfoLoading = useSelector(
    (state) => state.getSlice.getQuoteProspectInfoLoading
  );
  const getQuoteProspectInfoStatus = useSelector(
    (state) => state.getSlice.getQuoteProspectInfoStatus
  );
  const getQuoteProspectInfoError = useSelector(
    (state) => state.getSlice.getQuoteProspectInfoError
  );

  const rowProspect = useSelector(
    (state) => state.getSlice.getQuoteProspectData
  );

  useEffect(() => {
    dispatch(
      getProspectListData({ data: { Type: "Prospect", UserID: user.id } })
    );
    dispatch(
      getProspectInfoData({
        data: { RecordID: state.headerID ? state.headerID : 0 },
      })
    );
    dispatch(quoteClearState2());
  }, [location.key]);

  // ******************** LOCAL STATE ******************** //

  const [openAlert, setOpenAlert] = useState(false);
  const [postError, setPostError] = useState(null);

  // //=============================SAVE==================================//

  const handleSave = async (values, setSubmitting) => {
    const inputValue = values.prospectName.trim();
    const isPricelist = rowProspect.some(
      (item) => item.Name.toLowerCase() === inputValue.toLowerCase()
    );
    if (isPricelist && (params.mode === "copy" || params.mode === "new")) {
      const pricelistID = rowProspect.find((item) => item.Name.toLowerCase() === inputValue.toLowerCase()
    );
      setPrintGroupID(pricelistID.RecordID);
      SetIsPrintGroupOpen(true);
      return;
    }
    const data = {
      RecordID: params.mode === "copy" ? 0 : getQuoteProspectInfoData.RecordID,
      CompanyCode: values.company ? values.company : "",
      UserID: user.id,
      FromDate: getQuoteProspectInfoData.FromDate,
      ToDate: getQuoteProspectInfoData.ToDate,
      Name: values.prospectName,
      Description: values.description,
      Address1: values.address1,
      Address2: values.address2,
      City: values.city,
      State: values.state,
      Zip: values.zip,
      EmailID: values.email,
      Mobile: values.mobile,
      Provider: values.serviceProvider,
      Salesrepresentative: values.salesRepName,
      PriceLevel: values.priceBookLevel,
      CustomerName: values.customer ? values.customer.CustomerName : "",
      CustomerNumber: values.customer ? values.customer.Code : "",
      Type: params.mode === "copy" ? "C" : "A",
      OldHeaderID: getQuoteProspectInfoData.RecordID,
      CurrentDate: values.prospectDate,
      PreferedPdf: values.PreferedPdf,
      PreferedExcel: values.PreferedExcel,
      ShowPrice: getQuoteProspectInfoData.ShowPrice ,
    };

    const response = await dispatch(quoteInfoData({ data }));
    if (response.payload.status === "Y") {
      setOpenAlert(true);

      setTimeout(() => {
        navigate(
          params.mode === "copy"
            ? "/pages/pricing-portal/new-quote/new/build-quote":  params.mode === "edit" ? "./build-quote"
            : "/pages/pricing-portal/new-quote/new/build-quote",
          { state: { headerID: response.payload.RecordId } }
        );
        setOpenAlert(false);
        setSubmitting(false);
      }, 2000);
    } else {
      setOpenAlert(true);
      setPostError(response.payload.message);

      setTimeout(() => {
        setOpenAlert(false);
        setSubmitting(false);
      }, 2000);

      
      setTimeout(() => {
        setPostError(null);
      }, 2500);
    }
  };

  const priceBookLevel1 = [6, 7, 8, 9];
  const priceBookLevel2 = [8, 9];
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .max(30, "Email must be at most 30 characters"),
    address1: Yup.string()
      .min(3, "Address must be at least 3 characters")
      .max(50, "Address must be at most 50 characters"),
    mobile: Yup.string().matches(
      /^\(\d{3}\) \d{3}-\d{4}$/,
      "Phone number must be in the format (XXX) XXX-XXXX"
    ),
    
  });

  const [isPrintGroupOpen, SetIsPrintGroupOpen] = useState(false);
  const [printGroupID, setPrintGroupID] = useState(0);
  const isPriceListIDExists = (e, setSubmitting) => {
    const inputValue = e.target.value.trim();
    const isPricelist = rowProspect.some(
      (item) => item.Name.toLowerCase() === inputValue.toLowerCase()
    );
    if (isPricelist && (params.mode === "copy" || params.mode === "new")) {
      const pricelistID = rowProspect.find((item) => item.Name.toLowerCase() === inputValue.toLowerCase()
    );
      setPrintGroupID(pricelistID.RecordID);
      SetIsPrintGroupOpen(true);
    } else {
      setSubmitting(false);
    }
  };

  const getCurrentDateForInput = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  return (
    <Container>
      {getQuoteProspectInfoStatus === "fulfilled" &&
      !getQuoteProspectInfoLoading ? (
        <Formik
          initialValues={{
            company: getQuoteProspectInfoData.CompanyCode
              ? getQuoteProspectInfoData.CompanyCode
              : user.companyCode,
            prospectName: getQuoteProspectInfoData.Name,
            description: getQuoteProspectInfoData.Description,
            address1: getQuoteProspectInfoData.Address1,
            address2: getQuoteProspectInfoData.Address2,
            city: getQuoteProspectInfoData.City,
            state: getQuoteProspectInfoData.State,
            zip: getQuoteProspectInfoData.Zip,
            email: getQuoteProspectInfoData.EmailID,
            mobile: getQuoteProspectInfoData.Mobile,
            serviceProvider: getQuoteProspectInfoData.Provider,
            salesRepName: getQuoteProspectInfoData.Salesrepresentative || user.name,
            customer: getQuoteProspectInfoData.CustomerNumber,
            PreferedPdf: getQuoteProspectInfoData.RecordID? getQuoteProspectInfoData.PreferedPdf :true,
            PreferedExcel: getQuoteProspectInfoData.RecordID? getQuoteProspectInfoData.PreferedExcel :true,
            priceBookLevel: getQuoteProspectInfoData.PriceLevel
              ? getQuoteProspectInfoData.PriceLevel
              : null,
            prospectDate:
              getQuoteProspectInfoData.CurrentDate || getCurrentDateForInput(),
          }}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              handleSave(values, setSubmitting);
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
            setFieldValue,
            setSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              <div
                className="breadcrumb"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Breadcrumb
                  routeSegments={[
                    { name: "Price Book" },
                    { name: `New Prospect` },
                  ]}
                />
                <Stack direction={"row"} gap={1}>
                  {(params.mode === "copy" ||  params.mode === "edit") && (
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      startIcon={<ArrowBackIcon size="small" />}
                      onClick={() => navigate(-1)}
                    >
                      Back
                    </Button>
                  )}
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
                  <FormikCustomSelectCompany
                    name="company"
                    id="company"
                    sx={{ gridColumn: "span 2" }}
                    multiple={false}
                    disabled={user.role == "USER"}
                    value={values.company}
                    onChange={handleChange}
                    label="Company"
                    url={`${process.env.REACT_APP_BASE_URL}PriceBookConfiguration/GetUserAccess?Type=CO&UserID=${user.id}`}
                  />
                  <TextField
                    variant="outlined"
                    id="prospectDate"
                    label="Date"
                    type="date"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    name="prospectDate"
                    value={values.prospectDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    InputLabelProps={{
                      shrink: true, // Forces the label to shrink above the field
                      sx: {
                        "& .MuiInputLabel-asterisk": { color: "red" },
                      },
                    }}
                    autoComplete="off"
                  />
                  <TextField
                    variant="outlined"
                    id="salesRepName"
                    label="Sales Representative Name"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    name="salesRepName"
                    value={values.salesRepName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    InputLabelProps={{
                      sx: {
                        "& .MuiInputLabel-asterisk": { color: "red" },
                      },
                    }}
                    autoComplete="off"
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="prospectName"
                    name="prospectName"
                    label="Prospect Name"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    required
                    InputLabelProps={{
                      sx: {
                        "& .MuiInputLabel-asterisk": { color: "red" },
                      },
                    }}
                    value={values.prospectName}
                    onChange={handleChange}
                    onFocus={() => setSubmitting(true)}
                    onBlur={(e) => isPriceListIDExists(e, setSubmitting)}
                    error={!!touched.prospectName && !!errors.prospectName}
                    helperText={touched.prospectName && errors.prospectName}
                    autoComplete="off"
                  />
                  {/* <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="description"
                    name="description"
                    label="Description"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  /> */}

                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="mobile"
                    name="mobile"
                    label="Mobile"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    value={values.mobile}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="off"
                    error={!!touched.mobile && !!errors.mobile}
                    helperText={touched.mobile && errors.mobile}
                  />
                  <FormControl
                    sx={{ gridColumn: "span 2" }}
                    fullWidth
                    size="small"
                  >
                    <InputLabel id="demo-simple-select-label">
                      Service Provider
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      value={values.serviceProvider}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      id="serviceProvider"
                      name="serviceProvider"
                      label="Price Book Type"
                    >
                      <MenuItem value={"AT&T"}>AT&T</MenuItem>
                      <MenuItem value={"V"}>Verizon</MenuItem>
                      <MenuItem value={"TM"}>T-Mobile</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="address1"
                    name="address1"
                    label="Address"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    value={values.address1}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="off"
                    error={!!touched.address1 && !!errors.address1}
                    helperText={touched.address1 && errors.address1}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="city"
                    name="city"
                    label="City"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    value={values.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="off"
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="state"
                    name="state"
                    label="State"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    value={values.state}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="off"
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="zip"
                    name="zip"
                    label="Zip"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    value={values.zip}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="off"
                    error={!!touched.zip && !!errors.zip}
                    helperText={touched.zip && errors.zip}
                  />

                  {/* <TextField
                    fullWidth
                    variant="outlined"
                    type="number"
                    id="priceBookLevel"
                    name="priceBookLevel"
                    label="price Book Level"
                    size="small"
                    required
                    InputLabelProps={{
                      sx: {
                        "& .MuiInputLabel-asterisk": { color: "red" },
                      },
                    }}
                    sx={{ gridColumn: "span 2" }}
                    value={values.priceBookLevel}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  /> */}

                  <Stack
                    sx={{ gridColumn: "span 2" }}
                    direction="column"
                    gap={2}
                  >
                    <Autocomplete
                      fullWidth
                      id="priceBookLevel"
                      name="priceBookLevel"
                      options={
                        values.company == "PM"
                          ? priceBookLevel1
                          : priceBookLevel2
                      }
                      getOptionLabel={(option) => `Level ${option}`}
                      value={values.priceBookLevel}
                      onChange={(event, newValue) =>
                        handleChange({
                          target: {
                            name: "priceBookLevel",
                            value: newValue,
                          },
                        })
                      }
                      onBlur={handleBlur}
                      disableClearable
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          InputLabelProps={{
                            sx: {
                              "& .MuiInputLabel-asterisk": { color: "red" },
                            },
                          }}
                          label="Price Book Level"
                          size="small"
                          sx={{ gridColumn: "span 2" }}
                        />
                      )}
                    />
                  </Stack>

                  <TextField
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
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    autoComplete="off"
                    // required
                    // InputLabelProps={{
                    //   sx: {
                    //     "& .MuiInputLabel-asterisk": { color: "red" },
                    //   },
                    // }}
                  />
                  <FormControl
                    sx={{ gridColumn: "span 2" }}
                    component="fieldset"
                    variant="standard"
                  >
                    <FormLabel focused={false} component="legend">
                      Preferred Format
                    </FormLabel>
                    <Stack direction="row" gap={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                          id="PreferedPdf"
                          name="PreferedPdf"
                          checked={values.PreferedPdf}
                          onChange={handleChange}
                          />
                        }
                        label="Pdf"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                          id="PreferedExcel"
                          name="PreferedExcel"
                          checked={values.PreferedExcel}
                          onChange={handleChange}
                          />
                        }
                        label="Excel"
                      />
                    </Stack>
                  </FormControl>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gridColumn: "span 4",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      disabled={isSubmitting}
                      endIcon={<ArrowForwardIcon />}
                      sx={{ padding: "8px 16px" }}
                      type="submit"
                      // onClick={() =>
                      //   navigate("/pages/pricing-portal/build-new-quote")
                      // }
                    >
                      Next
                    </Button>
                  </Box>
                </Box>
              </Paper>
              <PriceGroupAlertApiDialog
                logo={`data:image/png;base64,${user.logo}`}
                open={isPrintGroupOpen}
                error={true}
                message={"Oops! This Name is already in use."}
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
                        // dispatch(
                        //   getProspectInfoData({
                        //     data: {
                        //       RecordID: printGroupID,
                        //     },
                        //   })
                        // );
                        navigate("/pages/pricing-portal/new-quote/view", {
                          state: { headerID: printGroupID },
                        });
                        SetIsPrintGroupOpen(false);
                      }}
                      sx={{ height: 25 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      onClick={() => {
                        setFieldValue("prospectName", "");
                        SetIsPrintGroupOpen(false);
                        setSubmitting(false);
                      }}
                      sx={{ height: 25, ml: 1 }}
                    >
                      Try Another
                    </Button>
                  </Box>
                }
              />
            </form>
          )}
        </Formik>
      ) : (
        false
      )}

      {/* <GenricPriceBookLoadingApiDialog
        logo={`data:image/png;base64,${user.logo}`}
        tittle={""}
        open={isGenerating}
        message={genricPriceBookPdfGenratingMsg}
        loading={genricPriceBookIsPdfGenrating}
        error={genricPriceBookIsPdfError}
      /> */}

      <PriceGroupAlertApiDialog
        logo={`data:image/png;base64,${user.logo}`}
        open={openAlert}
        error={postError}
        message={postError ? postError : "Prospect info saved successfully"}
        Actions={
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
              height: 25,
            }}
          ></Box>
        }
      />
    </Container>
  );
};

export default NewProspect;
