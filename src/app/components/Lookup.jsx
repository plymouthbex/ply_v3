import { Box,  IconButton,  useTheme,Typography,Tooltip } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";


import React from 'react';

import { useNavigate,useLocation, NavLink } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';



const Listviewpopup = ({childToParent,accessID,screenName,filterName,filterValue}) => {

 
  const navigate = useNavigate();

  const theme = useTheme();

  const location = useLocation();
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = React.useState(10);
  var filter=""

 


  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row" }}>
        
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <GridToolbarQuickFilter />
          <Tooltip title="Add" >
         
          
         
          <IconButton color="primary"  >
            <AddOutlinedIcon />
          </IconButton>
        
          </Tooltip>
        
        </Box>
      </GridToolbarContainer>
    );
  }

  return (
    <React.Fragment>
     
    <Box >
   
          <Box
        sx={{
            

    "& .MuiDataGrid-cell": {
      borderBottom: "none", 
    },
    "& .name-column--cell": {
      color: theme.palette.info.contrastText,
    },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: theme.palette.info.main,
      color: theme.palette.info.contrastText,
      fontWeight: "bold",
      fontSize: theme.typography.subtitle2.fontSize,
    },
    "& .MuiDataGrid-virtualScroller": {
      backgroundColor: theme.palette.info.light,
    },
    "& .MuiDataGrid-footerContainer": {
      borderTop: "none",
      backgroundColor: theme.palette.info.main,
      color: theme.palette.info.contrastText,
    },
    "& .MuiCheckbox-root": {
      color: "black !important", // Set checkbox color to black
    },
    // Style for selected rows
    // "& .MuiDataGrid-row.Mui-selected": {
    //   backgroundColor: `${theme.palette.action.selected} !important`, // Ensure selected row color doesn't change
    // },
    // Ensure the checkbox color reflects the selected state
    "& .MuiCheckbox-root.Mui-checked": {
      color: "black !important", // Set checkbox color to black when checked
    },
    // Alternating row colors
    "& .MuiDataGrid-row:nth-of-type(even)": {
      backgroundColor: theme.palette.action.hover, // Color for even rows
    },
    "& .MuiDataGrid-row:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default, // Color for odd rows
    },
    // Prevent selected row background color from changing on hover
    "& .MuiDataGrid-row.Mui-selected:hover": {
      backgroundColor: `${theme.palette.action.selected} !important`, // Ensure the background remains the same on hover
    },
          }}
      >
      <DataGrid sx={{ height:500, width:{xs:'100%',md:800} }}
        
        // checkboxSelection 
        rows={[]} 
        columns={[]} 
        disableSelectionOnClick
        getRowId={row=>row.RecordID}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[5, 10, 20]}
        pagination   
           onRowClick={(params) => {
           const currentRow = params.row;            
            childToParent(currentRow,screenName,filterValue);
      } }
    components={{
      Toolbar: CustomToolbar,
    }}
    componentsProps={{
      toolbar: {
        showQuickFilter: true,
        quickFilterProps: { debounceMs: 500 },
      },
    }}
    // loading={loading}
        />
      </Box>
     
    </Box>
    
     </React.Fragment>
  );
};

export default Listviewpopup;