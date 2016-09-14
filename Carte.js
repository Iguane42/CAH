function Carte()
{
	// var bddBrain = require("./bddBrain");
	// this.oBdd = new bddBrain();
	//this.test = 'salut!';
	bddBrain = require("./bddBrain");
	this.oBdd = new bddBrain();
}

Carte.prototype.aGetCartes = function(oClasse, oCallback)
{
	//oBdd = require('./bddBrain');
	//console.log(this.test);
	var szRequete = "SELECT id_carte, type, contenu FROM carte";
	this.oBdd.aSelect(szRequete, this, function(aElements){
		if (aElements !== false) {
			var oElements = [];
			//console.log(aElements)
			aElements.forEach(function(oElement, nIndex, aElements){
				oElements[nIndex] = oElement;
			});
			oCallback.apply(oClasse, [oElements]);
		} else {
			return;
		}
	});
	//console.log(oBdd);
	
};

	//exports.aGetCartes = this.aGetCartes;


module.exports = Carte;