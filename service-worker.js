const CACHE_NAME = "image2pdf-pro-v1";

const urlsToCache = [

    "/",

    "/css/style.css",

    "/js/app.js",
    "/js/storage.js",
    "/js/ui.js",
    "/js/dragdrop.js",
    "/js/pdf-generator.js",

    "/assets/icons/icon-192.png",
    "/assets/icons/icon-512.png"

];

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches.open(
                CACHE_NAME
            )
            .then(cache => {

                return cache.addAll(
                    urlsToCache
                );

            })

        );

    }
);

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches.keys()
            .then(keys => {

                return Promise.all(

                    keys.map(key => {

                        if(
                            key !== CACHE_NAME
                        ){

                            return caches.delete(
                                key
                            );

                        }

                    })

                );

            })

        );

    }
);

self.addEventListener(
    "fetch",
    event => {

        event.respondWith(

            caches.match(
                event.request
            )
            .then(response => {

                return (
                    response ||
                    fetch(
                        event.request
                    )
                );

            })

        );

    }
);
