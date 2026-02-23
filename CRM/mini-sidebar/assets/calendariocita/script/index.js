var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
var days = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
var timesAvailable = ["9:00am", "10:00am", "11:00am", "2:00pm", "3:00pm"];

var event = JSON.parse(sessionStorage.getItem("eventObj"));
console.log(event);

document.getElementById("event").textContent = event.name;
document.getElementById("scheduler").textContent = event.organizer;
//document.getElementById("duration").textContent = event.duration + "min";
document.getElementById("description").textContent = event.description;


// Calendar
document.addEventListener('DOMContentLoaded', function() {

                $("#btlRC").addClass('ocultar');
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        height: 'auto',
        locale: 'es',
        showNonCurrentDates: true,
        selectable: true,
        select: function(info) {
            var currentDay = new Date();
            var daySelected = info.start;
            if (daySelected >= currentDay) {

                var timeDiv = document.getElementById("available-times-div");

                while (timeDiv.firstChild) {
                    timeDiv.removeChild(timeDiv.lastChild);
                }

                //Heading - Date Selected
                var h4 = document.createElement("h4");
                var h4node = document.createTextNode(
                    days[daySelected.getDay()] + ", " +
                    months[daySelected.getMonth()] + " " + 
                    daySelected.getDate());
                h4.appendChild(h4node);

                timeDiv.appendChild(h4);

                //Time Buttons
                for (var i = 0; i < timesAvailable.length; i++) {
                    var timeSlot = document.createElement("div");
                    timeSlot.classList.add("time-slot");

                    var timeBtn = document.createElement("button");

                    var btnNode = document.createTextNode(timesAvailable[i]); 
                    timeBtn.classList.add("time-btn");

                    timeBtn.appendChild(btnNode);
                    timeSlot.appendChild(timeBtn);

                    timeDiv.appendChild(timeSlot);

                    // When time is selected
                    var last = null;
                    timeBtn.addEventListener("click", function() {
                        if (last != null) {
                            console.log(last);
                            last.parentNode.removeChild(last.parentNode.lastChild);
                        }
                        var confirmBtn = document.createElement("button");
                        var confirmTxt = document.createTextNode("Confirm");


                        confirmBtn.classList.add("confirm-btn");
                        confirmBtn.appendChild(confirmTxt);
                        this.parentNode.appendChild(confirmBtn);
                        event.time = this.textContent;
                        confirmBtn.addEventListener("click", function() { 
                            event.date = days[daySelected.getDay()] + ", " + daySelected.getDate() + " " + months[daySelected.getMonth()] ;
                            sessionStorage.setItem("eventObj", JSON.stringify(event));
                            console.log(event);
                            $("#infoCalendario").fadeToggle();
                            $("#infoCliente").fadeToggle();
                            document.getElementById("event1").textContent = event.name;
                            document.getElementById("scheduler1").textContent = event.organizer;
                            document.getElementById("event-time-stamp").textContent = "Cita programada para el " + event.date + " a las " + event.time;
                            //window.location.href = "register.html";
                        });
                        last = this;
                    });
                }

                
                $("#register-btn").click( function() { 

                        document.getElementById("event2").textContent = "Has registrado una cita con " +event.name;
                        document.getElementById("scheduler2").textContent = event.organizer;
                        document.getElementById("event-time-stamp2").textContent = "Cita programada para el " + event.date + " a las " + event.time;
                            

                     $("#infoCliente").fadeToggle();     
                     $("#confirCliente").fadeToggle();
                })

                var containerDiv = document.getElementsByClassName("container")[0];
                containerDiv.classList.add("time-div-active");
                
                document.getElementById("calendar-section").style.flex = "2";

                timeDiv.style.display = "inline-block";

                if($(window).width() < 500)
                {
                    $("#calendar").addClass('ocultar');
                    $("#btlRC").removeClass('ocultar');
                    $("#btlRC").addClass('aparecer');
                }


                        
                
                
                

            } else {alert("Lo siento, esa fecha ya pasó. Seleccione otra fecha.");}
        },
    });
   
    calendar.render();
    
});

var regresarBtn = document.getElementById("regresarBtn");
regresarBtn.addEventListener("click", function() { 

     $("#infoCalendario").fadeToggle();
     $("#infoCliente").fadeToggle();
})

$("#regresarCalendario").click("", function() {

    redimencion();    

    $("#calendar").removeClass('ocultar');
    $("#available-times-div").hide();
    $("#btlRC").removeClass('aparecer');
    $("#btlRC").addClass('ocultar');
}) 


$(".btn-solicitar-cita").click("", function() {
    redimencion();

     $("#infoCalendario").fadeToggle();
     $("#list-personal").fadeToggle();
}) 

$("#regresarList").click("", function() {
    redimencion();

     $("#infoCalendario").fadeToggle();
     $("#list-personal").fadeToggle();
}) 

function redimencion(){
    if($(window).width() < 500)
    {

        $(".fc-daygrid-body").css("width", "259px");
        $(".fc-scrollgrid-sync-table").css("width", "259px");
        $(".fc-col-header").css("width", "259px");

    } else {
       $(".fc-daygrid-body").css("width", "324px");
        $(".fc-scrollgrid-sync-table").css("width", "324px");
        $(".fc-col-header").css("width", "324px");
    }
}