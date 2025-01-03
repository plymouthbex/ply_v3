import { themeShadows } from './themeColors';
import { alpha } from '@mui/material';
export const components = {
  MuiTable: {
    styleOverrides: {
      root: {
        tableLayout: 'fixed',
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      head: {
        fontSize: '13px',
        padding: '12px 0px',
      },
      root: {
        fontSize: '14px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
        padding: '12px 8px 12px 0px',
      },
    },
  },
  MUIDataTableSelectCell: {
    styleOverrides: {
      root: {
        paddingLeft: 12,
      },
    },
  },
  MUIDataTableHeadCell: {
    styleOverrides: {
      root: {
        paddingLeft: 16,
      },
    },
  },
  MUIDataTableBodyCell: {
    styleOverrides: {
      root: {
        paddingLeft: 8,
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        fontSize: '14px',
        textTransform: 'none',
        fontWeight: '400',
        borderRadius: "8px",
        transition: "all 0.3s ease", 
      },
      contained: {
        boxShadow: themeShadows[9],
      },
    },
  },
  MuiCssBaseline: {
    styleOverrides: {
      '*': {
        boxSizing: 'border-box',
      },
      html: {
        MozOsxFontSmoothing: 'grayscale',
        WebkitFontSmoothing: 'antialiased',
        height: '100%',
        width: '100%',
      },
      body: {
        height: '100%',
      },
      a: {
        textDecoration: 'none',
        color: 'inherit',
      },
      '#root': {
        height: '100%',
      },
      '#nprogress .bar': {
        zIndex: '2000 !important',
      },
    },
  },
  MuiFab: {
    styleOverrides: {
      root: {
        boxShadow: themeShadows[12],
      },
    },
  },
  MuiAccordion: {
    styleOverrides: {
      root: {
        '&:before': {
          display: 'none',
        },
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        fontSize: '11px',
      },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {
        fontSize: '0.875rem',
      },
    },
  },
  MuiExpansionPanel: {
    styleOverrides: {
      root: {
        '&:before': {
          display: 'none',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        boxShadow:
          '0px 3px 3px -2px rgb(0 0 0 / 6%), 0px 3px 4px 0px rgb(0 0 0 / 4%), 0px 1px 8px 0px rgb(0 0 0 / 4%) !important',
      },
    },
  },
//   MuiOutlinedInput: {
//     styleOverrides: {
//         input: {
//             padding: '10.5px 14px 10.5px 12px'
//         },
//         notchedOutline: {
//             borderColor: "#d9d9d9"
//         },
//         root: {
//             '&:hover .MuiOutlinedInput-notchedOutline': {
//                 borderColor:"#69c0ff"
//             },
//             '&.Mui-focused': {
//                 boxShadow: `0 0 0 2px ${alpha("#1890ff", 0.2)}`,
//                 '& .MuiOutlinedInput-notchedOutline': {
//                     border: "1px solid #69c0ff"
//                 }
//             },
//             '&.Mui-error': {
//                 '&:hover .MuiOutlinedInput-notchedOutline': {
//                     borderColor: "#ffa39e"
//                 },
//                 '&.Mui-focused': {
//                     boxShadow: `0 0 0 2px ${alpha("#ff4d4f", 0.2)}`,
//                     '& .MuiOutlinedInput-notchedOutline': {
//                         border: `1px solid #ffa39e`
//                     }
//                 }
//             }
//         },
//         inputSizeSmall: {
//             padding: '7.5px 8px 7.5px 12px'
//         },
//         inputMultiline: {
//             padding: 0
//         }
//     }
// },
// MuiInputLabel: {
//   styleOverrides: {
//       root: {
//           color: "#595959"
//       },
//       outlined: {
//           lineHeight: '0.8em',
//           '&.MuiInputLabel-sizeSmall': {
//               lineHeight: '1em'
//           },
//           '&.MuiInputLabel-shrink': {
//               background: "#ffffff",
//               // padding: '0 8px',
//               // marginLeft: -6,
//               lineHeight: '1.4375em'
//           }
//       }
//   }
// }
};
