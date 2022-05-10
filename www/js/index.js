$(()=>{
    localStorage.clear();

    //CONTROLLO SE SONO NEL PRIMO AVVIO DELL'APP
    let User=localStorage.getItem('Username');
    if(User==null)
        window.location.href="../page/main.html";
    else{
        //controllo reinserimento pc a chiusura app
        if(sessionStorage.getItem('Available')==null)
            window.location.href="../page/pin.html";
    }

    setTimeout(function() {
        navigator.splashscreen.hide();
    }, 3000);
})
