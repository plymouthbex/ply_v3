import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  genricPriceStatus: "idle",
  genricPriceLoading: false,
  genricPriceData: [],
  genricError: null,

  genricPriceBookIsPdfGenrating: false,
  genricPriceBookPdfGenratingMsg: "Initiating",
  genricPriceBookIsPdfError: false,
  // genricPriceBookIsCurrentPdfButton: false,
  // genricPriceBookIsCurrentPdfBlob: {},
  // genricPriceBookIsCurrentExcelBlob: {},
  // genricPriceBookIsNextPdfButton: false,
  // genricPriceBookIsNextPdfBlob: {},
  // genricPriceBookIsNextExcelBlob: {},

  viewPriceStatus: "idle",
  viewPriceLoading: false,
  viewPriceData: [],
  viewError: null,

  viewPriceIsPdfGenrating: false,
  viewPricePdfGenratingMsg: "Initiating",
  viewPriceIsPdfError: false,

  customerFullPriceStatus: "idle",
  customerFullPriceLoading: false,
  customerFullPriceData: [],
  customerFullError: null,

  customerCustomPriceStatus: "idle",
  customerCustomPriceMessage: "Initiating",
  customerCustomPriceLoading: false,
  customerCustomPriceOpenLoading: false,
  customerCustomPriceData: [],
  customerCustomError: false,

  quotePriceStatus: "idle",
  quotePriceMessage: "Initiating",
  quotePriceLoading: false,
  quotePriceOpenLoading: false,
  quotePriceData: [],
  quoteError: false,
};

export const getGenricPriceList = createAsyncThunk(
  "posts/getGenricPriceList", // action type
  async ({ CompanyCode, FromDate, ToDate }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}Pdf/GetGenricFullPriceBook_V1?CompanyCode=${CompanyCode}&FromDate=${FromDate}&ToDate=${ToDate}`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      return response.data; // return the response data
    } catch (error) {
      // If the request fails, return a custom error message
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getCustomerCustomViewPriceList = createAsyncThunk(
  "post/getViewCustomPriceList", // action type
  async (
    {
      CompanyCode,
      FromDate,
      ToDate,
      CustomerNumber,
      PriceBooktype,
      filterparameters,
    },
    { rejectWithValue }
  ) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}Pdf/GetCustomerCustomPriceBook?CompanyCode=${CompanyCode}&FromDate=${FromDate}&ToDate=${ToDate}&CustomerNumber=${CustomerNumber}&PriceBooktype=${PriceBooktype}&filterparameters=${filterparameters}`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      return response.data; // return the response data
    } catch (error) {
      // If the request fails, return a custom error message
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getCustomerViewPriceFullBook = createAsyncThunk(
  "view-price-book/customer-price-full-book", // action type
  async (
    { CompanyCode, FromDate, ToDate, CustomerNumber },
    { rejectWithValue }
  ) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}Pdf/GetCustomerFullPriceBook_V3?CompanyCode=${CompanyCode}&FromDate=${FromDate}&ToDate=${ToDate}&CustomerNumber=${CustomerNumber}`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      return response.data; // return the response data
    } catch (error) {
      // If the request fails, return a custom error message
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getCustomerViewPriceCustomBook = createAsyncThunk(
  "view-price-book/customer-price-custom-book", // action type
  async (
    { CompanyCode, FromDate, ToDate, CustomerNumber, filterparameters },
    { rejectWithValue }
  ) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}Pdf/GetCustomerCustomPriceBook_V1?CompanyCode=${CompanyCode}&FromDate=${FromDate}&ToDate=${ToDate}&CustomerNumber=${CustomerNumber}&filterparameters=${filterparameters}`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      return response.data; // return the response data
    } catch (error) {
      // If the request fails, return a custom error message
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getCustomerViewPriceList = createAsyncThunk(
  "post/getCustomerFullPriceList", // action type
  async (
    { CompanyCode, FromDate, ToDate, CustomerNumber },
    { rejectWithValue }
  ) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}Pdf/GetCustomerFullPriceBook?CompanyCode=${CompanyCode}&FromDate=${FromDate}&ToDate=${ToDate}&CustomerNumber=${CustomerNumber}`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      return response.data; // return the response data
    } catch (error) {
      // If the request fails, return a custom error message
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getCustomerFullPriceList = createAsyncThunk(
  "post/getCustomerFullPriceList", // action type
  async (
    { CompanyCode, FromDate, ToDate, CustomerNumber },
    { rejectWithValue }
  ) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}Pdf/GetCustomerFullPriceBook_V1?CompanyCode=${CompanyCode}&FromDate=${FromDate}&ToDate=${ToDate}&CustomerNumber=${CustomerNumber}`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      return response.data; // return the response data
    } catch (error) {
      // If the request fails, return a custom error message
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getCustomerFullConfigPriceList = createAsyncThunk(
  "post/getCustomerFullConfigPriceList", // action type
  async (
    { CompanyCode, FromDate, ToDate, CustomerNumber },
    { rejectWithValue }
  ) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}Pdf/GetCustomerFullPriceBook?CompanyCode=${CompanyCode}&FromDate=${FromDate}&ToDate=${ToDate}&CustomerNumber=${CustomerNumber}`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      return response.data; // return the response data
    } catch (error) {
      // If the request fails, return a custom error message
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getCustomerCustomPriceList = createAsyncThunk(
  "post/getCustomerCustomPriceList", // action type
  async (
    {
      CompanyCode,
      FromDate,
      ToDate,
      CustomerNumber,
      PriceBooktype,
      filterparameters,
    },
    { rejectWithValue }
  ) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}Pdf/GetCustomerCustomPriceBook?CompanyCode=${CompanyCode}&FromDate=${FromDate}&ToDate=${ToDate}&CustomerNumber=${CustomerNumber}&PriceBooktype=${PriceBooktype}&filterparameters=${filterparameters}`;

      console.log("🚀 ~ URL:", URL);

      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data ? error.response.data.Message : error.message
      );
    }
  }
);

export const getRunGrpCustomerFullPriceList = createAsyncThunk(
  "post/getRunGrpCustomerFullPriceList", // action type
  async (
    { CompanyCode, FromDate, ToDate, CustomerNumber },
    { rejectWithValue }
  ) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}Pdf/GetCustomerFullPriceBook_V1?CompanyCode=${CompanyCode}&FromDate=${FromDate}&ToDate=${ToDate}&CustomerNumber=${CustomerNumber}`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      return response.data; // return the response data
    } catch (error) {
      // If the request fails, return a custom error message
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getRunGrpCustomerCustomPriceList = createAsyncThunk(
  "post/getRunGrpCustomerCustomPriceList", // action type
  async (
    {
      CompanyCode,
      FromDate,
      ToDate,
      CustomerNumber,
      PriceBooktype,
      filterparameters,
    },
    { rejectWithValue }
  ) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}Pdf/GetCustomerCustomPriceBook?CompanyCode=${CompanyCode}&FromDate=${FromDate}&ToDate=${ToDate}&CustomerNumber=${CustomerNumber}&PriceBooktype=${PriceBooktype}&filterparameters=${filterparameters}`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      return response.data; // return the response data
    } catch (error) {
      // console.log("🚀 ~ error:", error)
      // If the request fails, return a custom error message
      return rejectWithValue(
        error.response.data ? error.response.data.Message : error.message
      );
    }
  }
);

export const getQuotePriceList = createAsyncThunk(
  "posts/getQuotePriceList", // action type
  async (
    {
      CompanyCode,
      FromDate,
      ToDate,
      CustomerNumber,
      PriceBooktype,
      filterparameters,
    },
    { rejectWithValue }
  ) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}Pdf/GetQuotePriceBook?CompanyCode=${CompanyCode}&FromDate=${FromDate}&ToDate=${ToDate}&CustomerNumber=${CustomerNumber}&PriceBooktype=${PriceBooktype}&filterparameters=${filterparameters}`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      return response.data; // return the response data
    } catch (error) {
      // If the request fails, return a custom error message
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);



export const getQuotePdf = createAsyncThunk(
  "get/getQuotePdf", // action type
  async (data, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}Email/GetQuotePdf`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
        params: data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);


export const getQuoteExcel = createAsyncThunk(
  "get/getQuoteExcel", // action type
  async (data, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}Email/GetQuoteExcel`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
        params: data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const mailSend = createAsyncThunk(
  "post/mailSend", // action type
  async ({ data }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}Email/SendMail`;
      const response = await axios.post(URL, data, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      return response.data; // return the response data
    } catch (error) {
      return rejectWithValue(
        error.response.data ? error.response.data.Message : error.message
      );
    }
  }
);

export const mailSendQuote = createAsyncThunk(
  "post/mailSendQuote", // action type
  async (data, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}EmailTemplate/PostQuotationMailQueue`;
      const response = await axios.post(URL, data, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      return response.data; // return the response data
    } catch (error) {
      return rejectWithValue(
        error.response.data ? error.response.data.Message : error.message
      );
    }
  }
);

const priceListSlice = createSlice({
  name: "priceList",
  initialState,
  reducers: {
    genricPriceBookPdfGenrationg: (state, action) => {
      if (action.payload.Type === "LOADING") {
        // state.genricPriceBookIsPdfButton = false;
        state.genricPriceBookIsPdfGenrating = action.payload.loading;
        state.genricPriceBookPdfGenratingMsg = action.payload.message;
        state.genricPriceBookIsPdfError = false;
      }
      if (action.payload.Type === "SUCCESS") {
        state.genricPriceBookIsPdfGenrating = action.payload.loading;
        state.genricPriceBookPdfGenratingMsg = action.payload.message;
      }

      // if (action.payload.Type === "FINISHEDCURRENT") {
      //   state.genricPriceBookIsCurrentPdfBlob = action.payload.pdf;
      //   state.genricPriceBookIsCurrentExcelBlob = action.payload.excel;
      //   state.genricPriceBookIsCurrentPdfButton = true;
      // }
      // if (action.payload.Type === "FINISHEDNEXT") {
      //   state.genricPriceBookIsNextPdfBlob = action.payload.pdf;
      //   state.genricPriceBookIsNextExcelBlob = action.payload.excel;
      //   state.genricPriceBookIsNextPdfButton = true;
      // }
      if (action.payload.Type === "ERROR") {
        state.genricPriceBookIsPdfGenrating = action.payload.loading;
        state.genricPriceBookPdfGenratingMsg = action.payload.message;
        state.genricPriceBookIsPdfError = action.payload.error;
      }
      if (action.payload.Type === "RESET") {
        state.genricPriceBookIsPdfGenrating = false;
        state.genricPriceBookPdfGenratingMsg = "Initiating";
        state.genricPriceBookIsPdfError = false;
        state.genricPriceBookIsPdfButton = false;
        state.genricPriceBookIsPdfBlob = {};
        state.genricPriceBookIsExcelBlob = {};
      }
    },
    viewPricePdfGenrationg: (state, action) => {
      if (action.payload.Type === "LOADING") {
        state.viewPriceIsPdfGenrating = action.payload.loading;
        state.viewPricePdfGenratingMsg = action.payload.message;
        state.viewPriceIsPdfError = false;
      }
      if (action.payload.Type === "SUCCESS") {
        state.viewPriceIsPdfGenrating = action.payload.loading;
        state.viewPricePdfGenratingMsg = action.payload.message;
      }
      if (action.payload.Type === "ERROR") {
        state.viewPriceIsPdfGenrating = action.payload.loading;
        state.viewPricePdfGenratingMsg = action.payload.message;
        state.viewPriceIsPdfError = action.payload.error;
      }
      if (action.payload.Type === "RESET") {
        state.viewPriceIsPdfGenrating = false;
        state.viewPricePdfGenratingMsg = "Initiating";
        state.viewPriceIsPdfError = false;
      }
    },
    quoteClearState: (state, action) => {
      state.quotePriceStatus = "idle";
      state.quotePriceMessage = "Initiating";
      state.quotePriceLoading = false;
      state.quotePriceOpenLoading = false;
      state.quotePriceData = [];
    },
    viewPriceBookClearState: (state, action) => {
      state.quotePriceStatus = "idle";
      state.quotePriceMessage = "Initiating";
      state.quotePriceLoading = false;
      state.quotePriceOpenLoading = false;
      state.quotePriceData = [];
    },

    setDelayedOpenLoadingBuildCustom: (state, action) => {
      state.customerCustomPriceOpenLoading = false;
    },
    setDelayedOpenLoadingQuote: (state, action) => {
      state.quotePriceOpenLoading = false;
    },
    resetStatePriceList: (state, action) => {
      state.customerCustomPriceStatus = "idle";
      state.customerCustomPriceMessage = "Initiating";
      state.customerCustomPriceLoading = false;
      state.customerCustomPriceOpenLoading = false;
      state.customerCustomPriceData = [];
    },
  },
  extraReducers(builder) {
    builder

      // HOME SCREEN FULL PRICE BOOK ADDCASES
      .addCase(getGenricPriceList.pending, (state, action) => {
        state.genricPriceStatus = "pending";
        state.genricPriceLoading = true;
        state.genricPriceData = [];
      })
      .addCase(getGenricPriceList.fulfilled, (state, action) => {
        state.genricPriceStatus = "fulfilled";
        state.genricPriceLoading = false;
        state.genricPriceData = action.payload;
      })
      .addCase(getGenricPriceList.rejected, (state, action) => {
        state.genricPriceStatus = "rejected";
        state.genricPriceLoading = false;
        state.genricError = action.error;
      })

      .addCase(getCustomerCustomViewPriceList.pending, (state, action) => {
        state.viewPriceStatus = "pending";
        state.viewPriceLoading = true;
        state.viewPriceData = [];
      })
      .addCase(getCustomerCustomViewPriceList.fulfilled, (state, action) => {
        state.viewPriceStatus = "fulfilled";
        state.viewPriceLoading = false;
        state.viewPriceData = action.payload;
      })
      .addCase(getCustomerCustomViewPriceList.rejected, (state, action) => {
        state.viewPriceStatus = "rejected";
        state.viewPriceLoading = false;
        state.viewError = action.error;
      })

      .addCase(getCustomerFullPriceList.pending, (state, action) => {
        state.viewPriceStatus = "pending";
        state.viewPriceLoading = true;
        state.viewPriceData = [];
      })
      .addCase(getCustomerFullPriceList.fulfilled, (state, action) => {
        state.viewPriceStatus = "fulfilled";
        state.viewPriceLoading = false;
        state.viewPriceData = action.payload;
      })
      .addCase(getCustomerFullPriceList.rejected, (state, action) => {
        state.viewPriceStatus = "rejected";
        state.viewPriceLoading = false;
        state.viewError = action.error;
      })

      //  BUILD CUSTOMER CUSTOM PRICE BOOK ADDCASES  -- CUSTOM BUILD PRICE BOOK
      .addCase(getCustomerCustomPriceList.pending, (state, action) => {
        state.customerCustomPriceStatus = "pending";
        state.customerCustomPriceMessage =
          "Data processing for selected customer...";
        state.customerCustomPriceLoading = true;
        state.customerCustomPriceOpenLoading = true;
        state.customerCustomPriceData = [];
      })
      .addCase(getCustomerCustomPriceList.fulfilled, (state, action) => {
        state.customerCustomPriceStatus = "fulfilled";
        state.customerCustomPriceMessage = "Data processed successfully!";
        state.customerCustomPriceLoading = false;
        state.customerCustomPriceData = action.payload;
      })
      .addCase(getCustomerCustomPriceList.rejected, (state, action) => {
        state.customerCustomPriceStatus = "rejected";
        state.customerCustomPriceMessage = action.payload;
        state.customerCustomPriceLoading = false;
        state.customerCustomError = true;
      })

      // FULL PRICE BOOK ADDCASES  -- CONFIG PRICE BOOK
      .addCase(getCustomerFullConfigPriceList.pending, (state, action) => {
        state.customerCustomPriceStatus = "pending";
        state.customerCustomPriceMessage =
          "Data processing for selected customer...";
        state.customerCustomPriceLoading = true;
        state.customerCustomPriceOpenLoading = true;
        state.customerCustomPriceData = [];
      })
      .addCase(getCustomerFullConfigPriceList.fulfilled, (state, action) => {
        state.customerCustomPriceStatus = "fulfilled";
        state.customerCustomPriceMessage = "Data processed successfully!";
        state.customerCustomPriceLoading = false;
        state.customerCustomPriceData = action.payload;
      })
      .addCase(getCustomerFullConfigPriceList.rejected, (state, action) => {
        state.customerCustomPriceStatus = "rejected";
        state.customerCustomPriceMessage = action.payload;
        state.customerCustomPriceLoading = false;
        state.customerCustomError = true;
      })

      //  BUILD QUOTE PRICE BOOK ADDCASES
      .addCase(getQuotePdf.pending, (state, action) => {
        state.quotePriceStatus = "pending";
        state.quotePriceMessage = "Generating PDF...";
        state.quotePriceLoading = true;
        state.quoteError = false;
      })
      .addCase(getQuotePdf.fulfilled, (state, action) => {
        state.quotePriceStatus = "fulfilled";
        state.quotePriceMessage = action.payload.message;
        state.quotePriceLoading = false;
      })
      .addCase(getQuotePdf.rejected, (state, action) => {
        state.quotePriceStatus = "rejected";
        state.quotePriceLoading = false;
        state.quoteError = true;
        state.quotePriceMessage = action.payload.message;
      })

      .addCase(getQuoteExcel.pending, (state, action) => {
        state.quotePriceStatus = "pending";
        state.quotePriceMessage = "Generating Excel...";
        state.quotePriceLoading = true;
        state.quoteError = false;
      })
      .addCase(getQuoteExcel.fulfilled, (state, action) => {
        state.quotePriceStatus = "fulfilled";
        state.quotePriceMessage = action.payload.message;
        state.quotePriceLoading = false;
      })
      .addCase(getQuoteExcel.rejected, (state, action) => {
        state.quotePriceStatus = "rejected";
        state.quotePriceLoading = false;
        state.quoteError = true;
        state.quotePriceMessage = action.payload.message;
      });
  },
});
export default priceListSlice.reducer;

export const {
  genricPriceBookPdfGenrationg,
  viewPricePdfGenrationg,
  setDelayedOpenLoadingBuildCustom,
  setDelayedOpenLoadingQuote,
  resetStatePriceList,
  quoteClearState,
} = priceListSlice.actions;

// A thunk to handle the delayed status update
export const updateDelayedBuildCustomPriceBook = () => (dispatch) => {
  setTimeout(() => {
    dispatch(setDelayedOpenLoadingBuildCustom(true));
  }, 1500);
};

// A thunk to handle the delayed status update
export const updateDelayedQuotePriceBook = () => (dispatch) => {
  setTimeout(() => {
    dispatch(setDelayedOpenLoadingQuote(true));
  }, 1500);
};
