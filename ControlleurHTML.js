function ControlleurHTML(szType)
{
	this.szType = szType;
	ControlleurHTML.fs = require("fs");
}

ControlleurHTML.prototype.oCallView = function(szMode, oCallback)
{
	var oStream;
	var szFichier = '';
	var szContenu = '';
	switch(szMode) {
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

ControlleurHTML.prototype.oGetHeader = function(oCallback)
{
	ControlleurHTML.fs.readFile('./views/header.html', function(err, szContenu){
		oCallback(szContenu);
	});
	
};

ControlleurHTML.prototype.oGetFooter = function(oCallback)
{
	ControlleurHTML.fs.readFile('./views/footer.html', function(err, szContenu){
		oCallback(szContenu);
	});
	
};

module.exports = ControlleurHTML;