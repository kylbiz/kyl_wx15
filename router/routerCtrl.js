//路由相关设置
Router.configure({
	layoutTemplate: 'layoutTemplate',
  	loadingTemplate: 'loading',
  //notFoundTemplate: 'notFoundTemplate',
});

// 登陆权限控制 这里需要判断两种条件
// 微信帐号登录
Router.onBeforeAction(function () {
	if (kylUtil.isWeChat()) {
		var WeChatUser = this.params.query.openid || "";
		if (WeChatUser) {
			console.log("have query");
			window.localStorage.openid = WeChatUser;
			Session.set('WeChatUser', WeChatUser);
			this.next();
		} else if (window.localStorage.openid) {
			console.log('have coll');
			Session.set('WeChatUser', window.localStorage.openid);
			this.next();
		} else {
			console.log("go to oauth");
			Router.go('/oauth');
		}
	} else {
		this.next();
	}
}, {except: ['receive', 'oauth', 'createMenu']});


// 开业啦帐号登录
Router.onBeforeAction(function () {
	console.log('loginUser', Meteor.userId(), this.originalUrl);
	if (Meteor.userId()) {
		this.next();
	} else {
		Router.go('login', {}, {query: 'redirectUrl=' + encodeURIComponent(this.originalUrl)});
	}
}, {only: [
	'shopcart', 'trade', 'paySuccess', 	//订单支付相关
	'addressList', 'address',	//地址管理相关
	'orderList', 'orderDetail', 'orderProcess', 'orderDescription', 'shockholder',// 订单管理相关
	'home',	// 用户信息相关
	]});
