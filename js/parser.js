/* ============================================
    QR Scanner Pro
    Parser Module
============================================ */

// =====================================================
// DETECT
// =====================================================

function detectQRType(text) {

    setRawData(text);

    if (text.startsWith("WIFI:")) {
        parseWifi(text);
        return;
    }

    if (text.startsWith("http://") || text.startsWith("https://")) {
        parseWebsite(text);
        return;
    }

    if (text.startsWith("mailto:")) {
        parseEmail(text);
        return;
    }

    if (text.startsWith("tel:")) {
        parsePhone(text);
        return;
    }

    if (text.startsWith("SMSTO:")) {
        parseSMS(text);
        return;
    }

    if (text.startsWith("geo:")) {
        parseLocation(text);
        return;
    }

    if (text.includes("BEGIN:VCARD")) {
        parseVCard(text);
        return;
    }

    parsePlainText(text);

}

// =====================================================
// WEBSITE
// =====================================================

function parseWebsite(url) {

    setQRType("🌐 Website", "primary");

    let domain = "-";

    try {
        domain = new URL(url).hostname;
    } catch {}

    renderInfo([
        ["Domain", domain],
        [
            "URL",
            `<a href="${url}" target="_blank">${url}</a>`
        ]
    ]);

    renderQuickAction({
        label: "🌍 Buka Website",
        icon: "bi-box-arrow-up-right",
        type: "link",
        url: url
    });

}

// =====================================================
// WIFI
// =====================================================

function parseWifi(text) {

    setQRType("📶 WiFi", "success");

    let ssid = "-";
    let password = "-";
    let security = "-";

    text = text.replace("WIFI:", "");

    text.split(";").forEach(item => {

        if (item.startsWith("S:"))
            ssid = item.substring(2);

        if (item.startsWith("P:"))
            password = item.substring(2);

        if (item.startsWith("T:"))
            security = item.substring(2);

    });

    renderInfo([
        ["SSID", ssid],
        ["Password", password],
        ["Security", security]
    ]);

    renderQuickAction({
        label: "📋 Copy Password",
        icon: "bi-copy",
        type: "copy",
        value: password
    });

}

// =====================================================
// EMAIL
// =====================================================

function parseEmail(text) {

    setQRType("✉️ Email", "warning");

    const email = text.replace("mailto:", "");

    renderInfo([
        ["Email", email]
    ]);

    renderQuickAction({
        label: "✉️ Kirim Email",
        icon: "bi-envelope-fill",
        type: "link",
        url: text
    });

}

// =====================================================
// PHONE
// =====================================================

function parsePhone(text) {

    setQRType("📞 Telephone", "danger");

    const phone = text.replace("tel:", "");

    renderInfo([
        ["Nomor", phone]
    ]);

    renderQuickAction({
        label: "📞 Hubungi",
        icon: "bi-telephone-fill",
        type: "link",
        url: text
    });

}

// =====================================================
// SMS
// =====================================================

function parseSMS(text) {

    setQRType("💬 SMS", "info");

    let arr = text.replace("SMSTO:", "").split(":");

    renderInfo([
        ["Nomor", arr[0]],
        ["Pesan", arr.slice(1).join(":")]
    ]);

    renderQuickAction({
        label: "💬 Kirim SMS",
        icon: "bi-chat-dots-fill",
        type: "link",
        url: text
    });

}

// =====================================================
// LOCATION
// =====================================================

function parseLocation(text) {

    setQRType("📍 Location", "secondary");

    let arr = text.replace("geo:", "").split(",");

    const mapsUrl = `https://maps.google.com/?q=${arr[0]},${arr[1]}`;

    renderInfo([
        ["Latitude", arr[0]],
        ["Longitude", arr[1]]
    ]);

    renderQuickAction({
        label: "📍 Buka Maps",
        icon: "bi-geo-alt-fill",
        type: "link",
        url: mapsUrl
    });

}

// =====================================================
// VCARD
// =====================================================

function parseVCard(text) {

    setQRType("👤 Contact", "dark");

    let nama = "-";
    let tel = "-";
    let email = "-";

    text.split("\n").forEach(line => {

        if (line.startsWith("FN:"))
            nama = line.substring(3);

        if (line.startsWith("TEL"))
            tel = line.substring(line.indexOf(":") + 1);

        if (line.startsWith("EMAIL"))
            email = line.substring(line.indexOf(":") + 1);

    });

    renderInfo([
        ["Nama", nama],
        ["Telepon", tel],
        ["Email", email]
    ]);

    renderQuickAction({
        label: "📞 Hubungi",
        icon: "bi-person-lines-fill",
        type: "copy",
        value: tel
    });

}

// =====================================================
// TEXT
// =====================================================

function parsePlainText(text) {

    setQRType("📝 Plain Text", "secondary");

    renderInfo([
        ["Text", text]
    ]);

    renderQuickAction({
        label: "📋 Copy Text",
        icon: "bi-copy",
        type: "copy",
        value: text
    });

}