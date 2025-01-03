import React, { useEffect } from "react";
import {
  Paper,
  Button,
  Box,
  styled,
  useTheme,
  useMediaQuery,
  TextField,
  Stack,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { Breadcrumb } from "app/components";
import { Formik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchgGetAItems } from "app/redux/slice/getSlice";
import { useDispatch, useSelector } from "react-redux";

// ********************** ICONS ********************** //
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CheckBox } from "@mui/icons-material";
import { postPriceListItems } from "app/redux/slice/postSlice";

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

// ********************** ITEM ATTRIBUTES EDIT SCREEN  ********************** //
const ItemAttributesEdit = () => {
  // ********************** HOOKS AND CONSTANTS ********************** //
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  const itemNumber = location.state.itemNumber.startsWith('@') ? location.state.itemNumber.slice(1) : location.state.itemNumber;

  // ********************** LOCAL STATE ********************** //

  // ********************** REDUX STATE ********************** //
  // const priceListAttStatus = useSelector(
  //   (state) => state.getSlice.priceListAttStatus
  // );
  // const priceListAttData = useSelector(
  //   (state) => state.getSlice.priceListAttData
  // );
  // console.log("🚀 ~ ItemAttributesEdit ~ priceListAttData:", priceListAttData);

  // ********************** USE EFFECT - PRICE LIST GET FUNCTION ********************** //
  // useEffect(() => {
  //   dispatch(fetchgGetAItems({ filter: itemNumber }));
  // }, []);


  const handleSave=async(values)=>{
    const idata={
      recordID: 0,
      itemNumber: "",
      printSequence: values.printSequence,
      comments: values.comments,
      printItem: ""
    };
    console.log("🚀 ~ handleSave ~ idata:", idata)
    
 
    // const response=await dispatch(postPriceListItems({idata}));
  }

  return (
    <Container>
      <Formik
        initialValues={{
          Name: "",
          priceListDescription: state.priceListDesc,
          itemNumber: itemNumber,
          itemDescription: state.itemDesc,
          brand: "",
          itemBuyer:"",
          alternateClass:"",
          secondaryClass: "",
          // qoh:,
          // comments:,
          // sequence:,
          // Psequence:
        }}
        enableReinitialize={true}
        onSubmit={(values)=> {
          // setTimeout(() => {
          //   if (params.mode === "delete") {
          //     setIsDelete(true);
          //   }
          //   if (params.mode === "add" || params.mode === "edit") {
          //     priceListSaveFn(values, setSubmitting);
          //   }
          // }, 400);
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
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="breadcrumb">
              <Breadcrumb
                routeSegments={[
                  { name: "Quote" },
                  { name: "Prospect Info" },
                  {
                    name: "New Quote",
                    path: -1,
                    // state: {itemNumber},
                  },
                  { name: "Item Attributes" },
                ]}
              />
              <Stack direction={"row"} gap={1}>
                <Button
                  variant="contained"
                  color="info"
                  size="small"
                  startIcon={<SaveIcon size="small" />}
                  type="submit"
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="info"
                  size="small"
                  startIcon={<ArrowBackIcon size="small" />}
                  onClick={() =>
                    navigate(
                      -1
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
                  

                  <Stack
                    sx={{ gridColumn: "span 2" }} direction="column" gap={2}
                  >
                    <Typography fontSize={"14px"} fontWeight={"bold"}>Items-Info</Typography>
                    {/* <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="Name"
                    name="Name"
                    label="Name"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    inputProps={{ readOnly: true }}
                    value={values.Name}
                    disabled={true}
                  /> */}
                  {/* <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="priceListDescription"
                    name="priceListDescription"
                    label="Price List Description"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    inputProps={{ readOnly: true }}
                    value={values.priceListDescription}
                    disabled={true}
                  /> */}

                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="itemNumber"
                    name="itemNumber"
                    label="Item Number"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    inputProps={{ readOnly: true }}
                    value={values.itemNumber}
                    disabled={true}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    id="itemDescription"
                    name="itemDescription"
                    label="Item Description"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    inputProps={{ readOnly: true }}
                    value={values.itemDescription}
                    disabled={true}
                  />
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      id="printSequence"
                      name="printSequence"
                      label="Brand"
                      size="small"
                      inputProps={{ readOnly: true }}
                      value={values.brand}
                      disabled={true}
                      sx={{ gridColumn: "span 2" }}
                      // error={!!touched.printSequence && !!errors.printSequence}
                      // helperText={touched.printSequence && errors.printSequence}
                    />
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      id="includeInPB"
                      name="includeInPB"
                      label="Item Buyer"
                      size="small"
                      inputProps={{ readOnly: true }}
                      value={values.itemBuyer}
                      disabled={true}
                      //   error={!!touched.includeInPB && !!errors.includeInPB}
                      //   helperText={touched.includeInPB && errors.includeInPB}
                    />
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      id="includeInPB"
                      name="includeInPB"
                      label="Alternate Class"
                      size="small"
                      inputProps={{ readOnly: true }}
                      disabled={true}
                      value={values.alternateClass}
                      sx={{ gridColumn: "span 2" }}
                      //   error={!!touched.includeInPB && !!errors.includeInPB}
                      //   helperText={touched.includeInPB && errors.includeInPB}
                    />
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      id="manualChangesOnly"
                      name="manualChangesOnly"
                      label="Secondary Class"
                      size="small"
                      inputProps={{ readOnly: true }}
                      sx={{ gridColumn: "span 2" }}
                      disabled={true}
                      value={values.secondaryClass}
                      //   error={!!touched.manualChangesOnly && !!errors.manualChangesOnly}
                      //   helperText={touched.manualChangesOnly && errors.manualChangesOnly}
                    />
                      <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      id="uofm"
                      name="uofm"
                      label="UOFM"
                      size="small"
                      
                      value={values.uofm}
                      disabled={true}
                      //   error={!!touched.includeInPB && !!errors.includeInPB}
                      //   helperText={touched.includeInPB && errors.includeInPB}
                    />
                    
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      id="qoh"
                      name="qoh"
                      label="Quantity on Hand"
                      size="small"
                      inputProps={{ readOnly: true }}
                      value={values.qoh}
                      disabled={true}
                      //   error={!!touched.includeInPB && !!errors.includeInPB}
                      //   helperText={touched.includeInPB && errors.includeInPB}
                    />
                    
                  </Stack>
                  <Stack
                    sx={{ gridColumn: "span 2" }} direction="column" gap={2}
                  >
                    <Typography fontSize={"14px"} fontWeight={"bold"}>Editable</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      id="comments"
                      name="comments"
                      label="Comments"
                      size="small"
                      // inputProps={{ readOnly: true }}
                      // disabled={true}
                      value={values.comments}
                      // sx={{ gridColumn: "span 2" }}
                      //   error={!!touched.includeInPB && !!errors.includeInPB}
                      //   helperText={touched.includeInPB && errors.includeInPB}
                    />
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      id="sequence"
                      name="sequence"
                      label="Sequence"
                      size="small"
                    
                      // sx={{ gridColumn: "span 2" }}
                      // disabled={true}
                      value={values.sequence}
                      //   error={!!touched.manualChangesOnly && !!errors.manualChangesOnly}
                      //   helperText={touched.manualChangesOnly && errors.manualChangesOnly}
                    />
                    <FormControlLabel
                      control={
                        <CheckBox
                          size="small"
                          id="Psequence"
                          name="Psequence"
                          checked={values.Psequence}
                          sx={{ height: "20px",ml:1}}
                          onChange={handleChange}
                         
                          
                        />
                      }
                      label="Print"
                    />
                    
                   
                  </Stack>
                </Box>
              </Paper>
           
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default ItemAttributesEdit;
