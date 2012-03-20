<div class="modal-header">
	<a class="close" data-dismiss="modal">x</a>
	<h3>{{#ucfirst}}{{ i18n.register }}{{/ucfirst}}</h3>
</div>
<form action="/user/register/" method="post" id="register-form">
	<div class="modal-body">
		<span class="control-group error">
			<span class="help-inline">{{ error }}</span>
		</span>
		<input type="text" id="userN" name="userN" class="whole-row" placeholder="{{#ucfirst}}{{ i18n.username }}{{/ucfirst}}" value=""/>
		<input type="email" id="email" name="email" class="whole-row" placeholder="{{#ucfirst}}{{ i18n.email }}{{/ucfirst}}" value=""/>
		<input type="password" id="userP" name="userP" class="whole-row" placeholder="{{#ucfirst}}{{ i18n.password }}{{/ucfirst}}"/>
		<input type="password" id="userPC" name="userPC" class="whole-row" placeholder="{{#ucfirst}}{{ i18n.passwordConf }}{{/ucfirst}}"/>

	</div>
	<div class="modal-footer">
		<input type="button" id="register-form-cancel" class="btn" data-dismiss="modal" value="{{#ucfirst}}{{ i18n.cancel }}{{/ucfirst}}" tabIndex="1"/>
		<input type="submit" id="register-form-submit" class="btn btn-primary" value="{{#ucfirst}}{{ i18n.register }}{{/ucfirst}}" tabindex="0" />
	</div>
</form>