$(document).ready(function(){

var IDPaciente = localStorage.IDPaciente;
httpGetAsync("/API/patient/DATA/"+IDPaciente,patientLoaded);

var excelData=[];

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

/***************************************** Personal Data *************************************************/
function dbToDatePickerConverter(fecha){
    return fecha.substring(8,10)+"/"+fecha.substring(5,7)+"/"+fecha.substring(0,4);
}

function patientLoaded(text){
    var json = text;
    var obj = JSON.parse(json);

    if(obj.apellido != "")
        $("#apellido").html(obj.apellido);
    if(obj.nombre != "")
        $("#nombre").html(obj.nombre);
    if(obj.email != "")
        $("#email").html(obj.email);
    if(obj.terapeuta != "")
        $("#terapeuta").html(obj.terapeuta);
    if (obj.fechaInicio != "0000-00-00")  { 
        var dia = dbToDatePickerConverter(obj.fechaInicio);
        $("#fechaInicio").html(dia);
    }
}

/***************************************** Date Picker *************************************************/
var SelectedDates = {};

function dataLoaded(text){
    var json = text;
    var obj = JSON.parse(json);

    for (i = 0; i < obj.length; i++){
        var dia = obj[i].day;
        dia = dia.replace(/-/g, "/");
        SelectedDates[new Date(dia)] = dia; 
    }
    var fechaInicio = dbToDatePickerConverter(obj[0].day);
    $('#datepickerInicio').val(fechaInicio);
    var fechaFin = dbToDatePickerConverter(obj[obj.length-1].day);
    $('#datepickerFin').val(fechaFin);
    $('#tituloPanelResultados').html("Resultados entre "+fechaInicio+" y "+fechaFin);
    
    httpGetAsync("/API/result/SUMMARY/"+IDPaciente+"/"+obj[0].day+" 00:00:00/"+obj[obj.length-1].day+" 23:59:59",summaryResults);
    //hacer conversiones cuando haga las fechas en do something!!!!
}

function dateConverter(date){
    var fechaAux = date.substring(6,10)+"-"+date.substring(3,5)+"-"+date.substring(0,2);
    return fechaAux;
}

$('#datepickerInicio').datepicker({
    beforeShowDay: function(date) {
        var Highlight = SelectedDates[date];
        if (Highlight)
            return [true, "Highlighted", Highlight];
        else
            return [true, '', ''];
    },
    onSelect: function(date) {
        var fechaAux = dateConverter(date);//poner if con las fechas!!
        $('#summayResults').empty();
        httpGetAsync("/API/result/SUMMARY/"+IDPaciente+"/"+fechaAux+" 00:00:00/"+dateConverter($('#datepickerFin').val())+" 23:59:59",summaryResults);
    }
});

$('#datepickerFin').datepicker({
    beforeShowDay: function(date) {
        var Highlight = SelectedDates[date];
        if (Highlight)
            return [true, "Highlighted", Highlight];
        else
            return [true, '', ''];
    },
    onSelect: function(date) {
        var fechaAux = dateConverter(date);
        $('#summayResults').empty();
        httpGetAsync("/API/result/SUMMARY/"+IDPaciente+"/"+dateConverter($('#datepickerInicio').val())+" 00:00:00/"+fechaAux+" 23:59:59",summaryResults);
    }
});

//CONTROLAR FECHA INICIO SEA MAYOR A FECHA FIN

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
        $('#results').empty();
        $( "#iconoCleanDay" ).attr("class","glyphicon glyphicon-chevron-down");
        //$('#configs').empty();
        httpGetAsync("/API/result/RESULTS/"+IDPaciente+"/"+fechaAux,resultsLoaded);
    }
});

httpGetAsync("/API/result/DATES/"+IDPaciente,dataLoaded);

/***************************************** Charts *************************************************/
function dataYearMonth(text) {
    var dateCant=[];
    var labels = ["Ene '", "Feb '", "Mar '", "Abr '", "May '", "Jun '", "Jul '", "Ago '", "Sep '", "Oct '", "Nov '", "Dic '"];
    var labelsAux =[];
    var backgroundColors = [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
            ];
    var colorsAux = [];
    var borderColors = [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
            ];
    var bordersAux = [];

    var json = text;
    var obj = JSON.parse(json);

    for (i = 0; i < obj.length; i++){
        var month = obj[i].Month;
        var year  = obj[i].Year;
        var cant = obj[i].cant;
        dateCant[i] = cant;
        labelsAux[i] = labels[month-1]+ year.substr(2, 2);
        colorsAux[i] = backgroundColors[i%6]; 
        bordersAux[i] = borderColors[i%6]; 
    }

var ctx = $("#partidasChart");
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labelsAux,
        datasets: [{
            label: 'Cantidad de partidas que jugó',
            data: dateCant,
            backgroundColor: colorsAux,
            borderColor: bordersAux,
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});
}

httpGetAsync("/API/result/CANTPARTIDAS/"+IDPaciente,dataYearMonth);

/*var lChart = document.getElementById("lChart");
var myLineChart = new Chart(lChart, {
    type: 'line',
    data: [20, 9, 3, 5, 2, 3,20, 9, 3, 5, 2, 3],
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});*/

/***************************************** Results *************************************************/
function summaryResults(text){
    var json = text;
    var obj = JSON.parse(json);
    excelData=[];

    for (i = 0; i < obj.length; i++){

        var ejercicio = obj[i].ejercicio;
        var cantItems = obj[i].cantItems;
        var cantClicks = obj[i].cantClicks;
        var cantAciertos = obj[i].aciertos; var auxCantAciertos = cantAciertos*100/obj[i].cantItems; 
        var cantErrores = cantClicks - cantAciertos;

        var totalPorCuadrante = obj[i].cantItems/4;
        var c1 = obj[i].c1; var auxC1 = c1*100/totalPorCuadrante;
        var c2 = obj[i].c2; var auxC2 = c2*100/totalPorCuadrante;
        var c3 = obj[i].c3; var auxC3 = c3*100/totalPorCuadrante;
        var c4 = obj[i].c4; var auxC4 = c4*100/totalPorCuadrante;

        var header= "<div class=\"row\"> <div class=\"col-md-12\"> <div class=\"panel panel-primary\"> <div class=\"panel-heading\"> <h3 class=\"panel-title\" id=\"tituloPanelResultados"+i+"-"+ejercicio+"\"></h3> </div>";                             
        var panel = "<div class=\"panel-body\" id=\"summaryPanel"+i+"-"+ejercicio+"\"> <div class=\"col-md-9\"> <table class=\"table\"> <tbody id=\"summaryTabla"+i+"-"+ejercicio+"\"> </tbody> </table> </div> </div> </div> </div> </div>";

        var tCantItems = "<tr> <td>Cantidad de items que aparecen</td> <td>"+cantItems+"</td> <td> </td> </tr>";
        var tCantClicks = "<tr> <td>Cantidad de clicks</td> <td>"+cantClicks+"</td> <td> </td> </tr>";
        var tCantAciertos = "<tr> <td>Cantidad de aciertos</td> <td>"+cantAciertos+"</td> <td>"+~~auxCantAciertos+"%</td> </tr>";
        var tCantErrores = "<tr> <td>Cantidad de errores (cant clicks - cant aciertos)</td> <td>"+cantErrores+"</td> <td> </td> </tr>";
        var tC1 = "<tr> <td>Aciertos cuadrante 1</td> <td>"+c1+"</td> <td>"+~~auxC1+"%</td> </tr>";
        var tC2 = "<tr> <td>Aciertos cuadrante 2</td> <td>"+c2+"</td> <td>"+~~auxC2+"%</td> </tr>";
        var tC3 = "<tr> <td>Aciertos cuadrante 3</td> <td>"+c3+"</td> <td>"+~~auxC3+"%</td> </tr>";
        var tC4 = "<tr> <td>Aciertos cuadrante 4</td> <td>"+c4+"</td> <td>"+~~auxC4+"%</td> </tr>";

        var diagramaCuadrantes = "<div class=\"col-md-3\"> <div class=\"col-md-1\"></div> <canvas id=\"summaryRectangleCanvas"+i+"-"+ejercicio+"\" width=\"210\" height=\"260\"></canvas> </div>";

        $('#summayResults').append(header+panel);
        $('#tituloPanelResultados'+i+"-"+ejercicio).html("Ejercicio n°"+ejercicio+ " (entre "+$('#datepickerInicio').val()+" y "+$('#datepickerFin').val()+")");
        $('#summaryTabla'+i+"-"+ejercicio).append(tCantItems+tCantClicks+tCantAciertos+tCantErrores+tC1+tC2+tC3+tC4);
        $('#summaryPanel'+i+"-"+ejercicio).append(diagramaCuadrantes);

        createSquare('summaryRectangleCanvas'+i+"-"+ejercicio,cantItems,c1,c2,c3,c4);

        excelData.push("Ejercicio n°"+ejercicio+ " (entre "+$('#datepickerInicio').val()+" y "+$('#datepickerFin').val()+")");
        excelData.push(cantItems);
        excelData.push(cantClicks);
        excelData.push(cantAciertos); excelData.push(~~auxCantAciertos+"%");
        excelData.push(cantErrores+"");
        excelData.push(c1); excelData.push(~~auxC1+"%");
        excelData.push(c2); excelData.push(~~auxC2+"%");
        excelData.push(c3); excelData.push(~~auxC3+"%");
        excelData.push(c4); excelData.push(~~auxC4+"%");
    }
}


function resultsLoaded(text){
    var json = text;
    var obj = JSON.parse(json);

    if (obj.length > 0)
    {
        $("#tituloDetalladoNoVisible").attr("id","tituloDetalladoVisible");
        $("#iconoCleanDay").attr("class","glyphicon glyphicon-chevron-up");
    }

    for (i = 0; i < obj.length; i++){
        var fecha = obj[i].fecha;
        var fechaInicio = obj[i].fechaInicio;

        var ejercicio = obj[i].ejercicio;
        var cantItems = obj[i].cantItems;
        var cantClicks = obj[i].cantClicks;
        var cantAciertos = obj[i].cantAciertos; var auxCantAciertos = cantAciertos*100/obj[i].cantItems; 
        var cantErrores = cantClicks - cantAciertos;

        var totalPorCuadrante = obj[i].cantItems/4;
        var c1 = obj[i].c1; var auxC1 = c1*100/totalPorCuadrante;
        var c2 = obj[i].c2; var auxC2 = c2*100/totalPorCuadrante;
        var c3 = obj[i].c3; var auxC3 = c3*100/totalPorCuadrante;
        var c4 = obj[i].c4; var auxC4 = c4*100/totalPorCuadrante;

        var header= "<div class=\"row\"> <div class=\"col-md-12\"> <div class=\"panel panel-primary\"> <div class=\"panel-heading\"> <h3 class=\"panel-title\">Resultado del ejercicio  n°"+ejercicio+" ("+fechaInicio+")</h3> </div>";                             
        var panel = "<div class=\"panel-body\" id=\"panel"+i+"-"+ejercicio+"\"> <div class=\"col-md-9\"> <table class=\"table\"> <tbody id=\"tabla"+i+"-"+ejercicio+"\"> </tbody> </table> </div> </div> </div> </div> </div>";

        var tHoraInicio = "<tr> <td>Hora de inicio</td> <td>"+fecha.substring(11,19)+"</td><td> </td></tr>";
        var tCantItems = "<tr> <td>Cantidad de items que aparecen</td> <td>"+cantItems+"</td> <td> </td> </tr>";
        var tCantClicks = "<tr> <td>Cantidad de clicks</td> <td>"+cantClicks+"</td> <td> </td> </tr>";
        var tCantAciertos = "<tr> <td>Cantidad de aciertos</td> <td>"+cantAciertos+"</td> <td>"+~~auxCantAciertos+"%</td> </tr>";
        var tCantErrores = "<tr> <td>Cantidad de errores (cant clicks - cant aciertos)</td> <td>"+cantErrores+"</td> <td> </td> </tr>";
        var tC1 = "<tr> <td>Aciertos cuadrante 1</td> <td>"+c1+"</td> <td>"+~~auxC1+"%</td> </tr>";
        var tC2 = "<tr> <td>Aciertos cuadrante 2</td> <td>"+c2+"</td> <td>"+~~auxC2+"%</td> </tr>";
        var tC3 = "<tr> <td>Aciertos cuadrante 3</td> <td>"+c3+"</td> <td>"+~~auxC3+"%</td> </tr>";
        var tC4 = "<tr> <td>Aciertos cuadrante 4</td> <td>"+c4+"</td> <td>"+~~auxC4+"%</td> </tr>";

        var diagramaCuadrantes = "<div class=\"col-md-3\"> <div class=\"col-md-1\"></div> <canvas id=\"rectangleCanvas"+i+"-"+ejercicio+"\" width=\"210\" height=\"260\"></canvas> </div>";

        $('#results').append(header+panel);
        $('#tabla'+i+"-"+ejercicio).append(tHoraInicio+tCantItems+tCantClicks+tCantAciertos+tCantErrores+tC1+tC2+tC3+tC4);
        $('#panel'+i+"-"+ejercicio).append(diagramaCuadrantes);

        createSquare('rectangleCanvas'+i+"-"+ejercicio,cantItems,c1,c2,c3,c4);
    }
}

/** Diagrama **/ 
var diagramsColors = [
            'rgba(255, 0, 0, 0.2)',
            'rgba(255, 43, 0, 0.2)',
            'rgba(255, 85, 0, 0.2)',
            'rgba(255, 128, 0, 0.2)',
            'rgba(255, 170, 0, 0.2)',
            'rgba(255, 213, 0, 0.2)',
            'rgba(255, 255, 0, 0.2)',
            'rgba(213, 255, 0, 0.2)',
            'rgba(170, 255, 0, 0.2)',
            'rgba(128, 255, 0, 0.2)',
            'rgba(85, 255, 0, 0.2)',
            'rgba(43, 255, 0, 0.2)',
            'rgba(0, 255, 0, 0.2)',
            'rgba(0, 255, 0, 0.2)'
            ];

function createSquare(elementName,cantItems,c1,c2,c3,c4) {
    var canvas = document.getElementById(elementName);
    var context = canvas.getContext('2d');

    var total = (parseInt(cantItems) - 1)/4;

    var auxC1 = Math.floor((c1*12)/total);
    context.beginPath();
    context.rect(1, 41, 100, 100);
    context.fillStyle = diagramsColors[auxC1];
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = 'rgba(0,0,0,0)';
    context.stroke();
    context.font="30px Verdana";
    context.fillText("1",40,100); 

    var auxC2 = Math.floor((c2*12)/total);
    context.beginPath();
    context.rect(104, 41, 100, 100);
    context.fillStyle = diagramsColors[auxC2];
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = 'rgba(0,0,0,0)';
    context.stroke();
    context.font="30px Verdana";
    context.fillText("2",144,100); 

    var auxC3 = Math.floor((c3*12)/total);
    context.beginPath();
    context.rect(1, 144, 100, 100);
    context.fillStyle = diagramsColors[auxC3];
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = 'rgba(0,0,0,0)';
    context.stroke();
    context.font="30px Verdana";
    context.fillText("3",40,204); 

    var auxC4 = Math.floor((c4*12)/total);
    context.beginPath();
    context.rect(104, 144, 100, 100);
    context.fillStyle = diagramsColors[auxC4];
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = 'rgba(0,0,0,0)';
    context.stroke();
    context.font="30px Verdana";
    context.fillText("4",144,204); 
}

/***************************************** Configs *************************************************/
/*function configsLoaded(text){
    var json = text;
    var obj = JSON.parse(json);

    var title = "<div class=\"example\"> <h2 class=\"example-title\"><span class=\"glyphicon glyphicon-cog\" aria-hidden=\"true\"></span> Configuraciones</h2> </div>";
    if (obj.length > 0)
        $('#configs').append(title);
    for (i = 0; i < obj.length; i++){
        var ejercicio = obj[i].ejercicio;
        var transparenciaCuadrante = obj[i].transparenciaCuadrante;
        var tipoFigura = obj[i].tipoFigura;
        var tamanioTarget = obj[i].tamanioTarget;
        var backgroundColor = obj[i].backgroundColor;
        var tiempoExposicion = obj[i].tiempoExposicion;
        var tiempoAparicion = obj[i].tiempoAparicion;
        var velocidadTrayectoriaTarget = obj[i].velocidadTrayectoriaTarget;
        var cantElementosDistractores = obj[i].cantElementosDistractores;
        var tamanioElementosDistractores = obj[i].tamanioElementosDistractores;
        var velocidadTrayectoriaElementosDistractores = obj[i].velocidadTrayectoriaElementosDistractores;
        var cantRepeticionFrase = obj[i].cantRepeticionFrase;
        var delayFrase = obj[i].delayFrase;
        var controlInhibitorioMotor = obj[i].controlInhibitorioMotor;
        var tiempoEjercicio = obj[i].tiempoEjercicio;
        
        var header= "<div class=\"row\"> <div class=\"col-md-12\"> <div class=\"panel panel-primary\"> <div class=\"panel-heading\"> <h3 class=\"panel-title\">Configuraciones del ejercicio n°"+ejercicio+"</h3> </div>";                             
        var panel = "<div class=\"panel-body\" id=\"panelC"+i+"-"+ejercicio+"\"> <div class=\"col-md-12\"> <table class=\"table\"> <tbody id=\"tablaC"+i+"-"+ejercicio+"\"> </tbody> </table> </div> </div> </div> </div> </div>";

        var tEjercicio = "<tr> <td>Ejercicio</td> <td>"+ejercicio+"</td></tr>";
        var tTransparenciaCuadrante = "<tr> <td>Visibilidad del cuadrante</td> <td>"+transparenciaCuadrante+"</td></tr>";
        /*var tCantItems = "<tr> <td>Cantidad de items que aparecen</td> <td>"+cantItems+"</td></tr>";
        var tCantClicks = "<tr> <td>Cantidad de clicks</td> <td>"+cantClicks+"</td></tr>";
        var tCantAciertos = "<tr> <td>Cantidad de aciertos</td> <td>"+cantAciertos+"</td></tr>";
        var tCantErrores = "<tr> <td>Cantidad de errores</td> <td>"+cantErrores+"</td></tr>";
        var tC1 = "<tr> <td>Aciertos cuadrante 1</td> <td>"+c1+"</td></tr>";
        var tC2 = "<tr> <td>Aciertos cuadrante 2</td> <td>"+c2+"</td></tr>";
        var tC3 = "<tr> <td>Aciertos cuadrante 3</td> <td>"+c3+"</td></tr>";
        var tC4 = "<tr> <td>Aciertos cuadrante 4</td> <td>"+c4+"</td></tr>";*/

        /*$('#configs').append(header+panel);
        $('#tablaC'+i+"-"+ejercicio).append(tEjercicio,tTransparenciaCuadrante);
    }
}*/

    /*var direction = window.location.toString();
    var arg = direction.split("&");
    //console.log(arg[1]);

    for (i = 1; i < arg.length; i++) {
        var fila = arg[i].split("=");
        var row = document.getElementById(fila[0]); 
        var cell = row.insertCell(1);
        cell.innerHTML = fila[1]; 
    }

                var val= data[i];
                key = key.toString();
                var row = document.getElementById(key); 
                if (key == "tipoFigura"){
                    if(val == "0")
                        val = "Simple";
                    if (val == "1")
                        val = "Abstracta";
                    if (val == "2")
                        val = "Concreta";
                }
                if (key == "tamanioTarget"){
                    if(val == "45")
                        val = "Pequeña";
                    if (val == "60")
                        val = "Chica";
                    if (val == "85")
                        val = "Intermedia";
                    if (val == "120")
                        val = "Grande";
                } 
                if (key == "tiempoAparicion"){
                    if(val == "15")
                        val = "Mínima";
                    if (val == "10")
                        val = "Media";
                    if (val == "5")
                        val = "Máxima";
                    if (val == "0")
                        val = "Nula";
                }
                if (key == "velocidadTrayectoriaTarget"){
                    if(val == "0")
                        val = "Nula";
                    if (val == "7")
                        val = "Lenta";
                    if (val == "4")
                        val = "Rápida";
                    if (val == "1")
                        val = "Muy Rápida";
                } 
                if (key == "tamanioElementosDistractores"){
                    if(val == "45")
                        val = "Pequeña";
                    if (val == "60")
                        val = "Chica";
                    if (val == "85")
                        val = "Intermedia";
                    if (val == "120")
                        val = "Grande";
                } 
                if (key == "velocidadTrayectoriaElementosDistractores"){
                    if(val == "0")
                        val = "Nula";
                    if (val == "8")
                        val = "Lenta";
                    if (val == "5")
                        val = "Rápida";
                    if (val == "2")
                        val = "Muy Rápida";
                }
    });*/

    $( "#cleanDay" ).click(function(event) {
        $( "#iconoCleanDay" ).attr("class","glyphicon glyphicon-chevron-down");
        $("#tituloDetalladoVisible").attr("id","tituloDetalladoNoVisible");
        $('#results').empty();
        $('#datepicker').val("");
    });


    var ep = new ExcelPlus();

    function allResultsLoaded(text){
        var json = text;
        var obj = JSON.parse(json);

        ep.createSheet("Resultados Detallados")
        .writeRow(1,["Apellido:",$("#apellido").html()])
        .writeRow(2,["Nombre:",$("#nombre").html()])
        .writeRow(3,["Email:",$("#email").html()])
        .writeRow(4,["Terapeuta:",$("#terapeuta").html()])
        .writeRow(5,["Fecha Inicio:",$("#fechaInicio").html()]);

        var rowCount = 7;
        for (i = 0; i < obj.length; i++){
            ep.writeRow(rowCount,["Ejercicio n°"+obj[i].ejercicio+" "+obj[i].fecha]);
            ep.writeRow(rowCount+1,["Cantidad de items que aparecen:",obj[i].cantItems]);
            ep.writeRow(rowCount+2,["Cantidad de clicks:",obj[i].cantClicks]);
            ep.writeRow(rowCount+3,["Cantidad de aciertos:",obj[i].cantAciertos]);
            ep.writeRow(rowCount+4,["Cantidad de errores (cant clicks - cant aciertos):",obj[i].cantClicks-obj[i].cantAciertos+""]);
            ep.writeRow(rowCount+5,["Aciertos cuadrante 1:",obj[i].c1]);
            ep.writeRow(rowCount+6,["Aciertos cuadrante 2:",obj[i].c2]);
            ep.writeRow(rowCount+7,["Aciertos cuadrante 3:",obj[i].c3]);
            ep.writeRow(rowCount+8,["Aciertos cuadrante 4:",obj[i].c4]);
            rowCount+=10;
        } 
        ep.saveAs($("#nombre").html()+$("#apellido").html()+".xlsx");
    }

    function createExcel() 
    {
        ep.createFile("Resultados Sumarizados")
        .writeRow(1,["Apellido:",$("#apellido").html()])
        .writeRow(2,["Nombre:",$("#nombre").html()])
        .writeRow(3,["Email:",$("#email").html()])
        .writeRow(4,["Terapeuta:",$("#terapeuta").html()])
        .writeRow(5,["Fecha Inicio:",$("#fechaInicio").html()]);

        var indexRow = 7;
        for (i = 0; i < excelData.length; i+=14){
            ep.writeRow(indexRow,[excelData[i]]);
            ep.writeRow(indexRow+1,["Cantidad de items que aparecen:",excelData[i+1]]);
            ep.writeRow(indexRow+2,["Cantidad de clicks:",excelData[i+2]]);
            ep.writeRow(indexRow+3,["Cantidad de aciertos:",excelData[i+3],excelData[i+4]]);
            ep.writeRow(indexRow+4,["Cantidad de errores (cant clicks - cant aciertos):",excelData[i+5]]);
            ep.writeRow(indexRow+5,["Aciertos cuadrante 1:",excelData[i+6],excelData[i+7]]);
            ep.writeRow(indexRow+6,["Aciertos cuadrante 2:",excelData[i+8],excelData[i+9]]);
            ep.writeRow(indexRow+7,["Aciertos cuadrante 3:",excelData[i+10],excelData[i+11]]);
            ep.writeRow(indexRow+8,["Aciertos cuadrante 4:",excelData[i+12],excelData[i+13]]);
            indexRow+=10;
        }

        httpGetAsync("/API/result/ALLRESULTS/"+IDPaciente,allResultsLoaded);  
    }

    $( "#botonPDF" ).click(function(event) {
        HTMLtoPDF();
    });

    $( "#botonEXCEL" ).click(function(event) {
        createExcel();
    });
});