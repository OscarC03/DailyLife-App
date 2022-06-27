let vSplash=[];
var deviceHeight=Math.max(window.screen.height, window.innerHeight);

$(window).on("load",()=>{

    $('#btnHomeMap').css({backgroundColor:'#50CB93'});
    $('#btnHomeCalendar').css({backgroundColor:'#50CB93'});
    $('#btnHomeList').css({backgroundColor:'#50CB93'});
    $('#btnHomeOption').css({backgroundColor:'#50CB93'});
    //$('#centered').css({height:deviceHeight - 80+'px','overflow-y':'auto'});

    cordova.plugins.notification.local.requestPermission(function (granted) {
        console.log(granted);
        cordova.plugins.notification.local.setDefaults({
            led: { color: '#50CB93', on: 500, off: 500 },
            vibrate: true
        });
    });
    
    //CONTROLLO SE SONO NEL PRIMO AVVIO DELL'APP
    let User=localStorage.getItem('Username');
    if(User==null){
        window.location.replace("../page/main.html");
    }
    else{   
        //controllo reinserimento pc a chiusura app
        if(sessionStorage.getItem('Available')==null){
            window.location.replace("../page/pin.html");
        }
    }

    if(localStorage.getItem('Indexed')!=null){
        cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getPreferenceUser',{method:'POST',data:{User:localStorage.getItem('IDU')}},
    
            function(srvData){
                let Result=JSON.parse(srvData.data);
                for(let i=0;i<5;i++)
                    if(i==0)
                        $('#itemCarousel').append('<div class="carousel-item active"><img class="rounded-3" data-bs-interval="4000" src="https://cristaudo.altervista.org/IMG/'+Result[i].IMG+'" alt="'+Result[i].Tipo+'" style="width:inherit; height:10rem; border:2px solid white;"><div class="carousel-caption"><h3 class="text-center" style="text-shadow: 1px 1px 2px black, 0 0 25px rgb(30, 30, 32), 0 0 5px rgb(17, 17, 17);">'+Result[i].Tipo+'</h3></div></div>')
                    else                
                        $('#itemCarousel').append('<div class="carousel-item"><img class="rounded-3" data-bs-interval="4000" src="https://cristaudo.altervista.org/IMG/'+Result[i].IMG+'" alt="'+Result[i].Tipo+'" style="width:inherit; height:10rem; border:2px solid white;"><div class="carousel-caption"><h3 class="text-center" style="text-shadow: 1px 1px 2px black, 0 0 25px rgb(30, 30, 32), 0 0 5px rgb(17, 17, 17);">'+Result[i].Tipo+'</h3></div></div>')
                vSplash.push(true);
                removeSplash();
            },
    
            function(jqXHR){
                navigator.notification.beep(1);
                navigator.notification.alert("Qualcosa è andato storto:"+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
            }
        )
    
        cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getUmoreUtente',{method:'POST',data:{IDU:localStorage.getItem('IDU')}},
    
            function(srvData){
                let key=localStorage.getItem('key');
                let Result=JSON.parse(srvData.data);
                console.log(Result);
                let vHumor=[];
                let vDate=[];
                Result.forEach((item,index,array)=>{
                    vDate.push(item.Data);
                    vHumor.push(CryptoJS.AES.decrypt(item.Media,key).toString(CryptoJS.enc.Utf8))
                })
    
                if(Result.length>4){
                    vSplash.push(true);
                    removeSplash();
                    const ctx = document.getElementById('humorChart').getContext('2d');
                    const myChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: vDate,
                            datasets: [{
                                label: 'Media parametrica umore:',
                                data: vHumor,
                                backgroundColor:"rgb(80,203,147)",
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            },
                            responsive: true,
                            maintainAspectRatio: false
                        }
                    });
                }
                else{
                    vSplash.push(true);
                    removeSplash();
                    const ctx = document.getElementById('humorChart').getContext('2d');
                    const myChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: ['Daily Life','Daily Life','Daily Life','Daily Life','Daily Life'],
                            datasets: [{
                                label: 'Inserisci dei dati per creare un grafico',
                                data: [10,30,20,40,5],
                                backgroundColor:`rgb(80,203,147)`
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            },
                            responsive: true,
                            maintainAspectRatio: false,
                            events:[]
                        }
                    });
                }
            },
    
            function(jqXHR){
                navigator.notification.beep(1);
                navigator.notification.alert("Qualcosa è andato storto:"+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
            }
        )
    }

    $('#btnInsert').click(()=>{
        $('.dropdown-menu-center').hide().fadeIn(300)
    })
    $("#btnCalendar").click(()=>{
        window.location.replace("../page/calendar.html");
    })

    $("#btnOption").click(()=>{
        navigator.splashscreen.show();
        window.location.replace("../page/option.html");
    });

    $('#btnList').click(()=>{
        window.location.replace('../page/list.html');
    })

    $('#btnMap').click(()=>{
        navigator.splashscreen.show();
        window.location.replace('../page/map.html');
    })

    $('#btnHomeMap').click(()=>{
        $('#btnHomeMap').css({backgroundColor:'#26b662'}); 
        navigator.splashscreen.show();
        window.location.replace('../page/map.html');
    })

    $('#btnHomeCalendar').click(()=>{
        $('#btnHomeCalendar').css({backgroundColor:'#26b662'});
        window.location.replace("../page/calendar.html");
    })

    $('#btnHomeList').click(()=>{
        $('#btnHomeList').css({backgroundColor:'#26b662'});
        window.location.replace('../page/list.html');
    })

    $('#btnHomeOption').click(()=>{
        $('#btnHomeOption').css({backgroundColor:'#26b662'});
        navigator.splashscreen.show();
        window.location.replace("../page/option.html");
    })

    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        if(localStorage.getItem('Available')!=null)
            navigator.splashscreen.hide();
    }
})

function removeSplash(){
  if(vSplash.length==2){
    navigator.splashscreen.hide();
  }
}