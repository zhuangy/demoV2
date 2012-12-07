/*
	AD SCREEN VIEW. model: screen
*/
var AdView = Backbone.View.extend({
	initialize: function(){
		_.bindAll(this, 'render');
		
	},
	render: function(index, pageNum){
		API.get('splash?screen_token='+this.model.get('token'), true, function(err){console.log(err);}, function(res){
				var html = unescape(res['html']);
				var js = unescape(res['jscript']);

				//var html = '<div id="nationwide" style="width:100%;height:100%;padding:0;margin:0; background:url(&quot;img/nationwide_bg.jpg&quot;) no-repeat;background-size: 100% 100%;font-family:GothamBold;text-align:center;color:#000000;"><div id="nationwide1" style="width:90%; margin:auto; font-size:1.3em; position:relative; padding-top:28%; color: #0098fe;text-shadow:0.05em 0.05em 0.1em #B4B4B4;">ACCIDENTS HAPPEN!</div><div style="font-size:0.9em; color:#000000; position:relative;">Even to safe drivers.</div><div style="font-size:0.9em; color:#000000; position:relative;padding:1% 0%;">So Nationwide Insurance offers</div><div style="font-size:1.2em; color:#000000; position:relative;padding-top:1%;">Accident Forgiveness.</div><div id="nationwide2" style="font-size:0.9em; color:#FFFFFF; position:relative;text-shadow:0.1em 0.1em #000000;font-family:GothamLight; padding-top:6%;">Get your FREE quote and</div><div style="font-size:0.9em; color:#FFFFFF; position:relative;text-shadow:0.1em 0.1em #000000;font-family:GothamLight;">SAVE HUNDREDS for this</div><div style="font-size:0.9em; color:#FFFFFF; position:relative;text-shadow:0.1em 0.1em #000000;font-family:GothamLight;">Holiday Season.</div><div id="nationwide3" style="width:85%; margin:auto; text-align:left;padding-top:4%;"><div style="font-size:0.75em; font-family:GothamLight; color:#000000;">Please provide your phone number<br/>and the best time for your local agent<br/>to reach you for a quick quote:</div></div><div style="float:left;position:relative;left:8%;font-size:0.9em;width:30%; text-align:left;line-height:120%;top:1%">YOUR NUMBER</div> <textarea id="nationwide_phone" maxlength="13" style="box-shadow: inset 0.1em 0.1em 1em #5A5A5A; background-color:rgba(255,255,255, 0.5); resize:none; border-radius: 0.5em; border:none;width:55%;height:1.5em;margin-top:2%;font-family:GothamLight;font-style:italic;font-size:1em;text-align:center;color:#646b6e;line-height:1.5em;">(310)244-0021</textarea><div style="clear:both;float:left;position:relative;left:8%;font-size:0.9em;width:30%; text-align:left;line-height:120%;padding-top:5%">TIME TO CALL</div><div style="float:left;position:relative;font-size:0.8em;font-style:italic;font-family:GothamLight; margin-top:8%; margin-left:10%;">Dec.</div> <textarea id="nationwide_date" maxlength="2" style="float:left;box-shadow: inset 0.1em 0.1em 1em #5A5A5A; background-color:rgba(255,255,255, 0.5); resize:none; border-radius: 0.5em; border:none;width:10%;height:1.5em;margin-top:6%; margin-left:2%;font-family:GothamLight;font-style:italic;font-size:1em;text-align:center;color:#646b6e;line-height:1.5em;">5</textarea><div style="float:left;font-size:0.8em;font-style:italic;font-family:GothamLight; margin-top:8%; margin-left:3%;margin-top:8%;">at</div> <textarea id="nationwide_time" maxlength="6" style="float:left;box-shadow: inset 0.1em 0.1em 1em #5A5A5A; background-color:rgba(255,255,255, 0.5); resize:none; border-radius: 0.5em; border:none;width:20%;height:1.5em;margin-top:6%;margin-left:3%;font-family:GothamLight;font-style:italic;font-size:1em;text-align:center;color:#646b6e;line-height:1.5em;text-transform:uppercase">6PM</textarea><div id="nationwide_submit" style="width:35%;height:6%;background-color:#FFFFFF;clear:both;border-radius:0.2em;position:relative;margin:auto;top:4%;color:rgba(100,107,110,0.8);text-shadow:1px 4px 6px #FFFFFF, 0 0 0 #000000, 1px 4px 6px #FFFFFF;font-size:0.8em;background-image: -webkit-linear-gradient(bottom, rgb(230,230,230) 2%, rgb(250,250,250) 58%, rgb(255,255,255) 79%);box-shadow:0 0.05em 0.2em #000000;"><img style="height:100%;width:0px;vertical-align:middle;visibility:hidden;"/> Submit <div></div>';
				//var js = "var submitting=false;var Def={phone:'(310)244-0021',date:'5',time:'6PM'};$('#nationwide_submit').bind('click',function(ev){ev.stopPropagation();console.log('click');regexObj = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;var phone=$('#nationwide_phone').val();var day=$('#nationwide_date').val();var time=$('#nationwide_time').val();if(!regexObj.test(phone)||phone.length<10){$('#nationwide_phone').css('background-color','rgba(228, 104, 104, 0.5)')}else if(!parseFloat(day)||parseFloat(day)<=0||parseFloat(day)>31){$('#nationwide_date').css('background-color','rgba(228, 104, 104, 0.5)')}else if(!parseFloat(time)||parseFloat(time)>12){$('#nationwide_time').css('background-color','rgba(228, 104, 104, 0.5)')}else if(!submitting){submitting=true;var date='Dec '+day+' at '+time;var data={phone:phone,date:date};$.ajax({type:'POST',url:'http://192.168.1.101:8080/nationwide_req', data:JSON.stringify(data),success:function(res){$('#nationwide_submit').html('<img style=\"height:100%;width:0px;vertical-align:middle;visibility:hidden;\"/>Thank you!');$('#nationwide_submit').unbind('click');$('#nationwide_phone').val('').attr('readonly', 'readonly');$('#nationwide_date').val('').attr('readonly', 'readonly');$('#nationwide_time').val('').attr('readonly', 'readonly');submitting=false},error:function(err){console.log(err)}})}});$('#nationwide_phone').bind('focus',function(){$('#nationwide_phone').css('background-color','rgba(255,255,255, 0.5)');if($('#nationwide_phone').val()==Def['phone']){$('#nationwide_phone').val('')}});$('#nationwide_date').bind('focus',function(){$('#nationwide_date').css('background-color','rgba(255,255,255, 0.5)');if($('#nationwide_date').val()==Def['date']){$('#nationwide_date').val('')}});$('#nationwide_time').bind('focus',function(){$('#nationwide_time').css('background-color','rgba(255,255,255, 0.5)');if($('#nationwide_time').val()==Def['time']){$('#nationwide_time').val('')}})";
				
				var div = document.getElementById('swipeview-'+pageNum);
				div.innerHTML = html;
				eval(js);

				// var script = document.createElement('script');
				// script.type = "text/javascript";
				// script.text=js;
				// document.body.appendChild(script);


				if(user.iphone){
					$('#nationwide1').css({'padding-top':'24%'});
					$('#nationwide2').css({'padding-top':'1%'});
					$('#nationwide3').css({'padding-top':'1%'});
					$('#nationwide_submit').css({'top':'2%'});
				}
		});
	}
});