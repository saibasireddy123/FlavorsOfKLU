// script.js

let menuData = {};

// Load the menu data from menu.json
fetch('menu.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        menuData = data;
        console.log("✅ Menu data loaded successfully:", menuData);
    })
    .catch(error => {
        console.error("🚨 Error loading menu data:", error);
    });

// Function to update menu dynamically
function fetchMenu() {
    let cuisine = document.getElementById('mess_type').value;
    let day = document.getElementById('day').value;
    let category = document.getElementById('category').value;
    let menuDisplay = document.getElementById('menuDisplay');

    if (!cuisine || !day || !category) {
        menuDisplay.innerHTML = "<tr><td style='color: red;'>⚠️ Please select all options.</td></tr>";
        return;
    }

    let items = menuData?.[cuisine]?.[day]?.[category] || [];

    if (items.length > 0) {
        let tableHTML = "<tr><th>Items</th></tr>";
        items.forEach(item => {
            tableHTML += `<tr><td>${item}</td></tr>`;
        });
        menuDisplay.innerHTML = tableHTML;
    } else {
        menuDisplay.innerHTML = "<tr><td style='color: red;'>🚫 No menu available.</td></tr>";
    }
}

// Add event listeners to selection fields (Auto update menu)
document.getElementById("mess_type").addEventListener("change", fetchMenu);
document.getElementById("day").addEventListener("change", fetchMenu);
document.getElementById("category").addEventListener("change", fetchMenu);

// Register Service Worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/service-worker.js")
            .then(() => console.log("✅ Service Worker Registered Successfully"))
            .catch(error => console.log("🚨 Service Worker Registration Failed:", error));
    });
}
