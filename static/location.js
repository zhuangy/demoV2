$(document).ready(function(e) {
	$('body').unbind('click');
	//console.log("here");
	//console.log(jQuery.support.cors);
	var UA = navigator.userAgent;
	// if (UA.indexOf("BlackBerry") >= 0)  {      
	 //    if (UA.indexOf("MIDP") >= 0)  {
	    // $.support.cors = true;
	 //    }
	// }  
	$.ajax({
		type:"GET",
		dataType: 'json',
		url: "http://api.webitap.com/orgs", 
		//contentType: "application/json",
		headers: {'Authorization': 'Basic ZGFuaGFrOndlYmkyMDEyIQ=='},
		success:function(res){
		//console.log(res);
		//res=JSON.parse(res);
		//console.log(info.length);
		//console.log("here");
			for(i=0; i<res.length; i++){
				//console.log("here");
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
		error: function (XMLHttpRequest, textStatus, errorThrown) {
		      alert(JSON.stringify(XMLHttpRequest));
		        }
	});



	//setTimeout(function() {initialize()}, 500);
					
})

