<?php
defined('APPLICATION_ENV') || define('APPLICATION_ENV',
	(getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'production'));
$min = (APPLICATION_ENV == 'production'); 
$dependencies = array(
	'jquery' => 'js/lib/jquery-1.7.1',
	'underscore' => 'js/lib/underscore-amd-1.3.1',
	'backbone' => 'js/lib/backbone-amd-0.9.1',
	'domReady' => 'js/lib/domReady-1.0.0',
	'app' => 'js/bin/app',
);
$deps = array();
foreach($dependencies as $k => $v) {
	if($min) {
		$v .= '.min';
	}
	$deps[] = "'$k': '$v'";
}
?>
<!doctype html>
<html class="no-js" lang="en">

<head>
  <meta charset="utf-8">

  <title>World Mountainboard Day 2012</title>
  <meta name="description" content="">

  <meta name="viewport" content="width=device-width">
  <link rel="stylesheet" href="css/bin/styles.css">
  <link rel="stylesheet" href="css/bin/dummy.css">
  
  <script src="js/lib/require-1.0.6<?php if($min && false) echo ".min"?>.js"></script>
</head>

<body>
  <div id="container">
	<div id="main" role="main">
		<div id="riders">
			<ul id="rider-list"></ul>
		</div>    
	</div>
  </div> <!--! end of #container -->
  <script>
  require.config({
    paths: {
	<?php echo implode(', ', $deps).PHP_EOL;?>
    }
  });
  require(['domReady','app'], function(domReady, app){
       domReady(function () {
           app.initialize();
       });
   });

  
  </script>
  <script type="text/template" id="rider-template">
	  <div class="rider">
	  <dl>
	    <dd>name</dd>
	    <dt><%= username %></dt>
    	<dd>country</dd>
    	<dt><%= country.title %></dt>
  	  </dl> 
 	  </div>
  </script>
</body>
</html>
