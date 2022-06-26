$(document).ready(()=>{
    navigator.splashscreen.hide();
})

$(window).on('load',()=>{

    cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getUmoreUtente',{method:'POST',data:{IDU:parseInt(localStorage.getItem('IDU'))}},
        function(srvData){
            let Happy="";
            let Stress="";
            let Mind="";
            let Body="";
            let bg="";
            let txtHappy="";
            let txtStress="";
            let txtMind="";
            let txtBody="";
            let txtMedia="";

            let key=localStorage.getItem('key');
            let Result=JSON.parse(srvData.data);

            for(let item of Result){
                if(parseInt(CryptoJS.AES.decrypt(item.Felicita,key).toString(CryptoJS.enc.Utf8))>=6 && parseInt(CryptoJS.AES.decrypt(item.Felicita,key).toString(CryptoJS.enc.Utf8))<7){
                    Happy='<i class="fa-regular fa-face-meh"></i> Felice';
                    txtHappy="text-warning";
                }
                else if(parseInt(CryptoJS.AES.decrypt(item.Felicita,key).toString(CryptoJS.enc.Utf8))>=7){
                    Happy='<i class="fa-regular fa-face-grin-beam"></i> Felice';
                    txtHappy="text-success";
                }
                else{
                    Happy='<i class="fa-regular fa-face-frown"></i> Triste';
                    txtHappy="text-danger";
                }
                
                if(parseInt(CryptoJS.AES.decrypt(item.Stress,key).toString(CryptoJS.enc.Utf8))>=6 && parseInt(CryptoJS.AES.decrypt(item.Stress,key).toString(CryptoJS.enc.Utf8))<7){
                    Stress='<i class="fa-regular fa-face-meh"></i> Stressato';
                    txtStress="text-warning";
                }
                else if(parseInt(CryptoJS.AES.decrypt(item.Stress,key).toString(CryptoJS.enc.Utf8))>=7){
                    Stress='<i class="fa-regular fa-face-frown"></i> Stressato';
                    txtStress="text-danger";
                }
                else{
                    Stress='<i class="fa-regular fa-face-grin"></i> Non Stressato';
                    txtStress="text-success";
                }
                    
                if(parseInt(CryptoJS.AES.decrypt(item.Fisico,key).toString(CryptoJS.enc.Utf8))>=6 && parseInt(CryptoJS.AES.decrypt(item.Fisico,key).toString(CryptoJS.enc.Utf8))<7){
                    Body='<i class="fa-regular fa-face-meh"></i> Stanco Fisicamente';
                    txtBody="text-warning";
                }
                else if (parseInt(CryptoJS.AES.decrypt(item.Fisico,key).toString(CryptoJS.enc.Utf8))>=7){
                    Body='<i class="fa-solid fa-heart-crack"></i> Stanco Fisicamente';
                    txtBody="text-danger";
                }
                else{
                    Body='<i class="fa-solid fa-heart-pulse"></i> Riposato Fisicamente';
                    txtBody="text-success";
                }
                
                if(parseInt(CryptoJS.AES.decrypt(item.Mentale,key).toString(CryptoJS.enc.Utf8))>=6 && parseInt(CryptoJS.AES.decrypt(item.Mentale,key).toString(CryptoJS.enc.Utf8))<7){
                    Mind='<i class="fa-regular fa-face-meh"></i> Stanco Mentalmente';
                    txtMind="text-warning";
                }
                else if(parseInt(CryptoJS.AES.decrypt(item.Mentale,key).toString(CryptoJS.enc.Utf8))>=7){
                    Mind='<i class="fa-regular fa-face-flushed"></i> Stanco Mentalmente';
                    txtMind="text-danger";
                }
                else{
                    Mind='<i class="fa-solid fa-brain"></i> Riposato Mentalmente';
                    txtMind="text-success";
                }

                if(parseInt(CryptoJS.AES.decrypt(item.Media,key).toString(CryptoJS.enc.Utf8))>=6 && parseInt(CryptoJS.AES.decrypt(item.Media,key).toString(CryptoJS.enc.Utf8))<7){
                    bg="bg-warning";
                    txtMedia="text-warning";
                    Media="In bilico";
                }
                else if(parseInt(CryptoJS.AES.decrypt(item.Media,key).toString(CryptoJS.enc.Utf8))>=7){
                    bg="bg-danger";
                    txtMedia="text-danger";
                    Media="Insufficente";
                }
                else{
                    bg="bg-success";
                    txtMedia="text-success";
                    Media="Ottima";
                }

                $('#scRiepilogoUmore').append('<div class="col-12 mb-2"><div class="d-flex justify-content-start '+bg+' ps-2 pe-2 pt-2 pb-2" style="border-top-left-radius:20%; border-top-right-radius:20%; border-top:2px solid black; border-right:2px solid black; border-left:2px solid black;"><h3 class="text-white text-center font-humor">'+item.Data+'</h3></div><div class="d-flex justify-content-evenly bg-white ps-2 pe-2 pt-2 pb-2" style="border-right:2px solid black; border-left:2px solid black;"><h3 class="'+txtHappy+' font-humor text-center">'+Happy+'</h3><h3 class="'+txtStress+' font-humor text-center">'+Stress+'</h3><h3 class="'+txtBody+' font-humor text-center">'+Body+'</h3><h3 class="'+txtMind+' font-humor text-center">'+Mind+'</h3></div><div class="d-flex justify-content-start ps-2 pe-2 pt-2 pb-2" style="background-color:#F9F9F9; border-bottom:2px solid black; border-right:2px solid black; border-left:2px solid black;"><h3 class="text-black text-center font-humor text-black-50">Media parametrica:&nbsp</h3><h3 class="'+txtMedia+' text-center font-humor">'+Media+'</h3></div></div>')
            }
        },

        function(jqXHR){
            navigator.notification.beep(1);
            navigator.notification.alert("Qualcosa è andato storto:sss "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
        }
)

    $('#btnBack').click(()=>{
        window.location.replace('../index.html');
    })

    $("#btnCalendar").click(()=>{
        window.location.replace("../page/calendar.html");
        navigator.splashscreen.show();
    })

    $("#btnOption").click(()=>{
        window.location.replace("../page/calendar.html");
        navigator.splashscreen.show();
    });

    $('#btnList').click(()=>{
        window.location.replace('../page/list.html');
        navigator.splashscreen.show();
    })
})