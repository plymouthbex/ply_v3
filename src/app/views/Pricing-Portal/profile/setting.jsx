import {
  Autocomplete,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  Button,
  IconButton,
  Tooltip,
  FormControl,
} from "@mui/material";
import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useTheme } from "@emotion/react";
import Cover from "../../../../assets/plylogo.png";

import { SiMicrosoftexcel } from "react-icons/si";
import { FaFilePdf } from "react-icons/fa6";
import { IoIosMailOpen } from "react-icons/io";
import { IoMdPrint } from "react-icons/io";
import { useEffect, useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { FaRegImage } from "react-icons/fa6";
import Publish from "@mui/icons-material/Publish";
import { FlexAlignCenter, FlexBox } from "app/components/FlexBox";
// CUSTOM UTILS LIBRARY FUNCTIONS
import { convertHexToRGB } from "app/utils/utils";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "app/hooks/useAuth";
import { values } from "lodash";
import { useNavigate } from "react-router-dom";
import { fetchGetImage,  } from "app/redux/slice/getSlice";
import toast from "react-hot-toast";
import {
  RunGroupAutocompleteWithDefault,
  SingleAutocompleteWithDefault,
} from "app/components/AutoComplete";
import { updatesettingData,postImage } from "app/redux/slice/postSlice";
import { PriceGroupAlertApiDialog } from "app/components/LoadindgDialog";
// import Cover from "../../../assets/meat1.jpg";
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "15px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "10px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const IMG = styled("img")(() => ({
  width: "100%",
  overflow: "hidden",
}));
// const ImageWrapper = styled("div")(({ previewImage }) => ({
//   width:350,
//   height: 250,
//   backgroundImage: `url(${previewImage || Cover})`,
//   backgroundSize: "cover",
//   backgroundPosition: "center",
// }));
const ImageWrapper = styled("div")(({ previewImage }) => ({
  width: "100%",
  height: 150, // Reduced height
  minHeight: "50px", // Adjust minimum height as needed
  maxHeight: "300px", // Adjust maximum height as needed
  backgroundImage: `url(${previewImage || Cover})`,
  backgroundSize: "contain", // Ensures the full image is visible
  backgroundRepeat: "no-repeat", // Prevents tiling
  backgroundPosition: "center",
}));
const DropZone = styled(FlexAlignCenter)(({ isDragActive, theme }) => ({
  height: 70,
  width: "50%",
  cursor: "pointer",
  borderRadius: "4px",
  marginBottom: "16px",
  transition: "all 350ms ease-in-out",
  border: `2px dashed rgba(${convertHexToRGB(theme.palette.text.primary)}, 0.3)`,
  "&:hover": {
    background: `rgb(${convertHexToRGB(theme.palette.text.primary)}, 0.2) !important`,
  },
  background: isDragActive ? "rgb(0, 0, 0, 0.15)" : "rgb(0, 0, 0, 0.01)",
}));

const CustomIconButton = styled(IconButton)(({ theme, bgcolor }) => ({
  backgroundColor: bgcolor,
  color: "white",
  margin: theme.spacing(1),
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
  "&:hover": {
    backgroundColor: bgcolor,
  },
}));

const plyMouth = {
  companyID: 5,
  phone1: "785-236-7568",
  phone2: "785-236-1526",
  fax: "(206) 622-2625",
  logo: "/assets/images/plylogo.png",
  genFullPrcieBookImg: "/assets/coverimg/plymouthcoverimg.jpg",
  customerFullPriceBookImg: "/assets/coverimg/plymouthcoverimg.jpg",
  customerCustomPriceBookImg: "/assets/coverimg/plymouthcoverimg.jpg",
};

const nicky = {
  companyID: 7,
  phone1: "785-236-7568",
  phone2: "785-236-1526",
  fax: "(206) 622-2625",
  logo: "/assets/images/nicky.png",
  genFullPrcieBookImg: "/assets/coverimg/nickycoverimg.jpg",
  customerFullPriceBookImg: "/assets/coverimg/nickycoverimg.jpg",
  customerCustomPriceBookImg: "/assets/coverimg/nickycoverimg.jpg",
};

const sjfood = {
  companyID: 6,
  phone1: "785-236-4852",
  phone2: "785-236-7845",
  fax: "(206) 622-2635",
  logo: "/assets/images/sjfood.png",
  genFullPrcieBookImg: "/assets/coverimg/sjcoverimg.jpg",
  customerFullPriceBookImg: "/assets/coverimg/sjcoverimg.jpg",
  customerCustomPriceBookImg: "/assets/coverimg/sjcoverimg.jpg",
};
const Settings = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, updateUser, companyList, updateCompany } = useAuth();

  useEffect(() => {
    updateCompany();
  }, []);

  const [imageList1, setImageList1] = useState([]);
  const [previewImages1, setPreviewImages1] = useState([
    { preview: plyMouth.logo },
  ]);
  const [imageList2, setImageList2] = useState([]);
  const [previewImages2, setPreviewImages2] = useState([
    { preview: sjfood.logo },
  ]);
  const [imageList3, setImageList3] = useState([]);
  const [previewImages3, setPreviewImages3] = useState([
    { preview: nicky.logo },
  ]);
  const [imageList4, setImageList4] = useState([]);
  const [previewImages4, setPreviewImages4] = useState([
    { preview: plyMouth.logo },
  ]);
  const [imageList5, setImageList5] = useState([]);
  const [previewImages5, setPreviewImages5] = useState([
    { preview: sjfood.logo },
  ]);
  const [imageList6, setImageList6] = useState([]);
  const [previewImages6, setPreviewImages6] = useState([
    { preview: nicky.logo },
  ]);
  const handleDrop = (setImageList, setPreviewImages) => (acceptedFiles) => {
    const previews = [];
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push({
          name: file.name,
          preview: reader.result,
        });
        if (previews.length === acceptedFiles.length) {
          setPreviewImages(previews);
        }
      };
      reader.readAsDataURL(file);
    });
    setImageList(acceptedFiles);
  };

  const CompanyID = user.companyID;
  console.log("🚀 ~ Settings ~ CompanyID:", CompanyID)

  const dispatch = useDispatch();
  const dropzoneProps1 = useDropzone({
    accept: "image/*",
    onDrop: handleDrop(setImageList1, setPreviewImages1),
  });
  const dropzoneProps2 = useDropzone({
    accept: "image/*",
    onDrop: handleDrop(setImageList2, setPreviewImages2),
  });
  const dropzoneProps3 = useDropzone({
    accept: "image/*",
    onDrop: handleDrop(setImageList3, setPreviewImages3),
  });
  const dropzoneProps4 = useDropzone({
    accept: "image/*",
    onDrop: handleDrop(setImageList4, setPreviewImages4),
  });
  const dropzoneProps5 = useDropzone({
    accept: "image/*",
    onDrop: handleDrop(setImageList5, setPreviewImages5),
  });
  const dropzoneProps6 = useDropzone({
    accept: "image/*",
    onDrop: handleDrop(setImageList6, setPreviewImages6),
  });

  const SettingsLogo = ({ previewImages, imageSrc }) => {
    const displayImage =
      previewImages.length > 0 ? previewImages[0]["preview"] : "";
    return (
      <Box sx={{ width: "100%", padding: "8px" }}>
        <ImageWrapper previewImage={displayImage} />
      </Box>
    );
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response1 = await dispatch(
          fetchGetImage({
            filter: `CompanyID=5&TableID=CO&ImageID=PM`,
          })
        );
        setPreviewImages1([
          { preview: `data:image/png;base64,${response1.payload.Data.Image}` },
        ]);

        const response2 = await dispatch(
          fetchGetImage({
            filter: `CompanyID=6&TableID=CO&ImageID=SJ`,
          })
        );
        setPreviewImages2([
          { preview: `data:image/png;base64,${response2.payload.Data.Image}` },
        ]);

        const response3 = await dispatch(
          fetchGetImage({
            filter: `CompanyID=7&TableID=CO&ImageID=NU`,
          })
        );
        setPreviewImages3([
          { preview: `data:image/png;base64,${response3.payload.Data.Image}` },
        ]);

        const response4 = await dispatch(
          fetchGetImage({
            filter: `CompanyID=5&TableID=CO&ImageID=PMH`,
          })
        );
        setPreviewImages4([
          { preview: `data:image/png;base64,${response4.payload.Data.Image}` },
        ]);
        const response5 = await dispatch(
          fetchGetImage({
            filter: `CompanyID=6&TableID=CO&ImageID=SJH`,
          })
        );
        setPreviewImages5([
          { preview: `data:image/png;base64,${response5.payload.Data.Image}` },
        ]);
        const response6 = await dispatch(
          fetchGetImage({
            filter: `CompanyID=7&TableID=CO&ImageID=NUH`,
          })
        );
        setPreviewImages6([
          { preview: `data:image/png;base64,${response6.payload.Data.Image}` },
        ]);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [CompanyID]);

  const fnpostImage = async () => {
    if (imgstatus1 === "Y") {
      const image = previewImages1[0]["preview"];
      const images = image.split(",");
      const idata = {
        RecordID: -1,
        CompanyID:5,
        TabelID: "CO",
        ImageID: "PM",
        Description: "PlyLogo",
        Image: images[1],
      };

      const imageresponse1 = await dispatch(postImage({ idata }));
      if (imageresponse1.payload?.Status === "Y") {
        toast.success("Plymouth Logo updated successfully!");
      } else {
        toast.error("Please select Logo");
      }
    }

    if (imgstatus2 === "Y") {
      const image = previewImages2[0]["preview"];
      const images = image.split(",");
      const idata = {
        RecordID: -1,
        CompanyID: 6,
        TabelID: "CO",
        ImageID: "SJ",
        Description: "S and J",
        Image: images[1],
      };

      const imageresponse2 = await dispatch(postImage({ idata }));
      if (imageresponse2.payload?.Status === "Y") {
        toast.success("S and J Logo updated successfully!");
      } else {
        toast.error("Please select Logo");
      }
    }

    if (imgstatus3 === "Y") {
      const image = previewImages3[0]["preview"];
      const images = image.split(",");
      const idata = {
        RecordID: -1,
        CompanyID: 7,
        TabelID: "CO",
        ImageID: "NU",
        Description: "Nicky",
        Image: images[1],
      };

      const imageresponse3 = await dispatch(postImage({ idata }));

      if (imageresponse3.payload?.Status === "Y") {
        toast.success("Nicky Logo updated successfully!");
      } else {
        toast.error("Please select Logo");
      }
    }
    if (imgstatus4 === "Y") {
      const image = previewImages4[0]["preview"];
      const images = image.split(",");
      const idata = {
        RecordID: -1,
        CompanyID:5,
        TabelID: "CO",
        ImageID: "PMH",
        Description: "Plymouth Home",
        Image: images[1],
      };

      const imageresponse4 = await dispatch(postImage({ idata }));

      if (imageresponse4.payload?.Status === "Y") {
        toast.success("Plymouth Home Logo updated successfully!");
      } else {
        toast.error("Please select Logo");
      }
    }
    if (imgstatus5 === "Y") {
      const image = previewImages5[0]["preview"];
      const images = image.split(",");
      const idata = {
        RecordID: -1,
        CompanyID: 6,
        TabelID: "CO",
        ImageID: "SJH",
        Description: "S and J Home",
        Image: images[1],
      };

      const imageresponse5 = await dispatch(postImage({ idata }));

      if (imageresponse5.payload?.Status === "Y") {
        toast.success("S and J home Logo updated successfully!");
      } else {
        toast.error("Please select Logo");
      }
    }
    if (imgstatus6 === "Y") {
      const image = previewImages6[0]["preview"];
      const images = image.split(",");
      const idata = {
        RecordID: -1,
        CompanyID: 7,
        TabelID: "CO",
        ImageID: "NUH",
        Description: "Nicky Home",
        Image: images[1],
      };

      const imageresponse6 = await dispatch(postImage({ idata }));

      if (imageresponse6.payload?.Status === "Y") {
        toast.success("Nicky Home Logo updated successfully!");
      } else {
        toast.error("Please select Logo");
      }
    }
  };

  const [imgstatus1, setImgStatus1] = useState("N");
  const [imgstatus2, setImgStatus2] = useState("N");
  const [imgstatus3, setImgStatus3] = useState("N");
  const [imgstatus4, setImgStatus4] = useState("N");
  const [imgstatus5, setImgStatus5] = useState("N");
  const [imgstatus6, setImgStatus6] = useState("N");
  const [successMessage, setSuccessMessage] = useState("");
  const [successMessage2, setSuccessMessage2] = useState("");
  const [successMessage3, setSuccessMessage3] = useState("");
  const [successMessage4, setSuccessMessage4] = useState("");
  const [successMessage5, setSuccessMessage5] = useState("");
  const [successMessage6, setSuccessMessage6] = useState("");

  const handleImageUpload = (files) => {
    if (files.length > 0) {
      setImgStatus1("Y");
      setSuccessMessage("Plymouth Logo updated successfully!");
    } else {
      setImgStatus1("N");
    }
  };
  const handleImageUpload2 = (files) => {
    if (files.length > 0) {
      setImgStatus2("Y");
      setSuccessMessage2(" S and J Logo updated successfully!");
    } else {
      setImgStatus2("N");
    }
  };
  const handleImageUpload3 = (files) => {
    if (files.length > 0) {
      setImgStatus3("Y");
      setSuccessMessage3("Nicky Logo updated successfully!");
    } else {
      setImgStatus3("N");
    }
  };
  const handleImageUpload4 = (files) => {
    if (files.length > 0) {
      setImgStatus4("Y");
      setSuccessMessage4("Plymouth Home Logo updated successfully!");
    } else {
      setImgStatus4("N");
    }
  };
  const handleImageUpload5 = (files) => {
    if (files.length > 0) {
      setImgStatus5("Y");
      setSuccessMessage5("S and J Home Logo updated successfully!");
    } else {
      setImgStatus5("N");
    }
  };
  const handleImageUpload6 = (files) => {
    if (files.length > 0) {
      setImgStatus6("Y");
      setSuccessMessage6("Nicky Home Logo updated successfully!");
    } else {
      setImgStatus6("N");
    }
  };
  //=====================================================================================================================//
  const [selectedCompanyOptions, setSelectedCompanyOptions] = useState(null);
  const [selectedCompanyCode, setSelectCompanyCode] = useState(null);

  const handleSelectionCompanyChange = (newValue) => {
    if (newValue) {
      const companyCode = newValue.Code;
      setSelectedCompanyOptions(newValue);
      setSelectCompanyCode(companyCode);
      setSelectedRungroupOptions(null);
    } else {
      setSelectCompanyCode(null);
      setSelectedCompanyOptions(null);
    }
  };
  const [selectedRungroupOptions, setSelectedRungroupOptions] = useState(null);

  const handleSelectionRungroupChange = (newValue) => {
    setSelectedRungroupOptions(newValue);
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [openRunDialog, setOpenRunDialog] = useState(false);

  const handleClose = () => {
    setOpenDialog(false);
  };
  const handleRunClose = () => {
    setOpenRunDialog(false);
    setSelectedRungroupOptions(null);
  };

  const [openAlert, setOpenAlert] = useState(false);
  const [postError, setPostError] = useState(false);

  const userUpdate = async (newValue) => {
    if (!selectedCompanyOptions?.Code) {
      // alert("Company  is missing. Please select a company.");
      return;
    }

    // if (!selectedRungroupOptions?.Name) {
    //   setOpenDialog(true);
    //   return;
    // }
    const data = {
      UserRecID: user.id,
      CompanyCode: selectedCompanyOptions.Code,
      // RungroupName: selectedRungroupOptions.Name,
    };

    const response = await dispatch(updatesettingData({ data }));

    if (response.payload.Status === "Y") {
      // toast.success("User updated Successfully");
      updateCompany();
setOpenAlert(true);
      const company = companyList.find(
        (value) => value.companyCode === selectedCompanyOptions.Code
      );

      // Check if the selected rungroup name is different from the user's defaultRunGroup
      // const isDefaultRunGroupUpdated =
      //   user.defaultRunGroup !== selectedRungroupOptions.Name;

      // if (isDefaultRunGroupUpdated) {
        // Update the user's defaultRunGroup globally
        // updateUser({
        //   ...user,
         
        // });
      // }

      if (company) {
        updateUser({
          ...user,
          ...company,
        });
      } else {
        // console.error("Company not found for RecordID:", newValue.RecordID);
        // toast.error("Company not found for the selected record.");
        // toast.error("Please choose the relevant Rungroup.");
      }

      
    } else {
      setOpenAlert(true);
      setPostError(true);
    }
  };

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[{ name: "Profile" }, { name: "Settings" }]}
        />
      </Box>

      <Box>
        <SimpleCard>
          <Box
            display="grid"
            gap="20px"
            margin={5}
            // height="50vh"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": {
                gridColumn: isNonMobile ? undefined : "span 4",
              },
            }}
          >
            <FormControl fullWidth size="small" sx={{ gridColumn: "span 2" }}>
              <SingleAutocompleteWithDefault
                required
                name="companyID"
                id="companyID"
                value={selectedCompanyOptions}
                onChange={handleSelectionCompanyChange}
                label="Company"
                url={`${process.env.REACT_APP_BASE_URL}User/GetCompany`}
                defaultValueId={user.companyID}
              />
            </FormControl>

            <FormControl fullWidth size="small" sx={{ gridColumn: "span 2" }}>
              {/* <RunGroupAutocompleteWithDefault
                required
                name="runGroup"
                id="runGroup"
                value={selectedRungroupOptions}
                onChange={handleSelectionRungroupChange}
                label="Rungroup"
                url={`${process.env.REACT_APP_BASE_URL}PriceBookDirectory/GetRungroupByCompany?CompanyCode=${selectedCompanyCode}`}
                defaultValueName={user.defaultRunGroup}
              /> */}
            </FormControl>
          </Box>
          <Box
            display="grid"
            gap="20px"
            margin={5}
            gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" // Three columns with responsive sizing
            sx={{
              "& > div": {
                gridColumn: isNonMobile ? undefined : "span 3",
              },
            }}
          >
            {/* First Grid - Logo section */}
            <Box
              display="flex"
              flexDirection="column"
              gap="20px"
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="h5">Plymouth Logo</Typography>
              <SettingsLogo previewImages={previewImages1} />
              {/* {user.role === "ADMIN" && ( */}
                <DropZone {...dropzoneProps1.getRootProps()}>
                  <input
                    {...dropzoneProps1.getInputProps({
                      onChange: (e) => handleImageUpload(e.target.files),
                    })}
                    multiple={false}
                  />
                  <FlexBox alignItems="center" flexDirection="column">
                    <Publish
                      sx={{ color: "text.secondary", fontSize: "48px" }}
                    />
                    {imageList1.length ? (
                      <span>{imageList1.length} images selected</span>
                    ) : (
                      <span>Drop images</span>
                    )}
                  </FlexBox>
                </DropZone>
              {/* // )} */}
            </Box>

            {/* Second Grid - Logo section */}
            <Box
              display="flex"
              flexDirection="column"
              gap="20px"
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="h5">S and J Logo</Typography>
              <SettingsLogo previewImages={previewImages2} />
              {/* {user.role === "ADMIN" && ( */}
                <DropZone {...dropzoneProps2.getRootProps()}>
                  <input
                    {...dropzoneProps2.getInputProps({
                      onChange: (e) => handleImageUpload2(e.target.files),
                    })}
                    multiple={false}
                  />
                  <FlexBox alignItems="center" flexDirection="column">
                    <Publish
                      sx={{ color: "text.secondary", fontSize: "48px" }}
                    />
                    {imageList2.length ? (
                      <span>{imageList2.length} images selected</span>
                    ) : (
                      <span>Drop images</span>
                    )}
                  </FlexBox>
                </DropZone>
              {/* // )} */}
            </Box>

            {/* Third Grid - Logo section */}
            <Box
              display="flex"
              flexDirection="column"
              gap="20px"
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="h5">Nicky Logo</Typography>
              <SettingsLogo previewImages={previewImages3} />
              {/* {user.role === "ADMIN" && ( */}
                <DropZone {...dropzoneProps3.getRootProps()}>
                  <input
                    {...dropzoneProps3.getInputProps({
                      onChange: (e) => handleImageUpload3(e.target.files),
                    })}
                    multiple={false}
                  />
                  <FlexBox alignItems="center" flexDirection="column">
                    <Publish
                      sx={{ color: "text.secondary", fontSize: "48px" }}
                    />
                    {imageList3.length ? (
                      <span>{imageList3.length} images selected</span>
                    ) : (
                      <span>Drop images</span>
                    )}
                  </FlexBox>
                </DropZone>
              {/* )} */}
            </Box>
          </Box>
          <Box
            display="grid"
            gap="20px"
            margin={5}
            gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" // Three columns with responsive sizing
            sx={{
              "& > div": {
                gridColumn: isNonMobile ? undefined : "span 3",
              },
            }}
          >
            {/* First Grid - Logo section */}
            {/* <Box
              display="flex"
              flexDirection="column"
              gap="20px"
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="h5">Plymouth Home</Typography>
              <SettingsLogo previewImages={previewImages4} />
              {user.role === "ADMIN" && (
                <DropZone {...dropzoneProps4.getRootProps()}>
                  <input
                    {...dropzoneProps4.getInputProps({
                      onChange: (e) => handleImageUpload4(e.target.files),
                    })}
                    multiple={false}
                  />
                  <FlexBox alignItems="center" flexDirection="column">
                    <Publish
                      sx={{ color: "text.secondary", fontSize: "48px" }}
                    />
                    {imageList4.length ? (
                      <span>{imageList4.length} images selected</span>
                    ) : (
                      <span>Drop images</span>
                    )}
                  </FlexBox>
                </DropZone>
              )}
            </Box> */}

            {/* Second Grid - Logo section */}
            {/* <Box
              display="flex"
              flexDirection="column"
              gap="20px"
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="h5">S and J Home</Typography>
              <SettingsLogo previewImages={previewImages5} />
              {user.role === "ADMIN" && (
                <DropZone {...dropzoneProps5.getRootProps()}>
                  <input
                    {...dropzoneProps5.getInputProps({
                      onChange: (e) => handleImageUpload5(e.target.files),
                    })}
                    multiple={false}
                  />
                  <FlexBox alignItems="center" flexDirection="column">
                    <Publish
                      sx={{ color: "text.secondary", fontSize: "48px" }}
                    />
                    {imageList5.length ? (
                      <span>{imageList5.length} images selected</span>
                    ) : (
                      <span>Drop images</span>
                    )}
                  </FlexBox>
                </DropZone>
              )}
            </Box> */}

            {/* Third Grid - Logo section */}
            {/* <Box
              display="flex"
              flexDirection="column"
              gap="20px"
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="h5">Nicky Home</Typography>
              <SettingsLogo previewImages={previewImages6} />
              {user.role === "ADMIN" && (
                <DropZone {...dropzoneProps6.getRootProps()}>
                  <input
                    {...dropzoneProps6.getInputProps({
                      onChange: (e) => handleImageUpload6(e.target.files),
                    })}
                    multiple={false}
                  />
                  <FlexBox alignItems="center" flexDirection="column">
                    <Publish
                      sx={{ color: "text.secondary", fontSize: "48px" }}
                    />
                    {imageList6.length ? (
                      <span>{imageList6.length} images selected</span>
                    ) : (
                      <span>Drop images</span>
                    )}
                  </FlexBox>
                </DropZone>
              )}
            </Box> */}
          </Box>
          {/* Buttons at the bottom */}
          {/* {user.role === "ADMIN" && ( */}
            <Box display="flex" justifyContent="flex-end" gap="10px" margin={3}>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  backgroundColor: "#C0C0C0",
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "small",
                  "&:hover": {
                    backgroundColor: "#C0C0C0", // Custom hover color
                  },
                }}
                onClick={fnpostImage}
              >
                Upload
              </Button>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  backgroundColor: "#C0C0C0",
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "small",
                  "&:hover": {
                    backgroundColor: "#C0C0C0", // Custom hover color
                  },
                }}
                onClick={userUpdate}
              >
                Save
              </Button>
            </Box>
          {/* )} */}
        </SimpleCard>
        <PriceGroupAlertApiDialog
          open={openDialog}
          error={true}
          message={`Please Choose the Rungroup`}
          Actions={
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
                // height: 25,
              }}
            >
              <Button
                variant="contained"
                sx={{
                  "&:hover": {
                    backgroundColor: theme.palette.secondary.light, // Custom hover color
                  },
                  color: theme.palette.secondary.contrastText,
                  bgcolor: theme.palette.secondary.light,
                  height: 25,
                }}
                onClick={handleClose}
              >
                Ok
              </Button>
            </Box>
          }
        />

        <PriceGroupAlertApiDialog
          open={openDialog}
          error={true}
          message={`Please Choose the Rungroup`}
          Actions={
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
                // height: 25,
              }}
            >
              <Button
                variant="contained"
                sx={{
                  "&:hover": {
                    backgroundColor: theme.palette.secondary.light, // Custom hover color
                  },
                  color: theme.palette.secondary.contrastText,
                  bgcolor: theme.palette.secondary.light,
                  height: 25,
                }}
                onClick={handleClose}
              >
                Ok
              </Button>
            </Box>
          }
        />

        <PriceGroupAlertApiDialog
          open={openAlert}
          error={postError}
          message={
            postError ? "Something Went Wrong" : "Setting Updated Successfully"
          }
          Actions={
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              {" "}
              <Button
                variant="contained"
                sx={{
                  "&:hover": {
                    backgroundColor: theme.palette.secondary.light, // Custom hover color
                  },
                  color: theme.palette.secondary.contrastText,
                  bgcolor: theme.palette.secondary.light,
                  height: 25,
                }}
                onClick={() => {
                  setOpenAlert(false);
                }}
              >
                Ok
              </Button>
            </Box>
          }
        />
      </Box>
    </Container>
  );
};
export default Settings;
