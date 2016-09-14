function Partie()
{
	Core.apply(this, arguments);
	oThat = this;

	this.vInit = function()
	{
		var oDivCarte = $('div.main div.carte');
		oDivCarte.unbind('click');
		oDivCarte.click(function(e){
			e.preventDefault();
			oThat.vAnimateCarte($('div.main div.carte:first'));
		});

		var socket = io('http://192.168.33.10:8888');
		socket.on('update', function (oResponse) {
			if (typeof (oResponse.oNouveauJoueur) != 'undefined') {
				console.log('connexion du joueur '+oResponse.oNouveauJoueur.nNumero+' ( '+oResponse.oNouveauJoueur.szPseudo+' ).');
			} else if (typeof oResponse.oDeconnexionJoueur != 'undefined') {
				console.log('déconnexion du joueur '+oResponse.oDeconnexionJoueur.nNumero+' ( '+oResponse.oDeconnexionJoueur.szPseudo+' ).');
			}
		});

	}

	this.vAnimateCarte = function(oCarte)
	{
		var oDivCarte = oCarte;
		oDivCarte.animate({
			width: '0px',
			padding: '20px 0px 20px 0px',
		}, 30, function(){
			$(this).animate({
				opacity: 0,
			}, 5, function(){
				$(this).find('span.dos_carte').toggle();
				$(this).find('span.face_carte').toggle();
				$(this).animate({
					opacity: 1,
				}, 5, function(){
					$(this).animate({
						width: '118px',
						padding: '20px',
					}, 30, function(){
						var oNewCard = $(this).parent('div.div_carte').next('div.div_carte').find('div.carte');
						if (oNewCard.length > 0) {
							oThat.vAnimateCarte(oNewCard);
						}
					});
				});
			});
		});
	}
}