<?php

/*
 * Checks headers of the input url
 * 
 * status 200 returns the current url and the page loads normally
 * status 301 redirects to the corrent site according to the header
 * other return urls to the static error.html
 * 
 * */
function check_header_response($url, $templates_dir)
{	

	
	global $config;	
	
	$headers = get_headers($url);
	$response_code = substr($headers[0], 9, 3);

	if($response_code == "200")
	{
		return $url;
	}
	else if($response_code == "301")
	{	
		unset($_SESSION['last_visit']);
		foreach($headers as $key=>$value)
		{
			if(strpos(strtolower($value),'location') !== false) 
			{
				$location_pieces = explode('location: ', strtolower($value));
				$new_url = 'index.php?url='.$location_pieces[1];
				header('Location: '.$new_url);
			}
		}
		
	}
	else if($response_code == "302")
	{	unset($_SESSION['last_visit']);
		foreach($headers as $key=>$value)
		{
			if(strpos(strtolower($value),'location') !== false) 
			{
				$location_pieces = explode('location: ', strtolower($value));
				$new_url = 'index.php?url='.$location_pieces[1];
				header('Location: '.$new_url);
			}
		}
		
	}
	else if($response_code == "303")
	{	unset($_SESSION['last_visit']);
		foreach($headers as $key=>$value)
		{
			if(strpos(strtolower($value),'location') !== false) 
			{	
				$location_pieces = explode('location: ', strtolower($value));
				$new_url = 'index.php?url='.$location_pieces[1];
				header('Location: '.$new_url);
			}
		}
	}
	else if($response_code == "404"){
		header('Location: index.php?url='.$config['http_host'].'/'.$config['http_path'].'templates/static/404.html');
	}
	else{
		header('Location: index.php?url='.$config['http_host'].'/'.$config['http_path'].'templates/static/error.html');
	}

}


?>
