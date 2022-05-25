$(document).ready(()=>{
    if(sessionStorage.getItem("Available")==null)
        navigator.splashscreen.show();
    else
        navigator.splashscreen.hide();
})

$(window).on("load",()=>{ 
    //CONTROLLO SE SONO NEL PRIMO AVVIO DELL'APP
    let User=localStorage.getItem('Username');
    if(User==null)
        window.location.replace("../page/main.html");
    else{
        //controllo reinserimento pc a chiusura app
        if(sessionStorage.getItem('Available')==null)
            window.location.replace("../page/pin.html");
        //$('#txtName').text(localStorage.getItem("Username"));   
    }

    cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getPreference',{method:'POST',data:{}},

    function(srvData){
        let Result=JSON.parse(srvData.data);
        for(let i=0;i<2;i++)
            if(i==0)
                $('#itemCarousel').append('<div class="carousel-item active"><img class="img-fluid" src="'+Result[i].IMG+'" alt="First slide"></div>')
            else                
                $('#itemCarousel').append('<div class="carousel-item"><img class="img-fluid" src="'+Result[i].IMG+'" alt="First slide"></div>')

    },

    function(jqXHR){
        connected=false;
        localStorage.clear();
        navigator.notification.beep(1);
        navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
    }
)
    
    $('#imgHumor').attr('src','../Assets/IMG/E-Sad.png');

    $("#btnCalendar").click(()=>{
        window.location.replace("../page/calendar.html");
        navigator.splashscreen.show();
    })

    $("#btnOption").click(()=>{
        window.location.replace("../page/calendar.html");
        navigator.splashscreen.show();
    });

    $('#btnList').click(()=>{
        window.location.replace('../page/list.html');
        navigator.splashscreen.show();
    })
})