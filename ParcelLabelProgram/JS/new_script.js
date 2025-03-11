window.onload = function () {
  document.querySelectorAll("p, td, span, div").forEach(element => {
    if (/[ก-๙]/.test(element.textContent)) {
      element.style.fontFamily = "Sarabun, CordiaUPC, sans-serif"; // Thai font
    } else {
      element.style.fontFamily = "Tahoma, Arial, sans-serif"; // English font
    }
  });
};

function updateDropdown(company, productNameEngValue) {
  console.log('updateDropdown called - Company:', company, 'Product (Eng) Value:', productNameEngValue);

  const companyData = productData[company];
  if (companyData && companyData[productNameEngValue]) {
    const data = companyData[productNameEngValue];
    console.log('Data found:', data);

    if (company === 'companyA') {  // <---- ADD THIS CONDITION
      console.log('Thai Product Name for Company A from data:', data.productNameThA);
      document.getElementById('productNameThA').value = data.productNameThA || ''; // Auto-fill for Company A
    } else if (company === 'companyB') { // Keep the Company B condition as it is
      console.log('Thai Product Name from data:', data.productNameThB);
      document.getElementById('productNameThB').value = data.productNameThB || '';
    }
    // Update other dropdowns (Barcode, MFG, LOT, EXP, UNIT) - This part is already general and works for both companies
    document.getElementById('barcode' + company.slice(-1).toUpperCase()).value = data['barcode' + company.slice(-1).toUpperCase()] || '';
    document.getElementById('mfg' + company.slice(-1).toUpperCase()).value = data['mfg' + company.slice(-1).toUpperCase()] || '';
    document.getElementById('lot' + company.slice(-1).toUpperCase()).value = data['lot' + company.slice(-1).toUpperCase()] || '';
    document.getElementById('exp' + company.slice(-1).toUpperCase()).value = data['exp' + company.slice(-1).toUpperCase()] || '';
    document.getElementById('unit' + company.slice(-1).toUpperCase()).value = data['unit' + company.slice(-1).toUpperCase()] || '';
  } else {
    console.log('No data found for product or company.');
    if (company === 'companyA') { // <---- ADD THIS CONDITION for clearing Company A too
      document.getElementById('productNameThA').value = ''; // Clear Thai Product Name for Company A
    } else if (company === 'companyB') { // Keep Company B clear condition
      document.getElementById('productNameThB').value = '';
    }
    document.getElementById('barcode' + company.slice(-1).toUpperCase()).value = '';
    document.getElementById('mfg' + company.slice(-1).toUpperCase()).value = '';
    document.getElementById('lot' + company.slice(-1).toUpperCase()).value = '';
    document.getElementById('exp' + company.slice(-1).toUpperCase()).value = '';
    document.getElementById('unit' + company.slice(-1).toUpperCase()).value = '';
  }
}


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
    table.style.width = '90%';
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
    cell1.style.paddingLeft = '100px';
    cell1.style.paddingTop = '20px';
    cell1.style.paddingBottom = '0px';

    cell1.colSpan = 2;

    // 2. Product_Name_ENG Row - SECOND ROW
    if (data["Product Name"]) {
      let row = tableBody.insertRow();
      let cell1 = row.insertCell(0);
      cell1.innerHTML = `<span style="font-size: 1.25rem; font-weight: bold;">Product_Name_Eng:</span>
      <span class='product-name-eng-a'>${data["Product Name"]}</span>`;
      cell1.classList.add("product-name-eng-row-a");
      cell1.style.textAlign = 'left';
      cell1.style.paddingLeft = '100px';
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
      cell1.innerHTML = `<span style="font-size: 1.25rem; font-weight: bold;">Product_Name_Th : </span>
      <span class='product-name-thai-a'>${data["Product Name TH"]}</span>`;
      cell1.classList.add("product-name-thai-row-a");
      cell1.style.textAlign = 'left';
      cell1.style.paddingLeft = '100px';
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

      // Remove "*" from the barcode data
      let sanitizedBarcode = data["Barcode"].replace(/\*/g, "");

      const barcodeSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      JsBarcode(barcodeSVG, sanitizedBarcode, {
        format: "CODE39",
        displayValue: true,
        width: 1.5,
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
      mfgLotCell.style.paddingLeft = "100px";

      mfgLotCell.innerHTML = `
    <div style="display: flex; justify-content: space-between; width: 80%;">
      <span class="mfg-value" style="font-size: 1.25rem; flex: 1; text-align: left;"><b>MFG:</b> <span class="value-span">${data["MFG"] || ""}</span></span>
      <span class="lot-value" style="font-size: 1.25rem; text-align: right;"><b>LOT:</b> <span class="value-span">${data["LOT"] || ""}</span></span>
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
      unitCell.style.paddingLeft = '100px';

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
    data["Product Name"] = document.getElementById("productNameThB").value;
    // data["Product Name TH"] = document.getElementById("productNameThB").value;
    barcode = document.getElementById("barcodeB").value;
    data["Barcode"] = barcode;
    data["LOT"] = document.getElementById("lotB").value;
    data["MFG"] = document.getElementById("mfgB").value;
    data["EXP"] = document.getElementById("expB").value;
    data["บรรจุ"] = document.getElementById("unitB").value;

    const table = document.createElement('table');
    table.id = "tocTable-print";
    table.style.borderCollapse = 'collapse';
    table.style.width = '90%';
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
      cell1.style.paddingTop = '20px';
    }

    // 6. Barcode Row
    if (data["Barcode"]) {
      let barcodeRow = tableBody.insertRow();
      let barcodeCell = barcodeRow.insertCell(0);

      // Remove "*" from the barcode data
      let sanitizedBarcode = data["Barcode"].replace(/\*/g, "");

      const barcodeSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      JsBarcode(barcodeSVG, sanitizedBarcode, {
        format: "CODE39",
        displayValue: true,
        width: 1.5,
        height: 40
      });
      barcodeCell.appendChild(barcodeSVG);
      barcodeCell.colSpan = 2;
      barcodeCell.style.borderRight = '1px solid black';
      barcodeCell.style.borderLeft = '1px solid black';
      barcodeCell.style.textAlign = 'center';
      barcodeCell.style.paddingTop = '5px';

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
        unitQtyContent += `QTY: <span class='value-span'>${"80.00"}</span>`;
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
  $('#productNameEngA').selectize({
    create: false,
    sortField: 'text'
  });
  $('#productNameB').selectize({
    create: false,
    sortField: 'text'
  });
});




//10/03/25



// Sample company data
const companyData = [
  { id: companyA, name: "companyA" },
  { id: companyB, name: "CompanyB" },
];

// Open the modal when the button is clicked
const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('openModalBtn');
const closeBtn = document.querySelector('.close-btn');

// Populate the company name dropdown dynamically
const companySelect = document.getElementById('companyName');

companyData.forEach(company => {
  const option = document.createElement('option');
  option.value = company.id;
  option.textContent = company.name;
  companySelect.appendChild(option);
});

// Show modal
openModalBtn.onclick = function () {
  modal.style.display = "block";
}

// Close modal
closeBtn.onclick = function () {
  modal.style.display = "none";
}

// Close modal if the user clicks outside of the modal
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Handle form submission
const productForm = document.getElementById('productForm');
productForm.onsubmit = function (event) {
  event.preventDefault(); // Prevent form submission to server

  // Collect the form data
  const formData = new FormData(productForm);

  // Example of how to handle the form data (you can replace this with an AJAX request or something else)
  const formObject = {};
  formData.forEach((value, key) => {
    formObject[key] = value;
  });

  console.log(formObject); // Log form data to console (or process it)

  // Close modal after submission
  modal.style.display = "none";
}



//supabase
const SUPABASE_URL = 'https://cqdhhmolqaqbalapevnw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxZGhobW9scWFxYmFsYXBldm53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NzA1NjcsImV4cCI6MjA1NzE0NjU2N30.aSGjO9lqWHN-BxJDhul6iN3yDZqkNeyG6k2q3vr5e0M';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// Store Data (Insert):
async function insertData(name, description) {
  const { error } = await supabase
    .from('items')
    .insert([{ name: name, description: description }]);

  if (error) {
    console.error('Error inserting data:', error);
  } else {
    console.log('Data inserted successfully!');
  }
}

// Example usage:
insertData('Example Item', 'This is an example description.');


//Retrieve Data (Select):

async function fetchData() {
  const { data, error } = await supabase.from('items').select('*');

  if (error) {
    console.error('Error fetching data:', error);
  } else {
    console.log('Fetched data:', data);
    // Process the retrieved data (e.g., display it on your HTML page)
    displayData(data);
  }
}

function displayData(items) {
  const dataContainer = document.getElementById('data-container');
  dataContainer.innerHTML = ''; // Clear previous data

  items.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.textContent = `Name: ${item.name}, Description: ${item.description}`;
    dataContainer.appendChild(itemElement);
  });
}

// Example usage:
fetchData();


//Update Data (Update):

async function updateData(itemId, newName, newDescription) {
  const { error } = await supabase
      .from('items')
      .update({name: newName, description: newDescription})
      .eq('id', itemId);

  if(error){
      console.log("Error updating data: ", error);
  } else {
      console.log("data updated successfully");
  }
}
//example usage:
updateData(1, "Updated Name", "Updated description");

//Delete Data (Delete):

async function deleteData(itemId){
  const {error} = await supabase
      .from('items')
      .delete()
      .eq('id', itemId);

  if(error){
      console.log("Error deleting data: ", error);
  } else {
      console.log("Data deleted successfully");
  }
}
//example usage:
deleteData(1);
