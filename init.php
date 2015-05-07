<?php

if (!defined('SR_EXEC')) { die('Access denied'); }

// Load local configuration data
if (!file_exists(dirname(__FILE__) . '/config.local.php')) { die('The local configuration file is missing.');}
require dirname(__FILE__) . '/config.local.php';

// Load configuration data
if (!file_exists(dirname(__FILE__) . '/config.php')) { die('The configuration file is missing.');}
require dirname(__FILE__) . '/config.php';

// Load custom css configuration  data
if (!file_exists(dirname(__FILE__) . '/config.custom.css.php')) { die('The custom css configuration file is missing.');}
require dirname(__FILE__) . '/config.custom.css.php';

// Load language data
require dirname(__FILE__) . '/'.$config['lang_dir'].$config['lang'].'.php';

//Load helpers
require($config['app_dir']."php/functions.helper.php");
require($config['app_dir']."php/dom.helper.php");
require($config['app_dir']."php/log.helper.php");
require($config['app_dir']."php/mail.helper.php");

//Load clamav antivirus helpers
if($config['enable_antivirus_scan']===true)
	require($config['app_dir']."php/clamav.helper.php");

//Init a php session
session_start();

if(!isset($_SESSION))
	die('Cannot create session');
	
//empty the post data
$_SESSION['postdata'] = array();	

if(!empty($_POST)){
	$_SESSION['postdata'] = $_POST;
	
	if(isset($_POST['url']))
		$_GET['url'] = $_POST['url'];

}

//Set the IP session variable 
if(!isset($_SESSION['ip']))
	$_SESSION['ip']=getenv ( "REMOTE_ADDR" );
	
//Check if the IP has changed in the same session
if($_SESSION['ip']!=getenv ( "REMOTE_ADDR" ))
	die('Access denied');

//Set the access key session variable 
if(!isset($_SESSION['access_key']))
	if(isset($_GET['key']))
		$_SESSION['access_key']=$_GET['key'];

//Check the iframe URL to be loaded, depending on the window URL
$iFrameUrl = "";		

$_SESSION['last_visit']=time();

//Check if Offline
if($config['offline']===true&&!isset($_SESSION['access_key'])){
	$iFrameUrl = "proxy.php?url=".$config['templates_dir']."static/offline.html";
	require dirname(__FILE__) . '/'.$config['templates_dir'].'home.php';
	die;
}
