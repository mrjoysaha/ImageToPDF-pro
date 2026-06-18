window.Storage = {

    save() {
        localStorage.setItem(
            "img2pdf-images",
            JSON.stringify(window.images)
        );
    },

    load() {

        const saved =
            localStorage.getItem(
                "img2pdf-images"
            );

        if(saved){
            window.images =
                JSON.parse(saved);
        }
    },

    clear() {
        localStorage.removeItem(
            "img2pdf-images"
        );
    }

};