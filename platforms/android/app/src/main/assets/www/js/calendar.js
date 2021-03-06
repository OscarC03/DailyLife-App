var deviceHeight=Math.max(window.screen.height, window.innerHeight);
var eventTitle="";
var eventDescr="";
var eventID;

var vIndex=0;
let vFinal=[];

$(document).ready(()=>{
    navigator.splashscreen.hide();
})

$(window).on('load',()=>{
    $('#secondFooter').hide();
    $('#thirdFooter').hide();

    let key=localStorage.getItem('key');

    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {  
        initialView: 'timeGridDay',
        themeSystem: 'bootstrap5',
        nowIndicator: true,
        editable: true,
        headerToolbar: false,
        footerToolbar: false,
        locale: 'it',
        contentHeight: deviceHeight-198,

        buttonText:{
            today:    'Oggi',
            month:    'Mese',
            week:     'Settimana',
            day:      'Giorno',
            list:     'Lista'
        },

        eventClick:function(info){
            console.log(info);
            eventTitle=info.event.title;
            eventDescr=info.event.extendedProps.description;
            eventID=info.event.id;

            $('.modal-header').css({'background-color':info.event.backgroundColor})
            $('#eventTitle').html(`<h5 class="text-black">${info.event.startStr.split('T')[0]} - ${info.event.startStr.split('T')[1].split('+')[0]}</h5>`);
            $('#eventBody').html(`
                <h6 class="text-black">${info.event.title}</h6>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">${info.event.extendedProps.description}</li>
                </ul>
            `);
            $('#infoEvento').modal('show');
        },

        eventDrop: function(info) {
            cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/modifyAttivita',{method:'POST',data:{IDU:parseInt(localStorage.getItem('IDU')),Data:info.event.startStr.replace('T', ' '),ID:info.event.id}},
                function(srvData){
                    window.location.reload();
                },
    
                function(jqXHR){
                    navigator.notification.beep(1);
                    navigator.notification.alert("Qualcosa ?? andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
                }
            )
        }
        
    });
    calendar.render();

    $('#txtPosition').text(calendar.currentData.viewTitle);
    $('.fc-toolbar-title').addClass('font-responsive');
    $('.fc-footer-toolbar').addClass('ms-3');
    $('.fc-footer-toolbar').addClass('me-3');
    $('.fc-dayGridMonth-button').removeClass('btn-primary').addClass('btn-success');
    $('.fc-timeGridDay-button').removeClass('btn-primary').addClass('btn-success');
    console.log(calendar);

    calendarEl.addEventListener('swiped-left', function(e) {
        calendar.next();
        $('#txtPosition').text(calendar.currentData.viewTitle);
    });
    
    calendarEl.addEventListener('swiped-right', function(e) {
        calendar.prev();
        $('#txtPosition').text(calendar.currentData.viewTitle);
    });

    cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getAttivita',{method:'POST',data:{IDU:parseInt(localStorage.getItem('IDU'))}},
        function(srvData){
            console.log("Key => "+key);
            let Result=JSON.parse(srvData.data);
            for(let item of Result)
                calendar.addEvent({title: CryptoJS.AES.decrypt(item.Activity,key).toString(CryptoJS.enc.Utf8)+" "+item.Energy,start: item.Data,end: item.Data,description: CryptoJS.AES.decrypt(item.Descrizione,key).toString(CryptoJS.enc.Utf8),backgroundColor:item.Color,id:item.IDCalendar})
        },

        function(jqXHR){
            navigator.notification.beep(1);
            navigator.notification.alert("Qualcosa ?? andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
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

    $('#MW').click(()=>{
        calendar.changeView('dayGridMonth');
    })

    $('#WW').click(()=>{
        calendar.changeView('timeGridWeek');
    })

    $('#GW').click(()=>{
        calendar.changeView('timeGridDay');
    })

    $('#btnModifica').click(()=>{
        $('#eventBody').html(`
            <h5 class="text-center text-uppercase">Evento</h5>
            <label for="txtTitoloEvento" class="form-label">Titolo:</label>
            <input type="text" class="form-control" id="txtTitoloEvento" value="${eventTitle}" />
            <label for="txtDescrEvento" class="form-label" />Descrizione</label>
            <input type="text" class="form-control" id="txtDescrEvento" value="${eventDescr}" />
        `)
        $('#firstFooter').hide();
        $('#secondFooter').show();
    })

    $('#btnAnnulla').click(()=>{
        $('#firstFooter').show();
        $('#secondFooter').hide();
    })

    $('#btnSuccessModifica').click(()=>{
        cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/modifyEvent',{method:'POST',data:{IDU:parseInt(localStorage.getItem('IDU')),Event:CryptoJS.AES.encrypt($('#txtTitoloEvento').val(),key).toString(),Descr:CryptoJS.AES.encrypt($('#txtDescrEvento').val(),key).toString(),ID:eventID}},
            function(srvData){
                window.location.reload();
            },

            function(jqXHR){
                navigator.notification.beep(1);
                navigator.notification.alert("Qualcosa ?? andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
            }
        )
    })

    $('#btnElimina').click(()=>{
        $('#thirdFooter').show();
        $('#secondFooter').hide();
        $('#firstFooter').hide();
        $('#eventBody').html(`
            <h5 class="text-center text-uppercase">vuoi davvero eliminare questo evento?</h5>
        `)
    })

    $('#btnSuccessDelete').click(()=>{
        cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/deleteEvent',{method:'POST',data:{ID:eventID}},
            function(srvData){
                window.location.reload();
            },

            function(jqXHR){
                navigator.notification.beep(1);
                navigator.notification.alert("Qualcosa ?? andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
            }
        )
    })

    $('#btnUndo').click(()=>{
        $('#thirdFooter').hide();
        $('#secondFooter').hide();
        $('#firstFooter').show();
    })

    $('#infoEvento').on('hidden.bs.modal',()=>{
        $('#thirdFooter').hide();
        $('#secondFooter').hide();
        $('#firstFooter').show();
    })

    $('#btnRiorganizza').click(()=>{
        let vEvent=[];
        let vEventHour=[];
        let today=new Date();
        let data=today.toISOString().split('T')[0];
        //console.log(data);
        cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getAttivitaByEnergy',{method:'POST',data:{IDU:localStorage.getItem('IDU')}},
        function(srvData){
            vEvent=[];
            vEventHour=[];

            var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
            var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
            console.log("Data Giusta: "+localISOTime);

            let Result=JSON.parse(srvData.data);
            for(let item of Result){
                if(item.Data.split(' ')[0]==data)
                    vEvent.push(item);
            }
            console.log(vEvent);

            for(let item of vEvent){
                let cDate=new Date(item.Data)
                vEventHour.push(new Date(cDate - tzoffset).toISOString().slice(0, -1));
            }
            /*console.log("iniziale");
            console.log(vEvent);*/

            const sortFunc = (a, b) => {
                const diff = b.Energy - a.Energy;
                switch (diff) {
                  case 0:
                      return -1;
                  default:
                      return diff;
                }
            }

            vFinal=vEvent.sort(sortFunc);
            vEventHour.sort();

            for(let i=0;i<vFinal.length;i++){
                vFinal[i].Data=vEventHour[i].replace('T', ' ').split('.')[0];
                console.log(vFinal[i].Data);
            }
            console.log(vFinal);

            vFinal.forEach(function(item,j){
                console.log({ID:item.IDCalendar,IDU:localStorage.getItem('IDU'),Data:item.Data,Energy:item.Energy})
                cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/modifyEventByEnergy',{method:'POST',data:{ID:item.IDCalendar,IDU:localStorage.getItem('IDU'),Data:item.Data}},
                    function(srvData){
                        console.log(JSON.parse(srvData.data));
                        vIndex++;
                        checkReload();
                    },
    
                    function(jqXHR){
                        navigator.notification.beep(1);
                        navigator.notification.alert("Qualcosa ?? andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
                    }
                )
            })
        },

        function(jqXHR){
            navigator.notification.beep(1);
            navigator.notification.alert("Qualcosa ?? andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
        }
        )
        
    })

    function checkReload(){
        if(vIndex==vFinal.length-1)
            window.location.reload();
    }
})