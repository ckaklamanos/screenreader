<?php

/*
 * Removes the path of the filename
 * 
 * explodes the input string with the "/" character
 * and stores every part at an array
 * returns the last element of the array
 * 
 */

function getFileNameFromUrl($url)
{
	$pieces = explode("/", $url);
	$file;
	foreach($pieces as $key=>$value)
	{
		$file = $value;
	}
	return $file;
}

/*
 * Gets the extensions of the filenames
 * 
 * explodes the input string with the "." character
 * and stores every part at an array
 * returns the last element of the array
 */
function getFileExtension($file)
{
	$pieces = explode(".", $file);
	$extension = "";
	foreach($pieces as $key=>$value)
	{
		$extension = $value;
	}
	
	return strtolower($extension);
}

/*
 * Gets the path of a filename
 * 
 * explodes the input string with the "." character
 * and stores every part at an array
 * 
 * gets the filename of the url without the path
 * 
 * gets all the array elementes except the last to form the path
 */
 
 
function getFilePath($url)
{
	$pieces = explode("/", $url);
	$file;
	$dirs = array();
	foreach($pieces as $key=>$value)
	{
		array_push($dirs, $value);
	}
	
	$fileName = getFileNameFromUrl($url);
	$path = "";
	foreach($dirs as $key=>$value)
	{
		if($value != $fileName)
		{
			$path .= $value.'/';
		}
	}
	
	if($path == "")
	{
		return "";
	}
	else
	{
		return $path;
	}
}

/*
 * Get th name of a file without the extension
 * 
 * explodes the input string with the "." character
 * and stores every part at an array
 * 
 * concatenates the array elements except the last
 * 
 * the input string must not contain the path of the file
 */
function getFileName($file)
{
	$pieces = explode(".", $file);
	$extension = "";
	$filename = "";
	foreach($pieces as $key=>$value)
	{
		$filename .= $extension;
		$extension = $value;
	}
	
	return $filename;
}


/*Get working folder of the app*/
function getAppFolder(){

	$cur_dir = explode('\\', getcwd());
	return $cur_dir[count($cur_dir)-1];

}


function isValidURL($url){
	
	//$url = urldecode ( urlencode ($url) );
	// Default PHP URL validation
	if ( !filter_var( $url , FILTER_VALIDATE_URL , FILTER_FLAG_HOST_REQUIRED ) )
	  return false;
	
	$parsed_url = parse_url ($url);
	
	// Allowed protocols: http, https
	if ( !($parsed_url['scheme'] == 'http' || $parsed_url['scheme'] == 'https') )
		return false;
		
	return true;

}

function fn_encode_url_query ( $url ){
	
	$parsed_url = parse_url($url);

	if( isset ($parsed_url['query']) ){

	
		parse_str($parsed_url['query'], $params);
			
		foreach ($params as $param => $value) {
			if(!is_array($value))
				$params[$param] = urlencode($value);
			else
				$params[$param] = $value;
		}
		
		$query = ( isset ($parsed_url['query']) ) ? '?' . http_build_query ( $params ) : '' ;

	}
	else{
	
		$query = '';
	}
	
	
	$path = ( isset ($parsed_url['path']) ) ? $parsed_url['path'] : '' ;
	
	return $parsed_url['scheme'] . '://' . $parsed_url['host'] . $path . $query ;

}

?>