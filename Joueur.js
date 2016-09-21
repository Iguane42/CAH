/**
 * Joueur.
 * 
 * @param {integer} nNumero Numero de joueur.
 */
function Joueur(nNumero)
{
	this.nNumero = nNumero;
	this.szHashSocket = (Math.random() + 1).toString(36).substring(7);
	this.szPseudo = 'Joueur '+nNumero;
	this.nNbPoints = 0;
	this.bIsBoss = false;
}

/**
 * Permet de retourner l'object joueur sans les informations inutiles.
 * 
 * @param  {object} oCallback Callback appelée à la fin des traitements (inutile).
 * 
 * @return {void}           
 */
Joueur.prototype.oGetJoueur = function(oCallback)
{
	var oBuffer = {};
	oBuffer.nNumero = this.nNumero;
	oBuffer.nNbPoints = this.nNbPoints;
	oBuffer.bIsBoss = this.bIsBoss;
	oBuffer.szPseudo = this.szPseudo;
	oCallback(oBuffer);
};

/**
 * Permet au joueur de tirer sa main.
 * 
 * @param  {object} oPartie   Partie en cours.
 * @param  {object} oCallback Callback appelée à la fin des traitements BDD.
 * 
 * @return {void}           
 */
Joueur.prototype.vTireMain = function(oPartie, oCallback)
{
	var Carte = require('./Carte');
	var oCarte = new Carte();
	var aRecherche = new Array();
	aRecherche['szType'] = 'blanche';
	aRecherche['bRandom'] = true;
	aRecherche['nLimite'] = 10;
	var oThat = this;
	oCarte.aGetCartes(function(aCartes){
		oThat.aMain = aCartes;
		oCallback();
	}, oPartie, aRecherche);
};

module.exports = Joueur;