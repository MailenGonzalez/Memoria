$(document).ready(function(){

/***************************************** Personal Data *************************************************/
var IDPaciente = localStorage.IDPaciente;
$("#nombrePaciente").html(localStorage.name);
httpGetAsync("/API/dayMem/"+IDPaciente,dataLoaded);
var actualDate = getActualDate();
$("#datepicker").val(getActualDate());
httpGetAsync("/API/memoria/DAY/"+IDPaciente+"/"+dateConverter(getActualDate()),configsLoaded);

/***************************************** Get fecha actual *************************************************/
function getActualDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10)
        dd='0'+dd; 
    if(mm<10)
        mm='0'+mm;
    return dd+'/'+mm+'/'+yyyy;
}  
/***************************************** Html Request *************************************************/
function httpGetAsync(theUrl, callback){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
}

/***************************************** Date Picker *************************************************/
var SelectedDates = {};
function dataLoaded(text){
    //console.log(text);
    var json = text;
    var obj = JSON.parse(json);

    for (var i = 0; i < obj.length; i++){
        var dia = obj[i].day;
        dia = dia.replace(/-/g, "/");
        SelectedDates[new Date(dia)] = dia; 
    }
}

function dateConverter(date){
    var fechaAux = date.substring(6,10)+"-"+date.substring(3,5)+"-"+date.substring(0,2);
    return fechaAux;
}

$('#datepicker').datepicker({
    beforeShowDay: function(date) {
        var Highlight = SelectedDates[date];
        if (Highlight)
            return [true, "Highlighted", Highlight];
        else
            return [true, '', ''];
    },
    onSelect: function(date) {
        var fechaAux = dateConverter(date);
        httpGetAsync("/API/memoria/DAY/"+IDPaciente+"/"+fechaAux,configsLoaded);
    }
});

/***************************************** Configs *************************************************/
function configsLoaded(text){
    var json = text;
    var obj = JSON.parse(json);

    for (var i = 0; i < obj.length; i++){
        $("#tiempoCodificacion").val(obj[i].tiempoCodificacion);
        $("#tiempoRecuperacion").val(obj[i].tiempoRecuperacion);
        $("#tiempoJuego").val(obj[i].tiempoJuego);
        $("#colorBackground").val(obj[i].colorBackground);
		$("#colorLetras").val(obj[i].colorLetras);
		$("#dificultadPal").val(obj[i].dificultadPal);
		$("#dificultadCuad").val(obj[i].dificultadCuad);
    }
}

/***************************************** Save configs *************************************************/
$( "#botonListo" ).click(function() {
    var aux = $('#datepicker').val();
    $("#textoModal").html("Los cambios fueron salvados.");
    
    if (isSelectedDayLowerThanToday()) {
        aux = getActualDate();
        $("#textoModal").html("La fecha seleccionada expiró, la configuración será guardada en día de la fecha"); 
    }
    if (aux == "")
        $("#textoModal").html("Seleccionar fecha de activación"); 
    else {
        var pending = 4;
        var fechaActivacion = dateConverter(aux);
        var fecha = new Date().toISOString().slice(0, 10);
        var data = new Object();
            data.IDPaciente = IDPaciente;
            data.fechaActivacion = fechaActivacion;
            data.tiempoCodificacion = $("#tiempoCodificacion").val();
            data.tiempoRecuperacion = $("#tiempoRecuperacion").val();
			data.tiempoJuego = $("#tiempoJuego").val();
            data.colorBackground = $("#colorBackground").val();
			data.colorLetras = $("#colorLetras").val();
			data.dificultadPal = $("#dificultadPal").val();
			data.dificultadCuad = $("#dificultadCuad").val();
            
            $.ajax({
                type: 'PUT',
                url: '/API/memoria',
                parseData: false,
                dataType: 'application/json',
                data: JSON.stringify(data),
                success: callbackfn(data)
            });          
           
			function callbackfn(data) //VEER EL CALLBACK ACA NO ME GUSTA
            {
                pending--;
                //if (pending == 0)
                    //console.log("terminó");
            }
        
    }
});

/***************************************** Fecha *************************************************/
function isSelectedDayLowerThanToday() {
    var today = new Date();
    var ddT = today.getDate();
    var mmT = today.getMonth()+1; //January is 0!
    var yyyyT = today.getFullYear();

    var ddP = parseInt($('#datepicker').val().substring(0, 2));
    var mmP = parseInt($('#datepicker').val().substring(3, 5));
    var yyyyP = parseInt($('#datepicker').val().substring(6, 10));

    if(yyyyP<yyyyT) {
        return true;
    }
    else {
        if (yyyyP == yyyyT ) {
            if(mmP<mmT) {
                return true;
            }
            else {
                if (mmP==mmT) {
                    if(ddP<ddT) {
                        return true;
                    }
                }
            }
        }
    }    
    return false;
} 

/***************************************** Close Button *************************************************/
$( "#cerrar" ).click(function() {
    var aux = $('#datepicker').val(); 
    if (aux != "")
        httpGetAsync("/API/dayMem/"+IDPaciente,dataLoaded); //Actualiza el calendario para incluir la nueva fecha en verde
        //TODO Comprobar fecha de activacion invalida
});
});