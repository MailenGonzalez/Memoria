$(document).ready(function(){

/***************************************** Personal Data *************************************************/
var IDPaciente = localStorage.IDPaciente;

/**** Get fecha actual ***/
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

if (IDPaciente != ""){
    $("#titulo").html("Editar Paciente");
    httpGetAsync("/API/patient/DATA/"+IDPaciente,configsLoaded);
}
else {
    $("#datepicker").val(getActualDate());
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

function dateConverter(date){
    var fechaAux = date.substring(6,10)+"-"+date.substring(3,5)+"-"+date.substring(0,2);
    return fechaAux;
}
/***************************************** Configs *************************************************/
function configsLoaded(text){
    var json = text;
    var obj = JSON.parse(json);

    $("#apellido").val(obj.apellido);
    $("#nombre").val(obj.nombre);
    $("#email").val(obj.email);
    $("#terapeuta").val(obj.terapeuta);
    var dia = obj.fechaInicio.substring(8,10)+"/"+obj.fechaInicio.substring(5,7)+"/"+obj.fechaInicio.substring(0,4);
    $("#datepicker").val(dia);
}

/***************************************** Save configs *************************************************/
$( "#botonListo" ).click(function() {
    /***************** Datos *******************/
    var aux = $('#datepicker').val();
    $("#textoModal").html("Los cambios fueron salvados.");
    var fechaInicio = dateConverter(aux);
    var data = new Object();
    data.IDPaciente = IDPaciente;
    data.apellido =  $("#apellido").val();
    data.nombre = $("#nombre").val();
    data.email = $("#email").val();
    data.terapeuta = $("#terapeuta").val();
    data.fechaInicio = fechaInicio;
   
    $.ajax({
                type: 'PUT',
                url: '/API/patient',
                parseData: false,
                dataType: 'application/json',
                data: JSON.stringify(data),
                success: callbackfn(data)
            });          
    function callbackfn(data) //VEER EL CALLBACK ACA NO ME GUSTA
    {
            //console.log("terminó");
    }
});

/***************************************** Close Button *************************************************/
$( "#cerrar" ).click(function() {
     document.location.href = "/index.html";
});
});
