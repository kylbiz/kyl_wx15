
Template.orderList.helpers({
	orders: function () {
		// console.log('orders', Orders.find({}).fetch());
		return CommFunc.getOrderInfo();
	},
	// uploadInfo: function (orderId) {
	// 	return !judgeRegInfo(orderId);
	// }
});


Template.orderList.events({
	"click #submitSrcBtn": function (event) {
		var orderId = $(event.currentTarget).val();
		if (orderId) {
			delete Session.keys.industryBig;
			delete Session.keys.industrySmall;
			delete Session.keys.businessScope;
			delete Session.keys.businessBig;
			delete Session.keys.businessSmall;

			// Session.set("industryBig", null);
			// Session.set("industrySmall", null);
			// Session.set("businessScope", null);
			Router.go('companyInfo', {}, { query: 'orderid=' + orderId });
		}
	},
	'click #goToPay': function (event) {
		var orderId = $(event.currentTarget).val() || "";
		if (orderId) {
			var orderInfo = Orders.findOne({orderId: orderId});
			if (orderInfo && !orderInfo.payed) {
				console.log("goToPay", orderId);
				// Router.go("trade", {}, {query: "orderid=" + orderId});
				window.location.href = '/weixinpay/?orderid=' + orderId ;
				return;
			}
		}

		kylUtil.alert("警告", "订单信息非法!");
	}
});


// 判断注册公司的产品的信息是否完整 !!!废弃
// function judgeRegInfo (orderId) {

// 	var info = Orders.findOne({orderId: orderId}) || {};
// 	// 只有公司注册需要填写资料
// 	if (info.typeNameFlag != "registration") {
// 		return true;
// 	}

// 	// 企业字号与性质
// 	var haveName = info.companyName && (info.companyName.mainName);
// 	// 行业与经营范围
// 	var industry = info.industryBig && info.industrySmall;
// 	var scope = info.businessScope && (info.businessScope.length > 0);
// 	// 注册资金与股东
// 	var money = info.companyMoney;
// 	var holders = info.holders && (info.holders.length > 0);
// 	// 法人与监事信息
// 	var legalPerson = info.legalPerson;
// 	var supervisor = info.supervisor;
// 	// 负责人信息
// 	var liaisons = info.contractor && info.contractor.liaisons;
// 	var financialStaff = info.contractor && info.contractor.financialStaff;
// 	// 资料对接人
// 	var consigner = info.consigner;

// 	if (haveName && industry && scope && money && holders && legalPerson
// 		&& supervisor && liaisons && financialStaff && consigner) {
// 		return true;
// 	}

// 	return false;
// }


