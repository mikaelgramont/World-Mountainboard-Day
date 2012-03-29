<div class="modal-header">
	<a class="close" data-dismiss="modal">x</a>
	<h3>{{#ucfirst}}{{ i18n.login }}{{/ucfirst}}</h3>
</div>
<form action="/user/login/" method="post" id="login-form">
	<div class="modal-body">
		<span class="control-group error">
			<span class="help-inline">{{ error }}</span>
		</span>
		<input type="text" id="userN" name="userN" class="whole-row" placeholder="{{#ucfirst}}{{ i18n.username }}{{/ucfirst}}" value=""/>
		<input type="password" id="userP" name="userP" class="whole-row" placeholder="{{#ucfirst}}{{ i18n.password }}{{/ucfirst}}"/>

		<label class="checkbox">
        	<input type="checkbox" value="1" id="userR" name="userR"/>{{#ucfirst}}{{ i18n.keepMeLoggedIn }}{{/ucfirst}}
        </label>
	</div>
	<div class="modal-footer">
		<input type="button" id="login-form-cancel" class="btn" data-dismiss="modal" value="{{#ucfirst}}{{ i18n.cancel }}{{/ucfirst}}" tabIndex="1"/>
		<input type="submit" id="login-form-submit" class="btn btn-primary" value="{{#ucfirst}}{{ i18n.login }}{{/ucfirst}}" tabindex="0" />
	</div>
</form>