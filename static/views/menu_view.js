var MenuView = Backbone.View.extend({
	el: '#menu_view',									
	
	events: {
		"mousedown":"ontouchstart",
		"mousemove":"ontouchmove",
		"mouseup":"ontouchend",
		"touchstart":"ontouchstart",
		"touchmove":"ontouchmove",
		"touchend":"ontouchend"
	},
	
	initialize: function(Dim) {
		// every function that uses 'this' as the current object should be in here
		_.bindAll(this, 'render', 'slide', 'ontouchstart', 'ontouchmove', 'ontouchend');
        
		this.Dim = Dim;
		
		//this.data = data;
		this.BrowserWidth = Dim.width;
		this.BrowserHeight = Dim.height;
		
		$(this.el).css('height', this.BrowserHeight);
		
		this.index = 0;
		this.speed = 300;
		this.length = 3;
		this.ended = 1;
		
	},
	
	render: function(data){
		$('#menu_screen').append('<div id="header"><div id="header_view"><div class="h" id="h_front"><img class="valigner" />WELCOME</div></div></div><div id="headerBlur"></div>');
		$('#menu_screen').append('<div data-role="footer" id="footer" class="alpha60"><img id="backButton" src="img/webitap/backButton.png"/><div id="homeButton"></div></div>');
		
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
		var screenView = new ScreenView();
		screenView.render(0, this.data[0]);
		
		console.log('rendered menu_view');
		
		// animate transition out
		setTimeout(function(){
			$('#noNFCscreen_top').addClass('validated_slideUp');
			$('#noNFCscreen_bottom').addClass('validated_slideDown');
			setTimeout(function(){
				$('#noNFC_screen').remove();
			},800);
		},800);
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
		
		// this function is called from inside a setTimeoun - cant call this.loadNextScreen inside a setTimeout. So the function has to be here.
		function loadNextScreen(index, data, length){
			var screenView = new ScreenView();
			screenView.render(index, data);
			return length++;
		}
		
		  if(direction<0 && $('#menu_view').children('.col').length<=index+1 && $('#menu_view').children().length<this.numSlides){
			  
				// load next screen - inside a setTimeout function so that screen loads AFTER the swipe motion
				var data = this.data[index];
				var length = this.length;
					setTimeout(function(){
						loadNextScreen(index, data, length)
					},301);
				this.length++;

			
		  }
	},
	
	ontouchstart: function(e){
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