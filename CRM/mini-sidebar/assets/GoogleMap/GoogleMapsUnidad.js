//Globales  
let latUnidad = parseFloat($("#txtLatitudUnidad").val())
let lonUnidad = parseFloat( $("#txtLongitudUnidad").val())

console.log(latUnidad)
console.log(lonUnidad)

const citymap = {
 casaPedro: {
          center: { lat: latUnidad, lng: lonUnidad },
        },
        
};

$(document).ready(function () {

   

    $("#BtnLimpiarVertices_Zona").click(function () {
        $('#VerticesPoligonos_Zona').val("");
        $('#VerticesPoligonosEncode_Zona').val("");
        deleteSelectedShape();
        DeshabilitarDibujo();
        DrawingManager_Zona();
    })

})

 function initMap() {
        // Create the map.

                       
let latUsuario = parseFloat( $("#txtLatitud").val())
let lonUsuario = parseFloat( $("#txtLongitud").val())
console.log(latUsuario)
console.log(lonUsuario)

    let latLng = { lat: latUnidad, lng: lonUnidad};
        const map = new google.maps.Map(document.getElementById("GoogleMaps_Unidad"), {
          zoom: 16,
          center: latLng,
        });

        // Construct the circle for each value in citymap.
        // Note: We scale the area of the circle based on the population.
    for (const city in citymap) {
      // Add the circle for this city to the map.
      const cityCircle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map,
        center: citymap[city].center,
        radius: 300,
      });
      console.log(cityCircle)
    }


        var directionsServiceTmp = new google.maps.DirectionsService;
        var directionsDisplayTmp = new google.maps.DirectionsRenderer;

        location_ini = latUsuario + ',' + lonUsuario; 
        location_fin = latUnidad + ',' + lonUnidad;



        directionsServiceTmp.route({
            origin: location_ini,
            destination: location_fin,
            optimizeWaypoints: true,
            travelMode: 'DRIVING'
        }, function(response, status) {
            if (status === 'OK') {
                // Aqui con el response podemos acceder a la distancia como texto 
                ///console.log(response.routes[0].legs[0].distance.text);
                // Obtenemos la distancia como valor numerico en metros 
               //console.log(response.routes[0].legs[0].distance.value);
               if(response.routes[0].legs[0].distance.value < 500){
                    alert("estas dentro del rango "+response.routes[0].legs[0].distance.value+" mts. Mostrar botón INICIO.")
                    $("#BtnFinalizarRonda").show();
               }else{
                    alert("te encuentras fuera de rango "+response.routes[0].legs[0].distance.value+" mts. Se oculta botón INICIO");
                    $("#BtnFinalizarRonda").hide();
               }

                directionsDisplayTmp.setDirections(response);
            }
        });
       // directionsDisplayTmp.setMap(MapUnidad);


}