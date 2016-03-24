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
      var info = {};
      var version = infoBase.version;
      if (version && version >= 2) {
        info = newProduct(infoBase);
      } else {
        console.log(infoBase);
        info = oldProduct(infoBase);
      }
      if (info) {
        listExt.push(info);
      }
    });

    return listExt;
}


function oldProduct(infoBase) {
    var type = infoBase.typeNameFlag;
    var info = infoBase.servicesNameList[0];
    var _img = kylUtil.getImg(info.name);
    var infoExt = getInfoExt(type, info);

    return {
      id: infoBase._id,
      orderId: infoBase.orderId || false, //购物车中无该选项
      payed: infoBase.payed,
      typeNameFlag: infoBase.typeNameFlag,
      userConfirmed: infoBase.userConfirmed,
      // title: infoBase.productType, subtitle: info.name, payment: infoBase.moneyAmount,
      _img: _img,
      title: info.name,
      payment: infoBase.moneyAmount,
      ext: infoExt
    };

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

function newProduct(infoBase) {
  var type = infoBase.typeNameFlag;
  var info = infoBase.servicesNameList[0];
  var _img = kylUtil.getImg(type);
  var infoExt = getInfoExt(type, info);

  return {
      id: infoBase._id,
      orderId: infoBase.orderId || false, //购物车中无该选项
      payed: infoBase.payed,
      typeNameFlag: infoBase.typeNameFlag,
      userConfirmed: infoBase.userConfirmed,
      // title: infoBase.productType, subtitle: info.name, payment: infoBase.moneyAmount,
      _img: _img,
      title: infoBase.productType,
      payment: infoBase.moneyAmount,
      ext: infoExt
  };

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







// 组合产品需要显示的内容
// function productShowInfo (list) {
// 	var listExt = [];
// 	list.forEach(function (infoBase) {
// 		var type = infoBase.typeNameFlag;
// 		var info = infoBase.servicesNameList[0];
//   	// var _img = kylUtil.getProductImg(type);
//   	var _img = kylUtil.getImg(type);
//   	var infoExt = getInfoExt(type, info);

//   	listExt.push({
//   		id: infoBase._id,
//   		orderId: infoBase.orderId || false,	//购物车中无该选项
//   		payed: infoBase.payed,
//   		typeNameFlag: infoBase.typeNameFlag,
//   		userConfirmed: infoBase.userConfirmed,
//   		// title: infoBase.productType, subtitle: info.name, payment: infoBase.moneyAmount,
//   		_img: _img,
//   		title: infoBase.productType,
//   		payment: infoBase.moneyAmount,
//   		ext: infoExt
//   	});
// 	});

// 	return listExt;

// 	function getInfoExt (type, info) {
// 		var strMap = {
// 			registration: function () {
// 				return [
// 					'类型: ' + info.label,
// 					'地区: ' + info.zone,
// 				];
// 			},
// 			finance: function () {
// 				var arr = ['类型: ' + info.label, '时间: ' + info.period];
// 				if (info.annualIncome) {
// 					arr.push('年收入: ' + info.annualIncome);
// 				}

// 				if (info.certiNum) {
// 					arr.push('凭证量: ' + info.certiNum);
// 				}
// 				return arr;
// 			},
// 			bank: function () {
// 				return [
// 					'银行: ' + info.bank
// 				];
// 			},
// 			trademark: function () {
// 				return [];
// 			}
// 		};

// 		if (strMap.hasOwnProperty(type)) {
// 			return strMap[type]();
// 		} else {
// 			return [];
// 		}
// 	}
// }
