import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Card,
  Grid,
  TextField,
  Box,
  styled,
  useTheme,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Formik } from "formik";
import * as Yup from "yup";
import useAuth from "app/hooks/useAuth";
import useSettings from "app/hooks/useSettings";
import toast from "react-hot-toast";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoginConfig } from "app/redux/slice/postSlice";
import { useDispatch } from "react-redux";

function Callback() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const handleFormSubmit = async () => {
      setLoading(true);
      try {
        const response = await login("", "", code, "2");
        console.log(response);
        if (response.LoginType === "Y") {
          navigate("/session/reset-password", { state: { id: response.id } });
          return;
        } else {
          if (response.Islock === "Y") {
            setShowUnlock(true);
          }
        }
        // return
        navigate("/home", {
          state: {
            name: "home",
            path: "/home",
            accessID: "PPB001",
            fav: false,
            RecordID: 0,
          },
        });
      } catch (e) {
        if (e.response.data.Islock === "Y") {
          setShowUnlock(true);
        }
        toast.error(e.response.data.message);
        setLoading(false);
      }
    };
    handleFormSubmit();
  }, [navigate]);

//   return <h3>Logging you in...</h3>;
  return <></>
}

export default Callback;
