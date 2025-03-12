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

    // Populate dropdowns based on company_id.
    // For Company A, we use "companyA"; for all others, we use the Company B fields.
    populateDropdown("companyA", data.filter(p => p.company_id === 1));
    populateDropdown("companyB", data.filter(p => p.company_id !== 1));
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

// ================= Populate Dropdown for a Given Company =================
function populateDropdown(company, data) {
  // Use "A" if company is exactly "companyA", otherwise force "B" for any other company.
  const suffix = (company === "companyA") ? "A" : "B";
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
  // Use "A" for companyA; for any other, use "B"
  const suffix = (company === "companyA") ? "A" : "B";
  document.getElementById(`productNameTh${suffix}`).value = product.product_name_th || "";
  document.getElementById(`barcode${suffix}`).value = product.product_barcode || "";
  document.getElementById(`mfg${suffix}`).value = product.product_mfg || "";
  document.getElementById(`lot${suffix}`).value = product.product_lot || "";
  if (company === "companyA") {
    document.getElementById(`exp${suffix}`).value = "";
  } else {
    document.getElementById(`exp${suffix}`).value = product.product_exp || "";
  }
  document.getElementById(`unit${suffix}`).value = product.unit || "";
}

// ================= Clear Form Fields =================
function clearFields(company) {
  const suffix = (company === "companyA") ? "A" : "B";
  document.getElementById(`productNameTh${suffix}`).value = "";
  document.getElementById(`barcode${suffix}`).value = "";
  document.getElementById(`mfg${suffix}`).value = "";
  document.getElementById(`lot${suffix}`).value = "";
  document.getElementById(`exp${suffix}`).value = "";
  document.getElementById(`unit${suffix}`).value = "";
}

// ================= Generate Printable Table for a Label =================
function generateTableForPrint(company, container) {
  // Use "A" for companyA, otherwise use "B"
  const suffix = (company === "companyA") ? "A" : "B";

  // Get the dropdown element and selected barcode from the appropriate field
  const dropdown = document.getElementById(`productNameEng${suffix}`);
  const selectedBarcode = dropdown.value;
  // Find the product by matching barcode in the global productsData
  const product = productsData.find(p => p.product_barcode === selectedBarcode);

  // For Company A, we use both product_name_eng and product_name_th.
  let productNameEng = product ? product.product_name_eng : "";
  let productNameTh = product ? product.product_name_th : "";
  // Get the values from the auto-filled fields.
  let barcode = document.getElementById(`barcode${suffix}`).value;
  let mfg = document.getElementById(`mfg${suffix}`).value;
  let lot = document.getElementById(`lot${suffix}`).value;
  let unit = document.getElementById(`unit${suffix}`).value;
  let exp = "";
  if (company !== "companyA" && product) {
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
    // Company A: header "PRODUCT CODE :" left-aligned
    let row = tableBody.insertRow();
    let cell = row.insertCell(0);
    cell.innerHTML = `<h2 style="margin:0; padding:5px 0 5px 70px;">PRODUCT CODE :</h2>`;
    cell.style.textAlign = 'left';
    cell.colSpan = 2;
    cell.style.borderBottom = '1px solid black';
    cell.style.paddingTop = '20px';

    // Row for Product_Name_Eng (left aligned)
    if (productNameEng) {
      row = tableBody.insertRow();
      cell = row.insertCell(0);
      cell.innerHTML = `<span style="font-size:1.25rem; font-weight:bold; margin:0; padding:5px 0;">Product_Name_Eng: </span>${productNameEng}`;
      cell.style.textAlign = 'left';
      cell.colSpan = 2;
      cell.style.paddingLeft = '70px';
    }

    // Row for Product_Name_Th (left aligned)
    if (productNameTh) {
      row = tableBody.insertRow();
      cell = row.insertCell(0);
      cell.innerHTML = `<span style="font-size:1.25rem; font-weight:bold; margin:0; padding:5px 0;">Product_Name_Th: </span>${productNameTh}`;
      cell.style.textAlign = 'left';
      cell.colSpan = 2;
      cell.style.paddingLeft = '70px';
    }
  } else {
    // Company B (and any new company): use the same format as Company B
    // Two header rows: first fixed, second from company data (for company_id 2)
    let row = tableBody.insertRow();
    let cell = row.insertCell(0);
    cell.innerHTML = `<h2 style="margin:0; padding:5px 0;">บริษัท ที.แมน ฟาร์มา จำกัด</h2>`;
    cell.style.textAlign = 'center';
    cell.colSpan = 2;

    row = tableBody.insertRow();
    cell = row.insertCell(0);
    cell.innerHTML = `<h2 style="margin:0; padding:5px 0;">บริษัทเอ็กซ์เพรสเมด จำกัด</h2>`;
    cell.style.textAlign = 'center';
    cell.colSpan = 2;
    cell.style.border = '1px solid';

    // One row for product name (either Eng or Thai)
    let displayName = productNameEng || productNameTh || "";
    if (displayName) {
      row = tableBody.insertRow();
      cell = row.insertCell(0);
      cell.innerHTML = `<h3 style="margin:0; padding:5px 0;">${displayName}</h3>`;
      cell.style.textAlign = 'center';
      cell.colSpan = 2;
    }
  }

  // Row for the barcode image using Code39
  if (barcode) {
    let row = tableBody.insertRow();
    let cell = row.insertCell(0);
    const barcodeSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const sanitizedBarcode = barcode.replace(/\*/g, "").toUpperCase();
    JsBarcode(barcodeSVG, sanitizedBarcode, { format: "CODE39", displayValue: false, width: 1.5, height: 40 });
    cell.appendChild(barcodeSVG);
    cell.colSpan = 2;
    cell.style.textAlign = 'center';
  }

  // Row for the barcode number below the image
  if (barcode) {
    let row = tableBody.insertRow();
    let cell = row.insertCell(0);
    cell.innerHTML = `<h3 style="margin:0; padding:5px 0;">${barcode}</h3>`;
    cell.style.textAlign = 'center';
    cell.colSpan = 2;
  }

  // Row for MFG / LOT (and for Company B, include EXP with spacing)
  if (mfg || lot || (company !== "companyA" && exp)) {
    let row = tableBody.insertRow();
    let cell = row.insertCell(0);
    if (company !== "companyA") {
      cell.innerHTML = `<span style="margin-right:20px; font-size:1.25rem;"><b>MFG :</b> ${mfg || ""}</span>
                        <span style="margin-right:20px; font-size:1.25rem;"><b>LOT :</b> ${lot || ""}</span>
                        <span style="font-size:1.25rem;"><b>EXP :</b> ${exp || ""}</span>`;
      cell.style.textAlign = 'center';
    } else {
      cell.innerHTML = `<span style="margin-right:20px; font-size:1.25rem;"><b>MFG :</b> ${mfg || ""}</span>
                        <span style="font-size:1.25rem;"><b>LOT :</b> ${lot || ""}</span>`;
      cell.style.textAlign = 'left';
      cell.style.paddingLeft = '70px';
    }
    cell.colSpan = 2;
  }

  // Row for UNIT
  if (unit) {
    let row = tableBody.insertRow();
    let cell = row.insertCell(0);
    if (company === "companyA") {
      cell.innerHTML = `<span style="font-size:1.25rem; font-weight:bold;">UNIT:</span> <span style="font-size:1.25rem;">${unit}</span>`;
      cell.style.textAlign = 'left';
      cell.colSpan = 2;
      cell.style.borderTop = '1px solid black';
      cell.style.paddingLeft = '70px';
    } else {
      cell.innerHTML = `<span style="font-size:1.25rem; font-weight:bold;">บรรจุ:</span> <span style="font-size:1.25rem;">${unit}</span>`;
      cell.style.textAlign = 'center';
      cell.colSpan = 2;
      cell.style.borderTop = '1px solid black';
    }
  }

  table.appendChild(tableBody);
  container.appendChild(table);
}

// ================= Print Label for a Single Company =================
// Modified to use the number of copies from the input field.
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
  previewWindow.document.write("<html><head><title>Preview Labels</title><style>@media print {.no-print {display:none !important;} .page-break {page-break-after: always;} table {page-break-inside: avoid;} body {font-family: 'Sarabun', Arial, sans-serif;}}</style></head><body>");
  const container = previewWindow.document.createElement('div');
  for (let i = 0; i < printCount; i++) {
    generateTableForPrint(company, container);
  }
  previewWindow.document.body.appendChild(container);

  // Add a print button to the preview window
  const printButton = previewWindow.document.createElement('button');
  printButton.textContent = 'Print Labels';
  printButton.className = 'no-print';
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

  previewWindow.document.write(`<html><head><title>Preview Labels</title><style>@media print {.no-print {display:none !important;} .page-break {page-break-after: always;} table {page-break-inside: avoid;} body {font-family: 'Sarabun', Arial, sans-serif;}}</style></head><body>`);
  const container = previewWindow.document.createElement('div');
  let tableCount = 0;
  companies.forEach(company => {
    // For any company other than "companyA", use suffix "B"
    const suffix = (company === "companyA") ? "A" : "B";
    const dropdown = document.getElementById(`productNameEng${suffix}`);
    if (dropdown.value) {
      for (let i = 0; i < printCount; i++) {
        generateTableForPrint(company, container);
        tableCount++;
        if (tableCount % 3 === 0) {
          const pageBreak = previewWindow.document.createElement('div');
          pageBreak.className = "page-break";
          container.appendChild(pageBreak);
        }
      }
    }
  });
  previewWindow.document.body.appendChild(container);

  const printButton = previewWindow.document.createElement('button');
  printButton.textContent = 'Print Labels';
  printButton.className = 'no-print';
  printButton.style.display = 'block';
  printButton.style.margin = '20px auto';
  printButton.onclick = () => previewWindow.print();
  previewWindow.document.body.appendChild(printButton);

  previewWindow.document.write("</body></html>");
  previewWindow.document.close();
}

// ================= Initialize After DOM Loads =================
document.addEventListener("DOMContentLoaded", fetchProducts);
