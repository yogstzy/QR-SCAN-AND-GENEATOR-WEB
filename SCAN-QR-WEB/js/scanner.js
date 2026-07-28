/* ============================================
    QR Scanner Pro
    Scanner Module
============================================ */

// =====================================================
// VARIABLE
// =====================================================

let html5QrCode = null;

let scannerRunning = false;

let scanLocked = false;

// Camera Manager
let cameras = [];
let currentCameraId = null;
let cameraLoaded = false;

// =====================================================
// INIT
// =====================================================

async function initScanner() {

    const uploadBtn = document.getElementById("uploadBtn");
    const imageInput = document.getElementById("imageInput");
    const cameraSelect = document.getElementById("cameraSelect");

    // tombol scanner
    startBtn.addEventListener("click", startScanner);
    stopBtn.addEventListener("click", stopScanner);

    // upload image
    uploadBtn.addEventListener("click", () => {

        imageInput.click();

    });

    imageInput.addEventListener("change", async (e) => {

        if (!e.target.files.length) return;

        await scanImage(e.target.files[0]);

        imageInput.value = "";

    });

}

// =====================================================
// LOAD CAMERA LIST
// =====================================================

async function loadCameraList() {

    const cameraSelect = document.getElementById("cameraSelect");

    try {

        cameras = await Html5Qrcode.getCameras();

        cameraSelect.innerHTML = "";

        if (cameras.length === 0) {

            cameraSelect.innerHTML = `
                <option value="">
                    Kamera tidak ditemukan
                </option>
            `;

            return;

        }

        cameras.forEach((camera, index) => {

            const option = document.createElement("option");

            option.value = camera.id;

            let label = camera.label;

            // kalau browser tidak memberi nama kamera
            if (!label || label.trim() === "") {

                label = `Camera ${index + 1}`;

            }

            option.textContent = label;

            cameraSelect.appendChild(option);

        });

        // pilih kamera belakang jika ada
        const backCamera = cameras.find(cam => {

            const label = cam.label.toLowerCase();

            return label.includes("back") ||
                   label.includes("rear") ||
                   label.includes("environment");

        });

        if (backCamera) {

            currentCameraId = backCamera.id;

        } else {

            currentCameraId = cameraSelect.value;

        }

        cameraSelect.value = currentCameraId;

    }

    catch (err) {

        console.error(err);

        showToast("Gagal mengambil daftar kamera", "error");

    }

}

// =====================================================
// APPLY VIDEO MIRROR
// =====================================================

function applyVideoMirror() {

    const video = document.querySelector("#reader video");

    if (!video) return;

    // Deteksi apakah kamera depan
    const camera = cameras.find(c => c.id === currentCameraId);

    const label = (camera?.label || "").toLowerCase();

    const isFrontCamera =
        label.includes("front") ||
        label.includes("user");

    if (isFrontCamera) {

        // Kamera depan tetap mirror
        video.style.transform = "scaleX(-1)";

    } else {

        // Kamera belakang & webcam normal
        video.style.transform = "scaleX(1)";

    }

}

// =====================================================
// START CAMERA
// =====================================================

async function startScanner() {

    if (scannerRunning) return;


    html5QrCode = new Html5Qrcode("reader");

    try {

        await html5QrCode.start(

    {

        facingMode: "environment"

    },

            {

                fps: 10,

                qrbox: {

                    width: 250,

                    height: 250

                }

            },

            onScanSuccess,

            onScanFailure

        );

        scannerRunning = true;

// Tunggu video dibuat oleh html5-qrcode
setTimeout(() => {

    applyVideoMirror();

}, 300);

// load daftar kamera sesudah permission

if (!cameraLoaded) {

    await loadCameraList();

    cameraLoaded = true;

}

cameraSelect.onchange = async function () {

    currentCameraId = this.value;

    if (!scannerRunning) return;

    await stopScanner();

    html5QrCode = new Html5Qrcode("reader");

    await html5QrCode.start(

        currentCameraId,

        {

            fps: 10,

            qrbox: {

                width: 250,

                height: 250

            }

        },

        onScanSuccess,

        onScanFailure

    );

    scannerRunning = true;

};

startBtn.disabled = true;

        startBtn.disabled = true;

        stopBtn.disabled = false;

        setStatus("Scanner Aktif", "#22c55e");

        showToast("Scanner aktif", "success");

    }

    catch (err) {

        console.error(err);

        showToast("Tidak dapat membuka kamera", "error");

    }

}

// =====================================================
// STOP CAMERA
// =====================================================

async function stopScanner() {

    if (!scannerRunning) return;

    try {

        await html5QrCode.stop();

        await html5QrCode.clear();

    }

    catch (err) {

        console.error(err);

    }

    scannerRunning = false;

    scanLocked = false;

    startBtn.disabled = false;

    stopBtn.disabled = true;

    setStatus("Scanner Berhenti", "#ef4444");

    showToast("Scanner dihentikan", "warning");

}

// =====================================================
// SCAN IMAGE
// =====================================================
async function scanImage(file) {

    try {

        // Jika scanner sedang aktif
        if (scannerRunning) {

            await stopScanner();

        }

        // Inisialisasi scanner jika belum ada
        if (!html5QrCode) {

            html5QrCode = new Html5Qrcode("reader");

        }

        setStatus("Memproses gambar...", "#3b82f6");

        // false = jangan tampilkan gambar pada div #reader
        const result = await html5QrCode.scanFile(file, false);

        processScanResult(result);

    }

    catch (err) {

        console.error(err);

        showToast("QR Code tidak ditemukan", "error");

        setStatus("QR tidak ditemukan", "#ef4444");

    }

    finally {

        // Bersihkan area reader
        const reader = document.getElementById("reader");

        reader.innerHTML = "";

    }

}

// =====================================================
// CAMERA SUCCESS
// =====================================================

function onScanSuccess(decodedText) {

    processScanResult(decodedText);

}

// =====================================================
// PROCESS RESULT
// =====================================================

function processScanResult(decodedText) {

    if (scanLocked) return;

    scanLocked = true;

    // tampilkan raw data
    setRawData(decodedText);

    // parser
    detectQRType(decodedText);

    // getar HP
    vibrateDevice([120]);

    // toast
    showToast("QR berhasil dipindai", "success");

    // ===========================
    // HISTORY
    // ===========================

    let icon = "📝";
    let type = "Plain Text";

    if (decodedText.startsWith("http")) {

        icon = "🌐";
        type = "Website";

    }

    else if (decodedText.startsWith("WIFI:")) {

        icon = "📶";
        type = "WiFi";

    }

    else if (decodedText.startsWith("mailto:")) {

        icon = "✉️";
        type = "Email";

    }

    else if (decodedText.startsWith("tel:")) {

        icon = "📞";
        type = "Telephone";

    }

    else if (decodedText.startsWith("SMSTO:")) {

        icon = "💬";
        type = "SMS";

    }

    else if (decodedText.startsWith("geo:")) {

        icon = "📍";
        type = "Location";

    }

    else if (decodedText.includes("BEGIN:VCARD")) {

        icon = "👤";
        type = "Contact";

    }

    addHistory({

        icon,

        type,

        data: decodedText

    });

    setStatus("QR berhasil dipindai", "#22c55e");

    // unlock scanner
    setTimeout(() => {

        scanLocked = false;

    }, 1800);

}

// =====================================================
// CAMERA FAILURE
// =====================================================

function onScanFailure(error) {

    // html5-qrcode memanggil ini berkali-kali
    // sengaja dikosongkan agar console tidak penuh

}