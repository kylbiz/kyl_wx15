Meteor.methods({
	'addOrder': function () {
	},
	'updateOrder': function (orderId, info) {
		console.log("updateOrder", orderId, info);

		var orderInfo = Orders.findOne({orderId: orderId});
		if (!orderInfo) {
			throw new Meteor.Error("数据错误");
		}

		// 对插入数据的校验
		var keysAllow = {
			companyName: function (data) {
				return (orderInfo.typeNameFlag == "registration");
			},
		}

		for (key in info) {
			if (keysAllow.hasOwnProperty(key) && !keysAllow[key](info[key])) {
				throw new Meteor.Error("插入数据非法");
			}
		}

		var ret = Orders.update({orderId: orderId}, {$set: info});
		return ret;
	}	
});