function ControlleurSocket(oPartie)
{
	this.oPartie = oPartie;
	this.Joueur = require('./Joueur');
}

ControlleurSocket.prototype.vJoin = function(oJoueur, oCallback)
{
	//this.oPartie = oPartie;
	
	this.oPartie.aJoueurs.push(oJoueur);
	var oResponse = {oNouveauJoueur : oJoueur, aListeJoueurs : this.oPartie.aJoueurs};
	console.log('Le joueur '+oJoueur.szPseudo+' vient de rejoindre la salle '+this.oPartie.szRoom+'.');
	oCallback(oResponse)
}

ControlleurSocket.prototype.vLeave = function(oJoueur, oCallback)
{
	this.oPartie.aJoueurs[oJoueur.nNumero - 1] = null;
	var oResponse = {oDeconnexionJoueur : oJoueur, aListeJoueurs : this.oPartie.aJoueurs};
	console.log('Le joueur '+oJoueur.szPseudo+' vient de quitter la salle '+this.oPartie.szRoom+'.');
	oCallback(oResponse)
}

ControlleurSocket.prototype.vExecuteAction = function(oCallback)
{

}

ControlleurSocket.prototype.vLancerPartie = function(oCallback)
{
	this.oPartie.vLancer(function(oResponse, oJoueur){
		oCallback(oResponse, oJoueur);
	});
}

module.exports = ControlleurSocket;