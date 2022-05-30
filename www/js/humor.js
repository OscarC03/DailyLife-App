$(window).on('load',()=>{
    $('#scDatiUmore').hide();

    $('#btnSad').click(()=>{
        $('#scDatiUmore').show();
    })

    $('#btnNeutral').click(()=>{
        $('#scDatiUmore').show();
    })

    $('#rngStress').change(()=>{$('#txtStress').text($('#rngStress').val())})
    $('#rngFelicita').change(()=>{$('#txtFelicita').text($('#rngFelicita').val())})
    $('#rngFisica').change(()=>{$('#txtFisica').text($('#rngFisica').val())})
    $('#rngMentale').change(()=>{$('#txtMentale').text($('#rngMentale').val())})

    $('#btnInsertHumor').click(()=>{
        let Stress=$('#rngStress').val().toString()
        let Felicita=$('#rngFelicita').val().toString()
        let Fisica=$('#rngFisica').val().toString()
        let Mentale=$('#rngMentale').val().toString()
        let Media=((parseInt($('#rngStress').val())+parseInt($('#rngFelicita').val())+parseInt($('#rngFisico').val())+parseInt($('#rngMentale').val()))*10)/40

        cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/insertUmore',{method:'POST',data:{IDU:parseInt(localStorage.getItem('IDU')),Stress:Stress,Felicita:Felicita,Fisico:Fisica,Mentale:Mentale,Media:Media,Data:new Date().toISOString().slice(0, 10)}},
            function(srvData){
                navigator.notification.beep(1);
                navigator.notification.confirm("Complimenti il tuo umore è stato registrato", ()=>{window.location.replace('../index.html');}, "Complimenti", ["Fine"])
            },

            function(jqXHR){
                navigator.notification.beep(1);
                navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
            }
        )
    });

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