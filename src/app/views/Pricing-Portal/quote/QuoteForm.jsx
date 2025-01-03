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
} from "@mui/material";
import { Breadcrumb } from "app/components";

// ******************** ICONS ******************** //
import { Formik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { quoteInfoData } from "app/redux/slice/postSlice";
import useAuth from "app/hooks/useAuth";
import { PriceGroupAlertApiDialog } from "app/components/LoadindgDialog";
import { set } from "lodash";
import { SingleAutocomplete } from "app/components/AutoComplete";
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
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 1 characters"),
  email: Yup.string().email("Invalid email format"),
  // sequence: Yup.string()
  //   .min(1, "Sequence must be at least 1 character")
  //   .max(15, "Sequence must be at most 15 characters"),
  // address: Yup.string()
  //   .min(3, "Address must be at least 3 characters")
  //   .max(50, "Address must be at most 50 characters"),
});

// ******************** Price List Edit SCREEN  ******************** //
const QuoteEdit = () => {
  // ******************** HOOKS AND CONSTANTS ******************** //
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state ? location.state : {};
  const dispatch = useDispatch();
  const { user } = useAuth();

  // ******************** LOCAL STATE ******************** //

  const [openAlert, setOpenAlert] = useState(false);
  const [postError, setPostError] = useState(false);

  // //=============================SAVE==================================//

  const handleSave = async (values, setSubmitting) => {
    const data = {
      RecordID: 0,
      CompanyId: user.companyID,
      FromDate: "",
      ToDate: "",
      Name: values.name,
      Address1: values.address1,
      Address2: values.address2,
      City: values.city,
      State: values.state,
      Zip: values.zip,
      EmailID: values.email,
      Mobile: values.mobile,
      Provider: values.serviceProvider,
      Salesrepresentative: values.salesRepName,
    };
    console.log("🚀 ~ handleSave ~ values:", values);
    const response = await dispatch(quoteInfoData({ data }));
    console.log("🚀 ~ handleSave ~ response:", response);

    if (response.payload.status === "Y") {
      setOpenAlert(true);

      setTimeout(() => {
        setOpenAlert(false);
        setSubmitting(false);
        navigate("/pages/pricing-portal/quote", {
          state: {
            headerID: response.payload.RecordId,
            templateID: state.templateID ? state.templateID : 0,
            templateName: state.templateName ? state.templateName : "",
            accessID: "PPB005",
            name: "Quote",
          },
        });
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

  //=======================COMPANY===================================//
  const [selectedCompanyOptions, setSelectedCompanyOptions] = useState(
    user.companyID == 5
      ? { RecordID: 5, Name: "Plymouth" }
      : user.companyID == 6
        ? {
            RecordID: 6,
            Name: "S & J Food Distributors",
          }
        : {
            RecordID: 7,
            Name: "Nicky USA",
          }
  );

  const handleSelectionCompanyChange = (newValue) => {
    setSelectedCompanyOptions(newValue);
  };

  return (
    <Container>
      <Formik
        initialValues={{
          name: "",
          address1: "",
          address2: "",
          city: "",
          state: "",
          zip: "",
          email: "",
          mobile: "",
          serviceProvider: "",
          salesRepName: "",
          priceBookLevel: "",
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
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="breadcrumb">
              <Breadcrumb
                routeSegments={[{ name: "Quote" }, { name: "Prospect Info" }]}
              />
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
                <SingleAutocomplete
                  name="company"
                  id="company"
                  sx={{ gridColumn: "span 2" }}
                  multiple={false}
                  disabled={user.role != "ADMIN"}
                  value={selectedCompanyOptions}
                  onChange={handleSelectionCompanyChange}
                  label="Company"
                  url={`${process.env.REACT_APP_BASE_URL}Customer/GetAttribute?Attribute=Company`}
                />
                <TextField
                  variant="outlined"
                  name="salesRepName"
                  id="salesRepName"
                  label="Sales Reprasentative Name"
                  size="small"
                  sx={{ gridColumn: "span 2" }}
                  value={values.salesRepName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  // error={touched.salesRepName && Boolean(errors.salesRepName)}
                  // helperText={touched.salesRepName && errors.salesRepName}
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
                    sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
                  }}
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                  // autoFocus
                />
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
                  // error={touched.address1 && Boolean(errors.address1)}
                  // helperText={touched.address1 && errors.address1}
                />
                {/* <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  id="address2"
                  name="address2"
                  label="Address 2"
                  size="small"
                  sx={{ gridColumn: "span 2" }}
                  value={values.address2}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  // error={touched.address2 && Boolean(errors.address2)}
                  // helperText={touched.address2 && errors.address2}
                /> */}
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
                  // error={!!touched.city && !!errors.city}
                  // helperText={touched.city && errors.city}
                  // autoFocus
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
                  // error={touched.state && Boolean(errors.state)}
                  // helperText={touched.state && errors.state}
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
                  // error={touched.zip && Boolean(errors.zip)}
                  // helperText={touched.zip && errors.zip}
                />
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
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
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
                  // error={touched.mobile && Boolean(errors.mobile)}
                  // helperText={touched.mobile && errors.mobile}
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
                    id="demo-simple-select"
                    label="Price Book Type"
                  >
                    <MenuItem value={"AT&T"}>AT&T</MenuItem>
                    <MenuItem value={"V"}>Verizon</MenuItem>
                    <MenuItem value={"TM"}>T-Mobile</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  variant="outlined"
                  name="priceBookLevel"
                  id="priceBookLevel"
                  label="Price Book Level"
                  size="small"
                  sx={{ gridColumn: "span 2" }}
                  value={values.priceBookLevel}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  focused={true}
                  error={true}
                  inputProps={{ readOnly: true }}
                  // helperText={touched.serviceProvider && errors.serviceProvider}
                />
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
                    endIcon={<ArrowForwardIcon />} // Icon added here
                    sx={{ padding: "8px 16px" }}
                    type="submit"
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            </Paper>
          </form>
        )}
      </Formik>

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
      {/* <AlertDialog
        open={openAlert}
        error={postError}
        message={
          params.mode === "add"
            ? "Company added successfully"
            : params.mode === "delete"
              ? "Company Deleted Successfully"
              : "Company updated successfully"
        }
        Actions={
          params.mode === "add" ? (
            <DialogActions>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => navigate("/pages/company")}
              >
                Back to Company
              </Button>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  dispatch(getCompanyData({ ID: 0 }));
                  // setOpenAlert(false);
                }}
                autoFocus
              >
                Add New Company
              </Button>
            </DialogActions>
          ) : (
            <DialogActions>
              <Button
                variant="contained"
                color="info"
                size="small"
                onClick={() => navigate("/pages/company")}
              >
                Back to Company
              </Button>
            </DialogActions>
          )
        }
      /> */}
    </Container>
  );
};

export default QuoteEdit;
