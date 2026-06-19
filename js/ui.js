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
            e => this.renderFiles(
                e.target.files
            )
        );

        console.log("UI Ready");
    },

    renderFiles(files){

        this.previewGrid.innerHTML="";

        [...files].forEach(
            (file,index)=>{

            const reader=
                new FileReader();

            reader.onload=e=>{

                const card=
                    document.createElement(
                        "div"
                    );

                card.className=
                    "preview-card";

                card.innerHTML=`
                    <img src="${e.target.result}">
                    <div class="preview-name">
                        ${file.name}
                    </div>
                    <button
                        class="remove-btn"
                        data-index="${index}">
                        Remove
                    </button>
                `;

                this.previewGrid
                    .appendChild(card);

            };

            reader.readAsDataURL(file);

        });

    }

};
