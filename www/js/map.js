let vSplash=[];

$(document).ready(()=>{
})

$(window).on('load',()=>{
    //TEST CON LEAFLET\\
    //amenity
    //leisure
    //natural
    //building
    //landuse

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
        //console.log(e);
        L.marker(e.latlng).addTo(map).bindPopup("sei in questa zona di raggio: " + radius);

        cordova.plugin.http.sendRequest(`https://nominatim.openstreetmap.org/reverse?format=json&lon=${e.longitude}&lat=${e.latitude}`,{method:'GET',data:{}},

          function (srvData){
            let PlaceData=JSON.parse(srvData.data);
            //console.log(PlaceData);
            cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getPreferenceUser',{method:'POST',data:{User:localStorage.getItem('IDU')}},

                function(srvData){
                    let Result=JSON.parse(srvData.data);
                    let vPreferenze=[];
                    let vLeisure=[];
                    let vAmenities=[];
                    let vNatural=[];
                    let vLanduse=[];

                    //console.log(Result);
                    if(Result.length>0){
                      //Creazione vettore preferenze
                      for(let i=0;i<Result.length;i++){
                        let vAppoggio=[];
                        vAppoggio=Result[i].Key.split(',');

                        if(vAppoggio.length>1)
                          vAppoggio.forEach((item,index,array)=>{
                            vPreferenze.push({key:item,Marker:Result[i].Marker});
                          })
                        else
                          vPreferenze.push({key:Result[i].Key,Marker:Result[i].Marker});
                      }
                      console.log(vPreferenze);

                      cordova.plugin.http.sendRequest(`http://overpass-api.de/api/interpreter?data=[out:json];(node[%22amenity%22](around:2000,${e.latitude},${e.longitude});way[%22amenity%22](around:2000,${e.latitude},${e.longitude});relation[%22amenity%22](around:2000,${e.latitude},${e.longitude}););out;%3E;`,{method:'GET',data:{}},

                        function(srvData){
                            let amenities=JSON.parse(srvData.data);
                            //console.log(Place);
                            console.log(amenities.elements);
                            if(amenities.elements.length>0){
                              for(let i=0;i<amenities.elements.length;i++){
                                //console.log(Place.elements[i].tags.name);

                                  for(let key of vPreferenze){
                                    if(amenities.elements[i].tags.amenity==key.key){
                                      var Icon = L.icon({
                                        iconUrl: `https://cristaudo.altervista.org/IMG/Markers/${key.Marker}`,
                                        shadowUrl: '../Assets/IMG/Shadow.png',
                                
                                        iconSize:     [80, 80], // size of the icon
                                        shadowSize:   [50, 64], // size of the shadow
                                        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                                        shadowAnchor: [4, 62],  // the same for the shadow
                                        popupAnchor:  [18, -90] // point from which the popup should open relative to the iconAnchor
                                      });

                                      if(amenities.elements[i].lon != undefined && amenities.elements[i].lat != undefined)
                                        if(amenities.elements[i].tags.name !="" && amenities.elements[i].tags.name !=undefined && amenities.elements[i].lon != undefined && amenities.elements[i].lat != undefined)
                                          L.marker([parseFloat(amenities.elements[i].lat), parseFloat(amenities.elements[i].lon)], {icon: Icon}).addTo(map).bindPopup(amenities.elements[i].tags.name);
                                        else
                                          L.marker([parseFloat(amenities.elements[i].lat), parseFloat(amenities.elements[i].lon)], {icon: Icon}).addTo(map).bindPopup("Elemento Senza Nome");
                                    }
                                  }
                              }
                            }
                            vSplash.push(true);
                            removeSplash();
                        },
              
                        function(jqXHR){
                            navigator.notification.beep(1);
                            navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{window.location.replace('../index.html')}, "Attenzione", ["Chiudi"])
                        }
                      )

                      cordova.plugin.http.sendRequest(`http://overpass-api.de/api/interpreter?data=[out:json];(node[%22leisure%22](around:2000,${e.latitude},${e.longitude});way[%22leisure%22](around:2000,${e.latitude},${e.longitude});relation[%22leisure%22](around:2000,${e.latitude},${e.longitude}););out;%3E;`,{method:'GET',data:{}},

                        function(srvData){
                            let leisure=JSON.parse(srvData.data);
                            //console.log(Place);
                            console.log(leisure.elements);
                            if(leisure.elements.length>0){
                              if(leisure.elements.length>0){
                                //console.log(leisure.elements);
                                for(let i=0;i<leisure.elements.length;i++){
  
                                    for(let key of vPreferenze){
                                      if(leisure.elements[i].tags.leisure==key.key){
                                        var Icon = L.icon({
                                          iconUrl: `https://cristaudo.altervista.org/IMG/Markers/${key.Marker}`,
                                          shadowUrl: '../Assets/IMG/Shadow.png',
                                  
                                          iconSize:     [80, 80], // size of the icon
                                          shadowSize:   [50, 64], // size of the shadow
                                          iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                                          shadowAnchor: [4, 62],  // the same for the shadow
                                          popupAnchor:  [18, -90] // point from which the popup should open relative to the iconAnchor
                                        });

                                        if(leisure.elements[i].lon != undefined && leisure.elements[i].lat != undefined)
                                          if(leisure.elements[i].tags.sport !="" && leisure.elements[i].tags.sport !=undefined)
                                            L.marker([parseFloat(leisure.elements[i].lat), parseFloat(leisure.elements[i].lon)], {icon: Icon}).addTo(map).bindPopup(leisure.elements[i].tags.sport);
                                          else
                                            L.marker([parseFloat(leisure.elements[i].lat), parseFloat(leisure.elements[i].lon)], {icon: Icon}).addTo(map).bindPopup("Elemento Senza Nome");
                                      }
                                    }
                                }
                              }
                            }
                            vSplash.push(true);
                            removeSplash();
                        },
              
                        function(jqXHR){
                            navigator.notification.beep(1);
                            navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{/*window.location.replace('../index.html')*/}, "Attenzione", ["Chiudi"])
                        }
                      )

                      cordova.plugin.http.sendRequest(`http://overpass-api.de/api/interpreter?data=[out:json];(node[%22natural%22](around:2000,${e.latitude},${e.longitude});way[%22natural%22](around:2000,${e.latitude},${e.longitude});relation[%22natural%22](around:2000,${e.latitude},${e.longitude}););out;%3E;`,{method:'GET',data:{}},

                        function(srvData){
                            let natural=JSON.parse(srvData.data);
                            //console.log(Place);
                              if(natural.elements.length>0){
                                console.log(natural.elements);
                                for(let i=0;i<natural.elements.length;i++){
                                  for(let value of vPreferenze){
                                    if(value.key=="natural"){
                                      var Icon = L.icon({
                                        iconUrl: `https://cristaudo.altervista.org/IMG/Markers/${value.Marker}`,
                                        shadowUrl: '../Assets/IMG/Shadow.png',
                                
                                        iconSize:     [80, 80], // size of the icon
                                        shadowSize:   [50, 64], // size of the shadow
                                        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                                        shadowAnchor: [4, 62],  // the same for the shadow
                                        popupAnchor:  [18, -90] // point from which the popup should open relative to the iconAnchor
                                      });
    
                                      if(natural.elements[i].lon != undefined && natural.elements[i].lat != undefined)
                                        if(natural.elements[i].tags.natural !="" && natural.elements[i].tags.natural !=undefined)
                                          L.marker([parseFloat(natural.elements[i].lat), parseFloat(natural.elements[i].lon)], {icon: Icon}).addTo(map).bindPopup(natural.elements[i].tags.natural);
                                        else
                                          L.marker([parseFloat(natural.elements[i].lat), parseFloat(natural.elements[i].lon)], {icon: Icon}).addTo(map).bindPopup("Elemento Senza Nome");
                                    }
                                  }
                                }
                              }
                              vSplash.push(true);
                              removeSplash();
                        },
              
                        function(jqXHR){
                            navigator.notification.beep(1);
                            navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{window.location.replace('../index.html')}, "Attenzione", ["Chiudi"])
                        }
                      )

                      cordova.plugin.http.sendRequest(`http://overpass-api.de/api/interpreter?data=[out:json];(node[%22landuse%22](around:2000,${e.latitude},${e.longitude});way[%22landuse%22](around:2000,${e.latitude},${e.longitude});relation[%22landuse%22](around:2000,${e.latitude},${e.longitude}););out;%3E;`,{method:'GET',data:{}},

                        function(srvData){
                            let landuse=JSON.parse(srvData.data);
                            //console.log(Place);
                            console.log(landuse.elements);
                            if(landuse.elements.length>0){
                              if(landuse.elements.length>0){
                                //console.log(leisure.elements);
                                for(let i=0;i<landuse.elements.length;i++){
  
                                    for(let key of vPreferenze){
                                      if(landuse.elements[i].tags.landuse==key.key){
                                        var Icon = L.icon({
                                          iconUrl: `https://cristaudo.altervista.org/IMG/Markers/${key.Marker}`,
                                          shadowUrl: '../Assets/IMG/Shadow.png',
                                  
                                          iconSize:     [80, 80], // size of the icon
                                          shadowSize:   [50, 64], // size of the shadow
                                          iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                                          shadowAnchor: [4, 62],  // the same for the shadow
                                          popupAnchor:  [18, -90] // point from which the popup should open relative to the iconAnchor
                                        });

                                        if(landuse.elements[i].lon != undefined && landuse.elements[i].lat != undefined)
                                          if(landuse.elements[i].tags.landuse !="" && landuse.elements[i].tags.landuse !=undefined)
                                            L.marker([parseFloat(landuse.elements[i].lat), parseFloat(landuse.elements[i].lon)], {icon: Icon}).addTo(map).bindPopup(landuse.elements[i].tags.landuse);
                                          else
                                            L.marker([parseFloat(landuse.elements[i].lat), parseFloat(landuse.elements[i].lon)], {icon: Icon}).addTo(map).bindPopup("Elemento Senza Nome");
                                      }
                                    }
                                }
                              }
                            }
                            vSplash.push(true);
                            removeSplash();
                        },
              
                        function(jqXHR){
                            navigator.notification.beep(1);
                            navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{window.location.replace('../index.html')}, "Attenzione", ["Chiudi"])
                        }
                      )

                    }
                },
        
                function(jqXHR){
                    navigator.notification.beep(1);
                    navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{window.location.replace('../index.html')}, "Attenzione", ["Chiudi"])
                }
            )
          },

          function (jqXHR){
            navigator.notification.beep(1);
            navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{window.location.replace('../index.html')}, "Attenzione", ["Chiudi"])
          }
        )
    }

    function onLocationError(e) {
      navigator.notification.beep(1);
      navigator.notification.confirm("Qualcosa è andato storto: "+e.message, ()=>{window.location.replace('../index.html')}, "Attenzione", ["Chiudi"])
    }
  
    $('#btnBack').click(()=>{
      window.location.replace('../index.html');
    });

    function removeSplash(){
      if(vSplash.length==4){
        navigator.splashscreen.hide();
      }
    }
})

/*cordova.plugin.http.sendRequest(`http://overpass-api.de/api/interpreter?data=[out:json];(node[%22amenity%22](around:2000,${PlaceData.lat},${PlaceData.lon});way[%22amenity%22](around:2000,${PlaceData.lat},${PlaceData.lon});relation[%22amenity%22](around:2000,${PlaceData.lat},${PlaceData.lon}););out;%3E;`,{method:'GET',data:{}},

                        function(srvData){
                            let Place=JSON.parse(srvData.data);
                            console.log(Place);
                            if(Place.elements.length>0){
                              for(let i=0;i<Place.elements.length;i++){
                                //console.log(Place.elements[i].tags.name);
    
                                for(let item of Result){
                                  if(Place.elements[i].tags.amenity==item.Key){
                                    var Icon = L.icon({
                                      iconUrl: `https://cristaudo.altervista.org/IMG/Markers/${item.Marker}`,
                                      shadowUrl: '../Assets/IMG/Shadow.png',
                              
                                      iconSize:     [80, 80], // size of the icon
                                      shadowSize:   [50, 64], // size of the shadow
                                      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                                      shadowAnchor: [4, 62],  // the same for the shadow
                                      popupAnchor:  [18, -90] // point from which the popup should open relative to the iconAnchor
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
                            navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{window.location.replace('../index.html')}, "Attenzione", ["Chiudi"])
                        }
                      )

                      cordova.plugin.http.sendRequest(`http://overpass-api.de/api/interpreter?data=[out:json];(node[%22building%22](around:2000,${PlaceData.lat},${PlaceData.lon});way[%22building%22](around:2000,${PlaceData.lat},${PlaceData.lon});relation[%22building%22](around:2000,${PlaceData.lat},${PlaceData.lon}););out;%3E;`,{method:'GET',data:{}},

                        function(srvData){
                            let Leisure=JSON.parse(srvData.data);
                            console.log(Leisure);
                            if(Leisure.elements.length>0){
                              for(let i=0;i<Leisure.elements.length;i++){
                                console.log(Leisure.elements[i]);
    
                                for(let item of Result){
                                  if(Leisure.elements[i].tags.amenity==item.Key){
                                    var Icon = L.icon({
                                      iconUrl: `https://cristaudo.altervista.org/IMG/Markers/${item.Marker}`,
                                      shadowUrl: '../Assets/IMG/Shadow.png',
                              
                                      iconSize:     [80, 80], // size of the icon
                                      shadowSize:   [50, 64], // size of the shadow
                                      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                                      shadowAnchor: [4, 62],  // the same for the shadow
                                      popupAnchor:  [18, -90] // point from which the popup should open relative to the iconAnchor
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
                            navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{window.location.replace('../index.html')}, "Attenzione", ["Chiudi"])
                        }
                      )*/