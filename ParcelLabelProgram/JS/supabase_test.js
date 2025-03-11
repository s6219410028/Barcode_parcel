




// Ensure Supabase is available
if (typeof supabase === 'undefined') {
    console.error("Supabase SDK is not loaded. Make sure to include @supabase/supabase-js in your HTML file.");
}

// Initialize Supabase client
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://cqdhhmolqaqbalapevnw.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxZGhobW9scWFxYmFsYXBldm53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NzA1NjcsImV4cCI6MjA1NzE0NjU2N30.aSGjO9lqWHN-BxJDhul6iN3yDZqkNeyG6k2q3vr5e0M";
const supabase = createClient(supabaseUrl, supabaseKey)

// Fetch Products from Supabase
async function fetchProducts() {
    try {
        let { data, error } = await supabase
            .from('products')
            .select('id, company_id, product_name_eng, product_name_th');

        if (error) {
            console.error('Error fetching products:', error);
            return;
        }

        console.log("Fetched Products:", data); // Debugging: See data in console

        // Loop through each product and append to the correct dropdown
        data.forEach(product => {
            let dropdownId = product.company_id === 1 ? "productNameEngA" : "productNameEngB";
            let dropdown = document.getElementById(dropdownId);

            if (dropdown) {
                let option = document.createElement("option");
                option.value = product.id;
                option.textContent = product.product_name_eng; // Change to `product_name_th` for Thai name
                dropdown.appendChild(option);
            } else {
                console.error(`Dropdown with ID '${dropdownId}' not found in HTML.`);
            }
        });
    } catch (err) {
        console.error("Error in fetchProducts():", err);
    }
}

// Ensure DOM is loaded before running script
document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
});
