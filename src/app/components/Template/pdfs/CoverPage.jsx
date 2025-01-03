import React from "react";
import {
  Document,
  Page,
  Text,
  Image,
  View,
  PDFViewer,
} from "@react-pdf/renderer";

// Sample data (update with real data)
const coverPageData1 = {
  logo: "/assets/images/plylogo.png", // Replace with the actual path to the logo image
  subtitle1: "Price List for",
  subtitle2: "Wholesale Pricelist",
  effectiveDate: "Effective 10/13/24 - 10/19/24",
  preparedByName: "Leah Baskett",
  preparedByPhone: "(206) 676-6327",
  preparedByEmail: "leah.baskett@plymouthinc.com",
  phone2: "1-800-552-7374",
  fax: "(206) 622-2625",
  coverImg:"/assets/images/CoverCenterImg.PNG"
};

const CoverPage = ({ coverPageData, orientation="portrait" }) => {

  
  return (
    <Page style={{ padding: 25, fontFamily: "Helvetica", fontSize: 12 }} orientation={orientation}>
      <View
        style={{
          borderColor: "#164D50", // Dark green border color
          borderWidth: "4px",
          borderStyle: "solid",
          flexGrow: 1,
          borderRadius: "5%",
          padding: 1,
        }}
      >
        <View
          style={{
            paddingVertical: 30,
            paddingHorizontal: 10,
            borderColor: "#164D50", // Dark green border color
            borderWidth: "1px",
            borderStyle: "solid",
            flexGrow: 1,
            borderRadius: "4%",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 20,
              color: "#1A3A2C", // Darker green text color
            }}
          >
            <Image
              src={`data:image;base64,${coverPageData.logo}`}
              style={{
                height: 150,
                marginBottom: 10,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#4E4E0D", // Orange subtitle color
                marginTop: 50,
              }}
            >
              {coverPageData.subtitle1}
            </Text>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "bold",
                color: "#4E4E0D", // Orange subtitle color
                textAlign:'center'
              }}
            >
              {coverPageData.subtitle2}
            </Text>
          </View>

          <View
            style={{
              textAlign: "center",
              paddingHorizontal: 20,
            }}
          >
            <Image
              src={`data:image;base64,${coverPageData.coverImg}`} // Replace with actual image path
              style={{
                height: 200,
                objectFit: "cover",
              }}
            />
          </View>

          <Text
            style={{
              textAlign: "center",
              marginTop: 10,
              fontSize: 17,
              fontWeight: "bold",
              color: "#4E4E0D",
            }}
          >
            {coverPageData.effectiveDate}
          </Text>

          <View
            style={{
              textAlign: "center",
              marginTop: 50,
            }}
          >
            <Text
              style={{ fontSize: 16, fontWeight: "bold", color: "#4E4E0D" }}
            >
              Prepared by:
            </Text>
            <Text style={{ marginTop: 30, color: "#4E4E0D" }}>
              {coverPageData.preparedByName}
            </Text>
            <Text style={{ color: "#4E4E0D" }}>
              {coverPageData.preparedByPhone}
            </Text>
            <Text style={{ color: "#4E4E0D" }}>
              {coverPageData.preparedByEmail}
            </Text>
          </View>

          <View
            style={{
              textAlign: "center",
              marginTop: 10,
              fontSize: 10,
              color: "#1A3A2C", // Darker green text color
            }}
          >
            <Text
              style={{
                marginTop: 20,
                fontSize: 16,
                fontWeight: "bold",
                color: "#4E4E0D",
              }}
            >
              {coverPageData.phone1} - {coverPageData.phone2} -
              Fax: {coverPageData.fax}
            </Text>
          </View>
        </View>
      </View>
    </Page>
  );
};

export default CoverPage;



export const CoverPageLandscape = ({ coverPageData,}) => {

  
  return (
    <Page style={{ padding: 20, fontFamily: "Helvetica", fontSize: 12 }} orientation="landscape">
      <View
        style={{
          borderColor: "#164D50", // Dark green border color
          borderWidth: "4px",
          borderStyle: "solid",
          flexGrow: 1,
          borderRadius: "5%",
          padding: 1,
        }}
      >
        <View
          style={{
            paddingVertical: 15,
            paddingHorizontal: 5,
            borderColor: "#164D50", // Dark green border color
            borderWidth: "1px",
            borderStyle: "solid",
            flexGrow: 1,
            borderRadius: "4%",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 10,
              color: "#1A3A2C", // Darker green text color
            }}
          >
            <Image
              src={`data:image;base64,${coverPageData.logo}`}
              style={{
                height: 90,
                marginBottom: 5,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#4E4E0D", // Orange subtitle color
                marginTop: 25,
              }}
            >
              {coverPageData.subtitle1}
            </Text>
            <Text
              style={{
                fontSize: 23,
                fontWeight: "bold",
                color: "#4E4E0D", // Orange subtitle color
              }}
            >
              {coverPageData.subtitle2}
            </Text>
          </View>

          <View
            style={{
              textAlign: "center",
              paddingHorizontal: 10,
            }}
          >
            <Image
              src={`data:image;base64,${coverPageData.coverImg}`} // Replace with actual image path
              style={{
                height: 150,
                objectFit: "cover",
              }}
            />
          </View>

          <Text
            style={{
              textAlign: "center",
              marginTop: 5,
              fontSize: 23,
              fontWeight: "bold",
              color: "#4E4E0D",
            }}
          >
            {coverPageData.effectiveDate}
          </Text>

          <View
            style={{
              textAlign: "center",
              marginTop: 25,
            }}
          >
            <Text
              style={{ fontSize: 16, fontWeight: "bold", color: "#4E4E0D" }}
            >
              Prepared by:
            </Text>
            <Text style={{ marginTop: 15, color: "#4E4E0D" }}>
              {coverPageData.preparedByName}
            </Text>
            <Text style={{ color: "#4E4E0D" }}>
              {coverPageData.preparedByPhone}
            </Text>
            <Text style={{ color: "#4E4E0D" }}>
              {coverPageData.preparedByEmail}
            </Text>
          </View>

          <View
            style={{
              textAlign: "center",
              marginTop: 5,
              fontSize: 10,
              color: "#1A3A2C", // Darker green text color
            }}
          >
            <Text
              style={{
                marginTop: 10,
                fontSize: 16,
                fontWeight: "bold",
                color: "#4E4E0D",
              }}
            >
              {coverPageData.phone1} - {coverPageData.phone2} -
              Fax: {coverPageData.fax}
            </Text>
          </View>
        </View>
      </View>
    </Page>
  );
};




