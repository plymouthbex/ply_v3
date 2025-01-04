import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  getItemsData: {},
  listviewData: [],
  loading: false,
  status: "idle",
  error: null,
  cLoading: false,
  cStatus: "idle",
  getCPrintGroupData: {},
  PGLoading: false,
  PGStatus: "idle",
  CLoading: false,
  CStatus: "idle",
  getCustomerData: {},
  getCustomerPriceListData: [],
  priceListSelectedPrintData: [],
  priceListSelectedAddPrintData: [],
  priceListSelectedCustomerData: [],
  getPrintGroupPriceListData: [],
  printAddedData: [],
  printSelectedData: [],

  // PRICELIST
  priceListStatus: "idle",
  priceListMessage: "Initiating",
  priceListLoading: false,
  priceListError: false,
  priceListSelectedData: [],
  priceListAddedData: [],
  priceListItemsData: [],
  priceListItemLoading: false,
  priceListHeaderData: {},
  priceListFilterData: {},
  // PRICELIST ATTRIBUTES
  priceListAttStatus: "idle",
  priceListAttData: {},

  //PRINT GROUP
  printGroupStatus: "idle",
  printGroupMessage: "Initiating",
  printGroupLoading: false,
  printGroupError: false,
  printGroupFormData: {},
  printGroupGetData: [],
  printGroupAddedData: [],

  //CUSTOMER PRICE LIST
  customerListStatus: "idle",
  customerListMessage: "Initiating",
  customerListLoading: false,
  customerListError: false,
  customerListFormData: {},
  customerListGetData: [],
  customerListAddedData: [],

  //RUN GROUP
  runGroupStatus: "idle",
  runGroupMessage: "Initiating",
  runGroupLoading: false,
  runGroupError: false,
  runGroupFormData: {},
  runGroupGetData: [],
  runGroupAddedData: [],

  //Company
companyStatus:"idle",
companyMessage:"Initiating",
companyLoading: false,
companyError: false,
companyFormData: {},


  //Application
  applicationStatus:"idle",
  applicationMessage:"Initiating",
  applicationLoading: false,
  applicationError: false,
  applicationFormData: {},

   //USER
   userStatus:"idle",
   userMessage:"Initiating",
   userLoading: false,
   userError: false,
   userFormData: {},

    //USERGROUP
    userGroupStatus:"idle",
    userGroupMessage:"Initiating",
    userGroupLoading: false,
    userGroupError: false,
    userGroupFormData: {},
    userGroupAppRow:[],
    userGroupComRow:[],

    //USERGROUPADDED
    companyAddedData:[],

    //IMAGE
    getContactData:{},


    //PP
    getQuoteFilterItemData:[],
    getQuoteFilterItemLoading: false,
    getQuoteFilterItemStatus:"idle",
    getQuoteFilterItemError:null,



    getQuoteData:{},
    getQuoteLoading: false,
    getQuoteStatus:"idle",
    getQuoteError:null,



};

export const fetchgGetAItems = createAsyncThunk(
  "page/geNewtcontact",
  async ({ filter }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}ItemMaster/GetItemMasterListByNumber?ItemNumber=${filter}`;
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

export const getPriceListData = createAsyncThunk(
  "priceList/GET",
  async ({ id }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}PriceList/GetPriceList?PricelistId=${id}`;
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

export const getPriceListFilterData = createAsyncThunk(
  "priceListFilter/POST",
  async (data, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}Quotation/QuoteFilterItem_V1`;
      const response = await axios.post(URL, data, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      console.log("🚀 ~ response:", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const getprintGroupData = createAsyncThunk(
  "printGroup/GET",
  async ({ id }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}PrintGroup/GetPrintGroup?Recordid=${id}`;
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

export const getCustomerPriceData = createAsyncThunk(
  "customerPriceData/GET",
  async ({ id }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}CustomerPriceList/GetPriceList?Recordid=${id}`;
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

export const getRunGroupData = createAsyncThunk(
  "runGroupData/GET",
  async ({ id }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}GPRungroup/GetRunGroup?Recordid=${id}`;
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
//=======COMPANY=========================///
export const getCompanyData = createAsyncThunk(
  "companyData/GET",
  async ({ ID }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}CompanyModule/GetCompanyData?CompanyCode=${ID}`;
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

///====================APPLICATION===========================//

export const getApplicationData = createAsyncThunk(
  "applicationData/GET",
  async ({ ID }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}Application/GetApplicationData?RecordID=${ID}`;
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
///====================USER===========================//

export const getUserData = createAsyncThunk(
  "UserData/GET",
  async ({ ID }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}UserModule/GetUserData?RecordId=${ID}`;
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

///====================USERGROUP===========================//

export const getUserGroupData = createAsyncThunk(
  "UserGroupData/GET",
  async ({ ID }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}UserGroup/GetUserGroupData?RecordID=${ID}`;
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




export const fetchGetImage = createAsyncThunk(
  "page/getListView",
  async ({ filter }) => {
      try {
        const URL = `${process.env.REACT_APP_BASE_URL}Image/GetPriceBookImage?${filter}`
      const response = await axios.get(URL, {
        headers: {
          Authorization:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiODFlMTVlODVmZDhmYzMxMzk3NWY3MGNiODEwMjc3YWVhODRmODlkNjc4Y2I0ZDFkNTM2NGUyMjFlNWY4YzMxODQyYmYyMjY4MmJkMDYyZGMiLCJpYXQiOjE3MjI1MTk3NDAuMTk2OTg1LCJuYmYiOjE3MjI1MTk3NDAuMTk2OTk2LCJleHAiOjE3NTQwNTU3NDAuMTUyOTYzLCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.F4lOKPPewIKjbJKK-HPgBfK_mnG2Rzw4AUv4w87HGXLSXl3GYfGurHAlTriVQ-KkpOftCv_QGDDflCB2MG4D0bV6rcGsD7Ayvr40yk_m3Fyz1AhB2w70Y7gMpfhd_3hEDNWZ-V9lAgH24s-UCdFqKFwZkd9icQ84NfRij9bay3M7mjJ_KR06-cfuVMGhZFGnw89jiFr5FDt1DpWeqzAOjFIBtCfywV0CvNFMJtDrNvtjAzRAbR0vDVaXZBk0xa6aMyxBhhFX4fC9FaRAU15a9oQh2RH4OheNOvqH54v32BBXHx305g-S1DLYXQWlPUZROoTiaDrJezHPog3QKZlC3J7cscLIt-nd4XlYVe9ntMOGk7rzXvEAhcai1-yTkHZZfNfy7EIifi0hXcJrR9NbRjdloPjfGCo3BsH425V3PhUyr_OaC9KxxUHHLwmEnyCWlFIfAzyMpC9g7NqpSVDYcVt--mzxGkdY6_PF-g0e43h9d1g8uxbD6iZtLVAejpsmqoEWaJxKJNrESLiYOoYu0QFGFl46bkbuTwhepswe5Pwjs54S-ps7DB2igPgT9rABF-eotflzG-zruLGQNSO-fjRY5KjSE97n2W348DKjPxHF3U1q9BW2KhGAdb-h4bOKOT6Lu4cpN7v1eRnMxucEZV3a5kIrWc2xg-7H_s3zXi4",

          // use a proper variable or environment variable for token
        },
        //   responseType: 'blob', // Set responseType to 'blob' to handle binary image data
      });
      return response.data;
    } catch (error) {
    //  throw()
    }
  }
);


//=====================================pRICING-PORTAL==============================
export const getQuoteFilterData = createAsyncThunk(
  "getQuoteFilterData/POST",
  async (data, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}Quotation/QuoteFilterItem`;
      const response = await axios.post(URL, data, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      console.log("🚀 ~ response:", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);


export const getQuoteBookData = createAsyncThunk(
  'get/getQuoteBook', // action type
  async ({userID,templateID}, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}Quote/GetQuoteTemplates?UserId=${userID}&TemplateId=${templateID}`
      const response = await axios.get(URL, {
        headers: {
          'Authorization': process.env.REACT_APP_API_TOKEN, 
        }
      });
      return response.data; // return the response data
    } catch (error) {
      // If the request fails, return a custom error message
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const getPriceListItemGet = createAsyncThunk(
  "page/getPriceListItemGet",
  async ({ id, itemNumber}, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}PriceList/GetPriceListItemByNumber?ItemNumber=${itemNumber}&PriceListID=${id}&Type=PL`;
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

export const getConfigPriceBookCompany = createAsyncThunk(
  "page/getConfigPriceBookCompany",
  async ({ CompanyCode }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}PriceBookConfiguration/GetCompanyConfigurePriceBook?CompanyCode=${CompanyCode}`;
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
const getSlice = createSlice({
  name: "getSlice",
  initialState,
  reducers: {
    // PRICELIST ACTION
    priceListSelectedItems: (state, action) => {
      state.priceListSelectedData = action.payload;
    },
    priceListAddedItems: (state, action) => {
      state.priceListAddedData.push(action.payload);
    },
    priceListDeletedItem: (state, action) => {
      let itemKeyToDelete = action.payload.Item_Number;
      itemKeyToDelete = itemKeyToDelete.startsWith("@")
        ? itemKeyToDelete.slice(1)
        : itemKeyToDelete;

      const priceListAddedData = action.payload.priceListAddedData;
      const priceListSelectedData = action.payload.priceListSelectedData;

      state.priceListAddedData = priceListAddedData.filter(
        (item) => item.Item_Number.replace("@", "") !== itemKeyToDelete
      );
      state.priceListSelectedData = priceListSelectedData.filter(
        (item) => item.Item_Number.replace("@", "") !== itemKeyToDelete
      );
    },
    clearPriceListState: (state, action) => {
      state.priceListStatus = "idle";
      state.priceListLoading = false;
      state.priceListHeaderData = {};
      state.priceListFilterData = {};
      state.priceListItemsData = [];
      state.priceListAddedData = [];
      state.priceListSelectedData = [];
    },

    clreatFilterAndItems:(state, action) => {
      state.priceListItemsData = [];
      state.priceListAddedData = [];
      state.priceListSelectedData = [];
    },

    //PRINT GROUP ACTION
    printGroupSelectedItems: (state, action) => {
      state.printGroupAddedData = action.payload;
    },
    printGroupAddedItem: (state, action) => {
      state.printGroupAddedData.push(action.payload);
    },
    printGroupDeletedItem: (state, action) => {
      let id = action.payload.id;
      let printSelectedData = action.payload.printGroupAddedData;
      state.printGroupAddedData = printSelectedData.filter(
        (row) => row.RecordID != id
      );
      const rowIndex1 = state.printGroupGetData.findIndex(
        (row) => row.RecordID === id
      );
      if (rowIndex1 !== -1) {
        state.printGroupGetData.splice(rowIndex1, 1);
      }
    },
    clearPrintGroupState: (state, action) => {
      state.printGroupStatus = "idle";
      state.printGroupMessage = "Initiating";
      state.printGroupLoading = false;
      state.printGroupError = false;
      state.printGroupFormData = {};
      state.printGroupGetData = [];
      state.printGroupAddedData = [];
    },

    //CUSTOMER PRICE LIST ACTION
    customerListSelectedItems: (state, action) => {
      state.customerListAddedData = action.payload;
    },
    customerListAddedItem: (state, action) => {
      state.customerListAddedData.push(action.payload);
    },
    customerListDeletedItem: (state, action) => {
      let id = action.payload.id;
      let customerListAddedData = action.payload.customerListAddedData;

      state.customerListAddedData = customerListAddedData.filter(
        (row) => row.RecordID != id
      );

      const rowIndex1 = state.customerListGetData.findIndex(
        (row) => row.RecordID === id
      );

      if (rowIndex1 !== -1) {
        state.customerListGetData.splice(rowIndex1, 1);
      }
    },
    clearCustomerListState: (state, action) => {
      state.customerListStatus = "idle";
      state.customerListMessage = "Initiating";
      state.customerListLoading = false;
      state.customerListError = false;
      state.customerListFormData = {};
      state.customerListGetData = [];
      state.customerListAddedData = [];
    },

    //RUN GROUP ACTION
    runGroupSelectedItems: (state, action) => {
      state.runGroupAddedData = action.payload;
    },
    runGroupAddedItem: (state, action) => {
      state.runGroupAddedData.push(action.payload);
    },
    runGroupDeletedItem: (state, action) => {
      let id = action.payload.id;
      let runGroupAddedData = action.payload.runGroupAddedData;

      state.runGroupAddedData = runGroupAddedData.filter(
        (row) => row.RecordID != id
      );

      const rowIndex1 = state.runGroupGetData.findIndex(
        (row) => row.RecordID === id
      );

      if (rowIndex1 !== -1) {
        state.runGroupGetData.splice(rowIndex1, 1);
      }
    },
    clearRunGroupState: (state, action) => {
      state.runGroupStatus = "idle";
      state.runGroupMessage = "Initiating";
      state.runGroupLoading = false;
      state.runGroupError = false;
      state.runGroupFormData = {};
      state.runGroupGetData = [];
      state.runGroupAddedData = [];
    },

    //UserGroup Company
    companyAdded : (state , action)=>{
      state.userGroupComRow= action.payload;
    },
    applicationAdded : (state , action)=>{
      state.userGroupAppRow= action.payload;
    }, 
    
    //===PP
    addQuoteItemData: (state, action) => {
      state.getQuoteFilterItemData.push(action.payload);
    },
    quoteClearState2: (state, action) => {
      state.getQuoteFilterItemData = [];
      state.getQuoteFilterItemLoading = false;
      state.getQuoteFilterItemStatus = "idle";
      state.getQuoteFilterItemError = null;
    },
    QuoteItemDeletedItem: (state, action) => {
      let id = action.payload;
      console.log(id);

      const rowIndex1 = state.getQuoteFilterItemData.findIndex(
        (row) => row.Item_Number === id
      );
      if (rowIndex1 !== -1) {
        state.getQuoteFilterItemData.splice(rowIndex1, 1);
      }
    },

  },
  extraReducers: (builder) => {
    builder
      // ITEMS
      .addCase(fetchgGetAItems.pending, (state) => {
        state.status = "loading";
        state.priceListAttStatus = "pending";
        state.priceListAttData = {};
        state.loading = true;
      })
      .addCase(fetchgGetAItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.priceListAttStatus = "fulfilled";
        state.loading = false;
        state.getItemsData = action.payload.data;
        state.priceListAttData = action.payload.data;
      })
      .addCase(fetchgGetAItems.rejected, (state, action) => {
        state.status = "failed";
        state.priceListAttStatus = "rejected";
        state.loading = false;
        state.error = action.error.message;
        state.getItemsData = {};
      })

      // PRICE LIST
      .addCase(getPriceListFilterData.pending, (state) => {
        state.priceListItemLoading = true;
      })
      .addCase(getPriceListFilterData.fulfilled, (state, action) => {
        state.priceListItemLoading = false;
        state.priceListItemsData = action.payload.data;
      })
      .addCase(getPriceListFilterData.rejected, (state, action) => {
        state.priceListItemLoading = false;
      })

      .addCase(getPriceListItemGet.pending, (state) => {
        state.status = "loading";
        state.priceListAttStatus = "pending";
        state.priceListAttData = {};
        state.loading = true;
      })
      .addCase(getPriceListItemGet.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.priceListAttStatus = "fulfilled";
        state.loading = false;
        state.priceListAttData = action.payload.data;
      })
      .addCase(getPriceListItemGet.rejected, (state, action) => {
        state.status = "failed";
        state.priceListAttStatus = "rejected";
        state.loading = false;
      })
      .addCase(getPriceListData.pending, (state) => {
        state.priceListStatus = "pending";
        state.priceListMessage = "pending";
        state.priceListLoading = true;
        state.priceListError = false;
        state.priceListHeaderData = {};
        state.priceListFilterData = {};
        state.priceListItemsData = [];
        state.priceListAddedData = [];
      })
      .addCase(getPriceListData.fulfilled, (state, action) => {
        state.priceListStatus = "fulfilled";
        state.priceListMessage = "fulfilled";
        state.priceListLoading = false;
        state.priceListHeaderData = action.payload.data.headerData;
        state.priceListFilterData = action.payload.data.filterData;
        state.priceListItemsData = action.payload.data.itemData;
        state.priceListAddedData = action.payload.data.addHocItems;
      })
      .addCase(getPriceListData.rejected, (state, action) => {
        state.priceListStatus = "rejected";
        state.priceListMessage = action.error.message;
        state.priceListLoading = false;
        state.priceListError = true;
      })
      

      // PRINT GROUP
      .addCase(getprintGroupData.pending, (state) => {
        state.printGroupStatus = "pending";
        state.printGroupLoading = true;
      })
      .addCase(getprintGroupData.fulfilled, (state, action) => {
        state.printGroupStatus = "fulfilled";
        state.printGroupLoading = false;
        state.printGroupFormData = action.payload.data;
        state.printGroupGetData = action.payload.data.PrintList;
      })
      .addCase(getprintGroupData.rejected, (state, action) => {
        state.printGroupStatus = "rejected";
        state.printGroupLoading = false;
        state.printGroupError = true;
      })

      // CUSTOMER PRICE LISTS
      .addCase(getCustomerPriceData.pending, (state) => {
        state.customerListStatus = "pending";
        state.customerListLoading = true;
      })
      .addCase(getCustomerPriceData.fulfilled, (state, action) => {
        state.customerListStatus = "fulfilled";
        state.customerListLoading = false;
        state.customerListFormData = action.payload.data;
        state.customerListGetData = action.payload.data.PriceList;
      })
      .addCase(getCustomerPriceData.rejected, (state, action) => {
        state.customerListStatus = "rejected";
        state.customerListLoading = false;
        state.customerListError = true;
      })

      // RUN GROUP
      .addCase(getRunGroupData.pending, (state) => {
        state.runGroupStatus = "pending";
        state.runGroupLoading = true;
      })
      .addCase(getRunGroupData.fulfilled, (state, action) => {
        state.runGroupStatus = "fulfilled";
        state.runGroupLoading = false;
        state.runGroupFormData = action.payload.data;
        state.runGroupGetData = action.payload.data.RunGroupList;
        // state.runGroupGetData = [];
      })
      .addCase(getRunGroupData.rejected, (state, action) => {
        state.runGroupStatus = "rejected";
        state.runGroupLoading = false;
        state.runGroupError = true;
      })
      //COMPANY
      .addCase(getCompanyData.pending, (state) => {
        state.companyStatus = "pending";
        state.companyLoading = true;
      })
      .addCase(getCompanyData.fulfilled, (state, action) => {
        state.companyStatus = "fulfilled";
        state.companyLoading = false;
        state.companyFormData = action.payload.data;
        
      })
      .addCase(getCompanyData.rejected, (state, action) => {
        state.companyStatus = "rejected";
        state.companyLoading = false;
        state.companyError = true;
      })
      //Application
      .addCase(getApplicationData.pending, (state) => {
        state.applicationStatus = "pending";
        state.applicationLoading = true;
      })
      .addCase(getApplicationData.fulfilled, (state, action) => {
        state.applicationStatus = "fulfilled";
        state.applicationLoading = false;
        state.applicationFormData = action.payload.data;
        
      })
      .addCase(getApplicationData.rejected, (state, action) => {
        state.applicationStatus = "rejected";
        state.applicationLoading = false;
        state.applicationError = true;
      })
      //User
      .addCase(getUserData.pending, (state) => {
        state.userStatus = "pending";
        state.userLoading = true;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.userStatus = "fulfilled";
        state.userLoading = false;
        state.userFormData = action.payload.data;
        
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.userStatus = "rejected";
        state.userLoading = false;
        state.userError = true;
      })
       //User
       .addCase(getUserGroupData.pending, (state) => {
        state.userGroupStatus = "pending";
        state.userGroupLoading = true;
      })
      .addCase(getUserGroupData.fulfilled, (state, action) => {
        state.userGroupLoading = false;
        state.userGroupFormData = action.payload.data;
        state.userGroupAppRow = action.payload.data.ApplicationAccess.filter(item => item.IsSelected === "Y").map(item => item.RecordID);
        state.userGroupComRow = action.payload.data.CompanyAccess.filter(item => item.IsSelected === "Y").map(item => item.RecordID);
        state.userGroupStatus = "fulfilled";
        
      })
      .addCase(getUserGroupData.rejected, (state, action) => {
        state.userGroupStatus = "rejected";
        state.userGroupLoading = false;
        state.userGroupError = true;
      })
      .addCase(fetchGetImage.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchGetImage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.getImageData = action.payload.Data.Image;
      })
      .addCase(fetchGetImage.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.error.message;
        state.getContactData = {};
      })
//==================================================p-p=========================//
.addCase(getQuoteFilterData.pending, (state) => {
  state.getQuoteFilterItemStatus = "pending";
  state.getQuoteFilterItemLoading = true;
  state.getQuoteFilterItemData = [];
})
.addCase(getQuoteFilterData.fulfilled, (state, action) => {
  state.getQuoteFilterItemStatus = "fulfilled";
  state.getQuoteFilterItemLoading = false;
  state.getQuoteFilterItemData = action.payload.data;
})
.addCase(getQuoteFilterData.rejected, (state, action) => {
  state.getQuoteFilterItemStatus = "rejected";
  state.getQuoteFilterItemLoading = false;
  state.getQuoteFilterItemError = action.error.message;
})
.addCase(getQuoteBookData.pending, (state) => {
  state.getQuoteStatus = "loading";
  state.getQuoteLoading = true;
})
.addCase(getQuoteBookData.fulfilled, (state, action) => {
  state.getQuoteStatus = "fulfilled";
  state.getQuoteLoading = false;
})
.addCase(getQuoteBookData.rejected, (state, action) => {
  state.getQuoteStatus = "failed";
  state.getQuoteLoading = false;
  state.getQuoteError = action.error.message;
})
  },
});

export const {
  // PRICELIST ACTION
  priceListSelectedItems,
  priceListAddedItems,
  priceListDeletedItem,
  clearPriceListState,
  clreatFilterAndItems,
  //PRINT GROUP ACTION
  printGroupSelectedItems,
  printGroupAddedItem,
  printGroupDeletedItem,
  clearPrintGroupState,

  //CUSTOMER PRICE LIST ACTION
  customerListSelectedItems,
  customerListAddedItem,
  customerListDeletedItem,
  clearCustomerListState,

  //Run Group
  runGroupSelectedItems,
  runGroupAddedItem,
  runGroupDeletedItem,
  clearRunGroupState,

  //COMPANYACCESS
  companyAdded,
  applicationAdded,



  //============pp
  addQuoteItemData, quoteClearState2, QuoteItemDeletedItem 
} = getSlice.actions;
export default getSlice.reducer;
