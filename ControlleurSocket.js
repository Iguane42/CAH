function ControlleurSocket(szRoom, aJoueurs)
{
	this.szRoom = szRoom;
	this.aJoueurs = aJoueurs;
	this.Joueur = require('./Joueur');
}

ControlleurSocket.prototype.vJoin = function(oCallback)
{
	var nNbJoueurs = this.aJoueurs.length;
	var oJoueur = new this.Joueur(nNbJoueurs + 1);
	this.aJoueurs.push(oJoueur);
	var oResponse = {oNouveauJoueur : oJoueur};
	this.oJoueur = oJoueur;
	oCallback(oResponse)
}

ControlleurSocket.prototype.vLeave = function(aJoueurs, oCallback)
{
	this.aJoueurs = aJoueurs;
	var oResponse = {oDeconnexionJoueur : this.oJoueur};
	oCallback(oResponse)
}

ControlleurSocket.prototype.vExecuteAction = function(oCallback)
{

}

module.exports = ControlleurSocket;