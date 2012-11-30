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
	render: function(index, pageNum){
		this.model.set({index: index});
		//var headerStr = '<div class="h" id ="h'+this.model.get('token')+'" style="width:'+size.width/2+'px"><img class="valigner" />'+this.model.get('name')+'</div>';
		//$('#header_view').append(headerStr);
		
		//if(index==0){
		//	$('#h'+this.model.get('token')).css('margin-left', size.width/4+'px');	
		//}
		
		//$('#screens_view').append('<div class="col" id="'+this.model.get('token')+'" scrollable="true"><div id="'+this.model.get('token')+'iscroll" class="iscroll"><div class="scroller" id="scroller'+this.model.get('token')+'"><ul class="scrollableContent"></ul></div></div></div>')
		
		// some css
		//$('#'+this.model.get('token')).css({'left': (index)*size.width+'px',
											//'top': 0.075*size.height+'px',});

		// render items into this.el!!!!
		var itemsCollection = new Items([],{token: this.model.get('token')});
		var itemsView = new ItemsView({collection: itemsCollection, model: this.model});
		// render to screen
		var that = this;
		itemsCollection.fetch({
		  success : function(items) {
			var div = document.getElementById('swipeview-'+pageNum);
			div.innerHTML = '';
			div.appendChild(itemsView.render());

			//var h = document.getElementById('headerswipe-'+pageNum);
			//h.innerHTML = '<img class="valigner" />'+that.model.get('name');
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
		//"mousedown":"ontouchstart",
		//"mousemove":"ontouchmove",
		//"mouseup":"ontouchend",
		//"touchstart #menu_screen":"ontouchstart",
		//"touchmove #menu_screen":"ontouchmove",
		//"touchend #menu_screen":"ontouchend"
	},
	
	initialize: function() {
		// every function that uses 'this' as the current object should be in here
		_.bindAll(this, 'render', 'slide', 'ontouchstart', 'ontouchmove', 'ontouchend', 'tap_home', 'tap_header', 'loadNextScreen');
		
		//post event to database
		saveEvent();
		//GLOBAL.itemOVerlay = new ItemDetailedView();

		
		//this.ScreenCollection = new Screens();
		this.screenView = new Object();
		
		//this.data = data;
		size.width = size.width;
		size.height = size.height;
		
		$(this.el).css('height', size.height);
		
		// append header and footer elements
		$('#menu_screen').append('<div id="header"><div id="header_view"></div></div><div id="headerBlur"></div>');
		$('#menu_screen').append('<div data-role="footer" id="footer" class="alpha60"><img id="backButton" src="img/webitap/backButton.png"/><div id="homeButton"></div></div>');

		this.index = 0;
		this.speed = 300;
		this.ended = 1;
		
		this.code = this.options.code;

		this.Screens = [];
		this.screenHTML = [];
		this.currPage = 0;

		this.masterPages = [];
		this.masterHeaders = [];
		this.verticalScroll;

		//append frontPage
		this.frontPage = document.createElement('div');
		this.frontPage.id = 'swipeview--1';
		this.frontPage.className = 'col';
		this.frontPage.style.left = '-100%';
		$(this.el).append(this.frontPage);

		for (i=0; i<3; i++) {
			div = document.createElement('div');
			div.id = 'swipeview-' + (i);
			div.className='col';
			div.style.left = i*100 + '%';
			$(this.el).append(div);
			this.masterPages.push(div);
			/*
			h = document.createElement('div');
			h.id='headerswipe-'+i;
			h.className='h';
			h.style.left = (i*50)+25+'%';
			$('#header_view').append(h);
			this.masterHeaders.push(h);
			*/
		}
		this.slide(-1,0,-1);
		
	},
	
	render : function() {
		
		$('#menu_screen').bind('touchstart', this.ontouchstart);
		$('#menu_screen').bind('touchmove', this.ontouchmove);
		$('#menu_screen').bind('touchend', this.ontouchend);

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
				if(that.index==-1){
					that.slide(0,500,-1);
				}
			},3000);
		});
		// header - swipe on tap
		$('#headerBlur').click(this.tap_header);
		
		this.numSlides = this.collection.length;
		
		// some css
		//$(this.el).css('width', this.numSlides*size.width+'px');
		//$(this.el).css('width', size.width+'px');
		//$('#header_view').css('width', this.numSlides*size.width+'px');
		//$('.h').css('width', (size.width/2)+'px');
		//$('#h_front').css('margin-left', size.width/4+'px');
		

		// RENDER INITIAL SCREENS
		for (i=0; i<Math.min(3,this.collection.models.length); i++){
			if(this.collection.models[i].get('type')=='menu_list'){
				//var screenView = new ScreenView({model:this.collection.models[i]});
				//screenView.render(i);
				this.Screens[i] = new ScreenView({model:this.collection.models[i]});
				this.Screens[i].render(i, i-1);
			}
			else if (this.collection.models[i].get('type')=='splash'){
				//var frontscreenView = new FrontScreenView({model:this.collection.models[i]});
				//frontscreenView.render(i, this.code);
				this.Screens[i] = new FrontScreenView({model:this.collection.models[i]});
				this.Screens[i].render(i, this.code, i-1);
			}
		}
		
		// fill in header
		var height = $('#header_view').height();
		for (i=0; i<this.collection.models.length; i++){
			h = document.createElement('div');
			h.className='h';
			h.style.left = (i*50)+25+'%';
			h.style.height=height+'px';
			h.innerHTML = '<img class="valigner" />'+this.collection.models[i].get('name');
			$('#header_view').append(h);
		}

		
		if(tap){
			setTimeout(function(){
				$('#loading_screen').remove();
				$('#noNFC_screen').remove();
				window.scrollTo(0,1);
			}, 1500);
		} else if(login){ // animate transition out
			setTimeout(function(){
				//document.getElementById('#noNFCscreen_top').className='validated_slideUp';
				//document.getElementById('#noNFCscreen_bottom').className='validated_slideDown';
				$('#noNFCscreen_top').addClass('validated_slideUp');
				$('#noNFCscreen_bottom').addClass('validated_slideDown');
				setTimeout(function(){
					//el = document.getElementById('#noNFC_screen');
					//el.parentNode.removeChild(el);
					$('#noNFC_screen').remove();
				},800);
			},900);
		}
	},
	
	tap_home: function(){
		this.tappedHome = true;
		if ($('#overlay').css('display')=='none'){
		  //$('#col_front').css('display', 'block');
		  this.slide(-1, 300, -1);
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

		  $('#overlay').remove();
		}
		else{
			/*
			this.masterPages[0].innerHTML = '';
			if(this.collection.models[0].get('type')=='menu_list'){
				this.Screens[0].render(0, 0);
			}
			else if (this.collection.models[0].get('type')=='splash'){
				this.Screens[0].render(0, this.code, 0);
			}
			*/
			this.slide(-1, 300, -1);
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
			$('#enterCommentOverlay').css('opacity', '0');
			if(user.iphone) {
				$('#enterCommentOverlay').css('-webkit-transform', 'scale(.5)');
			  }
		}
		else if ($('#overlay').css('display')=='block') {
		  
		  if(user.iphone) {
			$('#overlay').css('-webkit-transform', 'scale(.5)');
		  }
		  $('#overlay').css('opacity', '0');
  
		  $('#overlay').css('display', 'none');
		  $('#overlay-blur').css('display', 'none');
		  $('#backButton').css('display', 'none');
		  
		  $('#overlay').remove();
		}	
	},
	
	tap_header: function(ev){
		if (ev.pageX>size.width*3/4 && this.index<this.numSlides-1){
			this.slide(this.index+1, 300, -1);
		}
		else if (ev.pageX<size.width*1/4 && this.index>=0){
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
			//set page
			this.currPage = this.index%3; // page can be 0,1,2
			
			
			var that = this;

			//initialize iscroll
			setTimeout(function(){
				if(index>=0){
					if(that.masterPages[that.currPage].children.length==2){
						that.verticalScroll = new iScroll(that.masterPages[that.currPage].children[1], {vScrollbar:false});
					}else if(that.masterPages[that.currPage].children.length==1){
						that.verticalScroll = new iScroll(that.masterPages[that.currPage].children[0], {vScrollbar:false});
					}
				}
				
			},100)

			// swipe 3panel view and load new content if needed
			setTimeout(function(){
				if(that.index>0 && that.index<that.numSlides-1){

					if(direction<0 && that.index>0 && that.index<that.numSlides-1){

							if(that.collection.models[index+1].get('type')=='menu_list'){
								that.Screens[index+2] = new ScreenView({model:that.collection.models[index+2]});
								that.Screens[index+2].render(index+1, (that.currPage+1)%3);
								
								that.length++;
							}
							else if (that.collection.models[index+1].get('type')=='splash'){
								that.Screens[index+2] = new FrontScreenView({model:that.collection.models[index+2]});
								that.Screens[index+2].render(index+1, that.code, (that.currPage+1)%3);
								that.length++;
							}
					}
					else if(direction>0 && that.index>0){
							if(that.collection.models[index].get('type')=='menu_list'){
								that.Screens[index].render(index-1, (that.index-1)%3);
								
								that.length++;
							}
							else if (that.collection.models[index].get('type')=='splash'){
								that.Screens[index].render(index-1, this.code, (that.index-1)%3);
								that.length++;
							}
					}
					

					that.masterPages[(that.index+1)%3].style.left = (1+that.index)*100+'%';
					that.masterPages[(that.index)%3].style.left = that.index*100+'%';
					that.masterPages[(that.index+2)%3].style.left = (that.index-1)*100+'%';
					// that.masterHeaders[(that.index+1)%3].style.left = (1+that.index)*50+25+'%';
					// that.masterHeaders[(that.index)%3].style.left = that.index*50+25+'%';
					// that.masterHeaders[(that.index-1)%3].style.left = (that.index-1)*50+25+'%';

				}
				
				else if(that.index==-1 && that.tappedHome){
					that.tappedHome = false;
					for (i=1; i<Math.min(3,that.collection.models.length); i++){
						if(that.collection.models[i].get('type')=='menu_list'){
							that.Screens[i].render(i, i-1);
						}
						else if (that.collection.models[i].get('type')=='splash'){
							that.Screens[i].render(i, this.code, i-1);
						}
					}
				that.masterPages[0].style.left = '0%';
				that.masterPages[1].style.left = '100%';
				that.masterPages[2].style.left = '200%';
				}
				
			
			},310);
			
			// stop any playing videos
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
		//console.log(e.target.id);
		window.scrollTo(0,1);
		/*
		var target = e.originalEvent.target ? e.originalEvent.target : e.target;
		$(target).closest('li').append('<div id="item_highlight"></div>');

		setTimeout(function(){
				$('#item_highlight').css('height', $(target).closest('li').css('height'));
		}, 5);
		*/
		
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
		
		// if 200 ms later - still on the same spot - highlight row
		
		//highlight the row
		
		
		
		
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
		$('#item_highlight').remove();
		
		
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
		  //console.log(this.index);
		  // increase resistance if first or last slide
		  this.deltaX = 
			this.deltaX / 
			  ( (this.index<0 && this.deltaX > 0               // if first slide and sliding left
				|| this.index == this.numSlides - 2              // or if last slide and sliding right
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
		
		setTimeout(function(){
				$('#item_highlight').remove();
		}, 15);
		
		// determine if slide attempt triggers next/prev slide
		var isValidSlide = 
			  Number(new Date()) - this.start.time < 250      // if slide duration is less than 250ms
			  && Math.abs(this.deltaX) > 20                   // and if slide amount is greater than 20px
			  || Math.abs(this.deltaX) > size.width/2,        // or if slide amt is greater than half the width
	
		 //determine if slide attempt is past start and end
			isPastBounds = 
			  this.index<0 && this.deltaX > 0                          // if first slide and slide amt is greater than 0
			  || this.index == this.numSlides-2 && this.deltaX < 0;    // or if last slide and slide amt is less than 0

		
		// if not scrolling vertically
		if (!this.isScrolling) {
		   // call slide function with slide end value based on isValidSlide and isPastBounds tests
		  this.slide( this.index + ( isValidSlide && !isPastBounds ? (this.deltaX < 0 ? 1 : -1) : 0 ), this.speed, (this.deltaX < 0 ? -1 : 1));
		  
		}
		this.ended = 1;
		
		e.stopPropagation();
	}
});
