/* ==========================================
   Image to PDF Pro Ultimate
   pdf-generator.js
========================================== */

window.PDFGenerator = {

    async generate(){

        if(APP.images.length === 0){

            UI.toast(
                "Please upload images first",
                "error"
            );

            return;
        }

        try{

            UI.showLoader();
            UI.updateProgress(0);

            const { jsPDF } =
            window.jspdf;

            const pdf =
            new jsPDF({

                orientation:
                APP.settings.orientation,

                unit:"mm",

                format:
                APP.settings.pageFormat

            });

            const pageWidth =
            pdf.internal.pageSize.getWidth();

            const pageHeight =
            pdf.internal.pageSize.getHeight();

            const margin =
            Number(
                APP.settings.margin
            );

            const compression =
            Number(
                APP.settings.compression
            );

            for(
                let i=0;
                i<APP.images.length;
                i++
            ){

                const item =
                APP.images[i];

                const image =
                await this.loadImage(
                    item.src
                );

                const canvas =
                this.prepareCanvas(
                    image,
                    item.rotation || 0,
                    compression
                );

                const imgWidth =
                canvas.width;

                const imgHeight =
                canvas.height;

                let width =
                pageWidth - margin*2;

                let height =
                (
                    imgHeight *
                    width
                ) / imgWidth;

                if(
                    APP.settings.fitMode
                    === "contain"
                ){

                    if(
                        height >
                        pageHeight -
                        margin*2
                    ){

                        height =
                        pageHeight -
                        margin*2;

                        width =
                        (
                            imgWidth *
                            height
                        ) / imgHeight;

                    }

                }

                if(i > 0){

                    pdf.addPage();

                }

                const x =
                (
                    pageWidth -
                    width
                ) / 2;

                const y =
                (
                    pageHeight -
                    height
                ) / 2;

                pdf.addImage(

                    canvas.toDataURL(
                        "image/jpeg",
                        compression
                    ),

                    "JPEG",

                    x,
                    y,
                    width,
                    height

                );

                /* Watermark */

                this.addWatermark(
                    pdf,
                    pageWidth,
                    pageHeight
                );

                /* Page Number */

                this.addPageNumber(
                    pdf,
                    i + 1,
                    APP.images.length,
                    pageWidth,
                    pageHeight
                );

                const progress =
                Math.round(

                    (
                        (i + 1)
                        /
                        APP.images.length
                    ) * 100

                );

                UI.updateProgress(
                    progress
                );

            }

            const filename =

            (
                APP.settings.filename
                ||
                "image-to-pdf"
            )

            + ".pdf";

            pdf.save(
                filename
            );

            UI.hideLoader();

            UI.toast(
                "PDF generated successfully",
                "success"
            );

        }

        catch(error){

            console.error(
                error
            );

            UI.hideLoader();

            UI.toast(
                "PDF generation failed",
                "error"
            );

        }

    },

    /* ==========================
       LOAD IMAGE
    ========================== */

    loadImage(src){

        return new Promise(
            (
                resolve,
                reject
            ) => {

                const img =
                new Image();

                img.onload =
                () =>
                resolve(img);

                img.onerror =
                reject;

                img.src =
                src;

            }
        );

    },

    /* ==========================
       PREPARE CANVAS
    ========================== */

    prepareCanvas(
        image,
        rotation,
        quality
    ){

        const canvas =
        document.createElement(
            "canvas"
        );

        const ctx =
        canvas.getContext(
            "2d"
        );

        const angle =
        (
            rotation || 0
        ) *
        Math.PI /
        180;

        const swap =
        Math.abs(
            rotation % 180
        ) === 90;

        canvas.width =
        swap
        ?
        image.height
        :
        image.width;

        canvas.height =
        swap
        ?
        image.width
        :
        image.height;

        ctx.translate(
            canvas.width / 2,
            canvas.height / 2
        );

        ctx.rotate(
            angle
        );

        ctx.drawImage(
            image,
            -image.width / 2,
            -image.height / 2
        );

        return canvas;

    },

    /* ==========================
       WATERMARK
    ========================== */

    addWatermark(
        pdf,
        pageWidth,
        pageHeight
    ){

        const text =
        APP.settings.watermark;

        if(
            !text ||
            text.trim() === ""
        ){
            return;
        }

        pdf.saveGraphicsState();

        pdf.setTextColor(
            200
        );

        pdf.setFontSize(
            30
        );

        pdf.text(

            text,

            pageWidth / 2,

            pageHeight / 2,

            {
                align:"center",
                angle:45
            }

        );

        pdf.restoreGraphicsState();

    },

    /* ==========================
       PAGE NUMBERS
    ========================== */

    addPageNumber(
        pdf,
        current,
        total,
        pageWidth,
        pageHeight
    ){

        if(
            !APP.settings.pageNumbers
        ){
            return;
        }

        pdf.setFontSize(
            10
        );

        pdf.setTextColor(
            120
        );

        pdf.text(

            `${current} / ${total}`,

            pageWidth - 15,

            pageHeight - 8,

            {
                align:"right"
            }

        );

    },

    /* ==========================
       PDF PREVIEW
    ========================== */

    async preview(){

        try{

            const { jsPDF } =
            window.jspdf;

            const pdf =
            new jsPDF();

            pdf.text(
                "Preview",
                20,
                20
            );

            const blob =
            pdf.output(
                "blob"
            );

            const url =
            URL.createObjectURL(
                blob
            );

            openPreviewModal(
                url
            );

        }

        catch(error){

            console.error(
                error
            );

        }

    }

};

/* ==========================================
   MODULE READY
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "PDF Generator Ready"
        );

    }
);
