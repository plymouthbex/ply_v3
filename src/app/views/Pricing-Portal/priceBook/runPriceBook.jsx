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
} from "@mui/material";
import React from "react";
import { Breadcrumb, SimpleCard } from "app/components";
import { useEffect, useState } from "react";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
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
import { SingleAutocomplete, SingleAutocompleteRunGroup } from "app/components/AutoComplete";
import { runGroupMailData } from "app/redux/slice/postSlice";
import {
  getCustomerViewPriceCustomBook,
  getCustomerViewPriceFullBook,
} from "app/redux/slice/priceListSlice";
import { pdf } from "@react-pdf/renderer";
import LoadingApiDialog, {
  PriceGroupAlertApiDialog,
} from "app/components/LoadindgDialog";
import {
  exportToExcelBuildCustomPriceBookBlob,
  exportToExcelBuildFullPriceBookBlob,
} from "app/components/Template/Excel";
import { CustomerFullPriceDocument } from "app/components/Template/pdfs/CustomerFullPriceBook";
import { CustomerCustomPriceDocument } from "app/components/Template/pdfs/CustomerCustomPriceBook";
import { dataGridHeaderFooterHeight } from "app/utils/constant";

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
  const [rowSelectionModelRows, setRowSelectionModelRows] = React.useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isNextWeek, setIsNextWeek] = useState(false);

  useEffect(() => {
    dispatch(fetchListviewRunGroup({ runGroupID: user.defaultRunGroup })).then(
      (res) => {
        console.log("🚀 ~ dispatch ~ res:", res);

        const allRowIds = res.payload.rows.map((row) => row.id);
        setRowSelectionModel(allRowIds);
      }
    );
    const today = new Date();
    setCurrentDate(today);
  }, []);

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
      formatedDate: `Pricing Week (SUN)${formatDateLong(
        sunday
      )} TO (SAT)${formatDateLong(saturday)}`, // Full format Pricing Week (SUN)(MM/DD/YYYY) TO (SAT)(MM/DD/YYYY)
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
  console.log("🚀 ~ )}TO ~ runGrpRows:", runGrpRows)
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
            onChange={() => {
              if (
                user.role === "USER" &&
                selectedRunGrpOptions.Name === user.defaultRunGroup
              ) {
                dispatch(
                  onCheckboxChange({
                    id: params.row.id,
                    field: "fpexcel",
                    rows: runGrpRows,
                  })
                );
              } else if (user.role !== "USER") {
                dispatch(
                  onCheckboxChange({
                    id: params.row.id,
                    field: "fpexcel",
                    rows: runGrpRows,
                  })
                );
              }
            }}
            // onChange={() => handleCheckboxChange(params.row.id, "fp")}
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
            onChange={() => {
              if (
                user.role === "USER" &&
                selectedRunGrpOptions.Name === user.defaultRunGroup
              ) {
                dispatch(
                  onCheckboxChange({
                    id: params.row.id,
                    field: "fppdf",
                    rows: runGrpRows,
                  })
                );
              } else if (user.role !== "USER") {
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
      minWidth: 200,
      flex: 1,
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
            onChange={() => {
              if (
                user.role === "USER" &&
                selectedRunGrpOptions.Name === user.defaultRunGroup
              ) {
                dispatch(
                  onCheckboxChange({
                    id: params.row.id,
                    field: "cpexcel",
                    rows: runGrpRows,
                  })
                );
              } else if (user.role !== "USER") {
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
            onChange={() => {
              if (
                user.role === "USER" &&
                selectedRunGrpOptions.Name === user.defaultRunGroup
              ) {
                dispatch(
                  onCheckboxChange({
                    id: params.row.id,
                    field: "cppdf",
                    rows: runGrpRows,
                  })
                );
              } else if (user.role !== "USER") {
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
  ];

  const [selectedRunGrpOptions, setSelectedRunGrpOptions] = useState({
    Name: user.defaultRunGroup || "",
  });

  const handleSelectionRunGrpChange = (newValue) => {
    setSelectedRunGrpOptions(newValue);
    if (newValue) {
      dispatch(fetchListviewRunGroup({ runGroupID: newValue.Name })).then(
        (res) => {
          // console.log("🚀 ~ dispatch ~ res:", res)

          const allRowIds = res.payload.rows.map((row) => row.id);
          setRowSelectionModel(allRowIds);
        }
      );
    }
  };

  const [openAlert, setOpenAlert] = useState(false);
  const [postError, setPostError] = useState(false);
  const fnRunGrpEmailProcess = async () => {
    if (rowSelectionModel.length == 0) {
      setOpenAlert(true);
      setPostError(true);
      return;
    }
    console.log("🚀 ~ fnRunGrpEmailProcess ~ rowSelectionModel:", rowSelectionModel)
    const data = runGrpRows
      .filter(
        (v) =>
          (rowSelectionModel.includes(v.id)) && (v.fppdf || v.fpexcel || v.cppdf ||v.cpexcel))
      .map((v) => ({
        id:v.id,
        CustomerNumber: v.customernumber,
        FullPriceBookPdf: v.fppdf ? "1" : "0",
        FullPriceBookExcel: v.fpexcel ? "1" : "0",
        CustomPriceBooPdf: v.cppdf ? "1" : "0",
        CustomPriceBookExcel: v.cpexcel ? "1" : "0",
        FromDate: sunday,
        ToDate: saturday,
        UserID: user.id,
        CompnayID:user.companyID,
        CompanyCode: user.companyCode,
        TemplateID: "",
      }));
    console.log("🚀 ~ data ~ data:", data);

    try {
      const response = await dispatch(runGroupMailData({ data }));

      if (response.payload.status === "Y") {
        setOpenAlert(true);
      } else {
        setOpenAlert(true);
        setPostError(true);
      }
    } catch (error) {
      setOpenAlert(true);
      setPostError(true);
      console.error("Error during HandleSave:", error);
    }
  };

  const [processLoading, setProcessLoading] = useState(false);
  const [processFunLoading, setProcessFunLoading] = useState(false);
  const [processError, setProcessError] = useState(false);
  const [showPrice, setShowprice] = useState(true);

  // const fnProcess = () => {
  //   if (rowSelectionModel.length == 0 ) {
  //     setProcessFunLoading(false);
  //     setProcessLoading(true);
  //     setProcessError(true);
  //     dispatch(runGrpMsgUpdate("Please Select Customer"));
  //     setTimeout(() => {
  //       setProcessLoading(false);
  //       dispatch(runGrpMsgUpdate(""));
  //       setProcessError(false);
  //     }, 2000);
  //     return;
  //   }
  //   setProcessLoading(true);
  //   setProcessFunLoading(true);

  //   const processData = new Promise((resolve, reject) => {
  //     try {
  //       const promises = runGrpRows
  //         .map((value, index) => {
  //           const promisesForRow = [];

  //           // Handle fp case
  //           if (
  //             (value.fpexcel || value.fppdf) &&
  //             rowSelectionModel.includes(value.id)
  //           ) {
  //             const fpPromise = dispatch(
  //               getCustomerViewPriceFullBook({
  //                 CompanyCode: user.companyCode,
  //                 FromDate: sunday,
  //                 ToDate: saturday,
  //                 CustomerNumber: value.customernumber,
  //               })
  //             ).then((fpResData) => {
  //               if (fpResData.payload.length > 0  ) {
  //                 dispatch(
  //                   runGrpMsgUpdate(`Full PDF for ${value.customer}...`)
  //                 );

  //                 // Generate Excel Blob for Full Price List
  //                 const excelBlobfp = exportToExcelBuildFullPriceBookBlob({
  //                   excelData: fpResData.payload,
  //                   date: formatedDate,
  //                   customerName: value.customer,
  //                   isPrice: value.selected,
  //                 });

  //                 return pdf(
  //                   <CustomerFullPriceDocument
  //                     key={index}
  //                     data={fpResData.payload}
  //                     coverPageData={{
  //                       logo: user.homePagelogo, // Replace with the actual path to the logo image
  //                       subtitle1: "Price List for",
  //                       subtitle2: value.customer,
  //                       effectiveDate: formatedDate,
  //                       preparedByName: user.name,
  //                       preparedByPhone: user.userMobile,
  //                       preparedByEmail: user.email,
  //                       phone1: user.phone1,
  //                       phone2: user.phone2,
  //                       fax: user.fax,
  //                       coverImg: user.customerFullPriceBookImg,
  //                     }}
  //                     isPrice={showPrice}
  //                     onRenderFinish={() => {

  //                     }}
  //                     onError={(e) => {

  //                     }}
  //                   />
  //                 )
  //                   .toBlob()
  //                   .then((blob) => ({
  //                     ...value,
  //                     blobfp: blob,
  //                     excelBlobfp,
  //                     fileName1: `${user.company}_${value.customer.endsWith(".") ? value.customer.slice(0, -1) : value.customer}_FPB_${sunday} TO ${saturday}`,
  //                   }));
  //               } else {
  //                 return {
  //                   ...value,
  //                   fpexcel: false,
  //                   fppdf: false,
  //                 };
  //               }
  //             });

  //             promisesForRow.push(fpPromise);
  //           }

  //           // Handle cp case
  //           if (
  //             (value.cpexcel || value.cppdf) &&
  //             rowSelectionModel.includes(value.id)
  //           ) {
  //             const cpPromise = dispatch(
  //               getCustomerViewPriceCustomBook({
  //                 CompanyCode: user.companyCode,
  //                 FromDate: sunday,
  //                 ToDate: saturday,
  //                 CustomerNumber: value.customernumber,
  //                 filterparameters: "",
  //               })
  //             ).then((cpResData) => {
  //               if (cpResData.payload.length > 0 ) {
  //                 dispatch(
  //                   runGrpMsgUpdate(`Custom PDF for ${value.customer}...`)
  //                 );

  //                 // Generate Excel Blob for Custom Price List
  //                 const excelBlobcp = exportToExcelBuildCustomPriceBookBlob({
  //                   excelData: cpResData.payload,
  //                   date: formatedDate,
  //                   customerName: value.customer,
  //                   isPrice: value.selected,
  //                 });

  //                 return pdf(
  //                   <CustomerCustomPriceDocument
  //                     key={index}
  //                     data={cpResData.payload}
  //                     headerData={{
  //                       logo: user.homePagelogo, // Replace with the actual path to the logo image
  //                       customerName: value.customer,
  //                       effectiveDate: formatedDate,
  //                     }}
  //                     coverPageData={{
  //                       logo: user.homePagelogo, // Replace with the actual path to the logo image
  //                       subtitle1: "Price List for",
  //                       subtitle2: value.customer,
  //                       effectiveDate: formatedDate,
  //                       preparedByName: user.name,
  //                       preparedByPhone: user.userMobile,
  //                       preparedByEmail: user.email,
  //                       phone1: user.phone1,
  //                       phone2: user.phone2,
  //                       fax: user.fax,
  //                       coverImg: user.customerCustomPriceBookImg,
  //                     }}
  //                     isPrice={showPrice}
  //                     onRenderFinish={() => {
  //                       // dispatch(
  //                       //   viewPricePdfGenrationg({
  //                       //     Type: "SUCCESS",
  //                       //     loading: false,
  //                       //     message:
  //                       //       "Price Book Succesfully Created! Wait it Automatically Dowaloaded.",
  //                       //   })
  //                       // );
  //                       // setIsGenerating(false);
  //                     }}
  //                     onError={(e) => {
  //                       // console.error("Render Error:", e);
  //                       // dispatch(
  //                       //   viewPricePdfGenrationg({
  //                       //     Type: "ERROR",
  //                       //     message: "An error occurred while rendering the PDF.",
  //                       //     loading: false,
  //                       //     error: true,
  //                       //   })
  //                       // );
  //                     }}
  //                   />
  //                 )
  //                   .toBlob()
  //                   .then((blob) => ({
  //                     ...value,
  //                     blobcp: blob,
  //                     excelBlobcp,
  //                     fileName2: `${user.company}_${value.customer.endsWith(".") ? value.customer.slice(0, -1) : value.customer}_CPB_${sunday} TO ${saturday}`,
  //                   }));
  //               } else {
  //                 return {
  //                   ...value,
  //                   cpexcel: false,
  //                   cppdf: false,
  //                 };
  //               }
  //             });

  //             promisesForRow.push(cpPromise);
  //           }

  //           if (promisesForRow.length > 0) {
  //             console.log("🚀 ~ .map ~ promisesForRow:", promisesForRow)
  //             return Promise.all(promisesForRow).then((results) => {

  //               console.log("🚀 ~ returnPromise.all ~ results:", results)
  //              return results.reduce((acc, result) => {

  //               return({ ...acc, ...result })}, {})  }
  //             );
  //           }

  //           // Skip rows where no valid promises are created
  //           return null;
  //         })
  //         .filter(Boolean); // Remove skipped rows (null values)

  //       // Wait for all promises to resolve and return the combined results
  //       Promise.all(promises)
  //         .then((allResults) => resolve(allResults))
  //         .catch(reject);
  //     } catch (error) {
  //       reject(error);
  //     }
  //   });

  //   dispatch(runGrpMsgUpdate("Initiating..."));

  //   processData
  //     .then((result) => {
  //       console.log("🚀 ~ .then ~ result:", result)
  //       setProcessFunLoading(false);
  //       dispatch(runGrpMsgUpdate(`Successfully Processed!`));
  //       dispatch(runGrpProcessedDataUpdate(result));
  //       setTimeout(() => {
  //         setProcessLoading(false);
  //         // navigate("./send-run-price-book");
  //         dispatch(runGrpMsgUpdate(""));
  //       }, 1500);
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //       setProcessFunLoading(false);
  //       setProcessError(true);
  //       dispatch(runGrpMsgUpdate(`ERROR: ${error}`));
  //       setTimeout(() => {
  //         setProcessLoading(false);
  //         dispatch(runGrpMsgUpdate(""));
  //         setProcessError(false);
  //       }, 1500);
  //     });
  // };

  const fnProcess = () => {
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
                getCustomerViewPriceFullBook({
                  CompanyCode: user.companyCode,
                  FromDate: sunday,
                  ToDate: saturday,
                  CustomerNumber: row.customernumber,
                })
              ).then((fpResData) => {
                console.log("🚀 ~ ).then ~ fpResData:", fpResData)
                if (fpResData.payload.length > 0) {
                  dispatch(
                    runGrpMsgUpdate(`Full PDF for ${row.customer}...`)
                  );
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
                      saturday
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
                getCustomerViewPriceCustomBook({
                  CompanyCode: user.companyCode,
                  FromDate: sunday,
                  ToDate: saturday,
                  CustomerNumber: row.customernumber,
                  filterparameters: "",
                })
              ).then((cpResData) => {
                console.log("🚀 ~ ).then ~ cpResData:", cpResData)
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
                      saturday
                    }));
                }
                return null; // Invalid `cp`
              });

              promisesForRow.push(cpPromise);
            }

            if (promisesForRow.length > 0) {
              console.log("🚀 ~ .map ~ promisesForRow:", promisesForRow)
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
        console.log("🚀 ~ processData ~ error:", error)
        reject(error);
      }
    });

    dispatch(runGrpMsgUpdate("Initiating..."));

    processData
      .then((result) => {
        console.log("🚀 ~ .then ~ result:", result);
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

  //=================================TOOLBAR=====================================//
  function SecondaryCustomToolbar() {
    return (
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
        </Box>

        {/* Second Row */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            padding: 1,
          }}
        >
          <Typography
            variant="h6"
            width="100%"
            sx={{
              mr: { xs: 0, md: 5 },
              mb: { md: 0 },
              color: "black",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            Price Book Group
          </Typography>
          <Box sx={{ width: "50%" }}>
            <SingleAutocomplete
              focused
              fullWidth
              required
              name="rungroup"
              id="rungroup"
              value={selectedRunGrpOptions}
              onChange={handleSelectionRunGrpChange}
              label="Price Book"
              url={`${process.env.REACT_APP_BASE_URL}PriceBookDirectory/GetRungroupByCompany?CompanyCode=${user.companyCode}`}
            />
          </Box>
        </Box>
      </Box>
    );
  }
  // console.log("🚀 ~ handleRowSelectionChange ~ selectedRunGrpOptions.Name:", selectedRunGrpOptions.Name)
  //       console.log("🚀 ~ handleRowSelectionChange ~ user.defaultRunGroup:", user.defaultRunGroup)
  //       const handleRowSelectionChange = (newRowSelectionModel) => {
  //         if (user.role === "USER" && selectedRunGrpOptions.Name === user.defaultRunGroup) {

  //           setRowSelectionModel(newRowSelectionModel);
  //         }

  //       };

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[{ name: "Price Book" }, { name: "Print Price Book Group" }]}
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
          </Box>

          {/* Second Row */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              padding: 1,
            }}
          >
            <Typography
              variant="h6"
              width="100%"
              sx={{
                mr: { xs: 0, md: 5 },
                mb: { md: 0 },
                color: "black",
                textAlign: { xs: "center", md: "left" },
              }}
            >
              Price Book Group
            </Typography>
            <Box sx={{ width: "50%" }}>
              <SingleAutocompleteRunGroup
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
            </Box>
          </Box>
        </Box>
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
              // toolbar: secondaryCustomToolbar,
            }}
            onRowSelectionModelChange={(newRowSelectionModel) => {
              // const filterArray = runGrpRows.filter((v) =>
              //   newRowSelectionModel.includes(v.id)
              // );
              setRowSelectionModel(newRowSelectionModel);
              // setRowSelectionModelRows(filterArray);
            }}
            rowSelectionModel={rowSelectionModel}
            rows={runGrpRows}
            columns={columns}
            loading={runGrpIsLoading}
            checkboxSelection
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
            initialState={{
              pagination: { paginationModel: { pageSize: 20 } },
            }}
            rowHeight={30}
            pageSizeOptions={[20, 50, 100]}
            columnVisibilityModel={{
              RecordID: false,
              SortOrder: false,
              CreatedDateTime: false,
              ImgApp: false,
              Sap: false,
              Contact: false,
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

              border: rowSelectionModel.length > 10 ? "1px solid red" : "none",

              borderRadius: 1,

              backgroundColor:
                rowSelectionModel.length > 10 ? "#ffe6e6" : "transparent",

              minHeight: 50, // Ensure consistent height

              minWidth: 300, // Ensure consistent width
            }}
          >
            {rowSelectionModel.length > 10 && (
              <Typography color="error" align="center">
                Note: To View Price Book, select no more than 10 rows at a time
              </Typography>
            )}
          </Box>

          {/* Buttons on the right side */}

          <Stack direction="row" justifyContent="end" gap={2}>
            <Button
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
            </Button>

            <PriceGroupAlertApiDialog
              open={openAlert}
              error={postError}
              message={
                rowSelectionModel.length === 0
                  ? "Please Select Customer"
                  : postError
                  ? "Something Went Wrong"
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
                        setPostError(false);
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

            <Button
              variant="contained"
              disabled={rowSelectionModel.length > 10}
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
            </Button>
          </Stack>
        </Stack>
      </SimpleCard>
    </Container>
  );
}
