Template.orderDetail.helpers({
	isRegComp: function () {
		return Orders.findOne().typeNameFlag == "registration";
	},
	payList: function () {
		return CommFunc.getOrderInfo();
	},
	payedTimStr: function () {
		return moment(this.payedTime).format("YYYY-MM-DD HH:mm:ss");
	},
	lastStatus: function (isRegComp) {
		if (isRegComp) {
			var statusStr = ['提交资料中', '核名中', '工商材料股东签字确认中', '工商登记中', '领取企业信用代码证']
			var status = this.productProgress.status || 0;
			return statusStr[status] || "未知";
		}
	},
	_img: function (name) {
		return kylUtil.getImg(name);
	},
	lastUpdateTime: function (isRegComp) {
		if (isRegComp) {
			var updateTimes = this.productProgress.updateTimes || [];
			var status = this.productProgress.status || 0;
			var updateTime = updateTimes[status];

			if (!updateTime) {
				return "未知";
			}
			return moment(updateTime).format("YYYY-MM-DD HH:mm:ss");
		}
	}	
});