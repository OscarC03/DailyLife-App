$(window).on('load',()=>{
    $('#newIMG').hide();
    $('#justIMG').hide();

    if(localStorage.getItem('imgUser')!='yes'){
        $('#newIMG').show();
        $('#newIMG').addClass('d-flex justify-content-center');
    }
    else{
        $('#justIMG').show();
        $('#justIMG').addClass('d-flex justify-content-center');
    }

    if(localStorage.getItem('imgUser')=='yes'){
        cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getUserModify',{method:'POST',data:{IDU:localStorage.getItem('IDU')}},
    
            function(srvData){
                let Result=JSON.parse(srvData.data);
                console.log(Result);
                $('#imgUser').attr('src',Result[0].userIMG);
            },
    
            function(jqXHR){
                navigator.notification.beep(1);
                navigator.notification.confirm("Qualcosa è andato storto insert: "+jqXHR.error, ()=>{window.location.replace('../index.html');}, "Attenzione", ["Chiudi"])
            }
        )
    }
    
    $('#btnAddImg').click(()=>{
        navigator.camera.getPicture((img)=>{
            cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/saveImageUser',{method:'POST',data:{IDU:localStorage.getItem('IDU'),IMG:`data:image/jpeg;base64,${img}`}},
        
                function(srvData){
                    let Result=JSON.parse(srvData.data);
                    localStorage.setItem('imgUser','yes');
                    window.location.reload();
                },
        
                function(jqXHR){
                    navigator.notification.beep(1);
                    navigator.notification.confirm("Qualcosa è andato storto insert: "+jqXHR.error, ()=>{window.location.replace('../index.html');}, "Attenzione", ["Chiudi"])
                }
            )
        },(err)=>{
            navigator.notification.beep(1);
            navigator.notification.confirm("Qualcosa è andato storto camera: "+err, ()=>{window.location.replace('../index.html')}, "Attenzione", ["Chiudi"])
        }, 
        {
            sourceType:Camera.PictureSourceType.CAMERA,
            destinationType: Camera.DestinationType.DATA_URL,
            correctOrientation:true,
            quality:50
        });
    });

    $('#btnBack').click(()=>{
        window.location.replace('../index.html');
    })

    $('#btnOptEsci').click(()=>{
        $('#optTitle').append(`<h5 class="text-black">Log-out Daily Life</h5>`)
        $('#optBody').append(`<h6 class="text-black">Sei sicuro di voler uscire dall'account di <mark>${localStorage.getItem('Username')}</mark>?</h6>`)
        $('#infoOpt').modal('show');
    })

    $('#btnSuccessOpt').click(()=>{
        localStorage.clear();
        window.location.replace('../index.html');
    })
});