function Partie(szRoom)
{
	this.szRoom = szRoom;
	this.aJoueurs = new Array();
	this.aCartesTombees = new Array();
}

Partie.prototype.vLancer = function(oCallback)
{
	this.vLaverJoueurs();
	var nIndice = Math.floor(Math.random() * this.aJoueurs.length);
	this.aJoueurs[nIndice].bIsBoss = true;
	this.vTirerCartes(0, oCallback);
	//console.log(this.aCartesTombees);
};

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