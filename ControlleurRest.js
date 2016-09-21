/**
 * Contrôlleur d'accès aux ressources.
 */
function ControlleurRest()
{
	ControlleurRest.fs = require('fs');
}

/**
 * Récupère la ressource demandée.
 * 
 * @param  {string} szFileName  Nom du fichier.
 * @param  {string} szExtension Extension du fichier.
 * @param  {object} oCallback   Callback appelée à la fin des traitements su système de fichier.
 * 
 * @return {void}             
 */
ControlleurRest.prototype.oGetRessource = function(szFileName, szExtension, oCallback)
{
	var szChemin;
	switch(szExtension) {
		case 'png' :
		case 'jpg' :
		case 'jpeg' :
		case 'gif' :
			szChemin = 'img';
			break;
		case 'css' :
			szChemin = 'css';
			break;
		case 'js' :
			szChemin = 'frontend';
			break;
		default :
			szChemin = '';
			break;
	}

	szChemin += szFileName;

	var oStream = ControlleurRest.fs.createReadStream(szChemin);
	oStream.on('open', function(err){
		oCallback(oStream);
	});
}

module.exports = ControlleurRest;