Meteor.methods({
	'addOrder': function () {
	},
	'updateOrder': function (orderId, info) {
		console.log("updateOrder", orderId, info);

		var orderInfo = Orders.findOne({orderId: orderId});
		if (!orderInfo) {
			throw new Meteor.Error("数据错误");
		}

		// var realaInfo = false;

		// 对插入数据的校验
		var keysAllow = {
			// 公司名
			companyName: function (data) {
				return (data && isRegComp());
			},
			// 行业大类
			industryBig: function (data) {
				// 需进一步校验
				return (data && isRegComp()); 
			},
			// 行业细分类别
			industrySmall: function (data) {
				// 需进一步校验
				return (data && isRegComp());
			},
			// 经营范围
			businessScope: function (data) {
				// 需进一步校验
				return (data && isRegComp());
			},
			// 企业股东

			// 企业法人
			legalPerson: function (data) {
				// 需进一步校验
				// if ( realaInfo && (realaInfo == data.legalPersonId) ) {
				// 	return false;
				// }
				// realaInfo = data.legalPersonId;
				return (data && isRegComp());
			},
			// 企业监事
			supervisor: function (data) {
				// 需进一步校验
				// if ( realaInfo && (realaInfo == data.supervisorId) ) {
				// 	return false;
				// }
				// realaInfo = data.supervisorId;
				return (data && isRegComp());
			},
			// 财务与企业联络人
			contractor: function (data) {
				// 需进一步校验
				return (data && isRegComp());
			}
		}

		// 判断是不是注册公示order
		function isRegComp() {
			return (orderInfo.typeNameFlag == "registration");
		}

		for (key in info) {
			if (keysAllow.hasOwnProperty(key) && !keysAllow[key](info[key])) {
				throw new Meteor.Error("插入数据非法");
			}
		}

		var ret = Orders.update({orderId: orderId}, {$set: info});
		console.log('updateOrder ret', ret);
		return ret;
	}	
});