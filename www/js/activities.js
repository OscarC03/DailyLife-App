$(document).ready(()=>{
})

$(window).on('load',()=>{

    $('#btnInsertAttivita').click(()=>{
        
        if($('#txtTitolo').text()!="" || $('#dtpData').val()!="" || $('#dtpOra').val()!=""){
            let data=new Date($('#dtpData').val()).toISOString().slice(0, 10);
            cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/insertAttivita',{method:'POST',data:{IDU:parseInt(localStorage.getItem('IDU')),Attivita:$('#txtTitolo').val(),Data:data,Ora:$('#dtpOra').val()}},
                function(srvData){
                    navigator.notification.beep(1);
                    navigator.notification.confirm("Complimenti la tua attività è stata registrata", ()=>{window.location.replace('../index.html');}, "Complimenti", ["Fine"])
                },
    
                function(jqXHR){
                    navigator.notification.beep(1);
                    navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
                }
            )
        }
        else{
            navigator.notification.beep(1);
            navigator.notification.confirm("Compila tutti i campi!", ()=>{}, "Attenzione", ["Chiudi"])
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