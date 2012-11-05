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
	events: {
		"click .submitCart"	: "submit_cart"
	},
	initialize: function(){
		_.bindAll(this, 'render', 'submit_cart');
	},
	render: function(){
		this.collection.each(function(Item) {
		  var cartItemView = new CartItemView({ model:Item, collection:this.collection });
		  $(this.el).append(cartItemView.render().el);
		},this);
		
		$(this.el).append('<div class="submitCart">Submit</div>');
		return this;
	},
	
	submit_cart: function(){
		//var postObj = JSON.stringify(this.collection.models);
		var postObj = {org_token: this.options.token, tag_id: getQueryVariable('?tag_id'), user_id: getCookie('cookie_id'), cart_items: this.collection.models};
		console.log(postObj);
		console.log(JSON.stringify(postObj));
		
		$.ajax({
			type:"POST",
			url: "http://192.168.1.107:8080/cart_submit",
			data: JSON.stringify(postObj), 
			headers: {'Authorization': 'Basic bWFzaGE6MTIzNDU='},
			success:function(res){
				console.log(res);
				alert('your cart was submitted!');
				
				$('#cartView').css('display', 'none');
				$('#cartView').html('');
				$('#backButton').css('display', 'none');
				
			},
			error: function(err){console.log(err);}
		});
		
	}
	
});