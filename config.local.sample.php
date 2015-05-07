<?php

if (!defined('SR_EXEC')) { die('Access denied'); }

// Home path where software is installed
$config['home_path'] = $_SERVER['DOCUMENT_ROOT'];

// Host and directory where software is installed (Default is for localhost installation)
$config['http_host'] = 'http://localhost';
$config['http_path'] = 'screenreader/';

// Text to Speech service (Values:free,eapdemo, eaplive)
// Free service supports only English 
$config['tts_service'] = 'eaplive';

//Eap Text To Speech service configuration
$config['tts_host'] = 'http://www.host.tld/';
$config['tts_username'] = '';
$config['tts_password'] = '';

//Email settings for contact form
$config['email_to_address'] = 'username@email.com';
$config['SMTP']=array();
$config['SMTP']['Host'] = 'smtp.name.com';  			// Specify main and backup SMTP servers
$config['SMTP']['Username'] = '';	// SMTP username
$config['SMTP']['Password'] = '';     // SMTP password
$config['SMTP']['SMTPSecure'] = '';                      // Enable TLS encryption, `ssl` also accepted
$config['SMTP']['Port'] = 587;                              // TCP port to connect to

//Set to true in order to enable maintenance mode
$config['offline'] = false;

//Set a strong password in order to bypass maintenance mode by visiting /index.php?key=password
$config['access_key'] = '';

//Set the preferred language
$config['lang'] = 'el-GR';

//Set the limit in seconds between requests from same user
$config['requests_time_limit'] = 0;

//Enable Clam AV antivirus scanning
$config['enable_antivirus_scan'] = true;

//Add the Google Anaylitics tracking ID in order to enable Google Analytics
$config['google_analytics_tracking_id'] = '';

//Set the allowed file extensions that the screen reader can request and load.
$config['allowed_file_extensions'] = array('pdf','docx','doc','odt','epub','txt');

//Enable log
$config['enable_log']=false;

//Enable development mode
$config['development_mode']=true;

//phantomjs absolute path, i.e. for windows
$config['phantomjs_path']='C:/wamp/www/screenreader/phantomjs/win/';