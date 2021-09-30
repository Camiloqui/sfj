/*------------------
	OBJETO COLA
-------------------*/
//constructor
function cola(){
	this.raiz = null;
	this.fondo = null;
	this.insertarPrimero = insertarNodoP;
	this.insertarUltimo = insertarNodoU;
	this.extraerPrimero = extraerNodoP;
	this.extraerUltimo = extraerNodoU;
	this.ordenarQuantum = ordenarQ;
	this.vacia = vacia;
}

//inserta un nodo en la cola de primero
function insertarNodoP(proceso, tiempo, quantum, recurso, estado){
	var nuevo = new nodo();
	nuevo.proceso = proceso;
	nuevo.tiempo = tiempo;
	nuevo.quantum = quantum;
	nuevo.recurso = recurso;
	nuevo.estado = estado;
	nuevo.sig = null;

	if(this.vacia()){
		this.raiz = nuevo;
        this.fondo = nuevo;
	}else{
		this.raiz = nuevo;
		this.raiz.sig = this.fondo;
		this.fondo = this.raiz;
	}
}

//inserta un nodo en la cola de ultimo
function insertarNodoU(proceso, tiempo, quantum, recurso, estado){
	var nuevo = new nodo();
	var colaTemp = new cola();
	nuevo.proceso = proceso;
	nuevo.tiempo = tiempo;
	nuevo.quantum = quantum;
	nuevo.recurso = recurso;
	nuevo.estado = estado;
	nuevo.sig = null;

	if(this.vacia()){
		this.raiz = nuevo;
        this.fondo = nuevo;
	}else{
		while(!this.vacia()){	
			var temp = new nodo();		
			temp = this.extraerPrimero();
			colaTemp.insertarPrimero(temp.proceso, temp.tiempo, temp.quantum, temp.recurso, temp.estado); 		
		}
		this.insertarPrimero(proceso, tiempo, quantum, recurso, estado);		
		while(!colaTemp.vacia()){
			var temp = new nodo();		
			temp = colaTemp.extraerPrimero();
			this.insertarPrimero(temp.proceso, temp.tiempo, temp.quantum, temp.recurso, temp.estado); 	
		}
	}
}

//retorna el primer nodo de la cola
function extraerNodoP(){
	var nuevo = this.raiz;
	if(!this.vacia()){
		this.raiz = this.raiz.sig;
	}
	return nuevo;
}

//retorna el ultimo nodo de la cola
function extraerNodoU(){
	var nuevo = new nodo();
	var colaTemp = new cola();
	while(this.raiz.sig!=null){	
		var temp = new nodo();		
		temp = this.extraerPrimero();
		colaTemp.insertarPrimero(temp.proceso, temp.tiempo, temp.quantum, temp.recurso, temp.estado); 		
	}
	nuevo = this.extraerPrimero();		
	while(!colaTemp.vacia()){
		var temp = new nodo();		
		temp = colaTemp.extraerPrimero();
		this.insertarPrimero(temp.proceso, temp.tiempo, temp.quantum, temp.recurso, temp,estado); 	
	}
	return nuevo;
}

//devuelva true si la cola esta vacia
function vacia(){
	if (this.raiz == null) {
        return true;
    } else {
        return false;
    }
}

function ordenarQ(tamañoCola){

	var i;
	var temp = new nodo();
	var temp2 = new nodo(); 	
	var colaTemp = new cola();
	var colaTemp2 = new cola();

	
	for (i = 1; i < tamañoCola; i++){
		//alert();

		if(this.raiz.sig != null){
			while(!this.vacia()){
				temp = this.extraerPrimero();
				if (!this.vacia()){
					temp2 = this.extraerPrimero();
					if (temp2.tiempo > temp.tiempo){
						colaTemp.insertarPrimero(temp.proceso, temp.tiempo, temp.quantum, temp.recurso, temp.estado);
						colaTemp2.insertarPrimero(temp2.proceso, temp2.tiempo, temp2.quantum, temp2.recurso, temp2.estado);						
						while(!this.vacia()){
							var temp5 = new nodo();		
							temp5 = this.extraerPrimero();
						colaTemp2.insertarPrimero(temp5.proceso, temp5.tiempo, temp5.quantum, temp5.recurso, temp5.estado); 	
						}
						while(!colaTemp2.vacia()){
							var temp6 = new nodo();		
							temp6 = colaTemp2.extraerPrimero();
						this.insertarPrimero(temp6.proceso, temp6.tiempo, temp6.quantum, temp6.recurso, temp6.estado); 	
						}
					}else{
						colaTemp.insertarPrimero(temp2.proceso, temp2.tiempo, temp2.quantum, temp2.recurso, temp2.estado);
						colaTemp2.insertarPrimero(temp.proceso, temp.tiempo, temp.quantum, temp.recurso, temp.estado);						
						while(!this.vacia()){
							var temp5 = new nodo();		
							temp5 = this.extraerPrimero();
						colaTemp2.insertarPrimero(temp5.proceso, temp5.tiempo, temp5.quantum, temp5.recurso, temp5.estado); 	
						}
						while(!colaTemp2.vacia()){
							var temp6 = new nodo();		
							temp6 = colaTemp2.extraerPrimero();
						this.insertarPrimero(temp6.proceso, temp6.tiempo, temp6.quantum, temp6.recurso, temp6.estado); 	
						}	
					}
				}else{
					colaTemp.insertarPrimero(temp.proceso, temp.tiempo, temp.quantum, temp.recurso, temp.estado); 
				}
			}

			while(!colaTemp.vacia()){
				var temp = new nodo();		
				temp = colaTemp.extraerPrimero();
				this.insertarPrimero(temp.proceso, temp.tiempo, temp.quantum, temp.recurso, temp.estado); 	
			}
		}
	}
	//alert();
	
}