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
    	<ul class="dropdown-menu" id="lang-picker">
    		<!-- dropdown menu links -->
    		{{#languages}}
    		<li><a href="#" data-lang="{{.}}" class="lang {{.}}">{{.}}</a></li>
    		{{/languages}}
	    </ul>
    </div>
	
    <div class="btn-group logout-btn-group">
    	<a id="logout-btn" class="btn" href="/user/logout/">{{#ucfirst}}{{ i18n.logout }}{{/ucfirst}}</a>
    </div>	
</nav>