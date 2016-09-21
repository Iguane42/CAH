/**
 * Contrôleur spécifique à une partie.
 * 
 * @param {string} szRoom Id de la salle.
 */
function Partie(szRoom)
{
	this.szRoom = szRoom;
	this.aJoueurs = new Array();
	this.aCartesTombees = new Array();
	this.Carte = require('./Carte');
}

/**
 * Permet de démarrer une partie.
 * 
 * @param  {object} oCallback Callback appelée à la fin des retours BDD.
 * 
 * @return {void}           
 */
Partie.prototype.vLancer = function(oCallback)
{
	this.vLaverJoueurs();
	var nIndice = Math.floor(Math.random() * this.aJoueurs.length);
	this.aJoueurs[nIndice].bIsBoss = true;
	var oCarte = new this.Carte();
	oThat = this;
	oCarte.vTirerCarteNoire(this, function(oCarteNoire){
		oThat.vTirerCartes(0, function(oResponse, oJoueur){
			oResponse.oNouvelleManche.oCarteNoire = oCarteNoire;
			oCallback(oResponse, oJoueur);
		});
	});
};

/**
 * Permet de laver le tableau des joueurs (OK c'est crade mais c'est temporaire, je prévois de mettre des bots!)
 * 
 * @return {void} 
 */
Partie.prototype.vLaverJoueurs = function()
{
	var aBuffer = new Array();
	this.aJoueurs.forEach(function(oJoueur){
		if (oJoueur != null) {
			aBuffer.push(oJoueur);
		}
	});
	this.aJoueurs = aBuffer;
};

/**
 * Fait tirer les cartes à tous les joueurs.
 * 
 * @param  {integer} nIndice   Indice du premier joueur (pour la récursivité).
 * @param  {object}  oCallback Callback appelée à la fin des retours BDD.
 * 
 * @return {void}           
 */
Partie.prototype.vTirerCartes = function(nIndice, oCallback)
{
	var oJoueur = this.aJoueurs[nIndice];
	var oResponse = {};
	
	var oThat = this;
	oJoueur.vTireMain(oThat, function(){
		var oBuffer = {};
		oBuffer.vous = oJoueur;
		oBuffer.vous.oSocket = null;
		oBuffer.aJoueurs = new Array();
		oThat.aJoueurs.forEach(function(oElem){
			oElem.oGetJoueur(function(oResponse){
				oBuffer.aJoueurs.push(oResponse);
			})
		});
		oResponse = {oNouvelleManche : oBuffer};
		oCallback(oResponse, oJoueur);
		if (nIndice+1<oThat.aJoueurs.length) {

			oThat.vTirerCartes(nIndice+1, oCallback);
		}
	});
	
};

module.exports = Partie;