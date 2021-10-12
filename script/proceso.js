function Proceso(id, nombre, tiempo, ini, disponible, prioridad){
	this.id = id;
	this.nombre = nombre;
	this.tiempo = tiempo;
    this.q = 4;
	this.qcont = 4;
	this.tRestante;
	this.recurso = disponible;
	this.t = tiempo;
        this.ini = ini;
        this.prioridad = prioridad;
        this.enve;
}