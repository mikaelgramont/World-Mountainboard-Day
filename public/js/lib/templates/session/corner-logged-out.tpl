<nav class="session-corner" id="session-corner">
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
	
    <div class="btn-group login-btn-group">
    	<a id="login-btn" class="btn" href="/user/login/">{{ i18n.Login }}</a>
    	<a class="btn" href="/user/register/">
    		{{#i18n.uc}}
    			a{{ i18n.Register }}a
    		{{/i18n.uc}}
    	</a>
    </div>	
</nav>