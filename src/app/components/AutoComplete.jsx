import React, { useEffect, useState } from "react";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
// import { FixedSizeList } from "react-window";
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;





function CustomAutocomplete({
  value = [],
  onChange,
  url,
  height = 20,
  multiple = true,
  ...props
}) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); // Control open state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
        });
        setOptions(response.data.Data); // Assuming API response has a `Data` array
      } catch (error) {
        setOptions([]);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  const handleChange = (event, newValue) => {
    onChange(newValue); // Pass the updated array of selected objects
  };

  return (
    <Autocomplete
      limitTags={1}
      multiple={multiple} // Enable multiple selections
      size="small"
      open={open} // Control open state
      onOpen={() => setOpen(true)} // Open dropdown when clicking on input
      onClose={() => setOpen(false)} // Close dropdown when clicking outside
      fullWidth
      options={options}
      disableCloseOnSelect
      disableListWrap
      loading={loading}
      value={value} // Pass array of selected objects
      onChange={handleChange} // Update selected array
      isOptionEqualToValue={(option, value) => option.Name === value.Name}
      getOptionLabel={(option) => option.Name} // Label for each option
      renderOption={(props, option, { selected }) => (
        <li key={option.Name} {...props} style={{ height: height }}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected} // Mark selected items
          />
          {option.Name}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label || "Select Options"} // Default label
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
      {...props} // Spread the rest of the props
    />
  );
}

export default CustomAutocomplete;


export const SingleAutocomplete = ({
  value = null,
  onChange,
  url,
  height = 20,
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
        });
        setOptions(response.data.Data); // Assuming API response has a `Data` array
      } catch (error) {
        setOptions([]);
        console.error("Error fetching data:", error);
        // setError("Failed to load. Please try again."); // Handle error
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
      loading={loading} // Display loading indicator
      value={value} // Pass array of selected objects
      isOptionEqualToValue={(option, value) => option.Name === value.Name}
      onChange={(event, newValue) => onChange(newValue)} // Update selected array
      getOptionLabel={(option) => option.Name}
      // onChange={handleChange}
      renderInput={(params) => (
        <TextField

          {...params}
          label={props.label || "Select Options"} // Default label
          error={!!error} // Show error style if there is an error
          helperText={error} // Show error message
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


export const SingleAutocompleteRunGroup = ({
  value = null,
  onChange,
  url,
  height = 20,
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
        });
        setOptions(response.data.Data); // Assuming API response has a `Data` array
      } catch (error) {
        setOptions([]);
        console.error("Error fetching data:", error);
        // setError("Failed to load. Please try again."); // Handle error
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
      loading={loading} // Display loading indicator
      value={value ? value : options ? options[0] :value   } // Pass array of selected objects
      isOptionEqualToValue={(option, value) => option.Name === value.Name}
      onChange={(event, newValue) => onChange(newValue)} // Update selected array
      getOptionLabel={(option) => option.Name}
      // onChange={handleChange}
      renderInput={(params) => (
        <TextField

          {...params}
          label={props.label || "Select Options"} // Default label
          error={!!error} // Show error style if there is an error
          helperText={error} // Show error message
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


export const SingleAutocompleteWithDefault = ({
  value = null,
  onChange,
  url,
  defaultValueId, // The ID of the default value to be pre-selected
  height = 20,
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
        });
        setOptions(response.data.Data); // Assuming API response has a `Data` array
      } catch (error) {
        setOptions([]);
        setError("Error fetching data."); // Show error message
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  useEffect(() => {
    if (defaultValueId) {
      const defaultOption = options.find(
        (option) => option.RecordID === defaultValueId
      );
      if (defaultOption && !value) {
        onChange(defaultOption); // Set the default selected value when the data is fetched
      }
    }
  }, [options, defaultValueId, onChange]);

  return (
    <Autocomplete
      size="small"
      limitTags={1}
      fullWidth
      options={options}
      loading={loading}
      value={value} // Pass the current value
      onChange={(event, newValue) => onChange(newValue)} // Handle selection change
      getOptionLabel={(option) => option.Name} // Display the Name
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label || "Select Options"} // Default label
          error={!!error} // Show error style if there is an error
          helperText={error} // Show error message
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

export const SingleAutocompleteWithDefault2 = ({
  value = null,
  onChange,
  url,
  defaultValueId, // The ID of the default value to be pre-selected
  height = 20,
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
        });
        setOptions(response.data.data); // Assuming API response has a `Data` array
      } catch (error) {
        setOptions([]);
        setError("Error fetching data."); // Show error message
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  useEffect(() => {
    if (defaultValueId) {
      const defaultOption = options.find(
        (option) => option.RecordID === defaultValueId
      );
      if (defaultOption && !value) {
        onChange(defaultOption); // Set the default selected value when the data is fetched
      }
    }
  }, [options, defaultValueId, onChange]);

  return (
    <Autocomplete
      size="small"
      limitTags={1}
      fullWidth
      options={options}
      loading={loading}
      value={value} // Pass the current value
      onChange={(event, newValue) => onChange(newValue)} // Handle selection change
      getOptionLabel={(option) => option.Name} // Display the Name
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label || "Select Options"} // Default label
          error={!!error} // Show error style if there is an error
          helperText={error} // Show error message
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
export const RunGroupAutocompleteWithDefault = ({
  value = null,
  onChange,
  url,
  defaultValueName, // The ID of the default value to be pre-selected
  height = 20,
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
        });
        setOptions(response.data.Data); // Assuming API response has a `Data` array
      } catch (error) {
        setOptions([]);
        // setError("Error fetching data."); // Show error message
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  useEffect(() => {
    if (defaultValueName) {
      const defaultOption = options.find(
        (option) => option.Name === defaultValueName
      );
      if (defaultOption && !value) {
        onChange(defaultOption); // Set the default selected value when the data is fetched
      }
    }
  }, [options, defaultValueName, onChange]);

  return (
    <Autocomplete
      size="small"
      limitTags={1}
      fullWidth
      options={options}
      loading={loading}
      value={value} // Pass the current value
      onChange={(event, newValue) => onChange(newValue)} // Handle selection change
      getOptionLabel={(option) => option.Name} // Display the Name
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label || "Select Options"} // Default label
          error={!!error} // Show error style if there is an error
          helperText={error} // Show error message
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

export function FormikCustomAutocomplete({
  value = [],
  onChange,
  url,
  height = 20,
  multiple = true,
  ...props
}) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); // Control open state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
        });
        setOptions(response.data.Data); // Assuming API response has a `Data` array
      } catch (error) {
        setOptions([]);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return (
    <Autocomplete
    sx={{
      '& .MuiAutocomplete-tag': {
        maxWidth: "90px", // Collapse chip size when closed
      },
    }}
      limitTags={1}
      multiple={multiple} // Enable multiple selections
      size="small"
      open={open} // Control open state
      onOpen={() => setOpen(true)} // Open dropdown when clicking on input
      onClose={() => setOpen(false)} // Close dropdown when clicking outside
      fullWidth
      options={options}
      disableCloseOnSelect
      disableListWrap
      loading={loading}
      value={value} // Pass array of selected objects
      onChange={onChange} // Update selected array
      isOptionEqualToValue={(option, value) => option.Name === value.Name}
      getOptionLabel={(option) => option.Name} // Label for each option
      renderOption={(props, option, { selected }) => (
        <li
          key={option.Name}
          {...props}
          style={{ display: "flex", gap: 2, height: 30, fontSize: 12 }}
        >
          <Checkbox
            sx={{ marginLeft: -3 }}
            size="small"
            icon={icon}
            checkedIcon={checkedIcon}
            checked={selected} // Mark selected items
          />
          {option.Name}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label || "Select Options"} // Default label
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
      {...props} // Spread the rest of the props
    />
  );
}


export function FormikCustomPrintGroupAutocomplete({
  value = [],
  onChange,
  url,
  height = 20,
  multiple = true,
  mode,
  ...props
}) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); // Control open state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
        });
        if (response.data.Status === "Y") {
          setOptions(response.data.Data);
        } else {
          setOptions([]);
        }// Assuming API response has a `Data` array
      } catch (error) {
        setOptions([]);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return (
    <Autocomplete
      limitTags={1}
      multiple={multiple} // Enable multiple selections
      size="small"
      open={open} // Control open state
      onOpen={() => setOpen(true)} // Open dropdown when clicking on input
      onClose={() => setOpen(false)} // Close dropdown when clicking outside
      fullWidth
      options={options}
      disableCloseOnSelect
      disableListWrap
      loading={loading}
      value={value} // Pass array of selected objects
      onChange={onChange} // Update selected array
      getOptionLabel={(option) => option.GroupCode && option.GroupCode !== ''
        ? `${option.PRICELISTID}/${option.PRICELISTDESCRIPTION} * (${option.GroupCode})`
        : `${option.PRICELISTID}/${option.PRICELISTDESCRIPTION}`}
      isOptionEqualToValue={(option, value) =>
        option.PRICELISTID === value.PRICELISTID 
      } // Label for each option
      renderOption={(props, option, { selected }) => (
        <li
          
          {...props}
          style={{ display: "flex", gap: 2, height: 30, fontSize: 12 }}
        >
          <Checkbox
            sx={{ marginLeft: -3 }}
            size="small"
            icon={icon}
            checkedIcon={checkedIcon}
            checked={selected} // Mark selected items
          />
          {option.GroupCode && option.GroupCode !== ''
            ? `${option.PRICELISTID}/${option.PRICELISTDESCRIPTION} * (${option.GroupCode})`
            : `${option.PRICELISTID}/${option.PRICELISTDESCRIPTION}`}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label || "Select Options"} // Default label
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
      {...props} // Spread the rest of the props
    />
  );
}


export const QuoteTempSingleAutocomplete = ({
  value = null,
  onChange,
  url,
  height = 20,
  required = false,
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
        });
        setOptions(response.data.rows); // Assuming API response has a `Data` array
      } catch (error) {
        setOptions([]);
        console.error("Error fetching data:", error);
        setError("Failed to load. Please try again."); // Handle error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  const handleChange = (event, newValue) => {
    onChange(newValue); // Pass the updated array of selected objects
  };

  return (
    <Autocomplete
      size="small"
      limitTags={1}
      fullWidth
      sx={{ maxWidth: 300 }}
      options={options}
      loading={loading} // Display loading indicator
      value={value} // Pass array of selected objects
      isOptionEqualToValue={(option, value) => option.Recid === value.Recid}
      onChange={(event, newValue) => onChange(newValue)} // Update selected array
      getOptionLabel={(option) => option.TemplateName}
      // onChange={handleChange}
      renderInput={(params) => (
        <TextField
          required={required}
          {...params}
          label={props.label || "Select Options"} // Default label
          error={!!error} // Show error style if there is an error
          helperText={error} // Show error message
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


export const ViewPriceSingleAutocomplete = ({
  value = null,
  onChange,
  url,
  height = 20,
  required = false,
  isError = null,
  ...props
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: process.env.REACT_APP_API_TOKEN,
          },
        });
        setOptions(response.data.Data); // Assuming API response has a `Data` array
      } catch (error) {
        setOptions([]);
        setError("Failed to load. Please try again."); // Handle error
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
      loading={loading} // Display loading indicator
      value={value} // Pass array of selected objects
      isOptionEqualToValue={(option, value) => option.Name === value.Name}
      onChange={(event, newValue) => onChange(newValue)} // Update selected array
      getOptionLabel={(option) => option.Name}
      // onChange={handleChange}
      renderInput={(params) => (
        <TextField
         
          {...params}
          label={props.label || "Select Options"} // Default label
          error={!!error || isError} // Show error style if there is an error
          helperText={error || isError } // Show error message
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
