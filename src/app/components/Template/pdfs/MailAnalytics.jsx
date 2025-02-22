import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 0,
    position: "relative",
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 12,
  },
  pageNumber: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 12,
  },
  tableHeader: {
    fontWeight: "bold",
    fontSize: 10,
    flexDirection: "column",
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
  },
  itemRow: {
    flexDirection: "row",
    borderBottom: "1px solid black",
  },
});

const PrimaryHeader = ({ headerData }) => {
  const current = new Date();
  var month = `${current.getMonth() + 1}`;
  if (month < 10) {
    month = "0" + month;
  }
  var Day = `${current.getDate()}`;
  if (Day < 10) {
    Day = "0" + Day;
  }
  const currentdate = `${month}-${Day}-${current.getFullYear()}`;

  return (
    <View style={{ height: 30 }}>
      <Text
        style={{
          textAlign: "right",
          fontSize: 10,
          fontFamily: "Helvetica-Bold",
          padding: 2,
        }}
      >
        Printed Date: {currentdate}
      </Text>
      <Text
        style={{
          textAlign: "center",
          fontSize: 12,
          fontFamily: "Helvetica-Bold",
          padding: 2,
        }}
      >
        {/* {headerData.companyName} */}
        Mail Analytics
      </Text>
    </View>
  );
};

const SubHeader = ({ headerData }) => {
  return (
    <View style={{}}>
      <Text
        style={{
          textAlign: "center",
          fontSize: 12,
          fontFamily: "Helvetica-Bold",
          padding: 2,
        }}
      >
        Product Vs Leather Price Summary
      </Text>
    </View>
  );
};

const AnalyticPage = ({
  items,
  pageIndex,
  totalPages,
  isLastPage,
  headerData,
}) => {
  return (
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View
        style={{
          border: "1px solid black",
          marginBottom: 25,
          marginLeft: 25,
          marginRight: 25,
          marginTop: 25,
          flexGrow: 1,
        }}
      >
        {/* Page Header */}
        {pageIndex == 0 && <PrimaryHeader headerData={headerData} />}

        {/* Sub Header */}

        {/* {<SubHeader headerData={headerData} />} */}

        {/* Render the items */}
        <View style={{ flexGrow: 1 }}>
          <View style={styles.tableHeader}>
            <View
              style={{
                flexDirection: "row",
                marginBottom: -1,
                height: 20,
                flexGrow: 1,
              }}
            >
              <Text
                style={{
                  width: "7%",
                  textAlign: "center",
                  fontFamily: "Helvetica-Bold",
                  borderRight: "1px solid black",
                  paddingTop: "5px",
                //   paddingLeft: "2px",
                }}
              >
                Date{" "}
              </Text>
              <Text
                style={{
                  width: "8%",
                  textAlign: "center",
                  fontFamily: "Helvetica-Bold",
                  borderRight: "1px solid black",
                  paddingTop: "5px",
                  paddingLeft: "2px",
                }}
              >
                Company
              </Text>
              <Text
                style={{
                  width: "10%",
                  textAlign: "center",
                  fontFamily: "Helvetica-Bold",
                  borderRight: "1px solid black",
                  paddingTop: "5px",
                  paddingLeft: "2px",
                }}
              >
                Sales Person
              </Text>
              <Text
                style={{
                  width: "15%",
                  textAlign: "center",
                  fontFamily: "Helvetica-Bold",
                  borderRight: "1px solid black",
                  paddingTop: "5px",
                  paddingLeft: "2px",
                }}
              >
                Customer Name
              </Text>
              <Text
                style={{
                  width: "15%",
                  textAlign: "center",
                  fontFamily: "Helvetica-Bold",
                  borderRight: "1px solid black",
                  paddingTop: "5px",
                }}
              >
                Contacts
              </Text>
              <Text
                style={{
                  width: "18%",
                  textAlign: "center",
                  fontFamily: "Helvetica-Bold",
                  borderRight: "1px solid black",
                  paddingTop: "5px",
                }}
              >
                Email
              </Text>
              <Text
                style={{
                  width: "18%",
                  textAlign: "center",
                  fontFamily: "Helvetica-Bold",
                  borderRight: "1px solid black",
                  paddingTop: "5px",
                }}
              >
                Price Book Type
              </Text>
              <Text
                style={{
                  width: "5%",
                  textAlign: "center",
                  fontFamily: "Helvetica-Bold",
                  borderRight: "1px solid black",
                  paddingTop: "5px",
                }}
              >
                Format
              </Text>
              <Text
                style={{
                  width: "5%",
                  textAlign: "center",
                  fontFamily: "Helvetica-Bold",
                  paddingTop: "5px",
                }}
              >
                Status
              </Text>
            </View>
          </View>
          {items.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                height: 15,
                marginBottom: -1,
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: "normal",
                  fontFamily: "Helvetica",
                  width: "7%",
                  textAlign: "center",
                  borderRight: "1px solid black",
                //   paddingLeft: "4",
                  padding: 2,
                }}
              >
                {item.CreatedDateTime}
              </Text>
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: "normal",
                  fontFamily: "Helvetica",
                  width: "8%",
                  textAlign: "left",
                  borderRight: "1px solid black",
                //   paddingLeft: "4",
                  padding: 2,
                }}
              >
                {item.CompanyName}
              </Text>

              <Text
                style={{
                  fontSize: 9,
                  fontWeight: "normal",
                  fontFamily: "Helvetica",
                  width: "10%",
                  textAlign: "left",
                  borderRight: "1px solid black",
                //   paddingLeft: "4",
                  padding: 2,
                }}
              >
                {item.SalesPerson}
              </Text>
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: "normal",
                  fontFamily: "Helvetica",
                  width: "15%",
                  textAlign: "left",
                  borderRight: "1px solid black",
                //   paddingLeft: "4",
                  padding: 2,
                }}
              >
                {item.CustomerName}
              </Text>
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: "normal",
                  fontFamily: "Helvetica",
                  width: "15%",
                  textAlign: "left",
                  borderRight: "1px solid black",
                  paddingLeft: "4",
                  padding: 2,
                }}
              >
                {item.Contact}
              </Text>
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: "normal",
                  fontFamily: "Helvetica",
                  width: "18%",
                  textAlign: "left",
                  borderRight: "1px solid black",
                  paddingRight: "2px",
                  padding: 2,
                }}
              >
                {item.Email}
              </Text>
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: "normal",
                  fontFamily: "Helvetica",
                  width: "18%",
                  textAlign: "left",
                  borderRight: "1px solid black",
                //   paddingRight: "2px",
                  padding: 2,
                }}
              >
              {item.PriceBookType}
              </Text>
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: "normal",
                  fontFamily: "Helvetica",
                  width: "5%",
                  textAlign: "left",
                  borderRight: "1px solid black",
                //   paddingRight: "2px",
                  padding: 2,
                }}
              >
                 {item.Excel && item.Pdf
                  ? "Both"
                  : item.Excel
                  ? "EXCEL"
                  : item.Pdf
                  ? "PDF"
                  : ""}
              </Text>
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: "normal",
                  fontFamily: "Helvetica",
                  width: "5%",
                  textAlign: "left",
                //   paddingRight: "2px",
                  padding: 2,
                }}
              >
                { item.Status === "S" ? "Success" : "Failure"}
              </Text>
            </View>
          ))}
            <View
              
              style={{
                flexDirection: "row",
                height: 20,
                marginBottom: -1,
                paddingTop: 1,
                flexGrow: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: "normal",
                  fontFamily: "Helvetica",
                  width: "7%",
                  textAlign: "center",
                  borderRight: "1px solid black",
                //   paddingLeft: "4",
                  padding: 2,
                }}
              >
              </Text>
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: "normal",
                  fontFamily: "Helvetica",
                  width: "8%",
                  textAlign: "left",
                  borderRight: "1px solid black",
                  paddingLeft: "4",
                  padding: 2,
                }}
              >
              </Text>

              <Text
                style={{
                  fontSize: 9,
                  fontWeight: "normal",
                  fontFamily: "Helvetica",
                  width: "10%",
                  textAlign: "left",
                  borderRight: "1px solid black",
                  paddingLeft: "4",
                  padding: 2,
                }}
              >
              </Text>
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: "normal",
                  fontFamily: "Helvetica",
                  width: "15%",
                  textAlign: "left",
                  borderRight: "1px solid black",
                  paddingLeft: "4",
                  padding: 2,
                }}
              >
              </Text>
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: "normal",
                  fontFamily: "Helvetica",
                  width: "15%",
                  textAlign: "left",
                  borderRight: "1px solid black",
                  paddingLeft: "4",
                  padding: 2,
                }}
              >
              </Text>
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: "normal",
                  fontFamily: "Helvetica",
                  width: "18%",
                  textAlign: "left",
                  borderRight: "1px solid black",
                  paddingRight: "2px",
                  padding: 2,
                }}
              >
              </Text>
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: "normal",
                  fontFamily: "Helvetica",
                  width: "18%",
                  textAlign: "left",
                  borderRight: "1px solid black",
                //   paddingRight: "2px",
                  padding: 2,
                }}
              >
              </Text>
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: "normal",
                  fontFamily: "Helvetica",
                  width: "5%",
                  textAlign: "left",
                  borderRight: "1px solid black",
                //   paddingRight: "2px",
                  padding: 2,
                }}
              >
                 
              </Text>
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: "normal",
                  fontFamily: "Helvetica",
                  width: "5%",
                  textAlign: "left",
                //   paddingRight: "2px",
                  padding: 2,
                }}
              >
              </Text>
            </View>
        
        </View>
      </View>
      {/* Page Number */}
      <Text style={styles.pageNumber}>
        Page {pageIndex + 1} of {totalPages}
      </Text>
    </Page>
  );
};

// Main Document Component
export const MailAnalyticsDocument = ({ items, headerData, footerData }) => {
  // Define how many items should fit per page
  const firstPageItems = 30;
  const itemsPerPage = 33; // For subsequent pages
  const totalItems = items.length;

  const pages = [];
  let pageIndex = 0;

  // Check if items are less than or equal to firstPageItems
  if (totalItems <= firstPageItems) {
    // Create a single page with all items
    pages.push(
      <AnalyticPage
        key={pageIndex}
        items={items}
        pageIndex={pageIndex}
        totalPages={1} // Only one page
        isLastPage={true}
        headerData={headerData} // It's the last page
      />
    );
  } else {
    // First page with 25 items
    const firstPage = items.slice(0, firstPageItems);
    pages.push(
      <AnalyticPage
        key={pageIndex}
        items={firstPage}
        pageIndex={pageIndex}
        totalPages={Math.ceil((totalItems - firstPageItems) / itemsPerPage) + 1}
        isLastPage={false} // Not the last page yet
        headerData={headerData}
      />
    );
    pageIndex++;

    // Pages with 30 items
    for (let i = firstPageItems; i < totalItems; i += itemsPerPage) {
      const slicedItems = items.slice(i, i + itemsPerPage);
      const isLastPage = i + itemsPerPage >= totalItems;

      pages.push(
        <AnalyticPage
          key={pageIndex}
          items={slicedItems}
          pageIndex={pageIndex}
          totalPages={
            Math.ceil((totalItems - firstPageItems) / itemsPerPage) + 1
          }
          isLastPage={isLastPage}
          headerData={headerData}
        />
      );
      pageIndex++;
    }
  }

  return <Document title="Price Summary">{pages}</Document>;
};

const items = Array(60) // Change this number to test
  .fill(0)
  .map((_, i) => ({
    RecordID: 81,
    TableID: 171,
    CompanyID: "PM",
    CompanyName: "Plymouth",
    UserID: "81",
    FirstName: "Admin",
    LastName: "",
    CustomerNumber: "",
    CustomerName: "",
    PriceBookType: "Wholesale Price Book",
    Excel: true,
    Pdf: true,
    Status: "E",
    EmailCount: 4,
    CreatedDateTime: "02/18/2025",
    Month: 2,
    Week: 8,
    WeekDayNumber: 3,
    WeekDayName: "Tuesday",
    CurrentYear: 2025,
    PreviousYear: 2024,
    SalesPerson: "",
    Contact: "",
    Email: "",
  }));
