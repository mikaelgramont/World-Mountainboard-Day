<?php
//define('APPLICATION_ENV', 'production');
//define('APPLICATION_ENV', 'staging');

set_include_path('../php/'.PATH_SEPARATOR.get_include_path());
require_once 'include.php';
$config = Globals::getConfig();
$templates = Globals::getTemplates('js/lib/templates/');
$cdnUrl = $config->cdnProtocol . $config->cdnUrl;
$sessionData = Globals::getApiSessionData($_COOKIE);
$translations = Globals::getTranslation($sessionData->lang);
$m = Globals::getMustache($translations);
$bundles = Globals::getApplicableVersionnedBundles(
	$config->minify,
	$config->versioning,
	$cdnUrl
);
?>
<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">

  <title>World Mountainboard Day 2012</title>
  <meta name="description" content="">

  <meta name="viewport" content="width=device-width">
  <link rel="stylesheet" href="<?php echo Globals::getApplicableCSS(
	'styles.css', $config->minify, $config->versioning, $cdnUrl) ?>">
</head>

<body id="app">
	<header>
		<div class="container">
			<h1>World Mountainboard Day</h1>
			<nav class="main">
				<ul>
					<li><a href="/locations/">Locations</a></li>
					<li><a href="/riders/">Riders</a></li>
					<li><a href="/sessions/">Sessions</a></li>
				</ul>
			</nav>
<?php
	$cornerTpl = 'session/corner-' . ($sessionData->rider->userId ? 'logged-in' : 'logged-out'). '.tpl';
	$cornerData = $sessionData;
	echo $m->render($templates[$cornerTpl], $cornerData);
?>			
		</div>
	</header>
		
	<div id="main" role="main" class="main container">
		<section id="riders">
			<h1>Riders</h1>
			<ul id="rider-list"></ul>
			<!-- Here, insert icons to represent actions the user might want to take -->
		</section>
		<aside class="main">
			<!-- Here, insert things that will be shown on desktop, but not on mobile -->
			<article>
				<h3>Latest spot</h3>
				<a href="/spots/1/" class="spot">_Atlanta_</a>
			</article>
			<article>
				<h3>Latest rider</h3>
				<a href="/riders/1/" class="rider">_Pelican_</a>
			</article>
			<article>
				<h3>Latest photo</h3>
				<a href="/media/1/" class="photo">_Stalefish_</a>
			</article>
			<figure>
				<p class="checkin">
					<a href="/checkins/now/">23 riders</a> are riding right now!
				</p>
				<p class="spot">
					Our database currently has <a href="/checkins/now/">84 spots</a> in <a href="/countries/">16 countries!</a>
				</p>
			</figure>
		</aside>
	</div>
	
	<footer>
		<div class="container">
			<nav>
				<ul>
					<li><a href="/about/">About</a></li>
					<li><a href="/ridedb/">RideDB</a></li>
					<li><a href="/contact/">Contact</a></li>
				</ul>
			</nav>
		</div>
	</footer>
    
    <div class="modal" id="modal" style="display: none"></div>
    
	<script>
		var require = {
			baseUrl: <?php echo json_encode($cdnUrl.'js/lib') ?>,
			paths: <?php echo json_encode($bundles) ?>

		}, appConfig = {
			apiUrl: <?php echo json_encode($config->apiUrl) ?>,
			cdnUrl: <?php echo json_encode($cdnUrl) ?>,
			images: <?php echo json_encode(Globals::getApplicableImagePaths($config->versioning)) ?>,
			sessionData: <?php echo json_encode($sessionData) ?>,
			translations: <?php echo json_encode($translations) ?>
			
		};
  	</script>
  	<?php
  		if($config->useBundles) {
  			$main = $bundles['main'.($config->minify ? ".min" : "")]. '.js';
  		} else {
			$main = '../js/src/main.js';
  		}
  		$require = $cdnUrl . 'js/lib/require-1.0.6' . ($config->minify ? '.min' : '') . '.js';
  	?>
  	<script data-main="<?php echo $main ?>" src="<?php echo $require ?>"></script>
</body>
</html>
