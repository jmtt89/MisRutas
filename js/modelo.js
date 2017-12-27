var nextId = localStorage.getItem("nextId") || 1;

function Ruta(titulo) {
    this.id = nextId++;
    this.ts = Date.now();
    this.titulo = titulo;
    this.posiciones = [];
    this.color = '#000000';
    this.visible = 'on';
    this.isRoute = true;
}

//var rutas = [];
/* crea una nueva ruta en la bd */
function nuevaRuta(route) {
    console.log('nuevaRuta(' + JSON.stringify(route) + ')');
    //rutas.unshift(ruta);
    localStorage.setItem(route.id, JSON.stringify(route));
    localStorage.setItem("nextId", nextId);
    return route;
}

/* busca una ruta en la bd */
function buscarRuta(id) {
    console.log('buscarRuta(' + id + ')');
    return localStorage.getItem(id) ? JSON.parse(localStorage.getItem(id)) : null;
    /*
    if(localStorage.getItem(id)){
        return localStorage.getItem(id);
    }
    for (var i = 0; i < rutas.length; i++)
        if (rutas[i].id == id) return rutas[i];
    return null;
    */
}

/* devuelve el número de rutas */
function contarRutas() {
    console.log('contarRutas()');
    return localStorage.length;
    //return rutas.length;
}

/* itera entre todas las rutas */
function iterarRutas(cb) {
    console.log('iterarRutas()');
    /*
    for (var i in rutas) {
        cb(rutas[i]);
    }
    */
    for(var i in localStorage){
        if(typeof localStorage[i] === "string" && localStorage[i].indexOf("isRoute") >= 0){
            cb(JSON.parse(localStorage[i]));
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