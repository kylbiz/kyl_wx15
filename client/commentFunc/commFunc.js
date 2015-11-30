CommFunc = {};

CommFunc.getShopCartInfo = function () {
	var list = ShopCart.find({}).fetch();
	var listExt = [];
  	list.forEach(function (infoBase) {
  		var type = infoBase.typeNameFlag;
  		var info = infoBase.servicesNameList[0];
	  	var infoExt = getInfoExt(type, info);
	  	listExt.push({
	  		id: infoBase._id,
	  		title: infoBase.productType, subtitle: info.name, payment: infoBase.moneyAmount, 
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
		};

		return strMap[type]();
	}
}