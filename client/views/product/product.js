// 产品说明页

Template.product.helpers({
	des: function () {
		// 产品的描述
		return {}
	}
});


Template.product.events({
	'click .buyBtn': function (event, template) {
		// if (Meteor.userId()) {
		// 	// 不同产品 不同购买选项
		// 	console.log('buyBtn', Session.get('productType'));
		// 	alert('buyBtn ' + Session.get('productType'));
		// 	// 跳转到购买页
		// } else {
		// 	// 去登陆
		// }

		// console.log('buyBtn');
		// Router.go('/shopcart'); // 之后版本
		Router.go('/trade');
	}
});