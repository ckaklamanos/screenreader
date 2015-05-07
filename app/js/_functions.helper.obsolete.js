function relativeToAbsoluteUrl(url)
{
	var checkIsDone = false;
	var check_rewritten_url = false;
	var uri = new URI(url);
	var protocol = uri.protocol();
	var hostname = uri.hostname();
	var directory = uri.directory();
	if(directory != '/')
		directory += '/';
	console.log(hostname);
	console.log(directory);
	
	$('body').find('*').each(function(index) {
		if(SR.htmltags[this.tagName] && SR.htmltags[this.tagName]['urls'])
		{
			var elms = SR.htmltags[this.tagName]['urls'];
			for(var i=0; i<elms.length; i++)
			{
				var actual_url= $(this).attr(elms[i]);
				if (($(this).attr(elms[i])) && (actual_url.length > 0) && (actual_url.indexOf(':') == -1)) {
					/*if(!checkIsDone)
					{
						var test_url = protocol + '://' + hostname + actual_url;
						console.log(test_url);
						$.ajax({
							type: 'HEAD',
							url: test_url,
							success: function(){
							   console_log("data");
							   check_rewritten_url = true;
							   checkIsDone = true;
							},
							error: function() {
								console.log("error");
								check_rewritten_url = false;
							}
						 });
						 
					}*/
					//else
					{
						/*if(check_rewritten_url)
						{
							var domainName = protocol + '://' + hostname;
							var new_url = domainName + actual_url;
							$(this).attr(elms[i], new_url);
						}*/
						//else
						{
							var domainName = protocol + '://' + hostname + directory;
							var new_url = domainName + actual_url;
							$(this).attr(elms[i], new_url);
							console.log(this);
						}
					}
				}
			}
		}
	});
}
