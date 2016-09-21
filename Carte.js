function Carte()
{
	// var bddBrain = require("./bddBrain");
	// this.oBdd = new bddBrain();
	//this.test = 'salut!';
	bddBrain = require("./bddBrain");
	this.oBdd = new bddBrain();
	this.aMappingChamps = new Array();
	this.aMappingChamps['id_carte'] = 'nIdCarte';
	this.aMappingChamps['type'] = 'szType';
	this.aMappingChamps['contenu'] = 'szContenu';
}

Carte.prototype.aGetCartes = function(oCallback, oPartie, aRecherche)
{
	//console.log(oPartie);
	if (typeof oPartie.aCartesTombees != 'undefined' && oPartie.aCartesTombees != null) {
		var szCartesJouees = '';
		oPartie.aCartesTombees.forEach(function(nIdCarte, nIndice){
			if (nIndice > 0){
				szCartesJouees += ', ';
			}
			szCartesJouees += "'"+nIdCarte+"'";
		});
		aRecherche['szCartesJouees'] = szCartesJouees;
	}
	var szRequete = "SELECT id_carte, type, contenu FROM carte WHERE 1=1"+this.szGetCriteres(aRecherche);
	var oThat = this;
	//console.log(szRequete);
	this.oBdd.aSelect(szRequete, this, function(aElements){
		if (aElements !== false) {
			var oElements = [];
			aElements.forEach(function(oElement, nIndex, aElements){
				//console.log(oElement.id_carte);
				oPartie.aCartesTombees.push(oElement.id_carte);
				oElements[nIndex] = {};
				Object.keys(oThat.aMappingChamps).forEach(function(szIndex){
					oElements[nIndex][oThat.aMappingChamps[szIndex]] = oElement[szIndex];
				});
			});
			oCallback(oElements);
		} else {
			return;
		}
	});
	//console.log(oBdd);
	
};

Carte.prototype.szGetCriteres = function(aRecherche) {
	var szClauseWhere = '';
	if (typeof aRecherche['szCartesJouees'] != 'undefined' &&  aRecherche['szCartesJouees'] != '') {
		szClauseWhere += ' AND id_carte NOT IN ('+aRecherche['szCartesJouees']+')';
	}
	if (typeof aRecherche['nIdCarte'] != 'undefined' &&  aRecherche['nIdCarte'] != '') {
		szClauseWhere += " AND id_carte = '"+aRecherche['nIdCarte']+"'";
	}
	if (typeof aRecherche['szType'] != 'undefined' &&  aRecherche['szType'] != '') {
		szClauseWhere += " AND type = '"+aRecherche['szType']+"'";
	}
	if (typeof aRecherche['bRandom'] != 'undefined' &&  aRecherche['bRandom'] == true) {
		szClauseWhere += ' ORDER BY RAND()';
	}
	if (typeof aRecherche['nLimite'] != 'undefined' &&  aRecherche['nLimite'] > 0) {
		szClauseWhere += ' LIMIT '+aRecherche['nLimite'];
	}
	return szClauseWhere;
}

Carte.prototype.vTirerCarteNoire = function(oPartie, oCallback) {
	var aRecherche = [];
	aRecherche['szType'] = 'noire';
	aRecherche['bRandom'] = true;
	aRecherche['nLimite'] = 1;
	this.aGetCartes(function(aCarte){
		var oCarte = aCarte[0];
		oCallback(oCarte);
	}, oPartie, aRecherche);
}

	//exports.aGetCartes = this.aGetCartes;


module.exports = Carte;