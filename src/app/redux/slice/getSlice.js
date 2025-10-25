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

  //PROPRIETARY ITEMS
  proprietaryItemStatus: "idle",
  proprietaryItemMessage: "Initiating",
  proprietaryItemLoading: false,
  proprietaryItemError: false,
  proprietaryItemFormData: {},
  proprietaryItemGetData: [],

  //Company
  companyStatus: "idle",
  companyMessage: "Initiating",
  companyLoading: false,
  companyError: false,
  companyFormData: {},

  //Application
  applicationStatus: "idle",
  applicationMessage: "Initiating",
  applicationLoading: false,
  applicationError: false,
  applicationFormData: {},

  //USER
  userStatus: "idle",
  userMessage: "Initiating",
  userLoading: false,
  userError: false,
  userFormData: {},

  //USERGROUP
  userGroupStatus: "idle",
  userGroupMessage: "Initiating",
  userGroupLoading: false,
  userGroupError: false,
  userGroupFormData: {},
  userGroupAppRow: [],
  userGroupComRow: [],

  //USERGROUPADDED
  companyAddedData: [],

  //CONFIGUREPRICE
  getconfigureData: {},
  getconfigureLoading: false,
  getconfigureStatus: "idle",
  getconfigureError: null,

  configurePriceListAddedData: [],
  configurePriceListGetData: [],
  configurePriceListContactData: [],
  configurePriceListSelectData: [],

  getQuoteProspectData: [],
  getQuoteProspectLoading: false,
  getQuoteProspectStatus: "idle",
  getQuoteProspectError: null,

  getQuoteProspectInfoData: {},
  getQuoteProspectInfoLoading: false,
  getQuoteProspectInfoStatus: "idle",
  getQuoteProspectInfoError: null,

  getQuoteProspectDataItems: [],
  getQuoteProspectLoadingItems: false,
  getQuoteProspectStatusItems: "idle",
  getQuoteProspectErrorItems: null,

  getQuoteFilterItemStatus: "fulfilled",
  getQuoteFilterItemLoading: false,
  getQuoteFilterItemData: [],
  getQuoteFilterItemError: null,
  getQuteFiltData: {},
  getQuoteHeaderData: {},
  getQuteFiltStatus: "idle",
  getQuteFiltLoading: false,
  getQuteFiltError: null,

  getMailConfigData: {},
  getMailConfigLoading: false,
  getMailConfigStatus: "idle",
  getMailConfigError: null,

  getConfigContactData: {},
  getConfigContactLoading: false,
  getConfigContactStatus: "idle",
  getConfigContactError: null,

  mailStatus: "idle",
  mailError: null,
  mailLoading: false,
  mailData: {},

  postAdHocData:[],
  postAdHocLoading:false,
  postAdHocStatus:'idle',
  postAdHocError:null,

//ENQUIRY

  getEnquiryData:[],
  getEnquiryLoading:false,
  getEnquiryStatus:'idle',
  getEnquiryError:null,

  getRefreshPriceList:[],

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
      const URL = `${process.env.REACT_APP_BASE_URL}PriceList/GetPriceList`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
        params:{
          RecordID:id
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
      

export const getPriceListData2 = createAsyncThunk(
  "getPriceListData2/GET",
  async ({ id }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}PriceList/GetPriceList`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
        params:{
          RecordID:id
        }
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

export const getRunGroupData2 = createAsyncThunk(
  "runGroupData2/GET",
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

export const getProprietaryItemsData = createAsyncThunk(
  "getProprietaryItemsData/GET",
  async (data, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}ProprietaryItems/GetProprietaryItem`;
      const response = await axios.get(URL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
        params:data
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
      const URL = `${process.env.REACT_APP_BASE_URL}CompanyModule/GetCompanyData?RecordID=${ID}`;
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
      const URL = `${process.env.REACT_APP_BASE_URL}Image/GetPriceBookImage?${filter}`;
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

export const getQuoteFilterData = createAsyncThunk(
  "getQuoteFilterData/POST",
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

export const getQuoteBookData = createAsyncThunk(
  "get/getQuoteBook", // action type
  async ({ userID, templateID }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}Quote/GetQuoteTemplates?UserId=${userID}&TemplateId=${templateID}`;
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

export const getPriceListItemGet = createAsyncThunk(
  "page/getPriceListItemGet",
  async ({ id = 0, RecordID = 0, type = "PL" }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}PriceList/GetPriceListItemByNumber?RecordID=${RecordID}&PriceListID=${id}&Type=${type}`;
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

export const getProspectListData = createAsyncThunk(
  "get/getProspectListData", // action type
  async ({ data }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}Quotation/GetQuotationList`;
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

export const getProspectInfoData = createAsyncThunk(
  "get/getProspectInfoData", // action type
  async ({ data }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}Quotation/GetQuotation`;
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

export const getProspectContractItems = createAsyncThunk(
  "get/getProspectContractItems", // action type
  async ({ data }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}Quotation/GetContractItems`;
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

export const getConfigPriceBook = createAsyncThunk(
  "page/getConfigPriceBook",
  async ({ ID }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}PriceBookConfiguration/GetPricebookConfiguration?RecordID=${ID}`;
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

export const getConfigPriceBook2 = createAsyncThunk(
  "page/getConfigPriceBook2",
  async ({ ID }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}PriceBookConfiguration/GetPricebookConfiguration?RecordID=${ID}`;
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

export const getQuoteItemsAndFilters = createAsyncThunk(
  "get/getQuoteItemsAndFilters", // action type
  async ({ data }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}Quotation/GetQutationConditionItems`;
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

export const getQuoteItemsAndFiltersget2 = createAsyncThunk(
  "get/getQuoteItemsAndFiltersget2", // action type
  async ({ data }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}Quotation/GetQutationConditionItems`;
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

export const getQuoteItemsAndFiltersget3 = createAsyncThunk(
  "get/getQuoteItemsAndFiltersget3", // action type
  async ({ data }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}Quotation/GetQutationConditionItems`;
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

export const getmailConfig = createAsyncThunk(
  "get/getmailConfig", // action type
  async (data, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}EmailTemplate/GetEmailTemplate`;
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

export const getConfigContact = createAsyncThunk(
  "get/getConfigContact", // action type
  async (data, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}PriceBookContact/GetPriceBookcontact`;
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

export const getCompanyMailConfig = createAsyncThunk(
  "get/getCompanyMailConfig", // action type
  async ({ ID, type }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}EmailTemplate/GetEmailTemplate?CompanyID=${ID}&&Type=${type}`;
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
export const PostAddHocItems = createAsyncThunk(
  "post/PostConfigurePriceListID", // Action type string
  async ({ adhocdata,compID }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}PriceList/PostAdHocItem_V1?CompanyID=${compID}`;
      const response = await axios.post(URL, adhocdata, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
          "Content-Type": "application/json",
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
// ItemMaster/GetItemEnquiry?ItemNumber=017973&CompanyID=5
export const getEnquiryItems = createAsyncThunk(
  "get/getEnquiryItems", // action type
  async ({ ID, CompanyID }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}ItemMaster/GetItemEnquiry?ItemNumber=${ID}&CompanyID=${CompanyID}`;
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










//EFRESH

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
      state.postAdHocData=[];
    },

    clreatFilterAndItems: (state, action) => {
      state.priceListItemsData = [];
      state.priceListAddedData = [];
      state.priceListSelectedData = [];
       state.postAdHocData=[]
    },

    //PRINT GROUP ACTION
    printGroupSelectedItems: (state, action) => {
      state.printGroupAddedData = action.payload;
    },
    printGroupAddedItem: (state, action) => {
      console.log("🚀 ~ action:", action)
      // state.printGroupAddedData.push(action.payload);

      action.payload.forEach((newItem) => {
        const exists = state.printGroupAddedData.some(
          (existingItem) =>
            existingItem.RecordID === newItem.RecordID
        );
        if (!exists) {
          state.printGroupAddedData.push(newItem);
        }
      });
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
      action.payload.forEach((newItem) => {
        const exists = [
          ...state.runGroupAddedData,
          ...state.runGroupGetData,
        ].some(
          (existingItem) =>
            existingItem.CustomerNumber === newItem.CustomerNumber
        );
        if (!exists) {
          state.runGroupAddedData.push(newItem);
        }
      });
    },
    runGroupDeletedItem: (state, action) => {
      let id = action.payload.id;
      let runGroupAddedData = action.payload.runGroupAddedData;

      state.runGroupAddedData = runGroupAddedData.filter(
        (row) => row.CustomerNumber != id
      );

      const rowIndex1 = state.runGroupGetData.findIndex(
        (row) => row.CustomerNumber === id
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

    proprietaryItemAddedItem: (state, action) => {
      action.payload.forEach((newItem) => {
        const exists = state.proprietaryItemGetData.some(
          (existingItem) =>
            existingItem.CustomerNumber === newItem.CustomerNumber
        );
        if (!exists) {
          state.proprietaryItemGetData.push(newItem);
        }
      });
    },

    proprietaryItemDeletedItem: (state, action) => {
      let id = action.payload.id;

      const rowIndex1 = state.proprietaryItemGetData.findIndex(
        (row) => row.CustomerNumber === id
      );

      if (rowIndex1 !== -1) {
        state.proprietaryItemGetData.splice(rowIndex1, 1);
      }
    },

    //UserGroup Company
    companyAdded: (state, action) => {
      state.userGroupComRow = action.payload;
    },
    applicationAdded: (state, action) => {
      state.userGroupAppRow = action.payload;
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
    configureSelectedPriceList: (state, action) => {
      state.configurePriceListAddedData = action.payload;
    },
    configureAddedPriceList: (state, action) => {
      // state.configurePriceListAddedData.push(action.payload);
      action.payload.forEach((newItem) => {
        const exists = state.configurePriceListAddedData.some(
          (existingItem) =>
            existingItem.RecordID === newItem.RecordID
        );
        if (!exists) {
          state.configurePriceListAddedData.push(newItem);
        }
      });
    },
    configurePriceListDeleted: (state, action) => {
      let id = action.payload.id;
      let configurePriceListSelectData =
        action.payload.configurePriceListAddedData;
      state.configurePriceListAddedData = configurePriceListSelectData.filter(
        (row) => row.RecordID != id
      );
      const rowIndex1 = state.configurePriceListGetData.findIndex(
        (row) => row.RecordID === id
      );
      if (rowIndex1 !== -1) {
        state.configurePriceListGetData.splice(rowIndex1, 1);
      }
    },
    clearConfigurePriceList: (state, action) => {
      state.getconfigureData = {};
      state.getconfigureLoading = false;
      state.getconfigureStatus = "idle";
      state.getconfigureError = null;
      state.configurePriceListAddedData = [];
      state.configurePriceListGetData = [];
    },
    clearStateProspectInfoQuote: (state, action) => {
      state.getQuoteProspectDataItems = [];
      state.getQuoteProspectLoadingItems = false;
      state.getQuoteProspectStatusItems = "idle";
      state.getQuoteProspectErrorItems = null;
    },
    onCheckboxChangePriceListEdit: (state, action) => {
      const { id, field, adhocItem } = action.payload;
      if (adhocItem == "Y") {
        const updatedRow = state.postAdHocData.map((row) =>
          row.RecordId === id ? { ...row, [field]: !row[field] } : row
        );

        state.postAdHocData = updatedRow;
      } else {
        const updatedRow = state.priceListItemsData.map((row) =>
          row.RecordId === id ? { ...row, [field]: !row[field] } : row
        );

        state.priceListItemsData = updatedRow;
      }
    },
    adHocPriceListDeleted: (state, action) => {
      const idToDelete = action.payload.idToDelete;
    
      console.log("Before deletion:", state.priceListItemsData.map(i => i.RecordId));
      console.log("Deleting RecordId:", idToDelete);
    
      const indexToRemove = state.priceListItemsData.findIndex(
        (item) => item.RecordId === idToDelete
      );
      console.log("After deletion:", state.priceListItemsData.map(i => i.RecordId));
      if (indexToRemove !== -1) {
        state.priceListItemsData.splice(indexToRemove, 1); // ✅ in-place mutation
      }

      console.log("Before deletion:", state.postAdHocData.map(i => i.RecordId));
      const indexToRemove1 = state.postAdHocData.findIndex(
        (item) => item.RecordId === idToDelete
      );
    
      if (indexToRemove1 !== -1) {
        state.postAdHocData.splice(indexToRemove, 1); // ✅ in-place mutation
      }
    
      console.log("After deletion:", state.postAdHocData.map(i => i.RecordId));
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConfigContact.pending, (state) => {
        state.getConfigContactData = {};
        state.getConfigContactLoading = true;
        state.getConfigContactStatus = "pending";
        state.getConfigContactError = null;
      })
      .addCase(getConfigContact.fulfilled, (state, action) => {
        state.getConfigContactData = action.payload.data;
        state.getConfigContactLoading = false;
        state.getConfigContactStatus = "fulfilled";
      })
      .addCase(getConfigContact.rejected, (state, action) => {
        state.getConfigContactError = action.error.message;
        state.getConfigContactLoading = false;
        state.getConfigContactStatus = "rejected";
      })
      .addCase(getmailConfig.pending, (state) => {
        state.getMailConfigData = {};
        state.getMailConfigLoading = true;
        state.getMailConfigStatus = "pending";
      })
      .addCase(getmailConfig.fulfilled, (state, action) => {
        state.getMailConfigData = action.payload.data;
        state.getMailConfigLoading = false;
        state.getMailConfigStatus = "fulfilled";
      })
      .addCase(getmailConfig.rejected, (state, action) => {
        state.getMailConfigError = action.error.message;
        state.getMailConfigLoading = false;
        state.getMailConfigStatus = "rejected";
      })
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
        state.priceListItemsData = action.payload.data.itemData.filter(x => x.AdHocItem != "Y");
        state.postAdHocData = action.payload.data.addHocItems;
        // state.priceListAddedData = action.payload.data.addHocItems;

      })
      .addCase(getPriceListData.rejected, (state, action) => {
        state.priceListStatus = "rejected";
        state.priceListMessage = action.error.message;
        state.priceListLoading = false;
        state.priceListError = true;
      })

      .addCase(getPriceListData2.fulfilled, (state, action) => {
        state.priceListItemsData = action.payload.data.itemData;
        state.priceListAddedData = action.payload.data.addHocItems;
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

      // RUN GROUP
      .addCase(getRunGroupData2.pending, (state) => {
        state.runGroupLoading = true;
      })
      .addCase(getRunGroupData2.fulfilled, (state, action) => {
        state.runGroupLoading = false;
        state.runGroupGetData = action.payload.data.RunGroupList;
      })
      .addCase(getRunGroupData2.rejected, (state, action) => {
        state.runGroupLoading = false;
      })
      //PROPRIETARY ITEMS
      .addCase(getProprietaryItemsData.pending, (state) => {
        state.proprietaryItemStatus = "pending";
        state.proprietaryItemLoading = true;
        state.proprietaryItemError = false;
      })
      .addCase(getProprietaryItemsData.fulfilled, (state, action) => {
        state.proprietaryItemStatus = "fulfilled";
        state.proprietaryItemLoading = false;
        state.proprietaryItemFormData = action.payload.data;
        state.proprietaryItemGetData = action.payload.data.CustomerLists;
      })
      .addCase(getProprietaryItemsData.rejected, (state, action) => {
        state.proprietaryItemStatus = "rejected";
        state.proprietaryItemLoading = false;
        state.proprietaryItemError = true;
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
        state.userGroupAppRow = action.payload.data.ApplicationAccess.filter(
          (item) => item.IsSelected === "Y"
        ).map((item) => item.RecordID);
        state.userGroupComRow = action.payload.data.CompanyAccess.filter(
          (item) => item.IsSelected === "Y"
        ).map((item) => item.RecordID);
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

      .addCase(getProspectListData.pending, (state) => {
        state.getQuoteProspectStatus = "loading";
        state.getQuoteProspectLoading = true;
        state.getQuoteProspectData = [];
      })
      .addCase(getProspectListData.fulfilled, (state, action) => {
        state.getQuoteProspectStatus = "fulfilled";
        state.getQuoteProspectLoading = false;
        state.getQuoteProspectData = action.payload.data;
      })
      .addCase(getProspectListData.rejected, (state, action) => {
        state.getQuoteProspectStatus = "rejected";
        state.getQuoteProspectLoading = false;
        state.getQuoteProspectError = action.error.message;
      })

      .addCase(getProspectInfoData.pending, (state) => {
        state.getQuoteProspectInfoStatus = "loading";
        state.getQuoteProspectInfoLoading = true;
        state.getQuoteProspectInfoError = null;
      })
      .addCase(getProspectInfoData.fulfilled, (state, action) => {
        state.getQuoteProspectInfoStatus = "fulfilled";
        state.getQuoteProspectInfoLoading = false;
        state.getQuoteProspectInfoData = action.payload.data;
      })
      .addCase(getProspectInfoData.rejected, (state, action) => {
        state.getQuoteProspectInfoStatus = "rejected";
        state.getQuoteProspectInfoLoading = false;
        state.getQuoteProspectInfoError = action.error.message;
      })

      .addCase(getProspectContractItems.pending, (state) => {
        state.getQuoteProspectStatusItems = "loading";
        state.getQuoteProspectLoadingItems = true;
        state.getQuoteProspectErrorItems = null;
      })
      .addCase(getProspectContractItems.fulfilled, (state, action) => {
        state.getQuoteProspectStatusItems = "fulfilled";
        state.getQuoteProspectLoadingItems = false;
        state.getQuoteProspectDataItems = action.payload.data;
      })
      .addCase(getProspectContractItems.rejected, (state, action) => {
        state.getQuoteProspectStatusItems = "rejected";
        state.getQuoteProspectLoadingItems = false;
        state.getQuoteProspectErrorItems = action.error.message;
      })

      //==================================CONFIGURE PRICE BOOK===========================//
      .addCase(getConfigPriceBook.pending, (state) => {
        state.getconfigureStatus = "pending";
        state.getconfigureLoading = true;
        state.getconfigureData = {};
        state.configurePriceListGetData = [];
        state.configurePriceListContactData = [];
      })
      .addCase(getConfigPriceBook.fulfilled, (state, action) => {
        state.getconfigureStatus = "fulfilled";
        state.getconfigureLoading = false;
        state.getconfigureData = action.payload.data;
        state.configurePriceListGetData = action.payload.data.PriceList;
        state.configurePriceListContactData = action.payload.data.Contacts;
      })
      .addCase(getConfigPriceBook.rejected, (state, action) => {
        state.getconfigureStatus = "rejected";
        state.getconfigureLoading = false;
        state.userError = true;
      })

      .addCase(getConfigPriceBook2.fulfilled, (state, action) => {
        state.getconfigureData = action.payload.data;
        state.configurePriceListGetData = action.payload.data.PriceList;
        state.configurePriceListContactData = action.payload.data.Contacts;
      })

      .addCase(getQuoteItemsAndFilters.pending, (state) => {
        state.getQuoteFilterItemData = [];
        state.getQuteFiltData = {};
        state.getQuoteHeaderData = {};

        state.getQuoteFilterItemLoading = true;
        state.getQuteFiltLoading = true;

        state.getQuoteFilterItemStatus = "pending";
        state.getQuteFiltStatus = "pending";
      })
      .addCase(getQuoteItemsAndFilters.fulfilled, (state, action) => {
        state.getQuoteHeaderData = action.payload.data.headerdata;
        state.getQuteFiltData = action.payload.data.filterData;
        state.getQuoteFilterItemData = action.payload.data.itemData;

        state.getQuteFiltLoading = false;
        state.getQuoteFilterItemLoading = false;
        state.getQuoteFilterItemStatus = "fulfilled";
        state.getQuteFiltStatus = "fulfilled";
      })
      .addCase(getQuoteItemsAndFilters.rejected, (state, action) => {
        state.getQuoteFilterItemLoading = false;
        state.getQuteFiltLoading = false;

        state.getQuoteFilterItemStatus = "rejected";
        state.getQuteFiltStatus = "rejected";

        state.getQuoteFilterItemError = action.error.message;
        state.getQuoteFilterItemError = action.error.message;
      })

      .addCase(getQuoteItemsAndFiltersget2.fulfilled, (state, action) => {
        state.getQuoteHeaderData = action.payload.data.headerdata;
        state.getQuteFiltData = action.payload.data.filterData;
      })
      .addCase(getQuoteItemsAndFiltersget3.fulfilled, (state, action) => {
        state.getQuoteFilterItemData = action.payload.data.itemData;
      })

      //COMPANY--MAIL
      .addCase(getCompanyMailConfig.pending, (state) => {
        state.mailStatus = "pending";
        state.mailLoading = true;
      })
      .addCase(getCompanyMailConfig.fulfilled, (state, action) => {
        state.mailStatus = "fulfilled";
        state.mailLoading = false;
        state.mailData = action.payload.data;
      })
      .addCase(getCompanyMailConfig.rejected, (state, action) => {
        state.mailStatus = "rejected";
        state.mailLoading = false;
        state.mailError = true;
      })
      .addCase(PostAddHocItems.pending, (state) => {
        // state.postAdHocData = [];
        state.postAdHocLoading = true;
        state.postAdHocStatus = "pending";
      })
      .addCase(PostAddHocItems.fulfilled, (state, action) => {
        // console.log("🚀 ~ action.payload.data.forEach ~  state.postAdHocData:",  state.postAdHocData)
        // console.log("🚀 ~ .addCase ~ action.payload:", action.payload)
        // state.postAdHocData = [...state.postAdHocData,...action.payload.data];
        if (Array.isArray(action.payload?.data)) {
          action.payload.data.forEach((newItem) => {
            state.postAdHocData.push(newItem);
          });
        } else {
          console.warn('Expected array in action.payload.data, but got:', action.payload?.data);
        }
        
        // action.payload.data.forEach((newItem) => {

     
        //     state.postAdHocData.push(newItem);
          
        //   });
          // console.log("🚀 ~ action.payload.data.forEach ~  state.postAdHocData:",  state.postAdHocData)
        state.postAdHocLoading = false;
        state.postAdHocStatus = "fulfilled";
        
      })
       
      .addCase(PostAddHocItems.rejected, (state, action) => {
        state.postAdHocError = action.error.message;
        state.postAdHocLoading = false;
        state.postAdHocStatus = "rejected";
      })
      .addCase(getEnquiryItems.pending, (state) => {
        state.getEnquiryData = [];
        state.getEnquiryLoading = true;
        state.getEnquiryStatus = "pending";
      })
      .addCase(getEnquiryItems.fulfilled, (state, action) => {
        state.getEnquiryData = action.payload.data;
        state.getEnquiryLoading = false;
        state.getEnquiryStatus = "fulfilled";
      })
      .addCase(getEnquiryItems.rejected, (state, action) => {
        state.getEnquiryError = action.error.message;
        state.getEnquiryLoading = false;
        state.getEnquiryStatus = "rejected";
      });
  },
});

export const {
  onCheckboxChangePriceListEdit,
  clearStateProspectInfoQuote,
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

  proprietaryItemAddedItem,
  proprietaryItemDeletedItem,
  //COMPANYACCESS
  companyAdded,
  applicationAdded,

  //============pp
  addQuoteItemData,
  quoteClearState2,
  QuoteItemDeletedItem,

  //======CONFi
  configureSelectedPriceList,
  configureAddedPriceList,
  configurePriceListDeleted,
  clearConfigurePriceList,


 // ===
 adHocPriceListDeleted,
} = getSlice.actions;
export default getSlice.reducer;
