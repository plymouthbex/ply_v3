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
      Item#
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
      Frs/Frz
    </Text>
    <Text
      style={{
        width: isPrice? "34%" : "55%",
        fontSize: 10,
        textAlign: "center",
        alignSelf: "center",
      }}
    >
      Description
    </Text>
    <Text
      style={{
        width: "12%",
        fontSize: 10,
        textAlign: "center",
        alignSelf: "center",
      }}
    >
      Pack Size
    </Text>
    <Text
      style={{
        width: "10%",
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
          LWP
        </Text>
        <Text
          style={{
            width: "7%",
            fontSize: 10,
            textAlign: "center",
            alignSelf: "center",
          }}
        >
          TWP
        </Text>
        <Text
          style={{
            width: "7%",
            fontSize: 10,
            textAlign: "center",
            alignSelf: "center",
          }}
        >
          Diff.
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
          textAlign: "left",
          paddingLeft: 2,
          paddingTop: 5,
          width: "7%",
          borderRight: "1px solid black",
          borderLeft: "1px solid black",
        }}
      >
        {item.ppcItem}
      </Text>
      <Text
        style={{
          fontSize: 9,
          textAlign: "left",
          paddingLeft: 2,
          paddingTop: 5,
          paddingRight: 2,
          width: "6%",
          borderRight: "1px solid black",
        }}
      >
        {item.preOrde === "Y" ? "Yes" : "No" }
      </Text>
      <Text
        style={{
          fontSize: 9,
          textAlign: "left",
          paddingLeft: 2,
          paddingTop: 5,
          width: "6%",
          borderRight: "1px solid black",
        }}
      >
        {item.fresh}
      </Text>
      <Text
        style={{
          fontSize: 9,
          textAlign: "left",
          paddingTop: 5,
          paddingLeft: 2,
          paddingRight: 2,
          width: isPrice? "34%" : "55%",
          borderRight: "1px solid black",
        }}
      >
        {item.description}
      </Text>
      <Text
        style={{
          fontSize: 9,
          textAlign: "left",
          paddingLeft: 2,
          paddingTop: 5,
          width: "12%",
          borderRight: "1px solid black",
        }}
      >
        {item.packSize}
      </Text>
      <Text
        style={{
          fontSize: 9,
          textAlign: "left",
          paddingLeft: 2,
          paddingTop: 5,
          width: "10%",
          borderRight: "1px solid black",
        }}
      >
        {item.brand}
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
            {item.lastWeekPrice}
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
            {item.price}
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
            {item.changeVsLastWeek}
          </Text>
        </>
      ) : (
        false
      )}
      <Text
        style={{
          fontSize: 9,
          textAlign: "left",
          paddingLeft: 2,
          paddingTop: 5,
          width: "4%",
          borderRight: "1px solid black",
        }}
      >
        {item.um}
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
  <Page orientation="portrait" size="A4" style={{ padding: 20 }}>
    <PrimaryHeader headerData={headerData} category={category} />

    <View style={{ flexGrow: 1 }}>
      {/* <TableHeader isPrice={isPrice} />
      <TableRows items={items} isPrice={isPrice} /> */}

      {items.length > 0 ? (
        items.map((items2, index) => (
          <React.Fragment key={index}>
            {items2.printGroup && (
              <Text style={[styles.header, { fontSize: 14, padding: 10 }]}>
                {items2.printGroup}
              </Text>
            )}
            <TableHeader isPrice={isPrice} />
            <TableRows items={items2.items || []} isPrice={isPrice} />{" "}
            {/* Safeguard added */}
          </React.Fragment>
        ))
      ) : (
        <Text style={{ textAlign: "center", fontSize: 12, marginTop: 20 }}>
          No items available for this page.
        </Text>
      )}
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
        style={{ textAlign: "center", fontSize: 10, color: "#555", }}
      >LWP - Last Week Price</Text>
      <Text
        style={{
          textAlign: "center",
          fontSize: 10,
          color: "#555",
        }}
      >
        TWP - This Week Price
      </Text>
      <Text style={{ textAlign: "center", fontSize: 10, color: "#555" }}>
       Diff -  Change vs. Last Week
      </Text>
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

export const CustomerCustomPriceDocument = ({
  data = [], // Default to empty array
  headerData,
  isPrice,
  coverPageData,
  onRenderFinish,
  onError,
}) => {
  const pages = [];
  const tableContent = [];

  const pageHeight = 1123;
  const headerFooterHeight = 140;
  const printGroupCaption = 40;
  const priceListCaption = 60;
  const tableHeaderHeight = 50;
  const rowHeight = 30;

  let currentPageIndex = 1;
  let remainingHeight = pageHeight - headerFooterHeight - 30; // Initial space for items
  let currentPageItems = [];
  let currentPageTableItems = [];
  let currentPrintGroup = null;
  let currentPrintGroupTable = null;
  let currentPriceList = "0";

  data.forEach((item) => {
    const isNewPriceList = currentPriceList !== item.printGroup;
    // const isNewPrintGroup = currentPrintGroupTable !== item.printGroupSeq;
    const isSpaceInsufficient =
      remainingHeight <
      (isNewPriceList
        ? priceListCaption + tableHeaderHeight + rowHeight
        : rowHeight);

    // If a new priceList starts or there is no space left, finalize the current group
    if (
      isSpaceInsufficient ||
      (isNewPriceList && currentPageTableItems.length > 0)
    ) {
      if (currentPageTableItems.length > 0) {
        currentPageItems.push({
          printGroup:
            isSpaceInsufficient || isNewPriceList ? currentPriceList : null,
          items: currentPageTableItems,
        });

        currentPageTableItems = [];
        remainingHeight -= priceListCaption + tableHeaderHeight; // Reset for next list
        currentPriceList = item.printGroup;
      }

      // Add page if space runs out
      if (remainingHeight < rowHeight) {
        pages.push({
          pageIndex: currentPageIndex,
          items: currentPageItems,
        });
        currentPageItems = [];
        currentPageIndex++;
        remainingHeight = pageHeight - headerFooterHeight - 30;
      }
    }

    // Grouping logic
    if (isNewPriceList) {
      currentPriceList = item.printGroup;
      if (currentPrintGroup !== item.printGroupSeq) {
        tableContent.push({
          ProdCateName: item.printGroup,
          pageNumber: currentPageIndex,
        });
      }
    }

    currentPrintGroup = item.printGroupSeq;
    currentPageTableItems.push(item);
    remainingHeight -= rowHeight;
  });

  // Add any remaining items and pages
  if (currentPageTableItems.length > 0) {
    currentPageItems.push({
      printGroup: currentPriceList,
      items: currentPageTableItems,
    });
  }
  if (currentPageItems.length > 0) {
    pages.push({
      pageIndex: currentPageIndex,
      items: currentPageItems,
      printGroup: currentPriceList,
    });
  }

  // Confirm the structure of the pages array
  console.log("Pages array:", pages);

  return (
    <Document onRender={onRenderFinish} onError={onError}>
      <CoverPage coverPageData={coverPageData} />
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


