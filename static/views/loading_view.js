/*
	Display webitap animation while content of the app loads
*/

var LoadingView = Backbone.View.extend({
	tagName: "div",
	
	initialize: function(){
		_.bindAll(this, 'render', 'unrender', 'loadMenu', 'animateLogo');
	},
	
	render: function(){
		$(this.el).attr('id', 'loading_screen');
		$(this.el).html('<div class="logo" style="width:30%; margin:auto;"><img src="img/webitap/logo0.png" width="100%" style="opacity:1;"/><img class="a" src="img/webitap/logo1.png" width="100%" style="opacity:0;"/><img class="a" src="img/webitap/logo2.png" width="100%" style="opacity:0;"/><img class="a" src="img/webitap/logo3.png" width="100%" style="opacity:0;"/><img class="a" src="img/webitap/logo4.png" width="100%" style="opacity:0;"/></div>');
		this.animateLogo();
		return this;
	},
	
	unrender: function(){
		$(this.el).remove();
	},
	
	animateLogo: function(){	
		var that = this;
		$('#loading_screen .a').each(function(i){
			var id = i+1;
			$(this).addClass('animateLogo'+id);
		});
		
		setTimeout(function(){
			$('#loading_screen .a').each(function(j){
				var id = j+1;
				$(this).removeClass('animateLogo'+id);
			});
		},1000);
		
		setTimeout(function(){
			that.animateLogo();
		},1050);
	},
	
	loadMenu: function(){		
		// find org token based on query code
		var code = getQueryVariable('code');
		this.token = $.ajax({type:"GET", url:CONF['api-host']+"/org_token?org_code="+code, async: false});
		this.token = this.token.responseText;
			
		var screensCollection = new Screens([],{token: this.token, code:code}); // initialize screenCollection with org token
		var screensView = new ScreensView({collection:screensCollection, code: code}); // initialize sceensView
		
		screensCollection.fetch({
		  success : function(screens) {
			console.log(screens);
			screensView.render();
		  },
		  error: function() {
			console.log('error fetching orgs collection!');
		  }
		});
		/*
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
		
		var menuView = new MenuView();
		menuView.render(data);
		*/
	}
									   

});