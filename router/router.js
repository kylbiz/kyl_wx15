// 项目客户端的路由控制及路由的权限判断

// Router.route('/', function () {

// 	this.redirect('/main');

// });

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
			RegList[key]['baseType'] = 'registration';
		}

		productsPreview = [
			{title: '小白云工商注册', items: RegList},
			{title: '小企财云', items: [
				{name: '银行开户', price: '200', baseType: 'bank'},
				{name: '财务代理', price: '300-1900', baseType: 'finance'},
				{name: '流量记账包服务套餐', price: '300-3000', baseType: 'bookkeeping'}
			]},
			{title: '小企人事', items: [
				{name: '小企社保', baseType: 'assurance'}
			]},
		];
		return {products: productsPreview};
	},
});


// 产品详情页
Router.route('/product/:productType', {
	name: 'product',
	waitOn: function () {
		console.log(this.params.productType, this.params.query);
		return Meteor.subscribe('products', this.params.productType);
	}
});

// 购物车
Router.route('/shopcart', {
	name: 'shopcart',
	waitOn: function () {
		return Meteor.subscribe('shopcart');
	}
});

// 收货地址页
Router.route('/addressList', {
	name: 'addressList',
	waitOn: function () {
		return Meteor.subscribe('userAddress');
	},
	onBeforeAction: function () {
		if( UserAddress.find({}).count() ) {
            this.next();   
        } else { 
            Router.go('address');
        }
	}
});
// 添加收货地址
Router.route('/address');


// 订单中心界面
Router.route('/orderList');

// 订单详情
Router.route('/orderDetail');

// 订单进度
Router.route('/orderProcess');

// 支付页
Router.route('/weixinpay', {
	name: 'trade',
	subscriptions: function () {
		return Meteor.subscribe('userAddress');
	},
	waitOn: function () {
		return Meteor.subscribe('shopcart');
	},	
});

// 支付结果
// Router.route('/payResult');
Router.route('/paySuccess', {
	name: "paySuccess",
	subscriptions: function () {
		return Meteor.subscribe('paylog', this.params.query.order);
	},
	data: function () {
		return {info: PayLogs.findOne({}), style: this.params.query.style};
	}
});

// 注册公司信息
Router.route('/companyInfo');




// 个人中心
Router.route('/home');



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

Router.route('/form');


Router.route('/tools');

Router.route('/forget');

Router.route('/orderDescription');

Router.route('/shockholder');