window.DragDrop = {

    init() {

        const uploadBox =
            document.querySelector(
                ".upload-box"
            );

        if(!uploadBox) return;

        ["dragenter","dragover"]
        .forEach(type => {

            uploadBox.addEventListener(
                type,
                e => {
                    e.preventDefault();
                    uploadBox.classList.add(
                        "dragover"
                    );
                }
            );

        });

        ["dragleave","drop"]
        .forEach(type => {

            uploadBox.addEventListener(
                type,
                e => {
                    e.preventDefault();
                    uploadBox.classList.remove(
                        "dragover"
                    );
                }
            );

        });

        console.log(
            "Drag & Drop Ready."
        );
    }

};