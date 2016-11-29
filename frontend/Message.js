/**
 * Message d'attente.
 */
function Message()
{
	Core.apply(this, arguments);
	var oThat = this;
	this.oElement = $('.message_central');

	/**
	 * Ouvre le calque du message d'attente et y affiche le message précisé.
	 * 
	 * @param  {string} szMessage Message à afficher.
	 * 
	 * @return {void}           
	 */
	this.vOuvreMessage = function(szMessage)
	{
		this.oElement.find('span.message').text(szMessage);
		this.oElement.show();
		this.oElement.find('.contenu_calque').animate({
			width:'33.33%',
			height:'30%',
		},300);
		this.oElement.find('span.message').animate({
			opacity: 1,
		}, 300);
	};

	/**
	 * Ferme le calque du message d'attente.
	 * 
	 * @return {void} 
	 */
	this.vFermeMessage = function()
	{
		this.oElement.find('.contenu_calque').animate({
			width:'0%',
			height:'0%',
		},300);
		this.oElement.find('span.message').animate({
			opacity: 0,
		},300, function(){
			oThat.oElement.hide();
		});
		
	};

	this.vAfficher = function(szMessage)
	{
		this.vOuvreMessage(szMessage);
		setTimeout(function(){
			oThat.vFermeMessage();
		}, 4000);
	};
}