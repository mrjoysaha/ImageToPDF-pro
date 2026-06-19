/* ==========================================
   Image to PDF Pro Ultimate
   image-compressor.js
========================================== */

window.ImageCompressor = {

    /* ==========================
       SETTINGS
    ========================== */

    MAX_WIDTH: 2000,

    MAX_HEIGHT: 2000,

    DEFAULT_QUALITY: 0.8,

    /* ==========================
       COMPRESS IMAGE
    ========================== */

    async compress(dataUrl, quality){

        quality =
        Number(
            quality ||
            APP.settings.compression ||
            this.DEFAULT_QUALITY
        );

        return new Promise(
            (resolve,reject)=>{

                const img =
                new Image();

                img.onload = ()=>{

                    try{

                        let width =
                        img.width;

                        let height =
                        img.height;

                        /* Resize huge photos */

                        if(
                            width >
                            this.MAX_WIDTH
                        ){

                            height =
                            Math.round(

                                (
                                    height
                                    *
                                    this.MAX_WIDTH
                                )
                                /
                                width

                            );

                            width =
                            this.MAX_WIDTH;

                        }

                        if(
                            height >
                            this.MAX_HEIGHT
                        ){

                            width =
                            Math.round(

                                (
                                    width
                                    *
                                    this.MAX_HEIGHT
                                )
                                /
                                height

                            );

                            height =
                            this.MAX_HEIGHT;

                        }

                        const canvas =
                        document.createElement(
                            "canvas"
                        );

                        canvas.width =
                        width;

                        canvas.height =
                        height;

                        const ctx =
                        canvas.getContext(
                            "2d"
                        );

                        ctx.drawImage(
                            img,
                            0,
                            0,
                            width,
                            height
                        );

                        const compressed =
                        canvas.toDataURL(
                            "image/jpeg",
                            quality
                        );

                        resolve(
                            compressed
                        );

                    }

                    catch(error){

                        reject(error);

                    }

                };

                img.onerror =
                reject;

                img.src =
                dataUrl;

            }
        );

    },

    /* ==========================
       GET FILE SIZE
    ========================== */

    calculateSize(dataUrl){

        const base64 =
        dataUrl.split(",")[1];

        const size =
        Math.round(

            (
                base64.length
                * 3
            ) / 4

        );

        return size;

    },

    /* ==========================
       FORMAT SIZE
    ========================== */

    formatSize(bytes){

        if(
            bytes < 1024
        ){

            return bytes +
            " B";

        }

        if(
            bytes <
            1024*1024
        ){

            return (
                bytes/1024
            ).toFixed(2)
            +
            " KB";

        }

        return (
            bytes/
            1024/
            1024
        ).toFixed(2)
        +
        " MB";

    },

    /* ==========================
       COMPRESS APP IMAGE
    ========================== */

    async compressImageAtIndex(
        index
    ){

        const image =
        APP.images[index];

        if(!image){
            return;
        }

        try{

            UI.showLoader();

            const before =
            this.calculateSize(
                image.src
            );

            const compressed =
            await this.compress(
                image.src,
                APP.settings.compression
            );

            const after =
            this.calculateSize(
                compressed
            );

            image.src =
            compressed;

            image.size =
            after;

            Storage.saveImages();

            UI.renderImages();

            UI.updateStats();

            UI.toast(

                `Saved ${
                    this.formatSize(
                        before-after
                    )
                }`,

                "success"

            );

        }

        catch(error){

            console.error(
                error
            );

            UI.toast(
                "Compression failed",
                "error"
            );

        }

        finally{

            UI.hideLoader();

        }

    },

    /* ==========================
       COMPRESS ALL
    ========================== */

    async compressAll(){

        if(
            APP.images.length===0
        ){

            UI.toast(
                "No images found",
                "warning"
            );

            return;

        }

        try{

            UI.showLoader();

            let totalBefore = 0;

            let totalAfter = 0;

            for(
                let i=0;
                i<APP.images.length;
                i++
            ){

                const image =
                APP.images[i];

                const before =
                this.calculateSize(
                    image.src
                );

                totalBefore +=
                before;

                const compressed =
                await this.compress(
                    image.src,
                    APP.settings.compression
                );

                const after =
                this.calculateSize(
                    compressed
                );

                totalAfter +=
                after;

                image.src =
                compressed;

                image.size =
                after;

                const progress =
                Math.round(

                    (
                        (i+1)
                        /
                        APP.images.length
                    )
                    *100

                );

                UI.updateProgress(
                    progress
                );

            }

            Storage.saveImages();

            UI.renderImages();

            UI.updateStats();

            UI.toast(

                `Reduced ${
                    this.formatSize(
                        totalBefore -
                        totalAfter
                    )
                }`,

                "success"

            );

        }

        catch(error){

            console.error(
                error
            );

            UI.toast(
                "Compression failed",
                "error"
            );

        }

        finally{

            UI.hideLoader();

        }

    }

};

/* ==========================================
   MODULE READY
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    ()=>{

        console.log(
            "Image Compressor Ready"
        );

    }
);
