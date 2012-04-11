# Client-side TODO
edit profile: lang, ride type, avatar, location
hit PUT /riders/:id/
new view in rider.js: ProfileView
form with the following inputs:
	lang,
	rideType,
	avatar,
	latitude
	longitude
	zoom,
	mapType
	submit
	cancel
reset location link

Show weather on spot pages
http://googlegeodevelopers.blogspot.com/2012/04/weather-layer-now-available-in-google.html



Use lukew's design patterns to determine a strategy for responsiveness http://www.lukew.com/ff/entry.asp?1514
Have constants in config file to determine size thresholds, and have events fire when window is resized, and initially too

I18n:
- look into see https://github.com/SlexAxton/messageformat.js
how to fit plurals and i18n?
plurals need to be fed translated strings. or it could do it on its own.

setup a router in order to deal with local urls
once the app starts, if there is a url fragment that looks like #goto-(.*), load that url

Ridedb registration email


Build controllers to proxy the API calls, plus some other ones like /user/logout/
Add widget on homepage to show JS loading status while in debug.
Find a logo and a font to represent it in small displays
Determine timezone based on location: 0-new Date().getTimezoneOffset()/60
Fix jslint task to output to console
Replace jQuery with zepto.js or ender.js <= jQuery is a hard dependency for bootstrap plugins
Maybe replace requirejs with browserify to see if it's any better
http://jhollingworth.github.com/bootstrap-wysihtml5/?utm_source=hackernewsletter&utm_medium=email

Later:
	download templates asynchronously, right before rendering them

# Architecture

# API TODO
delete user => change status to invalid? => What about their old photos and albums? This would break links to users because the API wouldn't serve the user.
email personalisation depending on site
	
# Notes
## Responsive app:
 - works on mobile landscape/portrait
 - larger screens (tablets)
 - desktop
Uses twitter bootstrap as a framework for CSS
Uses Backbone as a client-side framework
Templates must be served from the public/templates/ folder
These same templates must be able to render on the server side.
This means that hitting a url directly (without ajax) must result in the same rendering but wrapped (header, nav, footer)
So we need a templating language that works in PHP and JS => mustache

3d view on maps: http://google-maps-utility-library-v3.googlecode.com/svn/trunk/googleearth/docs/reference.html
and http://www-web2.youtube.com/watch?v=IXoJLyN356E&feature=g-all-u&context=G24cb18fFAAAAAHgAXAA

Look at chaplin for oauth https://github.com/moviepilot/chaplin



## How to calculate the distance between two (lat,lon) tuples
http://www.jaimerios.com/?p=39
var R = 6371; // km
var dLat = (lat2-lat1).toRad();
var dLon = (lon2-lon1).toRad();
var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
 
Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * Math.sin(dLon/2) * Math.sin(dLon/2);
 
var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
var d = R * c;

# Use cases:  
## Ahead of time
User A wants to find places to ride around where he is right now
	List spots:
		near the user withinBounds 
			List countries /countries/
		in their region /regions/1/
			List regions per country /countries/1/regions/
	
User B wants to enter his favorite spot into the database
	POST/PUT a spot
User C wants to show where he's going to ride on WMD
	POST/PUT checkin at WMD date, at given spot
User D wants to see who's going to be riding around a given location on WMD
	List checkins around a location at a given date /checkins/around/?lat=&lon=
User E wants to post a picture of an existing spot he's found in the database
	POST/PUT a media with a given spot
	
## On WMD
User A wants to check-in to a spot in the database
	POST/PUT checkin at WMD date
User B wants to check-in to a new spot
	POST/PUT a spot
	POST/PUT checkin at WMD date, at given spot
User C wants to post a picture he just took at a spot he checked-in to
	POST/PUT a media with spot at last checkin
User D wants to post a picture he just took, of a spot he found in the DB	
	POST/PUT a media with a chosen spot
 