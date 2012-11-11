/*** FUNCTIONS ***/

// SET COOKIE in browser with expiration time in hours
function setCookie(c_name,value,exhours){
	var now = new Date();
	var time = now.getTime();
	time += exhours*3600 * 1000;
	now.setTime(time);
	
	var c_value=escape(value) + ((exhours==null) ? "" : "; expires="+now.toGMTString() );
	document.cookie=c_name + "=" + c_value;
}

// GET COOKIE
function getCookie(c_name){
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++){
	  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
	  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
	  x=x.replace(/^\s+|\s+$/g,"");
	  if (x==c_name){
		return unescape(y);
	  }
	}
}

// GET QUERY VARIABLE
function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) {
			return pair[1];
		}
	}
}

/*** VARIABLES ***/

var user ={
	mobile: (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase())),
	iphone: ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)))? true : false
}

if(user.iphone){
	$('#device-stylesheet').attr('href', 'css/iphone.css');	
}

var size={
	width: user.iphone ? Math.min(window.innerWidth, $(window).height()-60) : Math.min(window.outerWidth, window.outerHeight+1),
	height: user.iphone ? Math.max(window.innerWidth, $(window).height()-60) : Math.max(window.outerWidth, window.outerHeight+1)
}

// if app loaded in landscape mode - adjust for potential status bar
if (user.mobile){
	var wS = Math.min(screen.width, screen.height); //screen width
	var hS = Math.max(screen.width, screen.height); // screen height
	
	if(size.width<wS){
		size.width = wS;
		size.height = size.height-(wS-size.width);
	}
}

var tappedFacebook = false; //global variable - used to check if user tapped the facebook share link
var VIDEO = []; //initialize global VIDEO variable - store video objects from each screen, if present
var ACTIONS = []; // initialize global variable to record user Actions - to store user interactions with the app
var EVENT_TOKEN; //initialize event_token variable - event toke is stored in a cookie when the user first loads the app
CONF={
	'api-host' : 'http://api.webitap.com' // api address
}

/*
// Check if webitap_event cookie is stored
var ev_token=getCookie("webitap_event");
if (ev_token!=null && ev_token!=""){
	EVENT_TOKEN = ev_token;
	// if yes -> fill in ACTIONS variable with actions from the server
	$.ajax({
		type:"GET",
		url: CONF['api-host']+"/actions_get?event_token="+EVENT_TOKEN,
		//url:"http://192.168.1.107:8080/actions_get?event_token="+EVENT_TOKEN,
		headers:{'Authorization':'Basic ZGFuaGFrOndlYmkyMDEyIQ=='}, 
		//headers:{'Authorization':'Basic bWFzaGE6MTIzNDU='}, 
		success: function(res){
				ACTIONS = res;
				if(getQueryVariable('post_id')){
					//store event (returned from facebook share)
					ACTIONS.push({action: 'sharedFacebook', time: new Date().getTime()});
				}
		}, 
		error:function(err){console.log(JSON.stringify(err));} 
	})
}
*/

//store actions function - called periodically while user interacts with the app
var num_actions = ACTIONS.length;
function store_actions(){
	var data = {event_token: EVENT_TOKEN, actions: ACTIONS};
	if(ACTIONS.length>num_actions){
		num_actions = ACTIONS.length;
		$.ajax({
			type:"POST",
			url: CONF['api-host']+"/actions_update", 
			//url:"http://192.168.1.106:8080/actions_update", 
			data: JSON.stringify(data),
			headers:{'Authorization':'Basic ZGFuaGFrOndlYmkyMDEyIQ=='}, 
			//headers:{'Authorization':'Basic bWFzaGE6MTIzNDU='}, 
			success: function(res){console.log('updated');},
			error: function(err){console.log(JSON.stringify(err));}
		});
	}
	
}

setInterval(function(){
	store_actions();
},120000);

var FACEBOOK_POST= getQueryVariable('post_id');

/* FUNCTIONS */

function setStarsRating(id, rating){
	$(id).each(function(index) {	
		if(index<rating){
			$(this).attr('src', 'img/star_yellow.png');
		}
		else{
			$(this).attr('src', 'img/star_grey.png');	
		}
	})
}

function checkOrientation() {  
	if(user.iphone){
		var w = window.innerWidth;
		var h = window.innerHeight;
	}
	else {
		var w = window.outerWidth;
		var h = window.outerHeight;
	}
	
	if (h > w) {
		$('#wrongorientation').css('display', 'none');
	} 
	else if(h<w && w>size.width) {
		$('#wrongorientation').css('width', w);
		$('#wrongorientation').css('height', h+1);
		$('#wrongorientation').css('display', 'block');
	}              
} 


$(document).ready(function (){
	/*
		Check orientation to make sure phone is in portrait mode
	*/
	checkOrientation();
	
	/*
		On orinetation change - cover the screen
	*/
	window.onresize = function(e) { //your code  
    	e.preventDefault();
		window.scrollTo(0,1);
		checkOrientation();
	}
	
	/*
		Orinetation change for iphone
	*/
	window.onorientationchange = function() {
		window.scrollTo(0,1);
		checkOrientation();
	}
	
	/*
		Prevent native scroll
	*/
	document.body.addEventListener('touchmove', function(e) {
		if (window.pageYOffset==1){
			e.preventDefault();
		}
	}, false);
	
	/*
		Check that screen is scrolled to y=1
	*/
	setInterval(function() {
		if (window.pageYOffset!=1){
			window.scrollTo(0,1);
		}
	}, 1000);
	
	/*
		Define screen dimensions - take into account iphone footer bar
	*/
	$('body').css('font-size', size.width*0.06+'px');
	$('body').css('width', size.width+'px');
	$('body').css('height', size.height+'px');
	$('[data-role="page"]').css('width', size.width+'px');
	$('[data-role="page"]').css('height', size.height+'px');
	
	/*
		Load the app!
	*/	
	var code = getQueryVariable('code');
	if (code) {
		// TAP - load the app :)
		var loadingView = new LoadingView({});
		$('[data-role="page"]').append(loadingView.render().el);
		loadingView.loadMenu();
	} else if (!code) {
		// didnt' tap - LOAD noNFC SCREEN
		var nonfcView = new noNFCView();
		nonfcView.render();
		nonfcView.slide(1,0);
	}
	//if wrong code - show 404 error?
	
	/*
		Display a warning when user is leaving the page
	*/	
	window.onbeforeunload = function() {		
		store_actions();
		if(tappedFacebook){
			return "You will be temporarily redirected to Facebook to share your story";
		}
		else{
			return "You are about to leave WebiTap";	
		}
	}
	/*
		Catch when users close tab. Works on Android and Safari. Send the actions info one last time.
	*/
	window.onunload = function() {
		//store action
		ACTIONS.push({action: 'leaving', time: new Date().getTime()});
		
		var data = {event_token: EVENT_TOKEN, actions: ACTIONS};
		$.ajax({
			type:"POST",
			async: false,
			url: CONF['api-host']+"/actions_update", 
			//url:"http://192.168.1.106:8080/actions_update", 
			data: JSON.stringify(data),
			headers:{'Authorization':'Basic ZGFuaGFrOndlYmkyMDEyIQ=='}
			//headers:{'Authorization':'Basic bWFzaGE6MTIzNDU='}
		});
	}
	
});	