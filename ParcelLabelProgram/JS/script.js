// ── Supabase Configuration ──
const supabaseUrl = "https://cqdhhmolqaqbalapevnw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxZGhobW9scWFxYmFsYXBldm53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NzA1NjcsImV4cCI6MjA1NzE0NjU2N30.aSGjO9lqWHN-BxJDhul6iN3yDZqkNeyG6k2q3vr5e0M"; // Replace with actual key
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

let productsData = []; // Global storage for fetched products

// ================= Fetch Products from Supabase =================
async function fetchProducts() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("company_id, product_name_eng, product_name_th, product_barcode, product_mfg, product_lot, product_exp, unit");

    if (error) throw error;

    console.log("Fetched Products:", data);
    productsData = data;

    // Populate dropdowns based on company_id:
    // Company A: CP ALL (company_id = 1)
    populateDropdown("companyA", data.filter(p => p.company_id === 1));
    // Company B: บริษัท เอ็กซ์เพรสเมด จำกัด (company_id = 2)
    populateDropdown("companyB", data.filter(p => p.company_id === 2));
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

// ================= Populate Dropdown for a Given Company =================
function populateDropdown(company, data) {
  const suffix = company.slice(-1).toUpperCase(); // 'A' or 'B'
  const dropdown = document.getElementById(`productNameEng${suffix}`);
  dropdown.innerHTML = "<option value=''>Select Product</option>";

  data.forEach(product => {
    // Use product_barcode as the option value
    dropdown.innerHTML += `<option value="${product.product_barcode}">${product.product_name_eng}</option>`;
  });
  console.log(`Dropdown ${dropdown.id} populated:`, dropdown.innerHTML);

  // Destroy previous selectize instance if exists
  if ($(dropdown).data('selectize')) {
    $(dropdown)[0].selectize.destroy();
  }
  // Initialize Selectize with an onChange callback that triggers updateDropdown
  $(dropdown).selectize({
    create: false,
    sortField: 'text',
    onChange: function (value) {
      if (value) {
        updateDropdown(company, value);
      } else {
        clearFields(company);
      }
    }
  });
}

// ================= Update Form Fields on Selection =================
function updateDropdown(company, barcode) {
  const product = productsData.find(p => p.product_barcode === barcode);
  if (!product) {
    console.warn("No matching product found for barcode:", barcode);
    clearFields(company);
    return;
  }
  const suffix = company.slice(-1).toUpperCase();
  document.getElementById(`productNameTh${suffix}`).value = product.product_name_th || "";
  document.getElementById(`barcode${suffix}`).value = product.product_barcode || "";
  document.getElementById(`mfg${suffix}`).value = product.product_mfg || "";
  document.getElementById(`lot${suffix}`).value = product.product_lot || "";
  // For Company A (CP ALL) we omit product_exp as requested
  if (company !== "companyA") {
    document.getElementById(`exp${suffix}`).value = product.product_exp || "";
  } else {
    document.getElementById(`exp${suffix}`).value = "";
  }
  document.getElementById(`unit${suffix}`).value = product.unit || "";
}

// ================= Clear Form Fields =================
function clearFields(company) {
  const suffix = company.slice(-1).toUpperCase();
  document.getElementById(`productNameTh${suffix}`).value = "";
  document.getElementById(`barcode${suffix}`).value = "";
  document.getElementById(`mfg${suffix}`).value = "";
  document.getElementById(`lot${suffix}`).value = "";
  document.getElementById(`exp${suffix}`).value = "";
  document.getElementById(`unit${suffix}`).value = "";
}

// ================= Generate Printable Table for a Label =================
function generateTableForPrint(company, container) {
  const suffix = company.slice(-1).toUpperCase(); // "A" or "B"

  // Get the dropdown element and selected barcode
  const dropdown = document.getElementById(`productNameEng${suffix}`);
  const selectedBarcode = dropdown.value;
  // Find the product in our global productsData by matching barcode
  const product = productsData.find(p => p.product_barcode === selectedBarcode);

  // Determine the display name: for Company B, we'll use product_name_eng if available; otherwise, product_name_th.
  let displayName = "";
  if (product) {
    displayName = product.product_name_eng || product.product_name_th || "";
  }

  // Get the values from the auto-filled fields.
  let barcode = document.getElementById(`barcode${suffix}`).value;
  let mfg = document.getElementById(`mfg${suffix}`).value;
  let lot = document.getElementById(`lot${suffix}`).value;
  let unit = document.getElementById(`unit${suffix}`).value;
  let exp = "";
  if (company === "companyB" && product) {
    exp = product.product_exp || "";
  }

  // Create the table element.
  const table = document.createElement('table');
  table.style.borderCollapse = 'collapse';
  table.style.width = '90%';
  table.style.margin = '20px auto';
  table.style.border = '1px solid black';
  const tableBody = table.createTBody();

  if (company === "companyA") {
    // Company A: header is "PRODUCT CODE :"
    let row = tableBody.insertRow();
    let cell = row.insertCell(0);
    cell.innerHTML = `<h2>PRODUCT CODE :</h2>`;
    cell.style.textAlign = 'left';
    cell.colSpan = 2;
    cell.style.borderBottom = '1px solid black';
  } else if (company === "companyB") {
    // Company B: two header rows
    let row = tableBody.insertRow();
    let cell = row.insertCell(0);
    cell.innerHTML = `<h2>บริษัท ที.แมน ฟาร์มา จำกัด</h2>`;
    cell.style.textAlign = 'center';
    cell.colSpan = 2;

    row = tableBody.insertRow();
    cell = row.insertCell(0);
    cell.innerHTML = `<h2>บริษัทเอ็กซ์เพรสเมด จำกัด</h2>`;
    cell.style.textAlign = 'center';
    cell.colSpan = 2;
  }

  // Row for the product name (one row only)
  if (displayName) {
    let row = tableBody.insertRow();
    let cell = row.insertCell(0);
    cell.innerHTML = `<h3>${displayName}</h3>`;
    cell.style.textAlign = 'center';
    cell.colSpan = 2;
  }

  // Row for the barcode image using Code39
  if (barcode) {
    let row = tableBody.insertRow();
    let cell = row.insertCell(0);
    const barcodeSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // Sanitize the barcode value: remove asterisks and force uppercase for Code39
    const sanitizedBarcode = barcode.replace(/\*/g, "").toUpperCase();
    JsBarcode(barcodeSVG, sanitizedBarcode, { format: "CODE39", displayValue: false, width: 1.5, height: 60 });
    cell.appendChild(barcodeSVG);
    cell.colSpan = 2;
    cell.style.textAlign = 'center';
  }

  // Row for the barcode number below the image
  if (barcode) {
    let row = tableBody.insertRow();
    let cell = row.insertCell(0);
    cell.innerHTML = `<h3>${barcode}</h3>`;
    cell.style.textAlign = 'center';
    cell.colSpan = 2;
  }

  // Row for MFG & LOT (and EXP for Company B)
  if (mfg || lot || (company === "companyB" && exp)) {
    let row = tableBody.insertRow();
    let cell = row.insertCell(0);
    if (company === "companyB") {
      cell.innerHTML = `<b>MFG:</b> ${mfg || ""} | <b>LOT:</b> ${lot || ""} | <b>EXP:</b> ${exp || ""}`;
    } else {
      cell.innerHTML = `<b>MFG:</b> ${mfg || ""} | <b>LOT:</b> ${lot || ""}`;
    }
    cell.style.textAlign = 'center';
    cell.colSpan = 2;
  }

  // Row for UNIT
  if (unit) {
    let row = tableBody.insertRow();
    let cell = row.insertCell(0);
    cell.innerHTML = `<b>UNIT:</b> ${unit}`;
    cell.style.textAlign = 'center';
    cell.colSpan = 2;
  }

  table.appendChild(tableBody);
  container.appendChild(table);
}


// ================= Print Label for a Single Company =================
// Now modified to use the number of copies from the input field.
function printTable(company) {
  const printCount = parseInt(document.getElementById('printCountGeneral').value, 10);
  if (isNaN(printCount) || printCount < 1) {
    alert("Please enter a valid number of labels.");
    return;
  }
  const previewWindow = window.open('', '_blank');
  if (!previewWindow) {
    alert('Please allow pop-ups.');
    return;
  }

  // Build the preview HTML
  previewWindow.document.write("<html><head><title>Preview Labels</title></head><body>");
  const container = previewWindow.document.createElement('div');
  for (let i = 0; i < printCount; i++) {
    generateTableForPrint(company, container);
  }
  previewWindow.document.body.appendChild(container);

  // Add a print button to the preview window
  const printButton = previewWindow.document.createElement('button');
  printButton.textContent = 'Print Labels';
  printButton.style.display = 'block';
  printButton.style.margin = '20px auto';
  printButton.onclick = () => previewWindow.print();
  previewWindow.document.body.appendChild(printButton);

  previewWindow.document.write("</body></html>");
  previewWindow.document.close();
}

// ================= Preview & Print Labels for Multiple Companies =================
function previewLabels(companies) {
  const printCount = parseInt(document.getElementById('printCountGeneral').value, 10);
  if (isNaN(printCount) || printCount < 1) {
    alert("Please enter a valid number of labels.");
    return;
  }
  const previewWindow = window.open('', '_blank');
  if (!previewWindow) {
    alert('Please allow pop-ups.');
    return;
  }

  // Write a complete HTML document with a CSS rule to hide the print button
  previewWindow.document.write(`
    <html>
      <head>
        <title>Preview Labels</title>
        <style>
          @media print {
            .no-print { display: none !important; }
            .page-break { page-break-after: always; }
          }
          table { page-break-inside: avoid; }
          body { font-family: 'Sarabun', Arial, sans-serif; }
        </style>
      </head>
      <body>
  `);

  const container = previewWindow.document.createElement('div');
  let tableCount = 0;

  companies.forEach(company => {
    const suffix = company.slice(-1).toUpperCase();
    const dropdown = document.getElementById(`productNameEng${suffix}`);
    // Only generate labels if a product is selected
    if (dropdown.value) {
      for (let i = 0; i < printCount; i++) {
        generateTableForPrint(company, container);
        tableCount++;
        // Insert a page break after every 3 tables
        if (tableCount % 3 === 0) {
          const pageBreak = previewWindow.document.createElement('div');
          pageBreak.className = "page-break";
          container.appendChild(pageBreak);
        }
      }
    }
  });

  previewWindow.document.body.appendChild(container);

  // Add a print button with the "no-print" class so it won't appear in printout
  const printButton = previewWindow.document.createElement('button');
  printButton.textContent = 'Print Labels';
  printButton.className = 'no-print';
  printButton.style.display = 'block';
  printButton.style.margin = '20px auto';
  printButton.onclick = () => previewWindow.print();
  previewWindow.document.body.appendChild(printButton);

  previewWindow.document.write(`
      </body>
    </html>
  `);
  previewWindow.document.close();
}

// ================= Print Label for a Single Company =================
function printTable(company) {
  const printCount = parseInt(document.getElementById('printCountGeneral').value, 10);
  if (isNaN(printCount) || printCount < 1) {
    alert("Please enter a valid number of labels.");
    return;
  }
  const previewWindow = window.open('', '_blank');
  if (!previewWindow) {
    alert('Please allow pop-ups.');
    return;
  }

  previewWindow.document.write(`
    <html>
      <head>
        <title>Preview Labels</title>
        <style>
          @media print {
            .no-print { display: none !important; }
            .page-break { page-break-after: always; }
          }
          table { page-break-inside: avoid; }
          body { font-family: 'Sarabun', Arial, sans-serif; }
        </style>
      </head>
      <body>
  `);

  const container = previewWindow.document.createElement('div');
  for (let i = 0; i < printCount; i++) {
    generateTableForPrint(company, container);
    if ((i + 1) % 3 === 0 && i !== printCount - 1) {
      const pageBreak = previewWindow.document.createElement('div');
      pageBreak.className = "page-break";
      container.appendChild(pageBreak);
    }
  }

  previewWindow.document.body.appendChild(container);

  const printButton = previewWindow.document.createElement('button');
  printButton.textContent = 'Print Labels';
  printButton.className = 'no-print';
  printButton.style.display = 'block';
  printButton.style.margin = '20px auto';
  printButton.onclick = () => previewWindow.print();
  previewWindow.document.body.appendChild(printButton);

  previewWindow.document.write(`
      </body>
    </html>
  `);
  previewWindow.document.close();
}



// ================= Initialize After DOM Loads =================
document.addEventListener("DOMContentLoaded", fetchProducts);