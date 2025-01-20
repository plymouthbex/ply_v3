import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  priceTemplistRowData: [],
  priceTemplistColumnData: [],
  viewDirectoryRowData: [],
  viewDirectoryColumnData: [],
  getLocationRowData: [],
  getLocationColumnData: [],
  priceTemploading: false,
  priceTempstatus: "idle", // 'idle' | 'loading' 'suceeded' | 'failed
  priceTemperror: null,

  status: "loading",
  loading: false,
  listviewColumnData: [],
  listviewRowData: [],

  runGrpStatus: "idle", // 'idle' | 'loading' 'fulfilled' | 'rejected
  runGrpLoading: false,
  runGrpColumnData: [],
  runbGrpRowData: [],
  runGrpError: null,

  runGrpProcessingMsg: "",
  runGrpProcessedData: [],

  //=========================CONTROL-PANEL=======================================//

  itemListViewData: [],
  itemTemploading: false,
  itemTempstatus: "idle",

  priceListViewData: [],
  priceListloading: false,
  priceListstatus: "idle",

  rungroupListViewData: [],
  rungroupTemploading: false,
  rungroupTempstatus: "idle",
  printGroupListViewData: [],
  printGroupTemploading: false,
  printGroupTempstatus: "idle",
  customerListViewData: [],
  customerTemploading: false,
  customerTempstatus: "idle",

  //Company//
  comapnyListViewData: [],
  //Application//
  applicationListViewData: [],
  //USER//
  userListViewData: [],
  //USERGROUP//
  userGroupListViewData: [],
  userGroupCompanyListViewData: [],

  //configureComapny//
  configureComapnyListViewData: [],
  configureCustomerListViewData: [],
  configureAddressListViewData: [],
  configureContactListViewData: [],
};

export const fetchListviewPriveTemplate = createAsyncThunk(
  "posts/fetchListviewPriveTemplate", // action type
  async ({ userID }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}${userID}`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      return response.data; // return the response data
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const fetchListviewRunGroup = createAsyncThunk(
  "posts/fetchListviewRunGroup", // action type
  async ({ runGroupID }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}RunGroup/GetRunGroup?Rungroup=${runGroupID}`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      return response.data; // return the response data
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const fetchViewDirectory = createAsyncThunk(
  "listview/viewDirectory", // action type
  async ({ CompanyCode }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}${CompanyCode}`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      return response.data; // return the response data
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const fetchGetLocation = createAsyncThunk(
  "listview/customerInfo", // action type
  async ({ RecordID }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}${RecordID}`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      return response.data; // return the response data
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

//   PriceBookDirectory/GetContactLocation?RecordId=1
export const getLocalListview = createAsyncThunk(
  "page/getLocalListview",
  async ({ url }) => {
    // const URL =  process.env.REACT_APP_LISTVIEW_URL
    try {
      const response = await axios.get(url);
      console.log(
        "🚀 ~ file: listviewSlice.js:32 ~ fetchListview ~ response:",
        response
      );
      return response.data;
    } catch (err) {
      return err.message;
    }
  }
);
//==========================================================CONTROL-PANEL=================================================//
export const getItemListView = createAsyncThunk(
  "listview/itemList", // action type
  async (_, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}ItemMaster/GetItemMasterList`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
export const getPriceListView = createAsyncThunk(
  "listview/priceList", // action type
  async ({ ID }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}PriceListItems/GetPrictListList?CompanyCode=${ID}`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getRunGroupListView = createAsyncThunk(
  "listview/RunGroup", // action type
  async ({ ID }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}GPRungroup/GpRunGroupList?CompanyCode=${ID}`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      // console.log("🚀 ~ response.data:", response.data)
      return response.data; // returns the response data
    } catch (error) {
      // Handle errors
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
export const getPrintGroupListView = createAsyncThunk(
  "listview/printGroup", // action type
  async (_, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}PrintGroup/PrintGroupList`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      // console.log("🚀 ~ response.data:", response.data)
      return response.data; // returns the response data
    } catch (error) {
      // Handle errors
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
export const getCustomerListView = createAsyncThunk(
  "listview/Customer", // action type
  async (_, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}CustomerPriceList/CustomerPriceList`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      // console.log("🚀 ~ response.data:", response.data)
      return response.data; // returns the response data
    } catch (error) {
      // Handle errors
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
//=====================Company-ListView=================================//
export const getCompanyListView = createAsyncThunk(
  "listview/Company", // action type
  async (_, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}CompanyModule/CompanyListView`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      // console.log("🚀 ~ response.data:", response.data)
      return response.data; // returns the response data
    } catch (error) {
      // Handle errors
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

//============================APPLICATION LISTVIEW==================================//
export const getApplicationListView = createAsyncThunk(
  "listview/Application", // action type
  async (_, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}Application/ApplicationListView`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      // console.log("🚀 ~ response.data:", response.data)
      return response.data; // returns the response data
    } catch (error) {
      // Handle errors
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

//============================User LISTVIEW==================================//
export const getUserListView = createAsyncThunk(
  "listview/User", // action type
  async (_, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}UserModule/UserListView`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      // console.log("🚀 ~ response.data:", response.data)
      return response.data; // returns the response data
    } catch (error) {
      // Handle errors
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

//============================UserGroup LISTVIEW==================================//
export const getUserGroupListView = createAsyncThunk(
  "listview/UserGroup", // action type
  async (_, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}UserGroup/UserGroupListView`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      // console.log("🚀 ~ response.data:", response.data)
      return response.data; // returns the response data
    } catch (error) {
      // Handle errors
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
//=====================Company-ListView=================================//
export const getUserGroupCompanyListView = createAsyncThunk(
  "listview/UserGroupCompany", // action type
  async (_, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}Company`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      // console.log("🚀 ~ response.data:", response.data)
      return response.data; // returns the response data
    } catch (error) {
      // Handle errors
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
//*********************************************************CONFIGURE*************************************************************************************** */
//=====================Configure Company-ListView=================================//
export const getConfigureCompanyListView = createAsyncThunk(
  "listview/ConfigureCompany", // action type
  async (_, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}PriceBookConfiguration/GetConfigurePriceBookList?Type=CM`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      // console.log("🚀 ~ response.data:", response.data)
      return response.data; // returns the response data
    } catch (error) {
      // Handle errors
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
//=====================Configure Company-ListView=================================//
export const getConfigureCustomerListView = createAsyncThunk(
  "listview/ConfigureCustomer", // action type
  async ({ ID }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}PriceBookConfiguration/GetConfigurePriceBookList?Type=CS&CompanyRecordID=${ID}`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      // console.log("🚀 ~ response.data:", response.data)
      return response.data; // returns the response data
    } catch (error) {
      // Handle errors
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
//=====================Configure Company-ListView=================================//
export const getConfigureAddressListView = createAsyncThunk(
  "listview/ConfigureAddress", // action type
  async ({ ID, CustomerID }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}PriceBookConfiguration/GetConfigurePriceBookList?Type=AD&CompanyRecordID=${ID}&CustomerNumber=${CustomerID}`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      // console.log("🚀 ~ response.data:", response.data)
      return response.data; // returns the response data
    } catch (error) {
      // Handle errors
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
//=====================Configure Company-ListView=================================//
export const getConfigureContactListView = createAsyncThunk(
  "listview/ConfigureContact", // action type
  async ({ ID, CustomerID, AddressID }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}PriceBookConfiguration/GetConfigurePriceBookList?Type=CT&CompanyRecordID=${ID}&CustomerNumber=${CustomerID}&AddresCode=${AddressID}`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      // console.log("🚀 ~ response.data:", response.data)
      return response.data; // returns the response data
    } catch (error) {
      // Handle errors
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
const listviewSlice = createSlice({
  name: "listview",
  initialState,
  reducers: {
    onCheckboxChange: (state, action) => {
      const { id, rows, field } = action.payload;
      const updatedRow = rows.map((row) =>
        row.id === id ? { ...row, [field]: !row[field] } : row
      );

      state.runbGrpRowData = updatedRow;
    },

    onCheckboxChangeCustomer: (state, action) => {
      const { id, rows, field } = action.payload;
      const updatedRow = state.configureCustomerListViewData.map((row) =>
        row.RecordID === id ? { ...row, [field]: !row[field] } : row
      );

      state.configureCustomerListViewData = updatedRow;
    },
    runGrpMsgUpdate: (state, action) => {
      state.runGrpProcessingMsg = action.payload;
    },
    runGrpProcessedDataUpdate: (state, action) => {
      state.runGrpProcessedData = action.payload;
    },
    runGrpRowDataUpdate: (state, action) => {
      state.runbGrpRowData = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchListviewPriveTemplate.pending, (state, action) => {
        state.priceTempstatus = "loading";
        state.priceTemploading = true;
        state.priceTemplistColumnData = [];
        state.priceTemplistRowData = [];
      })
      .addCase(fetchListviewPriveTemplate.fulfilled, (state, action) => {
        state.priceTempstatus = "succeeded";
        state.priceTemploading = false;
        state.priceTemplistColumnData = action.payload.columns;
        state.priceTemplistRowData = action.payload.rows;
      })
      .addCase(fetchListviewPriveTemplate.rejected, (state, action) => {
        state.priceTempstatus = "failed";
        state.priceTemploading = false;
        state.error = action.error.message;
      })

      .addCase(fetchListviewRunGroup.pending, (state, action) => {
        state.runGrpStatus = "loading";
        state.runGrpLoading = true;
        state.runGrpColumnData = [];
        state.runbGrpRowData = [];
      })
      .addCase(fetchListviewRunGroup.fulfilled, (state, action) => {
        state.runGrpStatus = "fulfilled";
        state.runGrpLoading = false;
        state.runGrpColumnData = action.payload.columns;
        state.runbGrpRowData = action.payload.rows;
      })
      .addCase(fetchListviewRunGroup.rejected, (state, action) => {
        state.runGrpStatus = "rejected";
        state.runGrpLoading = false;
        state.error = action.error.message;
      })

      .addCase(fetchViewDirectory.pending, (state, action) => {
        state.priceTempstatus = "loading";
        state.priceTemploading = true;
        state.viewDirectoryColumnData = [];
        state.viewDirectoryRowData = [];
      })
      .addCase(fetchViewDirectory.fulfilled, (state, action) => {
        state.priceTempstatus = "succeeded";
        state.priceTemploading = false;
        state.viewDirectoryColumnData = action.payload.columns;
        state.viewDirectoryRowData = action.payload.rows;
      })
      .addCase(fetchViewDirectory.rejected, (state, action) => {
        state.priceTempstatus = "failed";
        state.priceTemploading = false;
        state.error = action.error.message;
      })
      .addCase(fetchGetLocation.pending, (state, action) => {
        state.priceTempstatus = "loading";
        state.priceTemploading = true;
        state.getLocationColumnData = [];
        state.getLocationRowData = [];
      })
      .addCase(fetchGetLocation.fulfilled, (state, action) => {
        state.priceTempstatus = "succeeded";
        state.priceTemploading = false;
        state.getLocationColumnData = action.payload.columns;
        state.getLocationRowData = action.payload.rows;
      })
      .addCase(fetchGetLocation.rejected, (state, action) => {
        state.priceTempstatus = "failed";
        state.priceTemploading = false;
        state.error = action.error.message;
      })
      .addCase(getLocalListview.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
        state.listviewColumnData = [];
        state.listviewRowData = [];
      })
      .addCase(getLocalListview.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.listviewColumnData = [];
        state.listviewRowData = action.payload;
      })
      .addCase(getLocalListview.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.error.message;
        state.listviewColumnData = [];
        state.listviewRowData = [];
      })

      //================================+CONTROL-PANEL===================================//
      .addCase(getItemListView.pending, (state, action) => {
        state.itemTempstatus = "loading";
        state.itemTemploading = true;
        state.itemListViewData = [];
      })
      .addCase(getItemListView.fulfilled, (state, action) => {
        state.itemTempstatus = "succeeded";
        state.itemTemploading = false;
        state.itemListViewData = action.payload.data;
      })
      .addCase(getItemListView.rejected, (state, action) => {
        state.itemTempstatus = "failed";
        state.itemTemploading = false;
        state.error = action.error.message;
      })

      .addCase(getPriceListView.pending, (state, action) => {
        state.priceListstatus = "pending";
        state.priceListloading = true;
        state.priceListViewData = [];
      })
      .addCase(getPriceListView.fulfilled, (state, action) => {
        state.priceListstatus = "fulfilled";
        state.priceListloading = false;
        state.priceListViewData = action.payload.data;
      })
      .addCase(getPriceListView.rejected, (state, action) => {
        state.priceListstatus = "rejected";
        state.priceListloading = false;
        state.error = action.error.message;
      })

      .addCase(getRunGroupListView.pending, (state, action) => {
        state.rungroupTempstatus = "loading";
        state.rungroupTemploading = true;
        state.rungroupListViewData = [];
      })
      .addCase(getRunGroupListView.fulfilled, (state, action) => {
        state.rungroupTempstatus = "succeeded";
        state.rungroupTemploading = false;
        state.rungroupListViewData = action.payload.data;
      })
      .addCase(getRunGroupListView.rejected, (state, action) => {
        state.rungroupTempstatus = "failed";
        state.rungroupTemploading = false;
        state.error = action.error.message;
      })

      .addCase(getPrintGroupListView.pending, (state, action) => {
        state.printGroupTempstatus = "loading";
        state.printGroupTemploading = true;
        state.printGroupListViewData = [];
      })
      .addCase(getPrintGroupListView.fulfilled, (state, action) => {
        state.printGroupTempstatus = "succeeded";
        state.printGroupTemploading = false;
        state.printGroupListViewData = action.payload.data;
      })
      .addCase(getPrintGroupListView.rejected, (state, action) => {
        state.printGroupTempstatus = "failed";
        state.printGroupTemploading = false;
        state.error = action.error.message;
      })

      .addCase(getCustomerListView.pending, (state, action) => {
        state.customerTempstatus = "loading";
        state.customerTemploading = true;
        state.customerListViewData = [];
      })
      .addCase(getCustomerListView.fulfilled, (state, action) => {
        state.customerTempstatus = "succeeded";
        state.customerTemploading = false;
        state.customerListViewData = action.payload.data;
      })
      .addCase(getCustomerListView.rejected, (state, action) => {
        state.customerTempstatus = "failed";
        state.customerTemploading = false;
        state.error = action.error.message;
      })
      //==========================Company=================================//
      .addCase(getCompanyListView.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
        state.comapnyListViewData = [];
      })
      .addCase(getCompanyListView.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.comapnyListViewData = action.payload.data;
      })
      .addCase(getCompanyListView.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.error.message;
      })
      //==========================Application=================================//
      .addCase(getApplicationListView.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
        state.applicationListViewData = [];
      })
      .addCase(getApplicationListView.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.applicationListViewData = action.payload.data;
      })
      .addCase(getApplicationListView.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.error.message;
      })
      //==========================USER=================================//
      .addCase(getUserListView.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
        state.userListViewData = [];
      })
      .addCase(getUserListView.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.userListViewData = action.payload.data;
      })
      .addCase(getUserListView.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.error.message;
      })
      //==========================USERGROUP=================================//
      .addCase(getUserGroupListView.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
        state.userGroupListViewData = [];
      })
      .addCase(getUserGroupListView.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.userGroupListViewData = action.payload.data;
      })
      .addCase(getUserGroupListView.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.error.message;
      })
      //==========================USERGROUP=================================//
      .addCase(getUserGroupCompanyListView.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
        state.userGroupCompanyListViewData = [];
      })
      .addCase(getUserGroupCompanyListView.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.userGroupCompanyListViewData = action.payload.rows;
      })
      .addCase(getUserGroupCompanyListView.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.error.message;
      })
      //==========================Configure Company=================================//
      .addCase(getConfigureCompanyListView.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
        state.configureComapnyListViewData = [];
      })
      .addCase(getConfigureCompanyListView.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.configureComapnyListViewData = action.payload.data;
      })
      .addCase(getConfigureCompanyListView.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.error.message;
      })
      //==========================Configure Customer=================================//
      .addCase(getConfigureCustomerListView.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
        state.configureCustomerListViewData = [];
      })
      .addCase(getConfigureCustomerListView.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.configureCustomerListViewData = action.payload.data;
      })
      .addCase(getConfigureCustomerListView.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.error.message;
      })
      //==========================Configure Address=================================//
      .addCase(getConfigureAddressListView.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
        state.configureAddressListViewData = [];
      })
      .addCase(getConfigureAddressListView.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.configureAddressListViewData = action.payload.data;
      })
      .addCase(getConfigureAddressListView.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.error.message;
      })
      //==========================Configure Contact=================================//
      .addCase(getConfigureContactListView.pending, (state, action) => {
        state.status = "loading";
        state.loading = true;
        state.configureContactListViewData = [];
      })
      .addCase(getConfigureContactListView.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.configureContactListViewData = action.payload.data;
      })
      .addCase(getConfigureContactListView.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  onCheckboxChange,
  onCheckboxChangeCustomer,
  runGrpMsgUpdate,
  runGrpProcessedDataUpdate,
  runGrpRowDataUpdate,
} = listviewSlice.actions;
export default listviewSlice.reducer;
