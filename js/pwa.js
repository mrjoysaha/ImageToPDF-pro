/* ===================================
   PWA INSTALLER
=================================== */

let deferredPrompt;

window.addEventListener(
    "beforeinstallprompt",
    event => {

        event.preventDefault();

        deferredPrompt = event;

        showInstallButton();

    }
);

function showInstallButton(){

    let installBtn =
    document.getElementById(
        "installAppBtn"
    );

    if(!installBtn){
        return;
    }

    installBtn.style.display =
    "inline-flex";

}

document.addEventListener(
    "click",
    async event => {

        if(
            event.target.id !==
            "installAppBtn"
        ){
            return;
        }

        if(
            !deferredPrompt
        ){
            return;
        }

        deferredPrompt.prompt();

        await deferredPrompt.userChoice;

        deferredPrompt = null;

    }
);

/* ===================================
   REGISTER SERVICE WORKER
=================================== */

if(
    "serviceWorker" in navigator
){

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
            .register(
                "/service-worker.js"
            )
            .then(() => {

                console.log(
                    "Service Worker Registered"
                );

            })
            .catch(error => {

                console.error(
                    error
                );

            });

        }
    );

}
