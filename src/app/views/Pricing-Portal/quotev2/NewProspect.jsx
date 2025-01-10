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

  useEffect(() => {
    dispatch(
      getProspectInfoData({
        data: { RecordID: state.headerID ? state.headerID : 0 },
      })
    );
    dispatch(quoteClearState2());
  }, [location.key]);

  // ******************** LOCAL STATE ******************** //

  const [openAlert, setOpenAlert] = useState(false);
  const [postError, setPostError] = useState(false);

  // //=============================SAVE==================================//

  const handleSave = async (values, setSubmitting) => {
    const data = {
      RecordID: 0,
      CompanyCode: values.company ? values.company : "",
      UserID: user.id,
      FromDate: "",
      ToDate: "",
      Name: values.name,
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
    };

    const response = await dispatch(quoteInfoData({ data }));

    if (response.payload.status === "Y") {
      setOpenAlert(true);

      setTimeout(() => {
        navigate(
          params.mode === ""
            ? "/pages/pricing-portal/new-quote/new/build-quote"
            : "./build-quote",
          { state: { headerID: response.payload.RecordId } }
        );
        setOpenAlert(false);
        setSubmitting(false);
      }, 2000);
    } else {
      setOpenAlert(true);
      setPostError(true);

      setTimeout(() => {
        setOpenAlert(false);
        setPostError(false);
        setSubmitting(false);
      }, 2000);
    }
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
            name: getQuoteProspectInfoData.Name,
            description: getQuoteProspectInfoData.Description,
            address1: getQuoteProspectInfoData.Address1,
            address2: getQuoteProspectInfoData.Address2,
            city: getQuoteProspectInfoData.City,
            state: getQuoteProspectInfoData.State,
            zip: getQuoteProspectInfoData.Zip,
            email: getQuoteProspectInfoData.EmailID,
            mobile: getQuoteProspectInfoData.Mobile,
            serviceProvider: getQuoteProspectInfoData.Provider,
            salesRepName: getQuoteProspectInfoData.Salesrepresentative,
            customer: getQuoteProspectInfoData.CustomerNumber,
            priceBookLevel: getQuoteProspectInfoData.PriceLevel,
          }}
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
                  routeSegments={[{ name: "Quote" }, { name: `New Prospect` }]}
                />
                <Stack direction={"row"} gap={1}>
                  {params.mode === "copy" &&<Button
                    variant="contained"
                    color="info"
                    size="small"
                    startIcon={<ArrowBackIcon size="small" />}
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </Button>}
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
                    name="salesRepName"
                    id="salesRepName"
                    label="Sales Representative Name"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    value={values.salesRepName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    InputLabelProps={{
                      sx: {
                        "& .MuiInputLabel-asterisk": { color: "red" },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="name"
                    name="name"
                    label="Prospect Name"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    required
                    InputLabelProps={{
                      sx: {
                        "& .MuiInputLabel-asterisk": { color: "red" },
                      },
                    }}
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
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
                    id="address1"
                    name="address1"
                    label="Address"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    value={values.address1}
                    onChange={handleChange}
                    onBlur={handleBlur}
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
                  />

                  <TextField
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
                  />

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
                    required
                    InputLabelProps={{
                      sx: {
                        "& .MuiInputLabel-asterisk": { color: "red" },
                      },
                    }}
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
                  {/* <Stack
                    sx={{ gridColumn: "span 2" }}
                    direction="column"
                    gap={2}
                  >
                    <Autocomplete
                      fullWidth
                      id="priceBookLevel"
                      name="priceBookLevel"
                      options={priceBookLevel1}
                      getOptionLabel={(option) => `Price Book Level ${option}`}
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
                          label="PriceBook Level"
                          size="small"
                          sx={{ gridColumn: "span 2" }}
                        />
                      )}
                    />
                  </Stack> */}

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
        open={openAlert}
        error={postError}
        message={
          postError
            ? "Something Went Wrong"
            : "Prospect info saved successfully"
        }
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
