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

Meteor.publish('shopcart', function () {
	return ShopCart.find({});
});