let mailValid=false;
let userValid=false;

$(window).on('load',()=>{
    cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getUser',{method:'POST',data:{Username:localStorage.getItem('Username')}},

        function(srvData){
            let Result=JSON.parse(srvData.data)[0];
            $('#txtUser').val(Result.Username);
            $('#txtNome').val(Result.Nome);
            $('#txtCognome').val(Result.Cognome);
            $('#txtMail').val(Result.Mail);
        },

        function(jqXHR){
            navigator.notification.beep(1);
            navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
        }
    )

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

    $('#btnOptPassword').click(()=>{
        window.location.replace('../page/modificaPassword.html');
    })

    $('#btnOptPin').click(()=>{
        window.location.replace('../page/modificaPIN.html');
    })

    $('#btnBack').click(()=>{
        window.location.replace('../page/option.html');
    })

    $('#btnBackHome').click(()=>{
        window.location.replace('../index.html');
    })

    $('#btnOptPreferenze').click(()=>{
        window.location.replace('../page/modificaPreferenze.html');
    })

    $('#btnOptProfilo').click(()=>{
        window.location.replace('../page/modificaUser.html');
    });

    $('#btnOptEsci').click(()=>{
        $('#optTitle').append(`<h5>Log-out Daily Life</h5>`)
        $('#optBody').append(`<h6 class="text-black">Sei sicuro di voler uscire dall'account di <kbd class="text-white" style="background-color: #50CB93;">${localStorage.getItem('Username')}</kbd>?</h6>`)
        $('#infoOpt').modal('show');
    })

    $('#btnChangePIN').click(()=>{
        if(CryptoJS.MD5($('#txtPinA').val().trim())==localStorage.getItem('PIN')){
            if($('#txtPinN').val().trim()==$('#txtPinN1').val().trim()){
                if($('#txtPinN').val().trim().length==4){
                    localStorage.removeItem('PIN');
                    localStorage.setItem('PIN',CryptoJS.MD5($('#txtPinN').val().trim()))
                    navigator.notification.beep(1);
                    navigator.notification.confirm("Il nuovo PIN è stato salvato con successo", ()=>{window.location.replace('../page/option.html')}, "Perfetto", ["OK"])
                }
                else
                    $('#txtPinN').attr("placeholder", "il pin deve essere di 4 cifre").addClass('error').val('').focus();
            }
            else{
                $('#txtPinN').attr("placeholder", "I due pin non corrispondono").addClass('error').val('').focus();
                $('#txtPinN1').attr("placeholder", "I due pin non corrispondono").addClass('error').val('').focus();
            }
        }
        else
            $('#txtPinA').attr("placeholder", "Il vecchio pin non corrisponde").addClass('error').val('').focus();
    })

    $('#btnChangePass').click(()=>{
        cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getCredentials',{method: "POST", data: {Username:localStorage.getItem('Username'),Password:$('#txtPassA').val().trim()}},
            function(srvData){
                let Result=srvData.data;
                console.log(srvData);
                if(Result!=undefined && Result=="Login OK"){
                    if($('#txtPassN').val().trim()==$('#txtPassN1').val().trim()){
                        if($('#txtPassN').val().trim().length>=8){
                            cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/updatePass',{method:'POST',data:{IDU:localStorage.getItem('IDU'),Password:$('#txtPassN').val().trim()}},
    
                                function(srvData){
                                    navigator.notification.beep(1);
                                    navigator.notification.confirm("La nuova password è stata modificata con successo", ()=>{window.location.replace('../page/option.html')}, "Perfetto", ["OK"])
                                },
            
                                function(jqXHR){
                                    connected=false;
                                    localStorage.clear();
                                    navigator.notification.beep(1);
                                    navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
                                }
                            )
                        }
                        else
                            $('#txtPassN').attr("placeholder", "La password deve essere di 4 cifre").addClass('error').val('').focus();
                    }
                    else{
                        $('#txtPassN').attr("placeholder", "Le due password non corrispondono").addClass('error').val('').focus();
                        $('#txtPassN1').attr("placeholder", "Le due password non corrispondono").addClass('error').val('').focus();
                    }
                }
                else
                    $('#txtPassA').attr("placeholder", "La vecchia password non corrisponde").addClass('error').val('').focus();
            },

            function(jqXHR){                    
                localStorage.clear();
                navigator.notification.beep(1);
                navigator.notification.alert("Qualcosa è andato storto: "+jqXHR.error, ()=>{window.location.replace("../page/option.html");}, "Attenzione", ["Chiudi"]);
            }
        );
    })

    $('#txtUser').on('input',()=>{
        if($('#txtUser').val().length!=0)
            cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getUsername',{method:'POST',data:{Username:$('#txtUser').val()}},

                function(srvData){
                    let Result=JSON.parse(srvData.data)[0];
                    if(Result.UserExist==0)
                        $('#userResult').css({color:'lime'}).text($('#txtUser').val()+' è valido');
                    else
                        $('#userResult').css({color:'red'}).text($('#txtUser').val()+' non è valido');
                },

                function(jqXHR){
                }
            )
        else
            $('#userResult').css({color:'red'}).text('Inserire un username valido');
    });

    $('#txtMail').on('input',validate);

    $('#btnChangeProf').click(()=>{
        if(validate())
            validateUsername();
        else{
            navigator.notification.beep(1);
            navigator.notification.alert("Inserire una mail valida per poter modificare il profilo", ()=>{}, "Attenzione", ["Chiudi"]);
        }
    })

    $('#btnSuccessOpt').click(()=>{
        localStorage.clear();
        window.location.replace('../index.html');
    })
});

const validateEmail = (email) => {
    return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};

function validate(){
    const $result = $('#mailResult');
    const email = $('#txtMail').val();
    $result.text('');
    if(email.length!=0)
        if (validateEmail(email)) {
            $result.text(email + ' è valida');
            $result.css('color', 'lime');
            return true;
        }
        else {
            $result.text(email + ' non è valida');
            $result.css('color', 'red');
            return false;
        }
    else{
        $result.text('inserire una mail valida');
        $result.css('color', 'red');
        return false;
    }
}

function validateUsername(){
    if($('#txtUser').val().length!=0)
        cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getUsername',{method:'POST',data:{Username:$('#txtUser').val()}},

            function(srvData){
                let Result=JSON.parse(srvData.data)[0];
                if(parseInt(Result.UserExist)==0){
                    cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/modifyUser',{method:'POST',data:{Username:$('#txtUser').val(),Mail:$('#txtMail').val(),Nome:$('#txtNome').val(),Cognome:$('#txtCognome').val(),IDU:localStorage.getItem('IDU')}},
            
                        function(srvData){
                            let Result=JSON.parse(srvData.data)[0];
                            localStorage.setItem('Username',$('#txtUser').val());
                            navigator.notification.beep(1);
                            navigator.notification.confirm("Modifica del profilo effettuata con successo", ()=>{window.location.replace('../page/option.html')}, "Perfetto", ["OK"]);
                        },
            
                        function(jqXHR){
                            navigator.notification.beep(1);
                            navigator.notification.alert("Qualcosa è andato storto durante la modifica del profilo", ()=>{window.location.replace('../page/option.html')}, "Attenzione", ["Chiudi"]);
                        }
                    )
                }
            },

            function(jqXHR){
                navigator.notification.beep(1);
                navigator.notification.alert("Qualcosa è andato storto durante la modifica del profilo", ()=>{window.location.replace('../page/option.html')}, "Attenzione", ["Chiudi"]);
            }
        )
    else{
        navigator.notification.beep(1);
        navigator.notification.alert("Inserire un username valido", ()=>{}, "Attenzione", ["Chiudi"]);
    }
}