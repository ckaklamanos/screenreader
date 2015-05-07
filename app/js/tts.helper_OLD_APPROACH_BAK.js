//Function that loops over all the child elements of the submitted object in order to build the node array
function buildNodesArrays(object){
	
	var NODE=object[0];
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
	
	nodedata.text='';
	nodedata.allindex=0;
	nodedata.nodeName='';
	nodedata.group={};
	nodedata.object=$(NODE);
	nodedata.group.all='all';
	
	var text='';
	var nodename='';
	var parentElement=$(NODE).parent();
	var parentElementObj=$(parentElement);

	var parentParentElementObj=$(parentElementObj).parent();
	if($(parentParentElementObj)[0])
	var parentParentElementObjNodeName=$(parentParentElementObj)[0].nodeName;
	

		
		
	if(NODE.nodeName=="#text"&&NODE.data){
		text=$.trim(NODE.data);
		//if(text)
			//$(NODE).wrap('<span/>');
		//console.log($(NODE));
		nodedata.object=$(NODE).parent('span');
	}
	
	if($(NODE)[0].nodeName=="IMG"){

		text='Εικόνα';
		
		var title=$.trim(NODE.title);
		if(title)
			text=text+': '+title;
		
		var alt=$.trim(NODE.alt);
		if(alt&&alt!=title)
			text=text+': '+alt;
		
		// console.log('-----------------------------');
		// console.log(SR.all.nodes.length);
		// console.log(SR.all.nodes[SR.all.nodes.length-1]);
		// console.log(text);	
		// console.log($(NODE));	
		nodedata.group.images='images';
		nodedata.object=$(NODE);
		
	}



	
	if($(NODE)[0].nodeName=="OPTGROUP"){

		text='Γκρουπ επιλογών';
		
		var label=$.trim($(NODE).attr('label'));
		if(label)
			text=text+': '+label;
	}
		
	if($(NODE)[0].nodeName=="INPUT"){

		if(	$(NODE).attr('type')=="hidden")
			return text='';

		var text='Πληκτρολογείστε';
		
		var value=$.trim($(NODE).val());
		var placeholder=$.trim($(NODE).attr('placeholder'));
		
		if(value)
			text=value;
		
		if(placeholder)
			text=text+' '+placeholder;
			
		var alt=$.trim($(NODE).attr('alt'));
		
		if(alt&&alt!=value)
			text=text+', '+alt;
			
		nodedata.group.formelements='formelements';

	}
	
	if($(NODE)[0].nodeName=="TEXTAREA"){
	
		text='Πληκτρολογείστε στο πεδίο εισαγωγής κειμένου: '+$.trim($(NODE).attr('placeholder'));
		nodedata.group.formelements='formelements';
	}
	
	if($(NODE)[0].nodeName=="FORM"){
		
		
		text='Φόρμα';
		nodedata.group.formelements='formelements';
	}
		
	if($(NODE)[0].nodeName=="SELECT"){
	
		// if($(NODE).attr('id')=='limit'){
			// $(NODE).remove();
			// return;
		// }

		var label= ($(NODE).parent().siblings('label').text());
		text='Επιλογή ';
		if(label)
			text=text+label+'. ';
			
		var options=$(NODE).children();
		var first_option=options[0].text;
		
		if(first_option)
			text=text+'Πρώτη επιλογή '+first_option+'. Πατήστε άνω-κάτω βέλος για λοιπές επιλογές.';
		
		nodedata.group.formelements='formelements';
	}
	
	if($(NODE)[0].nodeName=="UL")
		text='';	
		//text='Unordered list';	
	
	if($(NODE)[0].nodeName=="OL")
		text='';	
		//text='Ordered list';	
	
	//if($(NODE)[0].nodeName=="LI")
		//text='Αριθμός'+text;

	if($(NODE)[0].nodeName=="STYLE")
		text='';		

	if($(NODE)[0].nodeName=="SCRIPT"||$(NODE)[0].nodeName=="script")
		text='';
			
	if(!$.trim(text))
		return;
	
	var parentElementName=$(parentElement).prop("nodeName");

	if(parentElementName=="H1"||parentElementName=="H2"||parentElementName=="H3"||parentElementName=="H4"||parentElementName=="H5"||parentElementName=="H6"){
		nodedata.group.headings='headings';
		nodedata.object=parentElementObj;
	}

	if(parentElementName=="H1")
		text='Επικεφαλίδα 1: '+text;	
	if(parentElementName=="H2")
		text='Επικεφαλίδα 2: '+text;	
	if(parentElementName=="H3")
		text='Επικεφαλίδα 3: '+text;		
	if(parentElementName=="H4")
		text='Επικεφαλίδα 4: '+text;	
	if(parentElementName=="H5")
		text='Επικεφαλίδα 5: '+text;
	if(parentElementName=="H6")
		text='Επικεφαλίδα 6: '+text;

	//Check if IE	
	if(/*@cc_on!@*/false){	
		
	}

	if(parentElementName=='A'){
		
		var check_href=$(parentElement)[0].href;
		
		if($(parentElement)[0].href==''||$(parentElement)[0].href=='#')
			text=text;
		else if ( $(NODE)[0].nodeName=="IMG" && $(NODE)[0].alt=='' && $(NODE)[0].title=='' ){
			text='';
		}
		else{
			
			if(check_href.indexOf("mailto")!=-1)
				text='Σύνδεσμος email: '+text;	
			
			else if(check_href.indexOf("tel")!=-1)
				text=text;	
			
			else if(check_href.indexOf("fax")!=-1)
				text=text;	
			else
				text='Σύνδεσμος: '+text;		
		
			nodedata.group.links='links';
			nodedata.object=parentElementObj;
		}	

			
	}

	if(parentElementName=='BLOCKQUOTE')
		text='Blockquote: '+text;	
	
	if(parentElementName=='QUOTE')
		text='Blockquote: '+text;	

	if(parentElementName=='NOSCRIPT')
		text='';		
	
	if(parentElementName=='STYLE')
		text='';
	
	if(parentElementName=='OPTION'){
		return;
	}
	
	if(parentElementName=='P'){
		//return;
	}
	
	if(parentElementName=='LI'){

		if($.trim(text)!='.'&&$.trim(text)!=')'){
			if($(NODE).parent('span').index()==0)//If I do not use this, then all text will get the index in advance
				text=($(parentElement).index()+1)+'. '+text;
		}
	}
	
	if(parentElementName=='SCRIPT'||parentElementName=='script')
		text='';
	
	if(parentElementName=='TITLE'){

	
		text = text;
	}
	if(parentElementName=='VAR')
		text='Μεταβλητή: '+text;		
	
	if(parentElementName=='BUTTON'){
		text='Κουμπί: '+text;	
		nodedata.group.formelements='formelements';
	}
	

	//Parent is a HEADING ----------------------------------------------------------------------
	//If parent is a heading, add to headings array 
	if(parentParentElementObjNodeName=="H1"||parentParentElementObjNodeName=="H2"||parentParentElementObjNodeName=="H3"||parentParentElementObjNodeName=="H4"||parentParentElementObjNodeName=="H5"||parentParentElementObjNodeName=="H6")
		 nodedata.group.headings='headings';
	//Then add the heading label
	if(parentParentElementObjNodeName=="H1")
		text='Επικεφαλίδα 1: '+text;	
	if(parentParentElementObjNodeName=="H2")
		text='Επικεφαλίδα 2: '+text;	
	if(parentParentElementObjNodeName=="H3")
		text='Επικεφαλίδα 3: '+text;		
	if(parentParentElementObjNodeName=="H4")
		text='Επικεφαλίδα 4: '+text;	
	if(parentParentElementObjNodeName=="H5")
		text='Επικεφαλίδα 5: '+text;
	if(parentParentElementObjNodeName=="H6")
		text='Επικεφαλίδα 6: '+text;
	
	//Parent is a LINK ----------------------------------------------------------------------
	//If parent is a heading, add to headings array	
	//Then add the link label
	if(parentParentElementObjNodeName=="A"){
		console.log(parentParentElementObjNodeName);
		nodedata.group.links='links';
		text='Σύνδεσμος: '+text;
	}
	
	nodedata.text=text;
	nodedata.nodeName=$(NODE)[0].nodeName;

	nodedata.allindex=SR.all.nodes.length;
	
	if(text=='Επικεφαλίδα 2: Σύνδεσμος: Linked Data')
		{
		
		console.log(nodedata);
		
		}
	return nodedata;

}

