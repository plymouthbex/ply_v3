import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
import customData from "../../../../fake-db/db/JSON/custom-pricelist.json";
import CoverPage, { CoverPageLandscape } from "./CoverPage";
const styles = StyleSheet.create({
  page: {
    padding: 20,
    position: "relative",
  },
  header: {
    fontSize: 20,
    marginBottom: 5,
    textAlign: "center",
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#164D50",
    color: "#fff",
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 5,
  },
  altRow: {
    backgroundColor: "#f2f2f2",
  },
  itemWidth: { width: "10%", fontSize: 10, textAlign: "center" },
  itemWidths: { width: "5%", fontSize: 10, textAlign: "center" },
  itemDesc: { width: "20%", fontSize: 10, textAlign: "center" },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    color: "#555",
  },
  pageNumber: {
    position: "absolute",
    bottom: 5,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
  },
});

const PrimaryHeader = ({ headerData }) => (
  <View
    style={{
      display: "flex",
      textAlign: "center",
      justifyContent: "space-between",
      flexDirection: "row",
      width: "100%",
    }}
  >
    <Image
      src={`data:image;base64,${headerData.logo}`}
      style={{ height: 50 }}
    />
    <View style={{ width: "100%" }}>
      <Text
        style={{
          fontSize: 20,
          marginBottom: 5,
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        {headerData.customerName}
      </Text>
      <Text style={{ fontSize: 12, marginBottom: 10, textAlign: "center" }}>
        {headerData.effectiveDate}
      </Text>
    </View>
    <View>
      <Text
        style={{
          fontSize: 20,
          marginBottom: 5,
          textAlign: "center",
          fontWeight: "bold",
          width: 100,
        }}
      ></Text>
    </View>
  </View>
);

const TableHeader = ({ isPrice }) => (
  <View
    style={{
      flexDirection: "row",
      backgroundColor: "#164D50",
      color: "#ffff",
      fontWeight: "bold",
      height: 30,
      width: "100%",
    }}
  >
    <Text
      style={{
        width: "7%",
        fontSize: 10,
        textAlign: "center",
        alignSelf: "center",
      }}
    >
      Item #
    </Text>
    <Text
      style={{
        width: "6%",
        fontSize: 10,
        textAlign: "center",
        alignSelf: "center",
        // borderRight: "1px solid black",
      }}
    >
      Pre Order
    </Text>
    <Text
      style={{
        width: "6%",
        fontSize: 10,
        textAlign: "center",
        alignSelf: "center",
        // borderRight: "1px solid black",
      }}
    >
      Fresh or Frz
    </Text>
    <Text
      style={{
        width: "25%",
        fontSize: 10,
        textAlign: "center",
        alignSelf: "center",
      }}
    >
      Description
    </Text>
    <Text
      style={{
        width: "8%",
        fontSize: 10,
        textAlign: "center",
        alignSelf: "center",
      }}
    >
      Pack Size
    </Text>
    <Text
      style={{
        width: "8%",
        fontSize: 10,
        textAlign: "center",
        alignSelf: "center",
      }}
    >
      Brand
    </Text>
    {isPrice ? (
      <>
        <Text
          style={{
            width: "7%",
            fontSize: 10,
            textAlign: "center",
            alignSelf: "center",
          }}
        >
          Last Week Price
        </Text>
        <Text
          style={{
            width: "7%",
            fontSize: 10,
            textAlign: "center",
            alignSelf: "center",
          }}
        >
          This Week Price
        </Text>
        <Text
          style={{
            width: "7%",
            fontSize: 10,
            textAlign: "center",
            alignSelf: "center",
          }}
        >
          Change vs. Last Week
        </Text>
      </>
    ) : (
      false
    )}
    <Text
      style={{
        width: "4%",
        fontSize: 10,
        textAlign: "center",
        alignSelf: "center",
      }}
    >
      UM
    </Text>
    <Text
      style={{
        width: isPrice ? "15%" : "36%",
        fontSize: 10,
        textAlign: "center",
        alignSelf: "center",
      }}
    >
      Comments
    </Text>
  </View>
);

const TableRows = ({ items, isPrice }) =>
  items.map((item, i) => (
    <View
      key={i}
      style={{
        flexDirection: "row",

        height: 20,
        marginBottom: -1,
        width: "100%",
        borderBottom: "1px solid black",
      }}
    >
      <Text
        style={{
          fontSize: 9,
          textAlign: "center",
          paddingTop: 5,
          width: "7%",
          borderRight: "1px solid black",
          borderLeft: "1px solid black",
        }}
      >
        {item["Item #"]}
      </Text>
      <Text
        style={{
          fontSize: 9,
          textAlign: "center",
          paddingTop: 5,
          paddingLeft: 2,
          paddingRight: 2,
          width: "6%",
          borderRight: "1px solid black",
        }}
      >
        {item["Pre Order"]}
      </Text>
      <Text
        style={{
          fontSize: 9,
          textAlign: "center",
          paddingTop: 5,
          width: "6%",
          borderRight: "1px solid black",
        }}
      >
        {item["Fresh or Frz"]}
      </Text>
      <Text
        style={{
          fontSize: 9,
          textAlign: "left",
          paddingTop: 5,
          paddingLeft: 2,
          paddingRight: 2,
          width: "25%",
          borderRight: "1px solid black",
        }}
      >
        {item.Description}
      </Text>
      <Text
        style={{
          fontSize: 9,
          textAlign: "center",
          paddingTop: 5,
          width: "8%",
          borderRight: "1px solid black",
        }}
      >
        {item["Pack Size"]}
      </Text>
      <Text
        style={{
          fontSize: 9,
          textAlign: "center",
          paddingTop: 5,
          width: "8%",
          borderRight: "1px solid black",
        }}
      >
        {item.Brand}
      </Text>
      {isPrice ? (
        <>
          <Text
            style={{
              fontSize: 9,
              textAlign: "right",
              paddingTop: 5,
              paddingLeft: 2,
              paddingRight: 2,
              width: "7%",
              borderRight: "1px solid black",
            }}
          >
            {item["Last Week Price"]}
          </Text>
          <Text
            style={{
              fontSize: 9,
              textAlign: "right",
              paddingTop: 5,
              paddingLeft: 2,
              paddingRight: 2,
              width: "7%",
              borderRight: "1px solid black",
            }}
          >
            {item["This Week Price"]}
          </Text>
          <Text
            style={{
              fontSize: 9,
              textAlign: "right",
              paddingTop: 5,
              paddingLeft: 2,
              paddingRight: 2,
              width: "7%",
              borderRight: "1px solid black",
            }}
          >
            {item["Change vs. Last Week"]}
          </Text>
        </>
      ) : (
        false
      )}
      <Text
        style={{
          fontSize: 9,
          textAlign: "center",
          paddingTop: 5,
          width: "4%",
          borderRight: "1px solid black",
        }}
      >
        {item.UM}
      </Text>
      <Text
        style={{
          fontSize: 9,
          textAlign: "left",
          paddingTop: 5,
          paddingLeft: 2,
          paddingRight: 2,
          width: isPrice ? "15%" : "36%",
          borderRight: "1px solid black",
        }}
      >
        {item.Comments}
      </Text>
    </View>
  ));

const PriceListPage = ({
  pageIndex,
  totalPages,
  headerData,
  items,
  category,
  isPrice,
}) => (
  <Page orientation="landscape" size="A4" style={{ padding: 20 }}>
    <PrimaryHeader headerData={headerData} category={category} />
    <Text style={[styles.header, { marginBottom: 5, fontSize: 14 }]}>
      {category}
    </Text>{" "}
    {/* Display category name */}
    <View style={{ flexGrow: 1 }}>
      <TableHeader isPrice={isPrice} />
      <TableRows items={items} isPrice={isPrice} />
    </View>
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        height: 20,
        padding: 3,
        alignItems: "center",
      }}
    >
      <Text
        style={{ textAlign: "center", fontSize: 10, color: "#555", width: 30 }}
      ></Text>
      <Text
        style={{
          textAlign: "center",
          fontSize: 10,
          color: "#555",
        }}
      >
        Prices and availability are subject to change.
      </Text>
      <Text style={{ textAlign: "center", fontSize: 10, color: "#555" }}>
        page {pageIndex + 1}
      </Text>
    </View>
  </Page>
);

export const QuotePriceListDocument = ({
  data,
  headerData,
  isPrice,
  coverPageData,
  onRenderFinish,
  onError,
}) => {
  const pages = [];
  let currentPageItems = [];
  let currentPageCategory = null;
  let currentRowCount = 0;
  let currentPageIndex = 0;
  const rowsPerPage = 22;

  data.forEach((categoryData) => {
    categoryData.Items.forEach((item) => {
      // Start a new page if the category changes or if the row limit is exceeded
      if (
        currentPageCategory &&
        currentPageCategory !== categoryData.Category
      ) {
        pages.push({
          pageIndex: currentPageIndex,
          category: currentPageCategory,
          items: currentPageItems,
        });
        currentPageItems = [];
        currentRowCount = 0;
        currentPageIndex++;
      }

      // Check if row limit is reached for the current page
      if (currentRowCount >= rowsPerPage) {
        pages.push({
          pageIndex: currentPageIndex,
          category: currentPageCategory,
          items: currentPageItems,
        });
        currentPageItems = [];
        currentRowCount = 0;
        currentPageIndex++;
      }

      // Add item to the current page
      currentPageItems.push(item);
      currentRowCount++;
      currentPageCategory = categoryData.Category;
    });
  });

  // Ensure the last page is added if it has items
  if (currentPageItems.length > 0) {
    pages.push({
      pageIndex: currentPageIndex,
      category: currentPageCategory,
      items: currentPageItems,
    });
  }

  return (
    <Document onRender={onRenderFinish} onError={onError}>
      <CoverPageLandscape coverPageData={coverPageData} />
      {pages.map((page, pageIndex) => (
        <PriceListPage
          isPrice={isPrice}
          key={pageIndex}
          pageIndex={pageIndex}
          totalPages={pages.length}
          headerData={headerData}
          items={page.items}
          category={page.category}
        />
      ))}
    </Document>
  );
};

const PDF = ({ items }) => (
  <PDFViewer width="100%" height="600">
    <QuotePriceListDocument headerData={items.headerData} data={customData} />
  </PDFViewer>
);

const invoiceData = {
  headerData: {
    Name: "Claus Meats",
    Date: "Effective 10/13/24 - 10/19/24",
  },
};

export default function QuotePriceList() {
  return (
    <div>
      <h1>Price Book PDF</h1>
      <PDF items={invoiceData} />
    </div>
  );
}
