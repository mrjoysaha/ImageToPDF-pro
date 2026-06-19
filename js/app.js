/* ==========================================
   Image to PDF Pro Ultimate
   app.js
========================================== */

/* Global State */

window.APP = {

    images: [],

    cropper: null,

    currentCropIndex: null,

    settings: {

        filename: "image-to-pdf",

        pageFormat: "a4",

        orientation: "portrait",

        margin: 10,

        fitMode: "contain",

        compression: 0.9,

        watermark: "",

        pageNumbers: true,

        darkMode: false

    }

};

/* ==========================================
   APP INITIALIZATION
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    initApp
);

function initApp(){

    console.log(
        "Image to PDF Pro Ultimate Loaded"
    );

    bindControls();

    loadSettings();

    Storage.loadImages();

    UI.renderImages();

    UI.updateStats();

    DragDrop.init();

    setupDarkMode();

    setupCropModal();

    setupPreviewModal();

}

/* ==========================================
   CONTROL EVENTS
========================================== */

function bindControls(){

   document
.getElementById(
    "compressAllBtn"
)
.addEventListener(
    "click",
    ()=>{

        ImageCompressor
        .compressAll();

    }
);

    document
    .getElementById("imageInput")
    .addEventListener(
        "change",
        handleFileSelect
    );

    document
    .getElementById("generatePdfBtn")
    .addEventListener(
        "click",
        PDFGenerator.generate
    );

    document
    .getElementById("clearBtn")
    .addEventListener(
        "click",
        clearAllImages
    );

    document
    .getElementById("downloadZipBtn")
    .addEventListener(
        "click",
        downloadZipPlaceholder
    );

    document
    .getElementById("darkModeBtn")
    .addEventListener(
        "click",
        toggleDarkMode
    );

    document
    .getElementById("applyCropBtn")
    .addEventListener(
        "click",
        applyCrop
    );

    document
    .getElementById("closeCropBtn")
    .addEventListener(
        "click",
        closeCropModal
    );

    document
    .getElementById("closePreviewBtn")
    .addEventListener(
        "click",
        closePreviewModal
    );

    bindSettingInputs();

}

/* ==========================================
   SETTINGS
========================================== */

function bindSettingInputs(){

    const map = {

        pdfName: "filename",

        pageFormat: "pageFormat",

        orientation: "orientation",

        margin: "margin",

        fitMode: "fitMode",

        compression: "compression",

        watermark: "watermark"

    };

    Object.keys(map)
    .forEach(id => {

        const el =
        document.getElementById(id);

        if(!el) return;

        el.addEventListener(
            "input",
            () => {

                APP.settings[
                    map[id]
                ] = el.value;

                saveSettings();

            }
        );

    });

    const pageNumbers =
    document.getElementById(
        "pageNumbers"
    );

    pageNumbers.addEventListener(
        "change",
        () => {

            APP.settings.pageNumbers =
                pageNumbers.value === "yes";

            saveSettings();

        }
    );

}

/* ==========================================
   IMAGE UPLOAD
========================================== */

async function handleFileSelect(event){

    const files =
    [...event.target.files];

    await processFiles(files);

    event.target.value = "";

}

async function processFiles(files){

    for(const file of files){

        if(
            !file.type.startsWith(
                "image/"
            )
        ){
            continue;
        }

        const image =
        await readFile(file);

        APP.images.push({

            id:
            crypto.randomUUID(),

            name:
            file.name,

            size:
            file.size,

            rotation:0,

            src:image

        });

    }

    Storage.saveImages();

    UI.renderImages();

    UI.updateStats();

    UI.toast(
        `${files.length} image(s) added`,
        "success"
    );

}

function readFile(file){

    return new Promise(
        resolve => {

            const reader =
            new FileReader();

            reader.onload =
            e => resolve(
                e.target.result
            );

            reader.readAsDataURL(
                file
            );

        }
    );

}

/* ==========================================
   CLEAR ALL
========================================== */

function clearAllImages(){

    if(
        !confirm(
            "Remove all images?"
        )
    ){
        return;
    }

    APP.images = [];

    Storage.clearImages();

    UI.renderImages();

    UI.updateStats();

    UI.toast(
        "Images cleared",
        "warning"
    );

}

/* ==========================================
   DARK MODE
========================================== */

function setupDarkMode(){

    if(
        APP.settings.darkMode
    ){

        document.body
        .classList.add(
            "dark"
        );

    }

}

function toggleDarkMode(){

    APP.settings.darkMode =
    !APP.settings.darkMode;

    document.body
    .classList.toggle(
        "dark"
    );

    saveSettings();

}

/* ==========================================
   SETTINGS STORAGE
========================================== */

function saveSettings(){

    localStorage.setItem(
        "img2pdf-settings",
        JSON.stringify(
            APP.settings
        )
    );

}

function loadSettings(){

    const saved =
    localStorage.getItem(
        "img2pdf-settings"
    );

    if(!saved) return;

    try{

        APP.settings =
        {
            ...APP.settings,
            ...JSON.parse(saved)
        };

        applySettings();

    }

    catch(error){

        console.error(
            error
        );

    }

}

function applySettings(){

    setValue(
        "pdfName",
        APP.settings.filename
    );

    setValue(
        "pageFormat",
        APP.settings.pageFormat
    );

    setValue(
        "orientation",
        APP.settings.orientation
    );

    setValue(
        "margin",
        APP.settings.margin
    );

    setValue(
        "fitMode",
        APP.settings.fitMode
    );

    setValue(
        "compression",
        APP.settings.compression
    );

    setValue(
        "watermark",
        APP.settings.watermark
    );

    document
    .getElementById(
        "pageNumbers"
    ).value =
    APP.settings.pageNumbers
    ? "yes"
    : "no";

}

function setValue(id,value){

    const el =
    document.getElementById(
        id
    );

    if(el){
        el.value = value;
    }

}

/* ==========================================
   CROP MODAL
========================================== */

function setupCropModal(){

    const img =
    document.getElementById(
        "cropImage"
    );

    if(!img) return;

}

function openCropModal(
    imageSrc,
    index
){

    APP.currentCropIndex =
    index;

    const modal =
    document.getElementById(
        "cropModal"
    );

    const img =
    document.getElementById(
        "cropImage"
    );

    img.src = imageSrc;

    modal.style.display =
    "flex";

    if(APP.cropper){

        APP.cropper.destroy();

    }

    APP.cropper =
    new Cropper(
        img,
        {
            viewMode:1
        }
    );

}

function applyCrop(){

    if(
        !APP.cropper
    ){
        return;
    }

    const canvas =
    APP.cropper
    .getCroppedCanvas();

    const newSrc =
    canvas.toDataURL(
        "image/jpeg",
        0.95
    );

    APP.images[
        APP.currentCropIndex
    ].src = newSrc;

    Storage.saveImages();

    UI.renderImages();

    closeCropModal();

    UI.toast(
        "Crop applied",
        "success"
    );

}

function closeCropModal(){

    const modal =
    document.getElementById(
        "cropModal"
    );

    modal.style.display =
    "none";

    if(APP.cropper){

        APP.cropper.destroy();

        APP.cropper =
        null;

    }

}

/* ==========================================
   PDF PREVIEW
========================================== */

function setupPreviewModal(){}

function openPreviewModal(
    pdfUrl
){

    const frame =
    document.getElementById(
        "pdfPreviewFrame"
    );

    frame.src =
    pdfUrl;

    document
    .getElementById(
        "previewModal"
    )
    .style.display =
    "flex";

}

function closePreviewModal(){

    document
    .getElementById(
        "previewModal"
    )
    .style.display =
    "none";

}

/* ==========================================
   ZIP DOWNLOAD
========================================== */

function downloadZipPlaceholder(){

    ZipDownload.download();

}

/* ==========================================
   GLOBAL ACCESS
========================================== */

window.openCropModal =
openCropModal;

window.openPreviewModal =
openPreviewModal;
