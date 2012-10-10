/*
 * Menu Item backbone model class (prototype)
 */
/*var Sceen = Backbone.Model.extend({
	url: 'http://localhost:8080/org_screens'
});

var Screens = Backbone.Collection.extend({
	model:Screen
});
*/

var Item = Backbone.Model.extend({
	
	url: 'http://localhost:8080/item_create',
	
	defaults: {
		rating:0	
	}
});

var MenuList = Backbone.Collection.extend({
	model:Item
});
