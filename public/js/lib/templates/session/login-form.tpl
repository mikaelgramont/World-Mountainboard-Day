<div class="modal-header">
	<a class="close" data-dismiss="modal">x</a>
	<h3>Login</h3>
</div>
<form action="/user/login/" method="post" id="login-form">
	<div class="modal-body session-login-form">
		<span class="control-group error">
			<span class="help-inline">{{ error }}</span>
		</span>
		<input type="text" id="userN" name="userN" class="whole-row" placeholder="username" value="{{ rider.username }}"/>
		<input type="password" id="userP" name="userP" class="whole-row" placeholder="password"/>

		<label class="checkbox">
        	<input type="checkbox" value="1" id="userR" name="userR"/> remember me next time
        </label>
	</div>
	<div class="modal-footer">
		<input type="button" id="login-form-cancel" class="btn" data-dismiss="modal" value="Cancel" tabIndex="1"/>
		<input type="submit" id="login-form-submit" class="btn btn-primary" value="Login" tabindex="0" />
	</div>
</form>