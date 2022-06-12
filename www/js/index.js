$(document).ready(()=>{
    if(sessionStorage.getItem("Available")==null)
        navigator.splashscreen.show();
    else
        navigator.splashscreen.hide();
})

$(window).on("load",()=>{
    //CONTROLLO SE SONO NEL PRIMO AVVIO DELL'APP
    let User=localStorage.getItem('Username');
    if(User==null){
        navigator.splashscreen.show();
        window.location.replace("../page/main.html");
    }
    else{   
        //controllo reinserimento pc a chiusura app
        if(sessionStorage.getItem('Available')==null){
            navigator.splashscreen.show();
            window.location.replace("../page/pin.html");
        }
        //$('#txtName').text(localStorage.getItem("Username"));
    }

    if(localStorage.getItem('Indexed')!=undefined){
        cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getPreferenceUser',{method:'POST',data:{User:localStorage.getItem('IDU')}},
    
            function(srvData){
                let Result=JSON.parse(srvData.data);
                for(let i=0;i<5;i++)
                    if(i==0)
                        $('#itemCarousel').append('<div class="carousel-item active"><img class="rounded-3" data-bs-interval="4000" src="https://cristaudo.altervista.org/IMG/'+Result[i].IMG+'" alt="'+Result[i].Tipo+'" style="width:inherit; height:10rem;"><div class="carousel-caption"><h3 class="text-center">'+Result[i].Tipo+'</h3></div></div>')
                    else                
                        $('#itemCarousel').append('<div class="carousel-item"><img class="rounded-3" data-bs-interval="4000" src="https://cristaudo.altervista.org/IMG/'+Result[i].IMG+'" alt="'+Result[i].Tipo+'" style="width:inherit; height:10rem;"><div class="carousel-caption"><h3 class="text-center">'+Result[i].Tipo+'</h3></div></div>')
    
            },
    
            function(jqXHR){
                connected=false;
                localStorage.clear();
                navigator.notification.beep(1);
                navigator.notification.confirm("Qualcosa è andato storto:"+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
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
                connected=false;
                localStorage.clear();
                navigator.notification.beep(1);
                navigator.notification.confirm("Qualcosa è andato storto:"+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
            }
        )
    }

    $("#btnCalendar").click(()=>{
        window.location.replace("../page/calendar.html");
        //navigator.splashscreen.show();
    })

    $("#btnOption").click(()=>{
        window.location.replace("../page/calendar.html");
        //navigator.splashscreen.show();
    });

    $('#btnList').click(()=>{
        window.location.replace('../page/list.html');
        //navigator.splashscreen.show();
    })

    $('#btnMap').click(()=>{
        navigator.splashscreen.show();
        window.location.replace('../page/map.html');
    })
})