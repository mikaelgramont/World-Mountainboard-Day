# Client-side TODO
Find a logo and a font to represent it in small displays
Determine timezone based on location
	0-new Date().getTimezoneOffset()/60
Apache: Not serve Rakefile, css/src, js/src
Figure out a way to get commit hash into the name of the bundles (currently only main.js) pulled by the index file. 
Add a jslint task into the Rake file
Add mustache.js for template rendering


# API TODO
delete user => change status to invalid?
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
 