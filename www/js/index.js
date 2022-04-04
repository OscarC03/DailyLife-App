$(()=>{
    localStorage.clear();
    setTimeout(function() {
        navigator.splashscreen.hide();
    }, 3000);

    //CONTROLLO SE SONO NEL PRIMO AVVIO DELL'APP
    let User=JSON.parse(localStorage.getItem('Utente'));
    if(User==null)
        window.location.href="../page/first.html";
    else{
        //controllo reinserimento pc a chiusura app
        if(sessionStorage.getItem('Available')==null)
            window.location.href="../page/login.html";
    }
})
