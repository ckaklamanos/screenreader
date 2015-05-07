var page = require('webpage').create();
page.settings.userAgent = 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.2.12) Gecko/20101026 Firefox/3.6.12';
page.settings.resourceTimeout = 30000;
var args = require('system').args;
var address = args[1] , basearg = args[2] , postdata = args[3];

page.onResourceTimeout = function(e) {
  console.log('timeouterror');
  phantom.exit(1);
};

page.onInitialized = function() {

	page.evaluate(function(base) {
		
		var head = document.getElementsByTagName("head")[0];
		var basetag = document.createElement('base');
		basetag.href = base;
		head.insertBefore(basetag, head.firstChild);
		
		var meta = document.createElement('meta');
		meta.httpEquiv  = 'Content-Type';
		meta.content = 'text/html; charset=utf-8';
		head.insertBefore(meta, head.firstChild);
		
	},basearg);
};

page.open(address, 'POST' , postdata, function (status) {

		page.includeJs('http://localhost/screenreader/libs/shortcut/shortcut.js', function() {});
		page.includeJs('http://localhost/screenreader/app/js/shortcuts.helper.js', function() {});

  		console.log(page.content);
		phantom.exit();
	
});