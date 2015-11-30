Meteor.methods({
	shopcartAdd: function( serInfo ) {
		console.log('shopcartAdd', serInfo);

		var type = serInfo.type;
	    var handles = {
	    	registration: handleRegist,
	    };
	    var prePayInfo = handles[type](serInfo);

	    console.log("prePayInfo", prePayInfo);

		return ShopCart.insert(prePayInfo);
		// return true;
	},

	shopcartDel: function ( id ) {
		// var relationId = ShopCart.findOne({_id: id}).relationId;
		return ShopCart.remove({userId: Meteor.userId(), _id: id});
	}
});


// 公司注册数据处理
function handleRegist(serInfo) {
	productTypeNames = {
        'registration': '公司注册',
        'finance': '财务代理',
        'assurance': '社保代理',
        'bookkeeping': '流量记账包服务套餐',
        'bank': '银行开户',
    };


	var info = RegistrationLists.findOne({name: serInfo.name});

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


	return {
	    userId: Meteor.userId(),
	    // relationId: kylUtil.genOrderId(),     //  关联产品id 暂不使用
	    productType: productTypeNames[serInfo.type],
	    typeNameFlag: serInfo.type,
	    moneyAmount: getPay(),
	    servicesNameList: [{
	    	name:  serInfo.name + '[' + serInfo.zone + ']', //"互联网公司[杨浦]", // 当前订单具体内容
            money: serInfo.pay,          //当前订单价格
            scale: 1,                 // 购买数量 
            zone: serInfo.zone,
            servicesContains: [      // 订单中包含，也就是详细信息
                {
                    name: info.baseService || "'新版营业执照、新版营业执照副本、公司章、法人章、财务章'",
                }
            ]
	    }],
	    payed: false,
	    canceled: false,
	    finished: false,
	    host: 'KYLWX', //来源,
	    createTime: new Date(),
	    productProgress: {  // 公司注册需要该字段说明进度
	            status: 0
	    }
	};
}


