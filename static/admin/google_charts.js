function drawCharts(){

// Create the total_pie table.
var total_pie = new google.visualization.DataTable();
total_pie.addColumn('string', 'user');
total_pie.addColumn('number', 'events');
var num_iphone_login = 0;
var num_android_login = 0;
var num_android_tap = 0;
		
// DAY-BY-DAY BAR PLOT
var total_daily = new Array();
total_daily[0] = ['Date', 'Iota', 'Lucias', 'Ami', 'SanSai'];
var total_daily_xaxis = new Array();
total_daily_xaxis[0] = 0;

// Set chart options
var options = {'title':'WebiTap Events',
			   'width':400,
			   'height':300};


Array.prototype.indexOf = function(vItem){
	for(i=0;i<this.length;i++){
		if(vItem == this[i]){
			return i;
		}
	}
	return -1;
}
function sortByKey(array, key) {
    return array.sort(function(a, b) {
		var x = new Date(a[key]); var y = new Date(b[key]);
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}


var users;
$.ajax({
	type:"GET",
	url:"http://api.webitap.com/users", 
	headers:{'Authorization':'Basic ZGFuaGFrOndlYmkyMDEyIQ=='}, async: false,
	success:function(res){users=res;}
});

//console.log(users);

$.ajax({
	type:"GET",
	url:"http://api.webitap.com/events", 
	headers:{'Authorization':'Basic ZGFuaGFrOndlYmkyMDEyIQ=='}, 
	success:function(res){
		res = sortByKey(res, 'datestamp');
		
		var str = '';
		count = 0;
		
		for (i in res){
			var date = res[i].datestamp;
			//if(parseFloat(date.substr(3,2))>28){
				var ev = res[i];
				//console.log(ev);
				var id = '';
				var user = '';
				var time = '';
				var date = new Date([ev.datestamp + ' UTC']);
				date = (parseFloat(date.getMonth())+1) + '/' + date.getDate()+'/'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
				
				if(ev.tag_id){var id = ev.tag_id;}
				else if(ev.code){var id = ev.code;}
				
				if(ev.cookie_id){var user = users.indexOf(String(ev.cookie_id));}
				
				if(ev.actions&& ev.actions.length>0){
					var act = ev.actions;
					var l = ev.actions.length;
					time = (act[l-1].time - act[0].time)/1000;
					if (time<60){
						time = Math.ceil(time)+' seconds';
					}
					else if(time>=60){
						time = (time/60)+' minutes';
					}
					console.log(user);
					console.log(time);
					console.log(JSON.stringify(ev));
					
				}
				
				var admin = [-1,0,1,2,8,11,12,14,15,41,114,130,133,134,144,146,147,150,152,149,155,158,159,147,157,148,153,198,199,202,215,224, 251, 252, 248, 250, 249, 247,236,143, 257, 303, 304, 305, 301, 294, 307, 308, 302, 306, 300, 296, 299, 363, 417, 447, 424, 131, 262];

				//133 mom; 134 dad; 0 masha local; 1 masha; 15 masha webitap;
				// 144 Ryan; 146 TengFei; 12 Aram; 14 John; 141 John Ipad;
				// 199 198 masha home;
				
				if(user && admin.indexOf(parseFloat(user))==-1){ // if this is not one of admin users					
					count = count+1;
					str = '<tr><td>'+count+'</td><td>'+ev.type+'</td><td>'+id+'</td><td>'+ev.user_agent+'</td><td>'+date+'</td><td>'+user+'</td><td>'+time+'</td></tr>';
					$('#events').append(str);
					
					
					
				//Pie chart total_pie
				if(ev.user_agent.toLowerCase().indexOf('iphone')!=-1 && ev.type=='login'){num_iphone_login++;}
				else if(ev.user_agent.toLowerCase().indexOf('android')!=-1 && ev.type=='tap'){num_android_tap++;}
				else if(ev.user_agent.toLowerCase().indexOf('android')!=-1 && ev.type=='login'){num_android_login++;}
				
				//DAY-By-DAY BAR plot
				var date = new Date([ev.datestamp + ' UTC']);
				
				date = (parseFloat(date.getMonth())+1) + '/' + date.getDate()+'/'+date.getFullYear();
					if(total_daily_xaxis[total_daily_xaxis.length-1] != date){
						// new row
						total_daily[total_daily.length] = [date, 0, 0,0,0];
						total_daily_xaxis[total_daily_xaxis.length] = date;
					}
					total_daily
					var col;
					if(id.indexOf('1111')!=-1 || id.indexOf('TC1')!=-1){
						//IOTA
						col = 1;
					}
					else if(id.indexOf('1112')!=-1 || id.indexOf('1234')!=-1 || id.indexOf('TC2')!=-1){
						//Lucias
						col = 2;
					}
					else if(id.indexOf('1024')!=-1){
						//Ami
						col = 3;
					}
					else if(id.indexOf('1023')!=-1 || id.indexOf('TC3')!=-1){
						//SanSai
						col = 4;
					}
					//UPDATE COUNT
					total_daily[total_daily.length-1][col]++;
				 
				 
				 // INDIVIDUAL ACTIONS PLOT
				 
				 /*
				 if(time){
					var actions_table = new google.visualization.DataTable();
					
					actions_table.addColumn('date', 'Date');
					actions_table.addColumn('number', 'event');
					actions_table.addColumn('string', 'title');
					
					for(a in ev.actions){
						actions_table.addRows([[new Date(ev.actions[a].time), 1, ev.actions[a].action]]);
					}
					new google.visualization.AnnotatedTimeLine(document.getElementById('timeline'+count)).draw(actions_table, {'displayAnnotations': true, width:200, height:100});
				}
				
				*/
				
				}
				
		}
		
		//console.log(JSON.stringify(total_daily));
		
		
		
		total_pie.addRows([
		  ['Iphone Login', num_iphone_login],
		  ['Android Tap', num_android_tap],
		  ['Android Login', num_android_login]
		]);
		
		// Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(total_pie, options);
		
		var total_daily_data = google.visualization.arrayToDataTable(total_daily);
		// Create and draw the visualization.
	    new google.visualization.ColumnChart(document.getElementById('total_daily_bar')).
		  draw(total_daily_data,
			   {title:"WebiTap Activity",
				width:1000, height:400,
				hAxis: {title: "Date"}}
		  );

	}
});

	}