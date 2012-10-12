var FrontScreenView = Backbone.View.extend({
	
	events: {
	},
	
	initialize: function(){
		// every function that uses 'this' as the current object should be in here
		_.bindAll(this, 'render', 'slideshow');
	},
	
	render:function(){
		var that = this;
		$.ajax({
			url : "/htmlTemplates/frontScreen.html",
			success : function(string){
				
				$('#menu_view').append(string);
				
				var width = $('#menu_screen').width();
				var height = $('#menu_screen').height();
				
				$('#col_front').css({'left': '0px',
							  'width': width+'px',
							  'height': height+'px',
							  'background-color': 'black',
							  'height': 0.925*height+'px',
						      'top': 0.075*height+'px'});
				
				if(FACEBOOK_POST){
					$('#facebookOverlay').css('background-image', 'url(img/iota/facebook_confirmation.png)');
					$('#facebookOverlay').css('background-size', '100% auto');
					$('#fbookButton').html('');
				}
				else{
					$('#fbookButton').css('width', ($('#facebookOverlay').height()*0.4)+'px');
					$('#fbookButton').css('left', ($('#facebookOverlay').height()*1.7)+'px');
				}
				
				that.slideshow(0,1,3);
			}
		});
	},
	
	slideshow: function(curr,prev, numPhotos){
		$('#slideL'+curr).addClass('slideLeft');
		$('#slideR'+curr).addClass('slideRight');
		
		//update slides
		prev = curr;
		curr = (curr+1) % numPhotos;
		
		var that = this;		
		setTimeout(function(){
			that.slideshow(curr,prev, numPhotos);
		},7000);
		
		setTimeout(function(){
			$('#slideL'+prev).removeClass('slideLeft');
			$('#slideR'+prev).removeClass('slideRight');
		},10000);	
	}
	
});