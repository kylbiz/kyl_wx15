
Template.orderList.helpers({
	orders: function () {
		console.log('orders', Orders.find({}).fetch());
		return CommFunc.getOrderInfo();
	},
	uploadInfo: function (orderId) {
		return !judgeRegInfo(orderId);
	}
});


// 判断注册公司的产品的信息是否完整
function judgeRegInfo (orderId) {
	
	var info = Orders.findOne({orderId: orderId}) || {};
	// 只有公司注册需要填写资料
	if (info.typeNameFlag != "registration") {
		return true;
	}

	// 企业字号与性质
	var haveName = info.companyName && (info.companyName.mainName);
	// 行业与经营范围
	var industry = info.industryBig && info.industrySmall;
	var scope = info.businessScope && (info.businessScope.length > 0);
	// 注册资金与股东
	var money = info.companyMoney;
	var holders = info.holders && (info.holders.length > 0);
	// 法人与监事信息
	var legalPerson = info.legalPerson;
	var supervisor = info.supervisor;
	// 负责人信息
	var liaisons = info.contractor && info.contractor.liaisons;
	var financialStaff = info.contractor && info.contractor.financialStaff;
	// 资料对接人
	var consigner = info.consigner;

	if (haveName && industry && scope && money && holders && legalPerson 
		&& supervisor && liaisons && financialStaff && consigner) {
		return true;
	}

	return false;
}


// {
// 	"_id": "jRE3CahXec8GwHwmC",
// 	"userId": "RwBfyp2Q943c4Abyq",
// 	"productType": "公司注册",
// 	"typeNameFlag": "registration",
// 	"moneyAmount": 1,
// 	"servicesNameList": [{
// 		"name": "1元注册[嘉定]",
// 		"money": null,
// 		"scale": 1,
// 		"zone": "嘉定",
// 		"servicesContains": [{
// 			"name": "新版营业执照、新版营业执照副本、公司章、法人章、财务章"
// 		}]
// 	}],
// 	"payed": true,
// 	"canceled": false,
// 	"finished": false,
// 	"host": "KYLWX",
// 	"createTime": ISODate("2015-11-27T03:04:31.460Z"),
// 	"productProgress": {
// 		"status": 0
// 	},
// 	"openid": "201511271104266797411",
// 	"payedTime": ISODate("2015-11-27T03:04:31.451Z"),
// 	"cartId": "o9W35gX3aMv4aJmNG",
// 	"orderId": "201511271104314602194"
// }

