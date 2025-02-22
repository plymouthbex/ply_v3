import {
  Alert,
  Avatar,
  Hidden,
  Icon,
  IconButton,
  MenuItem,
  Slide,
  Snackbar,
  Tooltip,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { Box, styled, useTheme } from "@mui/material";
import { AppMenu } from "app/components";
import { themeShadows } from "../../baseTheme/themeColors";
// import { NotificationProvider } from 'app/contexts/NotificationContext';
import useAuth from "app/hooks/useAuth";
import useSettings from "app/hooks/useSettings";
import { topBarHeight } from "app/utils/constant";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
// import { Span } from "../Typography"
import { Span } from "app/components/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import AppSearchBox from "app/components/AppSearchBox";
import Swal from "sweetalert2";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const TopbarRoot = styled("div")(({ theme }) => ({
  top: 0,
  zIndex: 96,
  transition: "all 0.3s ease",
  boxShadow: themeShadows[8],
  height: topBarHeight,
}));

const TopbarContainer = styled(Box)(({ theme }) => ({
  padding: "8px",
  paddingLeft: 18,
  paddingRight: 20,
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: theme.palette.primary.main,
  [theme.breakpoints.down("sm")]: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  [theme.breakpoints.down("xs")]: {
    paddingLeft: 14,
    paddingRight: 16,
  },
}));

const UserMenu = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  borderRadius: 24,
  padding: 4,
  "& span": { margin: "0 8px" },
}));

const StyledItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  minWidth: 185,
  "& a": {
    width: "100%",
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  },
  "& span": { marginRight: "10px", color: theme.palette.text.primary },
}));

const IconBox = styled("div")(({ theme }) => ({
  display: "inherit",
  // [theme.breakpoints.down("md")]: { display: "none !important" },
}));

const Layout1Topbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { settings, updateSettings } = useSettings();
  const { logout, user } = useAuth();
  const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));

  const updateSidebarMode = (sidebarSettings) => {
    updateSettings({
      layout1Settings: { leftSidebar: { ...sidebarSettings } },
    });
  };

  const handleSidebarToggle = () => {
    let { layout1Settings } = settings;
    let mode;
    if (isMdScreen) {
      mode = layout1Settings.leftSidebar.mode === "close" ? "mobile" : "close";
    } else {
      mode = layout1Settings.leftSidebar.mode === "full" ? "close" : "full";
    }
    updateSidebarMode({ mode });
  };

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {

    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);

    Swal.fire({
      title: "Favourite Added Successfully",
      // text: "You clicked the button!",
      icon: "success"
    });
  };

  const handleDownload = () => {
    // Path to the PDF file in the public folder
    const filePath = `/assets/Manual.pdf`;

    // Create an anchor element and trigger the download
    const link = document.createElement("a");
    link.href = filePath;
    link.download = "Manual.pdf"; // Optional: Specify the downloaded file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <TopbarRoot>
      <TopbarContainer>
        <Box display="flex">
          <StyledIconButton onClick={handleSidebarToggle}>
            <Icon>menu</Icon>
          </StyledIconButton>

          <StyledIconButton onClick={handleDownload}>
            <VerticalAlignBottomIcon />
          </StyledIconButton>
        </Box>

        <Box display="flex" alignItems="center">
          {/* <AppSearchBox /> */}

          <AppMenu
            menuButton={
              <UserMenu>
                <Hidden xsDown>
                  <Span>
                    Hi <strong>{user.name}</strong>-{user.company}
                  </Span>
                </Hidden>
                <Avatar src={`data:image/png;base64,${user.avatar}`} sx={{ cursor: "pointer" }} />
              </UserMenu>
            }
          >
            <StyledItem>
              <Link to="/home">
                <Icon> home </Icon>
                <Span> Home </Span>
              </Link>
            </StyledItem>

            <StyledItem>
              <Link to="/user-profile">
                <Icon> person </Icon>
                <Span> Profile </Span>
              </Link>
            </StyledItem>
{/* 
            {user.role != 'USER'&&<StyledItem
              onClick={() => {
                navigate("/profile/setting");

              }}>
              <Link to="/user-settings">
                <Icon> settings </Icon>
                <Span> Settings </Span>
              </Link>
            </StyledItem>} */}
            
            <StyledItem
              onClick={() => {
                navigate("/profile/setting");

              }}>
              {/* <Link to="/user-settings"> */}
                <Icon> settings </Icon>
                <Span> Settings </Span>
              {/* </Link> */}
            </StyledItem>

            <StyledItem
              onClick={() => {
                navigate("/session/signin");
                logout();
              }}
            >
              <Icon> power_settings_new </Icon>
              <Span> Logout </Span>
            </StyledItem>
          </AppMenu>
          <Dialog
            open={open} // Bind the state to the Dialog's open prop
            onClose={() => setOpen(false)}
            PaperProps={{
              component: "form",
              onSubmit: (e) => {
                e.preventDefault(); // Prevent form submission
                handleClose(); // Close dialog on submit
              },
            }}
          >
            <DialogTitle>Add Favourite</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To create a new  Favourite, please fill out the  Favourite Name
                below.
              </DialogContentText>
              <TextField
                autoFocus
                required
                margin="dense"
                id="runGroup"
                name="runGroup"
                label="Favourite Name"
                type="text"
                fullWidth
                variant="standard"
                color="secondary"
              />
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="warning" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#164D50",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#164D50", // Optional: Add a hover effect
                  },
                }}
                type="submit"
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </TopbarContainer>
    </TopbarRoot>
  );
};

export default React.memo(Layout1Topbar);




