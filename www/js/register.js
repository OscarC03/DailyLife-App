let dati=[];
$(()=>{
    //Inserimento Guidato dati utente PRIMO AVVIO
    $('#btnRegister').click(()=>{
        if($('#btnRegister').val()!='Registrati'){
            if($('#txtNome').val().trim()!=""){
                dati.push($('#txtNome').val());
                $('#info').hide(1000,function(){
                    $('#info').html('').append('<label for="txtPin" class="form-label">Inserisci un codice di 4 cifre</label><input type="number" class="form-control" id="txtPin" placeholder="Inserisci il PIN" required>').show(1000)
                    $('#btnRegister').val('Registrati')
                });
            }
            else{
                $('#txtNome').attr("placeholder", "Campo Obbligatorio").addClass('error').focus();
            }
        }
        else{
            if($('#txtPin').val().trim()!=""){
                dati.push($('#txtPin').val());
                let User={Nome:dati[0],PIN:dati[1]};
                localStorage.setItem('Utente',JSON.stringify(User));
                window.location.href='login.html';
            }
            else
                $('#txtPin').attr("placeholder", "Campo Obbligatorio").addClass('error').focus();
        }
    })

    //Controllo PIN Utente
    let Nome=JSON.parse(localStorage.getItem('Utente')).Nome;
    if(Nome!=null)
        $('#subTit').text('Ciao '+Nome);

    $('#btnVerify').click(()=>{
        let PIN=JSON.parse(localStorage.getItem('Utente')).PIN;
        if($('#txtPin').val().trim()!="")
            if($('#txtPin').val().trim()==PIN){
                sessionStorage.setItem('Available',true);
                window.location.href='../index.html';
            }
            else
                $('#txtPin').attr("placeholder", "PIN errato").addClass('error').focus().val('');
        else
            $('#txtPin').attr("placeholder", "Campo Obbligatorio").addClass('error').focus();
    })
})