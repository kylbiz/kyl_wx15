//路由相关设置
Router.configure({
	layoutTemplate: 'layoutTemplate'
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
	console.log('loginUser');
	if (Meteor.userId()) {
		this.next();
	} else {
		this.render('login');
	}
}, {only: ['shopcart', 'trade', 'payResult', 'orderlist', 'orderDetail', 'orderProcess', 'home']});