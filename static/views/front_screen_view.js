var FrontScreenView = Backbone.View.extend({
	
	events: {
	},
	
	initialize: function(){
		// every function that uses 'this' as the current object should be in here
		_.bindAll(this, 'render');
	},
	
	render:function(){
		$.ajax({
			url : "/htmlTemplates/frontScreen.html",
			success : function(string){
				$('#menu_view').append(string);
			
				var BrowserWidth = window.outerWidth;
				var BrowserHeight = window.outerHeight;
				
				$('#col_front').css({'left': '0px',
							  'width': BrowserWidth+'px',
							  'height': BrowserHeight+'px',
							  'background-color': 'black'});
				
				function slideshow(curr,prev, numPhotos){
					$('#slideL'+curr).addClass('slideLeft');
					$('#slideR'+curr).addClass('slideRight');
					
					//update slides
					prev = curr;
					curr = (curr+1) % numPhotos;
					
					setTimeout(function(){
						slideshow(curr,prev, numPhotos);
					},7000);
					
					setTimeout(function(){
						$('#slideL'+prev).removeClass('slideLeft');
						$('#slideR'+prev).removeClass('slideRight');
					},10000);	
				}
				slideshow(0,1,3);
			}
		});
	}
});