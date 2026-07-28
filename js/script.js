/* ============================================
    QR Scanner Pro
    Main Script
============================================ */

document.addEventListener("DOMContentLoaded", async () => {

    initUI();

    loadHistory();

    await initScanner();

});