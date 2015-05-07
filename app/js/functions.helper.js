function isAudioAndMp3Supported(){
	
	var a = document.createElement('audio');
	
	var AudioAndMp3Support = !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
	
	if(!AudioAndMp3Support)
		return false;
	else
		return true;
}

function checkHiddenParentElement(domobject){
	
	if($(domobject).parent().css('display')=='none'){
		$(domobject).parent().css('display','block');
		return;
	}
	else{
		checkHiddenParentElement($(domobject).parent());
	}
}

function removeURLParameter(url, parameter){

  var fragment = url.split('#');
  var urlparts= fragment[0].split('?');

  if (urlparts.length>=2)
  {
    var urlBase=urlparts.shift(); //get first part, and remove from array
    var queryString=urlparts.join("?"); //join it back up

    var prefix = encodeURIComponent(parameter)+'=';
    var pars = queryString.split(/[&;]/g);
    for (var i= pars.length; i-->0;) {               //reverse iteration as may be destructive
      if (pars[i].lastIndexOf(prefix, 0)!==-1) {   //idiom for string.startsWith
        pars.splice(i, 1);
      }
    }
    url = urlBase+'?'+pars.join('&');
    if (fragment[1]) {
      url += "#" + fragment[1];
    }
  }
  return url;
}

//Extend jQuery's selector engine to find fixed navigation menu on top
$.extend($.expr[':'],{
    // absolute: function(el) {
        // return $(el).css('position') === 'absolute';
    // },
    // relative: function (el) {
        // return $(el).css('position') === 'relative';
    // },
    // static: function (el) {
        // return $(el).css('position') === 'static';
    // },
    fixed: function (el) {
        return $(el).css('position') === 'fixed';
    }
});

/*
 * adds the "http://" to the url entered by the user in case 
 * there is no protocol
 */

// jQuery(function($) {
	// $('input[name="url"]').blur(function(){
		// var link = $(this).val();
		// if ((link.length > 0) && (link.indexOf(':') == -1)) {
			// $(this).val('http://' + link);
		// }
	// });
// });


/*
 * checks if the url entered is valid
 */

function check_valid_url()
{
	var url = $.trim( $('#url.active').val() );
	
	if( url=='eap.gr' || url=='eap.gr/')
		url='www.eap.gr';

	if( url=='w3c.gr' || url=='w3c.gr/' || url=='w3.gr/' || url=='w3.gr')
		url='www.w3c.gr';
	
	
	if ( (url.length > 0) && ( (url.indexOf('://') == -1) && (url.indexOf('%3A%2F%2F') == -1) ) ) {
		$('#url.active').val('http://' + url.toLowerCase());
	}
	
	url = $.trim( $('#url.active').val() );
	
	var res = validate_url(url);
	
	if(res && (url != '')){	
		parent.SR.player.attr('src','audio/tictac.mp3');
		parent.SR.audio.play();
		return true;
	}
	else{
	
		console.log(res);
		console.log('Ήχος σφάλματος.');
		SR.playAudioFile('audio/error.mp3');
		//textToSpeech('Πληκτρολογείστε έγκυρο σύνδεσμο');
		setTimeout(function(){
			$('#url.url').val('').focus();
		},1500);
		return false;
	}
}

/*
 * url validation regex
 */

function validate_url(url) {
	return true;
	var checkvalidurl=$.inArray(url, SR.validURLs);
	
	if(checkvalidurl!=-1)
		return true;

	//Encode URL
	url_encoded = encodeURI(url);

	var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
	'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
	'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
	'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
	'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
	'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
	if(!pattern.test(url_encoded)) {
		return false;
	} 
	else {
		return true;
	}
}

function redirect(event, link)
{
		var anchor = isAnchorLink( $(link).attr ("href") );

		if ( anchor ){
		
			var sr_index = getAnchorSRindex(anchor);

			
			if(sr_index){
				parent.SR.speakNextElement('all',sr_index);
				return false;
			}
		
		}		
		
		parent.SR.player.attr('src','audio/tictac.mp3');
		parent.SR.audio.play();
		
		
		var href = link.href;
		
		 if( $(link).attr ("href") == 'javascript:history.go(-1);'){
			 parent.window.history.back();
			 return false;
		
		 }
		


		//Play the loading audio

		//parent.SR.showLoading();
			
		var _href = href.replace('http://login.proxy.eap.gr/login?url=','');
		
			
		event.preventDefault();
		var form = parent.document.getElementById("url_form");
		var input = parent.document.getElementById("url");
		input.value = _href;
		
		//Check if IE and encode URL	
		if(parent.SR.isIE())	
			input.value = encodeURI(_href);
	
		form.submit();
		return true;

}

function isAnchorLink(link){

	var parts = link.split('#', 2);
	var anchor = parts[1];
	return (anchor) ? anchor : false ;

}

function getAnchorSRindex(anchor){

	//In BBC there is no div with the specified ID
	
	var anchorObject = parent.SR.iFrame.contents().find("#"+anchor)

	var sr_index;
	
	//Check if anchor has own sr-index
	if( anchorObject.attr('sr-index') ){
		sr_index =  parseInt ( anchorObject.attr('sr-index') );
		return sr_index;
	}

	//Check parents for sr-index
	anchorObject.parents().each(function () {
		if( $(this).attr('sr-index') ){
			sr_index =  parseInt ( $(this).attr('sr-index') );
			return false;
		}
		
	});
	
	//Check siblings for sr-index
	anchorObject.siblings().each(function () {
		if( $(this).attr('sr-index') ){
			sr_index =  parseInt ( $(this).attr('sr-index') );
			return false;
		}
		
	});
	
	//Check children for sr-index
	$('*', anchorObject).each(function () {
		console.log($(this));
		if( $(this).attr('sr-index') ){
			sr_index =  parseInt ( $(this).attr('sr-index') );
			return false;
		}
		
	});
	
	//Check the siblings of the first parent
	anchorObject.parent().siblings().each(function () {
		
		if( $(this).attr('sr-index') ){
			sr_index =  parseInt ( $(this).attr('sr-index') );
			return false;
		}
		
	});

	return sr_index;

}