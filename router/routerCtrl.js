//路由相关设置
Router.configure({
	layoutTemplate: 'layoutTemplate',
  	loadingTemplate: 'loading',
  //notFoundTemplate: 'notFoundTemplate',
});

    

// 登陆权限控制 这里需要判断两种条件
// 微信帐号登录
Router.onBeforeAction(function () {
	// console.log("WeChatUser", Session.get('WeChatUser'), this.params.query);
	var openid = Session.get('WeChatUser')
	if (openid) {
		this.next();
	} else if (openid = this.params.query.openid) {
		Session.set('WeChatUser', openid);
		this.next();
	} else {
		// this.render('errPage');
		Router.go('/oauth');
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
	'shopcart', 'trade', 'payResult', 	//订单支付相关
	'addressList', 'address',	//地址管理相关
	'orderList', 'orderDetail', 'orderProcess', // 订单管理相关
	'home',	// 用户信息相关
	]});