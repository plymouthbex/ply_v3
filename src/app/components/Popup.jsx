import React from 'react'
import { Dialog, DialogTitle, DialogContent, makeStyles, Typography, DialogActions, DialogContentText } from '@mui/material';
import {Button} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

import { IconButton } from '@mui/material';
import {TextField} from '@mui/material';

import { Outlet, useNavigate } from 'react-router-dom'
import Grid from '@mui/material/Grid';



// const useStyles = makeStyles(theme => ({
//     dialogWrapper: {
//         padding: theme.spacing(2),
//         position: 'absolute',
//         top: theme.spacing(5)
//     },
//     dialogTitle: {
//         paddingRight: '0px'
//     },
//     // menuPaper: {
//     //     maxHeight: 100
//     //   }
// }))

    
const Popup = (props) => {
   
    const { title, children, openPopup, setOpenPopup } = props;
    // const classes = useStyles();
 
    return (
        <Dialog open={openPopup}   maxWidth="lg" >
            {/* <DialogTitle id='dialog-title'>
            <Grid container rowSpacing={1} columnSpacing={{  md: 2 }}>
                <Grid xs={6} display='flex' alignItems={'center'}  >
                <Typography variant='h5'  mt='2px' >{title} </Typography>
                </Grid>
                <Grid xs={6} display='flex' justifyContent='end'>
                <IconButton color='error' aria-label="close" onClick={()=>{setOpenPopup(false)}}>
      <CancelIcon color='error' />
    </IconButton>
    </Grid>
   </Grid>
            </DialogTitle> */}
          
         <Grid  display='flex' justifyContent='end'>
                <IconButton color='error' aria-label="close" onClick={()=>{setOpenPopup(false)}}>
         <CancelIcon color='error' />
         </IconButton>
        </Grid>
            <DialogContent dividers>
                <DialogContentText id='dialog-description'> {children}</DialogContentText>               
            </DialogContent>
            <DialogActions>
            {/* <Button variant="contained" onClick={()=>{setOpenPopup(false)}}>Cancel</Button>
            <Button variant="contained" onClick={handleSave} >Save</Button> */}
            </DialogActions>
        </Dialog>
    )
}
export default Popup;