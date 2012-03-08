<div class="session-login-form">
	<form action="/user/login/" method="post" id="login-form">
		<label for="userN">
			username
			<input type="text" id="userN" name="userN"/>
		</label>
		<label for="userP">
			password
			<input type="password" id="userP" name="userP"/>
		</label>
		<label for="userR">
			remember me?
			<input type="checkbox" id="userR" name="userR" value="1"/>
		</label>
		<input type="submit" id="login-form-submit" class="btn" value="login"/>
	</form>
</div>