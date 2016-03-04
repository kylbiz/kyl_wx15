//路由相关设置
Router.configure({
	layoutTemplate: 'layoutTemplate',
  loadingTemplate: 'loading',
  //notFoundTemplate: 'notFoundTemplate',
});

var needAccountRouters = [
	'shopcart', 'trade', 'paySuccess', 	//订单支付相关
	'addressList', 'address',	//地址管理相关
	'orderList', 'orderDetail', 'orderProcess', 'orderDescription', 'shockholder',// 订单管理相关
	'home',	// 用户信息相关
];


// 登陆权限控制 这里需要判断两种条件
// 微信openid获取
Router.onBeforeAction(function () {
	// console.log('get wechat openid', this.originalUrl);
	if (kylUtil.isWeChat()) {
		var WeChatUser = this.params.query.openid || "";
		if (WeChatUser) {
			// console.log("have query");
			window.localStorage.openid = WeChatUser;
			Session.set('WeChatUser', WeChatUser);
			this.next();
		} else if (window.localStorage.openid) {
			// console.log('have coll');
			Session.set('WeChatUser', window.localStorage.openid);
			this.next();
		} else {
			// console.log("go to oauth");
			Router.go('/oauth');
		}
	} else {
		this.next();
	}
}, {except: ['receive', 'oauth', 'createMenu']});

// 微信帐号永久登录
Router.onBeforeAction(function () {
	// console.log("wechat login handle", this.originalUrl);
	var self = this;
	var originalUrl = this.originalUrl;

	if (!Meteor.userId() && Session.get('WeChatUser')) {
		var openid = Session.get('WeChatUser');
		Meteor.call("loginByWechat", openid, function (err, result) {
			if (result) {
				Meteor.loginWithToken(result.token, function(err) {
					// console.log("loginWithToken", err, result);
					if (err) {
						kylUtil.alert("微信帐号登录失败");
					} else {
						Router.go(originalUrl);
					}
				});
			} else {
				kylUtil.alert("该微信帐号未绑定");
			}
		});
	}
	this.next();
}, {only: needAccountRouters});

// 开业啦帐号登录
Router.onBeforeAction(function () {
	// console.log('check loginUser', Meteor.userId(), this.originalUrl );
	if (Meteor.userId()) {
		this.next();
	} else {
			Router.go('login', {}, {query: 'redirectUrl=' + encodeURIComponent(this.originalUrl)});
	}
}, {only: needAccountRouters});
