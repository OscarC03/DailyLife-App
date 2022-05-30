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
        let key=localStorage.getItem('key');
        let Media=((parseInt($('#rngStress').val())+parseInt($('#rngFelicita').val())+parseInt($('#rngFisico').val())+parseInt($('#rngMentale').val()))*10)/40
        cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/insertUmore',{method:'POST',data:{IDU:parseInt(localStorage.getItem('IDU')),Stress:CryptoJS.HmacSHA256($('#rngStress').val(),key),Felicita:CryptoJS.HmacSHA256($('#rngFelicita').val(),key),Fisico:CryptoJS.HmacSHA256($('#rngFisico').val(),key),Mentale:CryptoJS.HmacSHA256($('#rngMentale').val(),key),Media:CryptoJS.HmacSHA256(Media,key)}},
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
})