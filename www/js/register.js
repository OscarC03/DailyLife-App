$(()=>{
    //Inserimento Guidato dati utente
    $('#btnRegister').click(()=>{
        let User={
            Name:$('#txtNome').val(),
            Cognome:$('#txtCognome').val(),
            DataN:$('#txtEta').val()
        };
        localStorage.setItem('Utente',User);
        window.location.href='../index.html';
    })
})