//Insert
shortcut.add("Insert",function() {
	
		if(parent.SR.isHomePage())
			parent.window.location.href=parent.SR.homeURL()+'index.php?url='+parent.SR.homeURL()+'templates/static/help.html';
		else
			parent.window.location.href=parent.SR.homeURL();
	
	},
	{
		'type':'keydown',
		'propagate':false,
		'target':document
	}
);

//ESC
shortcut.add("Esc",function() {
	
	//Abort any previous ajax request
	if(parent.SR.xhr && parent.SR.readyState != 4){
		
        parent.SR.xhr.abort();
		parent.SR.hideLoading();
		parent.SR.player.attr('src','');

		if(parent.SR.devMode()) console.log(parent.SR.xhr); 
    }
	
	if(parent.SR.isPlaying())
		parent.SR.player.attr('src','');
	
	
	},
	{
		'type':'keydown',
		'propagate':false,
		'target':document
	}
);

//Home
shortcut.add("Home",function() {

		parent.SR.resetIndexes();

		parent.SR.speakNextElement('all',-1);
		
	},
	{
		'type':'keydown',
		'propagate':false,
		'target':document
	}
);


//All
//Next element from All
shortcut.add("Right",function() {

		var group='all';
		var index=parent.SR[group].index;
		parent.SR.speakNextElement(group,index);
		
	},
	{
		'type':'keydown',
		'propagate':false,
		'target':document
	}
);



//Previous Element from All
shortcut.add("Left",function() {
		var group='all';
		var index=parent.SR[group].index;
		parent.SR.speakPreviousElement(group,index);
	},
	{
		'type':'keydown',
		'propagate':false,
		'target':document
	}
);


//Headings
//Next Heading
shortcut.add("h",function() {
		
		var group='headings';
		var index=parent.SR[group].index;
		parent.SR.speakNextElement(group,index);
	
	},
	{
		'type':'keydown',
		'propagate':false,
		'disable_in_input':true,
		'target':document
	}
);

//Previous Heading
shortcut.add("Shift+h",function() {
		
		var group='headings';
		var index=parent.SR[group].index;
		parent.SR.speakPreviousElement(group,index);
	
	},
	{
		'type':'keydown',
		'propagate':false,
		'target':document
	}
);

//Links
//Next Link
shortcut.add("k",function() {
		
		var group='links';
		var index=parent.SR[group].index;
		parent.SR.speakNextElement(group,index);
	
	},
	{
		'type':'keydown',
		'propagate':false,
		'disable_in_input':true,
		'target':document
	}
);

//Previous Link
shortcut.add("Shift+k",function() {
		
		var group='links';
		var index=parent.SR[group].index;
		parent.SR.speakPreviousElement(group,index);
	
	},
	{
		'type':'keydown',
		'propagate':false,
		'target':document
	}
);

//Images
//Next Image
shortcut.add("g",function() {

		var group='images';
		var index=parent.SR[group].index;
		parent.SR.speakNextElement(group,index);
		
	},
	{
		'type':'keydown',
		'propagate':false,
		'disable_in_input':true,
		'target':document
	}
);

//Previous Image
shortcut.add("Shift+g",function() {
		
		var group='images';
		var index=parent.SR[group].index;
		parent.SR.speakPreviousElement(group,index);
	
	},
	{
		'type':'keydown',
		'propagate':false,
		'target':document
	}
);

//PDF pages
shortcut.add("Page_up",function() {
		
		var file_type=parent.SR.file_type;
		
		if(parent.SR.isFileAllowed(file_type)){
		
			var current_page=parent.SR.current_page;
			var previous_page=parseInt(current_page)-1;
			
			if(previous_page>0){
				var new_url=parent.removeURLParameter(parent.window.location.href, 'page');
				parent.window.location.href = new_url+'&page='+previous_page;
			}
		
		}

	},
	{
		'type':'keydown',
		'propagate':false,
		'target':document
	}
);

shortcut.add("Page_down",function() {
		
		var file_type=parent.SR.file_type;
		
		if(parent.SR.isFileAllowed(file_type)){
			
			var current_page=parent.SR.current_page;
			var next_page=parseInt(current_page)+1;
			
			if(next_page<=parseInt(parent.SR.total_pages)){
				var new_url=parent.removeURLParameter(parent.window.location.href, 'page');
				parent.window.location.href = new_url+'&page='+next_page;
			}
		}
		
		
	},
	{
		'type':'keydown',
		'propagate':false,
		'target':document
	}
);

