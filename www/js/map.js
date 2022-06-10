$(document).ready(()=>{
})

$(window).on('load',()=>{
    let latitude;
    let longitude;

    /*navigator.geolocation.getCurrentPosition(
        (position)=>{
            latitude=position.coords.latitude;
            longitude=position.coords.longitude;
            var Markers;
            console.log(latitude+" - "+longitude);
            cordova.plugin.http.sendRequest(`https://nominatim.openstreetmap.org/reverse?format=json&lon=${longitude}&lat=${latitude}`,{method:'GET',data:{}},

            function(srvData){
                let data=JSON.parse(srvData.data);
              let coord = [data.lon, data.lat];
              console.log("Coordinate ==> "+coord);
              //Visualizzo la mappa centrata su narzole
              var map = new ol.Map({
                target: 'map',
                layers: [
                  new ol.layer.Tile({
                    source: new ol.source.OSM()
                  })
                ],
                view: new ol.View({
                  center: ol.proj.fromLonLat(coord),
                  zoom: 18
                })
              });

              cordova.plugin.http.sendRequest(`https://nominatim.openstreetmap.org/reverse?format=json&lon=${longitude}&lat=${latitude}`,{method:'GET',data:{}},
                function(srvData){
                    let Citta=JSON.parse(srvData.data);
                    console.log(Citta.address.village);
                    cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getPreferenceUser',{method:'POST',data:{User:localStorage.getItem('IDU')}},

                        function(srvData){
                            let Result=JSON.parse(srvData.data);
                            console.log(Result);
                            for(let i=0;i<Result.length;i++){
                              Markers=null;
                              //Aggiunge un layer con tutti i marker
                              Markers = new ol.layer.Vector({
                                source: new ol.source.Vector(),
                                style: new ol.style.Style({
                                  image: new ol.style.Icon({
                                    anchor: [0.5, 1],
                                    src: `http://cristaudo.altervista.org/IMG/Markers/${Result[i].Marker}`
                                  })
                                })
                              });

                              cordova.plugin.http.sendRequest(`https://nominatim.openstreetmap.org/search.php?q=${Result[i].Key}+fossano&format=jsonv2`,{method:'GET',data:{}},

                                  function(srvData){
                                      let Place=JSON.parse(srvData.data);
                                      console.log(Place);
                                      if(Place.length>0){
                                        for(let item of Place){
                                          console.log(Result[i].Marker + " - " + Place[i].display_name);
                                          var marker = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([item.lon,item.lat])));
                                          marker.name = item.display_name;
                                          Markers.getSource().addFeature(marker);
                                        }
                                      }
                                  },
                          
                                  function(jqXHR){
                                      navigator.notification.beep(1);
                                      navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
                                  }
                              )
                              console.log(Markers);
                              map.addLayer(Markers);
                            }
                        },
                
                        function(jqXHR){
                            navigator.notification.beep(1);
                            navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
                        }
                    )
                },
        
                function(jqXHR){
                    navigator.notification.beep(1);
                    navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
                }
              )
    
              //Gestisco il click sulla mappa
              map.on('click', function (evt) {
                //Prelevo la feature cliccata
                let feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                  return feature;
                });
                //Se esiste la feature
                if (feature) {
                  alert("Cliccato:" + feature.name);
                } else {
                 
                }
              });
            },
    
            function(jqXHR){
                navigator.notification.beep(1);
                navigator.notification.confirm("Qualcosa è andato storto:"+jqXHR.error, ()=>{window.location.replace('../index.html');}, "Attenzione", ["Chiudi"])
            }
        )
        },

        (jqXHR)=>{
            navigator.notification.beep(1);
            navigator.notification.confirm("Qualcosa è andato storto:"+jqXHR.error, ()=>{window.location.replace('../index.html');}, "Attenzione", ["Chiudi"])
        },
    );*/

    //http://overpass-turbo.eu/?w=amenity%3Dpub+in+fossano&R

    /*
    [out:json][timeout:25];{{geocodeArea:fossano}}->.searchArea;(node["amenity"="bar"](area.searchArea);way["amenity"="bar"](area.searchArea);relation["amenity"="bar"](area.searchArea););
    */

    cordova.plugin.http.sendRequest(`http://overpass-api.de/api/interpreter?data=[out:json];(node[%22amenity%22](around:2000,51.5,0.01);way[%22amenity%22](around:2000,51.5,0.01);relation[%22amenity%22](around:2000,51.5,0.01););out;%3E;`,{method:'GET',data:{}},

      function(srvData){
          let Place=JSON.parse(srvData.data);
          console.log(Place);
          /*if(Place.length>0){
            for(let item of Place){
              var Icon = L.icon({
                  iconUrl: `https://cristaudo.altervista.org/IMG/Markers/${Result[i].Marker}`,
                  shadowUrl: '../Assets/ING/Shadow.png',
            
                  iconSize:     [80, 80], // size of the icon
                  shadowSize:   [50, 64], // size of the shadow
                  iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                  shadowAnchor: [4, 62],  // the same for the shadow
                  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
              });

              console.log(Result[i].Marker + " - " + item.display_name);
              L.marker([parseFloat(item.lat), parseFloat(item.lon)], {icon: Icon}).addTo(map).bindPopup(item.display_name);
            }
          }*/
      },

      function(jqXHR){
          navigator.notification.beep(1);
          navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
      }
    )

    //TEST CON LEAFLET\\

    var map = L.map('map').fitWorld();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);
    
    map.locate({setView: true, maxZoom: 16});
    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);

    function onLocationFound(e) {
        var radius = e.accuracy;
        console.log(e);
        L.marker(e.latlng).addTo(map).bindPopup("You are within " + radius + " meters from this point").openPopup();

        cordova.plugin.http.sendRequest(`https://nominatim.openstreetmap.org/reverse?format=json&lon=${e.longitude}&lat=${e.latitude}`,{method:'GET',data:{}},

          function (srvData){
            let PlaceData=JSON.parse(srvData.data);
            let Citta=PlaceData.address.village;
            console.log(PlaceData);
            cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getPreferenceUser',{method:'POST',data:{User:localStorage.getItem('IDU')}},

                function(srvData){
                    let Result=JSON.parse(srvData.data);
                    console.log(Result);

                    cordova.plugin.http.sendRequest(`http://overpass-api.de/api/interpreter?data=[out:json];(node[%22amenity%22](around:2000,${PlaceData.lat},${PlaceData.lon});way[%22amenity%22](around:2000,${PlaceData.lat},${PlaceData.lon});relation[%22amenity%22](around:2000,${PlaceData.lat},${PlaceData.lon}););out;%3E;`,{method:'GET',data:{}},

                    function(srvData){
                        let Place=JSON.parse(srvData.data);
                        console.log(Place);
                        if(Place.elements.length>0){
                          for(let i=0;i<Place.elements.length;i++){
                            console.log(Place.elements[i].tags.amenity)

                            for(let item of Result){
                              if(Place.elements[i].tags.amenity==item.Key){
                                var Icon = L.icon({
                                  iconUrl: `https://cristaudo.altervista.org/IMG/Markers/${item.Marker}`,
                                  shadowUrl: '../Assets/IMG/Shadow.png',
                          
                                  iconSize:     [80, 80], // size of the icon
                                  shadowSize:   [60, 60], // size of the shadow
                                  iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                                  shadowAnchor: [4, 62],  // the same for the shadow
                                  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
                                });

                                if(Place.elements[i].tags.name !="" || Place.elements[i].tags.name !=null)
                                  L.marker([parseFloat(Place.elements[i].lat), parseFloat(Place.elements[i].lon)], {icon: Icon}).addTo(map).bindPopup(Place.elements[i].tags.name);
                                else
                                  L.marker([parseFloat(Place.elements[i].lat), parseFloat(Place.elements[i].lon)], {icon: Icon}).addTo(map);
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
                    Result.forEach((item,i,vect)=>{
                      
                      /*cordova.plugin.http.sendRequest(`https://nominatim.openstreetmap.org/search.php?q=${item.Key}+${Citta}&format=jsonv2`,{method:'GET',data:{}},

                          function(srvData){
                              let Place=JSON.parse(srvData.data);
                              console.log(Place);
                              if(Place.length>0){
                                for(let item of Place){
                                  var Icon = L.icon({
                                      iconUrl: `https://cristaudo.altervista.org/IMG/Markers/${Result[i].Marker}`,
                                      shadowUrl: '../Assets/ING/Shadow.png',
                                
                                      iconSize:     [80, 80], // size of the icon
                                      shadowSize:   [50, 64], // size of the shadow
                                      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                                      shadowAnchor: [4, 62],  // the same for the shadow
                                      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
                                  });

                                  console.log(Result[i].Marker + " - " + item.display_name);
                                  L.marker([parseFloat(item.lat), parseFloat(item.lon)], {icon: Icon}).addTo(map).bindPopup(item.display_name);
                                }
                              }
                          },
                  
                          function(jqXHR){
                              navigator.notification.beep(1);
                              navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
                          }
                      )*/
                    })
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