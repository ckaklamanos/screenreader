var SR={};

SR.text={
	mp3_not_supported:'Screenreader - Ο browser δεν υποστηρίζει αναπαραγωγή αρχείων ήχου mp3.',
	mp3_file_not_exist:'Το αρχείο mp3 δεν υπάρχει.'
}

SR.xhr;

SR.voice='chrysostomos';

SR.duration=0;
SR.file_type='';
SR.current_number='-1';
SR.total_pages='-1';

SR.title='';
SR.hiddenElements={};

SR.all={
	nodes:[],
	index:-1
};

SR.headings={
	nodes:[],
	index:-1
};

SR.images={
	nodes:[],
	index:-1
};

SR.links={
	nodes:[],
	index:-1
};

SR.formelements={
	nodes:[],
	index:-1
};

SR.tables={
	nodes:[],
	index:-1
};

SR.validURLs=[
	"http://193.108.161.35/cgi-bin-EL/egwcgi/403884/query.egw;/-1+193.108.161.35:210/ADVANCE",
	"http://193.108.161.35/cgi-bin-EL/egwcgi/403884/search.egw/1+0"	
];

SR.isIE=function (){
	
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");
	
	if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  
		return true;
	else
		return false;

}

SR.getCustomPageOffset=function (){

	if( $('body').attr('datahost') == 'lib.eap.gr' )
		return -70;
	else	
		return 0;
}

SR.isFileAllowed=function(filetype){

	return (filetype=='pdf'||filetype=='epub'||filetype=='doc'||filetype=='docx'||filetype=='odt'||filetype=='txt')?true:false;

}

SR.timeoutRedirect  = function (){
	window.location.href = 'index.php?error=timeout';
}

SR.homeURL=function(){
	return parent.$('body').attr('data-host')+'/'+parent.$('body').attr('data-path');
}

SR.devMode=function(){
	return ($('body').attr('data-development_mode')=='1')?true:false;
}

SR.isHomePage=function(){
	return ($('body').attr('data-url'))?false:true;
}

SR.logNodes=function(){
	
	if(this.devMode()){
		console.log('ALL NODES------------------------------------------');
		console.log(this.all);
		// console.log('headings');
		// console.log(this.headings);
		// console.log('images');
		// console.log(this.images);
		//console.log('links');
		//console.log(this.links);
		//console.log('formelements');
		//console.log(this.formelements);
		// console.log('tables');
		// console.log(this.tables);
	}
}

SR.marqueeText=function(text){
	this.marquee.text(text);
}

SR.playAudioFile=function(url){
	
	var that=this;
	
	$.ajax({
		url:url,
		type:'HEAD',
		error: function(){
			if(that.devMode()) console.log(that.text.mp3_file_not_exist);	
		},
		success: function(){	
			that.player.attr('src',url);
			that.audio.loop=false;
			that.audio.play();		
		}
	});

}

SR.cacheStaticDOM=function(){
	var that=this;
	
	that.audio= $('#player')[0];
	that.player= $('#player');
	that.urlInputWrapper= $("#url_form_wrapper");
	that.urlInputFormHome= $("#url_form");
	that.urlInputHome= $("#url.active");
	that.eapLink= $("#link-eap");
	that.urlInputOther= $(".header #url.active");
	that.iFrame= $('#iframe');
	that.marquee=$("#speech_preview_text");
	that.loading=$("#loading-container");
	that.logo=$(".navbar-brand");
	that.splashMessage=$('#splash_message');
	that.splashMessageWrapper=$('#splash_message_wrapper');
	
}

SR.showHomeMessage=function(message){
	var that=this;
	$(document).attr('title', message);
	that.splashMessage.text(message);
	that.splashMessageWrapper.fadeIn(1000);

}

SR.hiddenParents=function(elm){
	
	var hiddenParents=[];
	elm.parents().each(function( k,v ) {
		if($(v).css('display')=='none')
			hiddenParents.push($(v));
	});

	return (hiddenParents[0])?hiddenParents[0]:false;
}

SR.hideLoading=function(){
	
	var that=this;
	
	that.loading.hide();
	that.logo.show();
	that.iFrame.stop().animate({
			opacity: 1
		}, 
		500, 
		function(){}
	);
}

SR.resetIndexes=function(){
	
	this.headings.index=-1;
	this.images.index=-1;
	this.links.index=-1;
	this.all.index=-1;
	
	this.iFrame.contents().find('.sr-highlight').removeClass('sr-highlight');
	this.iFrame.contents().find('html,body').animate({
			scrollTop: 0
		}, 
		'slow'
	);
}

SR.isPlaying=function(){
	return !this.player.paused && !this.player.ended && 0 < this.player.currentTime;
}

SR.showLoading=function(){

	this.loading.show();

	this.logo.hide();
	this.iFrame.stop().animate({
			opacity: 0.25
	  }, 
	  500, 
	  function() {}
	);
}

SR.getParamFromURL = function ( url , param ){

	var uri = new URI(url);
	
	return uri.query(true)[param];

}

SR.processHomePage=function(){
	
	var that=this;
	
	that.urlInputWrapper.fadeIn(1000);
	
	that.urlInputHome.val('');
	
	var error = that.getParamFromURL( window.location , 'error' ) ;
	
	if ( error == 'timeout' )
		that.textToSpeech('Σφάλμα timeout. Πληκτρολογήστε νέα διέυθυνση.');

	if ( error == 'urlfailed' )
		that.textToSpeech('Η διεύθυνση που ψάχνετε δεν είναι διαθέσιμη. Πληκτρολογήστε νέα διέυθυνση.');
	
	if ( error == 'invalidurl' )
		that.textToSpeech('Η διεύθυνση που ψάχνετε δεν είναι έγκυρη. Πληκτρολογήστε νέα διέυθυνση.');
		
	that.urlInputHome.focus(function() {
		if( !error )
			that.playAudioFile('audio/voices/'+that.voice+'/_001.mp3');
	});	
	
	//Speak help page based on cookie
	var first_visit_cookie = $.cookie('screenreader');
	
	if(!first_visit_cookie){
		that.playAudioFile('audio/voices/'+that.voice+'/_000.mp3');
		$.cookie('screenreader', '1');
		setTimeout(function(){
			that.urlInputHome.prop( "disabled", false );
			that.urlInputHome.focus();
		},4000);
	}else{
		that.urlInputHome.prop( "disabled", false );
		that.urlInputHome.focus();
	}
	
	that.eapLink.focus(function() {
		that.playAudioFile('audio/voices/'+that.voice+'/_005.mp3');
	});
	
	that.urlInputHome.keypress(function(event) {
		
		var charAudioFile='audio/voices/'+that.voice+'/chars/'+event.charCode+'.mp3';
		that.playAudioFile(charAudioFile);
		
		if(that.devMode()) console.log('Κωδικός χαρακτήρα: '+event.charCode );
	
	});
	
}

SR.processOtherPage=function(){
	
	var that=this;
	
	//URL input
	//On input click redirect to homepage
	that.urlInputOther.click(function() {
		window.location.href=SR.homeURL();
	});	
	//Fill input with the processed URL
	var fullURL=window.location.href;
	var processedURL = fullURL.replace(SR.homeURL()+'index.php?url=', "");//Remove SR URL and keep processed URL
	that.urlInputOther.val(decodeURIComponent(processedURL));
		
	//Play the loading audio
	that.player.attr('src','audio/tictac.mp3');
	that.audio.play();
	
	//iFrame has fully loaded
	that.iFrame.load(function(){
	

		//var iFrameContents=$iFrame.contents().find('.tm-toolbar');
		var iFrameContents=that.iFrame.contents();
		
		//Add custom css 
		// var custom_css = $('body').attr('custom-css');
		
		// if(custom_css)
			// $.each($.parseJSON(custom_css), function( index, value ) {
				// iFrameContents.find ("head").append("<link rel='stylesheet' href='"+value+"' type='text/css' media='screen'>");
			// });
	
		//Remove not needed elements
		//EAP offcanvas
		iFrameContents.find('#offcanvas,.uk-hidden-large').remove();		
		//EAP search page options
		//iFrameContents.find('#searchphraseall-lbl,#searchphraseany-lbl,#searchphraseexact-lbl,.uk-form #ordering,.uk-form .ordering,label[for="limit"]').remove();

		
		iFrameContents.find('head').prepend($("<link class='screenreader' rel='stylesheet' type='text/css' href='http://localhost/screenreader/app/css/iframe.css'>")); 

		//list view filters
		//iFrameContents.find('.filters').remove();	

		//recaptcha
		//iFrameContents.find('#recaptcha').remove();		
		
		iFrameContents.find('a').each(function () {
			
			if( $(this).attr('href') == '#' || $(this).attr('href') == '' || !$(this).attr('href') )
				$(this).attr('onclick','return false;');
					
			else
				$(this).attr('onclick','parent.redirect(event,this)');
		
		});	
		
		//display hidden elements, like a.main_menu_search
		iFrameContents.find('a.main_menu_search').removeClass('main_menu_search');
		
		//Accordion
		//iFrameContents.find('.fancypantsaccordionholder .acc-arrow').remove();
		iFrameContents.find('.fancypantsaccordionholder a').attr('onclick','');
		
		//Initialization only for files
		var file_type=iFrameContents.find('body').attr('file_type');
		
		//For files only
		if(SR.isFileAllowed(file_type)){
			
			var page_data=$.parseJSON(iFrameContents.find('body').attr('data'));
			var page_title=(page_data)?page_data.Title:iFrameContents.find('title').text();
			var current_page=iFrameContents.find('body').attr('current_page');
			var total_pages=iFrameContents.find('body').attr('total_pages');
			that.file_type=file_type;
			that.current_page=current_page;
			that.total_pages=total_pages;
			//console.log(iFrameContents);
			iFrameContents.find('title').text(page_title+' | Σελίδα '+current_page+' από '+total_pages);
		
		}
		
		//Build Nodes array
		buildNodesArrays(iFrameContents);
		
		that.logNodes();

		//EAP search, prevent form click
		iFrameContents.find('form button').attr('onclick','');

		//Fix lightbox forms
		
		iFrameContents.find('[class^="pwebcontact"]').each(function () {
			var link_class = $(this).attr('class');
			//console.log(link_class);
			var modal_form_id = '#'+link_class.replace("toggler", "form");
			//console.log(modal_form_id);
			var modal_form_elm = iFrameContents.find(modal_form_id);
			//console.log($(modal_form_elm));
			//console.log($(modal_form_elm).attr('sr-index'));
			$(this).attr('onclick', 'parent.SR.speakNextElement("all",'+$(modal_form_elm).attr('sr-index')+')');
		});
	
		//Build iframe events
		//iFrameContents.find('*').on('keypress focus submit mouseenter change',function(event) {
		iFrameContents.find('*').on('keypress focus submit change',function(event) {
			
			var nodeName=$(this)[0].nodeName;
			
			var sr_index=parseInt($(this).attr('sr-index'));
			
			// if(event.type=='mouseenter'&&sr_index){
				
				// if(sr_index&&that.all.nodes[sr_index].text){
					
					// that.all.index=sr_index;
					// //Cannot use scroll to element, we just highlight, because the page scrolls in a confusing way
					// iFrameContents.find('.sr-highlight').removeClass('sr-highlight');
					// var domobject=that['all'].nodes[sr_index].object[0];
					// $(domobject).addClass('sr-highlight');
					
					// that.textToSpeech(that['all'].nodes[sr_index].text);
					
				// }
			// }
			
			if(event.type=='focus'){
			
				if(sr_index){
					that.scrollToElement('all',sr_index);
					that.all.index=sr_index;
					that.textToSpeech(that['all'].nodes[sr_index].text);
					
					console.log(sr_index);
					console.log(that['all'].nodes[sr_index]);
					
					if(nodeName=='SELECT'){
						var childNodes=$(this)[0].childNodes;
						//console.log(childNodes);
						//console.log(childNodes.length);
						//$(this).attr('size',childNodes.length);
					}
					
				}
				else{
					//Check if any of child elements has sr_index
					var childNodes=$(this)[0].childNodes;
					
					$( childNodes ).each(function( index ) {
						var _sr_index=$(this).attr('sr-index');
						if(_sr_index){
							that.scrollToElement('all',_sr_index);
							that.all.index=_sr_index;
							that.textToSpeech(that['all'].nodes[_sr_index].text);
							return false;
						}
					});
				}
							
			}
			
			if( nodeName == 'FORM' || nodeName == 'form'){
				
				var form = $(this);
				

				if( event.type =='submit' ){

					//$(this).attr('onsubmit','');
					event.preventDefault();

					if( $(this).attr('method') == 'get' || $(this).attr('method') == 'GET' || $(this).attr('method') == '' || !$(this).attr('method') ){
						
						var formdatastring =  form.serialize() ;
						

						if(formdatastring=='region=W3C+By+Region')
							return;

						var url = $(this).attr("action");
						var home_url = parent.location.href.split('?')[0];
						var action = $(this).attr("action");
						
						if(action.indexOf('://')>-1)
							var redirect_url = home_url + '?url=' + $(this).attr("action") + '?' +formdatastring ;
						else{
							var slash = ( action.substring(0, 1) == '/') ? '' : '/';
							
							var redirect_url = home_url + '?url=' + $('body').attr('datascheme') +'://'+ $('body').attr('datahost') + slash + $(this).attr("action") + '?' +formdatastring ;
						
						}
						
						console.log(redirect_url);

						parent.location.href = redirect_url;
					}
					
					if( $(this).attr('method') == 'POST' || $(this).attr('method') == 'post' ){
						
                        var parent_form = $("#url_form");
                        var input = $("#url");
						var action = $(this).attr("action");
						
						$.each(form.find(':input'), function() {
							
							var newinput = $(this);
							
							if(newinput.attr('type')!='submit'){
								parent_form.append(newinput.clone().hide());   
							}
                        });
						
						input.val(action);
					
                        parent_form.attr('method', 'post');
						console.log(parent_form);
						return false;
                        parent_form.submit();
						return false;
						
						// if(form.attr('action') == 'http://lib.eap.gr/el/%CF%80%CE%BB%CE%B7%CF%81%CE%BF%CF%86%CE%BF%CF%81%CE%AF%CE%B5%CF%82/%CE%B5%CF%80%CE%B9%CE%BA%CE%BF%CE%B9%CE%BD%CF%89%CE%BD%CE%AE%CF%83%CF%84%CE%B5-%CE%BC%CE%B5-%CE%AD%CE%BD%CE%B1-%CE%B2%CE%B9%CE%B2%CE%BB%CE%B9%CE%BF%CE%B8%CE%B7%CE%BA%CE%BF%CE%BD%CF%8C%CE%BC%CE%BF.html'){	
							// that.showLoading();
							// var formdata=form.serializeArray();
							
							// if(!formdata[1].value || !formdata[2].value || !formdata[4].value || !formdata[5].value || !formdata[6].value ){
								// that.textToSpeech('Δεν έχετε συμπληρώσει όλα τα απαιτούμενα πεδία. Πατήστε αριστερό βελάκι για να επανέλθετε στη φόρμα.');
								// return;
							// }
								
							
							// $.ajax({
								// type: "post",
								// url: $('body').attr('data-host')+'/'+$('body').attr('data-path')+"/app/php/contactform.php",
								// data: formdata,
								// datatype: "jsonp",
								// success: function( response ) { that.hideLoading(); console.log('Mail function initiated');console.log(response);if(response=='Message has been sent.') that.textToSpeech('Το Μήνυμα εστάλει και θα σας απαντήσουμε το συντομότερο δυνατόν.');},
								// error: function (xhr, ajaxOptions, thrownError) {that.hideLoading(); console.log('Mail function not initiated'); that.textToSpeech('Το Μήνυμα δεν εστάλει. Παρακαλούμε προσπαθήστε ξανά.');}
							// });
						// }else{
							// that.textToSpeech('Η λειτουργία δεν υποστηρίζεται.');
						// }
					}
				}
			}
			
			if(nodeName=='SELECT'){
				if(event.type=='change'){
				
					//var val = $(this).val() ;
					that.textToSpeech( $(this).children('option:selected').text());
				}
			}
			
			
			if(nodeName=='INPUT'||nodeName=='TEXTAREA'){
				if(event.type=='keypress'){
					
					if(that.devMode()) console.log('Κωδικός χαρακτήρα: '+event.charCode );
					
					var char_url='audio/voices/'+that.voice+'/chars/'+event.charCode+'.mp3';
					that.playAudioFile(char_url);

					}
				
				if(event.type=='focus'){
					that.all.index=sr_index;
				}
			}
		
		});

		that.player.attr('src','');
		that.hideLoading();
		that.animateMarqueeText();
		
		var href = window.location.href;
		var parts = href.split('%23', 2);
		var hash = parts[1];
		//console.log(hash);

		if(!hash){
			SR.speakNextElement('all',-1);
		}
		else{
		
			var _parent = iFrameContents.find('#'+hash).parent();

			_parent.find('*').each(function () {
				var _srindex = $(this).attr('sr-index');
				if(_srindex){
					
					SR.speakNextElement('all',parseInt(_srindex)-1 );
					return false;
				}
			});

			var __parent = iFrameContents.find('#'+hash).parent().parent();

			__parent.find('*').each(function () {
				var _srindex = $(this).attr('sr-index');
				if(_srindex){
					
					SR.speakNextElement('all',parseInt(_srindex)-1 );
					return false;
				}
			});
			
			// iFrameContents.find('#'+hash).each(function () {
				// var _srindex = $(this).siblings().attr('sr-index');
				// if(_srindex){
					
					// SR.speakNextElement('all',parseInt(_srindex)-1 );
					// return false;
				// }
			// });

			// iFrameContents.find('#'+hash+' *').each(function () {
				// var _srindex = $(this).attr('sr-index');
				// if(_srindex){
					// SR.speakNextElement('all',parseInt(_srindex)-1 );
					// return false;
				// }
			// });			

			// iFrameContents.find('#'+hash).parent().each(function () {
				// var _srindex = $(this).attr('sr-index');
				// if(_srindex){
					
					// SR.speakNextElement('all',parseInt(_srindex)-1 );
					// return false;
				// }
			// });

			
		}
		
		that.iFrame.focus();
		//document.getElementById('iframe').contentWindow.focus();
	
	});
	

}

SR.animateMarqueeText=function(){
	
	var that=this;

	that.marquee.hover(
		function () {
			$(this).stop().animate({
				textIndent: "-" + ($(this).width() - $(this).parent().width()) + "px"  
			}, that.duration*1000);  
		}, 
		function () {
			$(this).stop().animate({
				textIndent: "0"           
			}, 0);  
		}
	);
}

SR.speakNextElement=function(group,index){
	
	var that=this;
	
	if(that[group].nodes.length==0)
		return false;
	
	//console.log(that[group].nodes[index+1]);
	
	if(!that[group].nodes[index+1]){
		that[group].index=-1;
		that.speakNextElement(group,that[group].index);	
		return false;
	}
	
	//Remove focus from any element
	document.activeElement.blur();
	//Empty marquee
	that.marqueeText('');
	
	//Cache this and parent object
	//console.log(that[group].nodes[index+1]);
	var domobject= ( that[group].nodes[index+1].object[0] ) ? that[group].nodes[index+1].object[0] : that[group].nodes[index+1].object.context;
	//console.log(domobject);
	var parentObject=$(domobject)[0].parentNode;
	var parentObjectNodeName=$(parentObject)[0].nodeName;

	//Hide hiddenElements again and reset SR.hiddenElements
	if(SR.hiddenElements){
		$.each(SR.hiddenElements, function( index, value ) {
			$(value).hide();
		});
		SR.hiddenElements={};
	}
	
	//Show hiddenElements and register to SR.hiddenElements
	var hiddenParents=SR.hiddenParents($(domobject));
	//console.log(hiddenParents);
	if(hiddenParents){
		SR.hiddenElements=hiddenParents;
		$.each(hiddenParents, function( index, value ) {
			$(value).show();
		});
	}
	
	// if($(domobject)[0].nodeName=='OPTION')
		// $(domobject).parents('select').focus();
	
	
	//Focus object or parent link
	if( parentObjectNodeName == 'A' || parentObjectNodeName=='BUTTON' ){
		$(parentObject).focus();
	}
	else if(parentObjectNodeName=='SELECT'){
		$(parentObject).focus();
		$(domobject).attr('selected','selected');	
	}
	else
		$(domobject).focus();
	
	var hasfocus=$(domobject).is(":focus");
	//If object has actually received focus then let onfocus event take care, else continue
	if(!hasfocus){
		that.scrollToElement(group,index+1);
		that.textToSpeech(that[group].nodes[index+1].text);
		console.log(index+1);
	}
	
	//Update nodes indexes
	that[group].index=index+1;
	that.all.index=that[group].nodes[index+1].allindex;
	
	return false;
}

SR.speakPreviousElement=function(group,index){
	
	var that=this;
	
	
	if(that[group].nodes.length==0)
		return false;
		
	if(!that[group].nodes[index-1]){
		that[group].index=that[group].nodes.length;
		that.speakPreviousElement(group,that[group].index);
		return false;
	}
	
	//Remove focus from any element
	document.activeElement.blur();
	//Empty marquee
	that.marqueeText('');
		
	//Cache this and parent object

	//console.log(that[group].nodes);
	//console.log(that[group].nodes[index+1]);
	//console.log(index);

	
	//console.log(index);
	
	var domobject = ( that[group].nodes[index-1].object[0] ) ? that[group].nodes[index-1].object[0] : that[group].nodes[index-1].object.context;
	var parentObject=$(domobject)[0].parentNode;
	var parentObjectNodeName=$(parentObject)[0].nodeName;

	//Hide hiddenElements again and reset SR.hiddenElements
	if(SR.hiddenElements){
		$.each(SR.hiddenElements, function( index, value ) {
			$(value).hide();
		});
		SR.hiddenElements={};
	}
	
	//Show hiddenElements and register to SR.hiddenElements
	var hiddenParents=SR.hiddenParents($(domobject));
	//console.log(hiddenParents);
	if(hiddenParents){
		SR.hiddenElements=hiddenParents;
		$.each(hiddenParents, function( index, value ) {
			$(value).show();
		});
	}


	//Focus object or parent link
	if( parentObjectNodeName=='A' || parentObjectNodeName=='BUTTON' )
		$(parentObject).focus();
	else
		$(domobject).focus();
	
	var hasfocus=$(domobject).is(":focus");
	//If object has actually received focus then let onfocus event take care, else continue
	if(!hasfocus){
		that.scrollToElement(group,index-1);
		that.textToSpeech(that[group].nodes[index-1].text);
		
	}
	
	//Update nodes indexes
	that[group].index=index-1;
	that.all.index=that[group].nodes[index-1].allindex;
	
	return false;
}



SR.scrollToElement=function(group,index){
	
	var that=this;
	
	index = parseInt(index);

	var domobject = ( that[group].nodes[index].object[0] ) ? that[group].nodes[index].object[0] : that[group].nodes[index].object.context ;
		
	that.iFrame.contents().find('.sr-highlight').removeClass('sr-highlight');
	
	var custompageoffset = that.getCustomPageOffset();
	
	var topoffset= ( $(domobject)[0].nodeName =='#text' ) ? $(domobject).parent().offset().top + custompageoffset : $(domobject).offset().top + custompageoffset;
	// console.log('----------------------------------');
	// console.log($(domobject));
	// console.log($(domobject).offset());
	// console.log(topoffset);
	
	that.iFrame.contents().find('html,body').stop().animate({
		scrollTop: topoffset
	}, 'slow');	
	

	
	//console.log($(domobject));
	
	if (	
			$(domobject)[0].nodeName == 'H1' || 
			$(domobject)[0].nodeName == 'H2' || 
			$(domobject)[0].nodeName == 'H3' || 
			$(domobject)[0].nodeName == 'H4' || 
			$(domobject)[0].nodeName == 'H5' || 
			$(domobject)[0].nodeName == 'H6' ||
			$(domobject)[0].nodeName == 'INPUT' ||
			$(domobject)[0].nodeName == 'IMG' ||
			$(domobject)[0].nodeName == 'A' 
		){
			$(domobject).addClass('sr-highlight');
	}
	else if ($(domobject)[0].nodeName == '#text' ){
			$(domobject).wrap('<span/>');
			
			$(domobject).parent('span').addClass('sr-highlight');
	}
	else{
	
		$(domobject).parent().addClass('sr-highlight');
		
	}

	
	
}

SR.textToSpeech=function(text){
	
	var that=this;
	
	that.showLoading();
	that.marqueeText('');
	that.player.unbind('ended');
	that.player.unbind('loadedmetadata');
	
	//Abort any previous ajax request
	if(that.xhr && that.xhr.readyState != 4){
		
		if(that.devMode()) console.log(that.xhr);
        
		that.xhr.abort();
		
		if(that.devMode()) console.log('Previous xhr request aborted.');
		
    }

	that.player.attr('src','audio/tictac.mp3');
	that.audio.loop=true;	
	that.audio.play();	
			
	var encoded=encodeURIComponent(text).replace('/%20/g','+');
	console.log('Start xhr.');
	that.xhr=$.ajax({
		url: "app/php/tts.eap.helper.php?txt="+text,
		success: function(data) {
		
			if(data.substring(0,4)=='http')
				that.player.attr('src',data);	
			else
				that.player.attr('src',"app/php/tts.eap.helper.php?txt="+text);	
				
			that.player.bind("loadedmetadata", function(_event) {
				
				that.audio.pause();
				that.audio.currentTime = 0;
				that.hideLoading();	
				that.duration= this.duration;
				that.audio.play();
				that.audio.loop=false;
				that.marqueeText(text);
				that.marquee.css('text-indent','0px').trigger('mouseenter');

				if(that.devMode()) console.log('Now playing: '+text);					
			
			});

			that.player.bind('ended', function () {
				
				that.audio.loop=true;
				that.marqueeText('');
				that.player.unbind('ended');
				that.player.unbind('loadedmetadata');
			
			});
			
			//This is for testing purposes when the browser does not support mp3			
			if(that.devMode()&&!isAudioAndMp3Supported()){				
				that.hideLoading();
				that.marqueeText(text);
				that.marquee.css('text-indent','0px').trigger('mouseenter');
				console.log('Now playing: '+text);
			}
		
		},
		error:function(){
			console.log(that.audio);
			
			that.audio.pause();
			if(that.audio.readyState!=0)
				that.audio.currentTime = 0;
			
			that.hideLoading();
			that.marqueeText('');
			
			console.log('Error on ajax request.');
		
		}
	});
}