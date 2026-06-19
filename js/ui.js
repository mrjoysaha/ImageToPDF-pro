/* ==========================================
   Image to PDF Pro Ultimate
   ui.js
========================================== */

window.UI = {

    /* ==========================
       INITIALIZE UI
    ========================== */

    init(){

        this.previewGrid =
        document.getElementById(
            "previewGrid"
        );

        this.imageCount =
        document.getElementById(
            "imageCount"
        );

        this.pageCount =
        document.getElementById(
            "pageCount"
        );

        this.estimatedSize =
        document.getElementById(
            "estimatedSize"
        );

        this.toastElement =
        document.getElementById(
            "toast"
        );

        this.bindPreviewEvents();

        console.log(
            "UI Module Ready"
        );

    },

    /* ==========================
       IMAGE RENDERING
    ========================== */

    renderImages(){

        if(
            !this.previewGrid
        ){
            return;
        }

        this.previewGrid.innerHTML = "";

        if(
            APP.images.length === 0
        ){

            this.previewGrid.innerHTML = `
                <div class="glass-card"
                style="
                    padding:40px;
                    text-align:center;
                    grid-column:1/-1;
                ">
                    <h3>
                        No Images Selected
                    </h3>
                    <p>
                        Upload images to begin.
                    </p>
                </div>
            `;

            return;
        }

        const fragment =
        document.createDocumentFragment();

        APP.images.forEach(
            (
                image,
                index
            ) => {

                const card =
                document.createElement(
                    "div"
                );

                card.className =
                "preview-card";

                card.dataset.index =
                index;

                card.innerHTML = `

                <img
                    src="${image.src}"
                    alt="${this.escapeHtml(image.name)}"
                    loading="lazy"
                    style="
                    transform:
                    rotate(${image.rotation || 0}deg);
                    ">

                <div
                    class="preview-info">

                    <div
                    class="preview-name">

                    ${this.escapeHtml(image.name)}

                    </div>

                    <div
                    class="preview-size">

                    ${this.formatBytes(
                        image.size || 0
                    )}

                    </div>

                </div>

                <div
                class="preview-actions">

                    <button
                    class="btn btn-primary rotate-left"
                    data-index="${index}">
                    ↺
                    </button>

                    <button
                    class="btn btn-primary rotate-right"
                    data-index="${index}">
                    ↻
                    </button>

                    <button
                    class="btn btn-warning crop-btn"
                    data-index="${index}">
                    ✂
                    </button>

                    <button
                    class="btn btn-danger delete-btn"
                    data-index="${index}">
                    ✖
                    </button>

                </div>

                `;

                fragment.appendChild(
                    card
                );

            }
        );

        this.previewGrid.appendChild(
            fragment
        );

    },

    /* ==========================
       EVENT DELEGATION
    ========================== */

    bindPreviewEvents(){

        document.addEventListener(
            "click",
            event => {

                const target =
                event.target;

                if(
                    target.classList.contains(
                        "delete-btn"
                    )
                ){

                    const index =
                    Number(
                        target.dataset.index
                    );

                    this.deleteImage(
                        index
                    );

                }

                if(
                    target.classList.contains(
                        "rotate-left"
                    )
                ){

                    const index =
                    Number(
                        target.dataset.index
                    );

                    this.rotateImage(
                        index,
                        -90
                    );

                }

                if(
                    target.classList.contains(
                        "rotate-right"
                    )
                ){

                    const index =
                    Number(
                        target.dataset.index
                    );

                    this.rotateImage(
                        index,
                        90
                    );

                }

                if(
                    target.classList.contains(
                        "crop-btn"
                    )
                ){

                    const index =
                    Number(
                        target.dataset.index
                    );

                    openCropModal(
                        APP.images[index].src,
                        index
                    );

                }

            }
        );

    },

    /* ==========================
       DELETE IMAGE
    ========================== */

    deleteImage(index){

        if(
            index < 0 ||
            index >= APP.images.length
        ){
            return;
        }

        APP.images.splice(
            index,
            1
        );

        Storage.saveImages();

        this.renderImages();

        this.updateStats();

        this.toast(
            "Image removed",
            "warning"
        );

    },

    /* ==========================
       ROTATE IMAGE
    ========================== */

    rotateImage(
        index,
        degree
    ){

        const image =
        APP.images[index];

        if(
            !image
        ){
            return;
        }

        image.rotation =
        (
            image.rotation || 0
        ) + degree;

        Storage.saveImages();

        this.renderImages();

        this.toast(
            "Image rotated",
            "success"
        );

    },

    /* ==========================
       STATS
    ========================== */

    updateStats(){

        const count =
        APP.images.length;

        let totalSize = 0;

        APP.images.forEach(
            img => {

                totalSize +=
                img.size || 0;

            }
        );

        if(
            this.imageCount
        ){

            this.imageCount.textContent =
            count;

        }

        if(
            this.pageCount
        ){

            this.pageCount.textContent =
            count;

        }

        if(
            this.estimatedSize
        ){

            this.estimatedSize.textContent =
            this.formatBytes(
                totalSize
            );

        }

    },

    /* ==========================
       TOAST
    ========================== */

    toast(
        message,
        type = "success"
    ){

        if(
            !this.toastElement
        ){
            return;
        }

        const toast =
        this.toastElement;

        toast.className =
        "toast";

        toast.classList.add(
            type
        );

        toast.textContent =
        message;

        toast.classList.add(
            "show"
        );

        clearTimeout(
            this.toastTimer
        );

        this.toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

    },

    /* ==========================
       FORMAT FILE SIZE
    ========================== */

    formatBytes(bytes){

        if(
            bytes === 0
        ){
            return "0 Bytes";
        }

        const k = 1024;

        const sizes = [
            "Bytes",
            "KB",
            "MB",
            "GB"
        ];

        const i =
        Math.floor(
            Math.log(bytes)
            /
            Math.log(k)
        );

        return (
            parseFloat(
                (
                    bytes /
                    Math.pow(
                        k,
                        i
                    )
                ).toFixed(2)
            )
            +
            " "
            +
            sizes[i]
        );

    },

    /* ==========================
       ESCAPE HTML
    ========================== */

    escapeHtml(text){

        const div =
        document.createElement(
            "div"
        );

        div.textContent =
        text;

        return div.innerHTML;

    },

    /* ==========================
       LOADING OVERLAY
    ========================== */

    showLoader(){

        const overlay =
        document.getElementById(
            "progressOverlay"
        );

        if(
            overlay
        ){
            overlay.style.display =
            "flex";
        }

    },

    hideLoader(){

        const overlay =
        document.getElementById(
            "progressOverlay"
        );

        if(
            overlay
        ){
            overlay.style.display =
            "none";
        }

    },

    updateProgress(percent){

        const fill =
        document.getElementById(
            "progressFill"
        );

        const text =
        document.getElementById(
            "progressText"
        );

        if(fill){

            fill.style.width =
            percent + "%";

        }

        if(text){

            text.textContent =
            percent + "%";

        }

    }

};

/* ==========================================
   AUTO INIT
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        UI.init();

    }
);
