/*
	FRONT SCREEN VIEW. model: screen
*/
var FrontScreenView = Backbone.View.extend({
	
	events: {
		"click #facebook":"fbook_click"
	},
	
	initialize: function(){
		// every function that uses 'this' as the current object should be in here
		_.bindAll(this, 'render', 'slideshow', 'fbook_click');
	},
	
	render:function(index, code){
		var headerStr = '<div class="h" id ="h'+this.model.get('token')+'" style="width:'+size.width/2+'px"><img class="valigner" />'+this.model.get('name')+'</div>';
		$('#header_view').append(headerStr);
		
		if(index==0){
			$('#h'+this.model.get('token')).css('margin-left', size.width/4+'px');	
		}
		
		var that = this;
		// get screen data from redis
		API.get('splash?screen_token='+this.model.get('token'), true, function(err){console.log(err);}, function(res){
			
			data={'img1': res['img1'], 'img2': res['img2'], 'img3': res['img3'], 'img4': res['img4'], 'img5': res['img5'], 'img6': res['img6'], 'img_logo':res['img_logo'], 'img_fbook':res['img_fbook'], 'fbook_name':res['fbook_name'], 'fbook_link':res['fbook_link'], 'code':code, 'event_token':EVENT_TOKEN};
			
			that.fbook_name = res['fbook_name'];
			that.fbook_link = res['fbook_link'];
			that.code = code;
			that.img_fbook = res['img_fbook'];
			
			dust.render("frontScreen", data, function(err, out) {
				if (!err){
					$('#screens_view').append(out);
					
					var width = $('#menu_screen').width();
					var height = $('#menu_screen').height();
					
					$('#col_front').css({'left': (index)*size.width+'px',
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
					
					$("#facebook").click(that.fbook_click);
					
					that.slideshow(0,1,3);
					
				} else{
					return console.log(err);
				}
			});
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
	},
	
	fbook_click: function(){
		console.log('clickfacebook');
		tappedFacebook = true;
		
		//store event
		ACTIONS.push({action: 'clickFacebook', time: new Date().getTime()});
		
		window.location.href = 'https://www.facebook.com/dialog/feed?app_id=150769608397642&link='+this.fbook_link+'&picture='+this.img_fbook+'&name='+this.fbook_name+'&caption=Brought%20to%20you%20by%20WebiTap&description=Using%20Dialogs%20to%20interact%20with%20users.&redirect_uri=http://www.webitap.com/mobile/?code='+this.code;
		
		
	}
	
});