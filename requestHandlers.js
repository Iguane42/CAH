var querystring = require("querystring"),
    fs = require("fs"),
    formidable = require("formidable");

function start(response) {
    response.writeHead(200, {"Content-Type": "text/html"});
    var ControlleurHTML = require('./ControlleurHTML');
    var oControlleurHTML = new ControlleurHTML('page');
    oControlleurHTML.oCallView('accueil', function(szContenu){
      response.write(szContenu)
      response.end();
    });
    
    
}

function test(response) {
  var Carte = require('./Carte.js');
  var oCarte = new Carte();
  oCarte.aGetCartes(this, function(oElements) {
    response.write(JSON.stringify(oElements));
    response.end();
  });
  
}

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
exports.test = test;
exports.play = play;