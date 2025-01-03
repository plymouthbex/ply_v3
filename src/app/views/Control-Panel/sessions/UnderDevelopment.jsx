import { Box, Button, styled, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const FlexBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

const JustifyBox = styled(FlexBox)(() => ({
  maxWidth: 320,
  flexDirection: 'column',
  justifyContent: 'center',
}));

const IMG = styled('img')(() => ({
  width: '100%',
  marginBottom: '32px',
}));

const NotFoundRoot = styled(FlexBox)(() => ({
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh !important',
}));

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <NotFoundRoot>
      <JustifyBox>
        <IMG src="/assets/images/error-404.png" alt="" />
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          Spec Required
        </Typography>
        <Button
          color="primary"
          variant="contained"
          sx={{
            textTransform: 'capitalize',
            backgroundColor: "#164D50",
            color: "white",
            "&:hover": {
              backgroundColor: "#164D50", // Custom hover color
            },}}
          onClick={() => navigate('/home')}
        >
          Go Home
        </Button>
      </JustifyBox>
    </NotFoundRoot>
  );
};

export default NotFound;
