let connected=true;
var today = new Date();

$(document).ready(()=>{
    navigator.splashscreen.hide();
})

$(window).on("load",()=>{
    $('#divUserPin').hide();
    $('#divNewUser').show();



    //Richiesta nome utente
    if(localStorage.getItem('Username')!=undefined){
        console.log(localStorage.getItem('Username'));
        cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getUser',{method:'POST',data:{Username:localStorage.getItem('Username')}},

            function(srvData){
                let Result=JSON.parse(srvData.data)[0];
                if(Result.Nome!=undefined)
                    $('#subTit').text('Ciao '+Result.Nome);
            },

            function(jqXHR){
                connected=false;
                localStorage.clear();
                navigator.notification.beep(1);
                navigator.notification.confirm("Qualcosa è andato storto: aaa"+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
            }
        )
    }

    //Creazione nuovo USER
    $('#btnRegister').click(()=>{
        let dati=[];
        let error=false;
        //Controllo campi di input
        if($('#txtNome').val().trim()!="")
            dati.push($('#txtNome').val());
        else
            $('#txtNome').attr("placeholder", "Campo Obbligatorio").addClass('error').focus();

        if($('#txtCognome').val().trim()!="")
            dati.push($('#txtCognome').val());
        else
            $('#txtCognome').attr("placeholder", "Campo Obbligatorio").addClass('error').focus();

        if($('#txtUsername').val().trim()!=""){
            cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getUsername',{method:'POST',data:{Username:$('#txtUsername').val()}},
                function(srvData){
                    let Result=JSON.parse(srvData.data)[0];
                    if(Result.UserExist==0){
                        dati.push($('#txtUsername').val());

                        if($('#txtPassword').val().trim()!="" && $('#txtPassword').val()==$('#txtPassword2').val() && !error){
                            if($('#txtPassword').val().length>=4){
                                dati.push($('#txtPassword').val());
                                //Aggiunta campi sul db
                                cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/newUser',{method:'POST',data:{Nome:dati[0],Cognome:dati[1],Username:dati[2],Password:dati[3]}},
                                    function(srvData){
                                        localStorage.clear();
                                        localStorage.setItem('Username',dati[2]);
                                        cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getUser',{method:'POST',data:{Username:localStorage.getItem('Username')}},

                                            function(srvData){
                                                let Result=JSON.parse(srvData.data)[0];
                                                if(Result.Nome!=undefined)
                                                    localStorage.setItem('IDU',Result.IDUser)
                                                localStorage.setItem('key',CryptoJS.MD5(dati[2]+dati[3]).toString())
                                            },
                            
                                            function(jqXHR){
                                                connected=false;
                                                localStorage.clear();
                                                navigator.notification.beep(1);
                                                navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
                                            }
                                        )
                                        $('#divUserPin').show();
                                        $('#divNewUser').hide();
                                    },

                                    function(jqXHR){
                                        navigator.notification.beep(1);
                                        navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{window.location.replace("../page/main.html");}, "Attenzione", ["Chiudi"]);
                                    }
                                )
                            }
                            else
                                $('#txtPassword').attr("placeholder", "Inserire una password valida").addClass('error').focus().val('');
                        }
                        else
                            $('#txtPassword').attr("placeholder", "Campo Obbligatorio").addClass('error').focus();
                    }
                    else{
                        error=true;
                        $('#txtUsername').attr("placeholder", "Username già presente").addClass('error').focus();
                    }
                },

                function(jqXHR){
                    navigator.notification.beep(1);
                    navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{window.location.replace("../page/main.html");}, "Attenzione", ["Chiudi"]);
                })
        }
        else
            $('#txtUsername').attr("placeholder", "Campo Obbligatorio").addClass('error').focus();
    })

    $('#btnCreatePin').click(()=>{
        if($('#txtPin').val().trim().length==4){
            localStorage.setItem("PIN",CryptoJS.MD5($('#txtPin').val()))
            if(localStorage.getItem('JustUser')==null)
                window.location.replace('../page/preference.html');
            else
                window.location.replace('../index.html');
        }
        else
            $('#txtPin').attr("placeholder", "Inserire un PIN di 4 cifre").addClass('error').focus().val('');
    })

    $('#btnVerify').click(()=>{
        //Verifica del pin
        if($('#txtPin').val().trim()!="")
            if(CryptoJS.MD5($('#txtPin').val().trim())==localStorage.getItem("PIN")){
                sessionStorage.setItem('Available',true);
                navigator.splashscreen.show();
                window.location.replace('../index.html');
            }
            else
                $('#txtPin').attr("placeholder", "PIN errato").addClass('error').focus().val('');
        else
            $('#txtPin').attr("placeholder", "Campo Obbligatorio").addClass('error').focus();
    })

    $('#btnLog').click(()=>{
        if(localStorage.getItem('Username')!=null)
            window.location.replace('../page/pin.html');
        else
            window.location.replace('../page/login.html');
    })

    $('#btnReg').click(()=>{
        localStorage.clear();
        window.location.replace('../page/first.html');
    })

    $('#btnLogRegister').click(()=>{
        let dati=[];
        if($('#txtLogUsername').val().trim()!=""){
            dati.push($('#txtLogUsername').val());
        }
        else
            $('#txtLogUsername').attr("placeholder", "Campo Obbligatorio").addClass('error').focus();

        if($('#txtLogPin').val().trim()!=""){
            dati.push($('#txtLogPin').val());
        }
        else
            $('#txtLogPin').attr("placeholder", "Campo Obbligatorio").addClass('error').focus();

        if(dati.length>0){
            cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getCredentials',{method: "POST", data: {Username:dati[0],Password:dati[1]}},
                function(srvData){
                    let Result=srvData.data;
                    console.log(srvData);
                    if(Result!=undefined && Result=="Login OK"){
                        localStorage.setItem("Username",dati[0]);
                        localStorage.setItem("JustUser",true);

                        cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getUser',{method:'POST',data:{Username:localStorage.getItem('Username')}},

                            function(srvData){
                                let Result=JSON.parse(srvData.data)[0];
                                if(Result.Nome!=undefined)
                                    localStorage.setItem('IDU',Result.IDUser);
                                localStorage.setItem('key',CryptoJS.MD5(dati[0]+dati[1]).toString())
                            },
        
                            function(jqXHR){
                                connected=false;
                                localStorage.clear();
                                navigator.notification.beep(1);
                                navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
                            }
                        )

                        $('#divUserPin').show();
                        $('#divLoginUser').hide();
                    }
                    else{
                        $('#txtLogUsername').attr("placeholder", "Username Errato").addClass('error').focus();
                        $('#txtLogPin').attr("placeholder", "PinErrato").addClass('error').focus();
                    }
                },

                function(jqXHR){
                    navigator.notification.beep(1);
                    navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{/*window.location.replace("../page/main.html");*/}, "Attenzione", ["Chiudi"]);
                }
            );
        }
    });


    if(sessionStorage.getItem("Available")==null && localStorage.getItem("Username")!=null && connected){
        Fingerprint.isAvailable(isAvailableSuccess, isAvailableError);

        function isAvailableSuccess(result) {
            Fingerprint.show({
                title:"Login Biometrica",
                description: "Usa la tua impronta digitale"
            }, successCallback, errorCallback);

            function successCallback(){
                sessionStorage.setItem('Available',true);
                navigator.splashscreen.show();
                window.location.replace('../index.html');
            }   

            function errorCallback(error){}

        }

        function isAvailableError(error) {}
    }
})
