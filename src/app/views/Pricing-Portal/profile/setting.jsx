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
import { SimpleCard } from "app/components";

import { useTheme } from "@emotion/react";
import Cover from "../../../../assets/plylogo.png";
import { useEffect, useState } from "react";
import Publish from "@mui/icons-material/Publish";
import { FlexAlignCenter, FlexBox } from "app/components/FlexBox";
// CUSTOM UTILS LIBRARY FUNCTIONS
import { convertHexToRGB } from "app/utils/utils";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "app/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { fetchGetImage } from "app/redux/slice/getSlice";
import toast from "react-hot-toast";
import {
  RunGroupAutocompleteWithDefault,
  SingleAutocompleteWithDefault,
  SingleAutocompleteWithDefault2,
} from "app/components/AutoComplete";
import { updatesettingData, postImage } from "app/redux/slice/postSlice";
import { PriceGroupAlertApiDialog } from "app/components/LoadindgDialog";
const Container = styled("div")(({ theme }) => ({
  margin: "15px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "10px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

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
  border: `2px dashed rgba(${convertHexToRGB(
    theme.palette.text.primary
  )}, 0.3)`,
  "&:hover": {
    background: `rgb(${convertHexToRGB(
      theme.palette.text.primary
    )}, 0.2) !important`,
  },
  background: isDragActive ? "rgb(0, 0, 0, 0.15)" : "rgb(0, 0, 0, 0.01)",
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

const Settings = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, updateUser, companyList, updateCompany } = useAuth();

  //=====================================================================================================================//
  const [selectedCompanyOptions, setSelectedCompanyOptions] = useState({
    RecordID: user.companyID,
    Code: user.companyCode,
    Name: user.company,
  });
  const fetchImages = async () => {
    try {
      const response1 = await dispatch(
        fetchGetImage({
          filter: `CompanyID=${selectedCompanyOptions.RecordID}&TableID=CO&ImageID=${selectedCompanyOptions.Code}`,
        })
      );
      setPreviewImages1([
        { preview: `data:image/png;base64,${response1.payload.Data.Image}` },
      ]);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };
  const handleSelectionCompanyChange = async (newValue) => {
    if (newValue) {
      setSelectedCompanyOptions(newValue);
      try {
        const response1 = await dispatch(
          fetchGetImage({
            filter: `CompanyID=${newValue.RecordID}&TableID=CO&ImageID=${newValue.Code}`,
          })
        );
        setPreviewImages1([
          { preview: `data:image/png;base64,${response1.payload.Data.Image}` },
        ]);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    }
  };
  useEffect(() => {
    updateCompany();
  }, []);

  const [imageList1, setImageList1] = useState([]);
  const [previewImages1, setPreviewImages1] = useState([
    { preview: plyMouth.logo },
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

  const dispatch = useDispatch();
  const dropzoneProps1 = useDropzone({
    accept: "image/*",
    onDrop: handleDrop(setImageList1, setPreviewImages1),
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
    fetchImages();
  }, []);

  const fnpostImage = async () => {
    if (imgstatus1 === "Y") {
      const image = previewImages1[0]["preview"];
      const images = image.split(",");
      const idata = {
        RecordID: -1,
        CompanyID: selectedCompanyOptions.RecordID,
        TabelID: "CO",
        ImageID: selectedCompanyOptions.Code,
        Description: selectedCompanyOptions.Name,
        Image: images[1],
      };

      const imageresponse1 = await dispatch(postImage({ idata }));
      if (imageresponse1.payload?.Status === "Y") {
       const company = companyList.find(
        (value) => value.companyCode === selectedCompanyOptions.Code
      );

      if (company) {
        updateUser({
          ...user,
          ...company,
          logo:images[1],
          homePagelogo:images[1],
          // defaultRunGroup: isDefaultRunGroupUpdated
          //   ? selectedRungroupOptions.Name
          //   : user.defaultRunGroup,
        });
        updateCompany();
        // Check if the selected rungroup name is different from the user's defaultRunGroup
      } else {
      }
     
      
      console.log(user)
        setImageList1([]);
        toast.success("Logo updated successfully!");
      } else {
        toast.error("Please select Logo");
      }
    }
  };

  const [imgstatus1, setImgStatus1] = useState("N");

  const handleImageUpload = (files) => {
    if (files.length > 0) {
      setImgStatus1("Y");
    } else {
      setImgStatus1("N");
    }
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [openRunDialog, setOpenRunDialog] = useState(false);

  const handleClose = () => {
    setOpenDialog(false);
  };

  const [openAlert, setOpenAlert] = useState(false);
  const [postError, setPostError] = useState(false);

  const userUpdate = async (newValue) => {
    if (!selectedCompanyOptions?.Code) {
      // alert("Company  is missing. Please select a company.");
      return;
    }
    const data = {
      UserRecID: user.id,
      CompanyCode: selectedCompanyOptions.Code,
    };

    const response = await dispatch(updatesettingData({ data }));

    if (response.payload.Status === "Y") {
      // toast.success("User updated Successfully");
      setOpenAlert(true);
      updateCompany();

      const company = companyList.find(
        (value) => value.companyCode === selectedCompanyOptions.Code
      );

      if (company) {
        updateUser({
          ...user,
          ...company,
          // defaultRunGroup: isDefaultRunGroupUpdated
          //   ? selectedRungroupOptions.Name
          //   : user.defaultRunGroup,
        });
        // Check if the selected rungroup name is different from the user's defaultRunGroup
      } else {
      }
    } else {
      setOpenAlert(true);
      setPostError(true);
    }
  };

  return (
    <Container>
      <Box>
        <SimpleCard>
          <Box
            display="grid"
            gap="20px"
            margin={3}
            // height="50vh"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": {
                gridColumn: isNonMobile ? undefined : "span 4",
              },
            }}
          >
            <Box sx={{ gridColumn: "span 4" }}>
              <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
                Settings
              </Typography>
            </Box>
            <FormControl fullWidth size="small" sx={{ gridColumn: "span 2" }}>
              <SingleAutocompleteWithDefault2
                required
                name="companyID"
                id="companyID"
                value={selectedCompanyOptions}
                onChange={handleSelectionCompanyChange}
                label="Company"
                url={`${process.env.REACT_APP_BASE_URL}PriceBookConfiguration/GetUserAccess?Type=CO&UserID=${user.id}`}
              />
            </FormControl>

            <FormControl
              fullWidth
              size="small"
              sx={{ gridColumn: "span 2" }}
            ></FormControl>
          </Box>
          {user.role != "USER" && (
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
              {
                <Box
                  display="flex"
                  flexDirection="column"
                  gap="20px"
                  justifyContent="center"
                  alignItems="center"
                >
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
              }
            </Box>
          )}
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
          ></Box>
          <Box display="flex" justifyContent="flex-end" gap="10px" margin={3}>
            {user.role != "USER" && (
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
            )}
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
