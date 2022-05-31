$(document).ready(()=>{
    navigator.splashscreen.hide();
})

$(window).on('load',()=>{
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        contentHeight: 'auto'
    });
    calendar.render();
    $('.fc-toolbar-title').addClass('font-responsive');

    cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getAttivita',{method:'POST',data:{IDU:parseInt(localStorage.getItem('IDU'))}},
        function(srvData){
            let Result=JSON.parse(srvData.data);
            for(let item of Result)
                calendar.addEvent({title: item.Activity,start: item.Data,end: item.Data})
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