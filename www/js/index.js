$(()=>{
    //CONTROLLO SE SONO NEL PRIMO AVVIO DELL'APP
    let User=localStorage.getItem('Utente');
    if(User==null)
        window.location.href="../page/first.html";
    else
        alert('Registrazione effettuata con successo')
})
