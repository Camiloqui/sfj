var procesador1 = new Procesador();
var p1 = 0;
var hilo1;

$(document).ready(function() {

    procesador1.CalcularRendimiento();
    $("#vrendimiento1").html(dibujarRendiminetos(procesador1.rendimientoProcesos));

    preestablecer();  

    function crear() {
        var nombre = $("#nombre1").val();
        var tiempo = $("#tiempo1").val();
        var form = document.querySelector("form");
        var data = new FormData(form)
        var output = "";
  for (const entry of data) {
    output = output + entry[1];
  };
        var prioridad ;
        var prioridadTemp = output;
    
        var prioridad;
        if (prioridadTemp == "RoundRobin"){
            prioridad = 1;
        } else if (prioridadTemp == "SJF") {
            prioridad = 2;
        } else {
            prioridad = 3;
        }
        var tini = procesador1.cronometro+1;
        var disponible = 1;
        var proceso = new Proceso(p1, nombre, tiempo, tini, disponible, prioridad);
        procesador1.CrearProceso(proceso);
        p1++;
        preestablecer();
        $("#listos1").html(dibujarCola(procesador1.listos)); 
    }

    $("#crear").click(function() {
        crear();
    });


    $("#crear1").click(function() {
        crear();
        crear();
        crear();
    });
-
    $("#ejecutar1").click(function() {
        $("#ejecutar1").attr("disabled", true);
        $("#interrumpir1").attr("disabled", false);
        hilo1 = setInterval(function() {
            procesador1.CorrerProcesador(disponibles);
            $("#listos1").html(dibujarCola(procesador1.listos));
            $("#bloqueados1").html(dibujarCola(procesador1.bloqueados));
            $("#suspendidos1").html(dibujarCola(procesador1.suspendidos));
            $("#terminados1").html(dibujarCola(procesador1.terminados));
            $("#SeccionCritica").html(dibujarCola(procesador1.CPU));
            $("#cronometro1").text(procesador1.cronometro);

            $("#dGantt1").html("");
            pintarGantt(procesador1.estados, "#dGantt1");

            procesador1.CalcularRendimiento();
            $("#vrendimiento1").html(dibujarRendiminetos(procesador1.rendimientoProcesos));

        }, 1000);
        //setTimeout(crear, 5000);
        //setTimeout(crear, 8000);
        //setTimeout(crear, 12000);
        //setTimeout(crear, 17000);
    });

    $("#interrumpir1").click(function() {
        $("#interrumpir1").attr("disabled", true);
        $("#ejecutar1").attr("disabled", false);
        procesador1.DetenerProcesador(disponibles);
        clearInterval(hilo1);
        $("#listos1").html(dibujarCola(procesador1.listos));
        $("#bloqueados1").html(dibujarCola(procesador1.bloqueados));
        $("#suspendidos1").html(dibujarCola(procesador1.suspendidos));
        $("#terminados1").html(dibujarCola(procesador1.terminados));
    });


});


function preestablecer() {
    $("#nombre1").val("P" + p1);
    $("#tiempo1").val(Math.floor((Math.random() * 10) + 1));
    //$("#Prioridad").val(Math.floor((Math.random() * 4) + 1));
}

function dibujarCola(cola) {
    var colaAux = new Cola();
    var textoCola = "";
    var procesoAux;
    while (!cola.Listavacia()) {
        procesoAux = cola.Listaatender();
        textoCola += dibujarProceso(procesoAux);
        colaAux.Listainsertar(procesoAux);
    }
    while (!colaAux.Listavacia()) {
        procesoAux = colaAux.Listaatender();
        cola.Listainsertar(procesoAux);
    }
    return textoCola;
}

function dibujarProceso(proceso) {
    var procesoAux = "<tr>";
    procesoAux += "<td>" + proceso.nombre + "</td>";
    procesoAux += "<td>" + "T.Rafaga:" + proceso.tiempo + "</td>";
    procesoAux += "<td>" + "Metodo:" ;
    if(proceso.prioridad==1){
        procesoAux +=  "Round Robin" + "</td>";
    }else if(proceso.prioridad==2){
        procesoAux +=  "SJF" + "</td>";
    }else{
        procesoAux +=  "FCFS" + "</td>";
    }
    procesoAux += "</tr>";
    return procesoAux;
}


function dibujarRendiminetos(procesos) {
    var texto = "<tr><td>Nombre</td><td>Metodo</td><td>Tiempo Llegada</td><td>Tiempo Rafaga</td><td>Tiempo Comienzo</td><td>Tiempo Finalizacion</td><td>Tiempo Retorno</td><td>Tiempo Espera</td></tr>";
    for (var i = 0; i < procesos.length; i++) {
        texto += "<tr><td>P" + i + "</td>"+"<td>";
        if(procesos[i][0]==1){
            texto += "Round Robin";
        }else if(procesos[i][0]==2){
            texto += "SJF";
        }else if(procesos[i][0]==3){
            texto += "FCFS";
        }
        for (var j = 1; j < 7; j++) {  
            texto +=  "</td>"+"<td>" + procesos[i][j] + "</td>";
        }
        texto += "</tr>";
    }
    return texto;
}
