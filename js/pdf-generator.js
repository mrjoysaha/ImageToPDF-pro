window.PDFGenerator = {

    init() {

        const btn =
            document.getElementById("createBtn");

        if(btn){
            btn.addEventListener(
                "click",
                () => this.generate()
            );
        }

        console.log("PDF Generator Ready.");
    },

    async generate() {

        const fileInput =
            document.getElementById("imageInput");

        const files = fileInput.files;

        if(!files.length){

            alert("Please select at least one image.");

            return;
        }

        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });

        for(let i = 0; i < files.length; i++){

            const file = files[i];

            const imageData =
                await this.readFile(file);

            const image =
                await this.loadImage(imageData);

            const pdfWidth = 210;
            const pdfHeight = 297;
            const margin = 10;

            const ratio =
                image.width / image.height;

            let width =
                pdfWidth - (margin * 2);

            let height =
                width / ratio;

            if(height >
                pdfHeight - (margin * 2)){

                height =
                    pdfHeight - (margin * 2);

                width =
                    height * ratio;
            }

            const x =
                (pdfWidth - width) / 2;

            const y =
                (pdfHeight - height) / 2;

            if(i > 0){
                pdf.addPage();
            }

            pdf.addImage(
                imageData,
                file.type.includes("png")
                    ? "PNG"
                    : "JPEG",
                x,
                y,
                width,
                height
            );
        }

        pdf.save(
            "image-to-pdf.pdf"
        );
    },

    readFile(file){

        return new Promise(resolve => {

            const reader =
                new FileReader();

            reader.onload =
                e => resolve(e.target.result);

            reader.readAsDataURL(file);

        });

    },

    loadImage(src){

        return new Promise(resolve => {

            const img =
                new Image();

            img.onload =
                () => resolve(img);

            img.src = src;

        });

    }

};
