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
	var aJoueurs = [];
	io.on('connection', function (socket) {
		var szRoom = 'room_test';
		socket.join(szRoom);
		var ControlleurSocket = require('./ControlleurSocket');
		var oControlleurSocket = new ControlleurSocket(szRoom, aJoueurs);
		oControlleurSocket.vJoin(function(oResponse){
			io.to(szRoom).emit('update', oResponse);
			socket.on('disconnect', function(){
				aJoueurs[oResponse.oNouveauJoueur.nNumero - 1] = null;
				oControlleurSocket.vLeave(aJoueurs, function(oResponse){
					io.to(szRoom).emit('update', oResponse);
				});
			});
		});
		socket.on('action', function(oRequest){
			oControlleurSocket.vExecuteAction(oRequest, function(oResponse){
				io.to(szRoom).emit('update', oResponse);
			});
		})
  	});
}

exports.start = start;
