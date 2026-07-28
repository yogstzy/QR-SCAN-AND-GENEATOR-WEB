/* ============================================
    QR Scanner Pro
    QR Generator
============================================ */

// =====================================================
// VARIABLE
// =====================================================

let currentType = "website";

let qrCanvas = null;

let qrSVG = "";

let qrDarkColor = "#000000";

let qrLightColor = "#ffffff";

// =====================================================
// INIT
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    initGenerator();
    initQRStyle();

});

// =====================================================
// INIT GENERATOR
// =====================================================

function initGenerator() {

    initTypeButtons();

    renderForm(currentType);

    document
        .getElementById("generateBtn")
        .addEventListener(
            "click",
            generateQRCode
        );

    document
        .getElementById("downloadPngOption")
        .addEventListener(
            "click",
            (e) => {
                e.preventDefault();
                downloadQR();
            }
        );

    document

        .getElementById("downloadSvgOption")

        .addEventListener(

    "click",

    (e) => {

        e.preventDefault();

        downloadSVG();

    }

);

}

// =====================================================
// QR STYLE
// =====================================================

function initQRStyle(){

    const fg =
        document.getElementById("foregroundColor");

    const bg =
        document.getElementById("backgroundColor");

    const reset =
        document.getElementById("resetColorBtn");

    const presets =
        document.querySelectorAll(".preset-btn");

    // ==================================
    // Color Picker
    // ==================================

    fg.addEventListener("input",()=>{

    qrDarkColor = fg.value;

    if(qrCanvas){

        generateQRCode();

    }

});

    bg.addEventListener("input",()=>{

    qrLightColor = bg.value;

    if(qrCanvas){

        generateQRCode();

    }

});

    // ==================================
    // Preset
    // ==================================

    presets.forEach(btn=>{

        btn.addEventListener("click",()=>{

            presets.forEach(x=>{

                x.classList.remove("active");

            });

            btn.classList.add("active");

            qrDarkColor =
                btn.dataset.dark;

            qrLightColor =
                btn.dataset.light;

            fg.value = qrDarkColor;

            bg.value = qrLightColor;

            if(qrCanvas){

    generateQRCode();

}

            showToast(

    "Preset warna diterapkan",

    "success"

);

        });

    });

    // ==================================
    // Reset
    // ==================================

    reset.addEventListener("click",()=>{

        qrDarkColor="#000000";

        qrLightColor="#ffffff";

        fg.value=qrDarkColor;

        bg.value=qrLightColor;

if(qrCanvas){

    generateQRCode();

}

        presets.forEach(x=>{

            x.classList.remove("active");

        });

        showToast(

            "Warna QR berhasil direset",

            "success"

        );

    });

}

// =====================================================
// TYPE BUTTON
// =====================================================

function initTypeButtons() {

    const buttons =
        document.querySelectorAll(".qr-type");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            buttons.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            currentType =
                button.dataset.type;

            renderForm(currentType);

            disableDownload();

            showPlaceholder();

        });

    });

}

// =====================================================
// RENDER FORM
// =====================================================

function renderForm(type) {

    const form =
        document.getElementById("dynamicForm");

    switch (type) {

        case "website":

            form.innerHTML =
                getWebsiteForm();

            break;

        case "wifi":

            form.innerHTML =
                getWifiForm();

            break;

        case "text":

            form.innerHTML =
                getTextForm();

            break;

        case "phone":

            form.innerHTML =
                getPhoneForm();

            break;

        case "email":

            form.innerHTML =
                getEmailForm();

            break;

        case "sms":

            form.innerHTML =
                getSMSForm();

            break;

        case "location":

            form.innerHTML =
                getLocationForm();

            break;

        case "contact":

            form.innerHTML =
                getContactForm();

            break;

        case "whatsapp":

            form.innerHTML =
                getWhatsappForm();

            break;

    }

}

// =====================================================
// FORM WEBSITE
// =====================================================

function getWebsiteForm() {

return `

<label class="form-label">

    URL Website

</label>

<input

    type="url"

    class="form-control"

    id="qrInput"

    placeholder="https://example.com"

>

`;

}

// =====================================================
// FORM WIFI
// =====================================================

function getWifiForm(){

return`

<div class="mb-3">

<label class="form-label">

SSID

</label>

<input

class="form-control"

id="ssid"

placeholder="Nama WiFi"

>

</div>

<div class="mb-3">

<label class="form-label">

Password

</label>

<input

class="form-control"

id="password"

placeholder="Password"

>

</div>

<div>

<label class="form-label">

Security

</label>

<select

class="form-select"

id="security">

<option>WPA</option>

<option>WPA2</option>

<option>WEP</option>

<option>None</option>

</select>

</div>

`;

}

// =====================================================
// FORM TEXT
// =====================================================

function getTextForm(){

return`

<label class="form-label">

Plain Text

</label>

<textarea

class="form-control"

rows="5"

id="qrInput"

placeholder="Masukkan teks..."

></textarea>

`;

}

// =====================================================
// FORM PHONE
// =====================================================

function getPhoneForm(){

return`

<div class="mb-3">

<label class="form-label">

Nomor Telepon

</label>

<input

type="tel"

class="form-control"

id="phone"

placeholder="08123456xxx"

>

</div>

`;

}

// =====================================================
// FORM EMAIL
// =====================================================

function getEmailForm(){

return`

<div class="mb-3">

<label class="form-label">

Email

</label>

<input

type="email"

class="form-control"

id="email"

placeholder="nama@email.com"

>

</div>

<div class="mb-3">

<label class="form-label">

Subject

</label>

<input

class="form-control"

id="subject"

placeholder="Judul Email"

>

</div>

<div>

<label class="form-label">

Pesan

</label>

<textarea

rows="4"

class="form-control"

id="body"

placeholder="Isi Email"

></textarea>

</div>

`;

}

// =====================================================
// FORM SMS
// =====================================================

function getSMSForm(){

return`

<div class="mb-3">

<label class="form-label">

Nomor

</label>

<input

class="form-control"

id="smsNumber"

placeholder="08123456xxx"

>

</div>

<div>

<label class="form-label">

Pesan

</label>

<textarea

rows="4"

class="form-control"

id="smsMessage"

placeholder="Isi SMS"

></textarea>

</div>

`;

}

// =====================================================
// FORM LOCATION
// =====================================================

function getLocationForm(){

return`

<div class="mb-3">

<label class="form-label">

Latitude

</label>

<input

type="number"

step="any"

class="form-control"

id="latitude"

placeholder="-7.795580"

>

</div>

<div>

<label class="form-label">

Longitude

</label>

<input

type="number"

step="any"

class="form-control"

id="longitude"

placeholder="110.369490"

>

</div>

`;

}

// =====================================================
// FORM CONTACT
// =====================================================

function getContactForm(){

return`

<div class="mb-3">

<label class="form-label">

Nama

</label>

<input

class="form-control"

id="contactName"

placeholder="Kurang tau"

>

</div>

<div class="mb-3">

<label class="form-label">

Nomor HP

</label>

<input

class="form-control"

id="contactPhone"

placeholder="08123456xxx"

>

</div>

<div class="mb-3">

<label class="form-label">

Email

</label>

<input

type="email"

class="form-control"

id="contactEmail"

placeholder="kurangtau@email.com"

>

</div>

<div class="mb-3">

<label class="form-label">

Website

</label>

<input

class="form-control"

id="contactWebsite"

placeholder="https://website.com"

>

</div>

<div>

<label class="form-label">

Alamat

</label>

<textarea

rows="3"

class="form-control"

id="contactAddress"

placeholder="Alamat"

></textarea>

</div>

`;

}

// =====================================================
// FORM WHATSAPP
// =====================================================

function getWhatsappForm(){

return`

<div class="mb-3">

<label class="form-label">

Nomor WhatsApp

</label>

<input

class="form-control"

id="waNumber"

placeholder="62812345xxx"

>

</div>

<div>

<label class="form-label">

Pesan

</label>

<textarea

rows="4"

class="form-control"

id="waMessage"

placeholder="Halo..."

></textarea>

</div>

`;

}

// =====================================================
// BUILD QR DATA
// =====================================================

function buildQRData(){

    switch(currentType){

        case "website":

            return buildWebsiteQR();

        case "wifi":

            return buildWifiQR();

        case "text":

            return buildTextQR();

        case "phone":

            return buildPhoneQR();

        case "email":

            return buildEmailQR();

        case "sms":

            return buildSMSQR();

        case "location":

            return buildLocationQR();

        case "contact":

            return buildContactQR();

        case "whatsapp":

            return buildWhatsappQR();

        default:

            return "";

    }

}

// =====================================================
// WEBSITE
// =====================================================

function buildWebsiteQR(){

    return getValue("qrInput");

}

// =====================================================
// TEXT
// =====================================================

function buildTextQR(){

    return getValue("qrInput");

}

// =====================================================
// WIFI
// =====================================================

function buildWifiQR(){

    const ssid = getValue("ssid");

    const password = getValue("password");

    const security = getValue("security");

    if(ssid===""){

        return "";

    }

    return `WIFI:T:${security};S:${ssid};P:${password};;`;

}

// =====================================================
// PHONE
// =====================================================

function buildPhoneQR(){

    const phone = getValue("phone");

    if(phone===""){

        return "";

    }

    return `tel:${phone}`;

}

// =====================================================
// EMAIL
// =====================================================

function buildEmailQR(){

    const email = getValue("email");

    const subject =
        encodeURIComponent(getValue("subject"));

    const body =
        encodeURIComponent(getValue("body"));

    if(email===""){

        return "";

    }

    return `mailto:${email}?subject=${subject}&body=${body}`;

}

// =====================================================
// SMS
// =====================================================

function buildSMSQR(){

    const number =
        getValue("smsNumber");

    const message =
        getValue("smsMessage");

    if(number===""){

        return "";

    }

    return `SMSTO:${number}:${message}`;

}

// =====================================================
// LOCATION
// =====================================================

function buildLocationQR(){

    const lat =
        getValue("latitude");

    const lng =
        getValue("longitude");

    if(lat==="" || lng===""){

        return "";

    }

    return `geo:${lat},${lng}`;

}

// =====================================================
// CONTACT
// =====================================================

function buildContactQR(){

    const name =
        getValue("contactName");

    const phone =
        getValue("contactPhone");

    const email =
        getValue("contactEmail");

    const website =
        getValue("contactWebsite");

    const address =
        getValue("contactAddress");

    if(name===""){

        return "";

    }

    return `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL:${phone}
EMAIL:${email}
URL:${website}
ADR:${address}
END:VCARD`;

}

// =====================================================
// WHATSAPP
// =====================================================

function buildWhatsappQR(){

    const number =
        getValue("waNumber");

    const message =
        encodeURIComponent(
            getValue("waMessage")
        );

    if(number===""){

        return "";

    }

    return `https://wa.me/${number}?text=${message}`;

}

// =====================================================
// GENERATE QR
// =====================================================

async function generateQRCode(){

    const value = buildQRData();

    if(value===""){

        showToast(

            "Silakan lengkapi data terlebih dahulu",

            "warning"

        );

        return;

    }

    clearPreview();

    try{

        qrCanvas = document.createElement("canvas");

        // ===========================
        // Canvas
        // ===========================

        await QRCode.toCanvas(

            qrCanvas,

            value,

            {

                width:280,

                margin:2,

                errorCorrectionLevel:"H",

                color:{

                    dark:qrDarkColor,

                    light:qrLightColor

                }

            }

        );

        // ===========================
        // SVG
        // ===========================

        qrSVG = await QRCode.toString(

            value,

            {

                type:"svg",

                margin:2,

                errorCorrectionLevel:"H",

                color:{

                    dark:qrDarkColor,

                    light:qrLightColor

                }

            }

        );

        // ===========================
        // Preview
        // ===========================

        document

            .getElementById("qrPreview")

            .appendChild(qrCanvas);

        // ===========================
        // Enable Download
        // ===========================

        enableDownload();

        showToast(

            "QR Code berhasil dibuat",

            "success"

        );

    }

    catch(err){

        console.error(err);

        showToast(

            "Gagal membuat QR Code",

            "error"

        );

    }

}

// =====================================================
// DOWNLOAD QR
// =====================================================

function downloadQR(){

    if(!qrCanvas){

        return;

    }

    const link =
        document.createElement("a");

    link.download =
        `QR-${currentType}.png`;

    link.href =
        qrCanvas.toDataURL("image/png");

    link.click();
        showToast(

        "QR berhasil diunduh",

        "success"

);

}

// ======================================
// DOWNLOAD SVG
// ======================================

function downloadSVG(){

    if(!qrSVG){

        return;

    }

    const blob =

        new Blob(

            [qrSVG],

            {

                type:"image/svg+xml"

            }

        );

    const url =

        URL.createObjectURL(blob);

    const link =

        document.createElement("a");

    link.href = url;

    link.download =

        `QR-${currentType}.svg`;

    document.body.appendChild(link);

    link.click();
    
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);

    showToast(

        "SVG berhasil diunduh",

        "success"

    );

}

// =====================================================
// HELPER
// =====================================================

function getValue(id){

    const element =
        document.getElementById(id);

    if(!element){

        return "";

    }

    return element.value.trim();

}

// ===========================================

function enableDownload(){

    document
        .getElementById("downloadDropdownBtn")
        .disabled = false;

}

// ===========================================

function disableDownload(){

    document
        .getElementById("downloadDropdownBtn")
        .disabled = true;

}

// ===========================================

function clearPreview(){

    document
        .getElementById("qrPreview")
        .innerHTML = "";

}

// ===========================================

function showPlaceholder(){

    const preview =
        document.getElementById("qrPreview");

    preview.innerHTML = `

        <div class="preview-placeholder">

            <i class="bi bi-qr-code"></i>

            <p class="mt-3 mb-0">

                QR Code akan muncul di sini

            </p>

        </div>

    `;

}

// =====================================================
// TOAST
// =====================================================

function showToast(message, type="success"){

    const toast =
        document.getElementById("appToast");

    const body =
        document.getElementById("toastMessage");

    body.textContent = message;

    toast.className =
        "toast align-items-center border-0";

    switch(type){

        case "success":

            toast.classList.add("text-bg-success");

        break;

        case "error":

            toast.classList.add("text-bg-danger");

        break;

        case "warning":

            toast.classList.add("text-bg-warning");

        break;

        case "info":

            toast.classList.add("text-bg-primary");

        break;

    }

    const bsToast =
        bootstrap.Toast.getOrCreateInstance(toast);

    bsToast.show();

}