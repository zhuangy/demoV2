var ScreenView = Backbone.View.extend({
	events: {
	},
	
	initialize: function(){
		// every function that uses 'this' as the current object should be in here
		_.bindAll(this, 'render');
		
		if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
			this.BrowserHeight = window.innerHeight;
			this.BrowserWidth = window.innerWidth;
		}
		else{
			this.BrowserHeight = window.outerHeight;
			this.BrowserWidth = window.outerWidth;	
		}
		
		this.collection = new MenuList();
		
	},
	
	render: function(index, data){		
		// add header title
		var headerStr = '<div class="h" id ="h'+data.num+'" style="width:'+this.BrowserWidth/2+'px"><img class="valigner" />'+data.name+'</div>';
		$('#header_view').append(headerStr);
		
		// add screen
		var str = '<div class="col" id="col'+index+'" scrollable="true" style="display:block"><div class="scroller" id="scroller'+index+'"><ul class"scrollContent"><div class="video" style="margin:0; padding:0;"></div></ul></div></div>';
		$('#menu_view').append(str);
		
		$('#col'+index).css({'left': (index+1)*this.BrowserWidth+'px',
					  'width': this.BrowserWidth+'px',
					  'background-image': 'url("../img/background_texture.jpg")',
					  'color':'white',
					  'height': 0.925*this.BrowserHeight+'px',
					  'top': 0.075*this.BrowserHeight+'px',
					  'padding-top': this.BrowserHeight*0.012+'px'});
		console.log('rendered col '+index);

		//fill screen with items
		var itemView = new Object();
		for(i=0;i<data.items.length;i++){
			// initiate model
			var item = new Item();
			item.set({title:data.items[i].title, imgPath:data.items[i].imgPath, description:data.items[i].description, price:data.items[i].price, token:data.items[i].token});
			// add item to collection
			this.collection.add(item);
			// initiate item view
			itemView[i] = new ItemView({model:item});
			itemView[i].render('col'+index+' ul');
			// append spacer after last item
			if (i==data.items.length-1){
				$('#col'+index+' ul').append('<div class="bottomListSpacer" style="height:'+this.BrowserHeight*0.1+'px;"></div>');
			}
		}
		
		// initialize iscroll
		var scroller = new iScroll('col'+index, {
			vScrollbar:false
		});
		
	}
									
});