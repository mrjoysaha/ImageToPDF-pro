/* ==========================================
   Image to PDF Pro Ultimate
   dragdrop.js
========================================== */

window.DragDrop = {

    sortable: null,

    init(){

        this.setupUploadDropZone();

        this.setupSortableGrid();

        console.log(
            "DragDrop Module Ready"
        );

    },

    /* ==========================
       DRAG & DROP UPLOAD
    ========================== */

    setupUploadDropZone(){

        const uploadBox =
        document.getElementById(
            "uploadBox"
        );

        if(!uploadBox){
            return;
        }

        [
            "dragenter",
            "dragover"
        ].forEach(
            eventName => {

                uploadBox.addEventListener(
                    eventName,
                    event => {

                        event.preventDefault();
                        event.stopPropagation();

                        uploadBox.classList.add(
                            "dragover"
                        );

                    }
                );

            }
        );

        [
            "dragleave",
            "dragend",
            "drop"
        ].forEach(
            eventName => {

                uploadBox.addEventListener(
                    eventName,
                    event => {

                        event.preventDefault();
                        event.stopPropagation();

                        uploadBox.classList.remove(
                            "dragover"
                        );

                    }
                );

            }
        );

        uploadBox.addEventListener(
            "drop",
            async event => {

                const files =
                [
                    ...event.dataTransfer.files
                ];

                if(
                    files.length === 0
                ){
                    return;
                }

                await this.processDroppedFiles(
                    files
                );

            }
        );

    },

    /* ==========================
       FILE PROCESSING
    ========================== */

    async processDroppedFiles(files){

        const imageFiles =
        files.filter(
            file =>
            file.type.startsWith(
                "image/"
            )
        );

        if(
            imageFiles.length === 0
        ){

            UI.toast(
                "No valid images found",
                "error"
            );

            return;
        }

        UI.showLoader();

        try{

            for(
                const file
                of imageFiles
            ){

                const src =
                await this.readFile(
                    file
                );

                APP.images.push({

                    id:
                    crypto.randomUUID(),

                    name:
                    file.name,

                    size:
                    file.size,

                    rotation:0,

                    src

                });

            }

            Storage.saveImages();

            UI.renderImages();

            UI.updateStats();

            UI.toast(
                `${imageFiles.length} image(s) added`,
                "success"
            );

        }

        catch(error){

            console.error(
                error
            );

            UI.toast(
                "Upload failed",
                "error"
            );

        }

        finally{

            UI.hideLoader();

        }

    },

    readFile(file){

        return new Promise(
            resolve => {

                const reader =
                new FileReader();

                reader.onload =
                event =>
                resolve(
                    event.target.result
                );

                reader.readAsDataURL(
                    file
                );

            }
        );

    },

    /* ==========================
       SORTABLE GRID
    ========================== */

    setupSortableGrid(){

        const grid =
        document.getElementById(
            "previewGrid"
        );

        if(
            !grid ||
            typeof Sortable ===
            "undefined"
        ){
            return;
        }

        this.sortable =
        new Sortable(

            grid,

            {

                animation:200,

                ghostClass:
                "sortable-ghost",

                chosenClass:
                "sortable-chosen",

                dragClass:
                "sortable-drag",

                forceFallback:false,

                delayOnTouchOnly:true,

                delay:100,

                onStart:() => {

                    document.body
                    .classList.add(
                        "dragging"
                    );

                },

                onEnd:event => {

                    document.body
                    .classList.remove(
                        "dragging"
                    );

                    this.reorderImages(
                        event.oldIndex,
                        event.newIndex
                    );

                }

            }

        );

    },

    /* ==========================
       REORDER IMAGES
    ========================== */

    reorderImages(
        oldIndex,
        newIndex
    ){

        if(
            oldIndex === newIndex
        ){
            return;
        }

        const movedItem =
        APP.images.splice(
            oldIndex,
            1
        )[0];

        APP.images.splice(
            newIndex,
            0,
            movedItem
        );

        Storage.saveImages();

        UI.updateStats();

        UI.toast(
            "Image order updated",
            "success"
        );

    },

    /* ==========================
       REFRESH SORTABLE
    ========================== */

    refresh(){

        if(
            this.sortable
        ){

            this.sortable.destroy();

            this.setupSortableGrid();

        }

    }

};

/* ==========================================
   SORTABLE STYLES
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const style =
        document.createElement(
            "style"
        );

        style.textContent = `

        .sortable-ghost{

            opacity:.35;

            transform:
            scale(.95);

        }

        .sortable-chosen{

            cursor:grabbing;

        }

        .sortable-drag{

            transform:
            rotate(3deg);

            box-shadow:
            0 15px 40px
            rgba(0,0,0,.25);

        }

        body.dragging{

            user-select:none;

        }

        `;

        document.head.appendChild(
            style
        );

    }
);
