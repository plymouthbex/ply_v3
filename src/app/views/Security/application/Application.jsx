import React, { useEffect } from "react";
import {
  Box,
  LinearProgress,
  Paper,
  Button,
  styled,
  useTheme,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarQuickFilter,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Breadcrumb } from "app/components";
import { dataGridHeight, dataGridRowHeight,dataGridpageSizeOptions ,dataGridPageSize,dataGridHeaderFooterHeight} from "app/utils/constant";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getApplicationListView } from "app/redux/slice/listviewSlice";

// ********************* STYLED COMPONENTS ********************* //
const Container = styled("div")(({ theme }) => ({
  margin: "15px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "10px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

// ********************* ITEMS SCREEN LISTVIEW ********************* //
const Application = () => {
  // ********************* HOOKS AND CONSTANTS ********************* //
  const theme = useTheme();
  const navigate = useNavigate();
const dispatch=useDispatch();
  // ********************* LOCAL STATE ********************* //

  // ********************* REDUX STATE ********************* //
  const rows =useSelector((state)=>state.listview.applicationListViewData);
  console.log("🚀 ~ Application ~ rows:", rows)
  // ********************* COLUMN AND ROWS ********************* //
  const columns = [
    // {
    //   headerName: "AccessID",
    //   field: "ApplicationCode",
    //   width: "200",
    //   align: "left",
    //   headerAlign: "left",
    //   hide: true,
    // },
    {
      headerName: "Menu Name",
      field: "ApplicationName",
      width: "200",
      align: "left",
      headerAlign: "left",
      hide: true,
    },

    {
      field: "Action",
      headerName: "Action",
      minWidth: 150,
      flex: 1,
      sortable: false,
      headerAlign: "center",
      filterable: false,
      disableColumnMenu: true,
      disableExport: true,
      align: "center",
      renderCell: (params) => {
        return (
          <div>
            <Button
              sx={{ height: 25 }}
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => {
                navigate("/pages/security/application-edit-detail/edit", {
                  state: { ID: params.row.RecordID },
                });
              }}
            >
              Edit
            </Button>
          </div>
        );
      },
    },
  ];


//================API-CALL====================//
useEffect(() => {
  dispatch(getApplicationListView());
 
}, [dispatch]);
  // ********************* TOOLBAR ********************* //
  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          width: "100%",
          padding: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 2,
            paddingX: 2,
          }}
        >
          <GridToolbarQuickFilter />

          <Button
            variant="contained"
            color="info"
            size="small"
            startIcon={<Add />}
            onClick={() => {
              navigate("/pages/security/application-edit-detail/add",{state:{ID:0}});
            }}
          >
            Add
          </Button>
        </Box>
      </GridToolbarContainer>
    );
  }

  return (
    <Container>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[{ name: "Security" }, { name: "Menu" }]}
        />
      </div>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <Box
          sx={{
            height: dataGridHeight,

            "& .MuiDataGrid-root": {
              border: "none",
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
              color: "black !important",
            },

            "& .MuiCheckbox-root.Mui-checked": {
              color: "black !important",
            },

            "& .MuiDataGrid-row:nth-of-type(even)": {
              backgroundColor: theme.palette.action.hover,
            },

            "& .MuiDataGrid-row:nth-of-type(odd)": {
              backgroundColor: theme.palette.background.default,
            },

            "& .MuiDataGrid-row.Mui-selected:hover": {
              backgroundColor: `${theme.palette.action.selected} !important`,
            },"& .MuiTablePagination-root": {
              color: "white !important", // Ensuring white text color for the pagination
            }, 
        
            "& .MuiTablePagination-root .MuiTypography-root": {
              color: "white !important", // Ensuring white text for "Rows per page" and numbers
            }, 
        
            "& .MuiTablePagination-actions .MuiSvgIcon-root": {
              color: "white !important", // Ensuring white icons for pagination
            },
          }}
        >
          <DataGrid
            slots={{
              loadingOverlay: LinearProgress,
              toolbar: CustomToolbar,
            }}
            columnHeaderHeight={dataGridHeaderFooterHeight}
            sx={{
              // This is to override the default height of the footer row
              '& .MuiDataGrid-footerContainer': {
                  height: dataGridHeaderFooterHeight,
                  minHeight: dataGridHeaderFooterHeight,
              },
            }}
            rowHeight={dataGridRowHeight}
            rows={rows}
            columns={columns}
            // checkboxSelection
            disableSelectionOnClick
            disableRowSelectionOnClick
            getRowId={(row) => row.RecordID}
            initialState={{
              pagination: {
                paginationModel: { pageSize: dataGridPageSize },
              },
            }}
            pageSizeOptions={dataGridpageSizeOptions}
            columnVisibilityModel={{
              RecordID: true,
            }}
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default Application;


















// import React, { useEffect } from "react";
// import {
//   Box,
//   LinearProgress,
//   Paper,
//   Button,
//   styled,
//   Checkbox,
// } from "@mui/material";
// import {
//   DataGrid,
//   GridToolbarContainer,
//   GridRowModes,
//   GridRowEditStopReasons,
//   GridActionsCellItem,
// } from "@mui/x-data-grid";
// import { Breadcrumb } from "app/components";
// import {
//   dataGridHeight,
//   dataGridRowHeight,
//   dataGridpageSizeOptions,
//   dataGridPageSize,
// } from "app/utils/constant";
// import { Add } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { getApplicationListView } from "app/redux/slice/listviewSlice";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/DeleteOutlined";
// import SaveIcon from "@mui/icons-material/Save";
// import CancelIcon from "@mui/icons-material/Close";
// import AddIcon from "@mui/icons-material/Add";
// import { useTheme } from "@emotion/react";
// import { applicationPost } from "app/redux/slice/postSlice";
// import toast from "react-hot-toast";

// const Container = styled("div")(({ theme }) => ({
//   margin: "15px",
//   [theme.breakpoints.down("sm")]: { margin: "16px" },
//   "& .breadcrumb": {
//     marginBottom: "10px",
//     [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
//   },
// }));

// const Application = () => {
//   const theme = useTheme();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const initialRows = useSelector(
//     (state) => state.listview.applicationListViewData
//   );
//   const [rows, setRows] = React.useState(initialRows);
//   const [rowModesModel, setRowModesModel] = React.useState({});
//   const [checkboxValues, setCheckboxValues] = React.useState({}); // State to track checkbox values

//   useEffect(() => {
//     dispatch(getApplicationListView());
//   }, [dispatch]);

//   const columns = [
//     {
//       headerName: "Application Code",
//       field: "ApplicationCode",
//       width: 200,
//       align: "left",
//       headerAlign: "left",
//     },
//     {
//       headerName: "Screen Name",
//       field: "ApplicationName",
//       width: 200,
//       align: "left",
//       headerAlign: "left",
//     },
//     {
//       headerName: "Admin",
//       field: "Admin",
//       width: 100,
//       renderCell: (params) => {
//         const isEditable = rowModesModel[params.row.RecordID]?.mode === GridRowModes.Edit;

//         // Set initial value if checkboxValues is undefined
//         const currentValue = checkboxValues[params.row.RecordID]?.Admin ?? params.value;

//         return (
//           <Checkbox
//             checked={currentValue === 1}
//             disabled={!isEditable} // Disable checkbox when not in edit mode
//             onChange={(e) => handleCheckboxChange(e, params.row.RecordID, 'Admin')}
//             inputProps={{ "aria-label": "Admin Checkbox" }}
//           />
//         );
//       },
//     },
//     {
//       headerName: "User",
//       field: "User",
//       width: 100,
//       renderCell: (params) => {
//         const isEditable = rowModesModel[params.row.RecordID]?.mode === GridRowModes.Edit;

//         // Set initial value if checkboxValues is undefined
//         const currentValue = checkboxValues[params.row.RecordID]?.User ?? params.value;

//         return (
//           <Checkbox
//             checked={currentValue === 1}
//             disabled={!isEditable}
//             onChange={(e) => handleCheckboxChange(e, params.row.RecordID, 'User')}
//             inputProps={{ "aria-label": "User Checkbox" }}
//           />
//         );
//       },
//     },
//     {
//       headerName: "System Admin",
//       field: "SystemAdmin",
//       width: 150,
//       renderCell: (params) => {
//         const isEditable = rowModesModel[params.row.RecordID]?.mode === GridRowModes.Edit;

//         // Set initial value if checkboxValues is undefined
//         const currentValue = checkboxValues[params.row.RecordID]?.SystemAdmin ?? params.value;

//         return (
//           <Checkbox
//             checked={currentValue === 1}
//             disabled={!isEditable}
//             onChange={(e) => handleCheckboxChange(e, params.row.RecordID, 'SystemAdmin')}
//             inputProps={{ "aria-label": "System Admin Checkbox" }}
//           />
//         );
//       },
//     },
//     {
//       field: "actions",
//       type: "actions",
//       headerName: "Actions",
//       width: 100,
//       cellClassName: "actions",
//       getActions: ({ row }) => {
//         const isInEditMode = rowModesModel[row.RecordID]?.mode === GridRowModes.Edit;

//         if (isInEditMode) {
//           return [
//             <GridActionsCellItem
//               icon={<SaveIcon />}
//               label="Save"
//               sx={{ color: "primary.main" }}
//               onClick={handleSaveClick(row.RecordID)}
//               key="save"
//             />,
//             <GridActionsCellItem
//               icon={<CancelIcon />}
//               label="Cancel"
//               onClick={handleCancelClick(row.RecordID)}
//               color="inherit"
//               key="cancel"
//             />,
//           ];
//         }

//         return [
//           <GridActionsCellItem
//             icon={<EditIcon />}
//             label="Edit"
//             onClick={handleEditClick(row.RecordID)}
//             color="inherit"
//             key="edit"
//           />,
//           <GridActionsCellItem
//             icon={<DeleteIcon />}
//             label="Delete"
//             onClick={handleDeleteClick(row.RecordID)}
//             color="inherit"
//             key="delete"
//           />,
//         ];
//       },
//     },
//   ];
//   function EditToolbar({ setRows, setRowModesModel }) {
//     const handleClick = () => {
//       const RecordID = Math.floor(Math.random() * 1000); // Generate unique ID for the new row
//       setRows((oldRows) => [
//         ...oldRows,
//         { 
//           RecordID, 
//           ApplicationCode: '', 
//           ApplicationName: '', 
//           Admin: 0, 
//           User: 0, 
//           SystemAdmin: 0, 
//           isNew: true 
//         },
//       ]);
//       setRowModesModel((oldModel) => ({
//         ...oldModel,
//         [RecordID]: { mode: GridRowModes.Edit, fieldToFocus: 'ApplicationCode' },
//       }));
//     };
  
//     return (
//       <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
//         Add New Row
//       </Button>
//     );
//   }
  
//   const handleCheckboxChange = (event, recordID, field) => {
//     const value = event.target.checked ? 1 : 0;
//     setCheckboxValues((prevState) => ({
//       ...prevState,
//       [recordID]: {
//         ...prevState[recordID],
//         [field]: value,
//       },
//     }));
//     console.log(`${field} for RecordID ${recordID} is now:`, value);
//   };

//   const handleEditClick = (recordID) => () => {
//     setRowModesModel({
//       ...rowModesModel,
//       [recordID]: { mode: GridRowModes.Edit },
//     });
//   };

//   const handleSaveClick = (recordID) => async () => {
//     try {
//       // Get the current checkbox values for the row
//       const currentValues = checkboxValues[recordID] || {};
  
//       // Prepare appData with values from the row
//       const appData = {
//         recordID: recordID,
//         applicationCode: rows.find((row) => row.RecordID === recordID).ApplicationCode,
//         applicationName: rows.find((row) => row.RecordID === recordID).ApplicationName,
//         User: currentValues.User ?? 0, // Default to 0 if undefined
//         Admin: currentValues.Admin ?? 0, // Default to 0 if undefined
//         SystemAdmin: currentValues.SystemAdmin ?? 0, // Default to 0 if undefined
//       };
  
//       // Log the appData to the console for debugging
//       console.log("appData:", appData);
  
//       // Dispatch the action to save data via Redux (assumed action: applicationPost)
//       const response = await dispatch(applicationPost({ appData }));
  
//       // Check the response payload status
//       if (response.payload.status === "Y") {
//        toast.success("Updated SuccesFully") ;
//        dispatch(getApplicationListView());// Success, open success alert
//       } else {
       
//         toast.error("Error occurred while saving data"); // Show error message with toast
//       }
  
//       // Set the row mode to view after saving
//       setRowModesModel({
//         ...rowModesModel,
//         [recordID]: { mode: GridRowModes.View },
//       });
//     } catch (error) {
//       // Handle any errors that occurred during the save process
//       console.error("Error saving data:", error);
      
//       toast.error("An error occurred while processing the request"); // Display error toast
//     }
//   };
  

    
//   const handleDeleteClick = (recordID) => () => {
//     setRows(rows.filter((row) => row.RecordID !== recordID));
//   };

//   const handleCancelClick = (recordID) => () => {
//     setRowModesModel({
//       ...rowModesModel,
//       [recordID]: { mode: GridRowModes.View, ignoreModifications: true },
//     });

//     const editedRow = rows.find((row) => row.RecordID === recordID);
//     if (editedRow.isNew) {
//       setRows(rows.filter((row) => row.RecordID !== recordID));
//     }
//   };

//   const processRowUpdate = (newRow) => {
//     const updatedRow = { ...newRow, isNew: false };
//     setRows(rows.map((row) => (row.RecordID === newRow.RecordID ? updatedRow : row)));
//     return updatedRow;
//   };

//   const handleRowModesModelChange = (newRowModesModel) => {
//     setRowModesModel(newRowModesModel);
//   };

//   return (
//     <Container>
//       <div className="breadcrumb">
//         <Breadcrumb
//           routeSegments={[{ name: "Security" }, { name: "Application" }]}/>
//       </div>

//       <Paper sx={{ width: "100%", mb: 2 }}>
//         <Box
//           sx={{
//             height: dataGridHeight,
//             "& .MuiDataGrid-root": { border: "none" },
//             "& .MuiDataGrid-columnHeaders": {
//               backgroundColor: theme.palette.info.main,
//               color: theme.palette.info.contrastText,
//               fontWeight: "bold",
//             },
//             "& .MuiDataGrid-footerContainer": {
//               borderTop: "none",
//               backgroundColor: theme.palette.info.main,
//               color: theme.palette.info.contrastText,
//             },
//           }}
//         >
//           <DataGrid
//             editMode="row"
//             rowModesModel={rowModesModel}
//             onRowModesModelChange={handleRowModesModelChange}
//             processRowUpdate={processRowUpdate}
//             slots={{ loadingOverlay: LinearProgress,
//               // toolbar:EditToolbar
//              }}
//             rowHeight={dataGridRowHeight}
//             rows={rows}
//             columns={columns}
//             disableSelectionOnClick
//             getRowId={(row) => row.RecordID}
//             initialState={{
//               pagination: {
//                 paginationModel: { pageSize: dataGridPageSize },
//               },
//             }}
//             pageSizeOptions={dataGridpageSizeOptions}
//             components={{
//               Toolbar: () => <EditToolbar setRows={setRows} setRowModesModel={setRowModesModel} />
//             }}
          
//             onRowEditCommit={(params) => {
//               handleEditClick
//             }}
//           />
//         </Box>
//       </Paper>
//     </Container>
//   );
// };


// export default Application;

