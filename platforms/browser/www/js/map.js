let vSplash=[];

$(document).ready(()=>{
})

$(window).on('load',()=>{
    var x2js = new X2JS();
    var osm = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    });

    var satellite = L.tileLayer("https://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {id: 'MapID', tileSize: 512, zoomOffset: -1});

    var map = L.map('map', {
      zoom: 17,
      layers: [osm],
      preferCanvas: true
    }).fitWorld();

    var baseMaps = {
      "Strade": osm,
      "Satellite":satellite
    };

    var layerControl = L.control.layers(baseMaps).addTo(map);
    
    map.locate({setView: true, maxZoom: 16});
    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);

    function onLocationFound(es) {
        map.setZoom(17)
        var radius = es.accuracy;
        //console.log(e);
        L.marker(es.latlng).addTo(map).bindPopup("sei in questa zona di raggio: " + Math.round(radius));
        let e={latitude:44.5493489,longitude:7.7250155};

        cordova.plugin.http.sendRequest(`https://nominatim.openstreetmap.org/reverse?format=json&lon=${e.longitude}&lat=${e.latitude}`,{method:'GET',data:{}},

          function (srvData){
            let PlaceData=JSON.parse(srvData.data);
            console.log(PlaceData);
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

                      cordova.plugin.http.sendRequest(`https://maps.mail.ru/osm/tools/overpass/api/interpreter?data=[out:json];(node[%22amenity%22](around:2000,${e.latitude},${e.longitude});way[%22amenity%22](around:2000,${e.latitude},${e.longitude});relation[%22amenity%22](around:2000,${e.latitude},${e.longitude}););out;%3E;`,{method:'GET',data:{}},

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
                                          createMarker(amenities.elements[i].tags.name,parseFloat(amenities.elements[i].lat), parseFloat(amenities.elements[i].lon),'#FF5D5D','#A10035');
                                        else
                                          createMarker('Servizio senza nome',parseFloat(amenities.elements[i].lat), parseFloat(amenities.elements[i].lon),'#FF5D5D','#A10035');
                                          else if(amenities.elements[i].nodes!=undefined){
                                              cordova.plugin.http.sendRequest(`https://api.openstreetmap.org/api/0.6/node/${amenities.elements[i].nodes[0]}`,{method:'GET',data:{}},
                        
                                                function(srvData){
                                                    let itemNode=x2js.xml_str2json(srvData.data);
                                                    console.log(itemNode);
                                                    createMarker('Servizio senza nome',itemNode.osm.node._lat,itemNode.osm.node._lon,'#FF5D5D','#A10035');
                                                      vSplash.push(true);
                                                      removeSplash();
                                                },
                                      
                                                function(jqXHR){
                                                    console.log(jqXHR.error);
                                                    navigator.notification.beep(1);
                                                    navigator.notification.alert("Qualcosa è andato storto: node amenities"+jqXHR.error, ()=>{window.location.replace('../index.html')}, "Attenzione", ["Chiudi"])
                                                }
                                              )
                                          }
                                    }
                                  }
                              }
                            }
                            vSplash.push(true);
                            removeSplash();
                        },
              
                        function(jqXHR){
                          console.log(jqXHR.error);
                            navigator.notification.beep(1);
                            navigator.notification.alert("Qualcosa è andato storto: amenities"+jqXHR.error, ()=>{window.location.replace('../index.html');}, "Attenzione", ["Chiudi"])
                        }
                      )

                      cordova.plugin.http.sendRequest(`https://maps.mail.ru/osm/tools/overpass/api/interpreter?data=[out:json];(node[%22leisure%22](around:2000,${e.latitude},${e.longitude});way[%22leisure%22](around:2000,${e.latitude},${e.longitude});relation[%22leisure%22](around:2000,${e.latitude},${e.longitude}););out;%3E;`,{method:'GET',data:{}},

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
                                        if(leisure.elements[i].lon != undefined && leisure.elements[i].lat != undefined)
                                          if(leisure.elements[i].tags.name !="" && leisure.elements[i].tags.name !=undefined)
                                            createMarker(leisure.elements[i].tags.name,parseFloat(leisure.elements[i].lat), parseFloat(leisure.elements[i].lon),'#1363DF','#47B5FF');
                                          else
                                            createMarker('Elemento per tempo libero senza nome',parseFloat(leisure.elements[i].lat), parseFloat(leisure.elements[i].lon),'#1363DF','#47B5FF');
                                          else if(leisure.elements[i].nodes!=undefined){
                                              cordova.plugin.http.sendRequest(`https://api.openstreetmap.org/api/0.6/node/${leisure.elements[i].nodes[0]}`,{method:'GET',data:{}},
                        
                                                function(srvData){
                                                    let itemNode=x2js.xml_str2json(srvData.data);
                                                    console.log(itemNode);
                                                      createMarker('Elemento per tempo libero senza nome',itemNode.osm.node._lat,itemNode.osm.node._lon,'#1363DF','#47B5FF');
                                                      vSplash.push(true);
                                                      removeSplash();
                                                },
                                      
                                                function(jqXHR){
                                                    console.log(jqXHR.error);
                                                    navigator.notification.beep(1);
                                                    navigator.notification.alert("Qualcosa è andato storto: node leisure"+jqXHR.error, ()=>{window.location.replace('../index.html')}, "Attenzione", ["Chiudi"])
                                                }
                                              )
                                          }
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
                            navigator.notification.alert("Qualcosa è andato storto: leisure"+jqXHR.error, ()=>{window.location.replace('../index.html');}, "Attenzione", ["Chiudi"])
                        }
                      )

                      cordova.plugin.http.sendRequest(`https://maps.mail.ru/osm/tools/overpass/api/interpreter?data=[out:json];(node[%22natural%22](around:2000,${e.latitude},${e.longitude});way[%22natural%22](around:2000,${e.latitude},${e.longitude});relation[%22natural%22](around:2000,${e.latitude},${e.longitude}););out;%3E;`,{method:'GET',data:{}},

                        function(srvData){
                            let natural=JSON.parse(srvData.data);
                            //console.log(Place);
                              if(natural.elements.length>0){
                                console.log(natural.elements);
                                for(let i=0;i<natural.elements.length;i++){
                                  for(let value of vPreferenze){
                                    if(value.key=="natural"){
                                      if(natural.elements[i].lon != undefined && natural.elements[i].lat != undefined)
                                        if(natural.elements[i].tags.natural !="" && natural.elements[i].tags.natural !=undefined)
                                          createMarker(natural.elements[i].tags.natural,parseFloat(natural.elements[i].lat),parseFloat(natural.elements[i].lon),'#1A4D2E','#76BA99');
                                        else
                                          createMarker('Elemento naturale senza nome',parseFloat(natural.elements[i].lat),parseFloat(natural.elements[i].lon),'#1A4D2E','#76BA99');
                                          else if(natural.elements[i].nodes!=undefined){
                                              cordova.plugin.http.sendRequest(`https://api.openstreetmap.org/api/0.6/node/${natural.elements[i].nodes[0]}`,{method:'GET',data:{}},
                        
                                                function(srvData){
                                                    let itemNode=x2js.xml_str2json(srvData.data);
                                                    console.log(itemNode);
                                                    createMarker('Elemento naturale senza nome',itemNode.osm.node._lat,itemNode.osm.node._lon,'#1A4D2E','#76BA99');
                                                      vSplash.push(true);
                                                      removeSplash();
                                                },
                                      
                                                function(jqXHR){
                                                    console.log(jqXHR.error);
                                                    navigator.notification.beep(1);
                                                    navigator.notification.alert("Qualcosa è andato storto: node natural"+jqXHR.error, ()=>{window.location.replace('../index.html')}, "Attenzione", ["Chiudi"])
                                                }
                                              )
                                          }
                                    }
                                  }
                                }
                              }
                              vSplash.push(true);
                              removeSplash();
                        },
              
                        function(jqXHR){
                          console.log(jqXHR.error);
                            navigator.notification.beep(1);
                            navigator.notification.alert("Qualcosa è andato storto: natural"+jqXHR.error, ()=>{window.location.replace('../index.html')}, "Attenzione", ["Chiudi"])
                        }
                      )

                      cordova.plugin.http.sendRequest(`https://maps.mail.ru/osm/tools/overpass/api/interpreter?data=[out:json];(node[%22landuse%22](around:2000,${e.latitude},${e.longitude});way[%22landuse%22](around:2000,${e.latitude},${e.longitude});relation[%22landuse%22](around:2000,${e.latitude},${e.longitude}););out;%3E;`,{method:'GET',data:{}},

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
                                        if(landuse.elements[i].lon != undefined && landuse.elements[i].lat != undefined)
                                          if(landuse.elements[i].tags.landuse !="" && landuse.elements[i].tags.landuse !=undefined)
                                            createMarker(landuse.elements[i].tags.landuse,parseFloat(landuse.elements[i].lat),parseFloat(landuse.elements[i].lon),'#14C38E','#5FD068');
                                          else
                                            createMarker("Elemento natuirale senza nome",parseFloat(landuse.elements[i].lat),parseFloat(landuse.elements[i].lon),'#14C38E','#5FD068');
                                            else if(landuse.elements[i].nodes!=undefined){
                                                cordova.plugin.http.sendRequest(`https://api.openstreetmap.org/api/0.6/node/${landuse.elements[i].nodes[0]}`,{method:'GET',data:{}},
                          
                                                  function(srvData){
                                                      let itemNode=x2js.xml_str2json(srvData.data);
                                                      console.log(itemNode);
                                                      createMarker("Elemento natuirale senza nome",itemNode.osm.node._lat,itemNode.osm.node._lon,'#14C38E','#5FD068');
                                                      vSplash.push(true);
                                                      removeSplash();
                                                  },
                                        
                                                  function(jqXHR){
                                                      console.log(jqXHR.error);
                                                      navigator.notification.beep(1);
                                                      navigator.notification.alert("Qualcosa è andato storto: node landuse "+jqXHR.error, ()=>{window.location.replace('../index.html')}, "Attenzione", ["Chiudi"])
                                                  }
                                                )
                                            }
                                      }
                                    }
                                }
                              }
                            }
                            vSplash.push(true);
                            removeSplash();
                        },
              
                        function(jqXHR){
                            console.log(jqXHR.error);
                            navigator.notification.beep(1);
                            navigator.notification.alert("Qualcosa è andato storto: landuse"+jqXHR.error, ()=>{window.location.replace('../index.html')}, "Attenzione", ["Chiudi"])
                        }
                      )

                    }
                },
        
                function(jqXHR){
                    navigator.notification.beep(1);
                    navigator.notification.alert("Qualcosa è andato storto: "+jqXHR.error, ()=>{window.location.replace('../index.html')}, "Attenzione", ["Chiudi"])
                }
            )
          },

          function (jqXHR){
            navigator.notification.beep(1);
            navigator.notification.alert("Qualcosa è andato storto: "+jqXHR.error, ()=>{window.location.replace('../index.html')}, "Attenzione", ["Chiudi"])
          }
        )
    }

    function onLocationError(e) {
      navigator.notification.beep(1);
      navigator.notification.alert("Qualcosa è andato storto: "+e.message, ()=>{window.location.replace('../index.html')}, "Attenzione", ["Chiudi"])
    }
  
    $('#btnBack').click(()=>{
      window.location.replace('../index.html');
    });

    function removeSplash(){
      if(vSplash.length==8){
        navigator.splashscreen.hide();
      }
    }

    function createMarker(title,lat,lon,color,fill){
      var circle = L.circle([parseFloat(lat),parseFloat(lon)], {
        color: color,
        fillColor: fill,
        fillOpacity: 0.2,
        radius: 20
      }).addTo(map).bindPopup(title);
    }
})

function XmlToJson(xml) {
  const json = {};
  for (const res of xml.matchAll(/(?:<(\w*)(?:\s[^>]*)*>)((?:(?!<\1).)*)(?:<\/\1>)|<(\w*)(?:\s*)*\/>/gm)) {
      const key = res[1] || res[3];
      const value = res[2] && XmlToJson(res[2]);
      json[key] = ((value && Object.keys(value).length) ? value : res[2]) || null;
  }
  return json;
}