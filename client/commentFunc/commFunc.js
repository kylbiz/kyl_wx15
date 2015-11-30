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
		};

		return strMap[type]();
	}
}