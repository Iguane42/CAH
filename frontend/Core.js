/**
 * Kernel
 */
function Core()
{
	var oThat = this;

	this.vInit = function()
	{
		if ($('div.main').length > 0) {
			var oPartie = new Partie();
			oPartie.vInit();
		} else if ($('#liste_cartes').length > 0) {
			var oAdmin = new Admin();
			oAdmin.vInit();
		}
	};

	this.vViderFormulaire = function(oFormulaire) {
		oFormulaire.find('input').each(function(){
			switch($(this).attr('type')) {
				case 'button' :
					break;
				case 'text' :
				case 'number' :
				case 'password' :
					$(this).val('');
					break;
			}
		});
		oFormulaire.find('select').each(function(){
			$(this).find('option').each(function(){
				$(this).prop('checked', false);
			});
			$(this).find('option:first').prop('checked', 'checked');
		});
	}
}

$('document').ready(function(){
	var oCore = new Core();
	oCore.vInit();
});