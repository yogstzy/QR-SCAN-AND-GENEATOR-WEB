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

    const uploadBtn =
        document.getElementById("uploadBtn");

    const imageInput =
        document.getElementById("imageInput");

    const cameraSelect =
        document.getElementById("cameraSelect");

    // tombol

    startBtn.addEventListener(
        "click",
        startScanner
    );

    stopBtn.addEventListener(
        "click",
        stopScanner
    );

    // upload image

    uploadBtn.addEventListener(
        "click",
        () => imageInput.click()
    );

    imageInput.addEventListener(
        "change",
        async (e)=>{

            if(!e.target.files.length){

                return;

            }

            await scanImage(e.target.files[0]);

            imageInput.value="";

        }
    );

    // switch camera

    cameraSelect.addEventListener(
        "change",
        async ()=>{

            if(!cameraSelect.value){

                return;

            }

            currentCameraId =
                cameraSelect.value;

            if(scannerRunning){

                await switchCamera(currentCameraId);

            }

        }
    );

}
// =====================================================
// LOAD CAMERA LIST
// =====================================================

async function loadCameraList(){

    const cameraSelect =
        document.getElementById("cameraSelect");

    try{

        cameras =
            await Html5Qrcode.getCameras();

        cameraSelect.innerHTML = "";

        if(cameras.length===0){

            cameraSelect.innerHTML=`

<option value="">

Tidak ada kamera

</option>

`;

            return;

        }

        cameras.forEach((camera,index)=>{

            const option =
                document.createElement("option");

            option.value =
                camera.id;

            let label =
                camera.label;

            if(!label){

                label =
                    `Camera ${index+1}`;

            }

            option.textContent =
                label;

            cameraSelect.appendChild(option);

        });

        // ==========================
        // pilih kamera belakang
        // ==========================

        const backCamera = cameras.find(cam=>{

            const label =
                (cam.label||"").toLowerCase();

            return(

                label.includes("back") ||

                label.includes("rear") ||

                label.includes("environment")

            );

        });

        if(backCamera){

            currentCameraId =
                backCamera.id;

        }

        else{

            currentCameraId =
                cameras[0].id;

        }

        cameraSelect.value =
            currentCameraId;

    }

    catch(err){

        console.error(err);

        showToast(
            "Gagal mengambil daftar kamera",
            "error"
        );

    }

}
// =====================================================
// SWITCH CAMERA
// =====================================================

async function switchCamera(cameraId){

    try{

        await stopScanner(false);

        await startScanner(cameraId);

    }

    catch(err){

        console.error(err);

    }

}
// =====================================================
// START CAMERA
// =====================================================

async function startScanner(cameraId = null){

    if(scannerRunning){

        return;

    }

    try{

        // ======================
        // Minta permission dulu
        // ======================

        if(cameras.length===0){

            await loadCameraList();

        }

        if(cameraId){

            currentCameraId =
                cameraId;

        }

        if(!currentCameraId){

            currentCameraId =
                cameras[0].id;

        }

        html5QrCode =
            new Html5Qrcode("reader");

        await html5QrCode.start(

            currentCameraId,

            {

                fps:10,

                qrbox:{

                    width:250,

                    height:250

                },

                aspectRatio:1

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

        showToast(
            "Scanner aktif",
            "success"
        );

    }

    catch(err){

        console.error(err);

        showToast(
            "Tidak dapat membuka kamera",
            "error"
        );

    }

}
// =====================================================
// STOP CAMERA
// =====================================================

async function stopScanner(showMessage = true){

    if(!scannerRunning){

        return;

    }

    try{

        await html5QrCode.stop();

        await html5QrCode.clear();

    }

    catch(err){

        console.error(err);

    }

    scannerRunning = false;

    scanLocked = false;

    html5QrCode = null;

    startBtn.disabled = false;

    stopBtn.disabled = true;

    setStatus(
        "Scanner Berhenti",
        "#ef4444"
    );

    if(showMessage){

        showToast(
            "Scanner dihentikan",
            "warning"
        );

    }

}

// =====================================================
// SCAN IMAGE
// =====================================================

async function scanImage(file){

    try{

        if(scannerRunning){

            await stopScanner(false);

        }

        html5QrCode =
            new Html5Qrcode("reader");

        setStatus(
            "Memproses gambar...",
            "#3b82f6"
        );

        const result =
            await html5QrCode.scanFile(
                file,
                false
            );

        processScanResult(result);

        await html5QrCode.clear();

        html5QrCode = null;

    }

    catch(err){

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

}

// =====================================================
// SUCCESS
// =====================================================

function onScanSuccess(decodedText){

    processScanResult(decodedText);

}

// =====================================================
// FAILURE
// =====================================================

function onScanFailure(error){

    // sengaja dikosongkan

}

// =====================================================
// PROCESS RESULT
// =====================================================

function processScanResult(decodedText){

    if(scanLocked){

        return;

    }

    scanLocked = true;

    setRawData(decodedText);

    detectQRType(decodedText);

    vibrateDevice([120]);

    showToast(
        "QR berhasil dipindai",
        "success"
    );

    let icon="📝";
    let type="Plain Text";

    if(decodedText.startsWith("http")){

        icon="🌐";
        type="Website";

    }

    else if(decodedText.startsWith("WIFI:")){

        icon="📶";
        type="WiFi";

    }

    else if(decodedText.startsWith("mailto:")){

        icon="✉️";
        type="Email";

    }

    else if(decodedText.startsWith("tel:")){

        icon="📞";
        type="Telephone";

    }

    else if(decodedText.startsWith("SMSTO:")){

        icon="💬";
        type="SMS";

    }

    else if(decodedText.startsWith("geo:")){

        icon="📍";
        type="Location";

    }

    else if(decodedText.includes("BEGIN:VCARD")){

        icon="👤";
        type="Contact";

    }

    addHistory({

        icon,

        type,

        data:decodedText

    });

    setStatus(
        "QR berhasil dipindai",
        "#22c55e"
    );

    setTimeout(()=>{

        scanLocked=false;

    },1500);

}
