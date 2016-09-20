var http = require("http");
var url = require("url");

function start(route, handle) {
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
		//console.log("Requête reçue pour le chemin " + pathname + ".");
		route(handle, pathname, response, request);
	}

	var server = http.createServer(onRequest).listen(8888);
	console.log("Démarrage du serveur.");
	var io = require("socket.io").listen(server);
	console.log("Démarrage de Socket.io")
	//var aJoueurs = [];
	var szRoom = (Math.random() + 1).toString(36).substring(7);
	var Partie = require("./Partie");
	var oPartie = new Partie(szRoom);
	var ControlleurSocket = require('./ControlleurSocket');
	var oControlleurSocket = new ControlleurSocket(oPartie);
	var Joueur = require('./Joueur');
	var aMappingSocket = Array();
	io.on('connection', function (socket) {
		var oControlleurPartie = oControlleurSocket;
		socket.join(oControlleurPartie.oPartie.szRoom);
		var nNbJoueurs = oControlleurPartie.oPartie.aJoueurs.length;
		var oJoueur = new Joueur(nNbJoueurs+1);
		aMappingSocket[oJoueur.szHashSocket] = socket;
		oControlleurPartie.vJoin(oJoueur, function(oResponse){
			io.to(oControlleurPartie.oPartie.szRoom).emit('update', oResponse);
			socket.emit('vous', oResponse.oNouveauJoueur);
			socket.on('disconnect', function(){
				oControlleurPartie.vLeave(oJoueur, function(oResponse){
					io.to(oControlleurPartie.oPartie.szRoom).emit('update', oResponse);
				});
			});
			var nNbJoueurs = 0;
			oControlleurPartie.oPartie.aJoueurs.forEach(function(oJoueurCompte){
				if (oJoueurCompte != null) {
					nNbJoueurs ++;
				}
				if (nNbJoueurs >= 5) {
					oControlleurPartie.vLancerPartie(function(oResponse, oJoueur){
						aMappingSocket[oJoueur.szHashSocket].emit('update', oResponse);
						//console.log(oResponse);
					});
					szRoom = (Math.random() + 1).toString(36).substring(7);
					oPartie = new Partie(szRoom);
					oControlleurSocket = new ControlleurSocket(oPartie);
				}
			});
			socket.on('action', function(oRequest){
				oControlleurPartie.vExecuteAction(oRequest, function(oResponse){
					io.to(oControlleurPartie.szRoom).emit('update', oResponse);
				});
			})
			socket.on('chat', function(oData){
				io.to(oControlleurPartie.oPartie.szRoom).emit('chat', {joueur: oJoueur, message: oData.message});
			});
		});
  	});
}

exports.start = start;
