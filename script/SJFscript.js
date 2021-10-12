
var ColaLis;
var ColaBloq;
var ColaSus;
var ColaTer;
var CantidadProcesos;
var bloqueado;
var sumaTiempos;
var estadosArr;
var gant, canvas, ctx;

var cpt = 0;
var ct = 0;
var stt = 0;
var metricaTotal = 0;

var Proceso1;
var Proceso2;
var Proceso3;
var Proceso4;

var Disp;
var Procesos;
var pausar =false;

var terminado1 = false;
//Timer de los procesadores
var timer = 100;

var vmetricaUno;
var vTUno;
var vEUno;
var cpUno;

var blablaUno;
var blablaGen;

$(document).ready(function(){	
		
	canvas=document.getElementById("gant");
	
	ctx=canvas.getContext("2d");
	
	bloqueado = false;

	CantidadProcesos = Math.floor((Math.random()*8)+2);//Aleatorio entre 2 y 5	
	
	$("#gant").attr("height", 23*CantidadProcesos);
	
	ColaLis = new cola();	
	ColaBloq = new cola();
	ColaSus = new cola();
	ColaTer = new cola();
		
	Proceso1 = new Proceso("Proceso1",0);
	Proceso2 = new Proceso("Proceso2",0);
 	Proceso3 = new Proceso("Proceso3",0);
 	Proceso4 = new Proceso("Proceso4",0);
    Disp = new Array();
 	Disp.push(Proceso1);
 	Disp.push(Proceso2);
 	Disp.push(Proceso3);
 	Disp.push(Proceso4);	
	
	LlenarCola(CantidadProcesos);
	ColaLis.ordenarQuantum(CantidadProcesos);
	DiagramarCola(0);
	
	Crearbloqueo();	
	recursos();	
	
	SJF();	
	

  $('#btn_proceso1').on("click",agregarProceso);

  $('#btnP1').on('click',function(){
  	var valor= $('#selectPausar').val();
  	pausar=!pausar;
  })	
});

function recursos(){
	for (var i = 0; i < Disp.length; i++) {
		$('#sel').append('<option value="'+Disp[i].nombre+'">'+Disp[i].nombre+'</option>');
	}
}
	
		
function agregarProceso(){
	var T;

	for (var i = 0; i < Disp.length; i++) {
		if(Disp[i].nombre=="Proceso1")break;
		
	}

	if($('#t1').val() != "" && $('#t1').val()>0){
		
		T = $('#t1').val();
	}else{ T=Math.floor((Math.random()*10)+1);}


   
	var ID = Procesos+1;
		
		sumaTiempos+=T;
		var Q = 0;
    if(T<=3){Q=T}
    if(T>=4 && T<=6){Q = T*0.8}
    if(T>7){Q = T*0.6 }
		var R = Disp[i];
		var E = "Nuevo";
		estadosArr[Procesos] = E;
	ColaLis.insertarUltimo(ID,T,Q,R,E);	
	Procesos=Procesos+1;	
	CantidadProcesos= CantidadProcesos+1;
	Crearbloqueo();
	canvas.width =canvas.width;
	canvas.height=canvas.height+20;
	ColaLis.ordenarQuantum(CantidadProcesos);
	DiagramarCola(0);
}

function agregarRecurso(recurso){
 var text = "";
 for (var i = 0; i < recurso.length; i++) {
  if(recurso[i].estado == 0){
			text += '<span class="recInactivo">'+recurso[i].nombre +" - INACTIVO"+"</span>"+"<br>" ;
		}
		else{
			text += '<span class="recActivo">'+recurso[i].nombre +" - ACTIVO"+"</span>"+"<br>" ;
		}
		$("#recursos").html("<p>" + text + "<br></p>");
 } 
}

function Proceso(nombre,estado){
   this.nombre= nombre;
   this.estado = estado;
}

function LlenarCola(procesos){
	estadosArr = new Array(CantidadProcesos);
	for(i=0;i<procesos;i++){
		sumaTiempos=0;
		var ID = i+1;
		var T = Math.floor((Math.random()*10)+1);
		sumaTiempos+=T;
		var Q = 0;
        if(T<=3){Q=T}
        if(T>=4 && T<=6){Q = T*0.8}
        if(T>7){Q = T*0.6 }
		var R = Disp[Math.floor(Math.random()*Disp.length)]; //Recurso del proceso
		var E = "Nuevo";
		estadosArr[i] = E;

		ColaLis.insertarUltimo(ID,T,Q,R,E);		
	}
	Procesos =i;
	DiagramarCola(0);
}


function Crearbloqueo(){
	gant = new Array(CantidadProcesos);
	for(i=0;i<CantidadProcesos;i++){
		gant[i]=[];
		for(j=0;j<CantidadProcesos;j++){
			gant[i].push(i);
		}
	}
	console.log(gant);
}

function SJF(){
	var Tiempo0 = true;
	var TiempoT = true;
	var nodo;
	var TiempoSuspendido = Math.floor((Math.random()*3)+3);
	var TiempoBloqueado = Math.floor((Math.random()*3)+3);	
	var nAtendidos=0;
	var clock=0;

	var hilo=setInterval(function(){
		if (pausar==false) {
			agregarRecurso(Disp);
			$("#reloj").html("Sección Crítica: "+(clock*10)+" ticks");
			clock= Math.round((clock+0.1)*10)/10;

			if(Tiempo0){
				if(!ColaLis.vacia()){
					nodo = ColaLis.extraerPrimero();

					if (recursoBloq(nodo)){						
						DiagramarCola(0);										
						TransicionDibujo(nodo, 1);		
						nodo.estado = "Critico";
						estadosArr[nodo.proceso-1]= nodo.estado;
						bloquearRecurso(nodo);
						mensaje(nodo, 0);
						DiagramarProceso(nodo);		
						Tiempo0=false;
						TiempoT=true;
					}else{
						nodo.quantum = Math.floor((Math.random()*3)+6);
						nodo.estado = "Bloqueado";
						estadosArr[nodo.proceso-1]= nodo.estado;
						//LiberarRec(nodo);
			            mensaje(nodo, 1);
			            ColaBloq.insertarUltimo(nodo.proceso, nodo.tiempo, nodo.quantum, nodo.recurso, nodo.estado, nodo.prioridad);
			            DiagramarProceso(null);
			            DiagramarCola(1);
			            DiagramarCola(0);
			            TiempoT=false;
			            Tiempo0=true;
					}	
				}
			}

			if(TiempoT){
				if(nodo.tiempo>0){			
				 	nodo.quantum = Math.round((nodo.quantum-0.1)*10)/10;
				 	nodo.tiempo =Math.round((nodo.tiempo-0.1)*10)/10;
				 	DiagramarProceso(nodo);
				 	DiagramarGant(nodo.proceso-1);		
				}else{
					nodo.estado = "Terminado";
					estadosArr[nodo.proceso-1]= nodo.estado;
					ColaTer.insertarUltimo(nodo.proceso, nodo.tiempo, nodo.quantum, nodo.recurso, nodo.estado, nodo.prioridad);
					LiberarRec(nodo);
					mensaje(nodo, 1);
					DiagramarProceso(null);
					DiagramarCola(3);
					TiempoT=false;
					Tiempo0=true;
					nAtendidos++;
				}
			}

			if(!ColaBloq.vacia()){
				var temp = ColaBloq.extraerPrimero();

				if (!TiempoT && ColaLis.vacia()){
					DiagramarGant(temp.proceso-1);
				}

				if(recursoBloq(temp)){	
					ColaLis.insertarUltimo(temp.proceso, temp.tiempo, temp.tiempo,temp.recurso, "Listo", temp.prioridad);
					ColaLis.ordenarQuantum(CantidadProcesos);
					estadosArr[temp.proceso-1]= "Listo";
					DiagramarCola(0);
					DiagramarCola(1);				
				}else {
					ColaBloq.insertarUltimo(temp.proceso, temp.tiempo, temp.tiempo,temp.recurso, "Bloqueado", temp.prioridad);
					estadosArr[temp.proceso-1]= "Bloqueado";
					ColaBloq.ordenarQuantum(CantidadProcesos);
				}
			}

			if(nAtendidos == CantidadProcesos){
				$("#mensaje").html("Todos los procesos han sido atendidos.");
				clearInterval(hilo);
				ct += clock;
				cpt += CantidadProcesos;
				stt += sumaTiempos;

				calcularMetrica1(CantidadProcesos,clock, sumaTiempos);
			}	
		}
	},timer);//<---VELOCIDAD DEL HILO EN MS
}

function DiagramarCola(i){
	var text = "";
	var textoCola="";
	var F=function(){} ; 	
	var nodo;
	switch(i){
		case 0:textoCola="#listos";F.prototype = ColaLis;break;
		case 1:textoCola="#bloqueados";F.prototype = ColaBloq;break;
		case 2:textoCola="#suspendidos";F.prototype = ColaSus;break;
		case 3:textoCola="#terminados";F.prototype = ColaTer;break;
	}
	var cola = new F();
	text +="<ul class='lista'>";
	while(!cola.vacia()){
		nodo = cola.extraerPrimero();
		text +="<li><p>Proceso:"+nodo.proceso+ "  Rafaga:"+ (nodo.tiempo*10) + "</p></li>";
	}	
	text +="</ul>";
	$(textoCola).html(text);
}

function TransicionDibujo(nodo, n){
	$("#anim").html("proceso "+ nodo.proceso);	
	if(n==1){
		var w = $(window).width();
		var h = $(window).height();
		var w1= (w*0.41)+"px";
		$("#proceso").animate({opacity:'0'},400);
		$("#anim").animate({opacity:'1'},0);
		$("#anim").offset({ top: h*0.4, left: w*0.1 });
		$("#anim").animate({left:w1, top:'140px', width:'260px'},300);	
		$("#anim").animate({opacity:'0'},200);
		$("#proceso").animate({opacity:'1'},0);
	}	
}

function DiagramarProceso(nodo){
	var text = "";
	if(nodo!=null){
		text +="<p>Proceso: "+nodo.proceso;
		text +="<p>Tiempo de Ejecución: "+(nodo.tiempo*10);
	}else{
		$("#proceso").animate({opacity:'0'},100);
	}
	$("#proceso").html(text);
}

function bloqueo(n){
	var bloqueo = Math.floor((Math.random()*100)+1);
	var b=false;	
	if(bloqueo<=n){
		b=true;
	}
	return b;
}

function DiagramarGant(n){	
	ctx.fillStyle="#1C0D02";
	ctx.font="20px Arial";
	for(i=0;i<CantidadProcesos;i++){
		if(i==n){
			gant[i].push(1);			
		}else{
			gant[i].push(0);
		}
		ctx.fillText("Proceso "+(i+1),10,22*(i+1));
	}
	for(i=0;i<CantidadProcesos;i++){
		var ultimo = gant[i].length-1;
			if(estadosArr[i]== "Critico"){
				ctx.fillStyle="#40FF00";
				ctx.fillRect(100+Math.round(gant[i].length/(CantidadProcesos*0.1)),5+(22*i),2.5,20);
			}
			if(estadosArr[i]== "Bloqueado"){
				ctx.fillStyle="#FA5858";
				ctx.fillRect(100+Math.round(gant[i].length/(CantidadProcesos*0.1)),5+(22*i),2.5,20);
			}if(estadosArr[i]=="Suspendido"){
				ctx.fillStyle="#FACC2E";
				ctx.fillRect(100+Math.round(gant[i].length/(CantidadProcesos*0.1)),5+(22*i),2.5,20);
			}if(estadosArr[i]=="Nuevo"){
				ctx.fillStyle="#beab74";
				ctx.fillRect(100+Math.round(gant[i].length/(CantidadProcesos*0.1)),5+(22*i),2.5,20);
			}if(estadosArr[i]=="Terminado"){
				ctx.fillStyle="#e7d9d9";
				ctx.fillRect(100+Math.round(gant[i].length/(CantidadProcesos*0.1)),5+(22*i),2.5,20);
			}if(estadosArr[i]=="Listo"){
				ctx.fillStyle="#58D3F7";
				ctx.fillRect(100+Math.round(gant[i].length/(CantidadProcesos*0.1)),5+(22*i),2.5,20);
			}
	}

}

function bloquearRecurso(nodo){
	nodo.recurso.estado =1;
	for (var i = 0; i < Disp.length; i++) {
		if(Disp[i].nombre==nodo.recurso.nombre){
			Disp[i].estado=1;
		}
	}
}

function recursoBloq(nodo){
	var retorno = true;	
	for (var i = 0; i < Disp.length; i++) {
		if(Disp[i].nombre==nodo.recurso.nombre && Disp[i].estado== 1){
			retorno = false;
		}
	}	
	return retorno;
}

function LiberarRec(nodo){
	nodo.recurso.estado=0;
	for (var i = 0; i < Disp.length; i++) {
		if(Disp[i].nombre==nodo.recurso.nombre){
			Disp[i].estado=0;
		}
	}
}

function mensaje(p, r){
	var text="Proceso "+p.proceso+": ";	
	if(r==0){
		for (var i = 0; i < Disp.length; i++) {
		if(Disp[i].nombre==p.recurso.nombre){
			text+="Ocupado";
		}
	}
		$("#mensaje").html("<p>"+text+"</p>");
		$( "#mensaje" ).show();
		//$( "#mensaje" ).fadeOut( 4000, function() {});
	}else if(r==1){
		$("#respuesta").html("<p>"+text+"</p>");
		$( "#respuesta" ).show();
		$( "#respuesta" ).fadeOut( 4000, function() {});
	}
}

function calcularMetrica1(cp,c,st){
	// var metrica = 0;
	// metrica = ((c - st)/cp);
	
	// $("#metricas1").click(function(){
	// 	$("#met1").html(metrica + " Milisegundos");
	// });

	// $("#metricas1").click(function(){
	// 	$("#t1m").html(c + " Milisegundos");
	// });
	
	// $("#metricas1").click(function(){
	// 	$("#e1").html( c-st +" Milisegundos");
	// });
	// $("#metricas1").click(function(){
	// 	$("#p1").html( cp +" Procesos");
	// });
	var metrica = 0;
    metrica = ((c - st)/cp)*10;

    vmetricaUno = metrica.toFixed(0);
    $("#met1").html( vmetricaUno + " ticks");
    
    vTUno = (c*10).toFixed(0);
    $("#t1").html( vTUno + " ticks");// Tiempo sección critica

    vEUno = ((c-st)*10).toFixed(0);
    $("#e1").html( vEUno +" ticks"); // Tiempo en espera

    cpUno = cp;
    $("#p1").html( cpUno +" Procesos"); //Cantidad de procesos
    
    analizarRendimiento(1, metrica); 
}

/*ANÁLISIS DE RENDIMIENTO*/
function analizarRendimiento(proc, met){
    var rend = "";
    if(met < 5.2) {rend = "EXCELENTE";}
    if(met >= 5.3 && met <= 6.3) {rend = "BUENO";}
    if(met > 6.4) {rend = "NEGATIVO";}

    if(proc == 1){
    	blablaUno = "El procesador "+proc+" tuvo un rendimiento "+rend+" con una metrica de "+met;	
    }
    if(proc == 2){
    	blablaDos = "El procesador "+proc+" tuvo un rendimiento "+rend+" con una metrica de "+met;	
    }
    if(proc == 3){
    	blablaTres = "El procesador "+proc+" tuvo un rendimiento "+rend+" con una metrica de "+met;	
    }
    if(proc == 0){
        blablaGen = "El comportamiento general de los procesos fue "+rend+" con una metrica de "+met;
    }
}

function generarInformePDF(){
	texto_pdf_prueba(vmetricaUno,vTUno,vEUno,cpUno, vmetricaDos,vTDos,vEDos,cpDos, vmetricaTres,vTTres,vETres,cpTres, blablaUno,blablaDos, blablaTres, blablaGen, ct, stt, cpt, metricaTotal);
}
