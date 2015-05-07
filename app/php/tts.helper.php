<?php

$txt=urlencode($_GET['txt']);

$audio_url = file_get_contents('http://tts-api.com/tts.mp3?q='.$txt.'&return_url=1 ');
echo $audio_url;


?>
