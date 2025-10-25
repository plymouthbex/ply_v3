import { Box, styled } from "@mui/material";
import AppLogo from "./AppLogo";
import useSettings from "app/hooks/useSettings";
import { Span } from "./Typography";
import { Link } from "react-router-dom";
import useAuth from "app/hooks/useAuth";
import { useEffect, useState } from "react";

const BrandRoot = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "20px 18px 20px 29px",
}));

const StyledSpan = styled(Span)(({ mode }) => ({
  fontSize: 14,
  marginLeft: ".5rem",
  fontWeight:"bold",
  display: mode === "compact" ? "none" : "block",
}));

const Brand = ({ children }) => {
  const { settings } = useSettings();
  const leftSidebar = settings.layout1Settings.leftSidebar;
  const { mode } = leftSidebar;
const {user}=useAuth();

  return (
    <BrandRoot>
      <Link
        to={"/home"}
        state={{
          name: "home",
          path: "/home",
          accessID: "PPB001",
          fav: false,
          RecordID: 0,
        }}
      >
        <Box display="flex" alignItems="center" >
          <img
            src={`data:image/png;base64,${user.logo}`}
            height={30}

            style={{ objectFit: "cover" }}
          />
          <StyledSpan mode={mode} className="sidenavHoverShow">
            {settings.appCaptionConfig.title}
          </StyledSpan>
        </Box>
      </Link>

      <Box
        className="sidenavHoverShow"
        sx={{ display: mode === "compact" ? "none" : "block" }}
      >
        {children || null}
      </Box>
    </BrandRoot>
  );
};

export default Brand;















// import { Box, styled } from "@mui/material";
// import AppLogo from "./AppLogo";
// import useSettings from "app/hooks/useSettings";
// import { Span } from "./Typography";
// import { Link } from "react-router-dom";
// import useAuth from "app/hooks/useAuth";
// import { useEffect, useState } from "react";
// import { update } from "lodash";

// const BrandRoot = styled(Box)(() => ({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "space-between",
//   padding: "20px 18px 20px 29px",
// }));

// const StyledSpan = styled(Span)(({ mode }) => ({
//   fontSize: 14,
//   marginLeft: ".5rem",
//   fontWeight:"bold",
//   display: mode === "compact" ? "none" : "block",
// }));

// const Brand = ({ children }) => {
//   const { settings } = useSettings();
//   const leftSidebar = settings.layout1Settings.leftSidebar;
//   const { mode } = leftSidebar;
// const {user,updateCompany,companyList}=useAuth();
//   useEffect(() => {
//     updateCompany();
//   }, []);

// console.log(companyList)
// console.log(user);

// const company = companyList?.find(
//         (value) => value.companyCode === user?.companyCode
//       );
// console.log(company);
//   return (
//     <BrandRoot>
//       <Link
//         to={"/home"}
//         state={{
//           name: "home",
//           path: "/home",
//           accessID: "PPB001",
//           fav: false,
//           RecordID: 0,
//         }}
//       >
//         <Box display="flex" alignItems="center" >
//           <img
//            src={company?.logo ? `data:image/png;base64,${company.logo}` : `data:image/png;base64,${user.logo}` }
//             height={30}

//             style={{ objectFit: "cover" }}
//           />
//           <StyledSpan mode={mode} className="sidenavHoverShow">
//             {settings.appCaptionConfig.title}
//           </StyledSpan>
//         </Box>
//       </Link>

//       <Box
//         className="sidenavHoverShow"
//         sx={{ display: mode === "compact" ? "none" : "block" }}
//       >
//         {children || null}
//       </Box>
//     </BrandRoot>
//   );
// };

// export default Brand;
