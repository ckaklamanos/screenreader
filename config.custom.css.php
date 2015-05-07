<?php

if (!defined('SR_EXEC')) { die('Access denied'); }

$custom_css = array();

//www.w3c.gr
$custom_css['www.w3c.gr'] = array();
array_push($custom_css['www.w3c.gr'], 'http://www.w3c.gr/css/advanced.css');
array_push($custom_css['www.w3c.gr'], 'http://www.w3c.gr/css/left_menu.css');

//www.w3.org
$custom_css['www.w3.org'] = array();
array_push($custom_css['www.w3.org'], 'http://www.w3.org/2008/site/css/advanced');

//www.eap.gr
$custom_css['www.eap.gr'] = array();
array_push($custom_css['www.eap.gr'], 'http://www.eap.gr/tabs_slides.css');
