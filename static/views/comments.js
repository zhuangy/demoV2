Backbone.emulateHTTP = true;
Backbone.emulateJSON = true;

// Single Comment Model. 
var Comment = Backbone.Model.extend({
	url: API_address+'/comment_create',
	
	// backbone save doesnt work - have to override
	save: function(){
		var data = {'item_token':this.get('item_token'), 'name':this.get('name'),'rating':this.get('rating'),'comment_text':this.get('comment_text')};
			console.log(JSON.stringify(data));
			$.ajax({
				   type:'POST',
				   url: API_address+'/comment_create',
				   headers:{'Authorization':'Basic ZGFuaGFrOndlYmkyMDEyIQ=='},
				   data:JSON.stringify(data),
				   success: function(res){
							console.log(res);
							}
				});
	}
});

// Single Comment Layout
var CommentView = Backbone.View.extend({
  tagName : "li",
  className : "comment_row",
  initialize: function(){
		// every function that uses 'this' as the current object should be in here
		_.bindAll(this, 'render', 'renderTemplate');
  },
	
  render : function() {
    data={'name':this.model.get('name'), 'rating':this.model.get('rating'), 'date':this.model.get('date'), 'comment_text':this.model.get('comment_text')};	
	
	this.renderTemplate(data);
	$(this.el).html(this.out);
	return this;
	
  },
  
  renderTemplate: function(data){
	var that = this;
	dust.render("singleComment", data, function(err, out) {
		if (!err){
			that.out = out;
		} else{
			return console.log(err);
		}
	});
  }
  
});

// Comments Collection
var Comments = Backbone.Collection.extend({
  model : Comment,
  initialize : function(models, options) {
    this.token = options.token; // item_token
  },
  url : function() {
    return API_address+"/comments?item_token=" + this.token;
  }
});

// Comments List View
var CommentsView = Backbone.View.extend({
  
  tagName : "ul",
  initialize: function(){
	// every function that uses 'this' as the current object should be in here
	_.bindAll(this, 'render'); 
	
	// re-render when new comment is added
	this.collection.bind('add', this.render);
  },
  
  render : function() {
	console.log('new comments view create');
	console.log(this.collection);
	$(this.el).html(''); // clear element
    // for each comment, create a view and prepend it to the list.
    this.collection.each(function(comment) {
      var commentView = new CommentView({ model : comment });
	  $(this.el).prepend(commentView.render().el);
    }, this);
	
	//also prepend addComments button
	$(this.el).prepend('<li id="addComment"><img src="img/webitap/plus.png" style="width:10%; height:auto; vertical-align:middle; margin-left:10%; float:left;"><div style="font-size:1em; float:left; vertical-align:middle; margin-left:5%;margin-top:2%;" id="addcommentButton">Add your comments</div><div style="clear:both;"></div></li>')
	
    return this;
  }
  
});
