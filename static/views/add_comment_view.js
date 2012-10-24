// Add Comment Form View
var AddCommentForm = Backbone.View.extend({
	
	el: '#enterCommentOverlay',
	events: {
		"click #addComment_button" : "addComment",
		"click #cancelComment_button" : "cancelComment",
		"click .enterComment_stars": "rate",
		"focus #rating_title_text": "typeNameEvent",
		"blur #rating_title_text": "stopTypeName",
		"focus #rating_field_text": "typeTextEvent",
		"blur #rating_field_text": "stopTypeText",
	},
	initialize: function(options){
		// every function that uses 'this' as the current object should be in here
		_.bindAll(this, 'render', 'unrender', 'addComment', 'cancelComment', 'rate');
		
		this.token = options.token;
		this.render();
		
		this.nameDefault = "Type your name here";
		this.commentDefault = "Touch to begin typing...";
		this.rating = 0;
	},
	render: function(){
		var that = this;
		$.ajax({
				url : "../htmlTemplates/addComment.html",
				success : function(string){
					$(that.el).html(string);
				},
				error: function(err){
				console.log('error');
				}
		});
	},
	cancelComment: function(e){
		e.preventDefault();
		this.unrender();
	},
	
	 rate: function(ev) {
		 $('#rating_text').css('color', '#464242');
		 var index=$('.enterComment_stars').index(ev.target);
		 console.log(index +' '+ Math.floor(Math.random()*11));
		 for(i=0;i<index+1;i++)
		 {
			 $('.enterComment_stars').get(i).setAttribute('src','img/star_yellow.png');
			 
		 }
		 for(;i<5;i++){
			 $('.enterComment_stars').get(i).setAttribute('src','img/star_dark_grey.png');
			 
		 }
		this.rating = index+1;
	},
	
	addComment: function(e){
		e.preventDefault();
		var name = this.trim($('#rating_title_text').val());
		var text = this.trim($('#rating_field_text').val());
		var incomplete = 0;
		if(this.rating==0){
			$('#rating_text').css('color', 'red');
			incomplete = 1;	
		}
		
		if(name==this.nameDefault || name==''){
			$('#rating_title_text').addClass('emptyTextField');
			 incomplete = 1;
		}
		
		if(text==this.commentDefault || text==''){
			$('#rating_field_text').addClass('emptyTextField');
			incomplete = 1;
		}
		
		console.log(this.rating);
		if(!incomplete){
			var that = this;
			// new commment model with user inputs
			var comment = new Comment({'item_token': this.token, 'name': name, 'rating': this.rating, 'comment_text':text})
			// save the comment in database
			comment.save(function(){
				// add comment to collection - after it is saved (token + time is added)
				that.collection.add(comment);
			
			
				//update item model with new rating
				var sum = 0;
				that.collection.each(function(comment){
					console.log('rating: '+comment.get('rating'));
					sum = sum + parseFloat(comment.get('rating')); 
				})
				console.log(sum);
				console.log(that.collection.length);
				console.log(Math.round(sum/that.collection.length));
				that.model.set({'rating': Math.round(sum/that.collection.length)});
				that.model.update();
				
				
				
				that.unrender();
			});
		}
		
	},
	trim: function(s) { 
		s = s.replace(/(^\s*)|(\s*$)/gi,"");
		s = s.replace(/[ ]{2,}/gi," "); 
		s = s.replace(/\n /,"\n"); 
		return s;
	},
	unrender: function() 
	{
		$(this.el).css('display', 'none');
		$(this.el).html('');
	},
	
	typeNameEvent: function(){
		console.log('focused')
		var el = $('#rating_title_text');
		el.removeClass('emptyTextField');
		if(el.val()==this.nameDefault)
			el.val('');
	},
	
	stopTypeName: function(){
		var el = $('#rating_title_text');
		if(!el.val())
		el.val(this.nameDefault);
	},
	
	typeTextEvent: function(){
		console.log('here')
		var el = $('#rating_field_text');
		el.removeClass('emptyTextField');
		if(el.val()==this.commentDefault)
			el.val('');
	},
	
	stopTypeText: function(){
		var el = $('#rating_field_text');
		if(!el.val())
			el.val(this.commentDefault);
	},
	

});