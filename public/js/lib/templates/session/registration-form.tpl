<div class="modal-header">
	<a class="close" data-dismiss="modal">x</a>
	<h3>{{#ucfirst}}{{ i18n.register }}{{/ucfirst}}</h3>
</div>
<form action="/user/register/" method="post" id="register-form">
	<div class="modal-body">
		<div class="control-group {{#error.username}} error{{/error.username}}">
			<input type="text" id="username" name="username" value="{{ rider.username }}" class="whole-row" placeholder="{{#ucfirst}}{{ i18n.username }}{{/ucfirst}}"/>
			<span class="help-inline">{{#ucfirst}}{{ error.username }}{{/ucfirst}}</span>
		</div>
		<div class="control-group {{#error.email}} error{{/error.email}}">
			<input type="email" id="email" name="email" value="{{ rider.email }}" class="whole-row" placeholder="{{#ucfirst}}{{ i18n.email }}{{/ucfirst}}"/>
			<span class="help-inline">{{#ucfirst}}{{ error.email }}{{/ucfirst}}</span>
		</div>
		<div class="control-group {{#error.userP}} error{{/error.userP}}">
			<input type="password" id="userP" name="userP" class="whole-row" placeholder="{{#ucfirst}}{{ i18n.password }}{{/ucfirst}}"/>
			<span class="help-inline">{{#ucfirst}}{{ error.userP }}{{/ucfirst}}</span>
		</div>
		<div class="control-group {{#error.userPC}} error{{/error.userPC}}">
			<input type="password" id="userPC" name="userPC" class="whole-row" placeholder="{{#ucfirst}}{{ i18n.passwordConf }}{{/ucfirst}}"/>
			<span class="help-inline">{{#ucfirst}}{{ error.userPC }}{{/ucfirst}}</span>
		</div>
	</div>
	<div class="modal-footer">
		<input type="button" id="register-form-cancel" class="btn" data-dismiss="modal" value="{{#ucfirst}}{{ i18n.cancel }}{{/ucfirst}}" tabIndex="1"/>
		<input type="submit" id="register-form-submit" class="btn btn-primary" value="{{#ucfirst}}{{ i18n.register }}{{/ucfirst}}" tabindex="0" />
	</div>
</form>