$(()=>{
    setTimeout(function() {
        navigator.splashscreen.hide();
    }, 3000);

    //CONTROLLO SE SONO NEL PRIMO AVVIO DELL'APP
    let User=localStorage.getItem('Username');
    if(User==null)
        window.location.href="../page/first.html";
    else{
        //controllo reinserimento pc a chiusura app
        if(sessionStorage.getItem('Available')==null)
            window.location.href="../page/login.html";
    }
})
