// ================= Supabase Configuration =================
const supabaseUrl = "https://cqdhhmolqaqbalapevnw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxZGhobW9scWFxYmFsYXBldm53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NzA1NjcsImV4cCI6MjA1NzE0NjU2N30.aSGjO9lqWHN-BxJDhul6iN3yDZqkNeyG6k2q3vr5e0M"; // Replace with your actual key
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

let productsData = [];  // Global storage for products (for the selected company)
let companiesData = []; // Global storage for companies
let selectedCompanyId = null;

// ------------------ Load Companies ------------------
async function loadCompanies() {
  const { data, error } = await supabase
    .from("companies")
    .select("id, company_name")
    .order("id", { ascending: true });
  const companySelector = document.getElementById("companySelector");
  companySelector.innerHTML = "<option value=''>Select Company</option>";
  if (error) {
    console.error("Error loading companies:", error);
    companySelector.innerHTML = "<option value=''>Error loading companies</option>";
    return;
  }
  companiesData = data;
  data.forEach(company => {
    const option = document.createElement("option");
    option.value = company.id;
    option.textContent = company.company_name;
    companySelector.appendChild(option);
  });
}

// When company is selected, load its form.
document.getElementById("companySelector").addEventListener("change", function () {
  const companyId = this.value;
  loadCompanyForm(companyId);
});

// ------------------ Load Company-Specific Form ------------------
function loadCompanyForm(companyId) {
  selectedCompanyId = parseInt(companyId);
  const container = document.getElementById("companyFormContainer");
  container.innerHTML = ""; // Clear previous content

  if (!companyId) return;

  // Decide format: if company id equals 1 (CP ALL) use "A", otherwise use "B"
  const suffix = (selectedCompanyId === 1) ? "A" : "B";
  container.innerHTML = `
    <div class="input-container">
      <label>Selected Company: ${companiesData.find(c => c.id === selectedCompanyId).company_name}</label>
      <label for="productNameEng${suffix}">Product Name (Eng):</label>
      <select id="productNameEng${suffix}" onchange="updateDropdownDynamic('${suffix}', this.value)"></select>
      <label for="productNameTh${suffix}">Product Name (Thai):</label>
      <input type="text" id="productNameTh${suffix}" readonly />
      <label for="barcode${suffix}">Barcode:</label>
      <input type="text" id="barcode${suffix}" readonly />
      <label for="mfg${suffix}">MFG:</label>
      <input type="text" id="mfg${suffix}" />
      <label for="lot${suffix}">LOT:</label>
      <input type="text" id="lot${suffix}" />
      <label for="exp${suffix}">EXP:</label>
      <input type="text" id="exp${suffix}" />
      <label for="unit${suffix}">UNIT:</label>
      <input type="text" id="unit${suffix}" />
      <button class="btn" onclick="printTableDynamic('${suffix}')">Print Label</button>
    </div>
  `;
  loadProductsForCompany(selectedCompanyId, suffix);
}

// ------------------ Load Products for Selected Company ------------------
async function loadProductsForCompany(companyId, suffix) {
  const { data, error } = await supabase
    .from("products")
    .select("company_id, product_name_eng, product_name_th, product_barcode, product_mfg, product_lot, product_exp, unit")
    .eq("company_id", companyId);
  if (error) {
    console.error("Error loading products:", error);
    return;
  }
  productsData = data;
  const dropdown = document.getElementById(`productNameEng${suffix}`);
  dropdown.innerHTML = "<option value=''>Select Product</option>";
  data.forEach(product => {
    dropdown.innerHTML += `<option value="${product.product_barcode}">${product.product_name_eng}</option>`;
  });
  // Reinitialize selectize
  if ($(dropdown).data('selectize')) {
    $(dropdown)[0].selectize.destroy();
  }
  $(dropdown).selectize({
    create: false,
    sortField: 'text',
    onChange: function (value) {
      if (value) {
        updateDropdownDynamic(suffix, value);
      } else {
        clearFieldsDynamic(suffix);
      }
    }
  });
}

// ------------------ Update Form Fields Dynamically ------------------
function updateDropdownDynamic(suffix, barcode) {
  const product = productsData.find(p => p.product_barcode === barcode);
  if (!product) {
    clearFieldsDynamic(suffix);
    return;
  }
  document.getElementById(`productNameTh${suffix}`).value = product.product_name_th || "";
  document.getElementById(`barcode${suffix}`).value = product.product_barcode || "";
  if (!document.getElementById(`mfg${suffix}`).value) {
    document.getElementById(`mfg${suffix}`).value = product.product_mfg || "";
  }
  if (!document.getElementById(`lot${suffix}`).value) {
    document.getElementById(`lot${suffix}`).value = product.product_lot || "";
  }
  if (!document.getElementById(`exp${suffix}`).value) {
    document.getElementById(`exp${suffix}`).value = suffix === "A" ? "" : product.product_exp || "";
  }

  document.getElementById(`unit${suffix}`).value = product.unit || "";
}

function clearFieldsDynamic(suffix) {
  document.getElementById(`productNameTh${suffix}`).value = "";
  document.getElementById(`barcode${suffix}`).value = "";
  document.getElementById(`mfg${suffix}`).value = "";
  document.getElementById(`lot${suffix}`).value = "";
  document.getElementById(`exp${suffix}`).value = "";
  document.getElementById(`unit${suffix}`).value = "";
}

// ------------------ Generate Printable Table for a Label ------------------
function generateTableForPrint(company, container) {
  // Use format "A" for company with ID 1, otherwise use format "B"
  const suffix = (company === "companyA") ? "A" : "B";

  // Get the product selected from the corresponding product dropdown.
  const dropdown = document.getElementById(`productNameEng${suffix}`);
  const selectedBarcode = dropdown.value;
  // Find the product in productsData by matching the barcode.
  const product = productsData.find(p => p.product_barcode === selectedBarcode);

  // Retrieve product names from the product data.
  let productNameEng = product ? product.product_name_eng : "";
  let productNameTh = product ? product.product_name_th : "";
  // Get other field values.
  let barcode = document.getElementById(`barcode${suffix}`).value;
  let mfg = document.getElementById(`mfg${suffix}`).value;
  let lot = document.getElementById(`lot${suffix}`).value;
  let exp = document.getElementById(`exp${suffix}`).value;
  let unit = document.getElementById(`unit${suffix}`).value;

  // Create table element.
  const table = document.createElement('table');
  table.style.borderCollapse = 'collapse';
  table.style.width = '100%';
  table.style.margin = '20px auto';
  table.style.border = '2px solid black';
  const tableBody = table.createTBody();

  if (company === "companyA") {
    // Company A Format:
    // Row 1: "PRODUCT CODE :" (plain text header, left-aligned)
    let row = tableBody.insertRow();
    let cell = row.insertCell(0);
    cell.innerHTML = `<h2 style="margin:0; padding:0px 0 20px 70px;">PRODUCT CODE :</h2>`;
    cell.style.textAlign = 'left';
    cell.colSpan = 2;
    cell.style.borderBottom = '2px solid black';
    cell.style.paddingTop = '20px';

    // Row 2: Product_Name_Eng (plain text, left aligned)
    if (productNameEng) {
      row = tableBody.insertRow();
      cell = row.insertCell(0);
      cell.innerHTML = `<span style="font-size:1.25rem; font-weight:bold; margin:0; padding:5px 0;">Product_Name_Eng: </span>${productNameEng}`;
      cell.style.textAlign = 'left';
      cell.colSpan = 2;
      cell.style.paddingLeft = '70px';
    }

    // Row 3: Product_Name_Th (plain text, left aligned)
    if (productNameTh) {
      row = tableBody.insertRow();
      cell = row.insertCell(0);
      cell.innerHTML = `<span style="font-size:1.25rem; font-weight:bold; margin:0; padding:5px 0;">Product_Name_Th: </span>${productNameTh}`;
      cell.style.textAlign = 'left';
      cell.colSpan = 2;
      cell.style.paddingLeft = '70px';
    }
  } else {
    // Company B Format (and any new company):
    // Two header rows.
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
    cell.style.border = '2px solid';

    // Single row for product name (choose Eng if available, else Thai)
    let displayName = productNameEng || productNameTh || "";
    if (displayName) {
      row = tableBody.insertRow();
      cell = row.insertCell(0);
      cell.innerHTML = `<h3 style="margin:0; padding:5px 0;">${displayName}</h3>`;
      cell.style.textAlign = 'center';
      cell.colSpan = 2;
    }
  }

  // Row for Barcode Image using Code39.
  if (barcode) {
    let row = tableBody.insertRow();
    let cell = row.insertCell(0);
    const barcodeSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // Sanitize barcode (remove asterisks and force uppercase)
    const sanitizedBarcode = barcode.replace(/\*/g, "").toUpperCase();
    JsBarcode(barcodeSVG, sanitizedBarcode, { format: "CODE39", displayValue: false, width: 1.5, height: 40 });
    cell.appendChild(barcodeSVG);
    cell.colSpan = 2;
    cell.style.textAlign = 'center';
  }

  // Row for Barcode Number (displayed below the image)
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

  // Row for UNIT.
  if (unit) {
    let row = tableBody.insertRow();
    let cell = row.insertCell(0);
    if (company === "companyA") {
      cell.innerHTML = `<span style="font-size:1.25rem; font-weight:bold;">UNIT:</span> <span style="font-size:1.25rem;">${unit}</span>`;
      cell.style.textAlign = 'left';
      cell.colSpan = 2;
      cell.style.borderTop = '2px solid black';
      cell.style.paddingLeft = '70px';
    } else {
      cell.innerHTML = `<span style="font-size:1.25rem; font-weight:bold;">บรรจุ:</span> <span style="font-size:1.25rem;">${unit}</span>`;
      cell.style.textAlign = 'center';
      cell.colSpan = 2;
      cell.style.borderTop = '2px solid black';
    }
  }

  table.appendChild(tableBody);
  container.appendChild(table);
}

// ------------------ Print Functions ------------------
// Print Label for a Single Company using dynamic form fields.
function printTableDynamic(suffix) {
  // Determine company format: "A" for CP ALL, "B" for all others.
  const company = (suffix === "A") ? "companyA" : "companyB";
  printTable(company);
}

// The printTable function opens a preview window, generates the label tables, and adds a print button.
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


  const printButton = previewWindow.document.createElement('button');
  printButton.textContent = 'Print Labels';
  printButton.className = 'no-print';
  printButton.style.display = 'block';
  printButton.style.margin = '40px auto';
  printButton.style.padding = '10px';
  printButton.onclick = () => previewWindow.print();
  previewWindow.document.body.appendChild(printButton);

  previewWindow.document.write(`</body></html>`);
  previewWindow.document.close();


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

}

// Preview & Print Labels for Multiple Companies (if needed)
function previewLabels() {
  alert("Preview Labels function called");
}

document.addEventListener("DOMContentLoaded", loadCompanies);
