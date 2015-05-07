var page = require('webpage').create();
var args = require('system').args;
var address = args[1] ;
var timeout = args[2] ;

page.settings.userAgent = 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.2.12) Gecko/20101026 Firefox/3.6.12';
page.settings.resourceTimeout = 30000;

page.onResourceTimeout = function(e) {
  console.log('timeouterror');
  phantom.exit(1);
};

phantom.outputEncoding = 'utf8';
page.open( address, function (status) {

	if (status !== 'success') {
		console.log('urlfailed');
		phantom.exit(1);
	}
	else{	
		window.setTimeout(function () {
			console.log('@'+encodeURI(page.url));
			phantom.exit(1);
		}, timeout);
	}
});