Backbone.emulateHTTP = true;
Backbone.emulateJSON = true;

// Single Comment Model. 
var Comment = Backbone.Model.extend({
	url: CONF['api-host']+'/comment_create',
	
	// backbone save doesnt work - have to override
	save: function(f){
		
		function onErr(err) {
			alert('Error '+err.status);
		}
		var postBody = {'item_token':this.get('item_token'), 'name':this.get('name'),'rating':this.get('rating'),'comment_text':this.get('comment_text')};
		var that = this;
		API.post('comment_create', postBody, true, onErr, function(res){
			console.log(res);		
			that.set({token: res.token, date: res.date});
			if (typeof f == "function") f();
		});
		
		
		/*
		var data = {'item_token':this.get('item_token'), 'name':this.get('name'),'rating':this.get('rating'),'comment_text':this.get('comment_text')};
			console.log(JSON.stringify(data));
			var that = this;
			$.ajax({
				   type:'POST',
				   url: CONF['api-host']+'/comment_create',
				   headers:{'Authorization':'Basic ZGFuaGFrOndlYmkyMDEyIQ=='},
				   data:JSON.stringify(data),
				   success: function(res){
							that.set({token: res.token, date: res.date});
							console.log(res);
							}
				});
			*/
	}
});

// Single Comment View
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
	$(this.el).attr('data-token', this.model.get('token'));
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
    return CONF['api-host']+"/comments?item_token=" + this.token;
  }
});

// Comments List View
var CommentsView = Backbone.View.extend({
  
  //tagName : "ul",
  initialize: function(){
	// every function that uses 'this' as the current object should be in here
	_.bindAll(this, 'render'); 
	
	// re-render when new comment is added
	this.collection.bind('add', this.render);
  },
  
  render : function() {
	console.log('new comments view create');
	console.log(this.collection);
	$('#item-content').html('<ul></ul>'); // clear element
    // for each comment, create a view and prepend it to the list.
    this.collection.each(function(comment) {
      var commentView = new CommentView({ model : comment });
	  $('#item-content ul').prepend(commentView.render().el);
	  setStarsRating('[data-token="'+comment.get('token')+'"] .star_small', comment.get('rating'));
    }, this);
	
	//also prepend addComments button
	$('#item-content ul').prepend('<li id="addComment"><img src="img/webitap/plus.png" style="width:10%; height:auto; vertical-align:middle; margin-left:10%; float:left;"><div style="font-size:1em; float:left; vertical-align:middle; margin-left:5%;margin-top:2%;" id="addcommentButton">Add your comments</div><div style="clear:both;"></div></li>')
	
	// turn on iscroll
	new iScroll('item-content', {vScrollbar:false});
	
    return this;
  }
  
});
