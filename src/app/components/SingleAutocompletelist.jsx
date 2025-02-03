import React, { useState, useEffect, createContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { VariableSizeList } from "react-window";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

// Context for custom listbox
const LISTBOX_PADDING = 8; // Padding around the listbox
const OuterElementContext = createContext({});

// Outer element for the listbox
const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

// Custom Listbox component
const ListboxComponent = React.forwardRef(function ListboxComponent(
  props,
  ref
) {
  const { children, ...other } = props;
  const itemData = [];
  children.forEach((item) => {
    itemData.push(item);
    itemData.push(...(item.children || []));
  });

  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up("sm"), {
    noSsr: true,
  });
  const itemCount = itemData.length;
  const itemSize = smUp ? 36 : 48;

  const getChildSize = (child) => {
    if (child.hasOwnProperty("group")) {
      return 48; // Group header size
    }
    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize; // Limit to 8 items
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {({ index, style }) => React.cloneElement(itemData[index], { style })}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

ListboxComponent.propTypes = {
  children: PropTypes.node,
};

export const FormikOptimizedAutocomplete = ({
  value = null,
  onChange = () => {},
  url,
  height = 20,
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
        });
        setOptions(response.data.Data || []); // Assuming API response has `Data` array
      } catch (error) {
        console.error("Error fetching data:", error);
        setOptions();
        setError("Failed to load. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return (
    <Autocomplete
      size="small"
      limitTags={1}
      fullWidth
      options={options}
      loading={loading}
      value={value}
      isOptionEqualToValue={(option, value) => option.Name === value.Name}
      onChange={onChange}
      getOptionLabel={(option) => option.Name}
      ListboxComponent={ListboxComponent} // Custom listbox component
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label || "Select Options"}
          error={!!error}
          helperText={error}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      {...props}
    />
  );
};

export const FormikCustomSelectCompany = ({
  value = null,
  onChange = () => {},
  url,
  height = 20,
  label = "Select Company",
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
        });
        setOptions(response.data.data || []); // Assuming API response has `Data` array
      } catch (error) {
        console.error("Error fetching data:", error);
        setOptions([]);
        setError("Failed to load. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return (
    <FormControl {...props} fullWidth error={!!error} size="small" required>
      <InputLabel
        sx={{
          "& .MuiInputLabel-asterisk": {
            color: "red",
          },
        }}
      >
        {label}
      </InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label={label}
        displayEmpty
        {...props}
      >
        {loading ? (
          <MenuItem disabled>
            <CircularProgress size={24} />
          </MenuItem>
        ) : (
          options.map((option) => (
            <MenuItem key={option.Code} value={option.Code}>
              {option.Name}
            </MenuItem>
          ))
        )}
      </Select>
      {error && <TextField helperText={error} />}
    </FormControl>
  );
};

export const FormikCustomSelectCompanyPriceList2 = ({
  value = null,
  onChange = () => {},
  url,
  height = 20,
  label = "Select Company",
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
        });
        setOptions(response.data.data || []); // Assuming API response has `Data` array
      } catch (error) {
        console.error("Error fetching data:", error);
        setOptions([]);
        setError("Failed to load. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return (
    <FormControl {...props} sx={{ width: 200 }} error={!!error} size="small">
      <InputLabel
        sx={{
          "& .MuiInputLabel-asterisk": {
            color: "red",
          },
        }}
      >
        {label}
      </InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label={label}
        displayEmpty
        {...props}
      >
        {loading ? (
          <MenuItem disabled>
            <CircularProgress size={24} />
          </MenuItem>
        ) : (
          options.map((option) => (
            <MenuItem key={option.RecordID} value={option.RecordID}>
              {option.Name}
            </MenuItem>
          ))
        )}
      </Select>
      {error && <TextField helperText={error} />}
    </FormControl>
  );
};

export const FormikCustomSelectCompanyPriceList = ({
  value = null,
  onChange = () => {},
  url,
  height = 20,
  label = "Select Company",
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
        });
        setOptions(response.data.data || []); // Assuming API response has `Data` array
      } catch (error) {
        console.error("Error fetching data:", error);
        setOptions([]);
        setError("Failed to load. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return (
    <FormControl
      {...props}
      sx={{ width: 200 }}
      error={!!error}
      size="small"
      required
    >
      <InputLabel
        sx={{
          "& .MuiInputLabel-asterisk": {
            color: "red",
          },
        }}
      >
        {label}
      </InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label={label}
        displayEmpty
        {...props}
      >
        {loading ? (
          <MenuItem disabled>
            <CircularProgress size={24} />
          </MenuItem>
        ) : (
          options.map((option) => (
            <MenuItem key={option.CompanyCode} value={option.CompanyCode}>
              {option.CompanyName}
            </MenuItem>
          ))
        )}
      </Select>
      {error && <TextField helperText={error} />}
    </FormControl>
  );
};

export const FormikCustomSelectPriceBookGroup = ({
  value = null,
  onChange = () => {},
  url,
  height = 20,
  label = "Select Company",
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
        });
        setOptions(response.data.Data || []); // Assuming API response has `Data` array
      } catch (error) {
        console.error("Error fetching data:", error);
        setOptions([]);
        setError("Failed to load. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return (
    <FormControl
      {...props}
      sx={{ width: 200 }}
      error={!!error}
      size="small"
      required
    >
      <InputLabel
        sx={{
          "& .MuiInputLabel-asterisk": {
            color: "red",
          },
        }}
      >
        {label}
      </InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label={label}
        displayEmpty
        {...props}
      >
        {loading ? (
          <MenuItem disabled>
            <CircularProgress size={24} />
          </MenuItem>
        ) : (
          options.map((option) => (
            <MenuItem key={option.Code} value={option.Code}>
              {option.Code}
            </MenuItem>
          ))
        )}
      </Select>
      {error && <TextField helperText={error} />}
    </FormControl>
  );
};

export const FormikCustomSelectCustomer = ({
  value = null,
  onChange = () => {},
  url,
  height = 20,
  label = "Select Customer",
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
        });
        setOptions(response.data.Data || []); // Assuming API response has `Data` array
      } catch (error) {
        console.error("Error fetching data:", error);
        setOptions([]);
        setError("Failed to load. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return (
    <FormControl {...props} fullWidth error={!!error} size="small">
      <InputLabel>{label}</InputLabel>
      <Select
        value={value || ""}
        onChange={onChange}
        label={label}
        displayEmpty
        {...props}
      >
        {loading ? (
          <MenuItem disabled>
            <CircularProgress size={24} />
          </MenuItem>
        ) : (
          options.map((option) => (
            <MenuItem key={option.Code} value={option.Code}>
              {option.Name}
            </MenuItem>
          ))
        )}
      </Select>
      {error && <TextField helperText={error} />}
    </FormControl>
  );
};

export const FormikCustomAutocompleteCustomer = ({
  value = null,
  onChange = () => {},
  url,
  height = 20,
  required = false,
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
        });
        setOptions(response.data.Data || []); // Assuming API response has `Data` array
      } catch (error) {
        console.error("Error fetching data:", error);
        setOptions([]);
        setError("Failed to load. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return (
    <Autocomplete
      size="small"
      limitTags={1}
      fullWidth
      options={options}
      loading={loading}
      value={value}
      isOptionEqualToValue={(option, value) => option.Code === value.Code}
      onChange={onChange}
      getOptionLabel={(option) => option.Name}
      ListboxComponent={ListboxComponent} // Custom listbox component
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label || "Select Options"}
          error={!!error}
          helperText={error}
          required={required}
          InputLabelProps={{
            sx: {
              "& .MuiInputLabel-asterisk": { color: "red" },
            },
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      {...props}
    />
  );
};

export const FormikCustomerPriceOptimizedAutocomplete = ({
  value = null,
  onChange = () => {},
  url,
  height = 20,
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
        });
        setOptions(response.data.data || []); // Assuming API response has `Data` array
      } catch (error) {
        console.error("Error fetching data:", error);
        setOptions([]);
        setError("Failed to load. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return (
    <Autocomplete
      size="small"
      limitTags={1}
      fullWidth
      options={options}
      loading={loading}
      value={value}
      isOptionEqualToValue={(option, value) =>
        option.CustomerNumber === value.CustomerNumber
      }
      onChange={onChange}
      getOptionLabel={(option) =>
        `${option.CustomerNumber} || ${option.CustomerName}`
      }
      ListboxComponent={ListboxComponent} // Custom listbox component
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label || "Select Options"}
          error={!!error}
          helperText={error}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      {...props}
    />
  );
};

// Combined Component
export const OptimizedAutocomplete = ({
  value = null,
  onChange,
  url,
  errors,
  helper,
  height = 20,
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
        });
        setOptions(response.data.data || []); // Assuming API response has `Data` array
      } catch (error) {
        console.error("Error fetching data:", error);
        setOptions([]);
        setError("Failed to load. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return (
    <Autocomplete
      size="small"
      limitTags={1}
      sx={{ maxWidth: 500, minWidth: 450 }}
      options={options}
      loading={loading}
      value={value}
      // isOptionEqualToValue={(option, value) => option.item_key === value.item_key}
      onChange={(event, newValue) => onChange(newValue)}
      getOptionLabel={(option) =>
        `${option.Item_Number} || ${option.Item_Description}`
      }
      ListboxComponent={ListboxComponent} // Custom listbox component
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label || "Select Options"}
          error={!!error || errors}
          helperText={error || helper}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {/* {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null} */}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      {...props}
    />
  );
};

// Combined Component
export const PriceListOptimizedAutocompleteQuote = ({
  value = null,
  onChange,
  url,
  height = 20,
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
        });
        setOptions(response.data.data || []); // Assuming API response has `Data` array
      } catch (error) {
        console.error("Error fetching data:", error);
        setOptions([]);
        setError("Failed to load. Please try again.");
      } finally {
        setLoading(false);
        setError();
      }
    };

    fetchData();
  }, [url]);

  return (
    <Autocomplete
      size="small"
      limitTags={1}
      options={options}
      loading={loading}
      value={value}
      isOptionEqualToValue={(option, value) =>
        option.PRICELISTID === value.PRICELISTID
      }
      onChange={(event, newValue) => onChange(newValue)}
      getOptionLabel={(option) =>
        `${option.PRICELISTID} || ${option.PRICELISTDESCRIPTION}`
      }
      ListboxComponent={ListboxComponent} // Custom listbox component
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label || "Select Options"}
          error={!!error}
          helperText={error}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      {...props}
    />
  );
};

export const PriceListItemsOptimizedAutocompleteQuote = ({
  value = null,
  onChange,
  url,
  height = 20,
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
        });
        setOptions(response.data.data || []); // Assuming API response has `Data` array
      } catch (error) {
        console.error("Error fetching data:", error);
        setOptions([]);
        setError("Failed to load. Please try again.");
      } finally {
        setLoading(false);
        setError();
      }
    };

    fetchData();
  }, [url]);

  return (
    <Autocomplete
      size="small"
      limitTags={1}
      options={options}
      loading={loading}
      value={value}
      isOptionEqualToValue={(option, value) =>
        option.PRICELISTID === value.PRICELISTID
      }
      onChange={(event, newValue) => onChange(newValue)}
      getOptionLabel={(option) =>
        `${option.PRICELISTID} || ${option.PRICELISTDESCRIPTION}`
      }
      ListboxComponent={ListboxComponent} // Custom listbox component
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label || "Select Options"}
          error={!!error}
          helperText={error}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      {...props}
    />
  );
};
export const PriceListOptimizedAutocomplete = ({
  value = null,
  onChange,
  url,
  height = 20,
  label = "Price List",
  companyID, // Pass companyID as a prop
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,setError  ] = useState(null);

  // Fetch data when component mounts or URL/CompanyID changes
  useEffect(() => {
    if (!companyID) {
      setOptions([]); // Clear options if no companyID
      return;
    }
    setLoading(null);
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
        });
        setOptions(response.data.data || []); // Assuming API response has `Data` array
      } catch (error) {
        console.error("Error fetching data:", error);
        setOptions([]);
        setError(error.response ? error.response.data.message: error.message);

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, companyID]);

  // Handle the opening of the Autocomplete dropdown

  return (
    <Autocomplete
      sx={{ maxWidth: 400 }} // Add maxWidth to match your styling
      fullWidth
      size="small"
      limitTags={1}
      options={options}
      loading={loading}
      value={value}
      isOptionEqualToValue={(option, value) =>
        option.PRICELISTID === value.PRICELISTID
      }
      onChange={(event, newValue) => onChange(newValue)} // Handle the value change
      getOptionLabel={(option) =>
        `${option.PRICELISTID} || ${option.PRICELISTDESCRIPTION}`
      } // Customize label format
      renderInput={(params) => (
        <TextField
          {...params}
          label={label} // Use the label prop
          error={!!error}
          helperText={error}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      // Trigger handleOpen when autocomplete opens
      {...props}
    />
  );
};

export const PrintGroupOptimizedAutocomplete = ({
  value = null,
  onChange,
  url,
  height = 20,
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
        });
        setOptions(response.data.data || []); // Assuming API response has `Data` array
      } catch (error) {
        console.error("Error fetching data:", error);
        setOptions([]);
        setError("Failed to load. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return (
    <Autocomplete
      size="small"
      limitTags={1}
      options={options}
      loading={loading}
      value={value}
      isOptionEqualToValue={(option, value) =>
        option.GroupCode === value.GroupCode
      }
      onChange={(event, newValue) => onChange(newValue)}
      getOptionLabel={(option) => `${option.GroupCode} || ${option.GroupName}`}
      ListboxComponent={ListboxComponent} // Custom listbox component
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label || "Select Options"}
          error={!!error}
          helperText={error}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      {...props}
    />
  );
};

export const CustomerPriceListOptimizedAutocomplete = ({
  value = null,
  onChange,
  url,
  height = 20,
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
        });
        setOptions(response.data.data || []); // Assuming API response has `Data` array
      } catch (error) {
        console.error("Error fetching data:", error);
        setOptions([]);
        setError("Failed to load. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return (
    <Autocomplete
      size="small"
      limitTags={1}
      options={options}
      loading={loading}
      value={value}
      isOptionEqualToValue={(option, value) =>
        option.CustomerName === value.CustomerName
      }
      onChange={(event, newValue) => onChange(newValue)}
      getOptionLabel={(option) =>
        `${option.CustomerNumber} || ${option.CustomerName}`
      }
      ListboxComponent={ListboxComponent} // Custom listbox component
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label || "Select Options"}
          error={!!error}
          helperText={error}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      {...props}
    />
  );
};

export const PGOptimizedAutocomplete = ({
  errors,
  helper,
  value = null,
  onChange,
  url,
  height = 20,
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
        });
        setOptions(response.data.Data || []); // Assuming API response has `Data` array
      } catch (error) {
        console.error("Error fetching data:", error);
        setOptions([]);
        setError("Failed to load. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return (
    <Autocomplete
      size="small"
      limitTags={1}
      sx={{ width: 400 }}
      options={options}
      loading={loading}
      value={value}
      onChange={(event, newValue) => onChange(newValue)}
      getOptionLabel={(option) =>
        option.GroupCode && option.GroupCode !== ""
          ? `${option.PRICELISTID} || ${option.PRICELISTDESCRIPTION} * (${option.GroupCode})`
          : `${option.PRICELISTID} || ${option.PRICELISTDESCRIPTION}`
      }
      isOptionEqualToValue={(option, value) =>
        option.PRICELISTID === value.PRICELISTID
      }
      ListboxComponent={ListboxComponent} // Custom listbox component
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label || "Select Options"}
          error={!!error || errors}
          helperText={error || helper}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      {...props}
    />
  );
};

export const FormikCompanyOptimizedAutocomplete = ({
  value = null,
  onChange = () => {},
  url,
  height = 20,
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
        });
        setOptions(response.data.rows || []); // Assuming API response has `Data` array
      } catch (error) {
        console.error("Error fetching data:", error);
        setOptions([]);
        setError(error.response ? error.response.data.message: error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return (
    <Autocomplete
      size="small"
      limitTags={1}
      fullWidth
      options={options}
      loading={loading}
      value={value}
      // isOptionEqualToValue={(option, value) => option.Name === value.Name}
      onChange={onChange}
      // getOptionLabel={(option) => option.Name}
      isOptionEqualToValue={(option, value) => option.Name === value.Name}
      // onChange={(event, newValue) => onChange(newValue)}
      getOptionLabel={(option) => `${option.Code} || ${option.Name}`}
      ListboxComponent={ListboxComponent} // Custom listbox component
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label || "Select Options"}
          error={!!error}
          helperText={error}
          required
          InputLabelProps={{
            sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      {...props}
    />
  );
};

export const FormikUserGroupOptimizedAutocomplete = ({
  value = null,
  onChange = () => {},
  url,
  height = 20,
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
        });
        setOptions(response.data.data || []); // Assuming API response has `Data` array
      } catch (error) {
        console.error("Error fetching data:", error);
        setOptions([]);
        setError("Failed to load. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return (
    <Autocomplete
      size="small"
      limitTags={1}
      fullWidth
      options={options}
      loading={loading}
      value={value}
      isOptionEqualToValue={(option, value) => option.Name === value.Name}
      // onChange={(event, newValue) => onChange(newValue)}
      onChange={onChange}
      getOptionLabel={(option) => `${option.Name}`}
      ListboxComponent={ListboxComponent} // Custom listbox component
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label || "Select Options"}
          error={!!error}
          required
          InputLabelProps={{
            sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
          }}
          helperText={error}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      {...props}
    />
  );
};
export const FormikRungroupOptimizedAutocomplete = ({
  value = null,
  onChange = () => {},
  url,
  height = 20,
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
        });
        setOptions(response.data.Data || []); // Assuming API response has `Data` array
      } catch (error) {
        console.error("Error fetching data:", error);
        setOptions([]);
        setError("Failed to load. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return (
    <Autocomplete
      size="small"
      limitTags={1}
      fullWidth
      options={options}
      loading={loading}
      value={value}
      // isOptionEqualToValue={(option, value) => option.Name === value.Name}
      onChange={onChange}
      // getOptionLabel={(option) => option.Name}
      isOptionEqualToValue={(option, value) => option.Name === value.Name}
      // onChange={(event, newValue) => onChange(newValue)}
      getOptionLabel={(option) => `${option.Code} || ${option.Name}`}
      ListboxComponent={ListboxComponent} // Custom listbox component
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label || "Select Options"}
          error={!!error}
          helperText={error}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      {...props}
    />
  );
};
export const FormikSalesPersonOptimizedAutocomplete = ({
  required,
  value = null,
  onChange = () => {},
  url,
  height = 20,
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
        });
        setOptions(response.data.data || []); // Assuming API response has `Data` array
      } catch (error) {
        console.error("Error fetching data:", error);
        setOptions([]);
        setError(error.response ? error.response.data.message: error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return (
    <Autocomplete
      size="small"
      limitTags={1}
      fullWidth
      options={options}
      loading={loading}
      value={value}
      // isOptionEqualToValue={(option, value) => option.Name === value.Name}
      onChange={onChange}
      // getOptionLabel={(option) => option.Name}
      isOptionEqualToValue={(option, value) => option.Name === value.Name}
      // onChange={(event, newValue) => onChange(newValue)}
      getOptionLabel={(option) => option.Name}
      ListboxComponent={ListboxComponent} // Custom listbox component
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label || "Select Options"}
          error={!!error}
          helperText={error}
          required={required}
          InputLabelProps={{
            sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      {...props}
    />
  );
};

export const FormikProprietaryItemsOptimizedAutocomplete = ({
  required,
  value = null,
  onChange = () => {},
  url,
  height = 20,
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
        });
        setOptions(response.data.data || []); // Assuming API response has `Data` array
      } catch (error) {
        console.error("Error fetching data:", error);
        setOptions([]);
        setError(error.response ? error.response.data.message: error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return (
    <Autocomplete
      size="small"
      limitTags={1}
      fullWidth
      options={options}
      loading={loading}
      value={value}
      // isOptionEqualToValue={(option, value) => option.Name === value.Name}
      onChange={onChange}
      // getOptionLabel={(option) => option.Name}
      isOptionEqualToValue={(option, value) => option.ItemNumber === value.ItemNumber}
      // onChange={(event, newValue) => onChange(newValue)}
      getOptionLabel={(option) => `${option.ItemNumber} || ${option.ItemDescription}`}
      ListboxComponent={ListboxComponent} // Custom listbox component
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label || "Select Options"}
          error={!!error}
          helperText={error}
          required={required}
          InputLabelProps={{
            sx: { "& .MuiInputLabel-asterisk": { color: "red" } },
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      {...props}
    />
  );
};