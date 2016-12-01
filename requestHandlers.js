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

function admin(response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  var ControlleurHTML = require('./ControlleurHTML');
  var oControlleurHTML = new ControlleurHTML('page');
  oControlleurHTML.oCallView('admin', function(szContenu){
    response.write(szContenu)
    response.end();
  });
}

function liste(response, request) {
  response.writeHead(200, {"Content-Type": "text/html"});
  var Carte = require('./Carte');
  var oCarte = new Carte();
  var oParams = {};
  if (typeof request.params != 'undefined') {
    oParams = request.params;
  }
  oCarte.szGetListeCarte(function(szContenu){
    response.write(szContenu)
    response.end();
  }, oParams);
}

function edit(response, request) {
  response.writeHead(200, {"Content-Type": "text/html"});
  var Carte = require('./Carte');
  var oCarte = new Carte();
  var oParams = {};
  if (typeof request.params != 'undefined') {
    oParams = request.params;
  }
  oCarte.szEditCarte(function(szContenu){
    response.write(szContenu)
    response.end();
  }, oParams);
}

function suppr(response, request) {
  response.writeHead(200, {"Content-Type": "text/html"});
  var Carte = require('./Carte');
  var oCarte = new Carte();
  var oParams = {};
  if (typeof request.params != 'undefined') {
    oParams = request.params;
  }
  oCarte.szDeleteCarte(function(szContenu){
    response.write(szContenu)
    response.end();
  }, oParams);
}



exports.start = start;
exports.play = play;
exports.admin = admin;
exports.liste = liste;
exports.edit = edit;
exports.suppr = suppr;