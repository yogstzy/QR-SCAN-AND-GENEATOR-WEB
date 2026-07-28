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

let cameras = [];

let currentCameraId = null;

// =====================================================
// INIT
// =====================================================

async function initScanner() {

    document
        .getElementById("startBtn")
        .addEventListener("click", startScanner);

    document
        .getElementById("stopBtn")
        .addEventListener("click", stopScanner);

    document
        .getElementById("uploadBtn")
        .addEventListener("click", () => {

            document
                .getElementById("imageInput")
                .click();

        });

    document
        .getElementById("imageInput")
        .addEventListener(
            "change",
            async (e) => {

                if (!e.target.files.length) return;

                await scanImage(e.target.files[0]);

                e.target.value = "";

            }
        );

    document
        .getElementById("cameraSelect")
        .addEventListener(
            "change",
            async function () {

                if (!this.value) return;

                currentCameraId = this.value;

                if (!scannerRunning) return;

                await switchCamera(currentCameraId);

            }
        );

}

// =====================================================
// LOAD CAMERA
// =====================================================

async function loadCameraList() {

    const select =
        document.getElementById("cameraSelect");

    cameras =
        await Html5Qrcode.getCameras();

    select.innerHTML = "";

    if (cameras.length === 0) {

        select.innerHTML = `

<option value="">

Tidak ada kamera

</option>

`;

        return;

    }

    cameras.forEach((camera, index) => {

        const option =
            document.createElement("option");

        option.value =
            camera.id;

        option.textContent =
            camera.label ||
            `Camera ${index + 1}`;

        select.appendChild(option);

    });

    const backCamera =

        cameras.find(camera => {

            const label =
                camera.label.toLowerCase();

            return (

                label.includes("back") ||

                label.includes("rear") ||

                label.includes("environment")

            );

        });

    currentCameraId =

        backCamera ?

        backCamera.id :

        cameras[0].id;

    select.value =
        currentCameraId;

}

// =====================================================
// START
// =====================================================

async function startScanner() {

    if (scannerRunning) return;

    try {

        html5QrCode =
            new Html5Qrcode("reader");

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

        startBtn.disabled = true;

        stopBtn.disabled = false;

        setStatus(

            "Scanner Aktif",

            "#22c55e"

        );

        await loadCameraList();

        await switchCamera(currentCameraId);

        showToast(

            "Scanner aktif",

            "success"

        );

    }

    catch (err) {

        console.error(err);

        showToast(

            "Tidak dapat membuka kamera",

            "error"

        );

    }

}

// =====================================================
// SWITCH CAMERA
// =====================================================

async function switchCamera(cameraId) {

    try {

        if (html5QrCode) {

            await html5QrCode.stop();

            await html5QrCode.clear();

        }

    }

    catch (e) {}

    html5QrCode =
        new Html5Qrcode("reader");

    await html5QrCode.start(

        cameraId,

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

    removeMirror();

}

// =====================================================
// REMOVE MIRROR
// =====================================================

function removeMirror() {

    const interval =

        setInterval(() => {

            const video =

                document.querySelector(

                    "#reader video"

                );

            if (!video) return;

            clearInterval(interval);

            video.style.transform = "scaleX(1)";

        }, 100);

}

// =====================================================
// STOP
// =====================================================

async function stopScanner() {

    if (!scannerRunning) return;

    try {

        await html5QrCode.stop();

        await html5QrCode.clear();

    }

    catch (e) {}

    scannerRunning = false;

    scanLocked = false;

    startBtn.disabled = false;

    stopBtn.disabled = true;

    setStatus(

        "Scanner Berhenti",

        "#ef4444"

    );

    showToast(

        "Scanner dihentikan",

        "warning"

    );

}

// =====================================================
// SCAN IMAGE
// =====================================================

async function scanImage(file) {

    try {

        if (scannerRunning) {

            await stopScanner();

        }

        html5QrCode = new Html5Qrcode("reader");

        setStatus(

            "Memproses gambar...",

            "#3b82f6"

        );

        const result = await html5QrCode.scanFile(

            file,

            false

        );

        processScanResult(result);

    }

    catch (err) {

        console.error(err);

        showToast(

            "QR Code tidak ditemukan",

            "error"

        );

        setStatus(

            "QR tidak ditemukan",

            "#ef4444"

        );

    }

    finally {

        document
            .getElementById("reader")
            .innerHTML = "";

    }

}

// =====================================================
// SUCCESS
// =====================================================

function onScanSuccess(decodedText) {

    processScanResult(decodedText);

}

// =====================================================
// FAILURE
// =====================================================

function onScanFailure() {

    // kosongkan saja
    // html5-qrcode memanggil fungsi ini berkali-kali

}

// =====================================================
// PROCESS RESULT
// =====================================================

function processScanResult(decodedText) {

    if (scanLocked) return;

    scanLocked = true;

    setRawData(decodedText);

    detectQRType(decodedText);

    vibrateDevice([120]);

    showToast(

        "QR berhasil dipindai",

        "success"

    );

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

    setStatus(

        "QR berhasil dipindai",

        "#22c55e"

    );

    setTimeout(() => {

        scanLocked = false;

    }, 1500);

}

// =====================================================
// HELPER
// =====================================================

function resetScannerState() {

    scanLocked = false;

    scannerRunning = false;

}

function enableScannerButton() {

    startBtn.disabled = false;

    stopBtn.disabled = true;

}

function disableScannerButton() {

    startBtn.disabled = true;

    stopBtn.disabled = false;

}

function clearReader() {

    const reader =

        document.getElementById("reader");

    if (reader) {

        reader.innerHTML = "";

    }

}

// =====================================================
// OPTIONAL CLEANUP
// =====================================================

window.addEventListener(

    "beforeunload",

    async () => {

        try {

            if (

                html5QrCode &&

                scannerRunning

            ) {

                await html5QrCode.stop();

                await html5QrCode.clear();

            }

        }

        catch (e) {}

    }

);
