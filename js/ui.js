/* ============================================
    QR Scanner Pro
    UI Module
============================================ */

// =====================================================
// ELEMENT
// =====================================================
let quickActionContainer;

let startBtn;
let stopBtn;

let copyBtn;
let clearBtn;

let qrType;
let rawData;
let infoTable;

let statusDot;
let statusText;

let toast;
let toastMessage;
let toastIcon;

// =====================================================
// INIT UI
// =====================================================

function initUI() {

    quickActionContainer =
    document.getElementById("quickActionContainer");

    startBtn = document.getElementById("startBtn");
    stopBtn = document.getElementById("stopBtn");

    copyBtn = document.getElementById("copyBtn");
    clearBtn = document.getElementById("clearBtn");

    qrType = document.getElementById("qrType");
    rawData = document.getElementById("rawData");
    infoTable = document.getElementById("infoTable");

    statusDot = document.getElementById("statusDot");
    statusText = document.getElementById("statusText");

    toast = document.getElementById("toast");
    toastMessage = document.getElementById("toastMessage");
    toastIcon = document.getElementById("toastIcon");

    setStatus("Scanner Belum Aktif", "#ef4444");

    stopBtn.disabled = true;

    copyBtn.addEventListener("click", copyResult);

    clearBtn.addEventListener("click", clearResult);

    const clearHistoryBtn=document.getElementById("clearHistoryBtn");

if(clearHistoryBtn){

    clearHistoryBtn.addEventListener("click",()=>{

        clearHistory();

        showToast(

            "Riwayat dihapus",

            "info"

        );

    });

}

}

// =====================================================
// STATUS
// =====================================================

function setStatus(text, color) {

    statusText.textContent = text;

    statusDot.style.background = color;

}

// =====================================================
// TOAST
// =====================================================

function showToast(message, type = "success") {

    toastMessage.textContent = message;

    toastIcon.className = "";

    switch (type) {

        case "success":

            toastIcon.className = "bi bi-check-circle-fill";

            toastIcon.style.color = "#22c55e";

            break;

        case "error":

            toastIcon.className = "bi bi-x-circle-fill";

            toastIcon.style.color = "#ef4444";

            break;

        case "warning":

            toastIcon.className = "bi bi-exclamation-circle-fill";

            toastIcon.style.color = "#f59e0b";

            break;

        case "info":

            toastIcon.className = "bi bi-info-circle-fill";

            toastIcon.style.color = "#3b82f6";

            break;

    }

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2000);

}

// =====================================================
// VIBRATION
// =====================================================

function vibrateDevice(pattern = [120]) {

    if ("vibrate" in navigator) {

        navigator.vibrate(pattern);

    }

}

// =====================================================
// COPY
// =====================================================

async function copyResult() {

    const text = rawData.value.trim();

    if (text === "") {

        showToast("Belum ada hasil scan", "warning");

        return;

    }

    try {

        await navigator.clipboard.writeText(text);

        showToast("Berhasil disalin", "success");

    }

    catch (err) {

        console.error(err);

        showToast("Gagal menyalin", "error");

    }

}

// =====================================================
// CLEAR
// =====================================================

function clearResult() {

    rawData.value = "";

    qrType.innerHTML = "-";

    infoTable.innerHTML = `
        <tr>
            <td class="text-muted">

                Belum ada data

            </td>
        </tr>
    `;

    if (typeof scanLocked !== "undefined") {

        scanLocked = false;

    }

    showToast("Data dibersihkan", "info");

}

// =====================================================
// BADGE
// =====================================================

function setQRType(type, color = "secondary") {

    qrType.innerHTML = `
        <span class="badge bg-${color} fs-6">

            ${type}

        </span>
    `;

}

// =====================================================
// RENDER INFO TABLE
// =====================================================

function renderInfo(rows = []) {

    if (!rows.length) {

        infoTable.innerHTML = `
            <tr>
                <td class="text-muted">

                    Belum ada data

                </td>
            </tr>
        `;

        return;

    }

    let html = "";

    rows.forEach(row => {

        html += `
            <tr>

                <td width="35%">

                    <strong>${row[0]}</strong>

                </td>

                <td>

                    ${row[1]}

                </td>

            </tr>
        `;

    });

    infoTable.innerHTML = html;

}

// =====================================================
// SET RAW DATA
// =====================================================

function setRawData(text){

    rawData.value = text;

}

// =====================================================
// QUICK ACTION
// =====================================================

function renderQuickAction(action) {

    if (!quickActionContainer) return;

    if (!action) {

        quickActionContainer.innerHTML = `
            <div class="text-muted text-center py-3">

                Belum ada aksi yang tersedia.

            </div>
        `;

        return;

    }

    let buttonClass = "btn-primary";

    switch (action.type) {

        case "copy":
            buttonClass = "btn-success";
            break;

        case "link":
            buttonClass = "btn-primary";
            break;

    }

    quickActionContainer.innerHTML = `
        <button
            id="quickActionBtn"
            class="btn ${buttonClass} quick-action-btn">

            <i class="bi ${action.icon}"></i>

            ${action.label}

        </button>
    `;

    const btn = document.getElementById("quickActionBtn");

    btn.addEventListener("click", async () => {

        switch (action.type) {

            // ==========================
            // OPEN LINK
            // ==========================

            case "link":

                window.open(action.url, "_blank");

                showToast("Membuka tautan...", "success");

                break;

            // ==========================
            // COPY
            // ==========================

            case "copy":

                try {

                    await navigator.clipboard.writeText(action.value);

                    showToast("Berhasil disalin", "success");

                }

                catch (err) {

                    console.error(err);

                    showToast("Gagal menyalin", "error");

                }

                break;

            // ==========================
            // DEFAULT
            // ==========================

            default:

                showToast("Aksi belum didukung", "warning");

                break;

        }

    });

}