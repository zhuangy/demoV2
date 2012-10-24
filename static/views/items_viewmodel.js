Backbone.emulateHTTP = true;
Backbone.emulateJSON = true;

/***
	SINGLE ITEM MODEL
***/
var Item = Backbone.Model.extend({
	url: CONF['api-host'],
	defaults: {
		imgPath: 'img.jpg',
		rating: 0
	},
	/*
		Save org to database - make an API call to org_create
	*/
	save: function(){
		function onErr(err) {
			alert('Error '+err.status);
		}
		var postBody = {screen_token: this.get('screen_token'), name: this.get('name'), imgPath: this.get('imgPath'), description: this.get('description'), price: this.get('price'), rating: this.get('rating')};
		var that = this;
		API.post('item_create', postBody, true, onErr, function(res){
			console.log(res);		
			that.set({token: res.token});
		});
		
	},
	
	update: function(){
		function onErr(err) {
			alert('Error '+err.status);
		}
		var postBody = {screen_token: this.get('screen_token'), name: this.get('name'), imgPath: this.get('imgPath'), description: this.get('description'), price: this.get('price'), rating: this.get('rating'), token: this.get('token')};
		var that = this;
		API.post('item_update', postBody, true, onErr, function(res){
			console.log(res);
		});
		
	},
	
	remove: function(){
		// remove item from database if present in database
		if(this.get('token')){
			function onErr(err) {
				alert('Error '+err.status);
			}
			var postBody = {screen_token: this.get('screen_token'), token: this.get('token')};
			var that = this;
			API.post('item_delete', postBody, true, onErr, function(res){
				console.log(res);
			});
		}
	}
});

/***
	ITEMS COLLECTION - input{token: org_token}
***/
var Items = Backbone.Collection.extend({
  model: Item,
  initialize : function(models, options) {
	this.token = options.token;
  },
  url : function() {
    return CONF['api-host']+"/items?screen_token="+this.token;
  }
});

/*** 
	ITEMS LIST VIEW. Model:Screen, Collection: ItemsCollection
***/		
var ItemsView = Backbone.View.extend({
	//tagName : "ul",
	//className : "scrollableContent",
	
	events: {
	},
	initialize: function(){
		// every function that uses 'this' as the current object should be in here
		_.bindAll(this, 'render'); 
		
		// re-render when new comment is added
		//this.collection.bind('add', this.render);
		//this.collection.bind('remove', this.render);
		//this.collection.bind('change', this.render);
		
		//document.getElementById('files').addEventListener('change', handleFileSelect, false);
	},
	
	render : function() {
		$(this.el).html(''); // clear element
		// for each comment, create a view and prepend it to the list.
		this.collection.each(function(Item) {
		  var itemView = new ItemView({ model : Item, collection:this.collection });
		  $('#scroller'+Item.get('screen_token')+' .scrollableContent').append(itemView.render().el);
		  // set stars rating
		  var id = Item.get('token') ? Item.get('token') : Item.get('timestamp');
		  setStarsRating('[data-token="'+id+'"] .star', Item.get('rating'));
		}, this);
		//return this;
	},
});

/*
	SINGLE ITEM VIEW. Model: Item, Collection: Items Collection for this screen
*/
var ItemView = Backbone.View.extend({
	tagName: 'li',
	class: 'item_view',
	events: {
		"click": "openOverlay"
	},	
	initialize: function(){
		// every function that uses 'this' as the current object should be in here
		_.bindAll(this, 'render', 'updateRating', 'openOverlay');
		
		this.model.bind('change', this.updateRating);
		
	},
	render: function(id){
		data = {'token':this.model.get('token'), 'title':this.model.get('title'), 'imgPath':this.model.get('imgPath'), 'description':this.model.get('description'), 'price':this.model.get('price')};		
		var that = this;
		// render item and append to screen
		dust.render("itemView", data, function(err, out) {
			if (!err){
				$(that.el).html(out);
				$(that.el).attr('data-token', that.model.get('token'));
				return that;
			} else{
				return console.log(err);
			}
		});
		
		//this.updateRating();
		return this;
	},
	
	updateRating: function(){
		console.log('model changed, updating ItemView')
		setStarsRating('[data-token="'+this.model.get('token')+'"] .star',this.model.get('rating')); //global function
	},
	
	openOverlay: function(ev){
		var itemOverlay = new ItemDetailedView({model:this.model});
		itemOverlay.render();
		// initialize overlay veiew with this model
	},
});