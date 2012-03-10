<div class="modal-header">
	<a class="close" data-dismiss="modal">x</a>
	<h3>Login</h3>
</div>
<form action="/user/login/" method="post" id="login-form">
	<div class="error">
		{{errorMessage}}
	</div>
	<div class="modal-body session-login-form">
		<input type="text" id="userN" name="userN" class="whole-row" placeholder="username" value="{{ rider.username }}"/>
		<input type="password" id="userP" name="userP" class="whole-row" placeholder="password"/>

		<input type="checkbox" id="userR" name="userR" value="1" class="checkbox"/>
		<label for="userR" class="for-checkbox">_remember me?</label>
	</div>
	<div class="modal-footer">
		<button id="login-form-cancel" class="btn" data-dismiss="modal">_cancel_</button>
		<input type="submit" id="login-form-submit" class="btn btn-primary" value="_login_"/>
	</div>
</form>