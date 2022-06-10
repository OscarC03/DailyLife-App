$(document).ready(()=>{
})

$(window).on('load',()=>{
    //TEST CON LEAFLET\\
    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    });

    var satellite = L.tileLayer("http://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {id: 'MapID', tileSize: 512, zoomOffset: -1});

    var map = L.map('map', {
      zoom: 17,
      layers: [osm]
    }).fitWorld();

    var baseMaps = {
      "OpenStreetMap": osm,
      "Satellite":satellite
    };

    var layerControl = L.control.layers(baseMaps).addTo(map);
    
    map.locate({setView: true, maxZoom: 16});
    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);

    function onLocationFound(e) {
        map.setZoom(17)
        var radius = e.accuracy;
        console.log(e);
        L.marker(e.latlng).addTo(map).bindPopup("sei in questa zona di raggio: " + radius);

        cordova.plugin.http.sendRequest(`https://nominatim.openstreetmap.org/reverse?format=json&lon=${e.longitude}&lat=${e.latitude}`,{method:'GET',data:{}},

          function (srvData){
            let PlaceData=JSON.parse(srvData.data);
            console.log(PlaceData);
            cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getPreferenceUser',{method:'POST',data:{User:localStorage.getItem('IDU')}},

                function(srvData){
                    let Result=JSON.parse(srvData.data);
                    console.log(Result);
                    if(Result.length>0){
                      cordova.plugin.http.sendRequest(`http://overpass-api.de/api/interpreter?data=[out:json];(node[%22amenity%22](around:2000,${PlaceData.lat},${PlaceData.lon});way[%22amenity%22](around:2000,${PlaceData.lat},${PlaceData.lon});relation[%22amenity%22](around:2000,${PlaceData.lat},${PlaceData.lon}););out;%3E;`,{method:'GET',data:{}},

                        function(srvData){
                            let Place=JSON.parse(srvData.data);
                            console.log(Place);
                            if(Place.elements.length>0){
                              for(let i=0;i<Place.elements.length;i++){
                                console.log(Place.elements[i].tags.name);
    
                                for(let item of Result){
                                  if(Place.elements[i].tags.amenity==item.Key){
                                    var Icon = L.icon({
                                      iconUrl: `https://cristaudo.altervista.org/IMG/Markers/${item.Marker}`,
                                      shadowUrl: '../Assets/IMG/Shadow.png',
                              
                                      iconSize:     [80, 80], // size of the icon
                                      shadowSize:   [50, 64], // size of the shadow
                                      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                                      shadowAnchor: [4, 62],  // the same for the shadow
                                      popupAnchor:  [-5, -79] // point from which the popup should open relative to the iconAnchor
                                    });
    
                                    if(Place.elements[i].tags.name !="" && Place.elements[i].tags.name !=undefined)
                                      L.marker([parseFloat(Place.elements[i].lat), parseFloat(Place.elements[i].lon)], {icon: Icon}).addTo(map).bindPopup(Place.elements[i].tags.name);
                                    else
                                      L.marker([parseFloat(Place.elements[i].lat), parseFloat(Place.elements[i].lon)], {icon: Icon}).addTo(map).bindPopup("Elemento Senza Nome");
                                  }
                                }
    
                              }
                            }
                        },
                
                        function(jqXHR){
                            navigator.notification.beep(1);
                            navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
                        }
                      )
                    }
                },
        
                function(jqXHR){
                    navigator.notification.beep(1);
                    navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
                }
            )
          },

          function (jqXHR){
            navigator.notification.beep(1);
            navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
          }
        )
    }

    function onLocationError(e) {
        alert(e.message);
    }
  
    $('#btnBack').click(()=>{
      window.location.replace('../index.html');
    });
})