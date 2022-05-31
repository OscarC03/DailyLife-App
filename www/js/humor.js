$(document).ready(()=>{
    let humor=getCookie('Humor');

    if(humor!=""){
        navigator.notification.beep(1);
        navigator.notification.confirm("Oggi hai già inserito il tuo umore, riprova domani!: ", ()=>{window.location.replace("../index.html");}, "Attenzione", ["Chiudi"])
    }
})

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
        let humor=getCookie('Humor');
        if(humor==""){
            let key=localStorage.getItem('key');
            alert(window.btoa($('#rngStress').val().toString()));
            let Stress=window.btoa($('#rngStress').val().toString()).toString();
            let Felicita=window.btoa($('#rngFelicita').val().toString()).toString();
            let Fisica=window.btoa($('#rngFisica').val().toString()).toString();
            let Mentale=window.btoa($('#rngMentale').val().toString()).toString();
            let Media=window.btoa((((parseInt($('#rngStress').val())+parseInt($('#rngFelicita').val())+parseInt($('#rngFisico').val())+parseInt($('#rngMentale').val()))*10)/40).toString(),key).toString()
    
            cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/insertUmore',{method:'POST',data:{IDU:parseInt(localStorage.getItem('IDU')),Stress:Stress,Felicita:Felicita,Fisico:Fisica,Mentale:Mentale,Media:Media,Data:new Date().toISOString().slice(0, 10)}},
                function(srvData){
                    setCookie('Humor',"l'utente ha già registrato l'umore",1)
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
            navigator.notification.confirm("Oggi hai già inserito il tuo umore, riprova domani!: ", ()=>{window.location.replace("../index.html");}, "Attenzione", ["Chiudi"])
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