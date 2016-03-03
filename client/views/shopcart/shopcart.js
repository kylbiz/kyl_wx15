// 购物车页
Template.shopcart.helpers({
  list: function() {
  	if (!ShopCart.find({}).count()) {
  		return false;
    }
    var buyInfo = CommFunc.getShopCartInfo();
    var price = 0;
    buyInfo.forEach(function (info) {
        price += parseInt(info.payment);
    });
    return {
        info: buyInfo,
        payBasicInfo: {
            count: buyInfo.length,
            price: price
        }
    };
  },

});

Template.shopcart.events({
	'click .trash': function (event) {
		var id = $(event.currentTarget).context.id;
		console.log("id", id);

		Template.layoutTemplate.confirm({
			title: '提示',
			content: '确定删除该商品？'
		}).on(function(e) {
			if (e) {
				Meteor.call('shopcartDel', id, function(error, result) {
					console.log('shopcartDel', error, result);
				});

			}
		});
	},
});

// 底部控制
Template.shopcart_controlBox.events({
	'click #trade': function () {
		// Router.go("trade"); //在微信环境下 router.go 不改变真实url
    window.location.href = '/pay/';
	}
});

