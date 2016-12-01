/**
 * Modèle de données carte.
 */
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

/**
 * Récupère les cartes en fonction des critères de recherche.
 * 
 * @param  {object} oCallback  Callback appelée après le retour BDD.
 * @param  {object} oPartie    Partie en cours.
 * @param  {array}  aRecherche Critères de recherche.
 * 
 * @return {void}            
 */
Carte.prototype.aGetCartes = function(oCallback, oPartie, aRecherche)
{
	//console.log(oPartie);
	if (typeof oPartie != 'undefined' && oPartie != null && typeof oPartie.aCartesTombees != 'undefined' && oPartie.aCartesTombees != null) {
		var szCartesJouees = '';
		oPartie.aCartesTombees.forEach(function(nIdCarte, nIndice){
			if (nIndice > 0){
				szCartesJouees += ', ';
			}
			szCartesJouees += "'"+nIdCarte+"'";
		});
		aRecherche['szCartesJouees'] = szCartesJouees;
		//console.log(szCartesJouees);
	}
	var szRequete = "SELECT id_carte, type, contenu FROM carte WHERE 1=1"+this.szGetCriteres(aRecherche);
	var oThat = this;
	//console.log(szRequete);
	this.oBdd.aSelect(szRequete, function(aElements){
		if (aElements !== false) {
			var oElements = [];
			aElements.forEach(function(oElement, nIndex, aElements){
				//console.log(oElement.id_carte);
				if (typeof oPartie != 'undefined' && oPartie != null && typeof oPartie.aCartesTombees != 'undefined' && oPartie.aCartesTombees != null) {

					oPartie.aCartesTombees.push(oElement.id_carte);
				}
				oElements[nIndex] = {};
				Object.keys(oThat.aMappingChamps).forEach(function(szIndex){
					//console.log(nIndex+' : '+oThat.aMappingChamps[szIndex]);
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

Carte.prototype.nGetNbCartes = function(aRecherche, oCallback) {
	var szRequete = "SELECT COUNT(1) AS nb_cartes FROM carte WHERE 1=1"+this.szGetCriteres(aRecherche);
	var oThat = this;
	//console.log(szRequete);
	this.oBdd.aSelect(szRequete, function(oElement){
		if (oElement !== false) {
			nNbCartes = oElement[0].nb_cartes;
			oCallback(nNbCartes);
		} else {
			return;
		}
	});
};

/**
 * Permet de récupérer la clause where en fonction de critères de recherche.
 * 
 * @param  {array}  aRecherche Critères de recherche.
 * 
 * @return {string}            Clause where.
 */
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
		szClauseWhere += ' LIMIT ';
		if (typeof aRecherche['nStartWith'] != 'undefined' && aRecherche['nStartWith'] > 0) {
			szClauseWhere += aRecherche['nStartWith'] + ', ';
		}
		szClauseWhere += aRecherche['nLimite'];
	}

	return szClauseWhere;
};

/**
 * Permet de récupérer une carte noire au hasard.
 * 
 * @param  {object} oPartie   Partie en cours.
 * @param  {object} oCallback Callback appelée après le retour BDD.
 * 
 * @return {void}           
 */
Carte.prototype.vTirerCarteNoire = function(oPartie, oCallback) {
	var aRecherche = [];
	aRecherche['szType'] = 'noire';
	aRecherche['bRandom'] = true;
	aRecherche['nLimite'] = 1;
	this.aGetCartes(function(aCarte){
		var oCarte = aCarte[0];
		oCallback(oCarte);
	}, oPartie, aRecherche);
};

Carte.prototype.szGetListeCarte = function(oCallback, oParams) {
	var aRecherche = [];
	aRecherche['nLimite'] = 10;
	aRecherche['nStartWith'] = 0;
	var nNumPage = 1;
	if (typeof oParams != 'undefined') {
		if (typeof oParams.nNumPage != 'undefined' && oParams.nNumPage > 0) {
			nNumPage = oParams.nNumPage;
			aRecherche['nStartWith'] = (oParams.nNumPage - 1) * 10;
			console.log(aRecherche['nStartWith']);
		}
	}
	var oThat = this;
	this.nGetNbCartes([], function(nNbCartes){
		var oReponse = {};
		oReponse.nNbPages = Math.ceil(nNbCartes/10);
		oReponse.nNumPage = nNumPage;
		oThat.aGetCartes(function(oElements){
			oReponse.aCartes = oElements;
			oCallback(JSON.stringify(oReponse));
		},null,aRecherche);
	});
	
};

Carte.prototype.szEditCarte = function(oCallback, oParams) {
	var oElement = {};
	oElement['type'] = oParams.szType;
	oElement['contenu'] = oParams.szContenu;
	if (typeof oParams.nIdCarte != 'undefined' && oParams.nIdCarte > 0) {
		var szClauseWhere = "AND id_carte = '" + oParams.nIdCarte + "'";
		this.oBdd.bUpdate('carte', oElement, szClauseWhere, function(){
			oCallback(JSON.stringify({szSucces : "La carte a bien été mise à jour."}));
		});
	} else {
		this.oBdd.bInsert('carte', oElement, function(){
			oCallback(JSON.stringify({szSucces : "La carte a bien été ajoutée."}));
		});
	}
};

Carte.prototype.szDeleteCarte = function(oCallback, oParams) {
	if (typeof oParams.nIdCarte != 'undefined' && oParams.nIdCarte > 0) {

		this.oBdd.bDelete('carte', oParams.nIdCarte, function(){
			oCallback(JSON.stringify({szSucces : "La carte a bien été supprimée."}));
		});
	} else {
		
		oCallback(JSON.stringify({szSucces : "Echec de la suppression de la carte."}));

	}
};

	//exports.aGetCartes = this.aGetCartes;


module.exports = Carte;