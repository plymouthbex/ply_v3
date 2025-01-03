import React, { useEffect, useState } from "react";
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
  Checkbox,
  DialogActions,
} from "@mui/material";
import { Breadcrumb } from "app/components";
import { Formik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchgGetAItems, getPriceListItemGet } from "app/redux/slice/getSlice";
import { useDispatch, useSelector } from "react-redux";

// ********************** ICONS ********************** //
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DeleteAdHocItem,
  postPriceListItems,
  PutAdHocItem,
} from "app/redux/slice/postSlice";
import AlertDialog, { MessageAlertDialog } from "app/components/AlertDialog";
// import { AlertDialog } from "@toolpad/core";

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
  const itemNumber = location.state.itemNumber.startsWith("@")
    ? location.state.itemNumber.slice(1)
    : location.state.itemNumber;

  // ********************** LOCAL STATE ********************** //

  // ********************** REDUX STATE ********************** //
  const priceListAttStatus = useSelector(
    (state) => state.getSlice.priceListAttStatus
  );
  const priceListAttData = useSelector(
    (state) => state.getSlice.priceListAttData
  );

  // ********************** USE EFFECT - PRICE LIST GET FUNCTION ********************** //
  useEffect(() => {
    dispatch(
      getPriceListItemGet({ itemNumber: itemNumber, id: state.priceListID })
    );
  }, []);

  const [openAlert1, setOpenAlert1] = useState(false);
  const [postError1, setPostError1] = useState(false);
  const itemSaveFn = async (values) => {
    const data = {
      priceListID: state.priceListID,
      quotationRecordID: "0",
      filterType: "PL",
      itemNo: itemNumber,
      printSequence: values.sequence,
      printItem: values.printItem ? "1" : "0",
      comment: values.comments,
    };

    const response = await dispatch(PutAdHocItem({ data }));
    if (response.payload.status === "Y") {
      setOpenAlert1(true);
    } else {
      setOpenAlert1(true);
      setPostError1(true);
    }
  };
  const [isRemoveItem, setIsRemoveItem] = useState(false);
  const [openAlert2, setOpenAlert2] = useState(false);
  const [postError2, setPostError2] = useState(false);
  const itemDeleteFn = async (values) => {
    const data = {
      priceListID: `${state.priceListID}`,
      quotationRecordID: "0",
      filterType: "PL",
      itemNo: itemNumber,
      printSequence: values.sequence,
      printItem: values.printItem ? "1" : "0",
      comment: values.comments,
    };
    console.log("🚀 ~ itemDeleteFn ~ data:", data);

    const response = await dispatch(DeleteAdHocItem({ data }));
    if (response.payload.status === "Y") {
      setOpenAlert2(true);
    } else {
      setOpenAlert2(true);
      setPostError2(true);
    }
  };

  return (
    <Container>
      <Formik
        initialValues={{
          priceListID: state.priceListID,
          priceListDescription: state.priceListDesc,
          itemNumber: itemNumber,
          itemDescription: state.itemDesc,
          brand: priceListAttData.Brand,
          itemBuyer: priceListAttData.Item_Buyer,
          alternateClass: priceListAttData.Alternate_Class_1,
          secondaryClass: priceListAttData.Secondary_Class,
          qoh: priceListAttData.PI_QTYONHND,
          comments: priceListAttData.PI_COMMENT,
          sequence: priceListAttData.PI_PRINTSEQUENCE,
          uofm: priceListAttData.UOfM,
          printItem: priceListAttData.PI_PRINTITEM == 1 ? true : false,
          // === "Y" ? true : false
        }}
        enableReinitialize={true}
        onSubmit={(values) => {
          params.itemMode === "edit"
            ? itemSaveFn(values)
            : setIsRemoveItem(true);
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
                  { name: "Price Book" },
                  { name: "Price List", path: "/pages/price-list" },
                  {
                    name: `${params.mode} Price List Detail`,
                    path: -1,
                    state: { itemNumber },
                  },
                  { name: `${params.itemMode} Item Attributes` },
                ]}
              />
              <Stack direction={"row"} gap={1}>
                {params.itemMode === "edit" ? (
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    startIcon={<SaveIcon size="small" />}
                    type="submit"
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    startIcon={<DeleteIcon color="error" size="small" />}
                    type="submit"
                  >
                    Delete
                  </Button>
                )}
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

            {priceListAttStatus === "fulfilled" ? (
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
                    sx={{ gridColumn: "span 2" }}
                    direction="column"
                    gap={2}
                  >
                    <Typography fontSize={"14px"} fontWeight={"bold"}>
                      Items-Info
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="text"
                      id="priceListID"
                      name="priceListID"
                      label="Price List ID"
                      size="small"
                      sx={{ gridColumn: "span 2" }}
                      inputProps={{ readOnly: true }}
                      value={values.priceListID}
                      disabled={true}
                    />
                    <TextField
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
                    />

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
                    sx={{ gridColumn: "span 2" }}
                    direction="column"
                    gap={2}
                  >
                    <Typography fontSize={"14px"} fontWeight={"bold"}>
                      Editable
                    </Typography>
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
                      onChange={handleChange}
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
                      onChange={handleChange}
                      // sx={{ gridColumn: "span 2" }}
                      // disabled={true}
                      value={values.sequence}
                      //   error={!!touched.manualChangesOnly && !!errors.manualChangesOnly}
                      //   helperText={touched.manualChangesOnly && errors.manualChangesOnly}
                    />
                    <FormControlLabel
                      sx={{ height: "10px", ml: 1 }}
                      control={
                        <Checkbox
                          size="small"
                          id="printItem"
                          name="printItem"
                          checked={values.printItem}
                          onChange={handleChange}
                        />
                      }
                      label="Print"
                    />
                  </Stack>
                </Box>
                <AlertDialog
                  key={23131}
                  open={openAlert1}
                  error={postError1}
                  message={"Item Saved Successfully!"}
                  Actions={
                    <DialogActions>
                      <Button
                        variant="contained"
                        color="info"
                        size="small"
                        onClick={() => {
                          navigate(-1);
                        }}
                      >
                        Back
                      </Button>
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
                  key={23131}
                  open={openAlert2}
                  error={postError2}
                  message={"Item Deleted Successfully!"}
                  Actions={
                    <DialogActions>
                      <Button
                        variant="contained"
                        color="info"
                        size="small"
                        onClick={() => {
                          navigate(-1);
                        }}
                      >
                        Back
                      </Button>
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

                <MessageAlertDialog
                  open={isRemoveItem}
                  tittle={values.itemDescription}
                  message={`Are you sure you want to remove Item ?`}
                  Actions={
                    <DialogActions>
                      <Button
                        variant="contained"
                        color="info"
                        size="small"
                        onClick={() => {
                          itemDeleteFn(values);
                          setIsRemoveItem(false);
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
                        }}
                      >
                        No
                      </Button>
                    </DialogActions>
                  }
                />
              </Paper>
            ) : (
              false
            )}
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default ItemAttributesEdit;
