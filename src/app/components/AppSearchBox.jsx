import { useState, Fragment } from "react";
import { Icon, IconButton, styled, List, ListItem, ListItemText, Paper } from "@mui/material";
import { topBarHeight } from "app/utils/constant";

// Sample data for screen names
const screenNames = [
  'View Price Book',
  'Build Custom Price Book',
  'Settings',
  'Home',
  'Run Price Book',
  'Quote',
  'View Directory',
  'Add New Contact',
  'Edit Price Book',
  'Edit Book Template',
  'Specials',
  'Configure Price Book',
];

// STYLED COMPONENTS
const SearchContainer = styled("div")(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  zIndex: 9,
  width: "100%",
  display: "flex",
  alignItems: "center",
  height: topBarHeight,
  background: theme.palette.primary.main,
  color: theme.palette.text.primary,
  "&::placeholder": {
    color: theme.palette.text.primary,
  },
}));

const SearchInput = styled("input")(({ theme }) => ({
  width: "100%",
  border: "none",
  outline: "none",
  fontSize: "1rem",
  paddingLeft: "20px",
  height: "calc(100% - 5px)",
  background: theme.palette.primary.main,
  color: theme.palette.text.primary,
  "&::placeholder": { color: theme.palette.text.primary },
}));

const ResultsContainer = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: topBarHeight,
  left: 0,
  width: "100%",
  maxHeight: "200px",
  overflowY: "auto",
  zIndex: 10,
}));

export default function AppSearchBox() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredScreens, setFilteredScreens] = useState([]);

  const toggle = () => {
    setOpen(!open);
    setSearchTerm('');
    setFilteredScreens([]);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter screen names based on input
    if (value) {
      const filtered = screenNames.filter((screen) =>
        screen.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredScreens(filtered);
    } else {
      setFilteredScreens([]);
    }
  };

  return (
    <Fragment>
      {!open && (
        <IconButton onClick={toggle}>
          <Icon sx={{ color: "text.primary" }}>search</Icon>
        </IconButton>
      )}

      {open && (
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search here..."
            autoFocus
            value={searchTerm}
            onChange={handleInputChange}
          />
          <IconButton onClick={toggle} sx={{ mx: 2, verticalAlign: "middle" }}>
            <Icon sx={{ color: "text.primary" }}>close</Icon>
          </IconButton>
          {filteredScreens.length > 0 && (
            <ResultsContainer>
              <List >
                {filteredScreens.map((screen, index) => (
                  <ListItem sx={{height:30}} button key={index}>
                    <ListItemText primary={screen} />
                  </ListItem>
                ))}
              </List>
            </ResultsContainer>
          )}
        </SearchContainer>
      )}
    </Fragment>
  );
}