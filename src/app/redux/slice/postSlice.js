import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const initialState = {
  loading: false,
  status: "idle",
  error: null,
  postBuildPBData: {},
  postCdata:{},


  runGroupMailState:"idle",
  runGroupMailMessage:"Initiating Group Mail",
  runGroupMailLoading:false,
  runGroupMailError:false,
  runGroupMailIsAction:false,
  
};





export const updateContactData = createAsyncThunk(
  "data/updateContactData", // Action type string
  async ({ cData }) => {
    try {
      // Set your API URL
        const URL = `${process.env.REACT_APP_BASE_URL}PriceBookContact/UpdatePriceBookcontact`
      // Make the POST request with Axios, adding Authorization header
      const response = await axios.put(URL, cData, {
        headers: {
          Authorization:process.env.REACT_APP_API_TOKEN,
          "Content-Type": "application/json",
        },
      });

      // Return the response data if successful
      return response.data;
    } catch (error) {
      
    }
  }
);

export const postBuildData = createAsyncThunk(
  "data/postData", // Action type string
  async ({ bpbData }) => {
    try {
      // Set your API URL
        const URL = `${process.env.REACT_APP_BASE_URL}Customer/PostPriceBookTemplate`
      // Make the POST request with Axios, adding Authorization header
      const response = await axios.post(URL, bpbData, {
        headers: {
          Authorization:process.env.REACT_APP_API_TOKEN,
          "Content-Type": "application/json",
        },
      });

      // Return the response data if successful
      return response.data;
    } catch (error) {
      
    }
  }
);

export const updateBuildPriceData = createAsyncThunk(
  "data/updateBuildPriceData", // Action type string
  async ({ data },{rejectWithValue}) => {
    try {
        const URL = `${process.env.REACT_APP_BASE_URL}Customer/UpdatePriceBookTemplate`
      const response = await axios.put(URL, data, {
        headers: {
          Authorization:process.env.REACT_APP_API_TOKEN,
          "Content-Type": "application/json",
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

export const deleteBuildPriceData = createAsyncThunk(
  "data/deleteBuildPriceData", // Action type string
  async ({ id },{rejectWithValue}) => {
    try {
        const URL = `${process.env.REACT_APP_BASE_URL}Customer/DeletePriceBookTemplate?RecordId=${id}`
      const response = await axios.delete(URL,  {
        headers: {
          Authorization:process.env.REACT_APP_API_TOKEN,
          "Content-Type": "application/json",
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

export const deleteFavorite = createAsyncThunk(
  "data/deleteFavorite", // Action type string
  async ({ id }) => {
    try {
        const URL = `${process.env.REACT_APP_BASE_URL}User/DeleteFavorites?RecordId=${id}`
      const response = await axios.delete(URL,  {
        headers: {
          Authorization:process.env.REACT_APP_API_TOKEN,
          "Content-Type": "application/json",
        },
      });
      // toast.success('Favorite removed successfully')
      return response.data;
    } catch (error) {
      // toast.error('Something went wrong')
    }
  }
);

export const postQutoeData = createAsyncThunk(
  "quote/postData", // Action type string
  async ({ data }) => {
    try {
      // Set your API URL
        const URL = `${process.env.REACT_APP_BASE_URL}Quote/PostQuote`
      // Make the POST request with Axios, adding Authorization header
      const response = await axios.post(URL, data, {
        headers: {
          Authorization:process.env.REACT_APP_API_TOKEN,
          "Content-Type": "application/json",
        },
      });

      // Return the response data if successful
      return response.data;
    } catch (error) {
      
    }
  }
);

export const updateQuoteData = createAsyncThunk(
  "data/updateQuoteData", // Action type string
  async ({ data },{rejectWithValue}) => {
    try {
        const URL = `${process.env.REACT_APP_BASE_URL}Quote/UpdatePostQuote`
      const response = await axios.put(URL, data, {
        headers: {
          Authorization:process.env.REACT_APP_API_TOKEN,
          "Content-Type": "application/json",
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

export const deleteQuotePriceData = createAsyncThunk(
  "data/deleteQuotePriceData", // Action type string
  async ({ id }) => {
    try {
        const URL = `${process.env.REACT_APP_BASE_URL}Quote/DeleteQuoteTemplate?RecordId=${id}`
      const response = await axios.delete(URL,  {
        headers: {
          Authorization:process.env.REACT_APP_API_TOKEN,
          "Content-Type": "application/json",
        },
      });
 
      return response.data;
    } catch (error) {
      console.log("🚀 ~ error:", error)
      // toast.error('Something went wrong')
    }
  }
);

export const runGroupMailData = createAsyncThunk(
  "data/runGroupMailData", // Action type string
  async ({ data },{rejectWithValue}) => {
    try {
        const URL = `${process.env.REACT_APP_BASE_URL}GPRungroup/PostCustomerMailQueue`
      const response = await axios.post(URL, data, {
        headers: {
          Authorization:process.env.REACT_APP_API_TOKEN,
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

export const postConfigPriceData = createAsyncThunk(
  "data/postConfigPriceData", // Action type string
  async ({ data },{rejectWithValue}) => {
    try {
      // Set your API URL
        const URL = `${process.env.REACT_APP_BASE_URL}ConfigurePriceBook/PostConfigurePB`
      // Make the POST request with Axios, adding Authorization header
      const response = await axios.post(URL, data, {
        headers: {
          Authorization:process.env.REACT_APP_API_TOKEN,
          "Content-Type": "application/json",
        },
      });

      // Return the response data if successful
      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const updateConfigPriceData = createAsyncThunk(
  "data/updateConfigPriceData", // Action type string
  async ({ data },{rejectWithValue}) => {
    try {
        const URL = `${process.env.REACT_APP_BASE_URL}ConfigurePriceBook/UpdateConfigurePB`
      const response = await axios.put(URL, data, {
        headers: {
          Authorization:process.env.REACT_APP_API_TOKEN,
          "Content-Type": "application/json",
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
// 
export const updatesettingData = createAsyncThunk(
  "data/updatesettingData", // Action type string
  async ({ data },{rejectWithValue}) => {
    try {
        const URL = `${process.env.REACT_APP_BASE_URL}User/UpdateDefaultRungroup`
      const response = await axios.put(URL, data, {
        headers: {
          Authorization:process.env.REACT_APP_API_TOKEN,
          "Content-Type": "application/json",
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


export const postSpecialsImgData = createAsyncThunk(
  "data/postSpecialsImgData", // Action type string
  async ({ data },{rejectWithValue}) => {
    try {
      // Set your API URL
        const URL = `${process.env.REACT_APP_BASE_URL}Special/PostSpecial`
      // Make the POST request with Axios, adding Authorization header
      const response = await axios.post(URL, data, {
        headers: {
          Authorization:process.env.REACT_APP_API_TOKEN,
          "Content-Type": "application/json",
        },
      });

      // Return the response data if successful
      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);


export const deleteSpecialsImgData = createAsyncThunk(
  "data/deleteSpecialsImgData", // Action type string
  async ({ id },{rejectWithValue}) => {
    try {
      // Set your API URL
        const URL = `${process.env.REACT_APP_BASE_URL}Special/DeleteSpecial?RecordId=${id}`
      // Make the POST request with Axios, adding Authorization header
      const response = await axios.delete(URL, {
        headers: {
          Authorization:process.env.REACT_APP_API_TOKEN,
          "Content-Type": "application/json",
        },
      });

      // Return the response data if successful
      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const postContactData = createAsyncThunk(
  "data/postContactData", // Action type string
  async ({ cData },{rejectWithValue}) => {
    try {
      // Set your API URL
        const URL = `${process.env.REACT_APP_BASE_URL}PriceBookContact/PostPriceBookcontact`
      // Make the POST request with Axios, adding Authorization header
      const response = await axios.post(URL, cData, {
        headers: {
          Authorization:process.env.REACT_APP_API_TOKEN,
          "Content-Type": "application/json",
        },
      });

      // Return the response data if successful
      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
// PriceBookContact/DeletePriceBookcontact
export const deleteCustomerInfoData = createAsyncThunk(
  "data/deleteCustomerInfoData", // Action type string
  async ({ id },{rejectWithValue}) => {
    try {
      // Set your API URL
        const URL = `${process.env.REACT_APP_BASE_URL}PriceBookContact/DeletePriceBookcontact?RecordId=${id}`
      // Make the POST request with Axios, adding Authorization header
      const response = await axios.delete(URL, {
        headers: {
          Authorization:process.env.REACT_APP_API_TOKEN,
          "Content-Type": "application/json",
        },
      });

      // Return the response data if successful
      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);


export const quoteInfoData = createAsyncThunk(
  "post/quoteInfoData", // Action type string
  async ({ data },{rejectWithValue}) => {
    try {
        const URL = `${process.env.REACT_APP_BASE_URL}Quotation/PostQuotation`
      const response = await axios.post(URL, data, {
        headers: {
          Authorization:process.env.REACT_APP_API_TOKEN,
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



export const quoteFilterAndItemPostData = createAsyncThunk(
  "post/quoteInfoData", // Action type string
  async ({ data,RecordId },{rejectWithValue}) => {
    try {
        const URL = `${process.env.REACT_APP_BASE_URL}Quotation/PostQuoteConditions?RecordId=${RecordId}`
      const response = await axios.post(URL, data, {
        headers: {
          Authorization:process.env.REACT_APP_API_TOKEN,
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

//=================================================CONTROL-PANEL=======================================//

export const priceListHeaderPost = createAsyncThunk(
  "priceListHeader/POST",
  async ({ data }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}PriceList/PostPriceListHeader`;
      const response = await axios.post(URL, data, {
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


export const priceListItemPost = createAsyncThunk(
    "priceListItem/POST",
    async ({ data,priceListID }, { rejectWithValue }) => {
      try {
        const URL = `${process.env.REACT_APP_BASE_URL}PriceList/PostPriceList?PricelistId=${priceListID}`;
        const response = await axios.post(URL, data, {
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



  export const priceListConditionsPost = createAsyncThunk(
    "priceListConditions/POST",
    async ({ data }, { rejectWithValue }) => {
      try {
        const URL = `${process.env.REACT_APP_BASE_URL}PriceList/PostPriceCondition`;
        const response = await axios.post(URL, data, {
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

  export const priceListDelete = createAsyncThunk(
    "priceList/DELETE",
    async ({ id }, { rejectWithValue }) => {
      try {
        const URL = `${process.env.REACT_APP_BASE_URL}PriceList/DeletePriceList`;
        const response = await axios.delete(URL, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
          params: {
            Recordid: id, // This ensures the parameter is added to the query string
          },
        })
        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response ? error.response.data : error.message
        );
      }
    }
  );



  export const runGroupDelete = createAsyncThunk(
    "rungroup/DELETE",
    async ({ id }, { rejectWithValue }) => {
      try {
        const URL = `${process.env.REACT_APP_BASE_URL}GPRungroup/DeleteRunGroup`;
        const response = await axios.delete(URL, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
          params: {
            Recordid: id, // This ensures the parameter is added to the query string
          },
        })
        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response ? error.response.data : error.message
        );
      }
    }
  );
  
  export const customerPriceListPost = createAsyncThunk(
    "customerPriceList/POST",
    async ({ Cdata }, { rejectWithValue }) => {
      try {
        const URL = `${process.env.REACT_APP_BASE_URL}CustomerPriceList/PostCustomerPriceList`;
        const response = await axios.post(URL, Cdata, {
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
 
  export const deleteCustomerData = createAsyncThunk(
    "customerp/deleteData", // Action type string
    async ({ ID }) => {
      try {
        // Set your API URL
          const URL = `${process.env.REACT_APP_BASE_URL} CustomerPriceList/DeleteCustomerPrice?Recordid=${ID}`
        // Make the POST request with Axios, adding Authorization header
        const response = await axios.delete(URL, {
          headers: {
            Authorization:process.env.REACT_APP_API_TOKEN,
            "Content-Type": "application/json",
          },
        });
  
        // Return the response data if successful
        return response.data;
      } catch (error) {
        
      }
    }
  ); 

  export const runGroupPost = createAsyncThunk(
    "runGroupPost/POST",
    async ({ rData }, { rejectWithValue }) => {
      try {
        const URL = `${process.env.REACT_APP_BASE_URL}GPRungroup/PostRunGroup`;
        const response = await axios.post(URL, rData, {
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

  //====================+COMPANY POST========================//
  
  export const CompanyPost = createAsyncThunk(
    "CompanyPost/POST",
    async ({ companyData }, { rejectWithValue }) => {
      try {
        const URL = `${process.env.REACT_APP_BASE_URL}CompanyModule/PostCompany`;
        const response = await axios.post(URL, companyData, {
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

  //====================+APPLICATION POST========================//
  
  export const applicationPost = createAsyncThunk(
    "applicationPost/POST",
    async ({ appData }, { rejectWithValue }) => {
      try {
        const URL = `${process.env.REACT_APP_BASE_URL}Application/PostApplication`;
        const response = await axios.post(URL, appData, {
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
 //====================+USER POST========================//
  
 export const userPost = createAsyncThunk(
  "userPost/POST",
  async ({ userData }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}UserModule/PostCompany`;
      const response = await axios.post(URL, userData, {
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
//====================+USER DELET========================//
export const deleteUserData = createAsyncThunk(
  "user/deleteData", // Action type string
  async ({ ID },{rejectWithValue}) => {
    try {
      // Set your API URL
        const URL = `${process.env.REACT_APP_BASE_URL}UserModule/DeleteUser?RecordID=${ID}`
      // Make the POST request with Axios, adding Authorization header
      const response = await axios.delete(URL, {
        headers: {
          Authorization:process.env.REACT_APP_API_TOKEN,
          "Content-Type": "application/json",
        },
      });

      // Return the response data if successful
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
//====================+USER POST========================//
  
export const userGroupPost = createAsyncThunk(
  "userGroupPost/POST",
  async ({ userGroupData }, { rejectWithValue }) => {
    try {
      const URL = `${process.env.REACT_APP_BASE_URL}UserGroup/PostUserGroup`;
      const response = await axios.post(URL, userGroupData, {
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
//====================+USER DELET========================//
export const deleteUserGroupData = createAsyncThunk(
  "userGroup/deleteData", // Action type string
  async ({ ID },{rejectWithValue}) => {
    try {
      // Set your API URL
        const URL = `${process.env.REACT_APP_BASE_URL}UserGroup/DeleteUserGroup?RecordID=${ID}`
      // Make the POST request with Axios, adding Authorization header
      const response = await axios.delete(URL, {
        headers: {
          Authorization:process.env.REACT_APP_API_TOKEN,
          "Content-Type": "application/json",
        },
      });

      // Return the response data if successful
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
//==========================POST-Image=============================//
export const postImage = createAsyncThunk(
  "data/postData", // Action type string
  async ({ idata },{rejectWithValue}) => {
    try {
      // Set your API URL
        const URL = `${process.env.REACT_APP_BASE_URL}Image/ImageUpload`
      console.log("idata-------------", idata);

      // Make the POST request with Axios, adding Authorization header
      const response = await axios.post(URL, idata, {
        headers: {
          Authorization:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiODFlMTVlODVmZDhmYzMxMzk3NWY3MGNiODEwMjc3YWVhODRmODlkNjc4Y2I0ZDFkNTM2NGUyMjFlNWY4YzMxODQyYmYyMjY4MmJkMDYyZGMiLCJpYXQiOjE3MjI1MTk3NDAuMTk2OTg1LCJuYmYiOjE3MjI1MTk3NDAuMTk2OTk2LCJleHAiOjE3NTQwNTU3NDAuMTUyOTYzLCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.F4lOKPPewIKjbJKK-HPgBfK_mnG2Rzw4AUv4w87HGXLSXl3GYfGurHAlTriVQ-KkpOftCv_QGDDflCB2MG4D0bV6rcGsD7Ayvr40yk_m3Fyz1AhB2w70Y7gMpfhd_3hEDNWZ-V9lAgH24s-UCdFqKFwZkd9icQ84NfRij9bay3M7mjJ_KR06-cfuVMGhZFGnw89jiFr5FDt1DpWeqzAOjFIBtCfywV0CvNFMJtDrNvtjAzRAbR0vDVaXZBk0xa6aMyxBhhFX4fC9FaRAU15a9oQh2RH4OheNOvqH54v32BBXHx305g-S1DLYXQWlPUZROoTiaDrJezHPog3QKZlC3J7cscLIt-nd4XlYVe9ntMOGk7rzXvEAhcai1-yTkHZZfNfy7EIifi0hXcJrR9NbRjdloPjfGCo3BsH425V3PhUyr_OaC9KxxUHHLwmEnyCWlFIfAzyMpC9g7NqpSVDYcVt--mzxGkdY6_PF-g0e43h9d1g8uxbD6iZtLVAejpsmqoEWaJxKJNrESLiYOoYu0QFGFl46bkbuTwhepswe5Pwjs54S-ps7DB2igPgT9rABF-eotflzG-zruLGQNSO-fjRY5KjSE97n2W348DKjPxHF3U1q9BW2KhGAdb-h4bOKOT6Lu4cpN7v1eRnMxucEZV3a5kIrWc2xg-7H_s3zXi4", // Assuming the token is stored in localStorage
          "Content-Type": "application/json",
        },
      });

      // Return the response data if successful
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);


export const postPriceListItems = createAsyncThunk(
  "data/postData", // Action type string
  async ({ idata },{rejectWithValue}) => {
    try {
      // Set your API URL
        const URL = `${process.env.REACT_APP_BASE_URL}PriceList/UpdatePriceListItems`
      console.log("idata-------------", idata);

      // Make the POST request with Axios, adding Authorization header
      const response = await axios.post(URL, idata, {
        headers: {
          Authorization:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiODFlMTVlODVmZDhmYzMxMzk3NWY3MGNiODEwMjc3YWVhODRmODlkNjc4Y2I0ZDFkNTM2NGUyMjFlNWY4YzMxODQyYmYyMjY4MmJkMDYyZGMiLCJpYXQiOjE3MjI1MTk3NDAuMTk2OTg1LCJuYmYiOjE3MjI1MTk3NDAuMTk2OTk2LCJleHAiOjE3NTQwNTU3NDAuMTUyOTYzLCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.F4lOKPPewIKjbJKK-HPgBfK_mnG2Rzw4AUv4w87HGXLSXl3GYfGurHAlTriVQ-KkpOftCv_QGDDflCB2MG4D0bV6rcGsD7Ayvr40yk_m3Fyz1AhB2w70Y7gMpfhd_3hEDNWZ-V9lAgH24s-UCdFqKFwZkd9icQ84NfRij9bay3M7mjJ_KR06-cfuVMGhZFGnw89jiFr5FDt1DpWeqzAOjFIBtCfywV0CvNFMJtDrNvtjAzRAbR0vDVaXZBk0xa6aMyxBhhFX4fC9FaRAU15a9oQh2RH4OheNOvqH54v32BBXHx305g-S1DLYXQWlPUZROoTiaDrJezHPog3QKZlC3J7cscLIt-nd4XlYVe9ntMOGk7rzXvEAhcai1-yTkHZZfNfy7EIifi0hXcJrR9NbRjdloPjfGCo3BsH425V3PhUyr_OaC9KxxUHHLwmEnyCWlFIfAzyMpC9g7NqpSVDYcVt--mzxGkdY6_PF-g0e43h9d1g8uxbD6iZtLVAejpsmqoEWaJxKJNrESLiYOoYu0QFGFl46bkbuTwhepswe5Pwjs54S-ps7DB2igPgT9rABF-eotflzG-zruLGQNSO-fjRY5KjSE97n2W348DKjPxHF3U1q9BW2KhGAdb-h4bOKOT6Lu4cpN7v1eRnMxucEZV3a5kIrWc2xg-7H_s3zXi4", // Assuming the token is stored in localStorage
          "Content-Type": "application/json",
        },
      });

      // Return the response data if successful
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);



export const PostAdHocItem = createAsyncThunk(
  "data/PostAdHoc", // Action type string
  async ({ idata },{rejectWithValue}) => {
    try {
      // Set your API URL
        const URL = `${process.env.REACT_APP_BASE_URL}PriceList/PostAdHocItem`
      console.log("idata-------------", idata);

      // Make the POST request with Axios, adding Authorization header
      const response = await axios.post(URL, idata, {
        headers: {
          Authorization:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiODFlMTVlODVmZDhmYzMxMzk3NWY3MGNiODEwMjc3YWVhODRmODlkNjc4Y2I0ZDFkNTM2NGUyMjFlNWY4YzMxODQyYmYyMjY4MmJkMDYyZGMiLCJpYXQiOjE3MjI1MTk3NDAuMTk2OTg1LCJuYmYiOjE3MjI1MTk3NDAuMTk2OTk2LCJleHAiOjE3NTQwNTU3NDAuMTUyOTYzLCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.F4lOKPPewIKjbJKK-HPgBfK_mnG2Rzw4AUv4w87HGXLSXl3GYfGurHAlTriVQ-KkpOftCv_QGDDflCB2MG4D0bV6rcGsD7Ayvr40yk_m3Fyz1AhB2w70Y7gMpfhd_3hEDNWZ-V9lAgH24s-UCdFqKFwZkd9icQ84NfRij9bay3M7mjJ_KR06-cfuVMGhZFGnw89jiFr5FDt1DpWeqzAOjFIBtCfywV0CvNFMJtDrNvtjAzRAbR0vDVaXZBk0xa6aMyxBhhFX4fC9FaRAU15a9oQh2RH4OheNOvqH54v32BBXHx305g-S1DLYXQWlPUZROoTiaDrJezHPog3QKZlC3J7cscLIt-nd4XlYVe9ntMOGk7rzXvEAhcai1-yTkHZZfNfy7EIifi0hXcJrR9NbRjdloPjfGCo3BsH425V3PhUyr_OaC9KxxUHHLwmEnyCWlFIfAzyMpC9g7NqpSVDYcVt--mzxGkdY6_PF-g0e43h9d1g8uxbD6iZtLVAejpsmqoEWaJxKJNrESLiYOoYu0QFGFl46bkbuTwhepswe5Pwjs54S-ps7DB2igPgT9rABF-eotflzG-zruLGQNSO-fjRY5KjSE97n2W348DKjPxHF3U1q9BW2KhGAdb-h4bOKOT6Lu4cpN7v1eRnMxucEZV3a5kIrWc2xg-7H_s3zXi4", // Assuming the token is stored in localStorage
          "Content-Type": "application/json",
        },
      });

      // Return the response data if successful
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);



export const PutAdHocItem = createAsyncThunk(
  "data/PutAdHoc", // Action type string
  async ({ idata },{rejectWithValue}) => {
    try {
      // Set your API URL
        const URL = `${process.env.REACT_APP_BASE_URL}PriceList/UpdateAdHocItem`
      console.log("idata-------------", idata);

      // Make the POST request with Axios, adding Authorization header
      const response = await axios.put(URL, idata, {
        headers: {
          Authorization:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiODFlMTVlODVmZDhmYzMxMzk3NWY3MGNiODEwMjc3YWVhODRmODlkNjc4Y2I0ZDFkNTM2NGUyMjFlNWY4YzMxODQyYmYyMjY4MmJkMDYyZGMiLCJpYXQiOjE3MjI1MTk3NDAuMTk2OTg1LCJuYmYiOjE3MjI1MTk3NDAuMTk2OTk2LCJleHAiOjE3NTQwNTU3NDAuMTUyOTYzLCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.F4lOKPPewIKjbJKK-HPgBfK_mnG2Rzw4AUv4w87HGXLSXl3GYfGurHAlTriVQ-KkpOftCv_QGDDflCB2MG4D0bV6rcGsD7Ayvr40yk_m3Fyz1AhB2w70Y7gMpfhd_3hEDNWZ-V9lAgH24s-UCdFqKFwZkd9icQ84NfRij9bay3M7mjJ_KR06-cfuVMGhZFGnw89jiFr5FDt1DpWeqzAOjFIBtCfywV0CvNFMJtDrNvtjAzRAbR0vDVaXZBk0xa6aMyxBhhFX4fC9FaRAU15a9oQh2RH4OheNOvqH54v32BBXHx305g-S1DLYXQWlPUZROoTiaDrJezHPog3QKZlC3J7cscLIt-nd4XlYVe9ntMOGk7rzXvEAhcai1-yTkHZZfNfy7EIifi0hXcJrR9NbRjdloPjfGCo3BsH425V3PhUyr_OaC9KxxUHHLwmEnyCWlFIfAzyMpC9g7NqpSVDYcVt--mzxGkdY6_PF-g0e43h9d1g8uxbD6iZtLVAejpsmqoEWaJxKJNrESLiYOoYu0QFGFl46bkbuTwhepswe5Pwjs54S-ps7DB2igPgT9rABF-eotflzG-zruLGQNSO-fjRY5KjSE97n2W348DKjPxHF3U1q9BW2KhGAdb-h4bOKOT6Lu4cpN7v1eRnMxucEZV3a5kIrWc2xg-7H_s3zXi4", // Assuming the token is stored in localStorage
          "Content-Type": "application/json",
        },
      });

      // Return the response data if successful
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
export const postPrintGroupData = createAsyncThunk(
  "PrintGroup/postData", // Action type string
  async ({ PGdata },{rejectWithValue}) => {
    try {
      // Set your API URL
        const URL = `${process.env.REACT_APP_BASE_URL}PrintGroup/PostPriceListGroup`
      // Make the POST request with Axios, adding Authorization header
      const response = await axios.post(URL, PGdata, {
        headers: {
          Authorization:process.env.REACT_APP_API_TOKEN,
          "Content-Type": "application/json",
        },
      });

      // Return the response data if successful
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
); 
export const deletePrintGroupData = createAsyncThunk(
  "PrintGroup/deleteData", // Action type string
  async ({ ID },{rejectWithValue}) => {
    try {
      // Set your API URL
        const URL = `${process.env.REACT_APP_BASE_URL}PrintGroup/DeletePrintGroup?Recordid=${ID}`
      // Make the POST request with Axios, adding Authorization header
      const response = await axios.delete(URL, {
        headers: {
          Authorization:process.env.REACT_APP_API_TOKEN,
          "Content-Type": "application/json",
        },
      });

      // Return the response data if successful
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
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

export const DeleteAdHocItem = createAsyncThunk(
  "DeleteAdHocItem/DELETE",
  async ({data }, { rejectWithValue }) => {
    try {
      const URL =`${process.env.REACT_APP_BASE_URL}PriceList/DeleteAdHocItem`;
      const response = await axios.delete(URL, {
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


export const priceListClearFilter = createAsyncThunk(
  "priceListClearFilter/DELETE",
  async ({data }, { rejectWithValue }) => {
    try {
      const URL =`${process.env.REACT_APP_BASE_URL}PriceList/ClearFilter`;
      const response = await axios.delete(URL, {
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
const postData = createSlice({
  name: "postData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postBuildData.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(postBuildData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.postBuildPBData = action.payload;
      })
      .addCase(postBuildData.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.error.message;
        state.postCdata = {};
      })
      .addCase(runGroupMailData.pending, (state) => {
        state.runGroupMailState = "pending";
        state.runGroupMailMessage = "Processing Group Mail";
        state.runGroupMailLoading = true;
        state.runGroupMailError = false;
        state.runGroupMailIsAction = false;
      })
      .addCase(runGroupMailData.fulfilled, (state, action) => {
        state.runGroupMailState = "fulfilled";
        state.runGroupMailMessage = "Successfully Processed Group Mail";
        state.runGroupMailLoading = false;
        state.runGroupMailIsAction = true;
      })
      .addCase(runGroupMailData.rejected, (state, action) => {
        state.runGroupMailState = "rejected";
        state.runGroupMailMessage = "Failed to Process Group Mail";
        state.runGroupMailLoading = false;
        state.runGroupMailError = true;
        state.runGroupMailIsAction = true;
      });
     
  },
});

export default postData.reducer;
