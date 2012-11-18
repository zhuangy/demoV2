$(document).ready(function(e) {
	$('body').unbind('click');
	$.ajax({
		beforeSend: function(xhrObj){
                xhrObj.setRequestHeader("Authorization","Basic bWFzaGE6MTIzNDU=");
                //xhrObj.setRequestHeader("Accept","application/json");
        },

		type:"GET",
		dataType: 'json',
		url: "http://api.webitap.com/orgs", 
		//url: "http://192.168.1.105:8080/orgs", 
		//headers: {'Authorization': 'Basic bWFzaGE6MTIzNDU='},
		success:function(res){
			//console.log(res);
		//console.log(res);
		//res=JSON.parse(res);
		//console.log(info.length);
			for(i=0; i<res.length; i++){
				
				  // DO SOMETHING WITH THE ORG INFO HERE!!		  
				  //console.log("lalal");
				//var info=res[i];  
				var info=JSON.parse(res[i]);
				//console.log("info:"+info.name);
				//console.log("hah")
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
		error: function(xmlReq, status, errorMsg){
        	console.log("Error Message: "+ errorMsg);
        	console.log("Status: "+ status);
        	console.log(JSON.stringify(xmlReq));

        	throw(errorMsg);
    	}
	});



	//setTimeout(function() {initialize()}, 500);
					
})

