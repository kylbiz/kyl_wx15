var checkItems = {
	companyName: "企业名",
	industryBig : "企业分类",
	industrySmall: "企业分类", 
	businessScope: "经营范围", 
	companyMoney: "注册资金",
	holders: "股东",
	legalPerson: "法人",
	supervisor: "监事",
	contractor: "负责人",
	consigner: "资料对接人",
}

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
		// var keysAllow = {
		// 	// 公司名
		// 	companyName: function (data) {
		// 		return (data && isRegComp());
		// 	},
		// 	// 行业大类
		// 	industryBig: function (data) {
		// 		// 需进一步校验
		// 		return (data && isRegComp()); 
		// 	},
		// 	// 行业细分类别
		// 	industrySmall: function (data) {
		// 		// 需进一步校验
		// 		return (data && isRegComp());
		// 	},
		// 	// 经营范围
		// 	businessScope: function (data) {
		// 		// 需进一步校验
		// 		return (data && isRegComp());
		// 	},
		// 	// 注册资金
		// 	companyMoney: function () {
		// 		return (data && ( parseInt(data) || false) && isRegComp());
		// 	},
		// 	// 企业股东
		// 	holders: function (data) {
		// 		// 需进一步校验
		// 		return (data && isRegComp());
		// 	},

		// 	// 企业法人
		// 	legalPerson: function (data) {
		// 		// 需进一步校验
		// 		// if ( realaInfo && (realaInfo == data.legalPersonId) ) {
		// 		// 	return false;
		// 		// }
		// 		// realaInfo = data.legalPersonId;
		// 		return (data && isRegComp());
		// 	},
		// 	// 企业监事
		// 	supervisor: function (data) {
		// 		// 需进一步校验
		// 		// if ( realaInfo && (realaInfo == data.supervisorId) ) {
		// 		// 	return false;
		// 		// }
		// 		// realaInfo = data.supervisorId;
		// 		return (data && isRegComp());
		// 	},
		// 	// 财务与企业联络人
		// 	contractor: function (data) {
		// 		// 需进一步校验
		// 		return (data && isRegComp());
		// 	}
		// }

		// // 判断是不是注册公示order
		// function isRegComp() {
		// 	return (orderInfo.typeNameFlag == "registration");
		// }

		// for (key in info) {
		// 	if (keysAllow.hasOwnProperty(key) && !keysAllow[key](info[key])) {
		// 		throw new Meteor.Error("插入数据非法");
		// 	}
		// }
		var checkRet = checkData(info, orderInfo);
		if (checkRet.result) {
			var ret = Orders.update({orderId: orderId}, {$set: info});
			console.log('updateOrder ret', ret);
			return ret;
		} else {
			throw new Meteor.Error(checkItems[checkRet.key] + "信息非法");
		}

	},
	'orderIsComplete': function (orderId) {
		// var checkItems = {
		// 	companyName: function () {

		// 	},
		// 	industryBig : function () {

		// 	},
		// 	industrySmall: function () {

		// 	}, 
		// 	businessScope: function () {

		// 	}, 
		// 	companyMoney: function () {

		// 	},
		// 	holders: function () {

		// 	},
		// 	legalPerson: function () {

		// 	},
		// 	supervisor: function () {

		// 	},
		// 	contractor: function () {

		// 	},
		// 	consigner: function () {

		// 	}
		// }

		var orderInfo = Orders.findOne({orderId: orderId});
		if (!orderInfo) {
			throw new Meteor.Error("数据错误");
		}

		var ret = {userConfirmed: false, msg: "资料未填写完整, 不可提交"};
		var checkRet = checkData(orderInfo, orderInfo, true);
		if (checkRet.result) {
			ret = {userConfirmed: true, msg: "提交成功"};
		} else {
			ret = {userConfirmed: false, msg: checkItems[checkRet.key] + "信息未填写完整, 不可提交"};
		}
		return ret;
	}	
});


// 对插入数据的校验
function checkData (needCheck, orderInfo, check) {
	check = check || false;
	var checkItems = {
		// 公司名
		companyName: function (data) {
			return (data && data.mainName && isRegComp());
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
		// 注册资金
		companyMoney: function (data) {
			return (data && ( parseInt(data) || false) && isRegComp());
		},
		// 企业股东
		holders: function (data) {
			// 需进一步校验
			return (data && isRegComp());
		},

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

	if (check) {
		for (key in checkItems) {
			var value = needCheck[key] || false;
			if (!checkItems[key](value)) {
				console.log("check ", key, value);
				return {result: false, key: key}
			}
		}
		
	} else {
		for (key in needCheck) {
			console.log("needCheck", key, needCheck[key]);
			if (checkItems.hasOwnProperty(key) && !checkItems[key](needCheck[key])) {
				return {result: false, key: key}
			}
		}		
	}


	return {result: true};
}
