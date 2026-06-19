/* ==========================================
   Image to PDF Pro Ultimate
   storage.js
========================================== */

window.Storage = {

    /* ==========================
       IMAGE STORAGE
    ========================== */

    saveImages(){

        try{

            localStorage.setItem(
                "img2pdf-images",
                JSON.stringify(
                    APP.images
                )
            );

        }

        catch(error){

            console.error(
                "Image save failed:",
                error
            );

            UI.toast(
                "Storage limit exceeded",
                "error"
            );

        }

    },

    loadImages(){

        try{

            const saved =
            localStorage.getItem(
                "img2pdf-images"
            );

            if(!saved){

                APP.images = [];

                return;

            }

            APP.images =
            JSON.parse(saved);

        }

        catch(error){

            console.error(
                "Image load failed:",
                error
            );

            APP.images = [];

        }

    },

    clearImages(){

        localStorage.removeItem(
            "img2pdf-images"
        );

    },

    /* ==========================
       SETTINGS STORAGE
    ========================== */

    saveSettings(){

        try{

            localStorage.setItem(
                "img2pdf-settings",
                JSON.stringify(
                    APP.settings
                )
            );

        }

        catch(error){

            console.error(
                "Settings save failed:",
                error
            );

        }

    },

    loadSettings(){

        try{

            const saved =
            localStorage.getItem(
                "img2pdf-settings"
            );

            if(!saved){
                return null;
            }

            return JSON.parse(
                saved
            );

        }

        catch(error){

            console.error(
                error
            );

            return null;

        }

    },

    clearSettings(){

        localStorage.removeItem(
            "img2pdf-settings"
        );

    },

    /* ==========================
       SESSION BACKUP
    ========================== */

    backupSession(){

        try{

            const backup = {

                version:"2.0",

                createdAt:
                new Date()
                .toISOString(),

                images:
                APP.images,

                settings:
                APP.settings

            };

            localStorage.setItem(
                "img2pdf-backup",
                JSON.stringify(
                    backup
                )
            );

        }

        catch(error){

            console.error(
                error
            );

        }

    },

    restoreBackup(){

        try{

            const backup =
            localStorage.getItem(
                "img2pdf-backup"
            );

            if(!backup){

                return false;

            }

            const data =
            JSON.parse(
                backup
            );

            APP.images =
            data.images || [];

            APP.settings =
            {
                ...APP.settings,
                ...data.settings
            };

            return true;

        }

        catch(error){

            console.error(
                error
            );

            return false;

        }

    },

    removeBackup(){

        localStorage.removeItem(
            "img2pdf-backup"
        );

    },

    /* ==========================
       EXPORT STATE
    ========================== */

    exportState(){

        try{

            const data = {

                version:"2.0",

                exported:
                new Date()
                .toISOString(),

                images:
                APP.images,

                settings:
                APP.settings

            };

            const blob =
            new Blob(

                [
                    JSON.stringify(
                        data,
                        null,
                        2
                    )
                ],

                {
                    type:
                    "application/json"
                }

            );

            const url =
            URL.createObjectURL(
                blob
            );

            const a =
            document.createElement(
                "a"
            );

            a.href = url;

            a.download =
            "img2pdf-backup.json";

            a.click();

            URL.revokeObjectURL(
                url
            );

            UI.toast(
                "Backup exported",
                "success"
            );

        }

        catch(error){

            console.error(
                error
            );

            UI.toast(
                "Export failed",
                "error"
            );

        }

    },

    /* ==========================
       IMPORT STATE
    ========================== */

    importState(file){

        const reader =
        new FileReader();

        reader.onload =
        event => {

            try{

                const data =
                JSON.parse(
                    event.target.result
                );

                APP.images =
                data.images || [];

                APP.settings =
                {
                    ...APP.settings,
                    ...data.settings
                };

                Storage.saveImages();

                Storage.saveSettings();

                UI.renderImages();

                UI.updateStats();

                UI.toast(
                    "Backup restored",
                    "success"
                );

            }

            catch(error){

                console.error(
                    error
                );

                UI.toast(
                    "Invalid backup file",
                    "error"
                );

            }

        };

        reader.readAsText(
            file
        );

    },

    /* ==========================
       STORAGE INFO
    ========================== */

    getStorageSize(){

        let total = 0;

        for(
            let key
            in localStorage
        ){

            if(
                !localStorage
                .hasOwnProperty(
                    key
                )
            ){
                continue;
            }

            total +=
            (
                localStorage[key]
                .length +
                key.length
            ) * 2;

        }

        return (
            total /
            1024 /
            1024
        ).toFixed(2);

    },

    /* ==========================
       CLEANUP
    ========================== */

    cleanup(){

        try{

            const size =
            Storage.getStorageSize();

            if(
                parseFloat(size)
                > 20
            ){

                console.warn(
                    "Large storage detected"
                );

            }

        }

        catch(error){

            console.error(
                error
            );

        }

    },

    /* ==========================
       RESET APP
    ========================== */

    resetAll(){

        APP.images = [];

        Storage.clearImages();

        Storage.clearSettings();

        Storage.removeBackup();

        UI.renderImages();

        UI.updateStats();

        UI.toast(
            "Application reset",
            "warning"
        );

    }

};

/* ==========================================
   AUTO BACKUP
========================================== */

window.addEventListener(
    "beforeunload",
    () => {

        Storage.backupSession();

    }
);

/* ==========================================
   STARTUP CHECK
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        Storage.cleanup();

        console.log(
            "Storage Module Ready"
        );

    }
);
