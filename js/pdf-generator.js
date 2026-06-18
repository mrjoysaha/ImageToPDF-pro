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

    generate() {

        const fileInput =
            document.getElementById("imageInput");

        if(!fileInput.files.length){

            alert("Please select an image first.");

            return;
        }

        alert(
            fileInput.files.length +
            " image(s) selected."
        );

    }

};
