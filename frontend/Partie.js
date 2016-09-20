function Partie()
{
	Core.apply(this, arguments);
	oThat = this;
	this.bIsBoss = false;

	this.vInit = function()
	{
		

		var socket = io('http://192.168.33.10:8888');
		socket.on('update', function (oResponse) {
			if (typeof (oResponse.oNouveauJoueur) != 'undefined') {
				if ($('.liste_joueurs input.nIdJoueur[value='+oResponse.oNouveauJoueur.nNumero+']').length == 0) {
					var oClone = $('.liste_joueurs .un_joueur.clone').clone();
					oClone.removeClass('clone');
					oClone.find('.nIdJoueur').val(oResponse.oNouveauJoueur.nNumero);
					oClone.find('.szPseudo').text(oResponse.oNouveauJoueur.szPseudo);
					$('.liste_joueurs').append(oClone);
				}
				$.each(oResponse.aListeJoueurs, function(nIndex, oJoueur){
					if (oJoueur != null) {
						if ($('.liste_joueurs input.nIdJoueur[value='+oJoueur.nNumero+']').length == 0) {
							var oClone = $('.liste_joueurs .un_joueur.clone').clone();
							oClone.removeClass('clone');
							oClone.find('.nIdJoueur').val(oJoueur.nNumero);
							oClone.find('.szPseudo').text(oJoueur.szPseudo);
							$('.liste_joueurs').append(oClone);
						}
					} else {
						$('.liste_joueurs input.nIdJoueur[value='+Number(nIndex+1)+']').parent('.un_joueur').remove();
					}
					
				});
				//console.log('connexion du joueur '+oResponse.oNouveauJoueur.nNumero+' ( '+oResponse.oNouveauJoueur.szPseudo+' ).');
			} else if (typeof oResponse.oDeconnexionJoueur != 'undefined') {
				$('.liste_joueurs input.nIdJoueur[value='+oResponse.oDeconnexionJoueur.nNumero+']').parent('.un_joueur').remove();
				//console.log('déconnexion du joueur '+oResponse.oDeconnexionJoueur.nNumero+' ( '+oResponse.oDeconnexionJoueur.szPseudo+' ).');
			} else if (typeof oResponse.oNouvelleManche != 'undefined') {
				$('div.main div_carte:not(.clone)').remove();
				$('div.propositions div_carte:not(.clone)').remove();
				if (oResponse.oNouvelleManche.vous.bIsBoss === true) {
					$('div.main').hide();
					$('div.propositions').show();
					oThat.bIsBoss = true;
				} else {
					$('div.main').show();
					$('div.propositions').hide();
					oThat.bIsBoss = false;
				}

				oResponse.oNouvelleManche.vous.aMain.forEach(function(oCarte){
					var oClone = $('div.main div.div_carte.clone').clone();
					oClone.removeClass('clone');
					oClone.find('input.nIdCarte').val(oCarte.nIdCarte);
					oClone.find('span.face_carte').text(oCarte.szContenu);
					$('div.main').append(oClone);
				});
				oThat.vDynamiseCartes();
				$('div.pioche div.zone_depot').droppable({
					drop: function(e,ui){
						var oClone = $(this).find('.message_depot').clone();
						$(this).find('.message_depot').hide();
						oClone.find('span').text(ui.draggable.find('span.face_carte').text()).removeClass('.message_depot');
						$(this).append(oClone);
						ui.draggable.remove();
					}
				});
			}
		});
		socket.on('vous', function(oResponse){
			this.oJoueur = oResponse;
			$('.liste_joueurs input.nIdJoueur[value='+oResponse.nNumero+']').parent('.un_joueur').find('.szPseudo').text('Vous');
		});

		$('#szChat').on('keypress', function(e){
			if (e.which == 13) {
				if ($(this).val() != '') {
					var szMessage = $(this).val();
					$(this).val('');
					socket.emit('chat', {message : szMessage});
				}
			}
		});
		socket.on('chat', function(oData){
			var oZoneMessage = $('.liste_joueurs input.nIdJoueur[value='+oData.joueur.nNumero+']').parent('.un_joueur').find('.encaps_message');
			oZoneMessage.find(".szMessage").append('<div>'+oData.message+'</div>');
			//oZoneMessage.show();
			oZoneMessage.animate({
				height: '50px',
				width: '170px'
			}, 100);
			setTimeout(function() {
				//
				oZoneMessage.find(".szMessage div").first().remove();
				if (oZoneMessage.find('.szMessage').text() == '') {
					oZoneMessage.animate({
						height: '0px',
						width: '0px'
					}, 100);
				}
			}, 5000);
		});
	}

	this.vDynamiseCartes = function()
	{
		var oDivCarte = $('div.main div.carte');
		oDivCarte.unbind('click');
		oDivCarte.click(function(e){
			e.preventDefault();
			oThat.vAnimateCarte($('div.main div.carte:first'));
		});
	};

	this.vAnimateCarte = function(oCarte)
	{
		oCarte.unbind('click');
		oCarte.draggable({
			revert: "invalid"
		});
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