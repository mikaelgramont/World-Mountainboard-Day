<nav class="session-corner" id="session-corner">
	<div class="username">
		{{ rider.username }}
	</div>

    <div class="btn-group lang-selector">
    	<a class="btn dropdown-toggle lang" data-toggle="dropdown" href="#">
    		{{ lang }}
    		<span class="caret"></span>
    	</a>
    	<ul class="dropdown-menu">
    		<!-- dropdown menu links -->
    		<li><a href="#" class="lang fr">fr</a></li>
    		<li><a href="#" class="lang en">en</a></li>
    		<li><a href="#" class="lang es">es</a></li>
    	</ul>
    </div>
	
    <div class="btn-group logout-btn-group">
    	<a id="logout-btn" class="btn" href="/user/logout/">Logout</a>
    </div>	
</nav>