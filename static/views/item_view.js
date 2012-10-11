var ItemView = Backbone.View.extend({
	
	
	events: {
		"tap": "openOverlay"
	},
	
	initialize: function(){
		// every function that uses 'this' as the current object should be in here
		_.bindAll(this, 'render', 'updateRating', 'openOverlay');
		
		this.model.bind('change', this.updateRating);
		
	},
	
	render: function(id){
		data = {'token':this.model.get('token'), 'title':this.model.get('title'), 'imgPath':this.model.get('imgPath'), 'description':this.model.get('description'), 'price':this.model.get('price')};		
		// render item and append to screen
		dust.render("itemView", data, function(err, out) {
			if (!err){
				$('#'+id).append(out);
				return this;
			} else{
				return console.log(err);
			}
		});
		this.updateRating();
	},
	
	updateRating: function(){
		setStarsRating('[data-token="'+this.model.get('token')+'"] .star',this.model.get('rating')); //global function
	},
	
	openOverlay: function(e){
		e.stopPropagation();
		alert('open overlay');
		
	}
									
});