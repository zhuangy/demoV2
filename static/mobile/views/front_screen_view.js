/*
	FRONT SCREEN VIEW. model: screen
*/
var FrontScreenView = Backbone.View.extend({
	events:{
		"click #swipeview--1": "fbook_click"
	},

	initialize: function(){
		// every function that uses 'this' as the current object should be in here
		_.bindAll(this, 'render', 'slideshow', 'fbook_click');
	},
	
	render:function(index, code, pageNum){
		//var headerStr = '<div class="h" id ="h'+this.model.get('token')+'" style="width:'+size.width/2+'px"><img class="valigner" />'+this.model.get('name')+'</div>';
		//$('#header_view').append(headerStr);
		
		//if(index==0){
		//	$('#h'+this.model.get('token')).css('margin-left', size.width/4+'px');	
		//}
		
		//var h = document.getElementById('headerswipe-'+pageNum);
		//h.innerHTML = '<img class="valigner" />'+this.model.get('name');
		this.el = document.createElement('div');
		this.el.id=this.model.get('token');
		this.el.className='col_front';

		var that = this;
		// get screen data from redis
		API.get('splash?screen_token='+this.model.get('token'), true, function(err){console.log(err);}, function(res){
			
			
			//preload large images
			
			for(i=1;i<7;i++){
				var img = new Image();
				img.src = res['img'+i];
			}
			

			 //data={token: that.model.get('token'), 'img1': res['img1'], 'img2': res['img2'], 'img3': res['img3'], 'img4': res['img4'], 'img5': res['img5'], 'img6': res['img6'], 'img_logo':res['img_logo'], 'img_fbook':res['img_fbook'], 'fbook_name':res['fbook_name'], 'fbook_link':res['fbook_link'], 'code':code, 'event_token':EVENT_TOKEN};
			//data={token: that.model.get('token'), 'img1': res['img1'].replace('.jpg','_thumbnail.jpg'), 'img2': res['img2'].replace('.jpg','_thumbnail.jpg'), 'img3': res['img3'].replace('.jpg','_thumbnail.jpg'), 'img4': res['img4'].replace('.jpg','_thumbnail.jpg'), 'img5': res['img5'].replace('.jpg','_thumbnail.jpg'), 'img6': res['img6'].replace('.jpg','_thumbnail.jpg'), 'img_logo':res['img_logo'], 'img_fbook':res['img_fbook'], 'fbook_name':res['fbook_name'], 'fbook_link':res['fbook_link'], 'code':code, 'event_token':EVENT_TOKEN};
			data={token: that.model.get('token'), 'img1': 'img/backButton.png', 'img2': 'img/backButton.png', 'img3': 'img/backButton.png', 'img4': 'img/backButton.png', 'img5': 'img/backButton.png', 'img6': 'img/backButton.png', 'img_logo':res['img_logo'], 'img_fbook':res['img_fbook'], 'fbook_name':res['fbook_name'], 'fbook_link':res['fbook_link'], 'code':code, 'event_token':EVENT_TOKEN, 'fbook_item':res['fbook_item']};
			
			that.fbook_name = res['fbook_name'];
			that.fbook_link = res['fbook_link'];
			that.code = code;
			that.img_fbook = res['img_fbook'];
			
			dust.render("frontScreen", data, function(err, out) {
				if (!err){
					//$(that.el).html(out);
					//$(that.el).css({'left': (index)*size.width+'px'});

					$('#swipeview-'+pageNum).append(out);
					//var div = document.getElementById('swipeview-'+pageNum);
					////div.innerHTML = out;
					//div.appendChild(that.el);
					
					$('.col_front .slideshow img')[0].src = res['img1'];
					$('.col_front .slideshow img')[3].src = res['img4'];
					setTimeout(function(){
						$('.col_front .slideshow img')[1].src = res['img2'];
						$('.col_front .slideshow img')[4].src = res['img5'];
					},1000)
					setTimeout(function(){
						$('.col_front .slideshow img')[2].src = res['img3'];
						$('.col_front .slideshow img')[5].src = res['img6'];
					},2000)

					
					//$('.col_front').css({'left': (index)*size.width+'px'});
								  //'width': width+'px',
								  //'background-color': 'black',
								  //'height': 0.925*height+'px'});
					
					if(FACEBOOK_POST){
						$('#facebookOverlay').css({'background-image': 'url(img/iota/facebook_confirmation.png)',
													'width':'100%',
													'background-size': '100% auto'});
						$('#fbookButton').html('');
					}
					else{
						//$('#fbookButton').css('width', ($('#facebookOverlay').height()*0.4)+'px');
						//$('#fbookButton').css('left', ($('#facebookOverlay').height()*1.7)+'px');
						if(!user.iphone){
							//$('#facebookOverlay').css('height', '45%');
							$('.fbook_text').css('padding-top', '6%');
							$('#fbookButton').css('width', '13%');
						}
						var h = $('#facebookOverlay').height();
						var n = res['fbook_item'].length-5;
						var diff = n>0 ? n*2 : 0;
						$('.fbook_1').css('font-size', h*(23-diff)/100+'px');
						$('.fbook_2').css('font-size', (h*0.13)+'px');
						$('.fbook_3').css('font-size', (h*0.13)+'px');
						if(user.iphone){$('.fbook_4').css('font-size', (h*0.28)+'px');}
						else{$('.fbook_4').css('font-size', (h*0.25)+'px');}
						setTimeout(function(){$("#swipeview--1").click(that.fbook_click);},3000);
						//$("#facebookOverlay").click(that.fbook_click);
					}

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
	
	fbook_click: function(e){
		x_pos = 100*e.pageX/size.width;
		y_pos = 100*e.pageY/size.height;
		if(62.5<=y_pos && y_pos<=82.5 && 0<=x_pos && x_pos<=80 && !($('#navigationOverlay').css('display')=='block')){
			e.stopPropagation();
			tappedFacebook = true;
			setTimeout(function(){tappedFacebook=false;},2000);
			
			//store event
			ACTIONS.push({action: 'clickFacebook', time: new Date().getTime()});
			
			window.location.href = 'https://www.facebook.com/dialog/feed?app_id=150769608397642&link='+this.fbook_link+'&picture='+this.img_fbook+'&name='+this.fbook_name+'&caption=Brought%20to%20you%20by%20WebiTap&description=Using%20Dialogs%20to%20interact%20with%20users.&redirect_uri=http://www.webitap.com/mobile/?code='+this.code;
		}
		
	}
	
});