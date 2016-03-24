CommFunc = {}; //  客户端显示相关的方法

// 获取所购买商品的显示数据 在购物车页/结算页需要用
CommFunc.getShopCartInfo = function () {
	var list = ShopCart.find({}) || [];
	return productShowInfo(list) || [];
};


// 获取所购买商品的显示数据 在订单中心页需要用
CommFunc.getOrderInfo = function () {
	var list = Orders.find({}) || [];
	return productShowInfo(list) || [];
};

// 组合产品需要显示的内容
function productShowInfo (list) {
	var listExt = [];
  	list.forEach(function (infoBase) {
  		var type = infoBase.typeNameFlag;
  		var info = infoBase.servicesNameList[0];
	  	var _img = kylUtil.getProductImg(type);
	  	var infoExt = getInfoExt(type, info);

	  	listExt.push({
	  		id: infoBase._id,
	  		orderId: infoBase.orderId || false,	//购物车中无该选项
	  		payed: infoBase.payed,
	  		typeNameFlag: infoBase.typeNameFlag,
	  		userConfirmed: infoBase.userConfirmed,
	  		// title: infoBase.productType, subtitle: info.name, payment: infoBase.moneyAmount,
	  		_img: _img,
	  		title: infoBase.productType,
	  		payment: infoBase.moneyAmount,
	  		ext: infoExt
	  	});
  	});

  	return listExt;


  	function getInfoExt (type, info) {
			var strMap = {
				registration: function () {
					return [
						'类型: ' + info.label,
						'地区: ' + info.zone,
					];
				},
				finance: function () {
					var arr = ['类型: ' + info.label, '时间: ' + info.period];
					if (info.annualIncome) {
						arr.push('年收入: ' + info.annualIncome);
					}

					if (info.certiNum) {
						arr.push('凭证量: ' + info.certiNum);
					}
					return arr;
				},
				bank: function () {
					return [
						'银行: ' + info.bank
					];
				},
				trademark: function () {
					return [];
				}
			};

			if (strMap.hasOwnProperty(type)) {
				return strMap[type]();
			} else {
				return [];
			}
		}
}
