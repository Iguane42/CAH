function Joueur(nNumero)
{
	this.nNumero = nNumero;
	this.szHashSocket = (Math.random() + 1).toString(36).substring(7);
	this.szPseudo = 'Joueur '+nNumero;
	this.nNbPoints = 0;
	this.bIsBoss = false;
}

Joueur.prototype.oGetJoueur = function(oCallback)
{
	var oBuffer = {};
	oBuffer.nNumero = this.nNumero;
	oBuffer.nNbPoints = this.nNbPoints;
	oBuffer.bIsBoss = this.bIsBoss;
	oBuffer.szPseudo = this.szPseudo;
	oCallback(oBuffer);
};

Joueur.prototype.vTireMain = function(oPartie,oCallback)
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