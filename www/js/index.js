document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    //cONTROLLO SE SONO NEL PRIMO AVVIO DELL'APP
    let User=localStorage.getItem('User');
    if(User==null)
        window.location.href="../page/first.html";
}
