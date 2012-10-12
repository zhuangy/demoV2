var MenuView = Backbone.View.extend({
	el: '#menu_view',									
	
	events: {
		//"mousedown":"ontouchstart",
		//"mousemove":"ontouchmove",
		//"mouseup":"ontouchend",
		"touchstart":"ontouchstart",
		"touchmove":"ontouchmove",
		"touchend":"ontouchend",
		"click":"openOverlay"
	},
	
	initialize: function() {
		// every function that uses 'this' as the current object should be in here
		_.bindAll(this, 'render', 'slide', 'ontouchstart', 'ontouchmove', 'ontouchend', 'tap_home', 'tap_header', 'loadNextScreen', 'openOverlay');
		
		//this.ScreenCollection = new Screens();
		this.screenView = new Object();
		
		//this.data = data;
		this.BrowserWidth = size.width;
		this.BrowserHeight = size.height;
		
		$(this.el).css('height', this.BrowserHeight);
		
		this.index = 0;
		this.speed = 300;
		this.ended = 1;
		
	},
	
	render: function(data){
		$('#menu_screen').append('<div id="header"><div id="header_view"><div class="h" id="h_front"><img class="valigner" />WELCOME</div></div></div><div id="headerBlur"></div>');
		$('#menu_screen').append('<div data-role="footer" id="footer" class="alpha60"><img id="backButton" src="img/webitap/backButton.png"/><div id="homeButton"></div></div>');
		
		// Navigation screen
		if (!FACEBOOK_POST) {
			$('[data-role="page"]').append('<div id="navigationOverlay"></div>'); // navigation overlay screen
		}
		
		$("#homeButton").click(this.tap_home);
		$("#backButton").click(this.tap_back);
		$('#navigationOverlay').bind('touchstart', function(ev){
			$('#navigationOverlay').remove();
		});
		// header - swipe on tap
		$('#headerBlur').click(this.tap_header);
		
		this.data = data;
		this.numSlides = data.length+1;
		
		// some css
		$(this.el).css('width', this.numSlides*this.BrowserWidth+'px');
		$('#header_view').css('width', this.numSlides*this.BrowserWidth+'px');
		$('.h').css('width', (this.BrowserWidth/2)+'px');
		$('#h_front').css('margin-left', this.BrowserWidth/4+'px');

		// initialize 1st 2 sreens
		var frontscreenView = new FrontScreenView();
		frontscreenView.render();
		
		//var menu_screen = new Screen();
		//Screens.add(menu_screen);
		
		this.screenView[0] = new ScreenView({model:menu_screen});
		this.screenView[0].render(0, this.data[0]);
		
		console.log('rendered menu_view');
		
		if($('#loading_screen')){
			setTimeout(function(){
				$('#loading_screen').remove();
			}, 1500);
		}
		// animate transition out
		setTimeout(function(){
			$('#noNFCscreen_top').addClass('validated_slideUp');
			$('#noNFCscreen_bottom').addClass('validated_slideDown');
			setTimeout(function(){
				$('#noNFC_screen').remove();
			},800);
		},800);
	},
	
	tap_home: function(){
		console.log('button tap');
		if ($('#overlay').css('display')=='none'){
		  //$('#col_front').css('display', 'block');
		  this.slide(0, 300, -1);
		} 
		else if($('#enterCommentOverlay').css('display')=='block'){
			$('#enterCommentOverlay').css('display','none');
		}
		else if ($('#overlay').css('display')=='block') {
		  if(user.iphone) {
			$('#overlay').css('-webkit-transform', 'scale(.5)');
		  }
		  $('#overlay').css('opacity', '0');
		 
		  $("#insert .slideshow").css('display','block');
		  $('#col0 iframe').css("display","block");
		  
		  $('#overlay').css('display', 'none');
		  $('#overlay-blur').css('display', 'none');
		  $('#backButton').css('display', 'none');
		}
		else{
			console.log('overlay not defined yet');
		}
		
	},
	
	tap_back: function(){
		if ($('#overlay').css('display')=='none') {
		  //$('#tap').css('display', 'block').html($(ev.target).attr('id'));
		  this.slide(0, 300, -1);
		}
		else if($('#enterCommentOverlay').css('display')=='block'){
			$('#enterCommentOverlay').css('display','none');
		}
		else if ($('#overlay').css('display')=='block') {
		  
		  if(user.iphone) {
			$('#overlay').css('-webkit-transform', 'scale(.5)');
			$('#col0 iframe').css("display","block");
		  }
		  $('#overlay').css('opacity', '0');
  
		  $('#overlay').css('display', 'none');
		  $('#overlay-blur').css('display', 'none');
		  $('#backButton').css('display', 'none');
		  
		   $("#insert .slideshow").css('display','block');
		}	
	},
	
	tap_header: function(ev){
		if (ev.pageX>this.BrowserWidth*3/4 && this.index<this.numSlides-1){
			this.slide(this.index+1, 300, -1);
		}
		else if (ev.pageX<this.BrowserWidth*1/4 && this.index>0){
			this.slide(this.index-1, 300, 1);
		}
	},
	
	openOverlay: function(ev){
		console.log('you tapped');
		ev = ev.originalEvent.touches ? ev.originalEvent.touches[0] : ev;
		
		// find token of tapped item
		var $li = $(ev.target).closest('li');
		var cl = $li.attr('class');
		var tapped_token = $li.attr('data-token');
		console.log(tapped_token);
		
		// detect which menu sreen was tapped
		var $div = $(ev.target).parent().closest('div[id]');
		var idstr = $div.attr('id');
		var screenNum = idstr.substr(8)
		
		// search through corresponding items collection to find model with this token
		this.screenView[screenNum].collection.each(function(item) {
			if (item.get('token') == tapped_token){
				console.log(item.get('token'));
				var itemOverlay = new ItemDetailedView({model:item});
				itemOverlay.render();
				// initialize overlay veiew with this model
			}
		});
	},
	
	loadNextScreen: function(index, data, length){
		this.screenView[index] = new ScreenView();
		this.screenView[index].render(index, data);
		this.length++;
	},
	
	slide: function(index, duration, direction){
		// fallback to default speed
		if (duration == undefined) {
			duration = this.speed;
		}
	
		$(this.el).css({'webkitTransitionDuration':duration+'ms',
						 'webkitTransform': 'translate3d(' + -(index * this.BrowserWidth) + 'px,0,0)'});
		$('#header_view').css({'webkitTransitionDuration':duration+'ms',
						 'webkitTransform': 'translate3d(' + -(index * this.BrowserWidth/2) + 'px,0,0)'});

		
		this.index = index;
		
		  if(direction<0 && $('#menu_view').children('.col').length<=index+1 && $('#menu_view').children().length<this.numSlides){
			var that = this; 
			setTimeout(function(){
				that.loadNextScreen(index, that.data[index], that.numSlides)
			},301);

		  }
		if (this.index!=1){
			window.video.stopVideo();	
		}
	},
	
	ontouchstart: function(e){
		console.log('touchstart');
		this.start = {
		  // get touch coordinates for delta calculations in onTouchMove
		  pageX: e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX,
		  pageY: e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY,
	
		  // set initial timestamp of touch sequence
		  time: Number( new Date() )
		};

		// used for testing first onTouchMove event
		this.isScrolling = undefined;
		
		// reset deltaX
		this.deltaX = 0;
		this.deltaY = 0;
	
		$(this.el).css({'webkitTransitionDuration':'0ms'});
		$('#header_view').css({'webkitTransitionDuration':'0ms'});
		this.ended = 0;
		
		e.stopPropagation();
	},
	
	ontouchmove: function(e){
		if (this.ended) return;
		// ensure swiping with one touch and not pinching
		if((e.originalEvent.touches && e.originalEvent.touches.length > 1) || e.scale && e.scale !== 1) return; 
	 
		this.deltaX = (e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.pageX) - this.start.pageX;
		this.deltaY = (e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY) - this.start.pageY;
		
		// determine if scrolling test has run - one time test
		if ( typeof this.isScrolling == 'undefined') {
		  this.isScrolling = !!( this.isScrolling || Math.abs(this.deltaX) < Math.abs((e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY) - this.start.pageY) );
		}
		
		// if user is not trying to scroll vertically
		if (!this.isScrolling) {
		
		  // prevent native scrolling 
		  e.preventDefault();

		  // increase resistance if first or last slide
		  this.deltaX = 
			this.deltaX / 
			  ( (!this.index && this.deltaX > 0               // if first slide and sliding left
				|| this.index == this.length - 1              // or if last slide and sliding right
				&& this.deltaX < 0                            // and if sliding at all
			  ) ?                      
			  ( Math.abs(this.deltaX) / this.BrowserWidth + 1 )      // determine resistance level
			  : 1 );                                          // no resistance if false
			  
		  // translate immediately 1-to-1
		  $(this.el).css({'webkitTransform': 'translate3d(' +(this.deltaX-this.index*this.BrowserWidth)+ 'px,0,0)'});
		  $('#header_view').css({'webkitTransform': 'translate3d(' +(this.deltaX/2 - this.index * this.BrowserWidth/2)+ 'px,0,0)'});
		  
		  e.stopPropagation(e);
		}
	
	},
	
	ontouchend: function(e){
		// determine if slide attempt triggers next/prev slide
		var isValidSlide = 
			  Number(new Date()) - this.start.time < 250      // if slide duration is less than 250ms
			  && Math.abs(this.deltaX) > 20                   // and if slide amount is greater than 20px
			  || Math.abs(this.deltaX) > this.BrowserWidth/2,        // or if slide amt is greater than half the width
	
		 //determine if slide attempt is past start and end
			isPastBounds = 
			  !this.index && this.deltaX > 0                          // if first slide and slide amt is greater than 0
			  || this.index == this.numSlides - 1 && this.deltaX < 0;    // or if last slide and slide amt is less than 0

		
		// if not scrolling vertically
		if (!this.isScrolling) {
		   // call slide function with slide end value based on isValidSlide and isPastBounds tests
		  this.slide( this.index + ( isValidSlide && !isPastBounds ? (this.deltaX < 0 ? 1 : -1) : 0 ), this.speed, (this.deltaX < 0 ? -1 : 1));
		  
		}
		this.ended = 1;
		
		e.stopPropagation();
	}
	
});