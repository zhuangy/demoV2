function initialize() {
		 //console.log("initialize");
  var mapOptions = {
    zoom: 13,
    center:  new google.maps.LatLng(34.059021, -118.303739),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  var map = new google.maps.Map(document.getElementById("map_canvas"),
                                mapOptions);
	
  setMarkers(map, restaurantes);
}

/**
 * Data for the markers consisting of a name, a LatLng and a zIndex for
 * the order in which these markers should display on top of each
 * other.
 */
var restaurantes = [
  ['IOTA', "528 S Western Ave, Los Angeles, CA 90020"]
];

function setMarkers(map, locations) {
  // Add markers to the map

  // Marker sizes are expressed as a Size of X,Y
  // where the origin of the image (0,0) is located
  // in the top left of the image.

  // Origins, anchor positions and coordinates of the marker
  // increase in the X direction to the right and in
  // the Y direction down.
  var	geocoder = new google.maps.Geocoder();
  var image = new google.maps.MarkerImage('img/Webitap_Logo.png',
      // This marker is 20 pixels wide by 32 pixels tall.
      new google.maps.Size(20, 32),
      // The origin for this image is 0,0.
      new google.maps.Point(0,0),
      // The anchor for this image is the base of the flagpole at 0,32.
      new google.maps.Point(0, 32));
  var shadow = new google.maps.MarkerImage('img/Webitap_Logo.png',
      // The shadow image is larger in the horizontal dimension
      // while the position and offset are the same as for the main image.
      new google.maps.Size(37, 32),
      new google.maps.Point(0,0),
      new google.maps.Point(0, 32));
      // Shapes define the clickable region of the icon.
      // The type defines an HTML <area> element 'poly' which
      // traces out a polygon as a series of X,Y points. The final
      // coordinate closes the poly by connecting to the first
      // coordinate.
  var shape = {
      coord: [1, 1, 1, 20, 18, 20, 18 , 1],
      type: 'poly'
  };
  for (var i = 0; i < locations.length; i++) {
	  
    var restaurant = locations[i];
    //var myLatLng = new google.maps.LatLng(restaurant[1], restaurant[2]);
	var address = restaurant[1];
	//console.log(address);
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
		var myLatLng = new google.maps.LatLng(results[0].geometry.location[1], results[0].geometry.location[2]);
		
		//var title=locations[i][0];
		
		var image = 'logo.png';
		//console.log(i);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
			//title: locations[i][0],
			//shadow: shadow,
			//icon: image,
			shape: shape,
			zIndex: 10	
        });
		var contentString = '<div><img style="width:300px;"src="logo.png"></img></div>';
		var infowindow = new google.maps.InfoWindow({
			content: contentString
		});
		google.maps.event.addListener(marker, 'click', function() {
		  infowindow.open(map,marker);
		});
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
	  
	  
    });
  }
}

