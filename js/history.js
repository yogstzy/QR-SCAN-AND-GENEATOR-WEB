/* ============================================
    QR Scanner Pro
    History Module
============================================ */

const STORAGE_KEY = "qrscanner_history";

let scanHistory = [];

// ============================================
// INIT
// ============================================

function loadHistory(){

    const data = localStorage.getItem(STORAGE_KEY);

    if(data){

        scanHistory = JSON.parse(data);

    }

    renderHistory();

}

// ============================================
// SAVE
// ============================================

function saveHistory(){

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(scanHistory)

    );

}

// ============================================
// ADD
// ============================================

function addHistory(item){

    item.id = Date.now();

    item.time = new Date().toLocaleTimeString("id-ID");

    item.date = new Date().toLocaleDateString("id-ID");

    scanHistory.unshift(item);

    if(scanHistory.length>20){

        scanHistory.pop();

    }

    saveHistory();

    renderHistory();

}

// ============================================
// CLEAR
// ============================================

function clearHistory(){

    scanHistory=[];

    saveHistory();

    renderHistory();

}

// ============================================
// RENDER
// ============================================

function renderHistory(){

    const historyList=document.getElementById("historyList");

    if(!historyList) return;

    if(scanHistory.length===0){

        historyList.innerHTML=`

            <div class="history-empty">

                Belum ada riwayat scan.

            </div>

        `;

        return;

    }

    let html="";

    scanHistory.forEach(item=>{

        html+=`

        <div class="history-item">

            <div class="history-header">

                <span>

                    ${item.icon}

                    ${item.type}

                </span>

                <small>

                    ${item.time}

                </small>

            </div>

            <div class="history-data">

                ${item.data}

            </div>

        </div>

        `;

    });

    historyList.innerHTML=html;

}