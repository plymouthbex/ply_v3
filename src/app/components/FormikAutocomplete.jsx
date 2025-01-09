import React, { useState, useEffect, createContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Checkbox,
} from "@mui/material";
import { VariableSizeList } from "react-window";

const LISTBOX_PADDING = 4;
const OuterElementContext = createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

const ListboxComponent = React.forwardRef((props, ref) => {
  const { children, ...other } = props;
  const itemData = React.Children.toArray(children).flat();
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up("sm"), { noSsr: true });
  const itemSize = smUp ? 20 : 20;

  const getChildSize = (child) => (child.group ? 25 : itemSize);
  const itemCount = itemData.length;
  const height = Math.min(8, itemCount) * itemSize;

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          height={height + 2 * LISTBOX_PADDING}
          width="100%"
          itemSize={(index) => getChildSize(itemData[index])}
          itemCount={itemCount}
          itemData={itemData}
          outerElementType={OuterElementType}
          innerElementType="ul"
          overscanCount={5}
        >
          {({ index, style }) =>
            React.cloneElement(itemData[index], { style })
          }
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

ListboxComponent.propTypes = {
  children: PropTypes.node,
};

export function FormikCustomAutocompleteMulti({
  value = [],
  onChange,
  url,
  label = "Select Options",
  multiple = true,
  ...props
}) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(url, {
          headers: { Authorization: process.env.REACT_APP_API_TOKEN },
        });
        setOptions(data.Data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return (
    <Autocomplete
      sx={{
        "& .MuiAutocomplete-tag": { maxWidth: "90px" },
      }}
      size="small"
      multiple={multiple}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={value}
      onChange={onChange}
      options={options}
      isOptionEqualToValue={(option, value) => option.Name === value.Name}
      getOptionLabel={(option) => option.Name || ""}
      disableCloseOnSelect
      disableListWrap
      loading={loading}
      ListboxComponent={ListboxComponent}
      renderOption={(props, option, { selected }) => (
        <li {...props} style={{ display: "flex", gap: 2, height: 20 }}>
          <Checkbox
            size="small"
            sx={{ marginLeft: -1 }}
            checked={selected}
          />
          {option.Name}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      {...props}
    />
  );
}
