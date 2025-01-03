import { Box, Card, styled, Typography } from "@mui/material";

const StyledCard = styled(Card)({
//   height: 360,
  // width: 270,
  border: "5px solid #164D50",
  borderRadius: "5%",
  overflow: "hidden",
  textAlign: "center",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: "2px",
});

const InnerBorderContainer = styled("div")({
  flex: 1,
  border: "2px solid #164D50",
  borderRadius: "4%",
  padding: "4px",
  display: "flex",
  flexDirection: "column",
});

const ImageWrapper = styled("div")(({ previewImage }) => ({
  width: "100%",
  height: 130,
  backgroundImage: `url(data:image;base64,${previewImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  borderRadius: "4px",
}));
 const CoverPageComponent = ({data ={}}) => {
  return (
    <StyledCard>
      <InnerBorderContainer>
        <Box sx={{ padding: "8px" }}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb={1}
          >
            <img src={data.logo} alt="Company Logo" height={60} />
          </Box>
          <Typography
            variant="body2"
            fontWeight="bold"
            color="#4A5D23"
            sx={{ marginTop: 1 }}
          >
            {data.subtitle1}
          </Typography>
          <Typography variant="body2" fontWeight="bold" color="#4A5D23">
            {data.subtitle2}
          </Typography>
        </Box>
        <ImageWrapper previewImage={data.coverImg} />
        <Typography
          variant="body2"
          fontWeight="bold"
          color="#4A5D23"
          sx={{ mt: 1, mb: 1 }}
        >
          {data.date}
        </Typography>
        <Box textAlign="center" marginTop={1}>
          <Typography variant="body2" color="textSecondary">
            Prepared by:
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
            {data.preparedByName}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "10px" }}>
            {data.preparedByPhone}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "10px" }}>
            {data.preparedByEmail}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, fontSize: "10px" }}>
            {data.phone1} | {data.phone2} | Fax: {data.fax}
          </Typography>
        </Box>
      </InnerBorderContainer>
    </StyledCard>
  );
};


export default CoverPageComponent