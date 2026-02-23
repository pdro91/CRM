//Globales  
let latUnidad = parseFloat($("#txtLatitudUnidad").val())
let lonUnidad = parseFloat( $("#txtLongitudUnidad").val())
const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let markers = [];

const directionsService = new google.maps.DirectionsService();
const directionsRenderer = new google.maps.DirectionsRenderer();

let waypts = [];
let wpts =[]
let rutaoptimizada = []
let pintarPuntos = []
let map = null;
let arregloLugares = [  
                          {   value:"1",
                              datalat:"-12.060503979821997",
                              datalon:"-77.03707943388741",     
                              datadireccion:"Parque de la Exposición, Av 9 de Diciembre 125, Cercado de Lima", 
                              datalugar:"Museo de Arte de Lima",
                          },
                          {   value:"2",
                              datalat:"-12.073076624782322",
                              datalon:"-77.07109265465196",
                              datadireccion:"Av. Simón Bolivar 1515, Pueblo Libre 15084",
                              datalugar:"Museo Larco"
                          },
                          {   value:"3",
                              datalat:"-12.076520145318085",
                              datalon:"-77.05818074161961", 
                              datadireccion:"Plaza Bolivar, Pueblo Libre 15084", 
                              datalugar:"Museo Nacional de Arqueología"
                          },
                          {   value:"4",
                              datalat:"-12.09167344259586",
                              datalon:"-77.00168783582247",
                              datadireccion:"Av. Javier Prado Este 2465, San Borja 15021", 
                              datalugar:"Museo de la Nación"
                          },
                          {   value:"5",
                              datalat:"-12.047851618705085", 
                              datalon:"-77.02555002705891",
                              datadireccion:"Jirón Ancash 542, Cercado de Lima 15001", 
                              datalugar:"Museo de la Inquisición y del Congreso"
                          },
                          {   value:"6",
                              datalat:"-12.046508572988143",
                              datalon:"-77.02541055219923",
                              datadireccion:"Jirón Ancash 542, Cercado de Lima 15001",
                              datalugar:"Museo Nacional Afroperuano"
                          },
                          {   value:"7",
                              datalat:"-12.03713009196013",
                              datalon:"-76.97148036295515",
                              datadireccion:"El Agustino",
                              datalugar:"Planta de Tratamiento de Agua La Atarjea"
                          },
                         
                          {   value:"9",
                              datalat:"-12.005234209630805",
                              datalon:"-77.05262066712449",
                              datadireccion:"Av. Tomas Valle, Independencia 15311",
                              datalugar:"Plaza Norte"
                          },
                          {   value:"10",
                              datalat:"-12.046337402975675",
                              datalon:"-77.0285083096426",
                              datadireccion:"Jirón Lampa, Cercado de Lima 15001",
                              datalugar:"Basílica y Convento de San Francisco de Lima"
                          },
                          {   value:"11",
                              datalat:"-12.087838078959203",
                              datalon:"-77.00307581249932",
                              datadireccion:"Av. Javier Prado Este 2465, San Borja 15021",
                              datalugar:"Museo de la Nación"
                          },
                          {   value:"12",
                              datalat:"-12.152428636095799",
                              datalon:"-77.01702365572058",
                              datadireccion:"Av. Pedro de Osma 409, Barranco 15063",
                              datalugar:"Museo MATE"
                          },
                          {   value:"13",
                              datalat:"-12.154442265603631",
                              datalon:"-76.98186947858886",
                              datadireccion:"Av Pedro Miotta 1011, Cercado de Lima 15801",
                              datalugar:"H&M Mall del Sur"
                          },
                          {   value:"14",
                              datalat:"-12.160656611080066",
                              datalon:"-76.95757647265216",
                              datadireccion:"Av. Miguel Iglesias 968, San Juan de Miraflores 15801",
                              datalugar:"Hospital María Auxiliadora"
                          },
                          {   value:"15",
                              datalat:"-12.097253161899904",
                              datalon:"-76.97693073592919",
                              datadireccion:"Santiago de Surco 15023",
                              datalugar:"Jockey Club del Perú"
                          },
                          {   value:"16",
                              datalat:"-12.085968596117684",
                              datalon:"-76.97532476346316",
                              datadireccion:"Avenida Javier Prado Este 4200, C.C Jockey Plaza, Santiago de Surco 15023",
                              datalugar:"Jockey Plaza"
                          },
                          {   value:"17",
                              datalat:"-12.055104478626527",
                              datalon:"-77.01322614765549",
                              datadireccion:"Parque Historia de la Medicina Peruana, S/N, Av. Miguel Grau 13, Cercado de Lima 15003",
                              datalugar:"Hospital Nacional Dos De Mayo"
                          },
                          {   value:"18",
                              datalat:"-12.040839635697502",
                              datalon:"-76.99124015589443",
                              datadireccion:"Av. Cesar Vallejo 1390, El Agustino 15007",
                              datalugar:"Hospital Hipolito Unanue Bravo Chico"
                          },
                          {   value:"19",
                              datalat:"-11.96412355659114",
                              datalon:"-76.99592021600051",
                              datadireccion:"Av. Canto Grande, San Juan de Lurigancho 15423",
                              datalugar:"Hospital San Juan de Lurigancho"
                          },
                          {   value:"20",
                              datalat:"-12.023621125519808",
                              datalon:"-76.91007528910599",
                              datadireccion:"Carr. Central 506, Ate 15491",
                              datalugar:"Hospital de Vitarte - MINSA"
                          }
                  ];

$(document).ready(function () {

    $("#limpiarRuta").on("click", function () {
        limpiarPuntosMap()  
    })
    
    $("#generarRuta").on("click", function () {
        for (let i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
        optRoute() 
    })  

    initMap_Rutas()

    $("#btnAgregarPunto").on("click", function () {

        if($("#cboPuntosRuta").val() != -1){
                    
            initMap_Rutas()

            let dr = "";
            let lt = 0;
            let ln = 0;
            let lugar = "";
            let valorpunto = 0;
         
            for (var i = 0; i < arregloLugares.length; i++) {
                if($("#cboPuntosRuta").val() == arregloLugares[i].value){
                    dr = arregloLugares[i].datadireccion;
                    lt = parseFloat( arregloLugares[i].datalat);
                    ln = parseFloat( arregloLugares[i].datalon);
                    lugar = arregloLugares[i].datalugar;
                    valorpunto = arregloLugares[i].value;
                }
            }

            $("#cboPuntosRuta").val(-1).trigger("change");

            wpts.push({
                value: valorpunto,
                location: { lat: lt, lng: ln },
                stopover: true,
                lugar:lugar,
                dr:dr
            });

            arregloWaypts(wpts);

            setMarkers(map)

            $("#direcionesflat").append(`<div id="dr${valorpunto}" class="event-name row direccionRuta ">
                                            <div class="col-12">
                                                <h6>${lugar} <span type="button" class="close" onClick="removerPuntoMap(${valorpunto})" aria-hidden="true"><i class="fa fa-times" style="color:red;"></i></span></h6>
                                                <p><i class="fa fa-map-marker"></i> ${dr}</p>
                                            </div>
                                        </div> `);

        }
    });           

});

function initMap_Rutas() {

  let latLng = { lat: -12.0378759, lng: -77.0441626 };

  directionsDisplay = new google.maps.DirectionsRenderer({
      suppressMarkers: true
  });

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: latLng,
  });

  directionsRenderer.setMap(map);
  directionsRenderer.setOptions( { suppressMarkers: true } );
  directionsRenderer.addListener("directions_changed", () => {
    computeTotalDistance(directionsRenderer.getDirections());
  });
}


function calculateAndDisplayRoute(directionsService, directionsRenderer) {
 
  const checkboxArray = document.getElementById("waypoints");

  arregloWaypts(rutaoptimizada)

  var indice = rutaoptimizada.length -1;

  directionsService.route(
    {
      origin: { lat:-12.09171455644324, lng: -77.0616125 },
      destination: { lat:rutaoptimizada[indice].location.lat , lng:rutaoptimizada[indice].location.lng },
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
      avoidTolls: true

    },
    (response, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(response);
        directionsDisplay.setDirections(response);
        const route = response.routes[0];
        const summaryPanel = document.getElementById("directions-panel");
        summaryPanel.innerHTML = "";

        pintarPuntos = route.waypoint_order;

        // For each route, display summary information.
        for (let i = 0; i < route.legs.length; i++) {
          const routeSegment = i + 1;
          summaryPanel.innerHTML +=
            "<b>Segmento "+ routeSegment +" Ruta: </b><br>";
          summaryPanel.innerHTML += route.legs[i].start_address + " <b>-></b> ";
          summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
          summaryPanel.innerHTML += "<b>Distancia: </b>" + route.legs[i].distance.text + " - <b>Tiempo: </b>" + route.legs[i].duration.text +"<br><br>";
        }
        setMarkers(map)

      } else {
        window.alert("Directions request failed due to " + status);
      }
    }
  );
}


function computeTotalDistance(result) {
  let totalD = 0;
  let totalT = 0;

  const myroute = result.routes[0];

  for (let i = 0; i < myroute.legs.length; i++) {
    totalD += myroute.legs[i].distance.value;
    totalT += myroute.legs[i].duration.value;
  }
  totalD = totalD / 1000;

  document.getElementById("totaldis").innerHTML = " " + totalD + " km ";
  document.getElementById("totaltie").innerHTML = " " + secondsToString(totalT)+" hrs";
}

function secondsToString(seconds) {

  var hour = Math.floor(seconds / 3600);
  hour = (hour < 10)? '0' + hour : hour;
  var minute = Math.floor((seconds / 60) % 60);
  minute = (minute < 10)? '0' + minute : minute;
  var second = seconds % 60;
  second = (second < 10)? '0' + second : second;
  return hour + ':' + minute ;
}

function setMarkers(map) {
  
  // Adds markers to the map.
  // Marker sizes are expressed as a Size of X,Y where the origin of the image
  // (0,0) is located in the top left of the image.
  // Origins, anchor positions and coordinates of the marker increase in the X
  // direction to the right and in the Y direction down.
  const image = {
    url:
      "../../html/assets/images/logo1_16x.png",
    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(32, 32),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    anchor: new google.maps.Point(0, 24),
  };
  // Shapes define the clickable region of the icon. The type defines an HTML
  // <area> element 'poly' which traces out a polygon as a series of X,Y points.
  // The final coordinate closes the poly by connecting to the first coordinate.
  const shape = {
    coords: [1, 1, 1, 20, 18, 20, 18, 1],
    type: "poly",
  };

  var contador = 0;

  if(pintarPuntos.length == 0){

      for (let i = 0; i < waypts.length; i++) {

          const mark =  new google.maps.Marker({
              position: { lat: waypts[i].location.lat, lng: waypts[i].location.lng },
              map,
              label:labels[i]
          });
          markers.push(mark); 
      }
    
  }else{

    for (var e = 0; e < pintarPuntos.length; e++) {

      for (let i = 0; i < waypts.length; i++) {
        
        if(pintarPuntos[e] == i){

          const mark =  new google.maps.Marker({
              position: { lat: waypts[i].location.lat, lng: waypts[i].location.lng },
              map,
              label:labels[contador]
          });
          markers.push(mark); 
          contador = contador + 1;
          break;
        }      
      }
    }
  }
  

  for (let x = 0; x < 1; x++) {

    const mark =  new google.maps.Marker({
        position: { lat: -12.09171455644324, lng: -77.0616125 },
        map,
        icon: image,
        shape: shape
    });

  }

}

function removerPuntoMap(v){
    for (var i = 0; i < wpts.length; i++) {
        if(wpts[i].value == v){
          wpts.splice(i, 1)
          break;
        }
    }

    arregloWaypts(wpts)

    var removediv = document.getElementById(`dr${v}`);
    removediv.remove();
    
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }

    setMarkers(map)

    if(wpts.length == 0){
        limpiarPuntosMap()      
    }
}

function limpiarPuntosMap(){
    directionsRenderer.setMap(null);
  
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }

    for (var e = 0; e < wpts.length; e++) {
         var removediv = document.getElementById(`dr${wpts[e].value}`);
        removediv.remove();
    }
    wpts = [];
    waypts = [];
    markers = [];
    const summaryPanel = document.getElementById("directions-panel");
    summaryPanel.innerHTML = "";
}

function optRoute(){

  waypts = [];

  for (var i = 0; i < wpts.length; i++) {
      waypts.push({
          location: wpts[i].location,
          stopover: wpts[i].stopover,
      });
  }

   directionsService.route(
    {
      origin: { lat:-12.09171455644324, lng: -77.0616125 },
      destination: { lat: -12.09171455644324, lng: -77.0616125 },
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,

    },
    (response, status) => {
      if (status === "OK") {
        const rout = response.routes[0];
        var ordenpuntos = rout.waypoint_order;

        var contador = 0;
        rutaoptimizada = [];

        for (var e = 0; e < ordenpuntos.length; e++) {

          for (let i = 0; i < waypts.length; i++) {
            
            if(ordenpuntos[e] == i){

              rutaoptimizada.push({
                  location: { lat: waypts[i].location.lat, lng: waypts[i].location.lng },
                  stopover: true
              });
              break;
            }      
          }
        }

        calculateAndDisplayRoute(directionsService, directionsRenderer);
        
      } else {
        window.alert("Directions request failed due to " + status);
      }
    }
  );
}

function arregloWaypts(w){
  waypts = [];

  for (var i = 0; i < w.length; i++) {
      waypts.push({
          location: w[i].location,
          stopover: w[i].stopover,
      });
  }
  
}

 