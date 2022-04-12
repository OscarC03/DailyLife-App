$(()=>{
    //Inserimento Guidato dati utente PRIMO AVVIO
    document.addEventListener('deviceready',onDeviceReady,false)
    //Schermata di caricamento
    function onDeviceReady(){
        navigator.splashscreen.show();
        setTimeout(function() {
            navigator.splashscreen.hide();
        }, 3000);
    }

    //Richiesta nome utente
    if(localStorage.getItem('Username')!=undefined){
        console.log(localStorage.getItem('Username'));
        let User=sendRequestNoCallback('https://cristaudo.altervista.org/index.php/getUser','POST',{Username:localStorage.getItem('Username')})

        User.done((srvData)=>{
            if(srvData[0].Nome!=undefined)
                $('#subTit').text('Ciao '+srvData[0].Nome);
        });

        User.fail((jqXHR)=>{
            alert("Error: "+jqXHR);
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
            let username=sendRequestNoCallback('https://cristaudo.altervista.org/index.php/getUsername','POST',{Username:$('#txtUsername').val()})
            username.done((srvData)=>{
                if(srvData[0].UserExist==0){
                    dati.push($('#txtUsername').val());

                    if($('#txtPin').val().trim()!="" && !error){
                        if($('#txtPin').val().length==4){
                            dati.push($('#txtPin').val());
                            //Aggiunta campi sul db
                            let Utente=sendRequestNoCallback('https://cristaudo.altervista.org/index.php/newUser','POST',{Nome:dati[0],Cognome:dati[1],Username:dati[2],PIN:dati[3]})
                            Utente.done((srvData)=>{
                                localStorage.clear();
                                localStorage.setItem('Username',dati[2]);
                                window.location.replace('../page/pin.html'); 
                            })
                            Utente.fail((jqXHR)=>{history.go(0);})
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
            })
            username.fail(()=>{
                alert("Username errore")
            })
        }
        else
            $('#txtUsername').attr("placeholder", "Campo Obbligatorio").addClass('error').focus();
    })

    $('#btnVerify').click(()=>{
        //Verifica del pin
        let User=sendRequestNoCallback('https://cristaudo.altervista.org/index.php/getPin','POST',{Username:localStorage.getItem('Username')})
        
        User.done((srvData)=>{
            if($('#txtPin').val().trim()!="")
                if($('#txtPin').val().trim()==srvData[0].Password){
                    sessionStorage.setItem('Available',true);
                    navigator.splashscreen.show();
                    window.location.replace('../index.html');
                }
            else
                $('#txtPin').attr("placeholder", "PIN errato").addClass('error').focus().val('');
        else
            $('#txtPin').attr("placeholder", "Campo Obbligatorio").addClass('error').focus();
        });
        
        User.fail((jqXHR)=>{
            alert(jqXHR)
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
            let logUser=sendRequestNoCallback('https://cristaudo.altervista.org/index.php/getCredentials','POST',{Username:dati[0]});

            logUser.done((srvData)=>{
                if(srvData[0].Username!=dati[0]){
                    $('#txtLogUsername').attr("placeholder", "Username Errato").addClass('error').focus();
                }
                else if(srvData[0].Password!=dati[1]){
                    $('#txtLogPin').attr("placeholder", "PinErrato").addClass('error').focus();
                }
                else{
                    localStorage.setItem("Username",dati[0]);
                    window.location.replace('../page/pin.html');
                }
            });

            logUser.fail((jqXHR)=>{
                alert("Errore: "+jqXHR);
            });
        }
    });
})