
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
    // 客户支付成功后，发送一个模板消息给客户
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
           "orderMoneySum": {
             "value":info.money + "元",
             "color":"#000000"
           },
           "orderProductName": {
             "value":(info.productName || "开业啦微信端产品") + " [支付单号" + info.out_trade_no + "]",
             "color":"#000000"
           },
           "Remark": {
             "value":"如有问题请致电400-066-3192或直接在微信留言，开业啦将第一时间为您服务！",
             "color":"#000000"
           }
        };
        WXAPI.sendTemplate(openid, templateId, url, data, function (err, result) {
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

function createMenu(callback) {
  // var menu = {
  //   "button":[
  //       {
  //           "type":"view",
  //           "name":"开",
  //           "url":"http://m.kyl.biz"
  //       },
  //       {
  //           "name":"业",
  //           "sub_button":[
  //               {
  //                   "type":"view",
  //                   "name":"一企查",
  //                   "url":"http://m.yiqicha.net/"
  //               }
  //           ]
  //       },
  //       {
  //           "name": "啦",
  //           "sub_button": [
  //             {
  //               "type": "view",
  //               "name": "关于我们",
  //               "url": "http://x.eqxiu.com/s/z5IHQrx7?eqrcode"
  //             },
  //             {
  //               "type": "view",
  //               "name": "400电话申请",
  //               "url": "http://form.mikecrm.com/f.php?t=G1PpYj"
  //             }
  //           ]
  //       }
  //     ]
  // };

  var menu = {
    "button":[
        {
            "name":"创业服务",
            "sub_button": [
              {
                  "type":"view",
                  "name":"1元注册",
                  "url":"http://m.kyl.biz/products/registration"
              },
              {
                  "type":"view",
                  "name":"79元财代",
                  "url":"http://m.kyl.biz/products/finance"
              },
              {
                  "type":"view",
                  "name":"银行开户",
                  "url":"http://m.kyl.biz/products/bank"
              },
              {
                  "type":"view",
                  "name":"产品集合",
                  "url":"http://m.kyl.biz/"
              },
            ]
        },
        {
            "name":"创业工具",
            "sub_button":[
                {
                    "type":"view",
                    "name":"一企查",
                    "url":"http://m.yiqicha.net/"
                }
            ]
        },
        {
            "name": "创业加油",
            "sub_button": [
              {
                "type": "view",
                "name": "联系我们",
                "url": "http://x.eqxiu.com/s/z5IHQrx7?eqrcode"
              }
            ]
        }
      ]
  };

  WXAPI.createMenu(menu, callback);
}

WebApp.connectHandlers.use("/wechatapi", function(req, res, next) {
  if (!req.query.token || req.query.token !== 'kyl123') {
    res.end('illegal api');
    return;
  }

  var mapHandle = {
    'createmenu': function () {
      createMenu(function (err, result) {
        console.log("createmenu ", err, result);
        var ret = err ? 'fail' : 'ok';
        res.end("create menu " + ret);
      });
    },
    'getmenu': function () {
      WXAPI.getMenu(function (err, result) {
        console.log('getMenu ', err, result.menu);
        // var button = result.menu.button;
        // console.log(button);
        // button.forEach(function (info) {
        //   console.log(info);
        // });
        res.end('getMenu');
      });
    },
    'createqrcode': function () {
      // var url = 'http://mp.weixin.qq.com/bizmall/malldetail?id=&pid=pPw1pt_bsayBkZxbSqkAun9d0UJ8&biz=MzA3NzExNTE5OQ==&scene=&action=show_detail&showwxpaytitle=1#wechat_redirect';
    },
    'getproductinfo': function () {
      // var pid = req.query.pid || 0;

      // var handleFunc = pid ? WXAPI.getGoods : WXAPI.getGoodsByStatus;
      WXAPI.getGoodsByStatus(0, function(err, result) {
      // WXAPI.getGoods("pPw1pt-bXvqDub35Z_S7Rl2HodWI", function(err, result) {
        if (err) {
          console.log("err happened", err);
          res.end('fail');
        } else {
          console.log("ok ",result);
          res.end('ok');
        }
      });
    }
  };

  var cmd = req.query.name || '';
  if (mapHandle.hasOwnProperty(cmd)) {
    mapHandle[cmd]();
  } else {
    res.end('unknow');
  }

});
