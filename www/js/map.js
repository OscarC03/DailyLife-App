$(document).ready(()=>{
})

$(window).on('load',()=>{
    let latitude;
    let longitude;

    navigator.geolocation.getCurrentPosition(
        (position)=>{
            latitude=position.coords.latitude;
            longitude=position.coords.longitude; 
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
                    cordova.plugin.http.sendRequest(`https://nominatim.openstreetmap.org/search?amenity=bus_station&city=fossano&format=jsonv2`,{method:'POST',data:{}},

                        function(Data){
                            let Result=JSON.parse(Data.data);
                            console.log(Result);
                        },
                
                        function(jqXHR){
                            navigator.notification.beep(1);
                            navigator.notification.confirm("Qualcosa è andato storto: aaaaaaa"+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
                        }
                    )
                },
        
                function(jqXHR){
                    navigator.notification.beep(1);
                    navigator.notification.confirm("Qualcosa è andato storto: aaaaaaa"+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
                }
              )
              //Aggiunge un layer con tutti i marker
              var markers = new ol.layer.Vector({
                source: new ol.source.Vector(),
                style: new ol.style.Style({
                  image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    src: '../Assets/IMG/E-Sad.png'
                  })
                })
              });
              map.addLayer(markers);
              console.log(markers);
    
              //Aggiunge un singolo marker
              var marker = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([longitude,latitude])));
              marker.name = "classeB";
              markers.getSource().addFeature(marker);
    
              /*var marker = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([7.6782969, 45.0625393])));
              marker.name = "classeA";
              markers.getSource().addFeature(marker);*/
    
              //Gestisco il click sulla mappa
              map.on('click', function (evt) {
                //Prelevo la feature cliccata
                const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                  return feature;
                });
                //Se esiste la feature
                if (feature) {
                  alert("Cliccato:" + feature.name);
                } else {
                 
                }
              });
    
              //Quando il mouse è sopra al marker 
              map.on('pointermove', function (e) {
                const pixel = map.getEventPixel(e.originalEvent);
                const hit = map.hasFeatureAtPixel(pixel);
                //Controllo se ho colpito un marker
                if(hit){
                  //Possono verificare quale marker è stato toccato con la funzione  map.forEachFeatureAtPixel(pixel, function (feature){...});
                  console.log("Sono sopra al marker");
                }
              });
    
              //Intercetto il movimento della mappa o facendo zoom
              map.on('movestart', function () {
                console.log("Stai muovendo la mappa");
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
    );



    /*$.ajax({
        url: "https://nominatim.openstreetmap.org/search?format=json&city=Torino",
        //data:"{ut:'"+user+"', pwd='"+md5(pwd)+"'}",
        type: 'GET',
        success: function (data) {
          console.log(data);
          let coord = [parseFloat(data[0].lon), parseFloat(data[0].lat)];
          console.log(coord);
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
              zoom: 15
            })
          });

          //Aggiunge un layer con tutti i marker
          var markers = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: new ol.style.Style({
              image: new ol.style.Icon({
                anchor: [0.5, 1],
                src: 'b1.png'
              })
            })
          });
          map.addLayer(markers);
          console.log(markers);

          //Aggiunge un singolo marker
          var marker = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([7.6871264,45.0708631])));
          marker.name = "classeB";
          markers.getSource().addFeature(marker);

          var marker = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([7.6782969, 45.0625393])));
          marker.name = "classeA";
          markers.getSource().addFeature(marker);

          //Gestisco il click sulla mappa
          map.on('click', function (evt) {
            //Prelevo la feature cliccata
            const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
              return feature;
            });
            //Se esiste la feature
            if (feature) {
              alert("Cliccato:" + feature.name);
            } else {
             
            }
          });

          //Quando il mouse è sopra al marker 
          map.on('pointermove', function (e) {
            const pixel = map.getEventPixel(e.originalEvent);
            const hit = map.hasFeatureAtPixel(pixel);
            //Controllo se ho colpito un marker
            if(hit){
              //Possono verificare quale marker è stato toccato con la funzione  map.forEachFeatureAtPixel(pixel, function (feature){...});
              console.log("Sono sopra al marker");
            }
          });

          //Intercetto il movimento della mappa o facendo zoom
          map.on('movestart', function () {
            console.log("Stai muovendo la mappa");
          });
          
        },
        error: function(e) {
            alert('Error: '+e);
        }  
    });*/
})