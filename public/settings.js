
/* =====================================================
   Student Management System - Application Settings
   ===================================================== */

// Default application settings
const DEFAULT_SETTINGS = {
    fontFamily: 'Arial',
    fontSize: '16px',
    darkMode: false
};

// =====================================================
// Load Saved Settings
// =====================================================

function loadSettings() {
    const fontFamily =
        localStorage.getItem('fontFamily') ||
        DEFAULT_SETTINGS.fontFamily;

    const fontSize =
        localStorage.getItem('fontSize') ||
        DEFAULT_SETTINGS.fontSize;

    const darkMode =
        localStorage.getItem('darkMode') === 'true';

    // Update settings controls if they exist on this page.
    const fontSelector = document.getElementById('fontSelector');
    const fontSizeSelector = document.getElementById('fontSizeSelector');
    const darkModeToggle = document.getElementById('darkModeToggle');

    if (fontSelector) {
        fontSelector.value = fontFamily;
    }

    if (fontSizeSelector) {
        fontSizeSelector.value = fontSize;
    }

    if (darkModeToggle) {
        darkModeToggle.checked = darkMode;
    }

    // Apply saved preferences across the application.
    applyFontFamily(fontFamily);
    applyFontSize(fontSize);
    toggleDarkMode(darkMode);
}

// =====================================================
// Dark Mode
// =====================================================

function toggleDarkMode(enabled) {
    document.documentElement.classList.toggle('dark-mode', enabled);

    localStorage.setItem('darkMode', String(enabled));
}

// =====================================================
// Font Family
// =====================================================

function applyFontFamily(fontFamily) {
    document.body.style.fontFamily = fontFamily;
    localStorage.setItem('fontFamily', fontFamily);
}

// =====================================================
// Font Size
// =====================================================

function applyFontSize(fontSize) {
    // Change the root HTML font size.
    // Bootstrap uses rem units for most typography and controls.
    document.documentElement.style.fontSize = fontSize;

    localStorage.setItem('fontSize', fontSize);
}

// =====================================================
// Initialize Settings
// =====================================================

document.addEventListener('DOMContentLoaded', function () {

    // Load saved preferences.
    loadSettings();

    // Dark mode toggle.
    const darkModeToggle = document.getElementById('darkModeToggle');

    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function () {
            toggleDarkMode(this.checked);
        });
    }

    // Font family selection.
    const fontSelector = document.getElementById('fontSelector');

    if (fontSelector) {
        fontSelector.addEventListener('change', function () {
            applyFontFamily(this.value);
        });
    }

    // Font size selection.
    const fontSizeSelector = document.getElementById('fontSizeSelector');

    if (fontSizeSelector) {
        fontSizeSelector.addEventListener('change', function () {
            applyFontSize(this.value);
        });
    }

    // Apply settings button.
    const applySettingsBtn = document.getElementById('applySettingsBtn');

    if (applySettingsBtn) {
        applySettingsBtn.addEventListener('click', function () {

            const fontFamily = fontSelector
                ? fontSelector.value
                : DEFAULT_SETTINGS.fontFamily;

            const fontSize = fontSizeSelector
                ? fontSizeSelector.value
                : DEFAULT_SETTINGS.fontSize;

            const darkMode = darkModeToggle
                ? darkModeToggle.checked
                : false;

            applyFontFamily(fontFamily);
            applyFontSize(fontSize);
            toggleDarkMode(darkMode);

            alert('Settings applied successfully!');
        });
    }

});
