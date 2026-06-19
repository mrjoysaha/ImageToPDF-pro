/* ==========================================
   Image to PDF Pro Ultimate
   zip-download.js
========================================== */

window.ZipDownload = {

    async download(){

        if(APP.images.length === 0){

            UI.toast(
                "No images available",
                "error"
            );

            return;

        }

        try{

            UI.showLoader();

            UI.updateProgress(0);

            const zip =
            new JSZip();

            const folder =
            zip.folder(
                "images"
            );

            for(
                let i = 0;
                i < APP.images.length;
                i++
            ){

                const image =
                APP.images[i];

                const blob =
                await this.dataURLtoBlob(
                    image.src
                );

                let fileName =
                image.name ||
                `image-${i+1}.jpg`;

                if(
                    !fileName.includes(".")
                ){

                    fileName += ".jpg";

                }

                folder.file(
                    fileName,
                    blob
                );

                const progress =
                Math.round(
                    (
                        (i + 1)
                        /
                        APP.images.length
                    ) * 80
                );

                UI.updateProgress(
                    progress
                );

            }

            const zipBlob =
            await zip.generateAsync(

                {
                    type:"blob",

                    compression:
                    "DEFLATE",

                    compressionOptions:{
                        level:9
                    }
                },

                metadata => {

                    const progress =
                    80 +
                    (
                        metadata.percent
                        * 0.2
                    );

                    UI.updateProgress(
                        Math.round(
                            progress
                        )
                    );

                }

            );

            const filename =

                (
                    APP.settings.filename
                    ||
                    "images"
                )

                + ".zip";

            this.downloadBlob(
                zipBlob,
                filename
            );

            UI.updateProgress(
                100
            );

            UI.toast(
                "ZIP downloaded",
                "success"
            );

        }

        catch(error){

            console.error(
                error
            );

            UI.toast(
                "ZIP creation failed",
                "error"
            );

        }

        finally{

            setTimeout(
                () => {

                    UI.hideLoader();

                },
                500
            );

        }

    },

    /* ==========================
       DATA URL → BLOB
    ========================== */

    async dataURLtoBlob(
        dataURL
    ){

        const response =
        await fetch(
            dataURL
        );

        return await response.blob();

    },

    /* ==========================
       DOWNLOAD FILE
    ========================== */

    downloadBlob(
        blob,
        filename
    ){

        const url =
        URL.createObjectURL(
            blob
        );

        const a =
        document.createElement(
            "a"
        );

        a.href =
        url;

        a.download =
        filename;

        document.body
        .appendChild(a);

        a.click();

        document.body
        .removeChild(a);

        URL.revokeObjectURL(
            url
        );

    }

};

/* ==========================================
   INIT ZIP BUTTON
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const btn =
        document.getElementById(
            "downloadZipBtn"
        );

        if(btn){

            btn.addEventListener(
                "click",
                () => {

                    ZipDownload.download();

                }
            );

        }

        console.log(
            "ZIP Module Ready"
        );

    }
);
