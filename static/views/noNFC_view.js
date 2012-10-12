/*
	4-didigt screen - displayed for users who dont have NFC
*/
var noNFCView = Backbone.View.extend({
	el: '#noNFC_view',									
	
	events: {
		"tap #keyboard li":"input_number",
		"touchstart #keyboard li":"highlight_key",
		"touchend #keyboard li":"unhighlight_key",
		"touchstart #aboutNFCbutton": "go_to_aboutNFC",
		"touchstart #aboutWebitapbutton":"go_to_aboutWebitap",
		
		"touchstart #aboutNFC_wrap": "ontouchstart",
		"touchmove #aboutNFC_wrap": "ontouchmove",
		"touchend #aboutNFC_wrap": "ontouchend",
		"touchstart #aboutWebitap": "ontouchstart",
		"touchmove #aboutWebitap": "ontouchmove",
		"touchend #aboutWebitap": "ontouchend",
		// mouse events
		//"mousedown #aboutNFCbutton": "go_to_aboutNFC",
		//"mousedown #aboutWebitapbutton":"go_to_aboutWebitap",
		//"mousedown #aboutNFC_wrap": "ontouchstart",
		//"mousemove #aboutNFC_wrap": "ontouchmove",
		//"mouseup #aboutNFC_wrap": "ontouchend"
	},
	
	initialize: function() {
		// every function that uses 'this' as the current object should be in here
		_.bindAll(this, 'render', 'slide', 'input_number', 'animateLogo', 'selectInput', 'validate', 'go_to_aboutNFC', 'go_to_aboutWebitap', 'ontouchstart', 'ontouchmove', 'ontouchend', 'animate_aboutWebitap', 'highlight_key', 'unhighlight_key');

		this.BrowserWidth = size.width;
		this.BrowserHeight = size.height;
		
		//$(this.el).css('height', this.BrowserHeight);
		$(this.el).css('width', 3*this.BrowserWidth);

		this.index = 0;
		this.speed = 300;
		this.length = 3;
		this.ended = 1;
		
		this.animationOn=0;
		this.cellIndex = 0;

	},
	
	render: function(){		
		$.ajax({
			url : "/htmlTemplates/4digitScreen.html",
			success : function(string){
				$('#noNFC_view').append(string);
				
				$('#4digitScreen').css({'left': size.width+'px',
							  'width': size.width+'px',
							  'height': size.height+'px'});
				
				var s = $('.input').css('height').replace(/[^-\d\.]/g, '');
				$('.input').css('font-size', s+'px');				
				// set input border size
				var w = $('.validate').css('width').replace(/[^-\d\.]/g, '');
				this.borderWidth = w*0.02;
				$('.input').css('border', this.borderWidth +'px solid #006595'); 
				
				//set keyboard font size
				$('#keyboard').css('font-size',  (s*0.6)+'px');
				
				setTimeout(function(){window.scrollTo(0,1);},500);

			}
		});

		
	},
	
	go_to_aboutNFC: function(){
		if (this.index == 2){
			this.slide(1,300);
			setTimeout(function(){ $('#aboutNFC_wrap').remove(); },305);
		}
		else{
			var that = this;
			// render about NFC view
			$.ajax({
				url : "/htmlTemplates/aboutNFC.html",
				success : function(string){
					$('#noNFC_view').append(string);
					
					$('#aboutNFC_wrap').css({'left': size.width*2+'px',
								  'width': size.width+'px',
								  'height': size.height+'px'});
					
					//slide
					that.slide(2,300);
				}
			});
		}
	},
	
	go_to_aboutWebitap: function(){
		if (this.index == 0){
			this.slide(1,300);
			setTimeout(function(){ $('#aboutWebitap').remove(); },305);
		}
		else{
			var that = this;
			// render about NFC view
			$.ajax({
				url : "/htmlTemplates/aboutWebitap.html",
				success : function(string){
					$('#noNFC_view').prepend(string);
					
					$('#aboutWebitap').css({'left': 0+'px',
								  'width': size.width+'px',
								  'height': size.height+'px'});
					var headerH = $('.aboutWebi_header').css('width').replace(/[^-\d\.]/g, '') * 0.12;
					$('#aboutWebitap_wrapper').css('height', (size.height-headerH)+'px');
					$('.video').css({'width': size.width+'px',
									'height': size.width*0.5+'px'});
					$('#about_TopSpacer').css('height', size.height*0.03+'px');
					$('#about_BottomSpacer').css('height', size.height*0.03+'px');
					
					var width=$('#phone').width();
					var height=$('#phone').css('height').replace(/[^-\d\.]/g, '');
					$('#screen').css('width',width*0.89);
					$('#screen').css('top',-width*1.65+'px');
					$('#tapPic').css('height', height*0.4+'px');
					
					$('.lastui').css('height',width*2.0+'px');
					
					setTimeout(function(){
						var scroll = new iScroll('aboutWebitap_wrapper', {
							vScrollbar:false
						});
					}, 200);
					
					that.animate_aboutWebitap();
					//slide
					that.slide(0,300);
				}
			});
		}
	},
	
	slide: function(index, duration){
		// fallback to default speed
		if (duration == undefined) {
			duration = this.speed;
		}
	
		$(this.el).css({'webkitTransitionDuration':duration+'ms',
						 'webkitTransform': 'translate3d(' + -(index * this.BrowserWidth) + 'px,0,0)'});

		this.index = index;
		
		if(index==1){
			setTimeout(function(){
				$('#aboutWebitap').remove();
				$('#aboutNFC_wrap').remove();
			},400);
		}
	},
	
	/*
		Animate logo when user enters correct code, while content is loading in the background
	*/
	animateLogo: function(){
		if($('#noNFC_screen').css('display')=='block'){
			
			$('#noNFC_screen .a').each(function(i){
				var id = i+1;
				$(this).addClass('animateLogo'+id);
			});
			
			setTimeout(function(){
				$('#noNFC_screen .a').each(function(j){
					var id = j+1;
					$(this).removeClass('animateLogo'+id);
				});
				//animateLogo();
			},800);
			
			//setTimeout(function(){
			//	this.animateLogo();
			//},850);
		}
	},

	/*
		Highlight which entry the user is on
	*/
	selectInput: function(idx){
		// update position
		this.cellIndex = idx;
		
		this.target = $('#n'+idx);
		
		// disable highlight on all input divs
		$('.input').css('border', this.borderWidth+'px solid #006595');
		$('.input').css('color', '#cd4314');
		
		//highlight the div that you are on
		this.target.css('border', this.borderWidth+'px solid #cd4314');
		this.target.css('color', '#006595');
		
		// remove selected from all other input cells
		$('.input').each(function(i) {
			$(this).removeClass('selected');
		});
		
		// add 'selected' class to this cell
		this.target.addClass('selected');

	},
	
	
	/*
		Validate code entered by user
	*/
	validate: function(){
		// get input
		var code = "";
		$('.input').each(function(){
			code = code + $(this).html();					  
		});

		return (code == ACCESS_CODE);
	},
	
	/*
		highlight keyboard on press
	*/
	highlight_key: function(ev){
		if(!this.animationOn){
			if( $(ev.target).closest('#keyboard li').attr('class')=='erase'){
				$('.backBtn').attr('src', "img/noNFCscreen/backBtnPressed.png");
			}
			else{
				$(ev.target).css({'color': '#cd4314' ,'text-shadow': '-1px -1px 0px black'});
			}
		}
	},
	
	unhighlight_key: function(ev){
		if( $(ev.target).closest('#keyboard li').attr('class')=='erase'){
			$('.backBtn').attr('src', "img/noNFCscreen/backBtn.png");
		}
		else{
			if(!user.iphone){
				$(ev.target).css({'color': '#006595', 'text-shadow': '1px 1px 5px black'});
			}else{
				$(ev.target).css({'color': '#006595', 'text-shadow': '1px 1px 2px black'});
			}
		}	
	},
	
	/*
		Use num keyboard to eneter code
	*/
	input_number: function(ev){
		window.scrollTo(0,1);
		ev.preventDefault();
		if(!this.animationOn){
			//if this is the 1st tap - enter number into 1st cell
			if(!this.cellIndex){
				this.selectInput(1);
			}
			
			// if this is erase button - erase and move back
			if($(ev.target).attr('class') == 'erase' || $(ev.target).attr('class') == 'backBtn'){
				if (this.cellIndex < 1){
					this.selectInput(0);
				}
				else{
					// move selector to previous cell
					this.selectInput(this.cellIndex - 1);
					// erase content of previous cell
					$('.selected').html('');
				}
			}
			// if this is GO button - validate
			else if ($(ev.target).attr('class') == 'goBtn'){
				//check entry
				var correct = this.validate();
				if(!correct){
					$('li').each(function(){
						$(this).css({'color': '#006595', 'text-shadow': '1px 1px 5px black'});
					});
					
					alert("You entered an incorrect code");
					// clear all inputs
					$('.input').each(function(){
						$(this).html('');
						$(this).removeClass('selected');
						$(this).css('border', this.borderWidth+ 'px solid #006595');
						$(this).css('color', '#cd4314');
					});
					
					//reset cellIndex
					this.cellIndex = 0;
					return;
				}		
			}
			// if any other number button - fill in number and move to next cell
			else{
				// insert number into input cell
				var num = $(ev.target).html();
				$('.selected').html(num);
				
				// move selector to next cell
				if (this.cellIndex<4){
					this.selectInput(this.cellIndex + 1);
				}
				else{ // on last entry - reset css, validate
					this.cellIndex = 5;
					$('.input').each(function(i) {
						$(this).removeClass('selected');
						$(this).css('border', this.borderWidth+ 'px solid #006595');
						$(this).css('color', '#cd4314');
					});
					
					var correct = this.validate();
					if(correct){
						
						this.animationOn = 1;
						this.animateLogo();
					
						//setTimeout - so that the last digit appears on screen
						setTimeout(function(){
							// LOAD MENU DATA FROM JSON FILE							
							var data = $.ajax({
											type: 'GET',
											url: '/json/iota.json',
											dataType: 'json',
											success: function() { },
											data: {},
											async: false
										});
							data = JSON.parse(data.responseText);
							data = data.categories;
							
							// initialize manu panel
							var menuView = new MenuView();
							menuView.render(data);
						}, 100);
					}
			
				}
			}
		}

	},
	
	ontouchstart: function(e){
		if (this.index==1) return; // cant swip from 4digit screen
		
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
		if (this.ended) return; // cant swip from 4digit screen
		
		if (this.index==1) return;
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
		
		if (this.index==1) return; // cant swip from 4digit screen
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
	},
	
	animate_aboutWebitap: function(){
		//ABOUT WEBITAP SCRIPTS
		$("#screen #validPic img").fadeOut(0);
		$("#screen #load").fadeOut(0);
		$("#signal img").fadeOut(0);
		$("#tapPic img").fadeOut(0).eq(0).fadeIn(0);
		$("#screen #validPic img").eq(0).fadeIn(0);
		//$("#signal img").eq(0).fadeIn(0);
		setTimeout(function(){
			$("#screen #validPic img").eq(0).fadeOut(0);
			//$("#signal img").eq(0).fadeOut(0);
			
		},5500);

		var i = 0;
		setInterval(function(){
		if($("#tapPic img").length > (i+1)){
			//$("#signal img").eq(i).show();
			$("#signal img").eq(i).fadeIn(200,function(){
				$("#signal img").eq(i).fadeOut(200,function(){
					$("#signal img").eq(i).fadeIn(200,function(){
						$("#signal img").eq(i).fadeOut(200,function(){
			});
			});
			});
			});
			setTimeout(function(){
				$("#screen #validPic img").hide();
				$("#screen #load").show();
				//$("#signal img").hide();
				setTimeout(function(){
					$("#screen #load").hide();
						$("#screen #validPic img").eq(i).show();
						setTimeout(function(){
							//$("#screen #validPic img").hide();
							$("#screen #load").hide();
							
							$("#tapPic img").hide();
							$("#tapPic img").eq(i+1).fadeIn(1000);
							i++;
							},1000);
					
				},1600);
				
			},800);
				
				
			
		}else{
				//$("#signal img").eq(i).show();
				$("#signal img").eq(i).fadeIn(200,function(){
				$("#signal img").eq(i).fadeOut(200,function(){
					$("#signal img").eq(i).fadeIn(200,function(){
						$("#signal img").eq(i).fadeOut(200,function(){
			});
			});
			});
			});
			setTimeout(function(){
				$("#screen #validPic img").hide();
				$("#screen #load").show();
				//$("#signal img").hide();
				setTimeout(function(){
					$("#screen #load").hide();
						$("#screen #validPic img").eq(i).show();
						setTimeout(function(){
							//$("#screen #validPic img").hide();
							$("#screen #load").hide();
							
							$("#tapPic img").hide();
							$("#tapPic img").eq(0).fadeIn(1500);
							i=0;
							},1000);
					
				},1600);
				
			},800);
		}
		},5000)
		//ABOUT WEBITAP SCRIPTS
	}
});