Meteor.methods({
	shopcartAdd: function( serInfo ) {
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
    	assurance: handleAssurance,
    	finance: handleFinance,
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
        'assurance': '社保代理',
        'bookkeeping': '流量记账包服务套餐',
        'bank': '银行开户',
    };

	return {
	    userId: Meteor.userId(),
	    // relationId: kylUtil.genOrderId(),     //  关联产品id 暂不使用
	    productType: productTypeNames[serInfo.type],
	    typeNameFlag: serInfo.type,
	    payed: false,
	    canceled: false,
	    finished: false,
	    host: 'KYLWX', //来源
	    createTime: new Date(),
	};
}


// 公司注册数据处理
function handleRegist(serInfo) {
	var info = RegistrationLists.findOne({name: serInfo.name});
	if (!info) {
		throw new Meteor.Error("内部数据错误");
	}

    function getPay() {
    	if (!info) {
    		throw new Meteor.Error('add shopcart fail', 'Error : Product Not found');
    	}

        var payment = 0;
        var services = info.services;
        services.forEach(function (service) {
            if (service.zone == serInfo.zone) {
                payment = service.payment;
            }
        });

        if (!payment) {
        	throw new Meteor.Error('add shopcart fail', 'Error : Params Illegal');
        }

 		return payment;
    }

    var pay = getPay();

	return {
	    moneyAmount: pay,
	    servicesNameList: [{
	    	name:  serInfo.name + '[' + serInfo.zone + ']', //"互联网公司[杨浦]", // 当前订单具体内容
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
	            status: 0
	    }
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

// 财务代理
function handleFinance (serInfo) {
	var info = FinanceLists.findOne({
			"financeTypeName": serInfo.serverType, 
			"serviceTypeName": serInfo.server,
			"lists.period": serInfo.period
		});
	if (!info) {
		throw new Meteor.Error("内部数据错误");
	}

	var list = info.lists || [];
	var pay = 0;
	list.forEach(function (item) {
		if (item.name == serInfo.server && item.period == serInfo.period) {
			pay = item.payment;
		}
	});

	return {
		moneyAmount: pay,
		servicesNameList: [{
			name: serInfo.name,
			scale: 1,
			serverType: serInfo.serverType,
			period: serInfo.period,
			servicesContains: [{
			}]
		}]
	}

}


