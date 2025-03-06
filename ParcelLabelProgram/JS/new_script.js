
const productData = {
    companyA: {
      product1A: {
        productNameThA: "ยาแก้ปวดหัว",
        barcodeA: "*1234567890*",
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
      product3A: {
        productNameThA: "ยาแก้ท้องเสีย",
        barcodeA: "*5646149923*",
        mfgA: "18-03-27",
        lotA: "2066805",
        expA: "24-04-29",
        unitA: "36x10x80cc",
      },
    },
    companyB: {
      product1B: {
        productNameThB: "มะแว้ง-เออีซี ไอยราแดง 7-11",
        barcodeB: "*8856513009380*",
        mfgB: "16-01-25",
        lotB: "2066803",
        expB: "22-02-27",
        unitB: "24x6x60cc",
      },
      product2B: {
        productNameThB: "ยาB",
        barcodeB: "*84612303448413*",
        mfgB: "17-02-26",
        lotB: "2066804",
        expB: "23-03-28",
        unitB: "30x8x70cc",
      },
      product3B: {
        productNameThB: "ยาC",
        barcodeB: "*56123186132*",
        mfgB: "18-03-27",
        lotB: "2066805",
        expB: "24-04-29",
        unitB: "36x10x80cc",
      },
    },
  };
  
  $(document).ready(function () {
    $('#productNameEngA').selectize();
    $('#productNameThA').selectize();
    $('#barcodeA').selectize();
    $('#mfgA').selectize();
    $('#lotA').selectize();
    $('#expA').selectize();
    $('#unitA').selectize();
    $('#productNameEngB').selectize();
    $('#productNameThB').selectize();
    $('#barcodeB').selectize();
    $('#mfgB').selectize();
    $('#lotB').selectize();
    $('#expB').selectize();
    $('#unitB').selectize();
  });
  
  function updateDropdown(company, selectedProductEng) {
    if (company === 'companyA') {
      const productInfo = productData.companyA[selectedProductEng];
      if (productInfo) {
        $('#productNameThA').val(productInfo.productNameThA).trigger('change');
        $('#barcodeA').val(productInfo.barcodeA).trigger('change');
        $('#mfgA').val(productInfo.mfgA).trigger('change');
        $('#lotA').val(productInfo.lotA).trigger('change');
        $('#expA').val(productInfo.expA).trigger('change');
        $('#unitA').val(productInfo.unitA).trigger('change');
      } else {
        $('#productNameThA').val('').trigger('change');
        $('#barcodeA').val('').trigger('change');
        $('#mfgA').val('').trigger('change');
        $('#lotA').val('').trigger('change');
        $('#expA').val('').trigger('change');
        $('#unitA').val('').trigger('change');
      }
    } else if (company === 'companyB') {
      const productInfo = productData.companyB[selectedProductEng];
      if (productInfo) {
        $('#productNameThB').val(productInfo.productNameThB).trigger('change');
        $('#barcodeB').val(productInfo.barcodeB).trigger('change');
        $('#mfgB').val(productInfo.mfgB).trigger('change');
        $('#lotB').val(productInfo.lotB).trigger('change');
        $('#expB').val(productInfo.expB).trigger('change');
        $('#unitB').val(productInfo.unitB).trigger('change');
      } else {
        $('#productNameThB').val('').trigger('change');
        $('#barcodeB').val('').trigger('change');
        $('#mfgB').val('').trigger('change');
        $('#lotB').val('').trigger('change');
        $('#expB').val('').trigger('change');
        $('#unitB').val('').trigger('change');
      }
    }
  }
  
  function getDropdownText(dropdownId) {
    const selectElement = document.getElementById(dropdownId);
    return selectElement.options[selectElement.selectedIndex].text;
  }
  
  
  function getCurrentFormData(company) {
    let data = {};
    if (company === 'companyA') {
      data = {
        "Company_Name": document.getElementById('companyNameA').value,
        "General_Company_Name": "บริษัท ที.แมน ฟาร์มา จำกัด",
        "Product_Code": getDropdownText('productNameEngA'),
        "Product_Name_Eng": getDropdownText('productNameEngA'),
        "Product_Name_Thai": getDropdownText('productNameThA'),
        "Barcode": document.getElementById('barcodeA').value,
        "MFG": document.getElementById('mfgA').value,
        "LOT": document.getElementById('lotA').value,
        "EXP": document.getElementById('expA').value,
        "UNIT": document.getElementById('unitA').value
      };
    } else if (company === 'companyB') {
      data = {
        "Company_Name": document.getElementById('companyNameB').value,
        "General_Company_Name": "บริษัท ที.แมน ฟาร์มา จำกัด",
        "Product_Name": getDropdownText('productNameB'),
        "Product_Name_Thai": getDropdownText('productNameThB'),
        "Barcode": document.getElementById('barcodeB').value,
        "MFG": document.getElementById('mfgB').value,
        "LOT": document.getElementById('lotB').value,
        "EXP": document.getElementById('expB').value,
        "UNIT_QTY": document.getElementById('unitB').value
      };
    }
    return data;
  }
  
  
  function generateTable(company) {
    let data = getCurrentFormData(company);
    let tocTable = document.getElementById('tocTable');
    let tableBody = tocTable.querySelector('tbody');
    tableBody.innerHTML = '';
  
    if (company === 'companyA') {
      // Company A Table Generation (Preview Table)
      // 1. Company Name Row
      let companyNameRow = tableBody.insertRow();
      let companyNameCell = companyNameRow.insertCell(0);
      companyNameCell.colSpan = 2;
      companyNameCell.classList.add("company-name");
      companyNameCell.classList.add("company-name-a-main"); // Company A main name style
      companyNameCell.textContent = data["Company_Name"];
  
      // 2. General Company Name Row
      let generalCompanyNameRow = tableBody.insertRow();
      let generalCompanyNameCell = generalCompanyNameRow.insertCell(0);
      generalCompanyNameCell.colSpan = 2;
      generalCompanyNameCell.classList.add("general-company-name");
      generalCompanyNameCell.classList.add("general-company-name-a"); // Company A general name style
      generalCompanyNameCell.textContent = data["General_Company_Name"];
  
      // 3. Product Code Row
      let productCodeRow = tableBody.insertRow();
      productCodeRow.classList.add("product-code-row-a"); // Add class for Product Code row - Company A
      let productCodeCell = productCodeRow.insertCell(0);
      productCodeCell.colSpan = 2;
      productCodeCell.innerHTML = "PRODUCT CODE : <span class='product-value product-value-a'>" + data["Product_Code"] + "</span>"; //Company A product value style
  
  
      // --- COMBINED INFO CELL ROW ---
      let combinedInfoRow = tableBody.insertRow();
      let combinedInfoCell = combinedInfoRow.insertCell(0);
      combinedInfoCell.colSpan = 2;
      combinedInfoCell.classList.add("combined-info-cell-a"); // Add class for combined cell - Company A
  
      let combinedContent = "";
  
      // Product Name (Eng) - Add to combined content
      if (data["Product_Name_Eng"]) {
        combinedContent += "<div class='product-name-eng-in-cell'><span class='value-span'>" + data["Product_Name_Eng"] + "</span></div>";
      }
  
      // Product Name (Thai) - Add to combined content
      if (data["Product_Name_Thai"]) {
        combinedContent += "<div class='product-name-thai-in-cell'><span class='value-span'>" + data["Product_Name_Thai"] + "</span></div>";
      }
  
      // Barcode - Add to combined content (SVG for preview table - different ID)
      if (data["Barcode"]) {
        combinedContent += "<div class='barcode-in-cell'><svg id='barcodeSVG-preview-a'></svg></div>"; // Different SVG ID for preview
      }
  
      // MFG LOT Row - Add to combined content
      if (data["MFG"] || data["LOT"]) {
        let mfgLotContent = "<div class='mfg-lot-in-cell'>";
        if (data["MFG"]) {
          mfgLotContent += "MFG:<span class='value-span'>" + data["MFG"] + "</span>&nbsp;&nbsp;";
        }
        if (data["LOT"]) {
          mfgLotContent += "LOT:<span class='value-span'>" + data["LOT"] + "</span>";
        }
        mfgLotContent += "</div>";
        combinedContent += mfgLotContent;
      }
  
      combinedInfoCell.innerHTML = combinedContent;
  
  
      // 6. UNIT Row
      if (data["UNIT"]) {
        let unitRow = tableBody.insertRow();
        let unitCell = unitRow.insertCell(0);
        unitCell.colSpan = 2;
        unitCell.classList.add("unit-cell-a");
        unitCell.textContent = "UNIT:" + data["UNIT"];
      }
  
  
      // Barcode Generation (for preview table - different SVG ID)
      if (data["Barcode"]) {
        JsBarcode("#barcodeSVG-preview-a", data["Barcode"], { // Target SVG for preview table
          format: "CODE128",
          displayValue: true,
          width: 1.5,
          height: 40,
        });
      }
  
  
    } else if (company === 'companyB') {
      // Company B Table Generation (remains unchanged)
      // ... (Company B table generation code - no changes needed) ...
      // 1. Company Name Row
      let companyNameRow = tableBody.insertRow();
      let companyNameCell = companyNameRow.insertCell(0);
      companyNameCell.colSpan = 2;
      companyNameCell.classList.add("company-name");
      companyNameCell.textContent = data["Company_Name"];
  
      // 2. General Company Name Row
      let generalCompanyNameRow = tableBody.insertRow();
      let generalCompanyNameCell = generalCompanyNameRow.insertCell(0);
      generalCompanyNameCell.colSpan = 2;
      generalCompanyNameCell.classList.add("general-company-name");
      generalCompanyNameCell.textContent = data["General_Company_Name"];
  
  
      // 3. Product Name Row (English)
      let productNameRow = tableBody.insertRow();
      let productNameCell = productNameRow.insertCell(0);
      productNameCell.classList.add("product-name"); // Keep class "product-name" for Product Name (Eng) row for Company B
      productNameCell.colSpan = 2;
      productNameCell.textContent = "Product Name : " + data["Product_Name"];
  
  
      // 4. Product Name Row (Thai)
      if (data["Product_Name_Thai"]) {
        let productNameThaiRow = tableBody.insertRow();
        let productNameThaiCell = productNameThaiRow.insertCell(0);
        productNameThaiCell.colSpan = 2;
        productNameThaiCell.classList.add("product-name-thai");
        productNameThaiCell.textContent = ": " + data["Product_Name_Thai"];
      }
  
  
      // 5. Barcode Row
      if (data["Barcode"]) {
        let barcodeRow = tableBody.insertRow();
        let barcodeCell = barcodeRow.insertCell(0);
        barcodeCell.colSpan = 2;
        barcodeCell.innerHTML = '<svg id="barcodeSVG-preview"></svg>'; // SVG for barcode (preview table)
        JsBarcode("#barcodeSVG-preview", data["Barcode"], {
          format: "CODE128",
          displayValue: true,
          width: 1.5,
          height: 40,
        });
      }
  
      // 6. MFG, LOT, EXP Row
      let mfgLotExpRow = tableBody.insertRow();
      let mfgLotExpCell1 = mfgLotExpRow.insertCell(0);
      mfgLotExpCell1.classList.add("mfg-lot-exp-cell");
      mfgLotExpCell1.style.textAlign = 'right'; // Right align for labels (MFG, LOT, EXP)
      mfgLotExpCell1.style.paddingRight = '5px';
      let mfgLotExpCell2 = mfgLotExpRow.insertCell(1);
      mfgLotExpCell2.classList.add("mfg-lot-exp-cell");
      mfgLotExpCell1.textContent = "MFG.LOT.EXP :";
      mfgLotExpCell2.textContent = [data["MFG"], data["LOT"], data["EXP"]].filter(Boolean).join('.'); // Filter out empty values and join with dots
  
      // 7. UNIT/QTY Row
      if (data["UNIT_QTY"]) { // Use UNIT_QTY for Company B
        let unitQtyRow = tableBody.insertRow();
        let unitQtyCell1 = unitQtyRow.insertCell(0);
        unitQtyCell1.classList.add("unit-qty-cell");
        unitQtyCell1.style.textAlign = 'right'; // Right align for label (UNIT/QTY)
        unitQtyCell1.style.paddingRight = '5px';
        let unitQtyCell2 = unitQtyRow.insertCell(1);
        unitQtyCell2.classList.add("unit-qty-cell");
        unitQtyCell1.textContent = "UNIT/QTY :";
        unitQtyCell2.textContent = data["UNIT_QTY"]; // Use UNIT_QTY for Company B
      }
    }
  }
  
  
  function printTable(company) {
    generateTableForPrint(company); // Generate the print-specific table
    let printCount = document.getElementById('printCountGeneral').value;
    let printContainer = document.getElementById('print-container');
    printContainer.innerHTML = ''; // Clear previous tables
  
    for (let i = 0; i < printCount; i++) {
      let tableToPrint = document.getElementById('tocTable-print').cloneNode(true); // Clone the print table
      printContainer.appendChild(tableToPrint); // Append cloned table to print container
      if (i < printCount - 1) {
        printContainer.innerHTML += '<div style="page-break-after: always;"></div>'; // Page break after each table except the last
      }
    }
    window.print();
  }
  
  
  function generateTableForPrint(company) {
    let tocTablePrint = document.createElement('table');
    tocTablePrint.id = 'tocTable-print';
    let tableBody = document.createElement('tbody');
    tocTablePrint.appendChild(tableBody);
  
    let data = getCurrentFormData(company);
  
    if (company === 'companyA') {
      // Company A Table Generation (Print Table -  `tocTable-print`)
      // 1. Company Name Row
      let companyNameRow = tableBody.insertRow();
      let companyNameCell = companyNameRow.insertCell(0);
      companyNameCell.colSpan = 2;
      companyNameCell.classList.add("company-name");
      companyNameCell.classList.add("company-name-a-main"); // Company A main name style
      companyNameCell.textContent = document.getElementById('companyNameA').value;
  
      // 2. General Company Name Row
      let generalCompanyNameRow = tableBody.insertRow();
      let generalCompanyNameCell = generalCompanyNameRow.insertCell(0);
      generalCompanyNameCell.colSpan = 2;
      generalCompanyNameCell.classList.add("general-company-name");
      generalCompanyNameCell.classList.add("general-company-name-a"); // Company A general name style
      generalCompanyNameCell.textContent = "บริษัท ที.แมน ฟาร์มา จำกัด";
  
      // 3. Product Code Row
      let productCodeRow = tableBody.insertRow();
      productCodeRow.classList.add("product-code-row-a"); // Add class for Product Code row - Company A
      let productCodeCell = productCodeRow.insertCell(0);
      productCodeCell.colSpan = 2;
      productCodeCell.innerHTML = "PRODUCT CODE : <span class='product-value product-value-a'>" + getDropdownText('productNameEngA') + "</span>"; //Company A product value style
  
  
      // --- COMBINED INFO CELL ROW ---
      let combinedInfoRow = tableBody.insertRow();
      let combinedInfoCell = combinedInfoRow.insertCell(0);
      combinedInfoCell.colSpan = 2;
      combinedInfoCell.classList.add("combined-info-cell-a"); // Add class for combined cell - Company A
  
      let combinedContent = "";
  
      // Product Name (Eng) - Add to combined content
      if (data["Product_Name_Eng"]) {
        combinedContent += "<div class='product-name-eng-in-cell'><span class='value-span'>" + getDropdownText('productNameEngA') + "</span></div>";
      }
  
      // Product Name (Thai) - Add to combined content
      if (data["Product_Name_Thai"]) {
        combinedContent += "<div class='product-name-thai-in-cell'><span class='value-span'>" + getDropdownText('productNameThA') + "</span></div>";
      }
  
      // Barcode - Add to combined content (SVG for print table - different ID)
      if (data["Barcode"]) {
        combinedContent += "<div class='barcode-in-cell'><svg id='barcodeSVG-print-a'></svg></div>"; // Different SVG ID for print
      }
  
      // MFG LOT Row - Add to combined content
      if (data["MFG"] || data["LOT"]) {
        let mfgLotContent = "<div class='mfg-lot-in-cell'>";
        if (data["MFG"]) {
          mfgLotContent += "MFG:<span class='value-span'>" + data["MFG"] + "</span>&nbsp;&nbsp;";
        }
        if (data["LOT"]) {
          mfgLotContent += "LOT:<span class='value-span'>" + data["LOT"] + "</span>";
        }
        mfgLotContent += "</div>";
        combinedContent += mfgLotContent;
      }
  
      combinedInfoCell.innerHTML = combinedContent;
  
  
      // 6. UNIT Row
      if (data["UNIT"]) {
        let unitRow = tableBody.insertRow();
        let unitCell = unitRow.insertCell(0);
        unitCell.colSpan = 2;
        unitCell.classList.add("unit-cell-a");
        unitCell.textContent = "UNIT:" + data["UNIT"];
      }
  
  
      // Barcode Generation (for print table - different SVG ID)
      if (data["Barcode"]) {
        JsBarcode("#barcodeSVG-print-a", data["Barcode"], { // Target SVG for print table
          format: "CODE128",
          displayValue: true,
          width: 1.5,
          height: 40,
        });
      }
  
  
    } else if (company === 'companyB') {
      // Company B Table Generation (remains unchanged)
      // ... (Company B print table generation code - no changes needed) ...
      // 1. Company Name Row
      let companyNameRow = tableBody.insertRow();
      let companyNameCell = companyNameRow.insertCell(0);
      companyNameCell.colSpan = 2;
      companyNameCell.classList.add("company-name");
      companyNameCell.textContent = data["Company_Name"];
  
      // 2. General Company Name Row
      let generalCompanyNameRow = tableBody.insertRow();
      let generalCompanyNameCell = generalCompanyNameRow.insertCell(0);
      generalCompanyNameCell.colSpan = 2;
      generalCompanyNameCell.classList.add("general-company-name");
      generalCompanyNameCell.textContent = data["General_Company_Name"];
  
  
      // 3. Product Name Row (English)
      let productNameRow = tableBody.insertRow();
      let productNameCell = productNameRow.insertCell(0);
      productNameCell.classList.add("product-name"); // Keep class "product-name" for Product Name (Eng) row for Company B
      productNameCell.colSpan = 2;
      productNameCell.textContent = "Product Name : " + data["Product_Name"];
  
  
      // 4. Product Name Row (Thai)
      if (data["Product_Name_Thai"]) {
        let productNameThaiRow = tableBody.insertRow();
        let productNameThaiCell = productNameThaiRow.insertCell(0);
        productNameThaiCell.colSpan = 2;
        productNameThaiCell.classList.add("product-name-thai");
        productNameThaiCell.textContent = ": " + data["Product_Name_Thai"];
      }
  
  
      // 5. Barcode Row
      if (data["Barcode"]) {
        let barcodeRow = tableBody.insertRow();
        let barcodeCell = barcodeRow.insertCell(0);
        barcodeCell.colSpan = 2;
        barcodeCell.innerHTML = '<svg id="barcodeSVG-print"></svg>'; // SVG for barcode (print table)
        JsBarcode("#barcodeSVG-print", data["Barcode"], {
          format: "CODE128",
          displayValue: true,
          width: 1.5,
          height: 40,
        });
      }
  
      // 6. MFG, LOT, EXP Row
      let mfgLotExpRow = tableBody.insertRow();
      let mfgLotExpCell1 = mfgLotExpRow.insertCell(0);
      mfgLotExpCell1.classList.add("mfg-lot-exp-cell");
      mfgLotExpCell1.style.textAlign = 'right'; // Right align for labels (MFG, LOT, EXP)
      mfgLotExpCell1.style.paddingRight = '5px';
      let mfgLotExpCell2 = mfgLotExpRow.insertCell(1);
      mfgLotExpCell2.classList.add("mfg-lot-exp-cell");
      mfgLotExpCell1.textContent = "MFG.LOT.EXP :";
      mfgLotExpCell2.textContent = [data["MFG"], data["LOT"], data["EXP"]].filter(Boolean).join('.'); // Filter out empty values and join with dots
  
      // 7. UNIT/QTY Row
      if (data["UNIT_QTY"]) { // Use UNIT_QTY for Company B
        let unitQtyRow = tableBody.insertRow();
        let unitQtyCell1 = unitQtyRow.insertCell(0);
        unitQtyCell1.classList.add("unit-qty-cell");
        unitQtyCell1.style.textAlign = 'right'; // Right align for label (UNIT/QTY)
        unitQtyCell1.style.paddingRight = '5px';
        let unitQtyCell2 = unitQtyRow.insertCell(1);
        unitQtyCell2.classList.add("unit-qty-cell");
        unitQtyCell1.textContent = "UNIT/QTY :";
        unitQtyCell2.textContent = data["UNIT_QTY"]; // Use UNIT_QTY for Company B
      }
    }
  
    return tocTablePrint; // Return the created table for print function
  }
  
  
  function printAllTables() {
    let printCount = parseInt(document.getElementById('printCountGeneral').value, 10) || 1;
    let printContainer = document.getElementById('print-container');
    printContainer.innerHTML = ''; // Clear previous tables
  
    const companies = ['companyA', 'companyB']; // Add company names here
    companies.forEach(company => {
      for (let i = 0; i < printCount; i++) {
        let tableToPrint = generateTableForPrint(company); // Generate print table for each company
        printContainer.appendChild(tableToPrint);
        if (!(company === companies[companies.length - 1] && i === printCount - 1)) { // Page break after each label set except the very last one
          printContainer.innerHTML += '<div style="page-break-after: always;"></div>'; // Page break after each table except the last of all tables
        }
      }
    });
    window.print();
  }
  

























































