<?php

if (!defined('SR_EXEC')) { die('Access denied'); }
// Load local configuration data
if (!file_exists(dirname(__FILE__) . '/config.local.php')) { die('The local configuration file is missing.');}
require dirname(__FILE__) . '/config.local.php';


if($config['development_mode']){
	error_reporting ( E_ALL);
	//error_reporting(E_ALL ^ E_NOTICE);
	//error_reporting(0);

	//Suppress HTMLDOM warnings
	libxml_use_internal_errors(true);
}
else
	error_reporting(0);

// Directories configuration
$config['saves_dir'] = 'saves/';
$config['downloads_dir'] = 'downloads/';
$config['templates_dir'] = 'templates/';
$config['lang_dir'] = 'languages/';
$config['app_dir'] = 'app/';
$config['libs_dir'] = 'libs/';
$config['logs_dir'] = 'logs/';
$config['audio_dir'] = 'audio/';