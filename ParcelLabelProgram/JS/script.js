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
    tableBody.innerHTML = "";
  
    for (const key in data) {
      if (key === "Barcode") {
        const row = tableBody.insertRow();
        const cell1 = row.insertCell(0);
        const barcodeSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        JsBarcode(barcodeSVG, data[key], {
          format: "CODE128",
          displayValue: true,
          width: 2,
          height: 100
        });
        cell1.appendChild(barcodeSVG);
  
        // Add LOT and MFG in the first cell, EXP in the second cell
        const mfgLotRow = tableBody.insertRow();
        const lotMfgCell = mfgLotRow.insertCell(0);
        const expCell = mfgLotRow.insertCell(1);
        let lotMfgContent = "";
  
        if (data["LOT"]) {
          lotMfgContent += "LOT: <span style='display: inline-block; width: 100px;'>" + data["LOT"] + "</span>";
        }
        if (data["MFG"]) {
          lotMfgContent += " MFG: <span style='display: inline-block; width: 100px;'>" + data["MFG"] + "</span>";
        }
        if (data["EXP"]) {
          expCell.innerHTML = " EXP: <span style='display: inline-block; width: 100px;'>" + data["EXP"] + "</span>";
        }
  
        lotMfgCell.innerHTML = lotMfgContent;
      } else {
        const row = tableBody.insertRow();
        const cell1 = row.insertCell(0);
        cell1.innerHTML = key + " " + data[key];
      }
    }
  }
  
  $(document).ready(function() {
    $('#productNameEngA').selectize({
      create: true, // Allow creation of new options
      sortField: 'text' // Sort options alphabetically
    });
    $('#productNameB').selectize({
      create: true, // Allow creation of new options
      sortField: 'text' // Sort options alphabetically
    });
  });