window.PDFGenerator = {

    init() {
        const btn =
            document.getElementById(
                "createBtn"
            );

        if(btn){
            btn.addEventListener(
                "click",
                this.generate
            );
        }

        console.log(
            "PDF Generator Ready."
        );
    },

    generate() {

        alert(
            "PDF generation module will run here."
        );

    }

};