let vPreference=[];

$(window).on('load',()=>{
    //Scelta preferenze
    cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getPreference',{method:'POST',data:{}},

        function(srvData){
            let Result=JSON.parse(srvData.data);
            if(Result.length>0){
                for(let item of Result)
                $('#rwPreference').append('<div class="col-12 h-50 bg-danger" id="P-'+item.IDPreferenza+'" style="background-image: url(https://cristaudo.altervista.org/IMG/'+item.IMG+'); background-repeat: no-repeat; background-size: cover;" onclick="addPreference(this.id)"><h4 class="text-center text-white p-4">'+item.Tipo+'</h4></div>')
            }
        },

        function(jqXHR){
            navigator.notification.beep(1);
            navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
        }
    )
})


function addPreference(id){
    $('#'+id).css({border:"1px solid yellow"});
    vPreference.push(id);
    console.log("lunghezza: "+vPreference.length);
    if(vPreference.length==5){
        cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/insertPreference',{method:'POST',data:{IDP1:vPreference[0],IDP2:vPreference[1],IDP3:vPreference[2],IDP4:vPreference[3],IDP5:vPreference[4],IDU:parseInt(localStorage.getItem('IDU'))}},
            function(srvData){
                let Result=JSON.parse(srvData.data);
                window.location.href('../index.html');
            },

            function(jqXHR){
                navigator.notification.beep(1);
                navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
            }
        )
    }
}