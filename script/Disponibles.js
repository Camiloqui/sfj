
function Recurso(estado){
    
	this.estado = estado;
	this.OcuparRecurso = ocuparRecurso;
	this.LiberarRecurso = liberarRecurso;
}

function ocuparRecurso(){
	this.estado = 0;
}
function liberarRecurso(){
	this.estado = 1;
}

disponibles = new Recurso(1);

