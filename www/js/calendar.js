var deviceHeight=Math.max(window.screen.height, window.innerHeight);

$(document).ready(()=>{
    navigator.splashscreen.hide();
})

$(window).on('load',()=>{

    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {  
        initialView: 'timeGridDay',
        themeSystem: 'bootstrap5',
        nowIndicator: true,
        editable: true,
        headerToolbar: false,
        locale: 'it',
        contentHeight: deviceHeight-180,

        footerToolbar: {
            left: 'timeGridDay',
            center: 'title',
            right: 'dayGridMonth'
        },

        buttonText:{
            today:    'Oggi',
            month:    'Mese',
            week:     'Settimana',
            day:      'Giorno',
            list:     'Lista'
        },

        eventClick:function(info){
            console.log(info);
            $('.modal-header').css({'background-color':info.event.backgroundColor})
            $('#eventTitle').html(`<h5 class="text-black text-decoration-underline">${info.event.startStr.split('T')[0]} - ${info.event.startStr.split('T')[1].split('+')[0]}</h5>`);
            $('#eventBody').html(`
                <h6 class="text-black text-underline">${info.event.title}</h6>
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
                    navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
                }
            )
        }
        
    });
    calendar.render();

    $('.fc-toolbar-title').addClass('font-responsive');
    $('.fc-footer-toolbar').addClass('ms-3');
    $('.fc-footer-toolbar').addClass('me-3');
    $('.fc-dayGridMonth-button').removeClass('btn-primary').addClass('btn-success');
    $('.fc-timeGridDay-button').removeClass('btn-primary').addClass('btn-success');

    calendarEl.addEventListener('swiped-left', function(e) {
        calendar.next();
    });
    
    calendarEl.addEventListener('swiped-right', function(e) {
        calendar.prev();
    });

    cordova.plugin.http.sendRequest('https://cristaudo.altervista.org/index.php/getAttivita',{method:'POST',data:{IDU:parseInt(localStorage.getItem('IDU'))}},
        function(srvData){
            let Result=JSON.parse(srvData.data);
            for(let item of Result)
                calendar.addEvent({title: item.Activity,start: item.Data,end: item.Data,description: item.Descrizione,backgroundColor:item.Color,id:item.IDCalendar})
        },

        function(jqXHR){
            navigator.notification.beep(1);
            navigator.notification.confirm("Qualcosa è andato storto: "+jqXHR.error, ()=>{navigator.app.exitApp();}, "Attenzione", ["Chiudi"])
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
})