import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import CoverPage from "./CoverPage";

const styles = StyleSheet.create({
  page: { padding: 20, position: "relative" },
  header: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: "center",
    fontWeight: "bold",
  },
  subHeader: { fontSize: 12, marginBottom: 10, textAlign: "center" },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#164D50",
    color: "#fff",
    height: 30,
  },
  tableRow: {
    flexDirection: "row",
    height: 20,
    borderBottom: "1px solid #ccc",
  },
  footer: {
    position: "absolute",
    bottom: 10,
    textAlign: "center",
    fontSize: 10,
    color: "#555",
  },
  pageNumber: {
    position: "absolute",
    bottom: 5,
    textAlign: "center",
    fontSize: 10,
  },
  textCenter: { textAlign: "center" },
});

const TableContent = ({ tableContent }) => (
  <Page
    style={{
      padding: 30,
      fontFamily: "Helvetica",
    }}
  >
    {/* Header */}
    <Text
      style={{
        fontSize: 24,
        textAlign: "center",
        marginBottom: 20,
        color: "#236b61",
      }}
    >
      Table of Contents
    </Text>

    {/* Table */}
    <View
      style={{
        display: "table",
        width: "100%",
      }}
    >
      {/* Table Header */}
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            width: "80%",
            borderStyle: "solid",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Product Category
          </Text>
        </View>
        <View
          style={{
            width: "20%",
            borderStyle: "solid",
            padding: 5,
            textAlign: "right",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Page</Text>
        </View>
      </View>

      {/* Table Rows */}
      {tableContent.map((item, index) => (
        <View style={{ flexDirection: "row" }} key={index}>
          <View
            style={{
              width: "80%",
              borderStyle: "solid",
              padding: 5,
            }}
          >
            <Text style={{ fontSize: 12 }}>{item.ProdCateName}</Text>
          </View>
          <View
            style={{
              width: "20%",
              borderStyle: "solid",
              padding: 5,
              textAlign: "right",
            }}
          >
            <Text style={{ fontSize: 12 }}>{item.pageNumber}</Text>
          </View>
        </View>
      ))}
    </View>
  </Page>
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
        width: "7%",
        fontSize: 10,
        textAlign: "center",
        alignSelf: "center",
        // borderRight: "1px solid black",
      }}
    >
      Item#
    </Text>
    <Text
      style={{
        width: "5%",
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
        width:  !isPrice ? "54%" : "42%",
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
        width: "14%",
        fontSize: 10,
        textAlign: "center",
        alignSelf: "center",
      }}
    >
      Brand
    </Text>
    {isPrice && (
      <Text
        style={{
          width: "9%",
          fontSize: 10,
          textAlign: "center",
          alignSelf: "center",
        }}
      >
        Price
      </Text>
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
          width: "6%",
          borderRight: "1px solid black",
          borderLeft: "1px solid black",
        }}
      >
        {item.preOrder === "Y" ? "Yes" : "No"}
      </Text>
      <Text
        style={{
          fontSize: 9,
          textAlign: "left",
          paddingLeft: 2,
          paddingTop: 5,
          paddingLeft: 2,
          width: "7%",
          borderRight: "1px solid black",
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
          paddingLeft: 2,
          width: "5%",
          borderRight: "1px solid black",
        }}
      >
        {item.fresh}
      </Text>
      <Text
        style={{
          fontSize: 9,
          textAlign: "left",
          paddingLeft: 2,
          paddingRight: 2,
          paddingTop: 5,
          width: !isPrice ? "54%" : "42%",
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
          width: "14%",
          borderRight: "1px solid black",
        }}
      >
        {item.brand}
      </Text>
      {isPrice && (
        <Text
          style={{
            fontSize: 9,
            textAlign: "right",
            paddingLeft: 2,
            paddingRight: 2,
            paddingTop: 5,
            width: "9%",
            borderRight: "1px solid black",
          }}
        >
          {item.price}
        </Text>
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
  items = [], // Default to an empty array
  category,
  printGroup,
  isPrice,
}) => (
  <Page orientation="portrait" size="A4" style={{ padding: 20 }}>
    <View style={{ flexGrow: 1 }}>
      {items.length > 0 ? (
        items.map((items2, index) => (
          <React.Fragment key={index}>
            {items2.printGroup && (
              <Text style={[styles.header, { fontSize: 14, padding: 5 }]}>
                {items2.printGroup}
              </Text>
            )}
            <Text style={[styles.header, { fontSize: 14, padding: 10 }]}>
              {items2.priceList}
               {/* ({items2.printGroup}) */}
            </Text>
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
        alignItems: "center",
      }}
    >
      <Text style={{ textAlign: "center", fontSize: 10, color: "#555" }} />
      <Text style={{ textAlign: "center", fontSize: 10, color: "#555" }}>
        Prices and availability are subject to change.
      </Text>
      <Text style={{ textAlign: "center", fontSize: 10, color: "#555" }}>
        Page {pageIndex + 1}
      </Text>
    </View>
  </Page>
);

export const CustomerFullPriceDocument = ({
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
  const headerFooterHeight = 100;
  const printGroupCaption = 30;
  const priceListCaption = 70;
  const tableHeaderHeight = 50;
  const rowHeight = 30;

  let currentPageIndex = 1;
  let remainingHeight = pageHeight - headerFooterHeight; // Initial space for items
  let currentPageItems = [];
  let currentPageTableItems = [];
  let currentPrintGroup = null;
  let currentPrintGroupTable = null;
  let currentPriceList = null;

  data.forEach((item) => {
    const isNewPriceList = currentPriceList !== item.priceList;
    
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
          printGroup: currentPrintGroupTable,
          priceList: currentPriceList,
          items: currentPageTableItems,
        });
            

        currentPageTableItems = [];
        remainingHeight -= priceListCaption + tableHeaderHeight; // Reset for next list

      }

      // Add page if space runs out
      if (remainingHeight  < rowHeight) {
        pages.push({
          pageIndex: currentPageIndex,
          items: currentPageItems,
        });
        currentPageItems = [];
        currentPageIndex++;
        remainingHeight = pageHeight - headerFooterHeight;
      }
    }


    if(isNewPriceList || isSpaceInsufficient){
      currentPrintGroupTable = item.printGroup;
    }

    // Grouping logic
    if (isNewPriceList) {
      currentPriceList = item.priceList;
      if (currentPrintGroup !== item.printGroupSeq) {
        remainingHeight -= printGroupCaption
        tableContent.push({
          ProdCateName: item.printGroup,
          pageNumber: currentPageIndex,
        });
      }
    }

    currentPrintGroup = item.printGroupSeq;
    // currentPrintGroupTable = item.printGroup;
    currentPageTableItems.push(item);
    remainingHeight -= rowHeight;
  });
 
  // Add any remaining items and pages
  if (currentPageTableItems.length > 0) {
    currentPageItems.push({
      priceList: currentPriceList,
      items: currentPageTableItems,
    });
  }
  if (currentPageItems.length > 0) {
    pages.push({
      pageIndex: currentPageIndex,
      items: currentPageItems,
    });
  }

  // Confirm the structure of the pages array
  console.log("Pages array:", pages);

  return (
    <Document onRender={onRenderFinish} onError={onError}>
      <CoverPage coverPageData={coverPageData} />
      <TableContent tableContent={tableContent} />
      {pages.map((page, index) => (
        <PriceListPage
          key={index}
          pageIndex={index}
          totalPages={pages.length}
          headerData={headerData}
          items={page.items || []} // Safeguard added
          category={page.category}
          printGroup={page.printGroup}
          isPrice={isPrice}
        />
      ))}
    </Document>
  );
};
