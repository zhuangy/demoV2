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
				
				var width = $('#menu_screen').width();
				var height = $('#menu_screen').height();
				
				$('#col_front').css({'left': '0px',
							  'width': width+'px',
							  'height': height+'px',
							  'background-color': 'black',
							  'height': 0.925*height+'px',
						      'top': 0.075*height+'px',
						      'padding-top': height*0.02+'px'});
		
				$('#fbookButton').css('width', ($('#facebookOverlay').height()*0.4)+'px');
				$('#fbookButton').css('left', ($('#facebookOverlay').height()*1.7)+'px');
				
				
				// slideshow function
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
	},
	
	fillContent: function(string){
		$('#menu_view').append(string);
				
		$('#col_front').css({'left': '0px',
					  'width': this.BrowserWidth+'px',
					  'height': this.BrowserHeight+'px',
					  'background-color': 'black',
					  'height': 0.925*this.BrowserHeight+'px',
					  'top': 0.075*this.BrowserHeight+'px',
					  'padding-top': this.BrowserHeight*0.02+'px'});

		$('#fbookButton').css('width', ($('#facebookOverlay').height()*0.4)+'px');
		$('#fbookButton').css('left', ($('#facebookOverlay').height()*1.7)+'px');
		
		
		// slideshow function
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