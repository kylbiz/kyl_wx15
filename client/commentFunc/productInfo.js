CommFunc = {};

// 获取所购买商品的显示数据 在购物车页/结算页需要用
CommFunc.getShopCartInfo = function () {
	var list = ShopCart.find({}) || [];
	return productShowInfo(list) || [];
}


// 获取所购买商品的显示数据 在订单中心页需要用
CommFunc.getOrderInfo = function () {
	var list = Orders.find({}) || [];
	return productShowInfo(list) || [];
}

// 组合产品需要显示的内容
function productShowInfo (list) {
	var listExt = [];
  	list.forEach(function (infoBase) {
  		var type = infoBase.typeNameFlag;
  		var info = infoBase.servicesNameList[0];
	  	var _img = kylUtil.getImg(info.name);
	  	var infoExt = getInfoExt(type, info);

	  	listExt.push({
	  		id: infoBase._id,
	  		orderId: infoBase.orderId || false,	//购物车中无该选项
	  		payed: infoBase.payed,
	  		// title: infoBase.productType, subtitle: info.name, payment: infoBase.moneyAmount, 
	  		_img: _img,
	  		title: info.name,
	  		payment: infoBase.moneyAmount, 
	  		ext: infoExt
	  	});
  	});

  	return listExt;


  	function getInfoExt (type, info) {
		var strMap = {
			registration: function () {
				return [
					'地区: ' + info.zone,
				];
			},
			assurance: function () {
				var ret = [
					'服务: ' + info.server,
				];

				if(info.periodName) {
					ret.push('时间: ' + info.periodName);
					ret.push('人数: ' + info.scale);
				}
				return ret;
			},
			finance: function () {
				return [
					'类型: ' + info.name,
					'服务: ' + info.serverType,
					'时间: ' + info.period
				];
			},
			bookkeeping: function () {
				return [
					'类型: ' + info.serverType,
					'服务: ' + info.server
				];
			},
			bank: function () {
				return [
					'银行: ' + info.bank
				]
			}
		};

		return strMap[type]();
	}
}