// 产品的路由

// 公司首页
Router.route('/', {
	name: 'index'
});

// 大分类产品
// Router.route('/products/:products', {
// 	name: 'products',
// 	waitOn: function () {
// 		var type = this.params.products || false;
// 		return Meteor.subscribe('products', type);
// 	},
// 	data: function () {
// 		var type = this.params.products;
// 		return {
// 			registration: function () {
// 				var RegList = RegistrationLists.find({}, {name: true}).fetch();
// 				for (var key in RegList) {
// 					RegList[key]['baseType'] = 'registration';
// 					RegList[key]['price'] = kylUtil.getPriceGeneral(RegList[key]['name']);
// 				}
// 				return {title: '小白云工商注册', items: RegList};
// 			},
// 			finances: function () {
// 				return {title: '小企财云', items: [
// 					{name: '财务代理', price: kylUtil.getPriceGeneral('财务代理'), baseType: 'finance'},
// 				]};
// 			},
// 		}[type]();
// 	},
// 	onBeforeAction: function () {
// 		var data = this.data() || {};
// 		var items = data.items || [];
// 		if (items.length === 1) {
// 			this.redirect('/product/' + items[0].baseType + '?name=' + items[0].name);
// 		} else {
// 			this.next();
// 		}
// 	}
// });

// 产品详情页
// Router.route('/product/:productType', {
// 	name: 'product',
// 	waitOn: function () {
// 		// console.log("product ", this.params.productType, this.params.query);
// 		return Meteor.subscribe('products', this.params.productType);
// 	},
// 	data: function () {
// 		return {productName: this.params.query.name};
// 	}
// });

// 产品详细页
Router.route('/products/:productType', {
	name: 'product',
	waitOn: function () {
		return Meteor.subscribe('products', this.params.productType);
	},
	// onBeforeAction: function () {
	// 	var productType = this.params.productType || "";
	// 	if (productType == 'special') {
	// 		this.render("partnership");
	// 	} else {
	// 		this.next();
	// 	}
	// }
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
Router.route('/address', {
	name: "address",
	waitOn: function () {
		var addrId = this.params.query.addrId;
		if (addrId) {
			return Meteor.subscribe('userAddress', addrId);
		} else {
			return [];
		}
	},
	data: function () {
		return UserAddress.findOne({});
	}
});

// 支付页
Router.route('/pay/', {
	name: 'trade',
	subscriptions: function () {
		return Meteor.subscribe('userAddress');
	},
	waitOn: function () {
		var orderId = this.params.query.orderid || false;
		return Meteor.subscribe('shopcart', orderId);
	}
});

// 支付结果
Router.route('/pay_result/:channel', {
	name: "payResult",
	template: "paySuccess",
	onBeforeAction: function () {
		var channel = this.params.channel || "";
		var query = this.params.query || {};
		if (channel == 'pingxx' && query.result != 'success') {
			Router.go('orderList');
		} else {
			this.next();
		}
	},
	waitOn: function () {
		var channel = this.params.channel || "";
		var query = this.params.query || {};
		var order = "";
		if (channel == 'wechat') {
			order = query.order;
		} else if (channel == 'pingxx') {
			order = query.out_trade_no;
		}
		return Meteor.subscribe('paylog', order);
	},
	data: function () {
		return {info: PayLogs.findOne({}), style: this.params.channel};
	}
});

// 注册公司信息
Router.route('/companyInfo', {
	name: 'companyInfo',
	waitOn: function () {
		var orderId = this.params.query.orderid || "empty";
		return Meteor.subscribe("orders", orderId);
	},
	data: function () {
		return Orders.findOne({});
	},
});


// 个人中心
Router.route('/home', {
	name: "home",
});


// 登录页
Router.route('/login', {
	name: 'login',
	onBeforeAction: function () {
		if (Meteor.userId()) {
			var redirectUrl = decodeURIComponent(this.params.query.redirectUrl || "/");
			Router.go(decodeURIComponent(redirectUrl));
		} else {
			this.next();
		}
	}
});

//财务代理套餐
Router.route('/buyagent',{
	name: 'xiaobaitaocao',
});


// 注册页
Router.route('/register', {
  name: 'register',
  onBeforeAction: function() {
    if(Meteor.userId()) {
      // Router.go('/');
      var redirectUrl = decodeURIComponent(this.params.query.redirectUrl || "/");
			Router.go(decodeURIComponent(redirectUrl));
    } else {
      this.next();
    }
  }
});

// 公司信息填写
Router.route('/form/:item', {
	name: "form",
	subscriptions: function () {
		return Meteor.subscribe("companyIndustry");
	},
	waitOn: function () {
		var orderId = this.params.query.orderid || "empty";
		return Meteor.subscribe("orders", orderId);
	},
	data: function () {
		return Orders.findOne({});
	},
});

// 订单中心界面
Router.route('/orderList', {
	name: "orderList",
	waitOn: function () {
		return Meteor.subscribe('orders');
	},
	// onBeforeAction
});

// 订单详情
Router.route('/orderDetail', {
	name: "orderDetail",
	waitOn: function () {
		var orderId = this.params.query.orderid || "empty";
		return Meteor.subscribe("orders", orderId);
	},
	data: function () {
		return Orders.findOne({});
	},
});

// 订单进度
Router.route('/orderProcess/:orderId', {
	name: "orderProcess",
	waitOn: function () {
		var orderId = this.params.orderId || "empty";
		return Meteor.subscribe("orders", orderId);
	},
	data: function () {
		return Orders.findOne({});
	}
});

// 公司注册详情
Router.route('/orderDesc/:orderId', {
	name: 'orderDescription',
	waitOn: function () {
		var orderId = this.params.orderId || "empty";
		return Meteor.subscribe("orders", orderId);
	},
	data: function () {
		return Orders.findOne({});
	}
});

// 公司股东的信息
Router.route('/shockholder', {
	name: 'shockholder',
	waitOn: function () {
		var query = this.params.query;
		var orderId = query.orderId || "empty";
		return Meteor.subscribe("orders", orderId);
	},
	data: function () {
		return Orders.findOne({});
	}
});

Router.route('/tools');

Router.route('/forget');

Router.route('/context');

Router.route('/aboutus');

Router.route('/helper');


Router.route('/activity');

