/*
	4-didigt screen - displayed for users who dont have NFC
*/
var noNFCView = Backbone.View.extend({
	el: '#noNFC_view',									
	
	events: {
		"tap #keyboard li":"input_number",
		"touchstart #aboutNFCbutton": "go_to_aboutNFC",
		"touchstart #aboutWebitapbutton":"go_to_aboutWebitap"
	},
	
	initialize: function() {
		// every function that uses 'this' as the current object should be in here
		_.bindAll(this, 'render', 'slide', 'input_number', 'animateLogo', 'selectInput', 'validate', 'go_to_aboutNFC', 'go_to_aboutWebitap');

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
					$('.video').css({'width': size.width+'px',
									'height': size.width*0.5+'px'});
					$('#aboutWebiTap_spacer').css('height', $('#aboutWebitap_wrapper').height()*0.03+'px');
					
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

		return (code == '1111');
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
						$(this).css('border', w+ 'px solid #006595');
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
					}
			
				}
			}
		}

	}
});