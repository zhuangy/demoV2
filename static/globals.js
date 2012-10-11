var user ={
	iphone: ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)))? true : false
}

var size={
	width: ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) ? window.innerWidth : window.outerWidth,
	height: ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) ? window.innerHeight : window.outerHeight
}

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

var API_address = "http://192.168.1.102:8080";