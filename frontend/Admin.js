function Admin()
{
	Core.apply(this, arguments);
	oThat = this;

	this.vInit = function(){

		this.vGetListeCartes(1);
	};

	this.vGetListeCartes = function(nNumPage){
		$('#form_ajout_carte .btn_ajout').unbind('click');
		$('#form_ajout_carte .btn_ajout').click(function(e){
			var szData = 'szContenu=' + $('#form_ajout_carte .szContenu').val() + '&szType=' + $('#form_ajout_carte .szType').val()
			$.ajax({
				method: 'POST',
				url: '/edit',
				data: szData,
				success: function(szReponseJSON){
					oReponseJSON = JSON.parse(szReponseJSON);
					if (typeof oReponseJSON.szSucces != 'undefined') {
						alert(oReponseJSON.szSucces);
						oThat.vGetListeCartes(nNumPage);
						oThat.vViderFormulaire($('#form_ajout_carte'));
					}
				}
			});
		});
		$.ajax({
			method: 'POST',
			url: '/liste',
			data: 'nNumPage='+nNumPage,
			success: function(szReponseJSON) {
				oReponseJSON = JSON.parse(szReponseJSON);
				$('#liste_cartes > tbody tr:not(.clone)').remove();
				var aLignes = [];
				$.each(oReponseJSON.aCartes, function(nIndex, oCarte){
					var oClone = $('#liste_cartes > tbody tr.clone').clone();
					oClone.removeClass('clone');
					oClone.find('input.nIdCarte').val(oCarte.nIdCarte);
					oClone.find('td.nIdCarte').text(oCarte.nIdCarte);
					oClone.find('input.szContenu').val(oCarte.szContenu);
					oClone.find('select.szType').val(oCarte.szType);
					oClone.find('.btn_modif').unbind('click');
					oClone.find('.btn_modif').click(function(e){
						e.preventDefault();
						var szData = "";
						var aParams = [];
						$(this).parent('td').parent('tr').find('input:not([type="button"])').each(function(){
							var szValue = $(this).val();
							var szParam = $(this).attr('name') + "=" + szValue;
							aParams.push(szParam);
						});
						$(this).parent('td').parent('tr').find('select').each(function(){
							var szValue = $(this).val();
							var szParam = $(this).attr('name') + "=" + szValue;
							aParams.push(szParam);
						})
						szData += aParams.join('&');
						$.ajax({
							method: 'POST',
							url: '/edit',
							data: szData,
							success: function(szReponseJSON){
								oReponseJSON = JSON.parse(szReponseJSON);
								if (typeof oReponseJSON.szSucces != 'undefined') {
									alert(oReponseJSON.szSucces);
									oThat.vGetListeCartes(nNumPage);
								}
							}
						});
					});
					oClone.find('.btn_suppr').unbind('click');
					oClone.find('.btn_suppr').click(function(e){
						e.preventDefault();
						var szData = "nIdCarte=" + $(this).parent('td').parent('tr').find('.nIdCarte').val();
						$.ajax({
							method: 'POST',
							url: '/delete',
							data: szData,
							success: function(szReponseJSON){
								oReponseJSON = JSON.parse(szReponseJSON);
								if (typeof oReponseJSON.szSucces != 'undefined') {
									alert(oReponseJSON.szSucces);
									oThat.vGetListeCartes(nNumPage);
								}
							}
						});
					});
					aLignes.push(oClone);
				});
				$('#liste_cartes > tbody').append(aLignes);
				var nDebut = 1;
				var nFin = 5;
				var nPage = Number(oReponseJSON.nNumPage);
				var oPagination = $('#pagination');
				if (oReponseJSON.nNbPages > 5) {
					if (nPage - 2 >= 1) {
						nDebut = nPage - 2;
					} else {
						nDebut = 1;
					}
					nFin = nDebut + 4;
					if (nFin > oReponseJSON.nNbPages) {
						nFin = oReponseJSON.nNbPages;
						nDebut = nFin - 4;
					}
				} else {
					nFin = oReponseJSON.nNbPages;
				}
				if (nDebut == 1) {
					oPagination.find('.first').hide();
				} else {
					oPagination.find('.first').show();
					oPagination.find('.first').unbind('click');
					oPagination.find('.first').click(function(e){
						e.preventDefault();
						oThat.vGetListeCartes(1);
					});
				}
				if (nFin == oReponseJSON.nNbPages) {
					oPagination.find('.last').hide();
				} else {
					oPagination.find('.last').show();
					oPagination.find('.last').unbind('click');
					oPagination.find('.last').click(function(e){
						e.preventDefault();
						oThat.vGetListeCartes(oReponseJSON.nNbPages);
					});
				}
				if (nPage == 1) {
					oPagination.find('.previous').hide();
				} else {
					oPagination.find('.previous').show();
					oPagination.find('.previous').unbind('click');
					oPagination.find('.previous').click(function(e){
						e.preventDefault();
						oThat.vGetListeCartes(nPage - 1);
					});
				}
				if (nPage == oReponseJSON.nNbPages) {
					oPagination.find('.next').hide();
				} else {
					oPagination.find('.next').show();
					oPagination.find('.next').unbind('click');
					oPagination.find('.next').click(function(e){
						e.preventDefault();
						oThat.vGetListeCartes(nPage + 1);
					});
				}
				oPagination.find('.page_number:not(.clone)').remove();
				var aPagination = [];
				for (i=nDebut; i <= nFin; i++) {
					var oClone = oPagination.find('.page_number.clone').clone();
					oClone.removeClass('clone');
					oClone.text(i);
					oClone.unbind('click');
					if (i != nPage) {
						oClone.click(function(e){
							e.preventDefault();
							var nCible = Number($(this).text());
							oThat.vGetListeCartes(nCible);
						});
					} else {
						oClone.addClass('selected');
					}
					aPagination.push(oClone);
				}
				oPagination.find('.page_number.clone').after(aPagination);
				
			}
		});
	};
}