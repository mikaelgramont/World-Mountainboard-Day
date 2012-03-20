<div class="modal-header">
	<h3>Logout</h3>
</div>
<div class="modal-body">
	<span class="control-group error hide" id="session-logout-error">
		<span class="help-inline">{{#ucfirst}}{{ error }}{{/ucfirst}}</span>
	</span>
	<div class="modal-footer">
		<input type="button" id="session-logout-close" class="btn" data-dismiss="modal" value="{{#ucfirst}}{{ i18n.close }}{{/ucfirst}}" disabled="disabled"/>
	</div>
</div>
