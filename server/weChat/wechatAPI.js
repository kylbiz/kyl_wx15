
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 微信主动调用的API
var wechatAPI = Meteor.npmRequire('wechat-api');
var WXAPI = new wechatAPI(WXConfig.appID, WXConfig.appsecret, getToken, saveToken);

// wechatAPI 传参 3
function getToken(callback) {
  // 传入一个获取全局token的方法
  console.log('getToken');
  // var fs = Npm.require('fs');
  // fs.readFile('access_token.txt', 'utf8', function (err, txt) {
  //   // if (err) {return callback(err);}
  //   console.log('get access_token', txt);
  //   if (err) {
  //       callback(null, false);
  //   } else {
  //       callback(null, JSON.parse(txt));
  //   }
  // });

    var Fiber = Npm.require("fibers");
    Fiber(function () {
        var info = WeChatInfo.findOne({name: 'access_token'}) || {};
        callback(null, info.token);
    }).run();
}

// wechatAPI 传参 4
function saveToken(token, callback) {
    // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
    // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
    console.log("saveToken", token);
  // var fs = Npm.require('fs');
  // fs.writeFile('access_token.txt', JSON.stringify(token), callback);

    var Fiber = Npm.require("fibers");
    Fiber(function () {
        WeChatInfo.upsert({name: 'access_token'}, {$set: {name: 'access_token', token: token}}, callback);
    }).run();
}

// 具体数据获取的方法
Meteor.methods({
    sendTemplate: function (info) {
        var templateId = WXConfig.templateID;
        // URL置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
        var url = WXConfig.host + '/orderList';
        var openid = info.openId;
        var data = {
           "first": {
             "value":"尊敬的客户，您的订单已成功付款，我们将即刻安排处理您的订单。",
             "color":"#000000"
           },
           "orderMoneySum":{
             "value":info.money + "元",
             "color":"#000000"
           },
           "orderProductName": {
             "value":info.productName || "开业啦微信端产品" + " [单号" + info.orderId + "]",
             "color":"#000000"
           },
           "remark":{
             "value":"如有问题请致电400-066-3192或直接在微信留言，开业啦将第一时间为您服务！",
             "color":"#000000"
           }
        };
        api.sendTemplate(openid, templateId, url, data, function (err, result) {
            console.log("pay success send template", err, result);
        });
    },
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

    getbatchUserInfo: function (startId, endId) {
        var result = Async.runSync(function(callback) {
            WXAPI.batchGetUsers([startId, endId], callback);
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
        for (var key in usersList) {
            var result = Meteor.call('getUserInfo', usersList[key]);
            console.log("get user info", result);
            usersInfo.push(result);
        }

        return usersInfo;
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


WebApp.connectHandlers.use("/getFollowers", function(req, res, next) {
    Meteor.call('getUserInfo','oPw1ptwXVwobI7hmFUijqQ4UVBqE', function (error, result) {
        console.log('getUserInfo', error, result);

    });
    res.end('fuck');
});
