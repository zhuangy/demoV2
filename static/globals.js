/* VARIABLES */

var user ={
	mobile: (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase())),
	iphone: ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)))? true : false
}

var size={
	width: user.iphone ? Math.min(window.innerWidth, window.innerHeight) : Math.min(window.outerWidth, window.outerHeight+1),
	height: user.iphone ? Math.max(window.innerWidth, window.innerHeight) : Math.max(window.outerWidth, window.outerHeight+1)
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

var ACCESS_CODE = '1111';
var API_address = "http://192.168.1.102:8080";
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
			window.scrollTo(0.1);
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
	if (code && code == ACCESS_CODE) {
		// TAP - load the app :)
		var loadingView = new LoadingView();
		$('[data-role="page"]').append(loadingView.render().el);
		loadingView.loadMenu();
	} else if (!code) {
		// didnt' tap - LOAD noNFC SCREEN
		var nonfcView = new noNFCView();
		nonfcView.render();
		nonfcView.slide(1,0);
	}
	//if wrong code - show 404 error?
	
	
});	