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
		
		// append spacer after last item
		$('#scroller'+this.model.get('token')+' .scrollableContent').append('<div class="bottomListSpacer" style="height:'+size.height*0.1+'px;"></div>');
		
		var that = this;
		// add video if needed. Check if screen token is in screen_video list
		
		
		API.get('video?screen_token='+this.model.get('token'), true, function(err){console.log(err);}, function(res){
			if(res){
				//resize scrolling element
				$('#'+that.model.get('token')+'iscroll').css({'height':(0.925*size.height-size.width*0.9/1.6*0.9)+'px'});
				
				//insert video
				var vid_el = "<video class='video' id='"+that.model.get('token')+"Video' poster='"+res.poster+"' controls><source src='"+res.vid_mp4+"'><source src='"+res.vid_ogv+"' type='video/ogg'></video>";
				//$('#scroller'+that.model.get('token')+' .scrollableContent').prepend(vid_el);
				$('#'+that.model.get('token')).prepend(vid_el); //insert before scroller

				
				//$('#scroller'+that.model.get('token')+' .scrollableContent').prepend('<div class="video"></div>');
				//$('#scroller'+that.model.get('token')+' .video').html('<iframe height="100%"  width="100%" id="video'+that.model.get("index")+'" src="'+res.video_url+'" frameborder="0" allowfullscreen style="z-index:1;" ></iframe>');
				//$('#scroller'+that.model.get('token')+' .video').css('height',size.width*0.9/1.6*0.9+'px');
				//$('#scroller'+that.model.get('token')+' .video').css('width',size.width+'px');
				//adjust video size
				$('#'+that.model.get('token')+' .video').css('height',size.width*0.9/1.6*0.9+'px');
				$('#'+that.model.get('token')+' .video').css('width',size.width+'px');
				
				//video start/stop controls
				var video = document.getElementById(that.model.get('token')+'Video');
				video.addEventListener('click',function(){
					if (video.paused) 
					  video.play(); 
					else 
					  video.pause(); 
				},false);
				
				//save video id
				//VIDEO[that.model.get('index')] = new YT.Player('video'+that.model.get("index")); //for youtube vid
				VIDEO[that.model.get('index')] = document.getElementById(that.model.get('token')+'Video'); // for html5 vid
				// turn on iscroll for this screen
				new iScroll(that.model.get('token')+'iscroll', {vScrollbar:false});
			}else{
				// turn on iscroll for this screen
				new iScroll(that.model.get('token')+'iscroll', {vScrollbar:false});
			}
		});
		
		
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
		data = {'token':this.model.get('token'), 'name':this.model.get('name'), 'imgPath':this.model.get('imgPath').replace('.jpg','_thumbnail.jpg'), 'description':this.model.get('description'), 'price':this.model.get('price')};		
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
		//ev.stopPropagation();
		
		var itemOverlay = new ItemDetailedView({model:this.model});
		itemOverlay.render();
		
		$('.item_highlight').remove();
		
		//store itemView action
		ACTIONS.push({action: 'itemView', time: new Date().getTime(), name:this.model.get('name')});
	},
});