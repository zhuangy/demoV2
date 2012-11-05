var Class = function(methods) {   
    var klass = function() {    
        this.initialize.apply(this, arguments);          
    };  
    
    for (var property in methods) { 
       klass.prototype[property] = methods[property];
    }
          
    if (!klass.prototype.initialize) klass.prototype.initialize = function(){};      
    
    return klass;    
};
var previous_infowindow;
var Query = Class({ 
    initialize: function(restaurantinfo) {
        this.restaurant = restaurantinfo;
        this.geocoder = new google.maps.Geocoder();
    },
    setPin: function(map,shape) {
        //console.log(this.restaurant[1]);
		
        var restaurant=JSON.parse(this.restaurant);
        //console.log(JSON.parse(restaurant).address1);
        var address = restaurant.address1+' '+restaurant.address2;
        //console.log(address);
        this.geocoder.geocode( { 'address': address}, function(results, status) {
        	  if (status == google.maps.GeocoderStatus.OK) {
        		//var myLatLng = new google.maps.LatLng(results[0].geometry.location[1], results[0].geometry.location[2]);
        		//var title=locations[i][0];
        		
        		var image = restaurant.logo;
        		//console.log(image);
        	    var marker = new google.maps.Marker({
        	        map: map,
        	        position: results[0].geometry.location,
        			//title: locations[i][0],
        			//shadow: shadow,
        			//icon: image,
        			shape: shape,
        			zIndex: 10	
        	    });
        		var contentString = '<div><img width="100px" src="'+image+'"></img><p style="float:right">'+restaurant.description+'</p></div>';
        		var infowindow = new google.maps.InfoWindow({
        			content: contentString
        		});
        		
        		google.maps.event.addListener(marker, 'click', function() {
				  if(previous_infowindow){
				  		previous_infowindow.close();
				  	}
				  previous_infowindow=infowindow;
        		  infowindow.open(map,marker);
        		});
        		
        		$('#'+restaurant.token).bind('click', function(){
        		if(previous_infowindow){
        				previous_infowindow.close();
        			}
        		previous_infowindow=infowindow;
        		infowindow.open(map,marker);
        		
        		});
        		
        		
        		
        	  } else {
        	    alert("Geocode was not successful for the following reason: " + status);
        	  }
        	  
        	  
        	});
        	
        	
        }
}); 

function initialize(res) {
		 //console.log("initialize");
  var mapOptions = {
    zoom: 10,
    center:  new google.maps.LatLng(34.059021, -118.303739),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  var map = new google.maps.Map(document.getElementById("map_canvas"),
                                mapOptions);
	
  setMarkers(map, res);
}

/**
 * Data for the markers consisting of a name, a LatLng and a zIndex for
 * the order in which these markers should display on top of each
 * other.
 */
var restaurantes = [
  ['IOTA', "528 S Western Ave, Los Angeles, CA 90020"],
  ['LUCIA', "10974 Le Conte Ave Los Angeles, CA 90024"]
];

function setMarkers(map, locations) {

  var shape = {
      coord: [1, 1, 1, 20, 18, 20, 18 , 1],
      type: 'poly'
  };
  var query=new Array();
  for (var i = 0; i < locations.length; i++) {
	//console.log(JSON.parse(locations[i]));
    var restaurant = locations[i];
    //var myLatLng = new google.maps.LatLng(restaurant[1], restaurant[2]);
	
    query[i]=new Query(restaurant);
    query[i].setPin(map,shape);
    
  }
}

