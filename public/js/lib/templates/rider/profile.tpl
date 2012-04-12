<h1>{{ i18n.editProfile }}</h1>
<form action="/rider/{{ id }}" method="post" id="profile-form">
	<div class="control-group">
	    <div class="btn-group lang-selector">
	    	<a class="btn dropdown-toggle lang" data-toggle="dropdown" href="#">
	    		{{ rider.lang }}
	    		<span class="caret"></span>
	    	</a>
	    	<ul class="dropdown-menu" id="profile-lang-picker">
	    		<!-- dropdown menu links -->
	    		{{#languages}}
	    		<li><a data-lang="{{.}}" class="lang {{.}}">{{.}}</a></li>
	    		{{/languages}}
		    </ul>
	    </div>

		<input type="hidden" id="lang" name="lang" value="{{ rider.lang }}" class="whole-row"/>
		<span class="help-inline">{{#ucfirst}}{{ error.lang }}{{/ucfirst}}</span>
	</div>
	
	<div>
		<label class="checkbox">
        	<input type="checkbox" value="1" id="rideType-freeride" name="rideType"/>{{#ucfirst}}{{ i18n.freeride }}{{/ucfirst}}
        </label>
		<label class="checkbox">
        	<input type="checkbox" value="1" id="rideType-freestyle" name="rideType"/>{{#ucfirst}}{{ i18n.freestyle }}{{/ucfirst}}
        </label>
		<label class="checkbox">
        	<input type="checkbox" value="1" id="rideType-kite" name="rideType"/>{{#ucfirst}}{{ i18n.kite }}{{/ucfirst}}
        </label>
	</div>	
	
	<div>
		<label>
			{{#ucfirst}}{{ profilePicture }}{{/ucfirst}}
			<input type="file" id="avatar" class="btn" tabIndex="1"/>
		</label>
	</div>
	
	<div>
		<input type="button" id="profile-form-cancel" class="btn" data-dismiss="modal" value="{{#ucfirst}}{{ i18n.cancel }}{{/ucfirst}}" tabIndex="1"/>
		<input type="submit" id="profile-form-submit" class="btn btn-primary" value="{{#ucfirst}}{{ i18n.update }}{{/ucfirst}}" tabindex="0" />
	</div>
	
	<input type="hidden" id="latitude" name="latitude" value="{{ rider.latitude }}" class="whole-row"/>
	<input type="hidden" id="longitude" name="longitude" value="{{ rider.longitude }}" class="whole-row"/>
	<input type="hidden" id="zoom" name="zoom" value="{{ rider.zoom }}" class="whole-row"/>
	<input type="hidden" id="mapType" name="mapType" value="{{ rider.mapType }}" class="whole-row"/>
</form>