$(document).ready(function(){

var IDPacientes = new Array();

var onlyToEncrypt = "";

function httpGetAsync(theUrl, callback){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
}

function dataLoaded(text){
    $('#tableBody').empty();
    var json = text;
    var obj = JSON.parse(json);

    IDPacientes=[]; 

    for (i = 0; i < obj.length; i++) {
        var IDPaciente = obj[i].IDPaciente;
        IDPacientes.push(IDPaciente);
        var apellidoPaciente = obj[i].apellido;
        var nombrePaciente = obj[i].nombre;
        var btCheckbox = "<td><input type=\"checkbox\" id=\"btCheckbox"+i+"\"></td>";
        var btEdit = "<td><button type=\"button\" class=\"btn btn-primary btn-block\" id=\"btEdit"+i+"\"><span class=\"glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span> </button></td>";
        var btConfig = "<td><button type=\"button\" class=\"btn btn-primary btn-block\" id=\"btConfig"+i+"\"><span class=\"glyphicon glyphicon-cog\" aria-hidden=\"true\"></span> </button></td>";
        var btConfigMem = "<td><button type=\"button\" class=\"btn btn-primary btn-block\" id=\"btConfigMem"+i+"\"><span class=\"glyphicon glyphicon-cog\" aria-hidden=\"true\"></span> </button></td>";
		var btResults = "<td><button type=\"button\" class=\"btn btn-primary btn-block\" id=\"btResults"+i+"\"><span class=\"glyphicon glyphicon-stats\" aria-hidden=\"true\"></span> </button></td>";
        var btPlay = "<td><button type=\"button\" class=\"btn btn-primary btn-block\" id=\"btPlay"+i+"\"><span class=\"glyphicon glyphicon-play\" aria-hidden=\"true\"></span> </button></td>";
		var btPlayMem = "<td><button type=\"button\" class=\"btn btn-primary btn-block\" id=\"btPlayMem"+i+"\"><span class=\"glyphicon glyphicon-play\" aria-hidden=\"true\"></span> </button></td>";
		var btShare = "<td><button type=\"button\" class=\"btn btn-primary btn-block\" id=\"btShare"+i+"\"><span class=\"glyphicon glyphicon-share-alt\" aria-hidden=\"true\"></span> </button></td>";
        var btResultsMem = "<td><button type=\"button\" class=\"btn btn-primary btn-block\" id=\"btResultsMem"+i+"\"><span class=\"glyphicon glyphicon-stats\" aria-hidden=\"true\"></span> </button></td>";
		$('#tableBody').append( '<tr>'+ btCheckbox + '<td>' + apellidoPaciente +'</td> <td>' + nombrePaciente +'</td>'+btEdit+btConfig+btResults+btPlay+btShare+btConfigMem+btPlayMem+btResultsMem+'</tr>');

        $('#btEdit'+i).bind('click', { id: IDPaciente},
        function(event) {
            var data = event.data;
            localStorage.IDPaciente = data.id;     
            document.location.href = "/web/patient.html"; //?IdPaciente="+data.id      
        });
        $('#btConfig'+i).bind('click', { id: IDPaciente, nombre: nombrePaciente, apellido: apellidoPaciente },//creo que solo uso el ID
        function(event) {
            var data = event.data;
            localStorage.IDPaciente = data.id;
            localStorage.name = data.nombre + " "+ data.apellido;      
            document.location.href = "/web/config.html";        
        });
		$('#btConfigMem'+i).bind('click', { id: IDPaciente, nombre: nombrePaciente, apellido: apellidoPaciente },//creo que solo uso el ID
        function(event) {
            var data = event.data;
            localStorage.IDPaciente = data.id;
            localStorage.name = data.nombre + " "+ data.apellido;      
            document.location.href = "/web/configMemoria.html";        
        });
        $('#btResults'+i).bind('click', { id: IDPaciente, nombre: nombrePaciente, apellido: apellidoPaciente }, //creo que solo uso el ID
        function(event) {
            var data = event.data;
            localStorage.IDPaciente = data.id;
            localStorage.name = data.nombre + " "+ data.apellido;      
            document.location.href = "/web/results.html";        
        });
		
		//HACER LUEGO DE HTML RESULTADOS
		*$('#btResultsMem'+i).bind('click', { id: IDPaciente, nombre: nombrePaciente, apellido: apellidoPaciente }, //creo que solo uso el ID
        function(event) {
            var data = event.data;
            localStorage.IDPaciente = data.id;
            localStorage.name = data.nombre + " "+ data.apellido;      
            document.location.href = "/web/results.html";        
        });

        $('#btPlay'+i).bind('click', { id: IDPaciente},
        function(event) {
            var data = event.data;
            httpGetAsync("/API/patient/ENCRIPT/"+data.id, gameEncript);    
        });
		
		$('#btPlayMem'+i).bind('click', { id: IDPaciente},
        function(event) {
            var data = event.data;
            httpGetAsync("/API/patient/ENCRIPT/"+data.id, gameEncriptMem);    
        });
        $('#btShare'+i).bind('click', { id: IDPaciente},
        function(event) {
            var data = event.data;
            localStorage.IDPaciente = data.id;
            httpGetAsync("/API/patient/ENCRIPT/"+data.id, patientEncript);       
        });
    }
}

$( "#btAddPaciente" ).click(function() {
    localStorage.IDPaciente = "";//para que no busque los datos desp
    document.location.href = "/web/patient.html"; 
});

/***************************************** Aceptar Button *************************************************/
$( "#aceptar" ).click(function() {
    for (var i = 0; i < $('#tableBody')[0].childElementCount; i++) {
        if ($('#btCheckbox'+i)[0].checked == true) {
           httpGetAsync("/API/patient/DELETE/"+IDPacientes[i],voidLoaded);//Rehacer se va esto
        }      
    }
    //httpGetAsync("/API/patient/PATIENTS",dataLoaded);
});

function voidLoaded(text){
    httpGetAsync("/API/patient/PATIENTS",dataLoaded);//A ver si esto funca
}

function gameEncript(text){
    text = text.substr(1,text.length-2);
    var win = window.open("/?IdPaciente="+text, '_blank');
    win.focus();   
}
function gameEncriptMem(text){
	text = text.substr(1,text.length-2);
    var win = window.open("/paradigmamemoria/?IdPaciente="+text, '_blank');
    win.focus();  
}

function patientEncript(text){
    text = text.substr(1,text.length-2);
    onlyToEncrypt = text;
    httpGetAsync("/API/patient/DATA/"+localStorage.IDPaciente,patientDataLoaded);
}

function patientDataLoaded(text){
    var json = text;
    var obj = JSON.parse(json);

    var email = obj.email;
    var subject = "Ejercicios de Rehabilitacion";
    var body = "Estimado/a " +obj.nombre + ':'+'%0D%0A'+"La dirección para acceder a los ejercicios es la siguiente:"+'%0D%0A'+'%0D%0A'+"http://www.rehabilitacioncognitiva.esy.es/?IdPaciente="+ onlyToEncrypt +'%0D%0A'+'%0D%0A'+ "Atte."+'%0D%0A'+ obj.terapeuta;
    

    var win = window.open("https://mail.google.com/mail/?view=cm&fs=1&tf=1&to="+email+"&su="+subject+"&body="+body, '_blank');
    win.focus();    
}

$("#search").keydown(function(event){
    if(event.keyCode == 13){
        if ($("#search").val() == "")
            httpGetAsync("/API/patient/PATIENTS",dataLoaded);
        else
            httpGetAsync("/API/patient/NAME/"+$("#search").val(),dataLoaded);
    }
});

httpGetAsync("/API/patient/PATIENTS",dataLoaded);
});