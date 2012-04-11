<nav class="session-corner" id="session-corner">
	<div class="username">
		{{ rider.username }}
	</div>

    <div class="btn-group lang-selector">
    	<a class="btn dropdown-toggle lang" data-toggle="dropdown" href="#">
    		{{ lang }}
    		<span class="caret"></span>
    	</a>
    	<ul class="dropdown-menu" id="lang-picker">
    		<!-- dropdown menu links -->
    		{{#languages}}
    		<li><a href="#" data-lang="{{.}}" class="dyn-link lang {{.}}">{{.}}</a></li>
    		{{/languages}}
	    </ul>
    </div>
	
    <div class="btn-group logout-btn-group">
    	<a id="logout-btn" class="btn dyn-link" href="/user/logout/">{{#ucfirst}}{{ i18n.logout }}{{/ucfirst}}</a>
    	<a id="profile-btn" class="btn dyn-link" href="/user/edit-profile/">{{#ucfirst}}{{ i18n.editProfile }}{{/ucfirst}}</a>
    </div>	
</nav>