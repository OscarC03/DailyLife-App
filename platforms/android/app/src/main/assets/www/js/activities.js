$(document).ready(()=>{
})

$(window).on('load',()=>{
    let key=localStorage.getItem('key');
    $('#rngEnergy').val(1)
    $('#btnInsertAttivita').click(()=>{
        
        if($('#txtTitolo').text()!="" || $('#dtpData').val()!="" || $('#dtpOra').val()!=""){
            let data=$('#dtpData').val().replace('T', ' ');

            console.log({IDU:parseInt(localStorage.getItem('IDU')),Attivita:$('#txtTitolo').val(),Descrizione:$('#txtDescrizione').val(),Data:data,Color:$('#inpColor').val()});

            cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/insertAttivita',{method:'POST',data:{IDU:parseInt(localStorage.getItem('IDU')),Attivita:CryptoJS.AES.encrypt($('#txtTitolo').val(),key).toString(),Descrizione:CryptoJS.AES.encrypt($('#txtDescrizione').val(),key).toString(),Data:data,Color:$('#inputColor').val(),Energy:$('#rngEnergy').val()}},
                function(srvData){
                    cordova.plugins.notification.local.schedule({
                        title: $('#txtTitolo').val(),
                        text: `${data.split(' ')[1]}\n${$('#txtDescrizione').val()}`,
                        smallIcon: 'res://icon.png',
                        trigger: { at: new Date(data) },
                        foreground: true
                    },
                    { skipPermission: true });

                    navigator.notification.beep(1);
                    navigator.notification.confirm("Complimenti la tua attività è stata registrata", ()=>{window.location.replace('../index.html');}, "Complimenti", ["Fine"])
                },
    
                function(jqXHR){
                    navigator.notification.beep(1);
                    navigator.notification.alert("Qualcosa è andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
                }
            )
        }
        else{
            navigator.notification.beep(1);
            navigator.notification.alert("Compila tutti i campi!", ()=>{}, "Attenzione", ["Chiudi"])
        }
    });

    $('#rngEnergy').change(()=>{
        if($('#rngEnergy').val()<6)
            $('#rngEnergy').css({backgroundColor:'lime'});
        else if($('#rngEnergy').val()>=6 && $('#rngEnergy').val()<7)
            $('#rngEnergy').css({backgroundColor:'yellow'});
        else
            $('#rngEnergy').css({backgroundColor:'red'});

        $('#txtEnergy').text($('#rngEnergy').val());
    })

    $('#inputColor').change(()=>{
        $('#inputColor').css({backgroundColor:$('#inputColor').val()});
    })

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