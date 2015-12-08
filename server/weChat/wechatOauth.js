////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 微信第三方网页授权的API
var OAuth = Meteor.npmRequire('wechat-oauth');
var oauthAPI = new OAuth(WXConfig.appID, WXConfig.appsecret, getOAuthToken, saveOAuthToken);


// OAuth 传参 3
function getOAuthToken(openid, callback) {
    // 传入一个获取全局token的方法
    console.log('getOAuthToken');   
    // var fs = Npm.require('fs');
    // fs.readFile(openid + ':oauth_token.txt', 'utf8', function (err, txt) {
    //     // if (err) {return callback(err);}
    //     console.log('get oauth_token', txt);
    //     if (err) {
    //         callback(null, false);
    //     } else {
    //         callback(null, JSON.parse(txt));
    //     }
    // });

    var Fiber = Npm.require("fibers");
    Fiber(function () {
        var info = WeChatInfo.findOne({name: 'oauth_token', openid: openid}) || {};
        callback(null, info.token);
    }).run();
}

// OAuth 传参 4
function saveOAuthToken(openid, token, callback) {
    console.log("saveOAuthToken", token);
    // var fs = Npm.require('fs');
    // fs.writeFile(openid + ':oauth_token.txt', JSON.stringify(token), callback);

    var Fiber = Npm.require("fibers");
    Fiber(function () {
        WeChatInfo.upsert({name: 'oauth_token', openid: openid}, {
            $set: {name: 'oauth_token', openid: openid, token: token}
        }, callback); 
    }).run();
}


// 微信 oauth 处理
WebApp.connectHandlers.use("/oauth", function(req, res, next) {
    var code = req.query.code;
    console.log("req -", code);
    if (!code) {
        // 获取code
        // 调转到 /oauthAPI
        console.log("go to get code");
        var wxOAuthUrl = oauthAPI.getAuthorizeURL(WXConfig.host + '/oauth', 'KYLBIZ', 'snsapi_base');
        res.writeHead(302, {
            'Location': wxOAuthUrl
        });

        res.end();
    } else {
        // 获取openid
        // 调转到首页

        console.log("go to get token by code", code);
        oauthAPI.getAccessToken(code, function (error, result) {
            console.log("get token back", error, result);

            if (error) {
                throw new Meteor.Error(error, 'get oauth access_token fail');
            } else {
                console.log("get oauth access_token ", result);
                var openId = result.data.openid;
                res.writeHead(302, {
                    'Location': WXConfig.host + '?openid=' + openId
                });
                
                res.end();
            }
        });

        // var result = Async.runSync(function(callback) {
        //     oauthAPI.getAccessToken(code, callback);
        // });
        // console.log('get token result', result)

        // if (result.error) {
        //     throw new Meteor.Error(result.error, 'get oauth access_token fail');
        // } else {
        //     console.log("get oauth access_token ", result.result);
        //     var openId = result.result.data.openid;
        //     res.writeHead(302, {
        //         'Location': WXConfig.host + '?openid=' + openId
        //     });
            
        //     res.end();
        // }
    }
});
