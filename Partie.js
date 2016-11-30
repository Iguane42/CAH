/**
 * Contrôleur spécifique à une partie.
 * 
 * @param {string} szRoom Id de la salle.
 */
function Partie(szRoom)
{
	this.szRoom = szRoom;
	this.aJoueurs = [];
	this.aCartesTombees = new Array();
	this.Carte = require('./Carte');
	this.aCartesTour = []
}

/**
 * Permet de démarrer une partie.
 * 
 * @param  {object} oCallback Callback appelée à la fin des retours BDD.
 * 
 * @return {void}           
 */
Partie.prototype.vLancer = function(oCallback, nIdBoss)
{
	this.vLaverJoueurs();
	if (typeof nIdBoss == 'undefined') {
		var nIndice = Math.floor(Math.random() * this.aJoueurs.length);
		this.aJoueurs[nIndice].bIsBoss = true;
	} else {
		this.aJoueurs.forEach(function(oElem, nIndex){
			if (oElem.nNumero == nIdBoss) {
				oElem.bIsBoss = true;
			}
		});	
	}
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

Partie.prototype.vJouerCarte = function(nNumero, nIdCarte, oCallback)
{
	var oCarte = new this.Carte();
	var aRecherche = new Array();
	aRecherche['nIdCarte'] = nIdCarte;
	aRecherche['nLimite'] = 1;
	var oThat = this;
	oCarte.aGetCartes(function(aCarte){
		oThat.aJoueurs.forEach(function(oJoueur){
			if (oJoueur.nNumero == nNumero) {
				oThat.aCartesTour[oJoueur.nNumero] = aCarte[0];
				oJoueur.aMain.forEach(function(oCarte, nIndex){
					if (oCarte.nIdCarte == nIdCarte) {
						console.log(oJoueur.szPseudo+" a joué "+oCarte.szContenu);
						oJoueur.aMain[nIndex] = null;
					}
				});
				var nNbCartes = 0;
				oThat.aCartesTour.forEach(function(oCarteTour){
					if (oCarteTour != 'null') {
						nNbCartes ++;
					}
				});
				var oResponse = {};
				if (nNbCartes > 3) {
					var aCartesReponse = [];
					oThat.aCartesTour.forEach(function(oCarteTour, nIndice){
						if (oCarteTour != 'null') {
							var nOrdre = Math.floor(Math.random() * 4);
							while (typeof aCartesReponse[nOrdre] != 'undefined') {
								nOrdre = Math.floor(Math.random() * 4);
							}
							aCartesReponse[nOrdre] = oCarteTour;
						}
					});
					oResponse = {nNumJoueurAJoue: oJoueur.nNumero, aCartesJouees: aCartesReponse};
				} else {
					oResponse = {nNumJoueurAJoue: oJoueur.nNumero};
				}
				oCallback(oResponse);
			}
		});
	},null, aRecherche);
	
}

Partie.prototype.vElireCarte = function(nNumero, nIdCarte, oCallback) {
	var oThat = this;
	this.aJoueurs.forEach(function(oJoueur){
		if (oJoueur.nNumero == nNumero) {
			if (oJoueur.bIsBoss === true) {
				oThat.aCartesTour.forEach(function(oCarte, nIndice){
					if (oCarte.nIdCarte == nIdCarte) {
						oThat.aJoueurs.forEach(function(oVainqueur){
							if (oVainqueur.nNumero == nIndice) {
								oVainqueur.nNbPoints += 1;
								oVainqueur.oGetJoueur(function(oVainqueur){
									var oResponse = {oVainqueurManche:oVainqueur, oCarteElue:oCarte};
									oCallback(oResponse);
									setTimeout(function(){
										oThat.vReinit(oCallback, oVainqueur.nNumero);
									},8000);
								});
							}
						});
					}
				});
			}
		}
	});
	
}

Partie.prototype.vReinit = function(oCallback, nNumero) {
	this.aCartesTour = [];
	var oReponse = {};
	var bFinPartie = false;
	this.aJoueurs.forEach(function(oJoueur){
		oJoueur.bIsBoss = false;
		if (oJoueur.nNbPoints >= 5) {
			oJoueur.oGetJoueur(function(oElem){
				oReponse.oVainqueur = oElem;
			});
			bFinPartie = true;
		}
	})
	if (bFinPartie === true) {
		oReponse.bFinPartie = bFinPartie;
		oCallback(oReponse);
	} else {
		this.vLancer(oCallback, nNumero);
	}
	
}

module.exports = Partie;