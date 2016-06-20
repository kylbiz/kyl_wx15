Meteor.methods({
	shopcartAdd: function( serInfo ) {
    // console.log("shopcartAdd get serInfo", serInfo);
		var shopcartInfo = getShopcartInfo(serInfo);
    // console.log("shopcartInfo", shopcartInfo);
		return ShopCart.insert(shopcartInfo);
	},

	shopcartDel: function ( id ) {
		// var relationId = ShopCart.findOne({_id: id}).relationId; // 相关功能未实现
		return ShopCart.remove({userId: Meteor.userId(), _id: id});
	}
});


function getShopcartInfo(serInfo) {

	// 产品数据中相同的部分
	var comm = commInfo(serInfo);

	var type = serInfo.type;
	// 各产品不同的部分
    var handles = {
    	registration: handleRegist,
    	finance: handleFinance,
    	bank: handleBank,
      special: handleSpecial,
      permit: handlePermit,
      companycha: handleCompanyCha,

      // assurance: handleAssurance,
      // bookkeeping: handleBookkeeping,
      // trademark: handleTrademark,
    };
    var diffInfo = handles[type](serInfo);

    // 合并数据
	return kylUtil.mergeTwoObj(comm, diffInfo);
}

// 相同的数据
function commInfo(serInfo) {

	var productTypeNames = {
        'registration': '公司注册',
        'finance': '财务代理',
        'bank': '银行开户',
        'special': '特别产品',
        'partnership': '合伙管家',
        'permit': '许可证',
        'companycha': '公司变更',

        // 'assurance': '社保代理',
        // 'bookkeeping': '流量记账包服务套餐',
        // 'trademark': '商标注册',
    };

  var productCollections = {
    'registration': 'CompanyRegist',
    'finance': 'FinanceAgent',
    'bank': 'BankLists',
    'special': 'SpecialProduct',
    'permit': 'PermitProduct',
    'companycha': 'CompanyChange',
  }

  var version = WebSiteInfoMobile.findOne({name: 'productVersion'})[ productCollections[serInfo.type] ];

	return {
      version: version,
	    userId: Meteor.userId(),
	    relationId: kylUtil.genOrderId(),     //  关联产品id 为兼容PC数据 未实际使用
	    productType: productTypeNames[serInfo.type],
	    typeNameFlag: serInfo.type,
	    payed: false,
	    deleted: false,
	    ordered: false,
	    // canceled: false,
	    // finished: false,
	    host: serInfo.host, //来源
	    createTime: new Date(),
	};
}


// 公司注册数据处理
function handleRegist(serInfo) {
	// var info = RegistrationLists.findOne({name: serInfo.name});
  var info = CompanyRegist.findOne({name: serInfo.name})
	if (!info) {
		throw new Meteor.Error("内部数据错误: 1001");
	}

  function getPay() {
    var payment = 0;
    var services = info.services;
    services.forEach(function (service) {
        if (service.zone == serInfo.zone) {
            payment = service.payment;
        }
    });

    if (!payment) {
    	throw new Meteor.Error('内部数据错误: 1002');
    }

    return payment;
  }

  var pay = getPay();
  var message = kylUtil.getValueFromList(
    CompanyRegist.findOne({name: serInfo.name}).services || [],
    'zone', serInfo.zone, 'message') || "未知";

	return {
    moneyAmount: pay,
    servicesNameList: [{
    	name: serInfo.name, //"互联网公司", // 当前订单具体内容
      label: info.label,
      zhDes: info.label + "-"+ '区域' + ':' + serInfo.zone,
      money: pay,          //当前订单价格
      scale: 1,                 // 购买数量
      zone: serInfo.zone,
      message: '',
      servicesContains: [      // 订单中包含，也就是详细信息
        {
          message: message,
        }
      ]
    }],
    productProgress: {  // 公司注册需要该字段说明进度
      status: 0,
      updateTimes: [new Date()]
    }
	};
}

// 财务代理
function handleFinance (serInfo) {
  console.log('serInfo', serInfo);
  var productInfo = FinanceAgent.findOne({name: serInfo.name});
  if (!productInfo) {
    throw new Meteor.Error("内部数据错误: 1001");
  }

  var basicType = productInfo.basicType.name || "";
  var handleMap = {
    base: finBaseHandle,
    special: finSpecialHandle,
    // customproduct: finCustomHandle
  }

  if (!handleMap[basicType]) {
    throw new Meteor.Error("内部数据错误: 1003");
  }

  return handleMap[basicType](serInfo, productInfo);
}

// 财务代理基础套餐
function finBaseHandle (serInfo) {
  var productInfo = FinanceAgent.findOne({name: serInfo.name, 'period.items.value': serInfo.period});
  if (!productInfo) {
    throw new Meteor.Error("内部数据错误: 1001");
  }

  var pay = 0;
  if (productInfo.payment) {
    pay = productInfo.payment;
  } else {
    var productInfo = FinanceAgent.findOne({
      'name': serInfo.name,
      'opts.annualIncome.items.name': serInfo.annualIncome,
      'opts.certiNum.items.name': serInfo.certiNum,
    });

    if (!productInfo) {
      throw new Meteor.Error("内部数据错误: 1001");
    }


    var periodName = productInfo.period.label;
    var periodLabel = kylUtil.getValueFromList(productInfo.period.items, 'value', serInfo.period, 'label');
    var zhDes = productInfo.label + '-'+ periodName + ':' + periodLabel;

    var payment_1 = kylUtil.getValueFromList(
        productInfo.opts.annualIncome.items || [], 'name', serInfo.annualIncome, 'value');
    var payment_2 = kylUtil.getValueFromList(
        productInfo.opts.certiNum.items || [], 'name', serInfo.certiNum, 'value');
    pay = Math.min(payment_1, payment_2) || 0;
  }

  if (!pay) {
    throw new Meteor.Error('内部数据错误: 1002');
  }
  pay = pay * serInfo.period;

  var info = {
    name: serInfo.name,
    basicType: productInfo.basicType.name,
    label: productInfo.label,
    zhDes: zhDes,
    money: pay,
    scale: 1,
    period: serInfo.period,
    servicesContains: [{
    }]
  };

  if (serInfo.annualIncome && serInfo.certiNum) {
    info.annualIncome = serInfo.annualIncome;
    info.certiNum = serInfo.certiNum;

    var annualIncomeName = productInfo.opts.annualIncome.label;
    var certiNumName = productInfo.opts.certiNum.label;

    var annualIncomeLabel = kylUtil.getValueFromList(productInfo.opts.annualIncome.items, 'name', serInfo.annualIncome, 'label');
    var certiNumLabel = kylUtil.getValueFromList(productInfo.opts.certiNum.items, 'name', serInfo.certiNum, 'label');

    info.zhDes = info.zhDes + '-' + annualIncomeName + ':' + annualIncomeLabel
                + '-' + certiNumName + ':' + certiNumLabel;
  }

  return {
    moneyAmount: pay,
    servicesNameList: [info]
  };
}

// 财务代理特殊服务
function finSpecialHandle (serInfo) {

  var num = parseInt(serInfo.num);
  if (!num) {
    throw new Meteor.Error('内部数据错误: 1004');
  }

  var pay = 0
  var info = {}

  if (serInfo.name == 'fieldwork') {
    // 外勤
    var productInfo = FinanceAgent.findOne({
      "name": serInfo.name,
      "opts.service.items.name": serInfo.service,
      "opts.area.items.name": serInfo.area
    });

    if (!productInfo) {
      throw new Meteor.Error('内部数据错误: 1001');
    }

    var paymentAll = kylUtil.getValueFromList(
        productInfo.opts.service.items || [], 'name', serInfo.service, 'payment') || {};

    var payment = paymentAll[serInfo.area];
    if (!payment && payment !== 0) {
      throw new Meteor.Error('内部数据错误: 1002');
    }

    pay = payment * num;

    var opts = productInfo.opts;
    var areaLabel = kylUtil.getValueFromList(
        opts.area.items || [], 'name', serInfo.area, 'label');
    var zhDes = productInfo.label
                + '-' + opts.service.label + ":" + serInfo.service
                + '-' + opts.area.label + ":" + areaLabel
                + '-' + opts.num.label + ":" + serInfo.num

    var message = kylUtil.getValueFromList(
        opts.area.items || [], 'name', serInfo.area, 'message');

    info = {
      name: serInfo.name,
      basicType: productInfo.basicType.name,
      label: productInfo.label,
      zhDes: zhDes,
      money: pay,
      service: serInfo.service,
      area: serInfo.area,
      num: num,
      scale: 1,
      servicesContains: [{
        message: message || ""
      }]
    };
  } else if (serInfo.name == 'invoiceagent') {
    // 代开发票
    var productInfo = FinanceAgent.findOne({
      "name": serInfo.name,
      "opts.service.items.name": serInfo.service,
    });
    if (!productInfo) {
      throw new Meteor.Error("内部数据错误: 1001");
    }

    var payment = kylUtil.getValueFromList(
        productInfo.opts.service.items || [], 'name', serInfo.service, 'payment');
    if (!payment && payment !== 0) {
      throw new Meteor.Error("内部数据错误: 1002");
    }
    pay = payment * num;

    var opts = productInfo.opts;
    var zhDes = productInfo.label
                + '-' + opts.service.label + ":" + serInfo.service
                + '-' + opts.num.label + ":" + serInfo.num;

    var message = kylUtil.getValueFromList(
        productInfo.opts.service.items || [], 'name', serInfo.service, 'message') || "";

    info = {
      name: serInfo.name,
      basicType: productInfo.basicType.name,
      label: productInfo.label,
      zhDes: zhDes,
      money: pay,
      service: serInfo.service,
      num: num,
      scale: 1,
      servicesContains: [{
        message: message
      }]
    }
  }

  return {
    moneyAmount: pay,
    servicesNameList: [info]
  };
}

// 财代定制服务
function finCustomHandle (serInfo) {
}


function handleFinance_old (serInfo) {
  var productInfo = FinanceAgent.findOne({name: serInfo.name, 'period.items.value': serInfo.period});
  if (!productInfo) {
    throw new Meteor.Error("内部数据错误: 1001");
  }

  var pay = 0;
  if (productInfo.payment) {
    pay = productInfo.payment;
  } else {
    var productInfo = FinanceAgent.findOne({
      'name': serInfo.name,
      'opts.annualIncome.items.name': serInfo.annualIncome,
      'opts.certiNum.items.name': serInfo.certiNum,
    });

    if (!productInfo) {
      throw new Meteor.Error("内部数据错误: 1001");
    }


    var periodName = productInfo.period.label;
    var periodLabel = kylUtil.getValueFromList(productInfo.period.items, 'value', serInfo.period, 'label');
    var zhDes = productInfo.label + '-'+ periodName + ':' + periodLabel;

    var payment_1 = kylUtil.getValueFromList(
        productInfo.opts.annualIncome.items || [], 'name', serInfo.annualIncome, 'value');
    var payment_2 = kylUtil.getValueFromList(
        productInfo.opts.certiNum.items || [], 'name', serInfo.certiNum, 'value');
    pay = Math.min(payment_1, payment_2) || 0;
  }

  if (!pay) {
    throw new Meteor.Error('内部数据错误: 1002');
  }
  pay = pay * serInfo.period;

  var info = {
    name: serInfo.name,
    label: productInfo.label,
    zhDes: zhDes,
    money: pay,
    scale: 1,
    period: serInfo.period,
    servicesContains: [{
    }]
  };

  if (serInfo.annualIncome && serInfo.certiNum) {
    info.annualIncome = serInfo.annualIncome;
    info.certiNum = serInfo.certiNum;

    var annualIncomeName = productInfo.opts.annualIncome.label;
    var certiNumName = productInfo.opts.certiNum.label;

    var annualIncomeLabel = kylUtil.getValueFromList(productInfo.opts.annualIncome.items, 'name', serInfo.annualIncome, 'label');
    var certiNumLabel = kylUtil.getValueFromList(productInfo.opts.certiNum.items, 'name', serInfo.certiNum, 'label');

    info.zhDes = info.zhDes + '-' + annualIncomeName + ':' + annualIncomeLabel
                + '-' + certiNumName + ':' + certiNumLabel;
  }

  return {
    moneyAmount: pay,
    servicesNameList: [info]
  };
}

// 银行开户
function handleBank(serInfo) {
  var info = BankLists.findOne({bank: serInfo.bank});
  if (!info) {
    throw new Meteor.Error("内部数据错误");
  }

  var pay = info.payment || 0;
  return {
    moneyAmount: pay,
    servicesNameList: [{
      name: serInfo.name,
      money: pay,
      scale: 1,
      bank: info.bank,
      servicesContains: [{
        name: info.baseService
      }]
    }]
  };
}

// 特别产品
function handleSpecial(serInfo) {
    var info = SpecialProduct.findOne({name: serInfo.name});
    if (!info) {
        throw new Meteor.Error("内部数据错误");
    }

    var pay = info.payment || 0;
    return {
        moneyAmount: pay,
        servicesNameList: [{
            name: serInfo.name,
            subType: info.subType,
            money: pay,
            scale: 1,
            servicesContains: [],
        }]
    };
}

// 许可证
function handlePermit(serInfo) {
  var info = PermitProduct.findOne({name: serInfo.name});
  if (!info) {
    throw new Meteor.Error("内部数据错误");
  }


  function getPay() {
    var payment = 0;
    var services = info.services;
    services.forEach(function (service) {
        if (service.zone == serInfo.zone) {
            payment = service.payment;
        }
    });

    if (!payment) {
      throw new Meteor.Error('内部数据错误: 1002');
    }

    return payment;
  }

  var pay = getPay() || 0;
  return {
    moneyAmount: pay,
    servicesNameList: [{
      name: serInfo.name, //"互联网公司", // 当前订单具体内容
      label: info.label,
      money: pay,          //当前订单价格
      scale: 1,                 // 购买数量
      zone: serInfo.zone,
      message: '',
      servicesContains: [{}]
    }]
  };
}


// 公司变更
function handleCompanyCha (serInfo) {
    var info = CompanyChange.findOne({name: serInfo.name});
    if (!info) {
        throw new Meteor.Error("内部数据错误");
    }

    var pay = info.payment || 0;
    return {
        moneyAmount: pay,
        servicesNameList: [{
            name: serInfo.name,
            money: pay,
            scale: 1,
            servicesContains: [],
        }]
    };
}

// // 社保数据处理
// function handleAssurance(serInfo) {

// 	var info = AssuranceLists.findOne({name: serInfo.server, periodName: serInfo.periodName});
// 	if (!info) {
// 		throw new Meteor.Error("内部数据错误");
// 	}

// 	var pay = info.payment * serInfo.num;

// 	var ret = {
// 		moneyAmount: pay,
// 		servicesNameList: [{
// 			name: serInfo.name,
// 			money: pay,
// 			scale: serInfo.num,
// 			server: info.name,
// 			servicesContains: [{
// 			}]
// 		}],
// 	};

// 	if (info.periodName) {
// 		ret.servicesNameList[0].periodName = info.periodName;
// 		ret.servicesNameList[0].period = info.period || 0;
// 	}

// 	return ret;
// }

// // 流量记账包
// function handleBookkeeping (serInfo) {
// 	var info = BookkeepingLists.findOne({
// 		"bookkeepingTypeName": serInfo.serverType,
// 		"lists.name": serInfo.server
// 	});
// 	if (!info) {
// 		throw new Meteor.Error("内部数据错误");
// 	}


// 	var list = info.lists || [];
// 	var pay = 0;
// 	var description = "";
// 	list.forEach(function (item) {
// 		if (item.name == serInfo.server) {
// 			pay = item.payment;
// 			description = item.description;
// 		}
// 	});

// 	return {
// 		moneyAmount: pay,
// 		servicesNameList: [{
// 			name: serInfo.name,
// 			money: pay,
// 			scale: 1,
// 			serverType: serInfo.serverType,
// 			server: serInfo.server,
// 			servicesContains: [{
// 				name: description
// 			}]
// 		}]
// 	};
// }

// // 商标注册
// function handleTrademark(serInfo) {
//     var info = TradeMark.findOne({name: serInfo.name});
//     if (!info) {
//         throw new Meteor.Error("内部数据错误");
//     }

//     var pay = info.payment || 0;
//     console.log("trademark", {
//         moneyAmount: pay,
//         servicesNameList: [{
//             name: serInfo.name,
//             money: pay,
//             scale: 1,
//             other: info.other,
//             servicesContains:[],
//         }]
//     });
//     return {
//         moneyAmount: pay,
//         subType: info.subType,
//         servicesNameList: [{
//             name: serInfo.name,
//             money: pay,
//             scale: 1,
//             other: info.other,
//             servicesContains:[],
//         }]
//     };
// }



