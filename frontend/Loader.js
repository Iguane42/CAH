/**
 * Message d'attente.
 */
function Loader()
{
	Core.apply(this, arguments);
	var oThat = this;
	this.oElement = $('.calque_loader');

	/**
	 * Ouvre le calque du message d'attente et y affiche le message précisé.
	 * 
	 * @param  {string} szMessage Message à afficher.
	 * 
	 * @return {void}           
	 */
	this.vOuvreCalque = function(szMessage)
	{
		this.oElement.find('span.message_attente').text(szMessage);
		this.oElement.show();
	};

	/**
	 * Ferme le calque du message d'attente.
	 * 
	 * @return {void} 
	 */
	this.vFermeCalque = function()
	{
		this.oElement.hide();
	};
}