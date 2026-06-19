window.PDFGenerator = {

    async init() {

        this.generateBtn =
            document.getElementById(
                "generatePdfBtn"
            );

        if(this.generateBtn){

            this.generateBtn.addEventListener(
                "click",
                () => this.generate()
            );

        }

        console.log(
            "PDF Generator Loaded"
        );
    },

    async generate(){

        if(
            !window.images ||
            window.images.length === 0
        ){

            UI.toast(
                "Please upload images first.",
                "error"
            );

            return;
        }

        try{

            UI.showProgress();

            const {
                jsPDF
            } = window.jspdf;

            const pageFormat =
                document.getElementById(
                    "pageFormat"
                ).value;

            const orientation =
                document.getElementById(
                    "orientation"
                ).value;

            const margin =
                parseInt(
                    document.getElementById(
                        "margin"
                    ).value
                );

            const compression =
                parseFloat(
                    document.getElementById(
                        "compression"
                    ).value
                );

            const watermark =
                document.getElementById(
                    "watermark"
                ).value.trim();

            const pageNumbers =
                document.getElementById(
                    "pageNumbers"
                ).value;

            const filename =
                document.getElementById(
                    "pdfName"
                ).value.trim() ||
                "image-to-pdf";

            const pdf =
                new jsPDF({
                    orientation,
                    unit:"mm",
                    format:pageFormat,
                    compress:true
                });

            const pageWidth =
                pdf.internal.pageSize.getWidth();

            const pageHeight =
                pdf.internal.pageSize.getHeight();

            for(
                let i=0;
                i<window.images.length;
                i++
            ){

                if(i>0){
                    pdf.addPage();
                }

                const item =
                    window.images[i];

                const img =
                    await this.loadImage(
                        item.src
                    );

                const canvas =
                    document.createElement(
                        "canvas"
                    );

                const ctx =
                    canvas.getContext(
                        "2d"
                    );

                const rotation =
                    item.rotation || 0;

                if(
                    rotation % 180 === 0
                ){

                    canvas.width =
                        img.width;

                    canvas.height =
                        img.height;

                }else{

                    canvas.width =
                        img.height;

                    canvas.height =
                        img.width;

                }

                ctx.translate(
                    canvas.width/2,
                    canvas.height/2
                );

                ctx.rotate(
                    rotation *
                    Math.PI / 180
                );

                ctx.drawImage(
                    img,
                    -img.width/2,
                    -img.height/2
                );

                const ratio =
                    canvas.width /
                    canvas.height;

                let width =
                    pageWidth -
                    margin*2;

                let height =
                    width /
                    ratio;

                if(
                    height >
                    pageHeight -
                    margin*2
                ){

                    height =
                        pageHeight -
                        margin*2;

                    width =
                        height *
                        ratio;
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

                const imgData =
                    canvas.toDataURL(
                        "image/jpeg",
                        compression
                    );

                pdf.addImage(
                    imgData,
                    "JPEG",
                    x,
                    y,
                    width,
                    height,
                    undefined,
                    "FAST"
                );

                /* Watermark */

                if(watermark){

                    pdf.setTextColor(
                        180
                    );

                    pdf.setFontSize(
                        30
                    );

                    pdf.text(
                        watermark,
                        pageWidth/2,
                        pageHeight/2,
                        {
                            align:"center",
                            angle:45
                        }
                    );

                }

                /* Page Number */

                if(
                    pageNumbers ===
                    "yes"
                ){

                    pdf.setTextColor(
                        120
                    );

                    pdf.setFontSize(
                        10
                    );

                    pdf.text(
                        `Page ${i+1}`,
                        pageWidth-20,
                        pageHeight-10
                    );

                }

                const percent =
                    Math.round(
                        (
                            (i+1) /
                            window.images.length
                        ) * 100
                    );

                UI.updateProgress(
                    percent
                );

            }

            /* Create Preview */

            const blob =
                pdf.output(
                    "blob"
                );

            const url =
                URL.createObjectURL(
                    blob
                );

            const previewFrame =
                document.getElementById(
                    "pdfPreviewFrame"
                );

            if(previewFrame){

                previewFrame.src =
                    url;

                document
                .getElementById(
                    "previewModal"
                )
                .style.display =
                "flex";
            }

            /* Download */

            pdf.save(
                filename +
                ".pdf"
            );

            UI.hideProgress();

            UI.toast(
                "PDF Generated Successfully",
                "success"
            );

        }catch(error){

            console.error(
                error
            );

            UI.hideProgress();

            UI.toast(
                "PDF Generation Failed",
                "error"
            );
        }

    },

    loadImage(src){

        return new Promise(
            (resolve,reject)=>{

                const img =
                    new Image();

                img.onload =
                    () => resolve(img);

                img.onerror =
                    reject;

                img.src = src;

            }
        );

    }

};
