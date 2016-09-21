var querystring = require("querystring"),
    fs = require("fs"),
    formidable = require("formidable");

/**
 * Accès à la page d'accueil.
 * 
 * @param  {object} response Réponse.
 * 
 * @return {void}          
 */
function start(response) {
    response.writeHead(200, {"Content-Type": "text/html"});
    var ControlleurHTML = require('./ControlleurHTML');
    var oControlleurHTML = new ControlleurHTML('page');
    oControlleurHTML.oCallView('accueil', function(szContenu){
      response.write(szContenu)
      response.end();
    });
    
    
}

/**
 * Accès à une nouvelle partie.
 * 
 * @param  {object} response Réponse.
 * 
 * @return {void}          
 */
function play(response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  var ControlleurHTML = require('./ControlleurHTML');
  var oControlleurHTML = new ControlleurHTML('page');
  oControlleurHTML.oCallView('plateau', function(szContenu){
    response.write(szContenu)
    response.end();
  });
}

exports.start = start;
exports.play = play;