let dati=[];
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
    //Creazione nuovo USER
    $('#btnRegister').click(()=>{
        if($('#btnRegister').val()!='Registrati'){
            if($('#txtNome').val().trim()!=""){
                dati.push($('#txtNome').val());
                $('#info').hide(1000,function(){
                    $('#info').html('').append('<label for="txtPin" class="form-label">Inserisci un codice di 4 cifre</label><input type="number" class="form-control" id="txtPin" placeholder="Inserisci il PIN" required>').show(1000)
                    $('#btnRegister').val('Registrati')
                    $('#txtPin').focus();
                });
            }
            else{
                $('#txtNome').attr("placeholder", "Campo Obbligatorio").addClass('error').focus();
            }
        }
        else{
            if($('#txtPin').val().trim()!=""){
                if($('#txtPin').val().length==4){
                    dati.push($('#txtPin').val());
                    let User={
                        Nome:String(CryptoJS.AES.encrypt(dati[0],"d9c5a465c6f0e19878cffa1675f35de015290ace")), //Nome utente criptato con AES
                        PIN:String(CryptoJS.AES.encrypt(dati[1], "d9c5a465c6f0e19878cffa1675f35de015290ace")) //PIN utente criptato con AES
                    };
                    localStorage.setItem('Utente',JSON.stringify(User));
                    window.location.replace('login.html');
                }
                else
                    $('#txtPin').attr("placeholder", "Inserire un pin di 4 cifre").addClass('error').focus().val('');
            }
            else
                $('#txtPin').attr("placeholder", "Campo Obbligatorio").addClass('error').focus();
        }
    })

    //Controllo PIN Utente
    if(localStorage.getItem('Utente')!=null){
        let Nome=CryptoJS.AES.decrypt(JSON.parse(localStorage.getItem('Utente')).Nome, "d9c5a465c6f0e19878cffa1675f35de015290ace").toString(CryptoJS.enc.Utf8);
        alert(Nome)
        $('#subTit').text('Ciao '+Nome);
    }

    $('#btnVerify').click(()=>{
        let PIN=CryptoJS.AES.decrypt(JSON.parse(localStorage.getItem('Utente')).PIN,"d9c5a465c6f0e19878cffa1675f35de015290ace").toString(CryptoJS.enc.Utf8);
        if($('#txtPin').val().trim()!="")
            if($('#txtPin').val().trim()==PIN){
                sessionStorage.setItem('Available',true);
                navigator.splashscreen.show();
                window.location.replace('../index.html');
            }
            else
                $('#txtPin').attr("placeholder", "PIN errato").addClass('error').focus().val('');
        else
            $('#txtPin').attr("placeholder", "Campo Obbligatorio").addClass('error').focus();
    })
})