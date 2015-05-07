$(document).ready(function() {
	
	//Cache static DOM elements------------------------------
	SR.cacheStaticDOM();
	
	//Homepage-----------------------------------------------
	if(SR.isHomePage()){
		
		//Check HTML5 and Audio/MP3 browser support
		if(!SR.devMode()&&!isAudioAndMp3Supported()){
			SR.showHomeMessage(SR.text.mp3_not_supported);
			return;
		}
		
		SR.processHomePage();
		
		return;
	}
	
	//Other Page----------------------------------------------
	if(!SR.devMode()&&!isAudioAndMp3Supported()){
		window.location.href=SR.homeURL();
		return;
	}
	
	SR.processOtherPage();

});