////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 微信第三方网页授权的API
var OAuth = Meteor.npmRequire('wechat-oauth');
var oauthAPI = new OAuth(WXConfig.appID, WXConfig.appsecret, getOAuthToken, saveOAuthToken);


// OAuth 传参 3
function getOAuthToken(callback) {
    // 传入一个获取全局token的方法
    console.log('getOAuthToken');   
    // var fs = Npm.require('fs');
    // fs.readFile('oauth_token.txt', 'utf8', function (err, txt) {
    //     // if (err) {return callback(err);}
    //     console.log('get oauth_token', txt);
    //     if (err) {
    //         callback(null, false);
    //     } else {
    //         callback(null, JSON.parse(txt));
    //     }
    // });

    var info = WeChatInfo.findOne({key: 'oauth_token'}) || {};
    callback(null, info.value);
}

// OAuth 传参 4
function saveOAuthToken(token, callback) {
    console.log("saveOAuthToken");
    // var fs = Npm.require('fs');
    // fs.writeFile('oauth_token.txt', JSON.stringify(token), callback);

    WeChatInfo.upsert({key: 'oauth_token'}, {$set: {'value': token}}, callback); 
}


// 微信 oauth 处理
WebApp.connectHandlers.use("/oauth", function(req, res, next) {
    var code = req.query.code;
    console.log("req -", code);
    if (!code) {
        // 获取code
        // 调转到 /oauthAPI
        var wxOAuthUrl = oauthAPI.getAuthorizeURL(WXConfig.host + '/oauth', 'KYLBIZ', 'snsapi_base');
        res.writeHead(302, {
            'Location': wxOAuthUrl
        });

        res.end();
    } else {
        // 获取openid
        // 调转到首页

        var result = Async.runSync(function(callback) {
            oauthAPI.getAccessToken(code, callback);
        });

        if (result.error) {
            throw new Meteor.Error(result.error, 'get oauth access_token fail');
        } else {
            console.log("get oauth access_token ", result.result);
            var openId = result.result.data.openid;
            res.writeHead(302, {
                'Location': WXConfig.host + '?openid=' + openId
            });
            
            res.end();
        }
    }
});
