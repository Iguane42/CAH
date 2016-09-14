function Core()
{
	var oThat = this;

	this.vInit = function()
	{
		if ($('div.main').length > 0) {
			var oPartie = new Partie();
			oPartie.vInit();
		}
	};
}

$('document').ready(function(){
	var oCore = new Core();
	oCore.vInit();
});