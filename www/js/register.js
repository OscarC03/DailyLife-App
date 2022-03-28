$(()=>{
    //Inserimento Guidato dati utente
    $('#btnRegister').click(()=>{
        let User={Name:$('#email').val(),Pwd:$('#pwd').val()};
        localStorage.setItem('User',User);
        window.location.href='../index.html';
    })
})