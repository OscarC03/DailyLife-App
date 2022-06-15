$(document).ready(()=>{
    let humor=getCookie('Humor');

    if(humor!=""){
        navigator.notification.beep(1);
        navigator.notification.confirm(humor, ()=>{window.location.replace("../index.html");}, "Attenzione", ["Chiudi"])
    }
})

$(window).on('load',()=>{
    $('#rngStress').val(1)
    $('#rngFelicita').val(1)
    $('#rngFisica').val(1)
    $('#rngMentale').val(1)

    $('#rngStress').change(()=>{
        if($('#rngStress').val()<6)
            $('#rngStress').css({backgroundColor:'lime'});
        else if($('#rngStress').val()>=6 && $('#rngStress').val()<7)
            $('#rngStress').css({backgroundColor:'yellow'});
        else
            $('#rngStress').css({backgroundColor:'red'});

        $('#txtStress').text($('#rngStress').val())
    })
    
    $('#rngFelicita').change(()=>{
        if($('#rngFelicita').val()<6)
            $('#rngFelicita').css({backgroundColor:'red'});
        else if($('#rngFelicita').val()>=6 && $('#rngFelicita').val()<7)
            $('#rngFelicita').css({backgroundColor:'yellow'});
        else
            $('#rngFelicita').css({backgroundColor:'lime'});

        $('#txtFelicita').text($('#rngFelicita').val())
    })

    $('#rngFisica').change(()=>{
        if($('#rngFisica').val()<6)
            $('#rngFisica').css({backgroundColor:'lime'});
        else if($('#rngFisica').val()>=6 && $('#rngFisica').val()<7)
            $('#rngFisica').css({backgroundColor:'yellow'});
        else
            $('#rngFisica').css({backgroundColor:'red'});

        $('#txtFisica').text($('#rngFisica').val())
    })

    $('#rngMentale').change(()=>{
        if($('#rngMentale').val()<6)
            $('#rngMentale').css({backgroundColor:'lime'});
        else if($('#rngFisica').val()>=6 && $('#rngMentale').val()<7)
            $('#rngMentale').css({backgroundColor:'yellow'});
        else
            $('#rngMentale').css({backgroundColor:'red'});

        $('#txtMentale').text($('#rngMentale').val())
    })

    $('#btnInsertHumor').click(()=>{
        let humor=getCookie('Humor');

        if(humor==""){
            let key=localStorage.getItem('key');
            let Stress=CryptoJS.AES.encrypt($('#rngStress').val().toString(),key).toString();
            let Felicita=CryptoJS.AES.encrypt($('#rngFelicita').val().toString(),key).toString();
            let Fisica=CryptoJS.AES.encrypt($('#rngFisica').val().toString(),key).toString();
            let Mentale=CryptoJS.AES.encrypt($('#rngMentale').val().toString(),key).toString();
            let Media=CryptoJS.AES.encrypt((((parseInt($('#rngStress').val())+parseInt($('#rngFelicita').val())+parseInt($('#rngFisica').val())+parseInt($('#rngMentale').val()))*10)/40).toString(),key).toString()
    
            cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/insertUmore',{method:'POST',data:{IDU:parseInt(localStorage.getItem('IDU')),Stress:Stress,Felicita:Felicita,Fisico:Fisica,Mentale:Mentale,Media:Media,Data:new Date().toISOString().slice(0, 10)}},
                function(srvData){
                    setCookie('Humor',"Oggi hai già inserito il tuo umore, riprova domani!",1)
                    navigator.notification.beep(1);
                    navigator.notification.confirm("Complimenti il tuo umore è stato registrato", ()=>{window.location.replace('../index.html');}, "Complimenti", ["Fine"])
                },
    
                function(jqXHR){
                    navigator.notification.beep(1);
                    navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
                }
            )
        }
        else{
            navigator.notification.beep(1);
            navigator.notification.confirm(humor, ()=>{window.location.replace("../index.html");}, "Attenzione", ["Chiudi"])
        }
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

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }