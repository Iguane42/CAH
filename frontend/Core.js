function Core()
{
	var oThat = this;

	this.vInit = function()
	{
		setTimeout(function(){
			var socket = io('http://192.168.33.10:8888');
				socket.on('news', function (data) {
				console.log(data);
			socket.emit('my other event', { my: 'data' });
			});
		}, 7000);
	};
}

$('document').ready(function(){
	var oCore = new Core();
	oCore.vInit();
});