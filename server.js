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

  io.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function (data) {
	  console.log(data);
	});
  });
}

exports.start = start;
