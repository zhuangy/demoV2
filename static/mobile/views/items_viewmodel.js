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
		this.el = document.createElement('div');
		this.el.className='items_list';

		$(this.el).html(''); // clear element

		this.scroller = document.createElement('div');
		this.scroller.className='items_scroller';

		this.list = document.createElement('ul');
		this.list.className='scrollableContent';

		this.scroller.appendChild(this.list);

		// for each item create a view and prepend it to the list.
		this.collection.each(function(Item) {
		  var itemView = new ItemView({ model : Item, collection:this.collection });
		  $(this.list).append(itemView.render().el);
		  // set stars rating
		  var id = Item.get('token') ? Item.get('token') : Item.get('timestamp');
		  setStarsRating('[data-token="'+id+'"] .star', Item.get('rating'));
		}, this);
		//return this;
		
		// append spacer after last item
		if(user.iphone){$(this.list).append('<div class="bottomListSpacer" style="height:'+size.height*0.09+'px;"></div>');}
		else{$(this.list).append('<div class="bottomListSpacer" style="height:'+size.height*0.07+'px;"></div>');}
		
		// append list to items_list
		$(this.el).append(this.scroller);

		var that = this;
		// add video if needed. Check if screen token is in screen_video list
		
		
		API.get('video?screen_token='+this.model.get('token'), true, function(err){console.log(err);}, function(res){
			if(res){
				//resize scrolling element
				$(that.el).css({'height':(0.925*size.height-size.width*0.9/1.6*0.9)+'px'});
				
				//insert video
				var vid = document.createElement('video');
				var sc1 = document.createElement('source');
				sc1.src = res.vid_mp4;
				var sc2 = document.createElement('source');
				sc2.src = res.vid_ogv;
				sc2.type = "video/ogg";

				vid.appendChild(sc1); vid.appendChild(sc2);
				vid.style.cssText="height:"+size.width*0.9/1.6*0.9+"px; width:"+size.width+"px;";
				vid.poster= res.poster;
				vid.controls = true;
				vid.className = 'video';
				vid.id = that.model.get('token')+"Video";
				$(that.el).parent().prepend(vid); //insert before scroller

				//video start/stop controls
				var video = document.getElementById(that.model.get('token')+'Video');
				vid.addEventListener('click',function(){
					if (video.paused) 
					  video.play(); 
					else 
					  video.pause(); 
				},false);
				
				//save video id
				//VIDEO[that.model.get('index')] = new YT.Player('video'+that.model.get("index")); //for youtube vid
				VIDEO[that.model.get('index')] = document.getElementById(that.model.get('token')+'Video'); // for html5 vid
				// turn on iscroll for this screen
				//new iScroll(that.model.get('token')+'iscroll', {vScrollbar:false});
				//return that.el;
			}else{
				// turn on iscroll for this screen
				//new iScroll(that.model.get('token')+'iscroll', {vScrollbar:false});
				//return that.el;
			}
		});
		
		return this.el;
		
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
		data = {'token':this.model.get('token'), 'name':this.model.get('name'), 'imgPath':this.model.get('imgPath').replace('.jpg','_thumbnail.jpg'), 'description':this.model.get('description').replace(/\n\r?/g, '<br/>'), 'price':this.model.get('price')};		
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
		
		this.updateRating();
		return this;
	},
	
	updateRating: function(){
		//console.log('model changed, updating ItemView')
		setStarsRating($('.star', $(this.el)), this.model.get('rating')); //global function
		//setStarsRating('[data-token="'+this.model.get('token')+'"] .star',this.model.get('rating')); //global function
	},
	
	openOverlay: function(ev){
		//ev.stopPropagation();
		if($('#overlay').length<1){ // if overlay is already open - return
			//var itemOverlay = new ItemDetailedView({model:this.model});
			itemOverlay.model = this.model;
			itemOverlay.render();
			itemOverlay.delegateEvents();
			
			$('#item_highlight').remove();
			
			//store itemView action
			ACTIONS.push({action: 'itemView', time: new Date().getTime(), name:this.model.get('name')});
		}
	},
});