var aContentTypes = {};
aContentTypes['png'] = 'image/png';
aContentTypes['jpg'] = 'image/jpeg';
aContentTypes['jpeg'] = 'image/jpeg';
aContentTypes['js'] = 'application/javascript';
aContentTypes['css'] = 'text/css';

/**
 * Routeur
 * 
 * @param  {object} handle   Handler.
 * @param  {string} pathname Chemin.
 * @param  {object} response Réponse.
 * @param  {object} request  Requète.
 * 
 * @return {void}          
 */
function route(handle, pathname, response, request) {
  //console.log("Début du traitement de l'URL " + pathname + ".");
  var oRegex = new RegExp(/^(?!.+socket.io.+).+\.(css|js|png|jpg|jpeg|gif)$/i);
  //console.log(pathname.match(oRegex));
  if (typeof handle[pathname] === 'function') {
    handle[pathname](response, request);
  } else if (oRegex.test(pathname)) {
  	var szExtension = pathname.match(oRegex)[1];
  	if (typeof aContentTypes[szExtension] != 'undefined') {
  		response.writeHead(200, {"Content-Type": aContentTypes[szExtension]});
  	}
  	//response.writeHead(200, {"Content-Type": "text/html"});
  	var ControlleurRest = require('./ControlleurRest');
  	var oControlleurRest = new ControlleurRest();
  	oControlleurRest.oGetRessource(pathname, szExtension, function(oStream){
  		oStream.pipe(response);
  	});
    //response.end();
  } else if (pathname == '/socket.io/socket.io.js') {
  	var ControlleurRest = require('./ControlleurRest');
  	var oControlleurRest = new ControlleurRest();
  	oControlleurRest.oGetRessource('./node_modules/socket.io/node_modules/socket.io-client/socket.io.js', '', function(oStream){
  		oStream.pipe(response);
  	});
  	//response.sendFile('./node_modules/socket.io/lib/client.js');
  } else {
    console.log("Aucun gestionnaire associé à " + pathname);
    response.writeHead(404, {"Content-Type": "text/html"});
    response.write("404 Non trouvé");
    response.end();
  }
}

exports.route = route;
