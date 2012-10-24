API = new Object();

API.uuid = function(){return("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(d){var b=Math.random()*16|0,a=d=="x"?b:(b&3|8);return a.toString(16)}))}

API.get = function(method, authed, onErr, onSuc) {
	var reqObj={
		type:'GET',
		url: CONF['api-host'] +'/'+method,
		success: function(res){
			onSuc(res);
		}
	}
	
	reqObj.beforeSend = function(xhr) {
		if (authed) {
		  xhr.setRequestHeader('Authorization','Basic ZGFuaGFrOndlYmkyMDEyIQ==');
		}
	}
	$.ajax(reqObj);
}

API.post = function(method, body, authed, onErr, onSuc) {
	var reqObj={
		type:'POST',
		data: JSON.stringify(body),
		url: CONF['api-host'] +'/'+method,
		success: function(res){
			if (onSuc) {onSuc(res)};
		}	
	}
	
	reqObj.beforeSend = function(xhr) {
		if (authed) {
		  xhr.setRequestHeader('Authorization','Basic ZGFuaGFrOndlYmkyMDEyIQ==');
		}
	}
	
	$.ajax(reqObj);

}

API.logError = function(err) {
  console.log(err.status);
}
