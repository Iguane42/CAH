/**
 * Gestion de l'affichage de la partie.
 */
function Partie()
{
	Core.apply(this, arguments);
	oThat = this;
	this.bIsBoss = false;
	this.oLoader = new Loader();
	this.oMessage = new Message();
	
	/**
	 * Initialisation de la partie.
	 * 
	 * @return {void} 
	 */
	this.vInit = function()
	{
		var socket = io('http://192.168.33.10:8888');
		this.oLoader.vOuvreCalque('En attente de joueurs...');
		socket.on('update', function (oResponse) {
			console.log(oResponse);
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
			} else if (typeof oResponse.oDeconnexionJoueur != 'undefined') {
				$('.liste_joueurs input.nIdJoueur[value='+oResponse.oDeconnexionJoueur.nNumero+']').parent('.un_joueur').remove();
			} else if (typeof oResponse.oNouvelleManche != 'undefined') {
				$('div.pioche .carte_noire .face_carte').text(oResponse.oNouvelleManche.oCarteNoire.szContenu);
				$('div.pioche .carte_noire .nIdCarte').val(oResponse.oNouvelleManche.oCarteNoire.nIdCarte);

				if ($('div.pioche .carte_noire span.face_carte').is(':visible') === true) {
					oThat.vAnimateCarte($('div.pioche .carte_noire'),false);
				}
				oThat.oLoader.vFermeCalque();
				var aCartes = [];
				$('div.main .div_carte:not(.clone) .animee').each(function(oElem){
					aCartes.push($(this).find('.nIdCarte').val());
				});
				$('div.main .div_carte:not(.clone)').remove();
				$('div.propositions .div_carte:not(.clone)').remove();
				if (oResponse.oNouvelleManche.vous.bIsBoss === true) {
					oThat.oLoader.vOuvreCalque('Vous êtes le boss, En attente des autres Joueurs...');
					$('div.main').hide();
					$('div.propositions').show();
					oThat.bIsBoss = true;
				} else {
					$('div.main').show();
					$('div.propositions').hide();
					oThat.bIsBoss = false;
				}
				$.each(oResponse.oNouvelleManche.aJoueurs, function(nCompteur, oJoueur){
					console.log(oJoueur);
					var szStatut = 'Réfléchit...';
					if (oJoueur.bIsBoss == true) {
						szStatut = 'BOSS';
					}
					$('.liste_joueurs input.nIdJoueur[value='+oJoueur.nNumero+']').parent('.un_joueur').find('.szStatut').text(szStatut);
				});
				$('div.main div.div_carte.clone').find('span.face_carte').hide();
				$('div.main div.div_carte.clone').find('span.dos_carte').show();
				oResponse.oNouvelleManche.vous.aMain.forEach(function(oCarte){
					var oClone = $('div.main div.div_carte.clone').clone();
					oClone.removeClass('clone');
					oClone.find('input.nIdCarte').val(oCarte.nIdCarte);
					oClone.find('span.face_carte').text(oCarte.szContenu);
					aCartes.forEach(function(nIdCarte){
						if (nIdCarte == oCarte.nIdCarte) {
							oClone.find('div.carte').addClass("animee");
							oClone.find('span.face_carte').show();
							oClone.find('span.dos_carte').hide();
						}
					});
					$('div.main').append(oClone);
				});
				if ($('div.pioche .carte_noire span.face_carte').is(':visible') === false || oThat.bIsBoss === false) {
					oThat.vAnimateCarte($('div.pioche .carte_noire'),false);
				}
				
				oThat.vDynamiseCartes();
				if (oThat.bIsBoss === false) {
					$('div.pioche div.zone_depot').droppable({
						drop: function(e,ui){
							var oClone = $(this).find('.message_depot').clone();
							$(this).find('.message_depot').hide();
							oClone.find('span.face_carte').text(ui.draggable.find('span.face_carte').text());
							oClone.removeClass('.message_depot').addClass('carte_jouee');
							$(this).append(oClone);
							var nIdCarteJouee = ui.draggable.find('.nIdCarte').val();
							ui.draggable.remove();
							oThat.oLoader.vOuvreCalque('En attente des autres Joueurs');
							socket.emit('action', {nIdCarteJouee: nIdCarteJouee})
						}
					});
				}
				
			} else if (typeof oResponse.nNumJoueurAJoue != 'undefined') {
				if (typeof oResponse.aCartesJouees != 'undefined') {

					$('div.propositions div_carte:not(.clone)').remove();
					$.each(oResponse.aCartesJouees, function(nIndex, oCarteJouee){
						console.log(oCarteJouee);
						var oClone = $('div.propositions .clone').clone();
						oClone.removeClass('clone');
						oClone.find('.nIdCarte').val(oCarteJouee.nIdCarte);
						oClone.find('.face_carte').text(oCarteJouee.szContenu);
						$('div.propositions').append(oClone);
					});
					$('div.main').hide();
					$('div.propositions').show();
					oThat.oLoader.vFermeCalque();
					if (oThat.bIsBoss === true) {
						$('div.pioche .message_depot span').text('Déposez la meilleure carte ici.');
						$('div.propositions .carte').draggable();
						$('div.pioche div.zone_depot').droppable({
							drop: function(e,ui){
								var oClone = $(this).find('.message_depot').clone();
								$(this).find('.message_depot').hide();
								oClone.find('span.face_carte').text(ui.draggable.find('span.face_carte').text());
								oClone.removeClass('.message_depot').addClass('carte_jouee');
								$(this).append(oClone);
								var nIdCarteElue = ui.draggable.find('.nIdCarte').val();
								ui.draggable.remove();
								//oThat.oLoader.vOuvreCalque('En attente des autres Joueurs');
								socket.emit('action', {nIdCarteElue: nIdCarteElue})
							}
						});
					} else {
						oThat.oLoader.vOuvreCalque('En attente du boss...');
					}
				}
				$('.liste_joueurs input.nIdJoueur[value='+oResponse.nNumJoueurAJoue+']').parent('.un_joueur').find('.szStatut').text('A joué.');
			} else if (typeof oResponse.oVainqueurManche != 'undefined') {
				oThat.oLoader.vFermeCalque();
				$('div.pioche .carte_jouee').remove();
				$('div.pioche .message_depot').show();
				$('div.pioche .message_depot span.face_carte').hide();
				$('div.pioche .message_depot span.dos_carte').show();
				$('div.pioche .message_depot span.face_carte').text(oResponse.oCarteElue.szContenu);
				oThat.vAnimateCarte($('div.pioche .message_depot'), false);
				var szMessage = '';
				if (oResponse.oVainqueurManche.nNumero == oThat.oJoueur.nNumero) {
					szMessage = 'Vous avez ';
				} else {
					szMessage = oResponse.oVainqueurManche.szPseudo+' a ';
				}
				szMessage += 'gagné la manche.';
				oThat.oMessage.vAfficher(szMessage);
				var oGagnant = $('.liste_joueurs input.nIdJoueur[value='+oResponse.oVainqueurManche.nNumero+']').parent('.un_joueur');
				while (oGagnant.find('.point_score.plein').length < oResponse.oVainqueurManche.nNbPoints) {
					oGagnant.find('.point_score.vide:first').removeClass('vide').addClass('plein').prop('src', '/point-plein.png');
					
					break;
				}
			} else if (typeof oResponse.bFinPartie != 'undefined') {
				if (oResponse.bFinPartie === true) {
					var szNom = "";
					if (oResponse.oVainqueur.nNumero == oThat.oJoueur.nNumero) {
						szNom = "Vous avez";
					} else {
						szNom = oResponse.oVainqueur.szPseudo+ " a";
					}
					oThat.oLoader.vOuvreCalque(szNom + " gagné la partie !");
					setTimeout(function(){
						oThat.oLoader.vFermeCalque();
						location.reload();
					}, 8000);
				}
			}
		});
		socket.on('vous', function(oResponse){
			oThat.oJoueur = oResponse;
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
				height: '5vh',
				width: '100%'
			}, 100);
			setTimeout(function() {
				//
				oZoneMessage.find(".szMessage div").first().remove();
				if (oZoneMessage.find('.szMessage').text() == '') {
					oZoneMessage.animate({
						height: '0%',
						width: '0%'
					}, 100);
				}
			}, 5000);
		});
	}

	/**
	 * Dynamisation des cartes de la main.
	 * 
	 * @return {void} 
	 */
	this.vDynamiseCartes = function()
	{
		var oDivCarte = $('div.main div.div_carte:not(.clone) div.carte');
		oDivCarte.draggable({
			revert: "invalid"
		});
		oDivCarte.unbind('click');
		oDivCarte.click(function(e){
			e.preventDefault();

			oDivCarte.unbind('click');
			
			oThat.vAnimateCarte($('div.main div.div_carte:not(.clone):first div.carte'), true);
		});
	};

	/**
	 * Animer une carte.
	 * 
	 * @param  {object}  oCarte    Carte à animer.
	 * @param  {boolean} bRecursif Mode récursif (pour la main).
	 * 
	 * @return {void}           
	 */
	this.vAnimateCarte = function(oCarte, bRecursif)
	{
		if (bRecursif === false || !(oCarte.hasClass('animee'))) {
			var oDivCarte = oCarte;
			oDivCarte.animate({
				width: '0px',
				padding: '1vh 0px 1vh 0px',
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
							width: '16vh',
							padding: '1vh',
						}, 30, function(){
							if (bRecursif) {
								$(this).addClass('animee');	
								var oNewCard = $(this).parent('div.div_carte').next('div.div_carte').find('div.carte');
								if (oNewCard.length > 0) {
									oThat.vAnimateCarte(oNewCard, true);
								}
							}
						});
					});
				});
			});
		} else if (bRecursif === true) {
			var oNewCard = oCarte.parent('div.div_carte').next('div.div_carte').find('div.carte');
			console.log(oNewCard);
			if (oNewCard.length > 0) {
				oThat.vAnimateCarte(oNewCard, true);
			}
		}
		
	}
}