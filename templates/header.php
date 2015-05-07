<?php if (!defined('SR_EXEC')) { die('Access denied'); }?>

<nav class="header navbar navbar-default navbar-fixed-top" role="navigation">
  
  <div class="navbar-header">
    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
      <span class="sr-only">Toggle navigation</span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
    </button>
    <a class="navbar-brand" href="<?php echo $config['http_host'].'/'.$config['http_path'] ;?>" <?php if(isset($_GET['url'])) echo 'style="display:none;"';?>></a>
  </div>

  <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
    
	<form id="url_form" class="navbar-form navbar-right" action="index.php" method="get" onsubmit="return check_valid_url();">
      <div class="form-group">
        <input 
			id="url"
			style="width:755px;" 
			type="text" 
			name="url"  
			class="form-control url<?php if(isset($_GET['url'])) echo ' active';?>" 
			placeholder="<?php echo _LANG_WEBSITE_OR_FILE_URL ?>" 
			value="<?php if(isset($_GET['url'])) echo $_GET['url'];?>">
      </div>
    </form>
	
  </div>
</nav>


<div class="marquee navbar-fixed-top" style="top:70px;">
    	<div id="speech_preview" class="span12 box">
		<div id="speech_preview_text" class="marquee header">
			<span class="title"><?php echo _LANG_SCREENREADER_APP ?></span>
		</div>
	</div>
</div>
