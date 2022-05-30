$(document).ready(()=>{
    navigator.splashscreen.hide();
})

$(window).on('load',()=>{

    cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getUmoreUtente',{method:'POST',data:{IDU:parseInt(localStorage.getItem('IDU'))}},
    function(srvData){
        let key=localStorage.getItem('key');
        let Result=JSON.parse(srvData.data);
        for(let item of Result)
            $('#scRiepilogoUmore').append('<div class="col-12 mb-2"><div class="d-flex justify-content-start bg-success ps-2 pe-2 pt-2 pb-2"><h3 class="text-white text-center font-responsive">'+item.Data+'</h3></div><div class="d-flex justify-content-evenly bg-white ps-2 pe-2 pt-2 pb-2"><h3 class="text-black font-responsive text-center">Felicità: '+item.Felicita+'/10</h3><h3 class="text-black font-responsive text-center">Stress: '+item.Stress+'/10</h3><h3 class="text-black font-responsive text-center">Fisico: '+item.Fisico+'/10</h3><h3 class="text-black font-responsive text-center">Mentale: '+item.Mentale+'/10</h3></div></div>')
    },

    function(jqXHR){
        navigator.notification.beep(1);
        navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
    }
)

    $('#btnBack').click(()=>{
        window.location.replace('../index.html');
    })

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