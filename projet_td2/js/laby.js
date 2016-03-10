/*
	(c) Platypus SAS 2015-2016
	Release version - v2
	Author - Jules & Franck Lepoivre
	Release date - 2016/03/04 - TP 2 ESILV 2A ACS - Labyrinthes
*/


/* Déclaration des variables globales (accessibles partout dans le JS) */
var laby;				// le labyrinthe
var csz = 50;			// côté d'une cellule
var wsz = 5;			// épaisseur d'un mur
var psz = 0.5;			// épaisseur d'une porte
var entry_pos = [];		// entrée du labyrinthe
var exit_pos = [];		// sortie du labyrinthe
var user_pos = [];		// position du joueur	
var game_over = true;	//variable de gestion de la fin du jeu
var nbMonstres ;
var missile = true;


var chrono2;
var chrono3;
var compteBonus = 0;
var compteTemps = 0;
var dim;
var nbVie = 0;
var capasse = false;
var chrono;
var pos_bot = [];
var diff;
var tireUltime;

var count=10;

	function theEnd(etat)
	{
		if(etat == 'win')
		{
			chrono3	= setInterval(timerVert,40);
			document.getElementById('audio_win').play();
		}
		else
		{
			chrono2	= setInterval(timerRouge,20);
			document.getElementById('audio_lose').play();
		}
	}




	function timer()
	{
	count=count-1;
	if (count <= -1 || game_over)
		{
		game_over = true;
		if(!((user_pos[0] == exit_pos[0])&&(user_pos[1] == exit_pos[1]))){ theEnd('lose');}
		else
		{
			theEnd('win');
		}
		clearInterval(chrono);
		return;
		}
		
	document.getElementById('timer').innerHTML = count + ' Secondes';
	
	// partie BOT
	for(var i=0;i<nbMonstres;i++)
	{
	var botX = pos_bot[i*2];
	var botY = pos_bot[(i*2)+1];
	if(pos_bot[i*2] != 'o' && pos_bot[2*i+1] != 'o')
	{
	var next_pos = Math.floor(Math.random() * 4)+1;
	console.log(next_pos);
	while(botX == pos_bot[i*2] && botY == pos_bot[(i*2)+1])
	{
	next_pos = Math.floor(Math.random() * 4)+1;
	switch (next_pos) {
    	case 1 : // W
    		if ((!has_W_wall(laby[pos_bot[i*2]][pos_bot[(i*2)+1]]))) {
    			pos_bot[(i*2)+1]--;
    		}
    		break;
		case 2 : // N
    		if ((!has_N_wall(laby[pos_bot[i*2]][pos_bot[(i*2)+1]]))) {
    			pos_bot[i*2]--;
    		}
    		break;
    	case 3 : // E
    		if ((!has_E_wall(laby[pos_bot[i*2]][pos_bot[(i*2)+1]]))) {
    			pos_bot[(i*2)+1]++;	
    		}
    		break;
    	case 4: // S
    		if ((!has_S_wall(laby[pos_bot[i*2]][pos_bot[(i*2)+1]])))	{
    			pos_bot[i*2]++;
    		}
    		break;
		}
	}
		if(botX != pos_bot[i*2] || botY != pos_bot[(i*2)+1])
		{
			document.getElementById(botX+'_'+botY).innerHTML = '';
			document.getElementById(pos_bot[i*2]+'_'+pos_bot[(i*2)+1]).innerHTML = "<img src='img/bot.png' style='margin-top:10px;margin-left:5px;'>";
		}
	}
	}
	}

// Affichage du labyrinthe et de ses murs, et du joueur
function print_maze(a) {
	//console.log("csz : " + csz + ", wsz : " + wsz);
    var i, j;
	var maze = document.querySelector('#maze');
	
	// Vider la div maze
	while (maze.hasChildNodes()) {
		maze.removeChild(maze.lastChild);
	};
	
	// Appliquer au labyrinthe des styles selon les paramètres entrés par l'utilisateur
	maze.setAttribute('style', 'width:' + (csz * a[0].length) + 'px; height:' + (csz * a.length) + 'px; left:0;');
	maze.setAttribute('class','maze');
	for (i = 0; i < a.length; i++) {
		for (j = 0; j < a[i].length; j++) {
			var div = document.createElement('div');
			div.setAttribute('id',i + "_" + j);
			div.setAttribute('class','cell ' + css_cell_code(a[i][j]) );
			div.setAttribute('style', ' top:'+ (csz * i) + '; left:' + (csz * j) + '; width:'+csz+'px; height:'+csz+'px;');
			maze.appendChild(div);
		}
	}
	
	//document.getElementById(0+'_'+5).style.background = '#ffffff';
	
	while(compteBonus < dim*(3))
	{
			var posX = Math.floor(Math.random() * (dim));
			var posY = Math.floor(Math.random() * (dim));
			console.log(posX,'+',posY);
			if(document.getElementById(posX + "_" + posY).innerHTML == '')
			{
				document.getElementById(posX + "_" + posY).innerHTML = '<img src="img/piece.png" style="margin-top:10px;margin-left:5px;">'
				compteBonus++;
			}
		
	}
	
	while(compteTemps < (dim / 3))
	{
			var posX = Math.floor(Math.random() * (dim));
			var posY = Math.floor(Math.random() * (dim));
			console.log(posX,'+',posY);
			if(document.getElementById(posX + "_" + posY).innerHTML == '')
			{
				document.getElementById(posX + "_" + posY).innerHTML = '<img src="img/temps.png" style="margin-top:10px;margin-left:5px;">'
				compteTemps++;
			}
	}
	
	/*
	// Dessiner les intersections
	for (i = 1; i < a.length; i++) {
		for (j = 1; j < a[i].length; j++) {
			var div = document.createElement('div');
			div.setAttribute('id','_' + i + "_" + j);
			div.setAttribute('class','cell_intersect');
			div.setAttribute('style','top:'+ (csz * i - wsz) + "; left:" + (csz * j - wsz) + ";");
			maze.appendChild(div);
		}
	}
	*/
	
	
	// En début de partie, le joueur est matérialisé sur la cellule d’entrée du labyrinthe :
	var user = document.createElement('div');
	user.setAttribute('id','user');
	user.setAttribute('style',"top:" + (csz * user_pos[0]) + "; left:" + (csz * user_pos[1]) + "; width:" + csz + "px; height:" + csz + "px;");
	maze.appendChild(user);
	
	// Marquage de la sortie :
	for (i = 0; i < a.length && has_E_wall(a[i][a[0].length - 1]); i++);
	document.getElementById(i + "_" + (a[0].length - 1)).style.backgroundColor = "#ff6666";
	exit_pos = [i,a[0].length - 1];
	
	for(var i=0;i<nbMonstres;i++)
	{
		
		pos_bot[i*2] = Math.floor(Math.random() * (dim));
		pos_bot[(i*2)+1] = Math.floor(Math.random() * (dim));
		while(document.getElementById(pos_bot[i*2]+'_'+pos_bot[(i*2)+1]).innerHTML !='' || pos_bot[(2*i)+1] < 1|| Math.abs(pos_bot[2*i]-user_pos[0]) < 1)
		{
			pos_bot[i*2] = Math.floor(Math.random() * (dim));
			pos_bot[(i*2)+1] = Math.floor(Math.random() * (dim));
		}	
		
		document.getElementById(pos_bot[i*2]+'_'+pos_bot[(i*2)+1]).innerHTML ="<img src='img/bot.png' style='margin-top:10px;margin-left:5px;'>";
	}
	
	
}

// Lancement d'une partie
function new_game(x,y,rep) {
	if (rep){
		laby = new_2d_array(x, y);
		init_2d_array(laby, 15);
		dig(laby, 0, 0);
		dig_ES(laby);
	}
	//modifyStyleSheet();
	user_pos[0] = entry_pos[0];
	user_pos[1] = entry_pos[1];
	print_maze(laby);	
}

// Initialisation du labyrinthe
function main(){
	
	var difficulte = parseInt(document.getElementById("diff").value);
	document.getElementById('audio_win').pause();
	document.getElementById('audio_lose').pause();
	diff = difficulte;
	game_over = true;
	clearInterval(chrono);
	clearInterval(chrono2);
	clearInterval(chrono3);
	// creationTableau();
	compteBonus = 0;
	compteTemps = 0;
	posFinX = 0;
	posFinY =0;
	var capasse = false;
	// Récupération des variables saisies par l'utilisateur
	var x = parseInt(document.getElementById("valX").value); //parseInt(document.querySelector('#x').value);
	var y = parseInt(document.getElementById("valX").value); //parseInt(document.querySelector('#y').value);
	count = Math.floor((x*1.5));
	chrono = setInterval(timer,1000);
	dim = x;
	count2=dim*dim;
	tireUltime = Math.floor(dim/2);
	nbMonstres = Math.floor(x/2)*difficulte;
	puissance = Math.floor(dim/3);
	creationTableau();
	nbVie = tireUltime;
	vie(nbVie);
	document.getElementById('puissance').innerHTML='nombre de puissance : '+puissance+ ' / missile :'+tireUltime;
	console.log(x+','+y);
	// Enlever le footer pour avoir une zone de jeu plus grande :
	//document.querySelector('footer').style.visibility='hidden';
	// Lancement du jeu
	new_game(x,y,game_over);	
	game_over = false;
}

// Ajout de la possibilité de rejouer la partie en cours (reset), qui repositionne le joueur sur la position d'entrée du même laby et réinitialise le compte à rebours
function replay(){
	game_over = false;
	main();
}

/*
 > Insérer le gameplay initial ­ La possibilité de se déplacer
*/
function uniKeyCode(event) {
	var key = event.keyCode;
	
	// - On peut se déplacer avec les touches directionnelles du clavier en respectant la règle de ne pas pouvoir franchir un mur.
    // N : 38, E : 39, S : 40, W : 37
	// Si l'utilisateur utilise les touches de déplacement tandis que le jeu n'est pas en cours, on ne fait rien
	if(!document.getElementById("user")) return;
	// Lorsque l’utilisateur parvient à la sortie, cela déclenche la fin de partie et l’affichage d’un message qui le manifeste. Le jeu est alors bloqué et il n’est plus possible de se déplacer dans le labyrinthe.
	if (game_over) return;
    var user_style = document.getElementById("user").style;
    switch (key) {
    	case 37 : // W
    		if ((!has_W_wall(laby[user_pos[0]][user_pos[1]]) || capasse)) {
    			user_pos[1]--;
    			if(user_pos[1]>=0){user_style.left = (csz * user_pos[1]) + "px";}
				else{user_pos[1]++;}
				capasse=false;
    		}
    		break;
		case 38 : // N
    		if ((!has_N_wall(laby[user_pos[0]][user_pos[1]]) || capasse)) {
    			user_pos[0]--;
    			if(user_pos[0]>=0){user_style.top = (csz * user_pos[0]) + "px";}
				else{user_pos[0]++;}
				capasse=false;
    		}
    		break;
    	case 39 : // E
    		if ((!has_E_wall(laby[user_pos[0]][user_pos[1]]) || capasse)) {
    			user_pos[1]++;
    			if(user_pos[1]<dim){user_style.left = (csz * user_pos[1]) + "px";}
				else{user_pos[1]--;}
				capasse=false;
    		}
    		break;
    	case 40 : // S
    		if ((!has_S_wall(laby[user_pos[0]][user_pos[1]]) || capasse)) {
    			user_pos[0]++;
    			if(user_pos[0]<dim){user_style.top = (csz * user_pos[0]) + "px";}
				else{user_pos[0]--;}
				capasse=false;
    		}
    		break;
		case 72 :
			if(nbVie >= puissance)
			{
				capasse = true;
				document.getElementById('user').style.background = 'green';
				nbVie-=(puissance);
				vie(nbVie);
			}
			break;
		case 71 :
			if(nbVie >= tireUltime)
			{
				missileDrop();
				nbVie-=(tireUltime);
				document.getElementById('audio_fusil').play();
				vie(nbVie);
			}
			break;
		
			case 74 :
			{ if(nbVie >= dim)
				{
				changeClass();
				nbVie-=(dim);
				vie(nbVie);
				}
			}
			break;
		}
		
	//if(!capasse){document.getElementById('user').style.background = 'blue';}
	if(document.getElementById(user_pos[0]+"_"+user_pos[1]).innerHTML == '<img src="img/piece.png" style="margin-top:10px;margin-left:5px;">')
	{
		document.getElementById('audio_piece').play();
		document.getElementById(user_pos[0]+"_"+user_pos[1]).innerHTML = '';
		nbVie++;
		vie(nbVie);
	}
	if(document.getElementById(user_pos[0]+"_"+user_pos[1]).innerHTML == '<img src="img/temps.png" style="margin-top:10px;margin-left:5px;">')
	{
		document.getElementById(user_pos[0]+"_"+user_pos[1]).innerHTML = '';
		count+=5;
	}
	
	if(!capasse)
		{
	if(nbVie >= puissance){document.getElementById('user').style.background= '#cc3300';}
	else{document.getElementById('user').style.background = 'blue';}
		}
	
	console.log(user_pos[0]+"_"+user_pos[1]);
	
	
	// Vérifier les conditions de victoire
	if ((user_pos[0] == exit_pos[0])&&(user_pos[1] == exit_pos[1])) { game_over = true;}
	
	for(var i=0;i<nbMonstres;i++)
	{
		if((user_pos[0] == pos_bot[i*2])&&(user_pos[1] == pos_bot[(i*2)+1])) { game_over = true;}
		
	}

	}



// Fonction générique d'affichage d'une modale pour la fin de la partie.
function show_modal(id,title){
	// stockage du code HTML de la modale à afficher dans une variable :
	var flow =
		'<div id="'+id+'" class="modal fade" role="dialog">'+
		  '<div class="modal-dialog">'+
			'<div class="modal-content">'+
			  '<div class="modal-header">'+
				'<a type="button" class="close" href="play.html" data-dismiss="modal">&times;</a>'+
				'<h4 class="modal-title">'+title+'</h4>'+
			  '</div>'+
			  '<div class="modal-body">'+
			  '</div>'+
			  '<div class="modal-footer">'+
				'<button type="button" id="same" class="btn btn-info" data-dismiss="modal">Play again</button>'+
				'<button type="button" id="next" class="btn btn-info" data-dismiss="modal">New game</button>'+
			  '</div>'+
			'</div>'+
		  '</div>'+
		'</div>';
	// ensuite, insertion de la modale dans le flux HTML :
	document.querySelector('body').innerHTML+=flow;
	// affichage de la modale :
	$('#'+id).modal();
	// cablage des évenements pour redémarrer la partie ou en démarrer une nouvelle :
	$('#next').on('click',main);
	$('#same').on('click',replay);
}

function vie(nb)
{
	for(var i=1;i<dim+1;i++)
	{
		var image = document.getElementById('vie'+i);
		var chemin = 'img/good.png';
		if( i > nb)
		{
			chemin ='img/bad.png';
		}
		image.src=chemin;
	}
	var pos1 = dim+1;
	image = document.getElementById('vie'+pos1);
	chemin = 'img/missile_off.png';
	if(nbVie >= tireUltime){chemin = 'img/missile_on.png';}
	image.src = chemin;
	
	var pos2 = dim+5;
	image = document.getElementById('vie'+pos2);
	chemin = 'img/bombe_off.png';
	if(nbVie >= dim){chemin = 'img/bombe_on.png';}
	image.src = chemin;
		
	
}


function creationTableau()
{
	document.getElementById('vie').innerHTML = '';
	for(var i=1;i<dim+3;i++)
	{
		var div = document.createElement('img');
			div.setAttribute('id','vie'+i);
			div.setAttribute('src','img/bad.png');
			document.getElementById('vie').appendChild(div);
	}
	var chemin = 'img/missile_off.png';
	var pos = dim+4;
	div.setAttribute('id','vie'+pos);
	div.setAttribute('src',chemin);
	document.getElementById('vie').appendChild(div);
	
	var chemin = 'img/bombe_off.png';
	var pos = dim+5;
	div.setAttribute('id','vie'+pos);
	div.setAttribute('src',chemin);
	document.getElementById('vie').appendChild(div);
	
}

function missileDrop()
{
		// var dimCarre = 1;
		// var xCarre = user_pos[0]-dimCarre;
		// var yCarre = user_pos[1]-dimCarre;
		// for(var i=0;i<2*dimCarre+1;i++)
		// {
			// for(var j=0;j<2*dimCarre+1;j++)
			// {
				// var xLocal = xCarre+i;
				// var yLocal = yCarre+j;
				// if((xLocal >= 0 && xLocal <dim )&&(yLocal >= 0 && yLocal <dim ) && !(document.getElementById(xLocal+'_'+yLocal).innerHTML=='<img src="img/piece.png" style="margin-top:10px;margin-left:5px;">'))
				// {
					// document.getElementById(xLocal+'_'+yLocal).innerHTML='<img src="img/safe.png" style="margin-top:10px;margin-left:5px;">';
				// }
			// }
		// }
		var lePlusProche=dim*dim;
		var indexPlusProche;
		for(var i=0;i<nbMonstres;i++)
		{
			var distance = Math.sqrt((pos_bot[i*2]-user_pos[0])*(pos_bot[i*2]-user_pos[0])+(pos_bot[i*2+1]-user_pos[1])*(pos_bot[i*2+1]-user_pos[1]))
			if (distance < lePlusProche)
			{
				lePlusProche = distance;
				indexPlusProche = i;
			}
		}
		console.log(lePlusProche+','+indexPlusProche);
		var xloc = pos_bot[indexPlusProche*2];
		var yloc = pos_bot[indexPlusProche*2+1];
		document.getElementById(xloc+'_'+yloc).innerHTML = '';
		document.getElementById(xloc+'_'+yloc).style.background = '#33cc33';
		
		
		pos_bot[indexPlusProche*2] = 'o';
		pos_bot[indexPlusProche*2+1] = 'o';
			
}

var posFinX = 0;
var posFinY =0;


	var count2=dim*dim;
	function timerRouge()
	{
	count2=count2-1;
	if (count2 <= -1)
		{
		clearInterval(chrono2);
		return;
		}
		
	if(posFinX < dim)
	{
	document.getElementById(posFinX+'_'+posFinY).style.background = '#ff0000';
	document.getElementById(posFinX+'_'+posFinY).innerHTML= "";
	posFinY++;
	if(posFinY == dim)
			{
		posFinY = 0;
		posFinX++;
			}
	}
	}
	
	function timerVert()
	{
		count2=count2-1;
	if (count2 <= -1)
		{
		clearInterval(chrono3);
		return;
		}
		
	if(posFinX < dim)
	{
	document.getElementById(posFinX+'_'+posFinY).style.background = '#33cc33';
	document.getElementById(posFinX+'_'+posFinY).innerHTML= "";
	posFinY++;
	if(posFinY == dim)
		{
		posFinY = 0;
		posFinX++;
		}
		}
		
		
	}

	function changeClass()
	{
		document.getElementById('audio_canon').play();
		var posBombeX = user_pos[0]-1;
		var posBombeY = user_pos[1]-1;
		if(posBombeX < 0) { posBombeX =0;}
		if(posBombeY < 0) { posBombeY =0;}
			
		for(var i=posBombeX;i<posBombeX+3;i++)
		{
			for(var j=posBombeY;j<posBombeY+3;j++)
			{
				if(document.getElementById(i+'_'+j).innerHTML == '<img src="img/bot.png" style="margin-top:10px;margin-left:5px;">')
				{
					for(var k=0;k<nbMonstres;k++)
					{	
						
						if(pos_bot[k*2] == i && pos_bot[2*k+1] == j)
						{
							document.getElementById(i+'_'+j).innerHTML ='';
							pos_bot[k*2] ='o';
							pos_bot[k*2+1] ='o';
						}
					}
				}
				var string ='cell';
				if(j==0)
				{
					string+=' W';
				}
				if(i==0)
				{
					string+=' N';
				}
				if(j==dim-1)
				{
					string+=' E';
				}
				if(i==dim-1)
				{
					string+=' S';
				}
					
				document.getElementById(i+'_'+j).className=string;
				if(i != user_pos[0] || j != user_pos[1]){document.getElementById(i+'_'+j).style.backgroundColor = ' #404040';}
				else{document.getElementById(i+'_'+j).style.backgroundColor = ' #333333';}
				laby[i][j] = 0;
				
			}
		}
		
	}


// Gestion de la victoire
/*
function win(){
	game_over = true;
	show_modal('modal_win','You won !');
}
*/