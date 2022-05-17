let connected=true;
$(window).on("load",()=>{
    navigator.splashscreen.hide();

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
                navigator.notification.beep(1);
                navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
            })
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

                        if($('#txtPin').val().trim()!="" && !error){
                            if($('#txtPin').val().length==4){
                                dati.push($('#txtPin').val());
                                //Aggiunta campi sul db
                                cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/newUser',{method:'POST',data:{Nome:dati[0],Cognome:dati[1],Username:dati[2],PIN:dati[3]}},
                                    function(srvData){
                                        localStorage.clear();
                                        localStorage.setItem('Username',dati[2]);
                                        window.location.replace('../page/pin.html');
                                    },

                                    function(jqXHR){
                                        navigator.notification.beep(1);
                                        navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{window.location.replace("../page/main.html");}, "Attenzione", ["Chiudi"]);
                                    })
                            }
                            else
                                $('#txtPin').attr("placeholder", "Inserire un pin di 4 cifre").addClass('error').focus().val('');
                        }
                        else
                            $('#txtPin').attr("placeholder", "Campo Obbligatorio").addClass('error').focus();
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

    $('#btnVerify').click(()=>{
        //Verifica del pin
        cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getPin',{method:'POST',data:{Username:localStorage.getItem('Username')}},
            function(srvData){
                let Result=JSON.parse(srvData.data)[0]
                if($('#txtPin').val().trim()!="")
                    if($('#txtPin').val().trim()==Result.Password){
                        sessionStorage.setItem('Available',true);
                        navigator.splashscreen.show();
                        window.location.replace('../index.html');
                    }
                    else
                        $('#txtPin').attr("placeholder", "PIN errato").addClass('error').focus().val('');
                else
                    $('#txtPin').attr("placeholder", "Campo Obbligatorio").addClass('error').focus();
            },

            function(jqXHR){
                navigator.notification.beep(1);
                navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{window.location.replace("../page/main.html");}, "Attenzione", ["Chiudi"]);
            }
        )
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
            cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getCredentials',{method: "POST", data: {Username:dati[0]}},
                function(srvData){
                    let Result=JSON.parse(srvData.data)[0];
                    if(Result!=undefined){
                        console.log(Result);
                        if(Result.Username!=dati[0]){
                            $('#txtLogUsername').attr("placeholder", "Username Errato").addClass('error').focus();
                        }
                        else if(Result.Password!=dati[1]){
                            $('#txtLogPin').attr("placeholder", "PinErrato").addClass('error').focus();
                        }
                        else{
                            localStorage.setItem("Username",dati[0]);
                            window.location.replace('../page/pin.html');
                        }
                    }
                    else{
                        $('#txtLogUsername').attr("placeholder", "Username Errato").addClass('error').focus();
                        $('#txtLogPin').attr("placeholder", "PinErrato").addClass('error').focus();
                    }
                },

                function(jqXHR){
                    navigator.notification.beep(1);
                    navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{window.location.replace("../page/main.html");}, "Attenzione", ["Chiudi"]);
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
