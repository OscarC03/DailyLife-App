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
    }
})