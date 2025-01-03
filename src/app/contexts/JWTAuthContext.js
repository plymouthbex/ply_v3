import React, { createContext, useEffect, useReducer } from "react";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { AppLoading } from "app/components";

const initialState = {
  isAuthenticated: false,
  isInitialised: false,
  user: null,
  companyList: [],
  favoriteList: [],
};

const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }
  const decodedToken = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;
  return decodedToken.exp > currentTime;
};

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem("accessToken");
    delete axios.defaults.headers.common.Authorization;
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      const { isAuthenticated, user } = action.payload;

      return {
        ...state,
        isAuthenticated,
        isInitialised: true,
        user,
      };
    }
    case "LOGIN": {
      const { user, companyList } = action.payload;

      return {
        ...state,
        isAuthenticated: true,
        user,
        companyList,
      };
    }
    case " LOGOUT": {
      const { user } = action.payload;

      return {
        ...state,
        isAuthenticated: false,
        user,
        favoriteList : []
      };
    }
    case "REGISTER": {
      const { user } = action.payload;

      return {
        ...state,
        isAuthenticated: true,
        user,
      };
    }
    case "UPDATE_USER": {
      const { user } = action.payload;

      return {
        ...state,
        user,
      };

    }
    case "COMPANY_UPDATE": {
      return {
        ...state,
        companyList:action.payload,
      };
    }
    case "FAVORITES_UPDATE": {

      return {
        ...state,
        favoriteList:action.payload,
      };
    }
    default: {
      return { ...state };
    }
  }
};

const AuthContext = createContext({
  ...initialState,
  method: "JWT",
  login: () => Promise.resolve(),
  logout: () => {},
  register: () => Promise.resolve(),
  updateUser: () => {},
  updateCompany: () => Promise.resolve(),
  updateFavorites: () => Promise.resolve(),
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async (email, password) => {
    const URL = `${process.env.REACT_APP_BASE_URL}User/Login_V1`;
    const response = await axios.post(
      URL,
      {
        userName: email,
        password,
      },
      {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      }
    );


    const { accessToken, Data: user } = response.data;

    updateFavorites({ userID: user.id });
    setSession(accessToken);

    dispatch({
      type: "LOGIN",
      payload: {
        user: {
          ...user,
          avatar:
            user.name === "Safin"
              ? "/assets/images/user.jpg"
              : user.name === "Ram"
                ? "/assets/images/user2.JPEG"
                : user.name === "Neelakrishnan"
                  ? "/assets/images/user3.jpg"
                  : "/assets/images/user4.PNG",

        },
      },
    });
  };

  const updateCompany = async () => {
    
    const COMPURL = `${process.env.REACT_APP_BASE_URL}User/GetCompany_V1`;
    const companyList = await axios.get(COMPURL, {
      headers: {
        Authorization: process.env.REACT_APP_API_TOKEN,
      },
    });
    dispatch({
      type: "COMPANY_UPDATE",
      payload: companyList.data.Data ? companyList.data.Data : [],
    });
  };


  
  const updateFavorites = async ({ userID }) => {
    try{
      const FAVURL = `${process.env.REACT_APP_BASE_URL}User/GetFavorites?UserId=${userID}`;
      console.log(FAVURL);
  
      const fovoriteList = await axios.get(FAVURL, {
        headers: {
          Authorization: process.env.REACT_APP_API_TOKEN,
        },
      });
      dispatch({
        type: "FAVORITES_UPDATE",
        payload: fovoriteList.data.Data ? fovoriteList.data.Data : [],
      });
    }catch(e){
      dispatch({
        type: "FAVORITES_UPDATE",
        payload: [],
      });
      console.log("🚀 ~ updateFavorites ~ e:", e)
      
    }

  };

  const register = async (email, username, password) => {
    const URL = `${process.env.REACT_APP_BASE_URL}User/Login`;
    const response = await axios.post("/api/auth/login", {
      email,
      username,
      password,
    });

    const { accessToken, user } = response.data;

    setSession(accessToken);

    dispatch({
      type: "REGISTER",
      payload: {
        user,
      },
    });
  };

  const logout = () => {
    setSession(null);
    dispatch({ type: "LOGOUT" });
  };

  const updateUser = (user) => {
    dispatch({
      type: "UPDATE_USER",
      payload: {
        user,
      },
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const accessToken = window.localStorage.getItem("accessToken");

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);
          const response = await axios.get("link");
          const { user } = response.data;

          dispatch({
            type: "INIT",
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: "INIT",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.log(err);
        dispatch({
          type: "INIT",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    })();
  }, []);
  if (!state.isInitialised) {
    // console.log("🚀 ~ file: JWTAuthContext.js:171 ~ AuthProvider ~ !state.isInitialised:", state.isInitialised)
    return <AppLoading />;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "JWT",
        login,
        logout,
        register,
        updateUser,
        updateCompany,
        updateFavorites
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
