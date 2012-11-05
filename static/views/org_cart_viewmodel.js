Backbone.emulateHTTP = true;
Backbone.emulateJSON = true;

/***
	CARTS COLLECTION
***/
var Carts = Backbone.Collection.extend({
  model : Cart,
  initialize : function(models, options) {
    this.token = options.token; // org_token
  },
  url : function() {
    return "http://192.168.1.107:8080/cart_list?org_token="+this.token;
  }
});

/***
	CART ITEMS COLLECTION
***/
var CartItems = Backbone.Collection.extend({
  model : CartItem,
  initialize : function(models, options) {
    this.token = options.token; // org_token
  },
  url : function() {
    return "http://192.168.1.107:8080/cart?cart_token="+this.token;
  }
});

/***
	CART MODEL
***/
var Cart = Backbone.Model.extend({
});

/***
	CART ITEM MODEL
***/
var CartItem = Backbone.Model.extend({
});

/***
	CART LIST VIEW. Collection: Carts
***/
var CartListView = Backbone.View.extend({
	tagName: 'ul',
	className: 'cart_list',
	initialize: function(){
		_.bindAll(this, 'render');
		
		this.collection.bind("add", function(Cart) {
		  var cartView = new CartView({model:Cart});
		  $(this.el).append(cartView.render().el);
		}, this);
	},
	render: function(){
		$(this.el).html(''); //clear element
		this.collection.each(function(Cart){
			var cartView = new CartView({model:Cart});
			$(this.el).append(cartView.render().el);
		},this);
		return this;
	}

});

/***
	CART ITEMS VIEW - list of items in cart. Model: Cart
***/
var CartView = Backbone.View.extend({
	tagName: 'li',
	className: 'cart',
	initialize: function(){
		_.bindAll(this, 'render');	
	},
	render: function(){
		$(this.el).append('<b>Cart #' + this.model.get('cart_token')+'<br/>Tag id: '+this.model.get('tag_id')+'<br/>User_id: '+this.model.get('user_token')+'</b>');
		
		// initialize items collection
		var cartItems = new CartItems([],{token: this.model.get('cart_token')});
		//items list view
		var cartItemsView = new CartItemsView({collection:cartItems})
		
		var that = this;
		cartItems.fetch({
		  success : function(items) {
			 // append a list of all items
			$(that.el).append(cartItemsView.render().el);
		  },
		  error: function() {
			console.log('error fetching cart collection!');
		  }
		});
		
		return this;
		
	}

});

var CartItemsView = Backbone.View.extend({
	tagName: 'ul',
	initialize: function(){
		_.bindAll(this,'render');
	},
	render: function(){
		$(this.el).html('');
		this.collection.each(function(Item){
			$(this.el).append('<li>'+Item.get('name')+' - $'+Item.get('price')+'</li>');
		},this);
		return this;
	}

});