$(document).ready(()=>{
    navigator.splashscreen.hide();
})

$(window).on('load',()=>{

    cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getUmoreUtente',{method:'POST',data:{IDU:parseInt(localStorage.getItem('IDU'))}},
    function(srvData){
        let Happy="";
        let Stress="";
        let Mind="";
        let Body="";
        let bg="";

        let key=localStorage.getItem('key');
        let Result=JSON.parse(srvData.data);
        for(let item of Result){
            console.log(window.atob(item.Media));
            if(parseInt(window.atob(item.Felicita))>6)
                Happy='<i class="fa-regular fa-face-smile-beam"></i> Felice';
            else
                Happy='<i class="fa-regular fa-face-frown"></i> Triste'
            
            if(parseInt(window.atob(item.Stress))>6)
                Stress='<i class="fa-regular fa-face-frown-open"></i> Non Stressato';
            else
                Stress='<i class="fa-regular fa-face-laugh-beam"></i> Stressato';
            
            if(parseInt(window.atob(item.Fisico))>6)
                Body='<i class="fa-solid fa-heart-pulse"></i> Riposato';
            else
                Body='<i class="fa-solid fa-heart-crack"></i> Stanco Fisicamente';
            
            if(parseInt(window.atob(item.Mentale))>6)
                Mind='<i class="fa-solid fa-brain"></i> Riposato';
            else
                Mind='<i class="fa-solid fa-head-side-virus"></i> Stanco Mentalmente';

            if(parseInt(window.atob(item.Media))>=6 && parseInt(window.atob(item.Media))<7)
                bg="bg-warning";
            else if(parseInt(window.atob(item.Media))>=7)
                bg="bg-success";
            else
                bg="bg-danger";
            $('#scRiepilogoUmore').append('<div class="col-12 mb-2"><div class="d-flex justify-content-start '+bg+' ps-2 pe-2 pt-2 pb-2"><h3 class="text-white text-center font-responsive">'+item.Data+'</h3></div><div class="d-flex justify-content-evenly bg-white ps-2 pe-2 pt-2 pb-2"><h3 class="text-black font-responsive text-center">'+Happy+'</h3><h3 class="text-black font-responsive text-center">'+Stress+'</h3><h3 class="text-black font-responsive text-center">'+Body+'</h3><h3 class="text-black font-responsive text-center">'+Mind+'</h3></div></div>')
        }
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