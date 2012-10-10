var MenuScreen = Backbone.View.extend({
	el: '#menu_screen',
	
	initialize: function(){
		_.bindAll(this, 'render');
		this.render();
	},
	
	render: function(){
		$(this.el).append('<div id="header"><div id="header_view"><div class="h" id="h_front"><img class="valigner" />WELCOME</div></div></div><div id="headerBlur"></div>');
		$(this.el).append('<div data-role="footer" id="footer" class="alpha60"><img id="backButton" src="img/webitap/backButton.png"/><div id="homeButton"></div></div>');
	}

});