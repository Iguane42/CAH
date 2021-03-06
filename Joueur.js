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
	var nNbCartes = 0;
	if (typeof this.aMain == 'undefined') {
		console.log(this.szPseudo + " tire sa main");
		nNbCartes = 10;
	} else {

		this.aMain.forEach(function(oCarte){
			if (oCarte == null) {
				nNbCartes ++;
			}
		});
		//console.log(this.szPseudo + " tire " + nNbCartes + " carte(s)");
	}
	if (nNbCartes > 0) {
		aRecherche['szType'] = 'blanche';
		aRecherche['bRandom'] = true;
		aRecherche['nLimite'] = nNbCartes;
		console.log('nLimite : ' + nNbCartes);
		var oThat = this;
		oCarte.aGetCartes(function(aCartes){
			console.log('aCartes.length : ' + aCartes.length);
			if (nNbCartes == 10) {
				oThat.aMain = aCartes;
			} else {
				var nCpt = 0;
				oThat.aMain.forEach(function(oCarteMain, nIndex){
					if (oCarteMain == null) {
						oThat.aMain[nIndex] = aCartes[nCpt];
						console.log(oThat.szPseudo+" a tiré "+oCarteMain);
						nCpt ++;
					}
				});
			}
			oCallback();
		}, oPartie, aRecherche);
	} else {
		oCallback();
	}
	
};

module.exports = Joueur;