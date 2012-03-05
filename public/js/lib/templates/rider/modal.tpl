<div class="modal-header">
	<a class="close" data-dismiss="modal">x</a>
	<h3>Name: {{ username }}</h3>
</div>
<div class="modal-body">
{{#country}}
	<p class="country">Country: <a href="/countries/{{ id }}">{{ title }}</a></p>
{{/country}}
</div>
<div class="modal-footer">
	<a href="#" class="btn">Close</a>
</div>