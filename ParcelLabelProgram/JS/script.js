function updateDropdown(company, productValue) {
  // Define the data for each product
  const productData = {
    'companyA': {
      'product1A': {
        'productNameThA': 'Product A (Thai)',
        'barcodeA': '1234567890',
        'mfgA': '16-01-25',
        'lotA': '2066803',
        'expA': '22-02-27',
        'unitA': '24x6x60cc'
      },
      'product2A': {
        'productNameThA': 'Product B (Thai)',
        'barcodeA': '9876543210',
        'mfgA': '17-02-26',
        'lotA': '2066804',
        'expA': '23-03-28',
        'unitA': '30x8x70cc'
      },
      'product3A': {
        'productNameThA': 'Product C (Thai)',
        'barcodeA': '111222333444',
        'mfgA': '18-03-27',
        'lotA': '2066805',
        'expA': '24-04-29',
        'unitA': '36x10x80cc'
      }
    },
    'companyB': {
      'product1B': {
        'productNameThB': 'มะแว้ง-เออีซี ไอยราแดง 7-11',
        'barcodeB': '8856513009380',
        'mfgB': '16-01-25',
        'lotB': '2066803',
        'expB': '22-02-27',
        'unitB': '24x6x60cc'
      },
      'product2B': {
        'productNameThB': 'Product B (Thai)',
        'barcodeB': '9876543210',
        'mfgB': '17-02-26',
        'lotB': '2066804',
        'expB': '23-03-28',
        'unitB': '30x8x70cc'
      },
      'product3B': {
        'productNameThB': 'Product C (Thai)',
        'barcodeB': '111222333444',
        'mfgB': '18-03-27',
        'lotB': '2066805',
        'expB': '24-04-29',
        'unitB': '36x10x80cc'
      }
    }
  };

  if (productData[company] && productData[company][productValue]) {
    const data = productData[company][productValue];
    for (const key in data) {
      document.getElementById(key).value = data[key];
    }
  }
}

function generateTable(company) {
  let data = {};
  let barcode = "";

  if (company === 'companyA') {
    data["Company Name"] = "บริษัท เอ็กซ์เพรสเมด จำกัด";
    data["Product Name (Eng)"] = document.getElementById("productNameEngA").value;
    data["Product Name (Thai)"] = document.getElementById("productNameThA").value;
    barcode = document.getElementById("barcodeA").value;
    data["Barcode"] = barcode;
    data["MFG"] = document.getElementById("mfgA").value;
    data["LOT"] = document.getElementById("lotA").value;
    data["EXP"] = document.getElementById("expA").value;
    data["Unit"] = document.getElementById("unitA").value;

  } else if (company === 'companyB') {
    data["Company Name"] = "Company B";
    data["PRODUCT CODE:"] = "";
    data["Product_Name_Eng:"] = document.getElementById("productNameB").value;
    data["Product_Name_Th :"] = document.getElementById("productNameThB").value;
    barcode = document.getElementById("barcodeB").value;
    data["Barcode"] = barcode;
    // Use separate keys for MFG, LOT and EXP
    data["MFG"] = document.getElementById("mfgB").value;
    data["LOT"] = document.getElementById("lotB").value;
    data["EXP"] = document.getElementById("expB").value;
    data["UNIT:"] = document.getElementById("unitB").value;
  }

  const tableBody = document.getElementById("tocTable").getElementsByTagName("tbody")[0];
  tableBody.innerHTML = ""; // Clear the table body

  // 1. Company Name Row
  if (data["Company Name"]) {
    let row = tableBody.insertRow();
    let cell1 = row.insertCell(0);
    cell1.innerHTML = "Company Name " + data["Company Name"];
  }

  // 2. Product Code Row (Company B only)
  if (company === 'companyB' && data["PRODUCT CODE:"] !== undefined) { // Check if PRODUCT CODE: exists for Company B
    let row = tableBody.insertRow();
    let cell1 = row.insertCell(0);
    cell1.innerHTML = "PRODUCT CODE: " + data["PRODUCT CODE:"];
  }

  // 3. Product Name (Eng) Row
  if (company === 'companyA' && data["Product Name (Eng)"]) {
    let row = tableBody.insertRow();
    let cell1 = row.insertCell(0);
    cell1.innerHTML = "Product Name (Eng) " + data["Product Name (Eng)"];
  } else if (company === 'companyB' && data["Product_Name_Eng:"]) {
    let row = tableBody.insertRow();
    let cell1 = row.insertCell(0);
    cell1.innerHTML = "Product_Name_Eng: " + data["Product_Name_Eng:"];
  }

  // 4. Product Name (Thai) Row
  if (company === 'companyA' && data["Product Name (Thai)"]) {
    let row = tableBody.insertRow();
    let cell1 = row.insertCell(0);
    cell1.innerHTML = "Product Name (Thai) " + data["Product Name (Thai)"];
  } else if (company === 'companyB' && data["Product_Name_Th :"]) {
    let row = tableBody.insertRow();
    let cell1 = row.insertCell(0);
    cell1.innerHTML = "Product_Name_Th : " + data["Product_Name_Th :"];
  }


  // 5. Barcode Row
  if (data["Barcode"]) {
    let barcodeRow = tableBody.insertRow(); // Create a row for the barcode
    let barcodeCell = barcodeRow.insertCell(0); // Insert cell in barcode row

    const barcodeSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    JsBarcode(barcodeSVG, data["Barcode"], {
      format: "CODE128",
      displayValue: true,
      width: 2,
      height: 100
    });
    barcodeCell.appendChild(barcodeSVG);


    // 6. MFG, LOT, EXP Row (inserted AFTER barcode row)
    let mfgLotExpRow = tableBody.insertRow(); // Create a NEW row for MFG/LOT/EXP
    let mfgLotExpCell = mfgLotExpRow.insertCell(0); // Insert a cell that spans the width

    let mfgLotExpContent = "";
    if (data["LOT"]) {
      mfgLotExpContent += "LOT: <span style='display: inline-block; width: 100px;'>" + data["LOT"] + "</span>";
    }
    if (data["MFG"]) {
      mfgLotExpContent += " MFG: <span style='display: inline-block; width: 100px;'>" + data["MFG"] + "</span>";
    }
    if (data["EXP"]) {
      mfgLotExpContent += " EXP: <span style='display: inline-block; width: 100px;'>" + data["EXP"] + "</span>";
    }
    mfgLotExpCell.innerHTML = mfgLotExpContent;
    // Optional: To make it visually span across the columns if needed, you can set cell attributes.
    // For example: mfgLotExpCell.colSpan = 2;  (if you had 2 columns in other rows)
  }

  // 7. Unit Row
  if (company === 'companyA' && data["Unit"]) {
    let row = tableBody.insertRow();
    let cell1 = row.insertCell(0);
    cell1.innerHTML = "Unit " + data["Unit"];
  } else if (company === 'companyB' && data["UNIT:"]) {
    let row = tableBody.insertRow();
    let cell1 = row.insertCell(0);
    cell1.innerHTML = "UNIT: " + data["UNIT:"];
  }
}


$(document).ready(function () {
  $('#productNameEngA').selectize({
    create: true, // Allow creation of new options
    sortField: 'text' // Sort options alphabetically
  });
  $('#productNameB').selectize({
    create: true, // Allow creation of new options
    sortField: 'text' // Sort options alphabetically
  });
});


function printTable() {
  window.print();
}