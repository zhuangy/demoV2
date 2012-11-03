$(document).ready(function(e) {
	$.ajax({
		type:"GET",
		url: "http://api.webitap.com/orgs", 
		headers: {'Authorization': 'Basic ZGFuaGFrOndlYmkyMDEyIQ=='},
		success:function(res){
		
			for(i=0; i<res.length; i++){
			
			  // DO SOMETHING WITH THE ORG INFO HERE!!		  
			  //console.log(JSON.parse(res[i]));
			  var info=JSON.parse(res[i]);
			
			  data={
				  name:info.name,
				  code0:info.code%10,
				  code1:parseInt(info.code/10)%10,
				  code2:parseInt(info.code/100)%10,
				  code3:parseInt(info.code/1000)%10,
				  address1:info.address1,
				  address2:info.address2,
				  logo:info.logo,
				  token:info.token
				  
			  }
			  dust.render("about", data, function(err, out) {
			  	if (!err){
			  		$('#map_left_container').append(out);
			  		return this;
			  	} else{
			  		return console.log(err);
			  	}
			  });
			  
			  
			}
			google.maps.event.addDomListener(window, 'load', initialize(res));
			
			
			
		},
		error: function(err){console.log(err)}
	});



	//setTimeout(function() {initialize()}, 500);
					
})

