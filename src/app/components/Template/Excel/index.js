import * as XLSX from "xlsx";

export const exportToExcelFullPriceBook = ({ excelData, date }) => {
  const worksheetData = [];

  // Add column headers, including a "Category" column
  worksheetData.push([
    "Product Category",
    "Category",
    "Pre Order",
    "PPC item#",
    "Fresh or Frz",
    "Description",
    "Pack Size",
    "Brand",
    "Price",
    "UM",
  ]);

  // Add each item with its category
  excelData.forEach((category) => {
    category.Items.forEach((item) => {
      worksheetData.push([
        category.productCate,
        category.CateName,
        item["preOrder"],
        item["ppcItem"],
        item["description"],
        item["packSize"],
        item["brand"],
        item["price"],
        item["um"],
      ]);
    });
  });

  // Create worksheet and add it to workbook
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Price List`);

  // Export the workbook
  XLSX.writeFile(workbook, `Full Pice Book_${date}.xlsx`);
};

export const exportToExcelBuildViewPriceBook = ({
  excelData,
  date,
  customerName,
  isPrice,
}) => {
  const worksheetData = [];

  if (!isPrice) {
    worksheetData.push([
      "Category",
      "Item #",
      "Pre Order",
      "Fresh or Frz",
      "Description",
      "Pack Size",
      "Brand",
      "UM",
      "Comments",
    ]);

    // Add each item with its category
    excelData.forEach((category) => {
      category.Items.forEach((item) => {
        worksheetData.push([
          category.Category,
          item["ItemNo"],
          item["PreOrder"],
          item["FreshFrz"],
          item["Description"],
          item["PackSize"],
          item["Brand"],
          item["UM"],
          item["Comments"],
        ]);
      });
    });
  } else {
    worksheetData.push([
      "Category",
      "Item #",
      "Pre Order",
      "Fresh or Frz",
      "Description",
      "Pack Size",
      "Brand",
      "Last Week Price",
      "This Week Price",
      "Change vs. Last Week",
      "UM",
      "Comments",
    ]);

    // Add each item with its category
    excelData.forEach((category) => {
      category.Items.forEach((item) => {
        worksheetData.push([
          category.Category,
          item["ItemNo"],
          item["PreOrder"],
          item["FreshFrz"],
          item["Description"],
          item["PackSize"],
          item["Brand"],
          item["UM"],
          item["Comments"],
        ]);
      });
    });
  }

  // Create worksheet and add it to workbook
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Custom Price List`);

  // Export the workbook
  XLSX.writeFile(workbook, `${customerName}_CPB_${date}.xlsx`);
};

export const exportToExcelBuildCustomPriceBook = ({
  excelData,
  date,
  customerName,
  isPrice,
}) => {
  const worksheetData = [];

  if (isPrice) {
    worksheetData.push([
      "Category",
      "Item #",
      "Pre Order",
      "Fresh or Frz",
      "Description",
      "Pack Size",
      "Brand",
      "UM",
      "Comments",
    ]);

    // Add each item with its category
    excelData.forEach((category) => {
      category.Items.forEach((item) => {
        worksheetData.push([
          category.Category,
          item["Item #"],
          item["Pre Order"],
          item["Fresh or Frz"],
          item["Description"],
          item["Pack Size"],
          item["Brand"],
          item["UM"],
          item["Comments"],
        ]);
      });
    });
  } else {
    worksheetData.push([
      "Category",
      "Item #",
      "Pre Order",
      "Fresh or Frz",
      "Description",
      "Pack Size",
      "Brand",
      "Last Week Price",
      "This Week Price",
      "Change vs. Last Week",
      "UM",
      "Comments",
    ]);

    // Add each item with its category
    excelData.forEach((category) => {
      category.Items.forEach((item) => {
        worksheetData.push([
          category.Category,
          item["Item #"],
          item["Pre Order"],
          item["Fresh or Frz"],
          item["Description"],
          item["Pack Size"],
          item["Brand"],
          item["Last Week Price"],
          item["This Week Price"],
          item["Change vs. Last Week"],
          item["UM"],
          item["Comments"],
        ]);
      });
    });
  }

  // Create worksheet and add it to workbook
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Custom Price List`);

  // Export the workbook
  XLSX.writeFile(workbook, `${customerName}_CPB_${date}.xlsx`);
};


export const exportToExcelQuotePriceBook = ({
  excelData,
  date,
  customerName,
  isPrice,
}) => {
  const worksheetData = [];

  if (isPrice) {
    worksheetData.push([
      "Category",
      "Item #",
      "Pre Order",
      "Fresh or Frz",
      "Description",
      "Pack Size",
      "Brand",
      "UM",
      "Comments",
    ]);

    // Add each item with its category
    excelData.forEach((category) => {
      category.Items.forEach((item) => {
        worksheetData.push([
          category.Category,
          item["Item #"],
          item["Pre Order"],
          item["Fresh or Frz"],
          item["Description"],
          item["Pack Size"],
          item["Brand"],
          item["UM"],
          item["Comments"],
        ]);
      });
    });
  } else {
    worksheetData.push([
      "Category",
      "Item #",
      "Pre Order",
      "Fresh or Frz",
      "Description",
      "Pack Size",
      "Brand",
      "Last Week Price",
      "This Week Price",
      "Change vs. Last Week",
      "UM",
      "Comments",
    ]);

    // Add each item with its category
    excelData.forEach((category) => {
      category.Items.forEach((item) => {
        worksheetData.push([
          category.Category,
          item["Item #"],
          item["Pre Order"],
          item["Fresh or Frz"],
          item["Description"],
          item["Pack Size"],
          item["Brand"],
          item["Last Week Price"],
          item["This Week Price"],
          item["Change vs. Last Week"],
          item["UM"],
          item["Comments"],
        ]);
      });
    });
  }

  // Create worksheet and add it to workbook
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Custom Price List`);

  // Export the workbook
  XLSX.writeFile(workbook, `${customerName}_QUOTE_${date}.xlsx`);
};


export const exportToExcelBuildFullPriceBookBlob = ({
  excelData,
  fileName,
  isPrice,
}) => {
  const worksheetData = [];

  if (isPrice) {
    worksheetData.push([
      "Print Group",
      "Price List",
      "Pre Order",
      "Item #",
      "Description",
      "Pack Size",
      "Brand",
      "Price",
      "UM",
    ]);

    // Add each item with its category
    excelData.forEach((item) => {
      worksheetData.push([
        item["printGroup"],
        item["priceList"],
        item["preOrder"] === "Y" ? "Yes" : "No",
        item["ppcItem"],
        item["description"],
        item["packSize"],
        item["brand"],
        item["price"],
        item["um"],
      ]);
    });
  } else {
    worksheetData.push([
      "Print Group",
      "Price List",
      "Pre Order",
      "Item #",
      "Description",
      "Pack Size",
      "Brand",
      "UM",
    ]);

    excelData.forEach((item) => {
      worksheetData.push([
        item["printGroup"],
        item["priceList"],
        item["preOrder"] === "Y" ? "Yes" : "No",
        item["ppcItem"],
        item["description"],
        item["packSize"],
        item["brand"],
        item["um"],
      ]);
    });
  }

  // Create worksheet and workbook
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Full Price Book");

  // Write workbook to binary string
  const binaryData = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

  // Convert binary string to Blob
  const buffer = new ArrayBuffer(binaryData.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < binaryData.length; i++) {
    view[i] = binaryData.charCodeAt(i) & 0xFF;
  }

  const blob = new Blob([buffer], { type: 'application/octet-stream' });

  return blob; // Return Blob for further use
};

export const exportToExcelBuildCustomPriceBookBlob = ({
  excelData,
  date,
  customerName,
  isPrice,
}) => {
  const worksheetData = [];

  if (isPrice) {
    worksheetData.push([
      "Print Group",
      "Price List",
      "Item #",
      "Pre Order",
      "Fresh or Frz",
      "Description",
      "Pack Size",
      "Brand",
      "Last Week Price",
      "This Week Price",
      "Change vs. Last Week",
      "UM",
    ]);

    // Add each item with its category
    excelData.forEach((item) => {
      worksheetData.push([
        item["printGroup"],
        item["priceList"],
        item["ppcItem"],
        item["preOrder"] === "Y" ? "Yes" : "No",
        item["fresh"],
        item["description"],
        item["packSize"],
        item["brand"],
        item["lastWeekPrice"],
        item["price"],
        item["changeVsLastWeek"],
        item["um"],
      ]);
    });
  } else {
    worksheetData.push([
      "Print Group",
      "Price List",
      "Item #",
      "Pre Order",
      "Fresh or Frz",
      "Description",
      "Pack Size",
      "Brand",
      "UM",
    ]);

    excelData.forEach((item) => {
      worksheetData.push([
        item["printGroup"],
        item["priceList"],
        item["ppcItem"],
        item["preOrder"] === "Y" ? "Yes" : "No",
        item["fresh"],
        item["description"],
        item["packSize"],
        item["brand"],
        item["um"],
      ]);
    });
  }

  // Create worksheet and workbook
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Custom Price List`);

  // Write workbook to binary string
  const binaryData = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

  // Convert binary string to Blob
  const buffer = new ArrayBuffer(binaryData.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < binaryData.length; i++) {
    view[i] = binaryData.charCodeAt(i) & 0xFF;
  }

  const blob = new Blob([buffer], { type: 'application/octet-stream' });

  return blob; // Return Blob for further use
};



export const exportToExcelCustomPriceBook = ({
  excelData,
  fileName,
  isPrice,
}) => {
  const worksheetData = [];

  if (isPrice) {
    worksheetData.push([
      "Print Group",
      "Price List",
      "Item #",
      "Pre Order",
      "Fresh or Frz",
      "Description",
      "Pack Size",
      "Brand",
      "Last Week Price",
      "This Week Price",
      "Change vs. Last Week",
      "UM",
    ]);

    // Add each item with its category
    excelData.forEach((item) => {
      worksheetData.push([
        item["printGroup"],
        item["priceList"],
        item["ppcItem"],
        item["preOrder"] === "Y" ? "Yes" : "No",
        item["fresh"],
        item["description"],
        item["packSize"],
        item["brand"],
        item["lastWeekPrice"],
        item["price"],
        item["changeVsLastWeek"],
        item["um"],
      ]);
    });
  } else {
    worksheetData.push([
      "Print Group",
      "Price List",
      "Item #",
      "Pre Order",
      "Fresh or Frz",
      "Description",
      "Pack Size",
      "Brand",
      "UM",
    ]);

    excelData.forEach((item) => {
      worksheetData.push([
        item["printGroup"],
        item["priceList"],
        item["ppcItem"],
        item["preOrder"] === "Y" ? "Yes" : "No",
        item["fresh"],
        item["description"],
        item["packSize"],
        item["brand"],
        item["um"],
      ]);
    });
  }

  // Create worksheet and add it to workbook
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Custom Price List`);

  // Export the workbook
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};


export const exportToExcelFullPriceBookV1 = ({
  excelData,
  fileName,
  isPrice,
}) => {
  const worksheetData = [];

  if (isPrice) {
    worksheetData.push([
      "Print Group",
      "Price List",
      "Pre Order",
      "Item #",
      "Description",
      "Pack Size",
      "Brand",
      "Price",
      "UM",
    ]);

    // Add each item with its category
    excelData.forEach((item) => {
      worksheetData.push([
        item["printGroup"],
        item["priceList"],
        item["preOrder"] === "Y" ? "Yes" : "No",
        item["ppcItem"],
        item["description"],
        item["packSize"],
        item["brand"],
        item["price"],
        item["um"],
      ]);
    });
  } else {
    worksheetData.push([
      "Print Group",
      "Price List",
      "Pre Order",
      "Item #",
      "Description",
      "Pack Size",
      "Brand",
      "UM",
    ]);

    excelData.forEach((item) => {
      worksheetData.push([
        item["printGroup"],
        item["priceList"],
        item["preOrder"] === "Y" ? "Yes" : "No",
        item["ppcItem"],
        item["description"],
        item["packSize"],
        item["brand"],
        item["um"],
      ]);
    });
  }

  // Create worksheet and add it to workbook
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Custom Price Book`);

  // Export the workbook
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};