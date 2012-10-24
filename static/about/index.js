
$(document).ready(function() {
    // Set sizes
	var w = $('body').width();
	w = w*0.90;
	$('.slideshow_container').css('width', w + 'px');
    $('.slideshow_container').css('height', w*0.55 + 'px');
	
	$('.logo_container').css('width', w + 'px');
	$('.logo').css('margin-left', w*0.1 + 'px');
	
	$('#click').css('margin-top', w*0.6*-0.15 + 'px');
	
	$('.banner_container').css('height', w*0.6*0.15 + 'px');
	$('#video-popup').css('margin-top', w*0.6*0.135 + 'px');
	$('#video-popup').css('height', w*0.38 + 'px');
	
	var h = w*0.38*0.9
	$('#video-placer').css('width', h*1.6 + 'px');
	$('#video-placer').css('height', h + 'px');

	// Slideshow
	$('.slideshow').cycle({
		fx: 'fade', // choose your transition type, ex: fade, scrollUp, shuffle, etc...
		speed:  2500,
		timeout: 8000
	});
});

// Start player
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player');
}

// play video
     $(document).ready(function() {
	
		$('#click').click(function() {
			$('#video-popup').fadeIn(1000, function(){
			  		player.playVideo();
			 });
		});
		
		$('body').click(function(event){
			if (event.target.id!="click"){
				player.stopVideo();
				$('#video-popup').fadeOut(1000);
			}
		});

	});
