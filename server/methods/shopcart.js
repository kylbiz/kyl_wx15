Meteor.methods({
	shopcartAdd: function( serInfo ) {
    console.log("shopcartAdd get serInfo", serInfo);
		var shopcartInfo = getShopcartInfo(serInfo);
    console.log("shopcartInfo", shopcartInfo);
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
        // 'assurance': '社保代理',
        // 'bookkeeping': '流量记账包服务套餐',
        // 'trademark': '商标注册',
    };

	return {
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

	return {
    moneyAmount: pay,
    servicesNameList: [{
    	name: serInfo.name, //"互联网公司", // 当前订单具体内容
      label: info.label,
      money: pay,          //当前订单价格
      scale: 1,                 // 购买数量
      zone: serInfo.zone,
      servicesContains: [      // 订单中包含，也就是详细信息
        {
            name: info.baseService || "'新版营业执照、新版营业执照副本、公司章、法人章、财务章'",
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
  var info = FinanceAgent.findOne({name: serInfo.name, 'period.items.value': serInfo.period});
  if (!info) {
    throw new Meteor.Error("内部数据错误: 1001");
  }

  var pay = 0;
  if (info.payment) {
    pay = info.payment;
  } else {
    var info = FinanceAgent.findOne({
      'name': serInfo.name,
      'opts.annualIncome.items.name': serInfo.annualIncome,
      'opts.certiNum.items.name': serInfo.certiNum,
    });

    if (!info) {
      throw new Meteor.Error("内部数据错误: 1001");
    }

    var payment_1 = kylUtil.getValueFromList(
        info.opts.annualIncome.items || [], 'name', serInfo.annualIncome, 'value');
    var payment_2 = kylUtil.getValueFromList(
        info.opts.certiNum.items || [], 'name', serInfo.certiNum, 'value');
    var payment = Math.min(payment_1, payment_2) || 0;
    pay = payment * serInfo.period;
  }

  if (!pay) {
    throw new Meteor.Error('内部数据错误: 1002');
  }

  var info = {
    name: serInfo.name,
    label: info.label,
    money: pay,
    scale: 1,
    period: serInfo.period,
    servicesContains: [{
    }]
  };

  if (serInfo.annualIncome && serInfo.certiNum) {
    info.annualIncome = serInfo.annualIncome;
    info.certiNum = serInfo.certiNum;
  }

  return {
    moneyAmount: pay,
    servicesNameList: [info]
  };
}


// 社保数据处理
function handleAssurance(serInfo) {

	var info = AssuranceLists.findOne({name: serInfo.server, periodName: serInfo.periodName});
	if (!info) {
		throw new Meteor.Error("内部数据错误");
	}

	var pay = info.payment * serInfo.num;

	var ret = {
		moneyAmount: pay,
		servicesNameList: [{
			name: serInfo.name,
			money: pay,
			scale: serInfo.num,
			server: info.name,
			servicesContains: [{
			}]
		}],
	};

	if (info.periodName) {
		ret.servicesNameList[0].periodName = info.periodName;
		ret.servicesNameList[0].period = info.period || 0;
	}

	return ret;
}

// 流量记账包
function handleBookkeeping (serInfo) {
	var info = BookkeepingLists.findOne({
		"bookkeepingTypeName": serInfo.serverType,
		"lists.name": serInfo.server
	});
	if (!info) {
		throw new Meteor.Error("内部数据错误");
	}


	var list = info.lists || [];
	var pay = 0;
	var description = "";
	list.forEach(function (item) {
		if (item.name == serInfo.server) {
			pay = item.payment;
			description = item.description;
		}
	});

	return {
		moneyAmount: pay,
		servicesNameList: [{
			name: serInfo.name,
			money: pay,
			scale: 1,
			serverType: serInfo.serverType,
			server: serInfo.server,
			servicesContains: [{
				name: description
			}]
		}]
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

// 商标注册
function handleTrademark(serInfo) {
    var info = TradeMark.findOne({name: serInfo.name});
    if (!info) {
        throw new Meteor.Error("内部数据错误");
    }

    var pay = info.payment || 0;
    console.log("trademark", {
        moneyAmount: pay,
        servicesNameList: [{
            name: serInfo.name,
            money: pay,
            scale: 1,
            other: info.other,
            servicesContains:[],
        }]
    });
    return {
        moneyAmount: pay,
        subType: info.subType,
        servicesNameList: [{
            name: serInfo.name,
            money: pay,
            scale: 1,
            other: info.other,
            servicesContains:[],
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


