/***
	CART COLLECTION
***/
var Cart = Backbone.Collection.extend({
  model : Item,
  initialize : function(models, options) {
    //this.token = options.token; // item_token
  },
  url : function() {
    //return CONF['api-host']+"/items?screen_token="+this.token;
  }
});

/***
	SINGLE CART ITEM MODEL - use ITEM Model
***/

/***
	SINGLE CART ITEM VIEW. Model: Item Model
***/
var CartItemView = Backbone.View.extend({
	tagName : "li",
	className : "cart_item_view",
	events:{
	},
	initialize: function(){
		// every function that uses 'this' as the current object should be in here
		_.bindAll(this, 'render');
	},
	render: function(){
		$(this.el).append(this.model.get('name'));
		return this;
	}
});

/***
	CART LIST VIEW. Collection: CART
***/

var CartView = Backbone.View.extend({
	tagName: "ul",
	className: "cart_list",
	initialize: function(){
		_.bindAll(this, 'render');
	},
	render: function(){
		this.collection.each(function(Item) {
		  var cartItemView = new CartItemView({ model:Item, collection:this.collection });
		  $(this.el).append(cartItemView.render().el);
		},this);
		return this;
	
	}
	
});