var ItemDetailedView = Backbone.View.extend({
	el: '#overlay',
	
	events: {
		"click #itemComments_button":"showComments",
		"click #itemDescription_button":"showDescription",
		"click #addComment":"showCommentForm"
	},
	
	initialize: function(){
		// every function that uses 'this' as the current object should be in here
		_.bindAll(this, 'render', 'makeMeVisible', 'showComments', 'showCommentForm', 'showDescription', 'updateRating');
		
		this.model.bind('change', this.updateRating);
		
		
	},
	
	/*
		Render item overlay from dust template (dustTemplates/itemDetailedView.dust)
	*/
	render: function(){
		data = {'item_token':this.model.get('token'), 'title':this.model.get('title'), 'imgPath':this.model.get('imgPath'), 'price':this.model.get('price'), 'description':this.model.get('description')};
		console.log(data);
		var that = this;
		// render item and append to screen
		dust.render("itemDetailedView", data, function(err, out) {
			if (!err){
				$(that.el).html(out);
				that.updateRating();
				that.makeMeVisible();
				return this;
			} else{
				return console.log(err);
			}
		});
	},
	
	/*
		When new comment is added - update item model and update rating on Overlay screen
	*/
	updateRating: function(){
		setStarsRating('#overlay #rating img',this.model.get('rating')); //global function
	},
	
	makeMeVisible: function(){
		if (user.iphone){
			$('#overlay-blur').css('-webkit-transform', 'scale(0.5)');
		}
		
		$('#overlay-blur').css('display', 'block');
		$('#overlay').css('display', 'block');
		$('#backButton').css('display', 'block');
			
		/*fadein*/	
		setTimeout( function(){
		  $('#overlay-blur').css('-webkit-transform', 'scale(1)');
		  $('#overlay').css('-webkit-transform', 'scale(1)');
		  //$('#overlay-blur').css('opacity', '1');
		  $('#overlay').css('opacity', '1');
		}, 100);	
	},
	
	/* 
		Click on Comments Tab - view comments for the item and add your own
	*/
	showComments: function(){
		//some css to indicate click
		$('#itemComments_button').removeClass('notselected').addClass('selected');
		$('#itemDescription_button').removeClass('selected').addClass('notselected');
		$('#comment_topBar').css('background', 'url("img/comments_tab.png") no-repeat');
		$('#comment_topBar').css('background-size', '100% 100%');
		
		//fetch comments from server
		this.commentsCollection = new Comments([], { token : this.model.get('token') });
		var commentsView = new CommentsView({ collection : this.commentsCollection });
		
		this.commentsCollection.fetch({
		  success : function(collection) {
			$('#item-content').html(commentsView.render().el);
		  },
		  error: function() {
			console.log('error!');
		  }
		});
	},
	
	/* 
		Click on Description Tab - view description of the item
	*/
	showDescription: function(){
		//some css to indicate click
		$('#itemDescription_button').removeClass('notselected').addClass('selected');
		$('#itemComments_button').removeClass('selected').addClass('notselected');
		$('#comment_topBar').css('background', 'url("img/description_tab.png") no-repeat');
		$('#comment_topBar').css('background-size', '100% 100%');
		
		// render view
		$("#item-content").html('<div id="item-description">'+this.model.get('description')+'</div>');
	
	},
	
	/* 
		Click on Add Comment - users can eneter new comments
	*/
	showCommentForm: function(){
		var commentForm = new AddCommentForm({model:this.model, collection : this.commentsCollection, token: this.model.get('token')});
		$('#enterCommentOverlay').css('display', 'block');
	}
});