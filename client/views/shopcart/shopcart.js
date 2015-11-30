// 购物车页
Template.shopcart.helpers({
  list: function() {
  	if (!ShopCart.find({}).count()) {
  		return false;
  	} 	
    return {info: CommFunc.getShopCartInfo()};
  }
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

