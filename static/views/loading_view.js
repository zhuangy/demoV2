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
	}
									   

});