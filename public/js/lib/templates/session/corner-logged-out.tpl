<nav class="session-corner" id="session-corner">
    <div class="btn-group lang-selector">
    	<a class="btn dropdown-toggle lang" data-toggle="dropdown" href="#">
   			{{ lang }}
    		<span class="caret"></span>
    	</a>
    	<ul class="dropdown-menu" id="lang-picker">
    		<!-- dropdown menu links -->
    		{{#languages}}
    		<li><a href="#" data-lang="{{.}}" class="lang {{.}}">{{.}}</a></li>
    		{{/languages}}
	    </ul>
    </div>
	
    <div class="btn-group login-btn-group">
    	<a id="login-btn" class="btn" href="/user/login/">{{#ucfirst}}{{ i18n.login }}{{/ucfirst}}</a>
    	<a class="btn" href="/user/register/">
    		{{#i18n}}
    			{{#ucfirst}}{{ register }}{{/ucfirst}}
    		{{/i18n}}
    	</a>
    </div>	
</nav>