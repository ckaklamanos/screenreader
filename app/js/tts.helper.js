var nodeParams = {

	'#text'		: { 'pretext': '' 				, 'posttext' : '' },
	'H1'		: { 'pretext': 'Επικεφαλίδα 1: ' 				, 'posttext' : '' },
	'H2'		: { 'pretext': 'Επικεφαλίδα 2: ' 				, 'posttext' : '' },
	'H3'		: { 'pretext': 'Επικεφαλίδα 3: ' 				, 'posttext' : '' },
	'H4'		: { 'pretext': 'Επικεφαλίδα 4: ' 				, 'posttext' : '' },
	'H5'		: { 'pretext': 'Επικεφαλίδα 5: ' 				, 'posttext' : '' },
	'H6'		: { 'pretext': 'Επικεφαλίδα 6: ' 				, 'posttext' : '' },

	'CAPTION'	: { 'pretext': 'Λεζάντα: ' 						, 'posttext' : '' },
	'TD'		: { 'pretext': 'Κελί: ' 						, 'posttext' : '' },

	'A' 		: { 'pretext': 'Σύνδεσμος: ' 					, 'posttext' : '' },
	
	'EM'		: { 'pretext': 'Κείμενο με έμφαση: ' 			, 'posttext' : '' },
	'STRONG'	: { 'pretext': 'Κείμενο με bold: ' 				, 'posttext' : '' },
	'ABBR'		: { 'pretext': 'Συντομογραφία: ' 				, 'posttext' : '' },
	'Q'			: { 'pretext': 'Κείμενο σε εισαγωγικά: ' 		, 'posttext' : '' },
	'INS'		: { 'pretext': 'Επιπρόσθετο κείμενο: ' 			, 'posttext' : '' },
	'CODE'		: { 'pretext': 'Πηγαίος κώδικας: ' 				, 'posttext' : '' },
	'ACRONYM'	: { 'pretext': 'Ακρωνύμιο: ' 					, 'posttext' : '' },
	'DEL'		: { 'pretext': 'Σβησμένο κείμενο: ' 			, 'posttext' : '' },
	'BLOCKQUOTE': { 'pretext': 'Κείμενο σε εισαγωγικά: ' 		, 'posttext' : '' },
	'CITE'		: { 'pretext': 'Παράθεση: ' 					, 'posttext' : '' },

	'B' 		: { 'pretext': 'Κείμενο με bold: ' 				, 'posttext' : '' },
	'BIG' 		: { 'pretext': 'Μεγάλο κείμενο: ' 				, 'posttext' : '' },
	'DFN' 		: { 'pretext': 'Ορισμός: ' 						, 'posttext' : '' },
	'FONT' 		: { 'pretext': 'Γραμματοσειρά: ' 				, 'posttext' : '' },
	'I' 		: { 'pretext': 'Πλάγια γραφή: ' 				, 'posttext' : '' },
	'KBD' 		: { 'pretext': 'Εισαγωγή πληκτρολογίου: ' 		, 'posttext' : '' },
	'S' 		: { 'pretext': 'Κείμενο που δεν ισχύει: ' 		, 'posttext' : '' },
	'SAMP' 		: { 'pretext': 'Φράση: ' 						, 'posttext' : '' },
	'SMALL' 	: { 'pretext': 'Μικρό κείμενο: ' 				, 'posttext' : '' },
	'SPAN' 		: { 'pretext': '' 	, 'posttext' : '' },
	'STRIKE' 	: { 'pretext': 'Διεγραμμένο κείμενο: ' 			, 'posttext' : '' },
	'SUB' 		: { 'pretext': 'Δείκτης: ' 						, 'posttext' : '' },
	'SUP' 		: { 'pretext': 'Εκθέτης: ' 						, 'posttext' : '' },
	'TT' 		: { 'pretext': 'Κείμενο Teletype: ' 			, 'posttext' : '' },
	'VAR' 		: { 'pretext': 'Μεταβλητή: ' 					, 'posttext' : '' },
	'U' 		: { 'pretext': 'Υπογραμμισμένο κείμενο: ' 		, 'posttext' : '' },
	
	'IMG'		: { 'pretext': 'Εικόνα: ' 						, 'posttext' : '' },
	
	'LEGEND'	: { 'pretext': 'Λεζάντα: ' 						, 'posttext' : '' },
	'LABEL'		: { 'pretext': 'Ετικέτα: ' 						, 'posttext' : '' },
	'BUTTON'	: { 'pretext': '' 								, 'posttext' : ' Πατήστε Enter για υποβολή φόρμας.'	},
	'TEXTAREA'	: { 'pretext': 'Πληκτρολογήστε στο πεδίο εισαγωγής κειμένου.' 								, 'posttext' : ''	}

};

nodeParams.getPreText=function (nodeName){
		
		var pretext = ( this[nodeName] && this[nodeName]['pretext'] ) ? this[nodeName]['pretext'] : '' ;
		return pretext;
}

nodeParams.getPostText=function (nodeName){

		var posttext = ( this[nodeName] && this[nodeName]['posttext'] ) ? this[nodeName]['posttext'] : '' ;
		return posttext;
}

//Function that loops over all the child elements of the submitted object in order to build the node array
function buildNodesArrays(object){
	
	var NODE=object[0];

	if(SR.isIE)
		fn_normalize(NODE);

	var childNodes=NODE.childNodes;
	var childNodesLength=NODE.childNodes.length;
	
	buildNodeArray(NODE);	
	
	for (var i=0;i<childNodesLength;i++)
	{ 	
		var childNode=$(childNodes[i]);
		
		if(childNode[0].childNodes.length==0)
			buildNodeArray(childNode[0]);
		else
			buildNodesArrays(childNode);
	}
	
}

function buildNodeArray(NODE){

	var nodedata=getNODEdata(NODE);

	if(!nodedata)
		return;
	
	var text=nodedata.text;

	//Suppress phantomjs warnings
    var shibbolethWarning = 'ran insecure content';
   
    if( text.indexOf(shibbolethWarning) !=-1 ){
        NODE.data='';
        return;   
    }
	
	var facebookWarningEN = 'This is a browser feature intended for';
   
    if( text.indexOf(facebookWarningEN) !=-1 ){
        NODE.data='';
        return;   
    }
	
	var facebookWarningEL = 'Είναι μια δυνατότητα προγράμματος περιήγησης';
   
    if( text.indexOf(facebookWarningEL) !=-1 ){
        NODE.data='';
        return;   
    }

	var phantomjsWarning = 'Unsafe JavaScript attempt to access frame with URL';
	
	if( text.indexOf(phantomjsWarning) !=-1 ){
		NODE.data='';
		return;	
		
	}

	var phantomjsUndefinedWarning = "TypeError: 'undefined'";
	if( text.indexOf(phantomjsUndefinedWarning) !=-1 ){
		NODE.data='';
		return;	
		
	}

	var phantomjsReferenceErrorWarning = "ReferenceError: Can't find variable";
	if( text.indexOf(phantomjsReferenceErrorWarning) !=-1 ){
		NODE.data='';
		return;	
		
	}
	
	//Suppress strings defined in tts.config.js
	if( $.inArray(text, suppressedText) !=-1 )
		return;
	
	//If parent node is hidden, return false
	if( $(NODE).parent().css('display')=='none' && $(NODE).parent()[0].nodeName != 'TITLE' )
		return;
	
	if($(NODE)[0].nodeType==3){
		
		//SOS θελει έλεγχο!!!!!!!!!!!!!!!!!!!!!!!!!!
		//$(NODE).parent().attr('sr-index',SR.all.nodes.length);
		//Doing the spanwrap in advance
		//$(NODE).wrap('</span>').parent().attr('sr-index',SR.all.nodes.length);
		$(NODE).parent().attr( 'sr-index' , SR.all.nodes.length );
	}
	else{
		
		$(NODE).attr('sr-index',SR.all.nodes.length);
	}
	
	var cacheobj = {
		'text' : text,
		'node' : NODE,
		'data' : nodedata
	};
	
	$.each( nodedata.group, function( key, value ) {
		if(SR[value])
			SR[value]['nodes'].push(nodedata);
	});
	
	return;
}

function getNODEdata(NODE){

    var nodedata={};
	nodedata.group={};
	
	//nodedata.parentHeadingObject = parentHeadingElement($(NODE));	
	//if(nodedata.parentHeadingObject)
		//nodedata.group.headings = 'headings';
	
	nodedata.parentLinkObject = parentLinkElement($(NODE));
	nodedata.parentSpanObject = parentSpanElement($(NODE));
	//if(nodedata.parentLinkObject)
		//nodedata.group.links = 'links';

	nodedata.parentButtonObject = parentButtonElement($(NODE));
	if(nodedata.parentButtonObject)
		nodedata.group.formelements = 'formelements';	

	if( $(NODE)[0].nodeName!="#document" && $(NODE).parent()[0].nodeName == "NOSCRIPT"){
		return false;
	}

	if( $(NODE).nodeName == "SCRIPT"){
		return false;
	}
	
	if( nodedata.parentLinkObject.length == 0 ){
		return false;
	}


	
	if( isHeadingbyNodeName( $(NODE)[0].nodeName ) != -1  ){
	

		var headingText = $.trim( $(NODE).text() );
		
		if( headingText == ''){
			var childImage = getChildImage($(NODE));
			if (childImage)
				headingText = getIMGText(childImage);
		}
			
		
		if( headingText =='' )
			return false;
			
		nodedata.text = headingText;
			
		nodedata.allindex=SR.all.nodes.length;
		nodedata.nodeName = $(NODE)[0].nodeName ;
		nodedata.object=$(NODE);
		nodedata.group.all='all';
		nodedata.group.headings='headings';

		return nodedata;
		
	}
	
	
	if($(NODE)[0].nodeName=="A"){
		
		var linkText = $.trim( $(NODE).text() );
		
		if( linkText ==''){
			var childImage = getChildImage($(NODE));
			if (childImage)
				linkText = getIMGText(childImage);
		}
			
		
		if( linkText =='' )
			return false;
			
		nodedata.text = linkText;
			
		nodedata.allindex=SR.all.nodes.length;
		nodedata.nodeName = "A";
		nodedata.object=$(NODE);
		nodedata.group.all='all';
		nodedata.group.links='links';

		return nodedata;
		
	}

	if($(NODE)[0].nodeName=="SPAN"){

		// nodedata.text = $.trim( $(NODE).text() );
		// if( nodedata.text =='' )
			// return false;
			
		// nodedata.allindex=SR.all.nodes.length;
		// nodedata.nodeName = "SPAN";
		// nodedata.object=$(NODE);
		// nodedata.group.all='all';

		// return nodedata;
		
	}
	
	
	if($(NODE)[0].nodeName=="IMG"){

		nodedata.text = getIMGText(NODE);
	
		nodedata.allindex=SR.all.nodes.length;
		nodedata.nodeName = "IMG";
		nodedata.object=$(NODE);
		nodedata.group.all='all';
		nodedata.group.images='images';

		return nodedata;
		
	}


	if( $(NODE)[0].nodeName == "SELECT" && $(NODE).attr('type')!= 'hidden' ){

		nodedata.text = 'Λίστα επιλογών. Πατήστε άνω-κάτω βέλος για να ακούσετε τις επιλογές.';
		nodedata.allindex=SR.all.nodes.length;
		nodedata.nodeName = "SELECT";
		nodedata.object=$(NODE);
		nodedata.group.all='all';
		nodedata.group.formelements='formelements';

		return nodedata;
		
	}

	if( $(NODE)[0].nodeName == "TEXTAREA" && $(NODE).attr('type')!= 'hidden' ){

		nodedata.text = 'Πληκτρολογήστε στο πεδίο εισαγωγής κειμένου.' + $(NODE).text();
		nodedata.allindex=SR.all.nodes.length;
		nodedata.nodeName = "TEXTAREA";
		nodedata.object=$(NODE);
		nodedata.group.all='all';
		nodedata.group.formelements='formelements';

		return nodedata;
		
	}
	
	if( $(NODE)[0].nodeName == "INPUT" && $(NODE).attr('type')!= 'hidden' ){
		
		var required = ( $(NODE).attr('required') ) ? 'Υποχρεωτικό πεδίο. ' : '' ;
		var title = ( $(NODE).attr('title') ) ? $(NODE).attr('title') : '' ;
		
		if ( $(NODE).attr('type')== 'submit' ){
		
			nodedata.text = 'Πατήστε Enter για υποβολή φόρμας';
		}
		else if ( $(NODE).attr('type') == 'radio' ){
		
			nodedata.text = required + 'Πεδίο radio button. Πατήστε space για επιλογή.';
		}
		else if ( $(NODE).attr('type') == 'text' ){
			
			
			var placeholder = $.trim($(NODE).attr('placeholder'));
			
			if(title)
				nodedata.text = required + 'Πληκτρολογήστε ' + title;
			else if (placeholder)
				nodedata.text = required + 'Πληκτρολογήστε ' + placeholder;
			else{
				nodedata.text = required + 'Πληκτρολογήστε στο Πεδίο Κειμένου';
			}
		
		}
		else if ( $(NODE).attr('type') == 'email' ){
		
			var placeholder = $.trim($(NODE).attr('placeholder'));
			
			if(placeholder)
				nodedata.text = required +'Πληκτρολογήστε: ' + placeholder;
			else{
				nodedata.text = required +'Πληκτρολογήστε e-mail.';
			}
		
		}
		else  if ( $(NODE).attr('type') == 'textarea' ){
		
			var placeholder = $.trim($(NODE).attr('placeholder'));
			
			if(placeholder)
				nodedata.text = required +'Πληκτρολογήστε: ' + placeholder;
			else{
				nodedata.text = required +'Πληκτρολογήστε στο Πεδίο Κειμένου.';
			}
		
		}
		else  if ( $(NODE).attr('type') == 'search' ){
		
			nodedata.text = required +'Πληκτρολογήστε όρο αναζήτησης.';
		
		}
		else  if ( $(NODE).attr('type') == 'url' ){
		
			nodedata.text = required +'Πληκτρολογήστε διεύθυνση URL.';
		
		}
		else  if ( $(NODE).attr('type') == 'password' ){
		
			nodedata.text = required +'Πληκτρολογήστε Κωδικό.';
		
		}
		else if ( $(NODE).attr('type') == 'checkbox' ){
		
			nodedata.text = required + 'Πεδίο checkbox. Πατήστε space για επιλογή.';
		}
		else if ( $(NODE).attr('type') == 'button' ){
		
			nodedata.text = required + 'Πατήστε Enter για υποβολή.';
		}
		else{
		
			nodedata.text = required + 'Πεδίο φόρμας';
		}
		
	
		nodedata.allindex=SR.all.nodes.length;
		nodedata.nodeName = "INPUT";
		nodedata.object=$(NODE);
		nodedata.group.all='all';
		nodedata.group.formelements='formelements';

		return nodedata;
		
	}	
	
	
	if( NODE.nodeName == "OL"){
		
		nodedata.text = 'Αριθμημένη λίστα';
		nodedata.allindex=SR.all.nodes.length;
		nodedata.nodeName = "OL";
		nodedata.object=$(NODE);
		nodedata.group.all='all';

		return nodedata;	
	}

	if( NODE.nodeName == "UL"){
		
		nodedata.text = 'Μη Αριθμημένη λίστα';
		nodedata.allindex=SR.all.nodes.length;
		nodedata.nodeName = "UL";
		nodedata.object=$(NODE);
		nodedata.group.all='all';

		return nodedata;	
	}

	if( NODE.nodeName == "DL"){
		
		nodedata.text = 'Λίστα ορισμών';
		nodedata.allindex=SR.all.nodes.length;
		nodedata.nodeName = "DL";
		nodedata.object=$(NODE);
		nodedata.group.all='all';

		return nodedata;	
	}

	if( NODE.nodeName == "DT"){
		
		nodedata.text = 'Όρος';
		nodedata.allindex=SR.all.nodes.length;
		nodedata.nodeName = "DT";
		nodedata.object=$(NODE);
		nodedata.group.all='all';

		return nodedata;	
	}
	
	if( NODE.nodeName == "DT"){
		
		nodedata.text = 'Όρος';
		nodedata.allindex=SR.all.nodes.length;
		nodedata.nodeName = "DT";
		nodedata.object=$(NODE);
		nodedata.group.all='all';

		return nodedata;	
	}
	
	if( NODE.nodeName == "BLOCKQUOTE"){
		
		nodedata.text = 'Κείμενο σε εισαγωγικά';
		nodedata.allindex=SR.all.nodes.length;
		nodedata.nodeName = "BLOCKQUOTE";
		nodedata.object=$(NODE);
		nodedata.group.all='all';

		return nodedata;	
	}

	if( NODE.nodeName == "CITE"){
		
		nodedata.text = 'Παράθεση';
		nodedata.allindex=SR.all.nodes.length;
		nodedata.nodeName = "CITE";
		nodedata.object=$(NODE);
		nodedata.group.all='all';

		return nodedata;	
	}

	if( NODE.nodeName == "TABLE"){
		
		var summary=$.trim(NODE.summary);
		if (summary)
			nodedata.text = 'Πίνακας: '+summary;
		else
			nodedata.text = 'Πίνακας';
		nodedata.allindex=SR.all.nodes.length;
		nodedata.nodeName = "TABLE";
		nodedata.object=$(NODE);
		nodedata.group.all='all';

		return nodedata;	
	}

	if( NODE.nodeName == "THEAD"){
		

		nodedata.text = 'Επικεφαλίδα Πίνακα';
		nodedata.allindex=SR.all.nodes.length;
		nodedata.nodeName = "THEAD";
		nodedata.object=$(NODE);
		nodedata.group.all='all';

		return nodedata;	
	}
	
	if( NODE.nodeName == "TFOOT"){
		

		nodedata.text = 'Υποκεφαλίδα Πίνακα';
		nodedata.allindex=SR.all.nodes.length;
		nodedata.nodeName = "TFOOT";
		nodedata.object=$(NODE);
		nodedata.group.all='all';

		return nodedata;	
	}
	
	if( NODE.nodeName == "TBODY"){
		

		nodedata.text = 'Σώμα Πίνακα';
		nodedata.allindex=SR.all.nodes.length;
		nodedata.nodeName = "TBODY";
		nodedata.object=$(NODE);
		nodedata.group.all='all';

		return nodedata;	
	}
	
	if( NODE.nodeName == "TR"){
		

		nodedata.text = 'Γραμμή Πίνακα';
		nodedata.allindex=SR.all.nodes.length;
		nodedata.nodeName = "TR";
		nodedata.object=$(NODE);
		nodedata.group.all='all';

		return nodedata;	
	}

	if( NODE.nodeName == "P"){
		

		nodedata.text = 'Παράγραφος';
		nodedata.allindex=SR.all.nodes.length;
		nodedata.nodeName = "P";
		nodedata.object=$(NODE);
		nodedata.group.all='all';

		return nodedata;	
	}

	if( NODE.nodeName == "FORM"){
		

		nodedata.text = 'Φόρμα';
		nodedata.allindex=SR.all.nodes.length;
		nodedata.nodeName = "FORM";
		nodedata.object=$(NODE);
		nodedata.group.all='all';
		nodedata.group.formelements='formelements';

		return nodedata;	
	}
	

	
	if( NODE.nodeName == "#text" && NODE.data && $.trim(NODE.data)!='' && $(NODE).parent()[0].nodeName !='OPTION'  ){
		
		var textNodeParentLink  = parentLinkElement($(NODE));
		var textNodeParentSpan  = parentSpanElement($(NODE));
		var textNodeParentTextarea  = parentTextareaElement($(NODE));
		var textNodeParentHeading  = parentHeadingElement($(NODE));

		if( textNodeParentLink === false && textNodeParentSpan === false && textNodeParentTextarea === false && textNodeParentHeading === false){
		
			nodedata.text=$.trim(NODE.data);
			nodedata.allindex=SR.all.nodes.length;
			nodedata.nodeName = "#text";
			nodedata.object=$(NODE);
			nodedata.group.all='all';

			if( nodedata.text!='' )
				return nodedata;
			
		}
	}
	
	return false;
	
}


function getChildImage(node){

	var childImages = node.children('img');
	
	var image = false;
	
	childImages.each( function () {
		image = $(this);
		return false;
	});
	
	return image;
}

function parentLinkElement(node){

	var parentLink = node.closest('a');
	
	if( parentLink === node)
		return false;
		
	if(parentLink.length!=0){
		return parentLink;
	}
	else
		return false;

}

function parentSpanElement(node){

	var parentSpan = node.closest('span');
	
	if( parentSpan === node)
		return false;
		
	if(parentSpan.length!=0){
		return parentSpan;
	}
	else
		return false;

}

function parentTextareaElement(node){

	var parentTextarea = node.closest('textarea');
	
	if( parentTextarea === node)
		return false;
		
	if(parentTextarea.length!=0){
		return parentTextarea;
	}
	else
		return false;

}

function parentHeadingElement(node){

	var parentHeading = node.closest('h1,h2,h3,h4,h5,h6');
	//console.log('--------------------------------');
	//console.log(parentHeading);
	if( parentHeading === node)
		return false;
		
	if(parentHeading.length!=0){
		return parentHeading;
	}
	else
		return false;

}

// function parentHeadingElement(node){

	// var parentHeading = node.closest('h1,h2,h3,h4,h5,h6');
	
	// if(parentHeading.length!=0){
		// return parentHeading;
	// }
	// else
		// return false;

// }

function parentButtonElement(node){

	var parentButton = node.closest('button');
	
	if(parentButton.length!=0){
		return parentButton;
	}
	else
		return false;

}

function getIMGText(img){
	
	var text;
	
	var title=$.trim( $(img).attr('title'));
	
	if( title !='' )
		text = title;
	else{
		
		var alt=$.trim($(img).attr('alt'));
		
		if( alt !='' )
			text = alt;
		else
			text = 'Χωρίς Τίτλο';
	}
	
	return text;
		
}

function isHeadingbyNodeName(name){

	return $.inArray( name, [ 'H1', 'H2' , 'H3' , 'H4' , 'H5' , 'H6' ] );
	
}


//Custom node normalization fucntion to remove white space betweeen text nodes in IE, causing many text nodes.
function fn_normalize(node) {
    var child = node.firstChild, nextChild;
    while (child) {
        if (child.nodeType == 3) {
            while ((nextChild = child.nextSibling) && nextChild.nodeType == 3) {
                child.appendData(nextChild.data);
                node.removeChild(nextChild);
            }
        } else {
            fn_normalize(child);
        }
        child = child.nextSibling;
    }
}


