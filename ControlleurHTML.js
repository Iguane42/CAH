/**
 * Contrôlleur d'accès aux templates HTML.
 * 
 * @param {string} szType Type de template (page complète ou contentpane).
 */
function ControlleurHTML(szType)
{
	this.szType = szType;
	ControlleurHTML.fs = require("fs");
	this.bAdmin = false;
}

/**
 * Permet de récupérer une vue.
 * 
 * @param  {string} szMode    Vue appelée.
 * @param  {object} oCallback Callback appelée après la génération de la vue.
 * 
 * @return {void}           
 */
ControlleurHTML.prototype.oCallView = function(szMode, oCallback)
{
	var oStream;
	var szFichier = '';
	var szContenu = '';
	this.bAdmin = false;
	switch(szMode) {
		case 'plateau' :
			szFichier = 'plateau.html';
			break;
		case 'admin' :
			this.bAdmin = true;
			szFichier = 'admin.html';
			break;
        default :
        	szFichier = 'accueil.html';
        	break;
	}
	var oThat = this;
	if (this.szType == 'page') {
		oThat.oGetHeader(function(szHeader){
			szContenu += szHeader
			szContenu += '<body>';
			ControlleurHTML.fs.readFile('./views/'+szFichier, function(err, szBody){
				szContenu += szBody;
				szContenu += '</body>';
				oThat.oGetFooter(function(szFooter){
					szContenu += szFooter;
					oCallback(szContenu);
				});
			});
		});
	} else {
		ControlleurHTML.fs.readFile('./views/'+szFichier, function(err, szContenu){
			oCallback(szContenu);
		});
	}
	
};

/**
 * Permet de récupérer le header de la page.
 * 
 * @param  {object} oCallback Callback appelée après la récupération du header.
 * 
 * @return {void}           
 */
ControlleurHTML.prototype.oGetHeader = function(oCallback)
{
	if (this.bAdmin === false) {
		ControlleurHTML.fs.readFile('./views/header.html', function(err, szContenu){
			oCallback(szContenu);
		});
	} else {
		ControlleurHTML.fs.readFile('./views/headerAdmin.html', function(err, szContenu){
			oCallback(szContenu);
		});
	}
	
	
};

/**
 * Permet de récupérer le footer de la page.
 * 
 * @param  {object} oCallback Callback appelée après la récupération du footer.
 * 
 * @return {void}           
 */
ControlleurHTML.prototype.oGetFooter = function(oCallback)
{
	ControlleurHTML.fs.readFile('./views/footer.html', function(err, szContenu){
		oCallback(szContenu);
	});
	
};

module.exports = ControlleurHTML;