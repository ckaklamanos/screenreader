var page = new WebPage(), testindex = 0, loadInProgress = false;
var args = require('system').args;
var address = args[1] , basearg = args[2] , formaction = args[3] , formdata = args[4];
var pageobj = page;

page.settings.userAgent = 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.2.12) Gecko/20101026 Firefox/3.6.12';
page.settings.resourceTimeout = 30000;

formaction = decodeURI(formaction);
formaction = formaction.replace(/%2F/g, "/");
formaction = formaction.replace(/%3A/g, ":");
formaction = formaction.replace(/%3D/g, "=");
formaction = formaction.replace(/%3F/g, "?");
formaction = formaction.replace(/%2B/g, "+");
//formaction = formaction.replace(/&amp;/g, "&");

formdata  = formdata.replace(/%5B/g, "[");
formdata  = formdata.replace(/%5D/g, "]");
formdata  = formdata.replace(/%40/g, "@");

page.onResourceTimeout = function(e) {
  console.log('timeouterror');
  phantom.exit(1);
};

page.onConsoleMessage = function(msg) {
	console.log(msg);
};

page.onLoadStarted = function() {
	loadInProgress = true;
};

page.onLoadFinished = function() {
	loadInProgress = false;
};

var steps = [
  
	function() {
		//open the page
		//page.open(address);
		page.open(address, function (status) { 
	
				if (status !== 'success') {
					console.log('urlfailed');
					phantom.exit(1);
				}
				
			});
	},
	function(formdata) {

		//Fill in the form data
		page.evaluate(  function(formdata) {

			if(formdata){
				var formdata_array = formdata.split("&");

				for ( i=0 ; i< formdata_array.length ; i++) {
					
					var param = formdata_array[i];
					var param_array = param.split("=");
					
					if(param_array[0]&&param_array[1]){
						
						if(document.querySelector("input[name='"+param_array[0]+"']")){
							document.querySelector("input[name='"+param_array[0]+"']").value =  decodeURI ( param_array[1] );
						}
						else if(document.querySelector("select[name='"+param_array[0]+"']")){
							document.querySelector("select[name='"+param_array[0]+"']").value = decodeURI ( param_array[1] );
						}
						else if(document.querySelector("textarea[name='"+param_array[0]+"']")){
							document.querySelector("textarea[name='"+param_array[0]+"']").value = decodeURI ( param_array[1] );
						}					}
				}
			}
		} ,formdata );
	}, 
	function(formaction) {

		//Submit the form
		page.evaluate( function(formaction) {
			
			var input_submit = document.querySelector("input[name='submit']");
			if(input_submit)
				input_submit.parentNode.removeChild(input_submit);
			
			var form=document.querySelector("form[action='"+ formaction +"']");
		
			if (form)
				form.submit();

		} ,formaction );
	}, 
	function(pageobj) {

		//Include the needed js
		pageobj.includeJs('http://lib.eap.gr/reader/libs/shortcut/shortcut.js', function() {});
		pageobj.includeJs('http://lib.eap.gr/reader/app/js/shortcuts.helper.js', function() {});

		// Output content of page, after form has been submitted
		page.evaluate(function(pageobj) {
		
			var head = document.getElementsByTagName("head")[0];
			
			var basetag = document.createElement('base');
			basetag.href = pageobj.url;
			head.insertBefore(basetag, head.firstChild);
			
			var meta = document.createElement('meta');
			meta.httpEquiv  = 'Content-Type';
			meta.content = 'text/html; charset=utf-8';
			head.insertBefore(meta, head.firstChild);
			
			console.log(document.querySelectorAll('html')[0].outerHTML);
			console.log('<div id="phantomjs-data-final-url" style="display:none;">'+pageobj.url+'</div>');
		  
		},pageobj);
	}
];


interval = setInterval(function() {
  
	if (!loadInProgress && typeof steps[testindex] == "function") {

		if(testindex==0)
			steps[testindex]();
		if(testindex==1)
			steps[testindex](formdata);
		if(testindex==2)
			steps[testindex](formaction);
		if(testindex==3)
			steps[testindex](pageobj);
			
		testindex++;
	}
	if (typeof steps[testindex] != "function") {
		phantom.exit();
	}
}, 500);