/* ============================================
    QR Scanner Pro
    Theme Module
============================================ */

// ============================================
// INIT
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    initTheme();

});

// ============================================
// INIT THEME
// ============================================

function initTheme() {

    const toggle = document.getElementById("themeToggle");

    const icon = document.getElementById("themeIcon");

    // Kalau halaman tidak punya tombol (antisipasi)
    if (!toggle || !icon) return;

    // Load theme yang tersimpan
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark");

        setDarkIcon();

    }
    else {

        document.body.classList.remove("dark");

        setLightIcon();

    }

    // Toggle saat diklik

    toggle.addEventListener("click", toggleTheme);

}

// ============================================
// TOGGLE
// ============================================

function toggleTheme() {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem(

            "theme",

            "dark"

        );

        setDarkIcon();

        showThemeToast("Dark Mode");

    }
    else {

        localStorage.setItem(

            "theme",

            "light"

        );

        setLightIcon();

        showThemeToast("Light Mode");

    }

}

// ============================================
// ICON
// ============================================

function setDarkIcon() {

    const icon =
        document.getElementById("themeIcon");

    if (!icon) return;

    icon.className =
        "bi bi-sun-fill";

}

function setLightIcon() {

    const icon =
        document.getElementById("themeIcon");

    if (!icon) return;

    icon.className =
        "bi bi-moon-stars-fill";

}

// ============================================
// TOAST
// ============================================

function showThemeToast(text) {

    // Pakai toast project kalau tersedia

    if (typeof showToast === "function") {

        showToast(

            text + " Aktif",

            "success"

        );

    }

}