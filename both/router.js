// 项目客户端的路由控制及路由的权限判断

Router.configure({
	layoutTemplate: 'layoutTemplate',
  loadingTemplate: 'loading'
});

// 首页
Router.route('/', {
	name: 'main',
	waitOn: function () {
		return Meteor.subscribe('products', 'preview_all');
	},
	data: function () {
		// registration, bank, finance, assurance, bookkeeping

		var RegList = RegistrationLists.find({}, {name: true}).fetch();
		for (var key in RegList) {
			RegList[key]['type'] = 'registration';
		}

		productsPreview = [
			{title: '小白云工商注册', items: RegList},
			{title: '小企财云', items: [
				{name: '银行开户', price: '200', type: 'bank'},
				{name: '财务代理', price: '300-1900', type: 'finance'},
				{name: '流量记账包服务套餐', price: '300-3000', type: 'bookkeeping'}
			]},
			{title: '小企人事', items: [
				{name: '小企社保', type: 'assurance'}
			]},
		];
		return {products: productsPreview};
	},
});


// 产品详情页
Router.route('/product/:productType', {
	name: 'product',
	// waitOn: function () {
	// 	Session.set('productType', this.params.productType);
	// 	return Meteor.subscribe('products', this.params.productType);
	// },
	// data: function () {
	// 	return ;
	// },
});


// 订单中心界面
Router.route('/orderList');

// 订单详情
Router.route('/orderDetail');

// 订单进度
Router.route('/orderProcess');

// 支付页
Router.route('/trade');

// 支付结果
// Router.route('/payResult');
Router.route('/paySuccess');

// 注册公司信息
Router.route('/companyInfo');




// 个人中心
Router.route('/home');


// 购物车
Router.route('/shopcart');




// 登录页
Router.route('/login', {
	name: 'login',
	onBeforeAction: function () {
		if (Meteor.userId()) {
			Router.go('/');
		} else {
			this.next();
		}
	}
});



// 注册页
Router.route('/register', {
  name: 'register',
  onBeforeAction: function() {
    if(Meteor.userId()) {
      Router.go('/');
    } else {
      this.next();      
    }
  }  
});


// 注销
Router.route('/logout', function() {
	Meteor.logout(function(err) {
		if (err) {
			console.log("logout fail");
		}
	});
	Router.go('/');
})


// 登陆权限控制 这里需要判断两种条件
// 微信帐号登录
Router.onBeforeAction(function () {
	console.log("WeChatUser", Session.get('WeChatUser'), this.params.query);
	var openid = Session.get('WeChatUser')
	if (openid) {
		this.next();
	} else if (openid = this.params.query.openid) {
		Session.set('WeChatUser', openid);
		this.next();
	} else {
		// this.render('errPage');
		Router.go('/oauth'); // 
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



// test 微信添加按钮
// Router.route('/createMenu', function() {
// 	Meteor.call('createMenu', function (error, result) {
// 		console.log('createMenu', error, result);
// 	});
// }, {where: 'server'});


Router.route('form');
