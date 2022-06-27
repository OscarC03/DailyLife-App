let vPreference=[];
let vSplash=[];

$(window).on('load',()=>{

    cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getPreferenceUser',{method:'POST',data:{User:localStorage.getItem('IDU')}},

        function(srvData){
            let Result=JSON.parse(srvData.data);
            for(let i=0;i<5;i++)
                if(i==0)
                    $('#itemCarousel').append('<div class="carousel-item active"><img class="rounded-3" data-bs-interval="4000" src="https://cristaudo.altervista.org/IMG/'+Result[i].IMG+'" alt="'+Result[i].Tipo+'" style="width:inherit; height:10rem; border: 2px solid white;"><div class="carousel-caption"><h3 class="text-center" style="text-shadow: 1px 1px 2px black, 0 0 25px rgb(30, 30, 32), 0 0 5px rgb(17, 17, 17);">'+Result[i].Tipo+'</h3></div></div>')
                else                
                    $('#itemCarousel').append('<div class="carousel-item"><img class="rounded-3" data-bs-interval="4000" src="https://cristaudo.altervista.org/IMG/'+Result[i].IMG+'" alt="'+Result[i].Tipo+'" style="width:inherit; height:10rem; border: 2px solid white;"><div class="carousel-caption"><h3 class="text-center" style="text-shadow: 1px 1px 2px black, 0 0 25px rgb(30, 30, 32), 0 0 5px rgb(17, 17, 17);">'+Result[i].Tipo+'</h3></div></div>')

                vSplash.push(true);
                removeSplash();
        },

        function(jqXHR){
            connected=false;
            localStorage.clear();
            navigator.notification.beep(1);
            navigator.notification.alert("Qualcosa è andato storto:"+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
        }
    )

    cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getPreference',{method:'POST',data:{}},

        function(srvData){
            let Result=JSON.parse(srvData.data);
            if(Result.length>0){
                for(let item of Result)
                    $('#rwPreference').append('<div class="col-6 bg-success mb-1" id="P-'+item.IDPreferenza+'" style="background-image: url(https://cristaudo.altervista.org/IMG/'+item.IMG+'); background-repeat: no-repeat; background-size: cover; border: 1px solid white;" onclick="addPreference(this.id)"><h4 class="text-center text-white ps-3 pe-3 pt-3 pb-3 font-responsive" style="text-shadow: 1px 1px 2px black, 0 0 25px rgb(30, 30, 32), 0 0 5px rgb(17, 17, 17);">'+item.Tipo+'</h4></div>');
                vSplash.push(true);
                removeSplash();
            }
        },

        function(jqXHR){
            localStorage.clear();
            navigator.notification.beep(1);
            navigator.notification.alert("Qualcosa è andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
        }
    )

    $('#btnBack').click(()=>{
        navigator.splashscreen.show();
        window.location.replace('../page/option.html');
    })
});

function addPreference(id){
    if($('#'+id).hasClass('disabledDiv')){
        $('#'+id).removeClass('disabledDiv');
        vPreference = vPreference.filter(function(value, index, arr){ 
            return value != parseInt(id.split('-')[1]);
        });
    }
    else{
        $('#'+id).addClass('disabledDiv');
        vPreference.push(parseInt(id.split('-')[1]));
    }
    
    console.log("lunghezza: "+vPreference.length);
    if(vPreference.length==5){
        cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/modPreference',{method:'POST',data:{IDP1:vPreference[0],IDP2:vPreference[1],IDP3:vPreference[2],IDP4:vPreference[3],IDP5:vPreference[4],IDU:parseInt(localStorage.getItem('IDU'))}},
            function(srvData){
                let Result=JSON.parse(srvData.data);
                navigator.notification.beep(1);
                navigator.notification.confirm(Result, ()=>{window.location.replace('../page/option.html');}, "Perfetto", ["OK"])
            },

            function(jqXHR){
                navigator.notification.beep(1);
                navigator.notification.alert("Qualcosa è andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
            }
        )
    }
}

function removeSplash(){
  if(vSplash.length==2){
    navigator.splashscreen.hide();
  }
}