// Global App State
window.images = [];

document.addEventListener(
    "DOMContentLoaded",
    () => {
        console.log(
            "Image to PDF Pro Loaded."
        );

        Storage.load();
        UI.init();
        DragDrop.init();
        PDFGenerator.init();
    }
);