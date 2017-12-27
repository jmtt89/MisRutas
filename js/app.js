// tiempo entre lecturas de GPS 
var GPS_GRAB_TIME = 2000;
var mapa;

var width = 320;    // We will scale the photo width to this
var height = 0;     // This will be computed based on the input stream

// |streaming| indicates whether or not we're currently streaming
// video from the camera. Obviously, we start at false.

var streaming = false;

// The various HTML elements we need to configure or control. These
// will be set by the startup() function.

var video = null;
var canvas = null;
var photo = null;
var startbutton = null;

function inicializarHome() {
    console.log('inicializarHome()');
    // - inicializar variables  
    grabando = false;
    timerReloj = null;
    timerGps = null;
    contadorReloj = null;
    // - registrar manejadores  
    $('#btGrabar').click(function (ev) {
        if (grabando) {
            console.log('pararRuta(' + rutaEnCurso.id + ')');
            grabando = false;

            // parar timers      
            clearInterval(timerReloj);
            if(navigator.geolocation){
                navigator.geolocation.clearWatch(timerGps);
            }else{
                clearInterval(timerGps);
            }

            // guardar ruta
            nuevaRuta(rutaEnCurso);
            //rutas.push(rutaEnCurso);

            // limpiar ruta      
            rutaEnCurso = null;

            // refrescar página      
            refrescarHome();
        } else {
            rutaEnCurso = new Ruta();
            console.log('empezarRuta(' + rutaEnCurso.id + ')');


            // recuperar título de la ruta     
            /*
            var titulo = ;
            if (!titulo || titulo.length == 0) titulo = ;
            */
            rutaEnCurso.titulo = $('#txtTitulo').val() || "Default";
            $('#txtTitulo').val(rutaEnCurso.titulo);

            // comenzar grabación de ruta (timers, ...)      
            grabando = true;
            contadorReloj = 0;
            timerReloj = setInterval(function () {
                contadorReloj++;
                refrescarHome();
            }, 1000);

            if(navigator.geolocation){
                timerGps = navigator.geolocation.watchPosition(function(position){
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    // add new position to the route
                    rutaEnCurso.posiciones.push(pos);
                },showError,{
                    enableHighAccuracy: true,
                })
            }else{
                timerGps = setInterval(function () {
                    leerGps();
                }, GPS_GRAB_TIME);
            }




            // refrescar página      
            refrescarHome();
        }
    });
    // - refrescar página  
    refrescarHome();
}

function inicializarMisRutas() {
    console.log('inicializarMisRutas()');
    refrescarMisRutas();
}

function inicializarMapa() {
    console.log('inicializarMapa()');
    // crear el mapa la primera vez que se muestra la página  
    $(document).one('pageshow', '#pgMapa', function (e, data) {
        // obtener altura del contenedor    
        var header = $("#pgMapa").find("div[data-role='header']:visible");
        var footer = $("#pgMapa").find("div[data-role='footer']:visible");
        var content = $("#pgMapa").find("div.ui-content:visible");
        var viewport_height = $(window).height();
        var content_height = viewport_height - header.outerHeight() - footer.outerHeight();
        if ((content.outerHeight() - header.outerHeight() - footer.outerHeight()) <= viewport_height) {
            content_height -= (content.outerHeight() - content.height());
        }
        $('#pnMapa').height(content_height);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError, {
                enableHighAccuracy:true
            });
        }else{
            showPosition({coords:{latitude:38.695015,longitude: -0.476049}});
        }
    });
}

function inicializarEditarRuta(){
    console.log('inicializarEditarRuta()');

    refrescarEditarRuta();
}

/*
function inicializarTakeImage(){
    console.log('inicializarTakeImage()');
    
    front = false;

    Webcam.set({
        width: 320,
        height: 240,
        image_format: 'jpeg',
        jpeg_quality: 90
    });
    Webcam.attach( '#my_camera' );
    Webcam.set( 'constraints', {
        width: 1280,
        height: 720,
        facingMode: { exact: "environment" }
    });

    $('#takeSnapshot').click(function(ev){
        console.log("takeSnapshotClick");
        Webcam.snap( function(data_uri) {
            document.getElementById('my_result').innerHTML = '<img src="'+data_uri+'"/>';
        } );
        $('#my_camera').hide();
    });

    $('#flip').click(function(ev){
        front = !front;
        Webcam.set( 'constraints', {
            width: 1280,
            height: 720,
            facingMode: { exact: front? "user" : "environment" }
        });
    });
    
    refrescarTakeImage();
}
*/

function inicializarTakeImage(){
    console.log('inicializarTakeImage()');
    video = $('#video');
    canvas = $('#canvas');
    photo = $('#photo');

    video.hide();
    canvas.hide();

    $("#takeSnapshot").click(function(event){
        $("#inputSnapshot").click();
        event.preventDefault();
    });

    document.getElementById("inputSnapshot").onchange = function () {
        var reader = new FileReader();
    
        reader.onload = function (e) {
            // get loaded data and render thumbnail.
            document.getElementById("photo").src = e.target.result;
        };
    
        // read the image file as a data URL.
        reader.readAsDataURL(this.files[0]);
    };
}

function inicializarRecordVideo(){
    console.log('inicializarRecordVideo()');

    $("#recVideo").click(function(event){
        $("#inputVideo").click();
        event.preventDefault();
    });

    document.getElementById("inputVideo").onchange = function () {
        var reader = new FileReader();
        
        reader.onload = function (e) {
            // get loaded data and render thumbnail.
            document.getElementById("videoPreview").src = e.target.result;
        };
    
        // read the image file as a data URL.
        reader.readAsDataURL(this.files[0]);
        /*
        var fileInput = document.getElementById('inputVideo');
        var fileUrl = window.URL.createObjectURL(fileInput.files[0]);
        console.log(fileUrl);
        $("#videoPreview").attr("src", fileUrl);
        */
    };
}

function inicializarRecordAudio(){
    console.log('inicializarRecordAudio()');

    $("#recAudio").click(function(event){
        $("#inputAudio").click();
        event.preventDefault();
    });

    document.getElementById("inputAudio").onchange = function () {
        var fileInput = document.getElementById('inputAudio');
        var fileUrl = window.URL.createObjectURL(fileInput.files[0]);
        console.log(fileUrl);
        $("#audioPreview").attr("src", fileUrl);
    };
}

function inicializarTakeImageHtml5(){

    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    startbutton = document.getElementById('takeSnapshot');

    navigator.getMedia = ( navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.msGetUserMedia);

    navigator.getMedia(
      {
        video: true,
        audio: false
      },
      function(stream) {
        if (navigator.mozGetUserMedia) {
          video.mozSrcObject = stream;
        } else {
          var vendorURL = window.URL || window.webkitURL;
          video.src = vendorURL.createObjectURL(stream);
        }
        video.play();
      },
      function(err) {
        console.log("An error occured! " + err);
      }
    );

    video.addEventListener('canplay', function(ev){
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);
      
        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.
      
        if (isNaN(height)) {
          height = width / (4/3);
        }
      
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);

    startbutton.addEventListener('click', function(ev){
      takepicture();
      ev.preventDefault();
    }, false);
    
    clearphoto();
    
}

function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
}

function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
    
      var data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);
    } else {
      clearphoto();
    }
}

$(document).one('pagecreate', '#pgHome', function (ev, ui) {
    inicializarHome();
});

$(document).one('pagecreate', '#pgMisRutas', function (ev, ui) {
    inicializarMisRutas();
});

$(document).one('pagecreate', '#pgMapa', function (ev, ui) {
    inicializarMapa();
})

$(document).one('pagecreate', '#pgEditarRuta', function (ev, ui) {
    inicializarEditarRuta();
})

$(document).one('pagecreate', '#pgTakeImage', function (ev, ui) {
    inicializarTakeImage();
})

$(document).one('pagecreate', '#pgRecordVideo', function (ev, ui) {
    inicializarRecordVideo();
})

$(document).one('pagecreate', '#pgRecordAudio', function (ev, ui) {
    inicializarRecordAudio();
})



//TODO: faltaría la inicialización relativa a la página de Editar Ruta. Se deja esta labor para el alumno. 

function refrescarHome() {
    console.log('refrescarHome()');
    if (grabando) {
        //$('#txtTitulo').val(rutaEnCurso.titulo).textinput('refresh');
        rutaEnCurso.titulo = $('#txtTitulo').val();
        // mostrar panel    
        $('#btGrabar').val('Parar').button('refresh');
        $('#lblInfo').text('Guardando ruta ' + rutaEnCurso.titulo + '...');
        var minutos = parseInt(contadorReloj / 60);
        var segundos = contadorReloj % 60;
        var horas = parseInt(minutos / 60);
        minutos = minutos % 60;
        $('#lblReloj').text("" + (horas < 10 ? "0" : "") + horas + ":" + (minutos < 10 ? "0" : "") + minutos + ":" + (segundos < 10 ? "0" : "") + segundos);
        $('#pnInfo').css('visibility', 'visible');
    } else {
        // ocultar panel    
        $('#btGrabar').val('Empezar ruta').button('refresh');
        $('#pnInfo').css('visibility', 'hidden');
    }
}

function refrescarMisRutas() {
    console.log('refrescarMisRutas()');
    // limpiar  
    $('#pnRutas').html('<ul data-role="listview" data-filter="true"></ul>');
    // pintar rutas  
    iterarRutas(function (ruta) {
        var str = '<li><a id="' + ruta.id + '" href="#pgEditarRuta">' + ruta.titulo + '</li>';
        $('#pnRutas ul').append(str);
    });
    $('#pnRutas ul').listview();
}

function refrescarMapa() {
    console.log('refrescarMapa()');
    if(!mapa) return;
    // limpiar todas las rutas pintadas  
    for (var i = 0; i < mapa.polylines.length; i++) mapa.polylines[i].setMap(null);
    mapa.polylines = [];
    // transformar rutas

    var toPath = function (posiciones) {
        var path = [];
        for (var i = 0; i < posiciones.length; i++) path.push(new google.maps.LatLng(posiciones[i].lat, posiciones[i].lng));
        return path;
    };
    iterarRutas(function (ruta) {
        // sólo si son visibles    
        if (ruta.visible == 'on') {
            var polyline = new google.maps.Polyline({
                path: toPath(ruta.posiciones),
                map: mapa,
                strokeColor: ruta.color,
                strokeOpacity: 1.0,
                strokeWeight: 4
            });
            // guardar información sobre las rutas pintadas      
            mapa.polylines.push(polyline);
        }
    });
}

function refrescarEditarRuta(){
    console.log('refrescarEditarRuta()');
}

function refrescarTakeImage(){
    console.log('refrescarTakeImage()');
}

//TODO: Nuevamente, resaltar que la rutina de refresco de la página Editar Ruta no ha sido definida. Además, para saltar a dicha página será necesario añadir manejadores para los links listados en la página Mis Rutas. Se deja para el alumno completar dicho código.

// refrescar página al saltar a ella 
$(document).on("pagecontainershow", function (ev, ui) {
    console.log("navigate: " + ui.prevPage.attr('id') + '->' + ui.toPage.attr('id'));
    switch (ui.toPage.attr('id')) {
        case 'pgHome':
            refrescarHome();
            break;
        case 'pgMisRutas':
            refrescarMisRutas();
            break;
        case 'pgMapa':
            refrescarMapa();
            break;
        case 'pgEditarRuta':
            refrescarEditarRuta();
            break;
    }
})

//TODO: Como puede observarse, no se controla el salto a la página Editar Ruta. De nuevo, se deja para el alumno esta implementación.

/**
 * Esta es una funcion falsa, no toma en consideracion realmente el GPS del dispositivo
 * sino que se genera de manera aleatoria 
 */
function leerGps() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }

    // init  
    window.inc = typeof (inc) == 'undefined' ? 0.00005 : window.inc;
    window.lat = typeof (lat) == 'undefined' ? 38.695015 : window.lat;
    window.lng = typeof (lng) == 'undefined' ? -0.476049 : window.lng;
    window.dir = typeof (dir) == 'undefined' ? Math.floor((Math.random() * 4)) : window.dir;
    // numbers 0,1,2,3 (0 up, 1 right, 2, down, 3 left)  
    // generate direction (randomly)  
    // it is more likely to follow the previous direction
    var nuevaDir = Math.floor((Math.random() * 4));
    // number 0,1,2,3  
    if (nuevaDir != (dir + 2) % 4) dir = nuevaDir;
    switch (dir) {
        case 0: // up
            lat += inc;
            break;
        case 1: // right
            lng += inc;
            break;
        case 2: // down      
            lat -= inc;
            break;
        case 3: // left      
            lng -= inc;
            break;
        default:
    }
    var pos = {
        lat: lat,
        lng: lng
    };
    // add new position to the route
    rutaEnCurso.posiciones.push(pos);
}

function showPosition(position){
    // crear mapa    
    var myOptions = {
        zoom: 18,
        center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    mapa = new google.maps.Map($('#pnMapa')[0], myOptions);
    mapa.polylines = new Array();
    // pintar    
    refrescarMapa();
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.");
            break;
    }
}