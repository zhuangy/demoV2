/*
	If user is not on mobile - redirect to www.webitap.com/about
*/
/*
function checkUserAgent(){
	var mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
	  if(!mobile){
			window.location.href = "http://www.webitap.com/about";
			return false;
	  }
}
 
checkUserAgent(); // !!!!!!!!!!!!
*/

/*
	Store all events as TAPs or LOGINs
*/

// detect browser info
Browsers = new UserAgents(navigator.userAgent, {
	useFeatures:		true,
	detectCamouflage:	true
});

/*
function setCookie(c_name,value,exdays){
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}
*/



function saveEvent(){
	// query strings
	var tag_id = getQueryVariable('?tag_id'); // tapped
	var post_id = getQueryVariable('post_id'); // redirected from facebook
	var code = getQueryVariable('code'); // tapped
	var user_agent = Browsers.toString();
	//add cookies
	var d = new Date();
	var n = d.getTime();
	var cookie_id=getCookie("cookie_id");
	if (cookie_id==null || cookie_id==""){
		cookie_id=n;
		setCookie("cookie_id",cookie_id,365*24);
	}
	
	// generate data strings
	if (tag_id && !post_id){
		var type = 'tap';
		var data = {'type':type, 'tag_id':tag_id, 'user_agent':user_agent, 'cookie_id':cookie_id, 'actions':[{'action':'loaded','time':new Date().getTime()}]};
	}
	else if(!tag_id && !code && !post_id){
		var code = CONF['code'];
		var type = 'login';
		var data = {'type':type, 'code':code, 'user_agent':user_agent, 'cookie_id':cookie_id, 'actions':[{'action':'loaded','time':new Date().getTime()}]};
	}
	
	// post New event to database !!!!!!!!!!!!!!!!!!!!!!
	if(data){
		$.ajax({
			type:"POST",
			url: CONF['api-host']+"/event_create", 
			//url: "http://192.168.1.106:8080/event_create",
			data:JSON.stringify(data), 
			success:function(res){
				EVENT_TOKEN = res.event_token; //store event token for use in actions updates
				ACTIONS = [];// empty actions var
				//store loaded action
				ACTIONS.push({action: 'loaded', time: new Date().getTime()});
				num_actions = ACTIONS.length;
				console.log('posted event');
				// set event cookie to expire in 2 hours
				setCookie("webitap_event",EVENT_TOKEN,2);
			},
			error: function(err){console.log(err)}
		});
	} else if(post_id){
		// Check if webitap_event cookie is stored
		var ev_token=getCookie("webitap_event");
		if (ev_token!=null && ev_token!=""){
			EVENT_TOKEN = ev_token;
			// if yes -> fill in ACTIONS variable with actions from the server
			$.ajax({
				type:"GET",
				url: CONF['api-host']+"/actions_get?event_token="+EVENT_TOKEN,
				//url:"http://192.168.1.106:8080/actions_get?event_token="+EVENT_TOKEN,
				headers:{'Authorization':'Basic ZGFuaGFrOndlYmkyMDEyIQ=='}, 
				//headers:{'Authorization':'Basic bWFzaGE6MTIzNDU='}, 
				success: function(res){
						ACTIONS = res;
						num_actions = ACTIONS.length;
						//if(getQueryVariable('post_id')){
							//store event (returned from facebook share)
							ACTIONS.push({action: 'sharedFacebook', time: new Date().getTime()});
						//}
				}, 
				error:function(err){console.log(JSON.stringify(err));} 
			})
		}	
	}
		
	/*
	else if (Browsers.device.type=='desktop' && !post_id){
		var data = {'type':'desktop', 'code':'test', 'user_agent':'desktop', 'cookie_id':'123456789'};
		
		$.ajax({
			type:"POST",
			url: CONF['api-host']+"/event_create", 
			//url: "http://192.168.1.107:8080/event_create",
			data:JSON.stringify(data), 
			success:function(res){
				EVENT_TOKEN = res.event_token; //store event token for use in actions updates
				ACTIONS = [];// empty actions var
				// set event cookie to expire in 2 hours
				setCookie("webitap_event",EVENT_TOKEN,2);
			},
			error: function(err){console.log(err)}
		});
	}
	*/
}