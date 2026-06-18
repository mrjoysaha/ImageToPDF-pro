window.UI = {

    init() {

        this.imageInput =
            document.getElementById(
                "imageInput"
            );

        this.previewGrid =
            document.getElementById(
                "previewGrid"
            );

        this.imageInput.addEventListener(
            "change",
            event => {
                console.log(
                    event.target.files
                );
            }
        );

        console.log("UI Initialized.");
    }

};