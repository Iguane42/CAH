function ControlleurRest()
{
	ControlleurRest.fs = require('fs');
}

ControlleurRest.prototype.oGetRessource = function(szFileName, szExtension, oCallback)
{
	var szChemin;
	switch(szExtension) {
		case 'png' :
		case 'jpg' :
		case 'jpeg' :
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