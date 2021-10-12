
function Cola() {

    this.nodoRaiz = null;
    this.nodoFondo = null;
    this.tam = 0;

    this.Listavacia = vacia;
    this.Listainsertar = insertar;
    this.Listaatender = atender;
    this.ListagetRaiz = getRaiz;
    this.ListagetTam = getTam;
    this.ListaOrdenar = ordenar;
    this.Envejecer = envejecer;
    this.ReducirPrioridad = reducirprioridad;
    this.PrioridadRaiz = prioridadraiz;
}

function ordenar(proceso) {
    if (this.nodoRaiz == null) {
        this.Listainsertar(proceso);
    } else {
        var colaAux = new Cola();
        var procesoAux;
        if (proceso.prioridad == 2) {
            while (!this.Listavacia()) {
                procesoAux = this.Listaatender();
                if (parseInt(proceso.prioridad) < parseInt(procesoAux.prioridad)) {
                    colaAux.Listainsertar(proceso);
                    colaAux.Listainsertar(procesoAux);
                    break;
                } else if (proceso.prioridad == procesoAux.prioridad){ //Si comparten prioridad SJF, comparan tiempos
                    if (parseInt(proceso.tiempo) < parseInt(procesoAux.tiempo)) {
                        colaAux.Listainsertar(proceso);
                        colaAux.Listainsertar(procesoAux);
                        break;
                    } else {
                        colaAux.Listainsertar(procesoAux);
                    }
                } else {
                    colaAux.Listainsertar(procesoAux);
                    if (this.Listavacia()){
                        colaAux.Listainsertar(proceso);
                    }
                }
            }

            while (!this.Listavacia()) {
                procesoAux = this.Listaatender();
                colaAux.Listainsertar(procesoAux);
            }
            while (!colaAux.Listavacia()) {
                procesoAux = colaAux.Listaatender();
                this.Listainsertar(procesoAux);
            }
        } else {
            if (parseInt(proceso.prioridad) >= parseInt(this.nodoFondo.proceso.prioridad)) {
                this.Listainsertar(proceso);
            } else {
                while (!this.Listavacia()) {
                    procesoAux = this.Listaatender();
                    if (parseInt(proceso.prioridad) < parseInt(procesoAux.prioridad)) {
                        colaAux.Listainsertar(proceso);
                        colaAux.Listainsertar(procesoAux);
                        break;
                    } else {
                        colaAux.Listainsertar(procesoAux);
                    }
                }
            }

            while (!this.Listavacia()) {
                procesoAux = this.Listaatender();
                colaAux.Listainsertar(procesoAux);
            }
            while (!colaAux.Listavacia()) {
                procesoAux = colaAux.Listaatender();
                this.Listainsertar(procesoAux);
            }
        }
        this.tam++;
    }
}

function vacia() {
    if (this.nodoRaiz == null) {
        return true;
    } else {
        return false;
    }
}

function insertar(proceso) {
    var nuevo = new Nodo();

    nuevo.proceso = proceso;
    nuevo.sig = null;

    if (this.nodoRaiz == null) {
        this.nodoRaiz = nuevo;
        this.nodoFondo = nuevo;
    } else {
        this.nodoFondo.sig = nuevo;
        this.nodoFondo = nuevo;
    }
    this.tam++;
}

function reducirprioridad(Aux) {
    if (Aux.proceso.prioridad != 1) {
        if (Aux.proceso.enve > 0) {
            Aux.proceso.enve--;
        } else {
            Aux.proceso.prioridad--;
            if (Aux.proceso.prioridad == 2) {
                Aux.proceso.enve = 12;
            }
            if (Aux.proceso.prioridad == 3) {
                Aux.proceso.enve = 9;
            }
            if (Aux.proceso.prioridad == 4) {
                Aux.proceso.enve = 6;
            }
        }
    }
}

function envejecer() {
    var Aux = new Nodo();
    if (this.nodoRaiz == null) {
    } else {
        Aux = this.nodoRaiz;
        while (Aux.sig != null) {
            this.ReducirPrioridad(Aux);
            Aux = Aux.sig;
        }
        Aux = this.nodoFondo;
        this.ReducirPrioridad(Aux);
    }
}


function atender() {
    if (!this.Listavacia()) {
        var aux = this.nodoRaiz;
        if (this.nodoRaiz == this.nodoFondo) {
            this.nodoRaiz = null;
            this.nodoFondo = null;
        } else {
            this.nodoRaiz = this.nodoRaiz.sig;
        }
        return aux.proceso;
    } else {
        return 0;
    }
}

function getRaiz() {
    var aux = new Nodo();
    aux = this.nodoRaiz;
    return aux;
}

function prioridadraiz() {
    if (this.nodoRaiz == null) {
    } else {
        return this.nodoRaiz.proceso.prioridad;
    }
}

function getTam() {
    return this.tam;
}

