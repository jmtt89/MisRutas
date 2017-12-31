var nextId = localStorage.getItem("nextId") || 1;

function Ruta(titulo) {
    this.id = nextId++;
    this.ts = Date.now();
    this.titulo = titulo;
    this.posiciones = [];
    this.mediaElements = [];
    this.color = '#000000';
    this.visible = 'on';
    this.isRoute = true;
}

function storeMediaElement(route, mediaElement){
    return new Promise((resolve, reject) => {
        caches
            .open('MediaElement')
            .then((cache) => {
                route.mediaElements.push(mediaElement);
                cache
                    .put(`/${route.id}/media/${mediaElement.type}/${mediaElement.id}`, new Response(mediaElement.data))
                    .then(resolve);
            });
    })

}

function getMediaElementData(route, mediaElement){
    return new Promise((resolve, reject) => {
        caches.open('MediaElement')
            .then((cache) => {
                cache
                    .match(`/${route.id}/media/${mediaElement.type}/${mediaElement.id}`)
                    .then(response => response.text().then(data => resolve(data)));
            });
    });
}

//var rutas = [];
/* crea una nueva ruta en la bd */
function nuevaRuta(route) {
    console.log('nuevaRuta(' + JSON.stringify(route) + ')');
    route.mediaElements.forEach(element => {
        storeMediaElement(route, element).then(() => {
            element.data = undefined;            
        });
    });
    localStorage.setItem(route.id, JSON.stringify(route));
    localStorage.setItem("nextId", nextId);
    return route;
}

function editarRuta(route){
    console.log('editarRuta(' + JSON.stringify(route) + ')');
    localStorage.setItem(route.id, JSON.stringify(route));
    return route;
}

/* busca una ruta en la bd */
function buscarRuta(id) {
    console.log('buscarRuta(' + id + ')');
    return new Promise((resolve, reject) => {
        var route = localStorage.getItem(id) ? JSON.parse(localStorage.getItem(id)) : null;
        if(route != null){
            route.mediaElements = route.mediaElements || [];
            var promises = route.mediaElements.map(element => getMediaElementData(route, element));
            Promise
                .all(promises)
                .then(resolves => {
                    for(var i=0,n=resolves.length;i<n;i++){
                        route.mediaElements[i].data = resolves[i]
                    }
                    resolve(route);
                });
        }
    })
}

/* devuelve el número de rutas */
function contarRutas() {
    console.log('contarRutas()');
    return localStorage.length;
    //return rutas.length;
}

function listarRutas(){
    console.log('listarRutas()');
    return new Promise((resolve, reject) => { 
        var routes = [];
        for(var i in localStorage){
            if(typeof localStorage[i] === "string" && localStorage[i].indexOf("isRoute") >= 0){
                var tmpRoute = JSON.parse(localStorage[i]);
                routes.push(loadMediaInfo(tmpRoute))
            }
        }
        Promise
            .all(routes)
            .then(myRt => {
                return resolve(myRt)
            })
            .catch(reject);
    });
}

function loadMediaInfo(route){
    return new Promise((resolve, reject) => {
        route.mediaElements = route.mediaElements || [];
        var promises = route.mediaElements.map(element => getMediaElementData(route, element));
        Promise
            .all(promises)
            .then(resolves => {
                for(var i=0,n=resolves.length;i<n;i++){
                    route.mediaElements[i].data = resolves[i]
                }
                resolve(route);
            });
    });
}

/* itera entre todas las rutas */
function iterarRutas(cb) {
    console.log('iterarRutas()');
    for(var i in localStorage){
        if(typeof localStorage[i] === "string" && localStorage[i].indexOf("isRoute") >= 0){
            var route = JSON.parse(localStorage[i]);
            var promises = route.mediaElements.map(element => getMediaElementData(route, element));
            Promise
                .all(promises)
                .then(resolves => {
                    for(var i=0,n=resolves.length;i<n;i++){
                        route.mediaElements[i].data = resolves[i]
                    }
                    cb(route);
                });
        }
    }
}

/* elimina una ruta de la bd */
function eliminarRuta(id) {
    console.log('eliminarRuta(' + id + ')');
    localStorage.removeItem(id);
    /*
    for (var i = 0; i < rutas.length; i++) {
        if (rutas[i].id == id) {
            rutas.splice(i, 1);
            return;
        }
    }
    */
}