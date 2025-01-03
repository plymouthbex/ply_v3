import {
  Box,
  Button,
  Card,
  Drawer,
  Icon,
  IconButton,
  Link,
  styled,
  TextField,
  ThemeProvider,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import useSettings from "app/hooks/useSettings";
import { Fragment, useState } from "react";
import Scrollbar from "react-perfect-scrollbar";
import { themeShadows } from "../baseTheme/themeColors";
import { H5, Span } from "../Typography";
// import BadgeSelected from "./BadgeSelected";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from '@mui/icons-material/Send';
const Label = styled(Span)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1rem",
  cursor: "pointer",
  borderRadius: "4px",
  marginBottom: "2.5rem",
  letterSpacing: "1.5px",
  padding: ".25rem .5rem",
  transform: "rotate(90deg)",
  color: theme.palette.secondary.main,
  backgroundColor: theme.palette.primary.dark,
  "&:hover, &.open": {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
}));

const MaxCustomaizer = styled("div")(({ theme }) => ({
  top: 0,
  right: 0,
  zIndex: 50,
  width: 320,
  display: "flex",
  height: "100vh",
  position: "fixed",
  paddingBottom: "32px",
  flexDirection: "column",
  boxShadow: themeShadows[12],
  background: theme.palette.background.default,
  "& .helpText": { margin: "0px .5rem 1rem" },
}));

const Controller = styled("div")(() => ({
  minHeight: 58,
  display: "flex",
  alignItems: "center",
  marginBottom: "16px",
  padding: "14px 20px",
  boxShadow: themeShadows[6],
  justifyContent: "space-between",
}));

const IMG = styled("img")(() => ({ width: "100%" }));

const StyledScrollBar = styled(Scrollbar)(() => ({
  paddingLeft: "16px",
  paddingRight: "16px",
}));

const MailSidebar = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const secondary = theme.palette.text.secondary;

  const tooglePanel = () => setOpen(!open);
  const { settings, updateSettings } = useSettings();
  const toggle = () => {
    updateSettings({
      secondarySidebar: { open: !settings.secondarySidebar.open },
    });
  };
  const handleTabChange = (index) => setTabIndex(index);

  let activeTheme = { ...settings.themes[settings.activeTheme] };

  return (
    <Fragment>
      <ThemeProvider theme={activeTheme}>
        <Drawer
          open={settings.secondarySidebar.open}
          anchor="right"
          variant="temporary"
          onClose={toggle}
          ModalProps={{ keepMounted: true }}
        >
          <MaxCustomaizer>
            <Controller>
              <Box display="flex">
                <Icon className="icon" color="primary">
                  mail
                </Icon>
                <H5 sx={{ ml: 1, fontSize: "1rem" }}>Send Mail</H5>
              </Box>

              <IconButton onClick={toggle}>
                <Icon className="icon">close</Icon>
              </IconButton>
            </Controller>

            <StyledScrollBar options={{ suppressScrollX: true }}>
              <Box
                marginTop={4}
                sx={{ display: "flex", gap: "20px", flexDirection: "column" }}
              >
                <TextField id="to" label="To" variant="outlined" fullWidth />
                <TextField id="cc" label="CC" variant="outlined" fullWidth />
                <TextField
                  id="subject"
                  label="Subject"
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  id="content"
                  label="Content"
                  variant="outlined"
                  fullWidth
                  multiline
                  minRows={5}
                />
              </Box>
              <Box sx={{ marginTop: 4, padding: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                    backgroundColor: "#EBF8F4",
                    height: 30,
                    borderRadius: "7px",
                    alignItems: "center",
                    width: 170,
                  }}
                >
                  <AttachFileIcon fontSize="small" sx={{ color: "#164D50" }} />
                  <Typography sx={{ color: "#164D50",fontWeight:"500" }}>
                    Price Book Attached
                  </Typography>
                </Box>
                <Box sx={{ margin: "20px 0px", display: "flex", gap: "10px" }}>
                  <Button
                    sx={{
                      backgroundColor: "#164D50",
                      "&:hover": {
                        backgroundColor: "#164D50", // Optional: Add a hover effect
                      },
                    }}
                    variant="contained"
                    startIcon={<SendIcon/>}
                  >
                    Send
                  </Button>
                  <Button variant="outlined" color="info">Cancel</Button>
                </Box>
              </Box>
            </StyledScrollBar>
          </MaxCustomaizer>
        </Drawer>
      </ThemeProvider>
    </Fragment>
  );
};

export default MailSidebar;
