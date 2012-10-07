var ScreenView = Backbone.View.extend({
	events: {
	},
	
	initialize: function(){
		// every function that uses 'this' as the current object should be in here
		_.bindAll(this, 'render');
		
		
	},
	
	render: function(index, data){
		var BrowserWidth = window.outerWidth;
		var BrowserHeight = window.outerHeight;
		
		var str = '<div class="col" id="col'+index+'" scrollable="true" style="display:block"><div class="scroller" id="scroller'+index+'"><ul class"scrollContent"><div class="video" style="margin:0; padding:0;"></div></ul></div></div>';
		$('#menu_view').append(str);

		$('#col'+index).css({'left': (index+1)*BrowserWidth+'px',
					  'width': BrowserWidth+'px',
					  'height': BrowserHeight+'px',
					  'background-color': 'black',
					  'color':'white'});
		console.log('rendered col '+index);
		
		//fill screen with items
		var itemView = new Object();
		for(i=0;i<data.length;i++){
			itemView[i] = new ItemView();
			itemView[i].render(data[i], 'col'+index+' ul');
			if (i==data.length-1){
				$('#col'+index+' ul').append('<div class="bottomListSpacer"></div>');
			}
		}
		
		// initialize iscroll
		var scroller = new iScroll('col'+index, {
			vScrollbar:false
		});
		
	}
									
});