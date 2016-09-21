/**
 * Contrôlleur lié aux requètes de Socket.io.
 * 
 * @param {object} oPartie Partie en cours.
 */
function ControlleurSocket(oPartie)
{
	this.oPartie = oPartie;
	this.Joueur = require('./Joueur');
}

/**
 * Permet d'ajouter un joueur à la partie.
 * 
 * @param  {object} oJoueur   Joueur à ajouter.
 * @param  {object} oCallback Callback appelée à la fin des traitements (inutile).
 * 
 * @return {void}           
 */
ControlleurSocket.prototype.vJoin = function(oJoueur, oCallback)
{
	//this.oPartie = oPartie;
	
	this.oPartie.aJoueurs.push(oJoueur);
	var oResponse = {oNouveauJoueur : oJoueur, aListeJoueurs : this.oPartie.aJoueurs};
	console.log('Le joueur '+oJoueur.szPseudo+' vient de rejoindre la salle '+this.oPartie.szRoom+'.');
	oCallback(oResponse)
}

/**
 * Permet de supprimer un joueur de la partie.
 * 
 * @param  {object} oJoueur   Joueur à supprimmer.
 * @param  {object} oCallback Callback appelée à la fin des traitements (inutile).
 * 
 * @return {void}           
 */
ControlleurSocket.prototype.vLeave = function(oJoueur, oCallback)
{
	this.oPartie.aJoueurs[oJoueur.nNumero - 1] = null;
	var oResponse = {oDeconnexionJoueur : oJoueur, aListeJoueurs : this.oPartie.aJoueurs};
	console.log('Le joueur '+oJoueur.szPseudo+' vient de quitter la salle '+this.oPartie.szRoom+'.');
	oCallback(oResponse)
}

/**
 * Exécute une action.
 * 
 * @param  {object} oCallback Callback appelée à la fin de l'action.
 * 
 * @return {void}           
 */
ControlleurSocket.prototype.vExecuteAction = function(oCallback)
{

}

/**
 * Permet de lancer une partie.
 * 
 * @param  {obejct} oCallback Callback appelée à la fin des retours BDD.
 * 
 * @return {void}           
 */
ControlleurSocket.prototype.vLancerPartie = function(oCallback)
{
	this.oPartie.vLancer(function(oResponse, oJoueur){
		oCallback(oResponse, oJoueur);
	});
}

module.exports = ControlleurSocket;