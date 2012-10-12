/*
	If user is not on mobile - redirect to www.webitap.com/about
*/

function checkUserAgent(){
	var mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
	  if(!mobile){
			//window.location.replace("http://www.webitap.com/about");
			window.location.href = "http://www.webitap.com/about";
			//javascript:window.location.href = "http://www.webitap.com/about";
			return false;
	  }
}
 
//checkUserAgent(); !!!!!!!!!!!!

/*
	Store all events as TAPs or LOGINs
*/

// detect browser info
Browsers = new UserAgents(navigator.userAgent, {
	useFeatures:		true,
	detectCamouflage:	true
});

// query strings
var tag_id = getQueryVariable('?tag_id'); // tapped
var post_id = getQueryVariable('post_id'); // redirected from facebook
var code = getQueryVariable('code'); // tapped
var user_agent = Browsers.toString();

// generate data strings
if (tag_id && !post_id){
	var type = 'tap';
	var data = {'type':type, 'tag_id':tag_id, 'user_agent':user_agent};
}
else if(!tag_id && !code && !post_id){
	var type = 'login';
	var data = {'type':type, 'tag_id':'', 'user_agent':user_agent};
}

// post event to database !!!!!!!!!!!!!!!!!!!!!!
/*if(data && Browsers.device.type!='desktop'){
	$.ajax({
		type:"POST",
		url:"http://api.webitap.com/event_create", 
		data:JSON.stringify(data), 
		success:function(res){console.log(res)}
	});
}*/