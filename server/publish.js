/**
 * 首页需要 所有产品的名称 价格 图片
 */

Meteor.publish('products', function(project, opt) {
	opt = opt || {};
	products = {
		'registration': RegistrationLists.find(opt),
		'finance': FinanceLists.find(opt),
		'bookkeeping': BookkeepingLists.find(opt),
		'bank': BankLists.find(), // 需定义为collection
		'assurance': AssuranceLists.find(),
	};

	if (project == 'preview_all') {
		products_preview = [];
		for (key in products) {
			products_preview.push(products[key]);
		}

		return products_preview;
	}
	return products[project];
});

Meteor.publish('shopcart', function (orderId) {
	orderId = orderId || false;
	return ShopCart.find({userId: this.userId, payed: false, ordered: orderId}, {sort: {createTime: -1}});
});

Meteor.publish('userAddress', function () {
	return UserAddress.find({userId: this.userId}, {sort: {createAt: -1}});
});

Meteor.publish('orders', function (orderId) {
	var cond = {userId: this.userId};
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

