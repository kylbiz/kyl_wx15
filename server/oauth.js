var OAuth = Meteor.npmRequire('wechat-oauth');


var config = {
  kyl: {
    appId: 'wx8bd4746c11f87c76',
    appSecret: '7119516f3a1ef641874d679e0c52053a'
  }
}


//验证
WebApp.connectHandlers.use('/wxauthcheck', function(req, res, next){
  var MeteorUrl = Meteor.npmRequire('url');
  var host = MeteorUrl.parse(req.url, true).path.substr(1);
  if(host) {
    switch (host) {
      case 'kyl': 
        var appId = config.kyl.appId;
        var appSecret = config.kyl.appSecret;
        var client = new OAuth(appId, appSecret);
                
        break;
      default: 
        var appId = config.kyl.appId;
        var appSecret = config.kyl.appSecret;
        var client = new OAuth(appId, appSecret);              
        break;
    }
  } else {
    var appId = config.kyl.appId;
    var appSecret = config.kyl.appSecret;
    var client = new OAuth(appId, appSecret);           
  }
	var url = client.getAuthorizeURL('http://wx15.kyl.biz/wxauthok/', 'inquiry', 'snsapi_base');
	res.writeHead(302, {'Location': url});
  	res.end();
})

//预约
WebApp.connectHandlers.use('/inquirycheck', function(req, res, next){
  var MeteorUrl = Meteor.npmRequire('url');
  var host = MeteorUrl.parse(req.url, true).path.substr(1);
  if(host) {
    switch (host) {
      case 'kyl': 
        var appId = config.kyl.appId;
        var appSecret = config.kyl.appSecret;
        var client = new OAuth(appId, appSecret);         
        break;
      default: 
        var appId = config.kyl.appId;
        var appSecret = config.kyl.appSecret;
        var client = new OAuth(appId, appSecret);       
        break;
    }
  } else {
    var appId = config.kyl.appId;
    var appSecret = config.kyl.appSecret;
    var client = new OAuth(appId, appSecret);   
  }
	var url = client.getAuthorizeURL('http://wx15.kyl.biz/wxauthok/', 'myinquiry', 'snsapi_base');
	res.writeHead(302, {'Location': url});
  	res.end();
})

//订单
WebApp.connectHandlers.use('/ordercheck', function(req, res, next){
  var MeteorUrl = Meteor.npmRequire('url');
  var host = MeteorUrl.parse(req.url, true).path.substr(1);
  if(host) {
    switch (host) {
      case 'kyl': 
        var appId = config.kyl.appId;
        var appSecret = config.kyl.appSecret;
        var client = new OAuth(appId, appSecret);        
        break;
      default: 
        var appId = config.kyl.appId;
        var appSecret = config.kyl.appSecret;
        var client = new OAuth(appId, appSecret);         
        break;
    }
  } else {
    var appId = config.kyl.appId;
    var appSecret = config.kyl.appSecret;
    var client = new OAuth(appId, appSecret);     
  }
	var url = client.getAuthorizeURL('http://wx15.kyl.biz/wxauthok/', 'orders', 'snsapi_base');
	res.writeHead(302, {'Location': url});
  	res.end();
})

//清单
WebApp.connectHandlers.use('/listcheck', function(req, res, next){
  var MeteorUrl = Meteor.npmRequire('url');
  var host = MeteorUrl.parse(req.url, true).path.substr(1);
  if(host) {
    switch (host) {
      case 'kyl': 
        var appId = config.kyl.appId;
        var appSecret = config.kyl.appSecret;
        var client = new OAuth(appId, appSecret);         
        break;
      default: 
        var appId = config.kyl.appId;
        var appSecret = config.kyl.appSecret;
        var client = new OAuth(appId, appSecret);        
        break;
    }
  } else {
    var appId = config.kyl.appId;
    var appSecret = config.kyl.appSecret;
    var client = new OAuth(appId, appSecret);           
  }
	var url = client.getAuthorizeURL('http://wx15.kyl.biz/wxauthok/', 'list', 'snsapi_base');
	res.writeHead(302, {'Location': url});
  	res.end();
})

//微信Oauth验证
WebApp.connectHandlers.use('/wxauthok', function(req, res, next){
  var MeteorUrl = Meteor.npmRequire('url');
  var host = MeteorUrl.parse(req.url, true).path.substr(1);
  if(host) {
    switch (host) {
      case 'kyl': 
        var appId = config.kyl.appId;
        var appSecret = config.kyl.appSecret;
        var client = new OAuth(appId, appSecret);         
        break;
      default: 
        var appId = config.kyl.appId;
        var appSecret = config.kyl.appSecret;
        var client = new OAuth(appId, appSecret);       
        break;
    }
  } else {
    var appId = config.kyl.appId;
    var appSecret = config.kyl.appSecret;
    var client = new OAuth(appId, appSecret);    
  }
	client.getAccessToken(req.query.code, function (err, result) {
		if (!err){
	  		var openid = result.data.openid;
	  		var state = req.query.state;
	  		
  			res.writeHead(302, {'Location': '/'+state+'/i/'+openid});
  			res.end();
		}else{
			res.writeHead(302, {'Location': '/wxauthnook/'+err});//跳转并显示错误
  			res.end();
		}
	});
})