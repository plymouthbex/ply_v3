import {
  Box,
  LinearProgress,
  TextField,
  Typography,
  styled,
  useTheme,
  Checkbox,
  Stack,
  Button,
  useMediaQuery,
  FormControlLabel,
  RadioGroup,
  Radio,
  DialogActions,
  Tooltip,
  IconButton,
  Switch,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import React, { useMemo } from "react";
import { Breadcrumb, SimpleCard } from "app/components";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";

import { themeColors } from "app/components/baseTheme/themeColors";
import { useNavigate } from "react-router-dom";
import useAuth from "app/hooks/useAuth";
import {
  fetchListviewRunGroup,
  onCheckboxChange,
  runGrpMsgUpdate,
  runGrpProcessedDataUpdate,
} from "app/redux/slice/listviewSlice";
import {
  SingleAutocomplete,
  SingleAutocompleteRunGroup,
} from "app/components/AutoComplete";
import {
  CustomerAddPrintGroup,
  CustomerConfig,
  deletePriceBookGroup,
  runGroupDelete,
  runGroupMailData,
} from "app/redux/slice/postSlice";
import {
  getCustomerViewPriceCustomBook,
  getCustomerViewPriceCustomBookRun,
  getCustomerViewPriceFullBook,
  getCustomerViewPriceFullBookRun,
} from "app/redux/slice/priceListSlice";
import { pdf } from "@react-pdf/renderer";
import LoadingApiDialog, {
  PriceGroupAlertApiDialog,
  QuoteTempAlertApiDialog,
} from "app/components/LoadindgDialog";
import {
  exportToExcelBuildCustomPriceBookBlob,
  exportToExcelBuildFullPriceBookBlob,
} from "app/components/Template/Excel";
import { CustomerFullPriceDocument } from "app/components/Template/pdfs/CustomerFullPriceBook";
import { CustomerCustomPriceDocument } from "app/components/Template/pdfs/CustomerCustomPriceBook";
import {
  dataGridHeaderFooterHeight,
  dataGridPageSize,
  dataGridpageSizeOptions,
  dataGridRowHeight,
} from "app/utils/constant";
import { FormikCustomSelectPriceBookGroup } from "app/components/SingleAutocompletelist";
import { CusListRunGrpOptimizedAutocomplete } from "app/components/FormikAutocomplete";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "15px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "10px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

// Helper function to get the Saturday and Sunday of a given week (week starts on Sunday)
const getSaturdayAndSunday = (date) => {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  const sunday = new Date(date);
  sunday.setDate(date.getDate() - dayOfWeek);

  // Clone the Sunday date to avoid modifying the original object
  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);

  return { sunday, saturday };
};

// Format a date into MM/DD format (without year)
const formatDateShort = (date) => {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${month}/${day}`;
};

// Format a full date into MM/DD/YYYY format
const formatDateLong = (date) => {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export default function RunPriceBook() {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const { user, updateUser } = useAuth();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const colors = themeColors;

  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const [rowSelectionModel11, setRowSelectionModel11] = React.useState([]);
  
  const [rowSelectionModelRows, setRowSelectionModelRows] = React.useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isNextWeek, setIsNextWeek] = useState(false);

  useEffect(() => {
    dispatch(fetchListviewRunGroup({ runGroupID: user.defaultRunGroup })).then(
      (res) => {
        const allRowIds = res.payload.rows.map((row) => row.id);
        
        setRowSelectionModel(allRowIds);
      }
    );
    const today = new Date();
    setCurrentDate(today);
  }, []);
console.log("🚀 ~ RunPriceBook ~ rowSelectionModel11:", rowSelectionModel11);
  const getWeekDates = () => {
    const date = new Date(currentDate);

    // If we want the next week's dates, add 7 days to the current date
    if (isNextWeek) {
      date.setDate(date.getDate() + 7);
    }

    const { sunday, saturday } = getSaturdayAndSunday(date); // Get the Sunday and Saturday of the week
    return {
      sunday: formatDateLong(sunday), // Full date for Sunday (MM/DD/YYYY)
      saturday: formatDateLong(saturday), // Full date for Saturday (MM/DD/YYYY)
      shortSunday: formatDateShort(sunday), // Short format (MM/DD) for Sunday
      shortSaturday: formatDateShort(saturday), // Short format (MM/DD) for Saturday
      formatedDate: `Pricing Week  ${formatDateLong(sunday)} (Sun) to ${formatDateLong(saturday)} (Sat)`, // Full format Pricing Week (SUN)(MM/DD/YYYY) TO (SAT)(MM/DD/YYYY)
    };
  };

  const toggleWeek = () => {
    setIsNextWeek(!isNextWeek); // Toggle between next and current week
  };

  const { shortSunday, shortSaturday, sunday, saturday, formatedDate } =
    getWeekDates(); // Get formatted Saturday and Sunday dates

  const runGrpStatus = useSelector((state) => state.listview.runGrpStatus);
  const runGrpIsLoading = useSelector((state) => state.listview.runGrpLoading);
  const runGrpColumns = useSelector((state) => state.listview.runGrpColumnData);
  const runGrpRows = useSelector((state) => state.listview.runbGrpRowData);
  console.log("🚀 ~ RunPriceBook ~ runGrpRows:", runGrpRows)
  const filteredRows = runGrpRows.filter(row =>
    !row.fppdf && !row.fpexcel && !row.cppdf && !row.cpexcel
  );
  console.log("🚀 ~ RunPriceBook ~ filteredRows:", filteredRows)
  
  // If you only need the record IDs
  const filteredIds = filteredRows.map(row => row.id);
  console.log("🚀 ~ RunPriceBook ~ filteredIds:", filteredIds)
  const runGrpProcessingMsg = useSelector(
    (state) => state.listview.runGrpProcessingMsg
  );

  const runGroupMailState = useSelector(
    (state) => state.postData.runGroupMailState
  );
  const runGroupMailMessage = useSelector(
    (state) => state.postData.runGroupMailMessage
  );
  const runGroupMailLoading = useSelector(
    (state) => state.postData.runGroupMailLoading
  );
  const runGroupMailError = useSelector(
    (state) => state.postData.runGroupMailError
  );
  const runGroupMailIsAction = useSelector(
    (state) => state.postData.runGroupMailIsAction
  );
  const [isEmailButtonDisabled, setIsEmailButtonDisabled] = useState(false);

  const [isRemoveItem, setIsRemoveItem] = useState(false);
  const [openAlert6, setOpenAlert6] = useState(false);
  const [postError6, setPostError6] = useState(false);
  const [deleteID, setDeleteID] = useState(0);
  const [deleteCustomer, setDeleteCustomer] = useState("");
  
  const runGroupDeleteFn = async (values) => {
    try {
     
      dispatch(deletePriceBookGroup({
               Recordid:deleteID,
               CustomerNumber:deleteCustomer})).then((response) => {
        if (response.payload.status === "Y") {
          setPostError6(false);
          setOpenAlert6(true);
          setDeleteID(0);
          setDeleteCustomer("");
          dispatch(fetchListviewRunGroup({ runGroupID: selectedRunGrpOptions.Name })).then(
            (res) => {
              const allRowIds = res.payload.rows.map((row) => row.id);
              setRowSelectionModel(allRowIds);
            }
          );
        } else {
          setOpenAlert6(true);
          setPostError6(true);
          setDeleteID(0);
          setDeleteCustomer("");
        }
      });
    } catch (e) {
      console.log("🚀 ~ priceListSaveFn ~ e:", e);
    }
  };
  const columns = [
    {
      field: "customernumber",
      headerName: "Customer Number",
      minWidth: 200,
      // flex: 1,
    },
    {
      field: "customer",
      headerName: "Customer Name",
      minWidth: 400,
      // flex: 1,
    },
    {
      field: "customerFullPriceBook",
      headerName: "Full Price Book",
      width: 200,
      align: "left",
      headerAlign: "left",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      disableExport: true,
      renderCell: (params) => (
        <div>
          <Checkbox
            checked={params.row.fpexcel}
            onChange={(e) => {
              console.log(
                "🚀 ~ RunPriceBook ~ e.target.checked:",
                e.target.checked
              );
              if (
                user.role === "USER" &&
                (selectedRunGrpOptions.Name === user.defaultRunGroup ||
                  user.SalesReps.includes(selectedRunGrpOptions.Name))
              ) {
                dispatch(
                  CustomerConfig({
                    CustomerNumber: params.row.customernumber,
                    Type: "FullPriceBookExcel",
                    Value: e.target.checked ? "1" : "0",
                  })
                );
                dispatch(
                  onCheckboxChange({
                    id: params.row.id,
                    field: "fpexcel",
                    rows: runGrpRows,
                  })
                );
              } else if (user.role !== "USER") {
                dispatch(
                  CustomerConfig({
                    CustomerNumber: params.row.customernumber,
                    Type: "FullPriceBookExcel",
                    Value: e.target.checked ? "1" : "0",
                  })
                );
                dispatch(
                  onCheckboxChange({
                    id: params.row.id,
                    field: "fpexcel",
                    rows: runGrpRows,
                  })
                );
              }
            }}
            sx={{
              color: "#174c4f",
              "&.Mui-checked": {
                color: "#174c4f",
              },
            }}
          />
          Excel
          <Checkbox
            checked={params.row.fppdf}
            onChange={(e) => {
              if (
                user.role === "USER" &&
                (selectedRunGrpOptions.Name === user.defaultRunGroup ||
                  user.SalesReps.includes(selectedRunGrpOptions.Name))
              ) {
                dispatch(
                  CustomerConfig({
                    CustomerNumber: params.row.customernumber,
                    Type: "FullPriceBookPdf",
                    Value: e.target.checked ? "1" : "0",
                  })
                );
                dispatch(
                  onCheckboxChange({
                    id: params.row.id,
                    field: "fppdf",
                    rows: runGrpRows,
                  })
                );
              } else if (user.role !== "USER") {
                dispatch(
                  CustomerConfig({
                    CustomerNumber: params.row.customernumber,
                    Type: "FullPriceBookPdf",
                    Value: e.target.checked ? "1" : "0",
                  })
                );
                dispatch(
                  onCheckboxChange({
                    id: params.row.id,
                    field: "fppdf",
                    rows: runGrpRows,
                  })
                );
              }
            }}
            sx={{
              color: "#174c4f",
              "&.Mui-checked": {
                color: "#174c4f",
              },
            }}
          />
          PDF
        </div>
      ),
    },
    {
      field: "customerCustomPriceBook",
      headerName: "Custom Price Book",
      width: 200,
      align: "left",
      headerAlign: "left",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      disableExport: true,
      renderCell: (params) => (
        <div>
          <Checkbox
            checked={params.row.cpexcel}
            onChange={(e) => {
              if (
                user.role === "USER" &&
                (selectedRunGrpOptions.Name === user.defaultRunGroup ||
                  user.SalesReps.includes(selectedRunGrpOptions.Name))
              ) {
                dispatch(
                  CustomerConfig({
                    CustomerNumber: params.row.customernumber,
                    Type: "CustomrPriceBookExcel",
                    Value: e.target.checked ? "1" : "0",
                  })
                );
                dispatch(
                  onCheckboxChange({
                    id: params.row.id,
                    field: "cpexcel",
                    rows: runGrpRows,
                  })
                );
              } else if (user.role !== "USER") {
                dispatch(
                  CustomerConfig({
                    CustomerNumber: params.row.customernumber,
                    Type: "CustomrPriceBookExcel",
                    Value: e.target.checked ? "1" : "0",
                  })
                );
                dispatch(
                  onCheckboxChange({
                    id: params.row.id,
                    field: "cpexcel",
                    rows: runGrpRows,
                  })
                );
              }
            }}
            sx={{
              color: "#174c4f",
              "&.Mui-checked": {
                color: "#174c4f",
              },
            }}
          />
          Excel
          <Checkbox
            checked={params.row.cppdf}
            onChange={(e) => {
              if (
                user.role === "USER" &&
                (selectedRunGrpOptions.Name === user.defaultRunGroup ||
                  user.SalesReps.includes(selectedRunGrpOptions.Name))
              ) {
                dispatch(
                  CustomerConfig({
                    CustomerNumber: params.row.customernumber,
                    Type: "CustomPriceBookPdf",
                    Value: e.target.checked ? "1" : "0",
                  })
                );
                dispatch(
                  onCheckboxChange({
                    id: params.row.id,
                    field: "cppdf",
                    rows: runGrpRows,
                  })
                );
              } else if (user.role !== "USER") {
                dispatch(
                  CustomerConfig({
                    CustomerNumber: params.row.customernumber,
                    Type: "CustomPriceBookPdf",
                    Value: e.target.checked ? "1" : "0",
                  })
                );
                dispatch(
                  onCheckboxChange({
                    id: params.row.id,
                    field: "cppdf",
                    rows: runGrpRows,
                  })
                );
              }
            }}
            sx={{
              color: "#174c4f",
              "&.Mui-checked": {
                color: "#174c4f",
              },
            }}
          />
          PDF
        </div>
      ),
    },
    // {
    //   field: "Action",
    //   headerName: "Action",
    //   minWidth: 100,
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    //   sortable: false,
    //   filterable: false,
    //   disableColumnMenu: true,
    //   disableExport: true,
    //   renderCell: (params1) => (
    //     <Tooltip title="Delete">
    //       <IconButton
    //         color="error"
    //         size="small"
    //         onClick={(e) => {
    //           if (
    //             user.role === "USER" &&
    //             (selectedRunGrpOptions.Name === user.defaultRunGroup ||
    //               user.SalesReps.includes(selectedRunGrpOptions.Name))
    //           ) {
    //             setDeleteID(params1.row.id);
    //             setDeleteCustomer(params1.row.customernumber);
    //             setIsRemoveItem(true);
    //           } else if (user.role !== "USER") {
    //             setDeleteID(params1.row.id);
    //           setDeleteCustomer(params1.row.customernumber);
    //           setIsRemoveItem(true);
    //           }
    //         }}
           
    //       >
    //         <DeleteIcon color="error" fontSize="small" />
    //       </IconButton>
    //     </Tooltip>
    //   ),
    // },
  ];

  const [selectedRunGrpOptions, setSelectedRunGrpOptions] = useState(
    user.defaultRunGroup
      ? {
          Name: user.defaultRunGroup,
        }
      : null
  );

  // const handleSelectionRunGrpChange = (newValue) => {
  //   setSelectedRunGrpOptions(newValue);
  //   if (newValue) {
  //     dispatch(fetchListviewRunGroup({ runGroupID: newValue.Name })).then(
  //       (res) => {
  //         const allRowIds = res.payload.rows.map((row) => row.id);
  //         setRowSelectionModel(allRowIds);
  //       }
  //     );
  //   }
  //   setShowFiltered(false);
  // };
  const handleSelectionRunGrpChange = (newValue) => {
    setSelectedRunGrpOptions(newValue);
    setIsEmailButtonDisabled(false); // Re-enable button on selection change
  
    if (newValue) {
      dispatch(fetchListviewRunGroup({ runGroupID: newValue.Name })).then((res) => {
        const allRowIds = res.payload.rows.map((row) => row.id);
        setRowSelectionModel(allRowIds);
      });
    }
  
    setShowFiltered(false);
  };
  

  const [openAlert, setOpenAlert] = useState(false);
  const [postError, setPostError] = useState(null);

  const [showFiltered, setShowFiltered] = useState(false);
  const data = runGrpRows
  .filter(
    (v) =>
     v.fppdf || v.fpexcel || v.cppdf || v.cpexcel
  );
  console.log("🚀 ~ fnRunGrpEmailProcess ~ data:", data);

  const displayDataRows = showFiltered ? data : runGrpRows;

  console.log("🚀 ~ Displayed Data:", displayDataRows);
  const fnRunGrpEmailProcess = async () => {
    // if (!selectedRunGrpOptions) {
    //   setOpenAlert(true);
    //   setPostError("Please Select Price Book Group");
    //   return;
    // }
    // if (rowSelectionModel.length == 0) {
    //   setOpenAlert(true);
    //   setPostError("Please Select Customer");
    //   return;
    // }
    const data = runGrpRows
     
      .filter(
        (v) =>
         v.fppdf || v.fpexcel || v.cppdf || v.cpexcel
      )
      .map((v) => ({
        id: v.id,
        CustomerNumber: v.customernumber,
        FullPriceBookPdf: v.fppdf ? "1" : "0",
        FullPriceBookExcel: v.fpexcel ? "1" : "0",
        CustomPriceBooPdf: v.cppdf ? "1" : "0",
        CustomPriceBookExcel: v.cpexcel ? "1" : "0",
        FromDate: sunday,
        ToDate: saturday,
        UserID: user.id,
        CompnayID: user.companyID,
        CompanyCode: user.companyCode,
        TemplateID: "",
        ShowPrice:showPrice,
      }));
      console.log("🚀 ~ fnRunGrpEmailProcess ~ data:", data);
    try {
      const response = await dispatch(runGroupMailData({ data }));

      if (response.payload.status === "Y") {
        setOpenAlert(true);
        setIsEmailButtonDisabled(true);
      } else {
        setOpenAlert(true);
        setPostError(response.payload.message);
      }
    } catch (error) {
      setOpenAlert(true);
      setPostError("Something went wrong and please try again");
      console.error("Error during HandleSave:", error);
    }
  };

  const [processLoading, setProcessLoading] = useState(false);
  const [processFunLoading, setProcessFunLoading] = useState(false);
  const [processError, setProcessError] = useState(false);
  const [showPrice, setShowprice] = useState(true);

  const fnProcess = () => {
    if (!selectedRunGrpOptions) {
      setProcessFunLoading(false);
      setProcessLoading(true);
      setProcessError(true);
      dispatch(runGrpMsgUpdate("Please Select Price Book Group"));
      setTimeout(() => {
        setProcessLoading(false);
        dispatch(runGrpMsgUpdate(""));
        setProcessError(false);
      }, 2000);
      return;
    }
    if (rowSelectionModel.length === 0) {
      setProcessFunLoading(false);
      setProcessLoading(true);
      setProcessError(true);
      dispatch(runGrpMsgUpdate("Please Select Customer"));
      setTimeout(() => {
        setProcessLoading(false);
        dispatch(runGrpMsgUpdate(""));
        setProcessError(false);
      }, 2000);
      return;
    }

    setProcessLoading(true);
    setProcessFunLoading(true);

    const processData = new Promise((resolve, reject) => {
      try {
        const promises = runGrpRows
          .map((row) => {
            const promisesForRow = [];

            // Handle `fp` case
            if (
              (row.fpexcel || row.fppdf) &&
              rowSelectionModel.includes(row.id)
            ) {
              const fpPromise = dispatch(
                getCustomerViewPriceFullBookRun({
                  CompanyCode: user.companyCode,
                  FromDate: sunday,
                  ToDate: saturday,
                  CustomerNumber: row.customernumber,
                })
              ).then((fpResData) => {
                if (fpResData.payload.length > 0) {
                  dispatch(runGrpMsgUpdate(`Full PDF for ${row.customer}...`));
                  const excelBlobfp = exportToExcelBuildFullPriceBookBlob({
                    excelData: fpResData.payload,
                    date: formatedDate,
                    customerName: row.customer,
                    isPrice: row.selected,
                  });

                  return pdf(
                    <CustomerFullPriceDocument
                      key={row.id}
                      data={fpResData.payload}
                      coverPageData={{
                        logo: user.homePagelogo, // Replace with the actual path to the logo image
                        subtitle1: "Price list for",
                        subtitle2: row.customer,
                        effectiveDate: formatedDate,
                        preparedByName: user.name,
                        preparedByPhone: user.userMobile,
                        preparedByEmail: user.email,
                        phone1: user.phone1,
                        phone2: user.phone2,
                        fax: user.fax,
                        coverImg: user.customerFullPriceBookImg,
                      }}
                      isPrice={showPrice}
                    />
                  )
                    .toBlob()
                    .then((blob) => ({
                      ...row,
                      blobfp: blob,
                      excelBlobfp,
                      fileName1: `${user.company}_${row.customer.replace(
                        /\.$/,
                        ""
                      )}_FPB_${sunday} TO ${saturday}`,
                      sunday,
                      saturday,
                    }));
                }
                return null; // Invalid `fp`
              });

              promisesForRow.push(fpPromise);
            }

            // Handle `cp` case
            if (
              (row.cpexcel || row.cppdf) &&
              rowSelectionModel.includes(row.id)
            ) {
              const cpPromise = dispatch(
                getCustomerViewPriceCustomBookRun({
                  CompanyCode: user.companyCode,
                  FromDate: sunday,
                  ToDate: saturday,
                  CustomerNumber: row.customernumber,
                  filterparameters: "",
                })
              ).then((cpResData) => {
                if (cpResData.payload.length > 0) {
                  dispatch(
                    runGrpMsgUpdate(`Custom PDF for ${row.customer}...`)
                  );
                  const excelBlobcp = exportToExcelBuildCustomPriceBookBlob({
                    excelData: cpResData.payload,
                    date: formatedDate,
                    customerName: row.customer,
                    isPrice: row.selected,
                  });

                  return pdf(
                    <CustomerCustomPriceDocument
                      key={row.id}
                      data={cpResData.payload}
                      headerData={{
                        logo: user.homePagelogo,
                        customerName: row.customer,
                        effectiveDate: formatedDate,
                      }}
                      coverPageData={{
                        logo: user.homePagelogo, // Replace with the actual path to the logo image
                        subtitle1: "Price list for",
                        subtitle2: row.customer,
                        effectiveDate: formatedDate,
                        preparedByName: user.name,
                        preparedByPhone: user.userMobile,
                        preparedByEmail: user.email,
                        phone1: user.phone1,
                        phone2: user.phone2,
                        fax: user.fax,
                        coverImg: user.customerCustomPriceBookImg,
                      }}
                      isPrice={showPrice}
                    />
                  )
                    .toBlob()
                    .then((blob) => ({
                      ...row,
                      blobcp: blob,
                      excelBlobcp,
                      fileName2: `${user.company}_${row.customer.replace(
                        /\.$/,
                        ""
                      )}_CPB_${sunday} TO ${saturday}`,
                      sunday,
                      saturday,
                    }));
                }
                return null; // Invalid `cp`
              });

              promisesForRow.push(cpPromise);
            }

            if (promisesForRow.length > 0) {
              return Promise.all(promisesForRow).then((results) => {
                // Merge results into a single object
                const finalResult = results.reduce((acc, result) => {
                  return result ? { ...acc, ...result } : acc;
                }, {});

                // Remove rows if both `fp` and `cp` failed
                if (!finalResult.blobfp && !finalResult.blobcp) {
                  return null;
                }

                return finalResult;
              });
            }

            return null; // Skip rows with no valid promises
          })
          .filter(Boolean); // Remove null values

        Promise.allSettled(promises)
          .then((results) =>
            resolve(
              results
                .filter(
                  (result) => result.status === "fulfilled" && result.value
                )
                .map((result) => result.value)
            )
          )
          .catch(reject);
      } catch (error) {
        reject(error);
      }
    });

    dispatch(runGrpMsgUpdate("Initiating..."));

    processData
      .then((result) => {
      console.log("🚀 ~ .then ~ result:", result)
      // return;
        
        if (result.length > 0) {
          setProcessFunLoading(false);
          dispatch(runGrpMsgUpdate(`Successfully Processed`));
          dispatch(runGrpProcessedDataUpdate(result));
          setTimeout(() => {
            setProcessLoading(false);
            navigate("./send-run-price-book");
            dispatch(runGrpMsgUpdate(""));
          }, 1500);
        } else {
          setProcessFunLoading(false);
          setProcessError(true);
          dispatch(runGrpMsgUpdate(`No Data Found`));
          dispatch(runGrpProcessedDataUpdate(result));
          setTimeout(() => {
            setProcessLoading(false);
            setProcessError(false);
            dispatch(runGrpMsgUpdate(""));
          }, 1500);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setProcessFunLoading(false);
        setProcessError(true);
        dispatch(runGrpMsgUpdate(`${error.message}`));
        setTimeout(() => {
          setProcessLoading(false);
          dispatch(runGrpMsgUpdate(""));
          setProcessError(false);
        }, 1500);
      });
  };

  const [openAlert1, setOpenAlert1] = useState(false);
  const [postError1, setPostError1] = useState(false);
  const [isCustomerListExistsError, setIsCustomerListExistsError] =
    useState(false);
  const [addCustomerListData, setAddCustomerListData] = useState([]);
  const handleSelectionAddCustomerListData = (e, newValue) => {
    setAddCustomerListData(newValue);
  };

  //=================================TOOLBAR=====================================//
  const SecondaryCustomToolbar = React.memo(() => {
    return (
      <Box>
        {/* Second Row */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            padding: 1,
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mr: { xs: 0, md: 5 },
              mb: { md: 0 },
              color: "black",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            Price Book Group
          </Typography>
          <GridToolbarQuickFilter sx={{ width: 200 }} />
        </Box>
      </Box>
    );
  });

  const handleAddCustomers = async () => {
    if (!selectedRunGrpOptions) {
      setOpenAlert1(true);
      setPostError1("Please Select Price Book Group");
      return;
    }
    if (addCustomerListData.length > 0) {
      const response = await dispatch(
        CustomerAddPrintGroup({
          data: addCustomerListData,
          PriceBookGroup: selectedRunGrpOptions
            ? selectedRunGrpOptions.Name
            : "",
        })
      );
      if (response.payload.status === "Y") {
        dispatch(
          fetchListviewRunGroup({ runGroupID: selectedRunGrpOptions.Name })
        ).then((res) => {
          const allRowIds = res.payload.rows.map((row) => row.id);
          setRowSelectionModel(allRowIds);
        });
        setOpenAlert1(true);
        setAddCustomerListData([]);
      } else {
        setOpenAlert1(true);
        setPostError1(response.payload.message);
      }
    } else {
      setIsCustomerListExistsError(true);
      setTimeout(() => {
        setIsCustomerListExistsError(false);
      }, 2000);
    }
  };
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: "Price Book" },
            { name: "Print Price Book Group" },
          ]}
        />
      </Box>
      <SimpleCard>
        <Box>
          {/* First Row */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              mb: 2, // Add margin-bottom for spacing between rows
            }}
          >
            {/* Price Week Section */}
            <Stack direction="row-reverse" gap={5}>
              <Typography
                variant="caption"
                align="center"
                alignItems="center"
                alignSelf="center"
              >
                {formatedDate}
              </Typography>
              <RadioGroup
                row
                name="week"
                value={isNextWeek}
                onChange={toggleWeek}
              >
                <FormControlLabel
                  sx={{ height: 40 }}
                  value={false}
                  control={<Radio />}
                  label="Current Week"
                />
                <FormControlLabel
                  sx={{ height: 40 }}
                  value={true}
                  control={<Radio />}
                  label="Next Week"
                />
              </RadioGroup>
            </Stack>

            {/* Label with Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={showPrice}
                  onChange={(e) => setShowprice(e.target.checked)}
                  sx={{
                    color: "#174c4f",
                    "&.Mui-checked": {
                      color: "#174c4f",
                    },
                  }}
                />
              }
              label="Show Price"
            />
            {/* <Stack direction="row" gap={2}  justifyContent={"flex-end"}>
              <SingleAutocomplete
              sx={{ width: 200 }}
                focused
                fullWidth
                required
                name="rungroup"
                id="rungroup"
                value={selectedRunGrpOptions}
                onChange={handleSelectionRunGrpChange}
                label="Price Book Group"
                url={`${process.env.REACT_APP_BASE_URL}PriceBookDirectory/GetRungroupByCompany?CompanyCode=${user.companyCode}`}
              />
              <CusListRunGrpOptimizedAutocomplete
                sx={{ width: 350 }}
                errors={isCustomerListExistsError}
                helper={isCustomerListExistsError && "Please select customer!"}
                name="customerPriceList"
                id="customerPriceList"
                value={addCustomerListData}
                onChange={handleSelectionAddCustomerListData}
                label="Customers"
                url={`${
                  process.env.REACT_APP_BASE_URL
                }CustomerPriceList/CustomerPriceList?CompanyCode=${
                  user.companyCode
                }&PriceBookGroup=${
                  selectedRunGrpOptions ? selectedRunGrpOptions.Name : ""
                }`}
                addedCustomers={[]} // Pass added customers to exclude them
              />
            </Stack> */}
          </Box>

          {/* Second Row */}
          <Box
  sx={{
    display: "flex",
    flexDirection: "row",
    // alignItems: "center",
    width: "100%",
    padding: 1,
    justifyContent: "space-between",
    gap: 2, // Slightly increased for visual clarity
  }}
>
  <SingleAutocomplete
    fullWidth
    required
    name="rungroup"
    id="rungroup"
    value={selectedRunGrpOptions}
    onChange={handleSelectionRunGrpChange}
    label="Price Book Group"
    url={`${process.env.REACT_APP_BASE_URL}PriceBookDirectory/GetRungroupByCompany?ComapnyID=${user.companyID}`}
  />
   <Stack
                direction="row"
                width={"100%"}
                gap={2}
                justifyContent={"flex-start"}
              >
  <FormControlLabel

    control={
      <Switch
        checked={showFiltered}
        onChange={() => setShowFiltered((prev) => !prev)}
        color="primary"
      />
    }
    label="Show Only Customers Configured"
  />
  </Stack>
</Box>
</Box>
            {/* {(user.defaultRunGroup ==
              (selectedRunGrpOptions ? selectedRunGrpOptions.Name : "") &&
              user.role == "USER") ||
            (user.SalesReps.includes(
              selectedRunGrpOptions ? selectedRunGrpOptions.Name : ""
            ) &&
              user.role == "USER") ||
            user.role != "USER" ? (
              <Stack
                direction="row"
                width={"100%"}
                gap={2}
                justifyContent={"flex-end"}
              >
                {/* <CusListRunGrpOptimizedAutocomplete
                  sx={{ width: "100%" }}
                  errors={isCustomerListExistsError}
                  helper={
                    isCustomerListExistsError && "Please select customer!"
                  }
                  name="customerPriceList"
                  id="customerPriceList"
                  value={addCustomerListData}
                  onChange={handleSelectionAddCustomerListData}
                  label="Unassigned Customers"
                  url={`${
                    process.env.REACT_APP_BASE_URL
                  }CustomerPriceList/CustomerPriceList?CompanyID=${
                    user.companyID
                  }&PriceBookGroup=${
                    selectedRunGrpOptions ? selectedRunGrpOptions.Name : ""
                  }`}
                  addedCustomers={runGrpRows} // Pass added customers to exclude them
                /> */}
                {/* <Button
               
                sx={{ width: 200, height: 40, gridColumn: "span 1" }}
                variant="contained"
                color="info"
                size="small"
                onClick={handleAddCustomers}
                startIcon={<Add size="small" />}
              >
                Add Customers
              </Button> */}
                {/* <Tooltip title="Add Customers">
                  <IconButton
                    sx={{ height: 37.6 }}
                    color="info"
                    onClick={handleAddCustomers}
                  >
                    <Add
                      sx={{
                        fontSize: 30, // Increased icon size
                        color: theme.palette.success.main,
                      }}
                    />
                  </IconButton> 
                </Tooltip>
              </Stack>
            ) : (
              <Stack width={"100%"}></Stack>
            )} */}
          {/* </Box> */}
       
        <Box
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: "black",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blue.palette.info.main,
              color: colors.blue.palette.info.contrastText,
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.blueDark.palette.info.main,
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blue.palette.info.main,
              color: colors.blue.palette.info.contrastText,
            },
            "& .MuiCheckbox-root": {
              color: "#174c4f !important",
            },

            "& .MuiCheckbox-root.Mui-checked": {
              color: "#174c4f !important",
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
            "& .MuiDataGrid-row:nth-of-type(even)": {
              backgroundColor: theme.palette.action.hover,
            },

            "& .MuiDataGrid-row:nth-of-type(odd)": {
              backgroundColor: theme.palette.background.default,
            },
            '& .MuiDataGrid-row:hover': {
                border: '3px solid #999999',
                // border: `1px solid #${theme.palette.action.selected} !important`, // Change border color on hover
                borderRadius: '4px', // Optional: Add rounded corners
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
              height: "500px",
            }}
            slots={{
              loadingOverlay: LinearProgress,
              toolbar: SecondaryCustomToolbar,
            }}
            // onRowSelectionModelChange={(newRowSelectionModel) => {
            //   // const filterArray = runGrpRows.filter((v) =>
            //   //   newRowSelectionModel.includes(v.id)
            //   // );
            //   setRowSelectionModel(newRowSelectionModel);
            //   // setRowSelectionModelRows(filterArray);
            // }}
            // rowSelectionModel={rowSelectionModel}
            rows={displayDataRows}
            columns={columns}
            loading={runGrpIsLoading}
            // checkboxSelection
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
            initialState={{
              pagination: { paginationModel: { pageSize: dataGridPageSize } },
            }}
            rowHeight={dataGridRowHeight}
            pageSizeOptions={dataGridpageSizeOptions}
            columnVisibilityModel={{
              Action: user.role !== "USER" ?  true :  user.role === "USER" && (selectedRunGrpOptions ?selectedRunGrpOptions.Name === user.defaultRunGroup: false) ?  true : user.role === "USER" && ( user.SalesReps.includes(selectedRunGrpOptions? selectedRunGrpOptions.Name : "")) ?  true : false
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

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
          mt={2}
        >
          {/* Note or Placeholder on the left side */}

          <Box
            sx={{
              display: "flex",

              alignItems: "center",

              padding: 2,

              //border: rowSelectionModel.length > 5 ? "1px solid red" : "none",

              borderRadius: 1,

              // backgroundColor:
              //   rowSelectionModel.length > 5 ? "#ffe6e6" : "transparent",

              minHeight: 50, // Ensure consistent height

              minWidth: 300, // Ensure consistent width
            }}
          >
            {/* {rowSelectionModel.length > 5 && (
              <Typography color="error" align="center">
                Note: To View Price Book, select no more than 5 rows at a time
              </Typography>
            )} */}
          </Box>

          {/* Buttons on the right side */}

          <Stack direction="row" justifyContent="end" gap={2}>
          <Button
  variant="contained"
  disabled={isEmailButtonDisabled}
  sx={{
    "&:hover": {
      backgroundColor: theme.palette.secondary.light,
    },
    color: theme.palette.secondary.contrastText,
    bgcolor: theme.palette.secondary.light,
    fontWeight: "bold",
  }}
  onClick={fnRunGrpEmailProcess}
>
  Email Price Book(s)
</Button>
            {/* <Button
              variant="contained"
              sx={{
                "&:hover": {
                  backgroundColor: theme.palette.secondary.light, // Custom hover color
                },

                color: theme.palette.secondary.contrastText,

                bgcolor: theme.palette.secondary.light,

                fontWeight: "bold",
              }}
              onClick={fnRunGrpEmailProcess}
            >
              Email Price Book(s)
            </Button> */}

            <PriceGroupAlertApiDialog
              logo={`data:image/png;base64,${user.logo}`}
              open={openAlert}
              error={postError}
              message={
                postError
                  ? postError
                  : "Customer(s) will receive their Price Book shortly"
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
                      setOpenAlert(false);

                      setTimeout(() => {
                        setPostError(null);
                      }, 1000);
                    }}
                    sx={{ height: 25 }}
                  >
                    Close
                  </Button>
                </Box>
              }
            />

            <LoadingApiDialog
              logo={`data:image/png;base64,${user.logo}`}
              open={processLoading}
              message={runGrpProcessingMsg}
              loading={processFunLoading}
              error={processError}
            />
            <QuoteTempAlertApiDialog
              logo={`data:image/png;base64,${user.logo}`}
              open={isRemoveItem}
              //  tittle={values.itemDescription}
              error={true}
              message={`Are you sure you want to delete the Customer?`}
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
                      setIsRemoveItem(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    sx={{ height: 25 }}
                    variant="contained"
                    color="info"
                    size="small"
                    onClick={() => {
                      runGroupDeleteFn();
                      setIsRemoveItem(false);
                    }}
                  >
                    Confirm
                  </Button>
                </Box>
              }
            />

            {/* <Button
              variant="contained"
              disabled={rowSelectionModel.length > 5}
              sx={{
                "&:hover": {
                  backgroundColor: theme.palette.secondary.light, // Custom hover color
                },

                color: theme.palette.secondary.contrastText,

                bgcolor: theme.palette.secondary.light,

                fontWeight: "bold",
              }}
              onClick={fnProcess}
            >
              View Price Book
            </Button> */}
          </Stack>
        </Stack>

        <PriceGroupAlertApiDialog
          logo={`data:image/png;base64,${user.logo}`}
          open={openAlert1}
          error={postError1}
          message={postError1 ? postError1 : "Customer(s) added successfully"}
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
                sx={{ height: 25 }}
              >
                Close
              </Button>
            </Box>
          }
        />
      </SimpleCard>
    </Container>
  );
}
