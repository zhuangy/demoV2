var ItemView = Backbone.View.extend({
	events: {
	},
	
	initialize: function(){
		// every function that uses 'this' as the current object should be in here
		_.bindAll(this, 'render');
		
		
	},
	
	render: function(data, id){
		var BrowserWidth = window.outerWidth;
		var BrowserHeight = window.outerHeight;
		
		// render item and append to screen
		dust.render("itemView", data, function(err, out) {
			if (!err){
				$('#'+id).append(out);
				return this;
			} else{
				return console.log(err);
			}
		});
	}
									
});