let connected=true;
var today = new Date();

$(document).ready(()=>{
    //navigator.splashscreen.hide();
})

$(window).on("load",()=>{
    $('#divUserPin').hide();
    $('#divRecPassword').hide();
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
                navigator.notification.confirm("Qualcosa è andato storto: aaa"+jqXHR.error, ()=>{
                    localStorage.clear();
                    window.location.reload();
                }, "Attenzione", ["Chiudi"])
            }
        )
    }

    if(localStorage.getItem('newGen')!=null){
        cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getHash',{method:'POST',data:{Username:localStorage.getItem('Username')}},

            function(srvData){
                let Result=JSON.parse(srvData.data)[0];
                if(Result.newGen==localStorage.getItem('newGen')){
                    $('#btnVerify').val('Continua');
                    localStorage.removeItem('newGen');
                    localStorage.removeItem('PIN');
                    let newPIN=getRndInteger(1000,9999);
                    localStorage.setItem('PIN',CryptoJS.MD5(newPIN.toString()));
                    navigator.notification.beep(1);
                    navigator.notification.confirm("Complimenti il tuo nuovo PIN è: "+newPIN, ()=>{
                        cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/deleteHash',{method:'POST',data:{Username:localStorage.getItem('Username')}},
                
                            function(srvData){
                                window.location.reload();
                            },
                
                            function(jqXHR){
                                navigator.notification.beep(1);
                                navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
                            }
                        )
                    }, "Perfetto", ["Chiudi"])
                }
                else
                    $('#btnVerify').val('Ricarica');
            },

            function(jqXHR){
                navigator.notification.beep(1);
                navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
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

        if($('#txtMail').val().trim()!="")
            dati.push($('#txtMail').val());
        else
            $('#txtMail').attr("placeholder", "Campo Obbligatorio").addClass('error').focus();

        if($('#txtUsername').val().trim()!=""){
            cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getUsername',{method:'POST',data:{Username:$('#txtUsername').val()}},
                function(srvData){
                    let Result=JSON.parse(srvData.data)[0];
                    if(Result.UserExist==0){
                        dati.push($('#txtUsername').val());

                        if($('#txtPassword').val().trim()!="" && $('#txtPassword').val()==$('#txtPassword2').val() && !error){
                            if($('#txtPassword').val().length>=8){
                                dati.push($('#txtPassword').val());
                                //Aggiunta campi sul db
                                cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/newUser',{method:'POST',data:{Nome:dati[0],Cognome:dati[1],Mail:dati[2],Username:dati[3],Password:dati[4]}},
                                    function(srvData){
                                        localStorage.clear();
                                        localStorage.setItem('Username',dati[3]);
                                        cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getUser',{method:'POST',data:{Username:localStorage.getItem('Username')}},

                                            function(srvData){
                                                let Result=JSON.parse(srvData.data)[0];
                                                alert(srvData.data);
                                                if(Result.Nome!=undefined)
                                                    localStorage.setItem('IDU',Result.IDUser)
                                                localStorage.setItem('key',CryptoJS.MD5(dati[3]+dati[4]).toString())
                                            },
                            
                                            function(jqXHR){
                                                connected=false;
                                                localStorage.clear();
                                                navigator.notification.beep(1);
                                                navigator.notification.confirm("Qualcosa è andato storto: 3 "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
                                            }
                                        )
                                        $('#divUserPin').show();
                                        $('#divNewUser').hide();
                                    },

                                    function(jqXHR){
                                        navigator.notification.beep(1);
                                        navigator.notification.confirm("Qualcosa è andato storto: 2 "+jqXHR.error, ()=>{window.location.replace("../page/main.html");}, "Attenzione", ["Chiudi"]);
                                    }
                                )
                            }
                            else
                                $('#txtPassword').attr("placeholder", "La password deve avere più di 8 caratteri").addClass('error').focus().val('');
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
                    localStorage.clear();
                    navigator.notification.beep(1);
                    navigator.notification.confirm("Qualcosa è andato storto: 1 "+jqXHR.error, ()=>{window.location.replace("../page/main.html");}, "Attenzione", ["Chiudi"]);
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
            if($('#txtPin').val().trim()!="" && $('#btnVerify').val()=="Continua")
                if(CryptoJS.MD5($('#txtPin').val().trim())==localStorage.getItem("PIN")){
                    sessionStorage.setItem('Available',true);
                    //navigator.splashscreen.show();
                    localStorage.setItem('Indexed',"true");
                    window.location.replace('../index.html');
                }
                else
                    $('#txtPin').attr("placeholder", "PIN errato").addClass('error').focus().val('');
            else
                $('#txtPin').attr("placeholder", "Campo Obbligatorio").addClass('error').focus();
            
            if($('#btnVerify').val()=="Ricarica")
                window.location.reload();
    })

    $('#btnLog').click(()=>{
        if(localStorage.getItem('Username')!=null)
            window.location.replace('../page/pin.html');
        else
            window.location.href='../page/login.html';
    })

    $('#btnReg').click(()=>{
        localStorage.clear();
        window.location.href='../page/first.html';
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
                        localStorage.getItem('Indexed',true);

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
                    localStorage.clear();
                    navigator.notification.beep(1);
                    navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{window.location.replace("../page/main.html");}, "Attenzione", ["Chiudi"]);
                }
            );
        }
    });

    $('#btnRecPin').click(()=>{
        cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getUser',{method:'POST',data:{Username:localStorage.getItem('Username')}},

            function(srvData){
                let Result=JSON.parse(srvData.data)[0];

                cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/recupero.php',{method:'POST',data:{Mail:Result.Mail,Username:localStorage.getItem('Username'),Pin:'true'}},

                    function(srvData){
                        let sucRes=JSON.parse(srvData.data);
                        navigator.notification.beep(1);
                        navigator.notification.confirm(sucRes.msg, ()=>{
                            localStorage.setItem("newGen",sucRes.hash);
                            $('#btnVerify').val('Ricarica');
                        }, "Perfetto", ["OK"])
                    },

                    function(jqXHR){
                        navigator.notification.beep(1);
                        navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.msg, ()=>{}, "Attenzione", ["Chiudi"])
                    }
                )
            },

            function(jqXHR){
                navigator.notification.beep(1);
                navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
            }
        )
    })

    $('#btnShowRecPassword').click(()=>{
        $('#divUserPin').hide();
        $('#divRecPassword').show();
        $('#divLoginUser').hide();
    })

    $('#btnRecPassword').click(()=>{
        if($('#txtRecPass').val()!=''){
            cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getUser',{method:'POST',data:{Username:$('#txtRecPass').val()}},
    
                function(srvData){
                    let Result=JSON.parse(srvData.data)[0];
    
                    cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/recuperoP.php',{method:'POST',data:{Mail:Result.Mail,Username:$('#txtRecPass').val()}},
    
                        function(srvData){
                            let sucRes=JSON.parse(srvData.data);
                            navigator.notification.beep(1);
                            navigator.notification.confirm(sucRes.msg, ()=>{
                                $('#divUserPin').hide();
                                $('#divRecPassword').hide();
                                $('#divLoginUser').show();
                            }, "Perfetto", ["OK"])
                        },
    
                        function(jqXHR){
                            navigator.notification.beep(1);
                            navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.msg, ()=>{}, "Attenzione", ["Chiudi"])
                        }
                    )
                },
    
                function(jqXHR){
                    navigator.notification.beep(1);
                    navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
                }
            )
        }
        else{
            navigator.notification.beep(1);
            navigator.notification.confirm("Qualcosa è andato storto: Inserire l'username", ()=>{}, "Attenzione", ["Chiudi"])
        }
    })

    $('#btnRelPin').click(()=>{
        window.location.reload();
    })


    if(sessionStorage.getItem("Available")==null && localStorage.getItem("Username")!=null && connected){
        Fingerprint.isAvailable(isAvailableSuccess, isAvailableError);

        function isAvailableSuccess(result) {
            Fingerprint.show({
                title:"Login Biometrica",
                description: "Usa la tua impronta digitale"
            }, successCallback, errorCallback);

            function successCallback(){
                sessionStorage.setItem('Available',true);
                //navigator.splashscreen.show();
                window.location.replace('../index.html');
            }   

            function errorCallback(error){}

        }

        function isAvailableError(error) {}
    }
    
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
      }
    
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        navigator.splashscreen.hide();
    }
})
