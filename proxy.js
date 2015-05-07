var page = require('webpage').create();
var args = require('system').args;
var address = args[1] , basearg = args[2];

page.settings.userAgent = 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.2.12) Gecko/20101026 Firefox/3.6.12';
page.settings.resourceTimeout = 30000;	

page.onResourceTimeout = function(e) {
  console.log('timeouterror');
  phantom.exit(1);
};

page.onInitialized = function() {

	page.evaluate(function(base) {
		
		var head = document.getElementsByTagName("head")[0];

		var meta = document.createElement('meta');
		meta.httpEquiv  = 'Content-Type';
		meta.content = 'text/html; charset=utf-8';
		head.insertBefore(meta, head.firstChild);
		
		
		var basetag = document.createElement('base');
		basetag.href = base;
		head.insertBefore(basetag, head.firstChild);
		
	},basearg);
};

var split_address = address.split('?', 2); if ( split_address[1] && split_address[1] !='') { address = split_address[0]+'?'+ decodeURIComponent(split_address[1])}

page.open( address , function (status) { //protothema search needs decodeURIComponent(address)
	
	if (status !== 'success') {
		console.log('urlfailed');
		phantom.exit(1);
	}
	else{
		page.includeJs('http://lib.eap.gr/screenreader/libs/shortcut/shortcut.js', function() {});
		page.includeJs('http://lib.eap.gr/screenreader/app/js/shortcuts.helper.js', function() {});

  		console.log(page.content);
		phantom.exit();
	}
	
});
