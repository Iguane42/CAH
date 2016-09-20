function Loader()
{
	Core.apply(this, arguments);
	var oThat = this;
	this.oElement = $('.calque_loader');

	this.vOuvreCalque = function(szMessage)
	{
		this.oElement.find('span.message_attente').text(szMessage);
		this.oElement.show();
	};

	this.vFermeCalque = function()
	{
		this.oElement.hide();
	};
}