<nav class="session-corner" id="session-corner">
	<div class="username">
		{{ username }}
	</div>

    <div class="btn-group lang-selector">
    	<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
    		{{ lang }}
    		<span class="caret"></span>
    	</a>
    	<ul class="dropdown-menu">
    		<!-- dropdown menu links -->
    		<li class="fr"><a href="#">FR</a></li>
    		<li class="en"><a href="#">EN</a></li>
    		<li class="es"><a href="#">ES</a></li>
    	</ul>
    </div>
	
    <div class="btn-group logout-btn-group">
    	<a id="logout-btn" class="btn" href="/user/logout/">Logout</a>
    </div>	
</nav>