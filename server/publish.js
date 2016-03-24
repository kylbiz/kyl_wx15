/**
 * 首页需要 所有产品的名称 价格 图片
 */

// Meteor.publish('products', function(project, opt) {
// 	if (!project) {
// 		return [];
// 	}


// 	opt = opt || {};
// 	products = {
// 		'registration': RegistrationLists.find(opt),
// 		'finance': FinanceLists.find(opt),
// 		'bookkeeping': BookkeepingLists.find(opt),
// 		'bank': BankLists.find(), // 需定义为collection
// 		'assurance': AssuranceLists.find(),
// 		'trademark': TradeMark.find(),
// 		'special': SpecialProduct.find(),
// 	};

// 	if (project == 'preview_all') {
// 		products_preview = [];
// 		for (var key in products) {
// 			products_preview.push(products[key]);
// 		}
// 		return products_preview;
// 	} else if (project == 'finances') {
// 		return [FinanceLists.find(), BookkeepingLists.find(), BankLists.find()];
// 	}

// 	return products[project];
// });

Meteor.publish('products', function(project, opt) {
	if (!project) {
		return [];
	}
	opt = opt || {};
	products = {
		'registration': CompanyRegist.find(opt),
		'finance': FinanceAgent.find(opt),
		'bank': BankLists.find(),
		'special': SpecialProduct.find(),
	};

	if (project == 'preview_all') {
		products_preview = [];
		for (var key in products) {
			products_preview.push(products[key]);
		}
		return products_preview;
	}

	return products[project];
});

Meteor.publish('shopcart', function (orderId) {
	orderId = orderId || false;
	// console.log("shopcart --", orderId, ShopCart.find({ordered: orderId}).fetch() );
	return ShopCart.find({userId: this.userId, payed: false, ordered: orderId, $or: [{host: 'KYLWX'}, {host: 'KYLWAP'}] }, {sort: {createTime: -1}});
});

Meteor.publish('userAddress', function (addrId) {
	var cond = {userId: this.userId};
	if (addrId) {
		cond._id = addrId;
	}
	return UserAddress.find(cond, {sort: {createAt: -1}});
});

Meteor.publish('orders', function (orderId) {
	var cond = {userId: this.userId, $or: [{host:'KYLWX'}, {host:'KYLWAP'}] };
	if (orderId) {
		cond.orderId = orderId;
	}
	return Orders.find(cond, {sort: {createTime: -1}});
});

Meteor.publish('paylog', function (openid) {
	return PayLogs.find({
		userId: this.userId, openid: openid, payed: true
	}, {
		fields: {moneyAmount: 1, openid: 1}
	});
});

//
Meteor.publish('companyIndustry', function () {
	return [BusinessTypeLists.find({}), Business.find({}), Business1.find({})];
});

// 公司所属大行业
// Meteor.publish('compTypBase', function () {
// 	return BusinessTypeLists.find({});
// });
// // 公司所属细分行业及经营范围
// Meteor.publish('compTypDetail', function (base) {
// 	return Business.find({industryBig: base});
// });

