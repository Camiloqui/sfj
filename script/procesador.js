
function Procesador() {

    this.cronometro = -1;
    this.CPU = new Cola();
    this.listos = new Cola();
    this.bloqueados = new Cola();
    this.terminados = new Cola();
    this.suspendidos = new Cola();
    this.estados = [];
    this.rendimientoProcesos = [];
    this.prioridadNuevo;

    this.CrearProceso = crearProceso;
    this.CorrerProcesador = correrProcesador;
    this.DetenerProcesador = detenerProcesador;
    this.GuardarEstadosProcesos = guardarEstadosProcesos;
    this.CalcularRendimiento = calcularrendimiento;
    this.BuscarEnTerminados = buscarEnTerminados;
}

function crearProceso(proceso) {
    if (proceso.prioridad == 2) {
        proceso.enve = 11;
    }
    if (proceso.prioridad == 3) {
        proceso.enve = 8;
    }
    if (proceso.prioridad == 4) {
        proceso.enve = 5;
    }
    this.listos.ListaOrdenar(proceso);
    this.estados[proceso.id] = [];
}

function correrProcesador(disponibilidad) {
    this.cronometro++;

    this.prioridadNuevo = this.listos.PrioridadRaiz();

    if (!this.suspendidos.Listavacia()) {
        var colaAux = new Cola();
        var procesoAux;
        while (!this.suspendidos.Listavacia()) {
            procesoAux = this.suspendidos.Listaatender();
            procesoAux.tRestante--;
            if (procesoAux.tRestante == 0) {
                this.listos.ListaOrdenar(procesoAux);
            }
            else {
                colaAux.Listainsertar(procesoAux);
            }
        }
        while (!colaAux.Listavacia()) {
            procesoAux = colaAux.Listaatender();
            this.suspendidos.Listainsertar(procesoAux);
        }
    }

    if (!this.bloqueados.Listavacia()) {
        var colaAux = new Cola();
        var procesoAux;
        while (!this.bloqueados.Listavacia()) {
            procesoAux = this.bloqueados.Listaatender();
            procesoAux.tRestante--;
            if (procesoAux.tRestante == 0) {
                this.listos.ListaOrdenar(procesoAux);
            }
            else {
                colaAux.Listainsertar(procesoAux);
            }
        }
        while (!colaAux.Listavacia()) {
            procesoAux = colaAux.Listaatender();
            this.bloqueados.Listainsertar(procesoAux);
        }
    }


    if (!this.CPU.Listavacia()) {
        var procesoAux = this.CPU.Listaatender();
        //comparacion de prioridades
        if (this.prioridadNuevo < procesoAux.prioridad) {
            procesoAux.tRestante = 1;
            this.suspendidos.Listainsertar(procesoAux);
            disponibilidad.estado = 1;
            this.prioridadNuevo = 100;
        } else {
            procesoAux.tiempo--;
            if (procesoAux.tiempo == 0) {
                disponibilidad.estado = 1;
                this.terminados.Listainsertar(procesoAux);
            }
            else {
                this.CPU.Listainsertar(procesoAux);
            }
        }
    }

    if (!this.listos.Listavacia()) {
        while (this.CPU.Listavacia() && !this.listos.Listavacia()) {
            var procesoAux = this.listos.Listaatender();
            if (disponibilidad.estado == 1) {
                this.CPU.Listainsertar(procesoAux);
                disponibilidad.estado = 0;
            }
        }
        //this.listos.Envejecer();
    }
    this.GuardarEstadosProcesos();
}

function detenerProcesador(disponibilidad) {
    if (!this.CPU.Listavacia()) {
        var procesoAux = this.CPU.Listaatender();
        procesoAux.tRestante = 2;
        this.bloqueados.Listainsertar(procesoAux);
        disponibilidad.estado = 1;
    }
}



function guardarEstadosProcesos() {

    var procesoAux;
    var contadorAux;
    var colaAux = new Cola();
    while (!this.listos.Listavacia()) {
        procesoAux = this.listos.Listaatender();
        contadorAux = this.estados[procesoAux.id].length;
        this.estados[procesoAux.id][contadorAux] = [this.cronometro, "L"];
        colaAux.Listainsertar(procesoAux);
    }
    while (!colaAux.Listavacia()) {
        procesoAux = colaAux.Listaatender();
        this.listos.Listainsertar(procesoAux);
    }

    while (!this.CPU.Listavacia()) {
        procesoAux = this.CPU.Listaatender();
        contadorAux = this.estados[procesoAux.id].length;
        this.estados[procesoAux.id][contadorAux] = [this.cronometro, "E"];
        colaAux.Listainsertar(procesoAux);

    }
    while (!colaAux.Listavacia()) {
        procesoAux = colaAux.Listaatender();
        this.CPU.Listainsertar(procesoAux);
    }

    while (!this.bloqueados.Listavacia()) {
        procesoAux = this.bloqueados.Listaatender();
        contadorAux = this.estados[procesoAux.id].length;
        this.estados[procesoAux.id][contadorAux] = [this.cronometro, "S"];
        colaAux.Listainsertar(procesoAux);
    }
    while (!colaAux.Listavacia()) {
        procesoAux = colaAux.Listaatender();
        this.bloqueados.Listainsertar(procesoAux);
    }


    while (!this.suspendidos.Listavacia()) {
        procesoAux = this.suspendidos.Listaatender();
        contadorAux = this.estados[procesoAux.id].length;
        this.estados[procesoAux.id][contadorAux] = [this.cronometro, "B"];
        colaAux.Listainsertar(procesoAux);
    }
    while (!colaAux.Listavacia()) {
        procesoAux = colaAux.Listaatender();
        this.suspendidos.Listainsertar(procesoAux);
    }
}

function calcularrendimiento() {
    if (this.cronometro > 0) {

        var tiempoLlegadaAnterior;
        var tiempoLlegada;
        var tiempoRafaga;
        var tiempoComienzo;
        var tiempoFinalizacion;
        var tiempoRetorno;
        var tiempoEspera;


        for (var i = 0; i < this.estados.length; i++) {
            var procesoAux = this.BuscarEnTerminados(i);
            if (procesoAux) {
                if (i > 0) {
                    tiempoLlegada = procesoAux.ini;
                } else {
                    tiempoLlegada = procesoAux.ini;
                    tiempoLlegadaAnterior = tiempoLlegada;
                }
                tiempoRafaga = procesoAux.t;
                if (tiempoLlegada == 0) {
                    tiempoFinalizacion = this.estados[i].length;
                }
                else {
                    tiempoFinalizacion = parseInt(this.estados[i - 1].length) + parseInt(tiempoRafaga) + parseInt(tiempoLlegadaAnterior);
                    tiempoLlegadaAnterior = tiempoLlegada;
                }
                tiempoRetorno = tiempoFinalizacion - tiempoLlegada;
                tiempoEspera = tiempoRetorno - tiempoRafaga;
                tiempoComienzo = tiempoEspera + tiempoLlegada;
                this.rendimientoProcesos[i] = [procesoAux.prioridad, tiempoLlegada, tiempoRafaga, tiempoComienzo, tiempoFinalizacion, tiempoRetorno, tiempoEspera];
            }
            else {
                this.rendimientoProcesos[i] = "------";
            }
        }

    }
}

function buscarEnTerminados(id) {
    var colaAux = new Cola();
    var procesoAux;
    var proceso = false
    while (!this.terminados.Listavacia()) {
        procesoAux = this.terminados.Listaatender();
        if (procesoAux.id == id) {
            proceso = new Proceso(procesoAux.id, procesoAux.nombre, procesoAux.t, procesoAux.ini, procesoAux.recurso, procesoAux.prioridad);
        }
        colaAux.Listainsertar(procesoAux);
    }
    while (!colaAux.Listavacia()) {
        procesoAux = colaAux.Listaatender();
        this.terminados.Listainsertar(procesoAux);
    }
    return proceso;
}

