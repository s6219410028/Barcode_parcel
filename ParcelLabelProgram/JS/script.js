// Load productData from localStorage (if available) or use default data
let productData = JSON.parse(localStorage.getItem("productData")) || {
  companyA: {
    "Iyara AEC Syrup-Red 7-11": {
      productNameThA: "มะแว้ง-เออีซี ไอยราแดง 7-11",
      barcodeA: "*8856513009380*",
      mfgA: "16-01-25",
      lotA: "2066803",
      expA: "22-02-27",
      unitA: "24x6x60cc",
    },
    product2A: {
      productNameThA: "ยาแก้ไอ",
      barcodeA: "*654684641515*",
      mfgA: "17-02-26",
      lotA: "2066804",
      expA: "23-03-28",
      unitA: "30x8x70cc",
    },
  },
  companyB: {
    product1B: {
      productNameThB: "ยาแก้ปวดหัว",
      barcodeB: "*8856513009380*",
      mfgB: "16-01-25",
      lotB: "2066803",
      expB: "22-02-27",
      unitB: "24x6x60cc",
    },
  },
};

// Save the product data back to localStorage (so it persists after refresh)
localStorage.setItem("productData", JSON.stringify(productData));















window.onload = function () {
  document.querySelectorAll("p, td, span, div").forEach(element => {
    if (/[ก-๙]/.test(element.textContent)) {
      element.style.fontFamily = "Sarabun, CordiaUPC, sans-serif"; // Thai font
    } else {
      element.style.fontFamily = "Tahoma, Arial, sans-serif"; // English font
    }
  });
  // Load productData from localStorage
  let savedData = localStorage.getItem("productData");
  if (savedData) {
    productData = JSON.parse(savedData);
    console.log("Loaded productData from localStorage:", productData);
  }

  // Update both dropdowns with stored data
  updateProductDropdown("companyA");
  updateProductDropdown("companyB");
};



function updateDropdown(company, productNameEngValue) {
  console.log('updateDropdown called - Company:', company, 'Product (Eng) Value:', productNameEngValue);

  const companyData = productData[company];
  if (companyData && companyData[productNameEngValue]) {
    const data = companyData[productNameEngValue];
    console.log('Data found:', data);

    // Define suffix for dynamic field selection
    const suffix = company === 'companyA' ? 'A' : 'B';

    // Map correct keys
    document.getElementById('productNameTh' + suffix).value = data.productNameTh || '';
    document.getElementById('barcode' + suffix).value = data.barcode || '';
    document.getElementById('mfg' + suffix).value = data.mfg || '';
    document.getElementById('lot' + suffix).value = data.lot || '';
    document.getElementById('exp' + suffix).value = data.exp || '';
    document.getElementById('unit' + suffix).value = data.unit || '';

    console.log(`Updated fields for ${suffix}:`, {
      productNameTh: document.getElementById('productNameTh' + suffix).value,
      barcode: document.getElementById('barcode' + suffix).value,
      mfg: document.getElementById('mfg' + suffix).value,
      lot: document.getElementById('lot' + suffix).value,
      exp: document.getElementById('exp' + suffix).value,
      unit: document.getElementById('unit' + suffix).value
    });

  } else {
    console.log('No data found for product or company.');

    // Clear fields if no data found
    const suffix = company === 'companyA' ? 'A' : 'B';

    document.getElementById('productNameTh' + suffix).value = '';
    document.getElementById('barcode' + suffix).value = '';
    document.getElementById('mfg' + suffix).value = '';
    document.getElementById('lot' + suffix).value = '';
    document.getElementById('exp' + suffix).value = '';
    document.getElementById('unit' + suffix).value = '';

    console.log(`Cleared fields for ${suffix}`);
  }
}




// console.log('Data found for', productNameEngValue, ':', JSON.stringify(data, null, 2));
// console.log('Data found for', productNameTh, ':', JSON.stringify(data, null, 2));
// console.log('Data found for', barcode, ':', JSON.stringify(data, null, 2));
// console.log('Data found for', mfg, ':', JSON.stringify(data, null, 2));
// console.log('Data found for', lot, ':', JSON.stringify(data, null, 2));
// console.log('Data found for', exp, ':', JSON.stringify(data, null, 2));
// console.log('Data found for', unit, ':', JSON.stringify(data, null, 2));



function generateTableForPrint(company, container) {
  let data = {};
  let barcode = "";

  if (company === 'companyA') {
    // --- COMPANY A: IMAGE-LIKE FORMAT - TOP ROW "PRODUCT CODE:" FOR MANUAL INPUT ---
    data["Company Name"] = document.getElementById("companyNameA").value;
    data["Product Name"] = document.getElementById("productNameEngA").value; // Product_Name_ENG (still needed for Product_Name_ENG row)
    data["Product Name TH"] = document.getElementById("productNameThA").value;
    barcode = document.getElementById("barcodeA").value;
    data["Barcode"] = barcode;
    data["LOT"] = document.getElementById("lotA").value;
    data["MFG"] = document.getElementById("mfgA").value;
    data["บรรจุ"] = document.getElementById("unitA").value;


    const table = document.createElement('table');
    table.id = "tocTable-print";
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';
    table.style.marginTop = '20px';
    table.style.marginLeft = 'auto';
    table.style.marginRight = 'auto';
    table.style.marginBottom = '20px';
    table.style.border = '0px solid black';

    const tableBody = table.createTBody();

    // --- (No Company Name Row for Company A - as requested) ---


    // 1. Product Code Row - TOP ROW NOW JUST "PRODUCT CODE:" - FOR MANUAL INPUT
    let row = tableBody.insertRow();
    let cell1 = row.insertCell(0);
    cell1.innerHTML = "<h2> PRODUCT CODE : </h2>"; // H2 for PRODUCT CODE
    cell1.classList.add("product-code-row-a");
    cell1.style.border = '1px solid black';
    cell1.style.textAlign = 'left';
    cell1.style.paddingLeft = '70px';
    cell1.style.paddingTop = '20px';
    cell1.style.paddingBottom = '0px';

    cell1.colSpan = 2;

    // 2. Product_Name_ENG Row - SECOND ROW
    if (data["Product Name"]) {
      let row = tableBody.insertRow();
      let cell1 = row.insertCell(0);
      cell1.innerHTML = `<span style="font-size: 1.5rem; font-weight: bold;">Product_Name_Eng:</span>
      <span class='product-name-eng-a'>${data["Product Name"]}</span>`;
      cell1.classList.add("product-name-eng-row-a");
      cell1.style.textAlign = 'left';
      cell1.style.paddingLeft = '70px';
      cell1.style.borderLeft = '1px solid black';
      cell1.style.borderRight = '1px solid black';
      cell1.colSpan = 2;
      cell1.style.margin = '0px';
      padding = '0px';

    }

    // 3. Product Name Thai Row
    if (data["Product Name TH"]) {
      let row = tableBody.insertRow();
      let cell1 = row.insertCell(0);
      cell1.innerHTML = `<span style="font-size: 1.5rem; font-weight: bold;">Product_Name_Th : </span>
      <span  class='product-name-thai-a'>${data["Product Name TH"]}</span>`;
      cell1.classList.add("product-name-thai-row-a");
      cell1.style.textAlign = 'left';
      cell1.style.paddingLeft = '70px';
      cell1.style.borderLeft = '1px solid black';
      cell1.style.borderRight = '1px solid black';
      cell1.colSpan = 2;
      cell1.style.margin = '0px';
      padding = '0px';
    }

    // 4. Barcode Row
    if (data["Barcode"]) {
      let barcodeRow = tableBody.insertRow();
      let barcodeCell = barcodeRow.insertCell(0);

      const barcodeSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      let barcodeData = data["Barcode"];

      // Remove `*` from the start and end (to avoid double `*`)
      barcodeData = barcodeData.replace(/^\*|\*$/g, "");

      JsBarcode(barcodeSVG, barcodeData, {
        format: "CODE39",
        displayValue: true,
        width: 1.3,  // Increase width to make it less crowded
        height: 40
      });

      barcodeCell.appendChild(barcodeSVG);
      barcodeCell.colSpan = 2;
      barcodeCell.style.textAlign = 'center';
      barcodeCell.style.borderBottom = 'collapse';
      barcodeCell.style.borderLeft = '1px solid black';
      barcodeCell.style.borderRight = '1px solid black';
    }

    // 5. MFG LOT Row
    if (data["MFG"] || data["LOT"]) {
      let mfgLotRow = tableBody.insertRow();
      let mfgLotCell = mfgLotRow.insertCell(0);
      mfgLotCell.colSpan = 2;
      mfgLotCell.classList.add("mfg-lot-cell-a");
      mfgLotCell.style.borderLeft = "1px solid black";
      mfgLotCell.style.borderRight = "1px solid black";
      mfgLotCell.style.textAlign = "left";
      mfgLotCell.style.paddingLeft = "70px";

      mfgLotCell.innerHTML = `
    <div style="display: flex; justify-content: space-between; width: 80%;">
      <span class="mfg-value" style="font-size: 1.5rem; flex: 1; text-align: left;"><b>MFG:</b> <span class="value-span">${data["MFG"] || ""}</span></span>
      <span class="lot-value" style="font-size: 1.5rem; text-align: right;"><b>LOT:</b> <span class="value-span">${data["LOT"] || ""}</span></span>
    </div>
  `;
    }

    // 6. UNIT Row
    if (data["บรรจุ"]) {
      let unitRow = tableBody.insertRow();
      let unitCell = unitRow.insertCell(0);
      unitCell.colSpan = 2;
      unitCell.classList.add("unit-cell-a");
      unitCell.style.border = '1px solid black';
      unitCell.style.textAlign = 'left';
      unitCell.style.paddingLeft = '70px';

      unitCell.innerHTML = `
    <div>
      <span class="mfg-value" style="font-size: 1.5rem; flex: 1; text-align: left;">
        <b>UNIT:</b> <span class="value-span">${data["บรรจุ"]}</span>
      </span>
    </div>
  `;
    }


    table.appendChild(tableBody);
    container.appendChild(table);


  } else if (company === 'companyB') {
    // --- COMPANY B:  NO CHANGES IN THIS STEP - KEEP ORIGINAL FORMAT ---
    data["Company Name"] = document.getElementById("companyNameB").value;
    data["Product Name"] = document.getElementById("productNameB").value;
    data["Product Name TH"] = document.getElementById("productNameThB").value;
    barcode = document.getElementById("barcodeB").value;
    data["Barcode"] = barcode;
    data["LOT"] = document.getElementById("lotB").value;
    data["MFG"] = document.getElementById("mfgB").value;
    data["EXP"] = document.getElementById("expB").value;
    data["บรรจุ"] = document.getElementById("unitB").value;

    const table = document.createElement('table');
    table.id = "tocTable-print";
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';
    table.style.marginLeft = 'auto';
    table.style.marginRight = 'auto';
    table.style.marginBottom = '20px';

    const tableBody = table.createTBody();

    // 1. General Company Name (Move this part first)
    let generalCompanyNameRow = tableBody.insertRow();
    let generalCompanyNameCell = generalCompanyNameRow.insertCell(0);
    generalCompanyNameCell.innerHTML = "<h2 style='margin: 5px 0'>บริษัท ที.แมน ฟาร์มา จำกัด</h2>";
    generalCompanyNameCell.style.lineHeight = '1.2'; // Adjust line height for tighter spacing
    generalCompanyNameCell.classList.add("general-company-name");
    generalCompanyNameCell.style.textAlign = 'center';
    generalCompanyNameCell.colSpan = 2;
    generalCompanyNameCell.style.borderTop = '1px solid black';
    generalCompanyNameCell.style.borderLeft = '1px solid black';
    generalCompanyNameCell.style.borderRight = '1px solid black';
    generalCompanyNameCell.style.margin = '0px';

    // 2. Main Company Name Row (Move this part after)
    if (data["Company Name"]) {
      let row = tableBody.insertRow();
      let cell1 = row.insertCell(0);
      cell1.innerHTML = `<h2 style='margin: 5px 0'>${data["Company Name"]}</h2>`;
      cell1.classList.add("company-name");
      cell1.style.border = '1px solid black';
      cell1.style.textAlign = 'center';
      cell1.colSpan = 2;
      cell1.style.margin = '0px';
    }

    // 4. Product Name Row
    if (data["Product Name"]) {
      let row = tableBody.insertRow();
      let cell1 = row.insertCell(0);
      cell1.innerHTML = `<h2 style='margin: 5px 0'>${data["Product Name"]}</h2>`;
      cell1.classList.add("product-name");
      cell1.style.textAlign = 'center';
      cell1.colSpan = 2;
      cell1.style.borderRight = '1px solid black';
      cell1.style.borderLeft = '1px solid black';
      cell1.style.paddingTop = '10px';
    }

    // 6. Barcode Row
    if (data["Barcode"]) {
      let barcodeRow = tableBody.insertRow();
      let barcodeCell = barcodeRow.insertCell(0);

      const barcodeSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      let barcodeData = data["Barcode"];

      // Remove `*` from the start and end (to avoid double `*`)
      barcodeData = barcodeData.replace(/^\*|\*$/g, "");

      JsBarcode(barcodeSVG, barcodeData, {
        format: "CODE39",
        displayValue: true,
        width: 1.3,  // Increase width to make it less crowded
        height: 40
      });
      barcodeCell.appendChild(barcodeSVG);
      barcodeCell.colSpan = 2;
      barcodeCell.style.borderRight = '1px solid black';
      barcodeCell.style.borderLeft = '1px solid black';
      barcodeCell.style.textAlign = 'center';

      // 7. MFG, LOT, EXP Row - Below Barcode
      let mfgLotExpRow = tableBody.insertRow();
      let mfgLotExpCell = mfgLotExpRow.insertCell(0);
      mfgLotExpCell.colSpan = 2;
      mfgLotExpCell.classList.add("mfg-lot-exp-cell");
      mfgLotExpCell.style.borderRight = '1px solid black';
      mfgLotExpCell.style.borderLeft = '1px solid black';
      mfgLotExpCell.style.textAlign = 'center';
      mfgLotExpCell.style.paddingTop = '5px';
      mfgLotExpCell.style.margin = '5px';

      // Use a flexbox container to align LOT, MFG, and EXP in the same row
      mfgLotExpCell.innerHTML = `
  <div style="display: flex; justify-content: center; gap: 20px; font-weight: bold;">
    <span style="font-size: 1.5em;">LOT: <span class='value-span' style="font-size: 1em; font-weight: normal;">${data["LOT"] || ""}</span></span>
    <span style="font-size: 1.5em;">MFG: <span class='value-span' style="font-size: 1em; font-weight: normal;">${data["MFG"] || ""}</span></span>
    <span style="font-size: 1.5em;">EXP: <span class='value-span' style="font-size: 1em; font-weight: normal;">${data["EXP"] || ""}</span></span>
  </div>
`;



      // 8. Unit and QTY Row - Below MFG/LOT/EXP
      let unitQtyRow = tableBody.insertRow();
      let unitQtyCell = unitQtyRow.insertCell(0);
      unitQtyCell.colSpan = 2;
      unitQtyCell.classList.add("unit-qty-cell");
      unitQtyCell.style.border = '1px solid black';
      unitQtyCell.style.textAlign = 'center';

      let unitQtyContent = "";
      if (data["บรรจุ"]) {
        unitQtyContent += `<h2 style='margin: 5px 0'>บรรจุ : <span class='value-span'>${data["บรรจุ"]}</span></h2>`;
      }
      if (data["QTY"]) {
        unitQtyContent += `QTY: <span class='value-span'>${data["QTY"]}</span>`;
      }

      unitQtyCell.innerHTML = unitQtyContent;
    }

    table.appendChild(tableBody);
    container.appendChild(table);
    console.log('Table element generated:', table);
    console.log('Container element:', container);

  }
}


function printTable(company) {
  const printCount = parseInt(document.getElementById('printCountGeneral').value, 10);

  if (isNaN(printCount) || printCount < 1 || printCount > 3) {
    alert("Please enter a valid number of labels per page (1-3).");
    return;
  }

  let printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups for this website to print labels.');
    return;
  }

  const container = printWindow.document.createElement('div');
  // Generate tables based on print count
  for (let i = 0; i < printCount; i++) {
    generateTableForPrint(company, container);
  }
  printWindow.document.body.appendChild(container);

  // Add Print Button to the new window:
  const printButton = printWindow.document.createElement('button');
  printButton.textContent = 'Print Label'; // Button text
  printButton.onclick = () => { printWindow.print(); }; // Print action
  printButton.style.display = 'block';
  printButton.style.margin = '20px auto';
  printButton.style.padding = '10px 20px';
  printWindow.document.body.appendChild(printButton);


  // Add CSS to hide buttons in print view
  const printStyle = printWindow.document.createElement('style');
  printStyle.textContent = `
  @media print {
    button {
      display: none !important;
    }
  }
`;
  printWindow.document.head.appendChild(printStyle);


  printWindow.document.body.onload = () => {
    // printWindow.print(); // FOR NOW, COMMENT OUT AUTO-PRINT
    // printWindow.onafterprint = () => {
    //     printWindow.close();
    // };
  };
}


function printAllTables() {
  const printCount = parseInt(document.getElementById('printCountGeneral').value, 10); // Get general print count

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Popup blocker may be preventing the print window from opening. Please allow popups for this site.');
    return;
  }

  // Check if product is selected for either company BEFORE generating tables:
  const productASelected = document.getElementById('productNameEngA').value;
  const productBSelected = document.getElementById('productNameB').value;

  if (!productASelected && !productBSelected) {
    alert("Please select a product for at least one company before printing all labels.");
    printWindow.close(); // Close the empty print window
    return; // Stop further execution
  }


  const container = printWindow.document.createElement('div');
  if (productASelected) {
    const companyAContainer = printWindow.document.createElement('div');
    // companyAContainer.innerHTML = '<h2>Company A Label:</h2>'; // Add a heading
    // Generate tables for Company A based on print count
    for (let i = 0; i < printCount; i++) {
      generateTableForPrint('companyA', companyAContainer);
    }
    container.appendChild(companyAContainer);
  }
  if (productBSelected) {
    const companyBContainer = printWindow.document.createElement('div');
    // companyBContainer.innerHTML = '<h2>Company B Label:</h2>'; // Add a heading
    // Generate tables for Company B based on print count
    for (let i = 0; i < printCount; i++) {
      generateTableForPrint('companyB', companyBContainer);
    }
    container.appendChild(companyBContainer);
  }
  printWindow.document.body.appendChild(container);


  // Add Print Button to the new window for "Print All Labels":
  const printButton = printWindow.document.createElement('button');
  printButton.textContent = 'Print All Labels'; // Button text - more descriptive
  printButton.onclick = () => { printWindow.print(); }; // Print action
  printButton.style.display = 'block';
  printButton.style.margin = '20px auto';
  printButton.style.padding = '10px 20px';
  printWindow.document.body.appendChild(printButton);

  // Add CSS to hide buttons in print view
  const printStyle = printWindow.document.createElement('style');
  printStyle.textContent = `
  @media print {
    button {
      display: none !important;
    }
  }
`;
  printWindow.document.head.appendChild(printStyle);


  printWindow.document.body.onload = () => {
    // printWindow.print();  // FOR NOW, COMMENT OUT AUTO-PRINT
    // printWindow.onafterprint = () => {
    //     printWindow.close();
    // };
  };
}

function generateTable(company) {
  const printCount = parseInt(document.getElementById('printCountGeneral').value, 10); // Get the print count from the input
  const containerId = 'tocTable';
  const container = document.getElementById(containerId);

  // Clear previous table if it exists
  container.innerHTML = '';

  // Generate tables based on the print count
  for (let i = 0; i < printCount; i++) {
    const tableContainer = document.createElement('div'); // Create a div to hold each table
    generateTableForPrint(company, tableContainer);
    container.appendChild(tableContainer);
  }

  // Add margin to the container of the displayed tables
  container.style.display = 'flex';         // Use flexbox for layout
  container.style.flexDirection = 'column';  // Stack tables vertically
  container.style.gap = '20px';             // Add 20px gap between tables

}


$(document).ready(function () {
  // Initialize selectize on both product dropdowns
  const productSelectA = $('#productNameEngA').selectize({
    create: false,
    sortField: 'text'
  })[0].selectize;

  const productSelectB = $('#productNameB').selectize({
    create: false,
    sortField: 'text'
  })[0].selectize;

  // Function to refresh dropdowns after adding/removing products
  window.updateProductDropdown = function (company) {
    if (company === "companyA") {
      productSelectA.clearOptions();
      Object.keys(productData.companyA).forEach(product => {
        productSelectA.addOption({ value: product, text: product });
      });
      productSelectA.refreshOptions(false);
    } else if (company === "companyB") {
      productSelectB.clearOptions();
      Object.keys(productData.companyB).forEach(product => {
        productSelectB.addOption({ value: product, text: product });
      });
      productSelectB.refreshOptions(false);
    }
  };

  // Function to delete a product from dropdown and productData
  function deleteProduct(company) {
    let selectedProduct =
      company === "companyA"
        ? productSelectA.getValue()
        : productSelectB.getValue();

    if (!selectedProduct) {
      alert("Please select a product to delete!");
      return;
    }

    // Confirm deletion
    if (!confirm(`Are you sure you want to delete "${selectedProduct}" from ${company}?`)) {
      return;
    }

    // Remove product from productData
    delete productData[company][selectedProduct];

    // Remove product from dropdown
    if (company === "companyA") {
      productSelectA.removeOption(selectedProduct);
    } else if (company === "companyB") {
      productSelectB.removeOption(selectedProduct);
    }

    alert(`Product "${selectedProduct}" deleted successfully!`);
  }

  // Attach delete button event listeners
  $("#deleteProductA").on("click", function () {
    deleteProduct("companyA");
  });

  $("#deleteProductB").on("click", function () {
    deleteProduct("companyB");
  });
});

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("productModal");
  const openModalBtn = document.getElementById("openProductModal");
  const closeModalBtn = document.querySelector(".close");

  openModalBtn.addEventListener("click", () => modal.style.display = "block");
  closeModalBtn.addEventListener("click", () => modal.style.display = "none");

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});

// Renaming productData to avoid conflicts
let newProductData = {
  companyA: {},
  companyB: {},
};


function addNewProduct(company) {
  const modal = document.getElementById("productModal");
  let productEng = document.getElementById("newProductEng").value.trim();
  let productTh = document.getElementById("newProductTh").value.trim();
  let barcode = document.getElementById("newBarcode").value.trim();
  let mfg = document.getElementById("newMfg").value.trim();
  let lot = document.getElementById("newLot").value.trim();
  let exp = document.getElementById("newExp").value.trim();
  let unit = document.getElementById("newUnit").value.trim();

  if (!productEng || !productTh || !barcode || !mfg || !lot || !exp || !unit) {
    alert("Please fill all fields!");
    return;
  }

  // Ensure productData is initialized for the company
  if (!productData[company]) {
    productData[company] = {};
  }

  // Store the product data properly
  productData[company][productEng] = {
    productNameTh: productTh,
    barcode: barcode,
    mfg: mfg,
    lot: lot,
    exp: exp,
    unit: unit,
  };

  console.log(`Product added to ${company}:`, productData[company]);

  // Store the updated productData in localStorage to keep data after refresh
  localStorage.setItem("productData", JSON.stringify(productData));

  // Clear input fields
  document.getElementById("newProductEng").value = "";
  document.getElementById("newProductTh").value = "";
  document.getElementById("newBarcode").value = "";
  document.getElementById("newMfg").value = "";
  document.getElementById("newLot").value = "";
  document.getElementById("newExp").value = "";
  document.getElementById("newUnit").value = "";

  // Close modal after adding product
  modal.style.display = "none";

  alert(`Product added to ${company} successfully!`);

  // Update the dropdown after adding a new product
  updateProductDropdown(company);
}


function updateProductDropdown(company) {
  let dropdownId = company === "companyA" ? "#productNameEngA" : "#productNameB";
  let selectize = $(dropdownId)[0].selectize;

  // Clear the existing dropdown options
  selectize.clearOptions();

  // Add new options from productData
  Object.keys(productData[company]).forEach((product) => {
    selectize.addOption({ value: product, text: product });
  });

  // Refresh the dropdown
  selectize.refreshOptions();
}







//delete product function

function deleteProduct() {
  // Get selected products
  const companyAProduct = document.getElementById("productNameEngA").value;
  const companyBProduct = document.getElementById("productNameB").value;

  if (!companyAProduct && !companyBProduct) {
    alert("Please select a product to delete.");
    return;
  }

  let confirmDelete = confirm("Are you sure you want to delete this product?");
  if (!confirmDelete) return;

  // Delete from company A if selected
  if (companyAProduct && productData.companyA[companyAProduct]) {
    delete productData.companyA[companyAProduct];
    removeOptionFromDropdown("productNameEngA", companyAProduct);
  }

  // Delete from company B if selected
  if (companyBProduct && productData.companyB[companyBProduct]) {
    delete productData.companyB[companyBProduct];
    removeOptionFromDropdown("productNameB", companyBProduct);
  }

  alert("Product deleted successfully.");
}

// Helper function to remove option from dropdown
function removeOptionFromDropdown(selectId, productValue) {
  let selectElement = document.getElementById(selectId);
  for (let i = 0; i < selectElement.options.length; i++) {
    if (selectElement.options[i].value === productValue) {
      selectElement.remove(i);
      break;
    }
  }
}



