Backbone.emulateHTTP = true;
Backbone.emulateJSON = true;

/***
	SCREENS COLLECTION - input{token: org_token}
***/
var Screens = Backbone.Collection.extend({
  model: Screen,
  initialize : function(models, options) {
	/*var code = getQueryVariable('code');
	this.token = $.ajax({type:"GET", url:CONF['api-host']+"/org_token?org_code="+code, async: false});
	this.token = this.token.responseText;
	*/
	this.token = options.token;
	this.code = options.code;
  },
  url : function() {
    return CONF['api-host']+"/org_screens?token="+this.token;
  }
});

/***
	SINGLE SCREEN MODEL. attributes: org_token, token, name, type
***/
var Screen = Backbone.Model.extend({
	url: CONF['api-host']
});

/***
	SINGLE SCREEN VIEW. Model: Screen
***/
var ScreenView = Backbone.View.extend({
	initialize: function(index){
		// every function that uses 'this' as the current object should be in here
		_.bindAll(this, 'render');
		
	},
	render: function(index){
		this.model.set({index: index});
		var headerStr = '<div class="h" id ="h'+this.model.get('token')+'" style="width:'+size.width/2+'px"><img class="valigner" />'+this.model.get('name')+'</div>';
		$('#header_view').append(headerStr);
		
		if(index==0){
			$('#h'+this.model.get('token')).css('margin-left', size.width/4+'px');	
		}
		
		$('#screens_view').append('<div class="col" id="'+this.model.get('token')+'" scrollable="true"><div id="'+this.model.get('token')+'iscroll"><div class="scroller" id="scroller'+this.model.get('token')+'"><ul class="scrollableContent"></ul></div></div></div>')
		
		// some css
		$('#'+this.model.get('token')).css({'left': (index)*size.width+'px',
					  'width': size.width+'px',
					  'background-image': 'url("img/background_texture.jpg")',
					  'color':'white',
					  'height': 0.925*size.height+'px',
					  'top': 0.075*size.height+'px',
					  'padding-top': size.height*0.012+'px'});

		$('#'+this.model.get('token')+'iscroll').css({'ovrflow':'hidden',
													 'position':'relative',
													 'z-index':'1',
													 'height':'100%',
													 'margin-top':'1%'
													 });
		
		// render items into this.el!!!!
		var itemsCollection = new Items([],{token: this.model.get('token')});
		var itemsView = new ItemsView({collection: itemsCollection, model: this.model});
		// render to screen
		var that = this;
		itemsCollection.fetch({
		  success : function(items) {
			itemsView.render();
			//$('#scroller'+that.model.get('token')).html(itemsView.render().el); // inserts a <ul class='scrollableContent'>...list...</ul>
		  },
		  error: function() {
			console.log('error fetching items collection!');
		  }
		});
		
		// if video - prepend video
		// <ul class"scrollContent"><div class="video" style="margin:0; padding:0;"></div>..<li></li>..</ul>'
		
		// wrap this.el unto .col divs
		
	},
});

/*** 
	SCREENS LIST VIEW
***/		
var ScreensView = Backbone.View.extend({
	el: '#screens_view',
	events: {
		"mousedown":"ontouchstart",
		"mousemove":"ontouchmove",
		"mouseup":"ontouchend",
		"touchstart":"ontouchstart",
		"touchmove":"ontouchmove",
		"touchend":"ontouchend"
	},
	
	initialize: function() {
		// every function that uses 'this' as the current object should be in here
		_.bindAll(this, 'render', 'slide', 'ontouchstart', 'ontouchmove', 'ontouchend', 'tap_home', 'tap_header', 'loadNextScreen');
		
		//post event to database
		saveEvent();
		
		//this.ScreenCollection = new Screens();
		this.screenView = new Object();
		
		//this.data = data;
		size.width = size.width;
		size.height = size.height;
		
		$(this.el).css('height', size.height);
		
		this.index = 0;
		this.speed = 300;
		this.ended = 1;
		
		this.code = this.options.code;
		
		
	},
	
	render : function() {
		//$('#menu_screen').append('<div id="header"><div id="header_view"><div class="h" id="h_front"><img class="valigner" />WELCOME</div></div></div><div id="headerBlur"></div>');
		$('#menu_screen').append('<div id="header"><div id="header_view"></div></div><div id="headerBlur"></div>');
		$('#menu_screen').append('<div data-role="footer" id="footer" class="alpha60"><img id="backButton" src="img/webitap/backButton.png"/><div id="homeButton"></div></div>');
		
		// Navigation screen
		if (!FACEBOOK_POST) {
			$('[data-role="page"]').append('<div id="navigationOverlay"></div>'); // navigation overlay screen
		}
		
		var that = this;
		$("#homeButton").click(this.tap_home);
		$("#backButton").click(this.tap_back);
		$('#navigationOverlay').bind('touchstart', function(ev){
			$('#navigationOverlay').remove();
			// slide after 3 seconds
			setTimeout(function(){
				that.slide(1,500,-1);
			},3000);
		});
		// header - swipe on tap
		$('#headerBlur').click(this.tap_header);
		
		this.numSlides = this.collection.length;
		
		// some css
		$(this.el).css('width', this.numSlides*size.width+'px');
		$('#header_view').css('width', this.numSlides*size.width+'px');
		$('.h').css('width', (size.width/2)+'px');
		$('#h_front').css('margin-left', size.width/4+'px');
		
		// RENDER INITIAL SCREENS
		for (i=0; i<Math.min(3,this.collection.models.length); i++){
			if(this.collection.models[i].get('type')=='menu_list'){
				var screenView = new ScreenView({model:this.collection.models[i]});
				screenView.render(i);
			}
			else if (this.collection.models[i].get('type')=='splash'){
				var frontscreenView = new FrontScreenView({model:this.collection.models[i]});
				frontscreenView.render(i, this.code);	
			}
		}
		
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
		if (ev.pageX>size.width*3/4 && this.index<this.numSlides-1){
			this.slide(this.index+1, 300, -1);
		}
		else if (ev.pageX<size.width*1/4 && this.index>0){
			this.slide(this.index-1, 300, 1);
		}
	},

	loadNextScreen: function(index, length){
		//render next screen
		var screenView = new ScreenView({model:this.collection.models[index]});
		screenView.render(index);
		this.length++;
	},
	
	slide: function(index, duration, direction){
		// fallback to default speed
		if (duration == undefined) {
			duration = this.speed;
		}
	
		$(this.el).css({'webkitTransitionDuration':duration+'ms',
						 'webkitTransform': 'translate3d(' + -(index * size.width) + 'px,0,0)'});
		$('#header_view').css({'webkitTransitionDuration':duration+'ms',
						 'webkitTransform': 'translate3d(' + -(index * size.width/2) + 'px,0,0)'});

		if (this.index != index){
			//store slide action
			ACTIONS.push({action: 'slide', time: new Date().getTime()});
		
			this.index = index;
			  if(direction<0 && $('#screens_view').children('.col').length<this.numSlides && $('#screens_view').children('.col').length<this.index+3 ){
				var that = this; 
				setTimeout(function(){
					if(that.collection.models[index+2].get('type')=='menu_list'){
						var screenView = new ScreenView({model:that.collection.models[index+2]});
						screenView.render(index+2);
						that.length++;
					}
					else if (that.collection.models[index+2].get('type')=='splash'){
						var frontscreenView = new FrontScreenView({model:that.collection.models[index+2]});
						frontscreenView.render(index+2);
					}
					
					/*
					// load next screen
					var screenView = new ScreenView({model:that.collection.models[index]});
					screenView.render(index);
					that.length++;
					*/
					//that.loadNextScreen(index, that.numSlides)
				},301);
	
			  }
			setTimeout(function(){
				for(i=0; i<VIDEO.length;i++){
					if (VIDEO[i] && this.index!=i){
						VIDEO[i].pause(); // STOP html5 video
						//VIDEO[i].pauseVideo();	 // STOP youtube video
					}
				}
			},300);
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
		
		
		// Display touch response image..
		/*
		t=document.createElement("img");
		document.body.appendChild(t);
		t.setAttribute('id','haha');
		//t.setAttribute('src','img/trackButton.gif');
		t.setAttribute('src','img/ajax-loader-1.gif');
		//$("#haha").html("haha");
		$("#haha").css("position","absolute");
		$("#haha").css("top",this.start.pageY*0.95);
		$("#haha").css("left", this.start.pageX*0.95);
		$("#haha").css("z-index",100);
		$("#haha").css("opacity",1);
		$("#haha").css("width","8%");
		setTimeout(function(){
			$("#haha").remove();
		},1000);
		*/
		
		//highlight the row
		//var target = e.originalEvent.target ? e.originalEvent.target : e.target;
		//$(target).closest('li').append('<div class="item_highlight"></div>');
		//$('.item_highlight').css('height', $(target).closest('li').css('height'))
		
		
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
		// remove touch response image
		$("#haha").remove();
		
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
			  ( Math.abs(this.deltaX) / size.width + 1 )      // determine resistance level
			  : 1 );                                          // no resistance if false
			  
		  // translate immediately 1-to-1
		  $(this.el).css({'webkitTransform': 'translate3d(' +(this.deltaX-this.index*size.width)+ 'px,0,0)'});
		  $('#header_view').css({'webkitTransform': 'translate3d(' +(this.deltaX/2 - this.index * size.width/2)+ 'px,0,0)'});
		  
		  e.stopPropagation(e);
		}
	
	},
	
	ontouchend: function(e){
		// determine if slide attempt triggers next/prev slide
		var isValidSlide = 
			  Number(new Date()) - this.start.time < 250      // if slide duration is less than 250ms
			  && Math.abs(this.deltaX) > 20                   // and if slide amount is greater than 20px
			  || Math.abs(this.deltaX) > size.width/2,        // or if slide amt is greater than half the width
	
		 //determine if slide attempt is past start and end
			isPastBounds = 
			  !this.index && this.deltaX > 0                          // if first slide and slide amt is greater than 0
			  || this.index == this.numSlides-1 && this.deltaX < 0;    // or if last slide and slide amt is less than 0

		
		// if not scrolling vertically
		if (!this.isScrolling) {
		   // call slide function with slide end value based on isValidSlide and isPastBounds tests
		  this.slide( this.index + ( isValidSlide && !isPastBounds ? (this.deltaX < 0 ? 1 : -1) : 0 ), this.speed, (this.deltaX < 0 ? -1 : 1));
		  
		}
		this.ended = 1;
		
		e.stopPropagation();
	}
});
