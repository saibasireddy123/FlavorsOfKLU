let menuData = {};

// Load the menu data from menu.json (ensuring it fetches fresh data)
function loadMenuData() {
    fetch('menu.json?' + new Date().getTime()) // Cache-busting trick
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
}

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

// Register Service Worker with Auto-Update
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/service-worker.js")
            .then((registration) => {
                console.log("✅ Service Worker Registered Successfully");

                // Check for updates and apply them
                if (registration.waiting) {
                    console.log("🔄 New service worker waiting...");
                    registration.waiting.postMessage({ type: "SKIP_WAITING" });
                }

                registration.addEventListener("updatefound", () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener("statechange", () => {
                        if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                            console.log("🆕 New update available. Refreshing...");
                            window.location.reload();
                        }
                    });
                });
            })
            .catch(error => console.log("🚨 Service Worker Registration Failed:", error));
    });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
        console.log("🔄 New service worker activated, reloading page...");
        window.location.reload();
    });
}

// Load menu data when the script runs
loadMenuData();
