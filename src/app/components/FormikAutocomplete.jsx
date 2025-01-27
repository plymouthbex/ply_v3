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


// export function CusListRunGrpOptimizedAutocomplete({
//   value = [],
//   onChange,
//   url,
//   label = "Select Options",
//   multiple = true,
//   errors,
//   helper,
//   ...props
// }) {
//   const [options, setOptions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const { data } = await axios.get(url, {
//           headers: { Authorization: process.env.REACT_APP_API_TOKEN },
//         });
//         setOptions(data.data || []);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setOptions([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [url]);

//   return (
//     <Autocomplete
//       sx={{
//         "& .MuiAutocomplete-tag": { maxWidth: "90px" },
//         maxWidth:500,minWidth:450
//       }}
//       size="small"
//       multiple={multiple}
//       limitTags={1}
//       open={open}
//       onOpen={() => setOpen(true)}
//       onClose={() => setOpen(false)}
//       value={value}
//       onChange={onChange}
//       options={options}
//       isOptionEqualToValue={(option, value) => option.CustomerNumber === value.CustomerNumber}
//       getOptionLabel={(option) => `${option.CustomerNumber} || ${option.CustomerName}`}
//       disableCloseOnSelect
//       disableListWrap
//       loading={loading}
//       ListboxComponent={ListboxComponent}
//       renderOption={(props, option, { selected }) => (
//         <li {...props} style={{ display: "flex", gap: 2, height: 20 }}>
//           <Checkbox
//             size="small"
//             sx={{ marginLeft: -1 }}
//             checked={selected}
//           />
//           {`${option.CustomerNumber} || ${option.CustomerName}`}
//           </li>
//       )}
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           label={label}
//           error={errors}
//           helperText={helper}
//           InputProps={{
//             ...params.InputProps,
//             endAdornment: (
//               <>
//                 {loading && <CircularProgress color="inherit" size={20} />}
//                 {params.InputProps.endAdornment}
//               </>
//             ),
//           }}
//         />
//       )}
//       {...props}
//     />
//   );
// }
export function CusListRunGrpOptimizedAutocomplete({
  value = [],
  onChange,
  url,
  label = "Select Options",
  multiple = true,
  errors,
  helper,
  addedCustomers = [],
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
        // Filter out added customers
        const filteredOptions = data.data.filter(
          (option) =>
            !addedCustomers.some(
              (added) => added.CustomerNumber === option.CustomerNumber
            )
        );
        setOptions(filteredOptions || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url, addedCustomers]);

  return (
    <Autocomplete
      sx={{
        "& .MuiAutocomplete-tag": { maxWidth: "90px" },
        maxWidth: 500,
        minWidth: 450,
      }}
      size="small"
      multiple={multiple}
      limitTags={1}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={value}
      onChange={onChange}
      options={options}
      isOptionEqualToValue={(option, value) => option.CustomerNumber === value.CustomerNumber}
      getOptionLabel={(option) => `${option.CustomerNumber} || ${option.CustomerName}`}
      disableCloseOnSelect
      disableListWrap
      loading={loading}
      renderOption={(props, option, { selected }) => (
        <li {...props} style={{ display: "flex", gap: 2, height: 20 }}>
          <Checkbox size="small" sx={{ marginLeft: -1 }} checked={selected} />
          {`${option.CustomerNumber} || ${option.CustomerName}`}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={errors}
          helperText={helper}
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


export function CompanyPriceListAutoComplete({
  value = [],
  onChange,
  url,
  label = "Select Options",
  multiple = true,
  errors,
  helper,
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
        setOptions(data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Autocomplete
      sx={{
        "& .MuiAutocomplete-tag": { maxWidth: "90px" },
        maxWidth:500,minWidth:450
      }}
      size="small"
      multiple={multiple}
      limitTags={2}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={value}
      onChange={onChange}
      options={options}
      isOptionEqualToValue={(option, value) => option.PRICELISTID === value.PRICELISTID}
      getOptionLabel={(option) => `${option.PRICELISTID} || ${option.PRICELISTDESCRIPTION}`}
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
          {`${option.PRICELISTID} || ${option.PRICELISTDESCRIPTION}`}
          </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={errors}
          helperText={helper}
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

export const CompanyPriceListAutoCompleteMemo = React.memo(CompanyPriceListAutoComplete)
// export const CusListRunGrpOptimizedAutocomplete = ({
//   value = [],
//   onChange,
//   label ="",
//   url,
//   errors,
//   helper,
//   height = 20,
//   multiple = true,
//   ...props
// }) => {
//   const [options, setOptions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(url, {
//           headers: {
//             Authorization: process.env.REACT_APP_API_TOKEN,
//           },
//         });
//         setOptions(response.data.data || []); // Assuming API response has `Data` array
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setOptions([]);
//         setError("Failed to load. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [url]);

//   return (
//     <Autocomplete
//       sx={{
//         "& .MuiAutocomplete-tag": { maxWidth: "90px" },
//      maxWidth:500,minWidth:450
//       }}
//       size="small"
//       multiple={multiple}
//       fullWidth
//       limitTags={2}
//       value={value}
//       onChange={onChange}
//       options={options}
//       isOptionEqualToValue={(option, value) => option.CustomerNumber === value.CustomerNumber}
//       getOptionLabel={(option) => `${option.CustomerNumber} || ${option.CustomerName}`}
//       // disableCloseOnSelect
//       disableListWrap
//       loading={loading}
//       ListboxComponent={ListboxComponent}

//       renderOption={(props, option, { selected }) => (
//         <li {...props} style={{ display: "flex", gap: 2, height: 20 }}>
//           <Checkbox
//             size="small"
//             sx={{ marginLeft: -1 }}
//             checked={selected}
//           />
//           {`${option.CustomerNumber} || ${option.CustomerName}`}
//         </li>
//       )}
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           label={label}
//           error={!!error ||errors}
//           helperText={error ||helper}
//           InputProps={{
//             ...params.InputProps,
//             endAdornment: (
//               <>
//                 {loading && <CircularProgress color="inherit" size={20} />}
//                 {params.InputProps.endAdornment}
//               </>
//             ),
//           }}
//         />
//       )}
//       {...props}
//     />
//   );
//   // return (
//   //   <Autocomplete
  
//   //     size="small"
//   //     limitTags={1}
//   //     sx={{maxWidth:500,minWidth:450}}
//   //     options={options}
//   //     loading={loading}
//   //     value={value}
//   //     isOptionEqualToValue={(option, value) => option.CustomerNumber === value.CustomerNumber}
//   //     onChange={(event, newValue) => onChange(newValue)}
//   //     getOptionLabel={(option) => `${option.CustomerNumber} || ${option.CustomerName}`}
//   //     ListboxComponent={ListboxComponent} // Custom listbox component
//   //     renderInput={(params) => (
//   //       <TextField
//   //         {...params}
//   //         label={props.label || "Select Options"}
//   //         error={!!error ||errors}
//   //         helperText={error ||helper}
//   //         InputProps={{
//   //           ...params.InputProps,
//   //           endAdornment: (
//   //             <>
//   //               {loading ? (
//   //                 <CircularProgress color="inherit" size={20} />
//   //               ) : null}
//   //               {params.InputProps.endAdornment}
//   //             </>
//   //           ),
//   //         }}
//   //       />
//   //     )}
//   //     {...props}
//   //   />
//   // );
// };

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
      fullWidth
      limitTags={2}
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



export function FormikCustomAutocompleteMultiAdHocItems({
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
        setOptions(data.data || []);
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
      limitTags={2}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={value}
      onChange={onChange}
      options={options}
      isOptionEqualToValue={(option, value) => option.item_key === value.item_key}
      getOptionLabel={(option) => `${option.Item_Number} || ${option.Item_Description}`}
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
          {`${option.Item_Number} || ${option.Item_Description}`}
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


export function FormikCustomAutocompleteMultiPriceList({
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
        setOptions(data.data || []);
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
      limitTags={2}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={value}
      onChange={onChange}
      options={options}
      isOptionEqualToValue={(option, value) => option.PRICELISTID === value.PRICELISTID}
      getOptionLabel={(option) => `${option.PRICELISTID} || ${option.PRICELISTDESCRIPTION}`}
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
          {`${option.PRICELISTID} || ${option.PRICELISTDESCRIPTION}`}
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
