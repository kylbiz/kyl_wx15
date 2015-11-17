var Config = {
    // kyl 测试账号
    'appID': 'wx86cab636626bb481',
    'appsecret': '7bc84f260ea4142b97a50be9a0579991',
    'token': 'keyboardcat123',
    'host': 'http://www.foundfit.cn',

    // aircc 测试帐号
    // 'appID': 'wx69a414c6fd69003c',
    // 'appsecret': 'd4624c36b6795d1d99dcf0547af5443d',
    // 'token': 'keyboardcat123',
    // 'host': 'http://localhost:3000'
        
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// 微信主动调用的API
var wechatAPI = Meteor.npmRequire('wechat-api');
var WXAPI = new wechatAPI(Config.appID, Config.appsecret);

// wechatAPI 传参 3
function getToken(callback) {
  // 传入一个获取全局token的方法
  console.log('getToken');
  var fs = Npm.require('fs');
  fs.readFile('access_token.txt', 'utf8', function (err, txt) {
    // if (err) {return callback(err);}
    if (err) {
        callback(null, false);
    } else {
        callback(null, JSON.parse(txt));
    }
  });
}

// wechatAPI 传参 4
function saveToken(token, callback) {
  // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
  // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
  console.log("saveToken");
  var fs = Npm.require('fs');
  fs.writeFile('access_token.txt', JSON.stringify(token), callback);
}

// 具体数据获取的方法
Meteor.methods({
    getFollowers: function() {
        var result = Async.runSync(function(callback) {
            WXAPI.getFollowers(callback);
        });

        if (result.error) {
            throw new Meteor.Error(result.error, 'get follower fail');
        } else {
            return result.result;
        }
    },

    getUserInfo: function (openId) {
        var result = Async.runSync(function(callback) {
            WXAPI.getUser({openid:openId, lang: 'zh_CN'}, callback);
        });

        if (result.error) {
            throw new Meteor.Error(result.error, 'get user info fail');
        } else {
            return result.result;
        }
    },

    getFollowersInfo: function() {
        var followersInfo = Meteor.call('getFollowers');
        console.log("get follower", followersInfo);
        var usertotal = followersInfo.total;
        var usersList = followersInfo.data.openid;

        var usersInfo = [];
        for (key in usersList) {
            var result = Meteor.call('getUserInfo', usersList[key]);
            console.log("get user info", result);
            usersInfo.push(result);
        }

        return usersInfo;
    },

    wxOAuth: function (code) {

        if (!code) {
            console.log('wxOAuth get code');
            var wxOAuthUrl = oauthAPI.getAuthorizeURL(Config.redirect_uri, 'KYLBIZ', 'snsapi_base');
            // 获取 code
            var ret =  HTTP.get(wxOAuthUrl);
            console.log('get code ret', ret);
            return ret.content;
        } else {
            console.log('wxOAuth get openid');
            var result = Async.runSync(function(callback) {
                oauthAPI.getAccessToken(code, callback);
            });

            if (result.error) {
                throw new Meteor.Error(result.error, 'get oauth access_token fail');
            } else {
                console.log("get oauth access_token ", result.result);
                return result.result.data.openid;
            }
        }
        
    }
});


// 测试 
Meteor.methods({
    //创建菜单
    createMenu: function () {
        var menu = {
            "button":[
                {
                    "type":"click",
                    "name":"开",
                    "key":"OPEN"
                },
                {
                    "name":"业",
                    "sub_button":[
                        {
                            "type":"view",
                            "name":"产品中心",
                            "url":"http://101.200.217.6/"
                        },
                        {
                            "type":"click",
                            "name":"赞一下我们",
                            "key":"V1001_GOOD"
                        }
                    ]
                },
                {
                    "type": "pic_sysphoto",
                    "name": "啦",
                    "key": "SEND_PICTURE"
                }
            ]
        };

        var result = Async.runSync(function(callback) {
            WXAPI.createMenu(menu, callback);
        });

        if (result.error) {
            throw new Meteor.Error(result.error, 'create menu fail');
        } else {
            return result.result;
        }
    }
});




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 微信第三方网页授权的API
var OAuth = Meteor.npmRequire('wechat-oauth');
var oauthAPI = new OAuth(Config.appID, Config.appsecret);


// OAuth 传参 3
function getOAuthToken(callback) {

}

// OAuth 传参 4
function saveOAuthToken(token, callback) {

}

// 微信 oauth 处理
WebApp.connectHandlers.use("/oauth", function(req, res, next) {
    var code = req.query.code;
    console.log("req -", code);
    if (!code) {
        // 获取code
        // 调转到 /oauth

        var wxOAuthUrl = oauthAPI.getAuthorizeURL(Config.homeHost + '/oauth', 'KYLBIZ', 'snsapi_base');
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
                'Location': Config.host + '?openid=' + openId
            });
        }
    }
});
