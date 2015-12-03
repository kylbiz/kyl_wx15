Template.orderProcess.helpers({
	processList: function () {
		return [
			{name: "提交资料", data: this},
			{name: "核名", data: this},
			{name: "工商材料股东签字确认", data: this},
			{name: "工商登记", data: this},
			{name: "领取企业信用代码证", data: this},
		];
	},
	doing: function (index) {
		var status = this.data.productProgress.status || 0;
		return status >= index;
	},
	updateTime: function (index) {
		var updateTimes = this.data.productProgress.updateTimes || [];
		var updateTime = updateTimes[index] || false;
		if (updateTime) {
			return moment(updateTime).format("YYYY-MM-DD") || "";
		}

		return "";
	}
});