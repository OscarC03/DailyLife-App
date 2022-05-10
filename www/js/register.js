$(()=>{
    //Inserimento Guidato dati utente PRIMO AVVIO
    document.addEventListener('deviceready',onDeviceReady,false)
    //Schermata di caricamento
    function onDeviceReady(){
        navigator.splashscreen.show();
        setTimeout(function() {
            navigator.splashscreen.hide();
        }, 3000);
        
        //Richiesta nome utente
        if(localStorage.getItem('Username')!=undefined){
            console.log(localStorage.getItem('Username'));
            cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getUser',{method:'POST',data:{Username:localStorage.getItem('Username')}},
            
            function(srvData){
                console.log("Inizio: "+srvData)
                if(srvData.data[0].Nome!=undefined)
                    $('#subTit').text('Ciao '+srvData[0].Nome);
            },
            
            function(jqXHR){
                alert("Error: "+jqXHR.error);
            })
        }
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
                if(srvData.data[0].UserExist==0){
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
                                alert(jqXHR.error);
                                history.go(0);
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
                alert(jqXHR.error);
            })
        }
        else
            $('#txtUsername').attr("placeholder", "Campo Obbligatorio").addClass('error').focus();
    })

    $('#btnVerify').click(()=>{
        //Verifica del pin
        cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getPin',{method:'POST',data:{Username:localStorage.getItem('Username')}},
        function(srvData){
            if($('#txtPin').val().trim()!="")
                if($('#txtPin').val().trim()==srvData.data[0].Password){
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
            alert(jqXHR.error);
        })
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
            const options = {
                method: "POST",
                data: {Username:dati[0]}
              };
            cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getCredentials',options,
            function(srvData){
                if(srvData.data.length>0){
                    console.log(options);
                    if(srvData.data.Username!=dati[0]){
                        $('#txtLogUsername').attr("placeholder", "Username Errato").addClass('error').focus();
                    }
                    else if(srvData.data.Password!=dati[1]){
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
                alert(jqXHR.error);
            });
        }
    });
})