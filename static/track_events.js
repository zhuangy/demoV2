/*
	If user is not on mobile - redirect to www.webitap.com/about
*/

function checkUserAgent(){
	var mobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
	  if(!mobile){
			//window.location.replace("http://www.webitap.com/about");
			window.location.href = "http://www.webitap.com/about";
			//javascript:window.location.href = "http://www.webitap.com/about";
			return false;
	  }
}
 
checkUserAgent(); // !!!!!!!!!!!!

/*
	Store all events as TAPs or LOGINs
*/

// detect browser info
Browsers = new UserAgents(navigator.userAgent, {
	useFeatures:		true,
	detectCamouflage:	true
});

function setCookie(c_name,value,exdays)
{
var exdate=new Date();
exdate.setDate(exdate.getDate() + exdays);
var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
document.cookie=c_name + "=" + c_value;
}
function getCookie(c_name)
{
var i,x,y,ARRcookies=document.cookie.split(";");
for (i=0;i<ARRcookies.length;i++)
{
  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
  x=x.replace(/^\s+|\s+$/g,"");
  if (x==c_name)
    {
    return unescape(y);
    }
  }
}

// query strings
var tag_id = getQueryVariable('?tag_id'); // tapped
var post_id = getQueryVariable('post_id'); // redirected from facebook
var code = getQueryVariable('code'); // tapped
var user_agent = Browsers.toString();
//add cookies
var d = new Date();
var n = d.getTime();
var cookie_id=getCookie("cookie_id");
if (cookie_id==null || cookie_id==""){
	cookie_id=n;
	setCookie("cookie_id",cookie_id,365);
}

// generate data strings
if (tag_id && !post_id){
	var type = 'tap';
	var data = {'type':type, 'tag_id':tag_id, 'user_agent':user_agent, 'cookie_id':cookie_id};
}
else if(!tag_id && !code && !post_id){
	var type = 'login';
	var data = {'type':type, 'tag_id':'', 'user_agent':user_agent, 'cookie_id':cookie_id};
}

// post event to database !!!!!!!!!!!!!!!!!!!!!!
if(data && Browsers.device.type!='desktop'){
	$.ajax({
		type:"POST",
		url:"http://"+CONF['api-host']+"/event_create", 
		data:JSON.stringify(data), 
		success:function(res){console.log(res)}
	});
}