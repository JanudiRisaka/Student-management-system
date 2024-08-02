function loadSettings() {
    // Implement the logic to load settings from local storage
    // For example:
    var font = getSetting("fontFamily");
    var fontSize = getSetting("fontSize");
    var darkMode = getSetting("darkMode");

    // Apply the loaded settings
    applyFontFamily(font);
    applyFontSize(fontSize);
    toggleDarkMode(darkMode === "true"); // Convert the string to a boolean
}

$(document).ready(function () {
    // Load saved settings from local storage on page load
    loadSettings();

    // Dark Mode / Light Mode Toggle
    $("#darkModeToggle").change(function () {
        console.log("Dark mode toggle changed");
        toggleDarkMode($(this).prop("checked"));
    });

    // Font Family Selection
    $("#fontSelector").change(function () {
        console.log("Font selector changed");
        var selectedFont = $(this).val();
        applyFontFamily(selectedFont);
        // Save selected font to local storage
        saveSetting("fontFamily", selectedFont);
    });

    // Font Size Selection
    $("#fontSizeSelector").change(function () {
        console.log("Font size selector changed");
        var selectedSize = $(this).val();
        applyFontSize(selectedSize);
        // Save selected font size to local storage
        saveSetting("fontSize", selectedSize);
    });

    // Apply Settings Button
    $("#applySettingsBtn").click(function () {
        console.log("Apply settings button clicked");
        alert("Settings applied successfully!");
        // Add additional logic to apply any other settings as needed
    });
});
function toggleDarkMode(enableDarkMode) {
    if (enableDarkMode) {
        // Apply dark mode styles
        $("body").addClass("dark-mode");
        $(".navbar-nav .nav-link, #form, header").addClass("dark-mode");
        $("#searchForm").addClass("searchForm-dark");
    } else {
        // Remove dark mode styles
        $("body").removeClass("dark-mode");
        $(".navbar-nav .nav-link, #form, header").removeClass("dark-mode");
        $("nav").css("background-color", ""); 
    }

    // Save dark mode setting to local storage
    saveSetting("darkMode", enableDarkMode.toString());
}

function applyFontFamily(fontFamily) {
    console.log("Apply font family function called");
    // Apply the selected font family to your elements
    $("body, header, .table td, .table th").css("font-family", fontFamily);
}

function applyFontSize(fontSize) {
    console.log("Apply font size function called");
    // Apply the selected font size to your elements
    $("body, .table td, .table th").css("font-size", fontSize);
}

function saveSetting(key, value) {
    // Save a setting to local storage
    localStorage.setItem(key, value);
}

function getSetting(key) {
    // Retrieve a setting from local storage
    return localStorage.getItem(key);
}
